import { useCallback, useState } from "react";

import { fetchWithAuth } from "@/utils";

interface deleteDocumentProps {
  documentId: string;
}

export function useDeleteDocument() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDocument = useCallback(async ({ documentId }: deleteDocumentProps) => {
    if (!documentId) {
      return { success: false, error: "Document ID is required." };
    }

    setIsDeleting(true);
    const response = await fetchWithAuth(`/api/documents/${documentId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    setIsDeleting(false);

    if (!response.ok) {
      console.error("Error deleting document:", data.detail);
      return { success: false, error: data.detail || "Failed to delete document." };
    }

    return { success: true, error: null };
  }, []);

  return { deleteDocument, isDeleting };
}
