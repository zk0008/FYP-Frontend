"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatroomMenu, TopBar } from "@/components/top-bar";
import { useChatroomContext, useRealtimeDocuments } from "@/hooks";

export default function ChatsPage() {
  const { chatroom } = useChatroomContext();

  // Initialize realtime document updates for the logged-in user
  useRealtimeDocuments();

  if (!chatroom) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar
          showSidebarTrigger
          title="Welcome!"
        />
        <div className="flex flex-col h-full w-full items-center justify-center">
          <span>Select a chatroom to start chatting</span>
        </div>
      </div>
    );
  }

  // Chatroom selected; render chat interface
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        showSidebarTrigger
        title={ chatroom.name }
      >
        <ChatroomMenu />
      </TopBar>
      {/* Exclude TopBar height (64px) from ChatInterface height */}
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
        <ChatInterface />
      </div>
    </div>
  );
}
