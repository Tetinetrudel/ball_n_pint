"use client";

import { Badge } from "@/components/ui/badge";

export type InvoiceStatus = "a_payer" | "payee" | "en_souffrance";

const statusMap: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "destructive" | "secondary" | "outline" | "link" | "ghost" | "success" | "warning"  }
> = {
  a_payer: { label: "À payer", variant: "warning" },      
  payee: { label: "Payée", variant: "success" },             
  en_souffrance: { label: "En souffrance", variant: "destructive" }, 
};

export function renderInvoiceStatus(status: InvoiceStatus) {
  const { label, variant } = statusMap[status] ?? { label: "Inconnu", variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
}

export function formatInvoiceStatus(status: InvoiceStatus) {
  return statusMap[status]?.label ?? "Inconnu";
}

export function getInvoiceStatusColor(status: InvoiceStatus) {
  switch (status) {
    case "a_payer":
      return "bg-yellow-400 text-black";
    case "payee":
      return "bg-green-500 text-white";
    case "en_souffrance":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-200 text-black";
  }
}