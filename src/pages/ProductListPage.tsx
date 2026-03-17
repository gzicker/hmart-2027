import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { searchProducts, type SortOption } from "@/api/searchApi";
import { vtexProductsToProducts } from "@/api/vtexAdapter";
import { getCategoryTree, type VtexCategory } from "@/api/catalogApi";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("");
  const { t } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<VtexCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  // Load categories once
  useEffect(() => {
    getCategoryTree(2).then(setCategories).catch(console.error);
  }, []);

  // Search products when query, category, sort or page changes
  useEffect(() => {
    setIsLoading(true);
    const facets = selectedCategory ? `category-1/${selectedCategory}` : '';
    searchProducts({ query, facets, page, count: 24, sort: sortBy })
      .then((res) => {
        setProducts(vtexProductsToProducts(res.products));
        setTotalResults(res.recordsFiltered);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [query, selectedCategory, sortBy, page]);

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
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-28">
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4" /> {t("list.filters")}
              </h3>

              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(null); setPage(1); }}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${!selectedCategory ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {t("list.allCategories")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(String(cat.id)); setPage(1); }}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedCategory === String(cat.id) ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort</h4>
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalResults > 24 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: Math.min(Math.ceil(totalResults / 24), 5) }, (_, i) => (
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
