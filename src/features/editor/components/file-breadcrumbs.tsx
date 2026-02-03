import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import React from "react";
import { FileIcon } from "@react-symbols/icons/utils";
import { useFilePath } from "@/features/projects/hooks/use-files";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const FileBreadcrumbs = ({
  projectId,
}: {
  projectId: Id<"projects">;
}) => {
  const { activeTabId } = useEditor(projectId);
  const filePath = useFilePath(activeTabId);

  // TODO: Fix inline ~8h p1

  if (filePath === undefined && !activeTabId) {
    return (
      <div className="p-2 bg-background pl-4 border-b">
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-0.5 gap-0.5">
            <BreadcrumbItem className="text-sm">
              <BreadcrumbPage>&nbsp;</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  return (
    <div className="p-2 bg-background pl-4 border-b">
      <Breadcrumb>
        <BreadcrumbList className="sm:gap-0.5 gap-0.5">
          <BreadcrumbPage>
            {filePath?.map((item, index) => {
              const isLast = index === filePath.length - 1;

              return (
                <React.Fragment key={item._id}>
                  <BreadcrumbItem className="text-sm">
                    {isLast ? (
                      <BreadcrumbPage className="inline-flex items-center gap-1">
                        <FileIcon
                          fileName={item.name}
                          autoAssign
                          className="size-4"
                        />
                        {item.name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href="#">{item.name}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
