"use client";
import useProject from "@/hooks/use-project";
import { ExternalLink, GithubIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import QuestionCard from "./question-card";

const Dashboard = () => {
  const { project } = useProject();
  return (
    <div className="">
      <h1>{project?.id}</h1>
      <div className="flex flex-wrap items-center justify-center gap-y-4">
        <div className="bg-primary flex w-fit rounded-md px-4 py-3">
          <GithubIcon className="size-5 text-white" />
          <div className="ml-2 flex items-center">
            <p className="text-sm font-medium text-white">
              This project is linked to{" "}
              <Link
                className="underline decoration-1 underline-offset-2"
                href={project?.githubUrl! ?? ""}
              >
                {project?.githubUrl}
              </Link>
            </p>
            <ExternalLink className="ml-2 size-4 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="">Team members</span>
          <span className="">Invite button</span>
          <span className="">Archive button</span>
        </div>

        <div className="mt-4 w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <QuestionCard /> Meeting Card
          </div>
        </div>

        <div className="mt-8 text-wrap">
          <CommitLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
