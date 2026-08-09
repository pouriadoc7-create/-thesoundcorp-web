"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { PRODUCT_CATEGORIES, PRODUCTS, getProductBrands } from "@/lib/data/products";
import type { ProductCategory } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";

import { ProductCard } from "./ProductCard";

type CategoryFilter = ProductCategory | "all";

const BRANDS = getProductBrands();

export function ProductCatalog() {
  const t = useTranslations("products");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [brand, setBrand] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Reflect filters in the URL so a filtered view is shareable and survives
  // back/forward. Read once on mount (client-only — no SSR hydration mismatch),
  // then write via replaceState on change (no navigation, so no Suspense
  // boundary is forced on the page). The read is deferred to the next frame
  // (same technique as the header) so it isn't a synchronous setState in the
  // effect body.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("category");
      const b = params.get("brand");
      const q = params.get("q");
      if (c && (PRODUCT_CATEGORIES as string[]).includes(c)) setCategory(c as ProductCategory);
      if (b && BRANDS.includes(b)) setBrand(b);
      if (q) setQuery(q);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const writeUrl = (next: { category?: CategoryFilter; brand?: string; query?: string }) => {
    const c = next.category ?? category;
    const b = next.brand ?? brand;
    const q = (next.query ?? query).trim();
    const params = new URLSearchParams();
    if (c !== "all") params.set("category", c);
    if (b !== "all") params.set("brand", b);
    if (q) params.set("q", q);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const categoryLabel = (c: ProductCategory) => t(`categories.${c}`);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (q) {
        const haystack = `${p.name} ${p.brand} ${p.tagline} ${categoryLabel(p.category)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    // categoryLabel depends on t; t is stable per render — safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, brand, query]);

  const hasFilters = category !== "all" || brand !== "all" || query.trim() !== "";

  return (
    <div>
      <h2 className="sr-only">{t("catalogHeading")}</h2>
      {/* Controls */}
      <div className="flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted ltr:left-4 rtl:right-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              writeUrl({ query: e.target.value });
            }}
            aria-label={t("searchLabel")}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-white/[0.10] bg-white/[0.03] py-3.5 text-white placeholder:text-muted transition-colors focus:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4"
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterCategory")}>
            {(["all", ...PRODUCT_CATEGORIES] as CategoryFilter[]).map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    writeUrl({ category: c });
                  }}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex min-h-[44px] items-center rounded-full border px-5 text-sm transition-all duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white"
                  )}
                >
                  {c === "all" ? t("allCategories") : categoryLabel(c)}
                </button>
              );
            })}
          </div>

          {/* Brand select */}
          <label className="flex items-center gap-3 text-sm text-zinc-400">
            <span className="whitespace-nowrap">{t("filterBrand")}</span>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                writeUrl({ brand: e.target.value });
              }}
              className="min-h-[44px] rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-white transition-colors focus:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <option value="all">{t("allBrands")}</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Result meta */}
      <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5 text-sm text-muted">
        <span aria-live="polite">{t("resultsCount", { count: results.length })}</span>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setBrand("all");
              setQuery("");
              writeUrl({ category: "all", brand: "all", query: "" });
            }}
            className="rounded-md text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {t("clearFilters")}
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              categoryLabel={categoryLabel(product.category)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">{t("noResults")}</p>
      )}
    </div>
  );
}
