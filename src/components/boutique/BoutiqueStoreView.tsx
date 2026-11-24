"use client";

import React, { useState } from "react";
import { products, type Product } from "@/data/products";
import { useApp } from "@/context/AppContext";
import type { BoutiqueSection } from "./BoutiqueNavbar";

interface BoutiqueStoreViewProps {
  storeId: "boutique1" | "boutique2";
  onNavigate: (section: BoutiqueSection) => void;
}

export default function BoutiqueStoreView({
  storeId,
  onNavigate,
}: BoutiqueStoreViewProps) {
  const { language, stocks, user, addToCart } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const isB1 = storeId === "boutique1";

  const storeInfo = isB1
    ? {
        name: "Boutique 1 — Le Marais",
        tagline: "Boutique Principale & Espace Cruising Privé",
        address: "18 rue Sainte-Croix-de-la-Bretonnerie, 75004 Paris",
        metro: "Hôtel de Ville (L1, L11) • Saint-Paul (L1)",
        hours: "Boutique : 12h00 — 21h00 • Cruising : 14h00 — 02h00 (7j/7)",
        phone: "01 42 78 90 12",
        stockKeyRayon: "boutique1Rayon" as const,
        stockKeyReserve: "boutique1Reserve" as const,
        description:
          "Située au cœur du Marais historique, la Boutique 1 propose une sélection soignée d'accessoires de bien-être, de lingeries intimes et abrite au niveau inférieur notre espace Cruising privé (labyrinthe sensoriel, sling, cabines et douches).",
        cruisingHighlight: true,
      }
    : {
        name: "Boutique 2 — Bastille",
        tagline: "Concept Store Intime, Cuir & Conseil Dédié",
        address: "42 rue de Lappe, 75011 Paris",
        metro: "Bastille (L1, L5, L8) • Ledru-Rollin (L8)",
        hours: "12h00 — 22h00 (7j/7, nocturne jusqu'à 02h les week-ends)",
        phone: "01 43 55 66 77",
        stockKeyRayon: "boutique2Rayon" as const,
        stockKeyReserve: "boutique2Reserve" as const,
        description:
          "À deux pas de la place de la Bastille, notre second espace est dédié au conseil personnalisé, aux collections de lingerie sculptante, maroquinerie haut de gamme et jouets technologiques de dernière génération.",
        cruisingHighlight: false,
      };

  // Filter products physically available in this store
  const availableInStore = products.filter((p) => {
    const live = stocks[p.id];
    const rayon = live?.sites?.[storeInfo.stockKeyRayon] ?? p.stock[storeInfo.stockKeyRayon];
    const reserve = live?.sites?.[storeInfo.stockKeyReserve] ?? p.stock[storeInfo.stockKeyReserve];
    return rayon + reserve > 0;
  });

  const getEffectivePrice = (price: number) => (user?.isB2B ? price * 0.7 : price);

  const handleQuickCollect = (p: Product) => {
    addToCart(p.id, 1);
    setAddedToast(`Article réservé en Click & Collect 1h à ${storeInfo.name}`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="space-y-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Store Header Banner */}
      <section className="bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#F0EDE8] pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F2F2F2] font-semibold">
              POINT DE VENTE PHYSIQUE • PARIS
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              {storeInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#F2F2F2] font-medium">
              {storeInfo.tagline}
            </p>
          </div>
          <span className="font-mono text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded font-bold self-start">
            Ouvert aujourd&apos;hui
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#555555]">
          <div className="space-y-1">
            <span className="font-bold text-[#111111] font-mono uppercase text-[11px] block">
              Adresse & Accès
            </span>
            <p>{storeInfo.address}</p>
            <p className="font-mono text-[#888888]">{storeInfo.metro}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-[#111111] font-mono uppercase text-[11px] block">
              Horaires d&apos;ouverture
            </span>
            <p>{storeInfo.hours}</p>
            <p className="font-mono text-[#888888]">Accueil sans rendez-vous</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-[#111111] font-mono uppercase text-[11px] block">
              Contact & Retrait 1h
            </span>
            <p className="font-mono">Tél direct : {storeInfo.phone}</p>
            <p className="text-emerald-700 font-semibold">
              Click & Collect prêt en 1h gratuit
            </p>
          </div>
        </div>

        {/* Special Cruising Highlight for Boutique 1 */}
        {storeInfo.cruisingHighlight && (
          <div className="bg-[#FAF9F6] border border-[#F2F2F2]/40 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#F2F2F2] font-bold">
                SPÉCIFICITÉ BOUTIQUE 1 • SOUS-SOL PRIVATISÉ
              </span>
              <h2 className="text-base font-bold text-[#111111]">
                Accès Direct à l&apos;Espace Cruising & Labyrinthe
              </h2>
              <p className="text-xs text-[#666666] max-w-2xl leading-relaxed">
                Le sous-sol de la Boutique 1 abrite nos 350 m² voûtés dédiés au lâcher-prise.
                Cabines, sling, vestiaires électroniques et douches privatives. Règlement en ligne ou sur place en espèces à l&apos;accueil.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("cruising")}
              className="shrink-0 bg-[#111111] hover:bg-[#F2F2F2] text-black text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded transition-colors shadow-xs"
            >
              Billetterie Cruising →
            </button>
          </div>
        )}
      </section>

      {/* Stock Available Immediately On Site */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E2DC] pb-4 gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#F2F2F2] font-semibold">
              DISPONIBILITÉS PHYSIQUES EN TEMPS RÉEL
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-0.5">
              Articles en Rayon & Réserve ({availableInStore.length} références)
            </h2>
          </div>
          <p className="text-xs text-[#777777] font-mono">
            Synchronisé en direct avec l&apos;ERP de caisse
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableInStore.map((p) => {
            const trans = p.translations[language] || p.translations.fr;
            const live = stocks[p.id];
            const qRayon = live?.sites?.[storeInfo.stockKeyRayon] ?? p.stock[storeInfo.stockKeyRayon];
            const qReserve = live?.sites?.[storeInfo.stockKeyReserve] ?? p.stock[storeInfo.stockKeyReserve];
            const finalPrice = getEffectivePrice(p.price);

            return (
              <div
                key={p.id}
                className="bg-white border border-[#E5E2DC] hover:border-[#F2F2F2]/60 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-[#F2F2F2]">
                      {p.sku}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {p.location}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#111111] leading-tight">
                      {trans.name}
                    </h3>
                    <p className="text-xs text-[#777777] mt-1 line-clamp-2">
                      {trans.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 border-t border-[#F0EDE8] flex justify-between items-baseline font-mono">
                    <span className="text-xs text-[#888888]">Prix unitaire :</span>
                    <span className="text-base font-extrabold text-[#111111]">
                      {finalPrice.toFixed(2)} € {user?.isB2B && "HT"}
                    </span>
                  </div>

                  {/* Stock count */}
                  <div className="bg-[#FAF9F6] border border-[#E5E2DC] p-2.5 rounded font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Disponible en rayon :</span>
                      <span className="font-bold text-emerald-700">
                        {qRayon} unités
                      </span>
                    </div>
                    <div className="flex justify-between text-[#888888]">
                      <span>Réserve magasin :</span>
                      <span>{qReserve} unités</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickCollect(p)}
                  className="w-full bg-[#111111] hover:bg-[#F2F2F2] text-black text-xs font-semibold uppercase tracking-wider py-2.5 rounded transition-colors shadow-xs"
                >
                  Réserver en Click & Collect 1h
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
