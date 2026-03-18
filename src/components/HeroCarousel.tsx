import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Crown, Tag, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import heroKimchi from "@/assets/hero-kimchi.jpg";
import heroPlus from "@/assets/hero-hmart-plus.jpg";
import heroDeals from "@/assets/hero-deals.jpg";
import heroKbeauty from "@/assets/hero-kbeauty.jpg";

const slideConfigs = [
  {
    id: "kimchi",
    image: heroKimchi,
    alt: "Kimchi making",
    overlay: "bg-gradient-to-r from-hmart-charcoal/80 via-hmart-charcoal/40 to-transparent",
    eyebrowKey: "hero1.eyebrow",
    eyebrowColor: "text-accent",
    titleKey: "hero1.title",
    descKey: "hero1.desc",
    ctaLabelKey: "hero1.cta",
    ctaTo: "/products?sort=orders_desc",
    secondaryKey: "hero1.secondary",
  },
  {
    id: "hmart-plus",
    image: heroPlus,
    alt: "H Mart Plus membership",
    overlay: "bg-gradient-to-r from-hmart-charcoal/90 via-hmart-charcoal/50 to-transparent",
    eyebrowKey: "hero2.eyebrow",
    eyebrowColor: "text-yellow-400",
    titleKey: "hero2.title",
    descKey: "hero2.desc",
    ctaLabelKey: "hero2.cta",
    ctaTo: "/products?sort=release_desc",
    ctaIcon: Crown,
    secondaryKey: "hero2.secondary",
  },
  {
    id: "weekly-deals",
    image: heroDeals,
    alt: "Weekly deals flyer",
    overlay: "bg-gradient-to-r from-hmart-charcoal/85 via-hmart-charcoal/50 to-transparent",
    eyebrowKey: "hero3.eyebrow",
    eyebrowColor: "text-primary",
    titleKey: "hero3.title",
    descKey: "hero3.desc",
    ctaLabelKey: "hero3.cta",
    ctaTo: "/products",
    ctaIcon: Tag,
    secondaryKey: "hero3.secondary",
  },
  {
    id: "kbeauty",
    image: heroKbeauty,
    alt: "K-Beauty products",
    overlay: "bg-gradient-to-r from-hmart-charcoal/75 via-hmart-charcoal/30 to-transparent",
    eyebrowKey: "hero4.eyebrow",
    eyebrowColor: "text-pink-400",
    titleKey: "hero4.title",
    descKey: "hero4.desc",
    ctaLabelKey: "hero4.cta",
    ctaTo: "/products",
    ctaIcon: Sparkles,
    secondaryKey: "hero4.secondary",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { t } = useLanguage();

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slideConfigs.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slideConfigs.length) % slideConfigs.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slideConfigs[current];
  const Icon = slide.ctaIcon;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-8%" : "8%", opacity: 0 }),
  };

  return (
    <section className="relative h-[50vh] min-h-[320px] sm:h-[60vh] sm:min-h-[400px] md:h-[70vh] md:min-h-[500px] overflow-hidden">
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

      {/* Overlay — stronger on mobile for text legibility */}
      <div className={`absolute inset-0 ${slide.overlay}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-hmart-charcoal/60 via-transparent to-transparent sm:from-hmart-charcoal/30" />

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
            <p className={`mb-1 sm:mb-2 font-body text-[10px] sm:text-xs font-medium uppercase tracking-widest ${slide.eyebrowColor} [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]`}>
              {t(slide.eyebrowKey)}
            </p>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-medium leading-tight text-card [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
              {t(slide.titleKey)}
            </h1>
            <p className="mt-2 sm:mt-3 font-body text-xs sm:text-sm md:text-base leading-relaxed text-card/90 max-w-md [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              {t(slide.descKey)}
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                to={slide.ctaTo}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 sm:px-6 py-2.5 sm:py-3 font-body text-xs sm:text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                {t(slide.ctaLabelKey)} <Icon className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-card/30 bg-card/10 px-4 sm:px-6 py-2.5 sm:py-3 font-body text-xs sm:text-sm font-medium text-card backdrop-blur-sm transition-colors hover:bg-card/20">
                {t(slide.secondaryKey)}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card/10 p-2 text-card backdrop-blur-sm transition-colors hover:bg-card/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card/10 p-2 text-card backdrop-blur-sm transition-colors hover:bg-card/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slideConfigs.map((s, i) => (
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
