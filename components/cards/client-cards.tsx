"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { updateCount } from "@/actions/cards/cards";
import { ClientCardsType } from "@/lib/types";
import { useMutation } from "@/hooks/use-mutations";
import Image from "next/image";

interface Props {
    cards: ClientCardsType[];
}

export default function ClientCards({ cards: initialCards }: Props) {
  const [cards, setCards] = useState(initialCards);

  const { mutate: useCard, isLoading } = useMutation(
    async (cardId: string) => {
      return await updateCount(cardId, 1);
    },
    {
      onSuccess: (updated) => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === updated.id
              ? { ...c, remainingCount: updated.remainingCount }
              : c
          )
        );
      },
      successMessage: "Carte utilisée !",
    }
  );

  if(cards.length === 0) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between">
                <CardHeader className="flex-1">
                    <CardTitle>Cartes</CardTitle>
                    <CardDescription>Aucune carte retrouvée</CardDescription>
                </CardHeader>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6">
          <CardContent className="flex-1">
            <CardHeader>
                <div className="flex items-start gap-2">
                    <div className="relative flex items-center justify-center h-12 w-12 rounded-md bg-card">
                        {card.product.imageUrl ? (
                        <Image
                            src={card.product.imageUrl}
                            alt={card.product.name}
                            fill
                            className="object-cover rounded-md"
                        />
                        ) : (
                        <div className="bg-muted flex items-center justify-center h-full w-full text-sm font-semibold">
                            {card.product.name.slice(0, 2).toUpperCase()}
                        </div>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 justify-start">
                        <CardTitle className="font-semibold">{card.product.name}</CardTitle>
                        <Badge
                            variant={card.remainingCount > 0 ? "success" : "destructive"}
                            className="px-3 py-1 text-xs"
                            >
                            {card.remainingCount > 0 ? "Actif" : "Inactif"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <p className="mt-1 text-sm text-gray-600">
              {card.remainingCount} / {card.initialCount} restants
            </p>

            <Progress
              value={(card.remainingCount / card.initialCount) * 100}
              className={cn(
                "mt-2 h-2 rounded",
                card.remainingCount > 0 ? "bg-green-500/50" : "bg-destructive/50"
              )}
            />
          </CardContent>

          <div className="flex flex-col md:flex-row items-center gap-2">
             <Button
                size="sm"
                variant={card.remainingCount > 0 ? "default" : "outline"}
                disabled={card.remainingCount <= 0 || isLoading}
                onClick={() => useCard(card.id)}
                >
              Utiliser
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
