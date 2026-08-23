"use client";

import React, { useTransition } from "react";
import { updateReservationStatusAction } from "@/actions/admin";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { ReservationStatus } from "@/types/enums";
import { Check, X, Clock, AlertTriangle } from "lucide-react";

interface AdminResItem {
  id: string;
  reservationNumber: string;
  hotelName: string;
  roomName: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  checkIn: Date | string;
  checkOut: Date | string;
  total: number;
  currency: string;
  status: ReservationStatus;
  paymentStatus: string;
}

export function AdminReservationManager({
  reservations,
}: {
  reservations: AdminResItem[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    startTransition(async () => {
      await updateReservationStatusAction(id, newStatus);
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950/60">
            <tr>
              <th className="py-4 px-4">N° Réservation</th>
              <th className="py-4 px-4">Client &amp; Contact</th>
              <th className="py-4 px-4">Hôtel &amp; Chambre</th>
              <th className="py-4 px-4">Dates</th>
              <th className="py-4 px-4">Montant</th>
              <th className="py-4 px-4">Statut</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-4 font-mono font-bold text-amber-400">
                  {res.reservationNumber}
                </td>
                <td className="py-4 px-4">
                  <p className="font-bold text-white">{res.guestName || "Inconnu"}</p>
                  <p className="text-[10px] text-slate-400">
                    {res.guestEmail} &bull; {res.guestPhone}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <p className="font-medium text-white">{res.hotelName}</p>
                  <p className="text-[10px] text-slate-400">{res.roomName}</p>
                </td>
                <td className="py-4 px-4">
                  {new Date(res.checkIn).toLocaleDateString("fr-FR")} &rarr;{" "}
                  {new Date(res.checkOut).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-4 px-4 font-bold text-white">
                  {formatPrice(res.total, res.currency)}
                </td>
                <td className="py-4 px-4">
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
                </td>
                <td className="py-4 px-4 text-right">
                  <select
                    disabled={isPending}
                    value={res.status}
                    onChange={(e) =>
                      handleStatusChange(res.id, e.target.value as ReservationStatus)
                    }
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="NO_SHOW">NO_SHOW</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
