"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import useRefetch from "@/hooks/use-refetch";
import { Info } from "lucide-react";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createTRPCRouter.useMutation();
  const checkCredits = api.project.checkCredits.useMutation({
    onError(error) {
      toast.error(`Could not check credits: ${error.message}`);
    },
  });
  const refetch = useRefetch();

  // Form submit function
  const onSubmit = (data: FormInput) => {
    if (!!checkCredits.data) {
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
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });
    }

    return true;
  };

  const enoughCredits = checkCredits?.data?.userCredits
    ? checkCredits.data.fileCount <= checkCredits.data.userCredits
    : true;

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

              {!!checkCredits.data && (
                <>
                  <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700">
                    <div className="flex items-center gap-2">
                      <Info className="size-4" />
                      <p className="text-sm">
                        You will charged{" "}
                        <strong>
                          {checkCredits.data.fileCount} credits for this
                          repository
                        </strong>
                      </p>
                    </div>
                    <p className="text-sm text-blue-700">
                      You have{" "}
                      <strong>
                        {checkCredits.data.userCredits} credits remaining
                      </strong>
                    </p>
                  </div>
                </>
              )}
              <Button
                type="submit"
                disabled={
                  createProject.isPending ||
                  checkCredits.isPending ||
                  !enoughCredits
                }
                className="cursor-pointer"
              >
                {!!checkCredits.data ? "Create Project" : "Check credit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatePage;
