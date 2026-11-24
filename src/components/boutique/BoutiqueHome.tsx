"use client";

import React, { useState } from "react";
import type { BoutiqueSection } from "./BoutiqueNavbar";
import { useApp } from "@/context/AppContext";
import BoutiqueCatalog from "./BoutiqueCatalog";

interface BoutiqueHomeProps {
  onNavigate: (section: BoutiqueSection) => void;
}

// 12 Nouveautés authentiques extraites du code source dark-ink.com
const NOUVEAUTES = [
  {
    id: "darkline-puppy-paw",
    name: "DARKLINE Puppy Paw DoNut Cockring",
    brand: "DARKLINE",
    price: 29.0,
    img: "https://www.dark-ink.com/64402-home_default/darkline-puppy-paw-donut-cockring.jpg",
    badge: "NOUVEAU",
    category: "Sex-Toys & Plaisir",
  },
  {
    id: "brutus-magnetic",
    name: "BRUTUS MAGNETIC – Plug anal gonflable",
    brand: "BRUTUS",
    price: 49.9,
    img: "https://www.dark-ink.com/64389-home_default/brutus-magnetic-plug-anal-gonflable.jpg",
    badge: "TOP VENTE",
    category: "Sex-Toys & Plaisir",
  },
  {
    id: "mrs-bold-jock-orange",
    name: "Mr S Leather Bold Color Jockstrap - Orange",
    brand: "MR S LEATHER",
    price: 29.9,
    img: "https://www.dark-ink.com/64379-home_default/mr-s-leather-bold-color-jockstrap-orange.jpg",
    badge: "FETISH WEAR",
    category: "Harnais & Cuir",
  },
  {
    id: "darkline-collin-speculum",
    name: "DARKLINE Collin Speculum Acier 3 Tailles",
    brand: "DARKLINE",
    price: 24.0,
    img: "https://www.dark-ink.com/64367-home_default/darkline-collin-speculum-acier-3-tailles.jpg",
    badge: "MÉDICAL & BDSM",
    category: "Bondage & Restraints",
  },
  {
    id: "darkline-t-yoke-restraint",
    name: "DARKLINE T-Yoke Neck & Wrist Restraint Acier",
    brand: "DARKLINE",
    price: 128.0,
    img: "https://www.dark-ink.com/64356-home_default/darkline-t-yoke-neck-wrist-restraint-acier.jpg",
    badge: "ACIER LOURD",
    category: "Bondage & Restraints",
  },
  {
    id: "darkline-urethral-stretcher",
    name: "DARKLINE 2 Way Adjustable Urethral Stretcher",
    brand: "DARKLINE",
    price: 23.9,
    img: "https://www.dark-ink.com/64344-home_default/darkline-2-way-adjustable-urethral-stretcher.jpg",
    badge: "SONDES & SOUNDING",
    category: "Bondage & Restraints",
  },
  {
    id: "dual-density-skin-dildo",
    name: "Dual Density Silicone Realistic Sliding Skin Dildo",
    brand: "DARKLINE",
    price: 37.95,
    img: "https://www.dark-ink.com/64332-home_default/dual-density-silicone-realistic-sliding-skin-dildo.jpg",
    badge: "DOUBLE DENSITÉ",
    category: "Sex-Toys & Plaisir",
  },
  {
    id: "gasmaster-aroma-kit",
    name: "GASMASTER Ultimate Aroma Kit",
    brand: "GASMASTER",
    price: 59.0,
    img: "https://www.dark-ink.com/64320-home_default/gasmaster-ultimate-aroma-kit.jpg",
    badge: "ARÔMES",
    category: "Lubrifiants & Soins",
  },
  {
    id: "darkline-blue-ripple",
    name: "DARKLINE Blue Ripple Cockring",
    brand: "DARKLINE",
    price: 36.0,
    img: "https://www.dark-ink.com/64308-home_default/darkline-blue-ripple-cockring.jpg",
    badge: "COCKRING",
    category: "Sex-Toys & Plaisir",
  },
  {
    id: "sneakxx-puppy-hood",
    name: "SneakXX Sneaker Socks PUPPY HOOD",
    brand: "SNEAKXX",
    price: 14.5,
    img: "https://www.dark-ink.com/64296-home_default/sneakxx-sneaker-socks-puppy-hood.jpg",
    badge: "PUPPY GEAR",
    category: "Harnais & Cuir",
  },
  {
    id: "eventail-pride-64cm",
    name: "Éventail géant Pride – 64 cm",
    brand: "ACCESSORIES",
    price: 19.9,
    img: "https://www.dark-ink.com/64284-home_default/eventail-geant-pride-64-cm.jpg",
    badge: "PRIDE",
    category: "Sex-Toys & Plaisir",
  },
  {
    id: "darkline-steel-bull-cage",
    name: "DARKLINE Steel Bull Gold & Black Chastity Cage",
    brand: "DARKLINE",
    price: 59.0,
    img: "https://www.dark-ink.com/64272-home_default/darkline-steel-bull-gold-black-chastity-cage.jpg",
    badge: "CHASTETÉ",
    category: "Bondage & Restraints",
  },
];

// Marques phares de dark-ink.com
const BRANDS_LIST = [
  "Hankey's Toys",
  "Mr S Leather",
  "Locker Gear",
  "Oxballs",
  "Lockerroom",
  "Gigo",
  "Elbow Grease",
  "Swiss Navy",
  "Eros",
  "King Cock",
  "Perfect Fit",
  "Sexline",
  "Sportfucker",
  "CellBlock 13",
  "ROK",
];

// 3 Marques & Produits Phares officiels avec images locales garanties et sécurisées
const FLAGSHIP_BRANDS = [
  {
    id: "hankeys-toys",
    brand: "HANKEY'S TOYS",
    title: "Dildos Réalistes en silicone platinum",
    subtitle: "Lifecast • Surdimensionné • Fabrication Artisanale",
    badge: "ICÔNE MONDIALE",
    linkCategory: "SEX TOYS",
    externalUrl: "https://www.dark-ink.com/fr/35_hankeys-toys",
    images: [
      {
        url: "/brands/hankeys/hankeys-1.png",
        name: "Hankey's Toys Realistic Lifecast Dildo",
        tag: "Silicone Lifecast"
      },
      {
        url: "/brands/hankeys/hankeys-2.png",
        name: "Lampwick Cut Lifecast Realistic Dildo",
        tag: "Surdimensionné"
      },
      {
        url: "/brands/hankeys/assberge-egg.webp",
        name: "Hankey's Toys Assberge Egg Plug",
        tag: "Assberge Egg"
      },
      {
        url: "/brands/hankeys/knaughty-dragon.webp",
        name: "Hankey's Toys Knaughty Dragon Dildo",
        tag: "Knaughty Dragon"
      },
    ],
  },
  {
    id: "mr-s-leather",
    brand: "MR S LEATHER",
    title: "Fetish Gear & Puppy",
    subtitle: "Sellerie Lourde • Harnais Bulldog • Cagoules K9",
    badge: "CALIFORNIE 1979",
    linkCategory: "CUIR",
    externalUrl: "https://www.dark-ink.com/fr/62_mr-s-leather",
    images: [
      {
        url: "/brands/mrsleather/mrs-2.png",
        name: "Mr S Leather Harnais Neo Bold Bulldog",
        tag: "Harnais Bulldog"
      },
      {
        url: "/brands/mrsleather/mrs-3.jpg",
        name: "Mr S Neo K9 Muzzle Puppy Mask",
        tag: "K9 Puppy Kit"
      },
      {
        url: "/brands/mrsleather/mr-s-leather-bondage-dog-muzzle.webp",
        name: "Mr S Leather Bondage Dog Muzzle",
        tag: "Muselière Cuir"
      },
      {
        url: "/brands/mrsleather/mr-s-leather-neoprene-cocksucker-hood.webp",
        name: "Mr S Leather Neoprene Hood",
        tag: "Cagoule Néoprène"
      },
      {
        url: "/brands/mrsleather/mr-s-leather-x-factor-bold-color-body-harness-harnais-neoprene-pink.webp",
        name: "Mr S Leather X-Factor Bold Color Harness",
        tag: "Harnais X-Factor"
      },
    ],
  },
  {
    id: "poppers-leather-cleaners",
    brand: "POPPERS & LEATHER CLEANERS",
    title: "Poppers Amyle, Pentyle, Propyle...",
    subtitle: "Amyle • Pentyle • Flacons Scellés & Formules Originales",
    badge: "FORMULES ORIGINALES",
    linkCategory: "AROMES",
    externalUrl: "https://www.dark-ink.com/fr/196-poppers-leather-cleaners",
    images: [
      {
        url: "/brands/poppers/poppers-1.jpg",
        name: "Poppers & Leather Cleaners Amyl Pure Scellé",
        tag: "Flacons d'Origine"
      },
      {
        url: "/brands/poppers/iron-fist-amyl-24ml.webp",
        name: "Iron Fist Amyl Poppers Grand Format 24ml",
        tag: "Amyle Pur 24ml"
      },
      {
        url: "/brands/poppers/iron-fist-pentyl-buthanol-24ml.webp",
        name: "Iron Fist Pentyl & Buthanol Formule Forte 24ml",
        tag: "Pentyle 24ml"
      },
      {
        url: "/brands/poppers/isoamyl-nitrite-ich3-24ml.webp",
        name: "Isoamyl Nitrite ICH3 Haute Pureté 24ml",
        tag: "Isoamyle 24ml"
      },
      {
        url: "/brands/poppers/xtrm-sniffer-double-black-s.webp",
        name: "XTRM Sniffer Bouchon Double Embout Noir",
        tag: "Double Inhalateur"
      },
    ],
  },
];

export default function BoutiqueHome({ onNavigate }: BoutiqueHomeProps) {
  const { addToCart, catalogCategory, setCatalogCategory } = useApp();
  const [carouselIndex, setCarouselIndex] = useState(0);
  // Index d'image pour chacune des 3 cartes phares
  const [flagshipSlideIndices, setFlagshipSlideIndices] = useState<number[]>([0, 0, 0]);

  // Défilement automatique fluide toutes les 3.5 secondes
  React.useEffect(() => {
    const timer = setInterval(() => {
      setFlagshipSlideIndices((prev) =>
        prev.map((idx, i) => (idx + 1) % FLAGSHIP_BRANDS[i].images.length)
      );
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleNextFlagship = (cardIdx: number) => {
    setFlagshipSlideIndices((prev) => {
      const next = [...prev];
      next[cardIdx] = (next[cardIdx] + 1) % FLAGSHIP_BRANDS[cardIdx].images.length;
      return next;
    });
  };

  const handlePrevFlagship = (cardIdx: number) => {
    setFlagshipSlideIndices((prev) => {
      const next = [...prev];
      const total = FLAGSHIP_BRANDS[cardIdx].images.length;
      next[cardIdx] = (next[cardIdx] - 1 + total) % total;
      return next;
    });
  };

  // Si une catégorie est sélectionnée (hors accueil), on affiche le catalogue filtré
  if (catalogCategory && catalogCategory !== "all") {
    return (
      <div className="bg-[#0B0D10] text-[#E0E0E0] min-h-screen">
        <BoutiqueCatalog />
      </div>
    );
  }

  const handleQuickAdd = (prodId: string) => {
    // Si le produit existe dans notre base ou simule l'ajout direct
    addToCart(prodId, 1);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % (NOUVEAUTES.length - 3));
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? NOUVEAUTES.length - 4 : prev - 1));
  };

  return (
    <div className="space-y-12 pb-16 bg-[#0B0D10] text-[#E0E0E0] min-h-screen">
      {/* =========================================================================
          SECTION 1 : LES 3 MARQUES & PRODUITS PHARES (3 CARTES ÉGALES AVEC DÉFILEMENT PHOTOS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {FLAGSHIP_BRANDS.map((item, cardIdx) => {
            const currentImgIndex = flagshipSlideIndices[cardIdx] || 0;
            const activeImg = item.images[currentImgIndex];

            return (
              <div
                key={item.id}
                className="group relative bg-[#12161D] rounded-2xl overflow-hidden border border-[#252C37] hover:border-[#E5BAA3]/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Zone Photo plein format garantie visible avec redirection au clic vers la catégorie */}
                <div
                  onClick={() => {
                    setCatalogCategory(item.linkCategory);
                    onNavigate("products");
                  }}
                  className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-[#161C26] cursor-pointer"
                  title={`Voir la catégorie ${item.linkCategory}`}
                >
                  {/* Photo active rendue directement avec clé d'animation pour fondu propre à chaque changement */}
                  <img
                    key={`${cardIdx}-${currentImgIndex}-${activeImg.url}`}
                    src={activeImg.url}
                    alt={activeImg.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out animate-fadeIn"
                  />

                  {/* Dégradé supérieur et inférieur discret pour la lisibilité des badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12161D]/80 via-transparent to-black/50 pointer-events-none" />

                  {/* Badge Marque / Statut en haut à gauche */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
                    <span className="font-mono text-[10px] font-black tracking-widest text-black bg-[#E5BAA3] px-2.5 py-1 rounded-full uppercase shadow-md">
                      {item.badge}
                    </span>
                  </div>

                  {/* Tag du produit actif en haut à droite */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="font-mono text-[10px] font-bold text-gray-200 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 shadow-xs">
                      {activeImg.tag}
                    </span>
                  </div>

                  {/* Flèches de défilement discrètes et réactives */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevFlagship(cardIdx);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#E5BAA3] text-white hover:text-black border border-white/20 hover:border-[#E5BAA3] flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-lg"
                    title="Photo précédente"
                  >
                    &lsaquo;
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextFlagship(cardIdx);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#E5BAA3] text-white hover:text-black border border-white/20 hover:border-[#E5BAA3] flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-lg"
                    title="Photo suivante"
                  >
                    &rsaquo;
                  </button>

                  {/* Indicateurs à points (Dots) de pagination en bas de l'image */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5 z-10">
                    {item.images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlagshipSlideIndices((prev) => {
                            const next = [...prev];
                            next[cardIdx] = dotIdx;
                            return next;
                          });
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${dotIdx === currentImgIndex
                          ? "w-5 bg-[#E5BAA3]"
                          : "w-1.5 bg-white/40 hover:bg-white/70"
                          }`}
                        title={`Image ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Bloc Contenu & Informations Marque */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3 bg-[#12161D]">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[#E5BAA3] font-bold block">
                      {item.brand}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-wide group-hover:text-[#E5BAA3] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans line-clamp-1">
                      {item.subtitle}
                    </p>
                    <p className="text-[11px] font-mono text-gray-300 pt-1 italic line-clamp-1">
                      En vedette : {activeImg.name}
                    </p>
                  </div>

                  {/* Bouton d'action direct vers la catégorie / catalogue */}
                  <div className="pt-3 border-t border-[#1F2530] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCatalogCategory(item.linkCategory);
                        onNavigate("products");
                      }}
                      className="flex-1 bg-[#1C2230] hover:bg-[#E5BAA3] hover:text-black text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl border border-[#2B3548] hover:border-[#E5BAA3] transition-all text-center cursor-pointer shadow-xs"
                    >
                      Explorer la collection &rarr;
                    </button>
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-[#161C26] hover:bg-[#1E2536] border border-[#2B3548] text-[#E5BAA3] flex items-center justify-center text-xs font-mono font-black transition-colors shrink-0 shadow-xs"
                      title="Voir sur dark-ink.com"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 & 3 : NOUVEAUTÉS (SWIPER CAROUSEL 12 PRODUITS EXACTS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#252C37]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5BAA3] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
              NOUVEAUTÉS
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Précédent"
              className="w-8 h-8 rounded-full border border-[#252C37] bg-[#161C26] hover:border-[#E5BAA3] hover:text-[#E5BAA3] text-gray-300 flex items-center justify-center text-sm font-bold transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Suivant"
              className="w-8 h-8 rounded-full border border-[#252C37] bg-[#161C26] hover:border-[#E5BAA3] hover:text-[#E5BAA3] text-gray-300 flex items-center justify-center text-sm font-bold transition-colors"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className="text-xs font-semibold uppercase tracking-wider text-[#E5BAA3] hover:underline ml-3 hidden sm:inline-block"
            >
              Tout voir ({NOUVEAUTES.length}) →
            </button>
          </div>
        </div>

        {/* Grille / Carrousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 mt-6">
          {NOUVEAUTES.slice(carouselIndex, carouselIndex + 6).map((item) => {
            const targetCat =
              item.badge === "ARÔMES" || item.id === "gasmaster-aroma-kit"
                ? "AROMES"
                : item.badge === "PUPPY GEAR" || item.id === "sneakxx-puppy-hood"
                  ? "PUPPY PLAY GEAR"
                  : item.category === "Bondage & Restraints"
                    ? "BDSM"
                    : item.category === "Harnais & Cuir"
                      ? "CUIR"
                      : item.category === "Lubrifiants & Soins"
                        ? "LUBE & HYGIENE"
                        : "SEX TOYS";

            return (
              <div
                key={item.id}
                onClick={() => {
                  setCatalogCategory(targetCat);
                  onNavigate("products");
                }}
                className="group bg-[#12161D] border border-[#252C37] hover:border-[#E5BAA3]/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-xl cursor-pointer"
                title={`Voir dans ${targetCat}`}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-white/5 p-2">
                  <span className="absolute top-2 left-2 z-10 text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-black/70 text-[#E5BAA3] border border-[#E5BAA3]/30">
                    {item.badge}
                  </span>
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      {item.brand}
                    </span>
                    <h4 className="text-xs font-semibold text-white line-clamp-2 mt-0.5 group-hover:text-[#E5BAA3] transition-colors leading-snug">
                      {item.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#1F2530] flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-[#E5BAA3]">
                      {item.price.toFixed(2).replace(".", ",")} €
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(item.id);
                      }}
                      title="Ajouter au panier"
                      className="w-7 h-7 rounded bg-[#252C37] hover:bg-[#E5BAA3] hover:text-black text-gray-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 : 3 FOCUS BANNERS (HANKEY'S TOYS, LAMPWICK CUT, BDSM)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Hankey's Toys */}
          <div
            onClick={() => {
              setCatalogCategory("SEX TOYS");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[300px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir la catégorie SEX TOYS"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/hankeys-toys-dildo.png"
              alt="Hankey's Toys"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                SILICONE HAUTE DENSITÉ
              </span>
              <h3 className="text-lg font-black text-white tracking-wide mt-0.5">
                HANKEY&apos;S TOYS
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Dildos surdimensionnés & créations légendaires.
              </p>
            </div>
          </div>

          {/* Card 2: Lampwick Cut / Mr Hankey's Toys */}
          <div
            onClick={() => {
              setCatalogCategory("ASS PLAY");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[300px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir la catégorie ASS PLAY"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/49200.png"
              alt="Lampwick Cut"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                EMPREINTE RÉELLE / LIFECAST
              </span>
              <h3 className="text-lg font-black text-white tracking-wide mt-0.5">
                LAMPWICK CUT
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Exploration anale en profondeur & sensations réalistes.
              </p>
            </div>
          </div>

          {/* Card 3: BDSM */}
          <div
            onClick={() => {
              setCatalogCategory("BDSM");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[300px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir la catégorie BDSM"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/64426.jpg"
              alt="BDSM Gear"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                RESTRAINTS & CAGES
              </span>
              <h3 className="text-lg font-black text-white tracking-wide mt-0.5">
                UNIVERS BDSM
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Entraves en acier lourd, cuir épais et dispositifs de soumission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 : SPOTLIGHT MISTER B & MR S LEATHER (1 LARGE + 2 COLONNES)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Mister B Glide Silicone Large Banner */}
        <div
          onClick={() => {
            setCatalogCategory("LUBE & HYGIENE");
            onNavigate("products");
          }}
          className="group relative h-[220px] sm:h-[280px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-lg transition-transform duration-300 hover:scale-[1.005]"
          title="Voir la catégorie LUBES & SOINS"
        >
          <img
            src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/57359.png"
            alt="Mister B Glide Silicone"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-lg">
            <span className="font-mono text-xs font-bold text-[#E5BAA3] tracking-widest uppercase">
              MISTER B • FORMULATION EXCLUSIVE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide">
              GLIDE LUBRIFIANT SILICONE
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              Glisse infinie, ultra soyeuse, compatible latex et idéale pour les sessions intenses. Dès 15,70 €.
            </p>
            <div className="pt-4">
              <button
                type="button"
                className="bg-[#E5BAA3] hover:bg-[#C99377] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Commander maintenant →
              </button>
            </div>
          </div>
        </div>

        {/* 2 Colonnes Mr S Leather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Mr S Harnais Bulldog */}
          <div
            onClick={() => {
              setCatalogCategory("CUIR");
              onNavigate("products");
            }}
            className="group relative h-[280px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir la catégorie CUIR"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/61439.png"
              alt="Mr S Leather Harnais Neo Bold Bulldog"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                  MR S LEATHER • SAN FRANCISCO
                </span>
                <h3 className="text-lg font-black text-white tracking-wide mt-1">
                  HARNAIS NEO BOLD BULLDOG
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  11 coloris néoprène & finitions cuir renforcé.
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#E5BAA3] border border-[#E5BAA3]/40 px-3 py-1.5 rounded-md bg-black/60">
                Découvrir
              </span>
            </div>
          </div>

          {/* Mr S Neo K9 Muzzle Kit */}
          <div
            onClick={() => {
              setCatalogCategory("PUPPY PLAY GEAR");
              onNavigate("products");
            }}
            className="group relative h-[280px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir la catégorie PUPPY PLAY"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/61100.jpg"
              alt="Mr S Leather Neo K9 Muzzle Kit"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                  PUPPY PLAY • SÉLECTION PRO
                </span>
                <h3 className="text-lg font-black text-white tracking-wide mt-1">
                  NEO K9 MUZZLE KIT
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  16 combinaisons de couleurs personnalisables.
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#E5BAA3] border border-[#E5BAA3]/40 px-3 py-1.5 rounded-md bg-black/60">
                Découvrir
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 & 7 : GARDE ROBE FETISH (4 COLONNES DE MARQUES PHARE)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#252C37]">
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
            GARDE ROBE FETISH
          </h2>
          <button
            type="button"
            onClick={() => {
              setCatalogCategory("GARDE ROBE");
              onNavigate("products");
            }}
            className="text-xs font-semibold uppercase tracking-wider text-[#E5BAA3] hover:underline cursor-pointer"
          >
            Toute la garde-robe →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Marque 1: Mr S Leather */}
          <div
            onClick={() => {
              setCatalogCategory("GARDE ROBE");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir dans GARDE ROBE"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/mr-s-leather-fetish.png"
              alt="Mr S Leather Fetish"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                SAN FRANCISCO
              </span>
              <h3 className="text-base font-black text-white tracking-wide mt-0.5">
                MR S LEATHER
              </h3>
            </div>
          </div>

          {/* Marque 2: Locker Gear */}
          <div
            onClick={() => {
              setCatalogCategory("GARDE ROBE");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir dans GARDE ROBE"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/lockergear-fetish-gear.jpg"
              alt="Locker Gear Fetish Gear"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                MONTREAL • UNDERWEAR
              </span>
              <h3 className="text-base font-black text-white tracking-wide mt-0.5">
                LOCKER GEAR
              </h3>
            </div>
          </div>

          {/* Marque 3: CellBlock 13 */}
          <div
            onClick={() => {
              setCatalogCategory("GARDE ROBE");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir dans GARDE ROBE"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/cellblock13-fetish-gear-1.jpg"
              alt="CellBlock 13 Fetish Gear"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                CALIFORNIA • ATHLETIC
              </span>
              <h3 className="text-base font-black text-white tracking-wide mt-0.5">
                CELLBLOCK 13
              </h3>
            </div>
          </div>

          {/* Marque 4: ROK */}
          <div
            onClick={() => {
              setCatalogCategory("GARDE ROBE");
              onNavigate("products");
            }}
            className="group relative h-[260px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer border border-[#252C37] bg-[#12161D] shadow-md transition-transform duration-300 hover:scale-[1.01]"
            title="Voir dans GARDE ROBE"
          >
            <img
              src="https://www.dark-ink.com/img/cms/homepage/HOME%20FR/rok-fetish-gay-gear.png"
              alt="ROK Fetish Gay Gear"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold">
                EUROPE • RUBBER & LEATHER
              </span>
              <h3 className="text-base font-black text-white tracking-wide mt-0.5">
                ROK
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8 : ÉDITORIAL SEO & MARQUES QUI COMPTENT (CONTENU AUTHENTIQUE)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-[#12161D] border border-[#252C37] rounded-2xl p-6 sm:p-10 space-y-8">
          {/* H1 Authentique */}
          <div className="border-b border-[#252C37] pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#E5BAA3] font-bold">
              MAISON PARISIENNE DE RÉFÉRENCE ｜ DEPUIS 2003
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              DARK-INK PARIS — SEX SHOP GAY, FETISH &amp; BDSM DEPUIS 2003
            </h1>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed max-w-4xl">
              Installé à Paris depuis 2003, Dark-Ink est le premier sex shop gay en ligne français dédié aux cultures fetish, BDSM et cuir. Depuis plus de vingt ans, nous sélectionnons le meilleur du matériel mondial pour les hommes qui aiment repousser leurs limites : sex toys grande taille, entraves BDSM en cuir épais, cockrings en acier chirurgical, jockstraps et harnais néoprène, masques puppy et flacons d&apos;arômes de référence.
            </p>
          </div>

          {/* H2 Authentique + Carrousel marques */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase">
                DES MARQUES QUI COMPTENT
              </h2>
              <span className="text-xs font-mono text-[#E5BAA3]">
                Import directeurs & distributeur officiel
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Nous travaillons sans intermédiaire avec les ateliers et marques les plus respectés de la communauté internationale :
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {BRANDS_LIST.map((brand) => (
                <span
                  key={brand}
                  className="px-3 py-1.5 rounded-lg bg-[#161C26] border border-[#252C37] text-xs font-semibold text-gray-200 hover:border-[#E5BAA3] hover:text-[#E5BAA3] transition-colors cursor-pointer"
                  onClick={() => onNavigate("products")}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* 4 Paragraphes Thématiques Officiels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#252C37]">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#E5BAA3]">
                SEX TOYS, COCKRINGS &amp; BDSM GEAR
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                De l&apos;acier chirurgical aux dildos monstres coulés à la main, nous offrons une sélection sans compromis pour l&apos;exploration anale, la chasteté masculine, le bondage lourd et le sounding médical. Chaque pièce est sélectionnée pour sa fiabilité anatomique et ses matériaux hypoallergéniques.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#E5BAA3]">
                FETISH WEAR &amp; PUPPY GEAR
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cuir pleine fleur, néoprène respirant, latex naturel et finitions métal lourd. Du simple jockstrap de club aux cagoules puppy sur-mesure et harnais bulldog, nos pièces incarnent le vestiaire masculin contemporain sous toutes ses formes.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#E5BAA3]">
                POPPERS, LEATHER CLEANERS &amp; LUBRIFIANTS
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Formules pures scellées en usine pour l&apos;entretien du cuir et les sensations décuplées : nitrites de pentyle, propyle et amyle des fabricants d&apos;origine. Lubrifiants silicone longue durée, crèmes relaxantes et soins d&apos;hygiène spécifiques.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#E5BAA3]">
                DARK-INK, À PARIS ET EN LIGNE
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Que vous commandiez en ligne avec expédition neutre sous 24h ou que vous préfériez le retrait discret en Click &amp; Collect dans nos boutiques du Marais et de Bastille, notre équipe met un point d&apos;honneur à vous garantir conseil, bienveillance et confidentialité absolue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 : 4 BLOCS DE RÉASSURANCE CLIENT (FOOTER CARDS DARK-INK)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-[#12161D] border border-[#252C37] rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#E5BAA3]/10 border border-[#E5BAA3]/30 flex items-center justify-center shrink-0 text-[#E5BAA3] font-bold text-lg">
              🔒
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                PAIEMENT SÉCURISÉ
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                CB, Visa, MasterCard ou AMEX. Débit bancaire discret uniquement à l&apos;expédition.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#12161D] border border-[#252C37] rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#E5BAA3]/10 border border-[#E5BAA3]/30 flex items-center justify-center shrink-0 text-[#E5BAA3] font-bold text-lg">
              📦
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                LIVRAISON RAPIDE
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Colis 100% neutre standard, points relais ou retrait Click &amp; Collect Paris 1h.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#12161D] border border-[#252C37] rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#E5BAA3]/10 border border-[#E5BAA3]/30 flex items-center justify-center shrink-0 text-[#E5BAA3] font-bold text-lg">
              ✨
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                RÉCOMPENSES
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Cumulez des points et débloquez des remises exclusives sur vos prochaines commandes.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#12161D] border border-[#252C37] rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#E5BAA3]/10 border border-[#E5BAA3]/30 flex items-center justify-center shrink-0 text-[#E5BAA3] font-bold text-lg">
              💬
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                SERVICE CLIENT
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Du lundi au vendredi de 10h à 18h par téléphone au 01.42.60.21.59 ou via formulaire.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
