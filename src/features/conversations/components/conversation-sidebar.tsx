import { Id } from "../../../../convex/_generated/dataModel";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { DEFAULT_CONVERSATION_TITLE } from "../../../../convex/constants";
import { Button } from "@/components/ui/button";
import { HistoryIcon, PlusIcon } from "lucide-react";

interface ConversationSidebarProps {
  projectId: Id<"projects">;
}

export const ConversationSidebar = ({
  projectId,
}: ConversationSidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-sidebar ">
      <div className="h-8.75 flex items-center justify-between border-b">
        <div className="text-sm truncate pl-3">
          {DEFAULT_CONVERSATION_TITLE}
        </div>
        <div className="flex items-center px-1 gap-1">
          <Button variant="highlight" size="icon-xs">
            <HistoryIcon className="size-3.5" />
          </Button>
          <Button variant="highlight" size="icon-xs">
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
      </div>
      <Conversation className="flex-1">
        <ConversationContent>
          <p className="">messages</p>
          <ConversationScrollButton />
        </ConversationContent>
      </Conversation>
      <div className="p-3">
        <PromptInput onSubmit={() => {}} className="mt-2 ">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask Polaris anything..."
              onChange={() => {}}
              value=""
              disabled={false}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit disabled={false} status="ready" />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
