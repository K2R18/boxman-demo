"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import ERPApp from "@/components/erp/ERPApp";
import BoutiqueApp from "@/components/boutique/BoutiqueApp";

export default function Home() {
  const { appMode } = useApp();

  if (appMode === "boutique") {
    return <BoutiqueApp />;
  }

  return <ERPApp />;
}
