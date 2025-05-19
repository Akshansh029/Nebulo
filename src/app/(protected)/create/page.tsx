"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import useRefetch from "@/hooks/use-refetch";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createTRPCRouter.useMutation();
  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          refetch();
          reset();
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      },
    );
    return true;
  };

  return (
    <main className="flex h-full items-center justify-center gap-12">
      <img src="/programmer.svg" alt="programmer" className="h-56 w-auto" />
      <div className="">
        <div className="">
          <h1 className="text-2xl font-semibold">
            Link your GitHub repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your repository to link it to{" "}
            <span className="underline-violet-500 underline decoration-violet-500 decoration-2 underline-offset-2">
              Nebulo
            </span>
          </p>
          <div className="h-4"></div>
          <div className="">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <Input
                {...register("projectName", { required: true })}
                placeholder="Project Name"
                required
              />
              <Input
                {...register("repoUrl", { required: true })}
                placeholder="Project URL"
                type="url"
                required
              />
              <Input
                {...register("githubToken", { required: false })}
                placeholder="GitHub Token (Optional)"
              />
              <Button
                type="submit"
                disabled={createProject.isPending}
                className="cursor-pointer"
              >
                Create Project
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatePage;
