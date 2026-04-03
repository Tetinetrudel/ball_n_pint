"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
    >
      Déconnexion
    </Button>
  );
}