import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import logoImg from "@/assets/hmart-logo.png";
import StoreSelector from "@/components/StoreSelector";

export default function Header() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
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
