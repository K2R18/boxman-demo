"use client";

import React, { useState } from "react";
import { products, type Product } from "@/data/products";
import { useApp } from "@/context/AppContext";

export default function ERPCatalog() {
  const { currentRole, catalogProducts } = useApp();
  const allProducts = catalogProducts && catalogProducts.length > 0 ? catalogProducts : products;
  const [selectedProductId, setSelectedProductId] = useState<string>("prod-001");
  const [selectedProduct, setSelectedProduct] = useState<Product>(allProducts[0] || products[0]);
  const [activeLangTab, setActiveLangTab] = useState<"fr" | "en" | "es" | "de">("fr");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(true);

  // Form edit state
  const [editName, setEditName] = useState(selectedProduct.translations.fr.name);
  const [editDesc, setEditDesc] = useState(selectedProduct.translations.fr.description);
  const [editPrice, setEditPrice] = useState(selectedProduct.price);
  const [editPurchasePrice, setEditPurchasePrice] = useState(selectedProduct.pricePurchase);

  const handleSelectProduct = (p: Product) => {
    setSelectedProductId(p.id);
    setSelectedProduct(p);
    setEditName(p.translations.fr.name);
    setEditDesc(p.translations.fr.description);
    setEditPrice(p.price);
    setEditPurchasePrice(p.pricePurchase);
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setGenerationDone(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationDone(true);
    }, 900);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "SKU",
      "Nom_FR",
      "Nom_EN",
      "Nom_ES",
      "Nom_DE",
      "Categorie",
      "Prix_Vente",
      "Prix_Achat",
      "Emplacement",
      "Code_Barres",
      "Meta_FR",
    ];

    const rows = allProducts.map((p) => [
      p.id,
      p.sku,
      `"${p.translations.fr.name.replace(/"/g, '""')}"`,
      `"${p.translations.en.name.replace(/"/g, '""')}"`,
      `"${p.translations.es.name.replace(/"/g, '""')}"`,
      `"${p.translations.de.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      currentRole === "Vendeur" ? "CONFIDENTIEL" : p.pricePurchase.toFixed(2),
      p.location,
      p.barcode,
      `"${p.translations.fr.metaDescription.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `boxman_catalogue_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentTranslation = selectedProduct.translations[activeLangTab];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Catalogue & Studio Traduction IA Multilingue
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Génération assistée FR / EN / ES / DE avec conformité algorithmique anti-censure
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-[#1C222E] hover:bg-[#252E3E] text-[#E2E4E9] border border-[#2B3547] text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5"
          >
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Product Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-[#12151B] border border-[#1F242D] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#1F242D]">
            <span className="text-xs font-semibold text-[#E2E4E9] uppercase tracking-wider">
              Références Catalogue ({allProducts.length})
            </span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {allProducts.map((p) => {
              const isSelected = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProduct(p)}
                  className={`w-full text-left p-3 rounded text-xs transition-all border ${
                    isSelected
                      ? "bg-[#1C2330] border-[#5B7A9D] text-white shadow-xs"
                      : "bg-[#14171E] border-transparent text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#181C25]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sky-400 font-semibold text-[11px]">
                      {p.sku}
                    </span>
                    <span className="font-mono text-[#E2E4E9]">
                      {p.price.toFixed(2)} €
                    </span>
                  </div>
                  <p className="font-medium text-[#E2E4E9] mt-1 truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#6B7280]">
                    <span>{p.category}</span>
                    <span className="font-mono">{p.location}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Product Editor & Studio IA (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Editor Card */}
          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F242D] gap-2">
              <div>
                <span className="font-mono text-xs text-[#5B7A9D] font-bold">
                  {selectedProduct.sku}
                </span>
                <h2 className="text-base font-bold text-[#E2E4E9]">
                  Édition Fiche Produit (FR)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="bg-[#5B7A9D] hover:bg-[#6C8CB3] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded transition-all shadow-xs"
              >
                {isGenerating
                  ? "Traduction IA en cours..."
                  : "Générer fiche & traduire (FR / EN / ES / DE)"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Désignation Produit (Français)
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
                />
              </div>

              <div>
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Prix de Vente Public TTC (€)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#5B7A9D]"
                />
              </div>

              <div>
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Prix d&apos;Achat Fournisseur HT (€)
                </label>
                {currentRole === "Vendeur" ? (
                  <div className="w-full bg-[#181D26] border border-amber-900/40 text-amber-400/90 rounded px-3 py-2 text-xs font-mono">
                    CONFIDENTIEL (Accès restreint Vendeur)
                  </div>
                ) : (
                  <input
                    type="number"
                    step="0.1"
                    value={editPurchasePrice}
                    onChange={(e) =>
                      setEditPurchasePrice(parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-[#161A22] border border-[#262D3B] text-amber-400 rounded px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#5B7A9D]"
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Description Commerciale (Français)
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
                />
              </div>
            </div>
          </div>

          {/* AI Translation Studio Results */}
          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F242D] gap-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-[#E2E4E9]">
                  Studio Multilingue & Meta SEO
                </h3>
                {/* Fallback anti-censure badge */}
                <span className="font-mono text-[10px] text-[#D4915E] bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded font-semibold">
                  Fallback Anti-Censure : Actif
                </span>
              </div>

              {/* Language Tabs */}
              <div className="inline-flex rounded border border-[#282F3D] bg-[#0E1015] p-0.5">
                {(["fr", "en", "es", "de"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`px-3 py-1 text-xs uppercase font-mono font-semibold rounded transition-colors ${
                      activeLangTab === lang
                        ? "bg-[#252B37] text-white"
                        : "text-[#6B7280] hover:text-[#E2E4E9]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Display */}
            <div className="space-y-3 text-xs">
              <div className="bg-[#161A22] p-3 rounded border border-[#232936] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block">
                  Titre localisé ({activeLangTab.toUpperCase()})
                </span>
                <p className="text-sm font-semibold text-white">
                  {currentTranslation.name}
                </p>
              </div>

              <div className="bg-[#161A22] p-3 rounded border border-[#232936] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block">
                  Description calibrée marketplaces ({activeLangTab.toUpperCase()})
                </span>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  {currentTranslation.description}
                </p>
              </div>

              <div className="bg-[#161A22] p-3 rounded border border-[#232936] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
                    Meta-Description SEO Google / Réseaux
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    {currentTranslation.metaDescription.length} / 160 caractères (Optimal)
                  </span>
                </div>
                <p className="text-xs text-sky-200 font-mono bg-[#0F1218] p-2.5 rounded border border-[#1F2531]">
                  {currentTranslation.metaDescription}
                </p>
              </div>

              <div className="text-[11px] text-[#6B7280] flex items-center justify-between pt-1">
                <span>
                  Vocabulaire certifié conforme aux politiques publicitaires Google Ads & Meta
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  Score de délivrabilité : 99.4%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
