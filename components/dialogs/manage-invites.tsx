"use client";

import { BaseDialog } from "./base-dialog";

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
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Manage Pending Invites"
      description="Here you can manage your pending chatroom invites."
    >
      { children }
    </BaseDialog>
  );
}