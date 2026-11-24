export interface CruisingOffer {
  id: string;
  name: string;
  price: number;
  description: {
    fr: string;
    en: string;
    es: string;
    de: string;
  };
}

export const cruisingOffers: CruisingOffer[] = [
  {
    id: "cruise-001",
    name: "Entrée Journée",
    price: 15,
    description: {
      fr: "Accès illimité à l'espace cruising pour la journée complète.",
      en: "Unlimited access to the cruising area for the full day.",
      es: "Acceso ilimitado al área de cruising durante todo el día.",
      de: "Unbegrenzter Zugang zum Cruising-Bereich für den ganzen Tag.",
    },
  },
  {
    id: "cruise-002",
    name: "Pass Soirée",
    price: 25,
    description: {
      fr: "Accès à l'espace cruising en soirée avec vestiaire et boisson inclus.",
      en: "Evening access to the cruising area with cloakroom and drink included.",
      es: "Acceso nocturno al área de cruising con guardarropa y bebida incluidos.",
      de: "Abendzugang zum Cruising-Bereich mit Garderobe und Getränk inklusive.",
    },
  },
  {
    id: "cruise-003",
    name: "Carte Multi-entrées x10",
    price: 120,
    description: {
      fr: "Carte prépayée de 10 entrées journée, valable 6 mois. Économisez 20 % par rapport au tarif unitaire.",
      en: "Prepaid card for 10 day entries, valid for 6 months. Save 20% compared to single entry price.",
      es: "Tarjeta prepago de 10 entradas de día, válida por 6 meses. Ahorre un 20 % respecto al precio unitario.",
      de: "Prepaid-Karte für 10 Tageseintritte, 6 Monate gültig. Sparen Sie 20 % gegenüber dem Einzelpreis.",
    },
  },
];
