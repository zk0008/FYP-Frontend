"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";

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
    <Dialog open={ open } onOpenChange={ onOpenChange }>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Here you can manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        { children }
      </DialogContent>
    </Dialog>
  );
}