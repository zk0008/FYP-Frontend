import { useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUserContext } from "@/hooks";

interface acceptInviteProps {
  inviteId: string;
}

export function useAcceptInvite() {
  const { user } = useUserContext();

  const acceptInvite = useCallback(async ({ inviteId }: acceptInviteProps) => {
    if (!user) {
      return { success: false, error: "User context is not available." }
    }

    const response = await fetchWithAuth(`/api/invites/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.userId,
        invite_id: inviteId
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error accepting invite:", data.detail);
      return { success: false, error: data.detail || "Failed to accept invite." };
    }

    return { success: true, error: null };
  }, [user]);

  return { acceptInvite };
}
