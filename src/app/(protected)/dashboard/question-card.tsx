"use client";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import { Shapes } from "lucide-react";
import React, { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";
import CodeReferences from "./code-references";
import { MoonLoader } from "react-spinners";

const QuestionCard: React.FC = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [fileReferences, setFileReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project?.id) {
      setError("Project not found. Please select a project.");
      return;
    }

    setError(null);
    setAnswer("");
    setFileReferences([]);
    setLoading(true);
    setOpen(true);

    try {
      const { output, filesReferences } = await askQuestion(
        question,
        project.id,
      );
      setFileReferences(filesReferences);

      for await (const delta of readStreamableValue(output)) {
        if (delta) setAnswer((prev) => prev + delta);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setError(null);
        }}
      >
        <DialogContent className="flex h-full flex-col bg-white p-6 sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              <Shapes />
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="mb-4 rounded bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-1 gap-4 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                <MoonLoader color="#8E51FF" />
              </div>
            )}
            <div className="relative flex-[1] overflow-auto rounded-md bg-white p-4">
              <MDEditor.Markdown
                source={answer}
                className="prose max-w-none"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            {/* Code references */}
            <div className="flex-[1] overflow-auto">
              <CodeReferences fileReferences={fileReferences} />
            </div>
          </div>

          <Button
            className="mt-2 cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-2 rounded bg-red-50 p-2 text-red-700">
              {error}
            </div>
          )}
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the homepage"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Asking..." : "Ask Nebulo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;
