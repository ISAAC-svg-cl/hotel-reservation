import { prisma } from "@/lib/prisma";

export async function toggleFavorite(userId: string, hotelId: string) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_hotelId: { userId, hotelId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { isFavorite: false };
  } else {
    await prisma.favorite.create({
      data: { userId, hotelId },
    });
    return { isFavorite: true };
  }
}

export async function isHotelFavorite(userId: string, hotelId: string): Promise<boolean> {
  const count = await prisma.favorite.count({
    where: { userId, hotelId },
  });
  return count > 0;
}

export async function getUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      hotel: {
        include: {
          images: { where: { isCover: true }, take: 1 },
          rooms: {
            where: { status: "AVAILABLE" },
            orderBy: { pricePerNight: "asc" },
            take: 1,
          },
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => {
    const h = f.hotel;
    const ratings = h.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : h.starRating;
    const minPrice = h.rooms.length > 0 ? Number(h.rooms[0].pricePerNight) : 140;

    return {
      ...h,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: ratings.length,
      startingPrice: minPrice,
      favoriteId: f.id,
    };
  });
}
