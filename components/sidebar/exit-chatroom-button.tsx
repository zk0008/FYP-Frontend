"use client";

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';

import Icon from '@/public/GroupGPT.png';

export function ExitChatroomButton() {
  const router = useRouter();
  const { open, openMobile } = useSidebar();

  const handleExitChatroom = () => {
    // TODO: Chatroom context cleanup
    router.push("/chats");
  };

  return (
    <TooltipWrapper
      content="Exit Current Chatroom"
      side={open || openMobile ? "bottom" : "right"}
    >
      <div
        className="flex items-center gap-2 py-1 hover:bg-muted rounded cursor-pointer"
        onClick={handleExitChatroom}
      >
        <Avatar>
          <AvatarImage src={Icon.src} alt="GroupGPT Logo" />
        </Avatar>
        {(open || openMobile) && <span className="font-bold rounded">GroupGPT</span>}
      </div>
    </TooltipWrapper>
  );
}
