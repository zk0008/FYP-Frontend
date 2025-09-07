import { useState } from "react";

import { AttachmentInput } from "@/types";
import { useSendMessage, useToast } from "@/hooks";

export function useChatInput() {
  const [input, setInput] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);

  const { isSending, sendMessage } = useSendMessage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, error } = await sendMessage({ content: input.trim(), attachments });

    if (success) {
      setInput("");
      setAttachments([]);
    } else if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: error || "An error occurred when sending the message.",
        variant: "destructive"
      });
    }
  };

  return {
    input,
    setInput,
    attachments,
    setAttachments,
    isSending,
    handleSubmit
  };
}
