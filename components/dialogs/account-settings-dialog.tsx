"use client";

import { BaseDialog } from "./base-dialog";

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AccountSettingsDialog({
  open,
  onOpenChange,
  children
} : AccountSettingsDialogProps) {
  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Account Settings"
      description="Here you can manage your account settings and preferences."
    >
      { children }
    </BaseDialog>
  );
}