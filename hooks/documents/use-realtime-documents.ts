import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";
import { useToast, useUserContext } from "@/hooks";

interface DocumentPayload {
  document_id: string;
  uploader_id: string;
  chatroom_id: string;
  filename: string;
  uploaded_at: string;
}

const supabase = createClient();

export function useRealtimeDocuments() {
  const { user } = useUserContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`documents:${user!.userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "documents",
          filter: `uploader_id=eq.${user.userId}`,
        },
        async (payload: { new: DocumentPayload }) => {
          const newDocument = payload.new;

          try {
            const { data: chatroomName, error: chatroomError } = await supabase
              .from("chatrooms")
              .select("name")
              .eq("chatroom_id", newDocument.chatroom_id)
              .single();

            if (chatroomError) {
              throw new Error(chatroomError.message);
            }

            toast({
              title: "Document Uploaded",
              description: `Your document '${newDocument.filename}' has been uploaded and added to the knowledge base for chatroom '${chatroomName.name}'. You may now query it.`
            })
          } catch (error) {
            console.error("Document uploaded, but error fetching chatroom name:", error);
            toast({
              title: "Document Uploaded",
              description: `Your document '${newDocument.filename}' has been uploaded.`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
}
