"use client";

import { useContext } from "react";

import { Invite, InvitesContextType } from "@/types";
import { InvitesContext } from "@/contexts";

export function useInvitesContext(): InvitesContextType {
  const invitesContext = useContext(InvitesContext);

  if (invitesContext === undefined) {
    throw new Error("useInvitesContext must be used within an InvitesProvider");
  }

  return invitesContext as InvitesContextType;
}
