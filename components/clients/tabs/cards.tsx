import { getClientsCards } from "@/actions/cards/cards";
import ClientCards from "@/components/cards/client-cards";
import { ClientCardsType } from "@/lib/types";

type Props = {
    clientId: string
}

export async function Cards({ clientId } : Props) {
    const result = await getClientsCards(clientId);

    if (!result.success) {
        console.error(result.message);
        return;
    }

    const cards: ClientCardsType[] = result.data;

    return (
        <div className="flex flex-col space-y-4">
            <ClientCards cards={cards} />
        </div>
    )
}
