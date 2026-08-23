import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom complet doit comporter au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    phone: z
      .string()
      .min(6, "Numéro de téléphone invalide")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().optional().nullable(),
  avatar: z.string().url("URL d'avatar invalide").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
