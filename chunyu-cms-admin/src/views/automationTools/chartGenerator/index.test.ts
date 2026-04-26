// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import ChartGeneratorPage from './index.vue'
import { buildYearlyCountLineOption, normalizeYearlyStatisticsList } from './utils'
import { aggregateYearlyPaperCounts } from '../../../../../chunyu-cms-web/server/services/admin/paper/paperStatistics.helpers'

const {
  getPaperYearlyCountStatistics,
  chartSetOption,
  chartDispose
} = vi.hoisted(() => ({
  getPaperYearlyCountStatistics: vi.fn(),
  chartSetOption: vi.fn(),
  chartDispose: vi.fn()
}))

vi.mock('@/api/automationTools/chartGenerator', () => ({
  getPaperYearlyCountStatistics
}))

vi.mock('echarts', () => ({
  default: {
    init: () => ({
      setOption: chartSetOption,
      resize: vi.fn(),
      dispose: chartDispose
    })
  },
  init: () => ({
    setOption: chartSetOption,
    resize: vi.fn(),
    dispose: chartDispose
  })
}))

function createWrapper() {
  return shallowMount(ChartGeneratorPage, {
    global: {
      directives: {
        loading: () => {}
      },
      stubs: {
        'el-card': { template: '<div><slot name="header" /><slot /></div>' },
        'el-row': { template: '<div><slot /></div>' },
        'el-col': { template: '<div><slot /></div>' },
        'el-button': { template: '<button><slot /></button>' },
        'el-empty': { template: '<div class="el-empty-stub" />' },
        'el-table': { template: '<div><slot /></div>' },
        'el-table-column': { template: '<div class="el-table-column-stub" />' }
      }
    }
  })
}

describe('paper yearly statistics helpers', () => {
  it('aggregates yearly counts, excludes null years and deleted rows, and sorts ascending', () => {
    expect(aggregateYearlyPaperCounts([
      { publishYear: 2024, delFlag: '0' },
      { publishYear: null, delFlag: '0' },
      { publishYear: 2022, delFlag: '0' },
      { publishYear: 2024, delFlag: '0' },
      { publishYear: 2023, delFlag: '1' },
      { publishYear: 2023, delFlag: '0' }
    ])).toEqual([
      { year: 2022, count: 1 },
      { year: 2023, count: 1 },
      { year: 2024, count: 2 }
    ])
  })

  it('normalizes api list and builds chart option', () => {
    expect(normalizeYearlyStatisticsList([
      { year: '2024', count: '5' },
      { year: 2022, count: 1 },
      { year: 2023, count: 3 }
    ])).toEqual([
      { year: 2022, count: 1 },
      { year: 2023, count: 3 },
      { year: 2024, count: 5 }
    ])

    const option = buildYearlyCountLineOption([
      { year: 2022, count: 1 },
      { year: 2023, count: 3 }
    ])

    expect(option.xAxis.data).toEqual(['2022', '2023'])
    expect(option.series[0].data).toEqual([1, 3])
  })
})

describe('chart generator page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps api data into chart and table on load', async () => {
    getPaperYearlyCountStatistics.mockResolvedValue({
      data: {
        list: [
          { year: 2024, count: 5 },
          { year: 2022, count: 1 },
          { year: 2023, count: 3 }
        ]
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    expect(getPaperYearlyCountStatistics).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.statisticsList).toEqual([
      { year: 2022, count: 1 },
      { year: 2023, count: 3 },
      { year: 2024, count: 5 }
    ])
    expect(chartSetOption).toHaveBeenCalledTimes(1)
    expect(chartSetOption.mock.calls[0][0].series[0].data).toEqual([1, 3, 5])
  })

  it('shows empty state when api returns no data', async () => {
    getPaperYearlyCountStatistics.mockResolvedValue({
      data: {
        list: []
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.statisticsList).toEqual([])
    expect(wrapper.findAll('.el-empty-stub')).toHaveLength(2)
    expect(chartSetOption).not.toHaveBeenCalled()
  })
})
