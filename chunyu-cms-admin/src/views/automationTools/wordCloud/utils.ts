export function buildKeywordSavePayload(rows = []) {
  return {
    keywords: rows
      .map(row => ({
        keyword: typeof row.keyword === 'string' ? row.keyword.trim() : '',
        weight: normalizeWeight(row.weight),
        source: row.source || '0'
      }))
      .filter(row => row.keyword)
  }
}

export function mapKeywordsToWordCloudData(rows = []) {
  return rows
    .map(row => ({
      name: typeof row.keyword === 'string' ? row.keyword.trim() : '',
      value: normalizeWeight(row.weight)
    }))
    .filter(row => row.name)
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'zh-Hans-CN'))
}

function normalizeWeight(weight) {
  const value = Number(weight)
  if (!Number.isFinite(value) || value < 1) {
    return 1
  }
  return Math.round(value)
}
