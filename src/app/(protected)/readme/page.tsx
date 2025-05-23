"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, Download } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

const ReadmePage = () => {
  const [markdown, setMarkdown] = useState(
    "# Project Title\n\n## Description\n\n## Tech Stack\n\n## Features\n\n## Usage\n",
  );
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "Project title",
    "Description",
    "Tech stack",
    "Features",
    "Usage instructions",
  ]);
  const [copied, setCopied] = useState(false);

  const toggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-6 p-2">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <h1 className="text-2xl font-bold">README Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customization Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="">
            <label className="font-medium">1. Optional Sections</label>
            <div className="mt-2 space-y-2">
              {[
                "Installation",
                "Usage",
                "API Reference",
                "Contributing",
                "Screenshots",
              ].map((section) => (
                <div key={section} className="flex items-center space-x-2">
                  <Checkbox
                    id={section}
                    checked={selectedSections.includes(section)}
                    onCheckedChange={() => toggleSection(section)}
                  />
                  <label htmlFor={section}>{section}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium">2. Badge Integrations</label>
            <Input placeholder="e.g. GitHub stars, license, CI status badge" />
          </div>

          <Button variant="default" className="cursor-pointer">
            Generate README
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 bg-white p-2">
        <h1 className="text-xl font-semibold text-black">Preview</h1>
        <MDEditor
          value={markdown}
          onChange={(value) => setMarkdown(value || "")}
          height={400}
          className="rounded-md"
          style={{
            //       backgroundColor: "#f9fafb",
            //       border: "1px solid #e5e7eb",
            //       borderRadius: "0.5rem",
            //       padding: "1rem",
            fontFamily: "Inter, sans-serif",
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={copyToClipboard} variant="outline">
          <Copy className="mr-1 h-4 w-4" /> {copied ? "Copied!" : "Copy"}
        </Button>
        <Button onClick={downloadMarkdown} variant="outline">
          <Download className="mr-1 h-4 w-4" /> Export .md
        </Button>
      </div>
    </main>
  );
};

export default ReadmePage;
