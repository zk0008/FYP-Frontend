"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

import { Attachment } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from "@/components/ui/chat/chat-bubble";
import { CopyMessageButton, DeleteMessageButton, ReadMessageButton } from "@/components/buttons";
import { getInitials } from "@/utils";
import Icon from "@/public/GroupGPT.png";
import { useUserContext } from "@/hooks";

import { MessageAttachments } from "./message-attachments";

interface MessageBubbleProps {
  messageId: string;
  username: string;
  content: string;
  attachments?: Attachment[];
}

export function MessageBubble({
  messageId,
  username,
  content,
  attachments,
}: MessageBubbleProps) {
  const { user } = useUserContext();
  const isOwnMessage = username === user?.username;
  const [showAttachments, setShowAttachments] = useState(false);

  const hasAttachments = attachments && attachments.length > 0;

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
          { /* Toggle to show or hide message attachments */ }
          {hasAttachments && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={`
                  h-6 px-2 text-xs gap-1 relative z-10
                  ${isOwnMessage
                    ? "hover:bg-primary-foreground/10 text-primary-foreground hover:text-primary-foreground"
                    : "hover:bg-secondary-foreground/10 text-secondary-foreground hover:text-secondary-foreground"
                  }
                `}
                onClick={() => setShowAttachments(!showAttachments)}
              >
                {showAttachments ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                <span>
                  {showAttachments
                    ? `Hide ${attachments.length} Attachment${attachments.length > 1 ? 's' : ''}`
                    : `Show ${attachments.length} Attachment${attachments.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </>
          )}

          {/* Show attachments list if available and toggled */}
          {hasAttachments && showAttachments && (
            <MessageAttachments attachments={ attachments } isOwnMessage={ isOwnMessage } />
          )}

          { /* Message content */ }
          <div
            className={`
              prose whitespace-normal max-w-md
              ${isOwnMessage ? "text-primary-foreground" : "text-primary"}
            `}
          >
            <ReactMarkdown remarkPlugins={ [remarkGfm] }>
              { content }
            </ReactMarkdown>
          </div>
        </ChatBubbleMessage>

        <ChatBubbleActionWrapper
          variant={ isOwnMessage ? "sent" : "received" } className={`
            !top-auto bottom-0 translate-y-0
            ${isOwnMessage 
              ? "!-left-1 !-translate-x-full !flex-row-reverse" 
              : "!-right-1 !translate-x-full"
            }
          `}
        >
          <CopyMessageButton messageId={ messageId } content={ content } />
          <DeleteMessageButton messageId={ messageId } />
          <ReadMessageButton content={ content } />
        </ChatBubbleActionWrapper>
      </div>
    </ChatBubble>
  );
}
