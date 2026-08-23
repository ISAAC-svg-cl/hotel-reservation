import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const Role = {
  CUSTOMER: "CUSTOMER",
  HOTEL_MANAGER: "HOTEL_MANAGER",
  ADMIN: "ADMIN",
} as const;

const RoomType = {
  SINGLE: "SINGLE",
  DOUBLE: "DOUBLE",
  TWIN: "TWIN",
  DELUXE: "DELUXE",
  SUITE: "SUITE",
  FAMILY: "FAMILY",
} as const;

const RoomStatus = {
  AVAILABLE: "AVAILABLE",
  MAINTENANCE: "MAINTENANCE",
  INACTIVE: "INACTIVE",
} as const;

const ReservationStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  NO_SHOW: "NO_SHOW",
} as const;

const PaymentStatus = {
  UNPAID: "UNPAID",
  PENDING: "PENDING",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
} as const;

const ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

async function main() {
  console.log("🌱 Début de la population de la base de données Hotelia...");

  // 1. Nettoyage ordonné des données existantes
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.hotelImage.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Base de données réinitialisée.");

  // 2. Création des utilisateurs de démonstration
  const demoPassword = await bcrypt.hash("Hotelia@2026", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Directeur Général Hotelia",
      email: "admin@hotelia.com",
      password: demoPassword,
      phone: "+243 999 000 001",
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Gestionnaire Novotel",
      email: "manager@hotelia.com",
      password: demoPassword,
      phone: "+243 844 422 215",
      role: Role.HOTEL_MANAGER,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Jean-Marc Mwamba",
      email: "client@hotelia.com",
      password: demoPassword,
      phone: "+243 812 345 678",
      role: Role.CUSTOMER,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("👤 3 utilisateurs créés (Admin, Manager, Client).");

  // 3. Création des équipements (Amenities)
  const amenityNames = [
    { name: "Wi-Fi Haut Débit", icon: "Wifi" },
    { name: "Parking sécurisé", icon: "Car" },
    { name: "Piscine extérieure", icon: "Waves" },
    { name: "Piscine intérieure", icon: "Waves" },
    { name: "Piscine rooftop", icon: "Sparkles" },
    { name: "Salle de fitness", icon: "Dumbbell" },
    { name: "Sauna & Spa", icon: "Flame" },
    { name: "Restaurant gastronomique", icon: "Utensils" },
    { name: "Bar & Lounge", icon: "Wine" },
    { name: "Service d'étage 24/7", icon: "Bell" },
    { name: "Réception 24h/24", icon: "Clock" },
    { name: "Navette aéroport", icon: "Bus" },
    { name: "Climatisation", icon: "Wind" },
    { name: "Chambres familiales", icon: "Users" },
    { name: "Chambres non-fumeurs", icon: "ShieldCheck" },
    { name: "Petit-déjeuner buffet", icon: "Coffee" },
    { name: "Terrasse panoramique", icon: "Sun" },
    { name: "TV écran plat 4K", icon: "Tv" },
    { name: "Coffre-fort", icon: "Lock" },
    { name: "Minibar", icon: "Wine" },
    { name: "Espace de travail", icon: "Briefcase" },
  ];

  const createdAmenities = await Promise.all(
    amenityNames.map((a) =>
      prisma.amenity.create({
        data: {
          name: a.name,
          icon: a.icon,
        },
      })
    )
  );

  console.log(`✨ ${createdAmenities.length} équipements créés.`);

  // 4. Création de l'Hôtel Novotel Lubumbashi
  const hotel = await prisma.hotel.create({
    data: {
      name: "Novotel Lubumbashi",
      slug: "novotel-lubumbashi",
      description:
        "Novotel Lubumbashi est un hôtel situé dans le quartier Golf de Lubumbashi, en République démocratique du Congo. L'établissement propose des chambres et suites, des espaces de restauration, des installations de loisirs et différents services destinés aux voyageurs d'affaires et de loisirs.",
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
      managerId: manager.id,
      amenities: {
        connect: createdAmenities.map((a) => ({ id: a.id })),
      },
    },
  });

  console.log(`🏨 Hôtel créé : ${hotel.name}`);

  // 5. Création des 52 images du Novotel Lubumbashi
  const hotelImageData = Array.from({ length: 52 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, "0");
    return {
      hotelId: hotel.id,
      url: `/images/hotels/novotel-lubumbashi/${num}.jpg`,
      alt: `Novotel Lubumbashi - Vue ${num}`,
      sortOrder: i,
      isCover: i === 0,
    };
  });

  await prisma.hotelImage.createMany({
    data: hotelImageData,
  });

  console.log("📸 52 images enregistrées dans la base de données.");

  // 6. Création des catégories de chambres de démonstration
  const roomsData = [
    {
      name: "Chambre Standard",
      roomNumber: "101-110",
      description:
        "Chambre moderne et confortable équipée d'un lit Queen-size, d'un espace de travail ergonomique, d'une salle de bain privative avec douche à l'italienne et vue sur les jardins.",
      type: RoomType.SINGLE,
      capacity: 2,
      size: 24.0,
      pricePerNight: 140.0,
      quantity: 10,
      status: RoomStatus.AVAILABLE,
      imageIndexes: ["02", "03", "04"],
      amenityKeywords: ["Wi-Fi Haut Débit", "Climatisation", "TV écran plat 4K", "Coffre-fort", "Espace de travail"],
    },
    {
      name: "Chambre Double Supérieure",
      roomNumber: "201-215",
      description:
        "Chambre spacieuse au design contemporain avec grand lit King-size, coin salon, minibar, machine à café et vue dégagée sur le Quartier Golf.",
      type: RoomType.DOUBLE,
      capacity: 2,
      size: 28.0,
      pricePerNight: 180.0,
      quantity: 15,
      status: RoomStatus.AVAILABLE,
      imageIndexes: ["05", "06", "07"],
      amenityKeywords: ["Wi-Fi Haut Débit", "Climatisation", "TV écran plat 4K", "Coffre-fort", "Minibar", "Espace de travail"],
    },
    {
      name: "Chambre Twin Confort",
      roomNumber: "301-308",
      description:
        "Idéale pour les séjours professionnels ou entre amis, cette chambre propose deux lits simples ultra-confortables, bureau et salle de bain avec baignoire.",
      type: RoomType.TWIN,
      capacity: 2,
      size: 28.0,
      pricePerNight: 180.0,
      quantity: 8,
      status: RoomStatus.AVAILABLE,
      imageIndexes: ["08", "09", "10"],
      amenityKeywords: ["Wi-Fi Haut Débit", "Climatisation", "TV écran plat 4K", "Coffre-fort", "Espace de travail"],
    },
    {
      name: "Chambre Deluxe Exécutive",
      roomNumber: "401-406",
      description:
        "Située aux étages supérieurs avec accès privilégié aux services Novotel. Lit King-size premium, peignoirs et chaussons, balcon privatif et machine Nespresso.",
      type: RoomType.DELUXE,
      capacity: 2,
      size: 36.0,
      pricePerNight: 250.0,
      quantity: 6,
      status: RoomStatus.AVAILABLE,
      imageIndexes: ["11", "12", "13"],
      amenityKeywords: [
        "Wi-Fi Haut Débit",
        "Climatisation",
        "TV écran plat 4K",
        "Coffre-fort",
        "Minibar",
        "Terrasse panoramique",
        "Service d'étage 24/7",
      ],
    },
    {
      name: "Suite Junior & Panoramique",
      roomNumber: "501-504",
      description:
        "Suite prestigieuse comprenant un salon séparé avec canapé-lit, chambre principale avec lit King-size, double vasque, baignoire balnéo et vue panoramique imprenable sur Lubumbashi.",
      type: RoomType.SUITE,
      capacity: 4,
      size: 55.0,
      pricePerNight: 380.0,
      quantity: 4,
      status: RoomStatus.AVAILABLE,
      imageIndexes: ["14", "15", "16", "17"],
      amenityKeywords: [
        "Wi-Fi Haut Débit",
        "Climatisation",
        "TV écran plat 4K",
        "Coffre-fort",
        "Minibar",
        "Terrasse panoramique",
        "Service d'étage 24/7",
        "Petit-déjeuner buffet",
      ],
    },
    {
      name: "Chambre Familiale Spacieuse",
      roomNumber: "111-115",
      description:
        "Conçue sur mesure pour les familles jusqu'à 4 personnes avec un lit King-size et deux lits simples ou lits superposés dans un espace séparé sécurisé.",
      type: RoomType.FAMILY,
      capacity: 4,
      size: 48.0,
      pricePerNight: 320.0,
      quantity: 5,
      status: RoomStatus.AVAILABLE,
      imageIndexes: ["18", "19", "20"],
      amenityKeywords: [
        "Wi-Fi Haut Débit",
        "Climatisation",
        "Chambres familiales",
        "TV écran plat 4K",
        "Coffre-fort",
        "Chambres non-fumeurs",
      ],
    },
  ];

  const createdRooms = [];
  for (const r of roomsData) {
    const matchedAmenities = createdAmenities.filter((a) =>
      r.amenityKeywords.includes(a.name)
    );

    const room = await prisma.room.create({
      data: {
        hotelId: hotel.id,
        name: r.name,
        roomNumber: r.roomNumber,
        description: r.description,
        type: r.type,
        capacity: r.capacity,
        size: r.size,
        pricePerNight: r.pricePerNight,
        quantity: r.quantity,
        status: r.status,
        amenities: {
          connect: matchedAmenities.map((a) => ({ id: a.id })),
        },
      },
    });

    // Images de la chambre
    for (let idx = 0; idx < r.imageIndexes.length; idx++) {
      const imgIdx = r.imageIndexes[idx];
      await prisma.roomImage.create({
        data: {
          roomId: room.id,
          url: `/images/hotels/novotel-lubumbashi/${imgIdx}.jpg`,
          alt: `${room.name} - Vue ${idx + 1}`,
          sortOrder: idx,
        },
      });
    }

    createdRooms.push(room);
  }

  console.log(`🛏️ ${createdRooms.length} catégories de chambres créées.`);

  // 7. Réservations de démonstration
  const today = new Date();
  const res1CheckIn = new Date(today);
  res1CheckIn.setDate(today.getDate() + 5);
  const res1CheckOut = new Date(res1CheckIn);
  res1CheckOut.setDate(res1CheckIn.getDate() + 3);

  const res1 = await prisma.reservation.create({
    data: {
      reservationNumber: "HTL-2026-8F42KD",
      userId: customer.id,
      hotelId: hotel.id,
      roomId: createdRooms[1].id, // Chambre Double Supérieure
      checkIn: res1CheckIn,
      checkOut: res1CheckOut,
      adults: 2,
      children: 0,
      numberOfRooms: 1,
      pricePerNight: 180.0,
      numberOfNights: 3,
      subtotal: 540.0,
      tax: 54.0, // 10%
      total: 594.0,
      currency: "USD",
      status: ReservationStatus.CONFIRMED,
      paymentStatus: PaymentStatus.UNPAID,
      guestName: "Jean-Marc Mwamba",
      guestEmail: "client@hotelia.com",
      guestPhone: "+243 812 345 678",
      specialRequests: "Arrivée tardive souhaitée vers 20h. Étage élevé si possible.",
    },
  });

  const res2CheckIn = new Date(today);
  res2CheckIn.setDate(today.getDate() - 10);
  const res2CheckOut = new Date(today);
  res2CheckOut.setDate(today.getDate() - 7);

  const res2 = await prisma.reservation.create({
    data: {
      reservationNumber: "HTL-2026-7A99XY",
      userId: customer.id,
      hotelId: hotel.id,
      roomId: createdRooms[4].id, // Suite Junior
      checkIn: res2CheckIn,
      checkOut: res2CheckOut,
      adults: 2,
      children: 1,
      numberOfRooms: 1,
      pricePerNight: 380.0,
      numberOfNights: 3,
      subtotal: 1140.0,
      tax: 114.0,
      total: 1254.0,
      currency: "USD",
      status: ReservationStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      guestName: "Jean-Marc Mwamba",
      guestEmail: "client@hotelia.com",
      guestPhone: "+243 812 345 678",
      specialRequests: "Lit bébé requis.",
    },
  });

  console.log("📅 2 réservations de test créées.");

  // 8. Avis de démonstration (associé au séjour terminé)
  await prisma.review.create({
    data: {
      userId: customer.id,
      hotelId: hotel.id,
      reservationId: res2.id,
      rating: 5,
      comment:
        "Excellent séjour au Novotel Lubumbashi. Le personnel au Quartier Golf est très attentionné, la piscine et le restaurant sont impeccables. La suite offrait un confort optimal pour notre famille.",
      status: ReviewStatus.APPROVED,
    },
  });

  // 9. Favoris de démonstration
  await prisma.favorite.create({
    data: {
      userId: customer.id,
      hotelId: hotel.id,
    },
  });

  console.log("⭐ Avis et favori de test créés.");
  console.log("✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
