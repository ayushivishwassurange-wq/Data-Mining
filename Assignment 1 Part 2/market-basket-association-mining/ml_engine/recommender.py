from typing import List, Dict, Any, Set
from miners import AssociationRule

class BasketRecommender:
    """
    Real-Time Market Basket Cross-Sell Recommender Engine.
    Matches active association rules against a customer's live cart
    to predict next likely purchases and trigger smart promotional bundles.
    """
    def __init__(self, rules: List[AssociationRule]):
        self.rules = rules

    def recommend(self, current_basket: List[str], top_k: int = 5) -> Dict[str, Any]:
        basket_set = set(current_basket)
        if not basket_set:
            return {
                "current_basket": [],
                "recommendations": [],
                "bundle_suggestions": [],
                "total_recommendations": 0,
            }

        candidate_items: Dict[str, Dict[str, Any]] = {}
        matched_rules = []

        for rule in self.rules:
            ant_set = set(rule.antecedent)
            con_set = set(rule.consequent)

            # Check if antecedent is in current basket AND consequent contains new items
            if ant_set.issubset(basket_set):
                new_items = con_set - basket_set
                if new_items:
                    matched_rules.append(rule.to_dict())
                    for item in new_items:
                        if item not in candidate_items:
                            candidate_items[item] = {
                                "item": item,
                                "max_confidence": rule.confidence,
                                "max_lift": rule.lift,
                                "support": rule.support,
                                "triggered_by": list(ant_set),
                                "rule_count": 1,
                            }
                        else:
                            candidate_items[item]["max_confidence"] = max(
                                candidate_items[item]["max_confidence"], rule.confidence
                            )
                            candidate_items[item]["max_lift"] = max(
                                candidate_items[item]["max_lift"], rule.lift
                            )
                            candidate_items[item]["rule_count"] += 1

        # Sort recommendations by product of confidence and lift
        ranked_recs = sorted(
            candidate_items.values(),
            key=lambda x: (x["max_confidence"] * x["max_lift"]),
            reverse=True
        )[:top_k]

        # Generate smart promotional bundles
        bundle_suggestions = []
        if len(ranked_recs) >= 1:
            top_rec = ranked_recs[0]
            bundle_suggestions.append({
                "title": f"Pair with {top_rec['item']}",
                "description": f"Customers buying {', '.join(top_rec['triggered_by'])} are {top_rec['max_lift']}x more likely to buy {top_rec['item']}.",
                "discount_pct": 15,
                "added_item": top_rec["item"],
                "expected_aov_uplift": f"+${round(top_rec['max_lift'] * 4.5, 2)}",
            })

        if len(ranked_recs) >= 2:
            second_rec = ranked_recs[1]
            bundle_suggestions.append({
                "title": f"Complete the Meal Combo",
                "description": f"Add both {top_rec['item']} and {second_rec['item']} for maximum pantry savings.",
                "discount_pct": 20,
                "added_item": f"{top_rec['item']} + {second_rec['item']}",
                "expected_aov_uplift": f"+${round((top_rec['max_lift'] + second_rec['max_lift']) * 3.8, 2)}",
            })

        return {
            "current_basket": current_basket,
            "basket_size": len(current_basket),
            "recommendations": ranked_recs,
            "bundle_suggestions": bundle_suggestions,
            "total_matched_rules": len(matched_rules),
            "top_matched_rules": matched_rules[:5],
        }
