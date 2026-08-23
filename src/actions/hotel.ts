"use server";

import { auth } from "@/lib/auth";
import { toggleFavorite } from "@/lib/services/favorite.service";
import { createReview } from "@/lib/services/review.service";
import { reviewSchema, type ReviewInput } from "@/lib/validations/hotel";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(hotelId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Connectez-vous pour ajouter cet hôtel à vos favoris.",
        isFavorite: false,
      };
    }

    const result = await toggleFavorite(session.user.id, hotelId);
    revalidatePath("/dashboard/favorites");
    revalidatePath(`/hotels`);

    return {
      success: true,
      isFavorite: result.isFavorite,
      message: result.isFavorite
        ? "Hôtel ajouté à vos favoris."
        : "Hôtel retiré de vos favoris.",
    };
  } catch (error) {
    console.error("Erreur toggleFavoriteAction:", error);
    return {
      success: false,
      message: "Une erreur est survenue.",
      isFavorite: false,
    };
  }
}

export async function submitReviewAction(input: ReviewInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Connectez-vous pour publier un avis.",
      };
    }

    const validated = reviewSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Données d'avis invalides.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const review = await createReview(session.user.id, validated.data);
    revalidatePath("/hotels");

    return {
      success: true,
      message: "Votre avis a été publié avec succès !",
      data: review,
    };
  } catch (error: unknown) {
    console.error("Erreur submitReviewAction:", error);
    const message = error instanceof Error ? error.message : "Impossible de soumettre votre avis.";
    return {
      success: false,
      message,
    };
  }
}
