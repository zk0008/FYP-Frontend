"use client";

import { Button } from "@/components/ui/button";

import { BaseDialog } from "./base-dialog";

export function DeleteChatroomDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Delete Chatroom"
      description="This action cannot be undone. All messages sent and files uploaded in this chatroom will be permanently deleted."
    >
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => console.log("Delete chatroom")}>
          Delete
        </Button>
      </div>
    </BaseDialog>
  );
}