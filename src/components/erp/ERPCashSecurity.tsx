"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ERPCashSecurity() {
  const { cashLog, addCashEvent } = useApp();

  // Simulator step: "idle" | "requested" | "open" | "success"
  const [simStep, setSimStep] = useState<"idle" | "requested" | "open" | "success">("idle");
  const [simVendor, setSimVendor] = useState("Marie Dupont (Boxxman)");
  const [simReason, setSimReason] = useState("Monnaie 50 € (Billet client)");
  const [simTaken, setSimTaken] = useState(50);
  const [simReturned, setSimReturned] = useState(50);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleStartSimulation = () => {
    setSimVendor("Marie Dupont (Boxxman)");
    setSimReason("Monnaie 50 € (Billet client)");
    setSimTaken(50);
    setSimReturned(50);
    setSimStep("requested");
  };

  const handleAuthorize = () => {
    setSimStep("open");
  };

  const handleCloseAndLog = () => {
    const delta = simReturned - simTaken;
    const now = new Date();
    const time = now.toTimeString().substring(0, 5);

    addCashEvent({
      time,
      vendor: simVendor,
      reason: simReason,
      taken: simTaken,
      returned: simReturned,
      delta,
    });

    setFeedbackMsg(
      `Ouverture clôturée avec succès. Écart enregistré : ${
        delta >= 0 ? "+" : ""
      }${delta.toFixed(2)} €`,
    );
    setSimStep("success");

    setTimeout(() => {
      setSimStep("idle");
      setFeedbackMsg("");
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Sécurité Caisse & Traçabilité des Tiroirs
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Audit anti-fraude • Double validation des ouvertures hors vente
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded">
            Protocoles Solenoid 24V : Actifs
          </span>
        </div>
      </div>

      {/* Simulator Card */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
          <div>
            <h2 className="text-sm font-semibold text-[#E2E4E9]">
              Simulateur en Direct : Demande d&apos;ouverture Tiroir
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Reproduit le flux réel entre un vendeur en caisse et le superviseur
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B7A9D] bg-[#5B7A9D]/10 px-2 py-0.5 rounded border border-[#5B7A9D]/20">
            Audit ISO-27001
          </span>
        </div>

        <div className="mt-4">
          {simStep === "idle" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161B23] p-4 rounded border border-[#252C39]">
              <div>
                <p className="text-xs font-medium text-[#E2E4E9]">
                  Aucune demande en attente sur les caisses physiques.
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Cliquez sur le bouton pour simuler une demande de monnaie émise par Boutique 1.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartSimulation}
                className="shrink-0 bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                Simuler demande vendeur (Monnaie 50 €)
              </button>
            </div>
          )}

          {simStep === "requested" && (
            <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                    Demande d&apos;autorisation en attente
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-400/90">
                  Caisse #01 • Marais
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#12151B] p-3 rounded border border-amber-900/30">
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block">
                    Vendeur
                  </span>
                  <span className="font-medium text-[#E2E4E9]">{simVendor}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block">
                    Motif déclaré
                  </span>
                  <span className="font-medium text-[#E2E4E9]">{simReason}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block">
                    Montant pris
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {simTaken.toFixed(2)} €
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSimStep("idle")}
                  className="px-3 py-1.5 rounded text-xs text-[#8E95A5] hover:text-[#E2E4E9] transition-colors"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={handleAuthorize}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors shadow-xs"
                >
                  Autoriser l&apos;ouverture
                </button>
              </div>
            </div>
          )}

          {simStep === "open" && (
            <div className="bg-sky-950/20 border border-sky-900/50 p-4 rounded space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wide font-mono">
                    Tiroir-caisse ouvert — Contrôle de clôture
                  </span>
                </div>
                <span className="text-[11px] font-mono text-sky-400">
                  Électro-aimant relâché
                </span>
              </div>

              <div className="bg-[#12151B] p-3.5 rounded border border-sky-900/30 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-[#8E95A5] block">
                      Montant prélevé du tiroir :
                    </span>
                    <span className="font-mono text-sm font-bold text-[#E2E4E9]">
                      {simTaken.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-[#E2E4E9] font-medium">
                      Saisir le montant rendu en caisse (€) :
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={simReturned}
                      onChange={(e) => setSimReturned(parseFloat(e.target.value) || 0)}
                      className="w-28 bg-[#181D26] border border-[#2D3646] rounded px-2.5 py-1 text-xs font-mono text-white text-right focus:outline-hidden focus:border-[#5B7A9D]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1C212B] text-[11px]">
                  <span className="text-[#6B7280]">
                    Écart de clôture calculé (Rendu - Pris) :
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      simReturned - simTaken === 0
                        ? "text-emerald-400"
                        : simReturned - simTaken > 0
                        ? "text-sky-400"
                        : "text-rose-400"
                    }`}
                  >
                    {simReturned - simTaken >= 0 ? "+" : ""}
                    {(simReturned - simTaken).toFixed(2)} €
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleCloseAndLog}
                  className="bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold px-4 py-2 rounded transition-colors shadow-xs"
                >
                  Clôturer et consigner au journal
                </button>
              </div>
            </div>
          )}

          {simStep === "success" && (
            <div className="bg-emerald-950/30 border border-emerald-900/60 p-4 rounded text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold font-mono">OK</span>
                <span className="text-[#E2E4E9] font-medium">{feedbackMsg}</span>
              </div>
              <span className="text-[10px] font-mono text-[#6B7280]">
                Réinitialisation automatique...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cash Log Table / Cards */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
          <div>
            <h2 className="text-sm font-semibold text-[#E2E4E9]">
              Journal Légal des Ouvertures Hors Vente
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Historique inaltérable synchronisé sur le réseau de magasins
            </p>
          </div>
          <span className="text-xs font-mono text-[#8E95A5]">
            {cashLog.length} événements
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F242D] text-[11px] uppercase tracking-wider text-[#6B7280]">
                <th className="py-2.5 px-3">Heure</th>
                <th className="py-2.5 px-3">Vendeur</th>
                <th className="py-2.5 px-3">Motif</th>
                <th className="py-2.5 px-3 text-right">Montant pris</th>
                <th className="py-2.5 px-3 text-right">Montant rendu</th>
                <th className="py-2.5 px-3 text-right">Écart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1F29]">
              {cashLog.map((log) => (
                <tr key={log.id} className="hover:bg-[#161B23]/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-[#8E95A5]">
                    {log.time}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#E2E4E9]">
                    {log.vendor}
                  </td>
                  <td className="py-3 px-3 text-[#A4ACB9]">
                    {log.reason}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-[#E2E4E9]">
                    {log.taken.toFixed(2)} €
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-[#E2E4E9]">
                    {log.returned.toFixed(2)} €
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        log.delta === 0
                          ? "text-emerald-400 bg-emerald-950/30"
                          : log.delta > 0
                          ? "text-sky-400 bg-sky-950/30"
                          : "text-rose-400 bg-rose-950/30"
                      }`}
                    >
                      {log.delta >= 0 ? "+" : ""}
                      {log.delta.toFixed(2)} €
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden mt-3 space-y-3">
          {cashLog.map((log) => (
            <div
              key={log.id}
              className="bg-[#161A22] border border-[#222834] rounded p-3 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#6B7280]">
                  {log.time}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold px-1.5 py-0.2 rounded ${
                    log.delta === 0
                      ? "text-emerald-400 bg-emerald-950/30"
                      : "text-rose-400 bg-rose-950/30"
                  }`}
                >
                  Écart : {log.delta >= 0 ? "+" : ""}
                  {log.delta.toFixed(2)} €
                </span>
              </div>
              <p className="font-medium text-[#E2E4E9]">{log.reason}</p>
              <p className="text-[11px] text-[#8E95A5]">Vendeur : {log.vendor}</p>
              <div className="pt-2 border-t border-[#1F2531] flex justify-between text-[11px] font-mono">
                <span>Pris: {log.taken.toFixed(2)} €</span>
                <span>Rendu: {log.returned.toFixed(2)} €</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
