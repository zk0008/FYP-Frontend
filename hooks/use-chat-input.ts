import { createClient } from "@/utils/supabase/client";
import { fetchWithAuth } from "@/utils";
import { useState, useCallback } from "react";
import {
  useChatroomContext,
  useUserContext,
  useToast
} from "@/hooks";

const supabase = createClient();

type GroupGPTRequest = {
  username: string;
  chatroom_id: string;
  content: string;
};

type GroupGPTResponse = {
  response: string;
};

export function useChatInput() {
  const [input, setInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const chatroom = useChatroomContext();
  const user = useUserContext();
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

  const sendToSupabase = useCallback(async (content: string) : Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          chatroom_id: chatroom!.chatroomId,
          content: content.trim(),
          sender_id: user!.userId,
        });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [chatroom, user, toast]);

  const sendMessage = useCallback(async (content: string) : Promise<void> => {
    if (!content.trim() || !chatroom?.chatroomId || !user?.userId) return;

    setIsSubmitting(true);

    try {
      const isGroupGPTMessage = content.toLowerCase().includes("@groupgpt");

      if (isGroupGPTMessage) {
        // For GroupGPT messages, send to both Supabase and backend server
        const [groupGPTSuccess, supabaseSuccess] = await Promise.all([
          sendToGroupGPT(content.trim()),
          sendToSupabase(content.trim())
        ]);

        // Clear input if Supabase insert was successful
        if (supabaseSuccess) {
          setInput("");
        }

        // Show additional feedback if GroupGPT invocation failed but message was saved
        if (supabaseSuccess && !groupGPTSuccess) {
          toast({
            title: "Message sent",
            description: "Message saved but GroupGPT invocation failed. You can try again.",
            variant: "default",
            // TODO: Add action to retry GroupGPT (NOT RESEND)
          });
        }
      } else {
        // Regular message - only send to Supabase
        const success = await sendToSupabase(content);
        if (success) {
          setInput("");
        }
      }
    } catch (error) {
      console.error("Unexpected error in sendMessage():", error);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
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
