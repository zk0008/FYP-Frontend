"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  useChatroomContext,
  useChatroomsContext,
  useDeleteChatroom
} from "@/hooks";

import { BaseDialog } from "./base-dialog";

export function DeleteChatroomDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { chatroom } = useChatroomContext();
  const { refresh } = useChatroomsContext();
  const { deleteChatroom, isLoading } = useDeleteChatroom();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteChatroom({
      chatroomId: chatroom?.chatroomId || "",
      name: chatroom?.name || ""
    });

    if (result.success) {
      refresh();                // Refresh chatrooms list
      onOpenChange(false);      // Close dialog
      router.push("/chats");    // Exit chatroom
    }
  };

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
        <Button variant="destructive" onClick={ handleDelete } disabled={ isLoading }>
          { isLoading ? "Deleting..." : "Delete Chatroom" }
        </Button>
      </div>
    </BaseDialog>
  );
}