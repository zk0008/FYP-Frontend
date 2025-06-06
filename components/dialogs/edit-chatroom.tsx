"use client";

import { BaseDialog } from "./base-dialog";

export function EditChatroomDialog({
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
      title="Edit Chatroom"
      description="Here you can edit the details of your chatroom."
    >
      { children }
    </BaseDialog>
  );
}
