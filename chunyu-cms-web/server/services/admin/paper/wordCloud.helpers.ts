export type KeywordSource = '0' | '1' | '2';

export type PaperKeywordLike = {
  paperKeywordId?: number | null;
  keyword?: string | null;
  weight?: number | string | null;
  source?: string | null;
};

export type ResolvedPaperKeyword = {
  id: number | null;
  keyword: string;
  weight: number;
  source: KeywordSource;
};

const KEYWORD_SPLIT_REGEX = /[\n,，;；、]+/;

export function normalizeKeywordText(keyword?: string | null) {
  return typeof keyword === 'string' ? keyword.trim() : '';
}

export function normalizeKeywordWeight(weight?: number | string | null) {
  const value = Number(weight);
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.round(value);
}

export function splitPaperKeywords(rawKeywords?: string | null) {
  const seen = new Set<string>();

  return String(rawKeywords || '')
    .split(KEYWORD_SPLIT_REGEX)
    .map(keyword => normalizeKeywordText(keyword))
    .filter(keyword => {
      if (!keyword || seen.has(keyword)) {
        return false;
      }
      seen.add(keyword);
      return true;
    });
}

export function resolvePaperKeywords(detailRows: PaperKeywordLike[], rawKeywords?: string | null): ResolvedPaperKeyword[] {
  if (detailRows.length > 0) {
    return detailRows
      .map(row => ({
        id: row.paperKeywordId ?? null,
        keyword: normalizeKeywordText(row.keyword),
        weight: normalizeKeywordWeight(row.weight),
        source: normalizeKeywordSource(row.source)
      }))
      .filter(row => Boolean(row.keyword))
      .sort((a, b) => b.weight - a.weight || a.keyword.localeCompare(b.keyword, 'zh-Hans-CN'));
  }

  return splitPaperKeywords(rawKeywords).map(keyword => ({
    id: null,
    keyword,
    weight: 1,
    source: '2'
  }));
}

export function aggregateKeywordWeights(rows: Array<{ keyword?: string | null; weight?: number | string | null }>) {
  const keywordMap = new Map<string, number>();

  rows.forEach(row => {
    const keyword = normalizeKeywordText(row.keyword);
    if (!keyword) {
      return;
    }

    const nextWeight = (keywordMap.get(keyword) || 0) + normalizeKeywordWeight(row.weight);
    keywordMap.set(keyword, nextWeight);
  });

  return Array.from(keywordMap.entries())
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight || a.keyword.localeCompare(b.keyword, 'zh-Hans-CN'));
}

export function buildPaperKeywordWriteModels(
  paperId: number,
  rows: PaperKeywordLike[],
  userName = 'system'
) {
  const merged = new Map<string, { keyword: string; weight: number; source: KeywordSource }>();

  rows.forEach(row => {
    const keyword = normalizeKeywordText(row.keyword);
    if (!keyword) {
      return;
    }

    merged.set(keyword, {
      keyword,
      weight: normalizeKeywordWeight(row.weight),
      source: normalizeKeywordSource(row.source),
    });
  });

  return Array.from(merged.values()).map(row => ({
    paperId,
    keyword: row.keyword,
    weight: row.weight,
    source: row.source,
    status: '0' as const,
    delFlag: '0' as const,
    createBy: userName,
    updateBy: userName
  }));
}

function normalizeKeywordSource(source?: string | null): KeywordSource {
  if (source === '1' || source === '2') {
    return source;
  }
  return '0';
}
