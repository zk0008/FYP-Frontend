import { useCallback } from "react";

import { AttachmentInput } from "@/types";
import { MAX_ATTACHMENTS, MAX_FILE_SIZE_MB } from "@/utils/constants";

interface useAttachmentManagerProps {
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
}

export function useAttachmentManager({ attachments, setAttachments }: useAttachmentManagerProps) {
  const addAttachments = useCallback((files: File[]) => {
    // Ensure only max. 5 files are attached
    const remainingSlots = MAX_ATTACHMENTS - attachments.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      return { success: false, error: "Too many files attached. Please remove some files before adding new ones." };
    }

    // Ensure every attached file is less than MAX_FILE_SIZE_MB
    const validFiles: File[] = [];
    const invalidFileNames: string[] = [];

    filesToProcess.forEach(file => {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        invalidFileNames.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFileNames.length > 0) {
      return { success: false, error: `The following files exceed the ${MAX_FILE_SIZE_MB} MB limit: ${invalidFileNames.join(', ')}` };
    }

    validFiles.forEach(file => {
      const attachmentId = crypto.randomUUID();

      const attachedFile: AttachmentInput = {
        attachmentId,
        filename: file.name,
        file,
      };

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments(prev =>
            prev.map(f =>
              f.attachmentId === attachmentId
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachments(prev => [...prev, attachedFile]);
    });

    return { success: true };
  }, [attachments, setAttachments]);

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments(prev => prev.filter(file => file.attachmentId !== attachmentId));
  }, [setAttachments]);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, [setAttachments]);

  return {
    addAttachments,
    removeAttachment,
    clearAttachments,
  };
}