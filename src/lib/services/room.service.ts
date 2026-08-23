import { prisma } from "@/lib/prisma";

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
      return { available: false, availableQuantity: 0, totalQuantity: 0 };
    }

    // Récupérer toutes les réservations actives qui chevauchent l'intervalle
    // Formule: requestedCheckIn < existingCheckOut AND requestedCheckOut > existingCheckIn
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
    const rooms = await prisma.room.findMany({
      where: { hotelId, status: "AVAILABLE" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: true,
      },
      orderBy: { pricePerNight: "asc" },
    });

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
          availableQuantity,
        };
      })
    );

    return roomsWithAvailability;
  } catch (error) {
    console.error("Erreur getRoomsWithAvailability:", error);
    return [];
  }
}
