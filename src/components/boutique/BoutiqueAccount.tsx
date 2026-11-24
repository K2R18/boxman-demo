"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function BoutiqueAccount() {
  const { user, loginUser, logoutUser, toggleB2B, cruisingReservations } =
    useApp();
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;
    loginUser({
      name: loginName.trim(),
      email: loginEmail.trim() || "membre@boxman-paris.fr",
      role: "Membre Privilège",
      isB2B: false,
      loyaltyPoints: 200,
      cruisingEntries: 2,
      cardNumber: `BX-${Math.floor(1000 + Math.random() * 9000)}-PARIS`,
    });
  };

  const cashReservations = cruisingReservations.filter(
    (r) => r.paymentMode === "cash",
  );

  return (
    <div className="space-y-12 py-8 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="border-b border-[#E5E2DC] pb-5">
        <span className="font-mono text-xs uppercase tracking-widest text-[#D9A68B] font-semibold">
          ESPACE CLIENT & CARTE NUMÉRIQUE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-1">
          Mon Compte & Carte Privilège
        </h1>
      </div>

      {!user ? (
        /* Not logged in: Quick login form */
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#111111]">
              Connexion à votre espace membre
            </h2>
            <p className="text-xs text-[#666666]">
              Accédez à votre carte QR numérique, vos entrées cruising et vos réservations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 max-w-md text-xs">
            <div>
              <label className="block text-[#555555] mb-1 font-medium">
                Nom ou Pseudonyme
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Alexandre M."
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full border border-[#E5E2DC] rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#D9A68B]"
              />
            </div>

            <div>
              <label className="block text-[#555555] mb-1 font-medium">
                Adresse e-mail (facultative)
              </label>
              <input
                type="email"
                placeholder="client@domaine.fr"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border border-[#E5E2DC] rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#D9A68B]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#111111] hover:bg-[#D9A68B] text-white text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded transition-colors"
            >
              Se connecter à mon compte
            </button>
          </form>
        </div>
      ) : (
        /* Logged In Dashboard */
        <div className="space-y-8">
          {/* Universal Digital Member Card */}
          <div className="bg-linear-to-br from-[#1A1D24] to-[#0F1115] text-white rounded-2xl p-6 sm:p-8 border border-[#2B313E] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A68B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#D9A68B] font-semibold block">
                    BOXMAN PRIVILÈGE CLUB
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                    {user.name}
                  </h2>
                  <p className="text-xs text-[#8E95A5] font-mono mt-0.5">
                    {user.role} {user.isB2B && "• Partenaire B2B Agréé"}
                  </p>
                </div>

                {/* Balances */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2A313E] font-mono">
                  <div>
                    <span className="text-[10px] text-[#8E95A5] uppercase block">
                      Points Fidélité
                    </span>
                    <span className="text-2xl font-extrabold text-[#E5BAA3]">
                      {user.loyaltyPoints} pts
                    </span>
                    <span className="text-[10px] text-[#6B7280] block">
                      Crédités sur catalogue
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#8E95A5] uppercase block">
                      Entrées Cruising Actives
                    </span>
                    <span className="text-2xl font-extrabold text-sky-400">
                      {user.cruisingEntries} disponibles
                    </span>
                    <span className="text-[10px] text-[#6B7280] block">
                      Accès direct Boutique 1
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl self-center sm:self-auto shadow-md">
                <div className="w-28 h-28 bg-[#111111] rounded flex flex-col items-center justify-center text-white space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-center font-bold">
                    BOXMAN<br />PASS
                  </span>
                  <span className="w-12 h-0.5 bg-[#D9A68B]"></span>
                  <span className="font-mono text-[8px] text-[#D9A68B]">
                    SCAN COMPTOIR
                  </span>
                </div>
                <span className="font-mono text-[10px] text-black font-bold mt-2">
                  {user.cardNumber || "BX-8842-PARIS"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A313E] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#8E95A5] font-mono gap-2 relative z-10">
              <span>Présentez cet écran au comptoir de Boutique 1 ou 2 pour valider vos entrées et remises.</span>
              <button
                type="button"
                onClick={logoutUser}
                className="text-rose-400 hover:underline text-left sm:text-right"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Pending Cash Reservations Section */}
          {cashReservations.length > 0 && (
            <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EDE8] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111111]">
                    Réservations Cruising à Régler sur Place en Espèces
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Présentez ces codes à l&apos;accueil de la Boutique 1 (Marais)
                  </p>
                </div>
                <span className="font-mono text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                  {cashReservations.length} en attente
                </span>
              </div>

              <div className="space-y-2.5">
                {cashReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-[#111111] text-sm block">
                        {res.offerName}
                      </span>
                      <span className="text-[11px] text-[#888888]">
                        Code guichet : <strong className="text-black">{res.code}</strong> • {res.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#D9A68B] block">
                        {res.price.toFixed(2)} €
                      </span>
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                        À régler en caisse
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B2B Toggle Switch Section */}
          <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-[#111111]">
                    Bascule Espace Pro (B2B)
                  </h3>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                      user.isB2B
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {user.isB2B ? "ACTIF : -30%" : "INACTIF"}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Basculez votre compte en profil professionnel pour bénéficier
                  immédiatement de <strong>-30 % de remise dédiée sur le catalogue</strong> et de l&apos;option de commande sur facture avec paiement différé.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleB2B}
                className={`shrink-0 px-5 py-2.5 rounded font-mono text-xs font-bold transition-all shadow-xs ${
                  user.isB2B
                    ? "bg-[#D9A68B] text-white hover:bg-[#A87357]"
                    : "bg-[#111111] text-white hover:bg-[#D9A68B]"
                }`}
              >
                {user.isB2B ? "Désactiver le mode Pro" : "Activer le mode Pro (-30%)"}
              </button>
            </div>

            {user.isB2B && (
              <div className="bg-[#FAF9F6] border border-[#E5E2DC] p-4 rounded-lg text-xs space-y-1 font-mono text-[#555555]">
                <p className="font-bold text-[#111111]">
                  Conditions B2B Applicables :
                </p>
                <p>• -30% immédiat sur tous les tarifs publics affichés.</p>
                <p>• Facturation hors taxes avec TVA déductible certifiée.</p>
                <p>• Règlement à 30 jours fin de mois après ouverture de compte validée.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
