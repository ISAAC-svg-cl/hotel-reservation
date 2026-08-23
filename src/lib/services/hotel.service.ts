import { prisma } from "@/lib/prisma";
import { SearchInput } from "@/lib/validations/hotel";
import { FALLBACK_HOTEL } from "@/lib/data/fallback-data";

export async function getHotels(params?: Partial<SearchInput>) {
  try {
    const whereClause: Record<string, unknown> = {};

    if (params?.city) {
      whereClause.city = {
        contains: params.city,
        mode: "insensitive",
      };
    }

    if (params?.minPrice || params?.maxPrice) {
      whereClause.rooms = {
        some: {
          pricePerNight: {
            gte: params.minPrice ? params.minPrice : undefined,
            lte: params.maxPrice ? params.maxPrice : undefined,
          },
        },
      };
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };

    if (params?.sortBy === "rating_desc") {
      orderBy = { starRating: "desc" };
    }

    const hotels = await prisma.hotel.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 5,
        },
        amenities: true,
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
      orderBy,
    });

    if (!hotels || hotels.length === 0) {
      return [
        {
          ...FALLBACK_HOTEL,
          averageRating: FALLBACK_HOTEL.averageRating ?? 4.8,
          reviewCount: FALLBACK_HOTEL.reviewCount ?? 3,
          startingPrice: FALLBACK_HOTEL.startingPrice ?? 140,
        },
      ];
    }

    return hotels.map((h) => {
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
      };
    });
  } catch (error) {
    console.error("Erreur getHotels (utilisation du fallback):", error);
    return [
      {
        ...FALLBACK_HOTEL,
        averageRating: FALLBACK_HOTEL.averageRating ?? 4.8,
        reviewCount: FALLBACK_HOTEL.reviewCount ?? 3,
        startingPrice: FALLBACK_HOTEL.startingPrice ?? 140,
      },
    ];
  }
}

export async function getHotelBySlug(slug: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        amenities: true,
        rooms: {
          where: { status: "AVAILABLE" },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            amenities: true,
          },
          orderBy: { pricePerNight: "asc" },
        },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!hotel) {
      if (slug === "novotel-lubumbashi" || slug === "novotel") {
        return {
          ...FALLBACK_HOTEL,
          averageRating: FALLBACK_HOTEL.averageRating ?? 4.8,
          reviewCount: FALLBACK_HOTEL.reviewCount ?? 3,
        };
      }
      return null;
    }

    const ratings = hotel.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : hotel.starRating;

    return {
      ...hotel,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: ratings.length,
    };
  } catch (error) {
    console.error("Erreur getHotelBySlug (utilisation du fallback):", error);
    if (slug === "novotel-lubumbashi" || slug === "novotel") {
      return {
        ...FALLBACK_HOTEL,
        averageRating: FALLBACK_HOTEL.averageRating ?? 4.8,
        reviewCount: FALLBACK_HOTEL.reviewCount ?? 3,
      };
    }
    return null;
  }
}

export async function getFeaturedHotels() {
  return getHotels();
}
