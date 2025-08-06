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

    try {
      const response = await fetchWithAuth(`/api/users/${user.userId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting user:", error.message);

      return { success: false, error: error.message || "An unexpected error occurred." };
    } finally {
      setIsDeleting(false);
    }
  }, [user]);

  return { deleteUser, isDeleting };
}
