// Reject invite: change invite status to "REJECTED" based on inviteId, update invites context (invites context should only hold the list of pending invites)

import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { Invite } from "@/types";
import { useToast, useUserContext } from "@/hooks";

const supabase = createClient();

interface RejectInviteParams {
  invite: Invite;
}

export function useRejectInvite({ invite }: RejectInviteParams) {
  const { toast } = useToast();
  const { user } = useUserContext();

  const rejectInvite = useCallback(async () => {
    if (!invite || !user) {
      toast({
        title: "Error",
        description: "Invalid invite or user context.",
        variant: "destructive"
      });
      return;
    }

    console.log("Rejecting invite:", invite, "for user:", user);

    try {
      // Update invite status to REJECTED
      const { error } = await supabase
        .from("invites")
        .update({ status: "REJECTED" })
        .eq("invite_id", invite.inviteId);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Invite Rejected",
        description: `You have rejected the invite from '${invite.senderUsername}' to chatroom '${invite.chatroomName}'.`,
      });

      return true;
    } catch (error: any) {
      console.error("Error rejecting invite:", error);
      toast({
        title: "Error Rejecting Invite",
        description: error.message || "Failed to reject the invite.",
        variant: "destructive"
      });
      return false;
    }
  }, [invite, user, toast]);

  return { rejectInvite };
}
