"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { cancelBookingAction } from "@/actions/booking";
import { submitReviewAction } from "@/actions/hotel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Bed,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";

interface ReservationItem {
  id: string;
  reservationNumber: string;
  checkIn: Date | string;
  checkOut: Date | string;
  status: string;
  paymentStatus: string;
  total: number | string | { toString(): string };
  currency: string;
  numberOfRooms: number;
  numberOfNights: number;
  hotel: { id: string; name: string; city: string; slug: string };
  room: { id: string; name: string };
}

export function ReservationListClient({
  reservations,
}: {
  reservations: ReservationItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [reviewModalRes, setReviewModalRes] = useState<ReservationItem | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  const handleCancel = (reservationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;

    startTransition(async () => {
      await cancelBookingAction(reservationId);
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalRes) return;

    const res = await submitReviewAction({
      hotelId: reviewModalRes.hotel.id,
      reservationId: reviewModalRes.id,
      rating,
      comment,
    });

    if (res.success) {
      setReviewMsg("Votre avis a bien été enregistré. Merci !");
      setTimeout(() => {
        setReviewModalRes(null);
        setReviewMsg(null);
        setComment("");
      }, 1500);
    } else {
      setReviewMsg(res.message || "Erreur lors de l'enregistrement de l'avis.");
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
        <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">Aucune réservation trouvée</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Vous n&apos;avez pas encore effectué de réservation sur la plateforme.
        </p>
        <Link href="/hotels/novotel-lubumbashi">
          <Button variant="primary" size="sm" className="mt-2">
            Découvrir le Novotel Lubumbashi
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reservations.map((res) => {
        const canCancel = res.status === "PENDING" || res.status === "CONFIRMED";
        const isCompleted = res.status === "COMPLETED";

        return (
          <div
            key={res.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  N° {res.reservationNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {res.hotel.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {res.hotel.city} &bull; {res.room.name} ({res.numberOfRooms} unité)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    res.status === "CONFIRMED"
                      ? "success"
                      : res.status === "CANCELLED"
                      ? "danger"
                      : res.status === "COMPLETED"
                      ? "gold"
                      : "warning"
                  }
                >
                  {res.status}
                </Badge>
                <Badge variant="outline">{res.paymentStatus}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">Arrivée</span>
                <span className="font-semibold text-white">
                  {new Date(res.checkIn).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Départ</span>
                <span className="font-semibold text-white">
                  {new Date(res.checkOut).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Nuits</span>
                <span className="font-semibold text-white">{res.numberOfNights} nuit(s)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Montant</span>
                <span className="font-bold text-amber-400">
                  {formatPrice(res.total, res.currency)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <Link href={`/confirmation/${res.reservationNumber}`}>
                <Button variant="outline" size="sm">
                  Voir reçu &amp; Détails
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                {isCompleted && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setReviewModalRes(res)}
                    className="flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Laisser un avis
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancel(res.id)}
                    disabled={isPending}
                  >
                    Annuler la réservation
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal Avis pour Séjour Terminé */}
      {reviewModalRes && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Votre avis sur {reviewModalRes.hotel.name}
            </h3>
            <p className="text-xs text-slate-400">
              Partagez votre retour d&apos;expérience avec les futurs voyageurs.
            </p>

            {reviewMsg && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                {reviewMsg}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Note générale (sur 5 étoiles)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-amber-400" : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-white ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Votre commentaire d&apos;expérience
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cadre de l'hôtel, confort de la chambre, petit-déjeuner, service..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewModalRes(null)}
                >
                  Fermer
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publier l&apos;avis
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
