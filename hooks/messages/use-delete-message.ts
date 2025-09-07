import { useCallback, useState } from "react";

import { fetchWithAuth } from "@/utils";

interface deleteMessageProps {
  messageId: string;
}

export function useDeleteMessage() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMessage = useCallback(async ({ messageId }: deleteMessageProps) => {
    setIsDeleting(true);
    const response = await fetchWithAuth(`/api/messages/${messageId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    setIsDeleting(false);

    if (!response.ok) {
      console.error("Error deleting message:", data.detail);
      return { success: false, error: data.detail || "Failed to delete message." };
    }

    return { success: true, error: null };
  }, []);

  return { deleteMessage, isDeleting };
}
