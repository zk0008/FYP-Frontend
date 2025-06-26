"use client";

import { LoaderCircle, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { TranscribeButton, UploadButton } from "@/components/buttons";
import { useChatInput } from "@/hooks";

export function ChatInputForm() {
  const { input, setInput, isSubmitting, handleSubmit } = useChatInput();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasSubmittingRef = useRef<boolean>(false);
  const [isListening, setIsListening] = useState(false);

  const handleTranscriptChange = (incrementalTranscript: string) => {
    if (!incrementalTranscript.trim()) return; // Ignore empty transcripts

    // TranscribeButton returns incremental updates
    // To show real-time transcription, append the new portion to existing input
    setInput(prevInput => {
      const currentInput = prevInput.trim();

      const fullTranscript = (currentInput + incrementalTranscript).trim();
      const normalizedInput = fullTranscript.toLowerCase();
      const triggers = [
        'hey group gpt',
        'hey group g pt',
        'hey group gp t',
        'hey group g p t'
      ];

      const matchedTrigger = triggers.find(trigger =>
        normalizedInput.includes(trigger)
      );

      if (matchedTrigger) {
        // Replace the spoken trigger with @GroupGPT
        const triggerRegex = new RegExp(matchedTrigger.replace(/\s/g, '\\s*'), 'i');
        const replacedTranscript = fullTranscript.replace(triggerRegex, '@GroupGPT ');
        return replacedTranscript;
      } else {
        return fullTranscript;
      }
    });
  };

  const handleTranscriptAbort = () => {
    // Reset the input when transcription is aborted
    setInput("");
    setIsListening(false);
  };

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

  return (
    <form
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
      onSubmit={ onSubmit }
    >
      <ChatInput
        ref={ inputRef }
        placeholder={
          isListening
            ? "Listening... (Say 'Hey GroupGPT' to invoke AI)"
            : "Type your message here... (Use @GroupGPT for AI)"
        }
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-4 shadow-none focus-visible:ring-0"
        value={ input }
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        disabled={ isSubmitting }
        onKeyDown={ handleKeyDown }
        autoFocus
      />
      <div className="flex items-center p-3 pt-0 gap-1">
        <UploadButton />

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
            disabled={ !input.trim() || isListening || isSubmitting }
          >
            {isSubmitting ? <LoaderCircle className="animate-spin" /> : (
              <>
                <SendHorizonal />
                <span className="sr-only">Send Message</span>
              </>
            )}
          </Button>
        </TooltipWrapper>
      </div>
    </form>
  );
}
