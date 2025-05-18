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

export async function signInAndGetUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // TODO: Error handling, notify user
  if (error) {
    console.error('Sign in failed:', error.message);
    return;
  }

  console.log("data", data);

  return {
    user: data.user,
    token: data.session?.access_token
  };
}

export async function signOutUser() {
  localStorage.removeItem("token");
  const { error } = await supabase.auth.signOut();
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
