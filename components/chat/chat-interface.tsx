"use client";

import { ChatInputForm } from "./chat-input-form"
import { MessagesList } from "./messages-list";
import { FileDropZone } from "./file-drop-zone";

export function ChatInterface() {
  return (
    <div className="flex flex-col h-full px-2">
      <div className="flex-1 overflow-y-auto">
        <FileDropZone className="flex flex-col h-full">
          <MessagesList />
        </FileDropZone>
      </div>

        <ChatInputForm />

        <span className="text-xs text-center mt-1 pb-1 cursor-default">
          GroupGPT can make mistakes. Please verify important information.
        </span>
    </div>
  );
}