import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { Invite } from "@/types";
import { useToast, useUserContext } from "@/hooks";

interface useFetchInvitesProps {
  invite: Invite | null;
}

const supabase = createClient();

export function useAcceptInvite({ invite }: useFetchInvitesProps) {
  const { toast } = useToast();
  const { user } = useUserContext();

  const acceptInvite = useCallback(async () => {
    if (!invite || !user) {
      toast({
        title: "Error",
        description: "Invalid invite or user context.",
        variant: "destructive"
      });
      return;
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

      toast({
        title: "Invite Accepted",
        description: `You have successfully joined the chatroom '${invite.chatroomName}'.`,
      });

      return true;
    } catch (error: any) {
      console.error("Error accepting invite:", error);
      toast({
        title: "Error Accepting Invite",
        description: error.message || "An unexpected error occurred while accepting the invite.",
        variant: "destructive",
      });
      return false;
    }
  }, [invite, user, toast]);

  return { acceptInvite };
}
