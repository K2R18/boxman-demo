export interface Product {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  category: "Harnais & Cuir" | "Latex & Rubber" | "Bondage & Restraints" | "Sex-Toys & Plaisir" | "Lubrifiants & Soins";
  price: number;
  pricePurchase: number;
  stock: {
    entrepot: number;
    boutique1Rayon: number;
    boutique1Reserve: number;
    boutique2Rayon: number;
    boutique2Reserve: number;
    web: number;
  };
  location: string;
  barcode: string;
  // Detailed product specifications
  material: string;
  color: string;
  size: string;
  fitAdvice: string;
  dimensions: string;
  weight: string;
  translations: {
    fr: { name: string; description: string; metaDescription: string };
    en: { name: string; description: string; metaDescription: string };
    es: { name: string; description: string; metaDescription: string };
    de: { name: string; description: string; metaDescription: string };
  };
  image: string;
  images?: string[];
  features?: string[];
  badges?: string[];
  inStockLabel?: string;
  isActive: boolean;
}

export const products: Product[] = [
  {
    id: "prod-001",
    sku: "DK-HAR-001",
    name: "Harnais Torse Cuir 'Titan' Ajustable",
    category: "Harnais & Cuir",
    price: 119.00,
    pricePurchase: 45.00,
    stock: { entrepot: 45, boutique1Rayon: 6, boutique1Reserve: 12, boutique2Rayon: 4, boutique2Reserve: 8, web: 25 },
    location: "ENT-A02-E1",
    barcode: "3760089010014",
    material: "Cuir de vachette pleine fleur tannage végétal (3.5 mm)",
    color: "Noir profond & bouclerie acier inoxydable argent satiné",
    size: "Ajustable (S à XL)",
    fitAdvice: "Taille normalement — Réglable sur 5 points d'attache par boucles à rouleau",
    dimensions: "Largeur lanières : 38 mm • Tour de torse : 88 à 120 cm",
    weight: "520 g",
    translations: {
      fr: {
        name: "Harnais Torse Cuir 'Titan' Ajustable",
        description: "Harnais torse classique en cuir pleine fleur ultra résistant, doublé aux épaules pour un confort longue durée en club ou convention.",
        metaDescription: "Harnais torse en cuir véritable 'Titan' ajustable — fabrication artisanale robuste."
      },
      en: {
        name: "Adjustable Leather Chest Harness 'Titan'",
        description: "Classic full-grain leather chest harness, reinforced shoulder padding for all-night comfort.",
        metaDescription: "Genuine leather chest harness 'Titan' — handcrafted heavy-duty design."
      },
      es: {
        name: "Arnés de Pecho en Cuero 'Titan' Ajustable",
        description: "Arnés de pecho clásico en cuero plena flor de gran resistencia, reforzado en los hombros.",
        metaDescription: "Arnés de pecho en cuero auténtico 'Titan' — diseño artesanal resistente."
      },
      de: {
        name: "Verstellbares Leder-Brustgeschirr 'Titan'",
        description: "Klassisches Vollrindleder-Brustgeschirr mit gepolsterten Schultergurten für maximalen Tragekomfort.",
        metaDescription: "Echtes Leder-Brustgeschirr 'Titan' — robuste Handwerkskunst."
      }
    },
    image: "/placeholder.jpg",
    isActive: true,
  },
  {
    id: "prod-002",
    sku: "DK-HAR-002",
    name: "Harnais d'Épaule Asymétrique 'Centurion'",
    category: "Harnais & Cuir",
    price: 89.00,
    pricePurchase: 32.00,
    stock: { entrepot: 30, boutique1Rayon: 4, boutique1Reserve: 8, boutique2Rayon: 3, boutique2Reserve: 6, web: 15 },
    location: "ENT-A02-E2",
    barcode: "3760089010021",
    material: "Cuir de buffle huilé haute résistance (3.2 mm)",
    color: "Noir mat & anneaux métalliques canon de fusil",
    size: "Taille Unique Ajustable",
    fitAdvice: "Ajustable par sangles d'aisselle et boucle pectorale — convient du M au XXL",
    dimensions: "Lanières : 32 mm • Tour de poitrine : 92 à 118 cm",
    weight: "380 g",
    translations: {
      fr: {
        name: "Harnais d'Épaule Asymétrique 'Centurion'",
        description: "Design asymétrique signature inspiré des gladiateurs, coupe près du corps soulignant la carrure et la musculature.",
        metaDescription: "Harnais d'épaule asymétrique Centurion en cuir de buffle noir."
      },
      en: {
        name: "Asymmetric Shoulder Harness 'Centurion'",
        description: "Signature gladiator-inspired asymmetric cut, accentuating shoulder definition.",
        metaDescription: "Centurion asymmetric shoulder harness in black buffalo leather."
      },
      es: {
        name: "Arnés de Hombro Asimétrico 'Centurion'",
        description: "Diseño asimétrico inspirado en gladiadores, corte ceñido que realza la espalda.",
        metaDescription: "Arnés de hombro asimétrico Centurion en cuero negro."
      },
      de: {
        name: "Asymmetrisches Schultergeschirr 'Centurion'",
        description: "Asymmetrischer Schnitt im Gladiatoren-Stil, betont Schultern und Rückenmuskulatur.",
        metaDescription: "Centurion asymmetrisches Schultergeschirr aus schwarzem Büffelleder."
      }
    },
    image: "/placeholder.jpg",
    isActive: true,
  },
  {
    id: "prod-003",
    sku: "DK-LAT-001",
    name: "T-Shirt Seconde Peau Latex 0.4mm Zippé",
    category: "Latex & Rubber",
    price: 135.00,
    pricePurchase: 55.00,
    stock: { entrepot: 24, boutique1Rayon: 3, boutique1Reserve: 6, boutique2Rayon: 2, boutique2Reserve: 5, web: 10 },
    location: "ENT-B01-E3",
    barcode: "3760089010038",
    material: "Latex 100% naturel trempé à la main (0.4 mm)",
    color: "Noir laqué brillant (effet miroir avec lustrant)",
    size: "M (Existe en S, M, L, XL)",
    fitAdvice: "Taille très près du corps (effet seconde peau) — Prévoyez une aide à l'enfilage (silicone liquide)",
    dimensions: "Tour de torse : 96 cm • Longueur dos : 68 cm • Zip dorsal 55 cm",
    weight: "260 g",
    translations: {
      fr: {
        name: "T-Shirt Seconde Peau Latex 0.4mm Zippé",
        description: "T-shirt à col rond et manches courtes en latex de haute pureté, équipé d'un zip dorsal robuste à double curseur.",
        metaDescription: "T-shirt latex 0.4mm noir brillant avec zip dorsal — seconde peau sensuelle."
      },
      en: {
        name: "0.4mm Latex Second Skin T-Shirt with Zipper",
        description: "Round neck short sleeve latex t-shirt made of pure dip-moulded natural latex with sturdy back zip.",
        metaDescription: "Glossy black 0.4mm latex t-shirt with rear zipper — skin-tight sensual wear."
      },
      es: {
        name: "Camiseta Segunda Piel de Látex 0.4mm con Cremallera",
        description: "Camiseta de látex natural brillante con cuello redondo y cremallera trasera continua.",
        metaDescription: "Camiseta de látex negro brillante 0.4mm con cremallera dorsal."
      },
      de: {
        name: "0,4mm Latex Second-Skin T-Shirt mit Reißverschluss",
        description: "Kurzarm-T-Shirt aus reinem Naturkautschuk-Latex mit durchgehendem Rückenreißverschluss.",
        metaDescription: "Glänzendes schwarzes 0,4mm Latex-T-Shirt mit Rücken-RV."
      }
    },
    image: "/placeholder.jpg",
    isActive: true,
  },
  {
    id: "prod-004",
    sku: "DK-BON-001",
    name: "Ensemble Menottes Cuir Doublé Agneau",
    category: "Bondage & Restraints",
    price: 65.00,
    pricePurchase: 22.00,
    stock: { entrepot: 50, boutique1Rayon: 8, boutique1Reserve: 15, boutique2Rayon: 6, boutique2Reserve: 12, web: 30 },
    location: "ENT-C03-E2",
    barcode: "3760089010045",
    material: "Cuir sellier extérieur, doublure peau d'agneau véritable ultra douce",
    color: "Noir mat & quincaillerie en laiton massif vieilli",
    size: "Ajustable (Tour de poignet 14 à 24 cm)",
    fitAdvice: "Taille universelle — Convient à toutes les morphologies de poignet sans marquer la peau",
    dimensions: "Largeur manchette : 60 mm • Mousqueton de liaison pivotant : 90 mm",
    weight: "340 g",
    translations: {
      fr: {
        name: "Ensemble Menottes Cuir Doublé Agneau",
        description: "Paire de manchettes de retenue pour poignets, associant la robustesse du cuir sellier au confort soyeux de la peau d'agneau.",
        metaDescription: "Menottes de poignet en cuir sellier doublé agneau — maintien ferme et confort soyeux."
      },
      en: {
        name: "Lambskin-Lined Leather Wrist Cuffs",
        description: "Heavy-duty leather wrist restraints lined with genuine shearling lambskin for gentle yet unbreakable restraint.",
        metaDescription: "Lambskin-lined leather wrist cuffs with solid brass connector."
      },
      es: {
        name: "Esposas de Cuero Forradas con Piel de Cordero",
        description: "Juego de muñequeras de cuero forradas con suave piel de cordero para una inmovilización segura y placentera.",
        metaDescription: "Esposas de cuero negro forradas de cordero — confort y firmeza."
      },
      de: {
        name: "Leder-Handgelenkschellen mit Lammfellfutter",
        description: "Robuste Leder-Handfesseln mit weichem Echt-Lammfellfutter und massivem Verbindungs-Karabiner.",
        metaDescription: "Lammfell-gefütterte Leder-Handfesseln mit massiven Messingbeschlägen."
      }
    },
    image: "https://www.dark-ink.com/62722-home_default/darkline-premium-padded-leather-cuffs-menottes-rembourrees-cuir-noir.webp",
    images: [
      "https://www.dark-ink.com/62722-home_default/darkline-premium-padded-leather-cuffs-menottes-rembourrees-cuir-noir.webp",
      "https://www.dark-ink.com/64588-home_default/no-chance-premium-shackles-handcuffs.webp",
      "https://www.dark-ink.com/56791-home_default/menottes-acier-inoxydable-combinaison-4-chiffres.webp"
    ],
    features: [
      "Cuir sellier pleine fleur ultra robuste",
      "Doublure intérieure en peau d'agneau soyeuse",
      "Mousqueton de liaison pivotant haute résistance",
      "Fermeture par boucles à rouleau sécurisées",
      "Convient pour poignets de 14 à 24 cm"
    ],
    inStockLabel: "Derniers articles en stock",
    isActive: true,
  },
  {
    id: "prod-005",
    sku: "DK-TOY-001",
    name: "Plug Anal Acier Lourd 'Onyx' Gemme Noire",
    category: "Sex-Toys & Plaisir",
    price: 49.00,
    pricePurchase: 16.00,
    stock: { entrepot: 70, boutique1Rayon: 10, boutique1Reserve: 20, boutique2Rayon: 8, boutique2Reserve: 16, web: 40 },
    location: "ENT-D01-E4",
    barcode: "3760089010052",
    material: "Acier inoxydable chirurgical 316L poli miroir & cristal taillé",
    color: "Argent poli miroir avec gemme facettée noir onyx à la base",
    size: "Taille M (Intermédiaire)",
    fitAdvice: "Col effilé pour insertion progressive — base évasée de sécurité pour port prolongé",
    dimensions: "Longueur totale : 85 mm • Longueur insérable : 75 mm • Diamètre max : 34 mm",
    weight: "220 g (effet de poids appréciable)",
    translations: {
      fr: {
        name: "Plug Anal Acier Lourd 'Onyx' Gemme Noire",
        description: "Plug anal en acier chirurgical lourd thermoconducteur (réactif au chaud/froid), doté d'une gemme noire taille diamant à sa base.",
        metaDescription: "Plug anal en acier 316L lourd avec gemme onyx — sensations thermiques et maintien."
      },
      en: {
        name: "Heavy Steel Butt Plug 'Onyx' Black Gem",
        description: "Weighted 316L medical stainless steel plug with faceted black onyx-style gem base. Temperature responsive.",
        metaDescription: "Weighted stainless steel butt plug with black gemstone base."
      },
      es: {
        name: "Plug Anal de Acero Pesado 'Onyx' Gema Negra",
        description: "Plug de acero quirúrgico macizo 316L con piedra negra tallada en la base para sensaciones térmicas únicas.",
        metaDescription: "Plug anal de acero quirúrgico pesado con gema negra brillante."
      },
      de: {
        name: "Schwerer Edelstahl-Analplug 'Onyx' mit schwarzem Kristall",
        description: "Massiver 316L-Chirurgenstahl-Plug mit facettiertem schwarzem Schmuckstein am Sockel. Temperaturleitend.",
        metaDescription: "Schwerer Edelstahl-Analplug 'Onyx' mit funkelndem Sockelkristall."
      }
    },
    image: "/placeholder.jpg",
    isActive: true,
  },
  {
    id: "prod-006",
    sku: "DK-LUB-001",
    name: "Lubrifiant Silicone Haute Viscosité 'Dark Glide' 250ml",
    category: "Lubrifiants & Soins",
    price: 26.50,
    pricePurchase: 9.00,
    stock: { entrepot: 120, boutique1Rayon: 14, boutique1Reserve: 30, boutique2Rayon: 12, boutique2Reserve: 25, web: 60 },
    location: "ENT-E02-E1",
    barcode: "3760089010069",
    material: "Formule 100% silicone médical diméthicone & cyclométhicone de grade pharmaceutique",
    color: "Incolore & inodore",
    size: "Flacon pompe 250 ml",
    fitAdvice: "Ne sèche jamais — Non hydrosoluble (idéal sous la douche ou sessions longues). Compatible latex.",
    dimensions: "Flacon pompe aluminium brossé noir : H 18 cm x Diamètre 5 cm",
    weight: "290 g",
    translations: {
      fr: {
        name: "Lubrifiant Silicone Haute Viscosité 'Dark Glide' 250ml",
        description: "Formule premium ultra glissante sans eau ni conservateurs, conçue spécialement pour les jeux intenses et les environnements club/cruising.",
        metaDescription: "Lubrifiant silicone haute viscosité Dark Glide 250ml — glisse infinie sans dessèchement."
      },
      en: {
        name: "High Viscosity Silicone Lubricant 'Dark Glide' 250ml",
        description: "Waterless premium medical grade silicone lube with enduring slickness for intense play.",
        metaDescription: "Dark Glide high viscosity silicone lube 250ml — long-lasting frictionless glide."
      },
      es: {
        name: "Lubricante de Silicona Alta Viscosidad 'Dark Glide' 250ml",
        description: "Lubricante de silicona médica pura que nunca se seca, apto para sesiones prolongadas y agua.",
        metaDescription: "Lubricante de silicona de alta viscosidad Dark Glide 250ml."
      },
      de: {
        name: "Hochviskoses Silikongleitmittel 'Dark Glide' 250ml",
        description: "Reines medizinisches Silikongleitgel ohne Konservierungsstoffe für endlose Gleitfähigkeit.",
        metaDescription: "Hochviskoses Silikongleitmittel Dark Glide 250ml — unübertroffene Ergiebigkeit."
      }
    },
    image: "/placeholder.jpg",
    isActive: true,
  },
  {
    id: "prod-007",
    sku: "DK-HAR-003",
    name: "Jockstrap Cuir Zippé 'Nightcrawler'",
    category: "Harnais & Cuir",
    price: 59.00,
    pricePurchase: 20.00,
    stock: { entrepot: 35, boutique1Rayon: 5, boutique1Reserve: 10, boutique2Rayon: 4, boutique2Reserve: 8, web: 18 },
    location: "ENT-A03-E4",
    barcode: "3760089010076",
    material: "Cuir d'agneau souple extérieur, ceinture élastique dense 50 mm",
    color: "Noir profond & zip double curseur métallique",
    size: "L (Existe en S, M, L, XL)",
    fitAdvice: "Taille normalement — Ceinture élastique confort épousant la taille",
    dimensions: "Largeur ceinture : 50 mm • Élastiques fessiers : 35 mm",
    weight: "190 g",
    translations: {
      fr: {
        name: "Jockstrap Cuir Zippé 'Nightcrawler'",
        description: "Jockstrap fétichiste combinant une coque en cuir souple avec fermeture éclair intégrale et élastiques de maintien à haute tension.",
        metaDescription: "Jockstrap cuir zippé Nightcrawler — maintien puissant et ouverture rapide."
      },
      en: {
        name: "Zipped Leather Jockstrap 'Nightcrawler'",
        description: "Fetish jockstrap pairing soft leather pouch with heavy duty zipper and wide elastic straps.",
        metaDescription: "Zipped leather jockstrap Nightcrawler — comfort and fetish aesthetic."
      },
      es: {
        name: "Jockstrap de Cuero con Cremallera 'Nightcrawler'",
        description: "Suspensorio de cuero suave con cremallera central y elásticos anchos de gran sujeción.",
        metaDescription: "Jockstrap de cuero con cremallera Nightcrawler."
      },
      de: {
        name: "Leder-Jockstrap mit Reißverschluss 'Nightcrawler'",
        description: "Fetisch-Jockstrap mit weicher Ledertasche, durchgehendem Reißverschluss und elastischen Haltebändern.",
        metaDescription: "Leder-Jockstrap Nightcrawler mit praktischem Front-Reißverschluss."
      }
    },
    image: "/placeholder.jpg",
    isActive: true,
  },
  {
    id: "prod-008",
    sku: "DK-BON-002",
    name: "Collier de Soumission Acier & Anneau Torique",
    category: "Bondage & Restraints",
    price: 55.00,
    pricePurchase: 18.00,
    stock: { entrepot: 40, boutique1Rayon: 6, boutique1Reserve: 12, boutique2Rayon: 5, boutique2Reserve: 10, web: 20 },
    location: "ENT-C04-E1",
    barcode: "3760089010083",
    material: "Acier inoxydable 316L brossé anti-allergène & fermeture par clé Allen discrète",
    color: "Acier brut brossé & anneau frontal soudé sans raccord",
    size: "Diamètre intérieur 120 mm (Tour de cou ~38-40 cm)",
    fitAdvice: "Mesurez votre tour de cou avec un mètre ruban souple — Doit reposer confortablement sur les clavicules",
    dimensions: "Épaisseur tige acier : 8 mm • Anneau O-Ring frontal : 35 mm",
    weight: "280 g",
    translations: {
      fr: {
        name: "Collier de Soumission Acier & Anneau Torique",
        description: "Collier de posture circulaire indémontable sans clé, doté d'un anneau torique frontal massif pour fixation de laisse ou de longes.",
        metaDescription: "Collier de soumission rigide en acier inoxydable 316L avec anneau frontal."
      },
      en: {
        name: "Stainless Steel Locking Collar with O-Ring",
        description: "Circular locking posture collar secured with discreet hex screw, fitted with a heavy duty front O-ring.",
        metaDescription: "Heavy stainless steel posture collar with welded front O-ring."
      },
      es: {
        name: "Collar de Sumisión de Acero con Anilla Frontal",
        description: "Gargantilla rígida de acero inoxidable con cierre de llave Allen y anilla frontal maciza.",
        metaDescription: "Collar rígido de sumisión de acero 316L con anilla frontal."
      },
      de: {
        name: "Edelstahl-Sklavenhalsband mit O-Ring",
        description: "Rundes Edelstahl-Halsband mit verdecktem Inbus-Verschluss und massivem O-Ring.",
        metaDescription: "Schweres Edelstahl-Halsband mit Front-O-Ring und Inbusschlüssel."
      }
    },
    image: "https://www.dark-ink.com/60474-home_default/classy-slave-collar-collier-en-acier-inoxydable-massif.webp",
    images: [
      "https://www.dark-ink.com/60474-home_default/classy-slave-collar-collier-en-acier-inoxydable-massif.webp",
      "https://www.dark-ink.com/63139-home_default/darkline-t-yoke-neck-wrist-restraint-acier.webp"
    ],
    features: [
      "Acier inoxydable massif chirurgical 316L poli",
      "Anneau torique frontal soudé sans raccord pour fixation de laisse",
      "Charnière invisible ergonomique épousant les clavicules",
      "Verrouillage sécurisé par vis discrète à clé Allen fournie"
    ],
    inStockLabel: "En stock",
    isActive: true,
  },
  // =========================================================================
  // CATALOGUE AUTHENTIQUE DARK-INK (SECTION BDSM - 16 PRODUITS RÉELS)
  // =========================================================================
  {
    id: "dk-bdsm-4884",
    sku: "DL2558/A",
    name: "DARKLINE KISS Me Ball Gag – Bâillon boule pour deux personnes",
    brand: "DARKLINE",
    category: "Bondage & Restraints",
    price: 44.90,
    pricePurchase: 18.00,
    stock: { entrepot: 15, boutique1Rayon: 3, boutique1Reserve: 5, boutique2Rayon: 2, boutique2Reserve: 4, web: 8 },
    location: "BDSM-A01-01",
    barcode: "3760089048840",
    inStockLabel: "Derniers articles en stock",
    material: "Silicone noir de grade médical haute densité & sangles en cuir véritable",
    color: "Noir profond (existe également en rouge) & bouclerie métal renforcé",
    size: "Double sangle réglable (Face à face)",
    fitAdvice: "Deux sangles réglables entourant chaque tête et se fermant par une boucle derrière la nuque",
    dimensions: "Diamètres disponibles : 40, 45 ou 50 mm • Boule centrale commune",
    weight: "200 g",
    features: [
      "Bâillon double pour deux personnes",
      "Une boule centrale commune",
      "Deux sangles réglables avec boucles",
      "Diamètres : 40, 45 ou 50 mm",
      "Coloris : noir ou rouge"
    ],
    badges: [
      "Paiement 100% sécurisé",
      "Expédié sous 24h & livraison discrète",
      "Service client disponible Paris (01 42 60 21 59)"
    ],
    translations: {
      fr: {
        name: "DARKLINE KISS Me Ball Gag – Bâillon boule pour deux personnes",
        description: "Un bâillon pour deux, une seule boule à partager ! Le KISS Me Ball Gag rapproche deux partenaires face à face grâce à sa boule centrale commune. Ses deux sangles réglables entourent chaque tête et se ferment par une boucle derrière la nuque.",
        metaDescription: "Un bâillon pour deux, une seule boule à partager ! Le KISS Me Ball Gag rapproche deux partenaires face à face grâce à sa boule centrale commune."
      },
      en: {
        name: "DARKLINE KISS Me Ball Gag – Double Person Gag",
        description: "A gag for two, a single ball to share! The KISS Me Ball Gag brings two partners face-to-face via a shared central ball. Two adjustable straps circle each head with buckle closures at the neck.",
        metaDescription: "DARKLINE KISS Me two-person ball gag — authentic shared bondage restraint."
      },
      es: {
        name: "DARKLINE KISS Me Ball Gag – Mordaza de bola para dos personas",
        description: "¡Una mordaza para dos, una sola bola para compartir! El KISS Me Ball Gag une a dos compañeros cara a cara gracias a su bola central compartida y sus correas regulables.",
        metaDescription: "Mordaza doble DARKLINE KISS Me para dos personas."
      },
      de: {
        name: "DARKLINE KISS Me Ball Gag – Doppelknebel für zwei Personen",
        description: "Ein Knebel für zwei, eine einzige Kugel zum Teilen! Der KISS Me Ball Gag bringt zwei Partner von Angesicht zu Angesicht zusammen, mit verstellbaren Riemen.",
        metaDescription: "DARKLINE KISS Me Doppelknebel für zwei Personen."
      }
    },
    image: "https://www.dark-ink.com/66092-large_default/darkline-kiss-me-ball-gag.webp",
    images: [
      "https://www.dark-ink.com/66092-large_default/darkline-kiss-me-ball-gag.webp",
      "https://www.dark-ink.com/66091-large_default/darkline-kiss-me-ball-gag.webp"
    ],
    isActive: true,
  },
  {
    id: "dk-bdsm-4883",
    sku: "DK-BDSM-4883",
    name: "DARKLINE Young Forceps – Pince BDSM en acier inoxydable",
    category: "Bondage & Restraints",
    price: 19.90,
    pricePurchase: 7.50,
    stock: { entrepot: 28, boutique1Rayon: 6, boutique1Reserve: 10, boutique2Rayon: 4, boutique2Reserve: 8, web: 15 },
    location: "BDSM-A01-02",
    barcode: "3760089048833",
    material: "Acier inoxydable chirurgical 316L poli miroir",
    color: "Argent chromé poli",
    size: "Longueur 14 cm",
    fitAdvice: "Crémaillère crantée permettant de verrouiller précisément 3 niveaux d'intensité de pincement",
    dimensions: "Longueur totale : 140 mm • Mors arrondis striés : 25 mm",
    weight: "85 g",
    translations: {
      fr: {
        name: "DARKLINE Young Forceps – Pince BDSM en acier inoxydable",
        description: "Pince médicale de contention de type forceps en acier inoxydable 316L. Mors protégés et système cranté à verrouillage progressif pour tétons ou zones érogènes.",
        metaDescription: "Pince BDSM Young Forceps DARKLINE en acier chirurgical poli miroir."
      },
      en: {
        name: "DARKLINE Young Forceps – Stainless Steel BDSM Clamp",
        description: "Surgical stainless steel locking forceps clamp with ratchet locking mechanism for precise pressure control.",
        metaDescription: "DARKLINE Young Forceps medical style BDSM clamp in stainless steel."
      },
      es: {
        name: "DARKLINE Young Forceps – Pinza BDSM de acero inoxidable",
        description: "Pinza de precisión quirúrgica con cremallera autoblocante para pezones y zonas sensibles.",
        metaDescription: "Pinza BDSM DARKLINE Young Forceps de acero inoxidable quirúrgico."
      },
      de: {
        name: "DARKLINE Young Forceps – Edelstahl BDSM Klemme",
        description: "Chirurgische Edelstahl-Arterienklemme mit Rasten-Verschluss für regulierbaren Druck.",
        metaDescription: "DARKLINE Young Forceps Edelstahl-Klemme für BDSM-Sessions."
      }
    },
    image: "https://www.dark-ink.com/66090-home_default/darkline-young-forceps-pince-bdsm-en-acier-inoxydable.webp",
    images: [
      "https://www.dark-ink.com/66090-home_default/darkline-young-forceps-pince-bdsm-en-acier-inoxydable.webp",
      "https://www.dark-ink.com/61388-home_default/classic-bondage-hook-acier-inoxydable.webp"
    ],
    features: [
      "Acier chirurgical inoxydable poli miroir",
      "Système de verrouillage cranté à 3 niveaux d'intensité",
      "Mors striés à embouts émoussés sécurisés",
      "Conception ergonomique pour jeu de pincement progressif"
    ],
    inStockLabel: "En stock",
    isActive: true,
  },
  {
    id: "dk-bdsm-4863",
    sku: "DK-BDSM-4863",
    name: "Mr S Leather – Neo Air Mesh Anonymous Hood | Cagoule intégrale en néoprène perforé",
    category: "Bondage & Restraints",
    price: 79.90,
    pricePurchase: 38.00,
    stock: { entrepot: 12, boutique1Rayon: 2, boutique1Reserve: 4, boutique2Rayon: 2, boutique2Reserve: 3, web: 6 },
    location: "BDSM-A02-01",
    barcode: "3760089048635",
    material: "Néoprène haute densité perforé respirant Air Mesh & coutures bordées",
    color: "Noir mat intégral",
    size: "M (Medium)",
    fitAdvice: "Confort thermo-respirant exceptionnel — Zip arrière double curseur pour enfilage rapide",
    dimensions: "Tour de tête 56 à 59 cm • Hauteur 34 cm",
    weight: "180 g",
    translations: {
      fr: {
        name: "Mr S Leather – Neo Air Mesh Anonymous Hood | Cagoule intégrale en néoprène perforé",
        description: "Cagoule intégrale anonyme emblématique par Mr S Leather San Francisco. Fabriquée en néoprène perforé Air Mesh permettant une aération continue tout en masquant complètement l'identité.",
        metaDescription: "Cagoule anonyme néoprène Neo Air Mesh Mr S Leather — fétiche San Francisco."
      },
      en: {
        name: "Mr S Leather – Neo Air Mesh Anonymous Hood",
        description: "Iconic anonymous full-face hood by Mr S Leather SF. Breathable micro-perforated Air Mesh neoprene with back zipper.",
        metaDescription: "Mr S Leather Neo Air Mesh Anonymous Hood — genuine San Francisco gear."
      },
      es: {
        name: "Mr S Leather – Capucha Neo Air Mesh Anonymous",
        description: "Capucha completa anónima de neopreno transpirable microperforado de Mr S Leather con cremallera trasera.",
        metaDescription: "Capucha Mr S Leather Neo Air Mesh — fetiche transpirable de neopreno."
      },
      de: {
        name: "Mr S Leather – Neo Air Mesh Anonymous Maske",
        description: "Vollmaske aus mikroperforiertem, atmungsaktivem Neopren von Mr S Leather mit durchgehendem Rücken-RV.",
        metaDescription: "Mr S Leather Neo Air Mesh Anonymous Hood aus perforiertem Neopren."
      }
    },
    image: "https://www.dark-ink.com/65657-home_default/cagoule-neoprene-neo-air-mesh.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4857",
    sku: "DK-BDSM-4857",
    name: "DARKLINE Bird Chastity Cage de Chasteté Ergonomique – Structure Ouverte avec Verrouillage",
    category: "Bondage & Restraints",
    price: 49.00,
    pricePurchase: 20.00,
    stock: { entrepot: 20, boutique1Rayon: 4, boutique1Reserve: 6, boutique2Rayon: 3, boutique2Reserve: 5, web: 10 },
    location: "BDSM-A02-02",
    barcode: "3760089048574",
    material: "Bio-polymère médical ultra-léger & acier inoxydable",
    color: "Noir mat & quincaillerie laiton",
    size: "Tube 45 mm (4 anneaux inclus : 40, 43, 46, 50 mm)",
    fitAdvice: "Pack complet avec 4 anneaux interchangeables pour un ajustement morphologique parfait au repos",
    dimensions: "Longueur cage 62 mm • Diamètre intérieur 34 mm",
    weight: "110 g",
    translations: {
      fr: {
        name: "DARKLINE Bird Chastity Cage de Chasteté Ergonomique – Structure Ouverte avec Verrouillage",
        description: "Dispositif de chasteté masculine à barreaux ouverts ventilés. Permet l'hygiène quotidienne sous la douche tout en empêchant toute érection ou manipulation sans la clé.",
        metaDescription: "Cage de chasteté Bird DARKLINE avec 4 anneaux ergonomiques et cadenas laiton."
      },
      en: {
        name: "DARKLINE Bird Chastity Ergonomic Open Cage",
        description: "Ergonomic open birdcage chastity device. Maximum hygiene, breathable open structure, comes with 4 ring sizes and lock.",
        metaDescription: "DARKLINE Bird Chastity Cage with 4 ergonomic base rings."
      },
      es: {
        name: "DARKLINE Bird Chastity Jaula de Castidad Ergonómica",
        description: "Dispositivo de castidad masculina con estructura abierta ventilada y 4 anillas adaptadoras incluidas.",
        metaDescription: "Jaula de castidad ergonómica Bird DARKLINE con 4 tamaños de anillas."
      },
      de: {
        name: "DARKLINE Bird Chastity Ergonomischer Keuschheitskäfig",
        description: "Belüfteter Keuschheitskäfig mit offener Gitterstruktur. Inklusive 4 Basisringen für perfekten Sitz.",
        metaDescription: "DARKLINE Bird Chastity Käfig mit 4 Ringen und Vorhängeschloss."
      }
    },
    image: "https://www.dark-ink.com/65053-home_default/darkline-bird-cage-de-chastete-ergonomique-structure-ouverte-avec-verrouillage.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4852",
    sku: "DK-BDSM-4852",
    name: "GASMASTER Sac de réinhalation XXL avec filetage pour masque à gaz",
    category: "Bondage & Restraints",
    price: 72.00,
    pricePurchase: 30.00,
    stock: { entrepot: 8, boutique1Rayon: 2, boutique1Reserve: 3, boutique2Rayon: 1, boutique2Reserve: 2, web: 4 },
    location: "BDSM-A03-01",
    barcode: "3760089048529",
    material: "Caoutchouc naturel vulcanisé haute résistance & raccord aluminium RD40",
    color: "Noir mat",
    size: "Volume XXL (5 Litres)",
    fitAdvice: "Strictement réservé aux pratiquants expérimentés et avertis (Edge Play). Ne jamais utiliser seul.",
    dimensions: "Capacité 5L • Filetage universel OTAN RD40 (40 mm)",
    weight: "320 g",
    translations: {
      fr: {
        name: "GASMASTER Sac de réinhalation XXL avec filetage pour masque à gaz",
        description: "Sac de réinhalation étanche de 5 Litres conçu par GASMASTER. Se visse sur tous les masques à gaz équipés d'un port standard RD40 de 40 mm pour sessions de contrôle du souffle.",
        metaDescription: "Sac de réinhalation XXL GASMASTER pour masque à gaz filetage RD40 40mm."
      },
      en: {
        name: "GASMASTER XXL Rebreathing Bag with Gas Mask Threading",
        description: "Heavy duty 5L vulcanized rubber rebreathing bag with universal 40mm RD40 NATO gas mask thread.",
        metaDescription: "GASMASTER XXL 5L rebreathing bag for 40mm threaded gas masks."
      },
      es: {
        name: "GASMASTER Bolsa de Reinhalación XXL para Máscara de Gas",
        description: "Bolsa de reinhalación de 5 litros de caucho vulcanizado con rosca universal RD40 de 40 mm.",
        metaDescription: "Bolsa de reinhalación XXL GASMASTER para máscara de gas."
      },
      de: {
        name: "GASMASTER XXL Rückatembeutel mit Gasmaskengewinde",
        description: "5L XXL Rückatembeutel aus robustem Gummi mit genormtem 40mm RD40 Gewindeanschluss.",
        metaDescription: "GASMASTER XXL Rückatembeutel für 40mm Gasmasken."
      }
    },
    image: "https://www.dark-ink.com/64516-home_default/gasmaster-rebreathing-bag-xxl-w-gas-mask-threading.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4848",
    sku: "DK-BDSM-4848",
    name: "BRUTUS Neoprene Face Fucker Hood Black / Black",
    category: "Bondage & Restraints",
    price: 29.90,
    pricePurchase: 12.00,
    stock: { entrepot: 22, boutique1Rayon: 5, boutique1Reserve: 8, boutique2Rayon: 3, boutique2Reserve: 6, web: 12 },
    location: "BDSM-A03-02",
    barcode: "3760089048482",
    material: "Néoprène haute souplesse 2.5 mm & anneau buccal renforcé",
    color: "Noir / Noir (Black on Black)",
    size: "Taille Unique Extensible",
    fitAdvice: "Confort stretch enveloppant avec ouverture buccale circulaire élargie",
    dimensions: "Ouverture bouche : 48 mm de diamètre • Circonférence extensible",
    weight: "140 g",
    translations: {
      fr: {
        name: "BRUTUS Neoprene Face Fucker Hood Black / Black",
        description: "Cagoule fétiche BRUTUS en néoprène noir uni. Dépourvue d'ouverture oculaire pour une privation visuelle totale, elle offre une ouverture buccale tubulaire renforcée.",
        metaDescription: "Cagoule néoprène BRUTUS Face Fucker noire — privation sensorielle et confort."
      },
      en: {
        name: "BRUTUS Neoprene Face Fucker Hood Black / Black",
        description: "All-black neoprene fetish hood by BRUTUS. Blindfold sensory deprivation cut with reinforced round mouth opening.",
        metaDescription: "BRUTUS Black on Black neoprene face hood with open mouth."
      },
      es: {
        name: "BRUTUS Capucha de Neopreno Face Fucker Black / Black",
        description: "Capucha fetiche de neopreno negro sin ojos y con boca abierta reforzada.",
        metaDescription: "Capucha fetiche de neopreno BRUTUS Black on Black."
      },
      de: {
        name: "BRUTUS Neopren Face Fucker Maske Black / Black",
        description: "Komplett schwarze Neopren-Fetischmaske ohne Augenöffnungen mit verstärktem Mundloch.",
        metaDescription: "BRUTUS Neopren-Maske Face Fucker schwarz auf schwarz."
      }
    },
    image: "https://www.dark-ink.com/64921-home_default/brutus-neoprene-face-fucker-hood-black-black.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4847",
    sku: "DK-BDSM-4847",
    name: "BRUTUS Neoprene Face Fucker Hood – Cagoule fetish en néoprène",
    category: "Bondage & Restraints",
    price: 29.00,
    pricePurchase: 11.50,
    stock: { entrepot: 18, boutique1Rayon: 4, boutique1Reserve: 6, boutique2Rayon: 3, boutique2Reserve: 5, web: 9 },
    location: "BDSM-A03-03",
    barcode: "3760089048475",
    material: "Néoprène fétiche doublé jersey & coutures plates anti-irritations",
    color: "Noir mat",
    size: "Taille Unique",
    fitAdvice: "Épouse parfaitement les contours du visage avec maintien doux",
    dimensions: "Hauteur 32 cm • Épaisseur 2.5 mm",
    weight: "135 g",
    translations: {
      fr: {
        name: "BRUTUS Neoprene Face Fucker Hood – Cagoule fetish en néoprène",
        description: "La version classique de la cagoule BRUTUS en néoprène souple thermoformé. Isolation visuelle et accès buccal direct pour jeux de soumission orale.",
        metaDescription: "Cagoule néoprène BRUTUS fétiche BDSM avec ouverture buccale."
      },
      en: {
        name: "BRUTUS Neoprene Face Fucker Hood – Fetish Hood",
        description: "Classic BRUTUS stretch neoprene fetish hood. Total sight deprivation and reinforced mouth opening.",
        metaDescription: "BRUTUS neoprene fetish hood with round mouth opening."
      },
      es: {
        name: "BRUTUS Capucha Fetiche de Neopreno Face Fucker",
        description: "Capucha fetiche clásica de neopreno elástico con privación de visión y acceso bucal.",
        metaDescription: "Capucha de neopreno BRUTUS Face Fucker para sumisión."
      },
      de: {
        name: "BRUTUS Neopren Face Fucker Maske – Fetischhaube",
        description: "Klassische Fetisch-Kopfhaube aus Neopren mit offenem Mund und abgedeckten Augen.",
        metaDescription: "BRUTUS Neopren-Fetischhaube mit verstärktem Mundzugang."
      }
    },
    image: "https://www.dark-ink.com/64866-home_default/brutus-face-fucker-hood-cagoule-neoprene.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4822",
    sku: "DK-BDSM-4822",
    name: "GASMASTER Ultimate Aroma Kit – Kit pour masque à gaz",
    category: "Bondage & Restraints",
    price: 59.00,
    pricePurchase: 24.00,
    stock: { entrepot: 16, boutique1Rayon: 3, boutique1Reserve: 6, boutique2Rayon: 2, boutique2Reserve: 4, web: 8 },
    location: "BDSM-A04-01",
    barcode: "3760089048222",
    material: "Aluminium anodisé tourné & tubulures silicone médical étanches",
    color: "Noir mat & argent brossé",
    size: "Filetage standard RD40 (40 mm)",
    fitAdvice: "Se connecte entre la cartouche filtrante ou le sac et le masque pour diffuser vos flacons d'arômes",
    dimensions: "Longueur tubulure 60 cm • Raccord 40 mm",
    weight: "190 g",
    translations: {
      fr: {
        name: "GASMASTER Ultimate Aroma Kit – Kit pour masque à gaz",
        description: "Système complet de diffusion d'arômes pour masques à gaz BDSM. Permet d'insérer vos fioles aromatiques et de réguler l'intensité olfactive reçue par le soumis.",
        metaDescription: "Kit diffuseur d'arômes GASMASTER pour masque à gaz avec pas de vis 40mm."
      },
      en: {
        name: "GASMASTER Ultimate Aroma Kit for Gas Mask",
        description: "Complete scent delivery kit for 40mm gas masks. Precision airflow regulator for aroma bottles.",
        metaDescription: "GASMASTER Ultimate Aroma Kit for 40mm NATO gas masks."
      },
      es: {
        name: "GASMASTER Ultimate Aroma Kit para Máscara de Gas",
        description: "Kit difusor de aromas y esencias para máscaras de gas con conexión estándar de 40 mm.",
        metaDescription: "GASMASTER Kit de aroma para máscaras de gas fetiche."
      },
      de: {
        name: "GASMASTER Ultimate Aroma Kit für Gasmasken",
        description: "Aroma-Diffusions-System für BDSM-Gasmasken mit standardisiertem 40mm RD40 Anschluss.",
        metaDescription: "GASMASTER Aroma-Kit für Atemsteuerungs-Sessions mit Gasmaske."
      }
    },
    image: "https://www.dark-ink.com/64932-home_default/gasmaster-ultimate-aroma-kit-kit-pour-masque-a-gaz.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4782",
    sku: "DK-BDSM-4782",
    name: "DARKLINE Eyelet Ball Gag – Bâillon boule en cuir avec anneau frontal",
    category: "Bondage & Restraints",
    price: 34.00,
    pricePurchase: 13.50,
    stock: { entrepot: 25, boutique1Rayon: 5, boutique1Reserve: 9, boutique2Rayon: 4, boutique2Reserve: 7, web: 12 },
    location: "BDSM-A04-02",
    barcode: "3760089047829",
    material: "Boule silicone plein perforé & sangle cuir sellier véritable",
    color: "Noir mat & quincaillerie nickelée argent",
    size: "Ajustable (Tour de tête 42 à 60 cm)",
    fitAdvice: "L'œillet traversant permet la respiration buccale et l'évacuation naturelle de la salive",
    dimensions: "Diamètre boule 44 mm • Anneau frontal 28 mm",
    weight: "165 g",
    translations: {
      fr: {
        name: "DARKLINE Eyelet Ball Gag – Bâillon boule en cuir avec anneau frontal",
        description: "Bâillon boule percé d'un œillet central traversant en acier, monté sur une solide sangle en cuir sellier doublé. L'anneau frontal permet la fixation d'une laisse de soumission.",
        metaDescription: "Bâillon boule en cuir avec œillet respirant Eyelet Ball Gag DARKLINE."
      },
      en: {
        name: "DARKLINE Eyelet Ball Gag with Front Ring",
        description: "Breather ball gag with drilled stainless steel central airway and heavy leather harness with front leash attachment ring.",
        metaDescription: "DARKLINE Eyelet Ball Gag with front O-ring and genuine leather strap."
      },
      es: {
        name: "DARKLINE Eyelet Ball Gag – Mordaza con anillo frontal",
        description: "Mordaza de bola perforada con conducto respiratorio y tira de cuero genuino con anilla frontal para correa.",
        metaDescription: "Mordaza de bola de cuero con conducto Eyelet Ball Gag DARKLINE."
      },
      de: {
        name: "DARKLINE Eyelet Ball Gag – Ballknebel mit Frontring",
        description: "Atmungsaktiver Ballknebel mit durchgehender Atemöffnung und Lederriemen mit integriertem Leinenring.",
        metaDescription: "DARKLINE Eyelet Ball Gag Ballknebel mit Front-O-Ring."
      }
    },
    image: "https://www.dark-ink.com/63456-home_default/darkline-eyelet-ball-gag-baillon-boule-en-cuir-avec-anneau-frontal.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4766",
    sku: "DK-BDSM-4766",
    name: "DARKLINE Tight Squeeze Balls Pillory – Pilori génital en bois noir",
    category: "Bondage & Restraints",
    price: 69.00,
    pricePurchase: 28.00,
    stock: { entrepot: 10, boutique1Rayon: 2, boutique1Reserve: 3, boutique2Rayon: 2, boutique2Reserve: 3, web: 5 },
    location: "BDSM-A05-01",
    barcode: "3760089047669",
    material: "Bois massif noble laqué noir ébène & écrous moletés en laiton massif",
    color: "Noir ébène & laiton or",
    size: "Serrage micrométrique ajustable",
    fitAdvice: "Tournez les écrous moletés à la main pour doser la pression avec une précision chirurgicale",
    dimensions: "Longueur 160 mm • Épaisseur 22 mm • Orifices 35 & 45 mm",
    weight: "310 g",
    translations: {
      fr: {
        name: "DARKLINE Tight Squeeze Balls Pillory – Pilori génital en bois noir",
        description: "Pilori scrotal de torture sensuelle en bois noir ébène massif. Double échancrure pour isoler et compresser les testicules à l'aide de vis papillons en laiton massif poli.",
        metaDescription: "Pilori génital en bois noir Tight Squeeze Balls Pillory DARKLINE."
      },
      en: {
        name: "DARKLINE Tight Squeeze Balls Pillory – Black Wood",
        description: "Handcrafted black lacquered hardwood ball pillory with solid brass knurled thumbscrews for precision pressure control.",
        metaDescription: "DARKLINE Tight Squeeze hardwood ball pillory with brass hardware."
      },
      es: {
        name: "DARKLINE Tight Squeeze Balls Pillory – Madera Negra",
        description: "Pilorio genital de madera maciza lacada en negro con tornillos de latón para compresión escrotal milimétrica.",
        metaDescription: "Pilorio genital de madera negra Tight Squeeze DARKLINE."
      },
      de: {
        name: "DARKLINE Tight Squeeze Balls Pillory – Schwarzes Holz",
        description: "Massiver Hodenpranger aus schwarz lackiertem Edelholz mit Rändelschrauben aus massivem Messing.",
        metaDescription: "DARKLINE Tight Squeeze Genital-Pranger aus schwarzem Holz."
      }
    },
    image: "https://www.dark-ink.com/63572-home_default/darklinetight-squeeze-balls-pillory-pilori-genital-bois-noi.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4765",
    sku: "DK-BDSM-4765",
    name: "DARKLINE Immobilize Balls Pillory – Pilori génital en bois noir",
    category: "Bondage & Restraints",
    price: 69.00,
    pricePurchase: 28.00,
    stock: { entrepot: 11, boutique1Rayon: 2, boutique1Reserve: 4, boutique2Rayon: 2, boutique2Reserve: 3, web: 6 },
    location: "BDSM-A05-02",
    barcode: "3760089047652",
    material: "Bois dur noir satiné & tiges filetées en acier chromé",
    color: "Noir ébène & acier",
    size: "Ajustable",
    fitAdvice: "Conçu pour une immobilisation totale de la verge et des bourses en deux compartiments distincts",
    dimensions: "175 x 50 x 25 mm • Écartement modulable",
    weight: "330 g",
    translations: {
      fr: {
        name: "DARKLINE Immobilize Balls Pillory – Pilori génital en bois noir",
        description: "Carcan de rétention pénienne et testiculaire en bois noir. Permet de séparer fermement les attributs masculins et de maintenir une traction continue.",
        metaDescription: "Pilori génital d'immobilisation en bois noir DARKLINE."
      },
      en: {
        name: "DARKLINE Immobilize Balls Pillory – Black Wood",
        description: "Solid black wood genital restraint pillory designed to lock and immobilize testicles and penis base.",
        metaDescription: "DARKLINE Immobilize black wood genital pillory."
      },
      es: {
        name: "DARKLINE Immobilize Balls Pillory – Cepo Genital",
        description: "Cepo genital de madera negra con dos aperturas para bloqueo seguro de pene y testículos.",
        metaDescription: "Cepo genital de madera negra DARKLINE Immobilize."
      },
      de: {
        name: "DARKLINE Immobilize Balls Pillory – Genital-Pranger",
        description: "Zweiteiliger Pranger aus schwarzem Hartholz zur sicheren Fixierung des männlichen Genitals.",
        metaDescription: "DARKLINE Immobilize Hoden- und Penispranger aus Hartholz."
      }
    },
    image: "https://www.dark-ink.com/63551-home_default/darkline-immobilize-balls-pillory-pilori-genital-bois-noir.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4761",
    sku: "DK-BDSM-4761",
    name: "DARKLINE Jennings – Écarteur de bouche en acier avec revêtement PVC noir",
    category: "Bondage & Restraints",
    price: 44.00,
    pricePurchase: 18.00,
    stock: { entrepot: 14, boutique1Rayon: 3, boutique1Reserve: 5, boutique2Rayon: 2, boutique2Reserve: 4, web: 7 },
    location: "BDSM-A06-01",
    barcode: "3760089047614",
    material: "Acier trempé inoxydable & gaine dentaire de protection en vinyle PVC noir",
    color: "Noir & acier brossé",
    size: "Small (9 à 11 cm d'ouverture)",
    fitAdvice: "Les gaines vinyles souples reposent sur les molaires sans risquer d'endommager l'émail dentaire",
    dimensions: "Longueur totale : 115 mm • Système de cliquet auto-bloquant",
    weight: "155 g",
    translations: {
      fr: {
        name: "DARKLINE Jennings – Écarteur de bouche en acier avec revêtement PVC noir",
        description: "Ouvre-bouche mécanique de style médical type Jennings. Structure en acier inox avec cliquet de sécurité latéral et embouts de morsure gainés de PVC noir pour protéger les dents.",
        metaDescription: "Écarteur de bouche Jennings DARKLINE en acier et gaines PVC noir."
      },
      en: {
        name: "DARKLINE Jennings Mouth Gag with Black PVC Coating",
        description: "Medical style Jennings mouth gag in stainless steel with ratchet lock and protective soft black PVC tooth guards.",
        metaDescription: "DARKLINE Jennings stainless steel mouth gag with PVC coating."
      },
      es: {
        name: "DARKLINE Jennings – Dilatador bucal de acero y PVC negro",
        description: "Abrebocas mecánico Jennings de acero con trinquete de bloqueo y fundas de vinilo negro protectoras.",
        metaDescription: "Abrebocas Jennings DARKLINE de acero con protección de PVC."
      },
      de: {
        name: "DARKLINE Jennings Mundsperrer mit schwarzem PVC-Schutz",
        description: "Mechanischer Jennings-Kiefersperrer aus Edelstahl mit Rastenmechanismus und zahnschonenden PVC-Hülsen.",
        metaDescription: "DARKLINE Jennings Kiefersperrer aus Edelstahl mit PVC-Überzug."
      }
    },
    image: "https://www.dark-ink.com/63217-home_default/jennings-ecarteur-bouche-acier-pvc-noir.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4732",
    sku: "DK-BDSM-4732",
    name: "DARKLINE Leather hogties",
    category: "Bondage & Restraints",
    price: 24.00,
    pricePurchase: 9.50,
    stock: { entrepot: 32, boutique1Rayon: 6, boutique1Reserve: 12, boutique2Rayon: 5, boutique2Reserve: 10, web: 18 },
    location: "BDSM-A06-02",
    barcode: "3760089047324",
    material: "Cuir sellier pleine fleur épais & mousquetons métalliques rotatifs",
    color: "Noir mat & quincaillerie argent",
    size: "2-Ways (Ajustable)",
    fitAdvice: "Idéal pour relier en quelques secondes les menottes de poignets aux entraves de chevilles",
    dimensions: "Longueur sangle : 22 cm • 2 mousquetons carabine 65 mm",
    weight: "145 g",
    translations: {
      fr: {
        name: "DARKLINE Leather hogties",
        description: "Sangle de liaison courte en cuir épais rivetée équipée de deux mousquetons tournants à ressort. Indispensable pour réaliser des postures hogtie complètes dans le dos.",
        metaDescription: "Sangle de liaison en cuir pour entraves Leather Hogties DARKLINE."
      },
      en: {
        name: "DARKLINE Leather Hogties Connector Strap",
        description: "Heavy full-grain leather connecting strap with two swivel snap hooks for classic hogtie postures.",
        metaDescription: "DARKLINE Leather Hogties connecting restraint strap."
      },
      es: {
        name: "DARKLINE Leather Hogties – Correa de conexión",
        description: "Correa de unión corta en cuero grueso con dos mosquetones giratorios para posturas hogtie.",
        metaDescription: "Correa de conexión de cuero DARKLINE Leather Hogties."
      },
      de: {
        name: "DARKLINE Leather Hogties – Verbindungsriemen aus Leder",
        description: "Robuster Leder-Verbindungsriemen mit zwei massiven Drehwirbel-Karabinern für Hogtie-Fesselungen.",
        metaDescription: "DARKLINE Leather Hogties Leder-Verbindungsstück."
      }
    },
    image: "https://www.dark-ink.com/63039-home_default/darkline-leather-hogties.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4710",
    sku: "DK-BDSM-4710",
    name: "DARKLINE T-Yoke Neck & Wrist Restraint – Carcan en T cou et poignets en acier",
    category: "Bondage & Restraints",
    price: 128.00,
    pricePurchase: 52.00,
    stock: { entrepot: 7, boutique1Rayon: 1, boutique1Reserve: 2, boutique2Rayon: 1, boutique2Reserve: 2, web: 3 },
    location: "BDSM-A07-01",
    barcode: "3760089047102",
    material: "Acier tubulaire lourd & colliers à charnières verrouillables",
    color: "Argent chromé brillant miroir",
    size: "Taille Standard Adulte",
    fitAdvice: "Impose une posture de reddition totale les bras écartés au niveau de la nuque",
    dimensions: "Barre en T 52 cm • Collier cou 13 cm • Poignets 6.5 cm",
    weight: "1 450 g (1.45 kg)",
    translations: {
      fr: {
        name: "DARKLINE T-Yoke Neck & Wrist Restraint – Carcan en T cou et poignets en acier",
        description: "Carcan rigide en T de haute contention en acier chromé lourd. Bloque simultanément le cou et les deux poignets dans une posture statique indéverrouillable sans clé.",
        metaDescription: "Carcan en T cou et poignets en acier massif T-Yoke DARKLINE."
      },
      en: {
        name: "DARKLINE T-Yoke Neck & Wrist Restraint – Stainless Steel",
        description: "Heavy rigid steel T-bar restraint locking the neck and wrists into a strict submission posture.",
        metaDescription: "DARKLINE T-Yoke solid steel neck and wrist restraint bar."
      },
      es: {
        name: "DARKLINE T-Yoke – Yugo en T de acero para cuello y muñecas",
        description: "Yugo rígido en T de acero pesado que inmoviliza cuello y muñecas en postura fija.",
        metaDescription: "Yugo en T cou et poignets en acier DARKLINE T-Yoke."
      },
      de: {
        name: "DARKLINE T-Yoke – T-Pranger aus Stahl für Hals und Handgelenke",
        description: "Massiver T-Pranger aus hochglanzpoliertem Stahl. Fixiert Hals und beide Handgelenke ausbruchsicher.",
        metaDescription: "DARKLINE T-Yoke Edelstahl-Pranger für Hals und Handgelenke."
      }
    },
    image: "https://www.dark-ink.com/63139-home_default/darkline-t-yoke-neck-wrist-restraint-acier.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4692",
    sku: "DK-BDSM-4692",
    name: "DARKLINE Spider Mouth Gag – Bâillon araignée en acier et cuir",
    category: "Bondage & Restraints",
    price: 49.00,
    pricePurchase: 20.00,
    stock: { entrepot: 15, boutique1Rayon: 3, boutique1Reserve: 5, boutique2Rayon: 2, boutique2Reserve: 4, web: 8 },
    location: "BDSM-A07-02",
    barcode: "3760089046921",
    material: "Crochets en acier chirurgical poli miroir & harnachement cuir sellier",
    color: "Noir fétiche & acier poli",
    size: "Universel Réglable",
    fitAdvice: "Les 4 branches spider maintiennent les commissures des lèvres complètement écartées",
    dimensions: "Écartement spider : 60 mm • Sangles cuir tour de tête 65 cm",
    weight: "190 g",
    translations: {
      fr: {
        name: "DARKLINE Spider Mouth Gag – Bâillon araignée en acier et cuir",
        description: "Bâillon araignée signature DARKLINE doté de 4 griffes lisses en acier chirurgical reliées à un harnais de tête en cuir sellier. Maintient la bouche grande ouverte sans étouffement.",
        metaDescription: "Bâillon araignée Spider Mouth Gag en acier et cuir sellier DARKLINE."
      },
      en: {
        name: "DARKLINE Spider Mouth Gag – Steel & Leather",
        description: "Iconic spider oral gag featuring 4 polished steel prongs holding the mouth completely stretched open with leather straps.",
        metaDescription: "DARKLINE Spider mouth gag in surgical stainless steel and black leather."
      },
      es: {
        name: "DARKLINE Spider Mouth Gag – Mordaza araña de acero y cuero",
        description: "Mordaza araña con 4 ganchos lisos de acero pulido y correas de cuero para mantener la boca abierta.",
        metaDescription: "Mordaza araña DARKLINE Spider Mouth Gag de acero y cuero."
      },
      de: {
        name: "DARKLINE Spider Mouth Gag – Spinnenknebel aus Stahl und Leder",
        description: "Klassischer Spinnenknebel mit 4 polierten Stahlhaken und verstellbarem Leder-Kopfgeschirr.",
        metaDescription: "DARKLINE Spider Mouth Gag Spinnenknebel aus Stahl und Leder."
      }
    },
    image: "https://www.dark-ink.com/62140-home_default/darkline-spider-mouth-gag-baillon-araignee-en-acier-et-cuir.webp",
    isActive: true,
  },
  {
    id: "dk-bdsm-4681",
    sku: "DK-BDSM-4681",
    name: "OXBALLS LANKYZ – Ventouses profondes pour mamelons en silicone",
    category: "Bondage & Restraints",
    price: 39.00,
    pricePurchase: 16.00,
    stock: { entrepot: 24, boutique1Rayon: 5, boutique1Reserve: 8, boutique2Rayon: 4, boutique2Reserve: 6, web: 14 },
    location: "BDSM-A08-01",
    barcode: "3760089046815",
    material: "Silicone TPR translucide ultra-souple formule Oxballs",
    color: "Transparent (Clear)",
    size: "Paire de cylindres longs",
    fitAdvice: "Pressez le fond de la ventouse et appliquez sur le mamelon avec une goutte de lubrifiant pour aspiration maximale",
    dimensions: "Longueur cylindre 75 mm • Diamètre d'aspiration 32 mm",
    weight: "120 g la paire",
    translations: {
      fr: {
        name: "OXBALLS LANKYZ – Ventouses profondes pour mamelons en silicone",
        description: "Paire de ventouses extra-longues en silicone translucide épais développées par Oxballs USA. Crée une succion puissante et continue pour étirer et stimuler les tétons.",
        metaDescription: "Ventouses tétons profondes en silicone OXBALLS LANKYZ transparentes."
      },
      en: {
        name: "OXBALLS LANKYZ – Deep Nipple Suckers in Silicone",
        description: "Extra-deep translucent silicone nipple suction cylinders by Oxballs USA. Powerful vacuum suction for intense sensation.",
        metaDescription: "OXBALLS LANKYZ deep silicone nipple vacuum suckers."
      },
      es: {
        name: "OXBALLS LANKYZ – Ventosas profundas para pezones en silicona",
        description: "Par de ventosas extra largas de silicona transparente de Oxballs para succión y estiramiento de pezones.",
        metaDescription: "Ventosas profundas para pezones de silicona OXBALLS LANKYZ."
      },
      de: {
        name: "OXBALLS LANKYZ – Tiefe Silikon-Brustwarzensauger",
        description: "Extra tiefe Saugglocken aus transparentem Silikon von Oxballs USA für intensiven Unterdruck und Stimulation.",
        metaDescription: "OXBALLS LANKYZ tiefe Silikon-Vakuumsauger für Brustwarzen."
      }
    },
    image: "https://www.dark-ink.com/61780-home_default/oxballs-lankyz-ventouses-profondes-pour-mamelons-en-silicone.webp",
    isActive: true,
  }
];
