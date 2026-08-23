"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Hotel,
  Calendar,
  Heart,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NovotelLogo } from "@/components/ui/NovotelLogo";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center">
            <NovotelLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-amber-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/hotels/novotel-lubumbashi"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/hotels/novotel-lubumbashi")
                  ? "text-amber-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              Chambres &amp; Tarifs
            </Link>
            <Link
              href="/dashboard/reservations"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard/reservations")
                  ? "text-amber-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              Mes réservations
            </Link>
            <Link
              href="/dashboard/favorites"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard/favorites")
                  ? "text-amber-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              Favoris
            </Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-200 line-clamp-1">
                      {session.user.name || "Client"}
                    </p>
                    <p className="text-[10px] text-amber-400 uppercase font-medium">
                      {session.user.role === "ADMIN"
                        ? "Administrateur"
                        : session.user.role === "HOTEL_MANAGER"
                        ? "Gestionnaire"
                        : "Client"}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Connecté en tant que</p>
                      <p className="text-sm font-medium text-white truncate">
                        {session.user.email}
                      </p>
                    </div>

                    {(session.user.role === "ADMIN" || session.user.role === "HOTEL_MANAGER") && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-400 hover:bg-slate-800 font-medium"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Espace Gestion / Admin
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      <User className="w-4 h-4" />
                      Tableau de bord
                    </Link>
                    <Link
                      href="/dashboard/reservations"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      <Calendar className="w-4 h-4" />
                      Mes réservations
                    </Link>
                    <Link
                      href="/dashboard/favorites"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      <Heart className="w-4 h-4" />
                      Mes favoris
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      <User className="w-4 h-4" />
                      Mon Profil
                    </Link>

                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    S&apos;inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Accueil
          </Link>
          <Link
            href="/hotels/novotel-lubumbashi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-amber-400 bg-amber-500/10"
          >
            Chambres &amp; Tarifs Novotel
          </Link>
          <Link
            href="/dashboard/reservations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Mes réservations
          </Link>
          <Link
            href="/dashboard/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Favoris
          </Link>

          {session?.user ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              {(session.user.role === "ADMIN" || session.user.role === "HOTEL_MANAGER") && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-amber-400 bg-slate-900"
                >
                  Administration
                </Link>
              )}
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200"
              >
                Mon Profil ({session.user.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Inscription
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
