"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/actions/auth/signup";
import { useRouter, useSearchParams } from "next/navigation";
import { signUpFormSchema, SignUpFormType } from "@/lib/schemas/auth";
import Link from "next/link";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useEffect } from "react";

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invitedEmail = searchParams.get("email") ?? ""
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
        name: "",
        email: invitedEmail,
        password: "",
    },
  });

  useEffect(() => {
    if (invitedEmail) {
      form.setValue("email", invitedEmail)
    }
  }, [invitedEmail, form])

  const isLoading = form.formState.isSubmitting
  
  const onSubmit = async (values: SignUpFormType) => {
    const result = await signUp(values);

    if (result.success) {
      toast.success(result.message);
      form.reset();
      router.push("/organization/onboarding")
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-sm"
    >
      <FieldSet>
        <FieldGroup>
            <Field>
            <FieldLabel htmlFor="name">Nom</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Wayne gretzky"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <FieldDescription className="text-destructive">
                {form.formState.errors.name.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Entrez votre nom.
              </FieldDescription>
            )}
          </Field>
          {/* Email */}
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
                Entrez votre adresse email.
              </FieldDescription>
            )}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
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
                Le mot de passe doit contenir au moins 6 caractères.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={isLoading} size="sm" className="w-full">
        <LoadingSwap isLoading={isLoading} >S'inscrire</LoadingSwap>
      </Button>

      <div className="text-center">
        <p>Vous avez un compte Ball'N'Pint ? <Link href="/auth/login" className="text-semibold">Se connecter</Link></p>
      </div>
    </form>
  );
}
