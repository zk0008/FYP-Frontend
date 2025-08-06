import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { Invite } from "@/types";
import { useUserContext } from "@/hooks";

interface useRejectInviteProps {
  invite: Invite | null;
}

const supabase = createClient();

export function useRejectInvite({ invite }: useRejectInviteProps) {
  const { user } = useUserContext();

  const rejectInvite = useCallback(async () => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    } else if (!invite) {
      return { success: false, error: "Invalid invite." };
    }

    try {
      // Update invite status to REJECTED
      const { error } = await supabase
        .from("invites")
        .update({ status: "REJECTED" })
        .eq("invite_id", invite.inviteId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error rejecting invite:", error);
      return { success: false, error: error.message || "Failed to reject the invite." };
    }
  }, [invite, user]);

  return { rejectInvite };
}
