import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { Invite } from "@/types";
import { AcceptInviteButton, RejectInviteButton } from "@/components/buttons";

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
                      <AcceptInviteButton invite={ invite } onAccepted={ onInviteUpdated } />
                      <RejectInviteButton invite={ invite } onRejected={ onInviteUpdated } />
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