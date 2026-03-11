import { motion } from "framer-motion";
import { Heart, Plane, Clock, ArrowRight, ShoppingCart, Droplets, Gift } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import giftsHero from "@/assets/gifts-hero.jpg";
import giftHanwoo1 from "@/assets/gift-hanwoo-1.jpg";
import giftHanwoo2 from "@/assets/gift-hanwoo-2.jpg";
import giftHanwoo3 from "@/assets/gift-hanwoo-3.jpg";
import giftGinseng from "@/assets/gift-ginseng.jpg";
import giftFruit from "@/assets/gift-fruit.jpg";
import giftSeafood from "@/assets/gift-seafood.jpg";
import giftHangwa from "@/assets/gift-hangwa.jpg";

import catBest from "@/assets/cat-best.png";
import catNew from "@/assets/cat-new.png";
import catHanwoo from "@/assets/cat-hanwoo.png";
import catSeafood from "@/assets/cat-seafood-gift.png";
import catHealth from "@/assets/cat-health.png";
import catHangwa from "@/assets/cat-hangwa.png";
import catMeal from "@/assets/cat-meal.png";
import catMd from "@/assets/cat-md.png";

const GIFT_CATEGORIES = [
  { image: catBest, label: "BEST" },
  { image: catNew, label: "신규 입점" },
  { image: catHanwoo, label: "한우·정육" },
  { image: catSeafood, label: "수산·건어물" },
  { image: catHealth, label: "건강식품" },
  { image: catHangwa, label: "한과·디저트" },
  { image: catMeal, label: "간편한 한끼" },
  { image: catMd, label: "MD추천" },
];

const GIFT_PRODUCTS = [
  { image: giftHanwoo1, brand: "암소서울", name: "암소서울 1++암소선물세트 (등심400g+안심400g+채끝400g+부채살400g)", price: 209.99, originalPrice: 299.99, discount: 30, isCold: true },
  { image: giftHanwoo2, brand: "동화고옥", name: "동화고옥 향연LA갈비세트 2호 (꽃갈비 2800g)", price: 149.99, originalPrice: 215.00, discount: 30, isCold: true },
  { image: giftHanwoo1, brand: "암소서울", name: "암소서울 1++암소선물세트 (등심800g+안심800g+채끝800g+부채살800g)", price: 599.99, originalPrice: 699.99, discount: 14, isCold: true },
  { image: giftHanwoo3, brand: "Seouloin", name: "서울로인 1호세트 (등심 300g+안심300g+불고기용 300g)", price: 130.99, originalPrice: 243.99, discount: 46, isCold: true },
  { image: giftHanwoo2, brand: "동화고옥", name: "동화고옥 향연LA갈비세트 1호 (꽃갈비 1400g)", price: 99.99, originalPrice: 149.99, discount: 33, isCold: true },
  { image: giftHanwoo3, brand: "Seouloin", name: "서울로인 3호세트 (등심 400g+안심400g+채끝400g)", price: 243.99, originalPrice: 309.99, discount: 21, isCold: true },
  { image: giftHanwoo3, brand: "Seouloin", name: "서울로인 2호세트 (등심 300g+안심300g+채끝300g)", price: 169.99, originalPrice: 199.99, discount: 15, isCold: true },
  { image: giftHanwoo1, brand: "한우애명작", name: "프리미엄 숙성한우 구이특선 한상스페셜 1호", price: 156.99, originalPrice: 239.99, discount: 35, isCold: true },
  { image: giftHanwoo3, brand: "한우애명작", name: "프리미엄 숙성한우 구이 한상 프리미엄 4호", price: 208.99, originalPrice: 319.99, discount: 35, isCold: true },
  { image: giftHanwoo2, brand: "한우애명작", name: "프리미엄 구이&정육 명절한상 스페셜 3호 불고기 육전...", price: 115.99, originalPrice: 179.99, discount: 36, isCold: true },
  { image: giftHanwoo1, brand: "한우애명작", name: "1++등급 투뿔한우 인기정육&수제 한우떡갈비 특선", price: 156.99, originalPrice: 239.99, discount: 35, isCold: true },
  { image: giftHanwoo3, brand: "한우애명작", name: "프리미엄 숙성한우 구이특선 한상스페셜 2호", price: 136.99, originalPrice: 209.99, discount: 35, isCold: true },
];

const GIFT_PRODUCTS_HEALTH = [
  { image: giftGinseng, brand: "정관장", name: "정관장 홍삼정 에브리타임 밸런스 선물세트 (10ml x 30포)", price: 129.99, originalPrice: 169.99, discount: 24, isCold: false },
  { image: giftGinseng, brand: "고려인삼", name: "고려 6년근 홍삼 농축액 선물세트 (240g x 2병)", price: 189.99, originalPrice: 259.99, discount: 27, isCold: false },
  { image: giftGinseng, brand: "정관장", name: "정관장 홍삼톤 골드 선물세트 (40ml x 30포)", price: 159.99, originalPrice: 219.99, discount: 27, isCold: false },
  { image: giftGinseng, brand: "CKD", name: "CKD 홍삼 활력 스틱 선물세트 (15g x 60포)", price: 89.99, originalPrice: 129.99, discount: 31, isCold: false },
  { image: giftGinseng, brand: "풍기인삼", name: "풍기인삼 6년근 홍삼절편 선물세트 (300g)", price: 74.99, originalPrice: 99.99, discount: 25, isCold: false },
  { image: giftGinseng, brand: "정관장", name: "정관장 화애락 진 선물세트 (50ml x 28포)", price: 199.99, originalPrice: 279.99, discount: 29, isCold: false },
];

const GIFT_PRODUCTS_FRUIT = [
  { image: giftFruit, brand: "명품과일", name: "제주 황금향 & 천혜향 프리미엄 과일세트 (3kg)", price: 64.99, originalPrice: 89.99, discount: 28, isCold: true },
  { image: giftFruit, brand: "명품과일", name: "나주배 & 샤인머스캣 프리미엄 혼합 과일세트 (5kg)", price: 79.99, originalPrice: 109.99, discount: 27, isCold: true },
  { image: giftFruit, brand: "해남과일", name: "해남 꿀고구마 & 제주감귤 세트 (5kg)", price: 49.99, originalPrice: 69.99, discount: 29, isCold: true },
  { image: giftFruit, brand: "명품과일", name: "상주 곶감 & 나주배 프리미엄 세트 (4kg)", price: 89.99, originalPrice: 129.99, discount: 31, isCold: true },
  { image: giftFruit, brand: "제주농원", name: "제주 한라봉 프리미엄 선물세트 (3kg, 12과)", price: 54.99, originalPrice: 79.99, discount: 31, isCold: true },
  { image: giftFruit, brand: "명품과일", name: "사과 & 배 혼합 명절 과일세트 특대 (7kg)", price: 99.99, originalPrice: 139.99, discount: 29, isCold: true },
];

const TABS = [
  { id: "hanwoo", label: "한우" },
  { id: "health", label: "건강" },
  { id: "fruit", label: "과일" },
];

const STEPS = [
  { icon: Gift, label: "선물 선택", desc: "엄선된 프리미엄 선물 세트를 둘러보세요" },
  { icon: Clock, label: "배송일 선택", desc: "소중한 분이 선물을 받을 날짜를 선택하세요" },
  { icon: Plane, label: "한국으로 배송", desc: "신선한 상품은 한국 현지에서 조달됩니다" },
  { icon: Heart, label: "사랑을 담아 배달", desc: "아름답게 포장된 선물이 문 앞에 도착합니다" },
];

import { useState } from "react";

export default function GiftsHomePage() {
  const [activeTab, setActiveTab] = useState("hanwoo");

  const currentProducts = activeTab === "health" ? GIFT_PRODUCTS_HEALTH
    : activeTab === "fruit" ? GIFT_PRODUCTS_FRUIT
    : GIFT_PRODUCTS;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero with image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={giftsHero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(230,60%,20%)]/90 via-[hsl(230,60%,25%)]/75 to-transparent" />
        </div>
        <div className="hmart-container relative py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              <Heart className="h-4 w-4" /> 고국통신
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-white lg:text-5xl">
              한국에 사랑을 보내세요
            </h1>
            <p className="mb-8 text-lg text-white/80 leading-relaxed">
              프리미엄 한우, 건강식품, 과일 선물세트를 한국에 계신 소중한 분께 직접 배송해 드립니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-white px-8 py-3.5 font-semibold text-[hsl(230,60%,40%)] shadow-lg transition-transform hover:scale-105">
                선물 세트 쇼핑
              </button>
              <button className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                주문방법 안내
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Illustrated Categories - matching real site style */}
      <section className="border-b border-border bg-card py-10">
        <div className="hmart-container">
          <div className="flex items-center justify-center gap-6 overflow-x-auto lg:gap-10">
            {GIFT_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105"
              >
                <img src={cat.image} alt={cat.label} className="h-20 w-20 object-contain" />
                <span className="text-xs font-semibold text-foreground">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Product Grid */}
      <section className="py-16">
        <div className="hmart-container">
          <h2 className="mb-6 text-center font-display text-2xl font-bold text-[hsl(230,60%,50%)]">베스트 셀러</h2>
          <div className="mb-8 flex justify-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[hsl(230,60%,50%)] text-white"
                    : "bg-card text-muted-foreground border border-border hover:text-[hsl(230,60%,50%)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {currentProducts.map((product, i) => (
              <motion.div
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-[hsl(230,60%,50%)] px-2 py-0.5 text-xs font-bold text-white">
                    -{product.discount}%
                  </span>
                  {product.isCold && (
                    <span className="absolute left-2 top-8 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(230,60%,50%)]">
                      <Droplets className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                  <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-[hsl(230,60%,50%)] hover:text-white">
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3">
                  <span className="text-[11px] font-semibold text-[hsl(230,60%,50%)]">{product.brand}</span>
                  <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-foreground">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold text-foreground">${product.price.toFixed(2)}</span>
                    <span className="text-[11px] text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  </div>
                  <button className="mt-2 flex items-center gap-1 rounded-full border border-[hsl(230,60%,50%)] px-3 py-1 text-[11px] font-semibold text-[hsl(230,60%,50%)] transition-colors hover:bg-[hsl(230,60%,50%)] hover:text-white">
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-border py-16">
        <div className="hmart-container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">주문방법</h2>
            <p className="text-muted-foreground">고국통신으로 한국에 선물 보내기</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(230,60%,50%)]/10">
                  <step.icon className="h-7 w-7 text-[hsl(230,60%,50%)]" />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(230,60%,50%)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-display text-sm font-bold text-foreground">{step.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-8 hidden h-5 w-5 text-muted-foreground/40 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[hsl(230,60%,50%)] py-12">
        <div className="hmart-container text-center">
          <h2 className="mb-3 font-display text-2xl font-bold text-white">특별한 하루를 선물하세요</h2>
          <p className="mb-6 text-white/80">$100 이상 선물 세트 무료 배송. 서울 지역 당일 배송 가능.</p>
          <button className="rounded-xl bg-white px-8 py-3.5 font-semibold text-[hsl(230,60%,50%)] shadow-lg transition-transform hover:scale-105">
            전체 선물 세트 보기
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
