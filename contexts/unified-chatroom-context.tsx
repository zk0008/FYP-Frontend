"use client";

import { createContext, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { Chatroom } from "@/types";
import { useFetchChatrooms, useRealtimeChatroom, useUserContext } from "@/hooks";

interface UnifiedChatroomContextType {
  // Chatrooms list
  chatrooms: Chatroom[];
  loading: boolean;
  error: string | null;
  refresh: () => void;

  // Current chatroom
  currentChatroom: Chatroom | null;
  // currentChatroom: (chatroomId: string) => {
  //   chatroom: Chatroom | null;
  //   loading: boolean;
  //   error: string | null;
  // };
}

export const UnifiedChatroomContext = createContext<UnifiedChatroomContextType>({
  chatrooms: [],
  loading: false,
  error: null,
  refresh: () => null,
  currentChatroom: null,
  // currentChatroom: () => ({ chatroom: null, loading: false, error: null }),
});

export function UnifiedChatroomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const {
    chatrooms,
    loading,
    error,
    refresh,
    updateChatrooms
  } = useFetchChatrooms({ userId: user?.userId || "" });

  const searchParams = useSearchParams();
  const currentChatroomId = searchParams.get("chatroom-id") || "";

  const handleChatroomUpdate = useCallback((updatedChatroom: Chatroom) => {
    updateChatrooms(updatedChatroom);
  }, [updateChatrooms]);

  // Subscribe to real-time updates
  useRealtimeChatroom({ onUpdateChatroom: handleChatroomUpdate });

  const getChatroom = useCallback((chatroomId: string) => {
    return chatrooms.find(c => c.chatroomId === chatroomId) || null;
  }, [chatrooms]);

  const currentChatroom = useMemo(() =>{
    return currentChatroomId ? getChatroom(currentChatroomId) : null;
  }, [currentChatroomId, getChatroom, chatrooms]);

  // const currentChatroom = useCallback(() => {
  //   const chatroom = chatrooms.find(c => c.chatroomId === chatroomId) || null;
  //   return { chatroom, loading, error,
  //   };
  // }, [chatrooms, loading, error]);

  const contextValue: UnifiedChatroomContextType = useMemo(() => ({
    chatrooms,
    loading,
    error,
    refresh,
    currentChatroom
  }), [chatrooms, loading, error, refresh, currentChatroom]);

  return (
    <UnifiedChatroomContext.Provider value={ contextValue }>
      { children }
    </UnifiedChatroomContext.Provider>
  );
}
