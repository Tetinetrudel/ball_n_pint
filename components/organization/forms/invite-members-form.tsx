"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inviteMemberFormSchema, InviteMemberFormType } from "@/lib/schemas/organization"
import { inviteMember } from "@/actions/organizations/organisations"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { useMutation } from "@/hooks/use-mutations"

export function InviteMembersForm() {
  const form = useForm<InviteMemberFormType>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: { email: "" },
  })

  const { mutate, isLoading } = useMutation(inviteMember, {
    successMessage: "Invitation envoyée avec succès",
    onSuccess: () => form.reset(),
  })

  function onSubmit(values: InviteMemberFormType) {
    mutate(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="invite-email">Courriel du membre</FieldLabel>
            <Input
              id="invite-email"
              type="email"
              placeholder="employe@exemple.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <FieldDescription className="text-destructive">
                {form.formState.errors.email.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Un courriel d'invitation sera envoyé pour créer un compte.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" size="sm" disabled={isLoading}>
        <LoadingSwap isLoading={isLoading}>Envoyer l'invitation</LoadingSwap>
      </Button>
    </form>
  )
}
