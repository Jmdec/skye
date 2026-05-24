export interface Product {
  id: string;
  name: string;
  category: "skincare" | "fragrance" | "wellness";
  price: number;
  image: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  size: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Luminous Radiance Serum",
    category: "skincare",
    price: 89.0,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop",
    description:
      "Transform your skin with our flagship vitamin C and hyaluronic acid serum, formulated with Australian native botanicals. This lightweight, fast-absorbing formula delivers powerful antioxidant protection while deeply hydrating and brightening the complexion.",
    shortDescription:
      "Brightening vitamin C serum with hyaluronic acid and botanical extracts",
    benefits: [
      "Brightens dull skin",
      "Reduces fine lines",
      "Improves skin texture",
      "Provides antioxidant protection",
    ],
    ingredients: [
      "Vitamin C (20%)",
      "Hyaluronic Acid",
      "Australian Bush Plum Extract",
      "Kakadu Plum Powder",
    ],
    size: "30ml",
    inStock: true,
  },
  {
    id: "2",
    name: "Silk Renewal Night Cream",
    category: "skincare",
    price: 125.0,
    image:
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&auto=format&fit=crop",
    description:
      "Our luxurious night cream harnesses the power of peptides and rose hip oil to repair and regenerate skin while you sleep. Wake to visibly firmer, more radiant skin with improved elasticity and a silky-smooth texture.",
    shortDescription: "Intensive night cream with peptides and rose hip oil",
    benefits: [
      "Firms and lifts skin",
      "Reduces wrinkles",
      "Enhances elasticity",
      "Deeply nourishing",
    ],
    ingredients: [
      "Peptide Complex",
      "Rose Hip Oil",
      "Retinol Alternative",
      "Squalane",
    ],
    size: "50ml",
    inStock: true,
  },
  {
    id: "3",
    name: "Pure Essence Eye Contour",
    category: "skincare",
    price: 72.0,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop",
    description:
      "Delicate yet effective, our eye contour cream targets fine lines, puffiness, and dark circles with caffeine, peptides, and cooling minerals. The lightweight formula absorbs instantly without tugging at sensitive skin.",
    shortDescription: "Targeted eye cream for fine lines and puffiness",
    benefits: [
      "Reduces dark circles",
      "Minimizes fine lines",
      "Decreases puffiness",
      "Brightens under-eye area",
    ],
    ingredients: [
      "Caffeine Extract",
      "Peptide Complex",
      "Mineral Salts",
      "Vitamin K",
    ],
    size: "15ml",
    inStock: true,
  },
  {
    id: "4",
    name: "Hydra Quench Facial Mist",
    category: "skincare",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop",
    description:
      "This refreshing facial mist combines Australian spring water with hyaluronic acid and rose extract for an instant hydration boost. Perfect for refreshing makeup throughout the day or as a post-workout skin soother.",
    shortDescription:
      "Hydrating facial mist with rose water and hyaluronic acid",
    benefits: [
      "Instant hydration",
      "Refreshes makeup",
      "Soothes irritated skin",
      "Balances pH",
    ],
    ingredients: [
      "Australian Spring Water",
      "Hyaluronic Acid",
      "Rose Water",
      "Aloe Vera Extract",
    ],
    size: "100ml",
    inStock: true,
  },
  {
    id: "5",
    name: "Velvet Bloom Eau de Parfum",
    category: "fragrance",
    price: 155.0,
    image:
      "https://images.unsplash.com/photo-1708265500552-c256df13d3ca?w=600&auto=format&fit=crop",
    description:
      "An intoxicating floral fragrance that captures the essence of an Australian native garden in full bloom. Notes of rose, peony, and sandalwood create a sophisticated, long-lasting scent that evolves beautifully throughout the day.",
    shortDescription:
      "Luxurious floral fragrance with rose, peony, and sandalwood",
    benefits: [
      "Long-lasting (8+ hours)",
      "Luxurious scent profile",
      "Subtle sillage",
      "Timeless elegance",
    ],
    ingredients: ["Bulgarian Rose", "Pink Peony", "Sandalwood", "Musk Base"],
    size: "50ml",
    inStock: true,
  },
  {
    id: "6",
    name: "Golden Hour Eau de Toilette",
    category: "fragrance",
    price: 118.0,
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&auto=format&fit=crop",
    description:
      "Celebrate the magic hour with this warm, sophisticated fragrance. A blend of citrus, amber, and vanilla creates a luminous scent that's perfect for both day and evening wear. Fresh, inviting, and undeniably luxurious.",
    shortDescription: "Warm citrus fragrance with amber and vanilla",
    benefits: [
      "Versatile for day and night",
      "Uplifting scent",
      "Medium longevity",
      "Signature scent potential",
    ],
    ingredients: ["Bergamot", "Amber", "Vanilla Bean", "Cedarwood"],
    size: "50ml",
    inStock: true,
  },
  {
    id: "7",
    name: "Sleep Serenity Pillow Mist",
    category: "wellness",
    price: 38.0,
    image:
      "https://images.unsplash.com/photo-1556229162-5c63ed9c4efb?w=600&auto=format&fit=crop",
    description:
      "Transform your bedtime routine with this calming pillow mist infused with lavender, chamomile, and sandalwood. Spray lightly on pillows and sheets to create a peaceful sleep environment and drift off to the soothing scent.",
    shortDescription: "Calming pillow mist with lavender and chamomile",
    benefits: [
      "Promotes better sleep",
      "Reduces stress",
      "Creates calming environment",
      "Natural ingredients",
    ],
    ingredients: [
      "Lavender Essential Oil",
      "Chamomile Extract",
      "Sandalwood Oil",
      "Spring Water",
    ],
    size: "100ml",
    inStock: true,
  },
  {
    id: "8",
    name: "Detox Wellness Tea Blend",
    category: "wellness",
    price: 34.0,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop",
    description:
      "Our artfully blended detox tea combines organic green tea, chrysanthemum, goji berries, and ginger for a refreshing wellness drink. Support your body's natural detoxification while enjoying a delicious, warming cup of goodness.",
    shortDescription: "Organic detox tea blend with green tea and botanicals",
    benefits: [
      "Supports detoxification",
      "Boosts immunity",
      "Provides antioxidants",
      "Improves digestion",
    ],
    ingredients: [
      "Organic Green Tea",
      "Chrysanthemum Flowers",
      "Goji Berries",
      "Fresh Ginger Root",
    ],
    size: "50g (25 servings)",
    inStock: true,
  },
  {
    id: "9",
    name: "Crystal Clarity Facial Oil",
    category: "skincare",
    price: 95.0,
    image:
      "https://images.unsplash.com/photo-1527206849040-ae3110e4ff88?w=600&auto=format&fit=crop",
    description:
      "A luxurious blend of cold-pressed plant oils enriched with crystal-infused water for ultimate skin rejuvenation. Absorbs quickly without feeling greasy, leaving skin luminous and deeply nourished.",
    shortDescription: "Crystal-infused facial oil with cold-pressed plant oils",
    benefits: [
      "Brightens complexion",
      "Nourishes deeply",
      "Balances skin barrier",
      "Non-greasy formula",
    ],
    ingredients: [
      "Jojoba Oil",
      "Argan Oil",
      "Rose Hip Oil",
      "Crystal-infused Water",
    ],
    size: "30ml",
    inStock: true,
  },
  {
    id: "10",
    name: "Glow Ritual Cleansing Balm",
    category: "skincare",
    price: 68.0,
    image:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600&auto=format&fit=crop",
    description:
      "This luxe cleansing balm melts away makeup and impurities while nourishing your skin. Infused with botanical oils and shea butter, it transforms from a solid balm to a silky oil, leaving skin soft, clean, and supple.",
    shortDescription: "Nourishing cleansing balm with botanical oils",
    benefits: [
      "Removes all makeup",
      "Deeply cleanses",
      "Nourishes skin",
      "Gentle formula",
    ],
    ingredients: [
      "Shea Butter",
      "Coconut Oil",
      "Sweet Almond Oil",
      "Vitamin E",
    ],
    size: "100ml",
    inStock: true,
  },
  {
    id: "11",
    name: "Harmony Mind & Body Oil",
    category: "wellness",
    price: 52.0,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop",
    description:
      "A therapeutic blend of essential oils designed to calm the mind and relax the body. Perfect for massage, diffusing, or adding to your bath. Experience the restorative power of nature's most soothing botanicals.",
    shortDescription: "Therapeutic essential oil blend for relaxation",
    benefits: [
      "Reduces anxiety",
      "Promotes relaxation",
      "Relieves tension",
      "Uplifting aroma",
    ],
    ingredients: [
      "Lavender Oil",
      "Eucalyptus Oil",
      "Ylang Ylang Oil",
      "Carrier Oil Blend",
    ],
    size: "30ml",
    inStock: true,
  },
  {
    id: "12",
    name: "Radiant Glow Face Mask",
    category: "skincare",
    price: 56.0,
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop",
    description:
      "This luxurious sheet mask is soaked in a potent serum of gold particles, hyaluronic acid, and botanical extracts. Just 15 minutes delivers visible brightening, hydration, and a luminous, healthy glow.",
    shortDescription:
      "Hydrating and brightening sheet mask with gold particles",
    benefits: [
      "Instant hydration",
      "Brightens skin",
      "Reduces appearance of pores",
      "Refreshing treatment",
    ],
    ingredients: [
      "Gold Particles",
      "Hyaluronic Acid",
      "Honey Extract",
      "Botanical Serums",
    ],
    size: "5 masks per box",
    inStock: true,
  },
];

export function getProducts(category?: string): Product[] {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}
