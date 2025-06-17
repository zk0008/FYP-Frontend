"use client";

import { useContext } from "react";

import { Chatroom } from "@/types";
import { UnifiedChatroomContext } from "@/contexts";

interface UnifiedChatroomContextType {
  chatrooms: Chatroom[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  currentChatroom: Chatroom | null;
}

export function useUnifiedChatroomContext(): UnifiedChatroomContextType {
  const unifiedChatroomContext = useContext(UnifiedChatroomContext);

  if (unifiedChatroomContext === undefined) {
    throw new Error("useUnifiedChatroomContext must be used within a UnifiedChatroomProvider");
  }

  return unifiedChatroomContext as UnifiedChatroomContextType;
}
