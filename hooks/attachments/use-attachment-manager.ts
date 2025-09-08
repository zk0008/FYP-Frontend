import { useCallback } from "react";

import { AttachmentInput } from "@/types";
import { MAX_ATTACHMENTS, MAX_FILE_SIZE_MB } from "@/utils/constants";

interface useAttachmentManagerProps {
  attachments: AttachmentInput[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentInput[]>>;
}

export function useAttachmentManager({ attachments, setAttachments }: useAttachmentManagerProps) {
  const generateUniqueFilename = useCallback((filename: string, existingFilenames: string[]): string => {
    const filenameLower = filename.toLowerCase();
    const existingLower = existingFilenames.map(name => name.toLowerCase());
    
    if (!existingLower.includes(filenameLower)) {
      return filename;
    }

    // Split filename into name and extension
    const lastDotIndex = filename.lastIndexOf('.');
    const name = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
    const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';

    let counter = 1;
    let newFilename: string;
    
    do {
      newFilename = `${name}_${counter}${extension}`;
      counter++;
    } while (existingLower.includes(newFilename.toLowerCase()));

    return newFilename;
  }, []);

  const createFileWithNewName = useCallback((originalFile: File, newFilename: string): File => {
    return new File([originalFile], newFilename, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }, []);

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

    // Generate unique filenames to avoid collisions
    const existingFilenames = attachments.map(att => att.filename);
    const processedFilenames: string[] = [...existingFilenames];

    validFiles.forEach(file => {
      const attachmentId = crypto.randomUUID();

      const uniqueFilename = generateUniqueFilename(file.name, processedFilenames);
      processedFilenames.push(uniqueFilename);

      const renamedFile = createFileWithNewName(file, uniqueFilename);

      const attachedFile: AttachmentInput = {
        attachmentId,
        filename: uniqueFilename,
        file: renamedFile,
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