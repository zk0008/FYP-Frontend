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

    const formData = new FormData();
    formData.append("uploaded_document", file);
    formData.append("chatroom_id", currentChatroom.chatroomId);

    const response = await fetchWithAuth(`/api/documents`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error uploading document:", data.detail);
      setIsUploading(false);

      toast({
        title: "Error Uploading Document",
        description: data.detail || "Failed to upload document.",
        variant: "destructive"
      });

      return;
    }

    setIsUploading(false);
    toast({
      title: "Document Upload Started",
      description: "Your document is being processed and will be added to the knowledge base shortly.",
    });

    // Use realtime listening on Supabase to alert user when document has been uploaded and added to knowledge base
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
