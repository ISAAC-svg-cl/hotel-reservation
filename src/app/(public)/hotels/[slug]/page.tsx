import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHotelBySlug } from "@/lib/services/hotel.service";
import { getRoomsWithAvailability } from "@/lib/services/room.service";
import { PhotoGalleryModal } from "@/components/hotels/PhotoGalleryModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  CheckCircle2,
  Users,
  Maximize,
  Bed,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";
import { FavoriteButton } from "@/components/hotels/FavoriteButton";

export const dynamic = "force-dynamic";

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    rooms?: string;
  }>;
}

export default async function HotelDetailPage({
  params,
  searchParams,
}: HotelDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const hotel = await getHotelBySlug(slug);
  if (!hotel) {
    notFound();
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const checkIn = resolvedSearchParams.checkIn || todayStr;
  const checkOut = resolvedSearchParams.checkOut || tomorrowStr;
  const adults = resolvedSearchParams.adults ? parseInt(resolvedSearchParams.adults) : 2;
  const childrenCount = resolvedSearchParams.children ? parseInt(resolvedSearchParams.children) : 0;
  const requestedRooms = resolvedSearchParams.rooms ? parseInt(resolvedSearchParams.rooms) : 1;

  const rooms = await getRoomsWithAvailability(
    hotel.id,
    checkIn,
    checkOut,
    requestedRooms
  );

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* 1. Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <Badge variant="gold">4 Étoiles Supérieur</Badge>
            <span className="text-xs text-slate-400">&bull; Lubumbashi, RDC</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {hotel.name}
          </h1>

          <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{hotel.address}, {hotel.city} ({hotel.country}) &bull; CP: {hotel.postalCode}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FavoriteButton hotelId={hotel.id} />
          <div className="text-right pl-4 border-l border-slate-800">
            <div className="flex items-center justify-end gap-1.5 text-amber-400 font-bold text-lg">
              <span>{hotel.averageRating}</span>
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-400">
              {hotel.reviewCount} avis vérifié{hotel.reviewCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 52-Image Interactive Gallery Preview */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 p-2 h-[420px] sm:h-[500px]">
          {/* Main Large Image */}
          <div className="relative md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden">
            <Image
              src={hotel.images[0]?.url || "/images/hotels/novotel-lubumbashi/01.jpg"}
              alt="Novotel Lubumbashi Façade Principale"
              fill
              className="object-cover hover:scale-102 transition-transform duration-500"
              priority
              unoptimized
            />
            <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs px-3 py-1 rounded-full font-bold border border-amber-500/30">
              Photo Principale (1/52)
            </span>
          </div>

          {/* 4 Secondary thumbnails */}
          {hotel.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden hidden md:block">
              <Image
                src={img.url}
                alt={img.alt || `Photo ${idx + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Modal Lightbox Trigger displaying all 52 photos */}
        <PhotoGalleryModal images={hotel.images} hotelName={hotel.name} />
      </div>

      {/* 3. Main Grid Content: Details + Dates Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description & Amenities */}
        <div className="lg:col-span-8 space-y-10">
          {/* Description */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              À propos du Novotel Lubumbashi
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {hotel.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Téléphone : {hotel.phone || "+243 844 422 215"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email : {hotel.email || "H9635@accor.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Arrivée dès 14h00 &bull; Départ jusqu&apos;à 12h00</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Réception &amp; Sécurité 24h/24</span>
              </div>
            </div>
          </div>

          {/* Équipements de l'hôtel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">
              Équipements &amp; Services de l&apos;établissement
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Chambres disponibles pour les dates sélectionnées */}
          <div className="space-y-6" id="chambres">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Chambres &amp; Tarifs Disponibles
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Du <strong>{checkIn}</strong> au <strong>{checkOut}</strong> &bull; {requestedRooms} chambre(s) &bull; {adults} adulte(s)
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`bg-slate-900 border rounded-3xl overflow-hidden transition-all shadow-xl grid grid-cols-1 md:grid-cols-12 gap-0 ${
                    room.available
                      ? "border-slate-800 hover:border-slate-700"
                      : "border-red-900/40 opacity-75"
                  }`}
                >
                  {/* Room Thumbnail */}
                  <div className="md:col-span-4 relative aspect-[16/11] md:aspect-auto">
                    <Image
                      src={room.images[0]?.url || "/images/hotels/novotel-lubumbashi/02.jpg"}
                      alt={room.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-950/85 text-xs px-2.5 py-1 rounded-full text-white font-medium">
                        {room.type}
                      </span>
                    </div>
                  </div>

                  {/* Room Content */}
                  <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {room.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-amber-400" />
                              Jusqu&apos;à {room.capacity} personnes
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize className="w-3.5 h-3.5 text-amber-400" />
                              {room.size} m²
                            </span>
                          </div>
                        </div>

                        {/* Availability Pill */}
                        <div>
                          {room.available ? (
                            <Badge variant="success">
                              {room.availableQuantity} restante{room.availableQuantity > 1 ? "s" : ""}
                            </Badge>
                          ) : (
                            <Badge variant="danger">Complet pour ces dates</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        {room.description}
                      </p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {room.amenities.map((a) => (
                          <span
                            key={a.id}
                            className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Booking action */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400">Prix par nuit</span>
                        <p className="text-2xl font-black text-amber-400">
                          {Number(room.pricePerNight)} ${" "}
                          <span className="text-xs font-normal text-slate-400">/ nuit</span>
                        </p>
                      </div>

                      {room.available ? (
                        <Link
                          href={`/booking?hotelId=${hotel.id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${childrenCount}&rooms=${requestedRooms}`}
                        >
                          <Button variant="primary" size="md">
                            <span>Réserver cette chambre</span>
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="md" disabled>
                          Indisponible
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Avis clients vérifiés */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Avis des Voyageurs ({hotel.reviewCount})
                </h2>
                <p className="text-xs text-slate-400">
                  Avis déposés exclusivement par des clients ayant séjourné au Novotel Lubumbashi.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {hotel.reviews.length > 0 ? (
                hotel.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                          {rev.user?.name ? rev.user.name[0] : "C"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {rev.user?.name || "Client Vérifié"}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Séjour vérifié
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Aucun avis pour le moment. Soyez le premier à partager votre expérience !
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking / Search modifier widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Modifier vos dates
            </h3>

            <form method="GET" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Arrivée (Check-in)
                </label>
                <input
                  type="date"
                  name="checkIn"
                  defaultValue={checkIn}
                  min={todayStr}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Départ (Check-out)
                </label>
                <input
                  type="date"
                  name="checkOut"
                  defaultValue={checkOut}
                  min={checkIn}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Adultes
                  </label>
                  <input
                    type="number"
                    name="adults"
                    defaultValue={adults}
                    min={1}
                    max={10}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chambres
                  </label>
                  <input
                    type="number"
                    name="rooms"
                    defaultValue={requestedRooms}
                    min={1}
                    max={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Mettre à jour les disponibilités
              </Button>
            </form>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Meilleur tarif garanti</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Réservation sans frais d&apos;intermédiaire. Annulation flexible disponible selon conditions de séjour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
