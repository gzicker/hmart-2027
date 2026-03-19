/**
 * Real recipes and product pairing rules mapped to VTEX catalog categories.
 *
 * Category keywords come from the hmartusqa VTEX category tree:
 *   Ramen&Noodle, Instant/Quick Food, Snacks&Candy&Nuts, Beverage & Coffee & Tea & Honey,
 *   Rice&Grain, Flour&Baking, Paste&Marinate&Sauce, Refrigerated, etc.
 */

import recipeTteokbokki from "@/assets/recipe-tteokbokki.jpg";
import recipeBibimbap from "@/assets/recipe-bibimbap.jpg";
import recipeRamyeon from "@/assets/recipe-ramyeon.jpg";
import recipeJapchae from "@/assets/recipe-japchae.jpg";
import recipeKimbap from "@/assets/recipe-kimbap.jpg";

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

export interface Recipe {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  image: string;
  time: string;
  serves: string;
  rating: number;
  /** Category keywords that trigger this recipe on a PDP */
  matchCategories: string[];
  /** VTEX search terms for "Add all ingredients" */
  ingredientSearchTerms: string[];
  /** Search term for the CTA link */
  ctaSearch: string;
}

export const RECIPES: Recipe[] = [
  {
    id: "tteokbokki",
    title: "Spicy Tteokbokki",
    titleKo: "떡볶이",
    description: "Chewy rice cakes swimming in a fiery gochujang sauce — Seoul's most beloved street food. Ready in 20 minutes with just a handful of pantry staples.",
    image: recipeTteokbokki,
    time: "20 min",
    serves: "Serves 2",
    rating: 4.9,
    matchCategories: ["rice cake", "tteokbokki", "gochujang", "red pepper paste", "instant/quick food"],
    ingredientSearchTerms: ["rice cake", "gochujang"],
    ctaSearch: "tteokbokki",
  },
  {
    id: "bibimbap",
    title: "Classic Bibimbap",
    titleKo: "비빔밥",
    description: "A colorful bowl of steamed rice topped with sautéed vegetables, gochujang, sesame oil, and a perfectly fried egg. The ultimate Korean comfort meal.",
    image: recipeBibimbap,
    time: "30 min",
    serves: "Serves 2",
    rating: 4.8,
    matchCategories: ["rice", "grain", "gochujang", "sesame", "paste", "marinate", "sauce"],
    ingredientSearchTerms: ["rice", "gochujang", "sesame oil"],
    ctaSearch: "bibimbap",
  },
  {
    id: "ramyeon",
    title: "Loaded Ramyeon",
    titleKo: "라면",
    description: "Upgrade your instant ramen with a soft-boiled egg, fresh scallions, and a slice of cheese. The perfect quick meal for a cold night.",
    image: recipeRamyeon,
    time: "10 min",
    serves: "Serves 1",
    rating: 4.7,
    matchCategories: ["ramen", "noodle", "ramen bundle", "ramen box", "ramen single", "ramen bowl"],
    ingredientSearchTerms: ["ramen", "noodle"],
    ctaSearch: "ramen",
  },
  {
    id: "japchae",
    title: "Japchae Glass Noodles",
    titleKo: "잡채",
    description: "Sweet potato glass noodles stir-fried with vegetables, soy sauce, and sesame oil. A staple side dish at every Korean celebration.",
    image: recipeJapchae,
    time: "35 min",
    serves: "Serves 4",
    rating: 4.8,
    matchCategories: ["dried noddle", "fresh noddle", "vermicelli", "soy sauce", "sesame"],
    ingredientSearchTerms: ["glass noodle", "soy sauce", "sesame oil"],
    ctaSearch: "japchae",
  },
  {
    id: "kimbap",
    title: "Classic Kimbap",
    titleKo: "김밥",
    description: "Korean seaweed rice rolls filled with pickled radish, spinach, egg, and your choice of protein. A perfect lunchbox staple.",
    image: recipeKimbap,
    time: "40 min",
    serves: "Serves 3-4",
    rating: 4.9,
    matchCategories: ["rice", "seaweed", "flour", "baking"],
    ingredientSearchTerms: ["seaweed", "rice", "sesame oil"],
    ctaSearch: "kimbap",
  },
];

// ---------------------------------------------------------------------------
// Perfect Pair rules — category keyword → complementary search term
// ---------------------------------------------------------------------------

export interface PairingRule {
  /** Keywords to match against product name or category (lowercase) */
  matchKeywords: string[];
  /** VTEX search term for the paired product */
  pairSearchTerm: string;
  /** Friendly label for what makes it a good pair */
  reason: string;
}

export const PAIRING_RULES: PairingRule[] = [
  {
    matchKeywords: ["rice cake", "tteokbokki", "mochi"],
    pairSearchTerm: "gochujang",
    reason: "Perfect sauce for rice cakes",
  },
  {
    matchKeywords: ["gochujang", "red pepper paste", "paste"],
    pairSearchTerm: "rice cake",
    reason: "Make tteokbokki at home",
  },
  {
    matchKeywords: ["ramen", "ramyun", "noodle"],
    pairSearchTerm: "rice",
    reason: "Rice to finish the broth",
  },
  {
    matchKeywords: ["rice", "grain", "cooked rice"],
    pairSearchTerm: "sesame",
    reason: "Essential Korean rice topping",
  },
  {
    matchKeywords: ["soy sauce", "sauce", "marinate"],
    pairSearchTerm: "noodle",
    reason: "Great with stir-fried noodles",
  },
  {
    matchKeywords: ["snack", "candy", "chocolate", "cookie"],
    pairSearchTerm: "tea",
    reason: "Perfect tea-time pairing",
  },
  {
    matchKeywords: ["tea", "coffee", "honey"],
    pairSearchTerm: "snack",
    reason: "A snack to go with your drink",
  },
  {
    matchKeywords: ["milk", "banana", "juice", "soda", "beverage"],
    pairSearchTerm: "snack",
    reason: "Grab a snack with your drink",
  },
  {
    matchKeywords: ["dumpling", "kastsu", "tempura"],
    pairSearchTerm: "soy sauce",
    reason: "Classic dipping sauce",
  },
  {
    matchKeywords: ["flour", "batter", "pancake mix"],
    pairSearchTerm: "sauce",
    reason: "Dipping sauce for pancakes",
  },
  {
    matchKeywords: ["sesame oil", "sesame"],
    pairSearchTerm: "rice",
    reason: "Drizzle on hot steamed rice",
  },
  {
    matchKeywords: ["kimchi"],
    pairSearchTerm: "ramen",
    reason: "Kimchi ramen is the best combo",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find the best pairing rule for a product based on its name and category.
 * Returns null if no rule matches — the UI should hide the pair button.
 */
export function findPairingRule(productName: string, productCategory: string): PairingRule | null {
  const text = `${productName} ${productCategory}`.toLowerCase();
  return PAIRING_RULES.find(rule =>
    rule.matchKeywords.some(kw => text.includes(kw))
  ) || null;
}

/**
 * Find the best recipe that matches a product's name/category.
 */
export function findRecipeForProduct(productName: string, productCategory: string): Recipe | null {
  const text = `${productName} ${productCategory}`.toLowerCase();
  return RECIPES.find(recipe =>
    recipe.matchCategories.some(cat => text.includes(cat))
  ) || null;
}

/**
 * Get the "Recipe of the Week" — rotates weekly based on current date.
 */
export function getWeeklyRecipe(): Recipe {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return RECIPES[weekNumber % RECIPES.length];
}
