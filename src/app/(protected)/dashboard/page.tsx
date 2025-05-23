"use client";
import useProject from "@/hooks/use-project";
import { ExternalLink, GithubIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import QuestionCard from "./question-card";
import MeetingCard from "./meeting";
import { MoonLoader } from "react-spinners";
import ArchiveButton from "./archive-button";
import InviteButton from "./invite-button";

const Dashboard = () => {
  const { project, isPending } = useProject();
  return (
    <div className="">
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
                {isPending ? "Loading..." : project?.githubUrl}
              </Link>
            </p>
            <ExternalLink className="ml-2 size-4 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="">Team members</span>
          <InviteButton />
          <ArchiveButton />
        </div>

        <div className="mt-4 h-fit w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <QuestionCard />
            <MeetingCard />
          </div>
        </div>

        <div className="mt-4 text-wrap">
          <CommitLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
