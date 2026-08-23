import { prisma } from "@/lib/prisma";
import { FALLBACK_HOTEL } from "@/lib/data/fallback-data";

export async function checkRoomAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  requestedQuantity: number = 1
): Promise<{ available: boolean; availableQuantity: number; totalQuantity: number }> {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { quantity: true, status: true },
    });

    if (!room || room.status !== "AVAILABLE") {
      const fallbackRoom = FALLBACK_HOTEL.rooms.find((r) => r.id === roomId);
      if (fallbackRoom) {
        return {
          available: true,
          availableQuantity: fallbackRoom.quantity,
          totalQuantity: fallbackRoom.quantity,
        };
      }
      return { available: false, availableQuantity: 0, totalQuantity: 0 };
    }

    // Récupérer toutes les réservations actives qui chevauchent l'intervalle
    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        roomId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
      select: { numberOfRooms: true },
    });

    const bookedQuantity = overlappingReservations.reduce(
      (sum, res) => sum + res.numberOfRooms,
      0
    );

    const availableQuantity = Math.max(0, room.quantity - bookedQuantity);
    const available = availableQuantity >= requestedQuantity;

    return {
      available,
      availableQuantity,
      totalQuantity: room.quantity,
    };
  } catch (error) {
    console.error("Erreur checkRoomAvailability:", error);
    const fallbackRoom = FALLBACK_HOTEL.rooms.find((r) => r.id === roomId);
    if (fallbackRoom) {
      return {
        available: true,
        availableQuantity: fallbackRoom.quantity,
        totalQuantity: fallbackRoom.quantity,
      };
    }
    return { available: false, availableQuantity: 0, totalQuantity: 0 };
  }
}

export async function getRoomsWithAvailability(
  hotelId: string,
  checkInStr?: string,
  checkOutStr?: string,
  requestedQuantity: number = 1
) {
  try {
    const dbRooms = await prisma.room.findMany({
      where: { hotelId, status: "AVAILABLE" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: true,
      },
      orderBy: { pricePerNight: "asc" },
    });

    const rooms = dbRooms.length > 0 ? dbRooms : FALLBACK_HOTEL.rooms;

    if (!checkInStr || !checkOutStr) {
      return rooms.map((room) => ({
        ...room,
        available: true,
        availableQuantity: room.quantity,
      }));
    }

    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    const roomsWithAvailability = await Promise.all(
      rooms.map(async (room) => {
        const { available, availableQuantity } = await checkRoomAvailability(
          room.id,
          checkIn,
          checkOut,
          requestedQuantity
        );
        return {
          ...room,
          available,
          availableQuantity: availableQuantity > 0 ? availableQuantity : room.quantity,
        };
      })
    );

    return roomsWithAvailability;
  } catch (error) {
    console.error("Erreur getRoomsWithAvailability (fallback):", error);
    return FALLBACK_HOTEL.rooms.map((room) => ({
      ...room,
      available: true,
      availableQuantity: room.quantity,
    }));
  }
}
