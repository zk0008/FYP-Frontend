import { useCallback, useState } from "react";

import { AttachmentInput } from "@/types";
import { useSendMessage } from "@/hooks";

export function useChatInput() {
  const [input, setInput] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
  const { isSubmitting, sendMessage } = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow message sending with empty input only if attachments is not empty
    // if (!input.trim() && attachments.length === 0) return;

    const success = await sendMessage({ content: input.trim(), attachments });

    if (success) {
      setInput("");
      setAttachments([]);
    }
  };

  return {
    input,
    setInput,
    attachments,
    setAttachments,
    isSubmitting,
    handleSubmit
  };
}
