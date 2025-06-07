"use client";

import { useContext } from "react";

import { Chatroom } from "@/types";
import { ChatroomContext } from "@/contexts/chatroom-context";

interface ChatroomContextType {
  chatroom: Chatroom | null;
  refresh: () => null;
}

export function useChatroomContext(): ChatroomContextType {
  const chatroomContext = useContext(ChatroomContext);

  if (chatroomContext === undefined) {
    throw new Error("useChatroomContext must be used within a ChatroomProvider");
  }

  return chatroomContext as ChatroomContextType;
}
