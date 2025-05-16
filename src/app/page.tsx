"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold text-indigo-400">Hello World</h1>
      <Button
        className=""
        variant="default"
        onClick={() => {
          console.log("Hello");
        }}
      >
        Log
      </Button>
    </>
  );
}
