"use client";

import React, { useState } from "react";

export default function BoutiqueContact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "question",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "question", message: "" });
    }, 4000);
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="border-b border-[#E5E2DC] pb-5">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F2F2F2] font-semibold">
          SERVICE CLIENTÈLE & ADRESSES
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-1">
          Nous Contacter & Visiter nos Espaces
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              Formulaire de Contact Discret
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Une réponse confidentielle vous sera adressée sous 24h ouvrées.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-xs space-y-1">
              <span className="font-bold block">Message transmis avec succès.</span>
              <p>
                Nos équipes traitent votre demande avec la plus stricte discrétion.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] mb-1 font-medium">
                    Nom ou Pseudonyme
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-[#E5E2DC] rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#F2F2F2]"
                  />
                </div>

                <div>
                  <label className="block text-[#555555] mb-1 font-medium">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-[#E5E2DC] rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#F2F2F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#555555] mb-1 font-medium">
                  Motif de la demande
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full border border-[#E5E2DC] rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#F2F2F2]"
                >
                  <option value="question">Conseil produit ou disponibilité</option>
                  <option value="cruising">Réservation ou question Cruising</option>
                  <option value="delivery">Suivi de livraison / Colis discret</option>
                  <option value="b2b">Partenariat Professionnel B2B</option>
                </select>
              </div>

              <div>
                <label className="block text-[#555555] mb-1 font-medium">
                  Votre message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border border-[#E5E2DC] rounded px-3 py-2 text-xs focus:outline-hidden focus:border-[#F2F2F2]"
                  placeholder="Détaillez votre question en toute confiance..."
                />
              </div>

              <button
                type="submit"
                className="bg-[#111111] hover:bg-[#F2F2F2] text-black text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded transition-colors shadow-xs"
              >
                Envoyer le message
              </button>
            </form>
          )}
        </div>

        {/* Store Locations & Access (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Boutique 1 : Boxxman */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-[#F2F2F2] uppercase font-bold tracking-wider">
                  BOUTIQUE GRAND PUBLIC &amp; CRUISING
                </span>
                <h3 className="text-base font-bold text-[#111111] mt-0.5">
                  Boxxman (Paris 1er)
                </h3>
              </div>
              <span className="font-mono text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Ouvert 7j/7
              </span>
            </div>

            <p className="text-xs text-[#555555] font-mono">
              2 rue de la Cossonnerie, 75001 Paris
              <br />
              Métros : Châtelet / Les Halles (L1, L4, L7, L11, L14, RER A, B, D)
            </p>

            <div className="pt-2 border-t border-[#F0EDE8] flex justify-between text-xs text-[#666666]">
              <span>Boutique : 10h&ndash;22h &bull; Cruising : 12h&ndash;02h</span>
              <span className="font-mono text-[#111111]">Tél : 01 42 60 21 59</span>
            </div>
          </div>

          {/* Boutique 2 : New Millénium */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-[#F2F2F2] uppercase font-bold tracking-wider">
                  GALERIE D&apos;ART &amp; HAUTE FÉTICHE
                </span>
                <h3 className="text-base font-bold text-[#111111] mt-0.5">
                  New Millénium (Paris 11e)
                </h3>
              </div>
              <span className="font-mono text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Mardi &ndash; Samedi
              </span>
            </div>

            <p className="text-xs text-[#555555] font-mono">
              37 rue Jean-Pierre Timbaud, 75011 Paris
              <br />
              Métros : Parmentier (L3), Oberkampf (L5, L9) ou République
            </p>

            <div className="pt-2 border-t border-[#F0EDE8] flex justify-between text-xs text-[#666666]">
              <span>Galerie : 12h00 &ndash; 20h00</span>
              <span className="font-mono text-[#111111]">Tél : 01 43 57 89 20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
