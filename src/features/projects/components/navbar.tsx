import { Id } from "../../../../convex/_generated/dataModel";

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
  return (
    <nav className="flex justify-between items-center gap-x-2 p-2 bg-sidebar border-b ">
      <div className="flex items-center gap-x-2"></div>
      {projectId}
    </nav>
  );
};
