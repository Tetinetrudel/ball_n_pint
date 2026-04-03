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

import { createOrgFormSchema, CreateOrgFormType } from "@/lib/schemas/organization";
import { createOrg } from "@/actions/organizations/organisations";

export function CreateOrgForm() {
  const router = useRouter()
  const form = useForm<CreateOrgFormType>({
    resolver: zodResolver(createOrgFormSchema),
    defaultValues: {
        name: "",
    },
  });

  const onSubmit = async (values: CreateOrgFormType) => {
    const result = await createOrg(values);

    if (result?.success) {
      toast.success(result.message);
      form.reset();
      router.push(`/organization/${result?.newOrg?.id}/dashboard`)
    } else {
      toast.error(result?.message);
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
            <FieldLabel htmlFor="name">Email</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Centre Épique"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <FieldDescription className="text-destructive">
                {form.formState.errors.name.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Entrez le nom de votre Organisation.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit" className="w-full">
        Envoyer
      </Button>
    </form>
  );
}