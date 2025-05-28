"use client";

import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Mic, Paperclip, SendHorizonal } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useState } from "react";

export function ChatInputForm() {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // TODO: Message sending logic with auto-check for GroupGPT call
    console.log("Message sent:", input);
    setInput("");
  };

  return (
    <form
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
      onSubmit={ handleSubmit }
    >
      <ChatInput
        placeholder="Type your message here..."
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
        value={ input }
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value) }
      />
      <div className="flex items-center p-3 pt-0">
        <TooltipWrapper content="Attach File" side="top">
          <Button variant="ghost" size="icon">
            <Paperclip />
            <span className="sr-only">Attach File</span>
          </Button>
        </TooltipWrapper>

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
            disabled={ !input.trim() }
          >
            <SendHorizonal />
            <span className="sr-only">Send Message</span>
          </Button>
        </TooltipWrapper>
      </div>
    </form>
  );
}
