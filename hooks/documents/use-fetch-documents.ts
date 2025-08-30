import { useCallback, useEffect, useState } from "react";

import { Document } from "@/types";
import { fetchWithAuth } from "@/utils";

interface useFetchDocumentsProps {
  chatroomId: string;
}

export function useFetchDocuments({ chatroomId }: useFetchDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!chatroomId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setDocuments([]);
    setLoading(true);
    setError(null);

    const response = await fetchWithAuth(`/api/documents/${chatroomId}`, {
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
        username: item.uploader_username,
        uploadedAt: new Date(item.uploaded_at).toISOString()
      }));

      setDocuments(documentsData);
      setLoading(false);
    }
  }, [chatroomId]);

  useEffect(() => {
    fetchDocuments();
  }, [chatroomId, fetchDocuments]);

  return { documents, loading, error, refresh: fetchDocuments };
}
