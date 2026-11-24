"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export type ERPTab =
  | "dashboard"
  | "orders"
  | "deliveries"
  | "returns"
  | "stocks"
  | "catalog"
  | "transfers"
  | "cash"
  | "accounting"
  | "hr";

export type BoutiqueSection =
  | "home"
  | "stores" // Page unifiée "Nos boutiques"
  | "cruising"
  | "products"
  | "contact"
  | "account"
  | "cart";

interface UniversalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Options de navigation
  erpActiveTab?: ERPTab;
  onErpTabChange?: (tab: ERPTab) => void;
  boutiqueActiveSection?: BoutiqueSection;
  onBoutiqueNavigate?: (sec: BoutiqueSection) => void;
}

export default function UniversalDrawer({
  isOpen,
  onClose,
  erpActiveTab = "dashboard",
  onErpTabChange,
  boutiqueActiveSection = "home",
  onBoutiqueNavigate,
}: UniversalDrawerProps) {
  const {
    appMode,
    setAppMode,
    resetDemo,
    user,
    loginUser,
    logoutUser,
    cart,
    language,
    setLanguage,
    catalogCategory,
    setCatalogCategory,
    toggleB2B,
    setCatalogSearchQuery,
  } = useApp();

  // Modale d'authentification rapide & Modale CGV / Légal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [legalModal, setLegalModal] = useState<"cgv" | "livraison" | "mentions" | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("alexandre.mercier@club-prive.fr");
  const [passwordInput, setPasswordInput] = useState("••••••••");
  const [nameInput, setNameInput] = useState("Alexandre Mercier");

  if (!isOpen) return null;

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Liste des onglets ERP pour la Partie 3
  const erpLinks: { id: ERPTab; label: string; icon: string; badge?: string }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: "⊞" },
    { id: "orders", label: "Commandes & Dispatch", icon: "❒", badge: "Flux" },
    { id: "stocks", label: "Stocks & Réserves Multi-Sites", icon: "▦" },
    { id: "cash", label: "Sécurité Caisse & Traçabilité", icon: "◈", badge: "Simu" },
    { id: "returns", label: "Retours & SAV Hygiène", icon: "↺" },
    { id: "catalog", label: "Catalogue & Studio IA", icon: "✧" },
    { id: "transfers", label: "Transferts & Flux Internes", icon: "⇄" },
    { id: "accounting", label: "Comptabilité, Facturation & Paie", icon: "€" },
    { id: "hr", label: "Gestion des salariés", icon: "⏱" },
  ];

  // Liste des onglets Boutique pour la Partie 3 (Avec "Nos boutiques" unifié !)
  const boutiqueLinks: { id: BoutiqueSection; label: string; icon: string; badge?: string }[] = [
    { id: "home", label: "Accueil Maison", icon: "⌂" },
    { id: "stores", label: "Nos Boutiques (Marais & Bastille)", icon: "🏛", badge: "2 Sites" },
    { id: "cruising", label: "Espace Cruising & Pass", icon: "◈", badge: "18+" },
    { id: "products", label: "Nos Produits & Vestiaire", icon: "▦" },
    { id: "cart", label: "Panier d'Achats", icon: "🛒", badge: totalCartCount > 0 ? `${totalCartCount}` : undefined },
    { id: "account", label: "Mon Compte & Carte QR", icon: "👤" },
    { id: "contact", label: "Nous Contacter", icon: "✉" },
  ];

  const handleSelectErpTab = (tab: ERPTab) => {
    setAppMode("erp");
    if (onErpTabChange) onErpTabChange(tab);
    onClose();
  };

  const handleSelectBoutiqueSec = (sec: BoutiqueSection) => {
    setAppMode("boutique");
    if (onBoutiqueNavigate) onBoutiqueNavigate(sec);
    onClose();
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: nameInput || "Alexandre Mercier",
      email: emailInput || "alexandre.mercier@club-prive.fr",
      role: "Membre Privilège",
    });
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop sombre */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* TIROIR VERTICAL (NE PREND STRICTEMENT PAS TOUT L'ÉCRAN : 75VW / MAX 290PX) */}
      <div
        style={{ width: "75vw", maxWidth: "290px" }}
        className="relative h-screen min-h-screen z-10 flex flex-col shadow-2xl overflow-hidden border-r border-[#262D3B] animate-in slide-in-from-left duration-250 shrink-0"
      >

        {/* ========================================================================= */}
        {/* LIGNE 1 : LES BOUTONS DE SWITCH ("ERP & Logistique" en badge blanc ovale en mode boutique) + FERMETURE */}
        {/* ========================================================================= */}
        <div className="bg-[#141822] border-b border-[#222938] p-3.5 shrink-0 select-none">
          <div className="flex items-center justify-between gap-2">
            {/* Mode Boutique : Supprimer badge orange DARKINK et afficher "ERP & Logistique" en badge blanc ovale */}
            {appMode === "boutique" ? (
              <div className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setAppMode("erp");
                    onClose();
                  }}
                  className="rounded-full bg-white hover:bg-gray-100 text-black font-extrabold px-4 py-2 text-xs font-mono flex items-center space-x-2 shadow-sm border border-gray-200 transition-all cursor-pointer select-none"
                  title="Basculer vers l'espace ERP & Logistique"
                >
                  <span className="text-sm leading-none">⚙</span>
                  <span className="tracking-tight">ERP &amp; Logistique</span>
                </button>
              </div>
            ) : (
              /* En mode ERP : conservation du switch complet */
              <div className="grid grid-cols-2 gap-1.5 flex-1 p-1 rounded-xl bg-[#0B0D12] border border-[#202531]">
                <button
                  type="button"
                  onClick={() => setAppMode("erp")}
                  className="py-2 px-2.5 rounded-lg text-xs font-semibold font-mono bg-[#252D3D] text-white shadow-xs border border-[#3E4A61] flex items-center justify-center space-x-1.5"
                >
                  <span>⚙</span>
                  <span className="truncate">ERP &amp; Logistique</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAppMode("boutique")}
                  className="py-2 px-2.5 rounded-lg text-xs font-semibold font-mono text-[#8E95A5] hover:text-white flex items-center justify-center space-x-1.5"
                >
                  <span>✦</span>
                  <span className="truncate">DARK-INK</span>
                </button>
              </div>
            )}

            {/* Bouton fermeture ✕ discret */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#2B3548] bg-[#1A202D] hover:bg-[#252E40] flex items-center justify-center text-white text-xs font-mono transition-colors shrink-0"
              aria-label="Fermer le menu"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VUE CONDITIONNELLE : QUAND ON EST SUR "ERP & LOGISTIQUE" */}
        {/* ========================================================================= */}
        {appMode === "erp" && (
          <div className="bg-[#080A0E] flex-1 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5B7A9D] font-bold block px-2 pb-2">
                MODULES ERP INTERNES
              </span>
              <nav className="space-y-1">
                {erpLinks.map((item) => {
                  const isActive = erpActiveTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectErpTab(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-colors ${isActive
                        ? "bg-[#1E2536] text-white border border-[#D4915E]/60 shadow-sm"
                        : "text-white hover:bg-[#121620]"
                        }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[#D4915E] text-sm font-mono">{item.icon}</span>
                        <span className="text-white font-bold">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-[#E5BAA3] border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Pied ERP : Reset démo */}
            <div className="pt-4 border-t border-[#1F242D] space-y-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Réinitialiser les données démo ?")) {
                    resetDemo();
                    onClose();
                  }
                }}
                className="w-full text-center text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-900/40 py-2 rounded-lg transition-colors"
              >
                Réinitialiser la démo
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VUE CONDITIONNELLE : QUAND ON EST SUR "DARK-INK" (BOUTIQUE EN LIGNE) */}
        {/* ========================================================================= */}
        {appMode === "boutique" && (
          <div className="bg-[#0A0C10] flex-1 flex flex-col justify-between overflow-y-auto p-4 space-y-5">
            <div className="space-y-5">

              {/* LIGNE 2 : Photo + Prénom uniquement + mon compte + le panier */}
              <div className="bg-[#121620] border border-[#222938] rounded-2xl p-3 flex items-center justify-between gap-2 shadow-xs">
                {/* Photo / Avatar Puppy + Prénom uniquement */}
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="w-9 h-9 rounded-full bg-[#1C2333] border border-[#D9A68B]/50 flex items-center justify-center text-[#D9A68B] shrink-0">
                    {/* Silhouette masque puppy */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M12 2C8.5 2 6 4.5 6 8c0 2 .8 3.8 2 5.1V18c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4.9c1.2-1.3 2-3.1 2-5.1 0-3.5-2.5-6-6-6zm-3.5 1L5 6l2.5 1L9 4.5 8.5 3zm7 0l-.5 1.5 1.5 2.5 2.5-1-3.5-3zM12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">
                      {user?.name ? user.name.split(" ")[0] : "Invité"}
                    </span>
                    <span className="text-[9px] font-mono text-[#D9A68B] block truncate">
                      {user ? (user.isB2B ? "Compte Pro B2B" : "Membre DARK-INK") : "Non connecté"}
                    </span>
                  </div>
                </div>

                {/* Bouton Mon Compte (Panier supprimé) */}
                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (user) {
                        handleSelectBoutiqueSec("account");
                      } else {
                        setShowAuthModal(true);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl border border-[#344057] bg-[#1A2230] hover:bg-[#252E40] text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Mon compte
                  </button>
                </div>
              </div>

              {/* SECTION 1 : NAVIGATION PRINCIPALE (SANS ICÔNES, TEXTE AGRANDI & LISIBLE) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5BAA3] font-bold block px-2">
                  NAVIGATION MAISON
                </span>
                <nav className="space-y-1.5">
                  {[
                    { id: "home" as const, label: "Commander", sub: "Accueil & Vestiaire en ligne" },
                    { id: "stores" as const, label: "New Millénium", sub: "Boutique Marais (Paris 11e)" },
                    { id: "cruising" as const, label: "Boxxman", sub: "Boutique Bastille & Cruising (Paris 1er)" },
                    { id: "contact" as const, label: "Nous Contacter", sub: "Service Client & Conseil" },
                  ].map((item) => {
                    const isActive = boutiqueActiveSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectBoutiqueSec(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${isActive
                          ? "bg-[#1E232E] text-white border border-[#E5BAA3]/60 font-bold"
                          : "text-[#E5E7EB] hover:text-white hover:bg-[#121620]"
                          }`}
                      >
                        <div>
                          <span className="block font-black text-sm text-white tracking-wide">{item.label}</span>
                          <span className="block text-xs text-[#9CA3AF] font-sans mt-0.5">{item.sub}</span>
                        </div>
                        <span className="text-sm font-bold text-[#E5BAA3]">→</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* SECTION 2 : RAYONS DU VESTIAIRE (TEXTE AGRANDI & SECTION RENOMMÉE EN "RAYONS") */}
              <div className="space-y-1.5 pt-2 border-t border-[#1F242D]">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E5BAA3] font-bold">
                    RAYONS
                  </span>
                  <span className="text-[10px] font-mono text-[#8E95A5]">13 Rayons</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { key: "ACCUEIL", label: "Tous les produits" },
                    { key: "BDSM", label: "BDSM", badge: "Kink" },
                    { key: "AROMES", label: "Arômes & Poppers", badge: "Puretés" },
                    { key: "ASS PLAY", label: "Ass Play & Plaisir" },
                    { key: "SEX TOYS", label: "Sex Toys & Cockrings" },
                    { key: "CUIR", label: "Cuir Pleine Fleur" },
                    { key: "LUBE & HYGIENE", label: "Lube & Hygiène" },
                    { key: "NEOPRENE", label: "Néoprène & Gear" },
                    { key: "GARDE ROBE", label: "Garde Robe Fetish" },
                    { key: "PUPPY PLAY GEAR", label: "Puppy Play Gear", badge: "K9" },
                    { key: "HOT DEALS", label: "Hot Deals & Promos", badge: "Deals", highlight: "rose" },
                    { key: "NEW", label: "Nouveautés", badge: "New", highlight: "amber" },
                    { key: "MARQUES", label: "Marques Phares" },
                    { key: "B2B", label: "Tarifs B2B (-30%)", badge: "Pro", highlight: "gold" },
                  ].map((c) => {
                    const isCatActive =
                      c.key === "ACCUEIL"
                        ? (!catalogCategory || catalogCategory === "all")
                        : c.key === "B2B"
                          ? user?.isB2B
                          : catalogCategory === c.key;

                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => {
                          if (c.key === "B2B") {
                            toggleB2B();
                          } else if (c.key === "ACCUEIL") {
                            setCatalogCategory("all");
                            handleSelectBoutiqueSec("home");
                          } else {
                            setCatalogCategory(c.key);
                            handleSelectBoutiqueSec("home");
                          }
                          onClose();
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-sans font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isCatActive
                            ? "bg-[#1C2230] text-[#E5BAA3] border border-[#E5BAA3]/50 font-black"
                            : c.highlight === "rose"
                            ? "text-rose-400 hover:bg-[#161B26]"
                            : c.highlight === "amber"
                            ? "text-amber-400 hover:bg-[#161B26]"
                            : c.highlight === "gold"
                            ? "text-[#E5BAA3] hover:bg-[#161B26]"
                            : "text-[#E5E7EB] hover:text-white hover:bg-[#141822]"
                        }`}
                      >
                        <span className="truncate">{c.label}</span>
                        {c.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                              c.highlight === "rose"
                                ? "bg-rose-950/40 text-rose-300 border-rose-800/40"
                                : c.highlight === "amber"
                                ? "bg-amber-950/40 text-amber-300 border-amber-800/40"
                                : "bg-[#E5BAA3]/20 text-[#E5BAA3] border-[#E5BAA3]/40"
                              }`}
                          >
                            {c.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3 : INFORMATIONS & CGV */}
              <div className="space-y-1.5 pt-2 border-t border-[#1F242D]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5BAA3] font-bold block px-2">
                  INFORMATIONS &amp; CGV
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setLegalModal("cgv")}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-sans text-gray-300 hover:text-white hover:bg-[#141822] flex items-center justify-between cursor-pointer"
                  >
                    <span>📜 Conditions Générales de Vente (CGV)</span>
                    <span className="text-[10px] text-gray-500">Lire</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLegalModal("livraison")}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-sans text-gray-300 hover:text-white hover:bg-[#141822] flex items-center justify-between cursor-pointer"
                  >
                    <span>📦 Expédition &amp; Colis 100% Discret</span>
                    <span className="text-[10px] text-gray-500">Détails</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLegalModal("mentions")}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-sans text-gray-300 hover:text-white hover:bg-[#141822] flex items-center justify-between cursor-pointer"
                  >
                    <span>🔒 Mentions Légales &amp; Confidentialité</span>
                    <span className="text-[10px] text-gray-500">Voir</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Pied Boutique : Espace Pro B2B & Switch ERP */}
            <div className="pt-4 border-t border-[#1F242D] space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-xs p-2.5 bg-[#121620] border border-[#222938] rounded-xl text-[#8E95A5]">
                <span>Tarifs Pro B2B (-30%)</span>
                <button
                  type="button"
                  onClick={toggleB2B}
                  className="font-bold text-[#E5BAA3] hover:underline cursor-pointer"
                >
                  {user?.isB2B ? "Désactiver" : "Activer (-30%)"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAppMode("erp");
                  onClose();
                }}
                className="w-full text-center text-gray-300 hover:text-white bg-[#141822] hover:bg-[#1E2536] border border-[#2B3548] py-2 rounded-lg transition-colors cursor-pointer"
              >
                Accéder à l&apos;ERP Logistique ↗
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALE CGV & CONDITIONS LÉGALES */}
      {legalModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl text-xs font-sans overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#1F242D] shrink-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {legalModal === "cgv"
                  ? "Conditions Générales de Vente (CGV)"
                  : legalModal === "livraison"
                    ? "Garantie Colis Discret & Livraison"
                    : "Mentions Légales & Données Privées"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-[#161A22] cursor-pointer"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-gray-300 leading-relaxed text-xs">
              {legalModal === "cgv" && (
                <>
                  <p className="font-bold text-white">1. Champ d&apos;application &amp; Identité du vendeur</p>
                  <p>Les présentes Conditions Générales de Vente régissent l&apos;ensemble des commandes passées auprès de DARK-INK Paris, atelier spécialisé dans le vestiaire fétiche haut de gamme, accessoires cuir, néoprène et soins intimes depuis 2003.</p>

                  <p className="font-bold text-white">2. Tarifs &amp; Remises Professionnelles B2B</p>
                  <p>Les prix indiqués sont en euros TTC (Toutes Taxes Comprises). Les comptes professionnels disposent d&apos;une tarification grossiste remisée de 30% sur l&apos;ensemble du vestiaire sur présentation de justificatif SIRET ou numéro de TVA intracommunautaire.</p>

                  <p className="font-bold text-white">3. Droit de rétractation (14 jours)</p>
                  <p>Conformément aux dispositions légales, vous disposez d&apos;un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation. Pour des raisons d&apos;hygiène strictes et de sécurité sanitaire, les articles scellés (flacons d&apos;arômes, lubrifiants, sondes, plugs) descellés ou utilisés ne peuvent faire l&apos;objet d&apos;un retour.</p>

                  <p className="font-bold text-white">4. Discrétion Bancaire</p>
                  <p>Votre débit bancaire apparaît sous un libellé neutre et banalisé (&quot;DK SERVICES&quot; ou &quot;DISTRIB LOG&quot;) ne faisant aucune mention du nom commercial ni de la nature des produits commandés.</p>
                </>
              )}

              {legalModal === "livraison" && (
                <>
                  <p className="font-bold text-white">1. Garantie Colis 100% Discret</p>
                  <p>Chaque commande est emballée dans un carton brun renforcé, parfaitement neutre, fermé par un ruban adhésif opaque sans logo ni marquage. L&apos;expéditeur mentionné sur l&apos;étiquette de transport est strictement banalisé (&quot;DK Logistique&quot;).</p>

                  <p className="font-bold text-white">2. Délais de préparation &amp; Transporteurs</p>
                  <p>Toute commande passée avant 14h est expédiée le jour même (du lundi au vendredi). Nous collaborons avec Colissimo Suivi 48h, Chronopost Express 24h et le réseau de points relais Mondial Relay.</p>

                  <p className="font-bold text-white">3. Click &amp; Collect Paris (1 heure)</p>
                  <p>Le retrait gratuit en boutique parisienne (Marais ou Bastille) est disponible 1 heure après validation de commande sur présentation de votre code secret de commande.</p>
                </>
              )}

              {legalModal === "mentions" && (
                <>
                  <p className="font-bold text-white">Éditeur &amp; Siège Social</p>
                  <p>DARK-INK PARIS SARL au capital de 50 000 € &bull; RCS Paris B 448 912 603 &bull; Siège : Paris 11e, France.</p>

                  <p className="font-bold text-white">Protection des Données &amp; RGPD</p>
                  <p>Vos informations personnelles sont hébergées sur des serveurs souverains sécurisés et ne sont jamais cédées ni partagées avec des tiers publicitaires. Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement total de votre compte sur simple demande.</p>
                </>
              )}
            </div>

            <div className="p-3 border-t border-[#1F242D] bg-[#0E1015] flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-lg bg-[#E5BAA3] text-black font-bold text-xs cursor-pointer"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE AUTHENTIFICATION RAPIDE */}
      {showAuthModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-[#2B3342] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-xs font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#D9A68B] font-bold">
                  ESPACE MEMBRE &bull; DARK-INK
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {authMode === "login" ? "Connexion Sécurisée" : "Créer un Compte Membre"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-[#8E95A5] hover:text-white px-2 py-1 rounded bg-[#161A22]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "register" && (
                <div>
                  <label className="block text-[#8E95A5] mb-1">Nom ou Pseudonyme</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#161A22] border border-[#2B3342] text-white rounded px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#8E95A5] mb-1">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#2B3342] text-white rounded px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8E95A5] mb-1">Mot de Passe</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#2B3342] text-white rounded px-3 py-2 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D9A68B] hover:bg-[#8F6841] text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs"
              >
                {authMode === "login" ? "Se Connecter" : "Créer Mon Compte"}
              </button>
            </form>

            <div className="pt-2 border-t border-[#1F242D] text-center text-[11px] text-[#8E95A5]">
              {authMode === "login" ? (
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className="hover:underline text-[#E5BAA3]"
                >
                  Pas encore de compte ? S&apos;inscrire &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="hover:underline text-[#E5BAA3]"
                >
                  Déjà membre ? Se connecter &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
