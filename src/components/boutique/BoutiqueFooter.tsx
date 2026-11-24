"use client";

import React, { useState } from "react";
import type { BoutiqueSection } from "./BoutiqueNavbar";

interface BoutiqueFooterProps {
  onNavigate?: (section: BoutiqueSection) => void;
}

export default function BoutiqueFooter({ onNavigate }: BoutiqueFooterProps) {
  const [legalModal, setLegalModal] = useState<"cgv" | "mentions" | null>(null);

  const handleNav = (section: BoutiqueSection) => {
    if (onNavigate) {
      onNavigate(section);
    } else if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <footer className="bg-[#111111] text-[#E5E2DC] pt-12 pb-8 border-t border-[#252525] mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <span className="font-mono text-base font-extrabold tracking-widest text-white block">
              DARK-INK
            </span>
            <p className="text-[#888888] leading-relaxed text-[11px]">
              Maison indépendante de vestiaire fétiche, maroquinerie d&apos;art et club cruising privé depuis 2019.
            </p>
            <span className="font-mono text-[10px] text-[#F2F2F2] block">
              Paris Marais • Paris Bastille
            </span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
              Navigation
            </span>
            <ul className="space-y-1.5 text-[#A0A0A0]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("home")}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("stores")}
                  className="hover:text-white transition-colors"
                >
                  Nos Boutiques (Marais &amp; Bastille)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("cruising")}
                  className="hover:text-white transition-colors"
                >
                  Espace Cruising
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("products")}
                  className="hover:text-white transition-colors"
                >
                  Nos Produits
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Legal */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
              Engagements & Légal
            </span>
            <ul className="space-y-1.5 text-[#A0A0A0]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("contact")}
                  className="hover:text-white transition-colors"
                >
                  Nous Contacter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal("cgv")}
                  className="hover:text-white transition-colors"
                >
                  Les CGV (Conditions Générales)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal("mentions")}
                  className="hover:text-white transition-colors"
                >
                  Mentions Légales & Confidentialité
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("account")}
                  className="hover:text-white transition-colors"
                >
                  Espace Pro (B2B)
                </button>
              </li>
            </ul>
          </div>

          {/* Discretion Commitment */}
          <div className="space-y-2 font-mono text-[11px] text-[#888888]">
            <span className="text-xs font-bold uppercase tracking-wider text-white block font-sans">
              Charte de Discrétion
            </span>
            <p>• Expédition en colis brun neutre sans mention de contenu.</p>
            <p>• Libellé bancaire totalement banalisé.</p>
            <p>• Aucun partage de données à des tiers publicitaires.</p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between text-[#777777] text-[11px] gap-2 font-mono">
          <span>© 2019–2026 BOXMAN PARIS SAS. Tous droits réservés.</span>
          <span>Plateforme sécurisée TLS 1.3 • Hébergement France</span>
        </div>
      </div>

      {/* Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-black border border-[#E5E2DC] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                {legalModal === "cgv"
                  ? "Conditions Générales de Vente (CGV)"
                  : "Mentions Légales & Protection des Données"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="text-[#888888] hover:text-black font-mono text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[#555555] leading-relaxed">
              {legalModal === "cgv" ? (
                <>
                  <p>
                    <strong>Article 1 — Champ d&apos;application :</strong> Les présentes CGV régissent l&apos;ensemble des ventes d&apos;articles intimes, de bien-être et de billetterie cruising conclues sur la boutique en ligne ou en Click & Collect.
                  </p>
                  <p>
                    <strong>Article 2 — Majorité légale :</strong> La commande est strictement réservée aux personnes physiques âgées d&apos;au moins 18 ans au jour de la transaction.
                  </p>
                  <p>
                    <strong>Article 3 — Discrétion des envois :</strong> Tous les colis sont expédiés sous emballage banalisé neutre, scellé et opaque, sans aucune mention du site ni du type de contenu.
                  </p>
                  <p>
                    <strong>Article 4 — Droit de rétractation :</strong> Conformément à l&apos;article L221-28 du Code de la consommation, pour des raisons évidentes d&apos;hygiène et de protection de la santé, les articles descellés après livraison ne peuvent être renvoyés.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Éditeur du service :</strong> BOXMAN PARIS SAS au capital de 50 000 €, immatriculée au RCS de Paris sous le n° 849 203 112. Siège social : 18 rue Sainte-Croix-de-la-Bretonnerie, 75004 Paris.
                  </p>
                  <p>
                    <strong>Directeur de la publication :</strong> Laurent Dupont, Gérant.
                  </p>
                  <p>
                    <strong>Hébergement :</strong> Serveurs Cloud souverains situés en Île-de-France (Conformité RGPD et ISO-27001).
                  </p>
                  <p>
                    <strong>Protection des données :</strong> Vos données sont traitées uniquement pour l&apos;exécution des commandes et ne sont jamais revendues.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-[#E5E2DC] flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="bg-[#111111] text-white px-4 py-2 rounded text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
