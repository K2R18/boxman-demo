"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import UniversalDrawer, { type BoutiqueSection } from "@/components/navigation/UniversalDrawer";
export type { BoutiqueSection };

interface BoutiqueNavbarProps {
  activeSection: BoutiqueSection;
  onNavigate: (section: BoutiqueSection) => void;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

// Icône Authentique "Puppy Mask" officielle extraite du code source de dark-ink.com
function PuppyAccountIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 793"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      fill="currentColor"
    >
      <g transform="translate(0,793) scale(0.1,-0.1)" fill="currentColor" stroke="none">
        <path d="M3042 7354 c-30 -21 -96 -154 -133 -267 -38 -115 -104 -241 -183 -348 -135 -182 -192 -314 -203 -462 -8 -119 12 -248 50 -327 17 -36 37 -92 43 -125 16 -79 18 -450 3 -562 -9 -73 -8 -107 5 -196 9 -59 19 -167 22 -240 7 -140 26 -259 67 -422 32 -127 92 -392 107 -468 7 -35 9 -87 5 -128 -9 -86 8 -189 41 -245 27 -49 137 -161 249 -254 44 -37 87 -75 95 -85 8 -10 58 -50 110 -90 52 -40 115 -89 139 -109 84 -71 220 -135 376 -178 55 -15 93 -19 180 -15 95 3 125 9 220 42 116 40 225 96 284 146 20 17 70 55 111 87 41 31 103 81 136 112 34 30 105 93 159 140 92 80 181 176 205 220 6 10 17 55 26 100 11 61 12 89 4 120 -16 58 15 221 112 605 40 159 67 330 67 435 1 47 8 138 18 203 14 104 15 135 3 277 -10 122 -11 202 -3 347 11 186 11 190 46 263 47 99 61 185 54 329 -7 157 -44 259 -147 406 -153 216 -184 273 -239 435 -41 120 -98 228 -133 254 -40 28 -73 11 -89 -46 -11 -42 -8 -318 7 -620 3 -65 3 -118 0 -118 -4 0 -20 15 -36 33 -46 53 -229 107 -582 172 -79 14 -167 31 -195 37 -40 8 -66 8 -105 0 -29 -7 -82 -17 -118 -23 -138 -22 -409 -83 -515 -116 -92 -28 -115 -40 -143 -70 -17 -20 -35 -33 -39 -30 -3 4 2 121 11 259 22 314 14 489 -24 520 -27 22 -39 23 -68 2z m343 -1787 c187 -43 316 -105 323 -156 6 -43 -7 -71 -44 -88 -41 -20 -55 -17 -224 53 l-115 48 -147 6 c-155 5 -175 12 -179 55 -4 43 2 63 29 90 27 27 27 27 137 22 64 -3 156 -15 220 -30z m1570 10 c38 -32 45 -95 13 -124 -21 -19 -36 -22 -168 -25 l-145 -4 -138 -57 c-76 -31 -149 -57 -162 -57 -35 0 -85 46 -85 78 1 36 15 53 76 90 94 58 349 120 496 121 76 1 90 -2 113 -22z m-1605 -372 c47 -15 107 -38 133 -52 143 -72 194 -194 122 -289 -32 -42 -193 -150 -244 -164 -105 -29 -214 18 -260 112 -29 62 -72 232 -73 289 0 57 18 91 65 120 43 27 140 21 257 -16z m1539 17 c40 -21 71 -73 71 -117 0 -40 -52 -239 -74 -287 -24 -50 -85 -104 -133 -117 -85 -24 -144 -8 -255 68 -124 84 -150 116 -150 186 0 123 134 220 387 278 49 11 122 6 154 -11z m-702 -688 c80 -18 137 -55 171 -113 24 -40 27 -57 27 -131 0 -73 -5 -95 -31 -157 -17 -39 -48 -92 -69 -117 -43 -53 -269 -226 -294 -226 -15 1 -40 18 -182 126 -80 61 -138 128 -169 198 -81 178 -48 332 86 399 28 15 105 31 194 41 56 6 200 -4 267 -20z m-769 -606 c7 -7 12 -25 12 -40 0 -50 -81 -51 -88 -1 -6 40 48 69 76 41z m1210 0 c7 -7 12 -21 12 -33 0 -12 -5 -26 -12 -33 -27 -27 -78 -7 -78 29 0 39 52 63 78 37z m-1053 -222 c13 -19 13 -28 4 -50 -22 -46 -82 -46 -100 1 -23 60 61 103 96 49z m919 8 c25 -24 20 -61 -10 -81 -24 -15 -29 -15 -53 -2 -49 27 -35 99 19 99 16 0 36 -7 44 -16z m-218 -261 c-4 -43 -10 -158 -14 -257 l-7 -178 -48 -44 c-122 -110 -297 -111 -432 -1 l-30 25 -7 189 c-4 103 -10 223 -14 266 l-6 77 282 0 282 0 -6 -77z" />
        <path d="M2810 3130 c-169 -34 -240 -53 -240 -64 1 -6 108 -238 239 -516 l238 -505 950 -3 950 -2 238 504 c130 277 235 509 231 514 -10 17 -90 41 -220 66 l-128 24 -62 -51 c-182 -155 -428 -272 -690 -329 -87 -19 -131 -22 -326 -22 -195 0 -239 3 -326 22 -263 57 -507 174 -691 329 -34 29 -64 53 -65 52 -2 0 -46 -9 -98 -19z" />
        <path d="M1920 2910 c-933 -306 -1339 -772 -1495 -1714 -39 -239 -65 -499 -81 -828 l-7 -138 3653 0 3653 0 -7 138 c-16 329 -42 589 -81 828 -145 872 -503 1331 -1280 1637 -175 69 -344 122 -354 111 -16 -18 -481 -1016 -477 -1023 3 -4 163 -83 356 -175 273 -132 351 -174 355 -190 88 -383 125 -550 125 -567 0 -16 -4 -19 -20 -14 -12 4 -208 98 -438 209 -229 112 -494 240 -587 284 l-170 82 -1064 0 -1064 0 -181 -87 c-100 -47 -365 -175 -590 -285 -224 -109 -412 -198 -417 -198 -15 0 -11 20 50 288 32 141 62 271 65 288 7 30 22 39 349 195 188 89 343 164 345 165 4 2 -477 1026 -486 1036 -4 3 -72 -15 -152 -42z" />
      </g>
    </svg>
  );
}

// Chien animé qui rattrape le produit entre ses dents au panier
function PuppyCatchIcon({ phase, image }: { phase: "open" | "bite"; image?: string }) {
  if (phase === "open") {
    return (
      <div className="relative flex items-center justify-center w-7 h-7 animate-bounce">
        <svg viewBox="0 0 36 36" className="w-7 h-7 drop-shadow-md">
          {/* Oreilles */}
          <path d="M5 11 C2 4, 1 12, 4 18 C7 14, 8 12, 5 11 Z" fill="#3D2B1F" />
          <path d="M31 11 C34 4, 35 12, 32 18 C29 14, 28 12, 31 11 Z" fill="#3D2B1F" />
          {/* Tête */}
          <ellipse cx="18" cy="18" rx="12" ry="11" fill="#7A4B23" />
          {/* Yeux grands ouverts */}
          <circle cx="13.5" cy="14.5" r="2" fill="#0F141C" />
          <circle cx="22.5" cy="14.5" r="2" fill="#0F141C" />
          <circle cx="14" cy="14" r="0.7" fill="#FFFFFF" />
          <circle cx="23" cy="14" r="0.7" fill="#FFFFFF" />
          {/* Museau */}
          <ellipse cx="18" cy="22" rx="6" ry="5" fill="#F2F2F2" />
          <polygon points="17,20 19,20 18,21.5" fill="#0F141C" />
          {/* Bouche grande ouverte prête à gober */}
          <path d="M13.5 22.5 Q18 30 22.5 22.5 Z" fill="#6B1D1D" />
          {/* Dents supérieures */}
          <polygon points="15,22.5 16,24.5 17,22.5" fill="#FFFFFF" />
          <polygon points="19,22.5 20,24.5 21,22.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // phase === "bite": Chien serrant fermement la photo/os entre ses dents
  return (
    <div className="relative flex items-center justify-center w-7 h-7 animate-puppy-chomp">
      <svg viewBox="0 0 36 36" className="w-7 h-7 drop-shadow-lg">
        {/* Oreilles */}
        <path d="M5 11 C2 4, 1 12, 4 18 C7 14, 8 12, 5 11 Z" fill="#3D2B1F" />
        <path d="M31 11 C34 4, 35 12, 32 18 C29 14, 28 12, 31 11 Z" fill="#3D2B1F" />
        {/* Tête */}
        <ellipse cx="18" cy="18" rx="12" ry="11" fill="#7A4B23" />
        {/* Yeux joyeux plissés ^ ^ */}
        <path d="M12 15 Q14 12.5 16 15" stroke="#0F141C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M20 15 Q22 12.5 24 15" stroke="#0F141C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Museau */}
        <ellipse cx="18" cy="21.5" rx="6.5" ry="4.5" fill="#F2F2F2" />
        <polygon points="17,19.5 19,19.5 18,21" fill="#0F141C" />
        {/* Dents blanches bien visibles qui enserrent l'objet */}
        <rect x="13" y="21.5" width="10" height="3" rx="1" fill="#FFFFFF" stroke="#333333" strokeWidth="0.6" />
        <line x1="15.5" y1="21.5" x2="15.5" y2="24.5" stroke="#A3A3A3" strokeWidth="0.6" />
        <line x1="18" y1="21.5" x2="18" y2="24.5" stroke="#A3A3A3" strokeWidth="0.6" />
        <line x1="20.5" y1="21.5" x2="20.5" y2="24.5" stroke="#A3A3A3" strokeWidth="0.6" />
      </svg>
      {/* Photo du produit entre ses dents */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-4 h-4 object-cover rounded-[3px] border border-white shadow-md rotate-12 bg-black"
          />
        ) : (
          <span className="text-xs leading-none">🦴</span>
        )}
      </div>
    </div>
  );
}

// Vrais Drapeaux Vectoriels SVG (garantit l'affichage net des drapeaux sur tous les OS sans bug emoji Windows)
export function FlagIcon({
  lang,
  className = "w-5 h-3.5",
}: {
  lang: "fr" | "en" | "es" | "de";
  className?: string;
}) {
  if (lang === "fr") {
    return (
      <svg viewBox="0 0 3 2" className={`rounded-[2px] shadow-xs inline-block shrink-0 ${className}`}>
        <rect width="1" height="2" fill="#002395" />
        <rect width="1" height="2" x="1" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" fill="#ED2939" />
      </svg>
    );
  }
  if (lang === "en") {
    return (
      <svg viewBox="0 0 60 30" className={`rounded-[2px] shadow-xs inline-block shrink-0 ${className}`}>
        <clipPath id="flag_gb_clip"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
        <g clipPath="url(#flag_gb_clip)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    );
  }
  if (lang === "es") {
    return (
      <svg viewBox="0 0 3 2" className={`rounded-[2px] shadow-xs inline-block shrink-0 ${className}`}>
        <rect width="3" height="2" fill="#AA151B" />
        <rect width="3" height="1" y="0.5" fill="#F1BF00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 5 3" className={`rounded-[2px] shadow-xs inline-block shrink-0 ${className}`}>
      <rect width="5" height="1" y="0" fill="#000000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}

export default function BoutiqueNavbar({
  activeSection,
  onNavigate,
  selectedCategory = "all",
  onSelectCategory,
}: BoutiqueNavbarProps) {
  const {
    language,
    setLanguage,
    cart,
    user,
    loginUser,
    logoutUser,
    toggleB2B,
    setAppMode,
    catalogCategory,
    setCatalogCategory,
    catalogSearchQuery,
    setCatalogSearchQuery,
    setCatalogShowMoreModal,
    catalogActiveFiltersCount,
  } = useApp();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangTopOpen, setMobileLangTopOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<"login" | "register" | "forgot" | null>(null);
  const [authEmail, setAuthEmail] = useState("alexandre.mercier@club-prive.fr");
  const [authPass, setAuthPass] = useState("••••••••");
  const [authName, setAuthName] = useState("Alexandre Mercier");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Gestion du survol des catégories pour les menus déroulants
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryMouseEnter = (catKey: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategory(catKey);
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 160);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Animation panier & chien attrapeur
  const [isCartBlinking, setIsCartBlinking] = useState(false);
  const [cartFlyNotification, setCartFlyNotification] = useState<string | null>(null);
  const [flyingPhoto, setFlyingPhoto] = useState<{
    id: number;
    image: string;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
  } | null>(null);
  const [dogCartState, setDogCartState] = useState<"idle" | "open" | "bite">("idle");
  const [lastCaughtImage, setLastCaughtImage] = useState<string | null>(null);
  const lastClickRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevCartCountRef = useRef(totalCartCount);

  // Capturer les coordonnées précises du dernier clic / tap tactile
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if ("clientX" in e) {
        lastClickRef.current = { x: e.clientX, y: e.clientY };
      } else if (e.touches && e.touches[0]) {
        lastClickRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  // Déclenchement de l'animation quand un produit est ajouté au panier
  useEffect(() => {
    const handleCartAddEvent = (e: any) => {
      const img = e.detail?.image || "/brands/hankeys/hankeys-1.png";
      const name = e.detail?.name;
      setLastCaughtImage(img);

      // Calcul des coordonnées cibles du panier selon l'écran (mobile vs desktop)
      const isMobile = window.innerWidth < 1024;
      const targetEl = document.getElementById(isMobile ? "mobile-cart-btn" : "desktop-cart-btn");
      let targetX = isMobile ? window.innerWidth - 42 : window.innerWidth - 65;
      let targetY = isMobile ? window.innerHeight - 30 : window.innerHeight - 50;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      // Point de départ (clic utilisateur ou centre de l'écran)
      const startX = lastClickRef.current.x > 0 ? lastClickRef.current.x : window.innerWidth / 2;
      const startY = lastClickRef.current.y > 0 ? lastClickRef.current.y : window.innerHeight / 2;

      // 1. Photo qui rétrécit et file au panier (effet mise en corbeille)
      setFlyingPhoto({
        id: Date.now(),
        image: img,
        startX,
        startY,
        targetX,
        targetY,
      });

      // 2. À mi-chemin (350ms) : Le panier se change en chien gueule ouverte prêt à gober
      const timerOpen = setTimeout(() => {
        setDogCartState("open");
      }, 350);

      // 3. À l'impact (700ms) : Le chien rattrape la photo et la serre entre ses dents !
      const timerBite = setTimeout(() => {
        setFlyingPhoto(null);
        setDogCartState("bite");
      }, 700);

      // 4. Après la prise (1750ms) : L'icône redevient un panier avec compteur à jour
      const timerIdle = setTimeout(() => {
        setDogCartState("idle");
      }, 1750);

      return () => {
        clearTimeout(timerOpen);
        clearTimeout(timerBite);
        clearTimeout(timerIdle);
      };
    };

    window.addEventListener("darkink_cart_add", handleCartAddEvent);
    return () => window.removeEventListener("darkink_cart_add", handleCartAddEvent);
  }, []);

  const desktopCategories = [
    { key: "ACCUEIL", label: "ACCUEIL" },
    { key: "BDSM", label: "BDSM" },
    { key: "AROMES", label: "AROMES" },
    { key: "ASS PLAY", label: "ASS PLAY" },
    { key: "SEX TOYS", label: "SEX TOYS" },
    { key: "CUIR", label: "CUIR" },
    { key: "LUBE & HYGIENE", label: "LUBES & SOINS" },
    { key: "NEOPRENE", label: "NEOPRENE" },
    { key: "GARDE ROBE", label: "GARDE ROBE" },
    { key: "PUPPY PLAY GEAR", label: "PUPPY PLAY" },
    { key: "HOT DEALS", label: "HOT DEALS" },
    { key: "NEW", label: "NEW" },
    { key: "MARQUES", label: "MARQUES" },
  ];

  // Menus déroulants thématiques avec termes authentiques de la communauté gay (élégants et non vulgaires)
  const categoryDropdowns: Record<
    string,
    {
      desc: string;
      items: {
        label: string;
        query: string;
        badge?: string;
        targetSection?: BoutiqueSection;
      }[];
    }
  > = {
    ACCUEIL: {
      desc: "Boutique en ligne & Espaces Parisiens",
      items: [
        { label: "Boutique en Ligne DARK-INK", query: "", targetSection: "home" },
        { label: "New Millénium (Paris 11e - Haute Fétiche)", query: "", badge: "Boutique", targetSection: "stores" },
        { label: "Boxxman (Paris 1er - Cruising & Shop)", query: "", badge: "Cruising", targetSection: "cruising" },
        { label: "Espace Membre & Carte Privilège", query: "", targetSection: "account" },
      ],
    },
    BDSM: {
      desc: "Équipements de soumission, entraves & contrôle",
      items: [
        { label: "Harnais & Straps de Suspension", query: "harnais", badge: "Must" },
        { label: "Entraves Cuir & Menottes Doublées", query: "menottes" },
        { label: "Colliers, Chokers & Laisses", query: "collier" },
        { label: "Paddles, Cravaches & Floggers", query: "paddle" },
        { label: "Gags, Bâillons & Masques Cuir", query: "gag" },
        { label: "Cordes Shibari & Kits de Fixation", query: "corde" },
      ],
    },
    AROMES: {
      desc: "Formules pures, amyle & nettoyants cuir",
      items: [
        { label: "Poppers Amyle Véritable", query: "amyle", badge: "Pur" },
        { label: "Formules Pentyle & Propyle", query: "pentyle" },
        { label: "Grands Formats (24ml & 30ml)", query: "format" },
        { label: "Inhalateurs Double Embout & Métal", query: "inhalateur" },
        { label: "Nettoyants Spéciaux pour Cuir", query: "cleaner" },
        { label: "Packs Découverte & Duos", query: "pack" },
      ],
    },
    "ASS PLAY": {
      desc: "Exploration anale, stimulation prostatique & sensations",
      items: [
        { label: "Plugs Métal & Poids Lourds", query: "metal", badge: "Lourd" },
        { label: "Plugs Silicone Ergonomiques", query: "silicone" },
        { label: "Stimulateurs & Masseurs Prostatiques", query: "prostate" },
        { label: "Dildos Réalistes en Silicone Platinum", query: "dildo", badge: "Hit" },
        { label: "Sondes, Dilatateurs & Sounding", query: "sonde" },
        { label: "Plugs Vibrants Télécommandés", query: "vibrant" },
      ],
    },
    "SEX TOYS": {
      desc: "Plaisir masculin, cockrings & performance",
      items: [
        { label: "Cockrings Acier Chirurgical 316L", query: "cockring", badge: "Acier" },
        { label: "Cockrings Silicone & Stretcheurs", query: "silicone" },
        { label: "Pompes à Érection & Cylindres Gradués", query: "pompe" },
        { label: "Masturbateurs & Strokers Texturés", query: "stroker" },
        { label: "Cages de Chasteté Masculine", query: "chastete", badge: "Pro" },
        { label: "Électrostimulation E-Stim", query: "estim" },
      ],
    },
    CUIR: {
      desc: "Sellerie artisanale, maroquinerie d'art & pleine fleur",
      items: [
        { label: "Harnais Bulldog & H-Harness", query: "bulldog", badge: "Culte" },
        { label: "Jockstraps & Slips Cuir Véritable", query: "jockstrap" },
        { label: "Poignets de Force & Bracelets Rivetés", query: "poignet" },
        { label: "Casquettes Peaked & Bérets Cuir", query: "casquette" },
        { label: "Pantalons, Chaps & Gilets Cuir", query: "pantalon" },
        { label: "Baumes & Graisses d'Entretien Pro", query: "cuir" },
      ],
    },
    "LUBE & HYGIENE": {
      desc: "Formules haute glisse, confort & rituels de soin",
      items: [
        { label: "Lubrifiants Silicone Haute Tenue", query: "silicone", badge: "Tenue" },
        { label: "Gels Formule Eau Purifiée", query: "eau" },
        { label: "Poires & Systèmes de Lavement", query: "poire", badge: "Hygiène" },
        { label: "Gels Préparatoires & Relaxants", query: "relaxant" },
        { label: "Crèmes de Glisse Spéciales Fist & Play", query: "creme" },
        { label: "Sprays Nettoyants Antibactériens", query: "nettoyant" },
      ],
    },
    NEOPRENE: {
      desc: "Matière élastique technique, look athlétique & clubbing",
      items: [
        { label: "Harnais Néoprène Bicolores", query: "harnais", badge: "Club" },
        { label: "Jockstraps & Shorts Néoprène", query: "jockstrap" },
        { label: "Brassards & Armbands Musculaires", query: "brassard" },
        { label: "Singlets de Lutte & Combinaisons Wetsuit", query: "singlet" },
        { label: "Cagoules & Visières Néoprène", query: "neoprene" },
      ],
    },
    "GARDE ROBE": {
      desc: "Vestiaire fétiche, underwear gay & sportswear",
      items: [
        { label: "Jockstraps de Sport & Athlétiques", query: "jockstrap", badge: "Sport" },
        { label: "Singlets & Combinaisons Seconde Peau", query: "singlet" },
        { label: "T-Shirts Mesh & Débardeurs Transparents", query: "mesh" },
        { label: "Shorts Gym, Split & Boxers Courts", query: "short" },
        { label: "Chaussettes Hautes & Bandanas Hanky", query: "hanky", badge: "Code" },
        { label: "Harnais Textiles Fluo & Mesh", query: "harnais" },
      ],
    },
    "PUPPY PLAY GEAR": {
      desc: "Univers K9, masques anatomiques & jeux de rôle",
      items: [
        { label: "Cagoules & Masques K9 Néoprène", query: "cagoule", badge: "Must" },
        { label: "Queues & Plugs Puppy Flexibles", query: "queue" },
        { label: "Pattes & Moufles de Rembourrage Cuir", query: "moufle" },
        { label: "Colliers K9 Gravés & Médailles", query: "collier" },
        { label: "Laisses & Harnais de Chenil", query: "laisse" },
        { label: "Genouillères de Protection Rembourrées", query: "genouillere" },
      ],
    },
    "HOT DEALS": {
      desc: "Offres privilégiées, remises immédiates & séries limitées",
      items: [
        { label: "Ventes Privilège (-20% à -50%)", query: "promo", badge: "-50%" },
        { label: "Dernières Tailles & Fins de Séries", query: "destockage" },
        { label: "Packs Flacons & Duos Économiques", query: "pack" },
        { label: "Sélection Coups de Cœur du Staff", query: "coupdecoeur" },
      ],
    },
    NEW: {
      desc: "Arrivages récents, exclusivités et nouveautés mondiales",
      items: [
        { label: "Nouveautés de la Semaine", query: "nouveaute", badge: "New" },
        { label: "Exclusivités Import USA & Berlin", query: "exclusif" },
        { label: "Nouvelle Collection DARK-INK Atelier", query: "atelier" },
        { label: "Dernières Éditions Spéciales", query: "edition" },
      ],
    },
    MARQUES: {
      desc: "Fabricants légendaires de la culture cuir & fétiche",
      items: [
        { label: "Mr S Leather (San Francisco)", query: "mr s leather", badge: "USA" },
        { label: "Hankey's Toys (Silicone Platinum)", query: "hankeys", badge: "USA" },
        { label: "DARK-INK Atelier (Paris 11e)", query: "dark-ink", badge: "Paris" },
        { label: "Master Leather Paris", query: "master leather" },
        { label: "Black Latex Corp", query: "black latex" },
        { label: "Prowler Lab London", query: "prowler" },
      ],
    },
  };

  const categories = [
    { key: "all", label: "Toutes les catégories" },
    { key: "Harnais & Cuir", label: "Harnais & Cuir" },
    { key: "Latex & Rubber", label: "Latex & Rubber" },
    { key: "Bondage & Restraints", label: "Bondage & Restraints" },
    { key: "Sex-Toys & Plaisir", label: "Sex-Toys & Plaisir" },
    { key: "Lubrifiants & Soins", label: "Lubrifiants & Soins" },
  ];

  const brands = [
    { name: "DARK-INK Atelier", desc: "Maroquinerie & harnais d'exception faits main" },
    { name: "Master Leather Paris", desc: "Cuirs bruts, sellerie lourde & bondage" },
    { name: "Black Latex Corp", desc: "Latex naturel 0.4mm et combinaisons seconde peau" },
    { name: "Fetish Steel Co", desc: "Anneaux, entraves et acier chirurgical 316L" },
    { name: "Prowler Lab", desc: "Formules lubrifiantes et soins intimes haute performance" },
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: authName || "Alexandre Mercier",
      email: authEmail || "alexandre.mercier@club-prive.fr",
      role: "Membre Privilège",
    });
    setAuthModalType(null);
    setAccountMenuOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. NAVBAR SUPÉRIEURE (RELATIVE ET Z-50 SUR DESKTOP POUR PASSER AU-DESSUS DE LA BARRE DES CATÉGORIES) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 lg:relative z-40 lg:z-50 bg-[#0B0D10] text-[#FAF9F6] border-b border-[#1E2430] shadow-md select-none w-full max-w-full overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* VUE DESKTOP (lg:flex) */}
          <div className="hidden lg:flex items-center justify-between h-20 gap-4">

            {/* GAUCHE : LOGO ET LES 2 LIGNES TOTALEMENT DISSOCIÉES */}
            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-left group flex items-center space-x-2.5 select-none cursor-pointer"
                title="DARK-INK PARIS - Accueil"
              >
                {/* Carré Logo DK */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F2F2F2] to-[#B88265] flex items-center justify-center text-black font-mono font-black text-xs shadow-xs shrink-0">
                  DK
                </div>

                {/* 2 LIGNES ENTIÈREMENT INDÉPENDANTES AVEC TAILLES FIXES EXPLICITES */}
                <div>
                  {/* Ligne 1 : Nom du site en grande taille d'origine (18px) */}
                  <div
                    style={{ fontSize: "18px", lineHeight: "20px" }}
                    className="font-mono font-black text-white group-hover:text-[#F2F2F2] transition-colors whitespace-nowrap"
                  >
                    DARK-INK PARIS
                  </div>

                  {/* Ligne 2 : Slogan totalement indépendant et minuscule (6.5px) */}
                  <div
                    style={{ fontSize: "6.5px", lineHeight: "10px" }}
                    className="font-sans font-bold uppercase text-[#F2F2F2] whitespace-nowrap"
                  >
                    KINK ｜ FETISH ｜ EXCLUSIF ｜ DEPUIS 2003
                  </div>
                </div>
              </button>
            </div>

            {/* CENTRE : NAVIGATION PRINCIPALE MAISON */}
            <nav className="flex items-center space-x-7 text-xs font-bold uppercase tracking-wider font-mono">
              {/* Raccourci intuitif et moderne pour commander (Sac Shopping Haute Couture + Libellé "Commander") */}
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl transition-all relative font-mono text-xs font-bold uppercase tracking-wider ${activeSection === "home" || activeSection === "products"
                  ? "bg-[#F2F2F2] text-black shadow-xs font-extrabold"
                  : "text-[#D1D5DB] hover:text-white bg-[#1C2230] border border-[#2B3548] hover:border-[#F2F2F2]"
                  }`}
                title="Boutique & Commander en ligne"
                aria-label="Commander"
              >
                {/* Icône Sac Shopping Haute Couture Moderne & Premium */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 shrink-0"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Commander</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("stores")}
                className={`py-2 transition-colors relative ${activeSection === "stores"
                  ? "text-white font-black"
                  : "text-[#D1D5DB] hover:text-white"
                  }`}
                title="Boutique New Millénium — Galerie d'art & Haute Fétiche (37 rue Jean-Pierre Timbaud, Paris 11e)"
              >
                <span>New Millénium</span>
                {activeSection === "stores" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2F2F2]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate("cruising")}
                className={`py-2 transition-colors relative ${activeSection === "cruising"
                  ? "text-white font-black"
                  : "text-[#D1D5DB] hover:text-white"
                  }`}
                title="Boutique Boxxman — Grand Public & Espace Cruising (2 rue de la Cossonnerie, Paris 1er)"
              >
                <span>Boxxman</span>
                {activeSection === "cruising" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2F2F2]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className={`py-2 transition-colors relative ${activeSection === "contact"
                  ? "text-white font-black"
                  : "text-[#D1D5DB] hover:text-white"
                  }`}
              >
                <span>Nous Contacter</span>
                {activeSection === "contact" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2F2F2]" />
                )}
              </button>
            </nav>

            {/* DROITE : BADGE B2B PRO, SÉLECTEUR AVEC DRAPEAUX, ICÔNE "PUPPY" LUMINEUSE & ACCÈS ERP */}
            <div className="flex items-center space-x-3.5 shrink-0">

              {/* BADGE B2B PRO HAUTE VISIBILITÉ & PREMIUM (ACCÈS DIRECT TARIFS PRO -30%) */}
              <button
                type="button"
                onClick={toggleB2B}
                className={`group relative flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all duration-300 border-2 cursor-pointer select-none ${
                  user?.isB2B
                    ? "bg-[#F2F2F2] text-black border-[#F2F2F2] shadow-[0_0_25px_rgba(229,186,163,0.65)] hover:bg-[#EDD0C0]"
                    : "bg-gradient-to-r from-[#2A1E18] via-[#1E1510] to-[#2A1E18] hover:from-[#382820] hover:to-[#382820] border-[#F2F2F2] text-white shadow-[0_0_15px_rgba(229,186,163,0.35)] hover:shadow-[0_0_20px_rgba(229,186,163,0.55)]"
                }`}
                title={
                  user?.isB2B
                    ? "Tarifs B2B PRO actifs (-30% sur le catalogue). Cliquez pour repasser en mode Particulier."
                    : "Activer les tarifs préférentiels B2B PRO (-30% sur le catalogue)"
                }
                aria-pressed={Boolean(user?.isB2B)}
              >
                {/* Voyant lumineux actif / inactif éclatant */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  {user?.isB2B ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black" />
                    </>
                  ) : (
                    <>
                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#F2F2F2] opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F2F2F2] shadow-[0_0_8px_#F2F2F2]" />
                    </>
                  )}
                </span>

                {/* Libellé B2B PRO bien visible */}
                <span
                  className={`tracking-wider uppercase text-xs font-black ${
                    user?.isB2B ? "text-black" : "text-white group-hover:text-[#F2F2F2] transition-colors"
                  }`}
                >
                  B2B PRO
                </span>

                {/* Tag de remise -30% doré & contrasté */}
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs transition-all ${
                    user?.isB2B
                      ? "bg-black text-[#F2F2F2]"
                      : "bg-[#F2F2F2] text-black font-extrabold group-hover:scale-105"
                  }`}
                >
                  -30%
                </span>
              </button>

              {/* Sélecteur de Langues avec DRAPEAUX UNIQUEMENT (zéro texte FR, EN, ES, DE) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="bg-[#1C2230] hover:bg-[#252E40] border border-[#3A4354] hover:border-[#F2F2F2] rounded-xl px-2.5 py-2 flex items-center space-x-1.5 shadow-xs transition-colors"
                  aria-label="Sélectionner la langue"
                  title="Changer de langue"
                >
                  <FlagIcon lang={language} className="w-6 h-4" />
                  <span className="text-[9px] text-[#F2F2F2]">▼</span>
                </button>

                {/* Menu déroulant avec les drapeaux uniquement */}
                {langDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setLangDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-[#161C26] border border-[#3A4354] rounded-xl shadow-2xl p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-100 flex flex-col space-y-1">
                      {(["fr", "en", "es", "de"] as const).map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setLanguage(code);
                            setLangDropdownOpen(false);
                          }}
                          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${language === code
                            ? "bg-[#252E40] border border-[#F2F2F2]"
                            : "hover:bg-[#1E2536] border border-transparent"
                            }`}
                          title={code === "fr" ? "Français" : code === "en" ? "English" : code === "es" ? "Español" : "Deutsch"}
                        >
                          <FlagIcon lang={code} className="w-6 h-4" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Icône "Mon compte" en "PUPPY" (Masque de chien sur buste d'homme) - Luminous White & Gold */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="w-10 h-10 rounded-xl border border-[#3A4354] bg-[#1C2230] hover:bg-[#252E40] hover:border-[#F2F2F2] flex items-center justify-center text-white transition-all shadow-xs"
                  title="Mon Compte & Carte Membre (Puppy)"
                >
                  <PuppyAccountIcon className="w-6 h-6" />
                </button>

                {/* Dropdown "Mon Compte" proposant Créer mon compte / Me connecter / Mot de passe oublié */}
                {accountMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setAccountMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#161C26] border border-[#3A4354] rounded-2xl shadow-2xl p-4 text-xs z-[100] animate-in fade-in zoom-in-95 duration-150">
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 pb-3 border-b border-[#2B3548]">
                            <div className="w-10 h-10 rounded-full bg-[#1C2230] border border-[#F2F2F2] flex items-center justify-center text-white shrink-0">
                              <PuppyAccountIcon className="w-6 h-6" />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-white block truncate">
                                {user.name}
                              </span>
                              <span className="text-[10px] font-mono text-[#F2F2F2] font-semibold block">
                                {user.isB2B ? "Compte Pro B2B" : `${user.loyaltyPoints} pts de fidélité`}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onNavigate("account");
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left py-2 px-3 rounded-lg bg-[#1F2637] hover:bg-[#283247] text-white font-mono font-semibold transition-colors"
                          >
                            Mon Compte &bull; Carte QR
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              logoutUser();
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left py-2 px-3 rounded-lg text-rose-400 hover:bg-rose-950/30 font-mono font-semibold transition-colors"
                          >
                            Se déconnecter
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5 font-mono">
                          <div className="pb-2 border-b border-[#2B3548]">
                            <span className="text-[10px] uppercase font-bold text-[#F2F2F2] tracking-wider block">
                              Espace Membre Privé
                            </span>
                            <p className="text-[11px] text-[#D1D5DB] mt-0.5 leading-relaxed">
                              Accédez à vos commandes, réservations et avantages fidélité.
                            </p>
                          </div>

                          {/* Les 3 options demandées */}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthModalType("register");
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left py-2.5 px-3 rounded-xl bg-[#F2F2F2] hover:bg-[#FFFFFF] text-black font-extrabold text-xs transition-colors shadow-xs"
                          >
                            Créer mon compte
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAuthModalType("login");
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left py-2 px-3 rounded-xl border border-[#3A4354] bg-[#1F2637] hover:bg-[#283247] text-white font-semibold transition-colors"
                          >
                            Me connecter
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAuthModalType("forgot");
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left py-1.5 px-3 text-[11px] text-[#F2F2F2] hover:text-white transition-colors"
                          >
                            Mot de passe oublié ?
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Accès discret ERP avec Texte Clair & Flèche Dorée */}
              <button
                type="button"
                onClick={() => setAppMode("erp")}
                className="bg-[#1E2536] hover:bg-[#2A344A] border border-[#3A4354] hover:border-[#F2F2F2] text-white text-xs font-mono font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
                title="Basculer vers l'ERP Logistique"
              >
                <span>Accès ERP</span>
                <span className="text-[#F2F2F2] font-black">↗</span>
              </button>
            </div>
          </div>

          {/* VUE MOBILE (lg:hidden) : HAUTEUR STANDARD & TAILLES ÉQUILIBRÉES */}
          <div className="flex lg:hidden items-center justify-between h-14 gap-2 px-1">
            {/* GAUCHE : BURGER */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="w-9 h-9 rounded-xl border border-[#2B3548] bg-[#141822] flex items-center justify-center text-white transition-colors hover:border-[#F2F2F2]"
                aria-label="Ouvrir le menu"
              >
                <span className="text-lg font-bold leading-none">☰</span>
              </button>
            </div>

            {/* CENTRE : LOGO + NOM DU SITE + 2ÈME PHRASE IDENTIQUE DESKTOP AVEC ALIGNEMENT STRICT */}
            <div className="flex-1 flex items-center justify-center px-1 min-w-0">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="group flex items-center space-x-2 select-none cursor-pointer text-left shrink-0"
                title="DARK-INK PARIS - Accueil"
              >
                {/* Carré Logo DK */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F2F2F2] to-[#B88265] flex items-center justify-center text-black font-mono font-black text-[10px] shadow-xs shrink-0">
                  DK
                </div>

                {/* 2 Lignes rigoureusement alignées (même largeur bord à bord que sur desktop) */}
                <div>
                  {/* Ligne 1 : Nom du site */}
                  <div
                    style={{ fontSize: "14px", lineHeight: "16px" }}
                    className="font-mono font-black text-white group-hover:text-[#F2F2F2] transition-colors whitespace-nowrap"
                  >
                    DARK-INK PARIS
                  </div>

                  {/* Ligne 2 : Slogan aligné bord à bord sous le nom (ratio calibré identique desktop) */}
                  <div
                    style={{ fontSize: "5.1px", lineHeight: "8px" }}
                    className="font-sans font-bold uppercase text-[#F2F2F2] whitespace-nowrap"
                  >
                    KINK ｜ FETISH ｜ EXCLUSIF ｜ DEPUIS 2003
                  </div>
                </div>
              </button>
            </div>

            {/* DROITE : SÉLECTEUR DE LANGUES MOBILE */}
            <div className="w-9 shrink-0 flex justify-end relative">
              <button
                type="button"
                onClick={() => setMobileLangTopOpen(!mobileLangTopOpen)}
                className="w-9 h-9 rounded-xl border border-[#2B3548] bg-[#141822] flex items-center justify-center text-white transition-colors hover:border-[#F2F2F2]"
                aria-label="Sélectionner la langue"
                title="Changer de langue"
              >
                <FlagIcon lang={language} className="w-5 h-3.5" />
              </button>

              {mobileLangTopOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMobileLangTopOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-[#161C26] border border-[#3A4354] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col space-y-1">
                    {(["fr", "en", "es", "de"] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setLanguage(code);
                          setMobileLangTopOpen(false);
                        }}
                        className={`flex items-center justify-center p-2 rounded-lg transition-colors ${language === code
                          ? "bg-[#252E40] border border-[#F2F2F2]"
                          : "hover:bg-[#1E2536] border border-transparent"
                          }`}
                        title={code === "fr" ? "Français" : code === "en" ? "English" : code === "es" ? "Español" : "Deutsch"}
                      >
                        <FlagIcon lang={code} className="w-6 h-4" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. LIGNE STICKY DESKTOP : MAISON + CATÉGORIES + B2B + LOUPE EXTENSIBLE */}
      {/* ========================================================================= */}
      {(activeSection === "home" || activeSection === "products") && (() => {
        const isSearchActive = isSearchExpanded || catalogSearchQuery.length > 0;
        const isAccueil = activeSection === "home" && (!catalogCategory || catalogCategory === "all");

        return (
          <div className="hidden lg:block sticky top-0 z-40 bg-[#0B0D10] border-b border-[#1E2430] shadow-md select-none w-full overflow-visible">
            <div className="border-t border-[#1E2536] bg-[#0B0D10] py-2 px-3 sm:px-6 select-none overflow-visible">
              <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-2 xl:gap-3 text-[10px] xl:text-[11px] 2xl:text-[11.5px] font-sans font-extrabold tracking-tight uppercase overflow-visible flex-nowrap">

                {!isSearchActive ? (
                  <>
                    {/* GROUPE 1 : MAISON (Icône seule) + LES 12 CATÉGORIES (Format fluide, ultra-compact & anti-collision zoom) */}
                    <div className="flex-1 min-w-0 flex items-center gap-1 xl:gap-1.5 overflow-visible py-1 flex-nowrap">
                      {desktopCategories.map((c) => {
                        const isCatActive =
                          c.key === "ACCUEIL"
                            ? activeSection === "home" && (!catalogCategory || catalogCategory === "all")
                            : catalogCategory === c.key;

                        const dropdownData = categoryDropdowns[c.key];
                        const isHovered = hoveredCategory === c.key;

                        return (
                          <div
                            key={c.key}
                            className="relative shrink-0"
                            onMouseEnter={() => handleCategoryMouseEnter(c.key)}
                            onMouseLeave={handleCategoryMouseLeave}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setHoveredCategory(null);
                                if (c.key === "ACCUEIL") {
                                  onNavigate("home");
                                  setCatalogCategory("all");
                                  setCatalogSearchQuery("");
                                  if (onSelectCategory) onSelectCategory("all");
                                } else {
                                  const nextCat = catalogCategory === c.key ? "all" : c.key;
                                  setCatalogCategory(nextCat);
                                  setCatalogSearchQuery("");
                                  if (onSelectCategory) onSelectCategory(nextCat);
                                  onNavigate("products");
                                }
                              }}
                              className={`relative whitespace-nowrap px-1.5 xl:px-2.5 py-1 rounded-full transition-all duration-150 font-sans text-[10px] xl:text-[11px] 2xl:text-[11.5px] tracking-tight shrink-0 cursor-pointer select-none flex items-center gap-1 ${
                                isCatActive
                                  ? "bg-[#F2F2F2] text-black font-black shadow-xs"
                                  : isHovered
                                    ? "bg-[#1F2737] border border-[#F2F2F2] text-white shadow-xs"
                                    : c.key === "HOT DEALS"
                                      ? "bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-500/20 font-bold"
                                      : c.key === "NEW"
                                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20 font-bold"
                                        : "bg-[#131720]/80 border border-[#232938] text-gray-300 hover:text-white hover:border-[#F2F2F2]/60 hover:bg-[#1A202E] font-medium"
                              }`}
                              title={c.key === "ACCUEIL" ? "Accueil" : `Filtrer par ${c.label}`}
                            >
                              {c.key === "ACCUEIL" ? (
                                <span className="flex items-center justify-center p-0.5" title="Accueil">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                    <path d="M3 10.5L12 3l9 7.5" />
                                    <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
                                  </svg>
                                </span>
                              ) : (
                                <span>{c.label}</span>
                              )}

                              {c.key === "HOT DEALS" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                              )}
                              {c.key === "NEW" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              )}
                            </button>

                            {/* MENU DÉROULANT AU SURVOL (FOND 100% OPAQUE NOIR PUR, AUCUNE TRANSPARENCE) */}
                            {isHovered && dropdownData && (
                              <div
                                className={`absolute top-full pt-2 z-50 min-w-[280px] xl:min-w-[320px] select-none ${c.key === "ACCUEIL" || c.key === "BDSM" || c.key === "AROMES"
                                    ? "left-0"
                                    : c.key === "MARQUES" || c.key === "NEW" || c.key === "HOT DEALS"
                                      ? "right-0"
                                      : "left-1/2 -translate-x-1/2"
                                  }`}
                                onMouseEnter={() => handleCategoryMouseEnter(c.key)}
                                onMouseLeave={handleCategoryMouseLeave}
                              >
                                <div
                                  style={{ backgroundColor: "#0C0F17", opacity: 1 }}
                                  className="border-2 border-[#3A4354] rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.98)] p-3.5 ring-1 ring-[#F2F2F2]/25"
                                >
                                  {/* En-tête du menu */}
                                  <div className="pb-2 mb-2 border-b border-[#252D3D] flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-mono font-black text-[#F2F2F2] uppercase tracking-wider">
                                      {c.label}
                                    </span>
                                    <span className="text-[10px] font-sans text-gray-300 truncate max-w-[190px] text-right font-medium">
                                      {dropdownData.desc}
                                    </span>
                                  </div>

                                  {/* Items de la catégorie */}
                                  <div className="flex flex-col space-y-1">
                                    {dropdownData.items.map((item, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setHoveredCategory(null);
                                          if (item.targetSection) {
                                            onNavigate(item.targetSection);
                                          } else {
                                            setCatalogCategory(c.key);
                                            setCatalogSearchQuery(item.query);
                                            onNavigate("products");
                                          }
                                        }}
                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-left font-sans text-xs text-white hover:text-[#F2F2F2] hover:bg-[#1A2232] transition-colors group/item cursor-pointer"
                                      >
                                        <span className="flex items-center gap-2.5 truncate">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] shrink-0" />
                                          <span className="truncate font-semibold">
                                            {item.label}
                                          </span>
                                        </span>
                                        {item.badge && (
                                          <span className="text-[9.5px] font-mono font-black px-1.5 py-0.5 rounded bg-[#F2F2F2]/20 text-[#F2F2F2] border border-[#F2F2F2]/40 shrink-0 ml-2">
                                            {item.badge}
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Pied du menu */}
                                  <div className="pt-2.5 mt-2 border-t border-[#252D3D]">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredCategory(null);
                                        if (c.key === "ACCUEIL") {
                                          onNavigate("home");
                                          setCatalogCategory("all");
                                          setCatalogSearchQuery("");
                                        } else {
                                          setCatalogCategory(c.key);
                                          setCatalogSearchQuery("");
                                          onNavigate("products");
                                        }
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#161D2B] hover:bg-[#F2F2F2] text-[10.5px] font-mono font-bold text-[#F2F2F2] hover:text-black border border-[#2B3548] hover:border-[#F2F2F2] transition-all cursor-pointer shadow-xs"
                                    >
                                      <span>
                                        {c.key === "ACCUEIL"
                                          ? "Voir toute la boutique en ligne"
                                          : `Tout afficher dans ${c.label}`}
                                      </span>
                                      <span className="font-black">&rarr;</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* BOUTONS ACTIONS DROITE : BOUTON FILTRES (HORS ACCUEIL) + BOUTON RECHERCHER (LUMINEUX & CONTRASTÉS) */}
                    <div className="flex items-center gap-1.5 xl:gap-2 shrink-0 ml-2 pl-2 xl:ml-3 xl:pl-3 border-l border-[#252C37] flex-nowrap">
                      {/* BOUTON FILTRES : NE S'AFFICHE PAS SUR L'ACCUEIL (UNIQUEMENT DANS LES CATÉGORIES / CATALOGUE) */}
                      {!isAccueil && (
                        <button
                          type="button"
                          onClick={() => {
                            if (activeSection !== "products") {
                              onNavigate("products");
                            }
                            setCatalogShowMoreModal(true);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1 rounded-xl border-2 text-[10.5px] xl:text-[11px] font-mono font-bold transition-all shadow-md cursor-pointer select-none shrink-0 ${
                            catalogActiveFiltersCount > 0
                              ? "bg-[#F2F2F2] text-black border-[#F2F2F2] hover:bg-[#EDD0C0]"
                              : "bg-[#252E3E] hover:bg-[#323D52] text-[#F2F2F2] hover:text-white border-[#F2F2F2] shadow-[0_0_12px_rgba(229,186,163,0.2)]"
                          }`}
                          title="Ouvrir les filtres avancés (tailles, diamètres, matériaux, prix, etc.)"
                        >
                          <span className="text-xs">⚙</span>
                          <span>FILTRES</span>
                          {catalogActiveFiltersCount > 0 && (
                            <span className="w-3.5 h-3.5 rounded-full bg-black text-[#F2F2F2] text-[9px] font-black flex items-center justify-center shrink-0">
                              {catalogActiveFiltersCount}
                            </span>
                          )}
                        </button>
                      )}

                      {/* BOUTON RECHERCHER : LUMINEUX & NETTEMENT VISIBLE */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchExpanded(true);
                          setTimeout(() => searchInputRef.current?.focus(), 60);
                        }}
                        className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1 bg-[#252E3E] hover:bg-[#323D52] border-2 border-[#F2F2F2] hover:border-[#F2D6C7] rounded-xl text-[10.5px] xl:text-[11px] font-sans font-bold text-white hover:text-[#F2F2F2] transition-all shadow-md shrink-0 cursor-pointer"
                        title="Rechercher un produit (masque les catégories pour plein écran)"
                      >
                        <svg className="w-3.5 h-3.5 text-[#F2F2F2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="tracking-normal uppercase text-[10.5px] xl:text-[11px]">Rechercher</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* RECHERCHE ALLONGÉE : MASQUE TOUTES LES CATÉGORIES */
                  <div className="w-full flex-1 flex items-center gap-2 sm:gap-3 py-0.5 animate-fadeIn">
                    <div className="relative flex-1 flex items-center">
                      <span className="absolute left-3 text-sm text-[#F2F2F2] pointer-events-none">
                        🔍
                      </span>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Rechercher un produit, une référence, une catégorie, une marque..."
                        value={catalogSearchQuery}
                        onChange={(e) => setCatalogSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setIsSearchExpanded(false);
                            setCatalogSearchQuery("");
                          }
                        }}
                        className="w-full bg-[#181E2A] border border-[#3A4354] focus:border-[#F2F2F2] rounded-lg pl-9 pr-9 py-1.5 text-xs sm:text-sm font-sans text-white placeholder-[#8E95A5] outline-none shadow-xs transition-colors"
                        autoFocus
                      />
                      {catalogSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setCatalogSearchQuery("");
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-2.5 text-xs font-mono text-[#8E95A5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
                          title="Effacer la recherche"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* BOUTON FERMER */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchExpanded(false);
                        setCatalogSearchQuery("");
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1C2230] hover:bg-[#252E40] border border-[#3A4354] hover:border-gray-400 rounded-lg text-xs font-sans font-bold text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Fermer la recherche et réafficher les catégories (Échap)"
                    >
                      <span className="text-sm leading-none font-bold">✕</span>
                      <span className="tracking-normal uppercase text-[11px]">Fermer</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. MODALE AUTHENTIFICATION RAPIDE (Créer compte / Me connecter / MDP oublié) */}
      {/* ========================================================================= */}
      {authModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setAuthModalType(null)}
              className="absolute top-4 right-4 text-xs font-mono text-[#888888] hover:text-[#111111]"
            >
              ✕
            </button>

            <div className="text-center space-y-1 mb-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#111111] text-[#F2F2F2] flex items-center justify-center mb-2">
                <PuppyAccountIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#111111]">
                {authModalType === "login"
                  ? "Connexion Membre Privilège"
                  : authModalType === "register"
                    ? "Créer mon Compte DARK-INK"
                    : "Récupération de mot de passe"}
              </h3>
              <p className="text-[11px] text-[#666666]">
                {authModalType === "forgot"
                  ? "Saisissez votre e-mail pour recevoir un lien sécurisé."
                  : "Accès instantané à vos réservations et avantages fidélité."}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 font-mono">
              {authModalType === "register" && (
                <div>
                  <label className="text-[10px] text-[#555555] block mb-1">Nom / Pseudonyme</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-white border border-[#D5D2CA] p-2.5 rounded-lg text-xs outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-[#555555] block mb-1">Adresse e-mail</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white border border-[#D5D2CA] p-2.5 rounded-lg text-xs outline-hidden"
                />
              </div>

              {authModalType !== "forgot" && (
                <div>
                  <label className="text-[10px] text-[#555555] block mb-1">Mot de passe</label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    className="w-full bg-white border border-[#D5D2CA] p-2.5 rounded-lg text-xs outline-hidden"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#111111] hover:bg-[#F2F2F2] text-black font-bold uppercase tracking-wider text-xs transition-colors mt-2"
              >
                {authModalType === "login"
                  ? "Se connecter"
                  : authModalType === "register"
                    ? "Valider la création du compte"
                    : "Envoyer le lien de réinitialisation"}
              </button>
            </form>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-[#E5E2DC] text-[10px] font-mono text-[#888888]">
              {authModalType !== "login" ? (
                <button type="button" onClick={() => setAuthModalType("login")} className="hover:underline">
                  Déjà un compte ? Se connecter
                </button>
              ) : (
                <button type="button" onClick={() => setAuthModalType("register")} className="hover:underline">
                  Pas de compte ? S&apos;inscrire
                </button>
              )}
              {authModalType !== "forgot" && (
                <button type="button" onClick={() => setAuthModalType("forgot")} className="hover:underline">
                  Mot de passe oublié ?
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. NAVBAR INFÉRIEURE MOBILE FIXE CLIENT (MÊME COULEUR QUE LE MODE ERP : MODE CLAIR PREMIUM) */}
      {/* ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#E5E2DC] px-2 py-1.5 flex justify-around items-end select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {/* 1. Complètement à gauche : MON COMPTE */}
        <button
          type="button"
          onClick={() => onNavigate("account")}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-all min-w-[54px] cursor-pointer ${activeSection === "account"
            ? "text-[#0F141C] font-extrabold scale-105"
            : "text-[#64748B] hover:text-[#0F172A] font-medium"
            }`}
          title="Mon Compte"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <PuppyAccountIcon className={`w-5 h-5 ${activeSection === "account" ? "text-[#F2F2F2]" : "text-[#64748B]"}`} />
          </div>
          <span className="text-[10px] font-mono tracking-tight mt-1">Compte</span>
          {activeSection === "account" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] mt-0.5" />
          )}
        </button>

        {/* 2. MES ACHATS */}
        <button
          type="button"
          onClick={() => onNavigate("account")}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-all min-w-[54px] cursor-pointer ${activeSection === "account"
            ? "text-[#0F141C] font-extrabold"
            : "text-[#64748B] hover:text-[#0F172A] font-medium"
            }`}
          title="Mes achats & Commandes"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${activeSection === "account" ? "text-[#F2F2F2]" : "text-[#64748B]"}`}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="text-[10px] font-mono tracking-tight mt-1">Mes achats</span>
          {activeSection === "account" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] mt-0.5" />
          )}
        </button>

        {/* 3. AU MILIEU : BOUTON ACCUEIL SOBRE, SANS ROND ORANGE ET BIEN AÉRÉ */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className={`-mt-6 w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-4 border-[#FAF9F6] active:scale-95 shrink-0 shadow-md cursor-pointer ${activeSection === "home" || activeSection === "products"
            ? "bg-[#0F141C] text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
            : "bg-[#252E40] text-white hover:bg-[#1E2638]"
            }`}
          title="Accueil"
        >
          <span className={`text-xl leading-none ${activeSection === "home" || activeSection === "products" ? "text-[#F2F2F2]" : "text-white"}`}>⌂</span>
          <span className="text-[8.5px] font-sans font-semibold tracking-tight leading-none mt-0.5 text-white">
            Accueil
          </span>
          {(activeSection === "home" || activeSection === "products") && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] mt-0.5" />
          )}
        </button>

        {/* 4. CRUISING */}
        <button
          type="button"
          onClick={() => onNavigate("cruising")}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-all min-w-[54px] cursor-pointer ${activeSection === "cruising"
            ? "text-[#0F141C] font-extrabold scale-105"
            : "text-[#64748B] hover:text-[#0F172A] font-medium"
            }`}
          title="Espace Cruising"
        >
          <span className={`text-base leading-none ${activeSection === "cruising" ? "text-[#F2F2F2] font-bold" : "text-[#64748B]"}`}>◈</span>
          <span className="text-[10px] font-mono tracking-tight mt-1">Cruising</span>
          {activeSection === "cruising" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] mt-0.5" />
          )}
        </button>

        {/* 5. COMPLÈTEMENT À DROITE : PANIER AVEC ANIMATION DU CHIEN ATTRAPEUR */}
        <button
          id="mobile-cart-btn"
          type="button"
          onClick={() => onNavigate("cart")}
          className={`relative flex flex-col items-center py-1 px-1.5 rounded-lg transition-all min-w-[54px] cursor-pointer ${activeSection === "cart"
            ? "text-[#0F141C] font-extrabold scale-105"
            : "text-[#64748B] hover:text-[#0F172A] font-medium"
            }`}
          title="Panier"
        >
          <div className="relative w-7 h-7 flex items-center justify-center">
            {dogCartState !== "idle" ? (
              <PuppyCatchIcon phase={dogCartState} image={lastCaughtImage || undefined} />
            ) : (
              <span className="text-base leading-none">🛒</span>
            )}
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 font-mono text-[9px] font-black bg-[#0F141C] text-white px-1.5 py-0.2 rounded-full shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono tracking-tight mt-1">Panier</span>
          {activeSection === "cart" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] mt-0.5" />
          )}
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 6. BADGE PANIER STICKY / FLOTTANT DESKTOP (BAS À DROITE) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-50">
        {/* Badge Flottant Premium Sticky */}
        <button
          id="desktop-cart-btn"
          type="button"
          onClick={() => onNavigate("cart")}
          className={`flex items-center space-x-3.5 px-5 py-3.5 rounded-full border-2 transition-all duration-300 shadow-2xl cursor-pointer group select-none ${activeSection === "cart"
              ? "bg-[#F2F2F2] text-black border-[#F2F2F2] shadow-[0_8px_30px_rgba(212,145,94,0.5)] scale-105"
              : "bg-[#0B0D10]/95 hover:bg-[#161C26] text-white border-[#F2F2F2]/80 hover:border-[#F2F2F2] hover:scale-105 shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
            }`}
          title="Accéder au Panier"
        >
          <div className="relative flex items-center justify-center w-8 h-8">
            {dogCartState !== "idle" ? (
              <PuppyCatchIcon phase={dogCartState} image={lastCaughtImage || undefined} />
            ) : (
              <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
            )}
            {totalCartCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 font-mono text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs ${activeSection === "cart" ? "bg-black text-[#F2F2F2]" : "bg-[#F2F2F2] text-black"
                  }`}
              >
                {totalCartCount}
              </span>
            )}
          </div>
          <div className="text-left font-mono">
            <span
              className={`block text-xs font-black tracking-wider uppercase ${activeSection === "cart" ? "text-black" : "text-white group-hover:text-[#F2F2F2]"
                }`}
            >
              Panier
            </span>
            <span
              className={`block text-[10px] ${activeSection === "cart" ? "text-black/80 font-bold" : "text-[#A1A1AA]"
                }`}
            >
              {totalCartCount > 0
                ? `${totalCartCount} article${totalCartCount > 1 ? "s" : ""}`
                : "Vide"}
            </span>
          </div>
        </button>
      </div>

      {/* ANIMATION MISE EN CORBEILLE : PHOTO DU PRODUIT QUI RETRÉCIT ET VOLE VERS LE PANIER */}
      {flyingPhoto && (
        <div
          key={flyingPhoto.id}
          className="fixed z-[99999] pointer-events-none"
          style={{
            left: `${flyingPhoto.startX}px`,
            top: `${flyingPhoto.startY}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#F2F2F2] bg-black/90 flex items-center justify-center animate-throw-to-cart p-1.5"
            style={{
              "--target-x": `${flyingPhoto.targetX - flyingPhoto.startX}px`,
              "--target-y": `${flyingPhoto.targetY - flyingPhoto.startY}px`,
            } as React.CSSProperties}
          >
            <img
              src={flyingPhoto.image}
              alt=""
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* TIROIR MOBILE COMPLET (UNIVERSAL DRAWER EN 3 PARTIES DÉDIÉES) */}
      <UniversalDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        boutiqueActiveSection={activeSection}
        onBoutiqueNavigate={(sec) => {
          onNavigate(sec);
          setDrawerOpen(false);
        }}
      />
    </>
  );
}
