"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function CreateOrgCard() {
  const router = useRouter();

  return (
    <Card
      className="w-50 h-50 cursor-pointer hover:shadow-lg hover:border-primary border transition-shadow flex flex-col items-center justify-center"
      onClick={() => router.push("/organization/create-organization")}
    >
      <CardContent className="flex flex-col items-center text-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Plus className="text-muted-foreground" size={20} />
        </div>
        <h3 className="font-bold">Créer votre organisation</h3>
        <p className="text-xs text-muted-foreground">
          Créez une nouvelle organisation pour gérer vos membres et produits.
        </p>
      </CardContent>
    </Card>
  );
}