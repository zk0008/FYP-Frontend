"use client";

import { BaseDialog } from "./base-dialog";

export function InviteUserDialog({
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
      title="Invite a User"
      description="Here you can invite a user to join your chatroom."
    >
      { children }
    </BaseDialog>
  );
}
