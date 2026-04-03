"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordFormSchema, ForgotPasswordFormType } from "@/lib/schemas/auth"
import { requestPasswordReset } from "@/actions/auth/password-reset"
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
import Link from "next/link"

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
  })

  const { mutate, isLoading } = useMutation(requestPasswordReset, {
    successMessage: "Si le courriel existe, un lien de réinitialisation a été envoyé.",
    onSuccess: () => form.reset(),
  })

  function onSubmit(values: ForgotPasswordFormType) {
    mutate(values)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-sm"
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <FieldDescription className="text-destructive">
                {form.formState.errors.email.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Entrez le courriel associé à votre compte.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={isLoading} size="sm" className="w-full">
        <LoadingSwap isLoading={isLoading}>Envoyer le lien</LoadingSwap>
      </Button>

      <div className="text-center">
        <Link href="/auth/login" className="text-semibold">Retour à la connexion</Link>
      </div>
    </form>
  )
}
