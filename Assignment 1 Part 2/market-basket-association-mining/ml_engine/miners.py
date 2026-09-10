import time
import math
import itertools
from typing import List, Dict, Set, Tuple, Any, Optional
from collections import defaultdict

class AssociationRule:
    def __init__(
        self,
        antecedent: Tuple[str, ...],
        consequent: Tuple[str, ...],
        support: float,
        confidence: float,
        lift: float,
        leverage: float,
        conviction: float,
        zhang_metric: float,
    ):
        self.antecedent = list(antecedent)
        self.consequent = list(consequent)
        self.support = round(support, 4)
        self.confidence = round(confidence, 4)
        self.lift = round(lift, 3)
        self.leverage = round(leverage, 4)
        self.conviction = round(conviction, 3) if conviction != float("inf") else 999.0
        self.zhang_metric = round(zhang_metric, 3)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "antecedent": self.antecedent,
            "consequent": self.consequent,
            "antecedent_str": " + ".join(self.antecedent),
            "consequent_str": " + ".join(self.consequent),
            "rule_str": f"{' + '.join(self.antecedent)} -> {' + '.join(self.consequent)}",
            "support": self.support,
            "confidence": self.confidence,
            "lift": self.lift,
            "leverage": self.leverage,
            "conviction": self.conviction,
            "zhang_metric": self.zhang_metric,
        }


class FrequentPatternEngine:
    """
    Core Pattern Mining Engine featuring:
    1. Apriori (Level-wise Candidate Generation)
    2. FP-Growth (Frequent Pattern Tree with Conditional Bases)
    3. ECLAT (Vertical Tidset Intersections)
    4. Association Rule Generator (Support, Confidence, Lift, Leverage, Conviction, Zhang)
    """
    def __init__(self, transactions: List[List[str]]):
        self.transactions = [set(tx) for tx in transactions]
        self.n_transactions = len(transactions)

    # -------------------------------------------------------------
    # 1. APRIORI ALGORITHM
    # -------------------------------------------------------------
    def mine_apriori(self, min_support: float = 0.05) -> Tuple[Dict[Tuple[str, ...], float], float]:
        start_time = time.time()
        min_count = min_support * self.n_transactions

        # 1-itemsets
        item_counts: Dict[str, int] = defaultdict(int)
        for tx in self.transactions:
            for item in tx:
                item_counts[item] += 1

        current_L = {
            (item,): count / self.n_transactions
            for item, count in item_counts.items()
            if count >= min_count
        }

        all_frequent: Dict[Tuple[str, ...], float] = dict(current_L)
        k = 2

        while current_L:
            # Generate Candidate C_k
            prev_itemsets = list(current_L.keys())
            candidates = set()
            for i in range(len(prev_itemsets)):
                for j in range(i + 1, len(prev_itemsets)):
                    union_set = set(prev_itemsets[i]).union(set(prev_itemsets[j]))
                    if len(union_set) == k:
                        candidates.add(tuple(sorted(list(union_set))))

            # Count support for candidates
            candidate_counts: Dict[Tuple[str, ...], int] = defaultdict(int)
            for cand in candidates:
                cand_set = set(cand)
                for tx in self.transactions:
                    if cand_set.issubset(tx):
                        candidate_counts[cand] += 1

            # Prune infrequent candidates
            current_L = {
                cand: count / self.n_transactions
                for cand, count in candidate_counts.items()
                if count >= min_count
            }

            all_frequent.update(current_L)
            k += 1

        duration = time.time() - start_time
        return all_frequent, duration

    # -------------------------------------------------------------
    # 2. FP-GROWTH ALGORITHM (FP-Tree)
    # -------------------------------------------------------------
    class FPTreeNode:
        def __init__(self, item: Optional[str], count: int = 1, parent=None):
            self.item = item
            self.count = count
            self.parent = parent
            self.children: Dict[str, Any] = {}
            self.node_link = None

    def mine_fp_growth(self, min_support: float = 0.05) -> Tuple[Dict[Tuple[str, ...], float], float]:
        start_time = time.time()
        min_count = min_support * self.n_transactions

        # 1. First pass: count items
        item_counts: Dict[str, int] = defaultdict(int)
        for tx in self.transactions:
            for item in tx:
                item_counts[item] += 1

        # Frequent 1-items sorted by frequency descending
        frequent_items = {item: cnt for item, cnt in item_counts.items() if cnt >= min_count}
        if not frequent_items:
            return {}, time.time() - start_time

        sorted_items = sorted(frequent_items.keys(), key=lambda x: (-frequent_items[x], x))
        rank_map = {item: i for i, item in enumerate(sorted_items)}

        # 2. Second pass: build FP-Tree
        root = self.FPTreeNode(None, 0, None)
        header_table: Dict[str, Any] = {item: [frequent_items[item], None] for item in sorted_items}

        for tx in self.transactions:
            filtered_tx = [item for item in tx if item in frequent_items]
            filtered_tx.sort(key=lambda x: rank_map[x])
            
            # Insert into tree
            curr = root
            for item in filtered_tx:
                if item in curr.children:
                    curr.children[item].count += 1
                else:
                    new_node = self.FPTreeNode(item, 1, curr)
                    curr.children[item] = new_node
                    
                    # Link to header table
                    if header_table[item][1] is None:
                        header_table[item][1] = new_node
                    else:
                        head = header_table[item][1]
                        while head.node_link is not None:
                            head = head.node_link
                        head.node_link = new_node
                curr = curr.children[item]

        # 3. Mine FP-Tree recursively
        all_frequent: Dict[Tuple[str, ...], float] = {}

        def find_prefix_paths(node):
            paths = []
            counts = []
            while node is not None:
                path = []
                parent = node.parent
                while parent is not None and parent.item is not None:
                    path.append(parent.item)
                    parent = parent.parent
                if path:
                    paths.append(path)
                    counts.append(node.count)
                node = node.node_link
            return paths, counts

        def mine_tree(header, prefix):
            # Process items in reverse order of support
            for item in reversed(sorted_items):
                if item not in header or header[item][1] is None:
                    continue
                item_support = header[item][0] / self.n_transactions
                new_prefix = tuple(sorted(list(prefix) + [item]))
                all_frequent[new_prefix] = round(item_support, 4)

                # Conditional pattern base
                paths, counts = find_prefix_paths(header[item][1])
                cond_counts: Dict[str, int] = defaultdict(int)
                for path, cnt in zip(paths, counts):
                    for path_item in path:
                        cond_counts[path_item] += cnt

                # Build conditional FP-Tree
                cond_frequent = {pi: c for pi, c in cond_counts.items() if c >= min_count}
                if cond_frequent:
                    cond_root = self.FPTreeNode(None, 0, None)
                    cond_header = {pi: [cond_frequent[pi], None] for pi in cond_frequent}
                    
                    for path, cnt in zip(paths, counts):
                        valid_path = [pi for pi in path if pi in cond_frequent]
                        valid_path.sort(key=lambda x: rank_map.get(x, 999))
                        c_curr = cond_root
                        for pi in valid_path:
                            if pi in c_curr.children:
                                c_curr.children[pi].count += cnt
                            else:
                                c_new = self.FPTreeNode(pi, cnt, c_curr)
                                c_curr.children[pi] = c_new
                                if cond_header[pi][1] is None:
                                    cond_header[pi][1] = c_new
                                else:
                                    ch = cond_header[pi][1]
                                    while ch.node_link is not None:
                                        ch = ch.node_link
                                    ch.node_link = c_new
                            c_curr = c_curr.children[pi]
                    mine_tree(cond_header, new_prefix)

        mine_tree(header_table, ())
        duration = time.time() - start_time
        return all_frequent, duration

    # -------------------------------------------------------------
    # 3. ECLAT ALGORITHM (Vertical Tidsets)
    # -------------------------------------------------------------
    def mine_eclat(self, min_support: float = 0.05) -> Tuple[Dict[Tuple[str, ...], float], float]:
        start_time = time.time()
        min_count = min_support * self.n_transactions

        # Build initial Tidsets
        tidsets: Dict[str, Set[int]] = defaultdict(set)
        for t_idx, tx in enumerate(self.transactions):
            for item in tx:
                tidsets[item].add(t_idx)

        # Filter frequent 1-items
        frequent_tidsets = {
            (item,): tids for item, tids in tidsets.items() if len(tids) >= min_count
        }

        all_frequent: Dict[Tuple[str, ...], float] = {}

        def eclat_recursive(current_itemsets: Dict[Tuple[str, ...], Set[int]]):
            items = list(current_itemsets.keys())
            for i in range(len(items)):
                item_a = items[i]
                tids_a = current_itemsets[item_a]
                all_frequent[item_a] = round(len(tids_a) / self.n_transactions, 4)

                next_itemsets: Dict[Tuple[str, ...], Set[int]] = {}
                for j in range(i + 1, len(items)):
                    item_b = items[j]
                    tids_b = current_itemsets[item_b]
                    
                    # Intersect Tidsets
                    intersect_tids = tids_a.intersection(tids_b)
                    if len(intersect_tids) >= min_count:
                        merged = tuple(sorted(set(item_a).union(set(item_b))))
                        if len(merged) == len(item_a) + 1:
                            next_itemsets[merged] = intersect_tids

                if next_itemsets:
                    eclat_recursive(next_itemsets)

        eclat_recursive(frequent_tidsets)
        duration = time.time() - start_time
        return all_frequent, duration

    # -------------------------------------------------------------
    # 4. ASSOCIATION RULE GENERATOR
    # -------------------------------------------------------------
    def generate_rules(
        self,
        frequent_itemsets: Dict[Tuple[str, ...], float],
        min_confidence: float = 0.3,
        min_lift: float = 1.0,
    ) -> List[AssociationRule]:
        rules: List[AssociationRule] = []

        # Generate single-item support map for speed
        single_support = {
            k[0]: v for k, v in frequent_itemsets.items() if len(k) == 1
        }

        for itemset, itemset_supp in frequent_itemsets.items():
            if len(itemset) < 2:
                continue

            # Generate all non-empty proper subsets as antecedents
            item_list = list(itemset)
            for r in range(1, len(item_list)):
                for antecedent_comb in itertools.combinations(item_list, r):
                    antecedent = tuple(sorted(antecedent_comb))
                    consequent = tuple(sorted(set(item_list) - set(antecedent)))

                    # Antecedent support
                    ant_supp = frequent_itemsets.get(antecedent)
                    if not ant_supp:
                        # Compute fallback support if antecedent was pruned from frequent set
                        ant_set = set(antecedent)
                        ant_cnt = sum(1 for tx in self.transactions if ant_set.issubset(tx))
                        ant_supp = ant_cnt / self.n_transactions

                    if ant_supp == 0:
                        continue

                    # Consequent support
                    con_supp = frequent_itemsets.get(consequent)
                    if not con_supp:
                        con_set = set(consequent)
                        con_cnt = sum(1 for tx in self.transactions if con_set.issubset(tx))
                        con_supp = con_cnt / self.n_transactions

                    if con_supp == 0:
                        continue

                    # Confidence = Support(A U B) / Support(A)
                    confidence = itemset_supp / ant_supp

                    if confidence >= min_confidence:
                        # Lift = Confidence / Support(B) = Support(A U B) / (Support(A) * Support(B))
                        lift = confidence / con_supp

                        if lift >= min_lift:
                            # Leverage = Support(A U B) - (Support(A) * Support(B))
                            leverage = itemset_supp - (ant_supp * con_supp)

                            # Conviction = (1 - Support(B)) / (1 - Confidence)
                            if confidence < 1.0:
                                conviction = (1.0 - con_supp) / (1.0 - confidence)
                            else:
                                conviction = float("inf")

                            # Zhang's Metric
                            numerator = itemset_supp - (ant_supp * con_supp)
                            denominator = max(itemset_supp * (1 - ant_supp), ant_supp * (con_supp - itemset_supp))
                            zhang = numerator / denominator if denominator > 0 else 0.0

                            rule = AssociationRule(
                                antecedent=antecedent,
                                consequent=consequent,
                                support=itemset_supp,
                                confidence=confidence,
                                lift=lift,
                                leverage=leverage,
                                conviction=conviction,
                                zhang_metric=zhang,
                            )
                            rules.append(rule)

        # Sort rules by Lift descending
        rules.sort(key=lambda r: r.lift, reverse=True)
        return rules

    # -------------------------------------------------------------
    # 5. NETWORK GRAPH BUILDER
    # -------------------------------------------------------------
    @staticmethod
    def build_network_graph(rules: List[AssociationRule], top_n: int = 25) -> Dict[str, Any]:
        """
        Formats top rules into a directed bipartite/item graph with node centrality and edge weights.
        """
        top_rules = rules[:top_n]
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        links = []

        for r_idx, rule in enumerate(top_rules):
            # Antecedent items
            for ant in rule.antecedent:
                if ant not in nodes_dict:
                    nodes_dict[ant] = {"id": ant, "name": ant, "type": "item", "degree": 0}
                nodes_dict[ant]["degree"] += 1

            # Consequent items
            for con in rule.consequent:
                if con not in nodes_dict:
                    nodes_dict[con] = {"id": con, "name": con, "type": "item", "degree": 0}
                nodes_dict[con]["degree"] += 1

            # Connect each antecedent to each consequent
            for ant in rule.antecedent:
                for con in rule.consequent:
                    links.append({
                        "source": ant,
                        "target": con,
                        "lift": rule.lift,
                        "confidence": rule.confidence,
                        "support": rule.support,
                        "rule_label": f"Lift {rule.lift}x",
                    })

        nodes = list(nodes_dict.values())
        return {
            "total_nodes": len(nodes),
            "total_links": len(links),
            "nodes": nodes,
            "links": links,
        }
