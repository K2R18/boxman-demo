"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

interface MobileFilterModalProps {
  mode: "erp" | "boutique";
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterModal({
  mode,
  isOpen,
  onClose,
}: MobileFilterModalProps) {
  const {
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    user,
    toggleB2B,
  } = useApp();

  const [selectedSite, setSelectedSite] = useState<string>("Tous les sites");
  const [inStockOnly, setInStockOnly] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto ${
          mode === "erp"
            ? "bg-[#12151B] text-[#E2E4E9] border border-[#2B3342]"
            : "bg-white text-[#111111] border border-[#E5E2DC]"
        }`}
      >
        {/* Header style Airbnb */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#1F242D]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A68B]"></span>
            <h3 className="text-base font-bold font-sans">
              Filtres &amp; Préférences
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono border border-gray-300 dark:border-[#2B3342] hover:bg-gray-100 dark:hover:bg-[#1A1F29]"
          >
            ✕
          </button>
        </div>

        {/* CONTENU SELON ERP OU BOUTIQUE */}
        {mode === "erp" ? (
          <div className="space-y-4 text-xs font-mono">
            {/* 1. Sélecteur de Site */}
            <div>
              <label className="block text-[11px] uppercase text-[#8E95A5] mb-1.5 font-bold">
                Périmètre &bull; Site Opérationnel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Tous les sites",
                  "Entrepôt Central",
                  "Boutique 1 (Marais)",
                  "Boutique 2 (Bastille)",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSite(s)}
                    className={`py-2 px-3 rounded-lg border text-left transition-colors ${
                      selectedSite === s
                        ? "bg-[#5B7A9D] border-[#5B7A9D] text-white font-bold"
                        : "bg-[#161A22] border-[#262D3B] text-[#8E95A5] hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Rôle Actif */}
            <div>
              <label className="block text-[11px] uppercase text-[#8E95A5] mb-1.5 font-bold">
                Simulation Rôle &bull; Droits &amp; Confidentialité
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Gérant", "Responsable", "Vendeur", "Entrepôt"] as const).map(
                  (role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCurrentRole(role)}
                      className={`py-2 px-3 rounded-lg border text-left transition-colors ${
                        currentRole === role
                          ? "bg-amber-600 border-amber-600 text-white font-bold"
                          : "bg-[#161A22] border-[#262D3B] text-[#8E95A5] hover:text-white"
                      }`}
                    >
                      {role}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* 3. Stocks Bas uniquement */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#161A22] border border-[#262D3B]">
              <span className="text-white font-sans font-medium">
                Alertes stocks faibles (&lt; 5 unités)
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#5B7A9D]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            {/* 1. Mode Espace Pro B2B */}
            <div className="p-3.5 rounded-xl border border-[#D9A68B]/40 bg-[#FAF9F6] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#111111] block font-sans">
                  Tarification Espace Pro (-30%)
                </span>
                <span className="text-[11px] text-[#777777] font-sans">
                  Active la remise réservée aux professionnels et clubs
                </span>
              </div>
              <button
                type="button"
                onClick={toggleB2B}
                className={`px-3 py-1.5 rounded-full font-bold text-xs uppercase transition-colors ${
                  user?.isB2B
                    ? "bg-[#D9A68B] text-white"
                    : "bg-white border border-[#CCCCCC] text-[#555555]"
                }`}
              >
                {user?.isB2B ? "ACTIF ✓" : "DÉSACTIVÉ"}
              </button>
            </div>

            {/* 2. Langue de Consultation */}
            <div>
              <label className="block text-[11px] uppercase text-[#666666] mb-1.5 font-bold">
                Langue du Catalogue
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["fr", "en", "es", "de"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-2 rounded-lg border uppercase text-center font-bold transition-colors ${
                      language === lang
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-white border-[#E5E2DC] text-[#666666]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Disponibilité Immédiate en boutique */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC]">
              <span className="text-[#111111] font-sans font-medium">
                Disponible pour retrait 1h (Click &amp; Collect)
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#D9A68B]"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-200 dark:border-[#1F242D] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedSite("Tous les sites");
              setInStockOnly(false);
            }}
            className="text-xs text-gray-500 hover:underline font-mono"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-xs ${
              mode === "erp"
                ? "bg-[#5B7A9D] hover:bg-[#4E6B8D] text-white"
                : "bg-[#111111] hover:bg-[#D9A68B] text-white"
            }`}
          >
            Afficher les résultats
          </button>
        </div>
      </div>
    </div>
  );
}
