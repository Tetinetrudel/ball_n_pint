export type ClientCardsType = {
  id: string
  clientId: string
  organizationId: string
  memberId: string
  createdAt: Date
  updatedAt: Date
  productId: string
  initialCount: number
  remainingCount: number
  memberships: {
    id: string
    userId: string
    organizationId: string
    role: "owner" | "admin" | "staff"
    user: {
      id: string
      name: string
    }
  }
  product: {
    id: string
    name: string
    imageUrl: string | null
  }
}

export type ClientCardsProps = {
  cards: ClientCardsType[]
}
