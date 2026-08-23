import { z } from "zod";

export const searchSchema = z.object({
  city: z.string().default("Lubumbashi"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  adults: z.coerce.number().min(1).default(2),
  children: z.coerce.number().min(0).default(0),
  rooms: z.coerce.number().min(1).default(1),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  roomType: z.string().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "rating_desc", "featured"]).default("featured"),
});

export type SearchInput = z.infer<typeof searchSchema>;

export const reservationSchema = z.object({
  hotelId: z.string().min(1, "L'hôtel est requis"),
  roomId: z.string().min(1, "La chambre est requise"),
  checkIn: z.string().min(1, "La date d'arrivée est requise"),
  checkOut: z.string().min(1, "La date de départ est requise"),
  adults: z.number().min(1, "Au moins un adulte est requis"),
  children: z.number().min(0).default(0),
  numberOfRooms: z.number().min(1).default(1),
  guestName: z.string().min(2, "Le nom du voyageur est requis"),
  guestEmail: z.string().email("Adresse email du voyageur invalide"),
  guestPhone: z.string().min(6, "Téléphone du voyageur requis"),
  specialRequests: z.string().optional(),
  currency: z.enum(["USD", "CDF"]).default("USD"),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const reviewSchema = z.object({
  hotelId: z.string().min(1),
  reservationId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Le commentaire doit comporter au moins 10 caractères"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const hotelFormSchema = z.object({
  name: z.string().min(2, "Nom de l'hôtel requis"),
  slug: z.string().min(2, "Slug requis"),
  description: z.string().min(20, "Description détaillée requise"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  country: z.string().min(2, "Pays requis"),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  starRating: z.coerce.number().min(1).max(5).default(4),
  managerId: z.string().optional().nullable(),
  amenityIds: z.array(z.string()).default([]),
});

export type HotelFormInput = z.infer<typeof hotelFormSchema>;

export const roomFormSchema = z.object({
  hotelId: z.string().min(1),
  name: z.string().min(2, "Nom de chambre requis"),
  roomNumber: z.string().optional(),
  description: z.string().min(10, "Description requise"),
  type: z.enum(["SINGLE", "DOUBLE", "TWIN", "DELUXE", "SUITE", "FAMILY"]),
  capacity: z.coerce.number().min(1, "Capacité minimale de 1 personne"),
  size: z.coerce.number().min(5, "Surface minimale en m²"),
  pricePerNight: z.coerce.number().min(10, "Prix par nuit requis"),
  quantity: z.coerce.number().min(1, "Quantité minimale de 1 unité"),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "INACTIVE"]).default("AVAILABLE"),
  amenityIds: z.array(z.string()).default([]),
});

export type RoomFormInput = z.infer<typeof roomFormSchema>;
