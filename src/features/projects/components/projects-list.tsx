import { Spinner } from "@/components/ui/spinner";
import { useProjectsPartial } from "../hooks/use-projects";
import { Kbd } from "@/components/ui/kbd";

interface ProjectsListProps {
  onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <Spinner className="size-4 text-ring" />;
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {projects.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Recent projects
            </span>
            <button className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors">
              <span className="">View all</span>
              <Kbd className="bg-accent border">⌘K</Kbd>
            </button>
          </div>
          <ul className="flex flex-col ">
            {projects.map((project) => (
              <p className="" key={project._id}>
                TODO project item
              </p>
              // <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
