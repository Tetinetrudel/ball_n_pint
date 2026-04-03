"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "../navigation/sidebar";
import { Header } from "../navigation/header";
import { useEffect, useState } from "react";

export function OrgLayoutClient({
  children,
  orgId,
  role,
}: {
  children: React.ReactNode;
  orgId: string;
  role: "owner" | "admin" | "staff";
}) {
  const { collapsed, toggle } = useSidebar();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} toggle={toggle} orgId={orgId} role={role} />
      <div className="flex-1 py-2">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
