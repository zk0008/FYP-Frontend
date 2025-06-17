"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  useUnifiedChatroomContext,
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
  const { refresh, currentChatroom } = useUnifiedChatroomContext();
    const { leaveChatroom, isLoading } = useLeaveChatroom();
  const { user } = useUserContext();
  const router = useRouter();

  const handleLeave = async () => {
    const result = await leaveChatroom({
      userId: user?.userId || "",
      chatroomId: currentChatroom?.chatroomId || "",
      name: currentChatroom?.name || ""
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
      description="This action cannot be undone. You will no longer be able to access it until you have been re-invited."
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
