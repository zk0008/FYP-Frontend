import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { Invite } from "@/types";
import { useUserContext } from "@/hooks";

interface useFetchInvitesProps {
  invite: Invite | null;
}

const supabase = createClient();

export function useAcceptInvite({ invite }: useFetchInvitesProps) {
  const { user } = useUserContext();

  const acceptInvite = useCallback(async () => {
    if (!user) {
      return { success: false, error: "User context is not available."}
    } else if (!invite) {
      return { success: false, error: "Invalid invite." }
    }

    try {
      // Update invite status to ACCEPTED
      const { error: updateError } = await supabase
        .from("invites")
        .update({ status: "ACCEPTED" })
        .eq("invite_id", invite.inviteId);

      // Add entry to members table
      const { error: memberError } = await supabase
        .from("members")
        .insert({
          user_id: user.userId,
          chatroom_id: invite.chatroomId,
        });

      if (updateError || memberError) {
        throw new Error(updateError?.message || memberError?.message || "Failed to accept invite.");
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error accepting invite:", error);
      return { success: false, error: error.message || "An unexpected error occurred while accepting the invite." };
    }
  }, [invite, user]);

  return { acceptInvite };
}
