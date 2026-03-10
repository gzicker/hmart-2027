import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Crown, Tag, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import heroKimchi from "@/assets/hero-kimchi.jpg";
import heroPlus from "@/assets/hero-hmart-plus.jpg";
import heroDeals from "@/assets/hero-deals.jpg";
import heroKbeauty from "@/assets/hero-kbeauty.jpg";

const slides = [
  {
    id: "kimchi",
    image: heroKimchi,
    alt: "Kimchi making",
    overlay: "bg-gradient-to-r from-hmart-charcoal/80 via-hmart-charcoal/40 to-transparent",
    eyebrow: "Your Kitchen, Our Heritage",
    eyebrowColor: "text-accent",
    title: "The taste of home, delivered to yours",
    description:
      "From our stores to your table — fresh produce, premium meats, and authentic ingredients with same-day delivery, curbside pickup, or nationwide shipping.",
    cta: { label: "Start Shopping", to: "/products", icon: ArrowRight },
    secondary: { label: "Find Your Store" },
  },
  {
    id: "hmart-plus",
    image: heroPlus,
    alt: "H Mart Plus membership",
    overlay: "bg-gradient-to-r from-hmart-charcoal/90 via-hmart-charcoal/50 to-transparent",
    eyebrow: "Introducing H Mart Plus",
    eyebrowColor: "text-yellow-400",
    title: "Unlock exclusive rewards & free delivery",
    description:
      "Join H Mart Plus for $4.99/mo — get free same-day delivery, 2x Smart Rewards points, early access to weekly deals, and member-only pricing on 500+ items.",
    cta: { label: "Join H Mart Plus", to: "/products", icon: Crown },
    secondary: { label: "Learn More" },
  },
  {
    id: "weekly-deals",
    image: heroDeals,
    alt: "Weekly deals flyer",
    overlay: "bg-gradient-to-r from-hmart-charcoal/85 via-hmart-charcoal/50 to-transparent",
    eyebrow: "This Week's Flyer",
    eyebrowColor: "text-primary",
    title: "Weekly deals up to 50% off",
    description:
      "Fresh napa cabbage $0.99/lb, premium bulgogi $8.99/lb, buy-2-get-1 on all ramen — valid through Sunday. Don't miss our best prices of the season.",
    cta: { label: "Shop This Week's Deals", to: "/products", icon: Tag },
    secondary: { label: "View Full Flyer" },
  },
  {
    id: "kbeauty",
    image: heroKbeauty,
    alt: "K-Beauty products",
    overlay: "bg-gradient-to-r from-hmart-charcoal/75 via-hmart-charcoal/30 to-transparent",
    eyebrow: "K-Beauty at H Mart",
    eyebrowColor: "text-pink-400",
    title: "Glow up with Korea's best skincare",
    description:
      "Sheet masks, essences, serums & more — discover the 10-step Korean skincare routine with authentic brands straight from Seoul, now available in-store and online.",
    cta: { label: "Shop K-Beauty", to: "/products", icon: Sparkles },
    secondary: { label: "Skincare Guide" },
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const Icon = slide.cta.icon;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-8%" : "8%", opacity: 0 }),
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background image crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt={slide.alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className={`absolute inset-0 ${slide.overlay}`} />

      {/* Content */}
      <div className="hmart-container relative flex h-full flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className={`mb-2 font-body text-sm font-medium uppercase tracking-widest ${slide.eyebrowColor}`}>
              {slide.eyebrow}
            </p>
            <h1 className="font-display text-5xl font-medium leading-tight text-card md:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-4 font-body text-base leading-relaxed text-card/80">
              {slide.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={slide.cta.to}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                {slide.cta.label} <Icon className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg border border-card/30 bg-card/10 px-6 py-3 font-body text-sm font-medium text-card backdrop-blur-sm transition-colors hover:bg-card/20">
                {slide.secondary.label}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card/10 p-2 text-card backdrop-blur-sm transition-colors hover:bg-card/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card/10 p-2 text-card backdrop-blur-sm transition-colors hover:bg-card/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-card/40 hover:bg-card/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
