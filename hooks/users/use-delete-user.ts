import { useState, useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUserContext } from "@/hooks";

export function useDeleteUser() {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { user } = useUserContext();

  const deleteUser = useCallback(async () => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    }

    setIsDeleting(true);

    const response = await fetchWithAuth(`/api/users/${user.userId}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      setIsDeleting(false);
      return { success: false, error: data.detail || "Failed to delete user." };
    }

    setIsDeleting(false);
    return { success: true, error: null };
  }, [user]);

  return { deleteUser, isDeleting };
}
