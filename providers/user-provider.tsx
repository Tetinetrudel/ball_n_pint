"use client";

import { User } from "@/drizzle/schema";
import { createContext, useContext } from "react";

const UserContext = createContext<User | null>(null);

export function useUser() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return ctx;
}

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}