# 健康分析ダッシュボード

Next.js (App Router) + Supabase + Recharts を用いた健康データ可視化・AI分析ダッシュボード。

## 機能概要

| 機能 | 説明 |
|------|------|
| 📊 経年推移グラフ | BMI・収縮期血圧・HbA1c の経年変化を折れ線グラフで表示 |
| 🏥 組合平均比較 | 自身の数値と組合平均値を同一グラフ上で比較 |
| ✨ AI改善提案 | Gemini API を活用した個人別の健康改善アドバイス（Markdown形式） |
| 🔬 関連論文 | Semantic Scholar API で関連するエビデンス論文を自動検索 |
| 🔒 Basic認証 | Vercelデプロイ時の不正アクセス防止 |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、以下の値を設定してください：

```env
# Supabase（必須）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini API（オプション - 未設定時はフォールバックテキストを表示）
GEMINI_API_KEY=your-gemini-api-key

# Basic認証（Vercelデプロイ時に設定推奨）
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your-secure-password
```

### 3. Supabase テーブルの準備

Supabase ダッシュボードで以下のテーブルを作成してください：

```sql
-- プロフィール
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'other')),
  has_diabetes_medication BOOLEAN NOT NULL DEFAULT false,
  has_hypertension_medication BOOLEAN NOT NULL DEFAULT false
);

-- 健康記録
CREATE TABLE health_records (
  user_id UUID REFERENCES profiles(id),
  year INTEGER NOT NULL,
  bmi NUMERIC(5,2),
  systolic_bp INTEGER,
  hba1c NUMERIC(4,2),
  PRIMARY KEY (user_id, year)
);

-- 組合平均
CREATE TABLE union_averages (
  year INTEGER PRIMARY KEY,
  avg_bmi NUMERIC(5,2),
  avg_systolic_bp NUMERIC(6,2),
  avg_hba1c NUMERIC(4,2)
);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセスしてダッシュボードを確認できます。

## プロジェクト構成

```
HealthChecker/
├── app/
│   ├── api/
│   │   └── health-analysis/
│   │       └── route.ts       # POST /api/health-analysis
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # ダッシュボードメイン画面
├── components/
│   ├── HealthChart.tsx        # Rechartsグラフコンポーネント
│   ├── PaperList.tsx          # 関連論文リスト
│   └── StatCard.tsx           # 数値表示カード
├── lib/
│   └── supabase.ts            # Supabaseクライアント
├── services/
│   ├── db.ts                  # DB取得ロジック
│   └── externalApis.ts        # Semantic Scholar / Gemini API
├── middleware.ts               # Basic認証ミドルウェア
├── types.ts                    # TypeScript型定義
└── .env.local                  # 環境変数（要設定）
```

## Vercelへのデプロイ

1. [Vercel](https://vercel.com) にリポジトリをインポート
2. **Environment Variables** に以下を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `BASIC_AUTH_USER`
   - `BASIC_AUTH_PASSWORD`
3. デプロイを実行

## ヘルスメトリクスの基準値

| 指標 | 正常 | 要注意 | 要改善 |
|------|------|--------|--------|
| BMI | 18.5〜24.9 | 25〜29.9 | 30以上 |
| 収縮期血圧 | 〜129 mmHg | 130〜139 mmHg | 140以上 mmHg |
| HbA1c | 〜5.5% | 5.6〜6.4% | 6.5%以上 |
## イメージ
* ダッシュボード全体像のスクリーンショット
<img width="1429" height="949" alt="image" src="https://github.com/Kasituki/Health-Analysis-Dashboard/docs/docs/dashboard.png" />

* AI健康改善アドバイスのスクリーンショット
<img width="1156" height="1285" alt="image" src="https://github.com/Kasituki/Health-Analysis-Dashboard/docs/docs/ai-advice.png" />
