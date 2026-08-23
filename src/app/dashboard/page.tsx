import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserReservations } from "@/lib/services/booking.service";
import { getUserFavorites } from "@/lib/services/favorite.service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  Heart,
  Hotel,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reservations = await getUserReservations(session.user.id);
  const favorites = await getUserFavorites(session.user.id);

  const upcomingReservations = reservations.filter(
    (r) => r.status === "CONFIRMED" || r.status === "PENDING"
  );
  const pastReservations = reservations.filter(
    (r) => r.status === "COMPLETED" || r.status === "CANCELLED"
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Bienvenue, {session.user.name || "Client"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Gérez vos séjours à Lubumbashi et profitez des meilleurs services hôteliers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Séjours à venir
            </span>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {upcomingReservations.length}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Total Réservations
            </span>
            <p className="text-2xl font-black text-white mt-1">
              {reservations.length}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Hôtels Favoris
            </span>
            <p className="text-2xl font-black text-white mt-1">
              {favorites.length}
            </p>
          </div>
        </div>
      </div>

      {/* Prochain séjour actif */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Votre Prochain Séjour
          </h2>
          <Link
            href="/dashboard/reservations"
            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
          >
            Voir l&apos;historique complet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingReservations.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  N° {upcomingReservations[0].reservationNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {upcomingReservations[0].hotel.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {upcomingReservations[0].room.name} ({upcomingReservations[0].numberOfRooms} chambre)
                </p>
              </div>
              <Badge variant="success">
                {upcomingReservations[0].status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">Arrivée</span>
                <span className="font-semibold text-white">
                  {new Date(upcomingReservations[0].checkIn).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Départ</span>
                <span className="font-semibold text-white">
                  {new Date(upcomingReservations[0].checkOut).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Total</span>
                <span className="font-bold text-amber-400">
                  {formatPrice(upcomingReservations[0].total, upcomingReservations[0].currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Paiement</span>
                <span className="font-semibold text-slate-300">
                  {upcomingReservations[0].paymentStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link href={`/confirmation/${upcomingReservations[0].reservationNumber}`}>
                <Button variant="outline" size="sm">
                  Voir le récapitulatif &amp; Détails
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <Hotel className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Aucun séjour à venir</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Planifiez votre prochain séjour au Novotel Lubumbashi dès maintenant.
            </p>
            <Link href="/hotels/novotel-lubumbashi">
              <Button variant="primary" size="sm" className="mt-2">
                Réserver au Novotel
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
