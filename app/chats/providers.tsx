"use client";

import {
  ChatroomProvider,
  ChatroomsProvider,
  InvitesProvider,
  UserProvider
} from "@/contexts"

import { useSearchParams } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const chatroomId = searchParams.get("chatroom-id") || ""

  return (
    <UserProvider>
      <InvitesProvider>
        <ChatroomsProvider>
          <ChatroomProvider chatroomId={ chatroomId }>
            { children }
          </ChatroomProvider>
        </ChatroomsProvider>
      </InvitesProvider>
    </UserProvider>
  )
}
