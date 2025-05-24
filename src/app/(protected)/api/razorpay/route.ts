import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { credits?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const credits = Number(body.credits);
  if (!credits || credits <= 0) {
    return NextResponse.json(
      { error: "Please pass a valid credits number" },
      { status: 400 },
    );
  }

  const amountPerCreditInPaise = 160; // ₹1.6 × 100
  const amount = credits * amountPerCreditInPaise;
  const ts = Date.now().toString();
  const shortTs = ts.slice(-6); // e.g. "354721"

  try {
    const link = await razorpay.paymentLink.create({
      // upi_link: true,
      amount,
      currency: "INR",
      description: "Nebulo credit purchase",
      notes: {
        userId: userId,
        credits: credits.toString(),
      },
      reference_id: `${userId}_${shortTs}`,
      accept_partial: false,
      customer: {
        name: `UserId: ${userId}`,
      },
      callback_url: `${process.env.APP_URL}/create`,
      callback_method: "get",
      options: {
        checkout: {
          config: {
            display: {
              blocks: {
                banks: {
                  name: "Pay via Card or UPI",
                  instruments: [
                    { method: "upi", banks: [] },
                    { method: "card", banks: [] },
                  ] as any,
                },
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(link);
  } catch (err: any) {
    console.error("Razorpay.create failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
