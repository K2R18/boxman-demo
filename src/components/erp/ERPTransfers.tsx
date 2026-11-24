"use client";

import React, { useState } from "react";
import { useApp, type StockTransfer } from "@/context/AppContext";
import { products } from "@/data/products";
import { sites } from "@/data/sites";

export default function ERPTransfers() {
  const { stocks, transfers, createTransfer, messages, addMessage, currentRole } =
    useApp();

  // Form states
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [fromSite, setFromSite] = useState("Dark Ink");
  const [toSite, setToSite] = useState("Boxxman — Rayon");
  const [qty, setQty] = useState(10);
  const [operator, setOperator] = useState("Lucas Moreau (Dark Ink)");
  const [activeReceipt, setActiveReceipt] = useState<StockTransfer | null>(
    transfers[0] || null,
  );

  // Message states
  const [msgSender, setMsgSender] = useState("Laurent Dupont");
  const [msgSite, setMsgSite] = useState("Dark Ink");
  const [msgContent, setMsgContent] = useState("");

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromSite === toSite) {
      alert("Le site d'origine et le site de destination doivent être distincts.");
      return;
    }
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const newTr = createTransfer({
      productId: product.id,
      productName: product.name,
      fromSite,
      toSite,
      qty,
      operator,
    });

    setActiveReceipt(newTr);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgContent.trim()) return;
    addMessage({
      sender: msgSender,
      site: msgSite,
      content: msgContent.trim(),
    });
    setMsgContent("");
  };

  const activeProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F242D] gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Transferts Inter-Sites & Bons de Cession
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Mouvements physiques de stock entre plateformes • Valorisation interne
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#5B7A9D] bg-[#5B7A9D]/10 border border-[#5B7A9D]/30 px-2.5 py-1 rounded">
            Rapprochement automatisé
          </span>
        </div>
      </div>

      {/* Grid: Create Transfer Form (Left) & Bon de Cession Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#12151B] border border-[#1F242D] rounded-lg p-5 space-y-4">
          <div className="pb-3 border-b border-[#1F242D]">
            <h2 className="text-sm font-bold text-[#E2E4E9]">
              Émettre un Transfert de Marchandises
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Déduit le stock à la source et crédite le site destinataire
            </p>
          </div>

          <form onSubmit={handleCreateTransfer} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#8E95A5] mb-1 font-medium">
                Article à transférer
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Site Expéditeur (Origine)
                </label>
                <select
                  value={fromSite}
                  onChange={(e) => setFromSite(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-2.5 py-2 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Site Destinataire
                </label>
                <select
                  value={toSite}
                  onChange={(e) => setToSite(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-2.5 py-2 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Quantité à transférer
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#5B7A9D]"
                />
              </div>

              <div>
                <label className="block text-[#8E95A5] mb-1 font-medium">
                  Opérateur Logistique
                </label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold py-2.5 rounded transition-colors shadow-xs"
              >
                Créer le transfert & Générer bon de cession
              </button>
            </div>
          </form>
        </div>

        {/* Bon de Cession Interne Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#12151B] border border-[#1F242D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-[#E2E4E9]">
                Bon de Cession Interne
              </h2>
              {activeReceipt && (
                <span className="font-mono text-[11px] text-[#5B7A9D] font-bold">
                  {activeReceipt.transferNumber}
                </span>
              )}
            </div>
            {activeReceipt && (
              <span className="font-mono text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
                Statut : {activeReceipt.status}
              </span>
            )}
          </div>

          {activeReceipt ? (
            <div className="bg-[#161A22] border border-[#272F3E] rounded p-5 space-y-4 text-xs font-mono">
              <div className="flex justify-between items-start border-b border-[#272F3E] pb-3 font-sans">
                <div>
                  <span className="font-mono text-xs font-bold text-[#E2E4E9] block">
                    BOXMAN LOGISTICS SAS
                  </span>
                  <p className="text-[11px] text-[#6B7280]">
                    Document légal de transfert de stock intragroupe
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-[#8E95A5] block">
                    Date d&apos;émission
                  </span>
                  <span className="font-mono text-xs text-white">
                    {activeReceipt.date}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-sans text-xs bg-[#111319] p-3 rounded border border-[#222733]">
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block">
                    Provenance (Expéditeur)
                  </span>
                  <span className="font-semibold text-white">
                    {activeReceipt.fromSite}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block">
                    Destination (Réceptionnaire)
                  </span>
                  <span className="font-semibold text-white">
                    {activeReceipt.toSite}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between py-1 border-b border-[#222733] text-neutral-400 font-sans text-[11px]">
                  <span>Article désignation</span>
                  <span className="font-mono">Quantité</span>
                </div>
                <div className="flex justify-between py-1.5 text-white font-sans text-xs font-medium">
                  <span>{activeReceipt.productName}</span>
                  <span className="font-mono font-bold text-sky-400">
                    {activeReceipt.qty} unités
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#272F3E] flex justify-between items-center text-[11px] text-[#8E95A5] font-sans">
                <span>Visa Opérateur : {activeReceipt.operator}</span>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Bon de cession [${activeReceipt.transferNumber}] téléchargé au format PDF interne.`,
                    )
                  }
                  className="text-xs text-[#5B7A9D] hover:text-[#7DA1C9] font-semibold"
                >
                  Télécharger PDF →
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#6B7280] py-8 text-center">
              Aucun bon de cession sélectionné.
            </p>
          )}

          {/* Transfers History List */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-[#8E95A5] uppercase tracking-wider block mb-2">
              Derniers flux validés ({transfers.length})
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {transfers.map((tr) => (
                <div
                  key={tr.id}
                  onClick={() => setActiveReceipt(tr)}
                  className={`p-2.5 rounded text-xs border cursor-pointer transition-colors flex items-center justify-between ${
                    activeReceipt?.id === tr.id
                      ? "bg-[#1C2330] border-[#5B7A9D]"
                      : "bg-[#14171E] border-transparent hover:bg-[#181C25]"
                  }`}
                >
                  <div>
                    <span className="font-mono text-sky-400 font-bold mr-2">
                      {tr.transferNumber}
                    </span>
                    <span className="text-[#E2E4E9]">
                      {tr.qty}x {tr.productName}
                    </span>
                    <div className="text-[11px] text-[#6B7280]">
                      {tr.fromSite} → {tr.toSite}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded">
                    {tr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Internal Messaging Section */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
          <div>
            <h2 className="text-sm font-bold text-[#E2E4E9]">
              Messagerie Interne Instantanée Multi-Sites
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Canal sécurisé entre l&apos;Entrepôt Central, Boutique 1 et Boutique 2
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Messages list (8 cols) */}
          <div className="lg:col-span-8 space-y-2.5 max-h-60 overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <p className="text-xs text-[#6B7280] py-4">Aucun message pour le moment.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#161A22] border border-[#232936] p-3 rounded text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{m.sender}</span>
                      <span className="text-[11px] font-mono text-[#5B7A9D] bg-[#5B7A9D]/15 px-1.5 py-0.2 rounded">
                        {m.site}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#6B7280]">
                      {m.time}
                    </span>
                  </div>
                  <p className="text-[#D1D5DB] leading-relaxed">{m.content}</p>
                </div>
              ))
            )}
          </div>

          {/* New Message Form (4 cols) */}
          <form
            onSubmit={handleSendMessage}
            className="lg:col-span-4 bg-[#161A22] border border-[#232936] p-3.5 rounded text-xs space-y-3"
          >
            <div>
              <label className="block text-[#8E95A5] mb-1 font-medium">
                Expéditeur
              </label>
              <input
                type="text"
                value={msgSender}
                onChange={(e) => setMsgSender(e.target.value)}
                className="w-full bg-[#12151B] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
              />
            </div>

            <div>
              <label className="block text-[#8E95A5] mb-1 font-medium">
                Site
              </label>
              <select
                value={msgSite}
                onChange={(e) => setMsgSite(e.target.value)}
                className="w-full bg-[#12151B] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
              >
                <option value="Dark Ink">Dark Ink</option>
                <option value="Boxxman — Rayon">Boxxman — Rayon</option>
                <option value="New Millenium — Rayon">New Millenium — Rayon</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8E95A5] mb-1 font-medium">
                Message
              </label>
              <textarea
                rows={2}
                placeholder="Transmettre une consigne ou une alerte..."
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
                className="w-full bg-[#12151B] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-[#5B7A9D]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold py-2 rounded transition-colors"
            >
              Diffuser le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
