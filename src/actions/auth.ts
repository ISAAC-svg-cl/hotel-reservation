"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema, profileSchema, type RegisterInput, type LoginInput, type ProfileInput } from "@/lib/validations/auth";
import { signIn, signOut, auth } from "@/lib/auth";
import { Role } from "@/types/enums";
import { AuthError } from "next-auth";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  try {
    const validated = registerSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Données de formulaire invalides",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, email, password, phone } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Un compte existe déjà avec cette adresse email.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || null,
        role: Role.CUSTOMER,
      },
    });

    return {
      success: true,
      message: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      data: { id: user.id, email: user.email },
    };
  } catch (error) {
    console.error("Erreur registerAction:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création de votre compte.",
    };
  }
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  try {
    const validated = loginSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Veuillez vérifier vos identifiants.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validated.data;

    await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Connexion réussie !",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Email ou mot de passe incorrect.",
          };
        default:
          return {
            success: false,
            message: "Échec de l'authentification. Veuillez réessayer.",
          };
      }
    }
    console.error("Erreur loginAction:", error);
    return {
      success: false,
      message: "Identifiants invalides ou service temporairement indisponible.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function updateProfileAction(input: ProfileInput): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Vous devez être connecté pour modifier votre profil.",
      };
    }

    const validated = profileSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Données invalides.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
        avatar: validated.data.avatar || null,
      },
    });

    return {
      success: true,
      message: "Profil mis à jour avec succès.",
      data: updated,
    };
  } catch (error) {
    console.error("Erreur updateProfileAction:", error);
    return {
      success: false,
      message: "Impossible de mettre à jour votre profil pour le moment.",
    };
  }
}
