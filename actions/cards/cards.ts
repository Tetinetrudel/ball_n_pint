"use server"

import { db } from "@/drizzle/db/db";
import { clientCards, products } from "@/drizzle/schema";
import { requirePermission, safeAction } from "@/lib/helpers";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClientActivity } from "../clients/client-activities";

export async function getClientsCards(clientId: string) {
  return safeAction(async () => {
    const { org } = await requirePermission("cards.manage")

    const cards = await db.query.clientCards.findMany({
      where: and(
        eq(clientCards.clientId, clientId),
        eq(clientCards.organizationId, org.id)
      ),
      with: {
        product: true,
        memberships: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return cards.map((card) => ({
      ...card,
      remainingCount: card.remainingCount ?? card.initialCount,
    }));
  });
}

export async function updateCount(cardId: string, decrement = 1) {
  const { org, member } = await requirePermission("cards.manage")

  return safeAction(async () => {
    const [card] = await db.select().from(clientCards).where(eq(clientCards.id, cardId));

    if (!card) throw new Error("Carte non trouvée");

    const newRemaining = Math.max((card.remainingCount ?? card.initialCount) - decrement, 0);

    const [updated] = await db
      .update(clientCards)
      .set({
        remainingCount: newRemaining,
        updatedAt: new Date(),
      })
      .where(eq(clientCards.id, cardId))
      .returning();

    const product = await db.query.products.findFirst({
      where: eq(products.id, card.productId),
    })

    await createClientActivity({
      clientId: card.clientId,
      organizationId: org.id,
      memberId: member.id,
      event: "card_consumption_used",
      message: `Consommation utilisée sur ${product?.name ?? "la carte"} (${newRemaining}/${card.initialCount} restant(s))`,
    })

    if (newRemaining === 0) {
      await createClientActivity({
        clientId: card.clientId,
        organizationId: org.id,
        memberId: member.id,
        event: "card_depleted",
        message: `${product?.name ?? "Une carte"} est rendue à 0`,
      })
    }

    revalidatePath(`/organization/${org.id}/clients/${card.clientId}`)
    return updated;
  }, { errorMessage: "Impossible de mettre à jour la carte" });
}
