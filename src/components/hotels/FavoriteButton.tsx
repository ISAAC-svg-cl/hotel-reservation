"use client";

import React, { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/actions/hotel";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  hotelId,
  initialIsFavorite = false,
}: {
  hotelId: string;
  initialIsFavorite?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggle = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/hotels`);
      return;
    }

    startTransition(async () => {
      // Optimistic update
      setIsFavorite(!isFavorite);
      const res = await toggleFavoriteAction(hotelId);
      if (!res.success) {
        setIsFavorite(isFavorite);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-semibold ${
        isFavorite
          ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
      }`}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        className={`w-4 h-4 ${
          isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400"
        }`}
      />
      <span>{isFavorite ? "Favori" : "Sauvegarder"}</span>
    </button>
  );
}
