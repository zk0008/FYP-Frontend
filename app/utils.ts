import { createClient } from "@/utils/supabase/client";
import { Chat } from "./types";

const supabase = createClient();

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
  const { data, error } = await supabase.from("chats").select("user, message");
  return data;
}

export async function insertChat(user: string, message: string) {
  await supabase.from("chats").insert([{ user, message }]);
}

export async function promptModel(promptData: Chat[]) {
  const data = await fetch("/api/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promptData),
  });
  const res = await data.json();
  return res;
}
