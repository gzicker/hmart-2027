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
  storeName?: string;
}

export const products: Product[] = [
  {
    id: "gochujang-001",
    name: "Premium Gochujang",
    nameKo: "고추장",
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
    storeName: "H Mart Manhattan",
  },
  {
    id: "tteok-001",
    name: "Fresh Rice Cakes",
    nameKo: "떡",
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
    storeName: "H Mart Manhattan",
  },
  {
    id: "ramen-001",
    name: "Shin Ramyun Black",
    nameKo: "신라면 블랙",
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
  },
  {
    id: "napa-001",
    name: "Napa Cabbage",
    nameKo: "배추",
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
    storeName: "H Mart Manhattan",
  },
  {
    id: "bulgogi-001",
    name: "Marinated Bulgogi",
    nameKo: "불고기",
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
    storeName: "H Mart Manhattan",
  },
  {
    id: "matcha-001",
    name: "Ceremonial Matcha",
    nameKo: "말차",
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
  },
  {
    id: "kimchi-001",
    name: "Traditional Kimchi",
    nameKo: "김치",
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
  },
  {
    id: "soju-001",
    name: "Chamisul Fresh Soju",
    nameKo: "참이슬",
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
    storeName: "H Mart Manhattan",
  },
  {
    id: "sesame-oil-001",
    name: "Pure Sesame Oil",
    nameKo: "참기름",
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
  },
  {
    id: "mochi-001",
    name: "Mochi Ice Cream",
    nameKo: "모찌",
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
    storeName: "H Mart Manhattan",
  },
];

export const categories = [
  { id: "vegetables", name: "Vegetables", nameKo: "채소" },
  { id: "meat-seafood", name: "Meat & Seafood", nameKo: "육류 & 해산물" },
  { id: "pantry", name: "Pantry Staples", nameKo: "식료품" },
  { id: "frozen", name: "Frozen", nameKo: "냉동식품" },
  { id: "noodles", name: "Noodles & Ramen", nameKo: "면류" },
  { id: "beverages", name: "Beverages", nameKo: "음료" },
  { id: "snacks", name: "Snacks", nameKo: "과자" },
  { id: "fermented", name: "Fermented & Pickled", nameKo: "발효식품" },
];

export const stores = [
  { id: "manhattan", name: "H Mart Manhattan", address: "124 Lexington Ave, New York, NY 10016", distance: "0.3 mi" },
  { id: "flushing", name: "H Mart Flushing", address: "141-40 Northern Blvd, Queens, NY 11354", distance: "7.2 mi" },
  { id: "jersey-city", name: "H Mart Jersey City", address: "321 Central Ave, Jersey City, NJ 07307", distance: "4.1 mi" },
];
