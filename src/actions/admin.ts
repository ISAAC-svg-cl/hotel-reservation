"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hotelFormSchema, roomFormSchema, type HotelFormInput, type RoomFormInput } from "@/lib/validations/hotel";
import { revalidatePath } from "next/cache";
import { ReservationStatus, RoomStatus } from "@/types/enums";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function verifyAdminOrManager() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentification requise.");
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "HOTEL_MANAGER") {
    throw new Error("Accès refusé. Privilèges insuffisants.");
  }
  return session.user;
}

async function verifyAdminOnly() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Accès réservé exclusivement aux administrateurs.");
  }
  return session.user;
}

export async function updateReservationStatusAction(
  reservationId: string,
  status: ReservationStatus
) {
  try {
    const user = await verifyAdminOrManager();

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { hotel: true },
    });

    if (!reservation) {
      return { success: false, message: "Réservation introuvable." };
    }

    if (user.role === "HOTEL_MANAGER" && reservation.hotel.managerId !== user.id) {
      return { success: false, message: "Vous n'avez pas les droits sur cet hôtel." };
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/reservations");

    return {
      success: true,
      message: `Statut de la réservation mis à jour : ${status}`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur de mise à jour.";
    return { success: false, message };
  }
}

export async function createRoomAction(input: RoomFormInput, imageUrls: string[] = []) {
  try {
    const user = await verifyAdminOrManager();

    const validated = roomFormSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, message: "Données de chambre invalides." };
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: validated.data.hotelId },
    });

    if (!hotel) {
      return { success: false, message: "Hôtel spécifié introuvable." };
    }

    if (user.role === "HOTEL_MANAGER" && hotel.managerId !== user.id) {
      return { success: false, message: "Action non autorisée sur cet hôtel." };
    }

    const newRoom = await prisma.room.create({
      data: {
        hotelId: validated.data.hotelId,
        name: validated.data.name,
        roomNumber: validated.data.roomNumber || null,
        description: validated.data.description,
        type: validated.data.type,
        capacity: validated.data.capacity,
        size: validated.data.size,
        pricePerNight: validated.data.pricePerNight,
        quantity: validated.data.quantity,
        status: validated.data.status,
      },
    });

    if (imageUrls.length > 0) {
      await prisma.roomImage.createMany({
        data: imageUrls.map((url, idx) => ({
          roomId: newRoom.id,
          url,
          alt: `${newRoom.name} - Image ${idx + 1}`,
          sortOrder: idx,
        })),
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/rooms");
    revalidatePath("/hotels");

    return { success: true, message: `Chambre "${newRoom.name}" créée avec succès !` };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la création de la chambre.";
    return { success: false, message };
  }
}

export async function updateRoomAction(roomId: string, input: RoomFormInput, imageUrls?: string[]) {
  try {
    const user = await verifyAdminOrManager();

    const validated = roomFormSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, message: "Données de chambre invalides." };
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!room) {
      return { success: false, message: "Chambre introuvable." };
    }

    if (user.role === "HOTEL_MANAGER" && room.hotel.managerId !== user.id) {
      return { success: false, message: "Vous ne pouvez gérer que votre hôtel attribué." };
    }

    await prisma.room.update({
      where: { id: roomId },
      data: {
        name: validated.data.name,
        roomNumber: validated.data.roomNumber || null,
        description: validated.data.description,
        type: validated.data.type,
        capacity: validated.data.capacity,
        size: validated.data.size,
        pricePerNight: validated.data.pricePerNight,
        quantity: validated.data.quantity,
        status: validated.data.status,
      },
    });

    if (imageUrls !== undefined) {
      // Supprimer les images précédentes et ré-insérer
      await prisma.roomImage.deleteMany({
        where: { roomId },
      });

      if (imageUrls.length > 0) {
        await prisma.roomImage.createMany({
          data: imageUrls.map((url, idx) => ({
            roomId,
            url,
            alt: `${validated.data.name} - Image ${idx + 1}`,
            sortOrder: idx,
          })),
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/rooms");
    revalidatePath("/hotels");

    return { success: true, message: "Chambre mise à jour avec succès !" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la modification.";
    return { success: false, message };
  }
}

export async function deleteRoomAction(roomId: string) {
  try {
    const user = await verifyAdminOrManager();

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true, reservations: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } },
    });

    if (!room) {
      return { success: false, message: "Chambre introuvable." };
    }

    if (user.role === "HOTEL_MANAGER" && room.hotel.managerId !== user.id) {
      return { success: false, message: "Vous ne pouvez pas supprimer les chambres d'un autre hôtel." };
    }

    if (room.reservations.length > 0) {
      return {
        success: false,
        message: `Impossible de supprimer cette chambre : ${room.reservations.length} réservation(s) active(s) en cours.`,
      };
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/rooms");
    revalidatePath("/hotels");

    return { success: true, message: `Chambre "${room.name}" supprimée avec succès.` };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la suppression de la chambre.";
    return { success: false, message };
  }
}

export async function toggleRoomStatusAction(roomId: string, currentStatus: RoomStatus) {
  try {
    const user = await verifyAdminOrManager();
    const newStatus = currentStatus === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!room) return { success: false, message: "Chambre introuvable." };
    if (user.role === "HOTEL_MANAGER" && room.hotel.managerId !== user.id) {
      return { success: false, message: "Non autorisé." };
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { status: newStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/rooms");

    return {
      success: true,
      message: `Statut changé en ${newStatus === "AVAILABLE" ? "Disponible" : "En Maintenance"}`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur de mise à jour.";
    return { success: false, message };
  }
}

export async function uploadRoomImageAction(formData: FormData) {
  try {
    await verifyAdminOrManager();

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, message: "Aucun fichier d'image n'a été fourni." };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, message: "Le fichier doit être une image (JPG, PNG, WEBP, etc.)." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "rooms");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const filename = `room_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/rooms/${filename}`;

    return {
      success: true,
      url: publicUrl,
      message: "Image téléchargée avec succès !",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de l'upload de l'image.";
    return { success: false, message };
  }
}

export async function assignHotelManagerAction(hotelId: string, managerId: string | null) {
  try {
    await verifyAdminOnly();

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return { success: false, message: "Hôtel introuvable." };
    }

    if (managerId) {
      const managerUser = await prisma.user.findUnique({
        where: { id: managerId },
      });

      if (!managerUser) {
        return { success: false, message: "Gestionnaire introuvable." };
      }

      // S'assurer que l'utilisateur a le rôle HOTEL_MANAGER s'il était simple client
      if (managerUser.role === "CUSTOMER") {
        await prisma.user.update({
          where: { id: managerId },
          data: { role: "HOTEL_MANAGER" },
        });
      }
    }

    await prisma.hotel.update({
      where: { id: hotelId },
      data: { managerId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/hotels");
    revalidatePath("/admin/users");

    return { success: true, message: "Gestionnaire d'hôtel mis à jour avec succès !" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de l'attribution du gestionnaire.";
    return { success: false, message };
  }
}
