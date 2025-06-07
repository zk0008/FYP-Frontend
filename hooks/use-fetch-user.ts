import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@/types";

export function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      setUser(null);
      setLoading(true);
      setError(null);

      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          throw new Error(authError.message);
        }

        if (!authUser || !authUser.id) {
          throw new Error("Supabase authenticated user not found.");
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("user_id, username")
          .eq("auth_id", authUser.id)
          .single();

        if (userError) {
          throw new Error(userError.message);
        }

        if (!userData) {
          throw new Error("User record not found in your 'users' table.");
        }

        setUser({
          userId: userData.user_id,
          username: userData.username,
          email: authUser.email || ""
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
        setError(error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, loading, error };
}
