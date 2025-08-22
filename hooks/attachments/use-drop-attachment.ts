import { useCallback, useState } from "react";

import { AttachmentInput } from "@/types";
import { useAttachmentManager } from "./use-attachment-manager";

interface useDropAttachmentProps {
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
}

export function useDropAttachment({ attachments, setAttachments }: useDropAttachmentProps) {
  const { addAttachments } = useAttachmentManager({ attachments, setAttachments });
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = useCallback((files: File[]) => {
    setIsDragging(false);
    addAttachments(files);
  }, [addAttachments]);

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
    handleFileDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  };
}
