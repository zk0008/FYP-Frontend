import { useCallback, useState } from "react";

import { fetchWithAuth } from "@/utils";

interface updateInviteProps {
  inviteId: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
}

export function useUpdateInvite() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateInvite = useCallback(async ({ inviteId, status }: updateInviteProps) => {
    setIsUpdating(true);
    const response = await fetchWithAuth(`/api/invites/${inviteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: status
      }),
    });
    const data = await response.json();
    setIsUpdating(false);

    if (!response.ok) {
      console.error("Error updating invite:", data.detail);
      return { success: false, error: data.detail || "Failed to update invite." };
    }

    return { success: true, error: null };
  }, []);

  return { updateInvite, isUpdating };
}
