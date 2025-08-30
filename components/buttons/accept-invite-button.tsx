import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Invite } from "@/types";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useAcceptInvite, useToast, useUnifiedChatroomContext } from "@/hooks";

interface AcceptInviteButtonProps {
  invite: Invite;
  onAccepted: () => void;
}

export function AcceptInviteButton({
  invite,
  onAccepted
}: AcceptInviteButtonProps) {
  const { acceptInvite } = useAcceptInvite();
  const { toast } = useToast();
  const { refresh: refreshChatrooms } = useUnifiedChatroomContext();

  const handleAccept = async () => {
    const { success, error } = await acceptInvite({ inviteId: invite.inviteId });

    if (success) {
      toast({
        title: "Invite Accepted",
        description: `You have successfully joined the chatroom '${invite.chatroomName}'.`
      })

      refreshChatrooms();
      onAccepted();  // Refreshes invite list
    } else if (error) {
      toast({
        title: "Error Accepting Invite",
        description: error,
        variant: "destructive"
      });
    }
  };

  return (
    <TooltipWrapper content="Accept Invite">
      <Button
        variant="ghost"
        size="icon"
        onClick={ handleAccept }
      >
        <Check className="h-4 w-4 text-green-500" />
      </Button>
    </TooltipWrapper>
  );
}
