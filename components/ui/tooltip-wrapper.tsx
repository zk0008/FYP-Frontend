"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function TooltipWrapper({
  children,
  content,
  side = "top"
} : TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          { children }
        </TooltipTrigger>
        <TooltipContent side={ side }>
          <span className="text-sm">{ content }</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
