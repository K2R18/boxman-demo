"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function DemoBar() {
  const { appMode, setAppMode, resetDemo, currentRole } = useApp();

  return (
    <header className="h-9 min-h-[36px] bg-[#16181D] border-b border-[#252A34] text-xs px-3 sm:px-6 flex items-center justify-between select-none z-50 sticky top-0 backdrop-blur-sm">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <span className="font-mono text-[11px] font-semibold text-[#8E95A5] tracking-wider uppercase hidden md:inline">
          BOXMAN SUITE
        </span>
        <span className="text-[#3A404E] hidden md:inline">|</span>

        {/* Toggle ERP / Boutique */}
        <div className="inline-flex rounded border border-[#2B313E] p-0.5 bg-[#0F1115]">
          <button
            type="button"
            onClick={() => setAppMode("erp")}
            className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
              appMode === "erp"
                ? "bg-[#252B37] text-white shadow-xs"
                : "text-[#8E95A5] hover:text-[#C5CAD5]"
            }`}
          >
            ERP & Logistique
          </button>
          <button
            type="button"
            onClick={() => setAppMode("boutique")}
            className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
              appMode === "boutique"
                ? "bg-[#A67C52] text-white shadow-xs"
                : "text-[#8E95A5] hover:text-[#C5CAD5]"
            }`}
          >
            Boutique Web & Cruising
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Role indicator in ERP */}
        {appMode === "erp" && (
          <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-[#8E95A5]">
            <span>Profil actif :</span>
            <span className="font-mono text-[#5B7A9D] font-semibold">
              {currentRole}
            </span>
          </div>
        )}

        {/* Reset button */}
        <button
          type="button"
          onClick={() => {
            if (
              confirm("Réinitialiser les données de démonstration et stocks ?")
            ) {
              resetDemo();
            }
          }}
          className="text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/40 hover:border-rose-800/80 px-2 py-0.5 rounded bg-rose-950/20"
        >
          Réinitialiser la démo
        </button>
      </div>
    </header>
  );
}
