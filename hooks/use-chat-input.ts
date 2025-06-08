import { useState, useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { fetchWithAuth } from "@/utils";
import {
  useChatroomContext,
  useUserContext,
  useToast
} from "@/hooks";

const supabase = createClient();

interface GroupGPTRequest {
  username: string;
  chatroom_id: string;
  content: string;
};

export function useChatInput() {
  const [input, setInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { chatroom } = useChatroomContext();
  const { user } = useUserContext();
  const { toast } = useToast();

  const sendToGroupGPT = useCallback(async (content: string) : Promise<boolean> => {
    try {
      const contentWithoutMention = content.replace(/@groupgpt/i, "");

      const payload: GroupGPTRequest = {
        username: user!.username,
        chatroom_id: chatroom!.chatroomId,
        content: contentWithoutMention,
      };

      const response = await fetchWithAuth("/api/queries/groupgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error sending message to GroupGPT:", error.message);
      // Error toast is handled in sendMessage()
      return false;
    }
  }, [chatroom, user, toast]);

  const sendToSupabase = useCallback(async (content: string) : Promise<{ success: boolean; messageId?: string }> => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          chatroom_id: chatroom!.chatroomId,
          content: content.trim(),
          sender_id: user!.userId,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, messageId: data[0].message_id };
    } catch (error: any) {
      console.error("Error sending message:", error.message);

      toast({
        title: "Message Not Sent",
        description: error.message || "An error occurred while sending the message.",
        variant: "destructive",
      });

      return { success: false };
    }
  }, [chatroom, user, toast]);

  const sendMessage = useCallback(async (content: string) : Promise<void> => {
    if (!content.trim() || !chatroom?.chatroomId || !user?.userId) return;

    setIsSubmitting(true);

    try {
      const isGroupGPTMessage = content.toLowerCase().includes("@groupgpt");

      if (isGroupGPTMessage) {
        // For GroupGPT messages, send to both Supabase and backend server
        const [groupGPTSuccess, supabaseResult] = await Promise.all([
          sendToGroupGPT(content.trim()),
          sendToSupabase(content.trim())
        ]);

        // If GroupGPT invocation failed, remove message from Supabase and show error
        if (supabaseResult.success && !groupGPTSuccess && supabaseResult.messageId) {
          const { error } = await supabase
            .from("messages")
            .delete()
            .eq("message_id", supabaseResult.messageId);

          if (error) {
            console.error("Error deleting message after GroupGPT failure:", error.message);

            toast({
              title: "Invocation Failed",
              description: "Message saved but GroupGPT invocation failed. Please try again.",
              variant: "destructive",
              // TODO: Add action to retry GroupGPT (NOT RESEND)
            });
          }

          toast({
            title: "Message Not Sent",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        } else if (supabaseResult.success && groupGPTSuccess) {
          setInput("");
        }
      } else {
        // Regular message - only send to Supabase
        const success = await sendToSupabase(content);
        if (success) {
          setInput("");
        } else {
          toast({
            title: "Message Not Sent",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Unexpected error during message sending:", error);
      toast({
        title: "Unexpected Error Sending Message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [chatroom, user, toast]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  return {
    input,
    setInput,
    isSubmitting,
    handleSubmit,
    sendMessage,
  };
}
