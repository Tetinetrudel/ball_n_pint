"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { addNotesFormSchema, AddNotesFormType } from "@/lib/schemas/clients";
import { Client } from "@/drizzle/schema";
import { addNotes } from "@/actions/clients/clients";
import { useMutation } from "@/hooks/use-mutations";

type Props = {
    client: Client
}

export function AddNotes({ client } : Props) {
  const form = useForm<AddNotesFormType>({
    resolver: zodResolver(addNotesFormSchema),
    defaultValues: {
        notes: ""
    },
  });

  const { mutate, isLoading } = useMutation(addNotes, {
    successMessage: "Note ajoutée avec succès",
    onSuccess: () => {
      form.reset()
    },
  })

  const onSubmit = async (values: AddNotesFormType) => {
    mutate(values, client.id)
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-sm"
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="notes">Note</FieldLabel>
            <Textarea
              id="notes"
              placeholder="notes..."
              {...form.register("notes")}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <div  className="w-full flex items-center gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={() => form.reset()}>Réinitialiser</Button>
        <Button type="submit" disabled={isLoading} size="sm">
            <LoadingSwap isLoading={isLoading} >Créer la note</LoadingSwap>
        </Button>
      </div>
    </form>
  );
}
