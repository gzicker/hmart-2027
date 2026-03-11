import { Product } from "@/data/products";
import { Language } from "@/i18n/translations";

export function getProductName(product: Product, language: Language): string {
  if (language === "ko" && product.nameKo) return product.nameKo;
  if (language === "zh" && product.nameZh) return product.nameZh;
  return product.name;
}

export function getProductDescription(product: Product, language: Language): string {
  if (language === "ko" && product.descriptionKo) return product.descriptionKo;
  if (language === "zh" && product.descriptionZh) return product.descriptionZh;
  return product.description;
}

/** Returns the secondary name to show alongside the main translated name */
export function getProductSubName(product: Product, language: Language): string | undefined {
  if (language === "en") return product.nameKo;
  if (language === "ko") return product.name; // show English as secondary
  if (language === "zh") return product.nameKo; // show Korean as secondary
  return product.nameKo;
}
