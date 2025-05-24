import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github";
import {
  checkCredits,
  getFileCount,
  indexGithubRepo,
} from "@/lib/github-loader";
import { Octokit } from "octokit";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  createTRPCRouter: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.userId!,
        },
        select: {
          credits: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }

      const userCredits = user?.credits;
      const fileCount = await checkCredits(input.githubUrl, input.githubToken);

      if (userCredits < fileCount) {
        throw new Error("Insufficient credits");
      }

      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          UserToProject: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });

      await indexGithubRepo(project.id, input.githubUrl, input.githubToken!);
      await pullCommits(project.id);
      await ctx.db.user.update({
        where: {
          id: ctx.user.userId!,
        },
        data: {
          credits: {
            decrement: fileCount,
          },
        },
      });
      return project;
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        UserToProject: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
  }),

  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      pullCommits(input.projectId).then().catch(console.error);
      return await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
      });
    }),

  getSummaries: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.sourceCodeEmbedding.findMany({
        where: {
          projectId: input.projectId,
        },
        select: {
          summary: true,
        },
      });
    }),

  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.create({
        data: {
          answer: input.answer,
          filesReferences: input.filesReferences,
          question: input.question,
          projectId: input.projectId,
          userId: ctx.user.userId!,
        },
      });
    }),

  getQuestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  saveReadme: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        readme: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.readme.create({
        data: {
          readme: input.readme,
          projectId: input.projectId,
          userId: ctx.user.userId!,
        },
      });
    }),

  getReadme: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.readme.findMany({
      where: {
        userId: ctx.user.userId!,
      },
      select: {
        readme: true,
        createdAt: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  archiveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),

  getTeamMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.userToProject.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
        },
      });
    }),

  getCredits: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.user.userId!,
      },
      select: {
        credits: true,
      },
    });
  }),

  checkCredits: protectedProcedure
    .input(
      z.object({
        githubUrl: z.string().url(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const parts = input.githubUrl.split("/");
      const githubOwner = parts[3];
      const githubRepo = parts[4];
      if (!githubOwner || !githubRepo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid GitHub URL; expected https://github.com/{owner}/{repo}",
        });
      }

      // prepare octokit
      const octokit = new Octokit({ auth: input.githubToken });

      let fileCount: number;
      try {
        fileCount = await getFileCount("", octokit, githubOwner, githubRepo);
      } catch (err: any) {
        // convert to a user-friendly tRPC error
        throw new TRPCError({
          code: err.message.includes("not found")
            ? "NOT_FOUND"
            : "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }

      // fetch user credits
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.userId! },
        select: { credits: true },
      });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return {
        fileCount,
        userCredits: user.credits,
      };
    }),
});
