import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";
import { Attachment, Message } from "@/types";
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
  has_attachments: boolean;
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
            // Get sender username
            const { data: sender, error: senderError } = await supabase
              .from("users")
              .select("username")
              .eq("user_id", newMessage.sender_id)
              .single();

            if (senderError) {
              throw new Error(senderError.message);
            }

            // Get attachments, if any
            let attachments: Attachment[] = [];
            if (newMessage.has_attachments) {
              const { data: attachmentsData, error: attachmentsError } = await supabase
                .from("attachments")
                .select("attachment_id, mime_type, filename")
                .eq("message_id", newMessage.message_id);

              if (attachmentsError) {
                throw new Error(attachmentsError.message);
              }

              attachments = attachmentsData.map((attachment: any) => ({
                attachmentId: attachment.attachment_id,
                mimeType: attachment.mime_type,
                filename: attachment.filename
              }));
            }

            const message: Message = {
              messageId: newMessage.message_id,
              username: sender?.username || "[deleted]",
              content: newMessage.content,
              sentAt: newMessage.sent_at,
              attachments: attachments
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
