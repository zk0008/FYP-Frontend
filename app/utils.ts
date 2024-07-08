import { createClient } from "@/utils/supabase/client";
import { Chat } from "./types";

export const supabase = createClient();

export async function signUpAndGetUser(
  email: string,
  password: string,
  username: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  return data.user;
}

export async function logInAndGetUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return data.user;
}

export async function logOutUser() {
  const { error } = await supabase.auth.signOut();
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

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

export async function promptModel(promptData: Chat[]) {
  const data = await fetch("/api/gpt35", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promptData),
  });
  const res = await data.json();
  return res;
}
