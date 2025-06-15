"use client";

import { useContext } from "react";

import { Invite } from "@/types";
import { InvitesContext } from "@/contexts";

interface InvitesContextType {
  invites: Invite[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useInvitesContext(): InvitesContextType {
  const invitesContext = useContext(InvitesContext);

  if (invitesContext === undefined) {
    throw new Error("useInvitesContext must be used within an InvitesProvider");
  }

  return invitesContext as InvitesContextType;
}
