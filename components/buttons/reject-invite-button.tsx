import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Invite } from "@/types";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useRejectInvite, useToast } from "@/hooks";

interface RejectInviteButtonProps {
  invite: Invite;
  onRejected: () => void;
}

export function RejectInviteButton({
  invite,
  onRejected
}: RejectInviteButtonProps) {
  const { rejectInvite } = useRejectInvite();
  const { toast } = useToast();

  const handleReject = async () => {
    const { success, error } = await rejectInvite({ inviteId: invite.inviteId });

    if (success) {
      toast({
        title: "Invite Rejected",
        description: `You have rejected the invite from '${invite.senderUsername}' to chatroom '${invite.chatroomName}'.`,
      });
      onRejected();   // Refreshes invite list
    }
    else if (error) {
      toast({
        title: "Error Rejecting Invite",
        description: error,
        variant: "destructive"
      });
    }
  };

  return (
    <TooltipWrapper content="Reject Invite">
      <Button
        variant="ghost"
        size="icon"
        onClick={ handleReject }
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </TooltipWrapper>
  );
}
