"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  useChatroomContext,
  useChatroomsContext,
  useLeaveChatroom,
  useUserContext
} from "@/hooks";
import { BaseDialog } from "./base-dialog";

export function LeaveChatroomDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { chatroom } = useChatroomContext();
  const { refresh } = useChatroomsContext();
  const { leaveChatroom, isLoading } = useLeaveChatroom();
  const { user } = useUserContext();
  const router = useRouter();

  const handleLeave = async () => {
    const result = await leaveChatroom({
      userId: user?.userId || "",
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
      title="Leave Chatroom"
      description="Are you sure you want to leave this chatroom? You will no longer receive messages or notifications from this chatroom."
    >
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={ handleLeave } disabled={ isLoading }>
          Leave Chatroom
        </Button>
      </div>
    </BaseDialog>
  );
}
