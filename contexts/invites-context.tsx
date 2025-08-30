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
    removeInvite,
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

  const handleDeleteInvite = useCallback((inviteId: string) => {
    // Check if the invite exists in the array
    const inviteExists = invites.some(invite => invite.inviteId === inviteId);

    if (inviteExists) {
      // If the invite exists, remove it from the array
      removeInvite(inviteId);
    }
  }, [invites, removeInvite]);

  // Subscribe to real-time updates
  useRealtimeInvites({
    userId: user?.userId || "",
    onNewInvite: handleNewInvite,
    onUpdateInvite: handleUpdateInviteStatus,
    onDeleteInvite: handleDeleteInvite
  });

  const contextValue: InvitesContextType = { invites, loading, error, refresh };

  return (
    <InvitesContext.Provider value={ contextValue }>
      { children }
    </InvitesContext.Provider>
  );
}
