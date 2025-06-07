"use client";

import { BaseDialog } from "./base-dialog";

import { EditChatroomForm } from "@/components/forms/edit-chatroom-form";

export function EditChatroomDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void
}) {
  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Edit Chatroom"
      description="Here you can edit the details of your chatroom."
    >
      <EditChatroomForm />
    </BaseDialog>
  );
}
