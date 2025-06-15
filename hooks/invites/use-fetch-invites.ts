import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { Invite } from "@/types";

const supabase = createClient();

export function useFetchInvites({ userId }: { userId: string }) {
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    if (!userId) return;

    setPendingInvites([]);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc("get_user_pending_invites", { p_user_id: userId });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const invitesData = data.map((item: any) => ({
          inviteId: item.invite_id,
          senderUsername: item.sender_username,
          chatroomId: item.chatroom_id,
          chatroomName: item.chatroom_name,
          status: item.status,
          createdAt: item.created_at
        }));
        setPendingInvites(invitesData);
      }
    } catch (error: any) {
      console.error("Error fetching invites:", error.message);
      setError(error.message);
      setPendingInvites([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addInvite = useCallback((newInvite: Invite) => {
    setPendingInvites(prev => {
      const exists = prev.some(invite => invite.inviteId === newInvite.inviteId);
      if (exists) return prev;
      return [...prev, newInvite];
    })
  }, []);

  const removeInvite = useCallback((inviteId: string) => {
    setPendingInvites(prev => prev.filter(invite => invite.inviteId !== inviteId));
  }, []);

  const updateInviteStatus = useCallback((inviteId: string, status: "ACCEPTED" | "REJECTED") => {
    if (status === "ACCEPTED" || status === "REJECTED") {
      removeInvite(inviteId);
    }
  }, [removeInvite]);

  useEffect(() => {
    fetchInvites();
  }, [userId, fetchInvites]);

  return {
    pendingInvites,
    loading,
    error,
    refresh: fetchInvites,
    addInvite,
    removeInvite,
    updateInviteStatus
  };
}
