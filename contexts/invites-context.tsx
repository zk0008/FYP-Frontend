"use client";

import { createContext, useCallback } from "react";

import { Invite, InvitesContextType } from "@/types";
import { useUserContext, useFetchInvites, useRealtimeInvites } from "@/hooks";

export const InvitesContext = createContext<InvitesContextType>({
  invites: [],
  loading: false,
  error: null,
  refresh: () => null,
});

export function InvitesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const {
    pendingInvites: invites,
    loading,
    error,
    refresh,
    addInvite,
    updateInviteStatus
  } = useFetchInvites({ userId: user?.userId || "" });

  const handleNewInvite = useCallback((newInvite: Invite) => {
    addInvite(newInvite);
  }, [addInvite]);

  const handleUpdateInviteStatus = useCallback(({ inviteId, status }: { inviteId: string; status: "PENDING" | "ACCEPTED" | "REJECTED" }) => {
    // Invite status should only be updated from "PENDING" to "ACCEPTED" or "REJECTED", not the other way around
    if (status === "PENDING") return;
    updateInviteStatus(inviteId, status);
  }, [updateInviteStatus]);

  // Subscribe to real-time updates
  useRealtimeInvites({
    userId: user?.userId || "",
    onNewInvite: handleNewInvite,
    onUpdateInvite: handleUpdateInviteStatus
  });

  const contextValue: InvitesContextType = { invites, loading, error, refresh };

  return (
    <InvitesContext.Provider value={ contextValue }>
      { children }
    </InvitesContext.Provider>
  );
}
