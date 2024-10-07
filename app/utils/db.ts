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

export function subscribeToTopics(callback: () => {}) {
  supabase
    .channel("user_topic")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "user_topic" },
      (payload: any) => {
        callback();
      }
    )
    .subscribe();
}

export async function getTopics(username: string) {
  const { data, error } = await supabase
    .from("user_topic")
    .select("topic, joined")
    .eq("username", username);
  if (data) {
    const joinedTrue = new Set<string>();
    const joinedFalse = new Set<string>();

    // Iterate through the fetched data
    data.forEach(({ topic, joined }) => {
      if (joined) {
        joinedTrue.add(topic);
      } else {
        joinedFalse.add(topic);
      }
    });

    const uniqueJoinedTrueTopics = Array.from(joinedTrue);
    const uniqueJoinedFalseTopics = Array.from(joinedFalse);

    return [uniqueJoinedTrueTopics, uniqueJoinedFalseTopics];
  }
  return [[], []];
}

export async function getChats(topic: string) {
  const { data, error } = await supabase
    .from("chats")
    .select("username, message")
    .eq("topic", topic)
    .order("created_at", { ascending: true });
  return data;
}

export async function startNewTopic(username: string, topic: string) {
  const { data, error } = await supabase.from("user_topic").select("topic");
  if (data?.some((item) => item.topic === topic)) return false;

  await supabase.from("user_topic").insert([{ username, topic, joined: true }]);
  await supabase
    .from("chats")
    .insert([{ username, message: "Started a chat for " + topic, topic }]);

  return true;
}

export async function acceptTopicInvite(username: string, topic: string) {
  await supabase
    .from("user_topic")
    .update([{ joined: true }])
    .eq("username", username)
    .eq("topic", topic);
  await supabase
    .from("chats")
    .insert([{ username, message: "Joined the chat", topic }]);
}

export async function declineTopicInvite(username: string, topic: string) {
  await supabase
    .from("user_topic")
    .delete()
    .eq("username", username)
    .eq("topic", topic)
    .eq("joined", false);
}

export async function sendTopicInvite(username: string, topic: string) {
  await supabase
    .from("user_topic")
    .insert([{ username, topic, joined: false }]);
}

export async function insertChat(
  username: string,
  message: string,
  topic: string
) {
  await supabase.from("chats").insert([{ username, message, topic }]);
}
