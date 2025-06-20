"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatroomMenu, TopBar } from "@/components/top-bar";
import { useUnifiedChatroomContext, useRealtimeDocuments, useUserContext } from "@/hooks";

export default function ChatsPage() {
  const { user } = useUserContext();
  const { currentChatroom } = useUnifiedChatroomContext();

  // Initialize realtime document updates for the logged-in user
  useRealtimeDocuments();

  if (!currentChatroom) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar
          showSidebarTrigger
          title={ user ? `Welcome, ${user.username}!` : "Welcome!" }
        />
        <div className="flex flex-col h-full w-full items-center justify-center">
          <span>Select a chatroom to start chatting</span>
        </div>
      </div>
    );
  }

  // Chatroom selected; render chat interface
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <TopBar
        showSidebarTrigger
        title={ currentChatroom.name }
      >
        <ChatroomMenu />
      </TopBar>
      {/* Exclude TopBar height (64px) from ChatInterface height */}
      <div
        className="flex flex-col w-full"
        style={{
          height: `calc(100dvh - 4rem)`,
          paddingBottom: "env(safe-area-inset-bottom)"
        }}
      >
        <ChatInterface />
      </div>
    </div>
  );
}
