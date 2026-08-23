import React from "react";
import { auth } from "@/lib/auth";
import { getUserReservations } from "@/lib/services/booking.service";
import { ReservationListClient } from "@/components/dashboard/ReservationListClient";

export const dynamic = "force-dynamic";

export default async function DashboardReservationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reservations = await getUserReservations(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Historique de vos Réservations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Consultez vos séjours passés, en cours et à venir au Novotel Lubumbashi.
        </p>
      </div>

      <ReservationListClient
        reservations={reservations.map((r) => ({
          id: r.id,
          reservationNumber: r.reservationNumber,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          status: r.status,
          paymentStatus: r.paymentStatus,
          total: Number(r.total),
          currency: r.currency,
          numberOfRooms: r.numberOfRooms,
          numberOfNights: r.numberOfNights,
          hotel: {
            id: r.hotel.id,
            name: r.hotel.name,
            city: r.hotel.city,
            slug: r.hotel.slug,
          },
          room: {
            id: r.room.id,
            name: r.room.name,
          },
        }))}
      />
    </div>
  );
}
