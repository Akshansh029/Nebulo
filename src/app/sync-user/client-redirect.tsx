"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = "/dashboard";
  }, [router]);

  return <p>Redirecting to dashboard...</p>;
}
