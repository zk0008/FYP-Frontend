"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

interface signInProps {
  email: string;
  password: string;
}

interface signUpProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function signIn({ email, password } : signInProps) {
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (!email.includes("@")) {
    return { error: "Invalid email format." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    console.error("signIn error:", error);
    return { error: "Invalid credentials. Please check your credentials." };
  }

  // Check if user is logging in for the first time
  const { error: userError } = await supabase
    .from("users")
    .select("user_id, username")
    .eq("auth_id", data.user.id)
    .single();

  if (userError && userError.code === "PGRST116") {
    // No user found (PGRST116 = no rows returned), so insert new user entry
    const username = data.user.user_metadata.username;

    const { error: insertError } = await supabase
      .from("users")
      .insert({
        auth_id: data.user.id,
        username: username,
      })
    
    if (insertError) {
      console.error("Error inserting new user:", insertError);
      return { error: insertError.message || "Failed to create user profile. Please try again." };
    }

    revalidatePath("/");
    return { user: data.user };
  } else if (userError) {
    // Some other DB error occurred
    console.error("Database error:", userError);
    return { error: userError.message || "An error occurred while accessing user data. Please try again." };
  }

  // User already exists, proceed with signIn as per normal
  revalidatePath("/");
  return { user: data.user };
}

export async function signUp({
  username,
  email,
  password,
  confirmPassword
} : signUpProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      }
    }
  });

  if (error) {
    console.error("Sign up error:", error);
    return { error: error.message || "Sign up failed. Please try again." };
  }

  revalidatePath("/");
  return { user: data.user };
}
