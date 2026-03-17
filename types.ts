// ─── Supabase テーブル型定義 ─────────────────────────────────────────────────

export type Sex = "男性" | "女性" | "その他";

/** profiles テーブル */
export interface Profile {
  id: string;
  age: number;
  sex: Sex;
  has_diabetes_medication: boolean;
  has_hypertension_medication: boolean;
}

/** health_records テーブル */
export interface HealthRecord {
  user_id: string;
  year: number;
  bmi: number;
  systolic_bp: number;
  hba1c: number;
}

/** union_averages テーブル */
export interface UnionAverage {
  year: number;
  avg_bmi: number;
  avg_systolic_bp: number;
  avg_hba1c: number;
}

// ─── グラフ表示用の結合データ型 ───────────────────────────────────────────────

export interface ChartDataPoint {
  year: number;
  bmi: number | null;
  systolic_bp: number | null;
  hba1c: number | null;
  avg_bmi: number | null;
  avg_systolic_bp: number | null;
  avg_hba1c: number | null;
}

// ─── 外部API レスポンス型 ─────────────────────────────────────────────────────

export interface Paper {
  paperId: string;
  title: string;
  year: number | null;
  authors: { name: string }[];
  externalIds?: { DOI?: string };
}

export interface SemanticScholarResponse {
  data: Paper[];
  total: number;
}

// ─── API エンドポイント型 ────────────────────────────────────────────────────

export interface HealthAnalysisRequest {
  userId: string;
}

export interface HealthAnalysisResponse {
  profile: Profile | null;
  chartData: ChartDataPoint[];
  papers: Paper[];
  suggestion: string;
  error?: string;
}
