"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { createClient } from "@/actions/clients/clients"
import { createClientFormSchema, CreateClientFormType } from "@/lib/schemas/clients"
import { useMutation } from "@/hooks/use-mutations"

export function CreateClientForm() {

  const form = useForm<CreateClientFormType> ({
    resolver: zodResolver(createClientFormSchema), 
    defaultValues: {
      name:"",
      email: "",
    }
  })

  const { mutate, isLoading } = useMutation(createClient, {
    successMessage: "Client créé avec succès",
    onSuccess: () => {
      form.reset()
    },
  })

  function onSubmit(values: CreateClientFormType) {
    mutate(values)
  }

  return (
    <DialogContent className="px-10">
      <DialogHeader>
        <DialogTitle>Nouveau Client</DialogTitle>
        <DialogDescription>
          Remplir le formulaire ci-dessous pour créer un nouveau client.
        </DialogDescription>
      </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-6xl py-4">
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 space-y-4">
            <Field className="space-y-1">
              <FieldLabel htmlFor="name">Nom complet</FieldLabel>
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
              <LoadingSwap isLoading={isLoading} >Créer le client</LoadingSwap>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
