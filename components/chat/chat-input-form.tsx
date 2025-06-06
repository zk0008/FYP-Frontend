"use client";

import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Mic, Paperclip, SendHorizonal, Upload } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useChatInput } from "@/hooks";
import { useEffect, useRef } from "react";

import { UploadFileButton } from "./upload-file-button";

export function ChatInputForm() {
  const { input, setInput, isSubmitting, handleSubmit } = useChatInput();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasSubmittingRef = useRef<boolean>(false);

  // Re-focus on the input after user sends a message
  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }

    // Update ref to track previous state
    wasSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  // Messsge sending using send button
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    // Focus back on the input after submitting
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Message sending using Ctrl + Enter or Cmd + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
      // Focus back on the input after submitting
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <form
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
      onSubmit={ onSubmit }
    >
      <ChatInput
        ref={ inputRef }
        placeholder="Type your message here... (Use @GroupGPT for AI)"
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-4 shadow-none focus-visible:ring-0"
        value={ input }
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        disabled={ isSubmitting }
        onKeyDown={ handleKeyDown }
        autoFocus
      />
      <div className="flex items-center p-3 pt-0">
        <UploadFileButton />

        <TooltipWrapper content="Use Microphone" side="top">
          <Button variant="ghost" size="icon" disabled>
            <Mic />
            <span className="sr-only">Use Microphone</span>
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Send Message" side="top">
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto gap-1.5"
            type="submit"
            disabled={ !input.trim() || isSubmitting }
          >
            <SendHorizonal />
            <span className="sr-only">Send Message</span>
          </Button>
        </TooltipWrapper>
      </div>
    </form>
  );
}
