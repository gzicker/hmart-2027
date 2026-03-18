import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, Gift, Building2, Flame, ChevronRight, Package, MapPin, CreditCard, LogOut, ShoppingBasket } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTab } from "@/contexts/TabContext";
import { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/hmart-logo.png";
import StoreSelector from "@/components/StoreSelector";
import LanguageSelector from "@/components/LanguageSelector";
import MiniCart from "@/components/MiniCart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCategoryTree, type VtexCategory } from "@/api/catalogApi";
import { autocomplete as vtexAutocomplete } from "@/api/searchApi";

const SITE_TABS = [
  { id: "hmart", labelKey: "tab.hmart", icon: ShoppingBasket, sublabelKey: null },
  { id: "gifts", labelKey: "tab.hmart", icon: Gift, sublabelKey: "tab.gifts" },
  { id: "b2b", labelKey: "tab.hmart", icon: Building2, sublabelKey: "tab.b2b" },
] as const;

const CATEGORY_KEYS = [
  "catList.riceGrain", "catList.ramenNoodle", "catList.snacks", "catList.instant",
  "catList.seaweed", "catList.oil", "catList.beverage", "catList.paste",
  "catList.flour", "catList.meat", "catList.seafood", "catList.produce",
  "catList.kimchi", "catList.dairy", "catList.health", "catList.household", "catList.kbeauty",
];

export default function Header() {
  const { totalItems } = useCart();
  const { t } = useLanguage();
  const { activeTab, setActiveTab } = useTab();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [vtexCategories, setVtexCategories] = useState<VtexCategory[]>([]);
  const [suggestions, setSuggestions] = useState<{terms: string[]; products: {name: string; slug: string; thumb: string}[]}>({terms: [], products: []});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategoryTree(3).then((cats) => {
      const filtered = cats.filter(c =>
        !['1', 'Test Category', 'Test Category  Test', 'Main Category', 'Mickael', 'gift chuseok test'].includes(c.name)
      );
      setVtexCategories(filtered);
    }).catch(console.error);
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    if (value.length < 2) { setSuggestions({terms: [], products: []}); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await vtexAutocomplete(value);
        setSuggestions({
          terms: data.searches?.map(s => s.term) || [],
          products: data.itemsReturned?.map(p => ({ name: p.name, slug: p.slug || p.productId, thumb: p.thumb })) || [],
        });
        setShowSuggestions(true);
      } catch { /* ignore */ }
    }, 300);
  };

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
      <div className={
        activeTab === "gifts" ? "bg-[hsl(230,60%,50%)]"
        : activeTab === "b2b" ? "bg-gray-800"
        : "bg-primary"
      }>
        <div className="hmart-container flex items-center justify-center gap-4 py-1.5 text-xs font-medium text-white sm:gap-6">
          <span>{t("promo.join")} <strong>{t("promo.hmartPlus")}</strong> {t("promo.freeShipping")}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{t("promo.rewards")}</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">{t("promo.deals")}</span>
          <Link to="/products" className="ml-2 rounded-sm bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/30">
            {t("promo.learnMore")}
          </Link>
        </div>
      </div>

      {/* Site tabs */}
      <div className={
        activeTab === "gifts" ? "bg-[hsl(230,60%,50%)]/90"
        : activeTab === "b2b" ? "bg-gray-700"
        : "bg-primary/90"
      }>
        <div className="hmart-container flex items-end gap-1 pt-1">
          {SITE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-t-lg px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              <span>{tab.id === "b2b" ? `${t("tab.hmart")} B2B` : tab.id === "gifts" ? t("tab.giftsLabel") : t("tab.hmart")}</span>
              {tab.sublabelKey && (
                <span className={`hidden text-[10px] font-normal sm:inline ${
                  activeTab === tab.id ? "text-muted-foreground" : "text-white/70"
                }`}>
                  {t(tab.sublabelKey)}
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

          {/* Nav items between logo and search */}
          <nav className="hidden items-center gap-5 lg:flex">
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  categoriesOpen ? "text-primary" : "text-foreground"
                }`}
              >
                {t("nav.categories")} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-full mt-3 w-72 rounded-xl border border-border bg-card shadow-xl animate-fade-in z-50">
                  <div className="max-h-[70vh] overflow-y-auto py-2">
                    {vtexCategories.length > 0 ? vtexCategories.map((dept) => (
                      <div key={dept.id}>
                        <Link
                          to={`/products?cat=${dept.id}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                        >
                          {dept.name}
                          {dept.hasChildren && dept.children?.length > 0 && (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Link>
                        {dept.hasChildren && dept.children?.length > 0 && (
                          <div className="bg-secondary/30">
                            {dept.children.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/products?cat=${sub.id}`}
                                onClick={() => setCategoriesOpen(false)}
                                className="block px-8 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )) : CATEGORY_KEYS.map((key) => (
                      <Link
                        key={key}
                        to="/products"
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-primary transition-colors hover:bg-secondary"
                      >
                        {t(key)}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/products" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
              {t("nav.weeklyDeals")}
            </Link>

            <Link
              to="/#trending-tiktok"
              className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background transition-transform hover:scale-105 active:scale-95"
            >
              <Flame className="h-3.5 w-3.5" />
              {t("nav.trending")}
            </Link>
          </nav>

          {/* Search + Store + User/Cart pushed right */}
          <div className="ml-auto flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("nav.search")}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {showSuggestions && (suggestions.terms.length > 0 || suggestions.products.length > 0) && (
                  <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-xl z-50 py-2">
                    {suggestions.terms.length > 0 && (
                      <div className="px-2 pb-1">
                        {suggestions.terms.slice(0, 5).map((term) => (
                          <button
                            key={term}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { setSearchQuery(term); navigate(`/products?q=${encodeURIComponent(term)}`); setShowSuggestions(false); }}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-secondary"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    )}
                    {suggestions.products.length > 0 && (
                      <div className="border-t border-border px-2 pt-1">
                        {suggestions.products.slice(0, 4).map((p) => (
                          <Link
                            key={p.slug}
                            to={`/product/${p.slug}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowSuggestions(false)}
                            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-secondary"
                          >
                            {p.thumb && <img src={p.thumb} alt="" className="h-8 w-8 rounded object-cover" />}
                            <span className="text-sm text-foreground">{p.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>

            <StoreSelector />

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="rounded-full p-2 transition-colors hover:bg-secondary">
                    <User className="h-5 w-5 text-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-0">
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">VINCE COLATRIANO</p>
                        <p className="text-xs text-muted-foreground">vince@hmart.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Flame className="h-3 w-3" /> {t("user.plusMember")}
                    </span>
                  </div>
                  <div className="border-t border-border">
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                      <Package className="h-4 w-4 text-muted-foreground" /> {t("user.orders")}
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                      <Gift className="h-4 w-4 text-muted-foreground" /> {t("user.exclusiveOffers")}
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                      <CreditCard className="h-4 w-4 text-muted-foreground" /> {t("user.subscription")}
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="border-t border-border p-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      <LogOut className="h-4 w-4" /> {t("user.signOut")}
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <LanguageSelector />

              <button onClick={() => setMiniCartOpen(true)} className="relative rounded-full p-2 transition-colors hover:bg-secondary">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <MiniCart open={miniCartOpen} onClose={() => setMiniCartOpen(false)} />
    </header>
  );
}
