import { prisma } from "@/lib/prisma";
import { SearchInput } from "@/lib/validations/hotel";

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
    console.error("Erreur getHotels:", error);
    return [];
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

    if (!hotel) return null;

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
    console.error("Erreur getHotelBySlug:", error);
    return null;
  }
}

export async function getFeaturedHotels() {
  return getHotels();
}
