import { getCategory, getProducts } from "@/actions/products/products"
import { ProductsDataTable } from "@/components/products/table/product-data-table"

export default async function ProductPage() {
    const category = await getCategory()
    const products = await getProducts();

    return (
        <main className="max-w-full p-6">
            <ProductsDataTable
                data={products}
                categories={category}
            />
        </main>
    )

}
