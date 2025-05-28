"use client";

import { createContext } from "react";

import { User } from "@/types"
import { useUser } from "@/hooks/use-user";

export const UserContext = createContext<User | null>(null);

export function UserProvider({ children } : { children: React.ReactNode }) {
  const { user, loading, error } = useUser(); // Use the enhanced hook

  // TODO: Handle loading and error states

  return (
    <UserContext.Provider value={ user }>
      { children }
    </UserContext.Provider>
  );
}