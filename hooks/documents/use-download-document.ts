import { useCallback, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useUnifiedChatroomContext } from "@/hooks";

interface useDownloadDocumentProps {
  documentId: string;
}

const supabase = createClient();

export function useDownloadDocument({ documentId }: useDownloadDocumentProps) {
  const { currentChatroom } = useUnifiedChatroomContext();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDocument = useCallback(async () => {
    if (!documentId) {
      return { success: false, error: "Document ID is required."}
    } else if (!currentChatroom?.chatroomId) {
      return { success: false, error: "Chatroom ID is required." }
    }

    setIsDownloading(true);

    try {
      const { data, error } = await supabase.storage
        .from("knowledge-bases")
        .download(`${currentChatroom!.chatroomId}/${documentId}`);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data received from download.");
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data], { type: data.type || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = documentId;  // Use the original documentId
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error downloading document:", error);
      return { success: false, error: error.message || "An unexpected error occurred while downloading the document." };
    } finally {
      setIsDownloading(false);
    }
  }, [documentId, currentChatroom]);

  return { isDownloading, downloadDocument };
}
