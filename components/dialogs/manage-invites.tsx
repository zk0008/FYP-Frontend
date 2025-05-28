"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function ManageInvitesDialog({
  open,
  onOpenChange,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={ open } onOpenChange={ onOpenChange }>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Pending Invites</DialogTitle>
          <DialogDescription>
            Here you can manage your pending chatroom invites.
          </DialogDescription>
        </DialogHeader>

        { children }
      </DialogContent>
    </Dialog>
  );
}