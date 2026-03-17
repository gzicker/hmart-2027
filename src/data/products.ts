import gochujangImg from "@/assets/product-gochujang.jpg";
import tteokImg from "@/assets/product-tteok.jpg";
import ramenImg from "@/assets/product-ramen.jpg";
import napaImg from "@/assets/product-napa.jpg";
import bulgogiImg from "@/assets/product-bulgogi.jpg";
import matchaImg from "@/assets/product-matcha.jpg";
import kimchiImg from "@/assets/product-kimchi.jpg";
import sojuImg from "@/assets/product-soju.jpg";
import sesameOilImg from "@/assets/product-sesame-oil.jpg";
import mochiImg from "@/assets/product-mochi.jpg";

export interface Product {
  id: string;
  name: string;
  nameKo?: string;
  nameZh?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  weight: string;
  inStock: boolean;
  isSponsored?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  fulfillment: ("delivery" | "pickup" | "shipping")[];
  description: string;
  descriptionKo?: string;
  descriptionZh?: string;
  storeName?: string;
  _vtex?: { productId: string; skuId: string; sellerId: string; linkText: string };
}

export const products: Product[] = [
  {
    id: "gochujang-001",
    name: "Premium Gochujang",
    nameKo: "고추장",
    nameZh: "韩式辣椒酱",
    brand: "CJ Haechandle",
    price: 8.99,
    originalPrice: 10.99,
    image: gochujangImg,
    category: "Sauces & Condiments",
    weight: "500g",
    inStock: true,
    isSponsored: true,
    rating: 4.8,
    reviewCount: 1243,
    fulfillment: ["delivery", "pickup", "shipping"],
    description: "Authentic Korean red chili paste made with sun-dried peppers and fermented soybeans. Essential for bibimbap, tteokbokki, and countless Korean dishes. This premium grade gochujang has been naturally fermented for over 12 months.",
    descriptionKo: "햇볕에 말린 고추와 발효 대두로 만든 정통 한국산 고추장. 비빔밥, 떡볶이 등 다양한 한식에 필수입니다. 이 프리미엄 고추장은 12개월 이상 자연 발효되었습니다.",
    descriptionZh: "采用阳光晒干的辣椒和发酵大豆制成的正宗韩式辣椒酱。是拌饭、炒年糕和无数韩式料理的必备调料。这款高级辣椒酱经过12个月以上的自然发酵。",
    storeName: "H Mart Manhattan",
  },
  {
    id: "tteok-001",
    name: "Fresh Rice Cakes",
    nameKo: "떡",
    nameZh: "新鲜年糕",
    brand: "H Mart Fresh",
    price: 5.49,
    image: tteokImg,
    category: "Fresh & Prepared",
    weight: "450g",
    inStock: true,
    rating: 4.6,
    reviewCount: 876,
    fulfillment: ["delivery", "pickup"],
    description: "Freshly made cylindrical rice cakes, perfect for tteokbokki or soups. Made daily in-store with premium Korean rice flour.",
    descriptionKo: "갓 만든 원통형 떡으로 떡볶이나 국에 안성맞춤입니다. 프리미엄 한국산 쌀가루로 매장에서 매일 만듭니다.",
    descriptionZh: "新鲜制作的圆柱形年糕，非常适合炒年糕或汤类。每天在店内用优质韩国米粉制作。",
    storeName: "H Mart Manhattan",
  },
  {
    id: "ramen-001",
    name: "Shin Ramyun Black",
    nameKo: "신라면 블랙",
    nameZh: "辛拉面Black",
    brand: "Nongshim",
    price: 12.99,
    image: ramenImg,
    category: "Noodles & Ramen",
    weight: "4-pack",
    inStock: true,
    isSponsored: true,
    rating: 4.9,
    reviewCount: 3421,
    fulfillment: ["delivery", "pickup", "shipping"],
    description: "Premium version of Korea's #1 ramen. Rich bone broth flavor with premium dried vegetables and thick chewy noodles.",
    descriptionKo: "한국 1위 라면의 프리미엄 버전. 풍부한 사골 육수 맛에 프리미엄 건조 채소와 두꺼운 쫄깃한 면이 특징입니다.",
    descriptionZh: "韩国第一拉面的高级版本。浓郁骨汤风味搭配优质干蔬菜和Q弹粗面条。",
  },
  {
    id: "napa-001",
    name: "Napa Cabbage",
    nameKo: "배추",
    nameZh: "大白菜",
    brand: "H Mart Fresh",
    price: 3.99,
    image: napaImg,
    category: "Vegetables",
    weight: "1 head (~2lb)",
    inStock: true,
    rating: 4.5,
    reviewCount: 234,
    fulfillment: ["delivery", "pickup"],
    description: "Farm-fresh napa cabbage, ideal for making homemade kimchi or adding to soups and stir-fries.",
    descriptionKo: "농장 직송 신선한 배추로, 직접 김치를 담그거나 국이나 볶음 요리에 넣기에 이상적입니다.",
    descriptionZh: "农场直送的新鲜大白菜，非常适合制作自制泡菜或加入汤类和炒菜。",
    storeName: "H Mart Manhattan",
  },
  {
    id: "bulgogi-001",
    name: "Marinated Bulgogi",
    nameKo: "불고기",
    nameZh: "腌制烤肉",
    brand: "H Mart Fresh",
    price: 18.99,
    originalPrice: 22.99,
    image: bulgogiImg,
    category: "Meat & Seafood",
    weight: "1lb",
    inStock: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 2156,
    fulfillment: ["delivery", "pickup"],
    description: "Premium USDA Choice beef, thinly sliced and marinated in our signature soy-based sauce with pear, garlic, and sesame. Ready to grill.",
    descriptionKo: "프리미엄 USDA Choice 등급 소고기를 얇게 썰어 배, 마늘, 참깨가 들어간 특제 간장 소스에 재운 불고기. 바로 구워 드시면 됩니다.",
    descriptionZh: "优质USDA Choice级别牛肉，薄切后用我们特制的梨、大蒜和芝麻酱油腌制。即可烧烤。",
    storeName: "H Mart Manhattan",
  },
  {
    id: "matcha-001",
    name: "Ceremonial Matcha",
    nameKo: "말차",
    nameZh: "仪式级抹茶",
    brand: "Ippodo",
    price: 34.99,
    image: matchaImg,
    category: "Tea & Beverages",
    weight: "30g",
    inStock: true,
    rating: 4.7,
    reviewCount: 567,
    fulfillment: ["delivery", "shipping"],
    description: "Premium ceremonial grade matcha from Uji, Kyoto. Stone-ground from first harvest tea leaves for the finest, most vibrant flavor.",
    descriptionKo: "교토 우지산 프리미엄 의식용 말차. 첫 수확 찻잎을 석磨로 갈아 가장 섬세하고 생생한 맛을 구현했습니다.",
    descriptionZh: "来自京都宇治的高级仪式级抹茶。采用初摘茶叶石磨研磨，呈现最细腻、最鲜活的风味。",
  },
  {
    id: "kimchi-001",
    name: "Traditional Kimchi",
    nameKo: "김치",
    nameZh: "传统泡菜",
    brand: "Jongga",
    price: 7.99,
    image: kimchiImg,
    category: "Fermented & Pickled",
    weight: "14oz",
    inStock: true,
    rating: 4.6,
    reviewCount: 1890,
    fulfillment: ["delivery", "pickup", "shipping"],
    description: "Naturally fermented napa cabbage kimchi with Korean chili flakes, garlic, and fish sauce. Aged to perfection.",
    descriptionKo: "한국산 고춧가루, 마늘, 액젓으로 자연 발효한 배추김치. 완벽하게 숙성되었습니다.",
    descriptionZh: "用韩国辣椒碎、大蒜和鱼露自然发酵的大白菜泡菜。完美陈酿。",
  },
  {
    id: "soju-001",
    name: "Chamisul Fresh Soju",
    nameKo: "참이슬",
    nameZh: "真露烧酒",
    brand: "Jinro",
    price: 6.99,
    image: sojuImg,
    category: "Beverages",
    weight: "360ml",
    inStock: true,
    rating: 4.4,
    reviewCount: 789,
    fulfillment: ["pickup"],
    description: "Korea's #1 selling soju. Clean, smooth, and refreshing with 16.9% ABV. Best enjoyed chilled.",
    descriptionKo: "한국 판매 1위 소주. 깔끔하고 부드러우며 상쾌한 맛, 알코올 도수 16.9%. 차갑게 드시면 가장 좋습니다.",
    descriptionZh: "韩国销量第一的烧酒。清爽、顺滑、令人神清气爽，酒精度16.9%。冰镇后饮用最佳。",
    storeName: "H Mart Manhattan",
  },
  {
    id: "sesame-oil-001",
    name: "Pure Sesame Oil",
    nameKo: "참기름",
    nameZh: "纯芝麻油",
    brand: "Kadoya",
    price: 9.49,
    image: sesameOilImg,
    category: "Sauces & Condiments",
    weight: "5.5oz",
    inStock: true,
    rating: 4.8,
    reviewCount: 1456,
    fulfillment: ["delivery", "pickup", "shipping"],
    description: "100% pure roasted sesame oil. Rich, nutty aroma that elevates any Asian dish. Cold-pressed for maximum flavor.",
    descriptionKo: "100% 순수 볶은 참기름. 풍부하고 고소한 향으로 모든 아시아 요리의 맛을 높여줍니다. 냉압착 방식으로 최상의 풍미를 살렸습니다.",
    descriptionZh: "100%纯烘烤芝麻油。浓郁的坚果香气提升任何亚洲菜肴的风味。冷压工艺最大程度保留风味。",
  },
  {
    id: "mochi-001",
    name: "Mochi Ice Cream",
    nameKo: "모찌",
    nameZh: "麻薯冰淇淋",
    brand: "My/Mochi",
    price: 5.99,
    image: mochiImg,
    category: "Frozen",
    weight: "6-pack",
    inStock: true,
    isSponsored: true,
    rating: 4.5,
    reviewCount: 2345,
    fulfillment: ["delivery", "pickup"],
    description: "Premium mochi ice cream in assorted flavors. Sweet rice dough wrapped around creamy ice cream.",
    descriptionKo: "다양한 맛의 프리미엄 모찌 아이스크림. 달콤한 찹쌀떡으로 감싼 부드러운 아이스크림.",
    descriptionZh: "多种口味的高级麻薯冰淇淋。甜糯米皮包裹奶油冰淇淋。",
    storeName: "H Mart Manhattan",
  },
];

export const categories = [
  { id: "vegetables", name: "Vegetables", nameKo: "채소", nameZh: "蔬菜" },
  { id: "meat-seafood", name: "Meat & Seafood", nameKo: "육류 & 해산물", nameZh: "肉类 & 海鲜" },
  { id: "pantry", name: "Pantry Staples", nameKo: "식료품", nameZh: "食品杂货" },
  { id: "frozen", name: "Frozen", nameKo: "냉동식품", nameZh: "冷冻食品" },
  { id: "noodles", name: "Noodles & Ramen", nameKo: "면류", nameZh: "面条 & 拉面" },
  { id: "beverages", name: "Beverages", nameKo: "음료", nameZh: "饮料" },
  { id: "snacks", name: "Snacks", nameKo: "과자", nameZh: "零食" },
  { id: "fermented", name: "Fermented & Pickled", nameKo: "발효식품", nameZh: "发酵 & 腌制" },
];

export const stores = [
  { id: "manhattan", name: "H Mart Manhattan", address: "124 Lexington Ave, New York, NY 10016", distance: "0.3 mi" },
  { id: "flushing", name: "H Mart Flushing", address: "141-40 Northern Blvd, Queens, NY 11354", distance: "7.2 mi" },
  { id: "jersey-city", name: "H Mart Jersey City", address: "321 Central Ave, Jersey City, NJ 07307", distance: "4.1 mi" },
];
