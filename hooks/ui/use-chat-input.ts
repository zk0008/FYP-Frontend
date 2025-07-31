import { useState, useCallback } from "react";

import { useSendMessage } from "@/hooks";

export function useChatInput() {
  const [input, setInput] = useState<string>("");
  const { isSubmitting, sendMessage } = useSendMessage();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const success = await sendMessage({ content: input.trim() });

    if (success) {
      setInput("");   // Clear input
    }
  }, [input, sendMessage]);

  return {
    input,
    setInput,
    isSubmitting,
    handleSubmit
  };
}
