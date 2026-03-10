import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, Gift, Building2, Flame, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/hmart-logo.png";
import StoreSelector from "@/components/StoreSelector";

const SITE_TABS: { id: string; label: string; sublabel?: string; icon: typeof Gift | null; active?: boolean }[] = [
  { id: "hmart", label: "H MART", icon: null, active: true },
  { id: "gifts", label: "고국통신", sublabel: "Gifts to Korea", icon: Gift },
  { id: "b2b", label: "H MART B2B", sublabel: "Wholesale", icon: Building2 },
];

const CATEGORIES = [
  "Rice & Grain",
  "Ramen & Noodle",
  "Snacks & Candy & Nuts",
  "Instant & Quick Food",
  "Seaweed & Dried Produce",
  "Oil & Seasoning & Canned Food",
  "Beverage & Coffee & Tea & Honey",
  "Paste & Marinade & Sauce",
  "Flour & Baking",
  "Meat",
  "Seafood",
  "Produce",
  "Kimchi & Side Dish & Deli",
  "Dairy & Egg",
  "Health",
  "Household & Home",
  "K-Beauty",
];

export default function Header() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hmart");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm">
      {/* Promo bar */}
      <div className="bg-primary">
        <div className="hmart-container flex items-center justify-center gap-4 py-1.5 text-xs font-medium text-primary-foreground sm:gap-6">
          <span>JOIN <strong>H MART PLUS</strong> — FREE SHIPPING on orders $49+</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Earn 2x Smart Rewards Points</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">Exclusive Weekly Deals</span>
          <Link to="/products" className="ml-2 rounded-sm bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-primary-foreground/30">
            Learn More
          </Link>
        </div>
      </div>

      {/* Site tabs */}
      <div className="bg-primary/90">
        <div className="hmart-container flex items-end gap-1 pt-1">
          {SITE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-t-lg px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              {tab.sublabel && (
                <span className={`hidden text-[10px] font-normal sm:inline ${
                  activeTab === tab.id ? "text-muted-foreground" : "text-primary-foreground/70"
                }`}>
                  {tab.sublabel}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border">
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

          <nav className="hidden items-center gap-5 lg:flex">
            {/* Categories dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  categoriesOpen ? "text-primary" : "text-foreground"
                }`}
              >
                Categories <ChevronDown className={`h-3.5 w-3.5 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-full mt-3 w-72 rounded-xl border border-border bg-card shadow-xl animate-fade-in">
                  <div className="py-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to="/products"
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-primary transition-colors hover:bg-secondary"
                      >
                        {cat}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Weekly Deals */}
            <Link to="/products" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
              Weekly Deals
            </Link>

            {/* Trending on TikTok */}
            <Link
              to="/products"
              className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background transition-transform hover:scale-105 active:scale-95"
            >
              <Flame className="h-3.5 w-3.5" />
              Trending on TikTok
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
      </div>
    </header>
  );
}