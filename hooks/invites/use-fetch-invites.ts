import { useCallback, useEffect, useState } from "react";

import { Invite } from "@/types";
import { fetchWithAuth } from "@/utils";

interface useFetchInvitesProps {
  userId: string;
}

export function useFetchInvites({ userId }: useFetchInvitesProps) {
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    if (!userId) return;

    setPendingInvites([]);
    setLoading(true);
    setError(null);

    const response = await fetchWithAuth(`/api/invites`, {
      method: "GET",
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching invites:", data.detail);
      setError(data.detail);
      setLoading(false);
      return;
    }

    if (data) {
      const invitesData = data.map((item: any) => ({
        inviteId: item.invite_id,
        senderUsername: item?.sender_username || "[deleted]",
        chatroomId: item.chatroom_id,
        chatroomName: item.chatroom_name,
        status: item.status,
        createdAt: item.created_at
      }));

      setPendingInvites(invitesData);
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
