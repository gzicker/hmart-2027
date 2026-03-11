import { motion } from "framer-motion";
import { Gift, Heart, Plane, Package, Clock, Star, ArrowRight, Beef, Apple, Fish, Cake, Pill } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GIFT_CATEGORIES = [
  { icon: Beef, labelKey: "gifts.catBeef", descKey: "gifts.catBeefDesc", color: "bg-red-50 text-red-600" },
  { icon: Apple, labelKey: "gifts.catFruit", descKey: "gifts.catFruitDesc", color: "bg-green-50 text-green-600" },
  { icon: Fish, labelKey: "gifts.catSeafood", descKey: "gifts.catSeafoodDesc", color: "bg-blue-50 text-blue-600" },
  { icon: Pill, labelKey: "gifts.catHealth", descKey: "gifts.catHealthDesc", color: "bg-purple-50 text-purple-600" },
  { icon: Cake, labelKey: "gifts.catSweets", descKey: "gifts.catSweetsDesc", color: "bg-amber-50 text-amber-600" },
  { icon: Package, labelKey: "gifts.catReady", descKey: "gifts.catReadyDesc", color: "bg-pink-50 text-pink-600" },
];

const FEATURED_SETS = [
  { name: "gifts.set1Name", desc: "gifts.set1Desc", price: "$89.99", badge: "Best Seller", rating: 4.9, reviews: 2340 },
  { name: "gifts.set2Name", desc: "gifts.set2Desc", price: "$129.99", badge: "Premium", rating: 4.8, reviews: 1890 },
  { name: "gifts.set3Name", desc: "gifts.set3Desc", price: "$64.99", badge: "New", rating: 4.7, reviews: 560 },
  { name: "gifts.set4Name", desc: "gifts.set4Desc", price: "$199.99", badge: "Luxury", rating: 5.0, reviews: 890 },
];

const STEPS = [
  { icon: Gift, labelKey: "gifts.step1", descKey: "gifts.step1Desc" },
  { icon: Clock, labelKey: "gifts.step2", descKey: "gifts.step2Desc" },
  { icon: Plane, labelKey: "gifts.step3", descKey: "gifts.step3Desc" },
  { icon: Heart, labelKey: "gifts.step4", descKey: "gifts.step4Desc" },
];

export default function GiftsHomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-pink-50 to-rose-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-pink-300/30 blur-3xl" />
        </div>
        <div className="hmart-container relative py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Heart className="h-4 w-4" /> 고국통신
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              {t("gifts.heroTitle")}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              {t("gifts.heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105">
                {t("gifts.shopNow")}
              </button>
              <button className="rounded-xl border-2 border-primary/20 bg-card px-8 py-3.5 font-semibold text-primary transition-colors hover:bg-primary/5">
                {t("gifts.howItWorks")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("gifts.categoriesTitle")}</h2>
            <p className="text-muted-foreground">{t("gifts.categoriesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {GIFT_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color}`}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t(cat.labelKey)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t(cat.descKey)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gift Sets */}
      <section className="bg-secondary/50 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("gifts.featuredTitle")}</h2>
            <p className="text-muted-foreground">{t("gifts.featuredSubtitle")}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_SETS.map((set, i) => (
              <motion.div
                key={set.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center">
                  <Gift className="h-16 w-16 text-primary/30" />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                    {set.badge}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="mb-1 font-display text-base font-bold text-foreground">{t(set.name)}</h3>
                  <p className="mb-3 text-xs text-muted-foreground leading-relaxed">{t(set.desc)}</p>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="text-xs font-semibold">{set.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({set.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{set.price}</span>
                    <button className="rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                      {t("gifts.addToCart")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("gifts.howItWorksTitle")}</h2>
            <p className="text-muted-foreground">{t("gifts.howItWorksSubtitle")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.labelKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-display text-sm font-bold text-foreground">{t(step.labelKey)}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-8 hidden h-5 w-5 text-muted-foreground/40 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-12">
        <div className="hmart-container text-center">
          <h2 className="mb-3 font-display text-2xl font-bold text-primary-foreground">{t("gifts.ctaTitle")}</h2>
          <p className="mb-6 text-primary-foreground/80">{t("gifts.ctaSubtitle")}</p>
          <button className="rounded-xl bg-primary-foreground px-8 py-3.5 font-semibold text-primary shadow-lg transition-transform hover:scale-105">
            {t("gifts.ctaButton")}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
