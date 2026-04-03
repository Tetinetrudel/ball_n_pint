"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { logout } from "@/actions/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrg } from "@/providers/organization-providers";
import Link from "next/link";
import { useUser } from "@/providers/user-provider";
import Image from "next/image";
import { ThemeToggle } from "./toggle-button";

export function Header() {
  const router = useRouter();
  const org = useOrg()
  const user = useUser()

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  return (
    <header className="h-10 border-b flex items-center justify-between p-6">
      <div className="font-semibold text-sm">{org.name}</div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border">
                {user.imageUrl ? (
                    <Image 
                        src={user.imageUrl}
                        width={16}
                        height={16}
                        alt="user image"
                    />
                ) : (
                    <User size={16} />
                )}
            </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
                <Link href={`/organization/${org.id}/members/userId/profile`} className="flex items-center gap-4">
                    <User />
                    Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut size={16} className="mr-2" />
                Logout
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}