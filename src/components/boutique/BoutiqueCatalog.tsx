"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { products, type Product } from "@/data/products";
import { useApp } from "@/context/AppContext";

export default function BoutiqueCatalog() {
  const {
    language,
    stocks,
    user,
    addToCart,
    catalogCategory,
    setCatalogCategory,
    catalogSearchQuery,
    setCatalogSearchQuery,
    catalogShowMoreModal,
    setCatalogShowMoreModal,
    setCatalogActiveFiltersCount,
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});

  const openProductModal = (p: Product) => {
    setSelectedProduct(p);
    setModalQty(1);
    setActiveModalImageIndex(0);
    if (typeof window !== "undefined") {
      window.history.pushState({ modalOpen: true, productId: p.id }, "", `/produit/${p.id}`);
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/produit/")) {
      window.history.pushState({}, "", "/");
    }
  };

  // Synchronisation avec l'historique et la touche Échap : Retour instantané sans rechargement de page
  useEffect(() => {
    if (!selectedProduct) return;

    const handlePopState = () => {
      setSelectedProduct(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeProductModal();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent, totalImages: number) => {
    if (touchStartX === null || totalImages <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      // Swipe left -> image suivante
      setActiveModalImageIndex((prev) => (prev + 1) % totalImages);
    } else if (diff < -40) {
      // Swipe right -> image précédente
      setActiveModalImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
    setTouchStartX(null);
  };

  const getCardQty = (id: string) => cardQuantities[id] || 1;
  const setCardQty = (id: string, qty: number) => {
    setCardQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, qty),
    }));
  };

  // Filtres avancés
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(250);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Exact categories from dark-ink.com
  const categories = [
    { key: "all", label: "Toutes les catégories" },
    { key: "Harnais & Cuir", label: "Harnais & Cuir" },
    { key: "Latex & Rubber", label: "Latex & Rubber" },
    { key: "Bondage & Restraints", label: "Bondage & Restraints" },
    { key: "Sex-Toys & Plaisir", label: "Sex-Toys & Plaisir" },
    { key: "Lubrifiants & Soins", label: "Lubrifiants & Soins" },
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "Taille Unique"];
  const diameterOptions = ["28 mm", "32 mm", "35 mm", "38 mm", "45 mm", "50 mm"];
  const colorOptions = ["Noir", "Cuir Naturel / Havane", "Rouge BDSM", "Argent", "Or Mat"];
  const materialOptions = [
    "Cuir de vachette pleine fleur",
    "Cuir de buffle huilé",
    "Latex 100% naturel",
    "Acier inoxydable chirurgical",
    "Silicone médical platine",
  ];

  // Titres & descriptions dynamiques par catégorie (sur 1 seule ligne chacun)
  const categoryMeta: Record<string, { title: string; desc: string }> = {
    BDSM: {
      title: "BDSM",
      desc: "Entraves en acier lourd, menottes cuir, colliers, suspensions et dispositifs de soumission.",
    },
    AROMES: {
      title: "AROMES",
      desc: "Formules pures scellées de poppers et nettoyants cuir authentiques des marques internationales.",
    },
    "ASS PLAY": {
      title: "ASS PLAY",
      desc: "Plugs anatomiques, stimulateurs prostatiques, godes grands formats et accessoires d'expansion.",
    },
    "SEX TOYS": {
      title: "SEX TOYS",
      desc: "Masturbateurs, godemichets silicone double densité, cockrings et technologies érotiques masculines.",
    },
    CUIR: {
      title: "CUIR",
      desc: "Harnais torse et d'épaules, maroquinerie d'artisanat sellier et pièces en cuir véritable renforcé.",
    },
    "LUBE & HYGIENE": {
      title: "LUBE & HYGIENE",
      desc: "Lubrifiants silicone longue glisse, formules à base d'eau, douches intimes et soins d'hygiène.",
    },
    NEOPRENE: {
      title: "NEOPRENE",
      desc: "Harnais légers et respirants, singlets athlétiques, cagoules souples et accessoires clubbing.",
    },
    "GARDE ROBE": {
      title: "GARDE ROBE",
      desc: "Jockstraps de club, boxers fétiches, pantalons cuir, shorts et prêt-à-porter masculin sans compromis.",
    },
    "PUPPY PLAY GEAR": {
      title: "PUPPY PLAY GEAR",
      desc: "Cagoules puppy néoprène et cuir, mitaines griffées, colliers avec anneau D et muselières K9.",
    },
    "HOT DEALS": {
      title: "HOT DEALS",
      desc: "Offres privilèges, fins de séries et réductions exclusives sur une sélection d'articles.",
    },
    NEW: {
      title: "NEW",
      desc: "Derniers arrivages exclusifs et nouveautés mondiales en direct des ateliers internationaux.",
    },
    MARQUES: {
      title: "MARQUES",
      desc: "Toutes nos marques officielles : Mr S Leather, Locker Gear, Hankey's Toys, Oxballs.",
    },
    B2B: {
      title: "B2B",
      desc: "Espace réservé aux professionnels partenaires avec remise directe de 30% sur les commandes.",
    },
    all: {
      title: "TOUTES LES CATÉGORIES",
      desc: "L'ensemble de nos collections intimes, pièces en cuir véritable et accessoires de plaisir.",
    },
  };

  const getEffectivePrice = (basePrice: number) => {
    if (user?.isB2B) {
      return basePrice * 0.7; // -30% B2B
    }
    return basePrice;
  };

  // Compteur de filtres actifs pour le badge
  const activeFiltersCount =
    (selectedSizes.length > 0 ? 1 : 0) +
    (selectedDiameters.length > 0 ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (selectedMaterials.length > 0 ? 1 : 0) +
    (priceMin > 0 || priceMax < 250 ? 1 : 0) +
    (onlyPromos ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (sortBy !== "relevance" ? 1 : 0);

  useEffect(() => {
    setCatalogActiveFiltersCount(activeFiltersCount);
  }, [activeFiltersCount, setCatalogActiveFiltersCount]);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setCatalogCategory("all");
    setSelectedSizes([]);
    setSelectedDiameters([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setPriceMin(0);
    setPriceMax(250);
    setSortBy("relevance");
    setOnlyPromos(false);
    setOnlyInStock(false);
    setSearchQuery("");
    setCatalogSearchQuery("");
  };

  const effectiveCategory = catalogCategory !== "all" ? catalogCategory : selectedCategory;
  const effectiveSearch = catalogSearchQuery !== "" ? catalogSearchQuery : searchQuery;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Catégorie
        if (effectiveCategory !== "all") {
          const cat = effectiveCategory.toUpperCase();
          if (cat === "BDSM") {
            if (p.category !== "Bondage & Restraints") return false;
          } else if (cat === "AROMES") {
            if (
              !p.name.toLowerCase().includes("arome") &&
              !p.name.toLowerCase().includes("poppers") &&
              !p.name.toLowerCase().includes("cleaner") &&
              p.category !== "Lubrifiants & Soins"
            )
              return false;
          } else if (cat === "ASS PLAY") {
            if (
              !p.name.toLowerCase().includes("plug") &&
              !p.name.toLowerCase().includes("prostate") &&
              !p.name.toLowerCase().includes("butt") &&
              p.category !== "Sex-Toys & Plaisir"
            )
              return false;
          } else if (cat === "SEX TOYS") {
            if (p.category !== "Sex-Toys & Plaisir") return false;
          } else if (cat === "CUIR") {
            if (
              p.category !== "Harnais & Cuir" &&
              !p.material.toLowerCase().includes("cuir")
            )
              return false;
          } else if (cat === "LUBE & HYGIENE") {
            if (p.category !== "Lubrifiants & Soins") return false;
          } else if (cat === "NEOPRENE") {
            if (
              p.category !== "Latex & Rubber" &&
              !p.material.toLowerCase().includes("latex") &&
              !p.material.toLowerCase().includes("rubber")
            )
              return false;
          } else if (cat === "GARDE ROBE") {
            if (
              p.category !== "Harnais & Cuir" &&
              p.category !== "Latex & Rubber"
            )
              return false;
          } else if (cat === "PUPPY PLAY GEAR") {
            if (
              !p.name.toLowerCase().includes("puppy") &&
              !p.name.toLowerCase().includes("masque") &&
              p.category !== "Harnais & Cuir"
            )
              return false;
          } else if (cat === "HOT DEALS") {
            if (p.price > 80) return false;
          } else if (cat === "NEW") {
            if (!p.id.endsWith("001") && !p.id.endsWith("002") && !p.id.endsWith("007")) return false;
          } else if (cat === "MARQUES") {
            // Toutes les marques partenaires
          } else if (cat === "B2B") {
            // Mode B2B
          } else if (p.category !== effectiveCategory) {
            return false;
          }
        }

        // 2. Recherche mot-clé
        if (effectiveSearch.trim()) {
          const q = effectiveSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchMat = p.material.toLowerCase().includes(q);
          const matchCol = p.color.toLowerCase().includes(q);
          const trans = p.translations[language] || p.translations.fr;
          const matchDesc = trans.description.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchMat && !matchCol && !matchDesc) {
            return false;
          }
        }

        // 3. Tailles
        if (selectedSizes.length > 0) {
          const hasSize = selectedSizes.some((s) =>
            p.size.toLowerCase().includes(s.toLowerCase()),
          );
          if (!hasSize) return false;
        }

        // 4. Diamètres
        if (selectedDiameters.length > 0) {
          const hasDiam = selectedDiameters.some((d) =>
            p.dimensions.toLowerCase().includes(d.toLowerCase()) ||
            p.name.toLowerCase().includes(d.toLowerCase()),
          );
          if (!hasDiam) return false;
        }

        // 5. Couleurs
        if (selectedColors.length > 0) {
          const hasCol = selectedColors.some((c) =>
            p.color.toLowerCase().includes(c.split(" ")[0].toLowerCase()),
          );
          if (!hasCol) return false;
        }

        // 6. Matériaux
        if (selectedMaterials.length > 0) {
          const hasMat = selectedMaterials.some((m) =>
            p.material.toLowerCase().includes(m.split(" ")[0].toLowerCase()),
          );
          if (!hasMat) return false;
        }

        // 7. Prix
        const price = getEffectivePrice(p.price);
        if (price < priceMin || price > priceMax) {
          return false;
        }

        // 8. En stock uniquement
        if (onlyInStock) {
          const liveStock = stocks[p.id];
          const totalStock =
            (liveStock?.sites?.web ?? p.stock.web) +
            (liveStock?.sites?.boutique1Rayon ?? p.stock.boutique1Rayon) +
            (liveStock?.sites?.boutique2Rayon ?? p.stock.boutique2Rayon);
          if (totalStock <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = getEffectivePrice(a.price);
        const priceB = getEffectivePrice(b.price);
        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        return 0; // relevance
      });
  }, [
    effectiveCategory,
    effectiveSearch,
    selectedSizes,
    selectedDiameters,
    selectedColors,
    selectedMaterials,
    priceMin,
    priceMax,
    sortBy,
    onlyPromos,
    onlyInStock,
    language,
    user?.isB2B,
    stocks,
  ]);

  const handleQuickAdd = (p: Product) => {
    addToCart(p.id, 1);
    setAddedToast(`Ajouté au panier : ${p.translations[language]?.name || p.name}`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleModalAdd = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct.id, modalQty);
    setAddedToast(
      `${modalQty}x ${selectedProduct.translations[language]?.name || selectedProduct.name} ajouté(s) au panier`,
    );
    closeProductModal();
    setModalQty(1);
    setTimeout(() => setAddedToast(null), 3500);
  };

  const popularProducts = products.slice(0, 4);
  const otherBrandProducts = selectedProduct
    ? products.filter((p) => p.id !== selectedProduct.id)
    : products.slice(2);

  const activeCategoryKey = (catalogCategory !== "all" ? catalogCategory : selectedCategory).toUpperCase();
  const currentMeta = categoryMeta[activeCategoryKey] || categoryMeta[catalogCategory] || categoryMeta[selectedCategory] || {
    title: (catalogCategory !== "all" ? catalogCategory : selectedCategory).toUpperCase(),
    desc: `Sélection exclusive de pièces et accessoires pour la catégorie ${catalogCategory !== "all" ? catalogCategory : selectedCategory}.`,
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden w-full max-w-full">
      {/* BANDEAU CATÉGORIE PREMIUM CENTRÉ SUR UNE SEULE LIGNE (DESKTOP) */}
      <div className="border-b border-[#252C37] pb-4 px-2 sm:px-4">
        {/* VUE DESKTOP : TITRE ET DESCRIPTION CENTRÉS SUR UNE SEULE LIGNE SANS DOUBLON DU BOUTON FILTRES */}
        <div className="hidden lg:flex items-center justify-center gap-3 w-full py-1 text-center">
          <h1 className="text-lg xl:text-xl font-black text-white uppercase tracking-wider shrink-0 whitespace-nowrap">
            {currentMeta.title}
          </h1>
          <span className="text-[#F2F2F2] font-black text-base shrink-0 select-none">
            —
          </span>
          <p className="text-xs xl:text-sm text-gray-300 truncate font-sans whitespace-nowrap max-w-4xl">
            {currentMeta.desc}
          </p>
        </div>

        {/* VUE MOBILE / TABLETTE (lg:hidden) */}
        <div className="lg:hidden space-y-2">
          {!(isMobileSearchExpanded || effectiveSearch) ? (
            /* ÉTAT INITIAL : TITRE À GAUCHE + BOUTON RECHERCHER À GAUCHE DU BOUTON FILTRES */
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider truncate min-w-0 flex-1">
                {currentMeta.title}
              </h1>

              <div className="flex items-center gap-2 shrink-0">
                {/* Bouton Rechercher placé à gauche du bouton Filtres */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSearchExpanded(true);
                    setTimeout(() => mobileSearchRef.current?.focus(), 60);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-[#3A4354] bg-[#161C26] hover:bg-[#222B3D] text-gray-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Rechercher un produit..."
                >
                  <svg className="w-3.5 h-3.5 text-[#F2F2F2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Rechercher</span>
                </button>

                {/* Bouton Filtres */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreFilters(true);
                    setCatalogShowMoreModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#3A4354] bg-[#161C26] hover:bg-[#222B3D] text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>⚙ FILTRES</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F2F2F2] text-black text-[9px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ÉTAT AGRANDI : LE CHAMP RECHERCHE S'ALLONGE SUR TOUTE LA LARGEUR À GAUCHE DE FILTRES */
            <div className="flex items-center gap-2 w-full animate-fadeIn">
              <div className="relative flex-1 flex items-center min-w-0">
                <span className="absolute left-2.5 text-xs text-[#F2F2F2] pointer-events-none">
                  🔍
                </span>
                <input
                  ref={mobileSearchRef}
                  type="text"
                  placeholder="Rechercher référence, cuir, harnais, marque, taille..."
                  value={effectiveSearch}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCatalogSearchQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsMobileSearchExpanded(false);
                      setSearchQuery("");
                      setCatalogSearchQuery("");
                    }
                  }}
                  className="w-full bg-[#161C26] border border-[#3A4354] focus:border-[#F2F2F2] rounded-lg pl-8 pr-7 py-2 text-xs font-mono text-white placeholder-[#8E95A5] outline-none shadow-xs transition-colors"
                  autoFocus
                />
                {effectiveSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCatalogSearchQuery("");
                      mobileSearchRef.current?.focus();
                    }}
                    className="absolute right-2 text-xs font-mono text-[#8E95A5] hover:text-white px-1 cursor-pointer"
                    title="Effacer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Bouton fermeture pour replier la recherche */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchExpanded(false);
                  setSearchQuery("");
                  setCatalogSearchQuery("");
                }}
                className="px-2.5 py-2 rounded-lg border border-[#3A4354] bg-[#161C26] hover:bg-[#222B3D] text-white text-xs font-mono font-bold shrink-0 cursor-pointer"
                title="Fermer la recherche"
              >
                ✕
              </button>

              {/* Bouton Filtres maintenu accessible à droite */}
              <button
                type="button"
                onClick={() => {
                  setShowMoreFilters(true);
                  setCatalogShowMoreModal(true);
                }}
                className="px-3 py-2 rounded-lg border border-[#3A4354] bg-[#161C26] hover:bg-[#222B3D] text-white text-xs font-mono font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <span>⚙ FILTRES</span>
                {activeFiltersCount > 0 && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F2F2F2] text-black text-[9px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {!(isMobileSearchExpanded || effectiveSearch) && (
            <p className="text-xs text-gray-300 truncate">
              {currentMeta.desc}
            </p>
          )}
        </div>

        {user?.isB2B && (
          <div className="inline-block mt-2 bg-[#F2F2F2]/10 border border-[#F2F2F2]/30 px-3.5 py-1 rounded-full text-xs font-mono text-[#F2F2F2] font-semibold">
            Tarifs Professionnels B2B : -30% remisé sur l&apos;ensemble du vestiaire
          </div>
        )}
      </div>

      {/* Résumé des filtres actifs si sélectionnés */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-mono">
          <span className="text-[#888888]">Filtres actifs :</span>
          {selectedSizes.map((s) => (
            <span key={s} className="bg-[#FAF9F6] border border-[#E5E2DC] px-2 py-0.5 rounded-full text-[#111111] flex items-center space-x-1">
              <span>Taille {s}</span>
              <button type="button" onClick={() => setSelectedSizes(selectedSizes.filter((x) => x !== s))}>✕</button>
            </span>
          ))}
          {selectedMaterials.map((m) => (
            <span key={m} className="bg-[#FAF9F6] border border-[#E5E2DC] px-2 py-0.5 rounded-full text-[#111111] flex items-center space-x-1">
              <span>{m.split(" ")[0]}</span>
              <button type="button" onClick={() => setSelectedMaterials(selectedMaterials.filter((x) => x !== m))}>✕</button>
            </span>
          ))}
          {(priceMin > 0 || priceMax < 250) && (
            <span className="bg-[#FAF9F6] border border-[#E5E2DC] px-2 py-0.5 rounded-full text-[#111111] flex items-center space-x-1">
              <span>{priceMin} € - {priceMax} €</span>
              <button type="button" onClick={() => { setPriceMin(0); setPriceMax(250); }}>✕</button>
            </span>
          )}
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[#F2F2F2] hover:underline font-bold ml-2"
          >
            Réinitialiser tout
          </button>
        </div>
      )}

      {/* MODALE / PANNEAU LATÉRAL "PLUS DE FILTRES" AVEC VALIDATION */}
      {(showMoreFilters || catalogShowMoreModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header modale */}
            <div className="bg-[#111111] text-white p-4 flex items-center justify-between border-b border-[#252525]">
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold">⚙ Tous les filtres de recherche</span>
                <span className="text-xs font-mono text-[#F2F2F2]">
                  ({filteredProducts.length} articles correspondants)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMoreFilters(false);
                  setCatalogShowMoreModal(false);
                }}
                className="w-8 h-8 rounded-full border border-[#333333] hover:bg-[#222222] flex items-center justify-center text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Contenu modale avec sélecteurs et cases à cocher */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#111111]">
              {/* 1. Tailles (Cases à cocher) */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2F2F2] block">
                  Tailles disponibles
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {sizeOptions.map((s) => {
                    const checked = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (checked) {
                            setSelectedSizes(selectedSizes.filter((x) => x !== s));
                          } else {
                            setSelectedSizes([...selectedSizes, s]);
                          }
                        }}
                        className={`py-2 px-2 rounded-lg border text-center font-mono font-medium transition-all ${checked
                          ? "bg-[#111111] text-white border-[#111111] shadow-2xs"
                          : "bg-white text-[#555555] border-[#E5E2DC] hover:border-[#111111]"
                          }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Diamètres (Pour harnais, anneaux, plugs) */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2F2F2] block">
                  Diamètre &amp; Calibre
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {diameterOptions.map((d) => {
                    const checked = selectedDiameters.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (checked) {
                            setSelectedDiameters(selectedDiameters.filter((x) => x !== d));
                          } else {
                            setSelectedDiameters([...selectedDiameters, d]);
                          }
                        }}
                        className={`py-2 px-2 rounded-lg border text-center font-mono transition-all ${checked
                          ? "bg-[#111111] text-white border-[#111111]"
                          : "bg-white text-[#555555] border-[#E5E2DC] hover:border-[#111111]"
                          }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Couleurs */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2F2F2] block">
                  Couleurs
                </span>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => {
                    const checked = selectedColors.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          if (checked) {
                            setSelectedColors(selectedColors.filter((x) => x !== c));
                          } else {
                            setSelectedColors([...selectedColors, c]);
                          }
                        }}
                        className={`py-1.5 px-3 rounded-full border text-xs transition-all ${checked
                          ? "bg-[#111111] text-white border-[#111111]"
                          : "bg-white text-[#555555] border-[#E5E2DC] hover:border-[#111111]"
                          }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Matériaux de sellerie & confection */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2F2F2] block">
                  Matériau &amp; Finition
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {materialOptions.map((m) => {
                    const checked = selectedMaterials.includes(m);
                    return (
                      <label
                        key={m}
                        className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${checked
                          ? "bg-white border-[#F2F2F2] shadow-2xs"
                          : "bg-white/60 border-[#E5E2DC] hover:bg-white"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setSelectedMaterials(selectedMaterials.filter((x) => x !== m));
                            } else {
                              setSelectedMaterials([...selectedMaterials, m]);
                            }
                          }}
                          className="accent-[#F2F2F2] rounded"
                        />
                        <span className="text-xs">{m}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. Fourchette de Prix (Saisie manuelle + range) */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E5E2DC]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2F2F2]">
                    Fourchette de Prix
                  </span>
                  <span className="font-mono font-bold text-xs text-[#111111]">
                    {priceMin} € &mdash; {priceMax} €
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#888888] font-mono block mb-1">Prix minimum (€)</label>
                    <input
                      type="number"
                      min={0}
                      max={priceMax}
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full bg-[#FAF9F6] border border-[#D5D2CA] p-2 rounded-lg font-mono text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#888888] font-mono block mb-1">Prix maximum (€)</label>
                    <input
                      type="number"
                      min={priceMin}
                      max={350}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full bg-[#FAF9F6] border border-[#D5D2CA] p-2 rounded-lg font-mono text-xs outline-hidden"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#F2F2F2] cursor-pointer"
                />
              </div>

              {/* 6. Tri & Disponibilité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2F2F2] block mb-1.5">
                    Trier les résultats par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-[#D5D2CA] p-2 rounded-lg text-xs font-mono outline-hidden"
                  >
                    <option value="relevance">Pertinence &amp; Sélection</option>
                    <option value="price_asc">Prix croissant (Moins cher)</option>
                    <option value="price_desc">Prix décroissant (Plus cher)</option>
                    <option value="name_asc">Ordre alphabétique (A-Z)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="accent-[#F2F2F2]"
                    />
                    <span>Uniquement les articles en stock immédiat</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={onlyPromos}
                      onChange={(e) => setOnlyPromos(e.target.checked)}
                      className="accent-[#F2F2F2]"
                    />
                    <span>Uniquement les offres et tarifs remisés</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pied modale : Boutons Réinitialiser et VALIDER */}
            <div className="bg-white border-t border-[#E5E2DC] p-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-mono text-[#888888] hover:text-[#111111] underline"
              >
                Réinitialiser les critères
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreFilters(false);
                  setCatalogShowMoreModal(false);
                }}
                className="bg-[#111111] hover:bg-[#F2F2F2] text-black font-bold text-xs uppercase tracking-wider py-3 px-8 rounded-xl shadow-md transition-all font-mono"
              >
                VALIDER ({filteredProducts.length} ARTICLES)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E5E2DC] rounded-2xl space-y-3">
          <p className="text-base font-bold text-[#111111]">
            Aucun article ne correspond à l&apos;ensemble de ces filtres.
          </p>
          <p className="text-xs text-[#777777]">
            Essayez d&apos;élargir votre recherche de prix ou de désélectionner certaines tailles.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-2 bg-[#111111] text-white text-xs font-mono font-bold px-4 py-2 rounded-lg"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Products Grid (4 colonnes de cartes produits sur écran large) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const trans = p.translations[language] || p.translations.fr;
          const liveStock = stocks[p.id];
          const stockWeb = liveStock?.sites?.web ?? p.stock.web;
          const stockB1 = liveStock?.sites?.boutique1Rayon ?? p.stock.boutique1Rayon;
          const stockB2 = liveStock?.sites?.boutique2Rayon ?? p.stock.boutique2Rayon;
          const finalPrice = getEffectivePrice(p.price);

          return (
            <div
              key={p.id}
              className="bg-white border border-[#E5E2DC] hover:border-[#F2F2F2]/60 rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-2xs"
            >
              <div>
                {/* Visual Box with Authentic Product Photo filling 100% of the frame */}
                <div
                  onClick={() => openProductModal(p)}
                  className="bg-[#0B0D10] aspect-square w-full border-b border-[#252C37] relative cursor-pointer overflow-hidden group"
                >
                  {p.image && p.image !== "/placeholder.jpg" ? (
                    <img
                      src={p.image}
                      alt={trans.name}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 block"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                      <span className="font-mono text-xs font-bold text-[#F2F2F2] tracking-wider uppercase block">
                        {p.sku}
                      </span>
                      <span className="text-xs text-gray-400 font-mono block mt-1">
                        {p.category}
                      </span>
                      <span className="text-[11px] text-[#F2F2F2] underline font-medium mt-1 inline-block">
                        Fiche technique &amp; guide tailles &rarr;
                      </span>
                    </div>
                  )}

                  {/* Fit advice badge on card */}
                  <span className="absolute bottom-2 left-2 bg-black/80 text-gray-200 border border-[#333333] text-[9px] font-mono px-2 py-0.5 rounded shadow-2xs backdrop-blur-xs">
                    {p.size}
                  </span>

                  {user?.isB2B && (
                    <span className="absolute top-2.5 right-2.5 bg-[#F2F2F2] text-black text-[10px] font-mono font-black px-2 py-0.5 rounded shadow-xs">
                      -30% PRO
                    </span>
                  )}
                </div>

                {/* Content: Titre uniquement */}
                <div className="p-3.5 pb-2">
                  <h3
                    onClick={() => openProductModal(p)}
                    className="font-bold text-xs sm:text-sm text-[#111111] hover:text-[#F2F2F2] cursor-pointer transition-colors leading-snug line-clamp-2 min-h-[2.5rem]"
                    title={trans.name}
                  >
                    {trans.name}
                  </h3>
                </div>
              </div>

              {/* Ligne unique : Tarif + Quantité + "Ajouter au panier" */}
              <div className="p-3.5 pt-0">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2.5 border-t border-[#F0EDE8]">
                  {/* Tarif */}
                  <div className="shrink-0">
                    <span className="font-mono text-sm sm:text-base font-black text-[#111111] whitespace-nowrap">
                      {finalPrice.toFixed(2)} €
                    </span>
                    {user?.isB2B && (
                      <span className="block text-[8px] font-mono text-[#F2F2F2] font-bold -mt-0.5">
                        HT PRO
                      </span>
                    )}
                  </div>

                  {/* Quantité (- 1 +) */}
                  <div className="flex items-center border border-[#D5D2CA] bg-[#FAF9F6] rounded-md shrink-0">
                    <button
                      type="button"
                      onClick={() => setCardQty(p.id, getCardQty(p.id) - 1)}
                      className="w-5 sm:w-6 h-7 flex items-center justify-center text-xs font-bold text-[#555555] hover:text-black hover:bg-gray-200 rounded-l transition-colors cursor-pointer select-none"
                      title="Diminuer quantité"
                    >
                      -
                    </button>
                    <span className="w-4 sm:w-5 text-center font-mono font-bold text-xs text-[#111111] select-none">
                      {getCardQty(p.id)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCardQty(p.id, getCardQty(p.id) + 1)}
                      className="w-5 sm:w-6 h-7 flex items-center justify-center text-xs font-bold text-[#555555] hover:text-black hover:bg-gray-200 rounded-r transition-colors cursor-pointer select-none"
                      title="Augmenter quantité"
                    >
                      +
                    </button>
                  </div>

                  {/* Bouton Ajouter au Panier */}
                  <button
                    type="button"
                    onClick={() => {
                      const qty = getCardQty(p.id);
                      addToCart(p.id, qty);
                      setAddedToast(`Ajouté (${qty}) : ${p.name}`);
                      setTimeout(() => setAddedToast(null), 2500);
                    }}
                    className="flex-1 min-w-0 bg-[#111111] hover:bg-[#F2F2F2] hover:text-black text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-tight py-2 px-1.5 sm:px-2 rounded-md transition-all whitespace-nowrap text-center shadow-2xs cursor-pointer truncate"
                    title="Ajouter au panier"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POP-UP PRODUIT (SANS LE MODE DE LIVRAISON + AVEC LES 2 ESPACES SWIPER) */}
      {selectedProduct && (() => {
        const imagesList = selectedProduct.images && selectedProduct.images.length > 0
          ? selectedProduct.images
          : [selectedProduct.image];
        const currentImg = imagesList[activeModalImageIndex] || imagesList[0] || selectedProduct.image;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* ARRIÈRE-PLAN OBSCURCI : UN CLIC DESSUS REFERME IMMÉDIATEMENT LA POP-UP */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
              onClick={closeProductModal}
              aria-hidden="true"
            />

            {/* CARTE POP-UP PRINCIPALE */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-w-4xl w-full my-auto flex flex-col max-h-[92vh] bg-white rounded-2xl border border-[#E5E2DC] shadow-2xl cursor-default"
            >
              {/* BOUTON FERMETURE ✕ : STRICTEMENT POSITIONNÉ À CHEVAL SUR LE COIN SUPÉRIEUR DROIT */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeProductModal();
                }}
                style={{
                  position: "absolute",
                  top: "-14px",
                  right: "-14px",
                  zIndex: 9999,
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#111111] hover:bg-[#F2F2F2] text-black hover:text-black border-2 border-white shadow-2xl flex items-center justify-center font-mono font-bold text-base sm:text-lg cursor-pointer transition-all hover:scale-110 active:scale-95"
                title="Fermer la pop-up"
                aria-label="Fermer la pop-up"
              >
                ✕
              </button>

              {/* 1. TOUT LE HEADER DE LA POP-UP 100% STICKY (FIXE EN HAUT EN PERMANENCE) */}
              <div className="shrink-0 bg-white/95 backdrop-blur-md border-b border-[#E5E2DC] px-5 sm:px-7 py-3 rounded-t-2xl z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                {/* Côté Gauche du Header : Marque, SKU, Catégorie (HORS DU TITRE, SANS DOUBLON DE STOCK) */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#F2F2F2] tracking-wider uppercase">
                    {selectedProduct.brand ? `${selectedProduct.brand} • ` : ""}{selectedProduct.sku} &bull; {selectedProduct.category}
                  </span>

                  <a
                    href={`/produit/${selectedProduct.id}`}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#888888] hover:text-[#F2F2F2] hover:underline ml-2"
                    title="Ouvrir la page complète dédiée"
                  >
                    <span>Fiche dédiée SEO &rarr;</span>
                  </a>
                </div>

                {/* Côté Droit du Header : LE BLOC TARIF EN HAUT À DROITE */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] text-[#777777] uppercase font-mono block leading-none">Prix unitaire TTC</span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#111111]">
                      {getEffectivePrice(selectedProduct.price).toFixed(2)} €{" "}
                      {user?.isB2B && <span className="text-[10px] text-[#F2F2F2] block -mt-1 font-sans font-bold">(Tarif Pro B2B)</span>}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center border border-[#E5E2DC] bg-[#FAF9F6] rounded-lg shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        className="px-2.5 py-1 text-sm font-bold text-[#111111] hover:bg-white rounded-l-lg cursor-pointer"
                        title="Diminuer la quantité"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-mono font-bold text-xs text-[#111111]">{modalQty}</span>
                      <button
                        type="button"
                        onClick={() => setModalQty((q) => q + 1)}
                        className="px-2.5 py-1 text-sm font-bold text-[#111111] hover:bg-white rounded-r-lg cursor-pointer"
                        title="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleModalAdd}
                      className="bg-[#111111] hover:bg-[#F2F2F2] hover:text-black text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. CORPS DÉFILABLE DE LA POP-UP EN DESSOUS DU HEADER STICKY */}
              <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 rounded-b-2xl">
                {/* Layout 2 Colonnes sur Desktop : Galerie & Stocks à Gauche / Fiche & Specs à Droite */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                  {/* Colonne Gauche : Titre, Galerie Photo, Miniatures & Disponibilités Directes */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* TITRE AU DESSUS DE LA PHOTO (HORS DU HEADER DE LA POP-UP) */}
                      <h3 className="text-xl sm:text-2xl font-black text-[#111111] leading-snug">
                        {selectedProduct.translations[language]?.name || selectedProduct.name}
                      </h3>

                      {/* Cadre Photo Carré 1:1 épousant parfaitement l'image sans bandes vides latérales */}
                      <div
                        className="aspect-square w-full bg-[#0B0D10] rounded-xl border border-[#252C37] overflow-hidden shadow-inner relative group select-none flex items-center justify-center"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={(e) => handleTouchEnd(e, imagesList.length)}
                      >
                        <img
                          key={currentImg}
                          src={currentImg}
                          alt={`${selectedProduct.translations[language]?.name || selectedProduct.name} - Vue ${activeModalImageIndex + 1}`}
                          className="w-full h-full object-cover block transition-all duration-300"
                        />

                        {/* Badge Compteur de photos */}
                        {imagesList.length > 1 && (
                          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-white/90 border border-white/10 flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2]"></span>
                            <span>{activeModalImageIndex + 1} / {imagesList.length}</span>
                          </div>
                        )}

                        {/* Flèches Précédent / Suivant */}
                        {imagesList.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModalImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
                              }}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg"
                              title="Photo précédente"
                              aria-label="Photo précédente"
                            >
                              &#10094;
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModalImageIndex((prev) => (prev + 1) % imagesList.length);
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg"
                              title="Photo suivante"
                              aria-label="Photo suivante"
                            >
                              &#10095;
                            </button>
                          </>
                        )}
                      </div>

                      {/* Miniatures Horizontales Cliquables */}
                      {imagesList.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                          {imagesList.map((thumbUrl, idx) => {
                            const isActive = idx === activeModalImageIndex;
                            return (
                              <button
                                key={thumbUrl + idx}
                                type="button"
                                onClick={() => setActiveModalImageIndex(idx)}
                                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#0B0D10] ${isActive
                                  ? "border-[#F2F2F2] ring-2 ring-[#F2F2F2]/40 shadow-md scale-102"
                                  : "border-[#E5E2DC] opacity-65 hover:opacity-100 hover:border-[#F2F2F2]"
                                  }`}
                                title={`Afficher la photo ${idx + 1}`}
                              >
                                <img
                                  src={thumbUrl}
                                  alt={`Miniature ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {isActive && (
                                  <div className="absolute inset-0 bg-[#F2F2F2]/10 pointer-events-none" />
                                )}
                              </button>
                            );
                          })}
                          <span className="text-[10px] font-mono text-[#888888] pl-1 shrink-0">
                            {imagesList.length} vues HD
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bloc Bas Gauche : Disponibilités en Boutiques Physiques & Web */}
                    <div className="pt-1">
                      {/* Disponibilité & Stocks en Temps Réel par Établissement */}
                      <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#F2F2F2] tracking-wider block">
                            Disponibilités en Magasins (Paris) &amp; Web
                          </span>
                          <span className="text-[9px] font-mono text-[#888888]">Direct ERP</span>
                        </div>
                        {(() => {
                          const qWeb = stocks[selectedProduct.id]?.sites?.web ?? selectedProduct.stock.web;
                          const qB1 = stocks[selectedProduct.id]?.sites?.boutique1Rayon ?? selectedProduct.stock.boutique1Rayon;
                          const qB2 = stocks[selectedProduct.id]?.sites?.boutique2Rayon ?? selectedProduct.stock.boutique2Rayon;

                          return (
                            <div className="grid grid-cols-3 gap-2 text-center font-mono">
                              <div className="p-2 rounded-lg bg-white border border-[#EFECE6] flex flex-col justify-between shadow-2xs">
                                <span className="text-[#666666] text-[10px] block font-sans font-medium">Boutique Web</span>
                                <div className="my-1">
                                  <span className={`text-lg sm:text-xl font-black ${qWeb > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                    {qWeb}
                                  </span>
                                  <span className="text-[10px] text-[#555555] block">
                                    {qWeb > 1 ? "en stock" : qWeb === 1 ? "en stock" : "rupture"}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold ${qWeb > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                  {qWeb > 0 ? "Expédié 24h" : "Indisponible"}
                                </span>
                              </div>

                              <div className="p-2 rounded-lg bg-white border border-[#EFECE6] flex flex-col justify-between shadow-2xs">
                                <span className="text-[#666666] text-[10px] block font-sans font-medium">Paris Marais (4e)</span>
                                <div className="my-1">
                                  <span className={`text-lg sm:text-xl font-black ${qB1 > 0 ? "text-emerald-700" : "text-neutral-400"}`}>
                                    {qB1}
                                  </span>
                                  <span className="text-[10px] text-[#555555] block">
                                    en rayon
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold ${qB1 > 0 ? "text-emerald-700" : "text-neutral-500"}`}>
                                  {qB1 > 0 ? "Retrait 1h" : "Sur commande"}
                                </span>
                              </div>

                              <div className="p-2 rounded-lg bg-white border border-[#EFECE6] flex flex-col justify-between shadow-2xs">
                                <span className="text-[#666666] text-[10px] block font-sans font-medium">Bastille (11e)</span>
                                <div className="my-1">
                                  <span className={`text-lg sm:text-xl font-black ${qB2 > 0 ? "text-emerald-700" : "text-neutral-400"}`}>
                                    {qB2}
                                  </span>
                                  <span className="text-[10px] text-[#555555] block">
                                    en rayon
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold ${qB2 > 0 ? "text-emerald-700" : "text-neutral-500"}`}>
                                  {qB2 > 0 ? "Retrait 1h" : "Sur commande"}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Colonne Droite : Présentation, Points Clés & Fiche Technique Complète */}
                  <div className="flex flex-col justify-between space-y-3.5">
                    <div className="space-y-3">
                      {/* PRÉSENTATION en NOIR GRAS avec descriptif à fort contraste */}
                      <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                        <h4 className="text-xs font-black text-black uppercase tracking-wider block font-sans flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#111111]"></span>
                          Présentation
                        </h4>
                        <p className="text-[#111111] font-semibold leading-relaxed text-xs sm:text-sm">
                          {selectedProduct.translations[language]?.description ||
                            selectedProduct.translations.fr.description}
                        </p>
                      </div>

                      {/* Points Clés & Fonctionnalités Réels du Produit */}
                      {selectedProduct.features && selectedProduct.features.length > 0 && (
                        <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-3.5 space-y-2 shadow-2xs">
                          <span className="text-[11px] font-mono font-bold uppercase text-[#F2F2F2] tracking-wider block flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2]"></span>
                            Points Clés &amp; Atouts
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#111111]">
                            {selectedProduct.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] shrink-0 mt-1.5" />
                                <span className="font-semibold text-[#111111] leading-snug">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Fiche Technique Complète & Guide des Tailles */}
                      <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-3.5 space-y-2 shadow-2xs">
                        <span className="text-[11px] font-mono font-bold uppercase text-[#F2F2F2] tracking-wider block flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2]"></span>
                          Caractéristiques Techniques &amp; Guide des Tailles
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="p-1.5 rounded-md bg-white border border-[#EFECE6]">
                            <span className="text-[#777777] block text-[9px] uppercase">Matériau :</span>
                            <span className="font-sans font-medium text-[#111111]">
                              {selectedProduct.material}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-md bg-white border border-[#EFECE6]">
                            <span className="text-[#777777] block text-[9px] uppercase">Couleur &amp; Finition :</span>
                            <span className="font-sans font-medium text-[#111111]">
                              {selectedProduct.color}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-md bg-white border border-[#EFECE6]">
                            <span className="text-[#777777] block text-[9px] uppercase">Taille disponible :</span>
                            <span className="font-sans font-bold text-[#111111]">
                              {selectedProduct.size}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-md bg-white border border-[#EFECE6]">
                            <span className="text-[#777777] block text-[9px] uppercase">Conseil de taille :</span>
                            <span className="font-sans font-bold text-[#F2F2F2]">
                              {selectedProduct.fitAdvice}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-md bg-white border border-[#EFECE6]">
                            <span className="text-[#777777] block text-[9px] uppercase">Dimensions exactes :</span>
                            <span className="font-sans font-medium text-[#111111]">
                              {selectedProduct.dimensions}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-md bg-white border border-[#EFECE6]">
                            <span className="text-[#777777] block text-[9px] uppercase">Poids net :</span>
                            <span className="font-sans font-medium text-[#111111]">
                              {selectedProduct.weight}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Note de Conseil & Service Personnalisé en Boutique */}
                    <div className="bg-[#111111] text-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F2F2F2] block">
                          Conseil Expert &amp; Click &amp; Collect 1h
                        </span>
                        <p className="text-[11px] text-white/80 font-sans truncate">
                          Retrait discret en boutique Paris Marais ou Bastille en 1 heure
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#F2F2F2] shrink-0 border border-[#F2F2F2]/40 px-2.5 py-1 rounded-md">
                        Gratuit
                      </span>
                    </div>
                  </div>
                </div>

                {/* SUGGESTIONS DE PRODUITS (SWIPER UNIQUE, SANS DOUBLONS) */}
                <div className="pt-3 border-t border-[#E5E2DC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#111111] font-bold">
                      ✦ Vous Aimerez Aussi (Sélection Exclusive)
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">
                      Glisser &rarr;
                    </span>
                  </div>

                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
                    {otherBrandProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => openProductModal(p)}
                        className="min-w-[140px] max-w-[140px] bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#F2F2F2] rounded-xl p-2.5 cursor-pointer shrink-0 transition-all text-left group"
                      >
                        <div className="h-16 bg-[#0B0D10] rounded-lg overflow-hidden relative">
                          {p.image && p.image !== "/placeholder.jpg" ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-[#F2F2F2] font-bold">
                              {p.sku}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-[11px] text-[#111111] block truncate mt-1.5 font-sans group-hover:text-[#F2F2F2] transition-colors">
                          {p.name}
                        </span>
                        <span className="font-mono text-xs font-extrabold text-[#111111] block mt-0.5">
                          {getEffectivePrice(p.price).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
