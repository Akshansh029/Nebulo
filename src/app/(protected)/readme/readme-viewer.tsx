"use client";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MoonLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";

const ReadmeViewer = () => {
  // Query readme func
  const [readmeIndex, setReadmeIndex] = useState(0);
  const { data: readmes = [], isPending } = api.project.getReadme.useQuery();
  const readmeFile = readmes?.[readmeIndex];

  return (
    <>
      {readmes?.length > 0 && (
        <div className="mt-8 w-full">
          <h1 className="text-xl font-semibold">Saved READMEs</h1>
          <Sheet>
            {isPending ? (
              <div className="mt-6 flex w-full justify-center">
                <MoonLoader color="#8E51FF" size={50} />
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {readmes?.map((readme, index) => {
                  return (
                    <React.Fragment key={index}>
                      <SheetTrigger onClick={() => setReadmeIndex(index)}>
                        <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow">
                          <img
                            src={readme.user.imageUrl ?? " "}
                            alt="Avatar"
                            className="h-12 w-12 rounded-full"
                          />
                          <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <p className="line-clamp-1 text-sm font-medium text-gray-900">
                                {"Readme-" +
                                  readme.createdAt.toLocaleDateString()}
                              </p>
                              <span className="text-xs whitespace-nowrap text-gray-400">
                                {readme.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </SheetTrigger>
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            <SheetContent className="gap-0 px-4 sm:max-w-[70vw]">
              <SheetHeader>
                <SheetTitle className="text-xl">
                  {"Readme-" + readmeFile?.createdAt.toLocaleTimeString()}
                </SheetTitle>
              </SheetHeader>
              <div className="mb-6 overflow-auto bg-white p-4">
                <MDEditor.Markdown
                  source={readmeFile?.readme}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "0.5rem",
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
};

export default ReadmeViewer;
