"use client";

import { ChatroomProvider } from "@/contexts/chatroom-context"
import { UserProvider } from "@/contexts/user-context"

import { useSearchParams } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const chatroomId = searchParams.get("chatroom-id") || ""

  return (
    <UserProvider>
      <ChatroomProvider chatroomId={ chatroomId }>
        { children }
      </ChatroomProvider>
    </UserProvider>
  )
}
