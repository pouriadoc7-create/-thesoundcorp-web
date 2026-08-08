"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { BrandTile } from "@/components/downloads/BrandTile";
import { DocumentGroup } from "@/components/downloads/DocumentGroup";
import { DocumentRow } from "@/components/downloads/DocumentRow";
import { ProductHero } from "@/components/downloads/ProductHero";
import { ProductTile } from "@/components/downloads/ProductTile";
import { Reveal } from "@/components/motion/Reveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { BRAND_LOGOS } from "@/lib/data/brand-logos";
import type { DownloadSearchRow } from "@/lib/utils/downloads";
import {
  DOC_GROUPS,
  buildSearchIndex,
  countBrandDocuments,
  getDownloadBrand,
  getDownloadBrands,
  getDownloadProduct,
  groupDocuments,
  groupKeyForType,
} from "@/lib/utils/downloads";
import { cn } from "@/lib/utils/cn";

/** The interactive Download Center: Brands → Brand → Products → Product → Documents,
 *  with a cross-cutting search and a minimal document-type filter. */
export function DownloadsExplorer() {
  const t = useTranslations("downloads");
  const brands = useMemo(() => getDownloadBrands(), []);
  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const [brandSlug, setBrandSlug] = useState<string | null>(null);
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const rootRef = useRef<HTMLDivElement>(null);

  // ---- Deep-link: read once on mount, then keep the URL in sync (no history spam).
  // The state update is deferred to the next frame (matching <Reveal>) so it runs
  // strictly after the SSR-matching first paint — no hydration mismatch, no
  // synchronous setState in the effect body.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const b = sp.get("brand");
    const p = sp.get("product");
    if (!b || !getDownloadBrand(b)) return;
    const validProduct = p && getDownloadProduct(b, p) ? p : null;
    const raf = requestAnimationFrame(() => {
      setBrandSlug(b);
      if (validProduct) setProductSlug(validProduct);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (brandSlug) params.set("brand", brandSlug);
    if (productSlug) params.set("product", productSlug);
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
  }, [brandSlug, productSlug]);

  const scrollToTop = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });
  }, []);

  const openBrand = useCallback(
    (slug: string) => {
      setBrandSlug(slug);
      setProductSlug(null);
      setTypeFilter("all");
      scrollToTop();
    },
    [scrollToTop]
  );

  const openProduct = useCallback(
    (slug: string) => {
      setProductSlug(slug);
      setTypeFilter("all");
      scrollToTop();
    },
    [scrollToTop]
  );

  const goBrands = useCallback(() => {
    setBrandSlug(null);
    setProductSlug(null);
    setTypeFilter("all");
    scrollToTop();
  }, [scrollToTop]);

  const goProducts = useCallback(() => {
    setProductSlug(null);
    setTypeFilter("all");
    scrollToTop();
  }, [scrollToTop]);

  const activeBrand = brandSlug ? getDownloadBrand(brandSlug) : undefined;
  const activeProduct =
    brandSlug && productSlug ? getDownloadProduct(brandSlug, productSlug) : undefined;
  const searching = query.trim().length > 0;

  const queryMatches = useMemo<DownloadSearchRow[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((r) => r.haystack.includes(q));
  }, [query, searchIndex]);

  const results = useMemo<DownloadSearchRow[]>(() => {
    if (typeFilter === "all") return queryMatches;
    return queryMatches.filter((r) => groupKeyForType(r.doc.type) === typeFilter);
  }, [queryMatches, typeFilter]);

  // Groups present for the current context (drives the filter chips), in canonical order.
  const contextGroups = useMemo(() => {
    if (searching) {
      const present = new Set(queryMatches.map((r) => groupKeyForType(r.doc.type)));
      return DOC_GROUPS.filter((g) => present.has(g.key)).map((g) => g.key);
    }
    if (activeProduct) return groupDocuments(activeProduct.documents).map((g) => g.key);
    return [];
  }, [searching, queryMatches, activeProduct]);

  const onSearchChange = (value: string) => {
    const wasSearching = query.trim().length > 0;
    setQuery(value);
    if (wasSearching !== value.trim().length > 0) setTypeFilter("all");
  };

  const viewKey = searching
    ? `search:${typeFilter}`
    : activeProduct
      ? `product:${brandSlug}/${productSlug}`
      : activeBrand
        ? `brand:${brandSlug}`
        : "brands";

  const showFilters = searching ? contextGroups.length > 1 : Boolean(activeProduct);

  return (
    <div ref={rootRef}>
      {/* ---- Control bar: search + minimal type filter ---- */}
      <div className="mx-auto max-w-2xl">
        <SearchField
          value={query}
          onChange={onSearchChange}
          onClear={() => {
            setQuery("");
            setTypeFilter("all");
          }}
          placeholder={t("searchPlaceholder")}
          label={t("searchLabel")}
          clearLabel={t("clearSearch")}
        />
      </div>

      {showFilters ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            {t("filterAll")}
          </FilterChip>
          {contextGroups.map((key) => (
            <FilterChip key={key} active={typeFilter === key} onClick={() => setTypeFilter(key)}>
              {t(`groups.${key}`)}
            </FilterChip>
          ))}
        </div>
      ) : null}

      {/* ---- Breadcrumb ---- */}
      {!searching && activeBrand ? (
        <nav aria-label={t("breadcrumbLabel")} className="mt-9 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          <button type="button" onClick={goBrands} className="transition-colors duration-300 hover:text-zinc-200">
            {t("crumbBrands")}
          </button>
          <Sep />
          {activeProduct ? (
            <>
              <button type="button" onClick={goProducts} className="transition-colors duration-300 hover:text-zinc-200">
                {activeBrand.name}
              </button>
              <Sep />
              <span aria-current="page" className="text-[color:var(--color-gold-soft)]">
                {activeProduct.name}
              </span>
            </>
          ) : (
            <span aria-current="page" className="text-[color:var(--color-gold-soft)]">
              {activeBrand.name}
            </span>
          )}
        </nav>
      ) : null}

      {/* ---- Views ---- */}
      <div key={viewKey} className="dl-view mt-10">
        {searching ? (
          <SearchResults
            rows={results}
            query={query}
            resultsLabel={t("resultsCount", { count: results.length })}
            noResults={t("noResults")}
            noResultsHint={t("noResultsHint")}
          />
        ) : activeProduct && activeBrand ? (
          <DocumentsView
            brandName={activeBrand.name}
            brandSlug={activeBrand.slug}
            productSlug={activeProduct.slug}
            product={activeProduct}
            typeFilter={typeFilter}
            noDocuments={t("noDocuments")}
          />
        ) : activeBrand ? (
          <ProductsView brand={activeBrand} onOpenProduct={openProduct} eyebrow={t("productsEyebrow")} blurbFallback={activeBrand.blurb} />
        ) : (
          <BrandsView brands={brands} onOpenBrand={openBrand} moreLabel={t("moreBrandsSoon")} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function BrandsView({
  brands,
  onOpenBrand,
  moreLabel,
}: {
  brands: ReturnType<typeof getDownloadBrands>;
  onOpenBrand: (slug: string) => void;
  moreLabel: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-6">
        {brands.map((brand, i) => (
          <Reveal key={brand.slug} delayMs={i * 70} className="w-full sm:w-[340px] lg:w-[360px]">
            <BrandTile
              brand={brand}
              productCount={brand.products.length}
              docCount={countBrandDocuments(brand)}
              onOpen={() => onOpenBrand(brand.slug)}
            />
          </Reveal>
        ))}
      </div>
      <p className="mt-12 text-center text-[10.5px] uppercase tracking-[0.2em] text-zinc-600">{moreLabel}</p>
    </div>
  );
}

function ProductsView({
  brand,
  onOpenProduct,
  eyebrow,
  blurbFallback,
}: {
  brand: NonNullable<ReturnType<typeof getDownloadBrand>>;
  onOpenProduct: (slug: string) => void;
  eyebrow: string;
  blurbFallback?: string;
}) {
  const logoUrl = BRAND_LOGOS[brand.slug];
  return (
    <div>
      <Reveal className="mx-auto max-w-3xl text-center">
        <BrandLogo
          name={brand.name}
          logoUrl={logoUrl}
          className="mx-auto h-12 w-[180px] sm:h-14"
          imgClassName="opacity-95"
          wordmarkClassName="text-holo text-2xl font-medium tracking-[0.14em]"
        />
        {blurbFallback ? (
          <p className="mx-auto mt-6 max-w-xl text-[13.5px] leading-relaxed text-zinc-400 sm:text-sm">{blurbFallback}</p>
        ) : null}
      </Reveal>

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-600">{eyebrow}</span>
      </div>

      <div className="mx-auto mt-6 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brand.products.map((product, i) => (
          <Reveal key={product.slug} delayMs={i * 70}>
            <ProductTile brandName={brand.name} product={product} onOpen={() => onOpenProduct(product.slug)} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function DocumentsView({
  brandName,
  brandSlug,
  productSlug,
  product,
  typeFilter,
  noDocuments,
}: {
  brandName: string;
  brandSlug: string;
  productSlug: string;
  product: NonNullable<ReturnType<typeof getDownloadProduct>>;
  typeFilter: string;
  noDocuments: string;
}) {
  const groups = groupDocuments(product.documents);
  const visible = typeFilter === "all" ? groups : groups.filter((g) => g.key === typeFilter);

  return (
    <div>
      <ProductHero brandName={brandName} product={product} docCount={product.documents.length} />
      {product.documents.length === 0 ? (
        <p className="mx-auto mt-10 max-w-md text-center text-[13px] text-zinc-500">{noDocuments}</p>
      ) : (
        <>
          <hr className="hr-premium my-10 sm:my-12" />
          <div className="mx-auto max-w-3xl space-y-9">
            {visible.map((group) => (
              <DocumentGroup
                key={group.key}
                groupKey={group.key}
                docs={group.docs}
                brandSlug={brandSlug}
                productSlug={productSlug}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SearchResults({
  rows,
  query,
  resultsLabel,
  noResults,
  noResultsHint,
}: {
  rows: DownloadSearchRow[];
  query: string;
  resultsLabel: string;
  noResults: string;
  noResultsHint: string;
}) {
  // Group flat results by product so they read as "Brand › Product".
  const groups = useMemo(() => {
    const map = new Map<string, { brandName: string; productName: string; rows: DownloadSearchRow[] }>();
    for (const r of rows) {
      const key = `${r.brandSlug}/${r.productSlug}`;
      if (!map.has(key)) map.set(key, { brandName: r.brandName, productName: r.productName, rows: [] });
      map.get(key)!.rows.push(r);
    }
    return Array.from(map.values());
  }, [rows]);

  return (
    <div className="mx-auto max-w-3xl">
      <p aria-live="polite" className="text-center text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {resultsLabel}
      </p>

      {rows.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-holo text-lg font-medium">{noResults}</p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] text-zinc-500">{noResultsHint}</p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map((g) => (
            <Reveal key={`${g.brandName}-${g.productName}`}>
              <header className="flex items-center gap-3">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300">
                  {g.brandName}
                  <span aria-hidden="true" className="mx-2 text-zinc-600">
                    ›
                  </span>
                  <span className="text-zinc-400">{g.productName}</span>
                </h2>
                <span aria-hidden="true" className="hr-premium flex-1" />
              </header>
              <div className="mt-3 overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.06] bg-white/[0.015]">
                <div className="divide-y divide-white/[0.05]">
                  {g.rows.map((r) => (
                    <DocumentRow
                      key={`${r.productSlug}-${r.doc.id}`}
                      doc={r.doc}
                      brandSlug={r.brandSlug}
                      productSlug={r.productSlug}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
      <span className="sr-only">{query}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small controls
// ---------------------------------------------------------------------------

function Sep() {
  return (
    <span aria-hidden="true" className="text-zinc-700">
      /
    </span>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-[40px] rounded-full border px-4 text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        active
          ? "border-[color:var(--color-gold)]/45 bg-[color:var(--color-gold)]/[0.08] text-[color:var(--color-gold-soft)]"
          : "border-white/12 text-zinc-400 hover:border-white/30 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function SearchField({
  value,
  onChange,
  onClear,
  placeholder,
  label,
  clearLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder: string;
  label: string;
  clearLabel: string;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-zinc-500 ltr:left-5 rtl:right-5"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-[52px] w-full rounded-full border border-white/12 bg-white/[0.03] px-12 py-3.5 text-[14px] text-white placeholder:text-zinc-500 outline-none transition-colors duration-300 focus:border-[color:var(--color-gold)]/45 focus:bg-white/[0.05]"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="absolute top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 hover:text-white ltr:right-4 rtl:left-4"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
