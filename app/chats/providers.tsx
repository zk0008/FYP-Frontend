"use client";

import {
  InvitesProvider,
  UnifiedChatroomProvider,
  UserProvider
} from "@/contexts"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <InvitesProvider>
        <UnifiedChatroomProvider>
          { children }
        </UnifiedChatroomProvider>
      </InvitesProvider>
    </UserProvider>
  )
}
