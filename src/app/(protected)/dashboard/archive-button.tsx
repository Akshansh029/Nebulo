"use client";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "sonner";

const ArchiveButton = () => {
  const { projectId } = useProject();
  const archiveProject = api.project.archiveProject.useMutation();

  const refetch = useRefetch();

  return (
    <Button
      disabled={archiveProject.isPending}
      variant="destructive"
      size="sm"
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this project? ",
        );
        if (confirm)
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("Project deleted successfully");
                refetch();
              },
              onError: () => {
                toast.error("Failed to delete project");
              },
            },
          );
      }}
    >
      Delete Project
    </Button>
  );
};

export default ArchiveButton;
