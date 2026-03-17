/**
 * Supabase からデータを取得するサービス関数群
 */
import { supabase } from "@/lib/supabase";
import type {
  Profile,
  HealthRecord,
  UnionAverage,
  ChartDataPoint,
} from "@/types";

/** 指定ユーザーのプロフィールを取得 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, age, sex, has_diabetes_medication, has_hypertension_medication")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[DB] profiles 取得エラー:", error.message);
    return null;
  }
  return data as Profile;
}

/** 指定ユーザーの健康記録を年昇順で取得 */
export async function fetchHealthRecords(
  userId: string
): Promise<HealthRecord[]> {
  const { data, error } = await supabase
    .from("health_records")
    .select("user_id, year, bmi, systolic_bp, hba1c")
    .eq("user_id", userId)
    .order("year", { ascending: true });

  if (error) {
    console.error("[DB] health_records 取得エラー:", error.message);
    return [];
  }
  return (data ?? []) as HealthRecord[];
}

/** 組合平均値を全年分取得 */
export async function fetchUnionAverages(): Promise<UnionAverage[]> {
  const { data, error } = await supabase
    .from("union_averages")
    .select("year, avg_bmi, avg_systolic_bp, avg_hba1c")
    .order("year", { ascending: true });

  if (error) {
    console.error("[DB] union_averages 取得エラー:", error.message);
    return [];
  }
  return (data ?? []) as UnionAverage[];
}

/**
 * 個人記録と平均値を年でマージしてグラフ用データを生成する
 * - 個人記録にある年・平均にある年の和集合を対象とする
 */
export async function buildChartData(userId: string): Promise<ChartDataPoint[]> {
  const [records, averages] = await Promise.all([
    fetchHealthRecords(userId),
    fetchUnionAverages(),
  ]);

  const yearSet = new Set<number>([
    ...records.map((r) => r.year),
    ...averages.map((a) => a.year),
  ]);

  const recordMap = new Map(records.map((r) => [r.year, r]));
  const avgMap = new Map(averages.map((a) => [a.year, a]));

  return Array.from(yearSet)
    .sort((a, b) => a - b)
    .map((year) => {
      const rec = recordMap.get(year);
      const avg = avgMap.get(year);
      return {
        year,
        bmi: rec?.bmi ?? null,
        systolic_bp: rec?.systolic_bp ?? null,
        hba1c: rec?.hba1c ?? null,
        avg_bmi: avg?.avg_bmi ?? null,
        avg_systolic_bp: avg?.avg_systolic_bp ?? null,
        avg_hba1c: avg?.avg_hba1c ?? null,
      };
    });
}
