export interface FallbackHotel {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  starRating: number;
  coverImage: string | null;
  managerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{
    id: string;
    hotelId: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    isCover: boolean;
  }>;
  amenities: Array<{
    id: string;
    name: string;
    icon: string | null;
  }>;
  rooms: Array<{
    id: string;
    hotelId: string;
    name: string;
    roomNumber: string | null;
    description: string;
    type: string;
    capacity: number;
    size: number;
    pricePerNight: number;
    quantity: number;
    status: string;
    images: Array<{
      id: string;
      roomId: string;
      url: string;
      alt: string | null;
      sortOrder: number;
    }>;
    amenities: Array<{
      id: string;
      name: string;
      icon: string | null;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  reviews: Array<{
    id: string;
    userId: string;
    hotelId: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: Date;
    user?: {
      name: string | null;
      avatar: string | null;
    };
  }>;
  averageRating?: number;
  reviewCount?: number;
  startingPrice?: number;
}

export const FALLBACK_HOTEL: FallbackHotel = {
  id: "cmt5v92mn000p85mg59x6xlor",
  name: "Novotel Lubumbashi",
  slug: "novotel-lubumbashi",
  description:
    "Novotel Lubumbashi est un hôtel d'exception situé dans le quartier résidentiel et prisé du Golf à Lubumbashi (RDC). L'établissement propose des chambres et suites de grand confort, un restaurant gastronomique, une piscine extérieure panoramique, un centre de fitness 24/7 et des espaces de réunion haut de gamme.",
  address: "01 Avenue Mpala, Quartier Golf",
  city: "Lubumbashi",
  country: "République démocratique du Congo",
  postalCode: "7010",
  latitude: -11.660893,
  longitude: 27.479383,
  phone: "+243 844 422 215",
  email: "H9635@accor.com",
  starRating: 4,
  coverImage: "/images/hotels/novotel-lubumbashi/01.jpg",
  managerId: "cmt5v91lt000185mg03w6bph1",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  averageRating: 4.8,
  reviewCount: 3,
  startingPrice: 140,
  images: Array.from({ length: 52 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, "0");
    return {
      id: `img-${num}`,
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      url: `/images/hotels/novotel-lubumbashi/${num}.jpg`,
      alt: `Novotel Lubumbashi - Vue ${num}`,
      sortOrder: i,
      isCover: i === 0,
    };
  }),
  amenities: [
    { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
    { id: "am-2", name: "Parking sécurisé", icon: "Car" },
    { id: "am-3", name: "Piscine extérieure", icon: "Waves" },
    { id: "am-4", name: "Salle de fitness", icon: "Dumbbell" },
    { id: "am-5", name: "Restaurant gastronomique", icon: "Utensils" },
    { id: "am-6", name: "Bar & Lounge", icon: "Wine" },
    { id: "am-7", name: "Service d'étage 24/7", icon: "Bell" },
    { id: "am-8", name: "Réception 24h/24", icon: "Clock" },
    { id: "am-9", name: "Climatisation", icon: "Wind" },
    { id: "am-10", name: "Petit-déjeuner buffet", icon: "Coffee" },
    { id: "am-11", name: "Terrasse panoramique", icon: "Sun" },
    { id: "am-12", name: "Espace de travail", icon: "Briefcase" },
  ],
  reviews: [
    {
      id: "rev-1",
      userId: "u-1",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      rating: 5,
      comment: "Séjour exceptionnel au Quartier Golf. Le personnel est très attentionné et la piscine rooftop offre une vue magnifique.",
      status: "APPROVED",
      createdAt: new Date("2026-02-15"),
      user: { name: "Jean-Marc Mwamba", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    },
    {
      id: "rev-2",
      userId: "u-2",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      rating: 5,
      comment: "Chambre très spacieuse, literie d'un confort remarquable et Wi-Fi ultra rapide. Idéal pour les voyages d'affaires.",
      status: "APPROVED",
      createdAt: new Date("2026-02-10"),
      user: { name: "Sarah Kalala", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    },
    {
      id: "rev-3",
      userId: "u-3",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      rating: 4,
      comment: "Très bel hôtel au cœur de Lubumbashi. Le restaurant propose d'excellents plats locaux et internationaux.",
      status: "APPROVED",
      createdAt: new Date("2026-02-01"),
      user: { name: "Patrick Ilunga", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    },
  ],
  rooms: [
    {
      id: "room-standard",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      name: "Chambre Standard",
      roomNumber: "101-110",
      description:
        "Chambre moderne et confortable équipée d'un lit Queen-size, d'un espace de travail ergonomique, d'une salle de bain privative avec douche à l'italienne et vue sur les jardins.",
      type: "SINGLE",
      capacity: 2,
      size: 24.0,
      pricePerNight: 140.0,
      quantity: 10,
      status: "AVAILABLE",
      images: [
        { id: "ri-02", roomId: "room-standard", url: "/images/hotels/novotel-lubumbashi/02.jpg", alt: "Chambre Standard", sortOrder: 1 },
        { id: "ri-03", roomId: "room-standard", url: "/images/hotels/novotel-lubumbashi/03.jpg", alt: "Chambre Standard - Lit", sortOrder: 2 },
        { id: "ri-04", roomId: "room-standard", url: "/images/hotels/novotel-lubumbashi/04.jpg", alt: "Chambre Standard - Salle de bain", sortOrder: 3 },
      ],
      amenities: [
        { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
        { id: "am-9", name: "Climatisation", icon: "Wind" },
        { id: "am-12", name: "Espace de travail", icon: "Briefcase" },
      ],
    },
    {
      id: "room-superieure",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      name: "Chambre Double Supérieure",
      roomNumber: "201-215",
      description:
        "Chambre spacieuse au design contemporain avec grand lit King-size, coin salon, minibar, machine à café et vue dégagée sur le Quartier Golf.",
      type: "DOUBLE",
      capacity: 2,
      size: 28.0,
      pricePerNight: 180.0,
      quantity: 15,
      status: "AVAILABLE",
      images: [
        { id: "ri-05", roomId: "room-superieure", url: "/images/hotels/novotel-lubumbashi/05.jpg", alt: "Chambre Supérieure", sortOrder: 1 },
        { id: "ri-06", roomId: "room-superieure", url: "/images/hotels/novotel-lubumbashi/06.jpg", alt: "Chambre Supérieure - Vue", sortOrder: 2 },
        { id: "ri-07", roomId: "room-superieure", url: "/images/hotels/novotel-lubumbashi/07.jpg", alt: "Chambre Supérieure - Détail", sortOrder: 3 },
      ],
      amenities: [
        { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
        { id: "am-9", name: "Climatisation", icon: "Wind" },
        { id: "am-12", name: "Espace de travail", icon: "Briefcase" },
      ],
    },
    {
      id: "room-twin",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      name: "Chambre Twin Confort",
      roomNumber: "301-308",
      description:
        "Idéale pour les séjours professionnels ou entre amis, cette chambre propose deux lits simples ultra-confortables, bureau et salle de bain avec baignoire.",
      type: "TWIN",
      capacity: 2,
      size: 28.0,
      pricePerNight: 180.0,
      quantity: 8,
      status: "AVAILABLE",
      images: [
        { id: "ri-08", roomId: "room-twin", url: "/images/hotels/novotel-lubumbashi/08.jpg", alt: "Chambre Twin", sortOrder: 1 },
        { id: "ri-09", roomId: "room-twin", url: "/images/hotels/novotel-lubumbashi/09.jpg", alt: "Chambre Twin - Lits", sortOrder: 2 },
        { id: "ri-10", roomId: "room-twin", url: "/images/hotels/novotel-lubumbashi/10.jpg", alt: "Chambre Twin - Bain", sortOrder: 3 },
      ],
      amenities: [
        { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
        { id: "am-9", name: "Climatisation", icon: "Wind" },
      ],
    },
    {
      id: "room-deluxe",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      name: "Chambre Deluxe Exécutive",
      roomNumber: "401-406",
      description:
        "Située aux étages supérieurs avec accès privilégié aux services Novotel. Lit King-size premium, peignoirs et chaussons, balcon privatif et machine Nespresso.",
      type: "DELUXE",
      capacity: 2,
      size: 36.0,
      pricePerNight: 250.0,
      quantity: 6,
      status: "AVAILABLE",
      images: [
        { id: "ri-11", roomId: "room-deluxe", url: "/images/hotels/novotel-lubumbashi/11.jpg", alt: "Chambre Deluxe", sortOrder: 1 },
        { id: "ri-12", roomId: "room-deluxe", url: "/images/hotels/novotel-lubumbashi/12.jpg", alt: "Chambre Deluxe - Salon", sortOrder: 2 },
        { id: "ri-13", roomId: "room-deluxe", url: "/images/hotels/novotel-lubumbashi/13.jpg", alt: "Chambre Deluxe - Balcon", sortOrder: 3 },
      ],
      amenities: [
        { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
        { id: "am-9", name: "Climatisation", icon: "Wind" },
        { id: "am-11", name: "Terrasse panoramique", icon: "Sun" },
      ],
    },
    {
      id: "room-suite",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      name: "Suite Junior & Panoramique",
      roomNumber: "501-504",
      description:
        "Suite prestigieuse comprenant un salon séparé avec canapé-lit, chambre principale avec lit King-size, double vasque, baignoire balnéo et vue panoramique imprenable sur Lubumbashi.",
      type: "SUITE",
      capacity: 4,
      size: 55.0,
      pricePerNight: 380.0,
      quantity: 4,
      status: "AVAILABLE",
      images: [
        { id: "ri-14", roomId: "room-suite", url: "/images/hotels/novotel-lubumbashi/14.jpg", alt: "Suite Panoramique", sortOrder: 1 },
        { id: "ri-15", roomId: "room-suite", url: "/images/hotels/novotel-lubumbashi/15.jpg", alt: "Suite - Salon", sortOrder: 2 },
        { id: "ri-16", roomId: "room-suite", url: "/images/hotels/novotel-lubumbashi/16.jpg", alt: "Suite - Chambre", sortOrder: 3 },
      ],
      amenities: [
        { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
        { id: "am-9", name: "Climatisation", icon: "Wind" },
        { id: "am-10", name: "Petit-déjeuner buffet", icon: "Coffee" },
        { id: "am-11", name: "Terrasse panoramique", icon: "Sun" },
      ],
    },
    {
      id: "room-family",
      hotelId: "cmt5v92mn000p85mg59x6xlor",
      name: "Chambre Familiale Spacieuse",
      roomNumber: "111-115",
      description:
        "Conçue sur mesure pour les familles jusqu'à 4 personnes avec un lit King-size et deux lits simples ou lits superposés dans un espace séparé sécurisé.",
      type: "FAMILY",
      capacity: 4,
      size: 48.0,
      pricePerNight: 320.0,
      quantity: 5,
      status: "AVAILABLE",
      images: [
        { id: "ri-18", roomId: "room-family", url: "/images/hotels/novotel-lubumbashi/18.jpg", alt: "Chambre Familiale", sortOrder: 1 },
        { id: "ri-19", roomId: "room-family", url: "/images/hotels/novotel-lubumbashi/19.jpg", alt: "Chambre Familiale - Espace enfants", sortOrder: 2 },
        { id: "ri-20", roomId: "room-family", url: "/images/hotels/novotel-lubumbashi/20.jpg", alt: "Chambre Familiale - Vue", sortOrder: 3 },
      ],
      amenities: [
        { id: "am-1", name: "Wi-Fi Haut Débit", icon: "Wifi" },
        { id: "am-9", name: "Climatisation", icon: "Wind" },
      ],
    },
  ],
};
