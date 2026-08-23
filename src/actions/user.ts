"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentification requise.");
  }
  if (session.user.role !== "ADMIN") {
    throw new Error("Accès réservé exclusivement aux Administrateurs.");
  }
  return session.user;
}

export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  try {
    const adminUser = await verifyAdmin();

    if (!["CUSTOMER", "HOTEL_MANAGER", "ADMIN"].includes(newRole)) {
      return { success: false, message: "Rôle spécifié invalide." };
    }

    if (targetUserId === adminUser.id && newRole !== "ADMIN") {
      return { success: false, message: "Vous ne pouvez pas rétrograder votre propre compte Administrateur." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    revalidatePath("/admin/hotels");

    return {
      success: true,
      message: `Rôle de ${updatedUser.name || updatedUser.email} mis à jour : ${newRole}`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur de mise à jour du rôle.";
    return { success: false, message };
  }
}

export async function deleteUserAction(targetUserId: string) {
  try {
    const adminUser = await verifyAdmin();

    if (targetUserId === adminUser.id) {
      return { success: false, message: "Vous ne pouvez pas supprimer votre propre compte d'administrateur en cours." };
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { name: true, email: true },
    });

    if (!userToDelete) {
      return { success: false, message: "Utilisateur introuvable." };
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    revalidatePath("/admin/hotels");

    return {
      success: true,
      message: `Compte de ${userToDelete.name || userToDelete.email} supprimé avec succès.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur.";
    return { success: false, message };
  }
}
