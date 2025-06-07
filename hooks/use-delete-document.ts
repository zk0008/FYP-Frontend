import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { useChatroomContext, useToast } from "@/hooks";

const supabase = createClient();

export function useDeleteDocument({
  documentId,
  filename
}: {
  documentId: string;
  filename: string
}) {
  const { chatroom } = useChatroomContext();
  const { toast } = useToast();

  const deleteDocumentEntry = useCallback(async () => {
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
  }, [documentId, toast]);

  const deleteDocumentFile = useCallback(async () => {
    try {
      const { error } = await supabase.storage
        .from("uploaded-documents")
        .remove([`${chatroom!.chatroomId}/${filename}`]);

      console.log(`${chatroom!.chatroomId}/${filename}`);

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
  }, [chatroom, documentId, filename, toast]);

  const deleteDocument = useCallback(async () => {
    if (!documentId || !chatroom?.chatroomId) return;

    const [entryDeleted, fileDeleted] = await Promise.all([
      deleteDocumentEntry(),
      deleteDocumentFile(),
    ]);

    if (entryDeleted && fileDeleted) {
      toast({
        title: "Document Deleted",
        description: "The document has been successfully deleted.",
      });
      return true;
    }

    return false;
  }, [deleteDocumentEntry, deleteDocumentFile, documentId, filename, chatroom, toast]);

  return { deleteDocument };
}