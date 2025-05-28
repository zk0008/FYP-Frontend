"use client";

import { Chatroom } from "@/types";
import { createContext } from "react";
import { useChatroom } from "@/hooks/use-chatroom";

export const ChatroomContext = createContext<Chatroom | null>(null);

export function ChatroomProvider({ children, chatroomId } : { children: React.ReactNode, chatroomId: string }) {
  const { chatroom, loading, error } = useChatroom(chatroomId);

  // TODO: Handle loading and error states

  return (
    <ChatroomContext.Provider value={ chatroom }>
      { children }
    </ChatroomContext.Provider>
  )
}