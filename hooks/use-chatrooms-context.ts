"use client";

import { useContext } from "react";

import { Chatroom } from "@/types";
import { ChatroomsContext } from "@/contexts";

interface ChatroomsContextType {
  chatrooms: Chatroom[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => null;
}

export function useChatroomsContext(): ChatroomsContextType {
  const chatroomsContext = useContext(ChatroomsContext);

  if (chatroomsContext === undefined) {
    throw new Error("useChatroomsContext must be used within a ChatroomsProvider");
  }

  return chatroomsContext as ChatroomsContextType;
}
