"use client"

import { useState } from "react"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@/hooks/use-mutations"
import { createInvoice } from "@/actions/invoices/invoices"
import { normalizeText } from "@/lib/utils/normalize-text"
import { Loader2Icon } from "lucide-react"

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  price: number
  categoryId: string
}

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

type Props = {
  clientId: string
  categories: Category[]
  products: Product[]
}

export function AddInvoiceDialog({
  clientId,
  categories,
  products,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [productSearch, setProductSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])

  const { mutate, isLoading } = useMutation(createInvoice, {
    successMessage: "Facture créée avec succès",
    onSuccess: () => {
      setCart([])
      setSelectedCategory(null)
    },
  })

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === product.id)
      if (existing) {
        return prev.map((p) =>
          p.productId === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }
      return [...prev, { ...product, productId: product.id, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId))
  }

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const normalizedSearch = normalizeText(productSearch)
  const filteredProducts = products.filter((p) =>
    normalizeText(p.name).includes(normalizedSearch)
  )
  const visibleProducts = normalizedSearch
    ? filteredProducts
    : products.filter((p) => p.categoryId === selectedCategory)

  const handleSubmit = () => {
    mutate({
      clientId,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    })
  }

  return (
    <>
      <DialogTrigger asChild>
        <Button>Nouvelle facture</Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-[90vw]! max-w-[90vw]! max-h-[90vh]! 
          sm:w-[80vw]! sm:max-w-[80vw]!
          md:w-[70vw]! md:!max-w-[70vw]!
          overflow-hidden
          flex flex-col
        "
      >
        <DialogHeader>
          <DialogTitle>Ajouter une facture</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-6 mt-4 overflow-hidden">
          {/* PRODUITS / CATEGORIES */}
          <div className="flex-1 border rounded p-4 overflow-y-auto">
            <Input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="mb-4"
            />

            {!selectedCategory && !normalizedSearch ? (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="outline"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory(null)}
                  className="mb-4"
                >
                  ← Retour aux catégories
                </Button>

                <div className="flex flex-col gap-2">
                  {visibleProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.price}$
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                        >
                          Ajouter
                        </Button>
                      </div>
                    ))}
                  {visibleProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucun produit trouvé.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* PANIER */}
          <div className="w-80 border rounded flex flex-col p-4">
            <h3 className="font-semibold mb-2">Panier</h3>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
              {cart.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun produit
                </p>
              )}

              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p>{item.name} x{item.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.price}$ / unité
                    </p>
                  </div>

                  <div className="flex gap-1 items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((p) =>
                            p.productId === item.productId
                              ? { ...p, quantity: Math.max(1, p.quantity - 1) }
                              : p
                          )
                        )
                      }
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((p) =>
                            p.productId === item.productId
                              ? { ...p, quantity: p.quantity + 1 }
                              : p
                          )
                        )
                      }
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      X
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{total}$</span>
              </div>
              <Button
                className="w-full mt-4 grid grid-cols-1 place-items-center"
                disabled={cart.length === 0 || isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? <Loader2Icon className="animate-spin" /> : "Créer la facture"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </>
  )
}
