// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import WordCloudPage from './index.vue'
import { buildKeywordSavePayload, mapKeywordsToWordCloudData } from './utils'
import {
  aggregateKeywordWeights,
  resolvePaperKeywords,
  splitPaperKeywords
} from '../../../../../chunyu-cms-web/server/services/admin/paper/wordCloud.helpers'

const {
  listPapers,
  getPaperKeywords,
  updatePaperKeywords,
  getPaperKeywordCloud,
  messageSuccess,
  messageWarning,
  chartSetOption
} = vi.hoisted(() => ({
  listPapers: vi.fn(),
  getPaperKeywords: vi.fn(),
  updatePaperKeywords: vi.fn(),
  getPaperKeywordCloud: vi.fn(),
  messageSuccess: vi.fn(),
  messageWarning: vi.fn(),
  chartSetOption: vi.fn()
}))

vi.mock('@/api/automationTools/wordCloud', () => ({
  listPapers,
  getPaperKeywords,
  updatePaperKeywords,
  getPaperKeywordCloud
}))

vi.mock('echarts', () => ({
  default: {
    init: () => ({
      setOption: chartSetOption,
      resize: vi.fn(),
      dispose: vi.fn()
    })
  },
  init: () => ({
    setOption: chartSetOption,
    resize: vi.fn(),
    dispose: vi.fn()
  })
}))

vi.mock('echarts-wordcloud', () => ({}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess,
    warning: messageWarning
  }
}))

function createWrapper() {
  return shallowMount(WordCloudPage, {
    global: {
      directives: {
        loading: () => {}
      },
      stubs: {
        'el-row': { template: '<div><slot /></div>' },
        'el-col': { template: '<div><slot /></div>' },
        'el-card': { template: '<div><slot name="header" /><slot /></div>' },
        'el-radio-group': { template: '<div><slot /></div>' },
        'el-radio-button': { template: '<button><slot /></button>' },
        'el-select': { template: '<select><slot /></select>' },
        'el-option': { template: '<option><slot /></option>' },
        'el-button': { template: '<button><slot /></button>' },
        'el-empty': { template: '<div class="el-empty-stub" />' },
        'el-table': { template: '<div><slot /></div>' },
        'el-table-column': { template: '<div class="el-table-column-stub" />' },
        'el-tag': { template: '<span><slot /></span>' },
        'el-input-number': { template: '<input />' }
      }
    }
  })
}

describe('word cloud helpers', () => {
  it('splits raw keywords and removes duplicates', () => {
    expect(splitPaperKeywords('天回医简， 释文整理,古籍数字化;天回医简\n川派医学')).toEqual([
      '天回医简',
      '释文整理',
      '古籍数字化',
      '川派医学'
    ])
  })

  it('prefers stored paper keywords and falls back to paper.keywords', () => {
    expect(resolvePaperKeywords([{ paperKeywordId: 2, keyword: '脉诊', weight: 8, source: '0' }], '天回医简,释文整理')).toEqual([
      { id: 2, keyword: '脉诊', weight: 8, source: '0' }
    ])

    expect(resolvePaperKeywords([], '天回医简,释文整理')).toEqual([
      { id: null, keyword: '天回医简', weight: 1, source: '2' },
      { id: null, keyword: '释文整理', weight: 1, source: '2' }
    ])
  })

  it('aggregates keyword weights across papers', () => {
    expect(aggregateKeywordWeights([
      { keyword: '天回医简', weight: 5 },
      { keyword: '图像识别', weight: 3 },
      { keyword: '天回医简', weight: 2 }
    ])).toEqual([
      { keyword: '天回医简', weight: 7 },
      { keyword: '图像识别', weight: 3 }
    ])
  })
})

describe('word cloud frontend logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPaperKeywordCloud.mockResolvedValue({ data: { keywords: [{ keyword: '天回医简', weight: 12 }] } })
    listPapers.mockResolvedValue({ data: { rows: [{ paperId: 1, title: '天回医简整理与川派医学文献数字化研究' }] } })
    getPaperKeywords
      .mockResolvedValueOnce({
        data: {
          paperId: 1,
          paperTitle: '天回医简整理与川派医学文献数字化研究',
          abstract: '摘要A',
          keywords: [{ id: 1, keyword: '天回医简', weight: 6, source: '2' }]
        }
      })
      .mockResolvedValueOnce({
        data: {
          paperId: 1,
          paperTitle: '天回医简整理与川派医学文献数字化研究',
          abstract: '摘要A',
          keywords: [{ id: 1, keyword: '天回医简', weight: 9, source: '2' }]
        }
      })
    updatePaperKeywords.mockResolvedValue({ data: null })
  })

  it('builds save payload and word cloud data mapping', () => {
    expect(buildKeywordSavePayload([
      { keyword: ' 天回医简 ', weight: '6', source: '2' },
      { keyword: '', weight: 0, source: '0' }
    ])).toEqual({
      keywords: [{ keyword: '天回医简', weight: 6, source: '2' }]
    })

    expect(mapKeywordsToWordCloudData([
      { keyword: '图像识别', weight: 3 },
      { keyword: '天回医简', weight: 8 }
    ])).toEqual([
      { name: '天回医简', value: 8 },
      { name: '图像识别', value: 3 }
    ])
  })

  it('reloads paper keywords after saving weights', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleModeChange('paper')
    await flushPromises()

    wrapper.vm.selectedPaperId = 1
    await wrapper.vm.handlePaperChange(1)
    await flushPromises()

    wrapper.vm.editableKeywords[0].weight = 9
    await wrapper.vm.handleSaveKeywords()
    await flushPromises()

    expect(updatePaperKeywords).toHaveBeenCalledWith(1, {
      keywords: [{ keyword: '天回医简', weight: 9, source: '2' }]
    })
    expect(getPaperKeywords).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.editableKeywords[0].weight).toBe(9)
    expect(messageSuccess).toHaveBeenCalledWith('关键词权重已保存')
  })
})
