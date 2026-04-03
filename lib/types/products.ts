import { Category, Product, ProductWithRelations, products } from "@/drizzle/schema"
import { InferInsertModel } from "drizzle-orm"

export type CreateCategoryInput = {
  name: string
}

export type CreateProductInput = Pick<
  Product,
  "name" | "price" | "categoryId" | "description" | "favorite" | "imageUrl"
>

export type UpdateProductInput =
  { id: string } & Partial<
    Omit<InferInsertModel<typeof products>, "id" | "organizationId" | "createdAt">
  >

export type CategoryForSelect = {
  id: string
  name: string
}

export type ProductsDataTableProps = {
  data: ProductWithRelations[]
  categories: Category[]
}

export type ProductsTableMeta = {
  category: Category[]
}

export type CreateProductFormProps = {
  category: Category[] | null
}

export type UpdateProductFormProps = {
  category: Category[] | null
  product: Product
  onSuccess?: () => void
}
