import { useEffect } from "react";

import { Document } from "@/types";

import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

interface useRealtimeDocumentsProps {
  chatroomId: string;
  onNewDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
}

interface DocumentPayload {
  document_id: string;
  uploader_id: string;
  chatroom_id: string;
  filename: string;
  uploaded_at: string;
}

const supabase = createClient();

export function useRealtimeDocuments({ chatroomId, onNewDocument, onDeleteDocument }: useRealtimeDocumentsProps) {
    const { toast } = useToast();

  useEffect(() => {
    if (!chatroomId) return;

    const channel = supabase
      .channel(`documents:${chatroomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "documents",
          filter: `chatroom_id=eq.${chatroomId}`,
        },
        async (payload: { new: DocumentPayload }) => {
          const newDocument = payload.new;

          try {
            const { data: chatroom, error: chatroomError } = await supabase
              .from("chatrooms")
              .select("name")
              .eq("chatroom_id", newDocument.chatroom_id)
              .single();

            const { data: user, error: userError } = await supabase
              .from("users")
              .select("username")
              .eq("user_id", newDocument.uploader_id)
              .single();

            if (chatroomError || userError) {
              throw new Error(chatroomError?.message || userError?.message);
            }

            toast({
              title: "Document Uploaded",
              description: `Your document '${newDocument.filename}' has been uploaded and added to the knowledge base for chatroom '${chatroom.name}'. You may now query it.`
            })

            const document: Document = {
              documentId: newDocument.document_id,
              filename: newDocument.filename,
              username: user.username,
              uploadedAt: newDocument.uploaded_at,
            };

            onNewDocument(document);
          } catch (error) {
            console.error("Document uploaded, but error fetching additional details:", error);
            toast({
              title: "Document Uploaded",
              description: `Your document '${newDocument.filename}' has been uploaded.`
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "documents",
        },
        (payload) => {
          const deletedDocumentId = payload.old.document_id;
          onDeleteDocument(deletedDocumentId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
}
