import { getClientInvoices } from "@/actions/invoices/invoices";
import { getCategory, getProducts } from "@/actions/products/products";
import { InvoicesDataTable } from "@/components/invoices/tables/invoices-data-table";

type Props = {
    clientId: string
}
export async function Bills({ clientId } : Props) {
    const [products, categories, invoices] = await Promise.all([
        getProducts(),
        getCategory(),
        getClientInvoices(clientId),
    ])

    if(!products || !categories) return

    const formattedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    }))

    return (
        <div className="flex flex-col space-y-4">
            <InvoicesDataTable 
                products={formattedProducts} 
                data={invoices}
                clientId={clientId}
                categories={categories}
            /> 
        </div>
    )
}
