"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import HealthChart from "@/components/HealthChart";
import StatCard from "@/components/StatCard";
import PaperList from "@/components/PaperList";
import type {
  HealthAnalysisResponse,
  ChartDataPoint,
  Profile,
  Paper,
} from "@/types";

const DEMO_USERS = [
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", label: "ケースA: 高血圧・低体重" },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", label: "ケースB: メタボリック" },
  { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", label: "ケースC: 健康体" },
];

// ─── ステータス判定ヘルパー ─────────────────────────────────────────────────

function bmiStatus(v: number | null): "normal" | "warning" | "danger" | undefined {
  if (v === null) return undefined;
  if (v < 18.5 || v >= 25) return v >= 30 ? "danger" : "warning";
  return "normal";
}

function bpStatus(v: number | null): "normal" | "warning" | "danger" | undefined {
  if (v === null) return undefined;
  if (v >= 140) return "danger";
  if (v >= 130) return "warning";
  return "normal";
}

function hba1cStatus(v: number | null): "normal" | "warning" | "danger" | undefined {
  if (v === null) return undefined;
  if (v >= 6.5) return "danger";
  if (v >= 5.6) return "warning";
  return "normal";
}

// ─── メインコンポーネント ────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedUserId, setSelectedUserId] = useState(DEMO_USERS[0].id);
  const [data, setData] = useState<HealthAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // chartData の末尾から実測値がある最新年のレコードを導出
  const latest: ChartDataPoint | null = data?.chartData
    ? ([...data.chartData]
        .reverse()
        .find(
          (d) => d.bmi !== null || d.systolic_bp !== null || d.hba1c !== null
        ) ?? null)
    : null;

  // ユーザーIDが変更されるたびにデータを取得
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/api/health-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selectedUserId }),
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedUserId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🩺</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">健康分析ダッシュボード</h1>
            <p className="text-xs text-gray-400">Health Analysis Dashboard</p>
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {DEMO_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                selectedUserId === user.id
                  ? "bg-white shadow-sm font-bold text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {user.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* プロフィール & 最新値 */}
        {data && (
          <>
            {data.profile && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  プロフィール
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="年齢" value={data.profile.age} unit="歳" />
                  <StatCard
                    label="性別"
                    value={
                      data.profile.sex === "男性"
                        ? "男性"
                        : data.profile.sex === "女性"
                        ? "女性"
                        : "その他"
                    }
                  />
                  <StatCard
                    label="糖尿病治療薬"
                    value={data.profile.has_diabetes_medication ? "服用中" : "なし"}
                  />
                  <StatCard
                    label="高血圧治療薬"
                    value={data.profile.has_hypertension_medication ? "服用中" : "なし"}
                  />
                </div>
              </section>
            )}

            {/* 最新健康指標 */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                最新の健康指標
                {latest && (
                  <span className="ml-2 font-normal normal-case text-gray-400">
                    ({latest.year}年)
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="BMI"
                  value={latest?.bmi?.toFixed(1) ?? null}
                  status={bmiStatus(latest?.bmi ?? null)}
                  subtext="基準: 18.5〜24.9"
                />
                <StatCard
                  label="収縮期血圧"
                  value={latest?.systolic_bp?.toFixed(0) ?? null}
                  unit="mmHg"
                  status={bpStatus(latest?.systolic_bp ?? null)}
                  subtext="基準: 〜129 mmHg"
                />
                <StatCard
                  label="HbA1c"
                  value={latest?.hba1c?.toFixed(1) ?? null}
                  unit="%"
                  status={hba1cStatus(latest?.hba1c ?? null)}
                  subtext="基準: 〜5.5%"
                />
              </div>
            </section>

            {/* 経年推移グラフ */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                経年推移グラフ
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <HealthChart
                  data={data.chartData}
                  metric="bmi"
                  title="BMI 推移"
                  unit=""
                />
                <HealthChart
                  data={data.chartData}
                  metric="systolic_bp"
                  title="収縮期血圧 推移"
                  unit="mmHg"
                />
                <HealthChart
                  data={data.chartData}
                  metric="hba1c"
                  title="HbA1c 推移"
                  unit="%"
                />
              </div>
            </section>

            {/* AI提案 & 関連論文 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gemini 提案 */}
              <section className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>✨</span> AI健康改善アドバイス
                </h2>
                {data.suggestion ? (
                  <div className="prose prose-sm prose-headings:text-gray-800 prose-h2:text-base prose-h2:font-bold prose-h3:text-sm prose-h3:font-semibold prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800 prose-blockquote:text-gray-500 prose-blockquote:border-blue-200 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {data.suggestion}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">提案を生成中...</p>
                )}
              </section>

              {/* 関連論文 */}
              <section className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>🔬</span> 関連エビデンス（論文）
                </h2>
                <PaperList papers={data.papers} />
              </section>
            </div>
          </>
        )}

        {/* 初期状態のガイダンス */}
        {!data && !loading && (
          <div className="text-center py-20 text-gray-300">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg font-medium text-gray-400">
              ユーザーIDを入力して分析を開始してください
            </p>
            <p className="text-sm text-gray-300 mt-1">
              健康記録・経年グラフ・AI提案が表示されます
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
