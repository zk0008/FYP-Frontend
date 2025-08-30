import { useState, useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { validateFile } from "@/utils";
import {
  useUnifiedChatroomContext,
  useUserContext,
  useToast
} from "@/hooks";

export function useUploadDocument() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { currentChatroom } = useUnifiedChatroomContext();
  const { user } = useUserContext();
  const { toast } = useToast();

  const uploadDocument = useCallback(async (file: File): Promise<void> => {
    if (!file || !currentChatroom?.chatroomId || !user?.userId) return;

    const { isValid, errorMessage } = validateFile(file);
    if (!isValid) {
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("uploaded_document", file);
      formData.append("uploader_id", user!.userId);

      const response = await fetchWithAuth(`/api/documents/${currentChatroom.chatroomId}`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      toast({
        title: "Document Upload Started",
        description: "Your document is being processed and will be added to the knowledge base shortly.",
      });

      // Use realtime listening on Supabase to alert user when document has been uploaded and added to knowledge base
    } catch (error: any) {
      console.error("Unexpected error during document upload:", error);

      toast({
        title: "Unexpected Error Uploading Document",
        description: error.message || "Something went wrong. Please try again",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [currentChatroom, user, toast]);

  const uploadMultipleDocuments = useCallback(async (files: File[]): Promise<void> => {
    for (let i = 0; i < files.length; i++) {
      await uploadDocument(files[i]);
    }
  }, [uploadDocument]);

  return {
    isUploading,
    uploadDocument,
    uploadMultipleDocuments
  };
}
