"use client";

import { LoaderCircle, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AttachmentDropZone } from "@/components/drop-zones";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { TranscribeButton } from "@/components/buttons";
import { useChatInput } from "@/hooks";

import { AttachmentPreview } from "./attachment-preview";

export function ChatInputForm() {
  const {
    input,
    setInput,
    attachments,
    setAttachments,
    isSending,
    handleSubmit
  } = useChatInput();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasSendingRef = useRef<boolean>(false);
  const [isListening, setIsListening] = useState(false);

  const handleTranscriptChange = (incrementalTranscript: string) => {
    if (!incrementalTranscript.trim()) return;

    setInput(prevInput => {
      const currentInput = prevInput.trim();
      const fullTranscript = (currentInput + incrementalTranscript).trim();
      const normalizedInput = fullTranscript.toLowerCase();
      const triggers = [
        "hey gpt",
        "hey g p t",
        "hey g pt",
        "hey gp t"
      ];

      const matchedTrigger = triggers.find(trigger =>
        normalizedInput.includes(trigger)
      );

      if (matchedTrigger) {
        const triggerRegex = new RegExp(matchedTrigger.replace(/\s/g, '\\s*'), 'i');
        const replacedTranscript = fullTranscript.replace(triggerRegex, '@GroupGPT ');
        return replacedTranscript;
      } else {
        return fullTranscript;
      }
    });
  };

  const handleTranscriptAbort = () => {
    setInput("");
    setIsListening(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit(e);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  useEffect(() => {
    if (wasSendingRef.current && !isSending) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
    wasSendingRef.current = isSending;
  }, [isSending]);

  const hasContent = input.trim() || attachments.length > 0;

  return (
    <AttachmentDropZone attachments={attachments} setAttachments={setAttachments}>
      <div className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
        <AttachmentPreview
          attachments={ attachments }
          setAttachments={ setAttachments }
          isSending={ isSending }
        />

        <form onSubmit={ onSubmit }>
          <ChatInput
            ref={ inputRef }
            placeholder={
              isListening
                ? "Listening... (Say 'Hey GPT' to invoke AI)"
                : "Type your message here... (Use @GroupGPT for AI)"
            }
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-4 shadow-none focus-visible:ring-0"
            value={ input }
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            disabled={ isSending }
            onKeyDown={ handleKeyDown }
            autoFocus
          />
          
          <div className="flex items-center p-3 pt-0 gap-1">
            <TranscribeButton
              onTranscriptChange={ handleTranscriptChange }
              onListeningChange={(listening) => setIsListening(listening)}
              onTranscriptAbort={ handleTranscriptAbort }
            />

            <TooltipWrapper content="Send Message" side="top">
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                type="submit"
                disabled={ !hasContent || isListening || isSending }
              >
                {isSending ? <LoaderCircle className="animate-spin" /> : (
                  <>
                    <SendHorizonal />
                    <span className="sr-only">Send Message</span>
                  </>
                )}
              </Button>
            </TooltipWrapper>
          </div>
        </form>
      </div>
    </AttachmentDropZone>
  );
}