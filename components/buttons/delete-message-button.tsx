"use client";

import { Trash } from "lucide-react";
import { useState } from "react";

import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import { DeleteMessageDialog } from "@/components/dialogs";

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <ChatBubbleAction
        onClick={() => setIsDialogOpen(true)}
        className="cursor-pointer"
        key={ `delete-${messageId}` }
        icon={ <Trash className="h-4 w-4 text-red-500" /> }
        title="Delete message"
      />
      <DeleteMessageDialog
        open={ isDialogOpen }
        onOpenChange={ setIsDialogOpen }
        messageId={ messageId }
      />
    </>
  );
}
