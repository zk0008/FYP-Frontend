import { useState, useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { MAX_FILE_SIZE_MB } from "@/utils/constants";
import {
  useUnifiedChatroomContext,
  useUserContext,
  useToast
} from "@/hooks";

export function useUploadDocument() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { currentChatroom } = useUnifiedChatroomContext();
  ;;;
  const { user } = useUserContext();
  const { toast } = useToast();

  const validateDocument = useCallback((file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (file.size / 1_000_000 > MAX_FILE_SIZE_MB) {
      return `File size exceeds ${MAX_FILE_SIZE_MB} MB limit. Please upload a smaller file.`;
    }

    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file type. Please upload a PDF, JPEG, or PNG file.";
    }

    return null;
  }, []);

  const uploadToFastAPI = useCallback(async (file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("uploaded_file", file);
      formData.append("uploader_id", user!.userId);
      formData.append("chatroom_id", currentChatroom!.chatroomId);

      const response = await fetchWithAuth("/api/files/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error uploading file:", error.message);

      toast({
        title: "File Upload Error",
        description: error.message || "An error occurred while uploading the file to FastAPI.",
        variant: "destructive"
      });

      return false;
    }
  }, [currentChatroom, user, toast]);

  const uploadDocument = useCallback(async (file: File): Promise<void> => {
    if (!file || !currentChatroom?.chatroomId || !user?.userId) return;

    const validationError = validateDocument(file);
    if (validationError) {
      toast({
        title: "Upload Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const fastAPISuccess = await uploadToFastAPI(file);
      if (!fastAPISuccess) return;

      toast({
        title: "File Upload Started",
        description: "Your file is being processed and will be added to the knowledge base shortly.",
      })

      // Use realtime listening on Supabase to alert user when file has been uploaded and added to knowledge base
    } catch (error: any) {
      console.error("Unexpected error during file upload:", error);

      toast({
        title: "Unexpected Error Uploading File",
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
    uploadDocument,
    uploadMultipleDocuments,
    isUploading,
    validateDocument
  }
}
