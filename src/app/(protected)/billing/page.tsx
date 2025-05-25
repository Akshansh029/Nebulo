"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const BillingPage = () => {
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const [loading, setLoading] = useState(false);
  const credits = creditsToBuy[0]!;
  const price = (credits * 1.6).toFixed(2); // ₹1.6 per credit

  const { data: user } = api.project.getCredits.useQuery();

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits }),
      });

      if (!res.ok) {
        const { error } = await res
          .json()
          .catch(() => ({ error: "Invalid JSON" }));
        throw new Error(error);
      }

      const { short_url } = await res.json();
      // Redirect the browser to Razorpay's hosted checkout
      window.location.href = short_url;
    } catch (error: any) {
      console.error("Razorpay error:", error);
      toast.error("Unable to initiate payment: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-accent-foreground text-sm">
          You currently have {user?.credits ?? 0} credits.
        </p>
      </div>

      <div className="rounded-md border border-violet-200 bg-violet-50 px-4 py-2 text-violet-700">
        <div className="flex items-center gap-2">
          <Info className="size-4" />
          <p className="text-sm">Each credit allows you to index 1 file</p>
        </div>
        <p className="text-sm">
          E.g. If your project has 100 files, you will need 100 credits.
        </p>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="flex w-full justify-between">
          <span className="text-muted-foreground text-sm">10 credits</span>
          <span className="text-muted-foreground text-sm">1000 credits</span>
        </div>
        <div className="flex flex-col gap-4">
          <Slider
            defaultValue={[credits]}
            min={10}
            max={1000}
            step={10}
            value={creditsToBuy}
            onValueChange={(v) => setCreditsToBuy(v)}
          />
          <Button
            onClick={handleBuy}
            className="w-fit cursor-pointer"
            disabled={loading}
          >
            {loading
              ? "Redirecting to Razorpay..."
              : `Buy ${credits} credits for ₹${price}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
