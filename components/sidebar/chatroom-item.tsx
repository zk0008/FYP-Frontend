"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chatroom } from "@/types";
import { getInitials } from "@/utils";
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useRouter } from "next/navigation";

export function ChatroomItem({
  chatroomId,
  name
}: Chatroom) {
  const router = useRouter();
  const { open, openMobile } = useSidebar();

  const avatarElement = (
    <Avatar>
      <AvatarFallback>
        { getInitials(name) }
      </AvatarFallback>
    </Avatar>
  );

  const handleChatroomClick = () => {
    router.push(`/chats?chatroom-id=${chatroomId}`);
  };

  return (
    <SidebarMenuItem key={ chatroomId }>
      <TooltipWrapper
        content={ `Enter ${name}` }
        side={ open || openMobile ? "bottom" : "right" }
      >
        {open || openMobile ? (
          <SidebarMenuButton
            size="lg"
            className="w-full justify-start"
            onClick={ handleChatroomClick }
          >
            <div className="flex items-center gap-2">
              { avatarElement }
              <span>{ name }</span>
            </div>
          </SidebarMenuButton>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={ handleChatroomClick }
          >
            { avatarElement }
          </Button>
        )}
      </TooltipWrapper>
    </SidebarMenuItem>
  );
}
