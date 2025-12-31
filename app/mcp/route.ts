import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "do-arjun",
      "Generate Arjun command to discover hidden HTTP parameters. Returns the command to run locally since CLI tools cannot execute on serverless.",
      {
        url: z.string().describe("Target URL to scan for hidden parameters"),
        textFile: z.string().optional().describe("Path to file containing multiple URLs"),
        wordlist: z.string().optional().describe("Path to custom wordlist file"),
        method: z.enum(["GET", "POST", "JSON", "HEADERS"]).optional().describe("HTTP method to use for scanning (default: GET)"),
        rateLimit: z.number().optional().describe("Maximum requests per second (default: 9999)"),
        chunkSize: z.number().optional().describe("Chunk size. The number of parameters to be sent at once"),
      },
      async ({ url, textFile, wordlist, method, rateLimit, chunkSize }) => {
        // Build command arguments
        const arjunArgs: string[] = [];

        if (!url && !textFile) {
          return {
            content: [{
              type: "text" as const,
              text: "Error: Either 'url' or 'textFile' parameter is required."
            }]
          };
        }

        if (url) {
          arjunArgs.push("-u", url);
        }
        if (textFile) {
          arjunArgs.push("-f", textFile);
        }
        if (wordlist) {
          arjunArgs.push("-w", wordlist);
        }
        if (method) {
          arjunArgs.push("-m", method);
        }
        if (rateLimit) {
          arjunArgs.push("--rate-limit", String(rateLimit));
        }
        if (chunkSize) {
          arjunArgs.push("--chunk-size", String(chunkSize));
        }

        const command = `arjun ${arjunArgs.join(" ")}`;

        return {
          content: [{
            type: "text" as const,
            text: `To discover hidden HTTP parameters, run this command locally:\n\n${command}\n\nArjun is a Python tool. Install it with: pip install arjun\n\nThis MCP server provides the interface to generate Arjun commands.`
          }]
        };
      }
    );
  },
  {
    capabilities: {
      tools: {}
    }
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true
  }
);

export { handler as GET, handler as POST, handler as DELETE };
