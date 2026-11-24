"use client";

import React, { useState } from "react";
import { useApp, type OrderReturn } from "@/context/AppContext";

export default function ERPReturns() {
  const { returns, resolveReturn } = useApp();
  const [selectedReturn, setSelectedReturn] = useState<OrderReturn | null>(null);
  const [refusalNote, setRefusalNote] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReturns = returns.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  const handleDecision = (
    decision: OrderReturn["status"],
    refusalReason?: string,
  ) => {
    if (!selectedReturn) return;
    resolveReturn(selectedReturn.id, decision, refusalReason);
    setSelectedReturn(null);
    setRefusalNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Service Après-Vente &amp; Gestion des Retours
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Validation des retours, inspection d&apos;hygiène, remboursements CB, avoirs ou refus motivés
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2.5 py-1 rounded">
            Réglementation Hygiène &amp; Blister Scellé
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            Dossiers en attente
          </span>
          <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
            {returns.filter((r) => r.status === "En attente d'inspection").length}
          </span>
        </div>
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            Remboursements CB
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
            {returns.filter((r) => r.status === "Remboursé sur carte bleue").length}
          </span>
        </div>
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            Avoirs &amp; Échanges
          </span>
          <span className="text-lg font-bold font-mono text-sky-400 mt-1 block">
            {returns.filter((r) => r.status === "Avoir émis" || r.status === "Échange expédié").length}
          </span>
        </div>
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            Refusés (Hygiène/Délai)
          </span>
          <span className="text-lg font-bold font-mono text-rose-400 mt-1 block">
            {returns.filter((r) => r.status === "Refusé (Non conforme)").length}
          </span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1F242D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#E2E4E9]">
              Demandes de Retour ({filteredReturns.length})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#6B7280] font-mono">Filtrer statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#161A22] border border-[#262D3B] text-xs text-[#E2E4E9] rounded px-2.5 py-1 font-mono focus:outline-hidden"
            >
              <option value="all">Tous les dossiers</option>
              <option value="En attente d'inspection">En attente d&apos;inspection</option>
              <option value="Remboursé sur carte bleue">Remboursé CB</option>
              <option value="Avoir émis">Avoir émis</option>
              <option value="Échange expédié">Échange expédié</option>
              <option value="Refusé (Non conforme)">Refusé (Non conforme)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                <th className="py-2.5 px-4 font-sans">N° Retour</th>
                <th className="py-2.5 px-3">Commande</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3 font-sans">Article</th>
                <th className="py-2.5 px-3">Motif Déclaré</th>
                <th className="py-2.5 px-3">État Constaté</th>
                <th className="py-2.5 px-3 text-right">Montant</th>
                <th className="py-2.5 px-3">Statut Dossier</th>
                <th className="py-2.5 px-4 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1F29] text-[11px]">
              {filteredReturns.map((r) => (
                <tr key={r.id} className="hover:bg-[#161B23]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{r.returnNumber}</td>
                  <td className="py-3 px-3 text-[#5B7A9D]">{r.orderNumber}</td>
                  <td className="py-3 px-3 font-sans text-white">{r.customerName}</td>
                  <td className="py-3 px-3 font-sans text-[#E2E4E9]">{r.product}</td>
                  <td className="py-3 px-3 text-amber-300">{r.reason}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        r.condition.includes("déjà porté") || r.condition.includes("expiré")
                          ? "text-rose-400 bg-rose-950/40 border border-rose-900/40"
                          : "text-emerald-400 bg-emerald-950/40 border border-emerald-900/40"
                      }`}
                    >
                      {r.condition}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {r.amount.toFixed(2)} €
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        r.status === "Remboursé sur carte bleue"
                          ? "text-emerald-300 bg-emerald-950/40 border border-emerald-800/40"
                          : r.status === "Refusé (Non conforme)"
                          ? "text-rose-400 bg-rose-950/40 border border-rose-800/40"
                          : r.status === "Avoir émis"
                          ? "text-sky-300 bg-sky-950/40 border border-sky-800/40"
                          : "text-amber-400 bg-amber-950/40 border border-amber-800/40"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => setSelectedReturn(r)}
                      className="bg-[#1F242D] hover:bg-[#2B3342] text-white px-2.5 py-1 rounded text-xs transition-colors"
                    >
                      Traiter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Traitement du Retour */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <span className="font-mono text-xs uppercase text-[#A67C52]">
                  Traitement SAV &amp; Décision
                </span>
                <h3 className="text-base font-bold text-white">
                  Dossier {selectedReturn.returnNumber} — {selectedReturn.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReturn(null)}
                className="text-xs text-[#8E95A5] hover:text-white px-2 py-1 bg-[#161A22] rounded"
              >
                ✕
              </button>
            </div>

            {/* Recap info */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#161A22] p-3.5 rounded border border-[#222733]">
              <div>
                <span className="text-[#6B7280] block text-[10px]">Article :</span>
                <span className="text-white font-sans font-medium">{selectedReturn.product}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px]">Valeur :</span>
                <span className="text-white font-bold">{selectedReturn.amount.toFixed(2)} €</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px]">Motif invoqué :</span>
                <span className="text-amber-300">{selectedReturn.reason}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px]">Inspection atelier :</span>
                <span className="text-white">{selectedReturn.condition}</span>
              </div>
            </div>

            {/* Decision options */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#E2E4E9] block">
                Sélectionner la décision :
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDecision("Remboursé sur carte bleue")}
                  className="p-3 rounded bg-emerald-950/30 border border-emerald-900/50 hover:bg-emerald-900/40 text-left transition-colors"
                >
                  <span className="block text-xs font-bold text-emerald-300">
                    Remboursement CB
                  </span>
                  <span className="block text-[10px] text-[#8E95A5] mt-1">
                    Crédit direct sur la carte bancaire d&apos;origine
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision("Avoir émis")}
                  className="p-3 rounded bg-sky-950/30 border border-sky-900/50 hover:bg-sky-900/40 text-left transition-colors"
                >
                  <span className="block text-xs font-bold text-sky-300">
                    Émettre un Avoir
                  </span>
                  <span className="block text-[10px] text-[#8E95A5] mt-1">
                    Bon d&apos;achat valable 1 an (Boutique ou Web)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision("Échange expédié")}
                  className="p-3 rounded bg-purple-950/30 border border-purple-900/50 hover:bg-purple-900/40 text-left transition-colors"
                >
                  <span className="block text-xs font-bold text-purple-300">
                    Valider Échange
                  </span>
                  <span className="block text-[10px] text-[#8E95A5] mt-1">
                    Nouvelle taille ou produit identique expédié
                  </span>
                </button>
              </div>

              {/* Refusal section */}
              <div className="p-3.5 rounded bg-rose-950/20 border border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">
                    Refuser le remboursement (Motif de non-conformité) :
                  </span>
                </div>
                <p className="text-[11px] text-[#8E95A5]">
                  En application de l&apos;article L221-28 du Code de la consommation, les articles ayant été descellés, en contact corporel ou dont le délai de 14 jours est dépassé ne sont ni repris ni échangés.
                </p>
                <input
                  type="text"
                  value={refusalNote}
                  onChange={(e) => setRefusalNote(e.target.value)}
                  placeholder="Préciser le motif : Ex. Sceau d'hygiène rompu ou traces d'utilisation"
                  className="w-full bg-[#161A22] border border-[#2B3342] text-xs text-white rounded px-3 py-1.5"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDecision(
                      "Refusé (Non conforme)",
                      refusalNote || "Non conforme aux conditions d'hygiène (scellé rompu)",
                    )
                  }
                  className="w-full bg-rose-900/50 hover:bg-rose-800 text-rose-200 text-xs font-semibold py-1.5 rounded transition-colors"
                >
                  Confirmer le Refus et Notifier le Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
