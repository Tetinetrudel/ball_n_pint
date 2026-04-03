
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InvoiceWithItems } from "@/lib/types"
import { formatDate } from "@/lib/formatters/formatters"
import { Trash2Icon, CreditCard, EyeIcon } from "lucide-react";
import { renderInvoiceStatus } from "../invoice-status";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoiceDialog } from "../invoice-dialog";
import { DeleteInvoice } from "../delete-invoice";

export const columns: ColumnDef<InvoiceWithItems>[] = [
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => (
        <div className="pl-2">
            {renderInvoiceStatus(row.original.status)}
        </div>
        )
    },
    {
        accessorKey: "date",
        header: "Créé le",
        cell: ({ row }) => (
        <div className="font-medium">
            {formatDate(row.original.createdAt)}
        </div>
        ),
    },
    {
        accessorKey: "invoice_number",
        header: "# de facture",
        cell: ({ row }) => (
        <div className="px-2">
            {row.original.invoiceNumber}
        </div>
        )
    },

    {
    accessorKey: "total",
    header: "Montant ($)",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.total}
      </div>
    ),
  },
    {
        id: "actions",
        cell: ({ row }) => {
        
            const invoice = row.original
        return (
            <div className="flex items-center gap-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            {row.original.status  === "payee" ? <EyeIcon className="size-4" /> : <CreditCard className="size-4" />}
                        </Button>
                    </DialogTrigger>
                    <InvoiceDialog invoice={invoice} />
                </Dialog>
                
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={row.original.status === "payee" ? "ghost" : "destructive"} size="icon" disabled={row.original.status === "payee"}>
                            <Trash2Icon className="size-4" />
                        </Button>
                    </DialogTrigger>
                    <DeleteInvoice invoiceId={row.original.id} />
                </Dialog>
            </div>
        )
        },
     },
]
