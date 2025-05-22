"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  fileReferences: { fileName: string; sourceCode: string; summary: string }[];
};

const CodeReferences = ({ fileReferences }: Props) => {
  const [tab, setTab] = useState(fileReferences[0]?.fileName);
  if (fileReferences.length === 0) return null;

  return (
    <div className="flex h-full flex-col rounded-md bg-white">
      <Tabs value={tab} onValueChange={setTab} className="h-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex gap-2 border-b whitespace-nowrap">
            {fileReferences.map((file) => (
              <TabsTrigger
                key={file.fileName}
                value={file.fileName}
                className="data-[state=active]:bg-primary flex-shrink-0 cursor-pointer px-3 py-1 text-gray-500 hover:bg-gray-200 data-[state=active]:border-b-2 data-[state=active]:text-white"
              >
                {file.fileName}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="h-full flex-1 overflow-auto rounded-b-md bg-gray-50 p-4">
          {fileReferences.map((file) => (
            <TabsContent
              key={file.fileName}
              value={file.fileName}
              className="p-0"
            >
              <SyntaxHighlighter
                language="typescript"
                style={dracula}
                wrapLongLines={true}
                customStyle={{
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {file.sourceCode}
              </SyntaxHighlighter>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default CodeReferences;
