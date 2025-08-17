"use client";

import { LoaderCircle } from "lucide-react";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

import { ToastAction } from "@radix-ui/react-toast";
import {
  useUnifiedChatroomContext,
  useMessagesWithRealtime,
  useToast
} from "@/hooks";

import { MessageBubble } from "./message-bubble";

export function MessagesList() {
  const { currentChatroom } = useUnifiedChatroomContext();
  const { toast } = useToast();

  const { messages, loading, error } = useMessagesWithRealtime({ chatroomId: currentChatroom?.chatroomId || "" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    console.error("Error fetching messages:", error);
    toast({
      title: "Error",
      description: "Failed to fetch messages. Please try again.",
      variant: "destructive",
      action: <ToastAction altText="Refresh" onClick={() => window.location.reload()}>
        Refresh
      </ToastAction>,
    });
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-500">Failed to load messages</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span>No messages found in this chatroom</span>
      </div>
    )
  }

  return (
    <ChatMessageList className="p-0">
      {messages.map((message) => (
        <MessageBubble
          key={ message.messageId }
          messageId={ message.messageId }
          username={ message.username }
          content={ message.content }
          attachments={ message.attachments }
        />
      ))}
    </ChatMessageList>
  );
}