import { useCallback, useEffect, useMemo, useState } from "react";

import { Document } from "@/types";

import { useFetchDocuments } from "./use-fetch-documents";
import { useRealtimeDocuments } from "./use-realtime-documents";

interface useDocumentsWithRealtimeProps {
  chatroomId: string;
}

export function useDocumentsWithRealtime({ chatroomId }: useDocumentsWithRealtimeProps) {
  const { documents: initialDocuments, loading, error, refresh } = useFetchDocuments({ chatroomId });
  const [realtimeDocuments, setRealtimeDocuments] = useState<Document[]>(initialDocuments);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<Set<string>>(new Set());

  // Reset states when chatroomId changes
  useEffect(() => {
    setRealtimeDocuments([]);
    setDeletedDocumentIds(new Set());
  }, [chatroomId]);

  const handleNewDocument = useCallback((newDocument: Document) => {
    setRealtimeDocuments((prevDocuments) => {
      // Check if the document already exists
      const exists = prevDocuments.some((doc) => doc.documentId === newDocument.documentId);
      if (!exists) {
        return [...prevDocuments, newDocument];
      }
      return prevDocuments;
    });
  }, []);

  const handleDeleteDocument = useCallback((documentId: string) => {
    setRealtimeDocuments((prevDocuments) => {
      // Check if the document exists in the array
      const documentExists = prevDocuments.some((doc) => doc.documentId === documentId);

      if (documentExists) {
        setDeletedDocumentIds((prevIds) => new Set(prevIds).add(documentId));
        return prevDocuments.filter((doc) => doc.documentId !== documentId);
      }

      return prevDocuments;
    });
  }, []);

  useRealtimeDocuments({
    chatroomId,
    onNewDocument: handleNewDocument,
    onDeleteDocument: handleDeleteDocument
  })

  // Combine initial documents with realtime documents
  const allDocuments = useMemo(() => {
    const documentsMap = new Map<string, Document>();

    // Add initial documents (excluding deleted ones)
    initialDocuments.forEach((doc) => {
      if (!deletedDocumentIds.has(doc.documentId)) {
        documentsMap.set(doc.documentId, doc);
      }
    });

    // Add realtime documents (deleted ones are already filtered out)
    realtimeDocuments.forEach((doc) => {
      documentsMap.set(doc.documentId, doc);
    });

    return Array.from(documentsMap.values()).sort(
      (a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
    );
  }, [initialDocuments, realtimeDocuments, deletedDocumentIds]);

  return { documents: allDocuments, loading, error, refresh };
}
