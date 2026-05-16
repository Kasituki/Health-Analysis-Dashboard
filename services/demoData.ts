import type { HealthAnalysisResponse } from "@/types";

// ─── 組合平均（全ケース共通） ────────────────────────────────────────────────

const UNION_AVG = [
  { year: 2019, avg_bmi: 23.5, avg_systolic_bp: 128, avg_hba1c: 5.6 },
  { year: 2020, avg_bmi: 23.7, avg_systolic_bp: 129, avg_hba1c: 5.7 },
  { year: 2021, avg_bmi: 23.8, avg_systolic_bp: 130, avg_hba1c: 5.7 },
  { year: 2022, avg_bmi: 24.0, avg_systolic_bp: 131, avg_hba1c: 5.8 },
  { year: 2023, avg_bmi: 24.1, avg_systolic_bp: 130, avg_hba1c: 5.8 },
];

function buildChartData(
  records: { year: number; bmi: number; systolic_bp: number; hba1c: number }[]
) {
  const recMap = new Map(records.map((r) => [r.year, r]));
  return UNION_AVG.map((avg) => {
    const rec = recMap.get(avg.year);
    return {
      year: avg.year,
      bmi: rec?.bmi ?? null,
      systolic_bp: rec?.systolic_bp ?? null,
      hba1c: rec?.hba1c ?? null,
      avg_bmi: avg.avg_bmi,
      avg_systolic_bp: avg.avg_systolic_bp,
      avg_hba1c: avg.avg_hba1c,
    };
  });
}

// ─── ケースA: 高血圧・低体重 ─────────────────────────────────────────────────

const caseA: HealthAnalysisResponse = {
  profile: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    age: 58,
    sex: "男性",
    has_diabetes_medication: false,
    has_hypertension_medication: true,
  },
  chartData: buildChartData([
    { year: 2019, bmi: 17.8, systolic_bp: 138, hba1c: 5.1 },
    { year: 2020, bmi: 17.5, systolic_bp: 140, hba1c: 5.2 },
    { year: 2021, bmi: 17.2, systolic_bp: 142, hba1c: 5.1 },
    { year: 2022, bmi: 17.6, systolic_bp: 145, hba1c: 5.3 },
    { year: 2023, bmi: 17.3, systolic_bp: 148, hba1c: 5.2 },
  ]),
  papers: [
    {
      paperId: "demo-a-001",
      title: "Effects of Lifestyle Interventions on Blood Pressure in Adults with Hypertension",
      year: 2023,
      authors: [{ name: "Johnson R." }, { name: "Tanaka K." }],
    },
    {
      paperId: "demo-a-002",
      title: "Nutritional Strategies for Underweight Adults with Cardiovascular Risk",
      year: 2022,
      authors: [{ name: "Kimura S." }, { name: "Park J." }],
    },
    {
      paperId: "demo-a-003",
      title: "Resistance Training and Blood Pressure Control in Older Adults",
      year: 2023,
      authors: [{ name: "Williams T." }],
    },
  ],
  suggestion: `## 健康改善アドバイス（58歳・男性）

### 現在の状況
BMI 17.3（低体重）・収縮期血圧 148 mmHg（高血圧2度）という組み合わせは、低栄養と循環器リスクが重なった状態です。高血圧治療薬を服用中ですが、生活習慣の改善で薬の効果をさらに高めることができます。

### 1. 体重の適正化（低体重改善）
- **目標 BMI 18.5〜22** を目指し、1ヶ月あたり 0.5〜1 kg のペースで体重を増やす
- 1日のエネルギー摂取量を現状より **200〜300 kcal 増加**させる
- タンパク質を意識的に増やす（卵・豆腐・魚・鶏むね肉を毎食取り入れる）
- 消化しやすい食品（バナナ・ヨーグルト・具だくさんスープ）を間食として活用する

### 2. 血圧管理の強化
- 塩分摂取量を **1日6g未満** に抑える（漬物・醤油・みそ汁の量を見直す）
- カリウムを豊富に含む食品（バナナ・ほうれん草・アボカド）を積極的に摂る
- 深呼吸・ストレッチなど **副交感神経を高める習慣**を朝晩5分実施する
- アルコールは週2日以下に制限する

### 3. 運動（低体重に配慮した内容）
- 過度な有酸素運動は体重減少につながるため、**筋力トレーニング（週2〜3回）を優先**する
- スクワット・カーフレイズ・椅子からの立ち座り運動など自重トレーニングから始める
- ウォーキングは1回30分・週3日程度に留め、消費しすぎないよう注意する

### 4. 受診のご確認
血圧が5年間で138 → 148 mmHg と上昇傾向にあります。主治医と現在の降圧薬の用量が適切かを確認し、栄養士への紹介も検討してください。`,
};

// ─── ケースB: メタボリック ────────────────────────────────────────────────────

const caseB: HealthAnalysisResponse = {
  profile: {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    age: 52,
    sex: "男性",
    has_diabetes_medication: true,
    has_hypertension_medication: true,
  },
  chartData: buildChartData([
    { year: 2019, bmi: 27.8, systolic_bp: 135, hba1c: 6.0 },
    { year: 2020, bmi: 28.5, systolic_bp: 138, hba1c: 6.2 },
    { year: 2021, bmi: 29.2, systolic_bp: 140, hba1c: 6.5 },
    { year: 2022, bmi: 30.1, systolic_bp: 143, hba1c: 6.7 },
    { year: 2023, bmi: 30.5, systolic_bp: 145, hba1c: 6.8 },
  ]),
  papers: [
    {
      paperId: "demo-b-001",
      title: "Metabolic Syndrome Management Through Integrated Lifestyle Intervention",
      year: 2024,
      authors: [{ name: "Yamamoto A." }, { name: "Chen L." }],
    },
    {
      paperId: "demo-b-002",
      title: "HbA1c Reduction Strategies in Type 2 Diabetes: A Systematic Review",
      year: 2023,
      authors: [{ name: "Nakamura H." }],
    },
    {
      paperId: "demo-b-003",
      title: "Obesity BMI Reduction and Cardiovascular Risk in Middle-Aged Adults",
      year: 2022,
      authors: [{ name: "Smith J." }, { name: "Watanabe M." }],
    },
  ],
  suggestion: `## 健康改善アドバイス（52歳・男性）

### 現在の状況
BMI 30.5（肥満1度）・収縮期血圧 145 mmHg（高血圧）・HbA1c 6.8%（糖尿病境界域）という典型的なメタボリックシンドロームの状態です。糖尿病・高血圧の両薬を服用中ですが、生活習慣の改善が数値を根本から改善する最大の鍵です。

### 1. 体重の5〜10%減少が最優先
- 現体重の **5〜10% 減少**（約4〜6 kg）でHbA1c・血圧の両方に顕著な改善が期待できる
- 1日あたり **500 kcal の収支改善**（食事300 kcal 削減 + 運動200 kcal 消費）を基本とする
- 夜食・間食をなくし、朝・昼に重点を置いた食事リズムに切り替える

### 2. 血糖値の安定化
- 精製糖質（白米・食パン・砂糖入り飲料）を減らし、**玄米・もち麦・野菜**に置き換える
- 食事の順番を「野菜 → タンパク質 → 炭水化物」に変えて血糖値スパイクを抑制する
- 食後15〜20分のウォーキングを習慣化する（血糖値を約10〜15%抑制）

### 3. 血圧管理
- 塩分摂取量を **1日6g未満** に抑える（ラーメン・丼物・外食の頻度を見直す）
- 体重1 kg 減少で収縮期血圧が約1 mmHg 低下するため、減量が降圧にも直結する
- アルコールは週2回以内・ビールなら350ml缶1本まで

### 4. 運動プログラム
- **有酸素運動**（速歩・自転車・水泳）を週150分以上（例: 30分×5日）
- **筋力トレーニング**（週2回）を加えると基礎代謝が上がりリバウンドを防ぐ
- 最初の2週間は10〜15分から始め、膝・腰への負担に注意しながら段階的に増やす

### 5. 定期的な受診
HbA1cが5年で6.0% → 6.8%と悪化傾向にあります。3ヶ月ごとに受診し、薬の用量調整が必要かどうかを主治医に相談してください。`,
};

// ─── ケースC: 健康体 ──────────────────────────────────────────────────────────

const caseC: HealthAnalysisResponse = {
  profile: {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    age: 45,
    sex: "女性",
    has_diabetes_medication: false,
    has_hypertension_medication: false,
  },
  chartData: buildChartData([
    { year: 2019, bmi: 21.5, systolic_bp: 115, hba1c: 5.0 },
    { year: 2020, bmi: 21.8, systolic_bp: 114, hba1c: 5.1 },
    { year: 2021, bmi: 22.1, systolic_bp: 116, hba1c: 5.0 },
    { year: 2022, bmi: 22.3, systolic_bp: 113, hba1c: 5.2 },
    { year: 2023, bmi: 22.0, systolic_bp: 115, hba1c: 5.1 },
  ]),
  papers: [
    {
      paperId: "demo-c-001",
      title: "Preventive Health Strategies for Middle-Aged Women: A Prospective Study",
      year: 2024,
      authors: [{ name: "Sato Y." }, { name: "Lee M." }],
    },
    {
      paperId: "demo-c-002",
      title: "Lifestyle Factors Associated with Long-Term Cardiometabolic Health in Women",
      year: 2023,
      authors: [{ name: "Suzuki N." }, { name: "Brown A." }],
    },
    {
      paperId: "demo-c-003",
      title: "Perimenopause and Metabolic Risk: Prevention Through Exercise and Nutrition",
      year: 2023,
      authors: [{ name: "Ito R." }],
    },
  ],
  suggestion: `## 健康改善アドバイス（45歳・女性）

### 現在の状況
BMI 22.0・収縮期血圧 115 mmHg・HbA1c 5.1% と、すべての指標が組合平均を大きく下回る優れた健康状態です。現在の生活習慣を維持・強化し、将来の生活習慣病を予防することが主な目標です。

### 1. 現在の良い習慣を継続する
- 現在の食事・運動習慣が良好な数値を支えています。**何が自分に合っているかを意識化**しておくことが大切です
- 体重・血圧・血糖値のすべてが正常範囲を安定して維持できており、理想的な状態です

### 2. 更年期に向けた予防的取り組み
- 45歳以降は女性ホルモン（エストロゲン）の低下により、**内臓脂肪・血圧・血糖が上昇しやすく**なります
- カルシウム・ビタミンD（乳製品・小魚・日光浴）を意識的に摂取し、骨密度を今から維持する
- 大豆イソフラボン（豆腐・味噌・納豆）を毎日の食事に取り入れる

### 3. 運動習慣の質の向上
- 現在の有酸素運動に加え、**筋力トレーニング（週2回）**を取り入れることで加齢による筋肉量低下を防ぐ
- ヨガ・ピラティスは柔軟性とストレス管理を同時に向上させる
- 1日8,000歩以上の歩行を目標にする

### 4. ストレス管理と睡眠
- 睡眠は **7〜8時間**を確保する（睡眠不足は血糖・血圧の両方に悪影響）
- 趣味や社会的なつながりを大切にし、精神的な健康も維持する

### 5. 定期健診の継続
現在の良好な状態を数値として記録し続けることが、異変の早期発見につながります。年1回の健診を欠かさず受診してください。`,
};

// ─── ユーザーID → レスポンス のマップ ────────────────────────────────────────

export const DEMO_RESPONSES: Record<string, HealthAnalysisResponse> = {
  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa": caseA,
  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb": caseB,
  "cccccccc-cccc-cccc-cccc-cccccccccccc": caseC,
};
