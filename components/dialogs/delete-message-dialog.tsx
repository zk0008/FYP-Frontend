"use client";

import { Button } from "@/components/ui/button";
import { useDeleteMessage, useToast } from "@/hooks";

import { BaseDialog } from "./base-dialog";

export function DeleteMessageDialog({
  open,
  onOpenChange,
  messageId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
}) {
  const { deleteMessage } = useDeleteMessage({ messageId });
  const { toast } = useToast();

  const handleDelete = async () => {
    const success = await deleteMessage();
    if (success) {
      toast({
        title: "Message Deleted"
      })
      onOpenChange(false);
    }
  };

  return (
    <BaseDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title="Delete Message"
      description="This action cannot be undone."
    >
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={ handleDelete }>
          Delete
        </Button>
      </div>
    </BaseDialog>
  );
}