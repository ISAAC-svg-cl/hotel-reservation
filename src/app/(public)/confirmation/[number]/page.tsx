import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getReservationByNumber } from "@/lib/services/booking.service";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Bed,
  ArrowRight,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  params: Promise<{ number: string }>;
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  // ── 1. Vérification de la session ──────────────────────────────────────────
  const session = await auth();
  const { number } = await params;

  if (!session?.user?.id) {
    // Redirige vers login avec callback pour revenir après connexion
    const callbackUrl = encodeURIComponent(`/confirmation/${number}`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  // ── 2. Récupération de la réservation ──────────────────────────────────────
  const reservation = await getReservationByNumber(number);

  if (!reservation) {
    notFound();
  }

  // ── 3. Vérification des permissions côté serveur ───────────────────────────
  const { id: userId, role } = session.user;

  const isAdmin = role === "ADMIN";
  const isOwner = reservation.userId === userId;
  const isHotelManager =
    role === "HOTEL_MANAGER" && reservation.hotel.managerId === userId;

  if (!isAdmin && !isOwner && !isHotelManager) {
    // L'utilisateur est authentifié mais n'a pas accès à cette réservation
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Accès refusé</h1>
          <p className="text-sm text-slate-400">
            Vous n&apos;êtes pas autorisé à consulter cette réservation.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard/reservations">
            <Button variant="outline" size="md">
              Mes réservations
            </Button>
          </Link>
          <Link href="/">
            <Button variant="primary" size="md">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const checkInFormatted = new Date(reservation.checkIn).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const checkOutFormatted = new Date(reservation.checkOut).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner Success */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Réservation Confirmée !
        </h1>

        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Merci pour votre confiance. Votre réservation a bien été enregistrée auprès du <strong>{reservation.hotel.name}</strong>.
        </p>

        <div className="inline-block bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            Numéro de réservation
          </p>
          <p className="text-2xl font-black text-amber-400 tracking-wider font-mono">
            {reservation.reservationNumber}
          </p>
        </div>
      </div>

      {/* Détails de la réservation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {reservation.hotel.name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {reservation.hotel.address}, {reservation.hotel.city} ({reservation.hotel.country})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Statut : {reservation.status}</Badge>
            <Badge variant="warning">Paiement : {reservation.paymentStatus}</Badge>
          </div>
        </div>

        {/* Grille informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          {/* Dates */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Dates du séjour
            </p>
            <div className="space-y-1.5">
              <p>
                <strong className="text-slate-400">Arrivée :</strong> {checkInFormatted} (dès 14h00)
              </p>
              <p>
                <strong className="text-slate-400">Départ :</strong> {checkOutFormatted} (jusqu&apos;à 12h00)
              </p>
              <p>
                <strong className="text-slate-400">Durée :</strong> {reservation.numberOfNights} nuit{reservation.numberOfNights > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Chambre & Voyageur */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="font-bold text-white text-sm flex items-center gap-2">
              <Bed className="w-4 h-4 text-amber-400" /> Chambre &amp; Client
            </p>
            <div className="space-y-1.5">
              <p>
                <strong className="text-slate-400">Chambre :</strong> {reservation.room.name} ({reservation.numberOfRooms} unité)
              </p>
              <p>
                <strong className="text-slate-400">Voyageur :</strong> {reservation.guestName}
              </p>
              <p>
                <strong className="text-slate-400">Contact :</strong> {reservation.guestEmail} &bull; {reservation.guestPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Détails financiers */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Sous-total chambre ({reservation.numberOfNights} nuits)</span>
            <span className="text-white font-semibold">
              {formatPrice(reservation.subtotal, reservation.currency)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Taxes &amp; frais de séjour (10%)</span>
            <span className="text-white font-semibold">
              {formatPrice(reservation.tax, reservation.currency)}
            </span>
          </div>
          <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Montant Total</span>
            <span className="text-2xl font-black text-amber-400">
              {formatPrice(reservation.total, reservation.currency)}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <Link href="/dashboard/reservations">
            <Button variant="outline" size="md">
              Voir mes réservations
            </Button>
          </Link>

          <Link href="/">
            <Button variant="primary" size="md">
              <span>Retour à l&apos;accueil</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
