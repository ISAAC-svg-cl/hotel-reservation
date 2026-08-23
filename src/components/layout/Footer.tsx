import React from "react";
import Link from "next/link";
import { NovotelLogo } from "@/components/ui/NovotelLogo";
import { MapPin, Phone, Mail, Shield, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <NovotelLogo size="md" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plateforme de référence pour la réservation hôtelière haut de gamme à Lubumbashi et en République démocratique du Congo.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Disponibilités et tarifs garantis
            </div>
          </div>

          {/* Col 2: Novotel Lubumbashi */}
          <div className="space-y-3">
            <p className="font-semibold text-slate-200 tracking-wide text-sm">
              NOVOTEL LUBUMBASHI
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>01 Avenue Mpala, Quartier Golf, Lubumbashi, RDC</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+243 844 422 215</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@novotel-lubumbashi.cd</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <p className="font-semibold text-slate-200 tracking-wide text-sm">
              EXPLORER
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/hotels/novotel-lubumbashi" className="hover:text-amber-400 transition-colors">
                  Chambres &amp; Suites Novotel
                </Link>
              </li>
              <li>
                <Link href="/hotels/novotel-lubumbashi#chambres" className="hover:text-amber-400 transition-colors">
                  Tarifs &amp; Disponibilités
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reservations" className="hover:text-amber-400 transition-colors">
                  Suivi de réservation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/favorites" className="hover:text-amber-400 transition-colors">
                  Hôtels favoris
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Sécurité & Légal */}
          <div className="space-y-3">
            <p className="font-semibold text-slate-200 tracking-wide text-sm">
              SÉCURITÉ & ASSISTANCE
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              Système de réservation sécurisé avec confirmation instantanée et support client 24h/24.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Paiements à l&apos;arrivée & devises acceptées : USD / CDF</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Hotelia. Tous droits réservés. Lubumbashi, RDC.</p>
          <p className="text-slate-400 text-[11px]">
            Novotel Lubumbashi &bull; Données de réservation en direct
          </p>
        </div>
      </div>
    </footer>
  );
}
