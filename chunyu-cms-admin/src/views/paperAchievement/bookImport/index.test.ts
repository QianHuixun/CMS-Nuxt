// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import PaperImportPage from './index.vue'

const {
  pagePaper,
  getPaperDetail,
  addPaper,
  updatePaper,
  deletePaper,
  updatePaperFeatured,
  messageSuccess,
  confirmMock,
  alertMock
} = vi.hoisted(() => ({
  pagePaper: vi.fn(),
  getPaperDetail: vi.fn(),
  addPaper: vi.fn(),
  updatePaper: vi.fn(),
  deletePaper: vi.fn(),
  updatePaperFeatured: vi.fn(),
  messageSuccess: vi.fn(),
  confirmMock: vi.fn(),
  alertMock: vi.fn()
}))

vi.mock('@/api/paperAchievement/paper', () => ({
  pagePaper,
  getPaperDetail,
  addPaper,
  updatePaper,
  deletePaper,
  updatePaperFeatured
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess
  },
  ElMessageBox: {
    confirm: confirmMock,
    alert: alertMock
  }
}))

function createWrapper() {
  return shallowMount(PaperImportPage, {
    global: {
      directives: {
        loading: () => {}
      },
      stubs: {
        'el-card': { template: '<div><slot name="header" /><slot /></div>' },
        'el-form': { template: '<form><slot /></form>' },
        'el-form-item': { template: '<div><slot /></div>' },
        'el-input': { template: '<input />' },
        'el-input-number': { template: '<input />' },
        'el-select': { template: '<select><slot /></select>' },
        'el-option': { template: '<option><slot /></option>' },
        'el-button': { template: '<button><slot /></button>' },
        'el-table': { template: '<div><slot /></div>' },
        'el-table-column': { template: '<div class="el-table-column-stub" />' },
        'el-tag': { template: '<span><slot /></span>' },
        'el-dialog': { template: '<div><slot /><slot name="footer" /></div>' },
        'el-row': { template: '<div><slot /></div>' },
        'el-col': { template: '<div><slot /></div>' },
        'el-radio-group': { template: '<div><slot /></div>' },
        'el-radio': { template: '<label><slot /></label>' },
        Pagination: { template: '<div class="pagination-stub" />' }
      }
    }
  })
}

describe('paper import page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pagePaper.mockResolvedValue({
      data: {
        rows: [
          {
            paperId: 1,
            id: 1,
            title: '天回医简整理与川派医学文献数字化研究',
            publishYear: 2024,
            keywords: '天回医简,释文整理',
            isFeatured: '1',
            status: '1',
            updateTime: '2026-04-26 10:00:00'
          }
        ],
        total: 1
      }
    })
  })

  it('loads paged papers and passes title/year query', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(pagePaper).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '',
      publishYear: undefined,
      status: ''
    })

    wrapper.vm.queryParams.title = '天回'
    wrapper.vm.queryParams.publishYear = 2024
    wrapper.vm.handleQuery()
    await flushPromises()

    expect(pagePaper).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '天回',
      publishYear: 2024,
      status: ''
    })
  })

  it('adds a paper', async () => {
    addPaper.mockResolvedValue({ data: { paperId: 2 } })
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.formRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.form = {
      id: undefined,
      paperId: undefined,
      title: '新论文',
      publishYear: 2025,
      keywords: '关键词A,关键词B',
      abstract: '摘要',
      isFeatured: '0',
      status: '1'
    }

    wrapper.vm.submitForm()
    await flushPromises()

    expect(addPaper).toHaveBeenCalledWith({
      id: undefined,
      paperId: undefined,
      title: '新论文',
      publishYear: 2025,
      keywords: '关键词A,关键词B',
      abstract: '摘要',
      isFeatured: '0',
      status: '1'
    })
  })

  it('edits a paper after loading detail', async () => {
    getPaperDetail.mockResolvedValue({
      data: {
        id: 1,
        paperId: 1,
        title: '已存在论文',
        publishYear: 2024,
        keywords: '关键词',
        abstract: '摘要',
        isFeatured: '1',
        status: '0'
      }
    })
    updatePaper.mockResolvedValue({ data: { paperId: 1 } })
    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleUpdate({ paperId: 1 })
    await flushPromises()

    wrapper.vm.formRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.form.status = '1'
    wrapper.vm.submitForm()
    await flushPromises()

    expect(getPaperDetail).toHaveBeenCalledWith(1)
    expect(updatePaper).toHaveBeenCalledWith({
      id: 1,
      paperId: 1,
      title: '已存在论文',
      publishYear: 2024,
      keywords: '关键词',
      abstract: '摘要',
      isFeatured: '1',
      status: '1'
    })
  })

  it('deletes paper logically after confirmation', async () => {
    confirmMock.mockResolvedValueOnce('confirm')
    deletePaper.mockResolvedValue({})
    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleDelete({ paperId: 1, title: '待删论文' })
    await flushPromises()

    expect(deletePaper).toHaveBeenCalledWith(1)
    expect(messageSuccess).toHaveBeenCalledWith('删除成功')
  })

  it('toggles featured state', async () => {
    updatePaperFeatured.mockResolvedValue({})
    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleToggleFeatured({ paperId: 1, isFeatured: '0' })
    await flushPromises()

    expect(updatePaperFeatured).toHaveBeenCalledWith(1, { isFeatured: '1' })
  })
})
