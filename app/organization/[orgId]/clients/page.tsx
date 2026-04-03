import { getClients } from "@/actions/clients/clients"
import { ClientsDataTable } from "@/components/clients/table/clients-data-table"

export default async function ClientsPage() {
    
    const clients = await getClients()

    return (
        <main className="max-w-full p-6">
            <ClientsDataTable
                data={clients}
            />
        </main>
    )
}