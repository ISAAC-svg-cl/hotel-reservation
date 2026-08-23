import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminHotelManager } from "@/components/admin/AdminHotelManager";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const hotels = await prisma.hotel.findMany({
    include: {
      manager: true,
      rooms: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const availableManagers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Gestion des Établissements &amp; Gestionnaires
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervisez les hôtels enregistrés (Novotel Lubumbashi, etc.) et attribuez les gestionnaires responsables.
        </p>
      </div>

      <AdminHotelManager
        hotels={hotels.map((h) => ({
          id: h.id,
          name: h.name,
          slug: h.slug,
          address: h.address,
          city: h.city,
          country: h.country,
          starRating: h.starRating,
          coverImage: h.coverImage,
          managerId: h.managerId,
          managerName: h.manager?.name || null,
          managerEmail: h.manager?.email || null,
          roomsCount: h.rooms.length,
        }))}
        availableManagers={availableManagers.map((m) => ({
          id: m.id,
          name: m.name || m.email,
          email: m.email,
          role: m.role,
        }))}
      />
    </div>
  );
}
