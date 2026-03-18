import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card">
      <div className="hmart-container py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:gap-8">
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.shop")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="transition-colors hover:text-primary">{t("footer.allProducts")}</Link></li>
              <li><Link to="/products?q=deals" className="transition-colors hover:text-primary">{t("footer.dealsPromo")}</Link></li>
              <li><Link to="/products?sort=release_desc" className="transition-colors hover:text-primary">{t("footer.newArrivals")}</Link></li>
              <li><Link to="/products?sort=orders_desc" className="transition-colors hover:text-primary">{t("footer.bestSellers")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.fulfillment")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="transition-colors hover:text-primary">{t("footer.delivery")}</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-primary">{t("footer.pickup")}</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-primary">{t("footer.shipHome")}</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-primary">{t("footer.deliveryAreas")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.about")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.ourStory")}</Link></li>
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.storeLocator")}</Link></li>
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.careers")}</Link></li>
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.smartRewards")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.help")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.customerService")}</Link></li>
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.faq")}</Link></li>
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.returnPolicy")}</Link></li>
              <li><Link to="/" className="transition-colors hover:text-primary">{t("footer.contactUs")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              {t("footer.rights")} · <span className="italic">{t("footer.tagline")}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {t("footer.concept")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
