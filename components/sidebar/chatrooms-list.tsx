"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { CreateChatroomDialog } from "@/components/dialogs/create-chatroom-dialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useUnifiedChatroomContext, useToast } from "@/hooks";

import { ChatroomItem } from "./chatroom-item";


export function ChatroomsList() {
  const { chatrooms, loading: chatroomsLoading, error: chatroomsError } = useUnifiedChatroomContext();
  const [isCreateChatroomDialogOpen, setIsCreateChatroomDialogOpen] = useState(false);
  const { toast } = useToast();

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
        side="right"
      >
        <SidebarGroupAction
          onClick={() => setIsCreateChatroomDialogOpen(true)}
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
        {chatroomsLoading ? <LoaderCircle className="w-6 h-6 animate-spin mx-auto" /> : (
          (chatrooms ?? []).map((chatroom) => (
            <ChatroomItem
              key={ chatroom.chatroomId }
              chatroomId={ chatroom.chatroomId }
              name={ chatroom.name }
            />
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
