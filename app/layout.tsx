import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "健康分析ダッシュボード",
  description: "健康記録の経年推移をグラフで確認し、AIによる改善アドバイスを受けるダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
