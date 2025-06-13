"use client";

import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { useState } from "react";

import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";

export function CopyMessageButton({ messageId, content }: { messageId: string, content: string }) {
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
