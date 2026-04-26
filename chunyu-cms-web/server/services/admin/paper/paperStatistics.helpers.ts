type PaperStatisticRow = {
  publishYear?: number | null;
  delFlag?: string | null;
};

type YearlyPaperCount = {
  year: number;
  count: number;
};

export function aggregateYearlyPaperCounts(rows: PaperStatisticRow[]): YearlyPaperCount[] {
  const counter = new Map<number, number>();

  for (const row of rows || []) {
    if (row?.delFlag && row.delFlag !== '0') {
      continue;
    }

    if (row?.publishYear === undefined || row?.publishYear === null) {
      continue;
    }

    const year = Number(row.publishYear);
    if (!Number.isInteger(year)) {
      continue;
    }

    counter.set(year, (counter.get(year) || 0) + 1);
  }

  return Array.from(counter.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({
      year,
      count
    }));
}
