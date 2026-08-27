import Link from "next/link";
import { categoryHref } from "@/lib/category";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/data/types";

/**
 * Přepínač kategorie (Dospělí / Děti) zobrazený nad obsahem stránky.
 * Odkazuje na tutéž sekci s příslušným `?kategorie=…`.
 */
export function CategorySwitch({
  basePath,
  active,
}: {
  basePath: string;
  active: Category;
}) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1 text-sm">
      {CATEGORIES.map((category) => {
        const isActive = category === active;
        return (
          <Link
            key={category}
            href={categoryHref(basePath, category)}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-md bg-neutral-900 px-4 py-1.5 font-medium text-white"
                : "rounded-md px-4 py-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }
          >
            {CATEGORY_LABELS[category]}
          </Link>
        );
      })}
    </div>
  );
}
