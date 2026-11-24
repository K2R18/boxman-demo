"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { staff } from "@/data/staff";

export type HrSiteFilter = "Boxxman" | "Dark Ink" | "New Millenium" | "Boutique en ligne";
export type HrViewFilter = "Planning" | "Badgeuse PIN" | "Congés" | "Matrice";
export type HrPeriodFilter = "Jour" | "Hebdomadaire" | "Mensuel" | "Annuel";

export interface MonthShift {
  id: string;
  staffName: string;
  site: HrSiteFilter;
  dayNum: number;
  hours: string;
  isLeave?: boolean;
  leaveType?: string;
}

export default function ERPHr() {
  const { staffPresence, clockIn, clockOut, currentRole, setCurrentRole } = useApp();

  // Navigation & Filtres (Site d'affectation obligatoire sans 'Tout')
  const [selectedSite, setSelectedSite] = useState<HrSiteFilter>("Boxxman");
  const [selectedView, setSelectedView] = useState<HrViewFilter>("Planning");
  const [selectedPeriod, setSelectedPeriod] = useState<HrPeriodFilter>("Mensuel");
  const [selectedUser, setSelectedUser] = useState<string>("Tous les utilisateurs");

  // PIN Badgeuse state
  const [pinInput, setPinInput] = useState("");
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Leave / Congés simulation state
  const [leavesList, setLeavesList] = useState([
    {
      id: "LV-01",
      staffName: "Sophie Martin",
      site: "Boxxman",
      type: "Congés Payés",
      dates: "24/12/2026 au 31/12/2026",
      daysCount: 6,
      status: "Validé par direction",
    },
    {
      id: "LV-02",
      staffName: "Julien Bernard",
      site: "New Millenium",
      type: "RTT Récupération",
      dates: "12/11/2026 au 14/11/2026",
      daysCount: 2,
      status: "En attente",
    },
    {
      id: "LV-03",
      staffName: "Lucas Moreau",
      site: "Dark Ink",
      type: "Congés Payés",
      dates: "02/01/2027 au 08/01/2027",
      daysCount: 5,
      status: "Validé par direction",
    },
    {
      id: "LV-04",
      staffName: "Marie Dupont",
      site: "Boxxman",
      type: "Formation Continue",
      dates: "05/12/2026 au 06/12/2026",
      daysCount: 2,
      status: "Validé RH",
    },
  ]);

  const handleClockAction = (type: "Arrivée" | "Départ") => {
    if (!pinInput || pinInput.length !== 4) {
      setPinMessage({ text: "Veuillez saisir un code PIN à 4 chiffres.", isError: true });
      return;
    }

    const matchedStaff = staff.find((s) => s.pin === pinInput);
    if (!matchedStaff) {
      setPinMessage({ text: "Code PIN invalide ou non reconnu.", isError: true });
      return;
    }

    if (type === "Arrivée") {
      clockIn(`${matchedStaff.firstName} ${matchedStaff.lastName}`, matchedStaff.site);
      setPinMessage({
        text: `Arrivée enregistrée pour ${matchedStaff.firstName} ${matchedStaff.lastName} (${matchedStaff.role}) à ${matchedStaff.site}.`,
        isError: false,
      });
    } else {
      clockOut(`${matchedStaff.firstName} ${matchedStaff.lastName}`, matchedStaff.site);
      setPinMessage({
        text: `Départ enregistré pour ${matchedStaff.firstName} ${matchedStaff.lastName} (${matchedStaff.role}). Fin de vacation archivée.`,
        isError: false,
      });
    }

    setPinInput("");
    setTimeout(() => setPinMessage(null), 4500);
  };

  const allStaffNames = useMemo(() => {
    return staff.map((s) => `${s.firstName} ${s.lastName}`);
  }, []);

  // Filtrage des collaborateurs pour le tableau de planning
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`;
      if (selectedUser !== "Tous les utilisateurs" && fullName !== selectedUser) {
        return false;
      }
      if (selectedSite === "Dark Ink") return s.site.includes("Dark Ink") || fullName === "Laurent Dupont";
      if (selectedSite === "Boxxman") return s.site.includes("Boxxman");
      if (selectedSite === "New Millenium") return s.site.includes("New Millenium");
      if (selectedSite === "Boutique en ligne") return s.role === "Gérant" || s.site.includes("Web") || fullName === "Laurent Dupont";
      return s.site === selectedSite;
    });
  }, [selectedSite, selectedUser]);

  // Styles et codes couleurs vibrants des cellules par salarié
  const staffStyles: Record<string, { bg: string; border: string; text: string; dot: string; glow: string; badgeBg: string }> = {
    "Sophie Martin": {
      bg: "#2e1065", // Violet profond
      border: "#a855f7", // Violet éclatant
      text: "#f3e8ff",
      dot: "#c084fc",
      glow: "rgba(168, 85, 247, 0.35)",
      badgeBg: "rgba(168, 85, 247, 0.2)",
    },
    "Julien Bernard": {
      bg: "#064e3b", // Vert émeraude profond
      border: "#10b981", // Émeraude éclatant
      text: "#ecfdf5",
      dot: "#34d399",
      glow: "rgba(16, 185, 129, 0.35)",
      badgeBg: "rgba(16, 185, 129, 0.2)",
    },
    "Laurent Dupont": {
      bg: "#1e3a8a", // Bleu roi profond
      border: "#3b82f6", // Bleu éclatant
      text: "#eff6ff",
      dot: "#60a5fa",
      glow: "rgba(59, 130, 246, 0.35)",
      badgeBg: "rgba(59, 130, 246, 0.2)",
    },
    "Marc Rousseau": {
      bg: "#155e75", // Cyan / Teal profond
      border: "#06b6d4", // Cyan éclatant
      text: "#ecfeff",
      dot: "#22d3ee",
      glow: "rgba(6, 182, 212, 0.35)",
      badgeBg: "rgba(6, 182, 212, 0.2)",
    },
    "Camille Lefèvre": {
      bg: "#78350f", // Ambre / Cuivré chaud
      border: "#f59e0b", // Ambre éclatant
      text: "#fffbeb",
      dot: "#fbbf24",
      glow: "rgba(245, 158, 11, 0.35)",
      badgeBg: "rgba(245, 158, 11, 0.2)",
    },
    "Anaïs Petit": {
      bg: "#831843", // Rose framboise profond
      border: "#f43f5e", // Rose éclatant
      text: "#fff1f2",
      dot: "#fb7185",
      glow: "rgba(244, 63, 94, 0.35)",
      badgeBg: "rgba(244, 63, 94, 0.2)",
    },
  };

  const leaveStyle = {
    bg: "#7f1d1d", // Rouge carmin profond
    border: "#ef4444", // Rouge vif
    text: "#fee2e2",
    dot: "#f87171",
    glow: "rgba(239, 68, 68, 0.45)",
    badgeBg: "rgba(239, 68, 68, 0.25)",
  };

  // Base des shifts mensuels pour les 30 jours du mois
  const monthShiftsDatabase: MonthShift[] = useMemo(() => {
    const list: MonthShift[] = [];

    // 1. Boxxman (Sophie Martin & Julien Bernard)
    for (let d = 1; d <= 30; d++) {
      const dayOfWeek = (d - 17 % 7 + 70) % 7; // 0=Lun, 6=Dim
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        list.push({
          id: `bm-sm-${d}`,
          staffName: "Sophie Martin",
          site: "Boxxman",
          dayNum: d,
          hours: "09:30 - 18:30",
        });
      }
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const isAbsent = d === 19;
        list.push({
          id: `bm-jb-${d}`,
          staffName: "Julien Bernard",
          site: "Boxxman",
          dayNum: d,
          hours: isAbsent ? "00:00 - 00:00" : dayOfWeek === 5 ? "14:00 - 22:00" : "11:00 - 20:00",
          isLeave: isAbsent,
          leaveType: isAbsent ? "Congé / RTT" : undefined,
        });
      }
    }

    // 2. Dark Ink (Marc Rousseau & Laurent Dupont)
    for (let d = 1; d <= 30; d++) {
      const dayOfWeek = (d - 17 % 7 + 70) % 7;
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        const isAbsent = d === 20;
        list.push({
          id: `di-mr-${d}`,
          staffName: "Marc Rousseau",
          site: "Dark Ink",
          dayNum: d,
          hours: isAbsent ? "00:00 - 00:00" : "08:00 - 16:30",
          isLeave: isAbsent,
          leaveType: isAbsent ? "Absent RTT" : undefined,
        });
      }
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        list.push({
          id: `di-ld-${d}`,
          staffName: "Laurent Dupont",
          site: "Dark Ink",
          dayNum: d,
          hours: "09:00 - 19:00",
        });
      }
    }

    // 3. New Millenium (Camille Lefèvre & Anaïs Petit)
    for (let d = 1; d <= 30; d++) {
      const dayOfWeek = (d - 17 % 7 + 70) % 7;
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const isAbsent = d === 18;
        list.push({
          id: `nm-cl-${d}`,
          staffName: "Camille Lefèvre",
          site: "New Millenium",
          dayNum: d,
          hours: isAbsent ? "00:00 - 00:00" : "10:00 - 19:00",
          isLeave: isAbsent,
          leaveType: isAbsent ? "Congé Payé" : undefined,
        });
      }
      if (dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5) {
        list.push({
          id: `nm-ap-${d}`,
          staffName: "Anaïs Petit",
          site: "New Millenium",
          dayNum: d,
          hours: "09:30 - 18:30",
        });
      }
    }

    // 4. Boutique en ligne (Laurent Dupont)
    for (let d = 1; d <= 30; d++) {
      const dayOfWeek = (d - 17 % 7 + 70) % 7;
      if (dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 3) {
        list.push({
          id: `web-ld-${d}`,
          staffName: "Laurent Dupont",
          site: "Boutique en ligne",
          dayNum: d,
          hours: "09:00 - 19:00",
        });
      }
    }

    return list;
  }, []);

  // Grille des semaines : 7 cellules par ligne du Lundi au Dimanche
  const monthWeeks = useMemo(() => {
    return [
      // Semaine 1 (27 Oct au 2 Nov)
      [
        { dayNum: null, label: "27 Oct", isToday: false, isCurrentMonth: false },
        { dayNum: null, label: "28 Oct", isToday: false, isCurrentMonth: false },
        { dayNum: null, label: "29 Oct", isToday: false, isCurrentMonth: false },
        { dayNum: null, label: "30 Oct", isToday: false, isCurrentMonth: false },
        { dayNum: null, label: "31 Oct", isToday: false, isCurrentMonth: false },
        { dayNum: 1, label: "1 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 2, label: "2 Nov", isToday: false, isCurrentMonth: true },
      ],
      // Semaine 2 (3 au 9 Nov)
      [
        { dayNum: 3, label: "3 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 4, label: "4 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 5, label: "5 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 6, label: "6 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 7, label: "7 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 8, label: "8 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 9, label: "9 Nov", isToday: false, isCurrentMonth: true },
      ],
      // Semaine 3 (10 au 16 Nov)
      [
        { dayNum: 10, label: "10 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 11, label: "11 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 12, label: "12 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 13, label: "13 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 14, label: "14 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 15, label: "15 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 16, label: "16 Nov", isToday: false, isCurrentMonth: true },
      ],
      // Semaine 4 (17 au 23 Nov)
      [
        { dayNum: 17, label: "17 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 18, label: "18 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 19, label: "19 Nov", isToday: true, isCurrentMonth: true },
        { dayNum: 20, label: "20 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 21, label: "21 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 22, label: "22 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 23, label: "23 Nov", isToday: false, isCurrentMonth: true },
      ],
      // Semaine 5 (24 au 30 Nov)
      [
        { dayNum: 24, label: "24 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 25, label: "25 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 26, label: "26 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 27, label: "27 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 28, label: "28 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 29, label: "29 Nov", isToday: false, isCurrentMonth: true },
        { dayNum: 30, label: "30 Nov", isToday: false, isCurrentMonth: true },
      ],
    ];
  }, []);

  // Filtrage du journal des présences
  const filteredPresence = useMemo(() => {
    return staffPresence.filter((p) => {
      if (selectedUser !== "Tous les utilisateurs" && p.staffName !== selectedUser) {
        return false;
      }
      if (selectedSite === "Dark Ink" && p.site.includes("Dark Ink")) return true;
      if (selectedSite === "Boxxman" && p.site.includes("Boxxman")) return true;
      if (selectedSite === "New Millenium" && p.site.includes("New Millenium")) return true;
      if (selectedSite === "Boutique en ligne" && p.site.includes("Web")) return true;
      return p.site.includes(selectedSite);
    });
  }, [staffPresence, selectedSite, selectedUser]);

  // Matrice des habilitations
  const permissionsMatrix: {
    role: "Gérant" | "Responsable" | "Vendeur" | "Entrepôt";
    label: string;
    modules: {
      caisse: boolean;
      stocks: boolean;
      transferts: boolean;
      prixAchat: boolean;
      rh: boolean;
      parametres: boolean;
    };
  }[] = [
      {
        role: "Gérant",
        label: "Gérant (Accès complet)",
        modules: { caisse: true, stocks: true, transferts: true, prixAchat: true, rh: true, parametres: true },
      },
      {
        role: "Responsable",
        label: "Responsable Boutique",
        modules: { caisse: true, stocks: true, transferts: true, prixAchat: true, rh: true, parametres: false },
      },
      {
        role: "Vendeur",
        label: "Vendeur (Prix d'achat masqués)",
        modules: { caisse: true, stocks: true, transferts: false, prixAchat: false, rh: false, parametres: false },
      },
      {
        role: "Entrepôt",
        label: "Opérateur Entrepôt",
        modules: { caisse: false, stocks: true, transferts: true, prixAchat: false, rh: false, parametres: false },
      },
    ];

  return (
    <div className="space-y-5 w-full max-w-full">
      {/* 1. EN-TÊTE DU MODULE RENOMMÉ EN 'GESTION DES SALARIÉS' */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F242D] gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
            Gestion des salariés
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Calendrier interactif &bull; Planning des shifts &bull; Pointage PIN certifié &bull; Suivi légal 35h
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded">
            Badgeuse &amp; Planning certifiés RGPD
          </span>
        </div>
      </div>

      {/* 2. ONGLETS DE SOUS-NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1F242D] pb-2">
        <button
          type="button"
          onClick={() => setSelectedView("Planning")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedView === "Planning"
            ? "bg-[#1E2430] text-[#F2F2F2] border border-[#F2F2F2]/50 shadow-xs"
            : "text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#161B23] border border-transparent"
            }`}
        >
          <span>📊</span>
          <span>Planning</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedView("Badgeuse PIN")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedView === "Badgeuse PIN"
            ? "bg-[#1E2430] text-[#F2F2F2] border border-[#F2F2F2]/50 shadow-xs"
            : "text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#161B23] border border-transparent"
            }`}
        >
          <span>⏱</span>
          <span>Badgeuse PIN &amp; Pointage</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedView("Congés")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedView === "Congés"
            ? "bg-[#1E2430] text-[#F2F2F2] border border-[#F2F2F2]/50 shadow-xs"
            : "text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#161B23] border border-transparent"
            }`}
        >
          <span>🏖</span>
          <span>Congés &amp; RTT</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedView("Matrice")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedView === "Matrice"
            ? "bg-[#1E2430] text-[#F2F2F2] border border-[#F2F2F2]/50 shadow-xs"
            : "text-[#8E95A5] hover:text-[#E2E4E9] hover:bg-[#161B23] border border-transparent"
            }`}
        >
          <span>🛡</span>
          <span>Matrice des Rôles &amp; Droits</span>
        </button>
      </div>

      {/* 3. BARRE DE FILTRES RAPIDES RÉACTIVE */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-xl p-3.5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Sélecteur 1: Site (obligatoire sans option 'Tout') */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-[#8E95A5] mb-1">
              Site d&apos;affectation <span className="text-amber-400 font-bold">*</span>
            </label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value as HrSiteFilter)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-xs text-[#E2E4E9] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#5B7A9D] font-mono cursor-pointer"
            >
              <option value="Boxxman">Boxxman</option>
              <option value="Dark Ink">Dark Ink</option>
              <option value="New Millenium">New Millenium</option>
              <option value="Boutique en ligne">Boutique en ligne (Web)</option>
            </select>
          </div>

          {/* Sélecteur 2: Collaborateur */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-[#8E95A5] mb-1">
              Collaborateur
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-xs text-[#E2E4E9] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#5B7A9D] font-mono cursor-pointer"
            >
              <option value="Tous les utilisateurs">Tous les collaborateurs ({staff.length})</option>
              {allStaffNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur 3: Périodicité */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-[#8E95A5] mb-1">
              Période d&apos;analyse
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as HrPeriodFilter)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-xs text-[#E2E4E9] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#5B7A9D] font-mono cursor-pointer"
            >
              <option value="Mensuel">Mensuel (Calendrier Novembre 2026)</option>
              <option value="Hebdomadaire">Hebdomadaire (Semaine 47)</option>
              <option value="Jour">Journée en cours</option>
              <option value="Annuel">Bilan Annuel 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE : BORNE BADGEUSE PIN & POINTAGE */}
      {/* ========================================================================= */}
      {selectedView === "Badgeuse PIN" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulaire PIN (5 cols) */}
          <div className="lg:col-span-5 bg-[#12151B] border border-[#1F242D] rounded-xl p-5 space-y-4">
            <div className="pb-3 border-b border-[#1F242D]">
              <h2 className="text-sm font-bold text-[#E2E4E9]">
                Borne de Pointage Rapide (PIN)
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Périmètre : {selectedSite} &bull; Saisie opérateur 4 chiffres
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-48 text-center text-3xl font-mono tracking-widest bg-[#161A22] border border-[#2B3342] text-white rounded-lg py-2 focus:outline-hidden focus:border-[#5B7A9D]"
                />
              </div>

              {/* Raccourcis de test */}
              <div className="bg-[#161B23] p-2.5 rounded border border-[#252C39] text-[11px] text-[#8E95A5]">
                <span className="block font-medium text-white mb-1">
                  Raccourcis de test (codes PIN) :
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPinInput("1234")}
                    className="text-left hover:text-white cursor-pointer"
                  >
                    1234 : Laurent D. (Gérant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinInput("5678")}
                    className="text-left hover:text-white cursor-pointer"
                  >
                    5678 : Sophie M. (Boxxman)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinInput("9012")}
                    className="text-left hover:text-white cursor-pointer"
                  >
                    9012 : Julien B. (Boxxman)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinInput("7890")}
                    className="text-left hover:text-white cursor-pointer"
                  >
                    7890 : Marc R. (Dark Ink)
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleClockAction("Arrivée")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Pointer Arrivée
                </button>
                <button
                  type="button"
                  onClick={() => handleClockAction("Départ")}
                  className="bg-[#2A313E] hover:bg-[#343D4D] text-[#E2E4E9] text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Pointer Départ
                </button>
              </div>

              {pinMessage && (
                <div
                  className={`p-3 rounded-lg text-xs ${pinMessage.isError
                    ? "bg-rose-950/40 border border-rose-900/60 text-rose-300"
                    : "bg-emerald-950/40 border border-emerald-900/60 text-emerald-300"
                    }`}
                >
                  {pinMessage.text}
                </div>
              )}
            </div>

            {/* Journal des pointages récents */}
            <div className="pt-2 border-t border-[#1F242D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8E95A5] uppercase tracking-wider">
                  Journal des Pointages ({filteredPresence.length})
                </span>
                <span className="text-[10px] font-mono text-[#6B7280]">
                  {selectedPeriod}
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {filteredPresence.length === 0 ? (
                  <p className="text-[#6B7280] italic text-[11px] py-3 text-center">
                    Aucun pointage ne correspond aux filtres actifs.
                  </p>
                ) : (
                  filteredPresence.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#161A22] border border-[#222733]"
                    >
                      <div>
                        <span className="font-medium text-white">{p.staffName}</span>
                        <span className="text-[11px] text-[#6B7280] block">
                          {p.site}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${p.type === "Arrivée"
                            ? "text-emerald-400 bg-emerald-950/40"
                            : "text-amber-400 bg-amber-950/40"
                            }`}
                        >
                          {p.type}
                        </span>
                        <span className="font-mono text-[11px] text-[#8E95A5] block mt-0.5">
                          {p.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Synthèse heures pointées (7 cols) */}
          <div className="lg:col-span-7 bg-[#12151B] border border-[#1F242D] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
              <div>
                <h2 className="text-sm font-bold text-[#E2E4E9]">
                  Synthèse Horaires : {selectedPeriod.toUpperCase()}
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Données consolidées pour : {selectedUser} &bull; Site : {selectedSite}
                </p>
              </div>
              <span className="font-mono text-xs text-[#5B7A9D] bg-[#5B7A9D]/10 px-2 py-1 rounded border border-[#5B7A9D]/20">
                Base 35h Légale
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#161A22] border border-[#222733] p-3 rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
                  Heures Pointées
                </span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  35h 00
                </span>
              </div>
              <div className="bg-[#161A22] border border-[#222733] p-3 rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
                  Heures Supp (+25%)
                </span>
                <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
                  2h 30
                </span>
              </div>
              <div className="bg-[#161A22] border border-[#222733] p-3 rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
                  Heures Nuit (Cruising)
                </span>
                <span className="text-lg font-bold font-mono text-sky-400 mt-1 block">
                  6h 00
                </span>
              </div>
              <div className="bg-[#161A22] border border-[#222733] p-3 rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#6B7280] block">
                  Solde Congés / RTT
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                  18.5 j
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#161A22] border border-[#222733] text-xs text-[#8E95A5] space-y-1.5">
              <p>
                <strong className="text-white">Régularité des pointages :</strong> Les pointages sont conformes à la convention collective du commerce de détail. Les pauses repas obligatoires (45 min) sont décomptées automatiquement.
              </p>
              <p className="text-[11px] text-[#6B7280]">
                Les heures effectuées au-delà de 21h au sein du complexe Boxxman (Cruising) ouvrent droit à la majoration horaire de nuit (+30%) directement répercutée dans le module Salaires &amp; Paie.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE : TABLEAU PLANNING DYNAMIQUE (JOUR / SEMAINE / MOIS / ANNEE) */}
      {/* ========================================================================= */}
      {selectedView === "Planning" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F242D] gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#E2E4E9] flex items-center gap-2">
                <span>
                  {selectedPeriod === "Jour" && "Planning Quotidien • Mercredi 19 Novembre 2026"}
                  {selectedPeriod === "Hebdomadaire" && "Planning Hebdomadaire • Semaine 47 (17 au 23 Nov 2026)"}
                  {selectedPeriod === "Mensuel" && "Planning Mensuel • Novembre 2026"}
                  {selectedPeriod === "Annuel" && "Bilan Annuel du Temps de Travail • Exercice 2026"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2430] text-[#F2F2F2] border border-[#F2F2F2]/30">
                  {selectedPeriod}
                </span>
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Périmètre : {selectedSite} &bull; Salarié : {selectedUser} &bull; {filteredStaff.length} collaborateur(s) affiché(s)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-[#8E95A5] bg-[#161A22] border border-[#262D3B] px-2.5 py-1 rounded">
                {selectedPeriod === "Jour" && "Journée 7h / 8h"}
                {selectedPeriod === "Hebdomadaire" && "Base Hebdo 35h"}
                {selectedPeriod === "Mensuel" && "Mensualisation 151.67h"}
                {selectedPeriod === "Annuel" && "Quota Légal 1 607h"}
              </span>
            </div>
          </div>

          {/* LÉGENDE DES CODES COULEURS PAR SALARIÉ (TOUJOURS VISIBLE EN HAUT DU PLANNING) */}
          <div className="p-3 bg-[#161A22] border border-[#222834] rounded-xl flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-mono text-[#8E95A5] text-[11px] font-bold mr-1">
              Légende couleurs cellules :
            </span>
            {[
              "Laurent Dupont",
              "Sophie Martin",
              "Julien Bernard",
              "Camille Lefèvre",
              "Marc Rousseau",
              "Anaïs Petit",
            ].map((name) => {
              const style = staffStyles[name] || staffStyles["Sophie Martin"];
              return (
                <div
                  key={name}
                  style={{
                    backgroundColor: style.badgeBg,
                    borderColor: style.border,
                  }}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md border"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: style.dot, boxShadow: `0 0 6px ${style.dot}` }}
                  />
                  <span style={{ color: style.text }} className="font-semibold text-[11px]">
                    {name}
                  </span>
                </div>
              );
            })}
            <div
              style={{
                backgroundColor: leaveStyle.badgeBg,
                borderColor: leaveStyle.border,
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md border"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 bg-red-500 shadow-xs"
                style={{ boxShadow: "0 0 6px #ef4444" }}
              />
              <span style={{ color: leaveStyle.text }} className="font-bold text-[11px]">
                Congé / Absent (Rouge)
              </span>
            </div>
          </div>

          {/* SI PÉRIODE MENSUELLE : VRAI CALENDRIER RECTANGULAIRE (7 COLONNES X LIGNES DE SEMAINES) */}
          {selectedPeriod === "Mensuel" ? (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <div className="min-w-[900px] space-y-2">
                  {/* EN-TÊTE : LES 7 JOURS DE LA SEMAINE EN COLONNES */}
                  <div
                    style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px" }}
                    className="text-center font-mono text-xs font-bold text-[#8E95A5] pb-2 border-b border-[#1F242D]"
                  >
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834]">Lundi</div>
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834]">Mardi</div>
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834]">Mercredi</div>
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834]">Jeudi</div>
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834]">Vendredi</div>
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834] text-amber-300">Samedi</div>
                    <div className="py-1.5 bg-[#161A22] rounded-lg border border-[#222834] text-[#6B7280]">Dimanche</div>
                  </div>

                  {/* LIGNES DE SEMAINES : 7 CELLULES PAR LIGNE, PUIS RETOUR À LA LIGNE */}
                  <div className="space-y-2">
                    {monthWeeks.map((week, wIdx) => (
                      <div
                        key={wIdx}
                        style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px" }}
                      >
                        {week.map((cell, cIdx) => {
                          if (!cell.isCurrentMonth || cell.dayNum === null) {
                            return (
                              <div
                                key={cIdx}
                                className="min-h-[110px] p-2 rounded-xl border border-[#1A1F29] bg-[#0E1015]/60 opacity-35 flex flex-col justify-between"
                              >
                                <span className="font-mono text-[10px] text-[#475569]">
                                  {cell.label}
                                </span>
                              </div>
                            );
                          }

                          const dayShifts = monthShiftsDatabase.filter((s) => {
                            if (s.dayNum !== cell.dayNum) return false;
                            if (s.site !== selectedSite) return false;
                            if (selectedUser !== "Tous les utilisateurs" && s.staffName !== selectedUser) {
                              return false;
                            }
                            return true;
                          });

                          return (
                            <div
                              key={cIdx}
                              className={`min-h-[115px] p-2 rounded-xl border flex flex-col justify-between transition-all ${cell.isToday
                                ? "bg-[#161B24] border-[#5B7A9D] shadow-xs ring-1 ring-[#5B7A9D]/40"
                                : "bg-[#12151B] border-[#1F242D] hover:border-[#2D3646]"
                                }`}
                            >
                              {/* Numéro du jour en haut */}
                              <div className="flex items-center justify-between pb-1.5 border-b border-[#1A1F29]">
                                <span
                                  className={`font-mono text-xs font-bold ${cell.isToday ? "text-[#5B7A9D]" : "text-[#E2E4E9]"
                                    }`}
                                >
                                  {cell.dayNum} Nov
                                </span>
                                {cell.isToday && (
                                  <span className="text-[9px] font-mono font-bold bg-[#5B7A9D]/20 text-[#5B7A9D] border border-[#5B7A9D]/40 px-1 py-0.2 rounded">
                                    AUJ
                                  </span>
                                )}
                              </div>

                              {/* Créneaux du jour : NOM Prénom, horaires et code couleur de la cellule */}
                              <div className="py-1.5 space-y-1.5 flex-1">
                                {dayShifts.length === 0 ? (
                                  <div className="h-full flex items-center justify-center text-center py-4">
                                    <span className="text-[10px] text-[#475569] italic">
                                      Repos
                                    </span>
                                  </div>
                                ) : (
                                  dayShifts.map((sh) => {
                                    const style = sh.isLeave ? leaveStyle : (staffStyles[sh.staffName] || staffStyles["Sophie Martin"]);

                                    return (
                                      <div
                                        key={sh.id}
                                        style={{
                                          backgroundColor: style.bg,
                                          borderColor: style.border,
                                          boxShadow: `0 0 10px ${style.glow}`,
                                        }}
                                        className="p-2 rounded-lg border text-left transition-transform shadow-xs"
                                      >
                                        <div className="flex items-center justify-between gap-1">
                                          <span
                                            style={{ color: style.text }}
                                            className="text-[11px] font-bold leading-tight truncate block"
                                          >
                                            {sh.staffName}
                                          </span>
                                          <span
                                            className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                                            style={{ backgroundColor: style.dot, boxShadow: `0 0 6px ${style.dot}` }}
                                          />
                                        </div>
                                        <div
                                          style={{ color: sh.isLeave ? "#fca5a5" : "#f1f5f9" }}
                                          className="text-[10px] font-mono leading-tight mt-1 font-semibold"
                                        >
                                          {sh.isLeave ? (sh.leaveType || "Congé / Absent") : sh.hours}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>

                              {/* Footer de la cellule */}
                              <div className="pt-1 border-t border-[#1A1F29] flex items-center justify-between text-[9px] font-mono text-[#6B7280]">
                                <span>{dayShifts.length} {dayShifts.length > 1 ? "vacations" : "vacation"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* AUTRES PÉRIODES : JOUR, HEBDOMADAIRE, ANNUEL */
            <div className="overflow-x-auto">
              {filteredStaff.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6B7280] italic">
                  Aucun collaborateur ne correspond aux filtres sélectionnés ({selectedSite} / {selectedUser}).
                </div>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                      <th className="py-2.5 px-3 font-sans">Collaborateur</th>
                      <th className="py-2.5 px-2 font-sans">Site</th>

                      {/* COLONNES VUE JOUR */}
                      {selectedPeriod === "Jour" && (
                        <>
                          <th className="py-2.5 px-2 text-center">Horaires Prévus</th>
                          <th className="py-2.5 px-2 text-center">Pause Repas</th>
                          <th className="py-2.5 px-2 text-center">Statut Vacation</th>
                          <th className="py-2.5 px-2 text-right text-emerald-400 font-sans">Heures Jour</th>
                        </>
                      )}

                      {/* COLONNES VUE HEBDOMADAIRE */}
                      {selectedPeriod === "Hebdomadaire" && (
                        <>
                          <th className="py-2 px-1 text-center">Lun 17</th>
                          <th className="py-2 px-1 text-center">Mar 18</th>
                          <th className="py-2 px-1 text-center text-[#5B7A9D]">Mer 19</th>
                          <th className="py-2 px-1 text-center">Jeu 20</th>
                          <th className="py-2 px-1 text-center">Ven 21</th>
                          <th className="py-2 px-1 text-center text-amber-400">Sam 22</th>
                          <th className="py-2 px-1 text-center text-[#555E6D]">Dim 23</th>
                          <th className="py-2 px-2 text-right text-emerald-400 font-sans">Total Hebdo</th>
                        </>
                      )}

                      {/* COLONNES VUE ANNUELLE */}
                      {selectedPeriod === "Annuel" && (
                        <>
                          <th className="py-2.5 px-2 text-center">T1 2026</th>
                          <th className="py-2.5 px-2 text-center">T2 2026</th>
                          <th className="py-2.5 px-2 text-center">T3 2026</th>
                          <th className="py-2.5 px-2 text-center">T4 (Estimé)</th>
                          <th className="py-2.5 px-2 text-center text-sky-400">Objectif 1607h</th>
                          <th className="py-2.5 px-2 text-center text-amber-400">Solde RTT/Supp</th>
                          <th className="py-2.5 px-2 text-right text-emerald-400 font-sans">Total Annuel</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                    {filteredStaff.map((s) => {
                      const fullName = `${s.firstName} ${s.lastName}`;
                      const style = staffStyles[fullName] || staffStyles["Sophie Martin"];

                      return (
                        <tr key={s.id} className="hover:bg-[#161B23]/40">
                          <td className="py-3 px-3 font-sans">
                            <span className="font-semibold text-white block">{fullName}</span>
                            <span className="text-[10px] text-[#6B7280]">{s.role}</span>
                          </td>
                          <td className="py-3 px-2 text-[#8E95A5] font-sans">{s.site}</td>

                          {/* CONTENU VUE JOUR */}
                          {selectedPeriod === "Jour" && (
                            <>
                              <td className="py-2.5 px-2 text-center font-bold">
                                {s.lastName === "Petit" ? (
                                  <span className="px-2.5 py-1 rounded-md border border-[#334155] bg-[#161a22] text-[#94a3b8] text-xs font-mono inline-block">
                                    Repos
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      backgroundColor: style.badgeBg,
                                      borderColor: style.border,
                                      color: style.text,
                                    }}
                                    className="px-2.5 py-1 rounded-md border text-xs font-mono font-bold inline-block shadow-2xs"
                                  >
                                    {s.role === "Gérant" ? "09:00 - 19:00" :
                                      s.role === "Entrepôt" ? "08:00 - 16:30" : "09:30 - 18:30"}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-2 text-center text-[#8E95A5]">
                                {s.lastName === "Petit" ? "-" : "45 min (repas)"}
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                {s.lastName === "Petit" ? (
                                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-slate-900 text-slate-400 border border-slate-800 inline-block">
                                    Repos Hebdomadaire
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      backgroundColor: "rgba(16, 185, 129, 0.25)",
                                      borderColor: "#10b981",
                                      color: "#6ee7b7",
                                    }}
                                    className="px-2.5 py-1 rounded-md border text-[10px] font-sans font-bold inline-block shadow-2xs"
                                  >
                                    En Poste (Badgé)
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-2 text-right font-bold">
                                <span
                                  style={{
                                    backgroundColor: s.lastName === "Petit" ? "transparent" : "rgba(16, 185, 129, 0.2)",
                                    borderColor: s.lastName === "Petit" ? "transparent" : "#10b981",
                                    color: s.lastName === "Petit" ? "#64748b" : "#6ee7b7",
                                  }}
                                  className="px-2 py-0.5 rounded border text-xs font-mono font-bold inline-block"
                                >
                                  {s.lastName === "Petit" ? "0h" : s.role === "Gérant" ? "9h" : s.role === "Entrepôt" ? "7.5h" : "8h"}
                                </span>
                              </td>
                            </>
                          )}

                          {/* CONTENU VUE HEBDOMADAIRE */}
                          {selectedPeriod === "Hebdomadaire" && (
                            <>
                              <td className="py-2.5 px-1 text-center">
                                <span
                                  style={{ backgroundColor: style.badgeBg, borderColor: style.border, color: style.text }}
                                  className="px-2 py-1 rounded-md border text-[10px] font-bold font-mono inline-block shadow-2xs"
                                >
                                  {s.role === "Entrepôt" ? "08h-16h30" : "09h30-18h30"}
                                </span>
                              </td>
                              <td className="py-2.5 px-1 text-center">
                                <span
                                  style={{ backgroundColor: style.badgeBg, borderColor: style.border, color: style.text }}
                                  className="px-2 py-1 rounded-md border text-[10px] font-bold font-mono inline-block shadow-2xs"
                                >
                                  {s.role === "Entrepôt" ? "08h-16h30" : "09h30-18h30"}
                                </span>
                              </td>
                              <td className="py-2.5 px-1 text-center">
                                {s.lastName === "Petit" ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#161a22] border border-[#262f40] text-[#64748b] inline-block">
                                    Repos
                                  </span>
                                ) : (
                                  <span
                                    style={{ backgroundColor: style.badgeBg, borderColor: style.border, color: style.text }}
                                    className="px-2 py-1 rounded-md border text-[10px] font-bold font-mono inline-block shadow-2xs ring-1 ring-white/10"
                                  >
                                    {s.role === "Entrepôt" ? "08h-16h30" : "09h30-18h30"}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-1 text-center">
                                <span
                                  style={{ backgroundColor: style.badgeBg, borderColor: style.border, color: style.text }}
                                  className="px-2 py-1 rounded-md border text-[10px] font-bold font-mono inline-block shadow-2xs"
                                >
                                  {s.role === "Entrepôt" ? "08h-16h30" : "09h30-18h30"}
                                </span>
                              </td>
                              <td className="py-2.5 px-1 text-center">
                                <span
                                  style={{ backgroundColor: style.badgeBg, borderColor: style.border, color: style.text }}
                                  className="px-2 py-1 rounded-md border text-[10px] font-bold font-mono inline-block shadow-2xs"
                                >
                                  {s.role === "Entrepôt" ? "08h-16h30" : "09h30-18h30"}
                                </span>
                              </td>
                              <td className="py-2.5 px-1 text-center">
                                {s.site.includes("Boxxman") && s.role === "Vendeur" ? (
                                  <span
                                    style={{
                                      backgroundColor: "rgba(245, 158, 11, 0.25)",
                                      borderColor: "#f59e0b",
                                      color: "#fef08a",
                                    }}
                                    className="px-2 py-1 rounded-md border text-[10px] font-bold font-mono inline-block shadow-2xs"
                                  >
                                    14h-22h (Nuit 🌙)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#161a22] border border-[#262f40] text-[#64748b] inline-block">
                                    Repos
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-1 text-center">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-[#161a22] border border-[#262f40] text-[#64748b] inline-block">
                                  Repos
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-right font-bold">
                                <span
                                  style={{
                                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                                    borderColor: "#10b981",
                                    color: "#6ee7b7",
                                  }}
                                  className="px-2.5 py-1 rounded-md border text-xs font-mono font-bold inline-block shadow-2xs"
                                >
                                  {s.role === "Entrepôt" ? "37.5h" : s.role === "Gérant" ? "40h" : "35h"}
                                </span>
                              </td>
                            </>
                          )}

                          {/* CONTENU VUE ANNUELLE */}
                          {selectedPeriod === "Annuel" && (
                            <>
                              <td className="py-2.5 px-2 text-center">
                                <span
                                  style={{ backgroundColor: "rgba(59, 130, 246, 0.18)", borderColor: "#3b82f6", color: "#93c5fd" }}
                                  className="px-2 py-0.5 rounded border text-[11px] font-bold font-mono inline-block"
                                >
                                  455h
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <span
                                  style={{ backgroundColor: "rgba(59, 130, 246, 0.18)", borderColor: "#3b82f6", color: "#93c5fd" }}
                                  className="px-2 py-0.5 rounded border text-[11px] font-bold font-mono inline-block"
                                >
                                  448h
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <span
                                  style={{ backgroundColor: "rgba(59, 130, 246, 0.18)", borderColor: "#3b82f6", color: "#93c5fd" }}
                                  className="px-2 py-0.5 rounded border text-[11px] font-bold font-mono inline-block"
                                >
                                  420h
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <span
                                  style={{ backgroundColor: "rgba(59, 130, 246, 0.18)", borderColor: "#3b82f6", color: "#93c5fd" }}
                                  className="px-2 py-0.5 rounded border text-[11px] font-bold font-mono inline-block"
                                >
                                  455h
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <span
                                  style={{ backgroundColor: "rgba(6, 182, 212, 0.18)", borderColor: "#06b6d4", color: "#67e8f9" }}
                                  className="px-2 py-0.5 rounded border text-[11px] font-bold font-mono inline-block"
                                >
                                  1 607h
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold">
                                <span
                                  style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", borderColor: "#f59e0b", color: "#fcd34d" }}
                                  className="px-2 py-0.5 rounded border text-[11px] font-bold font-mono inline-block"
                                >
                                  {s.role === "Gérant" ? "+142h" : s.role === "Entrepôt" ? "+65h" : "+18h"}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-right font-bold">
                                <span
                                  style={{ backgroundColor: "rgba(16, 185, 129, 0.22)", borderColor: "#10b981", color: "#6ee7b7" }}
                                  className="px-2.5 py-1 rounded-md border text-xs font-mono font-bold inline-block shadow-xs"
                                >
                                  {s.role === "Gérant" ? "1 749h" : s.role === "Entrepôt" ? "1 672h" : "1 625h"}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 4 : GESTION DES CONGÉS & RTT */}
      {/* ========================================================================= */}
      {selectedView === "Congés" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F242D]">
            <div>
              <h2 className="text-sm font-bold text-[#E2E4E9]">
                Gestion des Congés Payés &amp; RTT
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Demandes en cours &bull; Validation hiérarchique &bull; Décompte légal
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newLeave = {
                  id: `LV-0${leavesList.length + 1}`,
                  staffName: selectedUser === "Tous les utilisateurs" ? "Sophie Martin" : selectedUser,
                  site: selectedSite,
                  type: "Congés Payés",
                  dates: "15/01/2027 au 20/01/2027",
                  daysCount: 4,
                  status: "En attente",
                };
                setLeavesList([newLeave, ...leavesList]);
              }}
              className="bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              + Déposer une demande
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1F242D] text-[10px] uppercase text-[#6B7280] bg-[#0E1015]">
                  <th className="py-2.5 px-3 font-sans">Collaborateur</th>
                  <th className="py-2.5 px-2">Site</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-2">Période demandée</th>
                  <th className="py-2.5 px-2 text-center">Jours</th>
                  <th className="py-2.5 px-2">Statut</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1F29] text-[11px]">
                {leavesList.map((lv) => (
                  <tr key={lv.id} className="hover:bg-[#161B23]/40">
                    <td className="py-3 px-3 font-sans font-medium text-white">
                      {lv.staffName}
                    </td>
                    <td className="py-3 px-2 text-[#8E95A5]">{lv.site}</td>
                    <td className="py-3 px-2 text-[#5B7A9D]">{lv.type}</td>
                    <td className="py-3 px-2 text-[#E2E4E9]">{lv.dates}</td>
                    <td className="py-3 px-2 text-center text-white font-bold">{lv.daysCount} j</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${lv.status.includes("Validé")
                          ? "text-emerald-400 bg-emerald-950/40 border border-emerald-900/40"
                          : "text-amber-400 bg-amber-950/40 border border-amber-900/40"
                          }`}
                      >
                        {lv.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-1 font-sans">
                      {lv.status === "En attente" && (
                        <button
                          type="button"
                          onClick={() => {
                            setLeavesList(
                              leavesList.map((l) =>
                                l.id === lv.id ? { ...l, status: "Validé par direction" } : l,
                              ),
                            );
                          }}
                          className="text-[10px] bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 px-2 py-0.5 rounded cursor-pointer"
                        >
                          Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 5 : MATRICE DES HABILITATIONS & DROITS */}
      {/* ========================================================================= */}
      {selectedView === "Matrice" && (
        <div className="bg-[#12151B] border border-[#1F242D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#1F242D] gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#E2E4E9]">
                Habilitations &amp; Matrice des Rôles
              </h2>
              <p className="text-xs text-[#6B7280]">
                Cliquez sur un rôle pour simuler immédiatement ses restrictions
              </p>
            </div>
            <span className="font-mono text-xs text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
              Rôle Actif : {currentRole}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1F242D] text-[10px] uppercase tracking-wider text-[#6B7280] bg-[#0E1015]">
                  <th className="py-2.5 px-3">Rôle</th>
                  <th className="py-2.5 px-2 text-center">Caisse</th>
                  <th className="py-2.5 px-2 text-center">Stocks</th>
                  <th className="py-2.5 px-2 text-center">Transferts</th>
                  <th className="py-2.5 px-2 text-center text-amber-300">Prix Achat</th>
                  <th className="py-2.5 px-2 text-center">RH</th>
                  <th className="py-2.5 px-2 text-center">Facturation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1F29]">
                {permissionsMatrix.map((pm) => {
                  const isCurrent = currentRole === pm.role;
                  return (
                    <tr
                      key={pm.role}
                      onClick={() => setCurrentRole(pm.role)}
                      className={`cursor-pointer transition-colors ${isCurrent
                        ? "bg-[#1E2533] border-l-2 border-[#5B7A9D]"
                        : "hover:bg-[#161B23]/50"
                        }`}
                    >
                      <td className="py-3 px-3 font-medium">
                        <span className={isCurrent ? "text-white font-bold" : "text-[#8E95A5]"}>
                          {pm.label}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {pm.modules.caisse ? <span className="text-emerald-400 font-bold">OUI</span> : <span className="text-rose-500/70">NON</span>}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {pm.modules.stocks ? <span className="text-emerald-400 font-bold">OUI</span> : <span className="text-rose-500/70">NON</span>}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {pm.modules.transferts ? <span className="text-emerald-400 font-bold">OUI</span> : <span className="text-rose-500/70">NON</span>}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold">
                        {pm.modules.prixAchat ? (
                          <span className="text-emerald-400">OUI</span>
                        ) : (
                          <span className="text-rose-400 bg-rose-950/40 px-1 py-0.2 rounded border border-rose-900/50">
                            MASQUÉ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {pm.modules.rh ? <span className="text-emerald-400 font-bold">OUI</span> : <span className="text-rose-500/70">NON</span>}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {pm.modules.parametres ? <span className="text-emerald-400 font-bold">OUI</span> : <span className="text-rose-500/70">NON</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
