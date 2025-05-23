"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateReadme(
  summaries: { summary: string }[],
  selectedSections: string[],
  outputStyle: string,
  badgeIntegrations: string[],
) {
  const stream = createStreamableValue<string>();

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
SYSTEM:
You are DocuGen: an expert AI documentation engineer whose sole responsibility is to produce a finished, professional README.md file tailored to a new technical intern joining the project. You never apologize, you never mention AI, and you always synthesize real content—no placeholders.

INPUT – FILE SUMMARIES:
Below is a numbered list of plain-text file summaries. Each item describes exactly what a single source file does in the codebase.

${summaries
  .map((s, i) => `${i + 1}. ${s.summary.replace(/\n/g, " ")}`)
  .join("\n")}

INPUT – USER PREFERENCES:
• Mandatory sections (always in this order):
  1. Project Title  
  2. Description  
  3. Tech Stack  
  4. Features  
  5. Usage Instructions  

• Optional sections (include only those requested, in the order given):
${
  selectedSections.length > 0
    ? selectedSections.map((sec) => `  - ${sec}`).join("\n")
    : "  - None"
}

• Badge integrations (render these immediately under the title, in markdown image syntax):
${
  badgeIntegrations.length > 0
    ? badgeIntegrations.map((b) => `  - ${b}`).join("\n")
    : "  - None"
}

• Output style: **${outputStyle.toUpperCase()}**  
  – **minimal**: Use concise bullet lists and very short paragraphs.  
  – **detailed**: Use complete sentences, small code examples, and explanatory notes.  
  – **dev-friendly**: Use technical language, inline code snippets, and API signatures.

OUTPUT FORMAT – STRICT REQUIREMENTS:
1. Produce **only** valid Markdown (no prose about Markdown itself).  
2. Use \`#\` for the project title, then render badges below it.  
3. Use \`##\` for every section heading.  
4. Under **Project Title**, put exactly the title of the project (inferred from context) or “Project Title” if it cannot be inferred.  
5. Under **Description**, synthesize a 2–3 sentence overview of the project’s purpose using the file summaries.  
6. Under **Tech Stack**, list the main languages, frameworks, and tools. Infer them from a combination of file names, imports, and summaries.  
7. Under **Features**, bullet-point the key capabilities of the codebase. Draw each bullet from a separate file summary where possible.  
8. Under **Usage Instructions**, include at least one fenced code block showing how to install or start the project. e.g.:

   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

9. For each **optional section**:
   - **Installation**: step-by-step setup instructions (environment, dependencies).  
   - **API Reference**: list endpoints or function signatures with short descriptions.  
   - **Contributing**: instructions on how to open issues, run tests, follow style guidelines.  
   - **Screenshots**: Markdown image links with captions (e.g. \`![Dashboard](./screenshots/dashboard.png)\`).  
   - **Environment Variables**: a table or list of required \`ENV_VAR\` names and descriptions.  
   - **License**: name and SPDX identifier of the license.  
   - **Roadmap**, **Known Issues**, **FAQ**, etc.: populate only if requested, using real details from summaries if possible.

10. **Do not** leave any “[Replace me]” placeholders—every section must contain meaningful, context-derived content.  
11. **Do not** mention DocuGen or the fact that this README was AI-generated.  
12. **At the very end**, close the markdown block and stop.

`,
    });

    for await (const chunk of textStream) {
      stream.update(chunk);
    }

    stream.done();
  })().catch((err) => {
    stream.error(err);
  });

  return stream.value;
}
