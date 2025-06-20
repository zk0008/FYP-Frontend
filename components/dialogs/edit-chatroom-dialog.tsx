"use client";

import { BaseDialog } from "./base-dialog";

import { EditChatroomForm } from "@/components/forms";

interface EditChatroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditChatroomDialog({
  open,
  onOpenChange
}: EditChatroomDialogProps) {
  const handleFormSuccess = () => {
    onOpenChange(false);    // Close dialog after form submission
  };

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Edit Chatroom"
      description="Here you can edit the details of the chatroom."
    >
      <EditChatroomForm onSuccess={ handleFormSuccess } />
    </BaseDialog>
  );
}
