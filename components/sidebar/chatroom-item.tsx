"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useRouter, useSearchParams } from "next/navigation";

interface ChatroomItemProps {
  chatroomId: string;
  name: string;
}

export function ChatroomItem({
  chatroomId,
  name
} : ChatroomItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChatroomId = searchParams.get("chatroom-id");
  const isCurrentChatroom = currentChatroomId === chatroomId;

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
        side="right"
      >
          <SidebarMenuButton
            size="lg"
            className="w-full justify-start"
            variant={ isCurrentChatroom ? "outline" : "default" }
            onClick={ handleChatroomClick }
          >
            <div className="flex items-center gap-2">
              { avatarElement }
              <span className="whitespace-nowrap">{ name }</span>
            </div>
          </SidebarMenuButton>
      </TooltipWrapper>
    </SidebarMenuItem>
  );
}
