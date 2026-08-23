import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Hotelia | Réservation de Chambres au Novotel Lubumbashi",
    template: "%s | Hotelia Lubumbashi",
  },
  description:
    "Réservez votre séjour au Novotel Lubumbashi (Quartier Golf, RDC). Tarifs en direct, chambres et suites de luxe, piscine rooftop, wifi haut débit et confirmation instantanée.",
  keywords: [
    "Novotel Lubumbashi",
    "Hôtel Lubumbashi",
    "Réservation hôtel RDC",
    "Chambre Novotel Golf",
    "Séjour Haut-Katanga",
    "Hotelia",
  ],
  authors: [{ name: "Hotelia" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hotelia",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Novotel Lubumbashi — Réservation en ligne sécurisée",
    description:
      "Profitez du meilleur confort à Lubumbashi au Novotel (Quartier Golf). Chambres modernes, restaurant gastronomique, piscine et service 24/7.",
    url: "https://hotelia-lubumbashi.cd",
    siteName: "Hotelia",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <PwaInstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}

