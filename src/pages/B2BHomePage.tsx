import { motion } from "framer-motion";
import { Building2, ShoppingCart, Truck, RefreshCw, ArrowRight, Package, Coffee, Factory, Store, Users, TrendingUp, Shield, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SEGMENTS = [
  { icon: Store, labelKey: "b2b.segGrocery", descKey: "b2b.segGroceryDesc", color: "from-red-500 to-orange-500" },
  { icon: Coffee, labelKey: "b2b.segRestaurant", descKey: "b2b.segRestaurantDesc", color: "from-amber-500 to-yellow-500" },
  { icon: Building2, labelKey: "b2b.segOffice", descKey: "b2b.segOfficeDesc", color: "from-blue-500 to-cyan-500" },
  { icon: Factory, labelKey: "b2b.segIndustrial", descKey: "b2b.segIndustrialDesc", color: "from-slate-600 to-slate-800" },
];

const FEATURES = [
  { icon: Truck, labelKey: "b2b.featDelivery", descKey: "b2b.featDeliveryDesc" },
  { icon: RefreshCw, labelKey: "b2b.featSubscription", descKey: "b2b.featSubscriptionDesc" },
  { icon: TrendingUp, labelKey: "b2b.featPricing", descKey: "b2b.featPricingDesc" },
  { icon: Shield, labelKey: "b2b.featDedicated", descKey: "b2b.featDedicatedDesc" },
];

const TIERS = [
  { name: "b2b.tierStarter", price: "b2b.tierStarterPrice", features: ["b2b.tierStarterF1", "b2b.tierStarterF2", "b2b.tierStarterF3"], highlight: false },
  { name: "b2b.tierBusiness", price: "b2b.tierBusinessPrice", features: ["b2b.tierBusinessF1", "b2b.tierBusinessF2", "b2b.tierBusinessF3", "b2b.tierBusinessF4"], highlight: true },
  { name: "b2b.tierEnterprise", price: "b2b.tierEnterprisePrice", features: ["b2b.tierEnterpriseF1", "b2b.tierEnterpriseF2", "b2b.tierEnterpriseF3", "b2b.tierEnterpriseF4"], highlight: false },
];

const POPULAR_PRODUCTS = [
  { name: "b2b.prod1", unit: "50 lb", price: "$89.99" },
  { name: "b2b.prod2", unit: "48 pk", price: "$42.99" },
  { name: "b2b.prod3", unit: "24 bottles", price: "$67.99" },
  { name: "b2b.prod4", unit: "20 kg", price: "$124.99" },
  { name: "b2b.prod5", unit: "100 sheets", price: "$34.99" },
  { name: "b2b.prod6", unit: "10 gal", price: "$56.99" },
];

export default function B2BHomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        <div className="hmart-container relative py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur-sm">
              <Building2 className="h-4 w-4" /> H Mart B2B
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-white lg:text-5xl">
              {t("b2b.heroTitle")}
            </h1>
            <p className="mb-8 text-lg text-white/70 leading-relaxed">
              {t("b2b.heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105">
                {t("b2b.getStarted")}
              </button>
              <button className="rounded-xl border-2 border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                {t("b2b.contactSales")}
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-white">5,000+</p>
                <p className="text-sm text-white/50">{t("b2b.statBusinesses")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">48h</p>
                <p className="text-sm text-white/50">{t("b2b.statDelivery")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">15-40%</p>
                <p className="text-sm text-white/50">{t("b2b.statSavings")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Segments */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("b2b.segmentsTitle")}</h2>
            <p className="text-muted-foreground">{t("b2b.segmentsSubtitle")}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((seg, i) => (
              <motion.button
                key={seg.labelKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${seg.color}`}>
                  <seg.icon className="h-12 w-12 text-white/80" />
                </div>
                <div className="p-5">
                  <h3 className="mb-1 font-display text-base font-bold text-foreground">{t(seg.labelKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(seg.descKey)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    {t("b2b.learnMore")} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/50 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("b2b.whyTitle")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-bold text-foreground">{t(feat.labelKey)}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(feat.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("b2b.tiersTitle")}</h2>
            <p className="text-muted-foreground">{t("b2b.tiersSubtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm ${
                  tier.highlight
                    ? "border-primary bg-card ring-2 ring-primary/20"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                    {t("b2b.popular")}
                  </span>
                )}
                <h3 className="mb-1 font-display text-lg font-bold text-foreground">{t(tier.name)}</h3>
                <p className="mb-5 text-2xl font-bold text-primary">{t(tier.price)}</p>
                <ul className="mb-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {t(f)}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("b2b.getStarted")}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bulk Products */}
      <section className="bg-secondary/50 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("b2b.popularTitle")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_PRODUCTS.map((prod, i) => (
              <motion.div
                key={prod.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t(prod.name)}</p>
                    <p className="text-xs text-muted-foreground">{prod.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-primary">{prod.price}</p>
                  <button className="mt-1 text-[10px] font-semibold text-primary/70 hover:text-primary">
                    + {t("b2b.addToQuote")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-12">
        <div className="hmart-container flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h2 className="mb-2 font-display text-2xl font-bold text-white">{t("b2b.ctaTitle")}</h2>
            <p className="text-white/60">{t("b2b.ctaSubtitle")}</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105">
              {t("b2b.applyNow")}
            </button>
            <button className="rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
              {t("b2b.contactSales")}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
