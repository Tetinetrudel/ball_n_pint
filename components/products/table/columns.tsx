
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Edit, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { deleteProduct, updateProduct } from "@/actions/products/products"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { UpdateProductForm } from "../forms/update-product-form"
import { ProductsTableMeta } from "./product-data-table"
import { ProductWithRelations } from "@/drizzle/schema"

export const columns: ColumnDef<ProductWithRelations>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.imageUrl
      return (
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => {
      const cat = row.original.category
      return cat ? (
        <Badge variant="secondary">{cat.name}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return (
        <div className="font-medium tabular-nums">
          {new Intl.NumberFormat("fr-CA", {
            style: "currency",
            currency: "CAD",
          }).format(price)}
        </div>
      )
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number | null
      return stock !== null ? (
        <span className="font-mono">{stock}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    accessorKey: "favorite",
    header: "Vedette",
    cell: ({ row }) => {
      const product = row.original
      const isFavorite = product.favorite ?? false

      const handleToggle = async () => {
        const result = await updateProduct({
          id: product.id,
          favorite: !isFavorite,
        },)
        if (result.success) {
          toast.success(`Produit ${!isFavorite ? "ajouté aux" : "retiré des"} favoris`)
        } else {
          toast.error(result.message)
        }
      }
      return (
      <div className="flex items-center">
        {row.original.favorite ? (
          <div
            onClick={handleToggle}
            className="cursor-pointer p-1 rounded-full hover:bg-muted transition-colors inline-block"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleToggle()}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500"/>
          </div>
        ) : (
          <div
            onClick={handleToggle}
            className="cursor-pointer p-1 rounded-full hover:bg-muted transition-colors inline-block"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleToggle()}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className="h-4 w-4 text-muted-foreground"/>
          </div>
        )}
      </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => format(row.getValue("createdAt"), "dd MMM yyyy", { locale: fr }),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const product = row.original
      const category = (table.options.meta as ProductsTableMeta)?.category ?? []
      const [open, setOpen] = useState(false) 
      const [deleteOpen, setDeleteOpen] = useState(false)

        const handleDelete = async () => {
          const result = await deleteProduct(product.id)
          if (result.success) {
            toast.success("Produit supprimé avec succès")
            setDeleteOpen(false)
          } else {
            toast.error(result.message)
          }
        }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Mettre à jour le produit</DialogTitle>
              <UpdateProductForm 
                product={{
                  ...product,
                  categoryId: product.category?.id ?? "",
                }}
                category={category} 
                onSuccess={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogTitle>Supprimer le produit</DialogTitle>
            <p>Êtes-vous sûr de vouloir supprimer <b>{product.name}</b> ? Cette action est irréversible.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </>
      )
    },
  },
]