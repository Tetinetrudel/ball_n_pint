"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Client } from "@/drizzle/schema"
import { updateProduct } from "@/actions/products/products"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { createClientFormSchema, CreateClientFormType } from "@/lib/schemas/clients"
import { updateClient } from "@/actions/clients/clients"

type Props = {
  client: Client
  onSuccess?: () => void
}

export function UpdateClientForm({ client, onSuccess }: Props) {

  const form = useForm<CreateClientFormType>({
    resolver: zodResolver(createClientFormSchema),
    defaultValues: {
      name: client.name ?? "",
      email: client.email ?? ""
    }
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: CreateClientFormType) {
    try {
      const result = await updateClient({
        id: client.id,
        ...values,
      })

      if (result.success) {
        toast.success(`${client.name} mis à jour avec succès`)
        onSuccess?.()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  return (
    <DialogContent className="px-10">
      <DialogHeader>
        <DialogTitle>Mise a jour de {client.name}</DialogTitle>
        <DialogDescription>
          Remplir le formulaire ci-dessous pour modifier le client.
        </DialogDescription>
      </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-6xl py-4">
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 space-y-4">
              <Field className="space-y-1">
                <FieldLabel htmlFor="name">Nom</FieldLabel>
                <Input 
                  id="name" 
                  placeholder="shadcn"
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
          <Field>
            <FieldLabel htmlFor="email">Courriel</FieldLabel>
            <Input 
              id="email" 
              placeholder="test@test.com"
              
              {...form.register("email")}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>
        </div>
        <DialogFooter>
          <div  className="w-full flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => form.reset()}>Réinitialiser</Button>
            <Button type="submit" disabled={isLoading} size="sm">
              <LoadingSwap isLoading={isLoading} >Mettre à jour</LoadingSwap>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}