import { useCallback, useEffect, useState } from "react";

import { Document } from "@/types";
import { fetchWithAuth } from "@/utils";

import { useUnifiedChatroomContext } from "@/hooks";

export function useFetchDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentChatroom } = useUnifiedChatroomContext();

  const fetchDocuments = useCallback(async () => {
    if (!currentChatroom || !currentChatroom.chatroomId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setDocuments([]);
    setLoading(true);
    setError(null);

    const response = await fetchWithAuth(`/api/documents?chatroom_id=${currentChatroom.chatroomId}`, {
      method: "GET"
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching documents:", data.detail);
      setError(data.detail);
      setLoading(false);
      return;
    }

    if (data) {
      const documentsData = data.map((item: any) => ({
        documentId: item.document_id,
        filename: item.filename,
        username: item?.uploader_username || "[deleted]",
        uploadedAt: new Date(item.uploaded_at).toISOString()
      }));

      setDocuments(documentsData);
      setLoading(false);
    }
  }, [currentChatroom]);

  useEffect(() => {
    fetchDocuments();
  }, [currentChatroom, fetchDocuments]);

  return { documents, loading, error, refresh: fetchDocuments };
}
