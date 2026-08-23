import React from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserFavorites } from "@/lib/services/favorite.service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/hotels/FavoriteButton";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardFavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const favorites = await getUserFavorites(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Vos Hôtels Favoris
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Retrouvez rapidement vos établissements enregistrés pour vos prochains séjours.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={hotel.coverImage || "/images/hotels/novotel-lubumbashi/01.jpg"}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="gold">4 Étoiles</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <FavoriteButton hotelId={hotel.id} initialIsFavorite={true} />
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{hotel.averageRating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {hotel.address}, {hotel.city}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">Dès</span>
                    <p className="text-lg font-black text-amber-400">
                      {hotel.startingPrice} $ <span className="text-xs font-normal text-slate-400">/ nuit</span>
                    </p>
                  </div>

                  <Link href={`/hotels/${hotel.slug}`}>
                    <Button variant="primary" size="sm">
                      <span>Voir les chambres</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aucun favori pour le moment</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Cliquez sur le bouton &ldquo;Favori&rdquo; d&apos;un hôtel pour l&apos;ajouter à cette liste.
          </p>
          <Link href="/hotels/novotel-lubumbashi">
            <Button variant="primary" size="sm" className="mt-2">
              Découvrir le Novotel Lubumbashi
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
