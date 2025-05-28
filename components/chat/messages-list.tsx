"use client";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMessages } from "@/hooks/use-messages";
import { useSearchParams } from "next/navigation";

import { MessageBubble } from "./message-bubble";
import { useChatroomContext } from "@/hooks/use-chatroom-context";

export function MessagesList() {
  const chatroom = useChatroomContext();
  // const searchParams = useSearchParams();
  // const chatroomId = searchParams.get("chatroom-id") || "";

  const { messages, loading, error } = useMessages({ chatroomId: chatroom?.chatroomId || "" });

  return (
    <ChatMessageList>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble
            messageId={ message.messageId }
            username={ message.username }
            content={ message.content }
          />
        ))
      ) : (
        <div>
          <p>No messages found in this chatroom.</p>
        </div>
      )}
    </ChatMessageList>
  );
}