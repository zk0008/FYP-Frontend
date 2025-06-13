"use client";

import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from "@/components/ui/chat/chat-bubble";
import { getInitials } from "@/utils";
import Icon from "@/public/GroupGPT.png";
import { useUserContext } from "@/hooks/use-user-context";

interface MessageBubbleProps {
  messageId: string,
  username: string,
  content: string,
}

export function CopyMessageAction({ messageId, content }: { messageId: string, content: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const handleClick = () => {
    if (isCopied) return;
    handleCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <ChatBubbleAction
      onClick={ handleClick }
      className="cursor-pointer"
      key={ `copy-${messageId}` }
      icon={ isCopied ? <ClipboardCheck className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" /> }
      title={ isCopied ? "Copied!" : "Copy message" }
    />
  );
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
          <CopyMessageAction messageId={ messageId } content={ content } />
        </ChatBubbleActionWrapper>
      </div>
    </ChatBubble>
  );
}
