"use client";

import { Button } from "@/components/ui/button";

import { BaseDialog } from "./base-dialog";

export function LeaveChatroomDialog({
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
      title="Leave Chatroom"
      description="Are you sure you want to leave this chatroom? You will no longer receive messages or notifications from this chatroom."
    >
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => { console.log("Leave chatroom"); }}>
          Leave
        </Button>
      </div>
    </BaseDialog>
  );
}
