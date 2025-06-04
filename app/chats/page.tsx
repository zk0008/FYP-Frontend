"use client";

import { ChatInterface } from "@/components/layout/chat-interface";
import { TopBar } from "@/components/layout/top-bar";
import { useChatroomContext } from "@/hooks/use-chatroom-context";

export default function ChatsPage() {
  const chatroom = useChatroomContext();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        showSidebarTrigger
        title={ chatroom ? chatroom.name : `Welcome!` }
      />
      {chatroom ? (
        // Exclude TopBar height (64px) from ChatInterface height
        <div className="flex flex-col h-[calc(100vh-4rem)] w-full p-2">
          <ChatInterface />
        </div>
      ) : (
        <div className="flex flex-col h-full w-full p-2 items-center justify-center">
          <span>Select a chatroom to start chatting</span>
        </div>
      )}
    </div>
  );
}
