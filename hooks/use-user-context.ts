"use client";

import { useContext } from "react";

import { User } from "@/types";
import { UserContext } from "@/contexts";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useUserContext(): UserContextType {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return userContext as UserContextType;
}
