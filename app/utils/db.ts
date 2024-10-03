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

export async function getTopics() {
  const { data, error } = await supabase.from("chats").select("topic");
  if (data) {
    return Array.from(new Set(data.map((item) => item.topic)));
  }
  return [];
}

export async function getChats(topic: string) {
  const { data, error } = await supabase
    .from("chats")
    .select("username, message")
    .eq("topic", topic)
    .order("created_at", { ascending: true });
  return data;
}

export async function addTopic(username: string, topic: string) {
  await supabase
    .from("chats")
    .insert([{ username, message: "Started a chat for " + topic, topic }]);
}

export async function insertChat(
  username: string,
  message: string,
  topic: string
) {
  await supabase.from("chats").insert([{ username, message, topic }]);
}
