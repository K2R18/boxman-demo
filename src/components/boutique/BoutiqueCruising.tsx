"use client";

import React, { useState } from "react";
import { cruisingOffers, type CruisingOffer } from "@/data/cruising";
import { useApp, type CruisingReservation } from "@/context/AppContext";

export default function BoutiqueCruising() {
  const { language, user, addCruisingReservation } = useApp();
  const [confirmedPass, setConfirmedPass] = useState<CruisingReservation | null>(
    null,
  );

  const handleBook = (offer: CruisingOffer, mode: "online" | "cash") => {
    const reservation = addCruisingReservation({
      offerId: offer.id,
      offerName: offer.name,
      price: offer.price,
      paymentMode: mode,
    });

    setConfirmedPass(reservation);
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Introduction */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2F2F2]/10 border border-[#F2F2F2]/30">
          <span className="w-2 h-2 rounded-full bg-[#F2F2F2] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#F2F2F2] font-bold">
            BOUTIQUE GRAND PUBLIC • COMPLEXE CRUISING PRIVATISÉ (18+)
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111111]">
          Boxxman — Boutique &amp; Espace Cruising
        </h1>
        <p className="text-sm text-[#555555] leading-relaxed">
          Établie au <strong>2 rue de la Cossonnerie, 75001 Paris</strong> (Quartier Les Halles / Châtelet), la boutique <strong>Boxxman</strong> réunit un vaste espace grand public au rez-de-chaussée (accessoires, sex-toys, poppers, underwear et vestiaire) et son complexe Cruising sécurisé et immersif aménagé sous les voûtes historiques en pierre du sous-sol.
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#888888] pt-2">
          <span>Boutique : 10h00 &ndash; 22h00</span>
          <span>•</span>
          <span>Cruising : 12h00 &ndash; 02h00 (7j/7)</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">Métro Châtelet / Les Halles</span>
        </div>
      </section>

      {/* Ambiance & Rules */}
      <section className="bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#555555]">
        <div className="space-y-1.5">
          <span className="font-mono text-xs font-bold text-[#F2F2F2] uppercase block">
            Rez-de-Chaussée • Boutique Grand Public
          </span>
          <p>
            Vaste sélection de jouets intimes, cockrings, poppers authentiques, gels, lotions et vestiaire streetwear &amp; fetish accessible à tous sans tabou.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-xs font-bold text-[#F2F2F2] uppercase block">
            Sous-Sol Voûté • Complexe Cruising 18+
          </span>
          <p>
            Labyrinthe sensoriel obscur, sling suspensions en acier renforcé, cabines privatives, douches chaudes à l&apos;italienne et vestiaires sécurisés avec bracelets RFID.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-xs font-bold text-[#F2F2F2] uppercase block">
            Règles &amp; Discrétion Totale
          </span>
          <p>
            Le respect absolu et le consentement mutuel sont obligatoires. Accès discret par le 2 rue de la Cossonnerie. Règlement anonyme en espèces au guichet ou réservation CB discrète.
          </p>
        </div>
      </section>

      {/* Offers Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cruisingOffers.map((offer) => {
          const trans = offer.description[language] || offer.description.fr;
          const isBestValue = offer.id === "cruise-003";

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-200 border ${
                isBestValue
                  ? "border-[#F2F2F2] shadow-md ring-1 ring-[#F2F2F2]/20"
                  : "border-[#E5E2DC] hover:border-[#F2F2F2]/50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#111111]">
                    {offer.name}
                  </h3>
                  {isBestValue && (
                    <span className="font-mono text-[10px] bg-[#F2F2F2] text-black px-2 py-0.5 rounded font-bold uppercase">
                      Économie 20%
                    </span>
                  )}
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold font-mono text-[#111111]">
                    {offer.price.toFixed(2)} €
                  </span>
                  <span className="text-xs text-[#777777]">TTC</span>
                </div>

                <p className="text-xs text-[#666666] leading-relaxed">
                  {trans}
                </p>

                <ul className="space-y-1.5 text-xs text-[#555555] font-mono pt-2 border-t border-[#F0EDE8]">
                  <li>• Accès direct par Boutique 1 (Marais)</li>
                  <li>• Casier vestiaire sécurisé individuel</li>
                  <li>• Serviette propre & protections incluses</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-[#F0EDE8]">
                <button
                  type="button"
                  onClick={() => handleBook(offer, "online")}
                  className="w-full bg-[#111111] hover:bg-[#F2F2F2] text-black text-xs font-semibold uppercase tracking-wider py-3 rounded transition-colors shadow-xs"
                >
                  Payer en ligne (CB discrète)
                </button>
                <button
                  type="button"
                  onClick={() => handleBook(offer, "cash")}
                  className="w-full bg-white hover:bg-[#FAF9F6] text-[#111111] border border-[#E5E2DC] hover:border-[#111111] text-xs font-semibold uppercase tracking-wider py-2.5 rounded transition-colors"
                >
                  Réserver en ligne & payer en espèces sur place
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Confirmation Pass Modal */}
      {confirmedPass && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E2DC] rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#F2F2F2] font-semibold">
                RÉSERVATION ENREGISTRÉE AVEC SUCCÈS
              </span>
              <h2 className="text-2xl font-bold text-[#111111]">
                Votre Pass Cruising Numérique
              </h2>
            </div>

            {/* Pass Card */}
            <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-start border-b border-[#E5E2DC] pb-3">
                <div>
                  <span className="font-mono text-xs uppercase text-[#888888] block">
                    Formule & Lieu
                  </span>
                  <span className="font-bold text-sm text-[#111111]">
                    {confirmedPass.offerName}
                  </span>
                  <span className="text-[11px] text-[#F2F2F2] block font-medium">
                    Boutique 1 — Marais
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs uppercase text-[#888888] block">
                    Statut Règlement
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      confirmedPass.paymentMode === "online"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {confirmedPass.status}
                  </span>
                </div>
              </div>

              {/* QR Code Graphic for Admission */}
              <div className="flex items-center justify-center py-2">
                <div className="w-36 h-36 bg-black rounded-lg flex flex-col items-center justify-center text-white space-y-1 shadow-inner">
                  <div className="w-24 h-24 border-2 border-white/80 p-1 flex items-center justify-center">
                    <span className="font-mono text-xs font-extrabold tracking-widest text-center">
                      CRUISING<br />PASS<br />B1
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E2DC] flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#888888] block">Code Réservation :</span>
                  <span className="font-bold text-sm text-[#111111]">
                    {confirmedPass.code}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#888888] block">Montant :</span>
                  <span className="text-sm font-bold text-[#111111]">
                    {confirmedPass.price.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#666666] leading-relaxed">
              {confirmedPass.paymentMode === "cash"
                ? "Présentez simplement ce code à l'accueil de la Boutique 1 pour régler en espèces et accéder directement aux vestiaires."
                : "Votre pass est payé et activé. Présentez ce code à l'accueil de la Boutique 1 pour retirer votre bracelet vestiaire."}
            </p>

            <button
              type="button"
              onClick={() => setConfirmedPass(null)}
              className="w-full bg-[#111111] hover:bg-[#F2F2F2] text-black text-xs font-semibold uppercase tracking-wider py-3 rounded transition-colors"
            >
              Fermer et conserver mon pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
