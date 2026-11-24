"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type Product, products } from "@/data/products";
import { useApp } from "@/context/AppContext";

export default function BoutiqueProductDetail({ product }: { product: Product }) {
  const { language, stocks, user, addToCart } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : (product.image && product.image !== "/placeholder.jpg" ? [product.image] : []);
  
  const currentImg = imagesList[activeImageIndex] || imagesList[0] || product.image;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || imagesList.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
    } else if (diff < -40) {
      setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
    }
    setTouchStartX(null);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, qty);
    setAddedToast(`${qty}x ${product.translations[language]?.name || product.name} ajouté(s) au panier !`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const finalPrice = user?.isB2B ? product.price * 0.7 : product.price;
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] py-6 sm:py-10">
      {/* Toast Feedback */}
      {addedToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111111] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#E5BAA3]/50 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#E5BAA3]"></span>
          <span className="text-xs font-mono font-bold">{addedToast}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Barre de Navigation Supérieure & Fil d'Ariane */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2DC] pb-4">
          <nav className="flex items-center gap-2 text-xs font-mono text-[#666666] flex-wrap">
            <Link href="/" className="hover:text-[#E5BAA3] transition-colors">
              Accueil
            </Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-[#E5BAA3] transition-colors">
              {product.category}
            </Link>
            <span>&bull;</span>
            <span className="text-[#111111] font-bold truncate max-w-[240px]">
              {product.sku}
            </span>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-[#E5E2DC] text-xs font-bold transition-all shadow-2xs group"
            >
              <span className="text-sm font-bold transform group-hover:-translate-x-0.5 transition-transform">&larr;</span>
              <span>Retour au catalogue</span>
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] text-xs font-mono text-[#444444] hover:text-black transition-all shadow-2xs cursor-pointer"
              title="Copier le lien direct du produit"
            >
              {copied ? (
                <>
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-emerald-700 font-bold">Lien copié !</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Partager</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Fiche Produit Principale en 2 Colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Colonne Gauche : Galerie Photo Pleine Résolution */}
          <div className="space-y-4">
            <div
              className="aspect-square w-full bg-[#0B0D10] rounded-2xl border border-[#252C37] overflow-hidden shadow-xl relative select-none flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                key={currentImg}
                src={currentImg}
                alt={product.name}
                className="w-full h-full object-cover block transition-all duration-300"
              />

              {/* Badge Compteur */}
              {imagesList.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#E5BAA3]"></span>
                  <span>{activeImageIndex + 1} / {imagesList.length}</span>
                </div>
              )}

              {/* Flèches Navigation */}
              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg text-lg"
                    title="Photo précédente"
                  >
                    &#10094;
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % imagesList.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg text-lg"
                    title="Photo suivante"
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>

            {/* Rangée de Miniatures */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {imagesList.map((thumbUrl, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={thumbUrl + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#0B0D10] ${
                        isActive
                          ? "border-[#E5BAA3] ring-2 ring-[#E5BAA3]/40 shadow-md scale-102"
                          : "border-[#E5E2DC] opacity-70 hover:opacity-100 hover:border-[#D9A68B]"
                      }`}
                    >
                      <img src={thumbUrl} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                      {isActive && <div className="absolute inset-0 bg-[#E5BAA3]/10 pointer-events-none" />}
                    </button>
                  );
                })}
                <span className="text-xs font-mono text-[#888888] pl-2 shrink-0">
                  Cliquez ou glissez pour changer d&apos;angle
                </span>
              </div>
            )}
          </div>

          {/* Colonne Droite : Données, Prix, Achat, Fiche Technique */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#D9A68B] tracking-wider uppercase">
                  {product.brand || "DARKLINE"} &bull; {product.sku} &bull; {product.category}
                </span>
                {product.inStockLabel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-[#D9A68B] border border-[#D9A68B]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9A68B] animate-pulse"></span>
                    {product.inStockLabel}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] leading-tight">
                {product.translations[language]?.name || product.name}
              </h1>
            </div>

            {/* Bloc d'Achat Immédiat */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E2DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#666666] uppercase font-mono block">Prix TTC</span>
                <span className="font-mono text-3xl font-black text-[#111111]">
                  {finalPrice.toFixed(2)} €{" "}
                  {user?.isB2B && <span className="text-sm text-[#D9A68B] font-bold block">(Tarif Pro B2B HT)</span>}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-[#E5E2DC] bg-[#FAF9F6] rounded-xl shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-base font-bold text-[#111111] hover:bg-white rounded-l-xl cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono font-bold text-sm text-[#111111]">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3.5 py-2 text-base font-bold text-[#111111] hover:bg-white rounded-r-xl cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-[#111111] hover:bg-[#D9A68B] text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap tracking-wider"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>

            {/* PRÉSENTATION en NOIR GRAS */}
            <div className="space-y-2">
              <h2 className="text-sm font-black text-black uppercase tracking-wider block font-sans">
                Présentation
              </h2>
              <p className="text-[#111111] font-semibold leading-relaxed text-sm sm:text-base">
                {product.translations[language]?.description || product.translations.fr.description}
              </p>
            </div>

            {/* Points Clés & Caractéristiques */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white border border-[#E5E2DC] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                <span className="text-xs font-mono font-bold uppercase text-[#D9A68B] tracking-wider block">
                  Points Clés &amp; Fonctionnalités
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#111111]">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#E5BAA3] shrink-0" />
                      <span className="font-bold text-[#111111]">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fiche Technique Complète */}
            <div className="bg-white border border-[#E5E2DC] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <span className="text-xs font-mono font-bold uppercase text-[#D9A68B] tracking-wider block">
                Fiche Technique &amp; Guide des Tailles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[#777777] block text-[11px]">Matériau :</span>
                  <span className="font-sans font-medium text-[#111111]">{product.material}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Couleur :</span>
                  <span className="font-sans font-medium text-[#111111]">{product.color}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Taille disponible :</span>
                  <span className="font-sans font-bold text-[#111111]">{product.size}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Conseil de taille :</span>
                  <span className="font-sans font-bold text-[#D9A68B]">{product.fitAdvice}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Dimensions :</span>
                  <span className="font-sans font-medium text-[#111111]">{product.dimensions}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Poids net :</span>
                  <span className="font-sans font-medium text-[#111111]">{product.weight}</span>
                </div>
              </div>
            </div>

            {/* Disponibilité & Stocks en Magasin */}
            <div className="bg-white border border-[#E5E2DC] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <span className="text-xs font-mono font-bold uppercase text-[#D9A68B] tracking-wider block">
                Disponibilité &amp; Stocks par Établissement
              </span>
              <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] text-center">
                  <span className="text-[#666666] text-[10px] block font-sans">Boutique Web</span>
                  <span className={(stocks[product.id]?.sites?.web ?? product.stock.web) > 0 ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                    {(stocks[product.id]?.sites?.web ?? product.stock.web) > 0 ? "En stock (24h)" : "Rupture"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] text-center">
                  <span className="text-[#666666] text-[10px] block font-sans">Paris 1er</span>
                  <span className={(stocks[product.id]?.sites?.boutique1Rayon ?? product.stock.boutique1Rayon) > 0 ? "text-emerald-700 font-bold" : "text-[#888888]"}>
                    {(stocks[product.id]?.sites?.boutique1Rayon ?? product.stock.boutique1Rayon) > 0 ? "Dispo rayon" : "Sur commande"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] text-center">
                  <span className="text-[#666666] text-[10px] block font-sans">Paris 11e</span>
                  <span className={(stocks[product.id]?.sites?.boutique2Rayon ?? product.stock.boutique2Rayon) > 0 ? "text-emerald-700 font-bold" : "text-[#888888]"}>
                    {(stocks[product.id]?.sites?.boutique2Rayon ?? product.stock.boutique2Rayon) > 0 ? "Dispo rayon" : "Sur commande"}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges de Confiance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {(product.badges || [
                "Paiement 100% sécurisé",
                "Expédié sous 24h & discret",
                "Service client Paris disponible"
              ]).map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-[#EFECE6] rounded-xl p-2.5 text-[#333333] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Produits Similaires de la Même Catégorie */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-[#E5E2DC] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm uppercase tracking-wider text-[#111111] font-bold">
                ★ Produits Associés dans la Catégorie {product.category}
              </h3>
              <Link href="/" className="text-xs font-mono text-[#E5BAA3] hover:underline">
                Voir tout &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/produit/${p.id}`}
                  className="bg-white border border-[#E5E2DC] hover:border-[#D9A68B] rounded-xl p-3 transition-all text-left shadow-2xs group flex flex-col justify-between"
                >
                  <div className="aspect-square bg-[#0B0D10] rounded-lg overflow-hidden mb-2 relative">
                    {p.image && p.image !== "/placeholder.jpg" ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#D9A68B] font-bold">
                        {p.sku}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#111111] block line-clamp-2 leading-tight">
                      {p.name}
                    </span>
                    <span className="font-mono text-sm font-black text-[#D9A68B] block mt-1">
                      {p.price.toFixed(2)} €
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
