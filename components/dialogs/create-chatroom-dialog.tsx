"use client";

import { BaseDialog } from "./base-dialog";

import { CreateChatroomForm } from "@/components/forms";

interface CreateChatroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChatroomDialog({
  open,
  onOpenChange
}: CreateChatroomDialogProps) {
  const handleFormSuccess = () => {
    onOpenChange(false);  // Close dialog after form submission
  };

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Create New Chatroom"
      description="Here you can create a new chatroom to start chatting with your friends."
    >
      <CreateChatroomForm onSuccess={ handleFormSuccess } />
    </BaseDialog>
  );
}