import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getHotels } from "@/lib/services/hotel.service";
import { SearchBar } from "@/components/hotels/SearchBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Star, Sparkles, Check, ArrowRight, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

interface HotelsPageProps {
  searchParams: Promise<{
    city?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    rooms?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "price_asc" | "price_desc" | "rating_desc" | "featured";
  }>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const resolvedParams = await searchParams;
  const city = resolvedParams.city || "Lubumbashi";
  const checkIn = resolvedParams.checkIn;
  const checkOut = resolvedParams.checkOut;
  const adults = resolvedParams.adults ? parseInt(resolvedParams.adults) : 2;
  const childrenCount = resolvedParams.children ? parseInt(resolvedParams.children) : 0;
  const roomsCount = resolvedParams.rooms ? parseInt(resolvedParams.rooms) : 1;

  const hotels = await getHotels({
    city,
    checkIn,
    checkOut,
    adults,
    children: childrenCount,
    rooms: roomsCount,
    sortBy: resolvedParams.sortBy,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
        <SearchBar
          compact
          initialValues={{
            city,
            checkIn,
            checkOut,
            adults,
            children: childrenCount,
            rooms: roomsCount,
          }}
        />
      </div>

      {/* Header Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hôtels disponibles à <span className="text-amber-400">{city}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {hotels.length} établissement{hotels.length > 1 ? "s" : ""} trouvé{hotels.length > 1 ? "s" : ""} pour vos dates de séjour
          </p>
        </div>

        {/* Sorting options */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Trier par :
          </span>
          <div className="flex items-center gap-1">
            <Link
              href={`/hotels?city=${city}&sortBy=featured`}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !resolvedParams.sortBy || resolvedParams.sortBy === "featured"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Recommandés
            </Link>
            <Link
              href={`/hotels?city=${city}&sortBy=rating_desc`}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                resolvedParams.sortBy === "rating_desc"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Note
            </Link>
          </div>
        </div>
      </div>

      {/* Hotel Cards List */}
      <div className="space-y-6">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all shadow-xl grid grid-cols-1 md:grid-cols-12 gap-0"
            >
              {/* Image Thumbnail with Cover */}
              <div className="md:col-span-4 relative aspect-[16/11] md:aspect-auto">
                <Image
                  src={hotel.coverImage || "/images/hotels/novotel-lubumbashi/01.jpg"}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <Badge variant="gold">4 Étoiles Luxe</Badge>
                  {hotel.slug === "novotel-lubumbashi" && (
                    <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-[10px] px-2 py-0.5 rounded-md font-bold">
                      Quartier Golf
                    </span>
                  )}
                </div>
              </div>

              {/* Information */}
              <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400">
                        {Array.from({ length: hotel.starRating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {hotel.name}
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {hotel.address}, {hotel.city} ({hotel.country})
                      </p>
                    </div>

                    {/* Rating Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-xl font-bold text-sm">
                        <span>{hotel.averageRating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {hotel.reviewCount} avis vérifié{hotel.reviewCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mt-4 line-clamp-3 leading-relaxed">
                    {hotel.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a.id}
                        className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-amber-400" />
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Price and CTA */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Tarif par nuit dès</span>
                    <p className="text-2xl font-black text-white">
                      {hotel.startingPrice} ${" "}
                      <span className="text-xs font-normal text-slate-400">/ nuit</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/hotels/${hotel.slug}?checkIn=${checkIn || ""}&checkOut=${checkOut || ""}&adults=${adults}&children=${childrenCount}&rooms=${roomsCount}`}
                    >
                      <Button variant="primary" size="md" className="group">
                        <span>Voir les disponibilités</span>
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-white">Aucun hôtel trouvé</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Aucun résultat ne correspond à vos critères de recherche. Essayez de chercher &ldquo;Lubumbashi&rdquo;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
