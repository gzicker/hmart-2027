import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import logoImg from "@/assets/hmart-logo.png";

export default function Header() {
  const { totalItems, selectedStore } = useCart();
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
      {/* Top bar */}
      <div className="border-b border-border bg-secondary/50">
        <div className="hmart-container flex items-center justify-between py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{selectedStore}</span>
            <ChevronDown className="h-3 w-3" />
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span>Same-day delivery & pickup available</span>
            <span>·</span>
            <span>Smart Rewards</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="hmart-container flex items-center gap-6 py-3">
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
