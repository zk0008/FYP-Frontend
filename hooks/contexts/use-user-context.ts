"use client";

import { useContext } from "react";

import { UserContextType } from "@/types";
import { UserContext } from "@/contexts";

export function useUserContext(): UserContextType {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return userContext as UserContextType;
}
