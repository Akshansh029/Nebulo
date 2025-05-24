"use client";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import { MoonLoader } from "react-spinners";

const TeamMembers = () => {
  const { projectId } = useProject();
  const { data: members, isPending } = api.project.getTeamMembers.useQuery({
    projectId,
  });
  return (
    <div className="flex items-center gap-2">
      {isPending ? (
        <MoonLoader size={30} color="#8E51FF" />
      ) : (
        members?.map((member) => {
          return (
            <img
              key={member.id}
              src={member.user.imageUrl || ""}
              alt={member.user.firstName || ""}
              className="rounded-full"
              height={32}
              width={32}
            ></img>
          );
        })
      )}
    </div>
  );
};

export default TeamMembers;
