import os
import json
import pickle
import time
from data_loader import generate_market_basket_dataset, calculate_eda_metrics
from miners import FrequentPatternEngine, AssociationRule

def run_export_pipeline():
    print("=" * 65)
    print("CRISP-DM Phase 4 & 5: Frequent Pattern Mining & Evaluation Pipeline")
    print("=" * 65)

    checkpoint_dir = os.path.join(os.path.dirname(__file__), "checkpoints")
    os.makedirs(checkpoint_dir, exist_ok=True)

    # 1. Generate Transactions
    transactions = generate_market_basket_dataset(1000, random_state=42)
    tx_path = os.path.join(checkpoint_dir, "transactions.json")
    with open(tx_path, "w", encoding="utf-8") as f:
        json.dump(transactions, f, indent=2)
    print(f"[+] 1,000 transactions saved to {tx_path}")

    # 2. Compute EDA Metrics
    eda = calculate_eda_metrics(transactions)
    eda_path = os.path.join(checkpoint_dir, "eda_metrics.json")
    with open(eda_path, "w", encoding="utf-8") as f:
        json.dump(eda, f, indent=2)
    print(f"[+] EDA statistics & item distributions saved to {eda_path}")

    # 3. Instantiate Mining Engine
    engine = FrequentPatternEngine(transactions)

    # 4. Multi-Algorithm Speed Benchmark
    support_thresholds = [0.10, 0.08, 0.05, 0.03]
    benchmark_results = []

    print("\n--- Running Algorithm Runtimes Benchmark ---")
    for s in support_thresholds:
        _, apriori_time = engine.mine_apriori(min_support=s)
        _, fp_time = engine.mine_fp_growth(min_support=s)
        _, eclat_time = engine.mine_eclat(min_support=s)

        print(f"Support = {s*100:04.1f}% | Apriori: {apriori_time*1000:06.2f}ms | FP-Growth: {fp_time*1000:06.2f}ms | ECLAT: {eclat_time*1000:06.2f}ms")
        benchmark_results.append({
            "min_support": s,
            "apriori_ms": round(apriori_time * 1000, 2),
            "fp_growth_ms": round(fp_time * 1000, 2),
            "eclat_ms": round(eclat_time * 1000, 2),
        })

    # 5. Mine Baseline Itemsets & Association Rules
    frequent_itemsets, _ = engine.mine_fp_growth(min_support=0.03)
    rules = engine.generate_rules(frequent_itemsets, min_confidence=0.25, min_lift=1.1)

    print(f"\n[+] Frequent Itemsets Mined: {len(frequent_itemsets)} itemsets")
    print(f"[+] Association Rules Generated: {len(rules)} strong rules (Lift >= 1.1x)")

    # Print Top 5 Rules by Lift
    print("\n--- Top 5 Association Rules by Lift ---")
    for r in rules[:5]:
        print(f"Rule: {r.to_dict()['rule_str']} | Lift: {r.lift}x | Conf: {r.confidence*100:.1f}% | Supp: {r.support*100:.1f}%")

    # 6. Build Association Network Graph
    network_graph = engine.build_network_graph(rules, top_n=30)
    print(f"[+] Network Graph created: {network_graph['total_nodes']} nodes, {network_graph['total_links']} directed edges")

    # 7. Convert Itemsets for JSON export
    formatted_itemsets = [
        {"items": list(k), "items_str": " + ".join(k), "length": len(k), "support": v}
        for k, v in frequent_itemsets.items()
    ]
    formatted_itemsets.sort(key=lambda x: (x["length"], -x["support"]))

    # 8. Export Mining Report JSON
    report = {
        "dataset_summary": {
            "total_transactions": len(transactions),
            "unique_items": eda["total_unique_items"],
            "avg_basket_size": eda["avg_basket_size"],
        },
        "benchmark_runtimes": benchmark_results,
        "frequent_itemsets_count": len(frequent_itemsets),
        "frequent_itemsets": formatted_itemsets[:60], # Top 60 for frontend preview
        "total_rules": len(rules),
        "rules": [r.to_dict() for r in rules],
        "network_graph": network_graph,
    }

    report_path = os.path.join(checkpoint_dir, "mining_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Full mining report & network graph saved to {report_path}")

    # 9. Pickle Mining Pipeline
    pkl_path = os.path.join(checkpoint_dir, "miners.pkl")
    with open(pkl_path, "wb") as f:
        pickle.dump({
            "transactions": transactions,
            "rules": rules,
            "frequent_itemsets": frequent_itemsets,
        }, f)
    print(f"[+] Mined rules & model objects pickled to {pkl_path}")
    print("\n[OK] Pipeline completed successfully!")

if __name__ == "__main__":
    run_export_pipeline()
