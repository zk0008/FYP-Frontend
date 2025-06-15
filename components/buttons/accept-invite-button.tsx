import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Invite } from "@/types";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useAcceptInvite, useChatroomsContext } from "@/hooks";

interface AcceptInviteButtonProps {
  invite: Invite;
  onAccepted: () => void;
}

export function AcceptInviteButton({
  invite,
  onAccepted
}: AcceptInviteButtonProps) {
  const { acceptInvite } = useAcceptInvite({ invite });
  const { refresh: refreshChatrooms } = useChatroomsContext();

  const handleAccept = async () => {
    await acceptInvite();
    refreshChatrooms();
    onAccepted();   // Refreshes invite list
  };

  return (
    <TooltipWrapper content="Accept Invite">
      <Button
        variant="ghost"
        size="icon"
        onClick={ handleAccept }
      >
        <Check className="h-4 w-4" />
      </Button>
    </TooltipWrapper>
  );
}
