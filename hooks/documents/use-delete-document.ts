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
  
      return true;
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error Deleting Document Entry",
        description: error.message || "An unexpected error occurred when deleting document entry from Supabase.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const deleteDocumentFile = useCallback(async (filename: string) => {
    try {
      const { error } = await supabase.storage
        .from("uploaded-documents")
        .remove([`${currentChatroom!.chatroomId}/${filename}`]);

      if (error) {
        throw new Error(error.message);
      }
  
      return true;
    } catch (error: any) {
      console.error("Error deleting document file:", error);
      toast({
        title: "Error Deleting Document File",
        description: error.message || "An unexpected error occurred when deleting document file from Supabase Storage.",
        variant: "destructive",
      });
      return false;
    }
  }, [currentChatroom, toast]);

  const deleteDocument = useCallback(async ({
    documentId,
    filename
  }: deleteDocumentProps) => {
    if (!documentId || !currentChatroom?.chatroomId) return;

    const [entryDeleted, fileDeleted] = await Promise.all([
      deleteDocumentEntry(documentId),
      deleteDocumentFile(filename),
    ]);

    if (entryDeleted && fileDeleted) {
      toast({
        title: "Document Deleted",
        description: `"${filename}" has been successfully deleted.`,
      });
      return true;
    }

    return false;
  }, [deleteDocumentEntry, deleteDocumentFile, currentChatroom, toast]);

  return { deleteDocument, deleteDocumentEntry, deleteDocumentFile };
}