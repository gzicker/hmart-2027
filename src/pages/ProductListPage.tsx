import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList, Star } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import recipeTteokbokki from "@/assets/recipe-tteokbokki.jpg";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCategory;
  });

  // Sponsored items first
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="hmart-container py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{query ? `Search: "${query}"` : "All Products"}</span>
        </nav>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-28">
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${!selectedCategory ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  All Categories
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
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fulfillment</h4>
                <div className="space-y-2">
                  {["Same-Day Delivery", "Curbside Pickup", "Ship to Home"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" defaultChecked className="rounded border-border text-primary accent-primary" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" className="rounded border-border text-primary accent-primary" />
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{sortedProducts.length}</span> products
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

            {/* Sponsored Row */}
            {sortedProducts.some(p => p.isSponsored) && (
              <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Sponsored Results</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {sortedProducts.filter(p => p.isSponsored).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Tip card inserted */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.filter(p => !p.isSponsored).slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Quick Tip Card */}
              <div className="col-span-2 overflow-hidden rounded-lg bg-card">
                <Link to={`/product/gochujang-001`} className="flex h-full">
                  <img src={recipeTteokbokki} alt="Quick tip" className="h-full w-32 object-cover" />
                  <div className="flex flex-col justify-center p-4">
                    <div className="flex items-center gap-1.5 text-primary">
                      <ChefHat className="h-4 w-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">Quick Tip</span>
                    </div>
                    <h4 className="mt-1 font-display text-sm font-medium text-foreground">
                      Mix gochujang with honey for the perfect dipping sauce
                    </h4>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> 2 min · 2 ingredients
                    </p>
                  </div>
                </Link>
              </div>

              {sortedProducts.filter(p => !p.isSponsored).slice(4).map((product) => (
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
