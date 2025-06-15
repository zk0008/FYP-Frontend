"use client";

import ReactMarkdown from "react-markdown";

import {
  ChatBubble,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from "@/components/ui/chat/chat-bubble";
import { CopyMessageButton } from "@/components/buttons";
import { getInitials } from "@/utils";
import Icon from "@/public/GroupGPT.png";
import { useUserContext } from "@/hooks";


interface MessageBubbleProps {
  messageId: string,
  username: string,
  content: string,
}

export function MessageBubble({
  messageId,
  username,
  content,
}: MessageBubbleProps) {
  const { user } = useUserContext();
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
            <ReactMarkdown>{ content }</ReactMarkdown>
          </div>
        </ChatBubbleMessage>
        <ChatBubbleActionWrapper className={`absolute bottom-0 top-auto translate-x-0 translate-y-0 px-2 ${
          isOwnMessage ? "-left-12" : "-right-12"
        }`}>
          <CopyMessageButton messageId={ messageId } content={ content } />
        </ChatBubbleActionWrapper>
      </div>
    </ChatBubble>
  );
}
