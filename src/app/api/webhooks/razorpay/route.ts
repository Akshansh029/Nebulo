// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const bodyString = Buffer.from(rawBody).toString("utf8");

  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 400 },
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(bodyString)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(bodyString);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event: eventType, payload } = event;

  try {
    switch (eventType) {
      case "payment_link.paid": {
        const link = payload.payment_link.entity;
        const userId = link.notes.user_id;
        const credits = Number(link.notes.credits);

        if (!userId || !credits) {
          return NextResponse.json(
            { error: "Missing userId or credits" },
            { status: 400 },
          );
        }

        await db.transactions.create({
          data: {
            userId,
            credits,
          },
        });

        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            credits: {
              increment: credits,
            },
          },
        });

        return NextResponse.json({ success: true });
      }

      case "payment_link.expired":
        console.warn(
          "Payment link expired:",
          payload.payment_link.entity.reference_id,
        );
        break;

      case "payment.failed":
        console.error("Payment failed:", payload.payment.entity.id);
        break;

      default:
        console.log("Unhandled webhook event:", eventType);
    }
  } catch (err) {
    console.error("Error handling webhook:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
