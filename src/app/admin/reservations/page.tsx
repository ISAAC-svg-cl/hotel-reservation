import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminReservationManager } from "@/components/admin/AdminReservationManager";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Défense en profondeur : seuls ADMIN et HOTEL_MANAGER accèdent à cette page
  if (session.user.role !== "ADMIN" && session.user.role !== "HOTEL_MANAGER") {
    redirect("/dashboard");
  }

  const isManager = session.user.role === "HOTEL_MANAGER";

  const reservations = await prisma.reservation.findMany({
    where: isManager ? { hotel: { managerId: session.user.id } } : {},
    include: {
      hotel: true,
      room: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Gestion des Réservations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervisez l&apos;ensemble des réservations et mettez à jour les statuts en direct.
        </p>
      </div>

      <AdminReservationManager
        reservations={reservations.map((r) => ({
          id: r.id,
          reservationNumber: r.reservationNumber,
          hotelName: r.hotel.name,
          roomName: r.room.name,
          guestName: r.guestName,
          guestEmail: r.guestEmail,
          guestPhone: r.guestPhone,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          total: Number(r.total),
          currency: r.currency,
          status: r.status as any,
          paymentStatus: r.paymentStatus,
        }))}
      />
    </div>
  );
}
