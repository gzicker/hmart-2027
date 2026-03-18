import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList, Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { searchProducts, getFacets, type ISFacet, type SortOption } from "@/api/searchApi";
import { vtexProductsToProducts } from "@/api/vtexAdapter";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const catParam = searchParams.get("cat");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("");
  const { t } = useLanguage();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fix: compose facet path instead of replacing — category + filters combined
  const baseFacetPath = catParam ? `category-1/${catParam}` : '';
  const selectedFacetPairs: { key: string; value: string }[] = [];
  Object.entries(selectedFilters).forEach(([key, values]) => {
    values.forEach(val => selectedFacetPairs.push({ key, value: val }));
  });
  const facetsPath = [
    baseFacetPath,
    ...selectedFacetPairs.map(f => `${f.key}/${f.value}`),
  ].filter(Boolean).join('/');

  const { data: searchData, isLoading } = useQuery({
    queryKey: ['products', query, facetsPath, page, sortBy],
    queryFn: () => searchProducts({ query, facets: facetsPath, page, count: 50, sort: sortBy }),
    staleTime: 2 * 60 * 1000,
  });

  const { data: facetsData } = useQuery({
    queryKey: ['facets', query, facetsPath],
    queryFn: () => getFacets({ query, facets: facetsPath }),
    staleTime: 2 * 60 * 1000,
  });

  const products = searchData ? vtexProductsToProducts(searchData.products) : [];
  const totalResults = searchData?.recordsFiltered ?? 0;
  const facets = (facetsData?.facets || []).filter(
    (f: ISFacet) => !f.hidden && f.values && f.values.length > 0
  );

  const toggleFilter = (facetKey: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[facetKey] || [];
      const exists = current.includes(value);
      const updated = exists ? current.filter(v => v !== value) : [...current, value];
      if (updated.length === 0) {
        const { [facetKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [facetKey]: updated };
    });
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectedCategory(null);
    setPage(1);
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  const renderFacetList = () => (
    <>
      {facets.map((facet) => {
        const activeValues = facet.values.filter(v => v.quantity > 0);
        if (activeValues.length === 0) return null;
        const facetLabel = facet.name === 'Department' ? 'Categories' : facet.name === 'Category' ? 'Subcategories' : facet.name;
        return (
          <div key={facet.name} className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{facetLabel}</h4>
            <div className="space-y-0.5">
              {activeValues.slice(0, 15).map((val) => (
                <button
                  key={val.id || val.value}
                  onClick={() => toggleFilter(val.key, val.value)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    (selectedFilters[val.key] || []).includes(val.value)
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {facet.type === 'PRICERANGE'
                    ? (val.name || `$${val.range?.from || 0} - $${val.range?.to || '∞'}`)
                    : val.name}
                  <span className="ml-1 text-xs opacity-60">({val.quantity})</span>
                </button>
              ))}
              {activeValues.length > 15 && (
                <p className="px-3 py-1 text-xs text-muted-foreground">+{activeValues.length - 15} more</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="hmart-container py-4 sm:py-6">
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t("detail.home")}</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{query ? `${t("list.search")}: "${query}"` : t("list.allProducts")}</span>
        </nav>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4" /> {t("list.filters")}
                </h3>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
                    <X className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>
              {renderFacetList()}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort</h4>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="orders_desc">Best Sellers</option>
                  <option value="name_asc">Name: A-Z</option>
                  <option value="release_desc">Newest</option>
                  <option value="discount_desc">Biggest Discount</option>
                </select>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalResults}</span> {t("list.products")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground lg:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                  {hasActiveFilters && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {Object.keys(selectedFilters).length}
                    </span>
                  )}
                </button>
                <button onClick={() => setViewMode("grid")} className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`rounded-md p-1.5 ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalResults > 50 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: Math.min(Math.ceil(totalResults / 50), 5) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-foreground/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-[51] w-[85%] max-w-sm overflow-y-auto bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-display text-base font-semibold text-foreground">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5">
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="space-y-5 p-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort</h4>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                >
                  <option value="">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="orders_desc">Best Sellers</option>
                  <option value="name_asc">Name: A-Z</option>
                </select>
              </div>
              {renderFacetList()}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Show {totalResults} results
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
