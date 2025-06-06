"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import QuestionCard from "../dashboard/question-card";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { MoonLoader } from "react-spinners";

const QAPage = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const { projectId } = useProject();
  const { data: questions, isPending } = api.project.getQuestions.useQuery({
    projectId,
  });
  const question = questions?.[questionIndex];

  return (
    <Sheet>
      <div className="h-fit">
        <QuestionCard />
      </div>
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      {questions?.length === 0 && (
        <div className="text-muted-foreground mt-20 flex w-full items-center justify-center text-lg">
          Oops! You haven't saved any questions
        </div>
      )}
      {isPending ? (
        <div className="mt-6 flex w-full justify-center">
          <MoonLoader color="#8E51FF" size={50} />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {questions?.map((question, index) => {
            return (
              <React.Fragment key={question.id}>
                <SheetTrigger onClick={() => setQuestionIndex(index)}>
                  <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow">
                    <img
                      src={question.user.imageUrl ?? " "}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="line-clamp-1 text-sm font-medium text-gray-900">
                          {question.question}
                        </p>
                        <span className="text-xs whitespace-nowrap text-gray-400">
                          {question.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-left text-xs text-gray-600">
                        {question.answer}
                      </p>
                    </div>
                  </div>
                </SheetTrigger>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {question && (
        <SheetContent className="min-h-[100vh] overflow-y-auto px-4 sm:max-w-[70vw]">
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
          </SheetHeader>
          <div className="overflow-autobg-white">
            <MDEditor.Markdown
              source={question.answer}
              style={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "0.5rem",
              }}
            />
          </div>
          <CodeReferences
            fileReferences={(question.filesReferences ?? []) as any}
          />
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
