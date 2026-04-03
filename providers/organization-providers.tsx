"use client";

import { Organization } from "@/drizzle/schema";
import { createContext, useContext } from "react";

const OrgContext = createContext<Organization | null>(null);

export const useOrg = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used inside OrgProvider");
  return ctx;
};

export function OrgProvider({
  org,
  children,
}: {
  org: Organization;
  children: React.ReactNode;
}) {
  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>;
}