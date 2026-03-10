import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Store, Clock, ArrowRight, Star, ChefHat } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HeroCarousel from "@/components/HeroCarousel";
import categoryVeg from "@/assets/category-vegetables.jpg";
import categoryMeat from "@/assets/category-meat.jpg";
import categoryPantry from "@/assets/category-pantry.jpg";
import categoryFrozen from "@/assets/category-frozen.jpg";
import recipeTteokbokki from "@/assets/recipe-tteokbokki.jpg";

const categoryImages = [
  { name: "Vegetables", nameKo: "채소", image: categoryVeg, link: "/products" },
  { name: "Meat & Seafood", nameKo: "육류 & 해산물", image: categoryMeat, link: "/products" },
  { name: "Pantry Staples", nameKo: "식료품", image: categoryPantry, link: "/products" },
  { name: "Frozen", nameKo: "냉동식품", image: categoryFrozen, link: "/products" },
];

export default function HomePage() {
  const { addItem } = useCart();
  const sponsoredProducts = products.filter((p) => p.isSponsored);
  const chefPicks = products.filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Fulfillment bar */}
      <section className="border-b border-border bg-card">
        <div className="hmart-container grid grid-cols-1 gap-0 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Truck, title: "Same-Day Delivery", desc: "From your local H Mart store", color: "text-primary" },
            { icon: Store, title: "Curbside Pickup", desc: "Ready in as little as 2 hours", color: "text-green-600" },
            { icon: Clock, title: "Ship Nationwide", desc: "Pantry staples to your door", color: "text-blue-600" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-center gap-3 px-4 py-4">
              <Icon className={`h-6 w-6 flex-shrink-0 ${color}`} />
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="hmart-container py-12">
        <h2 className="font-display text-2xl font-medium text-foreground">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categoryImages.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={cat.link}
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-hmart-charcoal/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-display text-lg font-medium text-card">{cat.name}</h3>
                  <p className="text-xs text-card/70">{cat.nameKo}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Retail Media Shelf - Sponsored */}
      <section className="hmart-container pb-12">
        <div className="retail-media-shelf">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-medium text-foreground">Featured Brands</h2>
              <p className="text-xs text-muted-foreground">Sponsored</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {sponsoredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Chef's Picks */}
      <section className="bg-card py-12">
        <div className="hmart-container">
          <div className="mb-6 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-medium text-foreground">Chef's Picks</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {chefPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / Recipe Section */}
      <section className="hmart-container py-12">
        <div className="overflow-hidden rounded-xl bg-card">
          <div className="grid md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto">
              <img src={recipeTteokbokki} alt="Tteokbokki Recipe" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Recipe of the Week</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-foreground">
                Spicy Tteokbokki
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                Chewy rice cakes swimming in a fiery gochujang sauce — Seoul's most beloved street food, 
                ready in 20 minutes. All ingredients available for same-day delivery from your local H Mart.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 20 min</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> 4.9</span>
                <span>3 ingredients</span>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const gochujang = products.find(p => p.id === "gochujang-001");
                    const tteok = products.find(p => p.id === "tteok-001");
                    if (gochujang) addItem(gochujang);
                    if (tteok) addItem(tteok);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                >
                  Add All Ingredients
                </button>
                <Link to={`/product/gochujang-001`} className="inline-flex items-center gap-1 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  View Recipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter (subtle footer placement) */}
      <section className="border-t border-border bg-secondary/50 py-10">
        <div className="hmart-container text-center">
          <h3 className="font-display text-xl font-medium text-foreground">Get recipes with your purchases</h3>
          <p className="mt-1 text-sm text-muted-foreground">Weekly recipes and exclusive deals, straight to your inbox.</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
