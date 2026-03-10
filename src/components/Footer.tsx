import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="hmart-container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="transition-colors hover:text-primary">All Products</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-primary">Deals & Promotions</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-primary">New Arrivals</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-primary">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Fulfillment</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Same-Day Delivery</li>
              <li>Curbside Pickup</li>
              <li>Ship to Home</li>
              <li>Delivery Areas</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Our Story</li>
              <li>Store Locator</li>
              <li>Careers</li>
              <li>Smart Rewards</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Customer Service</li>
              <li>FAQ</li>
              <li>Return Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © 2027 H Mart. All rights reserved. · <span className="italic">Your Asian & Beyond Market</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Concept POC — Future Vision 2027
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
