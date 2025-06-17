"use client";

import { createContext, useCallback } from "react";

import { Chatroom } from "@/types";
import { useFetchChatrooms, useRealtimeChatroom, useUserContext } from "@/hooks";

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
  // TODO: When one user edits a chatroom, the update should be reflected across all users through realtime
  const {
    chatrooms,
    loading,
    error,
    refresh,
    updateChatrooms
  } = useFetchChatrooms({ userId: user?.userId || "" });

  const handleChatroomUpdate = useCallback((updatedChatroom: Chatroom) => {
    updateChatrooms(updatedChatroom);
  }, [updateChatrooms]);

  // Subscribe to real-time updates
  useRealtimeChatroom({ onUpdateChatroom: handleChatroomUpdate });

  const contextValue: ChatroomsContextType = { chatrooms, loading, error, refresh };

  return (
    <ChatroomsContext.Provider value={ contextValue }>
      { children }
    </ChatroomsContext.Provider>
  );
}
