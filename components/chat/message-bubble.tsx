"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { getInitials } from "@/utils";
import ReactMarkdown from "react-markdown";
import Icon from "@/public/GroupGPT.png";
import { useUserContext } from "@/hooks/use-user-context";

interface MessageBubbleProps {
  messageId: string,
  username: string,
  content: string,
  // TODO: Add timestamp prop
}

export function MessageBubble({
  messageId,
  username,
  content,
}: MessageBubbleProps) {
  const user = useUserContext();
  const isOwnMessage = username === user?.username;

  return (
    <ChatBubble
      key={ messageId }
      variant={ isOwnMessage ? "sent" : "received" }
    >
      <ChatBubbleAvatar
        src={ username === "GroupGPT" ? Icon.src : undefined }
        fallback={ getInitials(username) }
      />
      <div>
        {!isOwnMessage && (
          <div className="text-xs text-muted-foreground mb-1 px-2">
            { username }
          </div>
        )}
        <ChatBubbleMessage variant={ isOwnMessage ? "sent" : "received" }>
          <div className="markdown">
            <ReactMarkdown>
              { content }
            </ReactMarkdown>
          </div>
        </ChatBubbleMessage>
      </div>
    </ChatBubble>
  );
}
