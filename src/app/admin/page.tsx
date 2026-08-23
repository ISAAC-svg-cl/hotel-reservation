import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DollarSign,
  Calendar,
  Bed,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user) return null;

  const isManager = session.user.role === "HOTEL_MANAGER";
  const isAdminOrManager = session.user.role === "ADMIN" || session.user.role === "HOTEL_MANAGER";

  // Défense en profondeur : le layout bloque déjà, mais on vérifie aussi ici
  if (!isAdminOrManager) {
    redirect("/dashboard");
  }

  // Filtre par hôtel si gestionnaire
  const hotelWhere = isManager
    ? { managerId: session.user.id }
    : {};

  const hotels = await prisma.hotel.findMany({
    where: hotelWhere,
    include: {
      rooms: true,
      reservations: {
        include: { user: true, room: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const allReservations = hotels.flatMap((h) => h.reservations);
  const totalRevenue = allReservations
    .filter((r) => r.status !== "CANCELLED")
    .reduce((sum, r) => sum + Number(r.total), 0);

  const pendingCount = allReservations.filter((r) => r.status === "PENDING").length;
  const confirmedCount = allReservations.filter((r) => r.status === "CONFIRMED").length;
  const completedCount = allReservations.filter((r) => r.status === "COMPLETED").length;
  const totalRooms = hotels.reduce((sum, h) => sum + h.rooms.reduce((rs, r) => rs + r.quantity, 0), 0);

  const recentReservations = allReservations.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Revenus Totaux</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {formatPrice(totalRevenue, "USD")}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">
            + Calculé sur séjours actifs
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Réservations</span>
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {allReservations.length}
          </p>
          <span className="text-[10px] text-amber-400 font-medium">
            {confirmedCount} confirmée(s), {pendingCount} en attente
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inventaire Chambres</span>
            <Bed className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {totalRooms}
          </p>
          <span className="text-[10px] text-slate-400">
            Unités réparties sur {hotels.length} établissement(s)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Séjours Honorés</span>
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {completedCount}
          </p>
          <span className="text-[10px] text-slate-400">
            Séjours terminés avec succès
          </span>
        </div>
      </div>

      {/* Réservations Récentes */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Dernières Réservations Enregistrées
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Flux d&apos;activité en temps réel sur PostgreSQL
            </p>
          </div>
          <Link href="/admin/reservations">
            <Button variant="outline" size="sm">
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-2">N° Réservation</th>
                <th className="py-3 px-2">Voyageur</th>
                <th className="py-3 px-2">Chambre</th>
                <th className="py-3 px-2">Dates</th>
                <th className="py-3 px-2">Montant</th>
                <th className="py-3 px-2">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentReservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-amber-400">
                    {res.reservationNumber}
                  </td>
                  <td className="py-3 px-2 font-medium text-white">
                    {res.guestName}
                  </td>
                  <td className="py-3 px-2">{res.room.name}</td>
                  <td className="py-3 px-2">
                    {new Date(res.checkIn).toLocaleDateString("fr-FR")} &rarr;{" "}
                    {new Date(res.checkOut).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 px-2 font-bold text-white">
                    {formatPrice(res.total, res.currency)}
                  </td>
                  <td className="py-3 px-2">
                    <Badge
                      variant={
                        res.status === "CONFIRMED"
                          ? "success"
                          : res.status === "CANCELLED"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {res.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
