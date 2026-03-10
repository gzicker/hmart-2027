import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Tag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect, useCallback } from "react";
import logoImg from "@/assets/hmart-logo.png";
import StoreSelector from "@/components/StoreSelector";

const PROMO_BANNERS = [
  {
    bg: "bg-primary",
    content: (
      <>
        <span>JOIN <strong>H MART PLUS</strong> — FREE SHIPPING on orders $49+</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Earn 2x Smart Rewards Points</span>
        <span className="hidden md:inline">·</span>
        <span className="hidden md:inline">Exclusive Weekly Deals</span>
      </>
    ),
    cta: "Learn More",
    link: "/products",
  },
  {
    bg: "bg-[hsl(260,60%,45%)]",
    content: (
      <>
        <Sparkles className="h-3.5 w-3.5" />
        <span><strong>H MART PLUS</strong> Members save an extra <strong>15%</strong> on all fresh produce</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Free same-day delivery</span>
        <span className="hidden md:inline">·</span>
        <span className="hidden md:inline">Priority checkout lanes</span>
      </>
    ),
    cta: "Join Now",
    link: "/products",
  },
  {
    bg: "bg-[hsl(145,55%,35%)]",
    content: (
      <>
        <Tag className="h-3.5 w-3.5" />
        <span>📰 <strong>WEEKLY DEALS</strong> — Up to <strong>40% OFF</strong> on 200+ items</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">New flyer every Thursday</span>
        <span className="hidden md:inline">·</span>
        <span className="hidden md:inline">Valid thru Mar 16</span>
      </>
    ),
    cta: "View Flyer",
    link: "/products",
  },
  {
    bg: "bg-[hsl(330,55%,45%)]",
    content: (
      <>
        <Heart className="h-3.5 w-3.5" />
        <span>✨ <strong>K-BEAUTY</strong> — Premium skincare & cosmetics now at H Mart</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Top Korean brands</span>
        <span className="hidden md:inline">·</span>
        <span className="hidden md:inline">Buy 2 Get 1 Free</span>
      </>
    ),
    cta: "Shop Beauty",
    link: "/products",
  },
];

export default function Header() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const navigate = useNavigate();

  const nextBanner = useCallback(() => {
    setBannerIndex((i) => (i + 1) % PROMO_BANNERS.length);
  }, []);

  const prevBanner = useCallback(() => {
    setBannerIndex((i) => (i - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [nextBanner]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const banner = PROMO_BANNERS[bannerIndex];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      {/* Promo bar */}
      <div className={`${banner.bg} relative transition-colors duration-500`}>
        <div className="hmart-container flex items-center justify-center gap-4 py-1.5 text-xs font-medium text-primary-foreground sm:gap-6">
          <button onClick={prevBanner} className="absolute left-2 rounded-full p-0.5 transition-colors hover:bg-white/20 sm:left-4">
            <ChevronLeft className="h-3.5 w-3.5 text-primary-foreground" />
          </button>
          <div className="flex items-center gap-3 sm:gap-6">
            {banner.content}
          </div>
          <Link to={banner.link} className="ml-2 rounded-sm bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-primary-foreground/30">
            {banner.cta}
          </Link>
          <button onClick={nextBanner} className="absolute right-2 rounded-full p-0.5 transition-colors hover:bg-white/20 sm:right-4">
            <ChevronRight className="h-3.5 w-3.5 text-primary-foreground" />
          </button>
        </div>
        {/* Dots */}
        <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-1">
          {PROMO_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIndex(i)}
              className={`h-1 rounded-full transition-all ${i === bannerIndex ? "w-3 bg-primary-foreground" : "w-1 bg-primary-foreground/40"}`}
            />
          ))}
        </div>
      </div>

      {/* Main header */}
      <div className="hmart-container flex items-center gap-4 py-3 lg:gap-6">
        <Link to="/" className="flex-shrink-0">
          <img src={logoImg} alt="H Mart" className="h-10 w-auto" />
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1 items-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for kimchi, ramen, fresh produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </form>

        <StoreSelector />

        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/products" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Shop All
          </Link>
          <button className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary">
            Categories <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link to="/products" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Deals
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 transition-colors hover:bg-secondary">
            <User className="h-5 w-5 text-foreground" />
          </button>
          <Link to="/checkout" className="relative rounded-full p-2 transition-colors hover:bg-secondary">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
