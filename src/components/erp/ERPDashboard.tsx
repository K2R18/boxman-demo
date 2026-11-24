"use client";

import React, { useMemo } from "react";
import { useApp } from "@/context/AppContext";

interface ERPDashboardProps {
  onNavigateToStocks: () => void;
  onNavigateToCash: () => void;
}

export default function ERPDashboard({
  onNavigateToStocks,
  onNavigateToCash,
}: ERPDashboardProps) {
  const { stocks, cashLog, transfers, staffPresence, currentRole } = useApp();

  // Low stock detector across all products & sites
  const lowStockAlerts = useMemo(() => {
    const list: {
      productId: string;
      productName: string;
      sku: string;
      location: string;
      siteKey: string;
      siteLabel: string;
      qty: number;
    }[] = [];

    const siteLabels: Record<string, string> = {
      boutique1Rayon: "Boxxman — Rayon",
      boutique1Reserve: "Boxxman — Réserve",
      boutique2Rayon: "New Millenium — Rayon",
      boutique2Reserve: "New Millenium — Réserve",
      entrepot: "Dark Ink",
      web: "Stock Web",
    };

    Object.values(stocks).forEach((item) => {
      Object.entries(item.sites).forEach(([sKey, qty]) => {
        if (qty <= 4) {
          list.push({
            productId: item.productId,
            productName: item.name,
            sku: item.sku,
            location: item.location,
            siteKey: sKey,
            siteLabel: siteLabels[sKey] || sKey,
            qty,
          });
        }
      });
    });

    return list.slice(0, 6);
  }, [stocks]);

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Tableau de Bord Opérationnel
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Vue consolidée multi-sites • Flux temps réel synchronisés
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded bg-[#161B23] border border-[#252C39] text-[11px] font-mono text-[#8E95A5]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
            5 sites connectés
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Boxxman */}
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Boxxman
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 rounded">
              +8.4%
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#E2E4E9]">
              1 847,50 €
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#1C212B] flex justify-between text-[11px] text-[#8E95A5]">
            <span>18 passages caisse</span>
            <span className="font-mono">P.M : 102,60 €</span>
          </div>
        </div>

        {/* New Millenium */}
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              New Millenium
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 rounded">
              +14.2%
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#E2E4E9]">
              2 103,00 €
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#1C212B] flex justify-between text-[11px] text-[#8E95A5]">
            <span>24 passages caisse</span>
            <span className="font-mono">P.M : 87,60 €</span>
          </div>
        </div>

        {/* Web & Expéditions */}
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Web & Expéditions
            </span>
            <span className="text-[10px] font-mono text-[#5B7A9D] bg-[#5B7A9D]/15 border border-[#5B7A9D]/30 px-1.5 py-0.5 rounded">
              14 colis
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#E2E4E9]">
              956,20 €
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#1C212B] flex justify-between text-[11px] text-[#8E95A5]">
            <span>Mondial Relay / Colissimo</span>
            <span className="font-mono text-amber-400">100% discret</span>
          </div>
        </div>

        {/* Cruising */}
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Espace Cruising
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 rounded">
              Direct
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#E2E4E9]">
              34 entrées
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#1C212B] flex justify-between text-[11px] text-[#8E95A5]">
            <span>Recette : 580,00 €</span>
            <span className="font-mono">Affluence : Haute</span>
          </div>
        </div>
      </div>

      {/* Affichage en pile : Alertes Stock Bas puis Activité Récente */}
      <div className="flex flex-col gap-6">
        {/* Left: Low Stock Alerts */}
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <h2 className="text-sm font-semibold text-[#E2E4E9]">
                Alertes de Stock Bas (Seuil ≤ 4)
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateToStocks}
              className="text-xs text-[#5B7A9D] hover:text-[#789BBF] font-medium transition-colors"
            >
              Gérer les stocks →
            </button>
          </div>

          <div className="mt-3 divide-y divide-[#1A1F29]">
            {lowStockAlerts.length === 0 ? (
              <p className="text-xs text-[#6B7280] py-4 text-center">
                Tous les stocks sont à des niveaux nominaux.
              </p>
            ) : (
              lowStockAlerts.slice(0, 3).map((alert, idx) => (
                <div
                  key={`${alert.productId}-${alert.siteKey}-${idx}`}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-[#E2E4E9] truncate">
                      {alert.productName}
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-[#6B7280]">
                      <span className="font-mono text-[#8E95A5]">{alert.sku}</span>
                      <span>•</span>
                      <span>{alert.siteLabel}</span>
                      <span>•</span>
                      <span className="font-mono text-sky-400">
                        {alert.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded text-xs">
                      {alert.qty} restants
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Activité Récente (Cash Log + Transits) */}
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h2 className="text-sm font-semibold text-[#E2E4E9]">
                Activité Récente & Mouvements Caisse
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateToCash}
              className="text-xs text-[#5B7A9D] hover:text-[#789BBF] font-medium transition-colors"
            >
              Journal complet →
            </button>
          </div>

          <div className="mt-3 divide-y divide-[#1A1F29]">
            {cashLog.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-[#6B7280]">
                      {evt.time}
                    </span>
                    <span className="font-medium text-[#E2E4E9] truncate">
                      {evt.reason}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    Opérateur : <span className="text-[#8E95A5]">{evt.vendor}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-semibold text-[#E2E4E9]">
                    Pris: {evt.taken.toFixed(2)} €
                  </div>
                  <div
                    className={`font-mono text-[11px] ${
                      evt.delta === 0
                        ? "text-emerald-400"
                        : evt.delta > 0
                        ? "text-sky-400"
                        : "text-rose-400"
                    }`}
                  >
                    Écart : {evt.delta >= 0 ? "+" : ""}
                    {evt.delta.toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
