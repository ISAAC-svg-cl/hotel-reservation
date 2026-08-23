"use server";

import { auth } from "@/lib/auth";
import { reservationSchema, type ReservationInput } from "@/lib/validations/hotel";
import { createReservationTransaction, cancelReservation } from "@/lib/services/booking.service";
import { revalidatePath } from "next/cache";

export async function createBookingAction(input: ReservationInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Vous devez être connecté pour réserver une chambre.",
      };
    }

    const validated = reservationSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Informations de réservation incomplètes ou invalides.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const reservation = await createReservationTransaction(
      session.user.id,
      validated.data
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");
    revalidatePath(`/hotels`);

    return {
      success: true,
      message: "Réservation confirmée avec succès !",
      data: {
        reservationNumber: reservation.reservationNumber,
        id: reservation.id,
      },
    };
  } catch (error: unknown) {
    console.error("Erreur createBookingAction:", error);
    const message = error instanceof Error ? error.message : "Échec de la réservation.";
    return {
      success: false,
      message,
    };
  }
}

export async function cancelBookingAction(reservationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Vous devez être connecté pour annuler une réservation.",
      };
    }

    await cancelReservation(reservationId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");

    return {
      success: true,
      message: "Votre réservation a été annulée.",
    };
  } catch (error: unknown) {
    console.error("Erreur cancelBookingAction:", error);
    const message = error instanceof Error ? error.message : "Impossible d'annuler cette réservation.";
    return {
      success: false,
      message,
    };
  }
}
