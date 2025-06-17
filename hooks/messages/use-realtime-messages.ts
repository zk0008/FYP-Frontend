import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";
import { Message } from "@/types";
import { useToast } from "@/hooks";

interface useRealtimeMessagesProps {
  chatroomId: string;
  onNewMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
}

interface MessagePayload {
  chatroom_id: string;
  content: string;
  message_id: string;
  sender_id: string;
  sent_at: string;
};

const supabase = createClient();

export function useRealtimeMessages({
  chatroomId,
  onNewMessage,
  onDeleteMessage
}: useRealtimeMessagesProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!chatroomId) return;

    const channel = supabase
      .channel(`messages:${chatroomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chatroom_id=eq.${chatroomId}` },
        async (payload: { new: MessagePayload }) => {
          const newMessage = payload.new;

          try {
            const { data: sender, error: senderError } = await supabase
              .from("users")
              .select("username")
              .eq("user_id", newMessage.sender_id)
              .single();

            if (senderError) {
              throw new Error(senderError.message);
            }

            const message: Message = {
              messageId: newMessage.message_id,
              username: sender.username,
              content: newMessage.content,
              sentAt: newMessage.sent_at,
            };

            onNewMessage(message);
          } catch (error: any) {
            console.error("Error fetching sender username:", error);
            toast({
              title: "Error",
              description: "Failed to fetch sender information. Please refresh the page.",
              variant: "destructive",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const deletedMessageId = payload.old.message_id;
          onDeleteMessage(deletedMessageId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatroomId, onNewMessage, toast]);
}
