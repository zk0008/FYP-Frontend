"use client";

import { ChatInputForm, MessagesList } from "@/components/chat";

export function ChatInterface() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessagesList />
      </div>

      <ChatInputForm />

      <span className="text-xs text-center mt-1">
        GroupGPT can make mistakes. Please verify important information.
      </span>
    </div>
  );
}