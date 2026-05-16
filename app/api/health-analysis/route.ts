import { NextRequest, NextResponse } from "next/server";
import { fetchProfile, buildChartData } from "@/services/db";
import {
  searchPapers,
  generateSuggestion,
  buildGeminiPrompt,
} from "@/services/externalApis";
import { DEMO_RESPONSES } from "@/services/demoData";
import type { HealthAnalysisRequest, HealthAnalysisResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: HealthAnalysisRequest = await req.json();
    const { userId } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId は必須です" },
        { status: 400 }
      );
    }

    // ─── デモモード: Supabase・Gemini を呼ばず固定データを返す ───────────
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const demoData = DEMO_RESPONSES[userId];
      if (!demoData) {
        return NextResponse.json(
          { error: "デモデータが見つかりません" },
          { status: 404 }
        );
      }
      return NextResponse.json(demoData, { status: 200 });
    }

    // ─── DB からデータ取得（並列実行） ────────────────────────────────────
    const [profile, chartData] = await Promise.all([
      fetchProfile(userId),
      buildChartData(userId),
    ]);

    // ─── 最新年の指標を取得 ───────────────────────────────────────────────
    const latestRecord = [...chartData]
      .filter((d) => d.bmi !== null || d.systolic_bp !== null || d.hba1c !== null)
      .pop();

    // ─── 論文検索クエリの構築 ────────────────────────────────────────────
    const queryParts: string[] = [];
    if (latestRecord?.bmi && latestRecord.bmi >= 25) queryParts.push("obesity BMI");
    if (latestRecord?.systolic_bp && latestRecord.systolic_bp >= 130)
      queryParts.push("hypertension blood pressure");
    if (latestRecord?.hba1c && latestRecord.hba1c >= 5.6)
      queryParts.push("HbA1c diabetes");
    const searchQuery =
      queryParts.length > 0
        ? queryParts.join(" ") + " lifestyle intervention"
        : "healthy lifestyle prevention";

    // ─── 外部API実行（並列） ──────────────────────────────────────────────
    const geminiPrompt = profile
      ? buildGeminiPrompt({
          age: profile.age,
          sex: profile.sex,
          latestBmi: latestRecord?.bmi ?? null,
          latestSystolicBp: latestRecord?.systolic_bp ?? null,
          latestHba1c: latestRecord?.hba1c ?? null,
          hasDiabetesMed: profile.has_diabetes_medication,
          hasHypertensionMed: profile.has_hypertension_medication,
        })
      : "一般的な健康改善アドバイスをMarkdown形式で日本語で提供してください。";

    const [papers, suggestion] = await Promise.all([
      searchPapers(searchQuery),
      generateSuggestion(geminiPrompt),
    ]);

    // ─── レスポンス組み立て ───────────────────────────────────────────────
    const response: HealthAnalysisResponse = {
      profile,
      chartData,
      papers,
      suggestion,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[/api/health-analysis] エラー:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
