import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  User,
  ShieldAlert,
  Sparkles,
  LogOut,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const role = session.user.role;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
                {session.user.name ? session.user.name[0].toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white text-sm truncate">
                  {session.user.name || "Client"}
                </p>
                <span className="inline-block text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  {role === "ADMIN"
                    ? "Administrateur"
                    : role === "HOTEL_MANAGER"
                    ? "Gestionnaire Hôtel"
                    : "Client Privilège"}
                </span>
              </div>
            </div>

            <nav className="space-y-1 text-xs">
              {(role === "ADMIN" || role === "HOTEL_MANAGER") && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Espace Gestion / Admin</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Vue d&apos;ensemble</span>
              </Link>

              <Link
                href="/dashboard/reservations"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Mes Réservations</span>
              </Link>

              <Link
                href="/dashboard/favorites"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Heart className="w-4 h-4 text-amber-400" />
                <span>Mes Favoris</span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Mon Profil</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
