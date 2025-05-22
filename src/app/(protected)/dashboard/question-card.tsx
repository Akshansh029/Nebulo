"use client";
import { Button } from "@/components/ui/button";
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
import { createStreamableValue, readStreamableValue } from "ai/rsc";

const QuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [fileReferences, setFileReferenes] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);

    const { output, filesReferences } = await askQuestion(question, project.id);
    setFileReferenes(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-1/2 overflow-scroll">
          <DialogHeader>
            <DialogTitle>
              <Shapes />
            </DialogTitle>
          </DialogHeader>
          <p className="my-2 font-medium text-black">{answer}</p>
          <h1>File References</h1>
          {fileReferences.map((file) => {
            return (
              <span className="bg-primary px-4 py-3 text-white">
                {file.fileName}
              </span>
            );
          })}
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the homepage"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button type="submit" className="cursor-pointer">
              Ask Nebulo
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;
