"use client";
import { PacmanLoader } from "react-spinners";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits, isPending } = api.project.getCommits.useQuery({
    projectId,
  });

  return (
    <div>
      {isPending ? (
        <p>
          <PacmanLoader color="#8E51FF" />
        </p>
      ) : (
        <ul className="space-y-6">
          {commits?.map((commit, idx) => {
            const isLast = idx === commits.length - 1;
            return (
              <li key={idx} className="relative flex gap-x-4">
                {/* Vertical rail */}
                <div
                  className={cn(
                    isLast ? "h-6" : "h-full",
                    "absolute top-6 left-3 flex justify-center",
                  )}
                >
                  <div className="w-1 translate-x-1 bg-gray-200" />
                </div>

                {/* Avatar */}
                <img
                  src={commit.commitAuthorAvatar}
                  alt="avatar"
                  className="relative mt-4 h-9 w-9 flex-none rounded-full bg-gray-50"
                />

                {/* Commit bubble */}
                <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
                  <div className="flex justify-between gap-x-4">
                    <Link
                      target="_blank"
                      href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                      className="flex items-center py-0.5 text-xs leading-5 text-gray-500"
                    >
                      <span className="font-medium text-gray-700">
                        <span className="font-bold">
                          {commit.commitAuthorName}
                        </span>{" "}
                        committed
                      </span>
                      <ExternalLink className="ml-1 size-4" />
                    </Link>
                  </div>
                  <span className="font-semibold">{commit.commitMessage}</span>
                  <pre className="mt-3 text-sm leading-6 whitespace-pre-wrap">
                    {commit.summary === ""
                      ? `No summary returned for commit ${commit.commitHash}`
                      : commit.summary}
                    {/* {JSON.stringify(commit, null, 2)} */}
                  </pre>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CommitLog;
