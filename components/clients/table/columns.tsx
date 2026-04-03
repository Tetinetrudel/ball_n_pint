
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ClientWithRelations } from "@/drizzle/schema"
import Link from "next/link"
import { deleteClient } from "@/actions/clients/clients"
import { UpdateClientForm } from "../forms/update-client-form"
import { useMutation } from "@/hooks/use-mutations"

export const columns: ColumnDef<ClientWithRelations>[] = [
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
    id: "avatar",
    cell: ({ row }) => (
      <div className="bg-muted text-muted-foreground p-2 w-10 h-10 flex items-center justify-center">
        {row.original.name.slice(0, 2).toUpperCase()}
      </div>
    )
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div className="font-medium">
        <Link href={`/organization/${row.original.organizationId}/clients/${row.original.id}`}>
          {row.getValue("name")}
        </Link>
      </div>
    ),
  },
    {
    accessorKey: "email",
    header: "Courriel",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => format(row.getValue("createdAt"), "dd MMM yyyy", { locale: fr }),
  },
{
    id: "actions",
    cell: ({ row, table }) => {
      const client = row.original
      const [open, setOpen] = useState(false) 
      const [deleteOpen, setDeleteOpen] = useState(false)

      const { mutate: deleteClientMutation, isLoading } = useMutation(deleteClient, {
        successMessage: "Client supprimé avec succès",
        onSuccess: () => {
          setDeleteOpen(false)
        },
      })

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
              <UpdateClientForm
                client={client}
                onSuccess={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogTitle>Supprimer le client</DialogTitle>
            <p>Êtes-vous sûr de vouloir supprimer <b>{client.name}</b> ? Cette action est irréversible.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => deleteClientMutation(client.id)}>
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