import { useState, useCallback } from "react";

import { useSendMessage } from "@/hooks";

export function useChatInput() {
  const [input, setInput] = useState<string>("");
  const [useRagQuery, setUseRagQuery] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const { isSubmitting, sendMessage } = useSendMessage();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const success = await sendMessage({
      useRagQuery,
      useWebSearch,
      content: input.trim()
    });

    if (success) {
      setInput("");   // Clear input
      setUseRagQuery(false);
      setUseWebSearch(false);
    }
  }, [input, useRagQuery, useWebSearch, sendMessage]);

  return {
    input,
    setInput,
    useRagQuery,
    setUseRagQuery,
    useWebSearch,
    setUseWebSearch,
    isSubmitting,
    handleSubmit
  };
}
