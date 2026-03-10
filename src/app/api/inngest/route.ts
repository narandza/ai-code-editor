import { serve } from "inngest/next";

import { processMessage } from "@/features/conversations/inngest/process-message";

import { inngest } from "../../../inngest/client";
import { demoError, demoGenerate } from "../../../inngest/functions";
import { importGithubRepo } from "@/features/projects/inngest/import-github-repo";
import { exportToGithub } from "@/features/projects/inngest/export-to-github";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processMessage, importGithubRepo, exportToGithub],
});
