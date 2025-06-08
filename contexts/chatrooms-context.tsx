"use client";

import { Chatroom } from "@/types";
import { createContext } from "react";
import { useFetchChatrooms, useUserContext } from "@/hooks";

interface ChatroomsContextType {
  chatrooms: Chatroom[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const ChatroomsContext = createContext<ChatroomsContextType>({
  chatrooms: [],
  loading: false,
  error: null,
  refresh: () => null
});

export function ChatroomsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const { chatrooms, loading, error, refresh } = useFetchChatrooms({ userId: user?.userId || "" });

  const contextValue: ChatroomsContextType = { chatrooms, loading, error, refresh };

  return (
    <ChatroomsContext.Provider value={ contextValue }>
      { children }
    </ChatroomsContext.Provider>
  );
}
