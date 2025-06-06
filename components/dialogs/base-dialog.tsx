"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  children
} : BaseDialogProps) {
  return (
    <Dialog open={ open } onOpenChange={ onOpenChange }>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ title }</DialogTitle>
          <DialogDescription>{ description }</DialogDescription>
        </DialogHeader>

        { children }
      </DialogContent>
    </Dialog>
  );
}