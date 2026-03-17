import type { Paper } from "@/types";

interface Props {
  papers: any[]; // 引数名を any から変更
}

export default function PaperList({ papers }: Props) {
  if (!papers || papers.length === 0) {
    return <p className="text-sm text-gray-400">関連論文が見つかりませんでした。</p>;
  }

  return (
    <ul className="space-y-3">
      {papers.map((paper: any) => {
        const doi = paper.externalIds?.DOI;
        const href = doi
          ? `https://doi.org/${doi}`
          : `https://www.semanticscholar.org/paper/${paper.paperId}`;

        return (
          <li key={paper.paperId} className="flex gap-3">
            <span className="mt-1 text-blue-400 flex-shrink-0">📄</span>
            <div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline leading-snug"
              >
                {paper.title}
              </a>
              <p className="text-xs text-gray-400 mt-0.5">
                {/* 著者が存在する場合のみ map を実行するように修正 */}
                {paper.authors?.map((author: any) => author.name).join(", ") || "Unknown Authors"}
                {paper.year ? ` (${paper.year})` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}