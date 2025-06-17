"use client";

import {
  ChatroomProvider,
  ChatroomsProvider,
  InvitesProvider,
  UnifiedChatroomProvider,
  UserProvider
} from "@/contexts"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <InvitesProvider>
        <UnifiedChatroomProvider>
        {/* <ChatroomsProvider>
          <ChatroomProvider chatroomId={ chatroomId }> */}
            { children }
          {/* </ChatroomProvider>
        </ChatroomsProvider> */}
        </UnifiedChatroomProvider>
      </InvitesProvider>
    </UserProvider>
  )
}
