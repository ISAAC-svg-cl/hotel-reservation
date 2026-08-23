import { prisma } from "@/lib/prisma";
import { ReservationInput } from "@/lib/validations/hotel";
import { generateReservationNumber } from "@/lib/utils";
import { differenceInCalendarDays, isAfter, isBefore, startOfDay } from "date-fns";
import { ReservationStatus, PaymentStatus } from "@/types/enums";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
export interface BookingCalculation {
  pricePerNight: number;
  numberOfNights: number;
  numberOfRooms: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
}

export async function calculateBookingPrice(
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfRooms: number = 1,
  currency: string = "USD"
): Promise<BookingCalculation | null> {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { pricePerNight: true },
  });

  if (!room) return null;

  const numberOfNights = differenceInCalendarDays(checkOutDate, checkInDate);
  if (numberOfNights <= 0) return null;

  const pricePerNight = Number(room.pricePerNight);
  const subtotal = pricePerNight * numberOfNights * numberOfRooms;
  const taxRate = 0.1; // Taxe de 10%
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return {
    pricePerNight,
    numberOfNights,
    numberOfRooms,
    subtotal,
    tax,
    total,
    currency,
  };
}

export async function createReservationTransaction(
  userId: string,
  input: ReservationInput
) {
  // ---------- DATE VALIDATION ----------
  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  // Invalid dates
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    throw new Error("Dates invalides fournies.");
  }

  // Check-in must be before check-out
  if (!isBefore(checkIn, checkOut)) {
    throw new Error("La date d'arrivée doit être antérieure à la date de départ.");
  }

  // Dates must be in the future (allow same day check‑in)
  const today = startOfDay(new Date());
  if (isBefore(checkIn, today)) {
    throw new Error("La date d'arrivée ne peut pas être dans le passé.");
  }
  if (isBefore(checkOut, today)) {
    throw new Error("La date de départ ne peut pas être dans le passé.");
  }

  // ---------- CAPACITY VALIDATION ----------
  if (input.adults < 1) {
    throw new Error("Le nombre d'adultes doit être au moins 1.");
  }
  if (input.children < 0) {
    throw new Error("Le nombre d'enfants ne peut pas être négatif.");
  }
  if (input.numberOfRooms < 1) {
    throw new Error("Le nombre de chambres doit être au moins 1.");
  }

  // ---------- CURRENCY WHITELIST ----------
  const allowedCurrencies = ["USD"]; // extend if needed
  const currency = input.currency ?? "USD";
  if (!allowedCurrencies.includes(currency)) {
    throw new Error(`Devise non supportée: ${currency}`);
  }

  // ---------- TRANSACTION (SERIALIZABLE) ----------
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify room exists and status
      const room = await tx.room.findUnique({
        where: { id: input.roomId },
        include: { hotel: true },
      });

      if (!room || room.status !== "AVAILABLE") {
        throw new Error("Cette catégorie de chambre n'est pas disponible.");
      }

      if (room.hotelId !== input.hotelId) {
        throw new Error("Incohérence entre l'hôtel et la chambre sélectionnée.");
      }

      // Verify capacity of the room
      const totalGuests = input.adults + input.children;
      if (totalGuests > room.capacity) {
        throw new Error("Le nombre total d'occupants dépasse la capacité de la chambre.");
      }

      // 2. Availability check (anti‑double‑booking)
      const overlapping = await tx.reservation.findMany({
        where: {
          roomId: input.roomId,
          status: { in: ["PENDING", "CONFIRMED"] },
          AND: [
            { checkIn: { lt: checkOut } },
            { checkOut: { gt: checkIn } },
          ],
        },
        select: { numberOfRooms: true },
      });

      const bookedCount = overlapping.reduce((sum, r) => sum + r.numberOfRooms, 0);
      const availableCount = room.quantity - bookedCount;

      if (availableCount < input.numberOfRooms) {
        throw new Error(
          `Désolé, il ne reste que ${availableCount} unité(s) disponible(s) pour ces dates.`
        );
      }

      // 3. Re‑calculate price (server‑side)
      const numberOfNights = differenceInCalendarDays(checkOut, checkIn);
      const pricePerNight = Number(room.pricePerNight);
      const subtotal = pricePerNight * numberOfNights * input.numberOfRooms;
      const tax = Number((subtotal * 0.1).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      // 4. Generate unique reservation number
      let reservationNumber = generateReservationNumber();
      let exists = await tx.reservation.findUnique({ where: { reservationNumber } });
      while (exists) {
        reservationNumber = generateReservationNumber();
        exists = await tx.reservation.findUnique({ where: { reservationNumber } });
      }

      // 5. Create reservation
      const reservation = await tx.reservation.create({
        data: {
          reservationNumber,
          userId,
          hotelId: input.hotelId,
          roomId: input.roomId,
          checkIn,
          checkOut,
          adults: input.adults,
          children: input.children,
          numberOfRooms: input.numberOfRooms,
          pricePerNight,
          numberOfNights,
          subtotal,
          tax,
          total,
          currency,
          status: ReservationStatus.CONFIRMED,
          paymentStatus: PaymentStatus.UNPAID,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
          specialRequests: input.specialRequests || null,
        },
        include: {
          hotel: true,
          room: {
            include: {
              images: { take: 1 },
              amenities: true,
            },
          },
        },
      });

      return reservation;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  } catch (e: any) {
    // Prisma serialization failures throw code P2000? use generic message for user
    if (e?.code === "P2034" || e?.message?.includes("serialization")) {
      throw new Error(
        "Conflit de réservation concurrente. Veuillez réessayer.");
    }
    // Re‑throw known domain errors unchanged
    throw e;
  }
}

export async function getUserReservations(userId: string) {
  return await prisma.reservation.findMany({
    where: { userId },
    include: {
      hotel: {
        include: {
          images: { where: { isCover: true }, take: 1 },
        },
      },
      room: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReservationByNumber(reservationNumber: string) {
  // Retrieve the current session
  const session = await auth();
  if (!session?.user?.id) {
    // Not authenticated – do not expose any data
    return null;
  }
  const { id: userId, role } = session.user;

  // ADMIN can view any reservation
  if (role === "ADMIN") {
    return await prisma.reservation.findUnique({
      where: { reservationNumber },
      include: {
        hotel: { include: { images: { take: 1 } } },
        room: { include: { images: { take: 1 }, amenities: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  // HOTEL_MANAGER can view reservations for hotels they manage
  if (role === "HOTEL_MANAGER") {
    return await prisma.reservation.findFirst({
      where: {
        reservationNumber,
        hotel: { managerId: userId },
      },
      include: {
        hotel: { include: { images: { take: 1 } } },
        room: { include: { images: { take: 1 }, amenities: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  // CUSTOMER – only own reservations
  return await prisma.reservation.findFirst({
    where: { reservationNumber, userId },
    include: {
      hotel: { include: { images: { take: 1 } } },
      room: { include: { images: { take: 1 }, amenities: true } },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

export async function cancelReservation(reservationId: string) {
  // Récupérer la session actuelle
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié.");
  }
  const { id: userId, role } = session.user;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { hotel: true },
  });

  if (!reservation) {
    throw new Error("Réservation introuvable.");
  }

  // ADMIN peut tout annuler
  if (role === "ADMIN") {
    // continue
  } else if (role === "HOTEL_MANAGER") {
    // Manager uniquement sur son hôtel
    if (reservation.hotel.managerId !== userId) {
      throw new Error("Vous n'êtes pas autorisé à annuler cette réservation.");
    }
  } else if (role === "CUSTOMER") {
    // Customer uniquement sur ses propres réservations
    if (reservation.userId !== userId) {
      throw new Error("Vous n'êtes pas autorisé à annuler cette réservation.");
    }
  } else {
    throw new Error("Rôle inconnu.");
  }

  if (reservation.status === "CANCELLED") {
    throw new Error("Cette réservation est déjà annulée.");
  }

  if (reservation.status === "COMPLETED") {
    throw new Error("Un séjour terminé ne peut pas être annulé.");
  }

  return await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: ReservationStatus.CANCELLED },
  });
}
