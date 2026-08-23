import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminRoomManager } from "@/components/admin/AdminRoomManager";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Défense en profondeur : seuls ADMIN et HOTEL_MANAGER accèdent à cette page
  if (session.user.role !== "ADMIN" && session.user.role !== "HOTEL_MANAGER") {
    redirect("/dashboard");
  }

  const isManager = session.user.role === "HOTEL_MANAGER";

  // Charger les chambres avec l'hôtel et leurs images
  const rooms = await prisma.room.findMany({
    where: isManager ? { hotel: { managerId: session.user.id } } : {},
    include: {
      hotel: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Charger la liste des hôtels autorisés pour la création de chambre
  const hotels = await prisma.hotel.findMany({
    where: isManager ? { managerId: session.user.id } : {},
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Inventaire des Chambres &amp; Galerie d&apos;Images
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajoutez de nouvelles chambres, importez leurs photos, ajustez les prix, modifiez les caractéristiques ou supprimez des catégories.
        </p>
      </div>

      <AdminRoomManager
        hotels={hotels}
        rooms={rooms.map((r) => ({
          id: r.id,
          hotelId: r.hotel.id,
          hotelName: r.hotel.name,
          name: r.name,
          roomNumber: r.roomNumber,
          description: r.description,
          type: r.type as any,
          capacity: r.capacity,
          size: r.size,
          pricePerNight: Number(r.pricePerNight),
          quantity: r.quantity,
          status: r.status as any,
          images: r.images.map((img) => img.url),
        }))}
      />
    </div>
  );
}
