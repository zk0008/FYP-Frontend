import { createClient } from "@/supabase/client";

export const supabase = createClient();

export function subscribeToChat(callback: () => {}) {
  supabase
    .channel("chats")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "chats" },
      (payload: any) => {
        callback();
      }
    )
    .subscribe();
}

export async function getChats() {
  const { data, error } = await supabase
    .from("chats")
    .select("username, message");
  return data;
}

export async function insertChat(username: string, message: string) {
  await supabase.from("chats").insert([{ username, message }]);
}
