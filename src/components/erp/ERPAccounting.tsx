"use client";

import React, { useState } from "react";
import { useApp, type Invoice, type SalarySlip } from "@/context/AppContext";

export default function ERPAccounting() {
  const {
    invoices,
    salaries,
    updateSalaryStatus,
    currentRole,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    "facturation" | "salaires" | "bilan"
  >("facturation");

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalCA = invoices.reduce((acc, inv) => acc + inv.totalTTC, 0);
  const totalTVA = invoices.reduce((acc, inv) => acc + inv.totalTVA, 0);
  const totalSalaries = salaries.reduce((acc, sal) => acc + sal.netPayable, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Comptabilité, Facturation &amp; Salaires
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Gestion comptable multi-entités • Fiches de paie indexées sur la badgeuse
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-1 rounded">
            Conforme Plan Comptable Général (PCG)
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            Chiffre d&apos;Affaires Consolidé
          </span>
          <span className="text-lg font-bold font-mono text-white mt-1 block">
            {totalCA.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            TVA Déductible &amp; Collectée
          </span>
          <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
            {totalTVA.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="bg-[#12151B] border border-[#1F242D] p-3 rounded">
          <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
            Masse Salariale Nette
          </span>
          <span className="text-lg font-bold font-mono text-sky-400 mt-1 block">
            {totalSalaries.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#1F242D] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab("facturation")}
          className={`px-4 py-2.5 rounded-t transition-colors border-b-2 ${
            activeSubTab === "facturation"
              ? "bg-[#161A22] text-white border-[#5B7A9D]"
              : "text-[#8E95A5] hover:text-white border-transparent"
          }`}
        >
          Facturation (Particuliers / Pro / Cession)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("salaires")}
          className={`px-4 py-2.5 rounded-t transition-colors border-b-2 ${
            activeSubTab === "salaires"
              ? "bg-[#161A22] text-white border-[#5B7A9D]"
              : "text-[#8E95A5] hover:text-white border-transparent"
          }`}
        >
          Salaires &amp; Fiches de Paie (Badgeuse)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("bilan")}
          className={`px-4 py-2.5 rounded-t transition-colors border-b-2 ${
            activeSubTab === "bilan"
              ? "bg-[#161A22] text-white border-[#5B7A9D]"
              : "text-[#8E95A5] hover:text-white border-transparent"
          }`}
        >
          Bilan &amp; Rapprochement
        </button>
      </div>

      {/* 1. FACTURATION */}
      {activeSubTab === "facturation" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1F242D] flex items-center justify-between">
            <span className="text-xs font-bold text-[#E2E4E9]">
              Livre des Factures Émises ({invoices.length})
            </span>
            <span className="text-[11px] font-mono text-[#6B7280]">
              Export FEC / Compta disponible
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                  <th className="py-2.5 px-4 font-sans">N° Facture</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 font-sans">Client / Bénéficiaire</th>
                  <th className="py-2.5 px-3 text-right">Total HT</th>
                  <th className="py-2.5 px-3 text-right">TVA (20%)</th>
                  <th className="py-2.5 px-3 text-right">Total TTC</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 px-4 text-right font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#161B23]/50">
                    <td className="py-3 px-4 font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-[#8E95A5]">{inv.date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          inv.type === "Pro B2B"
                            ? "bg-purple-950/40 text-purple-300 border border-purple-900/40"
                            : inv.type === "Interne Cession"
                            ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                            : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                        }`}
                      >
                        {inv.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-white font-medium">{inv.clientName}</td>
                    <td className="py-3 px-3 text-right text-[#8E95A5]">
                      {currentRole === "Vendeur" ? "---" : `${inv.totalHT.toFixed(2)} €`}
                    </td>
                    <td className="py-3 px-3 text-right text-[#8E95A5]">
                      {currentRole === "Vendeur" ? "---" : `${inv.totalTVA.toFixed(2)} €`}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {inv.totalTTC.toFixed(2)} €
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          inv.status === "Payée"
                            ? "text-emerald-400 bg-emerald-950/40"
                            : "text-amber-400 bg-amber-950/40"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-[11px] text-[#5B7A9D] hover:underline"
                      >
                        Aperçu PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SALAIRES & PAIE */}
      {activeSubTab === "salaires" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F242D] gap-2">
            <div>
              <h2 className="text-xs font-bold text-[#E2E4E9] uppercase tracking-wider">
                Fiches de Paie &amp; Calcul des Heures Badgeuse
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Intégration temps réel : les heures pointées sur la badgeuse PIN alimentent automatiquement les variables de paie.
              </p>
            </div>
            <span className="font-mono text-xs text-sky-400 bg-sky-950/30 px-2.5 py-1 rounded border border-sky-900/40">
              Période : Novembre 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                  <th className="py-2.5 px-3 font-sans">Collaborateur</th>
                  <th className="py-2.5 px-2">Rôle / Site</th>
                  <th className="py-2.5 px-2 text-right">Salaire Base</th>
                  <th className="py-2.5 px-2 text-center">Heures Pointées</th>
                  <th className="py-2.5 px-2 text-center">Nuit / Cruising</th>
                  <th className="py-2.5 px-2 text-right">Primes / Heures Supp</th>
                  <th className="py-2.5 px-2 text-right">Charges / Cotis.</th>
                  <th className="py-2.5 px-2 text-right text-emerald-400 font-bold">Net à Payer</th>
                  <th className="py-2.5 px-3">Statut SEPA</th>
                  <th className="py-2.5 px-3 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                {salaries.map((sal) => (
                  <tr key={sal.id} className="hover:bg-[#161B23]/50">
                    <td className="py-3 px-3 font-sans font-medium text-white">{sal.staffName}</td>
                    <td className="py-3 px-2 text-[#8E95A5] text-[10px]">
                      {sal.role} &bull; {sal.site}
                    </td>
                    <td className="py-3 px-2 text-right text-[#8E95A5]">
                      {sal.baseSalary.toFixed(2)} €
                    </td>
                    <td className="py-3 px-2 text-center text-white">{sal.trackedHours}h</td>
                    <td className="py-3 px-2 text-center text-sky-300">
                      {sal.nightHours > 0 ? `${sal.nightHours}h (+30%)` : "-"}
                    </td>
                    <td className="py-3 px-2 text-right text-amber-300">
                      +{sal.bonus.toFixed(2)} €
                    </td>
                    <td className="py-3 px-2 text-right text-rose-400">
                      -{sal.deductions.toFixed(2)} €
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-white">
                      {sal.netPayable.toFixed(2)} €
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          sal.status.includes("Payé")
                            ? "text-emerald-400 bg-emerald-950/40 border border-emerald-900/40"
                            : "text-amber-400 bg-amber-950/40 border border-amber-900/40"
                        }`}
                      >
                        {sal.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      {sal.status !== "Payé par virement SEPA" ? (
                        <button
                          type="button"
                          onClick={() => updateSalaryStatus(sal.id, "Payé par virement SEPA")}
                          className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded"
                        >
                          Virement SEPA
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#6B7280]">Exécuté</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BILAN & RAPPROCHEMENT */}
      {activeSubTab === "bilan" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5 space-y-4">
          <div className="pb-3 border-b border-[#1F242D]">
            <h2 className="text-sm font-bold text-white">
              Bilan d&apos;Exploitation &amp; Rapprochement Multi-Canaux
            </h2>
            <p className="text-xs text-[#6B7280]">
              Répartition par établissement et canal de distribution
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded bg-[#161A22] border border-[#222733] space-y-2">
              <span className="text-[#A67C52] font-bold block uppercase text-[10px]">
                Boxxman
              </span>
              <div className="text-lg font-bold text-white">12 450,00 € TTC</div>
              <p className="text-[11px] text-[#6B7280]">
                Ventes physiques comptoir + Billetterie cruising automatisée
              </p>
            </div>

            <div className="p-4 rounded bg-[#161A22] border border-[#222733] space-y-2">
              <span className="text-[#5B7A9D] font-bold block uppercase text-[10px]">
                New Millenium
              </span>
              <div className="text-lg font-bold text-white">8 920,00 € TTC</div>
              <p className="text-[11px] text-[#6B7280]">
                Ventes boutique accessoires, lingerie &amp; click &amp; collect
              </p>
            </div>

            <div className="p-4 rounded bg-[#161A22] border border-[#222733] space-y-2">
              <span className="text-emerald-400 font-bold block uppercase text-[10px]">
                Dark Ink
              </span>
              <div className="text-lg font-bold text-white">18 730,00 € TTC</div>
              <p className="text-[11px] text-[#6B7280]">
                Expéditions discrètes Colissimo / Chronopost et ventes B2B
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aperçu Facture */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <span className="font-mono text-xs uppercase text-[#5B7A9D]">
                  Document Comptable
                </span>
                <h3 className="text-base font-bold text-white">
                  Facture {selectedInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs text-[#8E95A5] hover:text-white px-2 py-1 bg-[#161A22] rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono bg-[#161A22] p-4 rounded">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Émetteur :</span>
                <span className="text-white">DARK-INK LOGISTICS SAS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Bénéficiaire :</span>
                <span className="text-white font-sans font-bold">{selectedInvoice.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Type de facture :</span>
                <span className="text-white">{selectedInvoice.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Date d&apos;émission :</span>
                <span className="text-white">{selectedInvoice.date}</span>
              </div>
              <div className="border-t border-[#262D3B] pt-2 flex justify-between">
                <span className="text-[#6B7280]">Total HT :</span>
                <span className="text-white">{selectedInvoice.totalHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">TVA (20%) :</span>
                <span className="text-white">{selectedInvoice.totalTVA.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-[#262D3B] pt-2">
                <span>Total Net TTC :</span>
                <span>{selectedInvoice.totalTTC.toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="bg-[#5B7A9D] hover:bg-[#4E6B8D] text-white text-xs px-4 py-2 rounded font-sans"
              >
                Fermer l&apos;Aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
