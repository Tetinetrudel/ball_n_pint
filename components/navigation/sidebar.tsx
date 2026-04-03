"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartLineIcon, LayoutDashboard, Settings, ChevronLeft, ChevronRight, BubblesIcon, Users, Package, ChartLine } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  collapsed: boolean;
  toggle: () => void;
  orgId: string;
};

export function Sidebar({ collapsed, toggle, orgId }: Props) {
  const pathname = usePathname();

  const links = [
    {
      label: "Dashboard",
      href: `/organization/${orgId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: "Settings",
      href: `/organization/${orgId}/settings`,
      icon: Settings,
    },
    {
      label: "Clients",
      href: `/organization/${orgId}/clients`,
      icon: Users,
    },
    {
      label: "Produits",
      href: `/organization/${orgId}/products`,
      icon: Package,
    },
    {
      label: "Rappots",
      href: `/organization/${orgId}/reports`,
      icon: ChartLineIcon,
    },
  ];

  return (
    <aside
      className={cn(
        "h-screen border-r flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
            <BubblesIcon />
            {!collapsed && <span className="font-bold">Ball & Pint</span>}
        </div>

        <button onClick={toggle}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon size={18} />

              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}