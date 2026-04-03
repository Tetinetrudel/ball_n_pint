"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordFormSchema, ResetPasswordFormType } from "@/lib/schemas/auth"
import { resetPassword } from "@/actions/auth/password-reset"
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
import { useRouter, useSearchParams } from "next/navigation"

function extractToken(searchParams: ReturnType<typeof useSearchParams>) {
  const directToken = searchParams.get("token")
  if (directToken) return directToken

  for (const [key] of searchParams.entries()) {
    if (key.startsWith("token=")) {
      return key.slice("token=".length)
    }
  }

  return ""
}

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = extractToken(searchParams)

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  })

  const { mutate, isLoading } = useMutation(resetPassword, {
    successMessage: "Mot de passe mis à jour avec succès",
    onSuccess: () => {
      form.reset({
        token,
        password: "",
        confirmPassword: "",
      })
      router.push("/auth/login")
    },
  })

  function onSubmit(values: ResetPasswordFormType) {
    mutate(values)
  }

  if (!token) {
    return <p className="text-sm text-destructive">Lien invalide: token manquant.</p>
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-sm"
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">Nouveau mot de passe</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <FieldDescription className="text-destructive">
                {form.formState.errors.password.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Minimum 6 caractères.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword ? (
              <FieldDescription className="text-destructive">
                {form.formState.errors.confirmPassword.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Entrez le même mot de passe pour confirmer.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={isLoading} size="sm" className="w-full">
        <LoadingSwap isLoading={isLoading}>Réinitialiser le mot de passe</LoadingSwap>
      </Button>
    </form>
  )
}
