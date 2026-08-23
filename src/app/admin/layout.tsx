import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Hotel,
  Users,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "HOTEL_MANAGER") {
    redirect("/dashboard");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {isAdmin ? "Administration Centrale Hotelia" : "Gestion Novotel Lubumbashi"}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                {isAdmin ? "SUPER ADMIN" : "HOTEL MANAGER"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Connecté : {session.user.name} ({session.user.email})
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Espace Client / Accueil</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Admin Navigation Sidebar */}
        <aside className="md:col-span-3 space-y-2">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Tableau de Bord KPI</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/users"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Gestion Clients &amp; Personnel</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/hotels"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Hotel className="w-4 h-4 text-amber-400" />
                <span>Gestion Établissements</span>
              </Link>
            )}

            <Link
              href="/admin/rooms"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bed className="w-4 h-4 text-amber-400" />
              <span>Gestion Chambres &amp; Images</span>
            </Link>

            <Link
              href="/admin/reservations"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Gestion Réservations</span>
            </Link>
          </div>
        </aside>

        {/* Admin Main Content */}
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
