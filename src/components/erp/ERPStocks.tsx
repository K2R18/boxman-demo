"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

type SiteTab = "global" | "dark_ink" | "boxxman" | "new_millenium";

export interface LocationDetail {
  zone: "Rayon" | "Réserve 1" | "Réserve 2" | "Rangement" | "Stockage Entrepôt" | "Préparation";
  level: "RDC" | "R-1" | "R-2" | "R+1";
  code: string;
  colorName: string;
  colorHex: string;
  qty: number;
}

export default function ERPStocks() {
  const { stocks, updateStock, setExactStock, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState<SiteTab>("global");
  const [searchQuery, setSearchQuery] = useState("");
  const [labelModalProduct, setLabelModalProduct] = useState<string | null>(null);

  // Popover d'emplacement discret & moderne
  const [locationModalProduct, setLocationModalProduct] = useState<{
    productId: string;
    site: "dark_ink" | "boxxman" | "new_millenium";
  } | null>(null);

  // Édition rapide de stock
  const [editingItem, setEditingItem] = useState<{
    productId: string;
    siteKey: string;
    currentVal: number;
  } | null>(null);
  const [editVal, setEditVal] = useState<number>(0);

  // Onglets principaux du haut
  const tabs: { key: SiteTab; label: string }[] = [
    { key: "global", label: "Vue globale" },
    { key: "dark_ink", label: "Dark Ink" },
    { key: "boxxman", label: "Boxxman" },
    { key: "new_millenium", label: "New Millenium" },
  ];

  // Générateur cohérent de SKU Fournisseur
  const getSupplierSku = (productId: string, sku: string): string => {
    const cleanNum = sku.replace(/[^0-9]/g, "").slice(-3) || "001";
    if (sku.includes("HAR") || sku.includes("CUIR")) return `FOU-MYS-${cleanNum}`;
    if (sku.includes("LAT") || sku.includes("RUB")) return `FOU-BLK-${cleanNum}`;
    if (sku.includes("BON")) return `FOU-RST-${cleanNum}`;
    if (sku.includes("TOY")) return `FOU-PLZ-${cleanNum}`;
    return `FOU-LAB-${cleanNum}`;
  };

  // Emplacements détaillés par site avec Zone, Niveau, Code alphanumérique et Code couleur
  const getLocationsForSite = (
    productId: string,
    category: string,
    site: "dark_ink" | "boxxman" | "new_millenium",
    itemSites: {
      entrepot?: number;
      boutique1Rayon?: number;
      boutique1Reserve?: number;
      boutique2Rayon?: number;
      boutique2Reserve?: number;
      web?: number;
    },
  ): LocationDetail[] => {
    const idNum = parseInt(productId.replace(/[^0-9]/g, "") || "1", 10);
    const rackNum = ((idNum % 8) + 1).toString().padStart(2, "0");
    const shelfNum = (idNum % 4) + 1;

    if (site === "dark_ink") {
      const q = itemSites.entrepot ?? 0;
      return [
        {
          zone: "Stockage Entrepôt",
          level: idNum % 3 === 0 ? "R+1" : "RDC",
          code: `ALL-${String.fromCharCode(65 + (idNum % 4))}${rackNum}-E${shelfNum}`,
          colorName: "Bleu Logistique",
          colorHex: "#2563EB",
          qty: q,
        },
      ];
    }

    if (site === "boxxman") {
      const qRayon = itemSites.boutique1Rayon ?? 0;
      const qReserve = itemSites.boutique1Reserve ?? 0;
      const res: LocationDetail[] = [];

      let rayonCode = `RAY-A${rackNum}-E${shelfNum}`;
      let colorHex = "#EF4444";
      let colorName = "Rouge Cuir";

      if (category.includes("Latex")) {
        rayonCode = `RAY-B${rackNum}-E${shelfNum}`;
        colorHex = "#8B5CF6";
        colorName = "Violet Latex";
      } else if (category.includes("Sex-Toys") || category.includes("Plaisir")) {
        rayonCode = `RAY-D${rackNum}-E${shelfNum}`;
        colorHex = "#06B6D4";
        colorName = "Cyan Plaisir";
      } else if (category.includes("Lubrifiant") || category.includes("Soins")) {
        rayonCode = `RAY-E${rackNum}-E${shelfNum}`;
        colorHex = "#10B981";
        colorName = "Vert Soins";
      }

      res.push({
        zone: "Rayon",
        level: "RDC",
        code: rayonCode,
        colorName,
        colorHex,
        qty: qRayon,
      });

      if (idNum % 2 === 0) {
        res.push({
          zone: "Réserve 1",
          level: "R-1",
          code: `RES1-RACK-${rackNum}`,
          colorName: "Ambre Réserve",
          colorHex: "#F59E0B",
          qty: qReserve,
        });
      } else {
        res.push({
          zone: "Réserve 2",
          level: "R-2",
          code: `RES2-CAVE-${rackNum}`,
          colorName: "Ardoise Sécurisée",
          colorHex: "#64748B",
          qty: qReserve,
        });
      }

      return res;
    }

    // New Millenium (Bastille)
    const qRayon = itemSites.boutique2Rayon ?? 0;
    const qReserve = itemSites.boutique2Reserve ?? 0;
    return [
      {
        zone: "Rayon",
        level: "RDC",
        code: `BAST-RAY-${rackNum}`,
        colorName: "Cobalt Bastille",
        colorHex: "#3B82F6",
        qty: qRayon,
      },
      {
        zone: idNum % 3 === 0 ? "Rangement" : "Réserve 1",
        level: idNum % 3 === 0 ? "RDC" : "R-1",
        code: idNum % 3 === 0 ? `TIR-CAISSE-${shelfNum}` : `RES1-VEST-${rackNum}`,
        colorName: idNum % 3 === 0 ? "Émeraude Tiroir" : "Orange Vestiaire",
        colorHex: idNum % 3 === 0 ? "#10B981" : "#EA580C",
        qty: qReserve,
      },
    ];
  };

  const filteredProducts = Object.values(stocks).filter((p) => {
    const q = searchQuery.toLowerCase();
    const supSku = getSupplierSku(p.productId, p.sku).toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      supSku.includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const activeLabelProduct = labelModalProduct ? stocks[labelModalProduct] : null;

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* En-tête titre + recherche compacte */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F242D] gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#E2E4E9]">
            Stock &amp; Réserves Multi-Sites
          </h1>
          <p className="text-[11px] text-[#6B7280]">
            Dark Ink &bull; Boxxman &bull; New Millenium &bull; Traçabilité des emplacements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Rechercher SKU, fournisseur, désignation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#12151B] border border-[#222834] rounded-lg px-2.5 py-1.5 text-xs text-[#E2E4E9] placeholder-[#555E6D] w-64 focus:outline-hidden focus:border-[#5B7A9D] font-mono"
          />
        </div>
      </div>

      {/* Onglets épurés : Vue globale / Dark Ink / Boxxman / New Millenium */}
      <div className="flex items-center gap-1.5 border-b border-[#1F242D] pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === t.key
                ? "bg-[#1E2430] text-white border border-[#5B7A9D] shadow-xs"
                : "text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#161B23] border border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bannière Mode Vendeur */}
      {currentRole === "Vendeur" && (
        <div className="bg-amber-950/20 border border-amber-900/40 px-3 py-1.5 rounded text-xs text-amber-300 font-mono flex items-center justify-between">
          <span>
            Mode Vendeur actif : les prix d&apos;achat fournisseurs sont confidentiels et masqués.
          </span>
          <span className="uppercase text-[10px] tracking-widest bg-amber-900/40 px-2 py-0.5 rounded">
            Restreint
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TABLEAU VUE GLOBALE (10 COLONNES COMPACTES, ZÉRO SWIPE, DÉSIGNATION SUR 2 LIGNES) */}
      {/* SKU Fournisseur | SKU Interne | Désignation | DARK INK | BOXXMAN | NEW MILLENIUM | TOTAL | PRIX VENTE | PRIX ACHAT | ETIQUETTE */}
      {/* ========================================================================= */}
      {activeTab === "global" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-xl overflow-hidden shadow-sm w-full">
          <table className="w-full table-fixed text-left text-xs">
            {/* Découpage proportionnel exact pour tenir à 100% sans aucun scroll horizontal */}
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[10%]" />
              <col className="w-[30%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[8%]" />
              <col className="w-[6%]" />
              <col className="w-[7%]" />
              {currentRole !== "Vendeur" ? (
                <>
                  <col className="w-[7%]" />
                  <col className="w-[7%]" />
                </>
              ) : (
                <col className="w-[14%]" />
              )}
            </colgroup>
            <thead>
              <tr className="border-b border-[#1F242D] text-[10px] uppercase tracking-wider text-[#6B7280] bg-[#0E1015]">
                <th className="py-2.5 px-2 font-mono truncate" title="SKU Fournisseur">SKU Fourn.</th>
                <th className="py-2.5 px-2 font-mono truncate" title="SKU Interne">SKU Interne</th>
                <th className="py-2.5 px-2">Désignation</th>
                <th className="py-2.5 px-1.5 text-right font-mono text-[#8E95A5] truncate">Dark Ink</th>
                <th className="py-2.5 px-1.5 text-right font-mono text-[#8E95A5] truncate">Boxxman</th>
                <th className="py-2.5 px-1.5 text-right font-mono text-[#8E95A5] truncate">New Mill.</th>
                <th className="py-2.5 px-1.5 text-right font-mono font-bold text-white bg-[#151922] truncate">Total</th>
                <th className="py-2.5 px-1.5 text-right whitespace-nowrap truncate">P. Vente</th>
                {currentRole !== "Vendeur" && (
                  <th className="py-2.5 px-1.5 text-right whitespace-nowrap text-amber-400 font-mono truncate">
                    P. Achat
                  </th>
                )}
                <th className="py-2.5 px-1.5 text-center whitespace-nowrap">Étiquette</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1F29]">
              {filteredProducts.map((p) => {
                const supplierSku = getSupplierSku(p.productId, p.sku);
                const darkInkStock = p.sites.entrepot ?? 0;
                const boxxmanStock = (p.sites.boutique1Rayon ?? 0) + (p.sites.boutique1Reserve ?? 0);
                const newMilleniumStock = (p.sites.boutique2Rayon ?? 0) + (p.sites.boutique2Reserve ?? 0);
                const totalStock = Object.values(p.sites).reduce((acc, val) => acc + val, 0);

                return (
                  <tr key={p.productId} className="hover:bg-[#161B23]/60 transition-colors">
                    {/* 1. SKU Fournisseur */}
                    <td className="py-2 px-2 font-mono text-[#8E95A5] text-[11px] truncate" title={supplierSku}>
                      {supplierSku}
                    </td>

                    {/* 2. SKU Interne */}
                    <td className="py-2 px-2 font-mono text-sky-400 font-semibold text-[11px] truncate" title={p.sku}>
                      {p.sku}
                    </td>

                    {/* 3. Désignation (sur 2 lignes pour rapprocher toutes les colonnes) */}
                    <td className="py-2 px-2 text-[#E2E4E9]">
                      <div
                        className="font-semibold text-white text-xs line-clamp-2 leading-tight"
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      <span className="text-[10px] text-[#6B7280] block truncate">
                        {p.category}
                      </span>
                    </td>

                    {/* 4. DARK INK */}
                    <td className="py-2 px-1.5 text-right font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem({
                            productId: p.productId,
                            siteKey: "entrepot",
                            currentVal: darkInkStock,
                          });
                          setEditVal(darkInkStock);
                        }}
                        className="hover:text-sky-400 hover:underline cursor-pointer font-medium"
                        title="Modifier le stock Dark Ink"
                      >
                        {darkInkStock}
                      </button>
                    </td>

                    {/* 5. BOXXMAN */}
                    <td className="py-2 px-1.5 text-right font-mono text-[11px]">
                      <span
                        className={`font-medium ${
                          boxxmanStock <= 5 ? "text-amber-400 font-bold" : "text-[#E2E4E9]"
                        }`}
                      >
                        {boxxmanStock}
                      </span>
                    </td>

                    {/* 6. NEW MILLENIUM */}
                    <td className="py-2 px-1.5 text-right font-mono text-[11px]">
                      <span
                        className={`font-medium ${
                          newMilleniumStock <= 5 ? "text-amber-400 font-bold" : "text-[#E2E4E9]"
                        }`}
                      >
                        {newMilleniumStock}
                      </span>
                    </td>

                    {/* 7. TOTAL */}
                    <td className="py-2 px-1.5 text-right font-mono font-bold text-white bg-[#151922]/50 text-[11px]">
                      {totalStock}
                    </td>

                    {/* 8. PRIX VENTE */}
                    <td className="py-2 px-1.5 text-right font-mono whitespace-nowrap text-[#E2E4E9] font-medium text-[11px]">
                      {p.price.toFixed(2)}&nbsp;€
                    </td>

                    {/* 9. PRIX ACHAT */}
                    {currentRole !== "Vendeur" && (
                      <td className="py-2 px-1.5 text-right font-mono whitespace-nowrap text-amber-400 font-medium text-[11px]">
                        {p.pricePurchase.toFixed(2)}&nbsp;€
                      </td>
                    )}

                    {/* 10. ETIQUETTE */}
                    <td className="py-2 px-1.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setLabelModalProduct(p.productId)}
                        className="px-2 py-0.5 text-[10px] rounded bg-[#181D26] hover:bg-[#222936] text-[#5B7A9D] hover:text-white border border-[#2B3446] transition-colors cursor-pointer"
                        title="Imprimer l'étiquette thermique"
                      >
                        Étiquette
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TABLEAUX DÉTAILLÉS PAR SITE (ZÉRO SWIPE, DÉSIGNATION SUR 2 LIGNES) */}
      {/* ========================================================================= */}
      {activeTab !== "global" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-xl overflow-hidden shadow-sm w-full">
          <table className="w-full table-fixed text-left text-xs">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[10%]" />
              <col className="w-[28%]" />
              <col className="w-[17%]" />
              {activeTab === "dark_ink" ? (
                <col className="w-[10%]" />
              ) : (
                <>
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                </>
              )}
              <col className="w-[7%]" />
              {currentRole !== "Vendeur" ? (
                <>
                  <col className="w-[7%]" />
                  <col className="w-[8%]" />
                </>
              ) : (
                <col className="w-[15%]" />
              )}
            </colgroup>
            <thead>
              <tr className="border-b border-[#1F242D] text-[10px] uppercase tracking-wider text-[#6B7280] bg-[#0E1015]">
                <th className="py-2.5 px-2 font-mono truncate">SKU Fourn.</th>
                <th className="py-2.5 px-2 font-mono truncate">SKU Interne</th>
                <th className="py-2.5 px-2">Désignation</th>
                <th className="py-2.5 px-2 truncate">Emplacement Local</th>
                {activeTab === "dark_ink" ? (
                  <th className="py-2.5 px-1.5 text-right font-mono truncate">Stock Dark Ink</th>
                ) : (
                  <>
                    <th className="py-2.5 px-1 text-right font-mono truncate">Rayon</th>
                    <th className="py-2.5 px-1 text-right font-mono truncate">Réserve</th>
                    <th className="py-2.5 px-1.5 text-right font-mono font-bold text-white bg-[#151922] truncate">Total</th>
                  </>
                )}
                <th className="py-2.5 px-1.5 text-right whitespace-nowrap truncate">P. Vente</th>
                {currentRole !== "Vendeur" && (
                  <th className="py-2.5 px-1.5 text-right whitespace-nowrap text-amber-400 font-mono truncate">
                    P. Achat
                  </th>
                )}
                <th className="py-2.5 px-1.5 text-center whitespace-nowrap">Étiquette</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1F29]">
              {filteredProducts.map((p) => {
                const supplierSku = getSupplierSku(p.productId, p.sku);
                const locs = getLocationsForSite(p.productId, p.category, activeTab, p.sites);
                const primaryLoc = locs[0];

                return (
                  <tr key={p.productId} className="hover:bg-[#161B23]/60 transition-colors">
                    {/* SKU Fournisseur */}
                    <td className="py-2 px-2 font-mono text-[#8E95A5] text-[11px] truncate" title={supplierSku}>
                      {supplierSku}
                    </td>

                    {/* SKU Interne */}
                    <td className="py-2 px-2 font-mono text-sky-400 font-semibold text-[11px] truncate" title={p.sku}>
                      {p.sku}
                    </td>

                    {/* Désignation sur 2 lignes */}
                    <td className="py-2 px-2 text-[#E2E4E9]">
                      <div
                        className="font-semibold text-white text-xs line-clamp-2 leading-tight"
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      <span className="text-[10px] text-[#6B7280] block truncate">
                        {p.category}
                      </span>
                    </td>

                    {/* EMPLACEMENT EXACT : Capsule compacte cliquable */}
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        onClick={() => setLocationModalProduct({ productId: p.productId, site: activeTab })}
                        className="group text-left cursor-pointer inline-flex items-center space-x-1.5 bg-[#171C25] hover:bg-[#1E2532] border border-[#273142] hover:border-[#5B7A9D] rounded-md px-2 py-1 transition-all max-w-full"
                        title="Afficher la fiche topographique complète"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: primaryLoc.colorHex }}
                        />
                        <div className="min-w-0 truncate">
                          <span className="font-mono text-[10px] font-bold text-white block truncate">
                            {primaryLoc.code} ({primaryLoc.level})
                          </span>
                          <span className="text-[9px] text-[#8E95A5] block truncate">
                            {primaryLoc.zone}
                            {locs.length > 1 && ` +${locs.length - 1}`}
                          </span>
                        </div>
                      </button>
                    </td>

                    {/* Quantités selon le site */}
                    {activeTab === "dark_ink" ? (
                      <td className="py-2 px-1.5 text-right font-mono font-bold text-white text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem({
                              productId: p.productId,
                              siteKey: "entrepot",
                              currentVal: p.sites.entrepot ?? 0,
                            });
                            setEditVal(p.sites.entrepot ?? 0);
                          }}
                          className="hover:text-sky-400 hover:underline cursor-pointer"
                        >
                          {p.sites.entrepot ?? 0}
                        </button>
                      </td>
                    ) : activeTab === "boxxman" ? (
                      <>
                        <td className="py-2 px-1 text-right font-mono text-[11px] text-[#E2E4E9]">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({
                                productId: p.productId,
                                siteKey: "boutique1Rayon",
                                currentVal: p.sites.boutique1Rayon ?? 0,
                              });
                              setEditVal(p.sites.boutique1Rayon ?? 0);
                            }}
                            className={`hover:underline cursor-pointer ${
                              (p.sites.boutique1Rayon ?? 0) <= 3 ? "text-amber-400 font-bold" : ""
                            }`}
                          >
                            {p.sites.boutique1Rayon ?? 0}
                          </button>
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-[11px] text-[#E2E4E9]">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({
                                productId: p.productId,
                                siteKey: "boutique1Reserve",
                                currentVal: p.sites.boutique1Reserve ?? 0,
                              });
                              setEditVal(p.sites.boutique1Reserve ?? 0);
                            }}
                            className="hover:underline cursor-pointer"
                          >
                            {p.sites.boutique1Reserve ?? 0}
                          </button>
                        </td>
                        <td className="py-2 px-1.5 text-right font-mono font-bold text-white bg-[#151922]/50 text-[11px]">
                          {(p.sites.boutique1Rayon ?? 0) + (p.sites.boutique1Reserve ?? 0)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-1 text-right font-mono text-[11px] text-[#E2E4E9]">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({
                                productId: p.productId,
                                siteKey: "boutique2Rayon",
                                currentVal: p.sites.boutique2Rayon ?? 0,
                              });
                              setEditVal(p.sites.boutique2Rayon ?? 0);
                            }}
                            className={`hover:underline cursor-pointer ${
                              (p.sites.boutique2Rayon ?? 0) <= 3 ? "text-amber-400 font-bold" : ""
                            }`}
                          >
                            {p.sites.boutique2Rayon ?? 0}
                          </button>
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-[11px] text-[#E2E4E9]">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({
                                productId: p.productId,
                                siteKey: "boutique2Reserve",
                                currentVal: p.sites.boutique2Reserve ?? 0,
                              });
                              setEditVal(p.sites.boutique2Reserve ?? 0);
                            }}
                            className="hover:underline cursor-pointer"
                          >
                            {p.sites.boutique2Reserve ?? 0}
                          </button>
                        </td>
                        <td className="py-2 px-1.5 text-right font-mono font-bold text-white bg-[#151922]/50 text-[11px]">
                          {(p.sites.boutique2Rayon ?? 0) + (p.sites.boutique2Reserve ?? 0)}
                        </td>
                      </>
                    )}

                    {/* PRIX VENTE */}
                    <td className="py-2 px-1.5 text-right font-mono whitespace-nowrap text-[#E2E4E9] font-medium text-[11px]">
                      {p.price.toFixed(2)}&nbsp;€
                    </td>

                    {/* PRIX ACHAT */}
                    {currentRole !== "Vendeur" && (
                      <td className="py-2 px-1.5 text-right font-mono whitespace-nowrap text-amber-400 font-medium text-[11px]">
                        {p.pricePurchase.toFixed(2)}&nbsp;€
                      </td>
                    )}

                    {/* ETIQUETTE */}
                    <td className="py-2 px-1.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setLabelModalProduct(p.productId)}
                        className="px-2 py-0.5 text-[10px] rounded bg-[#181D26] hover:bg-[#222936] text-[#5B7A9D] hover:text-white border border-[#2B3446] transition-colors cursor-pointer"
                      >
                        Étiquette
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE PREMIUM & MODERNE : DÉTAIL DES EMPLACEMENTS DANS LE LOCAL */}
      {/* ========================================================================= */}
      {locationModalProduct && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#6B7280] block">
                  Topographie &bull; {locationModalProduct.site === "dark_ink" ? "Dark Ink" : locationModalProduct.site === "boxxman" ? "Boxxman" : "New Millenium"}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {stocks[locationModalProduct.productId]?.name}
                </h3>
                <span className="text-xs font-mono text-sky-400">
                  {stocks[locationModalProduct.productId]?.sku}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLocationModalProduct(null)}
                className="w-8 h-8 rounded-lg border border-[#2B3342] bg-[#161A22] hover:bg-[#1E232E] flex items-center justify-center text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8E95A5]">
              Organisation physique dans le local commercial (rayonnages, niveaux, réserves &amp; tiroirs de caisse) :
            </p>

            <div className="space-y-2.5">
              {getLocationsForSite(
                locationModalProduct.productId,
                stocks[locationModalProduct.productId]?.category || "",
                locationModalProduct.site,
                stocks[locationModalProduct.productId]?.sites || {},
              ).map((loc, idx) => (
                <div
                  key={idx}
                  className="bg-[#171C25] border border-[#242C3B] rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 shadow-sm"
                      style={{ backgroundColor: loc.colorHex }}
                      title={`Code couleur : ${loc.colorName}`}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-bold text-white">{loc.code}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#202735] text-amber-300 border border-amber-900/40">
                          Niveau {loc.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8E95A5] mt-0.5">
                        Zone : <strong className="text-[#E2E4E9]">{loc.zone}</strong> &bull; Repère : {loc.colorName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#6B7280] block uppercase">
                      Stock présent
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {loc.qty} unités
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1F242D] flex items-center justify-between text-xs font-mono">
              <span className="text-[#6B7280] text-[11px]">
                Plan de masse &bull; Rayonnages certifiés
              </span>
              <button
                type="button"
                onClick={() => setLocationModalProduct(null)}
                className="bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white px-4 py-1.5 rounded text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popover rapide d'ajustement de stock */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-lg p-5 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-[#E2E4E9]">
              Ajustement Rapide de Stock
            </h3>
            <p className="text-xs text-[#8E95A5]">
              Produit : {stocks[editingItem.productId]?.name}
              <br />
              Site : <span className="font-mono text-white">{editingItem.siteKey}</span>
            </p>

            <div className="flex items-center justify-center space-x-3 py-2">
              <button
                type="button"
                onClick={() => setEditVal((v) => Math.max(0, v - 1))}
                className="w-9 h-9 rounded bg-[#1C212B] text-white text-lg font-bold hover:bg-[#252C39] cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={editVal}
                onChange={(e) => setEditVal(parseInt(e.target.value) || 0)}
                className="w-24 text-center font-mono text-lg font-bold bg-[#181D26] border border-[#2D3646] rounded py-1 text-white"
              />
              <button
                type="button"
                onClick={() => setEditVal((v) => v + 1)}
                className="w-9 h-9 rounded bg-[#1C212B] text-white text-lg font-bold hover:bg-[#252C39] cursor-pointer"
              >
                +
              </button>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-[#1C212B]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 text-xs text-[#8E95A5] hover:text-white cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setExactStock(editingItem.productId, editingItem.siteKey, editVal);
                  setEditingItem(null);
                }}
                className="px-4 py-1.5 bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold rounded cursor-pointer"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Label Modal (Code-barres + QR Code Emplacement) */}
      {activeLabelProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <h3 className="text-sm font-bold text-[#E2E4E9]">
                Aperçu de l&apos;Étiquette Rayon / Réserve
              </h3>
              <button
                type="button"
                onClick={() => setLabelModalProduct(null)}
                className="text-[#6B7280] hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Label Card Container */}
            <div className="bg-white text-black p-5 rounded border border-[#E5E2DC] space-y-3 font-sans">
              <div className="border-b border-black pb-2 flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-600 block">
                    BOXMAN LOGISTICS
                  </span>
                  <h4 className="font-bold text-sm text-black leading-tight mt-0.5">
                    {activeLabelProduct.name}
                  </h4>
                </div>
                <span className="font-mono text-sm font-extrabold text-black whitespace-nowrap">
                  {activeLabelProduct.price.toFixed(2)}&nbsp;€
                </span>
              </div>

              {/* Barcode & Location */}
              <div className="grid grid-cols-3 gap-3 items-center pt-1">
                <div className="col-span-2 space-y-1">
                  <div className="h-14 w-full bg-black flex items-stretch justify-between p-1">
                    {Array.from({ length: 38 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full ${
                          i % 3 === 0 || i % 7 === 0 || i === 0 || i === 37
                            ? "w-1 bg-black"
                            : "w-0.5 bg-white"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-center font-mono text-[11px] tracking-widest font-semibold text-neutral-800">
                    {activeLabelProduct.barcode}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 border border-dashed border-neutral-400 rounded">
                  <div className="w-12 h-12 bg-neutral-900 rounded-xs flex items-center justify-center text-white font-mono text-[10px] font-bold">
                    QR LOC
                  </div>
                  <span className="font-mono text-[9px] text-neutral-600 mt-1 uppercase">
                    Scan Rack
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/20 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">
                    SKU Magasin
                  </span>
                  <span className="font-mono font-bold text-black">
                    {activeLabelProduct.sku}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">
                    SKU Fournisseur
                  </span>
                  <span className="font-mono font-extrabold text-xs text-black bg-neutral-200 px-2 py-0.5 rounded">
                    {getSupplierSku(activeLabelProduct.productId, activeLabelProduct.sku)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#6B7280] font-mono">
                Format: 70 x 36 mm &bull; Thermique
              </span>
              <button
                type="button"
                onClick={() => {
                  alert(
                    `Impression de l'étiquette [${activeLabelProduct.sku}] envoyée à l'imprimante Zebra thermique du site.`,
                  );
                  setLabelModalProduct(null);
                }}
                className="bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Imprimer l&apos;étiquette
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
