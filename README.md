# HOTELIA — Plateforme Web de Réservation Hôtelière (Novotel Lubumbashi)

Application web de réservation de chambres d'hôtel moderne, sécurisée et connectée à une base de données **PostgreSQL** via **Prisma ORM**.
Initialement basée sur le **Novotel Lubumbashi** (Quartier Golf, Lubumbashi, République démocratique du Congo), l'architecture est entièrement extensible pour accueillir de futurs hôtels (ex: Pullman Lubumbashi Grand Karavia) et plusieurs gestionnaires.

---

## 🚀 Stack Technologique

- **Framework** : Next.js 15 (App Router, Server Actions, Server & Client Components)
- **Langage** : TypeScript (Configuration stricte)
- **UI & Design** : React 19, Tailwind CSS v4, Lucide React
- **Base de données & ORM** : PostgreSQL, Prisma ORM
- **Authentification & Sécurité** : NextAuth / Auth.js (Sessions JWT sécurisées, RBAC), bcryptjs
- **Formulaires & Validations** : React Hook Form, Zod
- **Dates & Devises** : date-fns, support USD et CDF (Franc Congolais)

---

## 🏢 Établissement Novotel Lubumbashi (Données Réelles Vérifiées)

- **Nom** : Novotel Lubumbashi
- **Slug** : `novotel-lubumbashi`
- **Adresse** : 01 Avenue Mpala, Quartier Golf
- **Ville** : Lubumbashi
- **Pays** : République démocratique du Congo
- **Code postal** : 7010
- **Catégorie** : Hôtel 4 étoiles
- **Téléphone** : +243 844 422 215
- **Galerie** : 52 images haute définition accessibles via la visionneuse interactive locale (`/public/images/hotels/novotel-lubumbashi/`).

---

## 🔑 Comptes de Démonstration

Trois comptes sont pré-configurés pour les tests et la démonstration :

| Rôle | Email | Mot de passe | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@hotelia.com` | `Hotelia@2026` | Contrôle global, KPI, tous les hôtels, chambres & réservations |
| **Gestionnaire** | `manager@hotelia.com` | `Hotelia@2026` | Gestion exclusive du Novotel Lubumbashi, tarifs & chambres |
| **Client** | `client@hotelia.com` | `Hotelia@2026` | Réservations, favoris, historique et avis vérifiés |

---

## ⚙️ Installation & Configuration

### 1. Cloner et installer les dépendances

```bash
npm install
```

### 2. Configuration des Variables d'Environnement

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Contenu type de `.env` :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hotelia_db?schema=public"
AUTH_SECRET="votre_cle_secrete_ultra_securisee_2026"
NEXTAUTH_SECRET="votre_cle_secrete_ultra_securisee_2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Migrations Prisma & Base de Données

Générez le client Prisma et appliquez le schéma sur votre base PostgreSQL :

```bash
npx prisma generate
npx prisma db push
```

### 4. Peuplement de la Base de Données (Seed)

Exécutez le script de seed pour initialiser le Novotel Lubumbashi, ses 52 images, ses chambres, ses équipements et les comptes démo :

```bash
npm run db:seed
```

### 5. Lancement du Serveur de Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🛡️ Moteur de Réservation & Disponibilité

1. **Anti Double-Réservation Transactionnelle** : Chaque confirmation est encapsulée dans une transaction PostgreSQL atomique (`prisma.$transaction`).
2. **Algorithme de Chevauchement Temporel** :
   $$\text{requestedCheckIn} < \text{existingCheckOut} \quad \text{ET} \quad \text{requestedCheckOut} > \text{existingCheckIn}$$
3. **Réservation Multi-Unités** : Calcul en temps réel de la quantité disponible $\text{availableQuantity} \ge \text{requestedQuantity}$.
4. **Recalcul Côté Serveur** : Le prix total et les taxes (10%) sont recalculés côté serveur à partir des tarifs de la base de données sans faire confiance aux données transmises par le navigateur.
5. **Avis Vérifiés** : Seuls les clients ayant effectué un séjour validé peuvent déposer une note et un avis.

---

## 📁 Architecture du Projet

```text
src/
├── app/
│   ├── (public)/          # Accueil, Hôtels, Fiche Novotel, Booking, Confirmation
│   ├── (auth)/            # Connexion, Inscription, Réinitialisation mot de passe
│   ├── dashboard/         # Espace Client (Réservations, Favoris, Profil)
│   ├── admin/             # Espace Administrateur & Gestionnaire Novotel
│   └── api/auth/          # Route Handler NextAuth
│
├── components/
│   ├── ui/                # Button, Badge, Skeleton
│   ├── layout/            # Navbar, Footer
│   ├── hotels/            # SearchBar, PhotoGalleryModal (52 images), FavoriteButton
│   ├── booking/           # BookingForm interactif
│   ├── dashboard/         # ReservationListClient
│   └── admin/             # AdminReservationManager, AdminRoomManager
│
├── actions/               # Server Actions (Auth, Booking, Hotel, Admin)
├── lib/
│   ├── prisma.ts          # Singleton Prisma Client
│   ├── auth.ts            # Configuration NextAuth & JWT
│   ├── utils.ts           # Formatage monétaire, identifiants HTL-2026-XXXXXX
│   ├── services/          # Logique métier backend (Hotel, Room, Booking, Review, Favorite)
│   └── validations/       # Schémas de validation Zod
│
├── types/                 # Typages TypeScript stricts
prisma/
├── schema.prisma          # Schéma relationnel PostgreSQL
└── seed.ts                # Script de peuplement
public/
└── images/hotels/novotel-lubumbashi/ # 52 images haute définition
```
