import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export const FileExplorer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full bg-sidebar">
      <ScrollArea>
        <div
          className="group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-5.5 bg-accent font-bold"
          role="button"
          onClick={() => setIsOpen((value) => !value)}
        >
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground",
              isOpen && "rotate-90",
            )}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
