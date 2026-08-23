import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminUserManager } from "@/components/admin/AdminUserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      managedHotels: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          reservations: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Gestion des Clients &amp; Personnel
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervisez les comptes clients, attribuez les privilèges de Gestionnaire d&apos;Hôtel ou d&apos;Administrateur, et gérez les accès.
        </p>
      </div>

      <AdminUserManager
        currentUserId={session.user.id}
        users={users.map((u) => ({
          id: u.id,
          name: u.name || "Sans nom",
          email: u.email,
          phone: u.phone || "Non renseigné",
          role: u.role as any,
          createdAt: u.createdAt.toISOString(),
          reservationsCount: u._count.reservations,
          reviewsCount: u._count.reviews,
          managedHotels: u.managedHotels,
        }))}
      />
    </div>
  );
}
