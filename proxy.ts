import { NextRequest, NextResponse } from "next/server";

/**
 * Basic認証プロキシ（旧: middleware.ts）
 *
 * 環境変数:
 *   BASIC_AUTH_USER     - Basic認証のユーザー名
 *   BASIC_AUTH_PASSWORD - Basic認証のパスワード
 *
 * どちらか一方でも未設定の場合はBasic認証をスキップします（開発環境での利便性を確保）。
 * Vercelにデプロイする際は必ず両変数を設定してください。
 */
export function proxy(req: NextRequest) {
  const authUser = process.env.BASIC_AUTH_USER;
  const authPassword = process.env.BASIC_AUTH_PASSWORD;

  // 環境変数未設定時はスキップ（開発用）
  if (!authUser || !authPassword) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");

    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const colonIndex = decoded.indexOf(":");
        const user = decoded.slice(0, colonIndex);
        const password = decoded.slice(colonIndex + 1);

        if (user === authUser && password === authPassword) {
          return NextResponse.next();
        }
      } catch {
        // Base64デコード失敗時は認証失敗として扱う
      }
    }
  }

  // 認証失敗: WWW-Authenticate ヘッダーを返してブラウザの認証ダイアログを表示
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Health Checker Dashboard"',
    },
  });
}

export const config = {
  // 静的アセット・Next.js内部ルートは除外
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
