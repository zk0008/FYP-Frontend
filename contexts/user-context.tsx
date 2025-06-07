"use client";

import { createContext } from "react";

import { User } from "@/types"
import { useFetchUser } from "@/hooks/use-fetch-user";

export const UserContext = createContext<User | null>(null);

export function UserProvider({ children } : { children: React.ReactNode }) {
  const { user, loading, error } = useFetchUser(); // Use the enhanced hook

  // TODO: Handle loading and error states

  return (
    <UserContext.Provider value={ user }>
      { children }
    </UserContext.Provider>
  );
}