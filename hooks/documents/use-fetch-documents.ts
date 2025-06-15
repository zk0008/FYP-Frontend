import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { Document } from "@/types";

const supabase = createClient();

export function useFetchDocuments(chatroomId: string) {
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

    try {
      const { data, error } = await supabase
        .from("documents")
        .select(`
          document_id,
          filename,
          users (
            username
          ),
          uploaded_at
        `)
        .eq("chatroom_id", chatroomId)
        .order("uploaded_at", { ascending: false });    // Newest documents first

      if (error) {
        throw new Error(error.message);
      }

      const formattedDocuments = data.map((doc: any) => ({
        documentId: doc.document_id,
        filename: doc.filename,
        username: doc.users.username,
        uploadedAt: new Date(doc.uploaded_at).toISOString(),
      }));

      setDocuments(formattedDocuments);
    } catch (error: any) {
      console.error("Error fetching documents:", error.message);
      setError(error.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [chatroomId]);

  useEffect(() => {
    fetchDocuments();
  }, [chatroomId, fetchDocuments]);

  return { documents, loading, error, refresh: fetchDocuments };
}
