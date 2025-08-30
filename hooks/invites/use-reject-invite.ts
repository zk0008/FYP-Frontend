import { useCallback } from "react";

import { useUserContext } from "@/hooks";
import { fetchWithAuth } from "@/utils";

interface rejectInviteProps {
  inviteId: string;
}

export function useRejectInvite() {
  const { user } = useUserContext();

  const rejectInvite = useCallback(async ({ inviteId }: rejectInviteProps) => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    }

    const response = await fetchWithAuth(`/api/invites/reject`, {
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
      return { success: false, error: data?.error || "Failed to reject invite." };
    }

    return { success: true, error: null };
  }, [user]);

  return { rejectInvite };
}
