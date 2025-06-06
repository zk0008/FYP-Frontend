"use client";

import { ChatInputForm } from "./chat-input-form"
import { MessagesList } from "./messages-list";
import { FileDropZone } from "./file-drop-zone";

export function ChatInterface() {
  return (
    <div className="flex flex-col h-full px-2">
      <FileDropZone className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <MessagesList />
        </div>

        <ChatInputForm />

        <span className="text-xs text-center mt-1 pb-1">
          GroupGPT can make mistakes. Please verify important information.
        </span>
      </FileDropZone>
    </div>
  );
}