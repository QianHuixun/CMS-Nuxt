export function normalizeYearlyStatisticsList(list = []) {
  return [...list]
    .filter(item => item && item.year !== undefined && item.year !== null)
    .map(item => ({
      year: Number(item.year),
      count: Number(item.count || 0)
    }))
    .filter(item => Number.isInteger(item.year))
    .sort((a, b) => a.year - b.year)
}

export function buildYearlyCountLineOption(list = []) {
  const normalizedList = normalizeYearlyStatisticsList(list)
  const years = normalizedList.map(item => String(item.year))
  const counts = normalizedList.map(item => item.count)

  return {
    color: ['#2563eb'],
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 48,
      right: 24,
      top: 40,
      bottom: 40
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: years,
      axisLine: {
        lineStyle: {
          color: '#cbd5e1'
        }
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#cbd5e1'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    series: [
      {
        name: '论文数量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: 'rgba(37, 99, 235, 0.12)'
        },
        data: counts
      }
    ]
  }
}
