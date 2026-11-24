"use client";

import React, { useState } from "react";
import AgeModal from "./AgeModal";
import BoutiqueNavbar, { type BoutiqueSection } from "./BoutiqueNavbar";
import BoutiqueHome from "./BoutiqueHome";
import BoutiqueStoresUnified from "./BoutiqueStoresUnified";
import BoutiqueCatalog from "./BoutiqueCatalog";
import BoutiqueCruising from "./BoutiqueCruising";
import BoutiqueAccount from "./BoutiqueAccount";
import BoutiqueContact from "./BoutiqueContact";
import BoutiqueCart from "./BoutiqueCart";
import BoutiqueFooter from "./BoutiqueFooter";

export default function BoutiqueApp() {
  const [activeSection, setActiveSection] = useState<BoutiqueSection>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans transition-colors overflow-x-clip w-full max-w-full">
      {/* 18+ Age Verification Modal */}
      <AgeModal />

      {/* Main Sticky Boutique Navbar avec menu Burger vertical & Filtres accordéon */}
      <BoutiqueNavbar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Dynamic Main Content Section */}
      <main className="flex-1 pb-24 lg:pb-8 w-full max-w-full overflow-x-hidden">
        {/* Page unifiée Accueil & Produits (comme sur le site officiel dark-ink) */}
        {(activeSection === "home" || activeSection === "products") && (
          <BoutiqueHome onNavigate={setActiveSection} />
        )}

        {/* Page unifiée "Nos Boutiques" (regroupant Marais et Bastille) */}
        {activeSection === "stores" && (
          <BoutiqueStoresUnified onNavigate={setActiveSection} />
        )}
        {activeSection === "cruising" && <BoutiqueCruising />}
        {activeSection === "contact" && <BoutiqueContact />}
        {activeSection === "account" && <BoutiqueAccount />}
        {activeSection === "cart" && (
          <BoutiqueCart onNavigate={setActiveSection} />
        )}
      </main>

      {/* Complete Footer */}
      <BoutiqueFooter onNavigate={setActiveSection} />
    </div>
  );
}
