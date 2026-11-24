export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: "Gérant" | "Responsable" | "Vendeur" | "Entrepôt";
  pin: string;
  site: string;
  avatar: string;
}

export interface RolePermissions {
  role: "Gérant" | "Responsable" | "Vendeur" | "Entrepôt";
  permissions: {
    sales: boolean;
    stock: boolean;
    transfers: boolean;
    purchasePrices: boolean;
    reports: boolean;
    hr: boolean;
    settings: boolean;
    cruising: boolean;
    web: boolean;
  };
}

export const staff: Staff[] = [
  {
    id: "staff-001",
    firstName: "Laurent",
    lastName: "Dupont",
    role: "Gérant",
    pin: "1234",
    site: "Dark Ink",
    avatar: "LD",
  },
  {
    id: "staff-002",
    firstName: "Sophie",
    lastName: "Martin",
    role: "Responsable",
    pin: "5678",
    site: "Boxxman",
    avatar: "SM",
  },
  {
    id: "staff-003",
    firstName: "Julien",
    lastName: "Bernard",
    role: "Vendeur",
    pin: "9012",
    site: "Boxxman",
    avatar: "JB",
  },
  {
    id: "staff-004",
    firstName: "Camille",
    lastName: "Lefèvre",
    role: "Vendeur",
    pin: "3456",
    site: "New Millenium",
    avatar: "CL",
  },
  {
    id: "staff-005",
    firstName: "Marc",
    lastName: "Rousseau",
    role: "Entrepôt",
    pin: "7890",
    site: "Dark Ink",
    avatar: "MR",
  },
  {
    id: "staff-006",
    firstName: "Anaïs",
    lastName: "Petit",
    role: "Responsable",
    pin: "2468",
    site: "New Millenium",
    avatar: "AP",
  },
];

export const roles: RolePermissions[] = [
  {
    role: "Gérant",
    permissions: {
      sales: true,
      stock: true,
      transfers: true,
      purchasePrices: true,
      reports: true,
      hr: true,
      settings: true,
      cruising: true,
      web: true,
    },
  },
  {
    role: "Responsable",
    permissions: {
      sales: true,
      stock: true,
      transfers: true,
      purchasePrices: false,
      reports: true,
      hr: true,
      settings: false,
      cruising: true,
      web: true,
    },
  },
  {
    role: "Vendeur",
    permissions: {
      sales: true,
      stock: true,
      transfers: false,
      purchasePrices: false,
      reports: false,
      hr: false,
      settings: false,
      cruising: true,
      web: false,
    },
  },
  {
    role: "Entrepôt",
    permissions: {
      sales: false,
      stock: true,
      transfers: true,
      purchasePrices: false,
      reports: false,
      hr: false,
      settings: false,
      cruising: false,
      web: false,
    },
  },
];
