"use client";

import React, { useState } from "react";
import ERPSidebar, { type ERPTab, erpNavItems } from "./ERPSidebar";
import ERPDashboard from "./ERPDashboard";
import ERPOrders from "./ERPOrders";
import ERPDeliveries from "./ERPDeliveries";
import ERPReturns from "./ERPReturns";
import ERPCashSecurity from "./ERPCashSecurity";
import ERPStocks from "./ERPStocks";
import ERPCatalog from "./ERPCatalog";
import ERPTransfers from "./ERPTransfers";
import ERPAccounting from "./ERPAccounting";
import ERPHr from "./ERPHr";
import UniversalDrawer from "@/components/navigation/UniversalDrawer";
import { useApp } from "@/context/AppContext";

export default function ERPApp() {
  const { currentRole, setCurrentRole, setAppMode, resetDemo } = useApp();
  const [activeTab, setActiveTab] = useState<ERPTab>("dashboard");
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [universalDrawerOpen, setUniversalDrawerOpen] = useState(false);

  // Nom lisible de la section active pour le titre
  const currentItem = erpNavItems.find((item) => item.id === activeTab);
  const pageTitle = currentItem ? currentItem.label : "Tableau de bord";

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0D10] text-[#E2E4E9] w-full max-w-full overflow-x-clip">
      {/* Menu Burger Coulissant pour les onglets de gauche & Navbar mobile */}
      <ERPSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={burgerOpen}
        onClose={() => setBurgerOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        
        {/* NAVBAR SUPÉRIEURE STICKY (DESIGN INTUITIF, MODERNE & PREMIUM) */}
        <header className="sticky top-0 z-40 bg-[#0E1117]/95 backdrop-blur-md border-b border-[#1E2430] shadow-lg select-none w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
              
              {/* GAUCHE : BOUTON MENU ONGLETS + RÔLE */}
              <div className="flex items-center space-x-3 shrink-0">
                {/* Bouton Menu Onglets */}
                <button
                  type="button"
                  onClick={() => setBurgerOpen(true)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-[#2B3548] bg-[#141822] hover:bg-[#1C2330] hover:border-[#D4915E] text-white transition-all shadow-xs cursor-pointer group"
                  aria-label="Ouvrir le menu des onglets"
                  title="Ouvrir le menu des onglets"
                >
                  <span className="text-lg sm:text-xl font-bold leading-none text-[#D4915E] group-hover:scale-110 transition-transform">
                    ☰
                  </span>
                  <span className="text-xs font-mono font-bold hidden sm:inline text-gray-200">
                    Onglets
                  </span>
                </button>

                {/* Badge Rôle (Desktop & Tablette) */}
                <div className="hidden sm:flex items-center">
                  <span className="font-mono text-[10px] font-bold text-[#D4915E] bg-[#D4915E]/10 border border-[#D4915E]/30 px-2.5 py-1 rounded-full">
                    Rôle : {currentRole}
                  </span>
                </div>
              </div>

              {/* Raccourcis horizontaux rapides sur grand écran (Desktop) */}
              <div className="hidden xl:flex items-center space-x-1 bg-[#131720] border border-[#232B3A] p-1 rounded-xl">
                {erpNavItems.slice(0, 5).map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#D4915E] text-black font-extrabold shadow-xs"
                          : "text-gray-400 hover:text-white hover:bg-[#1C2330]"
                      }`}
                    >
                      {item.iconSymbol} {item.short}
                    </button>
                  );
                })}
              </div>

              {/* DROITE : SYNC + BOUTONS D'ACTION */}
              <div className="flex items-center space-x-2.5 shrink-0">
                {/* Pilule Sync Multi-onglets */}
                <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#131720] border border-[#232B3A] text-[11px] font-mono text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sync Active</span>
                </div>

                {/* Bouton Réinitialiser la démo */}
                <button
                  type="button"
                  onClick={resetDemo}
                  className="hidden md:inline-flex items-center px-3 py-1.5 rounded-xl border border-[#2B3548] bg-[#141822] hover:bg-[#1C2330] hover:border-gray-500 text-[11px] font-mono text-gray-300 hover:text-white transition-colors cursor-pointer shadow-xs"
                  title="Réinitialise le localStorage et les données de test"
                >
                  ↺ Réinitialiser
                </button>

                {/* Basculer vers Boutique Web & Cruising */}
                <button
                  type="button"
                  onClick={() => setAppMode("boutique")}
                  className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#E5BAA3] hover:bg-[#EDC9B5] text-black font-bold sm:font-extrabold text-[11px] sm:text-xs font-mono uppercase tracking-normal sm:tracking-wider shadow-sm transition-all cursor-pointer select-none shrink-0"
                  title="Accéder à la boutique grand public et espace cruising"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-black"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>Boutique en ligne</span>
                  <span className="font-black text-xs sm:text-sm">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Espace de travail principal sans rognage */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {activeTab === "dashboard" && (
            <ERPDashboard
              onNavigateToStocks={() => setActiveTab("stocks")}
              onNavigateToCash={() => setActiveTab("cash")}
            />
          )}
          {(activeTab === "orders" || activeTab === "deliveries") && <ERPOrders />}
          {activeTab === "stocks" && <ERPStocks />}
          {activeTab === "cash" && <ERPCashSecurity />}
          {activeTab === "returns" && <ERPReturns />}
          {activeTab === "catalog" && <ERPCatalog />}
          {activeTab === "transfers" && <ERPTransfers />}
          {activeTab === "accounting" && <ERPAccounting />}
          {activeTab === "hr" && <ERPHr />}
        </main>
      </div>

      {/* MODALE GLOBALE BOUTIQUE / CGV (si besoin) */}
      <UniversalDrawer
        isOpen={universalDrawerOpen}
        onClose={() => setUniversalDrawerOpen(false)}
        erpActiveTab={activeTab}
        onErpTabChange={(tab) => {
          setActiveTab(tab);
          setUniversalDrawerOpen(false);
        }}
      />
    </div>
  );
}
