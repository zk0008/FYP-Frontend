"use client";

import { BaseDialog } from "./base-dialog";

interface CreateChatroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function CreateChatroomDialog({
  open,
  onOpenChange,
  children
}: CreateChatroomDialogProps) {
  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Create New Chatroom"
      description="Here you can create a new chatroom to start chatting with your friends."
    >
      { children }
    </BaseDialog>
  );
}