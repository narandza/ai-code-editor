import { Id } from "../../../../convex/_generated/dataModel";

interface ConversationSidebarProps {
  projectId: Id<"projects">;
}

export const ConversationSidebar = ({
  projectId,
}: ConversationSidebarProps) => {
  return <div className="">Conversation sidebar</div>;
};
