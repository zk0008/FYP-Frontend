import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";
import { Invite } from "@/types";
import { useToast } from "@/hooks/ui/use-toast";

interface InvitePayload {
  invite_id: string;
  sender_id: string;
  recipient_id: string;
  chatroom_id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
}

const supabase = createClient();

export function useRealtimeInvites({
  userId,
  onNewInvite,
  onUpdateInvite
}: {
  userId: string;
  onNewInvite: (invite: Invite) => void;
  onUpdateInvite: ({
    inviteId,
    status,
  }: {
    inviteId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
  }) => void;
}) {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`invites:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "invites", filter: `recipient_id=eq.${userId}` },
        async (payload: { new: InvitePayload }) => {
          const newInvite = payload.new;

          // Fetch sender username and chatroom name
          try {
            const { data: sender, error: senderError } = await supabase
              .from("users")
              .select("username")
              .eq("user_id", newInvite.sender_id)
              .single();

            const { data: chatroom, error: chatroomError } = await supabase
              .from("chatrooms")
              .select("name")
              .eq("chatroom_id", newInvite.chatroom_id)
              .single();

            if (senderError || chatroomError) {
              throw new Error(senderError?.message || chatroomError?.message || "Unknown error");
            }

            const invite: Invite = {
              inviteId: newInvite.invite_id,
              senderUsername: sender.username,
              chatroomId: newInvite.chatroom_id,
              chatroomName: chatroom.name,
              status: newInvite.status,
              createdAt: newInvite.created_at,
            };

            onNewInvite(invite);
          } catch (error: any) {
            console.error("Error fetching invite details:", error.message);
            toast({
              title: "Error",
              description: error.message || "An unexpected error occurred while processing the invite.",
              variant: "destructive",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "invites", filter: `recipient_id=eq.${userId}` },
        async (payload: { new: InvitePayload }) => {
          const updatedInvite = payload.new;

          onUpdateInvite({
            inviteId: updatedInvite.invite_id,
            status: updatedInvite.status,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  })
}
