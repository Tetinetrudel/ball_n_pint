import { z } from "zod";

export const signUpFormSchema = z.object({
    name: z.string().min(1, { message: "Champs obligatoire" }),
    email: z.string().email({ message: "Email invalide" }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
});

export type SignUpFormType = z.infer<typeof signUpFormSchema>;

export const loginFormSchema = z.object({
    email: z.string().email({ message: "Email invalide" }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const forgotPasswordFormSchema = z.object({
    email: z.string().email({ message: "Email invalide" }),
})

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>

export const resetPasswordFormSchema = z.object({
    token: z.string().min(1, { message: "Token manquant" }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
    confirmPassword: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>
