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
  const { deleteMessage, isDeleting } = useDeleteMessage();
  const { toast } = useToast();

  const handleDelete = async () => {
    const { success, error } = await deleteMessage({ messageId});
    if (success) {
      toast({
        title: "Message Deleted"
      })
      onOpenChange(false);
    } else if (error) {
      toast({
        title: "Error Deleting Message",
        description: error,
        variant: "destructive",
      });
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
        <Button variant="destructive" onClick={ handleDelete } disabled={ isDeleting }>
          Delete
        </Button>
      </div>
    </BaseDialog>
  );
}