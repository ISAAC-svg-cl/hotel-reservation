"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { assignHotelManagerAction } from "@/actions/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, UserCheck, Edit2, ExternalLink, X } from "lucide-react";

interface ManagerUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface HotelItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  coverImage: string | null;
  managerId: string | null;
  managerName: string | null;
  managerEmail: string | null;
  roomsCount: number;
}

export function AdminHotelManager({
  hotels,
  availableManagers,
}: {
  hotels: HotelItem[];
  availableManagers: ManagerUser[];
}) {
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [managerId, setManagerId] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const openAssignModal = (hotel: HotelItem) => {
    setSelectedHotel(hotel);
    setManagerId(hotel.managerId || "");
  };

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    setMessage(null);
    startTransition(async () => {
      const res = await assignHotelManagerAction(selectedHotel.id, managerId || null);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setSelectedHotel(null);
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
              : "bg-rose-950/40 border-rose-500/30 text-rose-400"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hotel Cards List */}
      <div className="space-y-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                <Image
                  src={hotel.coverImage || "/images/hotels/novotel-lubumbashi/01.jpg"}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
                  <Badge variant="gold">{hotel.starRating} Étoiles</Badge>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {hotel.address}, {hotel.city} ({hotel.country})
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>
                    Gestionnaire :{" "}
                    <strong className="text-amber-400">
                      {hotel.managerName ? `${hotel.managerName} (${hotel.managerEmail})` : "Non assigné"}
                    </strong>
                  </span>
                  <span>
                    Chambres : <strong className="text-white">{hotel.roomsCount} catégories</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAssignModal(hotel)}
                className="flex items-center gap-1 text-xs"
              >
                <UserCheck className="w-4 h-4 text-amber-400" /> Attribuer Gestionnaire
              </Button>

              <Link href={`/hotels/${hotel.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" /> Fiche Publique
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Assignation de Gestionnaire */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Affecter un Gestionnaire</h3>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Choisissez l&apos;utilisateur responsable de l&apos;établissement{" "}
              <strong className="text-white">{selectedHotel.name}</strong>.
            </p>

            <form onSubmit={handleAssignManager} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Gestionnaire désigné
                </label>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Aucun (Non attribué) --</option>
                  {availableManagers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.email} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedHotel(null)}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isPending}>
                  Enregistrer l&apos;affectation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
