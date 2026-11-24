"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export type ERPTab =
  | "dashboard"
  | "orders"
  | "deliveries"
  | "returns"
  | "stocks"
  | "catalog"
  | "transfers"
  | "cash"
  | "accounting"
  | "hr";

interface ERPSidebarProps {
  activeTab: ERPTab;
  onTabChange: (tab: ERPTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const erpNavItems: {
  id: ERPTab;
  label: string;
  short: string;
  iconSymbol: string;
  badge?: string;
  desc?: string;
}[] = [
  { id: "dashboard", label: "Tableau de bord", short: "TDB", iconSymbol: "⊞", desc: "Alertes stocks & activité caisse" },
  { id: "orders", label: "Commandes & Dispatch", short: "Commandes", iconSymbol: "❒", badge: "Flux", desc: "Fournisseurs, B2B, clients & dispatch" },
  { id: "stocks", label: "Stocks & Réserves Multi-Sites", short: "Stocks", iconSymbol: "▦", desc: "Dark Ink, Boxxman, New Millenium" },
  { id: "cash", label: "Sécurité Caisse & Traçabilité", short: "Caisse", iconSymbol: "◈", badge: "Simu", desc: "Clôtures, écarts & fonds de caisse" },
  { id: "returns", label: "Retours & SAV Hygiène", short: "SAV", iconSymbol: "↺", desc: "Gestion des retours & mise au rebut" },
  { id: "catalog", label: "Catalogue & Studio IA", short: "Studio", iconSymbol: "✧", desc: "Descriptions multilingues & argot gay" },
  { id: "transfers", label: "Transferts & Flux Internes", short: "Transferts", iconSymbol: "⇄", desc: "Mouvements entre sites sans redondance" },
  { id: "accounting", label: "Comptabilité, Facturation & Paie", short: "Compta", iconSymbol: "€", desc: "Factures PDF, TVA & fiches de paie" },
  { id: "hr", label: "Gestion des salariés", short: "Salariés", iconSymbol: "⏱", desc: "Pointage PIN, plannings & équipes" },
];

// Raccourcis prioritaires pour la navbar inférieure mobile
const bottomShortcuts: ERPTab[] = [
  "dashboard",
  "orders",
  "stocks",
  "cash",
  "hr",
];

export default function ERPSidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: ERPSidebarProps) {
  const { currentRole, setCurrentRole, setAppMode } = useApp();

  const handleSelect = (tab: ERPTab) => {
    onTabChange(tab);
    onClose();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {erpNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer border ${
                  isActive
                    ? "bg-[#1E2536] text-white border-[#D4915E]/60 shadow-md font-bold"
                    : "text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#161B26] border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className={`font-mono text-base leading-none shrink-0 transition-colors ${
                      isActive ? "text-[#D4915E]" : "text-[#6B7280] group-hover:text-[#D4915E]"
                    }`}
                  >
                    {item.iconSymbol}
                  </span>
                  <div className="truncate">
                    <span className="block truncate">{item.label}</span>
                    {item.desc && (
                      <span className="block text-[10px] text-[#6B7280] font-mono truncate">
                        {item.desc}
                      </span>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4915E]/15 text-[#D4915E] border border-[#D4915E]/30 shrink-0 ml-1.5 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & Operator info */}
      <div className="p-4 border-t border-[#1F242D] bg-[#0E1117] space-y-3 shrink-0">
        <div>
          <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-mono font-bold">
            Rôle actif (Simulateur droits)
          </label>
          <select
            value={currentRole}
            onChange={(e) =>
              setCurrentRole(
                e.target.value as "Gérant" | "Responsable" | "Vendeur" | "Entrepôt",
              )
            }
            className="w-full bg-[#161C26] border border-[#2B3548] text-xs text-white rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#D4915E] font-mono cursor-pointer shadow-xs"
          >
            <option value="Gérant">Gérant (Accès complet)</option>
            <option value="Responsable">Responsable Boutique</option>
            <option value="Vendeur">Vendeur (Prix masqués)</option>
            <option value="Entrepôt">Opérateur Entrepôt</option>
          </select>
        </div>
        {currentRole === "Vendeur" && (
          <p className="text-[10px] text-amber-400 font-mono">
            Mode Vendeur : prix d&apos;achat masqués.
          </p>
        )}

        {/* Bouton direct vers Boutique Web & Cruising */}
        <button
          type="button"
          onClick={() => setAppMode("boutique")}
          className="w-full bg-[#E5BAA3] hover:bg-[#EDC9B5] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl py-2.5 px-3.5 flex items-center justify-between font-mono transition-all shadow-md cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 shrink-0 text-black"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Boutique en ligne</span>
          </div>
          <span className="font-black text-sm">&rarr;</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Menu Burger Coulissant / Drawer (Mobile & Desktop quand ouvert) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="w-80 max-w-[85vw] bg-[#12151B] border-r border-[#1F242D] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 select-none">
            {/* Header du menu burger */}
            <div className="p-4 border-b border-[#1F242D] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-lg text-[#5B7A9D] font-bold">☰</span>
                <div>
                  <span className="font-mono text-xs font-bold text-white tracking-wider block">
                    ONGLETS
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-mono block">
                    Navigation &bull; {erpNavItems.length} rubriques
                  </span>
                </div>
              </div>

              {/* Bouton Fermer ✕ */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-[#2B3342] bg-[#161A22] hover:bg-[#1E232E] flex items-center justify-center text-white font-mono text-sm cursor-pointer"
                title="Fermer le menu"
              >
                ✕
              </button>
            </div>

            {/* Corps du menu */}
            <div className="flex-1 overflow-y-auto">
              {navContent}
            </div>
          </div>

          {/* Clic en dehors pour fermer */}
          <div className="flex-1 cursor-pointer" onClick={onClose} />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Raccourcis en bas d'écran mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12151B] border-t border-[#1F242D] px-1 py-1.5 flex justify-around items-center select-none shadow-2xl backdrop-blur-md">
        {bottomShortcuts.map((tabId) => {
          const item = erpNavItems.find((n) => n.id === tabId);
          if (!item) return null;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-1.5 rounded transition-all min-w-[50px] cursor-pointer ${
                isActive
                  ? "text-[#5B7A9D] font-bold scale-105"
                  : "text-[#6B7280] hover:text-[#E2E4E9]"
              }`}
            >
              <span className="text-sm font-mono leading-none">{item.iconSymbol}</span>
              <span className="text-[10px] tracking-tight mt-1">{item.short}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#5B7A9D] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
