import { InvoiceItemWithProduct, InvoiceStatusType } from "@/drizzle/schema"

export type Category = {
  id: string
  name: string
}

export type Product = {
  id: string
  name: string
  price: number
  categoryId: string
}

export type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  price: number;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  organizationId: string;
  total: number;
  status: InvoiceStatusType;
  createdAt: Date;
  updatedAt: Date;
  items: InvoiceItem[];
};

export type InvoiceWithItems = {
  clientId: string;
  id: string;
  invoiceNumber: string
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  total: string | null;
  status: InvoiceStatusType;
  items: InvoiceItemWithProduct[];
}

export type ClientCardsType = {
  id: string;
  clientId: string;
  organizationId: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  initialCount: number;
  remainingCount: number
  memberships: {
    id: string;
    userId: string;
    organizationId: string;
    role: "owner" | "admin" | "staff";
    user: {
      id: string
      name: string
    }
  };
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};
