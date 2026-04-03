import { z } from "zod";

export const createClientFormSchema = z.object({
  name: z.string(),
  email: z.string().email()
})
export type CreateClientFormType = z.infer<typeof createClientFormSchema>;

export const addNotesFormSchema = z.object({
  notes: z.string()
})

export type AddNotesFormType = z.infer<typeof addNotesFormSchema>