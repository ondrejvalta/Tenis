import { CATEGORIES, DEFAULT_CATEGORY, type Category } from "@/data/types";

/**
 * Načte kategorii z hodnoty query parametru `?kategorie=…`.
 * Neznámá / chybějící hodnota spadne na výchozí kategorii (dospělí).
 */
export function parseCategory(value: string | undefined | null): Category {
  return CATEGORIES.includes(value as Category)
    ? (value as Category)
    : DEFAULT_CATEGORY;
}

/**
 * Sestaví URL dané sekce pro konkrétní kategorii. Pro dospělé (výchozí)
 * vrací čistou cestu bez query, pro děti přidá `?kategorie=deti`.
 */
export function categoryHref(basePath: string, category: Category): string {
  return category === DEFAULT_CATEGORY
    ? basePath
    : `${basePath}?kategorie=${category}`;
}
