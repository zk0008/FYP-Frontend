"use client";

import { useContext } from "react";

import { Chatroom, UnifiedChatroomContextType } from "@/types";
import { UnifiedChatroomContext } from "@/contexts";

export function useUnifiedChatroomContext(): UnifiedChatroomContextType {
  const unifiedChatroomContext = useContext(UnifiedChatroomContext);

  if (unifiedChatroomContext === undefined) {
    throw new Error("useUnifiedChatroomContext must be used within a UnifiedChatroomProvider");
  }

  return unifiedChatroomContext as UnifiedChatroomContextType;
}
