import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
import pMap from "p-map";
import { Octokit } from "octokit";

// delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getFileCount = async (
  path: string,
  octokit: Octokit,
  githubOwner: string,
  githubRepo: string,
): Promise<number> => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: githubOwner,
      repo: githubRepo,
      path,
    });

    if (!Array.isArray(data) && data.type === "file") {
      return 1;
    }

    if (Array.isArray(data)) {
      let fileCount = 0;
      const dirs: string[] = [];

      for (const item of data) {
        if (item.type === "dir") dirs.push(item.path);
        else fileCount++;
      }

      // recurse into sub-dirs
      const nested = await Promise.all(
        dirs.map((dir) => getFileCount(dir, octokit, githubOwner, githubRepo)),
      );
      return fileCount + nested.reduce((a, b) => a + b, 0);
    }

    return 0;
  } catch (err: any) {
    if (err.status === 404) {
      throw new Error(
        `Repository or path not found: ${githubOwner}/${githubRepo}/${path}`,
      );
    }
    // rethrow with message
    throw new Error(err.message ?? "Failed to fetch repository contents");
  }
};

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  const octokit = new Octokit({ auth: githubToken });
  const githubOwner = githubUrl.split("/")[3];
  const githubRepo = githubUrl.split("/")[4];
  if (!githubOwner || !githubRepo) return 0;

  const fileCount = await getFileCount("", octokit, githubOwner!, githubRepo);
  return fileCount;
};

//  Calls summariseCode(), retrying on 429 with exponential back-off.
export async function safeSummarise(
  doc: Document,
  retries = 3,
): Promise<string> {
  try {
    const result = await summariseCode(doc);
    return result ?? "";
  } catch (err: any) {
    // If we’ve throttled out, wait and retry
    if (retries > 0 && err.status === 429) {
      const backoff = 500 * Math.pow(2, 3 - retries); // 500, 1000, 2000 ms
      console.warn(
        `429 received for ${doc.metadata.source}, retrying in ${backoff}ms…`,
      );
      await delay(backoff);
      return safeSummarise(doc, retries - 1);
    }
    throw err;
  }
}

/**
 * Load only once—ignore non-source files
 */
export async function loadGitHubRepo(githubUrl: string, githubToken?: string) {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN || "",
    branch: "main",
    ignoreFiles: [
      // Package manager lockfiles
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun-lockb",

      // Node modules & builds
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      "out/",
      "coverage/",
      "public/",

      // Git metadata & CI configs
      ".git/",
      ".github/",
      ".gitignore",
      ".gitlab-ci.yml",
      ".github/**",
      "Dockerfile",
      "docker-compose.yml",

      // IDE/editor settings
      ".vscode/",
      ".idea/",

      // Documentation & markdown
      "*.md",
      "docs/",
      "README*",
      "*.rst",

      // Static assets & binaries
      "*.png",
      "*.jpg",
      "*.jpeg",
      "*.gif",
      "*.svg",
      "*.ico",
      "*.webp",
      "*.mp4",
      "*.mp3",
      "*.wav",
      "*.pdf",
      "*.zip",
      "*.tar.gz",
      "*.exe",
      "*.dll",
      "*.so",
      "*.class",
      "*.jar",

      // Logs, temp, and env
      "*.log",
      "*.tmp",
      "*.cache",
      ".env",
      ".env.*",

      // Miscellaneous
      "tsconfig.json",
      "jest.config.js",
      "babel.config.js",
      "webpack.config.js",
      "rollup.config.js",
      "vite.config.ts",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  return loader.load();
}

export function isCodeFile(filename: string) {
  return /\.(js|jsx|ts|tsx|py|rb|go|java|css|html)$/.test(filename);
}

/**
 * Generates summaries & embeddings, but only 2 at a time.
 */
const generateEmbeddings = async (docs: Document[]) => {
  return pMap(
    docs,
    async (doc) => {
      const summary = await safeSummarise(doc);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source,
      };
    },
    { concurrency: 2 },
  );
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken: string,
) => {
  const docs = await loadGitHubRepo(githubUrl, githubToken);
  const codeDocs = docs.filter((doc) => isCodeFile(doc.metadata.source));
  const allEmbeddings = await generateEmbeddings(codeDocs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      console.log(`processing ${index + 1} of ${allEmbeddings.length}`);
      if (!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary!,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbedding"
      SET "summaryEmbedding" = ${embedding.embedding}::vector
      WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};
