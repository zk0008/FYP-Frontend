import { useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useDeleteDocument, useToast } from "@/hooks";

interface deleteChatroomProps {
  chatroomId: string;
  name: string;
}

const supabase = createClient();

export function useDeleteChatroom() {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteDocumentFile } = useDeleteDocument();
  const { toast } = useToast();

  const deleteChatroom = async ({ chatroomId, name }: deleteChatroomProps) => {
    if (!chatroomId || !name) {
      toast({
        title: "Invalid Parameters",
        description: "Chatroom ID and name are required to delete a chatroom.",
        variant: "destructive",
      });
      return { success: false, error: "Chatroom ID and name are required." };
    }

    setIsLoading(true);

    try {
      // Clean up remaining document files in the chatroom
      const { data: documents, error: fetchError } = await supabase
        .from("documents")
        .select("filename")
        .eq("chatroom_id", chatroomId);

      for (const document of documents || []) {
        await deleteDocumentFile(document.filename);
      }
      await deleteDocumentFile(chatroomId);  // Delete the chatroom folder itself

      // Delete the chatroom entry
      // Deletion of other associated data such as messages, invites, and document entries are cascaded
      const { error: deleteError } = await supabase
        .from("chatrooms")
        .delete()
        .eq("chatroom_id", chatroomId);

      if (fetchError || deleteError) {
        const errorMessage = fetchError?.message || deleteError?.message || "An unexpected error occurred.";
        throw new Error(errorMessage);
      }

      toast({
        title: "Chatroom Deleted",
        description: `Chatroom '${name}' has been successfully deleted.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting chatroom:", error);

      toast({
        title: "Error Deleting Chatroom",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });

      return { success: false, error: error.message || "An unexpected error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteChatroom, isLoading };
}
