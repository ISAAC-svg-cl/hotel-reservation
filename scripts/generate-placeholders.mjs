import fs from "fs";
import path from "path";

const targetDir = path.join(process.cwd(), "public", "images", "hotels", "novotel-lubumbashi");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Catégories visuelles
const themes = [
  { title: "Façade & Entrée Principale", bg: "#1e293b", text: "#f8fafc" },
  { title: "Lobby & Réception 24h/24", bg: "#0f172a", text: "#fbbf24" },
  { title: "Piscine Rooftop & Vue Lubumbashi", bg: "#0369a1", text: "#ffffff" },
  { title: "Restaurant & Gastronomie", bg: "#78350f", text: "#fef3c7" },
  { title: "Bar & Lounge Cocktail", bg: "#312e81", text: "#e0e7ff" },
  { title: "Chambre Standard Confort", bg: "#1e3a8a", text: "#ffffff" },
  { title: "Chambre Double Supérieure", bg: "#1e293b", text: "#38bdf8" },
  { title: "Chambre Twin Ergonomique", bg: "#334155", text: "#ffffff" },
  { title: "Chambre Deluxe Exécutive", bg: "#431407", text: "#fed7aa" },
  { title: "Suite Junior Panoramique", bg: "#172554", text: "#dbeafe" },
  { title: "Chambre Familiale Spacieuse", bg: "#064e3b", text: "#a7f3d0" },
  { title: "Salle de Fitness & Sport", bg: "#18181b", text: "#f43f5e" },
  { title: "Sauna, Spa & Bien-être", bg: "#701a75", text: "#f5d0fe" },
  { title: "Terrasse & Jardin Extérieur", bg: "#14532d", text: "#bbf7d0" },
  { title: "Espace Séminaire & Conférence", bg: "#1e1b4b", text: "#c7d2fe" },
];

for (let i = 1; i <= 52; i++) {
  const num = i.toString().padStart(2, "0");
  const fileName = `${num}.jpg`;
  const filePath = path.join(targetDir, fileName);

  // N'écrase pas si un vrai fichier image personnalisé existe déjà et n'est pas un placeholder
  if (fs.existsSync(filePath)) {
    continue;
  }

  const theme = themes[(i - 1) % themes.length];

  // SVG de haute qualité en format d'aspect 16:9
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="rgba(217, 119, 6, 0.25)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#grad${i})" />
  <rect width="1200" height="800" fill="url(#glow)" />
  
  <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
    <circle cx="600" cy="400" r="280" fill="none" />
    <circle cx="600" cy="400" r="180" fill="none" />
  </g>

  <text x="600" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="600" fill="#f59e0b" text-anchor="middle" letter-spacing="6">HOTELIA &bull; NOVOTEL LUBUMBASHI</text>
  <text x="600" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="700" fill="${theme.text}" text-anchor="middle">${theme.title}</text>
  <text x="600" y="440" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="rgba(255,255,255,0.7)" text-anchor="middle">Photo ${num} / 52 &bull; Quartier Golf, Lubumbashi (RDC)</text>
  
  <rect x="525" y="490" width="150" height="36" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" />
  <text x="600" y="514" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">★ ★ ★ ★ LUXE</text>
</svg>`;

  fs.writeFileSync(filePath, svg, "utf-8");
}

console.log("✅ 52 assets d'images initialisés pour le Novotel Lubumbashi.");
