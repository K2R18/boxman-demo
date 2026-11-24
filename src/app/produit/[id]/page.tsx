import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import BoutiqueProductDetail from "@/components/boutique/BoutiqueProductDetail";
import BoutiqueFooter from "@/components/boutique/BoutiqueFooter";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return {
      title: "Produit introuvable | DARK-INK Boxman Paris",
    };
  }

  const title = `${product.name} — ${product.price.toFixed(2)} € | DARK-INK Paris`;
  const description =
    product.translations.fr.metaDescription || product.translations.fr.description;
  const img = product.images?.[0] || product.image;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.dark-ink.com/produit/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.dark-ink.com/produit/${product.id}`,
      siteName: "DARK-INK Boxman Paris",
      images: [
        {
          url: img,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Schéma structuré Schema.org JSON-LD conforme aux recommandations officielles de Google Shopping
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [product.image],
    description: product.translations.fr.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "DARKLINE",
    },
    category: product.category,
    weight: product.weight,
    offers: {
      "@type": "Offer",
      url: `https://www.dark-ink.com/produit/${product.id}`,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock.web > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      seller: {
        "@type": "Organization",
        name: "DARK-INK",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaJson),
        }}
      />
      <main className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        <BoutiqueProductDetail product={product} />
        <BoutiqueFooter />
      </main>
    </>
  );
}
