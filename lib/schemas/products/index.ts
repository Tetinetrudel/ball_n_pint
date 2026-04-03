import { z } from "zod";

export const createProductFormSchema = z.object({
  name: z.string(),
  price: z.string(),
  categoryId: z.string(),
  description: z.string(),
  favorite: z.boolean(),

  imageUrl: z
    .string()
    .url("URL invalide")
    .or(z.literal(""))
    .optional(),
})
export type CreateProductFormType = z.infer<typeof createProductFormSchema>;
