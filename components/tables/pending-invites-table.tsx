import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invite } from "@/types";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { useToast, useUnifiedChatroomContext, useUpdateInvite } from "@/hooks";

interface PendingInvitesTableProps {
  invites: Invite[];
  onInviteUpdated: () => void;
  maxHeight?: string;
}

export function PendingInvitesTable({
  invites,
  onInviteUpdated,
  maxHeight = "200px",
}: PendingInvitesTableProps) {
  const { toast } = useToast();
  const { refresh: refreshChatrooms } = useUnifiedChatroomContext();
  const { updateInvite, isUpdating } = useUpdateInvite();

  const handleAcceptInvite = async (invite: Invite) => {
    const { success, error } = await updateInvite({ inviteId: invite.inviteId, status: "ACCEPTED" });

    if (success) {
      toast({
        title: "Invite Accepted",
        description: `You have successfully joined the chatroom '${invite.chatroomName}'`
      });

      refreshChatrooms();
      onInviteUpdated();
    } else {
      toast({
        title: "Error",
        description: `Failed to accept invite: ${error}`
      });
    }
  }

  const handleRejectInvite = async (invite: Invite) => {
    const { success, error } = await updateInvite({ inviteId: invite.inviteId, status: "REJECTED" });

    if (success) {
      toast({
        title: "Invite Rejected",
        description: `You have rejected the invite from '${invite.senderUsername}' to chatroom '${invite.chatroomName}'.`
      });

      refreshChatrooms();
      onInviteUpdated();
    } else {
      toast({
        title: "Error",
        description: `Failed to reject invite: ${error}`
      });
    }
  }

  return (
    <div className="border rounded-md">
      <div className="border-b">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5 cursor-default">Sender</TableHead>
              <TableHead className="w-2/5 cursor-default">Chatroom</TableHead>
              <TableHead className="w-1/5 text-center cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        <Table>
          <TableBody>
            {invites.length !== 0 ? (
              invites.map((invite, index) => (
                <TableRow key={ index }>
                  <TooltipWrapper content={ invite.senderUsername }>
                    <TableCell className="w-2/5 max-w-0 truncate cursor-default">{ invite.senderUsername }</TableCell>
                  </TooltipWrapper>

                  <TooltipWrapper content={ invite.chatroomName }>
                    <TableCell className="w-2/5 max-w-0 truncate cursor-default">{ invite.chatroomName }</TableCell>
                  </TooltipWrapper>

                  <TableCell className="w-1/5">
                    <div className="flex justify-center">
                      <TooltipWrapper content="Accept Invite">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAcceptInvite(invite)}
                          disabled={ isUpdating }
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      </TooltipWrapper>

                      <TooltipWrapper content="Reject Invite">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRejectInvite(invite)}
                          disabled={ isUpdating }
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </TooltipWrapper>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={ 3 } className="text-center text-muted-foreground py-4">
                  No pending invites
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}