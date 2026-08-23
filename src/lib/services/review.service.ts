import { prisma } from "@/lib/prisma";
import { ReviewInput } from "@/lib/validations/hotel";
import { ReviewStatus } from "@/types/enums";

export async function createReview(userId: string, input: ReviewInput) {
  // Vérifier si l'utilisateur a séjourné dans l'hôtel
  const verifiedReservation = await prisma.reservation.findFirst({
    where: {
      userId,
      hotelId: input.hotelId,
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
  });

  if (!verifiedReservation) {
    throw new Error(
      "Seuls les clients ayant réservé et séjourné dans cet hôtel peuvent déposer un avis."
    );
  }

  // Vérifier s'il n'a pas déjà posté un avis pour cette réservation
  if (input.reservationId) {
    const existing = await prisma.review.findUnique({
      where: { reservationId: input.reservationId },
    });
    if (existing) {
      throw new Error("Vous avez déjà laissé un avis pour ce séjour.");
    }
  }

  return await prisma.review.create({
    data: {
      userId,
      hotelId: input.hotelId,
      reservationId: input.reservationId || verifiedReservation.id,
      rating: input.rating,
      comment: input.comment,
      status: ReviewStatus.APPROVED, // Approbation automatique ou modération
    },
    include: {
      user: { select: { name: true, avatar: true } },
    },
  });
}

export async function getHotelReviews(hotelId: string) {
  return await prisma.review.findMany({
    where: { hotelId, status: ReviewStatus.APPROVED },
    include: {
      user: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
