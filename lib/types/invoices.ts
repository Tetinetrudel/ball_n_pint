import { InvoiceItemWithProduct, InvoiceStatusType } from "@/drizzle/schema"

export type InvoiceItem = {
  id: string
  invoiceId: string
  productId: string
  quantity: number
  price: number
  paid: boolean
  createdAt: Date
  updatedAt: Date
  product?: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
}

export type Invoice = {
  id: string
  invoiceNumber: string
  clientId: string
  organizationId: string
  total: number
  status: InvoiceStatusType
  createdAt: Date
  updatedAt: Date
  items: InvoiceItem[]
}

export type InvoiceWithItems = {
  clientId: string
  id: string
  invoiceNumber: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
  total: string | null
  status: InvoiceStatusType
  items: InvoiceItemWithProduct[]
}

export type CreateInvoiceInput = {
  clientId: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
}

export type AddInvoiceCategory = {
  id: string
  name: string
}

export type AddInvoiceProduct = {
  id: string
  name: string
  price: number
  categoryId: string
}

export type InvoiceCartItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type AddInvoiceDialogProps = {
  clientId: string
  categories: AddInvoiceCategory[]
  products: AddInvoiceProduct[]
}

export type InvoicesDataTableProps = {
  data: InvoiceWithItems[]
  clientId: string
  products: AddInvoiceProduct[]
  categories: AddInvoiceCategory[]
}

export type InvoiceDialogProps = {
  invoice: InvoiceWithItems
}

export type DeleteInvoiceProps = {
  invoiceId: string
}

export type InvoiceStatus = InvoiceStatusType
