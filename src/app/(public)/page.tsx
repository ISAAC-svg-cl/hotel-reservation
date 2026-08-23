import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Wifi,
  Waves,
  Utensils,
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  Phone,
  Bed,
} from "lucide-react";
import { SearchBar } from "@/components/hotels/SearchBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedHotels } from "@/lib/services/hotel.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const hotels = await getFeaturedHotels();
  const novotel = hotels.find((h) => h.slug === "novotel-lubumbashi") || hotels[0];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 overflow-hidden">
        {/* Background Image with luxury dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hotels/novotel-lubumbashi/01.jpg"
            alt="Novotel Lubumbashi Façade"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-[0.35]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L&apos;Excellence Hôtelière à Lubumbashi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Trouvez votre chambre idéale à{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Lubumbashi
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Recherchez et réservez facilement votre séjour au <strong>Novotel Lubumbashi</strong> avec confirmation instantanée et garantie du meilleur tarif.
          </p>

          {/* Search Engine */}
          <div className="pt-6 max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Quick trust metrics */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Garantie anti-double réservation</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Confirmation immédiate</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Établissement 4 étoiles certifié</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ÉTABLISSEMENT PHARE : NOVOTEL LUBUMBASHI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="gold" className="mb-2">
              Établissement à l&apos;honneur
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Novotel Lubumbashi
            </h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              01 Avenue Mpala, Quartier Golf, Lubumbashi, RDC
            </p>
          </div>

          <Link href="/hotels/novotel-lubumbashi">
            <Button variant="outline" size="md" className="group">
              <span>Découvrir l&apos;hôtel & les 52 photos</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Featured Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Images Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2 p-3 bg-slate-950">
            <div className="relative col-span-2 aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src="/images/hotels/novotel-lubumbashi/01.jpg"
                alt="Novotel Lubumbashi Façade"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs px-3 py-1 rounded-full font-bold border border-amber-500/30">
                Vue Principale
              </span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="/images/hotels/novotel-lubumbashi/03.jpg"
                alt="Novotel Rooftop Pool"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="/images/hotels/novotel-lubumbashi/05.jpg"
                alt="Novotel Restaurant"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <Link
                href="/hotels/novotel-lubumbashi"
                className="absolute inset-0 bg-slate-950/70 hover:bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm transition-all"
              >
                + 49 autres photos
              </Link>
            </div>
          </div>

          {/* Details & Direct Booking */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-1">
                    4 Étoiles
                  </span>
                </div>
                <Badge variant="success">Disponibilité en direct</Badge>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Situé dans le prestigieux <strong>Quartier Golf de Lubumbashi</strong>, le Novotel propose un cadre haut de gamme alliant confort moderne, piscine rooftop avec vue panoramique, restauration raffinée et espaces professionnels équipés.
              </p>

              {/* Key Amenities */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Waves className="w-4 h-4 text-amber-400" />
                  <span>Piscine Rooftop & Spa</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Wifi className="w-4 h-4 text-amber-400" />
                  <span>Wi-Fi Très Haut Débit</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>Restaurant & Bar Lounge</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Dumbbell className="w-4 h-4 text-amber-400" />
                  <span>Salle de Fitness 24/7</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">À partir de</p>
                <p className="text-2xl font-black text-white">
                  140 $ <span className="text-xs font-normal text-slate-400">/ nuit</span>
                </p>
              </div>
              <Link href="/hotels/novotel-lubumbashi">
                <Button variant="primary" size="lg">
                  Voir les chambres
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATÉGORIES DE CHAMBRES DISPONIBLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="gold">Hébergements</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Chambres &amp; Suites d&apos;Exception
          </h2>
          <p className="text-sm text-slate-400">
            Choisissez l&apos;hébergement qui correspond à votre voyage d&apos;affaires ou séjour en famille à Lubumbashi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Standard */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/hotels/novotel-lubumbashi/02.jpg"
                alt="Chambre Standard"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                24 m² &bull; 2 Personnes
              </span>
            </div>
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Chambre Standard</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Lit Queen-size, espace de travail ergonomique et salle de bain avec douche à l&apos;italienne.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-lg font-bold text-amber-400">140 $ <span className="text-xs text-slate-400">/ nuit</span></span>
                <Link href="/hotels/novotel-lubumbashi">
                  <Button variant="outline" size="sm">Réserver</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Double Supérieure */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/hotels/novotel-lubumbashi/05.jpg"
                alt="Chambre Double Supérieure"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-bold">
                Populaire &bull; 28 m²
              </span>
            </div>
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Chambre Double Supérieure</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Grand lit King-size, coin salon cosy, minibar, machine à café et vue sur le Quartier Golf.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-lg font-bold text-amber-400">180 $ <span className="text-xs text-slate-400">/ nuit</span></span>
                <Link href="/hotels/novotel-lubumbashi">
                  <Button variant="primary" size="sm">Réserver</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Suite Panoramique */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/hotels/novotel-lubumbashi/14.jpg"
                alt="Suite Junior Panoramique"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-500/30">
                Suite &bull; 55 m² &bull; 4 Pers.
              </span>
            </div>
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Suite Junior &amp; Panoramique</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Salon séparé, lit King-size d&apos;exception, baignoire balnéo et vue imprenable sur Lubumbashi.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-lg font-bold text-amber-400">380 $ <span className="text-xs text-slate-400">/ nuit</span></span>
                <Link href="/hotels/novotel-lubumbashi">
                  <Button variant="outline" size="sm">Réserver</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POURQUOI CHOISIR HOTELIA */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Garantie Anti-Double Réservation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notre moteur vérifie en temps réel les chevauchements de dates par transaction PostgreSQL atomique. Votre chambre vous est 100% réservée.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Tarifs Officiels &amp; Transparents
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aucun frais caché. Les taxes et le récapitulatif détaillé vous sont fournis en devises USD et Francs Congolais (CDF).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Support &amp; Conciergerie 24h/24
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notre équipe et la réception de l&apos;hôtel sont joignables en continu pour répondre à vos demandes spécifiques (navette aéroport, arrivée tardive).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
