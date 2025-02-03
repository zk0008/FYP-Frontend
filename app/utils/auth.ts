import { createClient } from "@/supabase/client";

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

  // TODO: Error handling
  if (error) {
    console.error('Login failed:', error.message);
    return;
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ token: data.session.access_token }),
  });

  console.log("data", data);
  console.log("response", await response.json());

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
