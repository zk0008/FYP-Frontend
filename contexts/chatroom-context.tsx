"use client";

import { createContext } from "react";

import { Chatroom } from "@/types";
import { useFetchChatroom } from "@/hooks";

interface ChatroomContextType {
  chatroom: Chatroom | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const ChatroomContext = createContext<ChatroomContextType>({
  chatroom: null,
  loading: false,
  error: null,
  refresh: () => null
});

export function ChatroomProvider({ children, chatroomId } : { children: React.ReactNode, chatroomId: string }) {
  const { chatroom, loading, error, refresh } = useFetchChatroom(chatroomId);

  const contextValue: ChatroomContextType = { chatroom, loading, error, refresh };

  return (
    <ChatroomContext.Provider value={ contextValue }>
      { children }
    </ChatroomContext.Provider>
  )
}
