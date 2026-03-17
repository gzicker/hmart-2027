import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList, Loader2, X } from "lucide-react";
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

  const [products, setProducts] = useState<Product[]>([]);
  const [facets, setFacets] = useState<ISFacet[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  // Search products + facets when query, category, sort, page or filters change
  useEffect(() => {
    setIsLoading(true);
    const baseFacetPath = catParam ? `category-1/${catParam}` : '';

    // Build selected facets path
    const selectedFacetPairs: { key: string; value: string }[] = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      values.forEach(val => selectedFacetPairs.push({ key, value: val }));
    });

    const facetsPath = selectedFacetPairs.length > 0
      ? selectedFacetPairs.map(f => `${f.key}/${f.value}`).join('/')
      : baseFacetPath;

    const effectiveFacets = facetsPath || baseFacetPath;

    Promise.all([
      searchProducts({ query, facets: effectiveFacets, page, count: 50, sort: sortBy }),
      getFacets({ query, facets: effectiveFacets }),
    ]).then(([searchRes, facetsRes]) => {
      setProducts(vtexProductsToProducts(searchRes.products));
      setTotalResults(searchRes.recordsFiltered);
      const visibleFacets = (facetsRes.facets || []).filter(
        f => !f.hidden && f.values && f.values.length > 0
      );
      setFacets(visibleFacets);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, [query, catParam, sortBy, page, selectedFilters]);

  const toggleFilter = (facetKey: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[facetKey] || [];
      const exists = current.includes(value);
      const updated = exists
        ? current.filter(v => v !== value)
        : [...current, value];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="hmart-container py-6">
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t("detail.home")}</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{query ? `${t("list.search")}: "${query}"` : t("list.allProducts")}</span>
        </nav>

        <div className="flex gap-8">
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-28 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4" /> {t("list.filters")}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    <X className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>

              {/* Dynamic facets from VTEX */}
              {facets.map((facet) => {
                const activeValues = facet.values.filter(v => v.quantity > 0);
                if (activeValues.length === 0) return null;

                const facetLabel = facet.name === 'Department' ? 'Categories'
                  : facet.name === 'Category' ? 'Subcategories'
                    : facet.name;

                return (
                  <div key={facet.name} className="space-y-1.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {facetLabel}
                    </h4>

                    {facet.type === 'PRICERANGE' ? (
                      <div className="space-y-0.5">
                        {activeValues.map((val) => (
                          <button
                            key={val.id || val.value}
                            onClick={() => toggleFilter(val.key, val.value)}
                            className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                              (selectedFilters[val.key] || []).includes(val.value)
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-secondary"
                            }`}
                          >
                            {val.name || `$${val.range?.from || 0} - $${val.range?.to || '∞'}`}
                            <span className="ml-1 text-xs opacity-60">({val.quantity})</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {activeValues.slice(0, 10).map((val) => (
                          <button
                            key={val.id || val.value}
                            onClick={() => toggleFilter(val.key, val.value)}
                            className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                              (selectedFilters[val.key] || []).includes(val.value)
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-secondary"
                            }`}
                          >
                            {val.name}
                            <span className="ml-1 text-xs opacity-60">({val.quantity})</span>
                          </button>
                        ))}
                        {activeValues.length > 10 && (
                          <p className="px-3 py-1 text-xs text-muted-foreground">
                            +{activeValues.length - 10} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Sort */}
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
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalResults}</span> {t("list.products")}
              </p>
              <div className="flex items-center gap-2">
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
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

      <Footer />
    </div>
  );
}
