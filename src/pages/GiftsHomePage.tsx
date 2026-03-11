import { motion } from "framer-motion";
import { Gift, Heart, Plane, Package, Clock, Star, ArrowRight, Beef, Apple, Fish, Cake, Pill } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ROYAL = {
  bg: "bg-[hsl(230,60%,50%)]",
  bgLight: "bg-[hsl(230,60%,96%)]",
  bgMid: "bg-[hsl(230,60%,50%)]/10",
  text: "text-[hsl(230,60%,50%)]",
  gradient: "from-[hsl(230,60%,50%)] to-[hsl(230,80%,40%)]",
  gradientLight: "from-[hsl(230,60%,96%)] via-[hsl(230,50%,94%)] to-[hsl(240,60%,95%)]",
};

const GIFT_CATEGORIES = [
  { icon: Beef, label: "프리미엄 한우", desc: "1++ 등급 한우 세트", color: "bg-red-50 text-red-600" },
  { icon: Apple, label: "신선 과일", desc: "제철 프리미엄 과일 박스", color: "bg-green-50 text-green-600" },
  { icon: Fish, label: "수산·건어물", desc: "전복, 건어물 등", color: "bg-blue-50 text-blue-600" },
  { icon: Pill, label: "건강식품", desc: "인삼, 꿀, 건강보조제", color: "bg-purple-50 text-purple-600" },
  { icon: Cake, label: "한과·디저트", desc: "한과, 떡, 디저트", color: "bg-amber-50 text-amber-600" },
  { icon: Package, label: "간편한 한끼", desc: "큐레이션 선물 패키지", color: "bg-pink-50 text-pink-600" },
];

const FEATURED_SETS = [
  { name: "프리미엄 한우 세트", desc: "1++ 등급 등심 & 꽃등심, 총 1.2kg. 프리미엄 포장 포함.", price: "$89.99", badge: "베스트셀러", rating: 4.9, reviews: 2340 },
  { name: "한국 인삼 디럭스", desc: "6년근 홍삼 농축액, 꿀스틱 & 캡슐. 최고의 건강 선물.", price: "$129.99", badge: "프리미엄", rating: 4.8, reviews: 1890 },
  { name: "제철 과일 박스", desc: "엄선된 프리미엄 과일: 배, 포도, 감 등.", price: "$64.99", badge: "신상품", rating: 4.7, reviews: 560 },
  { name: "로얄 헤리티지 세트", desc: "한우, 전복, 인삼 & 전통 한과. 최고급 선물.", price: "$199.99", badge: "럭셔리", rating: 5.0, reviews: 890 },
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

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${ROYAL.gradientLight}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[hsl(230,60%,50%)]/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[hsl(230,80%,70%)]/30 blur-3xl" />
        </div>
        <div className="hmart-container relative py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[hsl(230,60%,50%)]/10 px-4 py-1.5 text-sm font-semibold text-[hsl(230,60%,50%)]">
              <Heart className="h-4 w-4" /> 고국통신
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              한국에 사랑을 보내세요
            </h1>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              프리미엄 한국 선물 세트를 한국에 계신 소중한 분께 직접 배송해 드립니다. 신선한 한우부터 건강 보조제까지 — 바다 건너 마음을 전하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-[hsl(230,60%,50%)] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[hsl(230,60%,50%)]/25 transition-transform hover:scale-105">
                선물 세트 쇼핑
              </button>
              <button className="rounded-xl border-2 border-[hsl(230,60%,50%)]/20 bg-card px-8 py-3.5 font-semibold text-[hsl(230,60%,50%)] transition-colors hover:bg-[hsl(230,60%,50%)]/5">
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

      {/* Featured Gift Sets */}
      <section className="bg-secondary/50 py-16">
        <div className="hmart-container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">인기 선물 세트</h2>
            <p className="text-muted-foreground">모든 기념일을 위한 베스트셀러 선물 세트</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_SETS.map((set, i) => (
              <motion.div
                key={set.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative h-48 bg-gradient-to-br from-[hsl(230,60%,50%)]/10 to-[hsl(230,60%,90%)] flex items-center justify-center">
                  <Gift className="h-16 w-16 text-[hsl(230,60%,50%)]/30" />
                  <span className="absolute left-3 top-3 rounded-full bg-[hsl(230,60%,50%)] px-3 py-1 text-[10px] font-bold uppercase text-white">
                    {set.badge}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="mb-1 font-display text-base font-bold text-foreground">{set.name}</h3>
                  <p className="mb-3 text-xs text-muted-foreground leading-relaxed">{set.desc}</p>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="text-xs font-semibold">{set.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({set.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[hsl(230,60%,50%)]">{set.price}</span>
                    <button className="rounded-lg bg-[hsl(230,60%,50%)]/10 px-4 py-2 text-xs font-semibold text-[hsl(230,60%,50%)] transition-colors hover:bg-[hsl(230,60%,50%)] hover:text-white">
                      장바구니 담기
                    </button>
                  </div>
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
