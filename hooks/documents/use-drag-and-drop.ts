
import { useCallback, useState } from "react";;

import { useUploadDocument } from "./use-upload-document";

export function useDragAndDrop() {
  const { uploadDocument, uploadMultipleDocuments } = useUploadDocument();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files.length === 1) {
      uploadDocument(files[0]);
    } else if (files.length > 1) {
      uploadMultipleDocuments(Array.from(files));
    }
  }, [uploadDocument, uploadMultipleDocuments]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  return {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  };
}
