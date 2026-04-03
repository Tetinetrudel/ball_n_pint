import { BackButton } from "@/components/back-button";
import { Activities } from "@/components/clients/tabs/activities";
import { Bills } from "@/components/clients/tabs/bills";
import { Cards } from "@/components/clients/tabs/cards";
import { Notes } from "@/components/clients/tabs/notes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/drizzle/db/db";
import { clients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{
    orgId: string
    clientId: string;
  }>;
};

export default async function ClientPage({ params }: Props) {
  const { clientId, orgId } = await params;

  const client = await db.query.clients.findFirst({
    where: eq(clients.id, clientId),
  });

  if (!client) {
    return <div>Aucun client</div>;
  }

  return (
    <main className="flex flex-col gap-4 md:flex-row p-6 h-screen">
      <div className="max-w-84 w-64 p-6">
        <div className="flex flex-col space-y-10">
          <BackButton />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-center bg-muted rounded-b-sm text-primary w-10 h-10">
                {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col space-y-0">
                <h2 className="font-semibold text-lg">{client.name}</h2>
                <p className="text-muted-foreground text-xs">{client.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div>
            <Tabs defaultValue="bills" className="w-full">
                <TabsList className="gap-10 bg-background ">
                    <TabsTrigger 
                        value="bills" 
                        className="cursor-pointer text-sm font-semibold data-[state=active]:bg-muted"
                    >
                        Factures
                    </TabsTrigger>
                    <TabsTrigger 
                        value="cards" 
                        className="cursor-pointer text-sm font-semibold data-[state=active]:bg-muted"
                    >
                        Cartes
                    </TabsTrigger>
                    <TabsTrigger 
                        value="notes" 
                        className="cursor-pointer text-sm font-semibold data-[state=active]:bg-muted"
                    >
                        Notes
                    </TabsTrigger>
                    <TabsTrigger 
                        value="activities" 
                        className="cursor-pointer text-sm font-semibold data-[state=active]:bg-muted"
                    >
                        Activités
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="bills" className="w-full mt-8 bg-muted/80 h-full p-6">
                    <Bills clientId={clientId} />
                </TabsContent>
                <TabsContent value="cards" className="w-full mt-8 bg-muted/80 h-full p-6">
                    <Cards clientId={clientId} />
                </TabsContent>
                <TabsContent value="notes" className="w-full mt-8 bg-muted/80 h-full p-6">
                    <Notes params={params} />
                </TabsContent>
                <TabsContent value="activities" className="w-full mt-8 bg-muted/80 h-full p-6">
                    <Activities params={params} />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </main>
  );
}
