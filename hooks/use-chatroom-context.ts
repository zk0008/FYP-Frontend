"use client";

import { useContext } from "react";

import { Chatroom } from "@/types";
import { ChatroomContext } from "@/contexts/chatroom-context";

export function useChatroomContext(): Chatroom | null {
  const chatroomContext = useContext(ChatroomContext);

  if (chatroomContext === undefined) {
    throw new Error("useChatroomContext must be used within a ChatroomProvider");
  }

  return chatroomContext;
}
