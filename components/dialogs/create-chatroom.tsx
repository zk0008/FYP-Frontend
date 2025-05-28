"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
    <Dialog open={ open } onOpenChange={ onOpenChange }>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chatroom</DialogTitle>
          <DialogDescription>
            Here you can create a new chatroom to start chatting with your friends.
          </DialogDescription>
        </DialogHeader>

        { children }
      </DialogContent>
    </Dialog>
  );
}