"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/products";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AppMode = "erp" | "boutique";
export type Language = "fr" | "en" | "es" | "de";

export interface StockEntry {
  productId: string;
  name: string;
  sku: string;
  price: number;
  pricePurchase: number;
  category: string;
  location: string;
  barcode: string;
  material: string;
  color: string;
  size: string;
  fitAdvice: string;
  dimensions: string;
  weight: string;
  sites: {
    entrepot: number;
    boutique1Rayon: number;
    boutique1Reserve: number;
    boutique2Rayon: number;
    boutique2Reserve: number;
    web: number;
    [key: string]: number;
  };
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface CashEvent {
  id: string;
  timestamp: number;
  time: string;
  vendor: string;
  reason: string;
  taken: number;
  returned: number;
  delta: number;
}

export interface AppUser {
  name: string;
  email?: string;
  role: string;
  isB2B: boolean;
  loyaltyPoints: number;
  cruisingEntries: number;
  cardNumber?: string;
}

export interface CruisingReservation {
  id: string;
  code: string;
  offerId: string;
  offerName: string;
  price: number;
  paymentMode: "online" | "cash";
  status: "Payé en ligne" | "À régler sur place";
  timestamp: number;
  date: string;
  customerName: string;
}

export interface InternalMessage {
  id: string;
  timestamp: number;
  time: string;
  sender: string;
  site: string;
  content: string;
}

export interface StaffPresenceEvent {
  id: string;
  timestamp: number;
  time: string;
  staffName: string;
  type: "Arrivée" | "Départ";
  site: string;
  hoursWorkedToday?: number;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  timestamp: number;
  date: string;
  productId: string;
  productName: string;
  fromSite: string;
  toSite: string;
  qty: number;
  status: "En cours" | "Validé" | "Réceptionné";
  operator: string;
}

// Promo Code
export interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "fixed" | "freeship";
  value: number; // e.g. 10 for 10%, 15 for 15€, 0 for freeship
  minOrder?: number;
  usageCount: number;
  maxUsage?: number;
  active: boolean;
  expiry: string;
  description: string;
}

// ERP Orders
export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export type ERPPartyType =
  | "Fournisseurs"
  | "Client particulier"
  | "B2B"
  | "Dark Ink"
  | "Boxxman"
  | "New Millenium"
  | "Boutique 1"
  | "Boutique 2"
  | "Entrepôt";

export type ERPOrderStatus =
  | "Commande effectuée"
  | "En attente de traitement chez le fournisseur"
  | "Commande expédiée"
  | "Commande reçue"
  | "Commande vérifiée"
  | "Produits dispatchés"
  | "Pertes d'exploitation"
  | "Enregistrée"
  | "En préparation"
  | "Prête pour retrait"
  | "Expédiée"
  | "Livrée"
  | "Annulée"
  | string;

export interface ERPOrderVerification {
  boxCondition: string;
  packagingCondition: string;
  productCondition: string;
  conformQty: number;
  totalQty: number;
  isLoss?: boolean;
  lossReason?: string;
  dispatchAllocations?: {
    boxxman?: number;
    newMillenium?: number;
    darkInk?: number;
    boutique1?: number;
    boutique2?: number;
    entrepot?: number;
    storageChoice: "Rayon" | "Réserve";
  };
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ERPOrder {
  id: string;
  orderNumber: string;
  supplierRef?: string;
  internalRef?: string;
  channel: "fournisseurs" | "web" | "boutique1" | "boutique2";
  type: "fournisseurs" | "clients";
  clientType?: "particulier" | "pro" | "interne";
  clientOrSupplierName: string;
  emitter?: ERPPartyType | string;
  emitterName?: string;
  emitterAddress?: string;
  receiver?: ERPPartyType | string;
  receiverName?: string;
  receiverAddress?: string;
  date: string;
  timestamp: number;
  items: OrderItem[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  promoCode?: string;
  discountAmount?: number;
  deliveryMethod: string;
  trackingNumber?: string;
  status: ERPOrderStatus;
  verification?: ERPOrderVerification;
}

// Deliveries
export interface ERPDelivery {
  id: string;
  trackingNumber: string;
  channel: "fournisseurs" | "web" | "boutique1" | "boutique2";
  origin: string;
  destination: string;
  carrier: string;
  date: string;
  status: "En transit" | "Arrivé au hub" | "En cours de livraison" | "Livré / Conforme" | "Anomalie";
  packageType: string;
  recipient: string;
  itemsSummary: string;
}

// Pertes d'exploitation & Produits Défectueux
export interface DefectiveProductEntry {
  id: string;
  claimNumber: string;
  productId: string;
  productName: string;
  sku: string;
  supplier: string;
  qty: number;
  costValue: number;
  productCondition: string; // Ex: "Couture défectueuse", "Rayure profonde"
  packagingCondition: string; // Ex: "Carton trempé / déchiré", "Descellé"
  sourceContext: "Réception Quai Entrepôt" | "Contrôle Carton Commande" | "Retour Client";
  date: string;
  timestamp: number;
  status: "Réclamation fournisseur en cours" | "Avoir fournisseur reçu" | "Pertes d'exploitation confirmées";
}

// Transferts internes & Dispatch depuis l'entrepôt initial
export interface InternalTransferDispatch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  sku: string;
  supplier: string;
  totalReceived: number;
  qtyEntrepot: number;
  qtyBoutique1: number;
  qtyBoutique2: number;
  productCondition: "Conforme / Neuf" | "Défaut d'aspect" | "Défectueux / Inutilisable";
  packagingCondition: "Impeccable / Scellé" | "Carton écrasé / Déchiré" | "Non scellé / Absent";
  status:
    | "En cours de dispatch"
    | "Pertes / Défectueux"
    | "En attente de livraison / Confirmation en boutique"
    | "Confirmé & Réceptionné";
  date: string;
  time: string;
  targetStorageChoice?: "Rayon" | "Réserve";
  targetLocation?: string;
}

// Returns & SAV
export interface OrderReturn {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  customerType: "particulier" | "pro";
  product: string;
  qty: number;
  amount: number;
  date: string;
  reason:
    | "Défaut de fabrication"
    | "Taille inadaptée"
    | "Non-conformité"
    | "Rétractation (sous blister)"
    | "Article endommagé";
  condition:
    | "Blister d'hygiène intact (scellé)"
    | "Article déjà porté / descellé"
    | "Délai légal 14j expiré"
    | "État neuf avec étiquette";
  status:
    | "En attente d'inspection"
    | "Remboursé sur carte bleue"
    | "Avoir émis"
    | "Échange expédié"
    | "Refusé (Non conforme)";
  refusalReason?: string;
  decisionDate?: string;
}

// Invoices
export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "Particulier" | "Pro B2B" | "Interne Cession";
  clientName: string;
  date: string;
  dueDays: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: "Payée" | "En attente" | "Avoir émis";
}

// Salaries
export interface SalarySlip {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  site: string;
  period: string; // e.g. "Novembre 2026"
  baseSalary: number;
  trackedHours: number;
  nightHours: number;
  overtimeHours: number;
  bonus: number;
  deductions: number;
  netPayable: number;
  status: "Payé par virement SEPA" | "En préparation";
  paymentDate?: string;
}

// ---------------------------------------------------------------------------
// Context Value Interface
// ---------------------------------------------------------------------------

export interface AppContextValue {
  appMode: AppMode;
  stocks: Record<string, StockEntry>;
  cashLog: CashEvent[];
  cart: CartItem[];
  language: Language;
  user: AppUser | null;
  ageVerified: boolean;
  messages: InternalMessage[];
  staffPresence: StaffPresenceEvent[];
  transfers: StockTransfer[];
  cruisingReservations: CruisingReservation[];
  orders: ERPOrder[];
  deliveries: ERPDelivery[];
  internalDispatches: InternalTransferDispatch[];
  defectiveProducts: DefectiveProductEntry[];
  returns: OrderReturn[];
  invoices: Invoice[];
  salaries: SalarySlip[];
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  currentRole: "Gérant" | "Responsable" | "Vendeur" | "Entrepôt";
  mounted: boolean;

  setAppMode: (mode: AppMode) => void;
  setLanguage: (lang: Language) => void;
  setAgeVerified: (v: boolean) => void;
  setCurrentRole: (role: "Gérant" | "Responsable" | "Vendeur" | "Entrepôt") => void;

  // Cart & Promo
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { valid: boolean; message: string; discount: number };
  removePromoCode: () => void;
  addOrUpdatePromoCode: (promo: PromoCode) => void;

  // Boutique Catalog Shared Filters
  catalogCategory: string;
  setCatalogCategory: (cat: string) => void;
  catalogSearchQuery: string;
  setCatalogSearchQuery: (q: string) => void;
  catalogShowMoreModal: boolean;
  setCatalogShowMoreModal: (open: boolean) => void;
  catalogActiveFiltersCount: number;
  setCatalogActiveFiltersCount: (count: number) => void;

  // Stocks
  updateStock: (productId: string, siteKey: string, delta: number) => void;
  setExactStock: (productId: string, siteKey: string, value: number) => void;

  // Logs & Messages
  addCashEvent: (event: Omit<CashEvent, "id" | "timestamp">) => void;
  addMessage: (msg: { sender: string; site: string; content: string }) => void;

  // HR
  clockIn: (staffName: string, site?: string) => void;
  clockOut: (staffName: string, site?: string) => void;

  // Operations
  createTransfer: (data: {
    productId: string;
    productName: string;
    fromSite: string;
    toSite: string;
    qty: number;
    operator: string;
  }) => StockTransfer;

  addCruisingReservation: (data: {
    offerId: string;
    offerName: string;
    price: number;
    paymentMode: "online" | "cash";
  }) => CruisingReservation;

  updateOrderStatus: (orderId: string, status: ERPOrder["status"]) => void;
  addERPOrder: (newOrder: ERPOrder) => void;
  updateERPOrder: (orderId: string, partial: Partial<ERPOrder>) => void;
  updateERPOrderVerification: (
    orderId: string,
    verification: ERPOrderVerification,
    newStatus: string,
  ) => void;
  catalogProducts: Product[];
  addProductToCatalog: (product: Product) => void;
  updateCatalogProduct: (product: Product) => void;
  updateDeliveryStatus: (deliveryId: string, status: ERPDelivery["status"]) => void;
  resolveReturn: (
    returnId: string,
    decision: OrderReturn["status"],
    refusalReason?: string,
  ) => void;

  updateSalaryStatus: (salaryId: string, status: SalarySlip["status"]) => void;

  // Réception, Dispatch & Pertes d'exploitation
  addDefectiveProduct: (entry: Omit<DefectiveProductEntry, "id" | "timestamp" | "claimNumber">) => void;
  updateDefectiveStatus: (id: string, status: DefectiveProductEntry["status"]) => void;
  dispatchReceptionInitial: (data: Omit<InternalTransferDispatch, "id" | "date" | "time">) => void;
  confirmBoutiqueReception: (
    dispatchId: string,
    siteKey: "boutique1" | "boutique2" | "web",
    storageChoice: "Rayon" | "Réserve",
    location: string,
  ) => void;
  recordOrderBoxInspection: (
    orderId: string,
    boxCondition: string,
    inspectedItems: Array<{
      productId: string;
      productCondition: string;
      packagingCondition: string;
      storageChoice: "Rayon" | "Réserve";
      assignedLocation: string;
      isDefective: boolean;
    }>,
  ) => void;

  // User
  loginUser: (user: Partial<AppUser>) => void;
  logoutUser: () => void;
  toggleB2B: () => void;
  addCruisingEntry: (count: number) => void;

  resetDemo: () => void;
}

// ---------------------------------------------------------------------------
// Initial Seed Data
// ---------------------------------------------------------------------------

const PREFIX = "boxman_v4_";

const KEYS = {
  appMode: `${PREFIX}appMode`,
  stocks: `${PREFIX}stocks`,
  cashLog: `${PREFIX}cashLog`,
  cart: `${PREFIX}cart`,
  language: `${PREFIX}language`,
  user: `${PREFIX}user`,
  ageVerified: `${PREFIX}ageVerified`,
  messages: `${PREFIX}messages`,
  staffPresence: `${PREFIX}staffPresence`,
  transfers: `${PREFIX}transfers`,
  cruisingReservations: `${PREFIX}cruisingReservations`,
  orders: `${PREFIX}orders`,
  deliveries: `${PREFIX}deliveries`,
  internalDispatches: `${PREFIX}internalDispatches`,
  defectiveProducts: `${PREFIX}defectiveProducts`,
  returns: `${PREFIX}returns`,
  invoices: `${PREFIX}invoices`,
  salaries: `${PREFIX}salaries`,
  promoCodes: `${PREFIX}promoCodes`,
  appliedPromo: `${PREFIX}appliedPromo`,
  currentRole: `${PREFIX}currentRole`,
  catalogProducts: `${PREFIX}catalogProducts`,
} as const;

function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36).substring(4)}`;
}

function formatCurrentTime(): string {
  const now = new Date();
  return now.toTimeString().substring(0, 5);
}

function buildInitialStocks(): Record<string, StockEntry> {
  const map: Record<string, StockEntry> = {};
  for (const p of products) {
    map[p.id] = {
      productId: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      pricePurchase: p.pricePurchase,
      category: p.category,
      location: p.location,
      barcode: p.barcode,
      material: p.material,
      color: p.color,
      size: p.size,
      fitAdvice: p.fitAdvice,
      dimensions: p.dimensions,
      weight: p.weight,
      sites: {
        entrepot: p.stock.entrepot,
        boutique1Rayon: p.stock.boutique1Rayon,
        boutique1Reserve: p.stock.boutique1Reserve,
        boutique2Rayon: p.stock.boutique2Rayon,
        boutique2Reserve: p.stock.boutique2Reserve,
        web: p.stock.web,
      },
    };
  }
  return map;
}

const initialPromoCodes: PromoCode[] = [
  {
    id: "promo-1",
    code: "DARK10",
    type: "percent",
    value: 10,
    minOrder: 50,
    usageCount: 42,
    active: true,
    expiry: "31/12/2026",
    description: "-10% dès 50€ d'achats sur tout le catalogue",
  },
  {
    id: "promo-2",
    code: "VIP20",
    type: "percent",
    value: 20,
    minOrder: 100,
    usageCount: 19,
    active: true,
    expiry: "31/12/2026",
    description: "-20% exclusif membres Privilège dès 100€",
  },
  {
    id: "promo-3",
    code: "FREESHIP",
    type: "freeship",
    value: 0,
    minOrder: 40,
    usageCount: 88,
    active: true,
    expiry: "31/12/2026",
    description: "Frais de port offerts (Colissimo / Relais)",
  },
  {
    id: "promo-4",
    code: "WELCOME15",
    type: "fixed",
    value: 15,
    minOrder: 80,
    usageCount: 61,
    active: true,
    expiry: "31/12/2026",
    description: "-15€ immédiats pour toute première commande",
  },
];

const initialOrders: ERPOrder[] = [
  // 1. Commande effectuée
  {
    id: "ord-1",
    orderNumber: "CMD-F-2026-101",
    supplierRef: "PO-PROW-9921",
    internalRef: "DK-INT-26-101",
    channel: "fournisseurs",
    type: "fournisseurs",
    clientOrSupplierName: "Prowler Lab London",
    emitter: "Dark Ink",
    emitterName: "Dark Ink",
    receiver: "Fournisseurs",
    receiverName: "Prowler Lab London",
    date: "22/11/2026",
    timestamp: Date.now() - 1000 * 60 * 30,
    items: [
      { productId: "prod-006", name: "Lubrifiant Silicone 'Dark Glide' 250ml", qty: 60, unitPrice: 14.50, total: 870 },
      { productId: "prod-012", name: "Nettoyant Cuir & Latex Pur 'Deep Clean'", qty: 40, unitPrice: 11.20, total: 448 },
    ],
    totalHT: 1318.00,
    totalTVA: 263.60,
    totalTTC: 1581.60,
    deliveryMethod: "DHL Global Forwarding",
    status: "Commande effectuée",
  },
  // 2. En attente de traitement chez le fournisseur
  {
    id: "ord-2",
    orderNumber: "CMD-F-2026-098",
    supplierRef: "BC-MLP-4402",
    internalRef: "DK-INT-26-098",
    channel: "fournisseurs",
    type: "fournisseurs",
    clientOrSupplierName: "Master Leather Paris",
    emitter: "Boxxman",
    emitterName: "Boxxman",
    receiver: "Fournisseurs",
    receiverName: "Master Leather Paris",
    date: "21/11/2026",
    timestamp: Date.now() - 1000 * 60 * 360,
    items: [
      { productId: "prod-001", name: "Harnais Torse Cuir 'Titan' Ajustable", qty: 25, unitPrice: 42.00, total: 1050 },
      { productId: "prod-004", name: "Ensemble Menottes Cuir Agneau Doublé", qty: 20, unitPrice: 21.00, total: 420 },
    ],
    totalHT: 1470.00,
    totalTVA: 294.00,
    totalTTC: 1764.00,
    deliveryMethod: "Coursier Express",
    status: "En attente de traitement chez le fournisseur",
  },
  // 3. Commande expédiée (avec N° de suivi)
  {
    id: "ord-3",
    orderNumber: "CMD-F-2026-092",
    supplierRef: "BL-CGN-8819",
    internalRef: "DK-INT-26-092",
    channel: "fournisseurs",
    type: "fournisseurs",
    clientOrSupplierName: "Black Latex Cologne",
    emitter: "Fournisseurs",
    emitterName: "Black Latex Cologne",
    receiver: "Dark Ink",
    receiverName: "Dark Ink",
    date: "20/11/2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    items: [
      { productId: "prod-003", name: "T-Shirt Seconde Peau Latex 0.4mm Zippé", qty: 35, unitPrice: 65.00, total: 2275 },
    ],
    totalHT: 2275.00,
    totalTVA: 455.00,
    totalTTC: 2730.00,
    deliveryMethod: "UPS Standard Fret",
    trackingNumber: "UPS-1Z99824004921",
    status: "Commande expédiée",
  },
  // 4. Commande reçue (au quai, prête pour contrôle)
  {
    id: "ord-4",
    orderNumber: "CMD-F-2026-081",
    supplierRef: "DL-BER-1094",
    internalRef: "DK-INT-26-081",
    channel: "fournisseurs",
    type: "fournisseurs",
    clientOrSupplierName: "Darkline Berlin",
    emitter: "Fournisseurs",
    emitterName: "Darkline Berlin",
    receiver: "Dark Ink",
    receiverName: "Dark Ink",
    date: "19/11/2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    items: [
      { productId: "prod-001", name: "Harnais Torse Cuir 'Titan'", qty: 50, unitPrice: 45, total: 2250 },
      { productId: "prod-004", name: "Ensemble Menottes Cuir Agneau", qty: 40, unitPrice: 22, total: 880 },
    ],
    totalHT: 3130,
    totalTVA: 626,
    totalTTC: 3756,
    deliveryMethod: "Schenker Fret",
    trackingNumber: "FR-SCH-883921",
    status: "Commande reçue",
  },
  // 5. Commande vérifiée (X produits conformes sur X totaux)
  {
    id: "ord-5",
    orderNumber: "CMD-F-2026-074",
    supplierRef: "FSC-SOL-3391",
    internalRef: "DK-INT-26-074",
    channel: "fournisseurs",
    type: "fournisseurs",
    clientOrSupplierName: "Fetish Steel Solingen",
    emitter: "Fournisseurs",
    emitterName: "Fetish Steel Solingen",
    receiver: "Dark Ink",
    receiverName: "Dark Ink",
    date: "18/11/2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    items: [
      { productId: "prod-005", name: "Plug Anal Acier Lourd 'Onyx'", qty: 50, unitPrice: 19.50, total: 975 },
      { productId: "prod-008", name: "Collier de Soumission Acier & O-Ring", qty: 30, unitPrice: 24.00, total: 720 },
    ],
    totalHT: 1695.00,
    totalTVA: 339.00,
    totalTTC: 2034.00,
    deliveryMethod: "DPD Express",
    trackingNumber: "DPD-FR-993821",
    status: "Commande vérifiée",
    verification: {
      boxCondition: "Carton intact & scellé d'usine",
      packagingCondition: "Blister / Scellé intact d'origine",
      productCondition: "Conforme / Neuf",
      conformQty: 78,
      totalQty: 80,
      isLoss: false,
      verifiedBy: "Réception Quai",
      verifiedAt: "19/11/2026 11:30",
    },
  },
  // 6. Produits dispatchés (dispatchés vers Boxxman, New Millenium, Dark Ink)
  {
    id: "ord-6",
    orderNumber: "CMD-DISP-2026-042",
    supplierRef: "K9-PRG-0294",
    internalRef: "DK-INT-26-042",
    channel: "entrepot" as any,
    type: "fournisseurs",
    clientOrSupplierName: "K9 Gear Prague",
    emitter: "Dark Ink",
    emitterName: "Dark Ink",
    receiver: "Boxxman",
    receiverName: "Boxxman",
    date: "17/11/2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    items: [
      { productId: "prod-010", name: "Cagoule Puppy Cuir 'Cerberus' Ajustable", qty: 30, unitPrice: 48.00, total: 1440 },
    ],
    totalHT: 1440.00,
    totalTVA: 288.00,
    totalTTC: 1728.00,
    deliveryMethod: "Navette Interne",
    status: "Produits dispatchés",
    verification: {
      boxCondition: "Carton intact & scellé d'usine",
      packagingCondition: "Blister / Scellé intact d'origine",
      productCondition: "Conforme / Neuf",
      conformQty: 30,
      totalQty: 30,
      isLoss: false,
      dispatchAllocations: {
        boxxman: 15,
        newMillenium: 10,
        darkInk: 5,
        storageChoice: "Rayon",
      },
      verifiedBy: "Responsable",
      verifiedAt: "17/11/2026 15:00",
    },
  },
  // 7. Pertes d'exploitation (non conformité / litige fournisseur)
  {
    id: "ord-7",
    orderNumber: "CMD-F-2026-068",
    supplierRef: "APL-AMS-7710",
    internalRef: "DK-INT-26-068",
    channel: "fournisseurs",
    type: "fournisseurs",
    clientOrSupplierName: "Aroma Pure Amsterdam",
    emitter: "Fournisseurs",
    emitterName: "Aroma Pure Amsterdam",
    receiver: "Dark Ink",
    receiverName: "Dark Ink",
    date: "16/11/2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    items: [
      { productId: "prod-009", name: "Formule Arômes 'Iron Grip' 30ml", qty: 48, unitPrice: 7.50, total: 360 },
    ],
    totalHT: 360.00,
    totalTVA: 72.00,
    totalTTC: 432.00,
    deliveryMethod: "GLS Fret",
    trackingNumber: "GLS-AVARIE-440182",
    status: "Pertes d'exploitation",
    verification: {
      boxCondition: "Carton écrasé / perforé",
      packagingCondition: "Emballage déchiré / ouvert",
      productCondition: "Endommagé / Inutilisable / Cassé",
      conformQty: 0,
      totalQty: 48,
      isLoss: true,
      lossReason: "Carton écrasé, flacons brisés avec écoulement complet. Demande d'avoir fournisseur en cours.",
      verifiedBy: "Contrôleur Quai",
      verifiedAt: "16/11/2026 14:15",
    },
  },
  // 8. Client particulier (B2C Web)
  {
    id: "ord-w1",
    orderNumber: "CMD-WEB-99120",
    supplierRef: "B2C-PAY-9912",
    internalRef: "DK-WEB-26-120",
    channel: "web",
    type: "clients",
    clientType: "particulier",
    clientOrSupplierName: "Marc Vasseur",
    emitter: "Boxxman",
    emitterName: "Boxxman",
    receiver: "Client particulier",
    receiverName: "Marc Vasseur",
    date: "21/11/2026",
    timestamp: Date.now() - 1000 * 60 * 120,
    items: [
      { productId: "prod-003", name: "T-Shirt Seconde Peau Latex 0.4mm Zippé", qty: 1, unitPrice: 135, total: 135 },
      { productId: "prod-006", name: "Lubrifiant Silicone 'Dark Glide' 250ml", qty: 2, unitPrice: 26.5, total: 53 },
    ],
    totalHT: 156.67,
    totalTVA: 31.33,
    totalTTC: 188,
    promoCode: "DARK10",
    discountAmount: 18.80,
    deliveryMethod: "Colissimo",
    trackingNumber: "COLISSIMO-6A8891290",
    status: "Commande expédiée",
  },
  // 9. Client Professionnel (B2B)
  {
    id: "ord-w2",
    orderNumber: "CMD-PRO-77412",
    supplierRef: "B2B-VLV-7741",
    internalRef: "DK-PRO-26-412",
    channel: "web",
    type: "clients",
    clientType: "pro",
    clientOrSupplierName: "SARL Velvet Club",
    emitter: "Dark Ink",
    emitterName: "Dark Ink",
    receiver: "B2B",
    receiverName: "SARL Velvet Club",
    date: "21/11/2026",
    timestamp: Date.now() - 1000 * 60 * 240,
    items: [
      { productId: "prod-006", name: "Lubrifiant Silicone 'Dark Glide' 250ml", qty: 24, unitPrice: 18.55, total: 445.20 },
      { productId: "prod-005", name: "Plug Anal Acier Lourd 'Onyx'", qty: 6, unitPrice: 34.30, total: 205.80 },
    ],
    totalHT: 651.00,
    totalTVA: 130.20,
    totalTTC: 781.20,
    deliveryMethod: "DHL Express Pro",
    trackingNumber: "DHL-PRO-889120",
    status: "Commande vérifiée",
    verification: {
      boxCondition: "Carton intact & scellé d'usine",
      packagingCondition: "Blister / Scellé intact d'origine",
      productCondition: "Conforme / Neuf",
      conformQty: 30,
      totalQty: 30,
      isLoss: false,
      verifiedBy: "Équipe B2B",
      verifiedAt: "21/11/2026 16:00",
    },
  },
  // 10. Transfert Interne (Boxxman vers New Millenium)
  {
    id: "ord-b1-int",
    orderNumber: "CMD-INT-B1-B2-01",
    supplierRef: "NAV-PARIS-01",
    internalRef: "DK-TRF-26-001",
    channel: "boutique1",
    type: "clients",
    clientType: "interne",
    clientOrSupplierName: "Transfert vers New Millenium",
    emitter: "Boxxman",
    emitterName: "Boxxman",
    receiver: "New Millenium",
    receiverName: "New Millenium",
    date: "21/11/2026",
    timestamp: Date.now() - 1000 * 60 * 180,
    items: [
      { productId: "prod-002", name: "Harnais d'Épaule 'Centurion'", qty: 4, unitPrice: 32, total: 128 },
    ],
    totalHT: 128.00,
    totalTVA: 0,
    totalTTC: 128.00,
    deliveryMethod: "Navette Inter-Boutiques",
    status: "Produits dispatchés",
    verification: {
      boxCondition: "Carton intact & scellé d'usine",
      packagingCondition: "Blister / Scellé intact d'origine",
      productCondition: "Conforme / Neuf",
      conformQty: 4,
      totalQty: 4,
      isLoss: false,
      dispatchAllocations: {
        boxxman: 0,
        newMillenium: 4,
        darkInk: 0,
        storageChoice: "Rayon",
      },
      verifiedBy: "Vendeur",
      verifiedAt: "21/11/2026 17:30",
    },
  },
];

const initialDeliveries: ERPDelivery[] = [
  {
    id: "del-1",
    trackingNumber: "FR-SCH-883921",
    channel: "fournisseurs",
    origin: "Darkline Leatherworks (Berlin)",
    destination: "Entrepôt Central (Roissy)",
    carrier: "Schenker Logistics",
    date: "21/11/2026",
    status: "En transit",
    packageType: "Palette filmée noire opaque (90 kg)",
    recipient: "Lucas Moreau (Réception Quai)",
    itemsSummary: "50x Harnais Titan, 40x Menottes Agneau",
  },
  {
    id: "del-2",
    trackingNumber: "6A23849102931",
    channel: "web",
    origin: "Entrepôt Central",
    destination: "Marc V., 69002 Lyon",
    carrier: "La Poste Colissimo",
    date: "21/11/2026",
    status: "En cours de livraison",
    packageType: "Carton brun neutre scellé sans mention",
    recipient: "Marc V.",
    itemsSummary: "1x T-Shirt Latex 0.4mm, 2x Dark Glide",
  },
  {
    id: "del-3",
    trackingNumber: "NAV-MARAIS-08",
    channel: "boutique1",
    origin: "Entrepôt Central",
    destination: "Boutique 1 — Marais",
    carrier: "Navette Inter-Boutiques Boxman",
    date: "21/11/2026",
    status: "Livré / Conforme",
    packageType: "Bacs scellés sécurisés",
    recipient: "Sophie Martin (Responsable B1)",
    itemsSummary: "Réassort hebdomadaire 60 unités",
  },
  {
    id: "del-4",
    trackingNumber: "NAV-BASTILLE-04",
    channel: "boutique2",
    origin: "Entrepôt Central",
    destination: "Boutique 2 — Bastille",
    carrier: "Navette Inter-Boutiques Boxman",
    date: "21/11/2026",
    status: "En transit",
    packageType: "Bacs scellés sécurisés",
    recipient: "Julien Bernard (Vendeur B2)",
    itemsSummary: "Réassort quincaillerie & harnais 35 unités",
  },
];

const initialDefectiveProducts: DefectiveProductEntry[] = [
  {
    id: "def-01",
    claimNumber: "REC-FOURN-2026-018",
    productId: "prod-001",
    productName: "Harnais Torse Cuir 'Titan' Ajustable",
    sku: "DK-HAR-001",
    supplier: "Darkline Leatherworks (Berlin)",
    qty: 2,
    costValue: 90.00,
    productCondition: "Rivets desserrés & cuir griffé",
    packagingCondition: "Carton d'origine écrasé et mouillé",
    sourceContext: "Réception Quai Entrepôt",
    date: "21/11/2026",
    timestamp: Date.now() - 1000 * 60 * 180,
    status: "Réclamation fournisseur en cours",
  },
  {
    id: "def-02",
    claimNumber: "REC-FOURN-2026-015",
    productId: "prod-003",
    productName: "T-Shirt Seconde Peau Latex 0.4mm Zippé",
    sku: "DK-LAT-003",
    supplier: "RubberFactory UK",
    qty: 1,
    costValue: 55.00,
    productCondition: "Micro-déchirure zip ventral",
    packagingCondition: "Sachet hermétique perforé",
    sourceContext: "Contrôle Carton Commande",
    date: "19/11/2026",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    status: "Avoir fournisseur reçu",
  },
];

const initialInternalDispatches: InternalTransferDispatch[] = [
  {
    id: "disp-01",
    batchNumber: "LOT-RECEP-2026-11-A",
    productId: "prod-001",
    productName: "Harnais Torse Cuir 'Titan' Ajustable",
    sku: "DK-HAR-001",
    supplier: "Darkline Leatherworks (Berlin)",
    totalReceived: 50,
    qtyEntrepot: 20,
    qtyBoutique1: 18,
    qtyBoutique2: 12,
    productCondition: "Conforme / Neuf",
    packagingCondition: "Impeccable / Scellé",
    status: "En attente de livraison / Confirmation en boutique",
    date: "21/11/2026",
    time: "10:15",
    targetStorageChoice: "Rayon",
    targetLocation: "B1-RAY-02",
  },
  {
    id: "disp-02",
    batchNumber: "LOT-RECEP-2026-11-B",
    productId: "prod-006",
    productName: "Lubrifiant Silicone 'Dark Glide' 250ml",
    sku: "DK-LUB-006",
    supplier: "SwissPharma Intimate",
    totalReceived: 60,
    qtyEntrepot: 30,
    qtyBoutique1: 15,
    qtyBoutique2: 15,
    productCondition: "Conforme / Neuf",
    packagingCondition: "Impeccable / Scellé",
    status: "Confirmé & Réceptionné",
    date: "20/11/2026",
    time: "14:30",
    targetStorageChoice: "Réserve",
    targetLocation: "ENT-A04-E2",
  },
];

const initialReturns: OrderReturn[] = [
  {
    id: "ret-1",
    returnNumber: "RET-2026-031",
    orderNumber: "CMD-WEB-98402",
    customerName: "Thomas B. (Bordeaux)",
    customerType: "particulier",
    product: "Harnais Torse Cuir 'Titan'",
    qty: 1,
    amount: 119.00,
    date: "20/11/2026",
    reason: "Taille inadaptée",
    condition: "État neuf avec étiquette",
    status: "En attente d'inspection",
  },
  {
    id: "ret-2",
    returnNumber: "RET-2026-032",
    orderNumber: "CMD-WEB-97910",
    customerName: "Julien P. (Paris)",
    customerType: "particulier",
    product: "T-Shirt Seconde Peau Latex 0.4mm",
    qty: 1,
    amount: 135.00,
    date: "19/11/2026",
    reason: "Rétractation (sous blister)",
    condition: "Article déjà porté / descellé",
    status: "Refusé (Non conforme)",
    refusalReason: "Article d'hygiène intime descellé et essayé sans protection — Exclusion légale Art. L221-28",
    decisionDate: "20/11/2026",
  },
  {
    id: "ret-3",
    returnNumber: "RET-2026-033",
    orderNumber: "CMD-B1-32981",
    customerName: "SARL Studio K (Pro B2B)",
    customerType: "pro",
    product: "Collier de Soumission Acier & O-Ring",
    qty: 2,
    amount: 77.00,
    date: "18/11/2026",
    reason: "Défaut de fabrication",
    condition: "État neuf avec étiquette",
    status: "Avoir émis",
    decisionDate: "19/11/2026",
  },
];

const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "FAC-2026-1104",
    type: "Particulier",
    clientName: "Marc V.",
    date: "21/11/2026",
    dueDays: 0,
    totalHT: 156.67,
    totalTVA: 31.33,
    totalTTC: 188.00,
    status: "Payée",
  },
  {
    id: "inv-2",
    invoiceNumber: "FAC-PRO-2026-092",
    type: "Pro B2B",
    clientName: "SARL Velvet Club Paris",
    date: "21/11/2026",
    dueDays: 30,
    totalHT: 651.00,
    totalTVA: 130.20,
    totalTTC: 781.20,
    status: "En attente",
  },
  {
    id: "inv-3",
    invoiceNumber: "CESS-2026-041",
    type: "Interne Cession",
    clientName: "Cession Interne B1 -> B2",
    date: "20/11/2026",
    dueDays: 0,
    totalHT: 128.00,
    totalTVA: 0,
    totalTTC: 128.00,
    status: "Payée",
  },
];

const initialSalaries: SalarySlip[] = [
  {
    id: "sal-1",
    staffId: "staff-001",
    staffName: "Laurent Dupont",
    role: "Gérant",
    site: "Entrepôt Central",
    period: "Novembre 2026",
    baseSalary: 3800.00,
    trackedHours: 151.67,
    nightHours: 12,
    overtimeHours: 8,
    bonus: 450.00,
    deductions: 890.00,
    netPayable: 3510.00,
    status: "Payé par virement SEPA",
    paymentDate: "20/11/2026",
  },
  {
    id: "sal-2",
    staffId: "staff-002",
    staffName: "Sophie Martin",
    role: "Responsable",
    site: "Boutique 1",
    period: "Novembre 2026",
    baseSalary: 2600.00,
    trackedHours: 158.00,
    nightHours: 28,
    overtimeHours: 6.5,
    bonus: 250.00,
    deductions: 580.00,
    netPayable: 2480.00,
    status: "Payé par virement SEPA",
    paymentDate: "20/11/2026",
  },
  {
    id: "sal-3",
    staffId: "staff-003",
    staffName: "Julien Bernard",
    role: "Vendeur",
    site: "Boutique 2",
    period: "Novembre 2026",
    baseSalary: 1950.00,
    trackedHours: 148.50,
    nightHours: 18,
    overtimeHours: 0,
    bonus: 120.00,
    deductions: 420.00,
    netPayable: 1780.00,
    status: "En préparation",
  },
  {
    id: "sal-4",
    staffId: "staff-004",
    staffName: "Lucas Moreau",
    role: "Entrepôt",
    site: "Entrepôt Central",
    period: "Novembre 2026",
    baseSalary: 2050.00,
    trackedHours: 152.00,
    nightHours: 0,
    overtimeHours: 12,
    bonus: 180.00,
    deductions: 440.00,
    netPayable: 1940.00,
    status: "En préparation",
  },
  {
    id: "sal-5",
    staffId: "staff-005",
    staffName: "Marie Dupont",
    role: "Vendeur",
    site: "Boutique 1",
    period: "Novembre 2026",
    baseSalary: 1950.00,
    trackedHours: 144.00,
    nightHours: 22,
    overtimeHours: 0,
    bonus: 100.00,
    deductions: 410.00,
    netPayable: 1765.00,
    status: "En préparation",
  },
];

const initialCashLog: CashEvent[] = [
  {
    id: "cash-001",
    timestamp: Date.now() - 1000 * 60 * 180,
    time: "09:30",
    vendor: "Sophie Martin",
    reason: "Fond de caisse initial ouverture",
    taken: 0,
    returned: 250,
    delta: 250,
  },
  {
    id: "cash-002",
    timestamp: Date.now() - 1000 * 60 * 110,
    time: "10:45",
    vendor: "Julien Bernard",
    reason: "Monnaie billet 100 € client",
    taken: 100,
    returned: 100,
    delta: 0,
  },
  {
    id: "cash-003",
    timestamp: Date.now() - 1000 * 60 * 45,
    time: "11:50",
    vendor: "Marie D.",
    reason: "Achat fournitures urgentes (ruban adhésif)",
    taken: 15,
    returned: 1.5,
    delta: -13.5,
  },
];

const initialMessages: InternalMessage[] = [
  {
    id: "msg-001",
    timestamp: Date.now() - 1000 * 60 * 120,
    time: "10:30",
    sender: "Sophie Martin",
    site: "Boutique 1",
    content: "Besoin urgent de réassort sur le Harnais Titan (reste 2 en rayon).",
  },
  {
    id: "msg-002",
    timestamp: Date.now() - 1000 * 60 * 80,
    time: "11:10",
    sender: "Lucas Moreau",
    site: "Entrepôt Central",
    content: "Transfert TR-2024-001 préparé pour B1, départ prévu avec la navette de 14h.",
  },
];

const initialTransfers: StockTransfer[] = [
  {
    id: "tr-001",
    transferNumber: "TR-2024-001",
    timestamp: Date.now() - 1000 * 60 * 90,
    date: new Date().toLocaleDateString("fr-FR"),
    productId: "prod-001",
    productName: "Harnais Torse Cuir 'Titan' Ajustable",
    fromSite: "Entrepôt Central",
    toSite: "Boutique 1 — Rayon",
    qty: 20,
    status: "En cours",
    operator: "Lucas Moreau",
  },
];

const initialPresence: StaffPresenceEvent[] = [
  {
    id: "pres-001",
    timestamp: Date.now() - 1000 * 60 * 300,
    time: "08:55",
    staffName: "Laurent Dupont",
    type: "Arrivée",
    site: "Entrepôt",
    hoursWorkedToday: 7.5,
  },
  {
    id: "pres-002",
    timestamp: Date.now() - 1000 * 60 * 270,
    time: "09:25",
    staffName: "Sophie Martin",
    type: "Arrivée",
    site: "Boutique 1",
    hoursWorkedToday: 7.0,
  },
  {
    id: "pres-003",
    timestamp: Date.now() - 1000 * 60 * 240,
    time: "09:55",
    staffName: "Julien Bernard",
    type: "Arrivée",
    site: "Boutique 2",
    hoursWorkedToday: 6.5,
  },
];

const initialUser: AppUser = {
  name: "Alexandre Mercier",
  email: "a.mercier@club-prive.fr",
  role: "Membre Privilège",
  isB2B: false,
  loyaltyPoints: 340,
  cruisingEntries: 3,
  cardNumber: "BX-8842-PARIS",
};

const initialReservations: CruisingReservation[] = [
  {
    id: "res-001",
    code: "CRZ-8841-B1",
    offerId: "cruise-002",
    offerName: "Pass Soirée (Vestiaire inclus)",
    price: 25,
    paymentMode: "cash",
    status: "À régler sur place",
    timestamp: Date.now() - 1000 * 60 * 30,
    date: new Date().toLocaleDateString("fr-FR"),
    customerName: "Alexandre Mercier",
  },
];

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // States
  const [appMode, _setAppMode] = useState<AppMode>("erp");
  const [stocks, setStocks] = useState<Record<string, StockEntry>>({});
  const [cashLog, setCashLog] = useState<CashEvent[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  // Boutique Catalog Shared Filters (sticky sub-navbar & catalog)
  const [catalogCategory, setCatalogCategory] = useState<string>("all");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>("");
  const [catalogShowMoreModal, setCatalogShowMoreModal] = useState<boolean>(false);
  const [catalogActiveFiltersCount, setCatalogActiveFiltersCount] = useState<number>(0);
  const [language, _setLanguage] = useState<Language>("fr");
  const [user, _setUser] = useState<AppUser | null>(initialUser);
  const [ageVerified, _setAgeVerified] = useState(false);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [staffPresence, setStaffPresence] = useState<StaffPresenceEvent[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [cruisingReservations, setCruisingReservations] = useState<CruisingReservation[]>([]);
  const [orders, setOrders] = useState<ERPOrder[]>([]);
  const [deliveries, setDeliveries] = useState<ERPDelivery[]>([]);
  const [internalDispatches, setInternalDispatches] = useState<InternalTransferDispatch[]>([]);
  const [defectiveProducts, setDefectiveProducts] = useState<DefectiveProductEntry[]>([]);
  const [returns, setReturns] = useState<OrderReturn[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [salaries, setSalaries] = useState<SalarySlip[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [currentRole, _setCurrentRole] = useState<
    "Gérant" | "Responsable" | "Vendeur" | "Entrepôt"
  >("Gérant");
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  // Mount effect
  useEffect(() => {
    _setAppMode(readLS<AppMode>(KEYS.appMode, "erp"));
    _setLanguage(readLS<Language>(KEYS.language, "fr"));
    _setAgeVerified(readLS<boolean>(KEYS.ageVerified, false));
    _setUser(readLS<AppUser | null>(KEYS.user, initialUser));
    _setCurrentRole(
      readLS<"Gérant" | "Responsable" | "Vendeur" | "Entrepôt">(
        KEYS.currentRole,
        "Gérant",
      ),
    );
    setCashLog(readLS<CashEvent[]>(KEYS.cashLog, initialCashLog));
    setCart(readLS<CartItem[]>(KEYS.cart, [{ productId: "prod-001", qty: 1 }]));
    setMessages(readLS<InternalMessage[]>(KEYS.messages, initialMessages));
    setStaffPresence(
      readLS<StaffPresenceEvent[]>(KEYS.staffPresence, initialPresence),
    );
    setTransfers(readLS<StockTransfer[]>(KEYS.transfers, initialTransfers));
    setCruisingReservations(
      readLS<CruisingReservation[]>(
        KEYS.cruisingReservations,
        initialReservations,
      ),
    );
    const rawOrders = readLS<ERPOrder[]>(KEYS.orders, initialOrders);
    const sanitizedOrders = (rawOrders && rawOrders.length > 0 ? rawOrders : initialOrders).map((ord) => {
      let emitter =
        ord.emitter === "Entrepôt"
          ? "Dark Ink"
          : ord.emitter === "Boutique 1"
          ? "Boxxman"
          : ord.emitter === "Boutique 2"
          ? "New Millenium"
          : ord.emitter;
      let receiver =
        ord.receiver === "Entrepôt"
          ? "Dark Ink"
          : ord.receiver === "Boutique 1"
          ? "Boxxman"
          : ord.receiver === "Boutique 2"
          ? "New Millenium"
          : ord.receiver;

      if (!emitter) {
        emitter = ord.type === "fournisseurs" ? "Fournisseurs" : "Dark Ink";
      }
      if (!receiver) {
        receiver = ord.clientType === "pro" ? "B2B" : "Boxxman";
      }

      // Règle stricte : Émetteur et Destinataire ne peuvent JAMAIS être la même entité
      if (emitter === receiver) {
        if (emitter === "Dark Ink") receiver = "Boxxman";
        else if (emitter === "Boxxman") receiver = "New Millenium";
        else receiver = "Dark Ink";
      }

      let emitterName = ord.emitterName;
      if (!emitterName || emitterName === "Compte B2B" || emitterName === "Pro B2B") {
        if (emitter === "Dark Ink" || emitter === "Boxxman" || emitter === "New Millenium") {
          emitterName = emitter;
        } else if (emitter === "Fournisseurs") {
          emitterName = ord.clientOrSupplierName || "Darkline Berlin";
        } else if (emitter === "B2B") {
          emitterName = "SARL Velvet Club";
        } else {
          emitterName = ord.clientOrSupplierName || "Client Particulier";
        }
      }

      let receiverName = ord.receiverName;
      if (!receiverName || receiverName === "Compte B2B" || receiverName === "Pro B2B") {
        if (receiver === "Dark Ink" || receiver === "Boxxman" || receiver === "New Millenium") {
          receiverName = receiver;
        } else if (receiver === "Fournisseurs") {
          receiverName = ord.clientOrSupplierName || "Darkline Berlin";
        } else if (receiver === "B2B") {
          receiverName = "SARL Velvet Club";
        } else {
          receiverName = ord.clientOrSupplierName || "Client Particulier";
        }
      }

      return {
        ...ord,
        emitter,
        emitterName,
        receiver,
        receiverName,
      };
    });
    setOrders(sanitizedOrders);
    setDeliveries(readLS<ERPDelivery[]>(KEYS.deliveries, initialDeliveries));
    setInternalDispatches(readLS<InternalTransferDispatch[]>(KEYS.internalDispatches, initialInternalDispatches));
    setDefectiveProducts(readLS<DefectiveProductEntry[]>(KEYS.defectiveProducts, initialDefectiveProducts));
    setReturns(readLS<OrderReturn[]>(KEYS.returns, initialReturns));
    setInvoices(readLS<Invoice[]>(KEYS.invoices, initialInvoices));
    setSalaries(readLS<SalarySlip[]>(KEYS.salaries, initialSalaries));
    setPromoCodes(readLS<PromoCode[]>(KEYS.promoCodes, initialPromoCodes));
    setAppliedPromo(readLS<PromoCode | null>(KEYS.appliedPromo, null));
    setCatalogProducts(readLS<Product[]>(KEYS.catalogProducts, products));

    // Stocks
    const savedStocks = readLS<Record<string, StockEntry> | null>(
      KEYS.stocks,
      null,
    );
    if (savedStocks && Object.keys(savedStocks).length > 0) {
      setStocks(savedStocks);
    } else {
      const seeded = buildInitialStocks();
      setStocks(seeded);
      writeLS(KEYS.stocks, seeded);
    }

    setMounted(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.appMode, appMode);
  }, [mounted, appMode]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.stocks, stocks);
  }, [mounted, stocks]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.cashLog, cashLog);
  }, [mounted, cashLog]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.cart, cart);
  }, [mounted, cart]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.language, language);
  }, [mounted, language]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.user, user);
  }, [mounted, user]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.ageVerified, ageVerified);
  }, [mounted, ageVerified]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.messages, messages);
  }, [mounted, messages]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.staffPresence, staffPresence);
  }, [mounted, staffPresence]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.transfers, transfers);
  }, [mounted, transfers]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.cruisingReservations, cruisingReservations);
  }, [mounted, cruisingReservations]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.orders, orders);
  }, [mounted, orders]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.deliveries, deliveries);
  }, [mounted, deliveries]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.catalogProducts, catalogProducts);
  }, [mounted, catalogProducts]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.internalDispatches, internalDispatches);
  }, [mounted, internalDispatches]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.defectiveProducts, defectiveProducts);
  }, [mounted, defectiveProducts]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.returns, returns);
  }, [mounted, returns]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.invoices, invoices);
  }, [mounted, invoices]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.salaries, salaries);
  }, [mounted, salaries]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.promoCodes, promoCodes);
  }, [mounted, promoCodes]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.appliedPromo, appliedPromo);
  }, [mounted, appliedPromo]);

  useEffect(() => {
    if (!mounted) return;
    writeLS(KEYS.currentRole, currentRole);
  }, [mounted, currentRole]);

  // Cross-tab sync via storage event
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!e.key || !e.key.startsWith(PREFIX) || e.newValue === null) return;
      try {
        const val = JSON.parse(e.newValue);
        switch (e.key) {
          case KEYS.appMode:
            _setAppMode(val);
            break;
          case KEYS.stocks:
            setStocks(val);
            break;
          case KEYS.cashLog:
            setCashLog(val);
            break;
          case KEYS.cart:
            setCart(val);
            break;
          case KEYS.language:
            _setLanguage(val);
            break;
          case KEYS.user:
            _setUser(val);
            break;
          case KEYS.ageVerified:
            _setAgeVerified(val);
            break;
          case KEYS.messages:
            setMessages(val);
            break;
          case KEYS.staffPresence:
            setStaffPresence(val);
            break;
          case KEYS.transfers:
            setTransfers(val);
            break;
          case KEYS.cruisingReservations:
            setCruisingReservations(val);
            break;
          case KEYS.orders:
            setOrders(val);
            break;
          case KEYS.deliveries:
            setDeliveries(val);
            break;
          case KEYS.returns:
            setReturns(val);
            break;
          case KEYS.invoices:
            setInvoices(val);
            break;
          case KEYS.salaries:
            setSalaries(val);
            break;
          case KEYS.promoCodes:
            setPromoCodes(val);
            break;
          case KEYS.appliedPromo:
            setAppliedPromo(val);
            break;
          case KEYS.currentRole:
            _setCurrentRole(val);
            break;
        }
      } catch {
        // ignore
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Action callbacks
  const setAppMode = useCallback((mode: AppMode) => _setAppMode(mode), []);
  const setLanguage = useCallback((lang: Language) => _setLanguage(lang), []);
  const setAgeVerified = useCallback((v: boolean) => _setAgeVerified(v), []);
  const setCurrentRole = useCallback(
    (r: "Gérant" | "Responsable" | "Vendeur" | "Entrepôt") => _setCurrentRole(r),
    [],
  );

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.productId === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { productId, qty }];
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("darkink_cart_add", { detail: { productId, qty } }),
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((c) => c.productId !== productId);
      return prev.map((c) => (c.productId === productId ? { ...c, qty } : c));
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  const applyPromoCode = useCallback(
    (codeStr: string) => {
      const trimmed = codeStr.trim().toUpperCase();
      const found = promoCodes.find((p) => p.code === trimmed && p.active);
      if (!found) {
        return { valid: false, message: "Code promotionnel invalide ou expiré.", discount: 0 };
      }
      setAppliedPromo(found);
      setPromoCodes((prev) =>
        prev.map((p) => (p.id === found.id ? { ...p, usageCount: p.usageCount + 1 } : p)),
      );
      return {
        valid: true,
        message: `Code ${found.code} appliqué : ${found.description}`,
        discount: found.value,
      };
    },
    [promoCodes],
  );

  const removePromoCode = useCallback(() => setAppliedPromo(null), []);

  const addOrUpdatePromoCode = useCallback((promo: PromoCode) => {
    setPromoCodes((prev) => {
      const exists = prev.some((p) => p.id === promo.id || p.code === promo.code);
      if (exists) {
        return prev.map((p) => (p.id === promo.id || p.code === promo.code ? promo : p));
      }
      return [promo, ...prev];
    });
  }, []);

  const updateStock = useCallback(
    (productId: string, siteKey: string, delta: number) => {
      setStocks((prev) => {
        const item = prev[productId];
        if (!item) return prev;
        const currentVal = item.sites[siteKey] ?? 0;
        const nextVal = Math.max(0, currentVal + delta);
        return {
          ...prev,
          [productId]: {
            ...item,
            sites: {
              ...item.sites,
              [siteKey]: nextVal,
            },
          },
        };
      });
    },
    [],
  );

  const setExactStock = useCallback(
    (productId: string, siteKey: string, value: number) => {
      setStocks((prev) => {
        const item = prev[productId];
        if (!item) return prev;
        return {
          ...prev,
          [productId]: {
            ...item,
            sites: {
              ...item.sites,
              [siteKey]: Math.max(0, value),
            },
          },
        };
      });
    },
    [],
  );

  const addCashEvent = useCallback(
    (event: Omit<CashEvent, "id" | "timestamp">) => {
      const newEvent: CashEvent = {
        ...event,
        id: uid("cash"),
        timestamp: Date.now(),
      };
      setCashLog((prev) => [newEvent, ...prev]);
    },
    [],
  );

  const addMessage = useCallback(
    (msg: { sender: string; site: string; content: string }) => {
      const newMsg: InternalMessage = {
        id: uid("msg"),
        timestamp: Date.now(),
        time: formatCurrentTime(),
        sender: msg.sender,
        site: msg.site,
        content: msg.content,
      };
      setMessages((prev) => [newMsg, ...prev]);
    },
    [],
  );

  const clockIn = useCallback((staffName: string, site = "Boutique 1") => {
    const entry: StaffPresenceEvent = {
      id: uid("clock"),
      timestamp: Date.now(),
      time: formatCurrentTime(),
      staffName,
      type: "Arrivée",
      site,
      hoursWorkedToday: 7.5,
    };
    setStaffPresence((prev) => [entry, ...prev]);
  }, []);

  const clockOut = useCallback((staffName: string, site = "Boutique 1") => {
    const entry: StaffPresenceEvent = {
      id: uid("clock"),
      timestamp: Date.now(),
      time: formatCurrentTime(),
      staffName,
      type: "Départ",
      site,
      hoursWorkedToday: 7.5,
    };
    setStaffPresence((prev) => [entry, ...prev]);
  }, []);

  const createTransfer = useCallback(
    (data: {
      productId: string;
      productName: string;
      fromSite: string;
      toSite: string;
      qty: number;
      operator: string;
    }): StockTransfer => {
      const count = Date.now().toString().slice(-3);
      const newTransfer: StockTransfer = {
        id: uid("tr"),
        transferNumber: `TR-2024-${count}`,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString("fr-FR"),
        productId: data.productId,
        productName: data.productName,
        fromSite: data.fromSite,
        toSite: data.toSite,
        qty: data.qty,
        status: "En cours",
        operator: data.operator,
      };

      setTransfers((prev) => [newTransfer, ...prev]);

      const siteMapKey = (name: string): string => {
        if (name.includes("Entrepôt")) return "entrepot";
        if (name.includes("Boutique 1") && name.includes("Rayon"))
          return "boutique1Rayon";
        if (name.includes("Boutique 1") && name.includes("Réserve"))
          return "boutique1Reserve";
        if (name.includes("Boutique 2") && name.includes("Rayon"))
          return "boutique2Rayon";
        if (name.includes("Boutique 2") && name.includes("Réserve"))
          return "boutique2Reserve";
        return "web";
      };

      const fromKey = siteMapKey(data.fromSite);
      const toKey = siteMapKey(data.toSite);

      setStocks((prev) => {
        const item = prev[data.productId];
        if (!item) return prev;
        const currentFrom = item.sites[fromKey] ?? 0;
        const currentTo = item.sites[toKey] ?? 0;
        return {
          ...prev,
          [data.productId]: {
            ...item,
            sites: {
              ...item.sites,
              [fromKey]: Math.max(0, currentFrom - data.qty),
              [toKey]: currentTo + data.qty,
            },
          },
        };
      });

      return newTransfer;
    },
    [],
  );

  const addCruisingReservation = useCallback(
    (data: {
      offerId: string;
      offerName: string;
      price: number;
      paymentMode: "online" | "cash";
    }): CruisingReservation => {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const res: CruisingReservation = {
        id: uid("res"),
        code: `CRZ-${codeNum}-B1`,
        offerId: data.offerId,
        offerName: data.offerName,
        price: data.price,
        paymentMode: data.paymentMode,
        status:
          data.paymentMode === "online" ? "Payé en ligne" : "À régler sur place",
        timestamp: Date.now(),
        date: new Date().toLocaleDateString("fr-FR"),
        customerName: initialUser.name,
      };

      setCruisingReservations((prev) => [res, ...prev]);

      if (data.paymentMode === "online") {
        const count = data.offerId === "cruise-003" ? 10 : 1;
        _setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            cruisingEntries: prev.cruisingEntries + count,
            loyaltyPoints: prev.loyaltyPoints + Math.round(data.price * 2),
          };
        });
      }

      if (data.paymentMode === "cash") {
        const time = formatCurrentTime();
        setCashLog((prev) => [
          {
            id: uid("cash"),
            timestamp: Date.now(),
            time,
            vendor: "Guichet Cruising B1",
            reason: `Réservation sur place [${res.code}] (${data.offerName})`,
            taken: 0,
            returned: data.price,
            delta: data.price,
          },
          ...prev,
        ]);
      }

      return res;
    },
    [],
  );

  const updateOrderStatus = useCallback((orderId: string, status: ERPOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }, []);

  const addERPOrder = useCallback((newOrder: ERPOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  const updateERPOrderVerification = useCallback((
    orderId: string,
    verification: ERPOrderVerification,
    newStatus: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: newStatus as any,
          verification,
        };
      })
    );
  }, []);

  const updateDeliveryStatus = useCallback(
    (deliveryId: string, status: ERPDelivery["status"]) => {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? { ...d, status } : d)),
      );
    },
    [],
  );

  const resolveReturn = useCallback(
    (
      returnId: string,
      decision: OrderReturn["status"],
      refusalReason?: string,
    ) => {
      const now = new Date().toLocaleDateString("fr-FR");
      setReturns((prev) =>
        prev.map((r) =>
          r.id === returnId
            ? {
                ...r,
                status: decision,
                refusalReason: refusalReason || r.refusalReason,
                decisionDate: now,
              }
            : r,
        ),
      );

      // If refunded, log in cash drawer / bank transactions
      if (decision === "Remboursé sur carte bleue") {
        const item = returns.find((r) => r.id === returnId);
        if (item) {
          setCashLog((prev) => [
            {
              id: uid("cash"),
              timestamp: Date.now(),
              time: formatCurrentTime(),
              vendor: "SAV / Comptabilité",
              reason: `Remboursement CB Retour [${item.returnNumber}] - ${item.product}`,
              taken: item.amount,
              returned: 0,
              delta: -item.amount,
            },
            ...prev,
          ]);
        }
      }
    },
    [returns],
  );

  const updateSalaryStatus = useCallback(
    (salaryId: string, status: SalarySlip["status"]) => {
      const now = new Date().toLocaleDateString("fr-FR");
      setSalaries((prev) =>
        prev.map((s) =>
          s.id === salaryId
            ? { ...s, status, paymentDate: status === "Payé par virement SEPA" ? now : undefined }
            : s,
        ),
      );
    },
    [],
  );

  const addDefectiveProduct = useCallback(
    (entry: Omit<DefectiveProductEntry, "id" | "timestamp" | "claimNumber">) => {
      const claimCode = `REC-FOURN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newDef: DefectiveProductEntry = {
        ...entry,
        id: uid("def"),
        claimNumber: claimCode,
        timestamp: Date.now(),
      };
      setDefectiveProducts((prev) => [newDef, ...prev]);
    },
    [],
  );

  const updateDefectiveStatus = useCallback(
    (id: string, status: DefectiveProductEntry["status"]) => {
      setDefectiveProducts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d)),
      );
    },
    [],
  );

  const dispatchReceptionInitial = useCallback(
    (data: Omit<InternalTransferDispatch, "id" | "date" | "time">) => {
      const newDisp: InternalTransferDispatch = {
        ...data,
        id: uid("disp"),
        date: new Date().toLocaleDateString("fr-FR"),
        time: formatCurrentTime(),
      };

      setInternalDispatches((prev) => [newDisp, ...prev]);

      // Si le produit est déclaré défectueux lors de l'inspection initiale à l'entrepôt
      if (
        data.productCondition.includes("Défectueux") ||
        data.packagingCondition.includes("Absent")
      ) {
        const product = products.find((p) => p.id === data.productId);
        const cost = (product?.pricePurchase ?? 40) * data.totalReceived;
        const claimCode = `REC-FOURN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        const defEntry: DefectiveProductEntry = {
          id: uid("def"),
          claimNumber: claimCode,
          productId: data.productId,
          productName: data.productName,
          sku: data.sku,
          supplier: data.supplier,
          qty: data.totalReceived,
          costValue: cost,
          productCondition: data.productCondition,
          packagingCondition: data.packagingCondition,
          sourceContext: "Réception Quai Entrepôt",
          date: new Date().toLocaleDateString("fr-FR"),
          timestamp: Date.now(),
          status: "Réclamation fournisseur en cours",
        };
        setDefectiveProducts((prev) => [defEntry, ...prev]);
      }
    },
    [],
  );

  const confirmBoutiqueReception = useCallback(
    (
      dispatchId: string,
      siteKey: "boutique1" | "boutique2" | "web",
      storageChoice: "Rayon" | "Réserve",
      location: string,
    ) => {
      setInternalDispatches((prev) =>
        prev.map((d) =>
          d.id === dispatchId
            ? {
                ...d,
                status: "Confirmé & Réceptionné",
                targetStorageChoice: storageChoice,
                targetLocation: location,
              }
            : d,
        ),
      );

      // Augmente le stock réel selon l'affectation
      const disp = internalDispatches.find((d) => d.id === dispatchId);
      if (disp) {
        let qtyToAdd = 0;
        let siteField = "";
        if (siteKey === "boutique1") {
          qtyToAdd = disp.qtyBoutique1;
          siteField = storageChoice === "Rayon" ? "boutique1Rayon" : "boutique1Reserve";
        } else if (siteKey === "boutique2") {
          qtyToAdd = disp.qtyBoutique2;
          siteField = storageChoice === "Rayon" ? "boutique2Rayon" : "boutique2Reserve";
        } else {
          qtyToAdd = disp.qtyEntrepot;
          siteField = "entrepot";
        }

        setStocks((prev) => {
          const item = prev[disp.productId];
          if (!item) return prev;
          const current = item.sites[siteField] ?? 0;
          return {
            ...prev,
            [disp.productId]: {
              ...item,
              location: location || item.location,
              sites: {
                ...item.sites,
                [siteField]: current + qtyToAdd,
              },
            },
          };
        });
      }
    },
    [internalDispatches],
  );

  const recordOrderBoxInspection = useCallback(
    (
      orderId: string,
      boxCondition: string,
      inspectedItems: Array<{
        productId: string;
        productCondition: string;
        packagingCondition: string;
        storageChoice: "Rayon" | "Réserve";
        assignedLocation: string;
        isDefective: boolean;
      }>,
    ) => {
      // 1. Marque la commande comme livrée/inspectée
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Livrée" } : o)),
      );

      // 2. Traite chaque article
      for (const it of inspectedItems) {
        const prod = products.find((p) => p.id === it.productId);
        if (!prod) continue;

        if (it.isDefective || it.productCondition.toLowerCase().includes("défect")) {
          // Passage en pertes d'exploitation
          const claimCode = `REC-CMD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
          setDefectiveProducts((prev) => [
            {
              id: uid("def"),
              claimNumber: claimCode,
              productId: it.productId,
              productName: prod.name,
              sku: prod.sku,
              supplier: "Fournisseur Commande",
              qty: 1,
              costValue: prod.pricePurchase,
              productCondition: it.productCondition,
              packagingCondition: it.packagingCondition,
              sourceContext: "Contrôle Carton Commande",
              date: new Date().toLocaleDateString("fr-FR"),
              timestamp: Date.now(),
              status: "Réclamation fournisseur en cours",
            },
            ...prev,
          ]);
        } else {
          // Validation et intégration en stock selon le choix Rayon ou Réserve et l'emplacement
          const siteKey =
            it.storageChoice === "Rayon" ? "boutique1Rayon" : "boutique1Reserve";
          setStocks((prev) => {
            const item = prev[it.productId];
            if (!item) return prev;
            return {
              ...prev,
              [it.productId]: {
                ...item,
                location: it.assignedLocation || item.location,
                sites: {
                  ...item.sites,
                  [siteKey]: (item.sites[siteKey] ?? 0) + 1,
                },
              },
            };
          });
        }
      }
    },
    [],
  );

  const addProductToCatalog = useCallback((newP: Product) => {
    setCatalogProducts((prev) => {
      const exists = prev.some((p) => p.id === newP.id || p.sku === newP.sku);
      const updated = exists
        ? prev.map((p) => ((p.id === newP.id || p.sku === newP.sku) ? newP : p))
        : [newP, ...prev];
      writeLS(KEYS.catalogProducts, updated);
      return updated;
    });
    setStocks((prev) => {
      if (!prev[newP.id]) {
        const entry: StockEntry = {
          productId: newP.id,
          name: newP.name,
          sku: newP.sku,
          price: newP.price,
          pricePurchase: newP.pricePurchase,
          category: newP.category,
          location: newP.location || "ENT-A01-E1",
          barcode: newP.barcode || "3760089010099",
          material: newP.material || "Cuir & Métal",
          color: newP.color || "Noir Profond",
          size: newP.size || "Standard",
          fitAdvice: newP.fitAdvice || "Taille standard réglable",
          dimensions: newP.dimensions || "Dimensions standard",
          weight: newP.weight || "350 g",
          sites: {
            entrepot: newP.stock?.entrepot ?? 20,
            boutique1Rayon: newP.stock?.boutique1Rayon ?? 5,
            boutique1Reserve: newP.stock?.boutique1Reserve ?? 10,
            boutique2Rayon: newP.stock?.boutique2Rayon ?? 5,
            boutique2Reserve: newP.stock?.boutique2Reserve ?? 10,
            web: newP.stock?.web ?? 10,
          },
        };
        const next = { ...prev, [newP.id]: entry };
        writeLS(KEYS.stocks, next);
        return next;
      }
      return prev;
    });
  }, []);

  const updateCatalogProduct = useCallback((updatedP: Product) => {
    setCatalogProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedP.id ? updatedP : p));
      writeLS(KEYS.catalogProducts, updated);
      return updated;
    });
  }, []);

  const updateERPOrder = useCallback((orderId: string, partial: Partial<ERPOrder>) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, ...partial } : o));
      writeLS(KEYS.orders, next);
      return next;
    });
  }, []);

  const loginUser = useCallback((partial: Partial<AppUser>) => {
    _setUser((prev) => ({
      name: partial.name || "Client Privilège",
      email: partial.email || "client@club-prive.fr",
      role: partial.role || "Membre",
      isB2B: partial.isB2B ?? prev?.isB2B ?? false,
      loyaltyPoints: partial.loyaltyPoints ?? prev?.loyaltyPoints ?? 150,
      cruisingEntries: partial.cruisingEntries ?? prev?.cruisingEntries ?? 1,
      cardNumber: partial.cardNumber || "BX-9901-PARIS",
    }));
  }, []);

  const logoutUser = useCallback(() => _setUser(null), []);

  const toggleB2B = useCallback(() => {
    _setUser((prev) => {
      if (!prev) {
        return {
          name: "SARL Velvet Pro",
          email: "pro@velvet-distribution.com",
          role: "Compte Pro B2B",
          isB2B: true,
          loyaltyPoints: 1200,
          cruisingEntries: 0,
          cardNumber: "PRO-B2B-7740",
        };
      }
      return { ...prev, isB2B: !prev.isB2B };
    });
  }, []);

  const addCruisingEntry = useCallback((count: number) => {
    _setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cruisingEntries: Math.max(0, prev.cruisingEntries + count),
      };
    });
  }, []);

  const resetDemo = useCallback(() => {
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
    const seeded = buildInitialStocks();
    _setAppMode("erp");
    setStocks(seeded);
    setCashLog(initialCashLog);
    setCart([{ productId: "prod-001", qty: 1 }]);
    _setLanguage("fr");
    _setUser(initialUser);
    _setAgeVerified(false);
    setMessages(initialMessages);
    setStaffPresence(initialPresence);
    setTransfers(initialTransfers);
    setCruisingReservations(initialReservations);
    setOrders(initialOrders);
    setDeliveries(initialDeliveries);
    setReturns(initialReturns);
    setInvoices(initialInvoices);
    setSalaries(initialSalaries);
    setPromoCodes(initialPromoCodes);
    setAppliedPromo(null);
    _setCurrentRole("Gérant");
  }, []);

  const value: AppContextValue = {
    appMode,
    stocks,
    cashLog,
    cart,
    language,
    user,
    ageVerified,
    messages,
    staffPresence,
    transfers,
    cruisingReservations,
    orders,
    deliveries,
    internalDispatches,
    defectiveProducts,
    returns,
    invoices,
    salaries,
    promoCodes,
    appliedPromo,
    currentRole,
    mounted,

    setAppMode,
    setLanguage,
    setAgeVerified,
    setCurrentRole,

    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    applyPromoCode,
    removePromoCode,
    addOrUpdatePromoCode,

    catalogCategory,
    setCatalogCategory,
    catalogSearchQuery,
    setCatalogSearchQuery,
    catalogShowMoreModal,
    setCatalogShowMoreModal,
    catalogActiveFiltersCount,
    setCatalogActiveFiltersCount,

    updateStock,
    setExactStock,

    addCashEvent,
    addMessage,

    clockIn,
    clockOut,

    createTransfer,
    addCruisingReservation,
    updateOrderStatus,
    addERPOrder,
    updateERPOrder,
    updateERPOrderVerification,
    catalogProducts,
    addProductToCatalog,
    updateCatalogProduct,
    updateDeliveryStatus,
    resolveReturn,
    updateSalaryStatus,

    addDefectiveProduct,
    updateDefectiveStatus,
    dispatchReceptionInitial,
    confirmBoutiqueReception,
    recordOrderBoxInspection,

    loginUser,
    logoutUser,
    toggleB2B,
    addCruisingEntry,

    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an <AppProvider>");
  }
  return ctx;
}
