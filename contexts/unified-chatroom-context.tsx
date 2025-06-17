"use client";

import { createContext, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Chatroom } from "@/types";
import {
  useFetchChatrooms,
  useRealtimeChatroom,
  useToast,
  useUserContext
} from "@/hooks";

interface UnifiedChatroomContextType {
  chatrooms: Chatroom[];              // Chatrooms list
  currentChatroom: Chatroom | null;   // Current chatroom
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const UnifiedChatroomContext = createContext<UnifiedChatroomContextType>({
  chatrooms: [],
  loading: false,
  error: null,
  refresh: () => null,
  currentChatroom: null
});

export function UnifiedChatroomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const {
    chatrooms,
    loading,
    error,
    refresh,
    updateChatrooms,
    removeChatroom
  } = useFetchChatrooms({ userId: user?.userId || "" });

  const searchParams = useSearchParams();
  const currentChatroomId = searchParams.get("chatroom-id") || "";

  const router = useRouter();
  const { toast } = useToast();

  const handleChatroomUpdate = useCallback((updatedChatroom: Chatroom) => {
    updateChatrooms(updatedChatroom);
  }, [updateChatrooms]);

  const handleChatroomDelete = useCallback((deletedChatroomId: string) => {
    // If the deleted chatroom is not in the list, do nothing
    if (!chatrooms.some(c => c.chatroomId === deletedChatroomId)) return;

    // If the deleted chatroom is the current one, redirect to /chats
    if (deletedChatroomId === currentChatroomId) {
      router.push("/chats");
    }

    const deletedChatroom = chatrooms.find(c => c.chatroomId === deletedChatroomId);
    const deletedChatroomName = deletedChatroom?.name ? `'${deletedChatroom.name}'` : "Chatroom";

    // Remove deleted chatroom from chatrooms list
    removeChatroom(deletedChatroomId);

    // Show toast notification to update members
    if (user?.userId !== deletedChatroom?.creatorId) {
      toast({
        title: "Chatroom Deleted",
        description: `${deletedChatroomName} has been deleted by its owner. You can no longer access it.`
      });
    }
  }, [chatrooms, currentChatroomId, router, removeChatroom, refresh, toast]);

  // Subscribe to real-time updates
  useRealtimeChatroom({
    onUpdateChatroom: handleChatroomUpdate,
    onDeleteChatroom: handleChatroomDelete
  });

  const getChatroom = useCallback((chatroomId: string) => {
    return chatrooms.find(c => c.chatroomId === chatroomId) || null;
  }, [chatrooms]);

  const currentChatroom = useMemo(() =>{
    return currentChatroomId ? getChatroom(currentChatroomId) : null;
  }, [currentChatroomId, getChatroom, chatrooms]);

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
