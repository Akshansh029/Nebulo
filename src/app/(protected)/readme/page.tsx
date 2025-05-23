"use client";
import { Input } from "@/components/ui/input";
import { readStreamableValue } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, Download } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { generateReadme } from "./actions";
import { toast } from "sonner";
import React from "react";
import ReadmeViewer from "./readme-viewer";
import useRefetch from "@/hooks/use-refetch";

const ReadmePage = () => {
  const [markdown, setMarkdown] = useState(
    "# Project Title\n\n## Description\n\n## Tech Stack\n\n## Features\n\n## Usage\n",
  );
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [outputStyle, setOutputStyle] = useState("minimal");
  const [badgeInt, setBadgeInt] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);

  const { projectId } = useProject();
  const { data: summaries } = api.project.getSummaries.useQuery({ projectId });

  // Creating array of badge strings
  const badgeIntegration: string[] = badgeInt.split(",").map((s) => s.trim());
  console.log(selectedSections);

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

  // .md file download func
  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Readme generation
  async function fetchReadme() {
    setLoading(true);

    try {
      const stream = await generateReadme(
        summaries!,
        selectedSections,
        outputStyle,
        badgeIntegration,
      );

      let output = "";
      try {
        for await (const chunk of readStreamableValue(stream)) {
          output += chunk;
        }
        setMarkdown(output);
        setSave(true);
        toast.success("README generated successfully!");
      } catch (streamErr) {
        console.error("Error while streaming README:", streamErr);
        toast.error("⚠️ Error streaming the README output.");
      }
    } catch (err) {
      console.error("Error generating README:", err);
      toast.error("❌ Failed to generate README. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const refetch = useRefetch();

  // Save readme func
  const readme = api.project.saveReadme.useMutation();
  const saveReadme = async () => {
    readme.mutate(
      {
        projectId: projectId,
        readme: markdown,
      },
      {
        onSuccess: () => {
          toast.success("Readme saved");
          refetch();
        },
        onError: () => {
          toast.error("Failed to save Readme");
        },
      },
    );
  };

  return (
    <main className="space-y-6 p-2">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <h1 className="text-2xl font-bold">README Generator</h1>
      </div>
      {/* Customization options */}
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
                "API Reference",
                "Contributing",
                "Screenshots",
                "Future Improvements",
                "Known Issues",
                "FAQ",
                "Acknowledgements",
                "License",
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
            <Input
              placeholder="e.g. GitHub stars, license, CI status badge"
              className="mt-2"
              value={badgeInt}
              onChange={(e) => setBadgeInt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">3. Select Output Style</label>
            <Select value={outputStyle} onValueChange={setOutputStyle}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="dev-friendly">Dev-friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="default"
            className="cursor-pointer"
            onClick={fetchReadme}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate README"}
          </Button>
        </CardContent>
      </Card>
      {/* Markdown Editor component */}
      <div className="flex flex-col gap-4 bg-white p-2">
        <h1 className="text-xl font-semibold text-black">Preview</h1>
        <MDEditor
          value={markdown}
          onChange={(value) => setMarkdown(value || "")}
          height={500}
          className="rounded-md"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        />
      </div>

      {/* Copy and download button */}
      <div className="flex gap-2">
        <Button onClick={copyToClipboard} variant="outline">
          <Copy className="mr-1 h-4 w-4" /> {copied ? "Copied!" : "Copy"}
        </Button>
        <Button onClick={downloadMarkdown} variant="outline">
          <Download className="mr-1 h-4 w-4" /> Export .md
        </Button>
        {markdown && (
          <Button
            onClick={saveReadme}
            disabled={!save || readme.isPending}
            variant="default"
            className="cursor-pointer"
          >
            {readme.isPending ? "Saving" : "Save Readme"}
          </Button>
        )}
      </div>
      <ReadmeViewer />
    </main>
  );
};

export default ReadmePage;
