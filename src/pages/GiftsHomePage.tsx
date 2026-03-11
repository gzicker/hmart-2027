import { motion } from "framer-motion";
import { Gift, Heart, Plane, Package, Clock, Star, ArrowRight, Beef, Apple, Fish, Cake, Pill, ShoppingCart, Droplets } from "lucide-react";
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

const GIFT_CATEGORIES = [
  { icon: Beef, label: "프리미엄 한우", desc: "1++ 등급 한우 세트", color: "bg-red-50 text-red-600" },
  { icon: Apple, label: "신선 과일", desc: "제철 프리미엄 과일 박스", color: "bg-green-50 text-green-600" },
  { icon: Fish, label: "수산·건어물", desc: "전복, 건어물 등", color: "bg-blue-50 text-blue-600" },
  { icon: Pill, label: "건강식품", desc: "인삼, 꿀, 건강보조제", color: "bg-purple-50 text-purple-600" },
  { icon: Cake, label: "한과·디저트", desc: "한과, 떡, 디저트", color: "bg-amber-50 text-amber-600" },
  { icon: Package, label: "간편한 한끼", desc: "큐레이션 선물 패키지", color: "bg-pink-50 text-pink-600" },
];

const GIFT_PRODUCTS = [
  { image: giftHanwoo1, brand: "암소서울", name: "암소서울 1++암소선물세트 (등심400g+안심400g+채끝400g)", price: 209.99, originalPrice: 299.99, discount: 30, rating: 4.9, reviews: 2340, isCold: true },
  { image: giftHanwoo2, brand: "동화고옥", name: "동화고옥 향연LA갈비세트 2호 (꽃갈비 2800g)", price: 149.99, originalPrice: 215.00, discount: 30, rating: 4.8, reviews: 1890, isCold: true },
  { image: giftGinseng, brand: "정관장", name: "정관장 홍삼정 에브리타임 밸런스 선물세트 (10ml x 30포)", price: 129.99, originalPrice: 169.99, discount: 24, rating: 4.9, reviews: 3120, isCold: false },
  { image: giftHanwoo1, brand: "Seouloin", name: "서울로인 1호세트 (등심 300g+안심300g+불고기용 300g)", price: 130.99, originalPrice: 243.99, discount: 46, rating: 4.7, reviews: 1560, isCold: true },
  { image: giftFruit, brand: "명품과일", name: "제주 황금향 & 천혜향 프리미엄 과일세트 (3kg)", price: 64.99, originalPrice: 89.99, discount: 28, rating: 4.8, reviews: 890, isCold: true },
  { image: giftSeafood, brand: "해맑은", name: "완도 활전복 & 건어물 프리미엄 선물세트", price: 99.99, originalPrice: 149.99, discount: 33, rating: 4.7, reviews: 670, isCold: true },
  { image: giftHanwoo3, brand: "한우애명작", name: "프리미엄 숙성한우 구이특선 한상스페셜 1호", price: 156.99, originalPrice: 239.99, discount: 35, rating: 4.9, reviews: 1230, isCold: true },
  { image: giftHangwa, brand: "궁중한과", name: "궁중한과 전통 수제 한과세트 특선 (800g)", price: 49.99, originalPrice: 69.99, discount: 29, rating: 4.6, reviews: 450, isCold: false },
  { image: giftHanwoo2, brand: "동화고옥", name: "동화고옥 향연LA갈비세트 1호 (꽃갈비 1400g)", price: 99.99, originalPrice: 149.99, discount: 33, rating: 4.8, reviews: 980, isCold: true },
  { image: giftGinseng, brand: "고려인삼", name: "고려 6년근 홍삼 농축액 선물세트 (240g x 2병)", price: 189.99, originalPrice: 259.99, discount: 27, rating: 4.9, reviews: 2100, isCold: false },
  { image: giftHanwoo3, brand: "한우애명작", name: "프리미엄 구이&정육 명절한상 스페셜 3호 불고기 육전...", price: 115.99, originalPrice: 179.99, discount: 36, rating: 4.8, reviews: 760, isCold: true },
  { image: giftFruit, brand: "명품과일", name: "나주배 & 샤인머스캣 프리미엄 혼합 과일세트 (5kg)", price: 79.99, originalPrice: 109.99, discount: 27, rating: 4.7, reviews: 540, isCold: true },
];

const STEPS = [
  { icon: Gift, label: "선물 선택", desc: "엄선된 프리미엄 선물 세트를 둘러보세요" },
  { icon: Clock, label: "배송일 선택", desc: "소중한 분이 선물을 받을 날짜를 선택하세요" },
  { icon: Plane, label: "한국으로 배송", desc: "신선한 상품은 한국 현지에서 조달하여 최상의 신선도를 유지합니다" },
  { icon: Heart, label: "사랑을 담아 배달", desc: "아름답게 포장된 선물이 문 앞에 도착합니다" },
];

export default function GiftsHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero with image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={giftsHero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(230,60%,25%)]/90 via-[hsl(230,60%,30%)]/70 to-transparent" />
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
              프리미엄 한국 선물 세트를 한국에 계신 소중한 분께 직접 배송해 드립니다. 신선한 한우부터 건강 보조제까지.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-white px-8 py-3.5 font-semibold text-[hsl(230,60%,40%)] shadow-lg transition-transform hover:scale-105">
                선물 세트 쇼핑
              </button>
              <button className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                이용 방법
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">선물 카테고리</h2>
            <p className="text-muted-foreground">엄선된 프리미엄 한국 선물 중에서 선택하세요</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {GIFT_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color}`}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{cat.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid - like the real site */}
      <section className="bg-secondary/30 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">베스트 셀러</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["한우", "건강", "정육", "과일", "수산", "한과"].map((tab, i) => (
                <button
                  key={tab}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    i === 0
                      ? "bg-[hsl(230,60%,50%)] text-white"
                      : "bg-card text-muted-foreground border border-border hover:bg-[hsl(230,60%,50%)]/10 hover:text-[hsl(230,60%,50%)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {GIFT_PRODUCTS.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Discount badge */}
                  <span className="absolute left-2 top-2 rounded-md bg-[hsl(230,60%,50%)] px-2 py-0.5 text-xs font-bold text-white">
                    -{product.discount}%
                  </span>
                  {/* Cold badge */}
                  {product.isCold && (
                    <span className="absolute left-2 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(230,60%,50%)]">
                      <Droplets className="h-3 w-3 text-white" />
                    </span>
                  )}
                  {/* Cart icon */}
                  <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-[hsl(230,60%,50%)] hover:text-white">
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <span className="text-xs font-semibold text-[hsl(230,60%,50%)]">{product.brand}</span>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-foreground">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-foreground">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  </div>
                  <button className="mt-2 flex items-center gap-1 rounded-full border border-[hsl(230,60%,50%)] px-3 py-1.5 text-xs font-semibold text-[hsl(230,60%,50%)] transition-colors hover:bg-[hsl(230,60%,50%)] hover:text-white">
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="hmart-container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">이용 방법</h2>
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
