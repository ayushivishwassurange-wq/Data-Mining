import os
import json
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple

# Canonical retail product catalog across 6 major grocery/retail aisles
PRODUCT_CATALOG = {
    "Bakery": ["French Baguette", "Whole Wheat Bread", "Butter Croissant", "Blueberry Muffin", "Bagels"],
    "Dairy": ["Organic Whole Milk", "Greek Yogurt", "Salted Butter", "Cheddar Cheese", "Eggs (Dozen)"],
    "Produce": ["Bananas", "Organic Avocados", "Fresh Tomatoes", "Baby Spinach", "Apples", "Lemons"],
    "Pantry": ["Italian Pasta", "Organic Tomato Sauce", "Extra Virgin Olive Oil", "Ground Coffee", "Pure Honey", "Basmati Rice"],
    "Snacks": ["Tortilla Chips", "Fresh Salsa", "Dark Chocolate", "Roasted Almonds", "Granola Bars"],
    "Beverages": ["Red Wine", "Craft Beer", "Green Tea", "Sparkling Water", "Orange Juice"]
}

# Strong affinity rule bundles (real-world market basket co-occurrence patterns)
AFFINITY_BUNDLES = [
    # Italian Dinner bundle
    {"items": ["Italian Pasta", "Organic Tomato Sauce", "Extra Virgin Olive Oil", "Cheddar Cheese", "Red Wine"], "prob": 0.35},
    # Breakfast bundle
    {"items": ["Organic Whole Milk", "Butter Croissant", "Eggs (Dozen)", "Ground Coffee", "Orange Juice"], "prob": 0.40},
    # Mexican Fiesta / Snack bundle
    {"items": ["Tortilla Chips", "Fresh Salsa", "Organic Avocados", "Craft Beer", "Lemons"], "prob": 0.32},
    # Healthy Smoothie bundle
    {"items": ["Greek Yogurt", "Baby Spinach", "Bananas", "Blueberry Muffin", "Pure Honey"], "prob": 0.28},
    # Bakery & Tea bundle
    {"items": ["French Baguette", "Salted Butter", "Green Tea", "Pure Honey"], "prob": 0.25},
    # Everyday Essentials
    {"items": ["Whole Wheat Bread", "Organic Whole Milk", "Eggs (Dozen)", "Bananas", "Apples"], "prob": 0.45},
]

def generate_market_basket_dataset(n_transactions: int = 1000, random_state: int = 42) -> List[List[str]]:
    """
    Generates a realistic 1,000-basket retail transaction dataset with
    natural item co-occurrences, category hierarchies, and realistic basket size distribution.
    """
    np.random.seed(random_state)
    all_items = [item for sublist in PRODUCT_CATALOG.values() for item in sublist]
    transactions = []

    for t_id in range(n_transactions):
        basket = set()

        # 1. Roll for affinity bundle activations
        for bundle in AFFINITY_BUNDLES:
            if np.random.rand() < bundle["prob"]:
                # Pick a random subset of 2 to 4 items from this bundle
                k = np.random.randint(2, min(len(bundle["items"]) + 1, 5))
                chosen = np.random.choice(bundle["items"], size=k, replace=False)
                basket.update(chosen)

        # 2. Add random background impulse items
        basket_target_size = max(2, int(np.random.exponential(3.5) + 1))
        while len(basket) < basket_target_size:
            random_item = np.random.choice(all_items)
            basket.add(random_item)

        # Ensure basket is between 2 and 10 items
        basket_list = sorted(list(basket))[:10]
        transactions.append(basket_list)

    return transactions

def calculate_eda_metrics(transactions: List[List[str]]) -> Dict[str, Any]:
    """
    Calculates item frequencies, basket size distribution, co-occurrence counts, and category statistics.
    """
    total_tx = len(transactions)
    item_counts: Dict[str, int] = {}
    basket_sizes: List[int] = []
    co_occurrence: Dict[str, Dict[str, int]] = {}

    for tx in transactions:
        basket_sizes.append(len(tx))
        for item in tx:
            item_counts[item] = item_counts.get(item, 0) + 1

        # Pairwise co-occurrences
        for i in range(len(tx)):
            for j in range(i + 1, len(tx)):
                it_a, it_b = tx[i], tx[j]
                if it_a not in co_occurrence:
                    co_occurrence[it_a] = {}
                if it_b not in co_occurrence:
                    co_occurrence[it_b] = {}
                co_occurrence[it_a][it_b] = co_occurrence[it_a].get(it_b, 0) + 1
                co_occurrence[it_b][it_a] = co_occurrence[it_b].get(it_a, 0) + 1

    # Sort items by frequency
    sorted_items = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)
    top_items = [
        {"item": k, "count": v, "support": round(v / total_tx, 4)}
        for k, v in sorted_items[:15]
    ]

    # Basket size distribution histogram
    size_counts: Dict[int, int] = {}
    for s in basket_sizes:
        size_counts[s] = size_counts.get(s, 0) + 1

    basket_size_hist = [
        {"basket_size": k, "count": size_counts[k]}
        for k in sorted(size_counts.keys())
    ]

    # Category share
    cat_counts: Dict[str, int] = {}
    item_to_cat = {}
    for cat, items in PRODUCT_CATALOG.items():
        for it in items:
            item_to_cat[it] = cat

    for it, cnt in item_counts.items():
        cat = item_to_cat.get(it, "Other")
        cat_counts[cat] = cat_counts.get(cat, 0) + cnt

    category_share = [
        {"category": k, "total_item_sales": v, "percentage": round((v / sum(cat_counts.values())) * 100, 1)}
        for k, v in cat_counts.items()
    ]

    # Flatten top pairwise co-occurrences
    pair_list = []
    seen_pairs = set()
    for it_a, neighbors in co_occurrence.items():
        for it_b, count in neighbors.items():
            pair_key = tuple(sorted([it_a, it_b]))
            if pair_key not in seen_pairs:
                seen_pairs.add(pair_key)
                pair_list.append({
                    "item_a": pair_key[0],
                    "item_b": pair_key[1],
                    "co_occurrence_count": count,
                    "joint_support": round(count / total_tx, 4)
                })

    top_pairs = sorted(pair_list, key=lambda x: x["co_occurrence_count"], reverse=True)[:15]

    return {
        "total_transactions": total_tx,
        "total_unique_items": len(item_counts),
        "avg_basket_size": round(float(np.mean(basket_sizes)), 2),
        "median_basket_size": int(np.median(basket_sizes)),
        "max_basket_size": max(basket_sizes),
        "top_frequent_items": top_items,
        "basket_size_distribution": basket_size_hist,
        "category_share": category_share,
        "top_pairwise_affinities": top_pairs,
        "product_catalog": PRODUCT_CATALOG,
    }

if __name__ == "__main__":
    txs = generate_market_basket_dataset(1000)
    print(f"[+] Generated {len(txs)} transactions. Sample basket 1: {txs[0]}")
    eda = calculate_eda_metrics(txs)
    print(f"[+] Total unique items: {eda['total_unique_items']}, Avg basket size: {eda['avg_basket_size']}")
    print(f"[+] Top item: {eda['top_frequent_items'][0]}")
