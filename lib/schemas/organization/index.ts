import z from "zod";

export const createOrgFormSchema = z.object({
    name: z.string().min(1, { message: "Le nom est obligatoire" }),
});

export type CreateOrgFormType = z.infer<typeof createOrgFormSchema>;

export const inviteMemberFormSchema = z.object({
    email: z.string().email({ message: "Email invalide" }),
})

export type InviteMemberFormType = z.infer<typeof inviteMemberFormSchema>
