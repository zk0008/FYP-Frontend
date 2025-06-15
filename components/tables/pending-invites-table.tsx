import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invite } from "@/types";
import { AcceptInviteButton, RejectInviteButton } from "@/components/buttons";

interface PendingInvitesTableProps {
  invites: Invite[];
  onInviteUpdated: () => void;
}

export function PendingInvitesTable({
  invites,
  onInviteUpdated,
}: PendingInvitesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sender</TableHead>
          <TableHead>Chatroom</TableHead>
          <TableHead className="text-center w-8">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={ invite.inviteId }>
            <TableCell>{ invite.senderUsername }</TableCell>
            <TableCell>{ invite.chatroomName }</TableCell>
            <TableCell className="flex justify-end">
              <AcceptInviteButton invite={ invite } onAccepted={ onInviteUpdated } />
              <RejectInviteButton invite={ invite } onRejected={ onInviteUpdated } />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}