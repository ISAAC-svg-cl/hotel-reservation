"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createBookingAction } from "@/actions/booking";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, User, Mail, Phone, Calendar, Bed, Sparkles, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface BookingFormProps {
  hotel: { id: string; name: string; address: string; city: string };
  room: { id: string; name: string; pricePerNight: number; type: string };
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
  roomsCount: number;
  calculation: {
    numberOfNights: number;
    pricePerNight: number;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
}

export function BookingForm({
  hotel,
  room,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  roomsCount,
  calculation,
}: BookingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [guestName, setGuestName] = useState(session?.user?.name || "");
  const [guestEmail, setGuestEmail] = useState(session?.user?.email || "");
  const [guestPhone, setGuestPhone] = useState(session?.user?.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [currency, setCurrency] = useState<"USD" | "CDF">("USD");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cdfRate = 2800; // Taux indicatif de démonstration 1 USD = 2800 CDF
  const totalDisplay = currency === "CDF" ? calculation.total * cdfRate : calculation.total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!session?.user) {
      router.push(`/login?callbackUrl=/booking`);
      return;
    }

    const res = await createBookingAction({
      hotelId: hotel.id,
      roomId: room.id,
      checkIn,
      checkOut,
      adults,
      children: childrenCount,
      numberOfRooms: roomsCount,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      currency,
    });

    if (res.success && res.data?.reservationNumber) {
      router.push(`/confirmation/${res.data.reservationNumber}`);
    } else {
      setIsLoading(false);
      setErrorMessage(res.message || "Une erreur est survenue lors de la réservation.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Formulaire voyageur */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            Informations du Voyageur Principal
          </h2>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Jean-Marc Mwamba"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="nom@exemple.cd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+243 ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Demandes particulières (optionnel)
              </label>
              <textarea
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ex: Arrivée tardive vers 21h, lit bébé, étage supérieur calme..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Choix de devise & Conditions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Devise &amp; Modalités de Paiement
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all ${
                currency === "USD"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              USD ($ Dollar américain)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("CDF")}
              className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all ${
                currency === "CDF"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              CDF (Franc Congolais)
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Paiement à régler directement sur place à l&apos;accueil du Novotel Lubumbashi lors du check-in.
          </p>
        </div>
      </div>

      {/* Colonne Récapitulatif & Confirmation */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-28">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Récapitulatif du séjour
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{hotel.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{room.name}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Arrivée</span>
              <p className="font-bold text-white mt-0.5">{checkIn}</p>
              <span className="text-[10px] text-slate-400">Dès 14:00</span>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-slate-400 block text-[10px]">Départ</span>
              <p className="font-bold text-white mt-0.5">{checkOut}</p>
              <span className="text-[10px] text-slate-400">Jusqu&apos;à 12:00</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <p>
              &bull; <strong>{calculation.numberOfNights}</strong> nuit{calculation.numberOfNights > 1 ? "s" : ""} &bull; <strong>{roomsCount}</strong> chambre{roomsCount > 1 ? "s" : ""}
            </p>
            <p>
              &bull; <strong>{adults}</strong> adulte{adults > 1 ? "s" : ""}{childrenCount > 0 ? `, ${childrenCount} enfant(s)` : ""}
            </p>
          </div>

          {/* Calcul du Prix Server-side */}
          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{calculation.pricePerNight} $ &times; {calculation.numberOfNights} nuits &times; {roomsCount} ch.</span>
              <span className="text-white font-semibold">{formatPrice(calculation.subtotal, "USD")}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Taxes de séjour (10%)</span>
              <span className="text-white font-semibold">{formatPrice(calculation.tax, "USD")}</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total à régler</span>
              <div className="text-right">
                <p className="text-2xl font-black text-amber-400">
                  {formatPrice(totalDisplay, currency)}
                </p>
                {currency === "CDF" && (
                  <p className="text-[10px] text-slate-400">
                    Équivalent: {formatPrice(calculation.total, "USD")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bouton de confirmation */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full text-base font-bold shadow-xl shadow-amber-600/30"
          >
            Confirmer la Réservation
          </Button>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Anti-double réservation garantie par transaction</span>
          </div>
        </div>
      </div>
    </form>
  );
}
