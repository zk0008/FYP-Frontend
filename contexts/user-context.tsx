"use client";

import { createContext } from "react";

import { UserContextType } from "@/types"
import { useFetchUser } from "@/hooks";

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  refresh: () => null
});

export function UserProvider({ children } : { children: React.ReactNode }) {
  const { user, loading, error, refresh } = useFetchUser();

  const contextValue: UserContextType = { user, loading, error, refresh };

  return (
    <UserContext.Provider value={ contextValue }>
      { children }
    </UserContext.Provider>
  );
}
