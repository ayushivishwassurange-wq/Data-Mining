export interface RuleEntry {
  antecedent: string[];
  consequent: string[];
  antecedent_str: string;
  consequent_str: string;
  rule_str: string;
  support: number;
  confidence: number;
  lift: number;
  leverage: number;
  conviction: number;
  zhang_metric: number;
}

export interface FrequentItemset {
  items: string[];
  items_str: string;
  length: number;
  support: number;
}

export interface RecommendedItem {
  item: string;
  max_confidence: number;
  max_lift: number;
  support: number;
  triggered_by: string[];
  rule_count: number;
}

export interface BundleSuggestion {
  title: string;
  description: string;
  discount_pct: number;
  added_item: string;
  expected_aov_uplift: string;
}

export interface BasketRecommendResult {
  current_basket: string[];
  basket_size: number;
  recommendations: RecommendedItem[];
  bundle_suggestions: BundleSuggestion[];
  total_matched_rules: number;
}

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  degree: number;
}

export interface GraphLink {
  source: string;
  target: string;
  lift: number;
  confidence: number;
  support: number;
  rule_label: string;
}

export interface NetworkGraphData {
  total_nodes: number;
  total_links: number;
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface SpeedBenchmark {
  min_support: number;
  apriori_ms: number;
  fp_growth_ms: number;
  eclat_ms: number;
}

export interface TopItem {
  item: string;
  count: number;
  support: number;
}

export interface BasketSizeHist {
  basket_size: number;
  count: number;
}

export interface CategoryShare {
  category: string;
  total_item_sales: number;
  percentage: number;
}

export interface PairwiseAffinity {
  item_a: string;
  item_b: string;
  co_occurrence_count: number;
  joint_support: number;
}

export interface EdaData {
  total_transactions: number;
  total_unique_items: number;
  avg_basket_size: number;
  median_basket_size: number;
  max_basket_size: number;
  top_frequent_items: TopItem[];
  basket_size_distribution: BasketSizeHist[];
  category_share: CategoryShare[];
  top_pairwise_affinities: PairwiseAffinity[];
  product_catalog: Record<string, string[]>;
}

export interface MineRulesResult {
  algorithm: string;
  min_support: number;
  min_confidence: number;
  min_lift: number;
  execution_time_ms: number;
  total_frequent_itemsets: number;
  total_rules_mined: number;
  rules: RuleEntry[];
}
