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
import { useRouter } from "next/navigation";
import { loginFormSchema, LoginFormType } from "@/lib/schemas/auth";
import { login } from "@/actions/auth/login";
import Link from "next/link";
import { LoadingSwap } from "@/components/ui/loading-swap";

export function LoginForm() {
  const router = useRouter()
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
        email: "",
        password: "",
    },
  });

  const isLoading = form.formState.isSubmitting
   
  const onSubmit = async (values: LoginFormType) => {
    const result = await login(values);

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
          <div className="flex flex-col space-y-1">
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
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-semibold">Mot de passe oublié ?</Link>
            </div>
          </div>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={isLoading} size="sm" className="w-full">
        <LoadingSwap isLoading={isLoading} >Se connecter</LoadingSwap>
      </Button>

      <div className="text-center">
        <p>Vous n'avez pas de compte ? <Link href="/auth/signup" className="text-semibold">S'inscrire</Link></p>
      </div>
    </form>
  );
}