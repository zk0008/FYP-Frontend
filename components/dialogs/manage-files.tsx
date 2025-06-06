"use client";

import { BaseDialog } from "./base-dialog";

export function ManageFilesDialog({
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
      title="Manage Uploaded Files"
      description="Here you can manage files uploaded in the chatroom."
    >
      { children }
    </BaseDialog>
  );
}
