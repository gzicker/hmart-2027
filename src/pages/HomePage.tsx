import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Store, Clock, ArrowRight, Star, ChefHat, Play } from "lucide-react";
import { products } from "@/data/products";
import bannerNongshim from "@/assets/banner-nongshim.jpg";
import bannerCj from "@/assets/banner-cj.jpg";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HeroCarousel from "@/components/HeroCarousel";
import categoryVeg from "@/assets/category-vegetables.jpg";
import categoryMeat from "@/assets/category-meat.jpg";
import categoryPantry from "@/assets/category-pantry.jpg";
import categoryKbeauty from "@/assets/category-kbeauty.jpg";
import recipeTteokbokki from "@/assets/recipe-tteokbokki.jpg";
import creator1 from "@/assets/creator-1.jpg";
import creator2 from "@/assets/creator-2.jpg";
import creator3 from "@/assets/creator-3.jpg";
import creator4 from "@/assets/creator-4.jpg";
import creator5 from "@/assets/creator-5.jpg";

const CREATORS = [
  { image: creator1, name: "@jieun.eats", handle: "Jieun", caption: "Best ramen hack from H Mart 🍜", views: "1.2M", product: "Shin Ramyun" },
  { image: creator2, name: "@david.mukbang", handle: "David", caption: "Korean fried chicken taste test!", views: "890K", product: "Korean Fried Chicken" },
  { image: creator3, name: "@glow.with.mina", handle: "Mina", caption: "K-Beauty haul under $30 ✨", views: "2.1M", product: "K-Beauty Essentials" },
  { image: creator4, name: "@chef.park", handle: "Chef Park", caption: "Kimchi jjigae in 15 min 🔥", views: "650K", product: "Kimchi Jjigae Kit" },
  { image: creator5, name: "@snackqueen.amy", handle: "Amy", caption: "H Mart snack haul you NEED", views: "1.8M", product: "Korean Snacks" },
];

const categoryImages = [
  { name: "Vegetables", nameKo: "채소", image: categoryVeg, link: "/products" },
  { name: "Meat & Seafood", nameKo: "육류 & 해산물", image: categoryMeat, link: "/products" },
  { name: "Pantry Staples", nameKo: "식료품", image: categoryPantry, link: "/products" },
  { name: "K-Beauty", nameKo: "뷰티", image: categoryKbeauty, link: "/products" },
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
        <div className="hmart-container grid grid-cols-1 gap-0 divide-y divide-border sm:grid-cols-2 md:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            { icon: Truck, title: "Same-Day Delivery", desc: "From your local H Mart store", color: "text-primary" },
            { icon: Store, title: "Curbside Pickup", desc: "Ready in as little as 2 hours", color: "text-green-600" },
            { icon: Clock, title: "Ship Nationwide", desc: "Pantry staples to your door", color: "text-blue-600" },
            { icon: ArrowRight, title: "Wholesale Ordering", desc: "Shop through our B2B site", color: "text-orange-600" },
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

      {/* Retail Media Shelf - Sponsored Brand Banners */}
      <section className="hmart-container pb-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-foreground">Featured Brands</h2>
            <p className="text-xs text-muted-foreground">Sponsored</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { image: bannerNongshim, brand: "Nongshim", tagline: "Korea's #1 Ramen — Now with free shipping", cta: "Shop Nongshim" },
            { image: bannerCj, brand: "CJ Foods", tagline: "Authentic Korean flavors for every kitchen", cta: "Shop CJ Foods" },
          ].map((banner) => (
            <Link
              key={banner.brand}
              to="/products"
              className="group relative block overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[16/8] overflow-hidden">
                <img src={banner.image} alt={banner.brand} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <span className="absolute left-3 top-3 rounded bg-foreground/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background backdrop-blur-sm">
                Sponsored
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-lg font-bold text-background">{banner.brand}</p>
                <p className="text-sm text-background/80">{banner.tagline}</p>
                <span className="mt-2 inline-block rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform group-hover:scale-105">
                  {banner.cta}
                </span>
              </div>
            </Link>
          ))}
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

      {/* Creator Reels / TikTok Shelf */}
      <section id="trending-tiktok" className="hmart-container py-12 scroll-mt-32">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-medium text-foreground">Trending on TikTok</h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground">Swipe →</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {CREATORS.map((creator, i) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group relative flex-shrink-0 cursor-pointer"
              style={{ width: 200 }}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[9/16]">
                <img
                  src={creator.image}
                  alt={creator.caption}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                    <Play className="h-5 w-5 fill-foreground text-foreground" />
                  </div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                {/* Views badge */}
                <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-foreground/60 px-2 py-0.5 text-[10px] font-bold text-background backdrop-blur-sm">
                  <Play className="h-2.5 w-2.5 fill-background" /> {creator.views}
                </span>
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-bold text-background">{creator.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-background/80">{creator.caption}</p>
                  <span className="mt-2 inline-block rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Shop {creator.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
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
