import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateBookingPrice } from "@/lib/services/booking.service";
import { checkRoomAvailability } from "@/lib/services/room.service";
import { BookingForm } from "@/components/booking/BookingForm";
import { ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface BookingPageProps {
  searchParams: Promise<{
    hotelId?: string;
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    rooms?: string;
  }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const session = await auth();
  const resolvedParams = await searchParams;

  const { hotelId, roomId, checkIn, checkOut } = resolvedParams;

  if (!hotelId || !roomId || !checkIn || !checkOut) {
    redirect("/hotels");
  }

  // Redirection vers login si non authentifié avec callback
  if (!session?.user) {
    const callback = encodeURIComponent(
      `/booking?hotelId=${hotelId}&roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${resolvedParams.adults || 2}&children=${resolvedParams.children || 0}&rooms=${resolvedParams.rooms || 1}`
    );
    redirect(`/login?callbackUrl=${callback}`);
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { hotel: true },
  });

  if (!room || room.hotelId !== hotelId) {
    notFound();
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const adults = resolvedParams.adults ? parseInt(resolvedParams.adults) : 2;
  const childrenCount = resolvedParams.children ? parseInt(resolvedParams.children) : 0;
  const roomsCount = resolvedParams.rooms ? parseInt(resolvedParams.rooms) : 1;

  // Vérifier la disponibilité
  const availability = await checkRoomAvailability(
    room.id,
    checkInDate,
    checkOutDate,
    roomsCount
  );

  if (!availability.available) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Chambre non disponible</h1>
        <p className="text-sm text-slate-400">
          Cette catégorie de chambre n&apos;a plus assez de disponibilités pour vos dates.
        </p>
        <Link
          href={`/hotels/${room.hotel.slug}`}
          className="inline-block text-amber-400 font-bold hover:underline"
        >
          Retour aux chambres du {room.hotel.name}
        </Link>
      </div>
    );
  }

  // Calcul du prix côté serveur
  const calculation = await calculateBookingPrice(
    room.id,
    checkInDate,
    checkOutDate,
    roomsCount,
    "USD"
  );

  if (!calculation) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb workflow */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">
          Accueil
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/hotels/${room.hotel.slug}`} className="hover:text-white">
          {room.hotel.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400 font-bold">Finalisation de la Réservation</span>
      </nav>

      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Confirmez votre séjour
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {room.hotel.name} &bull; {room.name}
        </p>
      </div>

      <BookingForm
        hotel={{
          id: room.hotel.id,
          name: room.hotel.name,
          address: room.hotel.address,
          city: room.hotel.city,
        }}
        room={{
          id: room.id,
          name: room.name,
          pricePerNight: Number(room.pricePerNight),
          type: room.type,
        }}
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        childrenCount={childrenCount}
        roomsCount={roomsCount}
        calculation={calculation}
      />
    </div>
  );
}
