"use client";

import React, { useState, useMemo } from "react";
import {
  useApp,
  type ERPOrder,
  type ERPPartyType,
  type ERPOrderStatus,
} from "@/context/AppContext";
import { products, type Product } from "@/data/products";

// 6 entités autorisées - NOMS COURTS ET DIRECTS
const ALL_PARTIES: ERPPartyType[] = [
  "Fournisseurs",
  "Client particulier",
  "B2B",
  "Dark Ink",
  "Boxxman",
  "New Millenium",
];

const ALL_STATUSES: { label: string; value: string }[] = [
  { label: "Commande effectuée", value: "Commande effectuée" },
  { label: "En attente traitement fournisseur", value: "En attente de traitement chez le fournisseur" },
  { label: "Commande expédiée", value: "Commande expédiée" },
  { label: "Commande reçue", value: "Commande reçue" },
  { label: "Commande vérifiée", value: "Commande vérifiée" },
  { label: "Produits dispatchés", value: "Produits dispatchés" },
  { label: "Pertes d'exploitation", value: "Pertes d'exploitation" },
];

interface ExtractedPOItem {
  id: string;
  supplierRef: string;
  internalRef: string;
  barcode: string;
  rawLabel: string;
  qty: number;
  purchasePriceHT: number;
  publicPriceTTC: number;
  category: "Harnais & Cuir" | "Latex & Rubber" | "Bondage & Restraints" | "Sex-Toys & Plaisir" | "Lubrifiants & Soins";
  material: string;
  translations: {
    fr: { name: string; description: string; metaDescription: string };
    en: { name: string; description: string; metaDescription: string };
    es: { name: string; description: string; metaDescription: string };
    de: { name: string; description: string; metaDescription: string };
  };
}

export default function ERPOrders() {
  const {
    orders,
    addERPOrder,
    updateERPOrder,
    updateERPOrderVerification,
    addProductToCatalog,
    catalogProducts,
    currentRole,
  } = useApp();

  // 1. FILTRES
  const [filterEmitter, setFilterEmitter] = useState<string>("all");
  const [filterReceiver, setFilterReceiver] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterConformity, setFilterConformity] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // 2. MODALES
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [consultOrder, setConsultOrder] = useState<ERPOrder | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<ERPOrder | null>(null);

  // 3. ONGLETS DE LA MODALE CONSULTER
  const [consultTab, setConsultTab] = useState<"overview" | "po_scan" | "ai_studio" | "inspection">("overview");
  const [activeLangTab, setActiveLangTab] = useState<"fr" | "en" | "es" | "de">("fr");

  // 4. ÉDITION DANS CONSULTER
  const [editSupplierRef, setEditSupplierRef] = useState("");
  const [editInternalRef, setEditInternalRef] = useState("");
  const [editStatusSelect, setEditStatusSelect] = useState<string>("");
  const [editTracking, setEditTracking] = useState("");
  const [editEmitter, setEditEmitter] = useState<ERPPartyType>("Dark Ink");
  const [editReceiver, setEditReceiver] = useState<ERPPartyType>("Boxxman");

  // 5. SCAN BON DE COMMANDE & IA
  const [poRawText, setPoRawText] = useState("");
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedPOItem[]>([]);
  const [selectedExtractedIndex, setSelectedExtractedIndex] = useState<number>(0);
  const [injectionSuccessMessage, setInjectionSuccessMessage] = useState<string | null>(null);

  // 6. CONTRÔLE SALARIÉ & DISPATCHING
  const [boxCondition, setBoxCondition] = useState<string>("Carton intact & scellé d'usine");
  const [packagingCondition, setPackagingCondition] = useState<string>("Blister / Scellé intact d'origine");
  const [productCondition, setProductCondition] = useState<string>("Conforme / Neuf");
  const [conformQty, setConformQty] = useState<number>(0);
  const [totalItemsQty, setTotalItemsQty] = useState<number>(0);
  const [isLossMode, setIsLossMode] = useState(false);
  const [lossReason, setLossReason] = useState("Emballage écrasé, produits brisés ou non conformes.");
  const [dispatchQtyBoxxman, setDispatchQtyBoxxman] = useState(0);
  const [dispatchQtyNewMillenium, setDispatchQtyNewMillenium] = useState(0);
  const [dispatchQtyDarkInk, setDispatchQtyDarkInk] = useState(0);
  const [storageChoice, setStorageChoice] = useState<"Rayon" | "Réserve">("Rayon");

  // 7. FORMULAIRE NOUVELLE COMMANDE (ÉMETTEUR !== DESTINATAIRE TOUJOURS)
  const [newEmitter, setNewEmitter] = useState<ERPPartyType>("Dark Ink");
  const [newEmitterName, setNewEmitterName] = useState("Dark Ink");
  const [newReceiver, setNewReceiver] = useState<ERPPartyType>("Boxxman");
  const [newReceiverName, setNewReceiverName] = useState("Boxxman");
  const [newSupplierRef, setNewSupplierRef] = useState("PO-2026-01");
  const [newInternalRef, setNewInternalRef] = useState("DK-CMD-01");
  const [newDeliveryMethod, setNewDeliveryMethod] = useState("Navette Interne");
  const [newOrderItems, setNewOrderItems] = useState<
    { productId: string; name: string; qty: number; unitPrice: number }[]
  >([
    {
      productId: products[0].id,
      name: products[0].name,
      qty: 20,
      unitPrice: 45.0,
    },
  ]);

  // Helpers pour le nom par défaut sans fioritures
  const getDefaultNameForParty = (p: ERPPartyType): string => {
    switch (p) {
      case "Dark Ink":
        return "Dark Ink";
      case "Boxxman":
        return "Boxxman";
      case "New Millenium":
        return "New Millenium";
      case "Fournisseurs":
        return "Darkline Berlin";
      case "Client particulier":
        return "Marc Vasseur";
      case "B2B":
        return "SARL Velvet Club";
      default:
        return p;
    }
  };

  // Changement d'émetteur pour la création : force Destinataire !== Émetteur
  const handleNewEmitterChange = (chosen: ERPPartyType) => {
    setNewEmitter(chosen);
    setNewEmitterName(getDefaultNameForParty(chosen));
    if (newReceiver === chosen) {
      const nextAvailable = ALL_PARTIES.find((p) => p !== chosen) || "Boxxman";
      setNewReceiver(nextAvailable);
      setNewReceiverName(getDefaultNameForParty(nextAvailable));
    }
  };

  // Changement de destinataire pour la création
  const handleNewReceiverChange = (chosen: ERPPartyType) => {
    if (chosen === newEmitter) return;
    setNewReceiver(chosen);
    setNewReceiverName(getDefaultNameForParty(chosen));
  };

  // Ouverture modale Consulter
  const handleOpenConsult = (order: ERPOrder) => {
    setConsultOrder(order);
    setEditSupplierRef(order.supplierRef || "");
    setEditInternalRef(order.internalRef || order.orderNumber);
    setEditStatusSelect(order.status);
    setEditTracking(order.trackingNumber || "");

    const normEmitter =
      order.emitter === "Entrepôt" ? "Dark Ink" : order.emitter === "Boutique 1" ? "Boxxman" : order.emitter === "Boutique 2" ? "New Millenium" : (order.emitter as ERPPartyType) || "Dark Ink";
    let normReceiver =
      order.receiver === "Entrepôt" ? "Dark Ink" : order.receiver === "Boutique 1" ? "Boxxman" : order.receiver === "Boutique 2" ? "New Millenium" : (order.receiver as ERPPartyType) || "Boxxman";

    if (normEmitter === normReceiver) {
      normReceiver = ALL_PARTIES.find((p) => p !== normEmitter) || "Boxxman";
    }

    setEditEmitter(normEmitter);
    setEditReceiver(normReceiver);
    setConsultTab("overview");
    setInjectionSuccessMessage(null);
    setExtractedItems([]);

    const sumQty = order.items.reduce((acc, it) => acc + it.qty, 0);
    setTotalItemsQty(sumQty);
    setConformQty(order.verification ? order.verification.conformQty : sumQty);
    setBoxCondition(order.verification?.boxCondition || "Carton intact & scellé d'usine");
    setPackagingCondition(order.verification?.packagingCondition || "Blister / Scellé intact d'origine");
    setProductCondition(order.verification?.productCondition || "Conforme / Neuf");
    setIsLossMode(order.verification?.isLoss || order.status === "Pertes d'exploitation");
    setLossReason(order.verification?.lossReason || "Emballage écrasé, produits brisés ou non conformes.");

    if (order.verification?.dispatchAllocations) {
      const d = order.verification.dispatchAllocations;
      setDispatchQtyBoxxman(d.boxxman ?? d.boutique1 ?? 0);
      setDispatchQtyNewMillenium(d.newMillenium ?? d.boutique2 ?? 0);
      setDispatchQtyDarkInk(d.darkInk ?? d.entrepot ?? 0);
      setStorageChoice(d.storageChoice || "Rayon");
    } else {
      const half = Math.floor(sumQty / 2);
      setDispatchQtyBoxxman(half);
      setDispatchQtyNewMillenium(sumQty - half);
      setDispatchQtyDarkInk(0);
      setStorageChoice("Rayon");
    }
  };

  // Sauvegarde des en-têtes depuis la modale Consulter
  const handleSaveOrderHeader = () => {
    if (!consultOrder) return;
    if (editEmitter === editReceiver) {
      alert("Erreur : L'émetteur et le destinataire ne peuvent pas être la même entité.");
      return;
    }

    updateERPOrder(consultOrder.id, {
      supplierRef: editSupplierRef.trim(),
      internalRef: editInternalRef.trim(),
      status: editStatusSelect as ERPOrderStatus,
      trackingNumber: editTracking.trim(),
      emitter: editEmitter,
      emitterName: editEmitter === "Fournisseurs" ? consultOrder.emitterName || "Fournisseur" : editEmitter,
      receiver: editReceiver,
      receiverName: editReceiver === "Client particulier" ? consultOrder.receiverName || "Client" : editReceiver,
    });

    setConsultOrder((prev) =>
      prev
        ? {
            ...prev,
            supplierRef: editSupplierRef.trim(),
            internalRef: editInternalRef.trim(),
            status: editStatusSelect as ERPOrderStatus,
            trackingNumber: editTracking.trim(),
            emitter: editEmitter,
            emitterName: editEmitter === "Fournisseurs" ? prev.emitterName || "Fournisseur" : editEmitter,
            receiver: editReceiver,
            receiverName: editReceiver === "Client particulier" ? prev.receiverName || "Client" : editReceiver,
          }
        : null
    );
  };

  // Exemples de bons de commande
  const samplePOTexts = [
    {
      title: "Bon Darkline Berlin (Cuir)",
      text: `BON COMMANDE #DL-BER-88419
Fournisseur: Darkline Berlin
Destinataire: Dark Ink
Réf Fournisseur: DL-HARN-TITAN-XL | EAN13: 3760089012410 | Harnais Torse Cuir Gras Ajustable Double Boucle | QTE: 30 | PU HT: 46.50 €
Réf Fournisseur: DL-SLING-PRO-01 | EAN13: 3760089012427 | Sling Cuir Suspension Donjon | QTE: 10 | PU HT: 110.00 €
Réf Fournisseur: DL-JOCK-LEATH | EAN13: 3760089012434 | Jockstrap Cuir Souple Liseré Argent | QTE: 40 | PU HT: 28.00 €`,
    },
    {
      title: "Bon Fetish-Lab (Latex)",
      text: `BON COMMANDE #FL-HAM-55201
Fournisseur: Fetish-Lab Hamburg
Destinataire: Dark Ink
Réf Fournisseur: FL-LATEX-SUIT-04 | EAN13: 3760089012441 | Combinaison Latex 0.4mm Zippée Entrejambe 3 Curseurs | QTE: 15 | PU HT: 145.00 €
Réf Fournisseur: FL-PUPPY-HOOD-RUB | EAN13: 3760089012458 | Cagoule Latex K9 Puppy Museau Amovible | QTE: 20 | PU HT: 55.00 €`,
    },
    {
      title: "Bon Mister B (Toyz & Métal)",
      text: `BON COMMANDE #MB-AMS-99210
Fournisseur: Mister B Europe
Destinataire: Dark Ink
Réf Fournisseur: MB-STEEL-PLUG-XXL | EAN13: 3760089012465 | Plug Anal Acier Lourd Poli Miroir 1.2kg | QTE: 25 | PU HT: 38.00 €
Réf Fournisseur: MB-COCKRING-TRIPLE | EAN13: 3760089012472 | Triple Anneau Pénien & Testiculaire Acier | QTE: 50 | PU HT: 18.50 €`,
    },
  ];

  // Extraction automatique
  const handleRunOcrExtraction = () => {
    setIsOcrScanning(true);
    setInjectionSuccessMessage(null);

    setTimeout(() => {
      const mockExtracted: ExtractedPOItem[] = [
        {
          id: `ext-${Date.now()}-1`,
          supplierRef: editSupplierRef || "DL-HARN-TITAN-XL",
          internalRef: "DK-HAR-095",
          barcode: "3760089012410",
          rawLabel: "Harnais Torse Cuir Gras Ajustable Double Boucle",
          qty: 30,
          purchasePriceHT: 46.5,
          publicPriceTTC: 125.0,
          category: "Harnais & Cuir",
          material: "Cuir buffle pleine fleur gras (3.8 mm)",
          translations: {
            fr: {
              name: "Harnais Torse Cuir Brut 'Titan XL' Double Bouclerie",
              description:
                "Pièce maîtresse ultra-virile taillée dans un cuir gras épais de 3.8 mm. Conçu pour résister aux soirées fétiches les plus intenses, en backroom ou dancefloor. Anneaux soudés heavy-duty pour fixation de laisses ou attaches en suspension.",
              metaDescription:
                "Harnais torse cuir brut pour homme. Cuir buffle tannage gras, boucles robustes, idéal conventions fétiches et soirées cuir.",
            },
            en: {
              name: "Heavy-Duty Leather Harness 'Titan XL' Double Buckle",
              description:
                "Authentic masculine gear crafted from 3.8mm thick raw oiled saddle leather. Engineered for raw backroom action and hardcore fetish party nights. Welded heavy-gauge O-rings ready for leash restraints.",
              metaDescription:
                "Heavy-duty men's leather harness. Thick oiled leather, industrial buckles, designed for gay kink, gear and leather party nights.",
            },
            es: {
              name: "Arnés de Pecho Cuero Rudo 'Titan XL' Doble Hebilla",
              description:
                "Auténtico cuero grueso engrasado de 3.8 mm con acabado oscuro impecable. Diseñado para cruising salvaje, morbo puro y fiestas fetish. Argollas de acero templado ultrarresistentes para enganche y juegos de sumisión.",
              metaDescription:
                "Arnés de pecho para hombre en cuero engrasado. Resistencia extrema para fiestas gay fetish y cruising.",
            },
            de: {
              name: "Schwerer Lederharnisch 'Titan XL' mit Doppel-Schnallen",
              description:
                "Massives 3,8 mm vollnarbiges Sattelleder in Tiefschwarz. Entwickelt für schweißtreibende Darkroom-Nächte, Kink-Play und echte Leatherboys. Geschweißte O-Ringe für Leinen- und Fesselungsspiele.",
              metaDescription:
                "Schwerer Männer-Lederharnisch für Darkrooms, Fetisch-Partys und BDSM. Höchste deutsche Sattler-Stabilität.",
            },
          },
        },
        {
          id: `ext-${Date.now()}-2`,
          supplierRef: "DL-SLING-PRO-01",
          internalRef: "DK-SLI-014",
          barcode: "3760089012427",
          rawLabel: "Sling Suspension Cuir Renforcé Clubbing",
          qty: 10,
          purchasePriceHT: 110.0,
          publicPriceTTC: 289.0,
          category: "Bondage & Restraints",
          material: "Cuir sellier renforcé nylon & chaînes acier 8mm",
          translations: {
            fr: {
              name: "Sling de Suspension Cuir Pro 'Master Chamber'",
              description:
                "Le classique incontournable des donjons et backrooms. Cuir de sellerie doublé mousse haute densité pour un confort absolu lors des sessions de fisting ou de soumission extrême. Charge maximale certifiée 350 kg.",
              metaDescription:
                "Sling en cuir véritable pour suspension et bondage extrême. Confort renforcé, idéal fisting et playrooms libertins.",
            },
            en: {
              name: "Pro Suspension Leather Sling 'Master Chamber'",
              description:
                "The ultimate darkroom and dungeon centerpiece. Reinforced double-stitched harness leather lined with ergonomic padding for heavy fisting sessions and extreme endurance play. Certified up to 350 kg.",
              metaDescription:
                "Heavy-duty genuine leather suspension sling. Padded backrest, extreme durability for dungeons and gay backrooms.",
            },
            es: {
              name: "Columpio Sling de Cuero Reforzado 'Master Chamber'",
              description:
                "La pieza clave para cuartos oscuros y mazmorras. Cuero de guarnicionería acolchado de alta densidad para sesiones prolongadas de fisting, sexo duro y suspensión sin dolor. Capacidad hasta 350 kg.",
              metaDescription:
                "Columpio sling de cuero para fisting y suspensión extrema. Soporte profesional y máxima resistencia.",
            },
            de: {
              name: "Profi Leder-Sling 'Master Chamber' für Suspension & Fisting",
              description:
                "Das Herzstück für Spielzimmer, Darkrooms und Dungeons. Extra dickes Leder mit Schaumstoffpolsterung für schmerzfreies langes Liegen bei Fisting- und Kink-Sessions. Getestet bis 350 kg Tragkraft.",
              metaDescription:
                "Profi Leder-Sling für Fisting und BDSM. Hochbelastbare Ketten, pure Haltbarkeit für echte Kink-Clubs.",
            },
          },
        },
        {
          id: `ext-${Date.now()}-3`,
          supplierRef: "MB-COCKRING-TRIPLE",
          internalRef: "DK-CR-055",
          barcode: "3760089012472",
          rawLabel: "Ensemble Triple Anneau Pénien & Testiculaire Métal",
          qty: 50,
          purchasePriceHT: 18.5,
          publicPriceTTC: 49.0,
          category: "Sex-Toys & Plaisir",
          material: "Acier chirurgical 316L poli miroir",
          translations: {
            fr: {
              name: "Triple Cockring Acier Lourd 'Bulldog' Bille Clip",
              description:
                "Trio d'anneaux métalliques lourds pour prise totale de la verge et des bourses. Maintient une érection d'acier inébranlable et décuple les sensations lors de vos plans cul les plus intenses. Poids franc procurant une traction jouissive.",
              metaDescription:
                "Triple anneau pénien et scrotal en acier chirurgical poli. Érection maximale et sensations décuplées.",
            },
            en: {
              name: "Triple Heavy Steel Cockring & Ball Stretcher 'Bulldog'",
              description:
                "Surgical steel trio designed to lock the shaft and balls into maximum engorgement. Provides rock-hard erections and exhilarating scrotal weight tugging during intensive play sessions.",
              metaDescription:
                "Heavy triple metal cockring for men. Surgical grade polished steel, ultimate stamina and ball stretch.",
            },
            es: {
              name: "Triple Anillo Peneal de Acero Pesado 'Bulldog'",
              description:
                "Trío de argollas en acero quirúrgico macizo para glande, base y testículos. Garantiza una erección descomunal y una sensación de pesadez adictiva durante el morbo directo en el club.",
              metaDescription:
                "Cockring triple de acero quirúrgico. Máxima potencia eréctil y placer intenso para hombres.",
            },
            de: {
              name: "Dreifach-Cockring & Ball-Stretcher 'Bulldog' Schwerer Edelstahl",
              description:
                "Drei schwere Edelstahlringe zur perfekten Abbindung von Schaft und Hoden. Sorgt für eine steinhart bleibende Erektion und herrlichen Tiefenzug an den Eiern bei langen Sessions.",
              metaDescription:
                "Massiver dreifacher Edelstahl-Cockring für Männer. Hochglanzpoliert, maximale Ausdauer und Geilheit.",
            },
          },
        },
      ];

      setExtractedItems(mockExtracted);
      setSelectedExtractedIndex(0);
      setIsOcrScanning(false);
      setConsultTab("po_scan");
    }, 900);
  };

  // Injection Catalogue
  const handleInjectToCatalogAndDatabase = () => {
    if (extractedItems.length === 0 || !consultOrder) return;

    let totalAddedQty = 0;
    extractedItems.forEach((item) => {
      totalAddedQty += item.qty;
      const newProduct: Product = {
        id: item.internalRef.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        sku: item.internalRef,
        name: item.translations.fr.name,
        category: item.category,
        price: item.publicPriceTTC,
        pricePurchase: item.purchasePriceHT,
        stock: {
          entrepot: item.qty,
          boutique1Rayon: 2,
          boutique1Reserve: 4,
          boutique2Rayon: 2,
          boutique2Reserve: 4,
          web: 5,
        },
        location: "ENT-A04-E2",
        barcode: item.barcode,
        material: item.material,
        color: "Noir Profond",
        size: "Standard / Ajustable",
        fitAdvice: "Conforme aux standards fétiche européens",
        dimensions: "Standard",
        weight: "480 g",
        translations: item.translations,
        image:
          item.category === "Harnais & Cuir"
            ? "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=700&q=80"
            : item.category === "Bondage & Restraints"
            ? "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"
            : "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80",
        isActive: true,
      };

      addProductToCatalog(newProduct);
    });

    const updatedOrderItems = extractedItems.map((it) => ({
      productId: it.internalRef.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: it.translations.fr.name,
      qty: it.qty,
      unitPrice: it.purchasePriceHT,
      total: it.qty * it.purchasePriceHT,
    }));

    const sumHT = updatedOrderItems.reduce((acc, it) => acc + it.total, 0);
    const sumTVA = sumHT * 0.2;
    const sumTTC = sumHT + sumTVA;

    updateERPOrder(consultOrder.id, {
      items: updatedOrderItems,
      totalHT: sumHT,
      totalTVA: sumTVA,
      totalTTC: sumTTC,
      status: "Commande reçue",
      supplierRef: editSupplierRef || consultOrder.supplierRef,
      internalRef: editInternalRef || consultOrder.internalRef,
    });

    setConsultOrder((prev) =>
      prev
        ? {
            ...prev,
            items: updatedOrderItems,
            totalHT: sumHT,
            totalTVA: sumTVA,
            totalTTC: sumTTC,
            status: "Commande reçue",
            supplierRef: editSupplierRef || consultOrder.supplierRef,
            internalRef: editInternalRef || consultOrder.internalRef,
          }
        : null
    );

    setInjectionSuccessMessage(
      `✅ ${extractedItems.length} articles (${totalAddedQty} pièces) injectés avec succès dans le Catalogue & synchronisés en Base de Données !`
    );
  };

  // Validation Contrôle & Dispatch
  const handleValidateInspection = () => {
    if (!consultOrder) return;

    if (isLossMode) {
      updateERPOrderVerification(
        consultOrder.id,
        {
          boxCondition,
          packagingCondition,
          productCondition,
          conformQty: 0,
          totalQty: totalItemsQty,
          isLoss: true,
          lossReason,
          verifiedBy: currentRole,
          verifiedAt: new Date().toLocaleString("fr-FR"),
        },
        "Pertes d'exploitation"
      );
      setConsultOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "Pertes d'exploitation",
              verification: {
                boxCondition,
                packagingCondition,
                productCondition,
                conformQty: 0,
                totalQty: totalItemsQty,
                isLoss: true,
                lossReason,
                verifiedBy: currentRole,
                verifiedAt: new Date().toLocaleString("fr-FR"),
              },
            }
          : null
      );
      return;
    }

    const assignedTotal = dispatchQtyBoxxman + dispatchQtyNewMillenium + dispatchQtyDarkInk;
    if (assignedTotal !== conformQty) {
      alert(
        `Le total réparti (${assignedTotal}) doit être exactement égal à la quantité conforme (${conformQty}).`
      );
      return;
    }

    updateERPOrderVerification(
      consultOrder.id,
      {
        boxCondition,
        packagingCondition,
        productCondition,
        conformQty,
        totalQty: totalItemsQty,
        isLoss: false,
        dispatchAllocations: {
          boxxman: dispatchQtyBoxxman,
          newMillenium: dispatchQtyNewMillenium,
          darkInk: dispatchQtyDarkInk,
          storageChoice,
        },
        verifiedBy: currentRole,
        verifiedAt: new Date().toLocaleString("fr-FR"),
      },
      "Produits dispatchés"
    );

    setConsultOrder((prev) =>
      prev
        ? {
            ...prev,
            status: "Produits dispatchés",
            verification: {
              boxCondition,
              packagingCondition,
              productCondition,
              conformQty,
              totalQty: totalItemsQty,
              isLoss: false,
              dispatchAllocations: {
                boxxman: dispatchQtyBoxxman,
                newMillenium: dispatchQtyNewMillenium,
                darkInk: dispatchQtyDarkInk,
                storageChoice,
              },
              verifiedBy: currentRole,
              verifiedAt: new Date().toLocaleString("fr-FR"),
            },
          }
        : null
    );
  };

  // Création Commande manuelle
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmitter === newReceiver) {
      alert("Erreur : L'émetteur et le destinataire ne peuvent pas être la même entité.");
      return;
    }

    const sumHT = newOrderItems.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);
    const sumTVA = sumHT * 0.2;
    const sumTTC = sumHT + sumTVA;

    const newOrder: ERPOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `CMD-F-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierRef: newSupplierRef.trim(),
      internalRef: newInternalRef.trim(),
      channel: "fournisseurs",
      type: "fournisseurs",
      clientOrSupplierName: newReceiverName,
      emitter: newEmitter,
      emitterName: newEmitterName,
      receiver: newReceiver,
      receiverName: newReceiverName,
      date: new Date().toLocaleDateString("fr-FR"),
      timestamp: Date.now(),
      items: newOrderItems.map((it) => ({
        ...it,
        total: it.qty * it.unitPrice,
      })),
      totalHT: sumHT,
      totalTVA: sumTVA,
      totalTTC: sumTTC,
      deliveryMethod: newDeliveryMethod,
      status: "Commande effectuée",
    };

    addERPOrder(newOrder);
    setShowCreateModal(false);
  };

  // Filtrage
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Normalisation des noms legacy pour le filtre
      const e = order.emitter === "Entrepôt" ? "Dark Ink" : order.emitter === "Boutique 1" ? "Boxxman" : order.emitter === "Boutique 2" ? "New Millenium" : order.emitter;
      const r = order.receiver === "Entrepôt" ? "Dark Ink" : order.receiver === "Boutique 1" ? "Boxxman" : order.receiver === "Boutique 2" ? "New Millenium" : order.receiver;

      if (filterEmitter !== "all" && e !== filterEmitter) return false;
      if (filterReceiver !== "all" && r !== filterReceiver) return false;
      if (filterStatus !== "all" && order.status !== filterStatus) return false;

      if (filterConformity === "conform_100") {
        if (!order.verification || order.verification.isLoss) return false;
        if (order.verification.conformQty !== order.verification.totalQty) return false;
      } else if (filterConformity === "conform_partial") {
        if (!order.verification || order.verification.isLoss) return false;
        if (order.verification.conformQty >= order.verification.totalQty) return false;
      } else if (filterConformity === "losses") {
        if (order.status !== "Pertes d'exploitation" && !order.verification?.isLoss) return false;
      }

      if (activeSearch.trim()) {
        const query = activeSearch.toLowerCase();
        const matchNum = order.orderNumber.toLowerCase().includes(query);
        const matchSup = order.supplierRef?.toLowerCase().includes(query) ?? false;
        const matchInt = order.internalRef?.toLowerCase().includes(query) ?? false;
        const matchEmitter = (order.emitterName || "").toLowerCase().includes(query);
        const matchReceiver = (order.receiverName || "").toLowerCase().includes(query);
        if (!matchNum && !matchSup && !matchInt && !matchEmitter && !matchReceiver) {
          return false;
        }
      }

      return true;
    });
  }, [orders, filterEmitter, filterReceiver, filterStatus, filterConformity, activeSearch]);

  // Rendu émetteur / destinataire : ÉLÉMENT UNIQUE, NET, SANS AUCUNE REDONDANCE
  const renderPartyCell = (party?: ERPPartyType | string, name?: string) => {
    const p =
      party === "Entrepôt"
        ? "Dark Ink"
        : party === "Boutique 1"
        ? "Boxxman"
        : party === "Boutique 2"
        ? "New Millenium"
        : party;

    if (p === "Dark Ink") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono whitespace-nowrap">
          Dark Ink
        </span>
      );
    }
    if (p === "Boxxman") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40 font-mono whitespace-nowrap">
          Boxxman
        </span>
      );
    }
    if (p === "New Millenium") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-mono whitespace-nowrap">
          New Millenium
        </span>
      );
    }
    if (p === "Fournisseurs") {
      const label = name && name !== "Fournisseurs" ? name : "Fournisseur";
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-950/50 text-sky-200 border border-sky-800/40 whitespace-nowrap">
          {label}
        </span>
      );
    }
    if (p === "Client particulier") {
      const label = name && name !== "Client particulier" ? name : "Client Particulier";
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-950/50 text-cyan-200 border border-cyan-800/40 whitespace-nowrap">
          {label}
        </span>
      );
    }
    // B2B
    const b2bLabel =
      name && name !== "B2B" && name !== "Compte B2B" && name !== "Pro B2B"
        ? name
        : "SARL Velvet Club";
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-950/50 text-indigo-200 border border-indigo-800/40 whitespace-nowrap">
        {b2bLabel}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Commande effectuée":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950/60 text-sky-400 border border-sky-800/40 whitespace-nowrap">Commande effectuée</span>;
      case "En attente de traitement chez le fournisseur":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40 whitespace-nowrap">En attente fournisseur</span>;
      case "Commande expédiée":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 whitespace-nowrap">Expédiée</span>;
      case "Commande reçue":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 whitespace-nowrap">Reçue</span>;
      case "Commande vérifiée":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 whitespace-nowrap">Vérifiée</span>;
      case "Produits dispatchés":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/60 text-purple-400 border border-purple-800/40 whitespace-nowrap">Dispatchée</span>;
      case "Pertes d'exploitation":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40 whitespace-nowrap">Pertes d&apos;exploit.</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 whitespace-nowrap">{status}</span>;
    }
  };

  const currentExtracted = extractedItems[selectedExtractedIndex] || null;

  return (
    <div className="space-y-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1F242D] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#E2E4E9]">
              Commandes &amp; Dispatch
            </h1>
            <span className="text-[11px] font-mono font-bold bg-[#D4915E]/15 text-[#D4915E] border border-[#D4915E]/30 px-2 py-0.5 rounded">
              Dark Ink • Boxxman • New Millenium
            </span>
          </div>
          <p className="text-xs text-[#8E95A5] mt-1">
            Gestion simplifiée des flux d&apos;approvisionnement, contrôles qualité et transferts directs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewEmitter("Dark Ink");
            setNewEmitterName("Dark Ink");
            setNewReceiver("Boxxman");
            setNewReceiverName("Boxxman");
            setShowCreateModal(true);
          }}
          className="bg-[#D4915E] hover:bg-[#c27f4d] text-black font-bold text-xs px-4 py-2.5 rounded shadow-md transition-all flex items-center justify-center space-x-2 self-start md:self-auto"
        >
          <span>＋</span>
          <span>Passer une commande</span>
        </button>
      </div>

      {/* FILTRES : ÉMETTEUR, DESTINATAIRE, STATUT, CONFORMITÉ */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Émetteur */}
          <div>
            <label className="block text-[#8E95A5] mb-1 font-semibold">Émetteur</label>
            <select
              value={filterEmitter}
              onChange={(e) => setFilterEmitter(e.target.value)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:border-[#D4915E] focus:outline-hidden"
            >
              <option value="all">Tous les émetteurs</option>
              {ALL_PARTIES.map((p) => (
                <option key={`em-${p}`} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Destinataire */}
          <div>
            <label className="block text-[#8E95A5] mb-1 font-semibold">Destinataire</label>
            <select
              value={filterReceiver}
              onChange={(e) => setFilterReceiver(e.target.value)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:border-[#D4915E] focus:outline-hidden"
            >
              <option value="all">Tous les destinataires</option>
              {ALL_PARTIES.map((p) => (
                <option key={`rec-${p}`} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-[#8E95A5] mb-1 font-semibold">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:border-[#D4915E] focus:outline-hidden"
            >
              <option value="all">Tous les statuts ({orders.length})</option>
              {ALL_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Conformité */}
          <div>
            <label className="block text-[#8E95A5] mb-1 font-semibold">Conformité / Pertes</label>
            <select
              value={filterConformity}
              onChange={(e) => setFilterConformity(e.target.value)}
              className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs focus:border-[#D4915E] focus:outline-hidden"
            >
              <option value="all">Toutes les réceptions</option>
              <option value="conform_100">100% Conformes</option>
              <option value="conform_partial">Partiellement conformes</option>
              <option value="losses">Pertes d&apos;exploitation</option>
            </select>
          </div>
        </div>

        {/* RECHERCHE */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[#1C2029]">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActiveSearch(searchInput);
              }}
              placeholder="Recherche par N° commande, réf fournisseur, réf interne, nom tiers..."
              className="w-full bg-[#161A22] border border-[#262D3B] text-white rounded px-3 py-1.5 text-xs focus:border-[#D4915E] focus:outline-hidden placeholder:text-[#525969]"
            />
          </div>
          <button
            type="button"
            onClick={() => setActiveSearch(searchInput)}
            className="bg-[#1C222E] hover:bg-[#252E3E] text-white border border-[#2B3547] text-xs font-semibold px-4 py-1.5 rounded transition-colors flex items-center justify-center space-x-1.5 shrink-0"
          >
            <span>🔍</span>
            <span>Rechercher</span>
          </button>
          {activeSearch && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setActiveSearch("");
              }}
              className="text-[#8E95A5] hover:text-white text-xs px-2 py-1.5 rounded bg-[#181C25] border border-[#262D3B]"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* TABLEAU COMPACT SANS AUCUN SWIPE */}
      <div className="bg-[#12151B] border border-[#1F242D] rounded-lg overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left text-xs border-collapse table-auto">
            <thead>
              <tr className="bg-[#151921] border-b border-[#1F242D] text-[#8E95A5] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Réf &amp; Date</th>
                <th className="py-3 px-3">Émetteur</th>
                <th className="py-3 px-3">Destinataire</th>
                <th className="py-3 px-3 text-center">Volume</th>
                <th className="py-3 px-3 text-right">Total TTC</th>
                <th className="py-3 px-3">Statut &amp; Contrôle</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181D26]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#6B7280]">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalPcs = order.items.reduce((acc, it) => acc + it.qty, 0);
                  const isVerified = Boolean(order.verification);
                  const isLoss = order.verification?.isLoss || order.status === "Pertes d'exploitation";

                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleOpenConsult(order)}
                      className="hover:bg-[#181D26]/70 transition-colors cursor-pointer group"
                    >
                      {/* Réf & Date */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-mono font-bold text-white group-hover:text-[#D4915E] transition-colors">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-[#6B7280] mt-0.5">{order.date}</div>
                        {order.supplierRef && (
                          <div className="text-[9px] font-mono text-amber-400 mt-0.5 truncate max-w-[120px]">
                            {order.supplierRef}
                          </div>
                        )}
                      </td>

                      {/* Émetteur */}
                      <td className="py-3 px-3 align-top">
                        {renderPartyCell(order.emitter, order.emitterName)}
                      </td>

                      {/* Destinataire (garanti strictement différent de l'émetteur) */}
                      <td className="py-3 px-3 align-top">
                        {renderPartyCell(
                          order.receiver !== order.emitter
                            ? order.receiver
                            : order.emitter === "Dark Ink"
                            ? "Boxxman"
                            : "Dark Ink",
                          order.receiverName
                        )}
                      </td>

                      {/* Volume (SANS LISTE DE PRODUITS POUR ÉVITER LE SWIPE) */}
                      <td className="py-3 px-3 align-top text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-[#171B24] border border-[#232936] text-white font-mono text-xs whitespace-nowrap">
                          {order.items.length}&nbsp;art.&nbsp;({totalPcs}&nbsp;pcs)
                        </span>
                      </td>

                      {/* Montant TTC (SIGLE € NON CASSE) */}
                      <td className="py-3 px-3 align-top text-right">
                        <span className="whitespace-nowrap font-mono font-bold text-white text-xs block">
                          {order.totalTTC.toFixed(2)}&nbsp;€
                        </span>
                        <span className="whitespace-nowrap font-mono text-[10px] text-[#6B7280] block">
                          HT:&nbsp;{order.totalHT.toFixed(2)}&nbsp;€
                        </span>
                      </td>

                      {/* Statut */}
                      <td className="py-3 px-3 align-top space-y-1">
                        <div>{getStatusBadge(order.status)}</div>
                        {isVerified && (
                          <div className="text-[10px] font-mono">
                            {isLoss ? (
                              <span className="text-rose-400 font-semibold whitespace-nowrap">
                                ⚠ Pertes
                              </span>
                            ) : (
                              <span className="text-emerald-400 whitespace-nowrap">
                                ✓&nbsp;{order.verification?.conformQty}/{order.verification?.totalQty}&nbsp;conf.
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions salarié */}
                      <td
                        className="py-3 px-3 align-top text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenConsult(order)}
                            className="bg-[#1F2532] hover:bg-[#2A3345] text-white border border-[#2F3A4E] text-[11px] font-semibold px-2 py-1 rounded transition-colors whitespace-nowrap"
                          >
                            Consulter
                          </button>
                          <button
                            type="button"
                            onClick={() => setInvoiceOrder(order)}
                            className="bg-[#181C24] hover:bg-[#212733] text-[#A5ACBA] hover:text-white border border-[#262D3A] text-[11px] px-2 py-1 rounded transition-colors whitespace-nowrap"
                          >
                            Facture
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POP-UP CONSULTER & GESTION COMMANDE */}
      {/* ========================================================================= */}
      {consultOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-[#11141A] border border-[#232936] rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header modale */}
            <div className="bg-[#151922] border-b border-[#222836] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-base font-bold text-white font-mono">
                    {consultOrder.orderNumber}
                  </h2>
                  {getStatusBadge(consultOrder.status)}
                </div>
                <div className="text-xs text-[#8E95A5] mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>Date : {consultOrder.date}</span>
                  <span>Transport : {consultOrder.deliveryMethod}</span>
                  {consultOrder.trackingNumber && (
                    <span className="text-indigo-400 font-mono">
                      Suivi : {consultOrder.trackingNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(consultOrder)}
                  className="bg-[#1E2430] hover:bg-[#283244] text-[#E2E4E9] border border-[#2E394E] text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center space-x-1"
                >
                  <span>📄</span>
                  <span>Facture PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultOrder(null)}
                  className="text-[#8E95A5] hover:text-white text-lg px-2 py-1 rounded bg-[#181C25] border border-[#252C3A]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Onglets : sans icônes, pleine largeur 4 colonnes, sans compression ni scrollbar */}
            <div className="bg-[#0E1116] border-b border-[#1F2532] px-3 pt-2">
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultTab("overview")}
                  className={`py-2 text-xs font-bold border-b-2 text-center transition-all cursor-pointer ${
                    consultTab === "overview"
                      ? "border-[#D4915E] text-[#D4915E] bg-[#161B23]/50"
                      : "border-transparent text-[#8E95A5] hover:text-white hover:bg-[#141820]"
                  }`}
                >
                  Vue générale
                </button>
                <button
                  type="button"
                  onClick={() => setConsultTab("po_scan")}
                  className={`py-2 text-xs font-bold border-b-2 text-center transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    consultTab === "po_scan"
                      ? "border-[#D4915E] text-[#D4915E] bg-[#161B23]/50"
                      : "border-transparent text-[#8E95A5] hover:text-white hover:bg-[#141820]"
                  }`}
                >
                  <span>Scan bon de commande</span>
                  {extractedItems.length > 0 && (
                    <span className="bg-[#D4915E] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {extractedItems.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setConsultTab("ai_studio")}
                  className={`py-2 text-xs font-bold border-b-2 text-center transition-all cursor-pointer ${
                    consultTab === "ai_studio"
                      ? "border-[#D4915E] text-[#D4915E] bg-[#161B23]/50"
                      : "border-transparent text-[#8E95A5] hover:text-white hover:bg-[#141820]"
                  }`}
                >
                  Studio IA
                </button>
                <button
                  type="button"
                  onClick={() => setConsultTab("inspection")}
                  className={`py-2 text-xs font-bold border-b-2 text-center transition-all cursor-pointer ${
                    consultTab === "inspection"
                      ? "border-[#D4915E] text-[#D4915E] bg-[#161B23]/50"
                      : "border-transparent text-[#8E95A5] hover:text-white hover:bg-[#141820]"
                  }`}
                >
                  Contrôle &amp; Dispatch
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {injectionSuccessMessage && (
                <div className="bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs p-3 rounded-lg flex items-center justify-between">
                  <span>{injectionSuccessMessage}</span>
                  <button
                    type="button"
                    onClick={() => setInjectionSuccessMessage(null)}
                    className="text-emerald-400 font-bold px-2 py-0.5"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* ONGLET 1 : VUE GÉNÉRALE & STATUT */}
              {consultTab === "overview" && (
                <div className="space-y-4 text-xs">
                  {/* Cartes Émetteur et Destinataire sans adresses inutiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#161B23] p-3 rounded-lg border border-[#232A38] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block">
                        Émetteur
                      </span>
                      <div>
                        {renderPartyCell(consultOrder.emitter, consultOrder.emitterName)}
                      </div>
                    </div>

                    <div className="bg-[#161B23] p-3 rounded-lg border border-[#232A38] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block">
                        Destinataire
                      </span>
                      <div>
                        {renderPartyCell(
                          consultOrder.receiver !== consultOrder.emitter
                            ? consultOrder.receiver
                            : consultOrder.emitter === "Dark Ink"
                            ? "Boxxman"
                            : "Dark Ink",
                          consultOrder.receiverName
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FORMULAIRE GESTION STATUT & ÉMETTEUR / DESTINATAIRE (JAMAIS IDENTIQUES) */}
                  <div className="bg-[#151921] border border-[#222938] rounded-lg p-4 space-y-3">
                    <h3 className="font-bold text-white text-xs">
                      Paramètres &amp; Statut de la commande
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-medium">Émetteur</label>
                        <select
                          value={editEmitter}
                          onChange={(e) => {
                            const val = e.target.value as ERPPartyType;
                            setEditEmitter(val);
                            if (val === editReceiver) {
                              const next = ALL_PARTIES.find((p) => p !== val) || "Dark Ink";
                              setEditReceiver(next);
                            }
                          }}
                          className="w-full bg-[#1A1F2B] border border-[#283244] text-white rounded px-2.5 py-1.5 text-xs font-semibold"
                        >
                          {ALL_PARTIES.map((p) => (
                            <option key={`ee-${p}`} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-medium">Destinataire (différent de l&apos;émetteur)</label>
                        <select
                          value={editReceiver}
                          onChange={(e) => setEditReceiver(e.target.value as ERPPartyType)}
                          className="w-full bg-[#1A1F2B] border border-[#283244] text-white rounded px-2.5 py-1.5 text-xs font-semibold"
                        >
                          {ALL_PARTIES.filter((p) => p !== editEmitter).map((p) => (
                            <option key={`er-${p}`} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-medium">Statut</label>
                        <select
                          value={editStatusSelect}
                          onChange={(e) => setEditStatusSelect(e.target.value)}
                          className="w-full bg-[#1A1F2B] border border-[#283244] text-white rounded px-2.5 py-1.5 font-semibold text-xs"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={`mod-${st.value}`} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-medium">Réf. Fournisseur</label>
                        <input
                          type="text"
                          value={editSupplierRef}
                          onChange={(e) => setEditSupplierRef(e.target.value)}
                          className="w-full bg-[#1A1F2B] border border-[#283244] text-white rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-medium">Réf. Interne</label>
                        <input
                          type="text"
                          value={editInternalRef}
                          onChange={(e) => setEditInternalRef(e.target.value)}
                          className="w-full bg-[#1A1F2B] border border-[#283244] text-white rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-medium">N° de Suivi</label>
                        <input
                          type="text"
                          value={editTracking}
                          onChange={(e) => setEditTracking(e.target.value)}
                          className="w-full bg-[#1A1F2B] border border-[#283244] text-white rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveOrderHeader}
                        className="bg-[#D4915E] hover:bg-[#c27f4d] text-black font-bold text-xs px-4 py-1.5 rounded transition-all shadow-xs"
                      >
                        Enregistrer modifications
                      </button>
                    </div>
                  </div>

                  {/* Tableau des articles actuels */}
                  <div className="bg-[#141820] border border-[#222938] rounded-lg overflow-hidden">
                    <div className="p-3 bg-[#181D26] border-b border-[#222938] flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        Articles rattachés ({consultOrder.items.length})
                      </span>
                      <span className="whitespace-nowrap font-mono text-xs text-[#D4915E] font-bold">
                        Total TTC :&nbsp;{consultOrder.totalTTC.toFixed(2)}&nbsp;€
                      </span>
                    </div>

                    <div className="divide-y divide-[#1D222E]">
                      {consultOrder.items.map((it, idx) => (
                        <div
                          key={`item-${idx}`}
                          className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#1A1F2A]"
                        >
                          <div>
                            <p className="font-semibold text-white text-xs">{it.name}</p>
                            <span className="font-mono text-[10px] text-[#8E95A5]">
                              ID:&nbsp;{it.productId} • Qté:&nbsp;{it.qty}&nbsp;pcs
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="whitespace-nowrap font-mono font-bold text-white text-xs block">
                              {(it.total || it.qty * it.unitPrice).toFixed(2)}&nbsp;€
                            </span>
                            <span className="whitespace-nowrap font-mono text-[10px] text-[#6B7280]">
                              P.U:&nbsp;{it.unitPrice.toFixed(2)}&nbsp;€
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 2 : SCAN BON DE COMMANDE */}
              {consultTab === "po_scan" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#161B23] border border-[#232938] rounded-lg p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#232938]">
                      <div>
                        <h3 className="font-bold text-white text-xs flex items-center space-x-2">
                          <span>📷</span>
                          <span>Import Bon de Commande Fournisseur</span>
                        </h3>
                        <p className="text-[11px] text-[#8E95A5] mt-0.5">
                          Collez le texte brut d&apos;un BL ou chargez un exemple pour extraction automatique des quantités et références.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {samplePOTexts.map((sample, sIdx) => (
                          <button
                            key={`sample-${sIdx}`}
                            type="button"
                            onClick={() => setPoRawText(sample.text)}
                            className="text-[10px] font-mono px-2 py-1 bg-[#1A1F2A] hover:bg-[#252E3E] text-amber-300 border border-amber-900/40 rounded"
                          >
                            Exemple {sIdx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={5}
                      value={poRawText}
                      onChange={(e) => setPoRawText(e.target.value)}
                      placeholder="Collez ici le texte du bon de commande fournisseur..."
                      className="w-full bg-[#12151B] border border-[#262D3B] text-white rounded p-3 text-xs font-mono focus:border-[#D4915E] focus:outline-hidden"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleRunOcrExtraction}
                        disabled={isOcrScanning}
                        className="bg-[#D4915E] hover:bg-[#c27f4d] disabled:opacity-50 text-black font-bold text-xs px-5 py-2 rounded transition-all shadow-md flex items-center space-x-2"
                      >
                        {isOcrScanning ? (
                          <>
                            <span className="animate-spin">⚙</span>
                            <span>Extraction en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>⚡</span>
                            <span>Extraire Produits &amp; Quantités</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {extractedItems.length > 0 && (
                    <div className="bg-[#141820] border border-[#222938] rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#222938]">
                        <span className="font-bold text-white text-xs">
                          {extractedItems.length} articles extraits
                        </span>
                        <button
                          type="button"
                          onClick={() => setConsultTab("ai_studio")}
                          className="bg-[#5B7A9D] hover:bg-[#6C8CB3] text-white text-xs font-semibold px-3 py-1.5 rounded transition-all shadow-xs"
                        >
                          Studio Traduction IA (4 Langues) →
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="text-[#8E95A5] text-[10px] font-mono uppercase border-b border-[#1F2532]">
                              <th className="py-2 px-2">Réf Fourn.</th>
                              <th className="py-2 px-2">Réf Interne</th>
                              <th className="py-2 px-2">Désignation</th>
                              <th className="py-2 px-2 text-center">Quantité</th>
                              <th className="py-2 px-2 text-right">Achat HT</th>
                              <th className="py-2 px-2 text-right">Vente TTC</th>
                              <th className="py-2 px-2 text-center">Fiche IA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1B202B]">
                            {extractedItems.map((item, idx) => (
                              <tr key={item.id} className="hover:bg-[#181D26]">
                                <td className="py-2 px-2 font-mono text-amber-400">{item.supplierRef}</td>
                                <td className="py-2 px-2 font-mono text-sky-400 font-bold">{item.internalRef}</td>
                                <td className="py-2 px-2 text-white font-medium">{item.rawLabel}</td>
                                <td className="py-2 px-2 text-center font-mono font-bold text-white">{item.qty} pcs</td>
                                <td className="py-2 px-2 text-right font-mono whitespace-nowrap">{item.purchasePriceHT.toFixed(2)}&nbsp;€</td>
                                <td className="py-2 px-2 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">{item.publicPriceTTC.toFixed(2)}&nbsp;€</td>
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedExtractedIndex(idx);
                                      setConsultTab("ai_studio");
                                    }}
                                    className="text-[10px] bg-[#1F2532] hover:bg-[#2A3345] text-[#D4915E] font-semibold px-2 py-1 rounded border border-[#2F3A4E]"
                                  >
                                    Éditer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleInjectToCatalogAndDatabase}
                          className="bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs px-5 py-2.5 rounded shadow-lg transition-all"
                        >
                          🚀 Injecter au Catalogue Produit &amp; Base de Données
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET 3 : STUDIO IA 4 LANGUES (ARGOT GAY / CODES COMMUNAUTÉ) */}
              {consultTab === "ai_studio" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#141A24] border border-[#232F42] p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs">
                        🛡️ Moteur IA Anti-Censure &amp; Codes Gay / Kink
                      </span>
                      <p className="text-[11px] text-[#8E95A5]">
                        Vocabulaire cru et slang fétiche sans censure (FR / EN / ES / DE).
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-bold">
                      Anti-Censure : ACTIF
                    </span>
                  </div>

                  {extractedItems.length === 0 ? (
                    <div className="bg-[#14171E] border border-[#222836] p-8 text-center rounded-lg space-y-3">
                      <p className="text-[#8E95A5]">
                        Aucun article extrait. Veuillez d&apos;abord charger un bon de commande.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPoRawText(samplePOTexts[0].text);
                          handleRunOcrExtraction();
                        }}
                        className="bg-[#D4915E] text-black font-bold text-xs px-4 py-2 rounded"
                      >
                        ⚡ Charger exemple et extraire
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Liste articles */}
                      <div className="lg:col-span-4 bg-[#141820] border border-[#222836] rounded-lg p-3 space-y-2">
                        <span className="text-[10px] font-mono text-[#8E95A5] uppercase font-bold block pb-1 border-b border-[#222836]">
                          Articles ({extractedItems.length})
                        </span>
                        <div className="space-y-1.5">
                          {extractedItems.map((it, idx) => (
                            <button
                              key={`ext-pick-${idx}`}
                              type="button"
                              onClick={() => setSelectedExtractedIndex(idx)}
                              className={`w-full text-left p-2 rounded transition-all text-xs border ${
                                selectedExtractedIndex === idx
                                  ? "bg-[#1C2330] border-[#D4915E] text-white"
                                  : "bg-[#161A22] border-transparent text-[#8E95A5] hover:text-white"
                              }`}
                            >
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-amber-400">{it.supplierRef}</span>
                                <span className="text-sky-300">{it.internalRef}</span>
                              </div>
                              <p className="font-semibold text-white mt-1 truncate">
                                {it.translations.fr.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Studio multilingue */}
                      {currentExtracted && (
                        <div className="lg:col-span-8 bg-[#141820] border border-[#222836] rounded-lg p-4 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#222836] gap-2">
                            <div>
                              <span className="font-mono text-xs text-sky-400 font-bold">
                                {currentExtracted.internalRef}
                              </span>
                              <h3 className="font-bold text-white text-sm mt-0.5">
                                {currentExtracted.translations[activeLangTab].name}
                              </h3>
                            </div>

                            <div className="inline-flex rounded border border-[#282F3D] bg-[#0E1015] p-0.5">
                              {(["fr", "en", "es", "de"] as const).map((lang) => (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => setActiveLangTab(lang)}
                                  className={`px-3 py-1 text-xs uppercase font-mono font-bold rounded transition-colors ${
                                    activeLangTab === lang
                                      ? "bg-[#252B37] text-[#D4915E]"
                                      : "text-[#6B7280] hover:text-white"
                                  }`}
                                >
                                  {lang}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-[#171B24] p-3 rounded border border-[#242A38]">
                              <span className="text-[10px] font-mono uppercase text-[#6B7280] block mb-1">
                                Titre Localisé ({activeLangTab.toUpperCase()})
                              </span>
                              <p className="text-xs font-semibold text-white">
                                {currentExtracted.translations[activeLangTab].name}
                              </p>
                            </div>

                            <div className="bg-[#171B24] p-3 rounded border border-[#242A38]">
                              <span className="text-[10px] font-mono uppercase text-[#6B7280] block mb-1">
                                Description Commerciale Gay &amp; Kink ({activeLangTab.toUpperCase()})
                              </span>
                              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                                {currentExtracted.translations[activeLangTab].description}
                              </p>
                            </div>

                            <div className="bg-[#171B24] p-3 rounded border border-[#242A38]">
                              <span className="text-[10px] font-mono uppercase text-[#6B7280] block mb-1">
                                Meta-Description SEO ({activeLangTab.toUpperCase()})
                              </span>
                              <p className="text-xs text-sky-200 font-mono bg-[#0F1218] p-2 rounded border border-[#1F2531]">
                                {currentExtracted.translations[activeLangTab].metaDescription}
                              </p>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={handleInjectToCatalogAndDatabase}
                                className="bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs px-4 py-2 rounded shadow-md"
                              >
                                🚀 Injecter au Catalogue &amp; BDD
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET 4 : CONTRÔLE SALARIÉ & DISPATCHING */}
              {consultTab === "inspection" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#151921] border border-[#222938] rounded-lg p-4 space-y-4">
                    <h3 className="font-bold text-white text-xs">
                      Contrôle Réception Salarié
                    </h3>

                    {/* 3 checkpoints */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-semibold">
                          1. Emballage carton
                        </label>
                        <select
                          value={boxCondition}
                          onChange={(e) => setBoxCondition(e.target.value)}
                          className="w-full bg-[#181D26] border border-[#283244] text-white rounded px-2.5 py-2 text-xs"
                        >
                          <option value="Carton intact & scellé d'usine">Carton intact &amp; scellé</option>
                          <option value="Carton légèrement froissé">Carton froissé</option>
                          <option value="Carton écrasé / perforé">Carton écrasé / perforé</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-semibold">
                          2. Emballage produit
                        </label>
                        <select
                          value={packagingCondition}
                          onChange={(e) => setPackagingCondition(e.target.value)}
                          className="w-full bg-[#181D26] border border-[#283244] text-white rounded px-2.5 py-2 text-xs"
                        >
                          <option value="Blister / Scellé intact d'origine">Scellé intact</option>
                          <option value="Emballage ouvert / déballé">Emballage ouvert</option>
                          <option value="Emballage déchiré ou manquant">Emballage déchiré</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8E95A5] mb-1 font-semibold">
                          3. État du produit
                        </label>
                        <select
                          value={productCondition}
                          onChange={(e) => setProductCondition(e.target.value)}
                          className="w-full bg-[#181D26] border border-[#283244] text-white rounded px-2.5 py-2 text-xs"
                        >
                          <option value="Conforme / Neuf">Conforme / Neuf</option>
                          <option value="Défaut d'aspect mineur">Défaut d&apos;aspect</option>
                          <option value="Endommagé / Inutilisable / Cassé">Endommagé / Cassé</option>
                        </select>
                      </div>
                    </div>

                    {/* Ratio */}
                    <div className="bg-[#181D26] p-3 rounded-lg border border-[#252E3E] flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        Articles conformes :
                      </span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min={0}
                          max={totalItemsQty}
                          value={conformQty}
                          onChange={(e) => setConformQty(parseInt(e.target.value, 10) || 0)}
                          className="w-20 bg-[#12151B] border border-[#2E394E] text-white font-mono text-center rounded px-2 py-1.5 font-bold"
                        />
                        <span className="font-mono text-sm text-[#8E95A5]">
                          / {totalItemsQty} totaux
                        </span>
                      </div>
                    </div>

                    {/* Décision */}
                    <div className="space-y-3 pt-2 border-t border-[#222938]">
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="lossChoice"
                            checked={!isLossMode}
                            onChange={() => setIsLossMode(false)}
                            className="text-[#D4915E]"
                          />
                          <span className="font-bold text-white">
                            ✓ Valider et dispatcher
                          </span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="lossChoice"
                            checked={isLossMode}
                            onChange={() => setIsLossMode(true)}
                            className="text-rose-500"
                          />
                          <span className="font-bold text-rose-400">
                            ⚠ Déclarer en &quot;Pertes d&apos;exploitation&quot;
                          </span>
                        </label>
                      </div>

                      {isLossMode ? (
                        <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-lg space-y-2">
                          <label className="block text-rose-300 font-semibold text-xs">
                            Motif du litige :
                          </label>
                          <textarea
                            rows={3}
                            value={lossReason}
                            onChange={(e) => setLossReason(e.target.value)}
                            className="w-full bg-[#161A22] border border-rose-900/60 text-white rounded p-2.5 text-xs focus:outline-hidden"
                          />
                        </div>
                      ) : (
                        <div className="bg-[#181D26] border border-[#252E3E] p-3.5 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">
                              Répartition des {conformQty} pièces conformes :
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] text-[#8E95A5]">Stock :</span>
                              <select
                                value={storageChoice}
                                onChange={(e) => setStorageChoice(e.target.value as any)}
                                className="bg-[#12151B] border border-[#2E394E] text-white rounded px-2 py-1 text-xs"
                              >
                                <option value="Rayon">Rayon (Vente directe)</option>
                                <option value="Réserve">Réserve</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[#8E95A5] mb-1 font-medium">Boxxman</label>
                              <input
                                type="number"
                                min={0}
                                value={dispatchQtyBoxxman}
                                onChange={(e) => setDispatchQtyBoxxman(parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-[#12151B] border border-[#2E394E] text-white font-mono rounded px-2.5 py-1.5 text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[#8E95A5] mb-1 font-medium">New Millenium</label>
                              <input
                                type="number"
                                min={0}
                                value={dispatchQtyNewMillenium}
                                onChange={(e) => setDispatchQtyNewMillenium(parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-[#12151B] border border-[#2E394E] text-white font-mono rounded px-2.5 py-1.5 text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[#8E95A5] mb-1 font-medium">Dark Ink</label>
                              <input
                                type="number"
                                min={0}
                                value={dispatchQtyDarkInk}
                                onChange={(e) => setDispatchQtyDarkInk(parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-[#12151B] border border-[#2E394E] text-white font-mono rounded px-2.5 py-1.5 text-center font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleValidateInspection}
                          className={`font-bold text-xs px-5 py-2.5 rounded shadow-lg transition-all ${
                            isLossMode
                              ? "bg-rose-700 hover:bg-rose-600 text-white"
                              : "bg-[#D4915E] hover:bg-[#c27f4d] text-black"
                          }`}
                        >
                          {isLossMode ? "Enregistrer la Perte" : "Valider & Dispatcher"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#151922] border-t border-[#222836] p-3 flex justify-between items-center text-xs">
              <span className="text-[#8E95A5] font-mono">DARK-INK System</span>
              <button
                type="button"
                onClick={() => setConsultOrder(null)}
                className="bg-[#1C222E] hover:bg-[#252E3E] text-white border border-[#2B3547] text-xs font-semibold px-4 py-1.5 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE CRÉATION COMMANDE (ÉMETTEUR !== DESTINATAIRE TOUJOURS) */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-[#11141A] border border-[#232936] rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#222836]">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>＋</span>
                <span>Passer une commande</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[#8E95A5] hover:text-white text-base px-2 py-0.5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              {/* Ligne 1 : Émetteur & Destinataire (STRICTEMENT DIFFÉRENTS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#161B23] p-3 rounded border border-[#242A38] space-y-2">
                  <label className="block text-[#8E95A5] font-semibold">Émetteur</label>
                  <select
                    value={newEmitter}
                    onChange={(e) => handleNewEmitterChange(e.target.value as ERPPartyType)}
                    className="w-full bg-[#12151B] border border-[#2B3446] text-white rounded px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {ALL_PARTIES.map((p) => (
                      <option key={`nem-${p}`} value={p}>{p}</option>
                    ))}
                  </select>
                  {newEmitter === "Fournisseurs" || newEmitter === "Client particulier" || newEmitter === "B2B" ? (
                    <input
                      type="text"
                      value={newEmitterName}
                      onChange={(e) => setNewEmitterName(e.target.value)}
                      placeholder="Nom du tiers..."
                      className="w-full bg-[#12151B] border border-[#2B3446] text-white rounded px-2.5 py-1.5 text-xs"
                    />
                  ) : null}
                </div>

                <div className="bg-[#161B23] p-3 rounded border border-[#242A38] space-y-2">
                  <label className="block text-[#8E95A5] font-semibold">
                    Destinataire <span className="text-amber-400 font-normal">(≠ émetteur)</span>
                  </label>
                  <select
                    value={newReceiver}
                    onChange={(e) => handleNewReceiverChange(e.target.value as ERPPartyType)}
                    className="w-full bg-[#12151B] border border-[#2B3446] text-white rounded px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {ALL_PARTIES.filter((p) => p !== newEmitter).map((p) => (
                      <option key={`nrec-${p}`} value={p}>{p}</option>
                    ))}
                  </select>
                  {newReceiver === "Fournisseurs" || newReceiver === "Client particulier" || newReceiver === "B2B" ? (
                    <input
                      type="text"
                      value={newReceiverName}
                      onChange={(e) => setNewReceiverName(e.target.value)}
                      placeholder="Nom du tiers..."
                      className="w-full bg-[#12151B] border border-[#2B3446] text-white rounded px-2.5 py-1.5 text-xs"
                    />
                  ) : null}
                </div>
              </div>

              {/* Ligne 2 : Références */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8E95A5] mb-1 font-medium">Réf. Fournisseur</label>
                  <input
                    type="text"
                    value={newSupplierRef}
                    onChange={(e) => setNewSupplierRef(e.target.value)}
                    className="w-full bg-[#161B23] border border-[#262D3B] text-white rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#8E95A5] mb-1 font-medium">Réf. Interne</label>
                  <input
                    type="text"
                    value={newInternalRef}
                    onChange={(e) => setNewInternalRef(e.target.value)}
                    className="w-full bg-[#161B23] border border-[#262D3B] text-white rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#8E95A5] mb-1 font-medium">Transporteur</label>
                  <select
                    value={newDeliveryMethod}
                    onChange={(e) => setNewDeliveryMethod(e.target.value)}
                    className="w-full bg-[#161B23] border border-[#262D3B] text-white rounded px-2.5 py-1.5 text-xs"
                  >
                    <option value="Navette Interne">Navette Interne</option>
                    <option value="Transporteur Schenker">Transporteur Schenker</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="UPS Standard">UPS Standard</option>
                    <option value="Coursier">Coursier</option>
                  </select>
                </div>
              </div>

              {/* Ligne 3 : Articles */}
              <div className="bg-[#161B23] p-3 rounded border border-[#242A38] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Articles</span>
                  <button
                    type="button"
                    onClick={() => {
                      const p = products[newOrderItems.length % products.length];
                      setNewOrderItems((prev) => [
                        ...prev,
                        {
                          productId: p.id,
                          name: p.name,
                          qty: 10,
                          unitPrice: p.pricePurchase || 35.0,
                        },
                      ]);
                    }}
                    className="text-[11px] text-[#D4915E] hover:underline font-semibold"
                  >
                    ＋ Ajouter un article
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {newOrderItems.map((item, idx) => (
                    <div
                      key={`new-it-${idx}`}
                      className="grid grid-cols-12 gap-2 items-center bg-[#12151B] p-2 rounded border border-[#232A38]"
                    >
                      <div className="col-span-6">
                        <select
                          value={item.productId}
                          onChange={(e) => {
                            const found = (catalogProducts || products).find((p) => p.id === e.target.value);
                            if (found) {
                              const updated = [...newOrderItems];
                              updated[idx] = {
                                ...updated[idx],
                                productId: found.id,
                                name: found.name,
                                unitPrice: found.pricePurchase || 30.0,
                              };
                              setNewOrderItems(updated);
                            }
                          }}
                          className="w-full bg-[#1A1F2B] border border-[#2E374A] text-white rounded px-2 py-1 text-xs truncate"
                        >
                          {(catalogProducts && catalogProducts.length > 0 ? catalogProducts : products).map((p) => (
                            <option key={`opt-${p.id}`} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3 flex items-center space-x-1">
                        <span className="text-[10px] text-[#8E95A5]">Qté:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => {
                            const updated = [...newOrderItems];
                            updated[idx].qty = parseInt(e.target.value, 10) || 1;
                            setNewOrderItems(updated);
                          }}
                          className="w-full bg-[#1A1F2B] border border-[#2E374A] text-white font-mono text-center rounded px-1.5 py-1 text-xs"
                        />
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="whitespace-nowrap font-mono font-bold text-white text-xs">
                          {(item.qty * item.unitPrice).toFixed(2)}&nbsp;€
                        </span>
                      </div>

                      <div className="col-span-1 text-center">
                        {newOrderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewOrderItems(newOrderItems.filter((_, i) => i !== idx));
                            }}
                            className="text-rose-400 hover:text-rose-200 text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer formulaire */}
              <div className="flex items-center justify-between pt-3 border-t border-[#222836]">
                <div className="font-mono text-xs text-[#8E95A5]">
                  Total TTC :{" "}
                  <span className="whitespace-nowrap font-bold text-white text-sm">
                    {(
                      newOrderItems.reduce((acc, it) => acc + it.qty * it.unitPrice, 0) * 1.2
                    ).toFixed(2)}
                    &nbsp;€
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-[#1C222E] hover:bg-[#252E3E] text-[#8E95A5] text-xs font-semibold px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D4915E] hover:bg-[#c27f4d] text-black font-bold text-xs px-5 py-2 rounded shadow-md"
                  >
                    Valider la commande
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACTURE PDF (ÉMETTEUR + DESTINATAIRE SANS ADRESSES INUTILES) */}
      {/* ========================================================================= */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-black rounded-lg max-w-3xl w-full p-8 shadow-2xl my-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
                Facture Commande
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2 rounded shadow-md flex items-center space-x-1.5"
                >
                  <span>🖨</span>
                  <span>Imprimer / Exporter PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>

            {/* Header facture */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-neutral-900 font-serif">
                  DARK-INK
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Maroquinerie &amp; Fétichisme
                </p>
              </div>

              <div className="text-right font-mono">
                <span className="text-xl font-bold text-neutral-900 block">FACTURE</span>
                <span className="text-xs text-neutral-600 block mt-1">
                  N° {invoiceOrder.orderNumber}
                </span>
                <span className="text-xs text-neutral-500 block">
                  Date : {invoiceOrder.date}
                </span>
                {invoiceOrder.supplierRef && (
                  <span className="text-xs text-neutral-600 block mt-1 font-semibold">
                    Réf Fournisseur : {invoiceOrder.supplierRef}
                  </span>
                )}
                {invoiceOrder.internalRef && (
                  <span className="text-xs text-neutral-600 block">
                    Réf Interne : {invoiceOrder.internalRef}
                  </span>
                )}
              </div>
            </div>

            {/* Émetteur & Destinataire clairs et concis */}
            <div className="grid grid-cols-2 gap-8 text-xs">
              <div className="border border-neutral-200 rounded p-4 bg-neutral-50 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Émetteur
                </span>
                <p className="font-bold text-neutral-900 text-sm">
                  {invoiceOrder.emitterName || invoiceOrder.emitter}
                </p>
              </div>

              <div className="border border-neutral-200 rounded p-4 bg-neutral-50 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Destinataire
                </span>
                <p className="font-bold text-neutral-900 text-sm">
                  {invoiceOrder.receiver !== invoiceOrder.emitter
                    ? invoiceOrder.receiverName || invoiceOrder.receiver
                    : invoiceOrder.emitter === "Dark Ink"
                    ? "Boxxman"
                    : "Dark Ink"}
                </p>
              </div>
            </div>

            {/* Tableau articles */}
            <div className="border rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-600 font-mono text-[11px] uppercase border-b">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Quantité</th>
                    <th className="py-2.5 px-3 text-right">Prix Unit. HT</th>
                    <th className="py-2.5 px-3 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {invoiceOrder.items.map((it, idx) => (
                    <tr key={`inv-row-${idx}`}>
                      <td className="py-2.5 px-3 font-medium text-neutral-900">
                        {it.name}
                        <span className="block text-[10px] text-neutral-400 font-mono">
                          ID: {it.productId}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {it.qty}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                        {it.unitPrice.toFixed(2)}&nbsp;€
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap">
                        {(it.total || it.qty * it.unitPrice).toFixed(2)}&nbsp;€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 font-mono">
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-600">Total HT</span>
                  <span className="whitespace-nowrap font-bold text-neutral-900">
                    {invoiceOrder.totalHT.toFixed(2)}&nbsp;€
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-600">TVA (20.0%)</span>
                  <span className="whitespace-nowrap font-bold text-neutral-900">
                    {invoiceOrder.totalTVA.toFixed(2)}&nbsp;€
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-neutral-900 text-sm">
                  <span className="font-bold text-neutral-900 font-sans">TOTAL TTC</span>
                  <span className="whitespace-nowrap font-black text-neutral-900">
                    {invoiceOrder.totalTTC.toFixed(2)}&nbsp;€
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t text-[10px] text-neutral-400 text-center">
              DARK-INK System • Facture officielle
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
