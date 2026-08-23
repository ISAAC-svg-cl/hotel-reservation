"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users, MapPin, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SearchBarProps {
  initialValues?: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    rooms?: number;
  };
  compact?: boolean;
}

export function SearchBar({ initialValues, compact = false }: SearchBarProps) {
  const router = useRouter();

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [city, setCity] = useState(initialValues?.city || "Lubumbashi");
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn || todayStr);
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut || tomorrowStr);
  const [adults, setAdults] = useState(initialValues?.adults || 2);
  const [children, setChildren] = useState(initialValues?.children || 0);
  const [rooms, setRooms] = useState(initialValues?.rooms || 1);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      city,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString(),
    });
    router.push(`/hotels/novotel-lubumbashi?${params.toString()}#chambres`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-3 sm:p-4 transition-all ${
        compact ? "p-2 rounded-2xl" : ""
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Destination */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-grow">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Destination
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lubumbashi, RDC"
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Dates Check-in & Check-out */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="grid grid-cols-2 gap-2 flex-grow">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Arrivée
              </label>
              <input
                type="date"
                value={checkIn}
                min={todayStr}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
                required
              />
            </div>
            <div className="border-l border-slate-800 pl-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Départ
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || todayStr}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Voyageurs & Chambres */}
        <div className="relative">
          <div
            onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Users className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-grow">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Voyageurs & Chambres
              </label>
              <p className="text-xs font-semibold text-white truncate">
                {adults} Adulte{adults > 1 ? "s" : ""}, {children} Enfant{children > 1 ? "s" : ""} &bull; {rooms} Ch.
              </p>
            </div>
          </div>

          {/* Dropdown counter */}
          {showTravelersDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Adultes (18+)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Enfants (0-17)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-xs text-slate-300">Chambres</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setRooms(rooms + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setShowTravelersDropdown(false)}
              >
                Appliquer
              </Button>
            </div>
          )}
        </div>

        {/* Bouton de recherche */}
        <div className="flex items-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-full min-h-[52px] rounded-2xl flex items-center justify-center gap-2 font-bold"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span>Rechercher</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
