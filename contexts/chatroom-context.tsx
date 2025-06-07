"use client";

import { Chatroom } from "@/types";
import { createContext } from "react";
import { useFetchChatroom } from "@/hooks/use-fetch-chatroom";

interface ChatroomContextType {
  chatroom: Chatroom | null;
  refresh: () => void;
}

export const ChatroomContext = createContext<ChatroomContextType>({
  chatroom: null,
  refresh: () => null
});

export function ChatroomProvider({ children, chatroomId } : { children: React.ReactNode, chatroomId: string }) {
  const { chatroom, loading, error, refresh } = useFetchChatroom(chatroomId);

  const contextValue: ChatroomContextType = { chatroom, refresh };

  // TODO: Handle loading and error states

  return (
    <ChatroomContext.Provider value={ contextValue }>
      { children }
    </ChatroomContext.Provider>
  )
}