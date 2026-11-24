"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import type { BoutiqueSection } from "./BoutiqueNavbar";

interface BoutiqueCartProps {
  onNavigate: (section: BoutiqueSection) => void;
}

export default function BoutiqueCart({ onNavigate }: BoutiqueCartProps) {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    user,
    language,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState("colissimo");
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Promo code input state
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const deliveryPrices: Record<string, number> = {
    b1: 0,
    b2: 0,
    colissimo: 4.9,
    mondial: 3.5,
    express: 9.9,
  };

  const deliveryLabels: Record<string, string> = {
    b1: "Retrait Click & Collect — Boutique 1 (Marais)",
    b2: "Retrait Click & Collect — Boutique 2 (Bastille)",
    colissimo: "La Poste Colissimo (Colis neutre discret)",
    mondial: "Mondial Relay (Point relais sécurisé)",
    express: "Chronopost / DHL Express 24h",
  };

  const cartItemsWithDetails = cart
    .map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) return null;
      const unitPrice = user?.isB2B ? p.price * 0.7 : p.price;
      return {
        ...item,
        product: p,
        unitPrice,
        subtotal: unitPrice * item.qty,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotalProducts = cartItemsWithDetails.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  let initialDeliveryCost =
    cartItemsWithDetails.length > 0 ? deliveryPrices[deliveryMethod] || 0 : 0;

  // Calcul dynamique de la remise du Code Promo
  let discountAmount = 0;
  let finalDeliveryCost = initialDeliveryCost;

  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discountAmount = (subtotalProducts * appliedPromo.value) / 100;
    } else if (appliedPromo.type === "fixed") {
      discountAmount = Math.min(subtotalProducts, appliedPromo.value);
    } else if (appliedPromo.type === "freeship") {
      finalDeliveryCost = 0;
      discountAmount = initialDeliveryCost;
    }
  }

  const grandTotal = Math.max(
    0,
    subtotalProducts - (appliedPromo?.type !== "freeship" ? discountAmount : 0) + finalDeliveryCost,
  );

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      setPromoFeedback({ text: "Veuillez renseigner un code promotionnel.", isError: true });
      return;
    }
    const res = applyPromoCode(code);
    if (res.valid) {
      setPromoFeedback({ text: res.message, isError: false });
      setPromoInput("");
    } else {
      setPromoFeedback({ text: res.message, isError: true });
    }
  };

  const handleCheckout = () => {
    const num = `BX-CMD-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderNumber(num);
    setIsOrdered(true);
    clearCart();
    removePromoCode();
  };

  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="border-b border-[#E5E2DC] pb-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D9A68B] font-semibold">
            PANIER &amp; COMMANDE SÉCURISÉE
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] mt-0.5">
            Votre Panier d&apos;Achats
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("products")}
          className="text-xs text-[#D9A68B] hover:underline font-medium"
        >
          &larr; Continuer mes achats
        </button>
      </div>

      {isOrdered ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded font-bold">
            COMMANDE CONFIRMÉE
          </span>
          <h2 className="text-2xl font-bold text-[#111111]">
            Merci pour votre commande !
          </h2>
          <p className="text-xs text-[#666666] max-w-md mx-auto">
            Votre commande <strong className="font-mono text-[#111111]">{orderNumber}</strong> est en cours de préparation discrète dans notre atelier central.
          </p>
          <div className="bg-[#FAF9F6] border border-[#E5E2DC] p-4 rounded-lg max-w-sm mx-auto text-xs font-mono text-[#555555]">
            <p>Mode sélectionné : {deliveryLabels[deliveryMethod]}</p>
            <p className="text-[11px] text-[#888888] mt-1">
              Libellé bancaire neutre : &quot;LOGISTICS DISTRIBUTION PARIS&quot;
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOrdered(false);
              onNavigate("products");
            }}
            className="bg-[#111111] hover:bg-[#D9A68B] text-white text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded transition-colors"
          >
            Retourner au catalogue
          </button>
        </div>
      ) : cartItemsWithDetails.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center space-y-4">
          <p className="text-sm text-[#777777]">Votre panier est actuellement vide.</p>
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="bg-[#111111] hover:bg-[#D9A68B] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded transition-colors"
          >
            Découvrir nos produits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-[#E5E2DC] rounded-xl divide-y divide-[#F0EDE8]">
              {cartItemsWithDetails.map((item) => {
                const trans =
                  item.product.translations[language] ||
                  item.product.translations.fr;
                return (
                  <div
                    key={item.productId}
                    className="p-4 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-[#D9A68B] font-semibold">
                        {item.product.sku}
                      </span>
                      <h3 className="font-bold text-[#111111] truncate mt-0.5">
                        {trans.name}
                      </h3>
                      <div className="font-mono text-[11px] text-[#777777] mt-0.5">
                        {item.unitPrice.toFixed(2)} € / unité &bull; {item.product.size}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-1.5 border border-[#E5E2DC] rounded p-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQty(item.productId, item.qty - 1)
                        }
                        className="w-5 h-5 flex items-center justify-center font-bold text-[#111111] hover:bg-[#FAF9F6]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQty(item.productId, item.qty + 1)
                        }
                        className="w-5 h-5 flex items-center justify-center font-bold text-[#111111] hover:bg-[#FAF9F6]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm text-[#111111]">
                        {item.subtotal.toFixed(2)} €
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] text-rose-500 hover:underline mt-0.5"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Method Options */}
            <div className="bg-white border border-[#E5E2DC] rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Mode de Livraison &amp; Retrait
              </h2>
              <div className="space-y-2 text-xs font-mono">
                {Object.entries(deliveryLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors ${
                      deliveryMethod === key
                        ? "bg-[#FAF9F6] border-[#D9A68B] text-[#111111]"
                        : "bg-white border-[#E5E2DC] text-[#666666]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="cartDelivery"
                        checked={deliveryMethod === key}
                        onChange={() => setDeliveryMethod(key)}
                        className="accent-[#D9A68B]"
                      />
                      <span>{label}</span>
                    </div>
                    <span className="font-bold">
                      {appliedPromo?.type === "freeship" && key !== "express"
                        ? "Offert"
                        : deliveryPrices[key] === 0
                        ? "Gratuit"
                        : `${deliveryPrices[key].toFixed(2)} €`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-4 text-xs shadow-2xs">
              <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider pb-2 border-b border-[#F0EDE8]">
                Récapitulatif de la Commande
              </h2>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-[#666666]">
                  <span>Sous-total articles :</span>
                  <span>{subtotalProducts.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-[#666666]">
                  <span>Frais de livraison :</span>
                  <span>
                    {finalDeliveryCost === 0
                      ? "Gratuit / Offert"
                      : `${finalDeliveryCost.toFixed(2)} €`}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/60 p-1.5 rounded border border-emerald-200/60">
                    <span>Remise ({appliedPromo.code}) :</span>
                    <span>
                      {appliedPromo.type === "freeship"
                        ? "Port offert"
                        : `-${discountAmount.toFixed(2)} €`}
                    </span>
                  </div>
                )}

                {user?.isB2B && (
                  <div className="flex justify-between text-[#D9A68B] font-semibold">
                    <span>Remise Professionnelle B2B :</span>
                    <span>-30% Inclus</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E5E2DC] flex justify-between text-base font-extrabold text-[#111111]">
                  <span>Total TTC :</span>
                  <span>{grandTotal.toFixed(2)} €</span>
                </div>
              </div>

              {/* SECTION CODE PROMO (Placée entre TOTAL TTC et Garantie Colis Discret) */}
              <div className="pt-3 border-t border-[#F0EDE8] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Code Promotionnel ou Avantage
                  </h3>
                  {appliedPromo && (
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Actif : {appliedPromo.code}
                    </span>
                  )}
                </div>

                {appliedPromo ? (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-emerald-900">{appliedPromo.code}</span>
                      <span className="text-emerald-700 block text-[11px] font-sans">
                        {appliedPromo.description}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removePromoCode();
                        setPromoFeedback(null);
                      }}
                      className="text-xs text-rose-600 hover:underline font-sans cursor-pointer"
                    >
                      Retirer le code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Ex: DARK10, VIP20, FREESHIP"
                        className="flex-1 bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#D9A68B]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyPromo()}
                        className="bg-[#111111] hover:bg-[#D9A68B] text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer shrink-0"
                      >
                        Appliquer
                      </button>
                    </div>

                    {/* Suggestion tags demo */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-[#777777]">
                      <span>Codes test :</span>
                      <button
                        type="button"
                        onClick={() => handleApplyPromo("DARK10")}
                        className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#D9A68B] text-[#111111] cursor-pointer"
                      >
                        DARK10 (-10%)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPromo("VIP20")}
                        className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#D9A68B] text-[#111111] cursor-pointer"
                      >
                        VIP20 (-20%)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPromo("FREESHIP")}
                        className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#D9A68B] text-[#111111] cursor-pointer"
                      >
                        FREESHIP
                      </button>
                    </div>

                    {promoFeedback && (
                      <div
                        className={`p-2.5 rounded text-xs ${
                          promoFeedback.isError
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {promoFeedback.text}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Discrete Packaging Callout */}
              <div className="bg-[#FAF9F6] border border-[#E5E2DC] p-3 rounded text-[11px] text-[#555555] space-y-1">
                <span className="font-bold text-[#111111] block font-mono">
                  Garantie Colis Discret :
                </span>
                <p>
                  Carton brun neutre, ruban adhésif opaque sans logo, expéditeur banalisé.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full bg-[#111111] hover:bg-[#D9A68B] text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded transition-colors shadow-xs"
              >
                Valider ma commande ({grandTotal.toFixed(2)} €)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
