import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck, Store, ArrowRight, Star, ChefHat, Play, Clock, Package } from "lucide-react";
import { Product } from "@/data/products";
import { searchProducts } from "@/api/searchApi";
import { vtexProductsToProducts } from "@/api/vtexAdapter";
import bannerNongshim from "@/assets/banner-nongshim.jpg";
import bannerCj from "@/assets/banner-cj.jpg";
import { useCart } from "@/contexts/CartContext";
import { useProductsSellerSimulations } from "@/hooks/useSellerSimulation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTab } from "@/contexts/TabContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GiftsHomePage from "./GiftsHomePage";
import B2BHomePage from "./B2BHomePage";

import HeroCarousel from "@/components/HeroCarousel";
import categoryVeg from "@/assets/category-vegetables.jpg";
import categoryMeat from "@/assets/category-meat.jpg";
import categoryPantry from "@/assets/category-pantry.jpg";
import categoryKbeauty from "@/assets/category-kbeauty.jpg";
import recipeTteokbokki from "@/assets/recipe-tteokbokki.jpg";
import { useEffect } from "react";

const TIKTOK_VIDEOS = [
  { id: "7364167688190446890", username: "katchaomeow", caption: "Must-have items at H Mart 🛒 #hmart #hmartmusthaves", views: "21.9K" },
  { id: "7576335970484686111", username: "hmart_pnw", caption: "Redmond H Mart just went crazy 🎉 Super fresh Tuna!", views: "1.1K" },
  { id: "7577554949295443231", username: "ally_wong", caption: "Essential grocery haul from H Mart for new home 🏠", views: "5.2K" },
  { id: "7512658858544925998", username: "seattlefoodieadventure", caption: "Best Korean food finds at H Mart! 🍜", views: "12K" },
  { id: "7364167688190446890", username: "katchaomeow", caption: "Korean grocery store tour #hmart 🇰🇷", views: "21.9K" },
];

export default function HomePage() {
  const { addItem, selectedSellerId } = useCart();
  const { t } = useLanguage();
  const { activeTab } = useTab();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const { data: searchRes, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => searchProducts({ query: '', count: 60 }),
    staleTime: 5 * 60 * 1000,
  });

  const vtexProducts = useMemo(
    () => searchRes ? vtexProductsToProducts(searchRes.products) : [],
    [searchRes]
  );

  const productSimulations = useProductsSellerSimulations(vtexProducts, selectedSellerId);

  const chefPicks = useMemo(() => {
    const available = vtexProducts.filter((product) => productSimulations[product.id]?.available);
    return (available.length >= 4 ? available : vtexProducts).slice(0, 4);
  }, [vtexProducts, productSimulations]);

  if (activeTab === "gifts") return <GiftsHomePage />;
  if (activeTab === "b2b") return <B2BHomePage />;

  const handleAddToCart = (p: Product) => {
    const skuId = p._vtex?.skuId || p.id;
    const sellerId = p._vtex?.sellerId || selectedSellerId;
    addItem(skuId, 1, sellerId);
  };

  // Featured products — labeled honestly, not "Sponsored" (no ad integration exists)
  const featuredProducts = vtexProducts.slice(0, 3);

  const categoryImages = [
    { name: t("cat.vegetables"), nameKo: "채소", image: categoryVeg, link: "/products" },
    { name: t("cat.meat"), nameKo: "육류 & 해산물", image: categoryMeat, link: "/products" },
    { name: t("cat.pantry"), nameKo: "식료품", image: categoryPantry, link: "/products" },
    { name: t("cat.kbeauty"), nameKo: "뷰티", image: categoryKbeauty, link: "/products" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroCarousel />

      <section className="border-b border-border bg-card">
        <div className="hmart-container grid grid-cols-1 gap-0 divide-y divide-border sm:grid-cols-2 md:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            { icon: Truck, titleKey: "fulfillment.sameDay", descKey: "fulfillment.sameDayDesc", color: "text-primary" },
            { icon: Store, titleKey: "fulfillment.curbside", descKey: "fulfillment.curbsideDesc", color: "text-green-600" },
            { icon: Package, titleKey: "fulfillment.ship", descKey: "fulfillment.shipDesc", color: "text-blue-600" },
            { icon: ArrowRight, titleKey: "fulfillment.wholesale", descKey: "fulfillment.wholesaleDesc", color: "text-orange-600" },
          ].map(({ icon: Icon, titleKey, descKey, color }) => (
            <div key={titleKey} className="flex items-center gap-3 px-4 py-4">
              <Icon className={`h-6 w-6 flex-shrink-0 ${color}`} />
              <div>
                <p className="text-sm font-semibold text-foreground">{t(titleKey)}</p>
                <p className="text-xs text-muted-foreground">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hmart-container py-12">
        <h2 className="font-display text-2xl font-medium text-foreground">{t("cat.shopBy")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categoryImages.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={cat.link} className="group relative block overflow-hidden rounded-xl">
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

      <section className="hmart-container pb-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-foreground">{t("brands.title")}</h2>
            <p className="text-xs text-muted-foreground">{t("brands.sponsored")}</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            {t("brands.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { image: bannerNongshim, brand: "Nongshim", taglineKey: "brands.nongshim.tagline", ctaKey: "brands.nongshim.cta" },
            { image: bannerCj, brand: "CJ Foods", taglineKey: "brands.cj.tagline", ctaKey: "brands.cj.cta" },
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
                {t("brands.sponsored")}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-lg font-bold text-background">{banner.brand}</p>
                <p className="text-sm text-background/80">{t(banner.taglineKey)}</p>
                <span className="mt-2 inline-block rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform group-hover:scale-105">
                  {t(banner.ctaKey)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-card py-12">
        <div className="hmart-container">
          <div className="mb-6 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-medium text-foreground">{t("chef.title")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {chefPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="trending-tiktok" className="hmart-container py-12 scroll-mt-32">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-medium text-foreground">{t("tiktok.title")}</h2>
          </div>
          <a href="https://www.tiktok.com/tag/hmart" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
            {t("tiktok.swipe")} →
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {TIKTOK_VIDEOS.map((video, i) => (
            <motion.div
              key={`${video.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex-shrink-0"
              style={{ width: 325 }}
            >
              <iframe
                src={`https://www.tiktok.com/embed/v2/${video.id}`}
                style={{ width: 325, height: 578, border: 'none', borderRadius: 12, overflow: 'hidden' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={video.caption}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="hmart-container py-12">
        <div className="overflow-hidden rounded-xl bg-card">
          <div className="grid md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto">
              <img src={recipeTteokbokki} alt="Tteokbokki Recipe" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">{t("recipe.ofTheWeek")}</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-foreground">
                {t("recipe.title")}
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                {t("recipe.desc")}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t("recipe.time")}</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> 4.9</span>
                <span>{t("recipe.ingredients")}</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/products?q=tteokbokki"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                >
                  {t("recipe.addAll")}
                </Link>
                <Link to="/products?q=gochujang" className="inline-flex items-center gap-1 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  {t("recipe.viewRecipe")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/50 py-10">
        <div className="hmart-container text-center">
          <h3 className="font-display text-xl font-medium text-foreground">{t("newsletter.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("newsletter.desc")}</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95">
              {t("newsletter.subscribe")}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
