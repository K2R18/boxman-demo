"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function AgeModal() {
  const { ageVerified, setAgeVerified, mounted } = useApp();

  // If already verified or server-rendering, don't show
  if (!mounted || ageVerified) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#D9A68B] font-semibold">
            ACCÈS RÉSERVÉ AUX PERSONNES MAJEURES
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
            Vérification de majorité (+18 ans)
          </h2>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Ce site présente des produits intimes, de bien-être corporel et des
            espaces réservés à un public adulte et averti.
          </p>
        </div>

        <div className="pt-2 border-t border-[#E5E2DC] space-y-3">
          <button
            type="button"
            onClick={() => setAgeVerified(true)}
            className="w-full bg-[#111111] hover:bg-[#D9A68B] text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded transition-colors shadow-xs"
          >
            Je certifie avoir 18 ans ou plus — Entrer
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "https://www.google.fr";
            }}
            className="text-[11px] text-[#888888] hover:text-[#111111] transition-colors"
          >
            Quitter le site
          </button>
        </div>

        <p className="text-[10px] text-[#A0A0A0] font-mono">
          En entrant sur Boxman, vous confirmez être majeur selon la législation de votre pays de résidence.
        </p>
      </div>
    </div>
  );
}
