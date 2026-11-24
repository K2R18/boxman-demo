"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import type { BoutiqueSection } from "@/components/navigation/UniversalDrawer";

interface BoutiqueStoresUnifiedProps {
  onNavigate: (section: BoutiqueSection) => void;
}

export default function BoutiqueStoresUnified({
  onNavigate,
}: BoutiqueStoresUnifiedProps) {
  const { stocks } = useApp();

  // Produits disponibles spécifiquement à la boutique New Millénium (boutique 2)
  const newMilleniumProducts = products.filter(
    (p) => (stocks[p.id]?.sites?.boutique2Rayon ?? p.stock.boutique2Rayon) > 0,
  );

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-[#E0E0E0]">
      {/* En-tête exclusif New Millénium */}
      <div className="border-b border-[#252C37] pb-8 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E5BAA3]/10 border border-[#E5BAA3]/30">
          <span className="w-2 h-2 rounded-full bg-[#E5BAA3] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#E5BAA3] font-bold">
            2NDE BOUTIQUE • GALERIE D&apos;ART &amp; HAUTE FÉTICHE
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Boutique New Millénium
        </h1>
        <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
          Pensée comme un sanctuaire confidentiel et une galerie d&apos;art contemporaine fétiche, la boutique <strong>New Millénium</strong> réunit pièces uniques de créateurs, maroquinerie d&apos;art sur-mesure, sculptures et expositions éphémères au cœur du 11e arrondissement.
        </p>
      </div>

      {/* Carte d'identité New Millénium */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche : Adresse, Horaires & Visuels */}
        <div className="lg:col-span-1 bg-[#12161D] border border-[#252C37] rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5BAA3] font-bold block">
                PARIS 11E • OBERKAMPF
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                New Millénium
              </h2>
            </div>
            <span className="font-mono text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-bold">
              Ouvert aujourd&apos;hui
            </span>
          </div>

          {/* Coordonnées & Accès */}
          <div className="space-y-4 text-xs font-mono border-t border-[#1F2530] pt-4">
            <div>
              <span className="text-gray-400 block uppercase text-[10px] tracking-wider">
                Adresse officielle
              </span>
              <p className="text-white font-bold font-sans text-sm mt-0.5">
                37 Rue Jean-Pierre Timbaud, 75011 Paris
              </p>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Métros : Parmentier (L3), Oberkampf (L5, L9) ou République
              </p>
            </div>

            <div>
              <span className="text-gray-400 block uppercase text-[10px] tracking-wider">
                Horaires d&apos;ouverture
              </span>
              <p className="text-gray-200 font-sans text-xs mt-0.5">
                Mardi &ndash; Samedi : 12h00 &ndash; 20h00
              </p>
              <p className="text-[#E5BAA3] text-[11px] mt-0.5">
                Dimanche &amp; Lundi : Salons privés sur rendez-vous
              </p>
            </div>

            <div>
              <span className="text-gray-400 block uppercase text-[10px] tracking-wider">
                Contact direct galerie
              </span>
              <p className="text-white font-bold font-mono text-xs mt-0.5">
                01 43 57 89 20 &bull; newmillenium@dark-ink.com
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="w-full bg-[#161C26] hover:bg-[#E5BAA3] hover:text-black text-white border border-[#252C37] text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Prendre rendez-vous privé &rarr;
            </button>
          </div>
        </div>

        {/* Colonne droite : Galerie d'Art, Piliers & Stock sur place */}
        <div className="lg:col-span-2 space-y-6">
          {/* Piliers Concept Galerie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#12161D] border border-[#252C37] rounded-xl p-5 space-y-2">
              <span className="text-lg">🎨</span>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Galerie d&apos;Art Fétiche
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Expositions tournantes d&apos;artistes internationaux : photographies argentiques, sculptures résine, travail du cuir d&apos;artisan et installations sensorielles.
              </p>
            </div>

            <div className="bg-[#12161D] border border-[#252C37] rounded-xl p-5 space-y-2">
              <span className="text-lg">✨</span>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Showroom Haute Couture
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pièces uniques numérotées, harnais en cuir pleine fleur façonnés à la main, latex moulé sur mesure et joaillerie intime en titane chirurgical.
              </p>
            </div>
          </div>

          {/* Click & Collect Banner */}
          <div className="bg-gradient-to-r from-[#181E2A] to-[#12161D] border border-[#E5BAA3]/40 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#E5BAA3] uppercase font-bold">
                CLICK &amp; COLLECT PRIVILEGE (1H)
              </span>
              <h3 className="text-base font-black text-white mt-1">
                Retrait direct à New Millénium
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Commandez en ligne et retirez discrètement votre colis à l&apos;accueil de la galerie en 1 heure.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className="bg-[#E5BAA3] hover:bg-[#C99377] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-colors shrink-0"
            >
              Commander en ligne &rarr;
            </button>
          </div>

          {/* Pièces et Disponibilités sur place */}
          <div className="bg-[#12161D] border border-[#252C37] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Pièces &amp; Sélections d&apos;exception en rayon
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Échantillon des articles actuellement exposés au 37 rue Jean-Pierre Timbaud ({newMilleniumProducts.length} pièces disponibles) :
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#E5BAA3] font-bold">
                Stock temps réel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {newMilleniumProducts.slice(0, 8).map((p) => {
                const qty = stocks[p.id]?.sites?.boutique2Rayon ?? p.stock.boutique2Rayon;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-[#161C26] border border-[#252C37] px-3 py-2 rounded-lg text-xs"
                  >
                    <span className="text-white font-medium truncate mr-2">
                      {p.name}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[#E5BAA3] font-bold bg-black/50 px-2 py-0.5 rounded border border-[#E5BAA3]/20">
                      {qty} en galerie
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
