"use client";

import Icon from "@/public/GroupGPT.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useRouter } from "next/navigation";

interface TopBarProps {
  showSidebarTrigger?: boolean;
  showLogo?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export function TopBar({
  showSidebarTrigger = false,
  showLogo = false,
  title = "", 
  children
} : TopBarProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 right-0 left-0 flex justify-between items-center py-2 px-4 min-h-[64px] bg-primary-foreground border-b w-full">
      {/* Left section: Sidebar trigger or logo */}
      <div className="flex justify-start w-1/6 min-w-24 flex-shrink-0">
        {showSidebarTrigger && (
          <TooltipWrapper
            content="Toggle Sidebar"
            side="right"
          >
            <SidebarTrigger />
          </TooltipWrapper>
        )}

        {showLogo && (
          <TooltipWrapper
            content="Go to Home"
            side="right"
          >
            <Avatar>
              <AvatarImage
                src={ Icon.src }
                alt="GroupGPT Logo"
                className="cursor-pointer"
                onClick={() => router.push("/")}
              />
            </Avatar>
          </TooltipWrapper>
        )}
      </div>

      {/* Center section: Title */}
      <div className="flex-1 flex justify-center min-w-0 px-4">
        {title && (
          <span className="font-bold text-xl whitespace-nowrap overflow-hidden text-ellipsis block max-w-full cursor-default">
            { title }
          </span>
        )}
      </div>

      {/* Right section: Any child component (e.g., buttons) */}
      <div className="flex justify-end gap-2 w-1/6 min-w-24 flex-shrink-0">
        { children }
      </div>
    </div>
  );
}
