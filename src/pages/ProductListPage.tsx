import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList, Star } from "lucide-react";
import { products, categories } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { t } = useLanguage();

  const filteredProducts = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    return 0;
  });

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
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${!selectedCategory ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {t("list.allCategories")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedCategory === cat.name ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    {cat.name} <span className="text-xs text-muted-foreground">{cat.nameKo}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("list.fulfillment")}</h4>
                <div className="space-y-2">
                  {[t("fulfillment.sameDay"), t("fulfillment.curbside"), t("footer.shipHome")].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" defaultChecked className="rounded border-border text-primary accent-primary" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("list.rating")}</h4>
                <div className="space-y-2">
                  {[4, 3, 2].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" className="rounded border-border text-primary accent-primary" />
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">{t("list.andUp")}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{sortedProducts.length}</span> {t("list.products")}
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

            {sortedProducts.some(p => p.isSponsored) && (
              <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{t("list.sponsoredResults")}</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {sortedProducts.filter(p => p.isSponsored).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.filter(p => !p.isSponsored).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
