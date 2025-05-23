"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

const MeetingCard = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="col-span-3 flex h-fit flex-col items-center justify-center gap-1 p-6">
      <>
        <FileText className="h-10 w-10 text-gray-600" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          Create README
        </h3>
        <p className="mt-1 text-center text-sm text-gray-500">
          Create a perfect README.md for your project
          <br />
          Powered by AI
        </p>
        <div className="mt-4">
          <Button disabled={isUploading}>Get Started</Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
      </>
    </Card>
  );
};

export default MeetingCard;
