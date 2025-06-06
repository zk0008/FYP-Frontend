
import { useCallback, useState } from "react";;

import { useUploadFile } from "./use-upload-file";

export function useDragAndDrop() {
  const { uploadFile, uploadMultipleFiles } = useUploadFile();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files.length === 1) {
      uploadFile(files[0]);
    } else if (files.length > 1) {
      uploadMultipleFiles(Array.from(files));
    }
  }, [uploadFile, uploadMultipleFiles]);

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
