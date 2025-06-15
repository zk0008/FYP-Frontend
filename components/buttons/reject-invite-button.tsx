import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Invite } from "@/types";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useRejectInvite } from "@/hooks";

interface RejectInviteButtonProps {
  invite: Invite;
  onRejected: () => void;
}

export function RejectInviteButton({
  invite,
  onRejected
}: RejectInviteButtonProps) {
  const { rejectInvite } = useRejectInvite({ invite });

  const handleReject = async () => {
    await rejectInvite();
    onRejected();   // Refreshes invite list
  };

  return (
    <TooltipWrapper content="Reject Invite">
      <Button
        variant="ghost"
        size="icon"
        onClick={ handleReject }
      >
        <X className="h-4 w-4" />
      </Button>
    </TooltipWrapper>
  );
}
