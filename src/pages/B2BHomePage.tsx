import { motion } from "framer-motion";
import { Building2, Truck, RefreshCw, ArrowRight, Package, Coffee, Factory, Store, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroB2B from "@/assets/hero-b2b.jpg";

const SEGMENTS = [
  { icon: Store, label: "Asian Grocery Stores", desc: "Bulk staples, fresh produce & branded products at wholesale prices. Weekly subscription delivery available.", color: "from-gray-600 to-gray-800" },
  { icon: Coffee, label: "Restaurants & Cafés", desc: "Authentic ingredients in commercial quantities. From gochujang to sushi-grade fish.", color: "from-gray-500 to-gray-700" },
  { icon: Building2, label: "Office & Corporate", desc: "Break room snacks, beverages, office supplies & pantry essentials for your team.", color: "from-gray-400 to-gray-600" },
  { icon: Factory, label: "Equipment & Machinery", desc: "Commercial kitchen equipment, industrial machinery & tools imported from Asia.", color: "from-gray-700 to-gray-900" },
];

const FEATURES = [
  { icon: Truck, label: "Scheduled Delivery", desc: "Set up weekly or bi-weekly automatic deliveries. Never run out of stock." },
  { icon: RefreshCw, label: "Subscription Plans", desc: "Lock in prices and get recurring shipments with flexible subscription tiers." },
  { icon: TrendingUp, label: "Volume Pricing", desc: "The more you order, the more you save. Up to 40% off retail prices." },
  { icon: Shield, label: "Dedicated Account Manager", desc: "Personal support for order management, custom sourcing & business needs." },
];

const TIERS = [
  { name: "Starter", price: "$299/mo", features: ["Up to $5,000 in monthly orders", "Weekly delivery schedule", "15% off retail prices"], highlight: false },
  { name: "Business", price: "$599/mo", features: ["Up to $15,000 in monthly orders", "Flexible delivery (2-3x/week)", "25% off retail prices", "Dedicated account manager"], highlight: true },
  { name: "Enterprise", price: "Custom", features: ["Unlimited order volume", "Daily delivery available", "Up to 40% off retail prices", "Custom sourcing & imports"], highlight: false },
];

const POPULAR_PRODUCTS = [
  { name: "Calrose Rice", unit: "50 lb", price: "$89.99" },
  { name: "Shin Ramyun", unit: "48 pk", price: "$42.99" },
  { name: "Sesame Oil", unit: "24 bottles", price: "$67.99" },
  { name: "Gochujang Paste", unit: "20 kg", price: "$124.99" },
  { name: "Nori Seaweed", unit: "100 sheets", price: "$34.99" },
  { name: "Soy Sauce", unit: "10 gal", price: "$56.99" },
];

export default function B2BHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-gray-400/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-gray-500/20 blur-3xl" />
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
              Wholesale pricing for your business
            </h1>
            <p className="mb-8 text-lg text-white/70 leading-relaxed">
              From bulk Asian grocery supply to office essentials and imported industrial equipment — H Mart B2B is your one-stop wholesale partner.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-white px-8 py-3.5 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105">
                Get Started
              </button>
              <button className="rounded-xl border-2 border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                Contact Sales
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-white">5,000+</p>
                <p className="text-sm text-white/50">Active businesses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">48h</p>
                <p className="text-sm text-white/50">Delivery nationwide</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">15-40%</p>
                <p className="text-sm text-white/50">Savings vs. retail</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Segments */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Built for Every Business</h2>
            <p className="text-muted-foreground">Whether you run an Asian grocery, a restaurant, or a corporate office</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((seg, i) => (
              <motion.button
                key={seg.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${seg.color}`}>
                  <seg.icon className="h-12 w-12 text-white/80" />
                </div>
                <div className="p-5">
                  <h3 className="mb-1 font-display text-base font-bold text-foreground">{seg.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{seg.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-600">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Why H Mart B2B?</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <feat.icon className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="mb-2 text-sm font-bold text-foreground">{feat.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Subscription Plans</h2>
            <p className="text-muted-foreground">Choose a plan that fits your business needs</p>
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
                    ? "border-gray-900 bg-card ring-2 ring-gray-900/20"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-gray-900 px-3 py-1 text-[10px] font-bold uppercase text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="mb-1 font-display text-lg font-bold text-foreground">{tier.name}</h3>
                <p className="mb-5 text-2xl font-bold text-gray-900">{tier.price}</p>
                <ul className="mb-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bulk Products */}
      <section className="bg-gray-50 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Popular Bulk Products</h2>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Package className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{prod.name}</p>
                    <p className="text-xs text-muted-foreground">{prod.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">{prod.price}</p>
                  <button className="mt-1 text-[10px] font-semibold text-gray-500 hover:text-gray-900">
                    + Add to Quote
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-12">
        <div className="hmart-container flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h2 className="mb-2 font-display text-2xl font-bold text-white">Ready to grow your business with H Mart?</h2>
            <p className="text-white/60">Apply for a wholesale account today and start saving.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl bg-white px-8 py-3.5 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105">
              Apply Now
            </button>
            <button className="rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
