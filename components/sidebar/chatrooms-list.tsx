"use client";

import { CreateChatroomDialog } from "@/components/dialogs/create-chatroom";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton
} from "@/components/ui/sidebar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useChatrooms } from "@/hooks";

import { ChatroomItem } from "./chatroom-item";

export function ChatroomsList() {
  // const { userId, loading: userLoading, error: userError } = useUserId();
  const { user, loading: userLoading, error: userError } = useUser();
  const { chatrooms, loading: chatroomsLoading, error: chatroomsError } = useChatrooms({ userId: user?.userId || "" });
  const [isCreateChatroomDialogOpen, setIsCreateChatroomDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userError) {
      toast({
        title: "Error occurred when loading user",
        description: userError,
        variant: "destructive"
      });
    }
  }, [userError]);

  useEffect(() => {
    if (chatroomsError) {
      toast({
        title: "Error occurred when loading chatrooms", 
        description: chatroomsError,
        variant: "destructive"
      });
    }
  }, [chatroomsError]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chatrooms</SidebarGroupLabel>
      <TooltipWrapper
        content="Create New Chatroom"
        side="left"
      >
        <SidebarGroupAction
          title="Create New Chatroom"
          onClick={() => setIsCreateChatroomDialogOpen(true) }
        >
          <Plus />
          <span className="sr-only">Create New Chatroom</span>
        </SidebarGroupAction>
      </TooltipWrapper>
      <CreateChatroomDialog
        open={isCreateChatroomDialogOpen}
        onOpenChange={setIsCreateChatroomDialogOpen}
      />

      <SidebarMenu>
        {userLoading || chatroomsLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))
        ) : (
          chatrooms.map((chatroom) => (
            <ChatroomItem
              chatroomId={ chatroom.chatroomId }
              name={ chatroom.name }
            />
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
