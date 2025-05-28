"use client";

import { useContext } from "react";

import { User } from "@/types";
import { UserContext } from "@/contexts/user-context";

export function useUserContext(): User | null {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return userContext;
}
