import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const capabilities: any = {
  tools: {
    "do-arjun": { description: "Run Arjun to discover hidden HTTP parameters" },
  },
};

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "do-arjun",
      "Run Arjun to discover hidden HTTP parameters",
      {
        url: z.string().url().describe("Target URL to scan for hidden parameters"),
        textFile: z.string().optional().describe("Path to file containing multiple URLs"),
        wordlist: z.string().optional().describe("Path to custom wordlist"),
        method: z.enum(["GET", "POST", "JSON", "HEADERS"]).optional().describe("HTTP method"),
        rateLimit: z.number().optional().describe("Requests per second"),
        chunkSize: z.number().optional().describe("Chunk size for parameters"),
      },
      async ({ url, textFile, wordlist, method, rateLimit, chunkSize }) => {
        const args: string[] = [];
        if (url) args.push("-u", url);
        if (textFile) args.push("-f", textFile);
        if (wordlist) args.push("-w", wordlist);
        if (method) args.push("-m", method);
        if (rateLimit !== undefined) args.push("--rate-limit", String(rateLimit));
        if (chunkSize !== undefined) args.push("--chunk-size", String(chunkSize));
        const command = `arjun ${args.join(" ")}`.trim();
        return {
          content: [
            {
              type: "text",
              text: `Run this locally where Arjun is installed:\n${command}`,
            },
          ],
        };
      }
    );
  },
  { capabilities },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

// CRITICAL: use named exports for Next.js App Router
export { handler as GET, handler as POST, handler as DELETE };
