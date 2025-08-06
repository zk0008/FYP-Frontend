import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { useUnifiedChatroomContext, useToast } from "@/hooks";

interface deleteDocumentProps {
  documentId: string;
  filename: string;
}

const supabase = createClient();

export function useDeleteDocument() {
  const { currentChatroom } = useUnifiedChatroomContext();
  const { toast } = useToast();

  const deleteDocumentEntry = useCallback(async (documentId: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("document_id", documentId);
  
      if (error) {
        throw new Error(error.message);
      }
  
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting document:", error);
      return { success: false, error: error.message || "An unexpected error occurred when deleting document entry from Supabase." };
    }
  }, []);

  const deleteDocumentFile = useCallback(async (filename: string) => {
    try {
      const { error } = await supabase.storage
        .from("uploaded-documents")
        .remove([`${currentChatroom!.chatroomId}/${filename}`]);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting document file:", error);
      toast({
        title: "Error Deleting Document File",
        description: error.message || "An unexpected error occurred when deleting document file from Supabase Storage.",
        variant: "destructive",
      });
      return { success: false, error: error.message || "An unexpected error occurred when deleting document file from Supabase Storage." };
    }
  }, [currentChatroom]);

  const deleteDocument = useCallback(async ({
    documentId,
    filename
  }: deleteDocumentProps) => {
    if (!documentId) {
      return { success: false, error: "Document ID is required." };
    } else if (!currentChatroom?.chatroomId) {
      return { success: false, error: "Current chatroom context is not available." };
    }

    const [
      { success: entryDeleted, error: entryError },
      { success: fileDeleted, error: fileError }
    ] = await Promise.all([
      deleteDocumentEntry(documentId),
      deleteDocumentFile(filename),
    ]);

    if (entryDeleted && fileDeleted) {
      return { success: true, error: null };
    }

    return { success: false, error: entryError || fileError || "An unexpected error occurred while deleting the document." };

  }, [deleteDocumentEntry, deleteDocumentFile, currentChatroom, toast]);

  return { deleteDocument, deleteDocumentEntry, deleteDocumentFile };
}