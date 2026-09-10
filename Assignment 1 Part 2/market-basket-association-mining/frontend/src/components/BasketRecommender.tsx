import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Sparkles, 
  Gift, 
  Tag, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Package
} from 'lucide-react';
import { api } from '../api/client';
import { BasketRecommendResult, EdaData } from '../types';
import confetti from 'canvas-confetti';

const PRESET_CARTS = [
  {
    name: 'Italian Dinner Prep',
    items: ['Italian Pasta', 'Organic Tomato Sauce']
  },
  {
    name: 'Sunday Breakfast',
    items: ['Organic Whole Milk', 'Butter Croissant']
  },
  {
    name: 'Party Snack Pack',
    items: ['Tortilla Chips', 'Fresh Salsa']
  },
  {
    name: 'Baking Essentials',
    items: ['French Baguette', 'Salted Butter']
  }
];

export const BasketRecommender: React.FC = () => {
  const [cart, setCart] = useState<string[]>(['Italian Pasta', 'Organic Tomato Sauce']);
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [recommendationResult, setRecommendationResult] = useState<BasketRecommendResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const eda = await api.getEda();
        setCatalog(eda.product_catalog);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      }
    };
    fetchCatalog();
  }, []);

  const updateRecommendations = async (currentItems: string[]) => {
    try {
      setLoading(true);
      const res = await api.recommendBasket(currentItems, 5);
      setRecommendationResult(res);

      if (res.recommendations.length > 0 && currentItems.length >= 2) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#f97316', '#10b981', '#fbbf24']
        });
      }
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateRecommendations(cart);
  }, [cart]);

  const addItem = (item: string) => {
    if (!cart.includes(item)) {
      setCart([...cart, item]);
    }
  };

  const removeItem = (item: string) => {
    setCart(cart.filter(i => i !== item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const allItems = Object.entries(catalog).flatMap(([cat, items]) => 
    items.map(item => ({ item, category: cat }))
  );

  const filteredCatalogItems = activeCategory === 'All'
    ? allItems
    : allItems.filter(i => i.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Live Market Basket Cashier & Cross-Sell Recommender
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Add products to the simulated cart to instantly trigger high-lift association recommendations, calculate expected Average Order Value (AOV) uplift, and generate dynamic bundle discount coupons.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">
              Presets:
            </span>
            {PRESET_CARTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setCart(p.items)}
                className="text-xs bg-slate-800/80 hover:bg-amber-950 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 px-3 py-1 rounded-md shrink-0 border border-slate-700/60 transition-all"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Shopping Cart & Shelf Picker */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Cart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                Customer Basket ({cart.length} items)
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                Cart is empty. Click items from the shelf below to add.
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      {item}
                    </span>
                    <button
                      onClick={() => removeItem(item)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Catalog Shelf */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                Product Catalog Shelf
              </h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {['All', ...Object.keys(catalog)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activeCategory === cat ? 'bg-amber-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Chips Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredCatalogItems.map(({ item }) => {
                const inCart = cart.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => (inCart ? removeItem(item) : addItem(item))}
                    className={`p-2 rounded-xl border text-xs text-left font-medium transition-all flex items-center justify-between ${
                      inCart
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate mr-1">{item}</span>
                    <Plus className={`w-3.5 h-3.5 shrink-0 ${inCart ? 'rotate-45 text-amber-400' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Real-Time Recommendations & Bundle Coupons */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Cross-Sell Recommendations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Live Cross-Sell Recommendations ({recommendationResult?.recommendations.length || 0})
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {recommendationResult?.total_matched_rules || 0} Matched Rules
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                Matching association rules in real-time...
              </div>
            ) : recommendationResult && recommendationResult.recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendationResult.recommendations.map((rec) => (
                  <div
                    key={rec.item}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                        <span>{rec.item}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                          {rec.max_lift}x Lift
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        Triggered by: <strong className="text-slate-200">{rec.triggered_by.join(', ')}</strong> • Confidence: <strong className="text-emerald-400">{(rec.max_confidence * 100).toFixed(1)}%</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => addItem(rec.item)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shrink-0 flex items-center gap-1 shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No active association rules matched for current cart items. Add more items to trigger recommendations!
              </div>
            )}
          </div>

          {/* Dynamic Smart Promotional Bundle Coupons */}
          {recommendationResult && recommendationResult.bundle_suggestions.length > 0 && (
            <div className="bg-gradient-to-tr from-amber-950/40 via-slate-900/90 to-orange-950/30 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Gift className="w-5 h-5" />
                <span>Smart Bundle Discount Offers</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendationResult.bundle_suggestions.map((bundle, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/90 rounded-xl border border-amber-500/30 space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300">{bundle.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                        {bundle.discount_pct}% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {bundle.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400 border-t border-slate-900">
                      <span>Projected AOV: <strong>{bundle.expected_aov_uplift}</strong></span>
                      <button
                        onClick={() => {
                          const itemsToAdd = bundle.added_item.split(' + ');
                          setCart(Array.from(new Set([...cart, ...itemsToAdd])));
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                      >
                        Apply Bundle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
