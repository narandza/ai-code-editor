"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { Navbar } from "./navbar";

interface ProjectIdLayoutProps {
  children: React.ReactNode;
  projectId: Id<"projects">;
}

export const ProjectIdLayout = ({
  projectId,
  children,
}: ProjectIdLayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar projectId={projectId} />
      {children}
    </div>
  );
};
