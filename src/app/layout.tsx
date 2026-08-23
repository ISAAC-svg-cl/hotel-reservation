import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
        </AuthProvider>
      </body>
    </html>
  );
}
