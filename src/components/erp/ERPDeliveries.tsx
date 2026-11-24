"use client";

import React, { useState, useMemo } from "react";
import {
  useApp,
  type InternalTransferDispatch,
  type DefectiveProductEntry,
} from "@/context/AppContext";
import { products, type Product } from "@/data/products";

export type DeliveryTab = "reception" | "transferts" | "pertes";
export type TransferDestination = "all" | "boutique1" | "boutique2" | "web";

export default function ERPDeliveries() {
  const {
    internalDispatches,
    defectiveProducts,
    dispatchReceptionInitial,
    confirmBoutiqueReception,
    updateDefectiveStatus,
    stocks,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DeliveryTab>("reception");
  const [selectedDestination, setSelectedDestination] = useState<TransferDestination>("all");

  // POP-UP SCAN DU PRODUIT REÇU INITIALEMENT À L'ENTREPÔT
  const [showScanModal, setShowScanModal] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product>(products[0]);
  const [supplierInput, setSupplierInput] = useState("Darkline Leatherworks (Berlin)");
  const [totalReceivedInput, setTotalReceivedInput] = useState(60);

  // Quantités modifiables par site
  const [qtyEntrepot, setQtyEntrepot] = useState(20);
  const [qtyBoutique1, setQtyBoutique1] = useState(25);
  const [qtyBoutique2, setQtyBoutique2] = useState(15);

  // 2 Lignes d'état distinctes obligatoires
  const [productCondition, setProductCondition] = useState<
    "Conforme / Neuf" | "Défaut d'aspect" | "Défectueux / Inutilisable"
  >("Conforme / Neuf");
  const [packagingCondition, setPackagingCondition] = useState<
    "Impeccable / Scellé" | "Carton écrasé / Déchiré" | "Non scellé / Absent"
  >("Impeccable / Scellé");

  // POP-UP CONFIRMATION EN BOUTIQUE
  const [confirmModalData, setConfirmModalData] = useState<{
    dispatch: InternalTransferDispatch;
    siteKey: "boutique1" | "boutique2" | "web";
  } | null>(null);
  const [storageChoice, setStorageChoice] = useState<"Rayon" | "Réserve">("Rayon");
  const [locationInput, setLocationInput] = useState("B1-RAY-01");

  // Synchronise le total avec la somme des trois sites
  const handleSiteQtyChange = (site: "entrepot" | "b1" | "b2", val: number) => {
    const safeVal = Math.max(0, val);
    if (site === "entrepot") {
      setQtyEntrepot(safeVal);
      setTotalReceivedInput(safeVal + qtyBoutique1 + qtyBoutique2);
    } else if (site === "b1") {
      setQtyBoutique1(safeVal);
      setTotalReceivedInput(qtyEntrepot + safeVal + qtyBoutique2);
    } else {
      setQtyBoutique2(safeVal);
      setTotalReceivedInput(qtyEntrepot + qtyBoutique1 + safeVal);
    }
  };

  const handleValidateReception = () => {
    const isDefective =
      productCondition === "Défectueux / Inutilisable" ||
      packagingCondition === "Non scellé / Absent";

    dispatchReceptionInitial({
      batchNumber: `LOT-RECEP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      productId: scannedProduct.id,
      productName: scannedProduct.name,
      sku: scannedProduct.sku,
      supplier: supplierInput,
      totalReceived: totalReceivedInput,
      qtyEntrepot,
      qtyBoutique1,
      qtyBoutique2,
      productCondition,
      packagingCondition,
      status: isDefective
        ? "Pertes / Défectueux"
        : "En attente de livraison / Confirmation en boutique",
    });

    setShowScanModal(false);
  };

  const filteredDispatches = useMemo(() => {
    if (selectedDestination === "all") return internalDispatches;
    if (selectedDestination === "boutique1") {
      return internalDispatches.filter((d) => d.qtyBoutique1 > 0);
    }
    if (selectedDestination === "boutique2") {
      return internalDispatches.filter((d) => d.qtyBoutique2 > 0);
    }
    return internalDispatches.filter((d) => d.qtyEntrepot > 0);
  }, [internalDispatches, selectedDestination]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Livraisons &amp; Réceptions — Transferts Internes
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Réception quai entrepôt &bull; Dispatch multi-sites &bull; Détection pertes d&apos;exploitation &amp; contrôle conformité
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowScanModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <span>[||||]</span>
            <span>Scanner Produit Reçu</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#1F242D] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("reception")}
          className={`px-4 py-2.5 rounded-t transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === "reception"
              ? "bg-[#161A22] text-white border-[#5B7A9D]"
              : "text-[#8E95A5] hover:text-white border-transparent"
          }`}
        >
          <span>1. Réception Entrepôt &amp; Dispatch</span>
          <span className="font-mono text-[10px] bg-[#1F242D] px-1.5 py-0.2 rounded text-[#8E95A5]">
            Quai Central
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transferts")}
          className={`px-4 py-2.5 rounded-t transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === "transferts"
              ? "bg-[#161A22] text-white border-[#5B7A9D]"
              : "text-[#8E95A5] hover:text-white border-transparent"
          }`}
        >
          <span>2. Transferts Internes par Boutique</span>
          <span className="font-mono text-[10px] bg-[#1F242D] px-1.5 py-0.2 rounded text-sky-400">
            {internalDispatches.filter((d) => d.status.includes("En attente")).length} en attente
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pertes")}
          className={`px-4 py-2.5 rounded-t transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === "pertes"
              ? "bg-[#161A22] text-white border-[#5B7A9D]"
              : "text-[#8E95A5] hover:text-white border-transparent"
          }`}
        >
          <span>3. Pertes d&apos;Exploitation / Défectueux</span>
          <span className="font-mono text-[10px] bg-rose-950/40 text-rose-300 border border-rose-900/40 px-1.5 py-0.2 rounded">
            {defectiveProducts.length} dossier(s)
          </span>
        </button>
      </div>

      {/* VUE 1 : RÉCEPTION INITIALE À L'ENTREPÔT & DISPATCH */}
      {activeTab === "reception" && (
        <div className="space-y-4">
          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                Réception Quai &amp; Dispatch Tri-Sites
              </h2>
              <p className="text-xs text-[#6B7280]">
                Chaque produit reçu des fournisseurs est scanné, contrôlé (état produit &amp; emballage), puis ventilé entre Entrepôt (Web), Boutique 1 et Boutique 2.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowScanModal(true)}
              className="bg-[#5B7A9D] hover:bg-[#4E6B8D] text-white text-xs font-semibold px-4 py-2 rounded shrink-0 transition-colors"
            >
              + Nouveau Scan de Réception
            </button>
          </div>

          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#1F242D] flex items-center justify-between">
              <span className="text-xs font-bold text-[#E2E4E9]">
                Lots réceptionnés &amp; ventilés ({internalDispatches.length})
              </span>
              <span className="text-[11px] font-mono text-[#6B7280]">
                Horodatage synchronisé
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                    <th className="py-2.5 px-4 font-sans">N° Lot / Date</th>
                    <th className="py-2.5 px-3 font-sans">Produit &amp; SKU</th>
                    <th className="py-2.5 px-3">Fournisseur</th>
                    <th className="py-2.5 px-3 text-center">Qté Totale</th>
                    <th className="py-2.5 px-3 text-center text-[#5B7A9D]">Entrepôt (Web)</th>
                    <th className="py-2.5 px-3 text-center text-amber-300">Boutique 1</th>
                    <th className="py-2.5 px-3 text-center text-emerald-300">Boutique 2</th>
                    <th className="py-2.5 px-3">État Constaté (2 Lignes)</th>
                    <th className="py-2.5 px-3">Statut Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                  {internalDispatches.map((d) => (
                    <tr key={d.id} className="hover:bg-[#161B23]/50">
                      <td className="py-3 px-4 font-bold text-white">
                        <div>{d.batchNumber}</div>
                        <div className="text-[10px] text-[#6B7280] font-sans">
                          {d.date} &agrave; {d.time}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="font-semibold text-white block">{d.productName}</span>
                        <span className="text-[10px] font-mono text-[#A67C52]">{d.sku}</span>
                      </td>
                      <td className="py-3 px-3 text-[#8E95A5] font-sans">{d.supplier}</td>
                      <td className="py-3 px-3 text-center font-bold text-white">
                        {d.totalReceived} pcs
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-[#5B7A9D]">
                        {d.qtyEntrepot}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-300">
                        {d.qtyBoutique1}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-300">
                        {d.qtyBoutique2}
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5 text-[10px]">
                          <span
                            className={`block px-1.5 py-0.2 rounded font-sans ${
                              d.productCondition.includes("Conforme")
                                ? "text-emerald-400 bg-emerald-950/40"
                                : "text-rose-400 bg-rose-950/40"
                            }`}
                          >
                            P: {d.productCondition}
                          </span>
                          <span
                            className={`block px-1.5 py-0.2 rounded font-sans ${
                              d.packagingCondition.includes("Impeccable")
                                ? "text-emerald-400 bg-emerald-950/40"
                                : "text-amber-400 bg-amber-950/40"
                            }`}
                          >
                            E: {d.packagingCondition}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            d.status.includes("Confirmé")
                              ? "text-emerald-400 bg-emerald-950/40 border border-emerald-900/40"
                              : d.status.includes("Pertes")
                              ? "text-rose-400 bg-rose-950/40 border border-rose-900/40"
                              : "text-amber-400 bg-amber-950/40 border border-amber-900/40"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VUE 2 : TRANSFERTS INTERNES & VALIDATION EN BOUTIQUE */}
      {activeTab === "transferts" && (
        <div className="space-y-4">
          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A67C52] font-semibold">
                RÉCEPTION ET MISE EN RAYON / RÉSERVE
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                Confirmation d&apos;Arrivée en Boutique &amp; Emplacement
              </h2>
            </div>
            {/* Filter by destination */}
            <div className="flex items-center space-x-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedDestination("all")}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedDestination === "all"
                    ? "bg-[#5B7A9D] text-white"
                    : "bg-[#161A22] text-[#8E95A5] border border-[#262D3B]"
                }`}
              >
                Tous les flux
              </button>
              <button
                type="button"
                onClick={() => setSelectedDestination("boutique1")}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedDestination === "boutique1"
                    ? "bg-[#5B7A9D] text-white"
                    : "bg-[#161A22] text-[#8E95A5] border border-[#262D3B]"
                }`}
              >
                Boutique 1
              </button>
              <button
                type="button"
                onClick={() => setSelectedDestination("boutique2")}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedDestination === "boutique2"
                    ? "bg-[#5B7A9D] text-white"
                    : "bg-[#161A22] text-[#8E95A5] border border-[#262D3B]"
                }`}
              >
                Boutique 2
              </button>
              <button
                type="button"
                onClick={() => setSelectedDestination("web")}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedDestination === "web"
                    ? "bg-[#5B7A9D] text-white"
                    : "bg-[#161A22] text-[#8E95A5] border border-[#262D3B]"
                }`}
              >
                Entrepôt Web
              </button>
            </div>
          </div>

          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                    <th className="py-2.5 px-4 font-sans">N° Lot</th>
                    <th className="py-2.5 px-3 font-sans">Produit</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3 text-center">Qté Allouée</th>
                    <th className="py-2.5 px-3">Statut Acheminement</th>
                    <th className="py-2.5 px-3 font-sans">Emplacement Actuel</th>
                    <th className="py-2.5 px-4 text-right font-sans">Action Boutique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                  {filteredDispatches.map((d) => (
                    <tr key={d.id} className="hover:bg-[#161B23]/50">
                      <td className="py-3 px-4 font-bold text-white">{d.batchNumber}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="font-medium text-white block">{d.productName}</span>
                        <span className="text-[10px] font-mono text-[#8E95A5]">{d.sku}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-amber-300 block">
                          Boutique 1 : {d.qtyBoutique1} pcs
                        </span>
                        <span className="text-emerald-300 block">
                          Boutique 2 : {d.qtyBoutique2} pcs
                        </span>
                        <span className="text-[#5B7A9D] block">
                          Entrepôt Web : {d.qtyEntrepot} pcs
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-white">
                        {d.totalReceived}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            d.status.includes("Confirmé")
                              ? "text-emerald-400 bg-emerald-950/40"
                              : "text-amber-400 bg-amber-950/40"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-sky-300">
                        {d.targetLocation ? (
                          <span>
                            [{d.targetStorageChoice}] {d.targetLocation}
                          </span>
                        ) : (
                          <span className="text-[#6B7280] italic">Non assigné</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        {d.status.includes("En attente") ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmModalData({
                                dispatch: d,
                                siteKey: "boutique1",
                              });
                              setLocationInput(d.targetLocation || "B1-RAY-03");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 rounded font-semibold transition-colors shadow-xs"
                          >
                            Confirmer Réception Boutique
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-xs">✓ Validé</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VUE 3 : PRODUITS DÉFECTUEUX & PERTES D'EXPLOITATION */}
      {activeTab === "pertes" && (
        <div className="space-y-4">
          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                REGISTRE DES NON-CONFORMITÉS &amp; LITIGES FOURNISSEURS
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                Produits Défectueux / Pertes d&apos;Exploitation
              </h2>
              <p className="text-xs text-[#6B7280]">
                Articles écartés du stock commercialisable lors de la réception quai ou du déballage &bull; Dossiers de réclamation fabricant
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6B7280] block font-mono">Valeur marchande écartée :</span>
              <span className="text-lg font-bold font-mono text-rose-400">
                {defectiveProducts
                  .reduce((acc, p) => acc + p.costValue, 0)
                  .toFixed(2)}{" "}
                €
              </span>
            </div>
          </div>

          <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                    <th className="py-2.5 px-4 font-sans">N° Réclamation</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 font-sans">Article</th>
                    <th className="py-2.5 px-3">Fournisseur Litigieux</th>
                    <th className="py-2.5 px-3 text-center">Qté</th>
                    <th className="py-2.5 px-3 text-right">Perte Coût Achat</th>
                    <th className="py-2.5 px-3">Défaut Produit</th>
                    <th className="py-2.5 px-3">État Emballage</th>
                    <th className="py-2.5 px-3">Statut Réclamation</th>
                    <th className="py-2.5 px-4 text-right font-sans">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                  {defectiveProducts.map((def) => (
                    <tr key={def.id} className="hover:bg-[#161B23]/50">
                      <td className="py-3 px-4 font-bold text-rose-300">
                        {def.claimNumber}
                      </td>
                      <td className="py-3 px-3 text-[#8E95A5]">{def.date}</td>
                      <td className="py-3 px-3 font-sans text-white font-medium">
                        {def.productName}
                      </td>
                      <td className="py-3 px-3 text-[#8E95A5] font-sans">{def.supplier}</td>
                      <td className="py-3 px-3 text-center font-bold text-white">
                        {def.qty}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-rose-400">
                        {def.costValue.toFixed(2)} €
                      </td>
                      <td className="py-3 px-3 text-amber-300">{def.productCondition}</td>
                      <td className="py-3 px-3 text-[#8E95A5]">{def.packagingCondition}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            def.status.includes("Avoir")
                              ? "text-emerald-400 bg-emerald-950/40 border border-emerald-900/40"
                              : "text-amber-400 bg-amber-950/40 border border-amber-900/40"
                          }`}
                        >
                          {def.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        {def.status !== "Avoir fournisseur reçu" ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateDefectiveStatus(def.id, "Avoir fournisseur reçu")
                            }
                            className="text-[10px] bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 px-2 py-0.5 rounded"
                          >
                            Valider Avoir Reçu
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400">Clôturé</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP-UP SCAN PRODUIT REÇU INITIALEMENT (EXIGÉE PAR L'UTILISATEUR) */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <span className="font-mono text-xs uppercase text-emerald-400 font-bold">
                  [ SCAN CODE-BARRES QUAI ] &bull; RÉCEPTION INITIALE
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Fiche Réception &amp; Dispatch Multi-Stocks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScanModal(false)}
                className="text-xs text-[#8E95A5] hover:text-white px-2 py-1 rounded bg-[#161A22]"
              >
                ✕
              </button>
            </div>

            {/* Sélecteur de produit scanné */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E95A5] mb-1 font-mono">
                    Article Scanné (Code-barres / Référence)
                  </label>
                  <select
                    value={scannedProduct.id}
                    onChange={(e) => {
                      const p = products.find((prod) => prod.id === e.target.value);
                      if (p) setScannedProduct(p);
                    }}
                    className="w-full bg-[#161A22] border border-[#2B3342] text-white rounded px-3 py-2 font-mono"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.sku}] {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E95A5] mb-1 font-mono">
                    Fournisseur d&apos;origine
                  </label>
                  <input
                    type="text"
                    value={supplierInput}
                    onChange={(e) => setSupplierInput(e.target.value)}
                    className="w-full bg-[#161A22] border border-[#2B3342] text-white rounded px-3 py-2 font-sans"
                  />
                </div>
              </div>

              {/* Fiche technique modifiable sommaire */}
              <div className="bg-[#161A22] p-3 rounded border border-[#222733] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-[#8E95A5]">
                <div>
                  <span className="block text-[#6B7280]">Catégorie :</span>
                  <span className="text-white font-sans">{scannedProduct.category}</span>
                </div>
                <div>
                  <span className="block text-[#6B7280]">Matière :</span>
                  <span className="text-white font-sans truncate block">{scannedProduct.material}</span>
                </div>
                <div>
                  <span className="block text-[#6B7280]">Taille :</span>
                  <span className="text-white font-sans">{scannedProduct.size}</span>
                </div>
                <div>
                  <span className="block text-[#6B7280]">Coût d&apos;achat :</span>
                  <span className="text-emerald-400 font-bold">{scannedProduct.pricePurchase} €</span>
                </div>
              </div>

              {/* VENTILATION DES STOCKS MULTI-SITES AVEC QUANTITÉ MODIFIABLE */}
              <div className="bg-[#161A22] p-4 rounded border border-[#2B3342] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Ventilation des Stocks (Quantités Modifiables)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Total Reçu : {totalReceivedInput} pièces
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded bg-[#0E1015] border border-[#262D3B]">
                    <label className="block text-[11px] font-mono text-[#5B7A9D] font-bold mb-1">
                      Entrepôt Central (Web)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={qtyEntrepot}
                      onChange={(e) => handleSiteQtyChange("entrepot", Number(e.target.value))}
                      className="w-full bg-[#161A22] border border-[#343E50] text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded"
                    />
                    <span className="text-[10px] text-[#6B7280] block mt-1">
                      Stock actuel : {stocks[scannedProduct.id]?.sites?.entrepot ?? 0}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-[#0E1015] border border-[#262D3B]">
                    <label className="block text-[11px] font-mono text-amber-300 font-bold mb-1">
                      Boutique 1 (Marais)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={qtyBoutique1}
                      onChange={(e) => handleSiteQtyChange("b1", Number(e.target.value))}
                      className="w-full bg-[#161A22] border border-[#343E50] text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded"
                    />
                    <span className="text-[10px] text-[#6B7280] block mt-1">
                      Stock actuel : {stocks[scannedProduct.id]?.sites?.boutique1Rayon ?? 0}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-[#0E1015] border border-[#262D3B]">
                    <label className="block text-[11px] font-mono text-emerald-300 font-bold mb-1">
                      Boutique 2 (Bastille)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={qtyBoutique2}
                      onChange={(e) => handleSiteQtyChange("b2", Number(e.target.value))}
                      className="w-full bg-[#161A22] border border-[#343E50] text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded"
                    />
                    <span className="text-[10px] text-[#6B7280] block mt-1">
                      Stock actuel : {stocks[scannedProduct.id]?.sites?.boutique2Rayon ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2 LIGNES D'ÉTAT OBLIGATOIRES (EXIGENCE FORMELLE UTILISATEUR) */}
              <div className="p-4 rounded bg-[#161A22] border border-[#2B3342] space-y-3">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider block">
                  Contrôle Qualité &amp; Conformité Réception
                </span>

                {/* LIGNE 1 : ÉTAT DU PRODUIT */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Ligne 1 : État du Produit Reçu
                  </label>
                  <select
                    value={productCondition}
                    onChange={(e) =>
                      setProductCondition(
                        e.target.value as "Conforme / Neuf" | "Défaut d'aspect" | "Défectueux / Inutilisable",
                      )
                    }
                    className="w-full bg-[#0E1015] border border-[#343E50] text-xs text-white rounded px-3 py-2 font-mono"
                  >
                    <option value="Conforme / Neuf">
                      ✓ Conforme / Neuf (Aucun défaut, conforme aux spécifications)
                    </option>
                    <option value="Défaut d'aspect">
                      ⚠ Défaut mineur d&apos;aspect (Légère rayure cuir/bouclerie)
                    </option>
                    <option value="Défectueux / Inutilisable">
                      ✕ Défectueux / Inutilisable &rarr; Rejeter en Pertes d&apos;Exploitation
                    </option>
                  </select>
                </div>

                {/* LIGNE 2 : ÉTAT DE L'EMBALLAGE */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Ligne 2 : État de l&apos;Emballage Produit
                  </label>
                  <select
                    value={packagingCondition}
                    onChange={(e) =>
                      setPackagingCondition(
                        e.target.value as "Impeccable / Scellé" | "Carton écrasé / Déchiré" | "Non scellé / Absent",
                      )
                    }
                    className="w-full bg-[#0E1015] border border-[#343E50] text-xs text-white rounded px-3 py-2 font-mono"
                  >
                    <option value="Impeccable / Scellé">
                      ✓ Impeccable / Scellé (Blister d&apos;hygiène intact d&apos;usine)
                    </option>
                    <option value="Carton écrasé / Déchiré">
                      ⚠ Carton écrasé / Déchiré (Mais contenu interne sain)
                    </option>
                    <option value="Non scellé / Absent">
                      ✕ Non scellé / Sachet déchiré &rarr; Rejeter en Pertes d&apos;Exploitation
                    </option>
                  </select>
                </div>

                {/* Alerte si défectueux */}
                {(productCondition === "Défectueux / Inutilisable" ||
                  packagingCondition === "Non scellé / Absent") && (
                  <div className="p-3 rounded bg-rose-950/40 border border-rose-900/60 text-rose-300 text-[11px] font-mono">
                    Attention : Cet article sera automatiquement transféré dans le registre &quot;Produits Défectueux / Pertes d&apos;exploitation&quot; et ouvrira une réclamation directe au fournisseur ({supplierInput}).
                  </div>
                )}
              </div>

              {/* Bouton de validation */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleValidateReception}
                  className={`w-full py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-xs ${
                    productCondition === "Défectueux / Inutilisable" ||
                    packagingCondition === "Non scellé / Absent"
                      ? "bg-rose-700 hover:bg-rose-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  {productCondition === "Défectueux / Inutilisable" ||
                  packagingCondition === "Non scellé / Absent"
                    ? "Enregistrer en Pertes d'Exploitation & Ouvrir Réclamation"
                    : "Valider la Réception & Mettre en Attente de Livraison Boutique"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMATION BOUTIQUE (CHOIX RAYON / RÉSERVE + EMPLACEMENT) */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <span className="font-mono text-xs uppercase text-emerald-400 font-bold">
                  RÉCEPTION PHYSIQUE EN BOUTIQUE
                </span>
                <h3 className="text-base font-bold text-white">
                  Mise en Stock du Lot {confirmModalData.dispatch.batchNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="text-xs text-[#8E95A5] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#161A22] p-3 rounded font-mono text-[#8E95A5] space-y-1">
                <span className="text-white font-sans font-bold block">
                  {confirmModalData.dispatch.productName}
                </span>
                <div>SKU : {confirmModalData.dispatch.sku}</div>
                <div>Quantité livrée : {confirmModalData.dispatch.qtyBoutique1} unités</div>
              </div>

              {/* Choix Rayon ou Réserve */}
              <div>
                <label className="block text-[#8E95A5] mb-1 font-mono font-bold">
                  Destination de stockage :
                </label>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setStorageChoice("Rayon");
                      setLocationInput("B1-RAY-02");
                    }}
                    className={`py-2 px-3 rounded border text-center transition-colors ${
                      storageChoice === "Rayon"
                        ? "bg-[#5B7A9D] border-[#5B7A9D] text-white font-bold"
                        : "bg-[#161A22] border-[#2B3342] text-[#8E95A5]"
                    }`}
                  >
                    En Rayon
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStorageChoice("Réserve");
                      setLocationInput("B1-RES-04");
                    }}
                    className={`py-2 px-3 rounded border text-center transition-colors ${
                      storageChoice === "Réserve"
                        ? "bg-[#5B7A9D] border-[#5B7A9D] text-white font-bold"
                        : "bg-[#161A22] border-[#2B3342] text-[#8E95A5]"
                    }`}
                  >
                    En Réserve
                  </button>
                </div>
              </div>

              {/* Saisie emplacement précis */}
              <div>
                <label className="block text-[#8E95A5] mb-1 font-mono font-bold">
                  Emplacement exact :
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Ex: B1-RAY-02 ou B1-RES-05"
                  className="w-full bg-[#161A22] border border-[#2B3342] text-white font-mono rounded px-3 py-2"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  confirmBoutiqueReception(
                    confirmModalData.dispatch.id,
                    confirmModalData.siteKey,
                    storageChoice,
                    locationInput,
                  );
                  setConfirmModalData(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded transition-colors shadow-xs"
              >
                Confirmer &amp; Actualiser le Stock Boutique
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
