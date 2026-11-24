export interface Site {
  id: string;
  name: string;
  shortCode: string;
}

export const sites: Site[] = [
  {
    id: "site-001",
    name: "Dark Ink",
    shortCode: "DK",
  },
  {
    id: "site-002",
    name: "Boxxman — Réserve",
    shortCode: "BX-RES",
  },
  {
    id: "site-003",
    name: "Boxxman — Rayon",
    shortCode: "BX-RAY",
  },
  {
    id: "site-004",
    name: "New Millenium — Réserve",
    shortCode: "NM-RES",
  },
  {
    id: "site-005",
    name: "New Millenium — Rayon",
    shortCode: "NM-RAY",
  },
];
