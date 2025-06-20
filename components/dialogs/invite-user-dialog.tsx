"use client";

import { BaseDialog } from "./base-dialog";

import { InviteUserForm } from "@/components/forms/invite-user-form";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({
  open,
  onOpenChange
}: InviteUserDialogProps) {
  const handleFormSuccess = () => {
    onOpenChange(false);    // Close dialog after form submission
  };

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Invite a User"
      description="Here you can invite a user to join the chatroom."
    >
      <InviteUserForm onSuccess={ handleFormSuccess } />
    </BaseDialog>
  );
}
