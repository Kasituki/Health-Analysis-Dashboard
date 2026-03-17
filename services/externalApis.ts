/**
 * 外部API連携モジュール
 * - Semantic Scholar API: 関連論文の検索
 * - Gemini API: 改善提案のMarkdown生成
 * いずれもAPIキー未設定・接続失敗時はフォールバックテキストを返す
 */
import type { Paper } from "@/types";

const SEMANTIC_SCHOLAR_BASE = "https://api.semanticscholar.org/graph/v1";
const PAPER_FIELDS = "paperId,title,year,authors,externalIds";

/**
 * Semantic Scholar で論文を検索する
 * @param query 検索クエリ（例: "BMI hypertension improvement"）
 * @param limit 取得件数（デフォルト5件）
 */
export async function searchPapers(
  query: string,
  limit = 5
): Promise<any[]> {
  console.log(`[Mock] 論文検索を実行（モック稼働）: ${query}`);

  // API通信の遅延を1秒間シミュレートし、ローディングUIのリアルさを担保する
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      paperId: "mock-001",
      title: "Effects of Lifestyle Interventions on Blood Pressure in Adults with Hypertension",
      abstract: "...",
      authors: [{ name: "John Doe" }, { name: "Jane Smith" }], // 【重要】これを追加
      year: 2023,
      citationCount: 142
    },
    {
      paperId: "mock-002",
      title: "Impact of Low BMI on Cardiovascular Risk Management",
      abstract: "...",
      authors: [{ name: "Alice Brown" }], // 【重要】これを追加
      year: 2022,
      citationCount: 89
    }
  ];
}

/** 接続失敗時のフォールバック論文リスト */
function getFallbackPapers(): Paper[] {
  return [
    {
      paperId: "fallback-1",
      title: "Lifestyle Interventions for Obesity Management",
      year: 2023,
      authors: [{ name: "Smith J." }],
    },
    {
      paperId: "fallback-2",
      title: "Hypertension Control Through Diet and Exercise",
      year: 2022,
      authors: [{ name: "Tanaka K." }],
    },
    {
      paperId: "fallback-3",
      title: "HbA1c Reduction Strategies in Type 2 Diabetes",
      year: 2024,
      authors: [{ name: "Yamamoto A." }],
    },
  ];
}

// ─── Gemini API ──────────────────────────────────────────────────────────────

interface GeminiCandidate {
  content: { parts: { text: string }[] };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

/**
 * Gemini API を使用して健康改善提案のMarkdownを生成する
 * @param prompt 生成プロンプト
 */
export async function generateSuggestion(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[externalApis] GEMINI_API_KEY 未設定 → フォールバック提案を返します");
    return getFallbackSuggestion();
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 5000,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API エラー: ${res.status}`);
    }

    const json: GeminiResponse = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? getFallbackSuggestion();
  } catch (err) {
    console.warn("[externalApis] Gemini 生成フォールバック:", err);
    return getFallbackSuggestion();
  }
}

/** APIキー未設定・エラー時のフォールバック提案テキスト */
function getFallbackSuggestion(): string {
  return `## 健康改善アドバイス（サンプル）

> ※ Gemini APIキーが未設定のため、サンプルの提案を表示しています。

### BMI改善
- 1日30分以上の有酸素運動（ウォーキング・水泳等）を週5日実施する
- 食事の総カロリーを見直し、野菜・タンパク質を中心にした食生活へ移行する

### 血圧管理
- 塩分摂取量を1日6g未満に抑える
- アルコールを週2日以下に制限する
- ストレス管理のため、瞑想や深呼吸を日課にする

### HbA1c改善
- 精製糖質（白米・パン・菓子類）の摂取を減らす
- 食後15〜30分のウォーキングで血糖値スパイクを抑制する
- 定期的な血糖値の自己測定で傾向を把握する

### 受診のすすめ
数値が基準値を大幅に超えている場合は、主治医への相談を優先してください。
`;
}

/**
 * プロフィールと健康記録から Gemini 用のプロンプトを構築する
 */
export function buildGeminiPrompt(params: {
  age: number;
  sex: string;
  latestBmi: number | null;
  latestSystolicBp: number | null;
  latestHba1c: number | null;
  hasDiabetesMed: boolean;
  hasHypertensionMed: boolean;
}): string {
  const {
    age,
    sex,
    latestBmi,
    latestSystolicBp,
    latestHba1c,
    hasDiabetesMed,
    hasHypertensionMed,
  } = params;

  return `あなたは健康管理の専門家です。以下の患者データを基に、具体的な健康改善提案をMarkdown形式で日本語で作成してください。

## 患者情報
- 年齢: ${age}歳
- 性別: ${sex === "男性" ? "男性" : sex === "女性" ? "女性" : "その他"}
- 糖尿病治療薬服用: ${hasDiabetesMed ? "あり" : "なし"}
- 高血圧治療薬服用: ${hasHypertensionMed ? "あり" : "なし"}

## 最新の健康指標
- BMI: ${latestBmi ?? "データなし"}
- 収縮期血圧: ${latestSystolicBp ?? "データなし"} mmHg
- HbA1c: ${latestHba1c ?? "データなし"} %

## 依頼内容
上記の数値を踏まえ、生活習慣の改善点を3〜5項目で具体的に提案してください。
医療的な診断は避け、あくまで一般的な健康アドバイスとして記載してください。`;
}
