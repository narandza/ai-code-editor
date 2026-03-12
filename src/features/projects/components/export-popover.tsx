import { useClerk } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import ky, { HTTPError } from "ky";
import z from "zod";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { useProject } from "../hooks/use-projects";
import { CheckCircle2Icon, ExternalLinkIcon, LoaderIcon } from "lucide-react";

const formSchema = z.object({
  repoName: z
    .string()
    .min(1, "Repository name is required")
    .max(100, "Repository name is too long")
    .regex(
      /^[a-zA-z0-9._-]+$/,
      "Only alphanumeric characters, hyphens, underscores, and dots are allowed",
    ),
  visibility: z.enum(["public", "private"]),
  description: z.string().max(350, "Description is too long"),
});

interface ExportPopoverProps {
  projectId: Id<"projects">;
}

export const ExportPopover = ({ projectId }: ExportPopoverProps) => {
  const project = useProject(projectId);
  const [open, setOpen] = React.useState(false);
  const { openUserProfile } = useClerk();

  const exportStatus = project?.exportStatus;
  const exportRepoUrl = project?.exportRepoUrl;

  const form = useForm({
    defaultValues: {
      repoName: project?.name?.replace(/[^a-zA-Z0-9._-]/g, "-") ?? "",
      visibility: "private" as "public" | "private",
      description: "",
    },

    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await ky.post("/api/github/export", {
          json: {
            projectId,
            repoName: value.repoName,
            visibility: value.visibility,
            description: value.description || undefined,
          },
        });

        toast.success("Export started...");
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json<{ error: string }>();

          if (body.error.includes("GitHub not connected")) {
            toast.error("GitHub account not connected", {
              action: {
                label: "Connect",
                onClick: () => openUserProfile(),
              },
            });

            setOpen(false);
            return;
          }
        }

        toast.error("Unable to export repository.");
      }
    },
  });

  const handleCancelExport = async () => {
    await ky.post("/api/github/export/cancel", {
      json: { projectId },
    });
  };

  const handleResetExport = async () => {
    await ky.post("/api/github/export/reset", {
      json: { projectId },
    });
  };

  const renderContent = () => {
    if (exportStatus === "exporting") {
      return (
        <div className="flex flex-col items-center gap-3">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Exporting to Github...
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleCancelExport}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (exportStatus === "completed" && exportRepoUrl) {
      return (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2Icon className="size-6 text-emerald-500" />
          <p className="text-sm font-medium">Repository created</p>
          <p className="text-xs text-muted-foreground text-center">
            Your project has been exported to GutHub.
          </p>
          <div className="flex flex-col w-full gap-2">
            <Button size="sm" className="w-full" asChild>
              <a href={exportRepoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon className="size-4 mr-1" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Import from GitHub</DialogTitle>
        <DialogDescription>
          Enter a Github repository URL to import. A new project will be created
          with the repository contents.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="url">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Repository URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="https://github.com/owner/repo"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Importing..." : "Import"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
