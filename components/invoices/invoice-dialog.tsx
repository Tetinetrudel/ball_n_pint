"use client";

import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/hooks/use-mutations";
import { payInvoice, payInvoiceItem } from "@/actions/invoices/invoices";
import { InvoiceWithItems } from "@/lib/types";

type Props = {
  invoice: InvoiceWithItems;
};

export function InvoiceDialog({ invoice }: Props) {

  const [items, setItems] = useState(invoice.items);

  useEffect(() => {
    setItems(invoice.items);
  }, [invoice]);

  const { mutate: payInvoiceMutate, isLoading: payingInvoice } = useMutation(payInvoice, {
    successMessage: "Facture payée avec succès",
    onSuccess: () => {
      setItems(items.map((i) => ({ ...i, paid: true })));
    },
  });

  const { mutate: payItemMutate, isLoading: payingItem } = useMutation(payInvoiceItem, {
    successMessage: "Article payé avec succès",
  });

  const handlePayInvoice = () => {
    payInvoiceMutate(invoice.id);
  };

  const handlePayItem = (itemId: string) => {
    payItemMutate(itemId);
  };

  return (
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Facture #{invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6">
          {/* Items */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">{item.product?.name.slice(0, 2)}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold">{item.product?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.quantity} x {item.product?.price}$
                    </span>
                    {item.paid && (
                      <span className="text-green-600 text-sm font-medium">
                        Payé
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold">{Number(item.product?.price) * item.quantity}$</span>
                  {!item.paid && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handlePayItem(item.id)}
                      disabled={payingItem}
                    >
                      Payer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total & actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
            <div className="text-lg font-bold">
              Total: {items.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0)}$
            </div>

            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>

              <Button
                variant="default"
                disabled={invoice.status === "payee" || payingInvoice}
                onClick={handlePayInvoice}
              >
                {invoice.status === "payee" ? "Payée" : "Payer la facture"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
  );
}