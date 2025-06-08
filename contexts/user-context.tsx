"use client";

import { createContext } from "react";

import { User } from "@/types"
import { useFetchUser } from "@/hooks/use-fetch-user";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

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
