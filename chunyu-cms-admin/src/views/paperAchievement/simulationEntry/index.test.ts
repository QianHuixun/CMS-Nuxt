// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import SimulationEntryPage from './index.vue'

const {
  pageBookSimulation,
  getBookSimulationDetail,
  addBookSimulation,
  updateBookSimulation,
  deleteBookSimulation,
  messageSuccess,
  confirmMock
} = vi.hoisted(() => ({
  pageBookSimulation: vi.fn(),
  getBookSimulationDetail: vi.fn(),
  addBookSimulation: vi.fn(),
  updateBookSimulation: vi.fn(),
  deleteBookSimulation: vi.fn(),
  messageSuccess: vi.fn(),
  confirmMock: vi.fn()
}))

vi.mock('@/api/paperAchievement/bookSimulation', () => ({
  pageBookSimulation,
  getBookSimulationDetail,
  addBookSimulation,
  updateBookSimulation,
  deleteBookSimulation
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess
  },
  ElMessageBox: {
    confirm: confirmMock
  }
}))

function createWrapper() {
  return shallowMount(SimulationEntryPage, {
    global: {
      directives: {
        loading: () => {}
      },
      stubs: {
        'el-card': { template: '<div><slot /></div>' },
        'el-form': { template: '<form><slot /></form>' },
        'el-form-item': { template: '<div><slot /></div>' },
        'el-input': { template: '<input />' },
        'el-input-number': { template: '<input />' },
        'el-select': { template: '<select><slot /></select>' },
        'el-option': { template: '<option><slot /></option>' },
        'el-button': { template: '<button><slot /></button>' },
        'el-table': { template: '<div><slot /></div>' },
        'el-table-column': { template: '<div class="table-column-stub" />' },
        'el-tag': { template: '<span><slot /></span>' },
        'el-dialog': { template: '<div><slot /><slot name="footer" /></div>' },
        'el-row': { template: '<div><slot /></div>' },
        'el-col': { template: '<div><slot /></div>' },
        'el-radio-group': { template: '<div><slot /></div>' },
        'el-radio': { template: '<label><slot /></label>' },
        'el-image': { template: '<img />' },
        'el-empty': { template: '<div class="empty-stub" />' },
        Pagination: { template: '<div class="pagination-stub" />' },
        ImageUpload: { template: '<div class="image-upload-stub" />' }
      }
    }
  })
}

describe('book simulation entry page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pageBookSimulation.mockResolvedValue({
      data: {
        rows: [
          {
            bookId: 1,
            id: 1,
            title: '天回医简专题图录',
            author: '成都中医药大学',
            publishYear: 2024,
            coverUrl: '/uploads/images/cover.jpg',
            backCoverUrl: '/uploads/images/back.jpg',
            chapterImageCount: 3,
            status: '1',
            updateTime: '2026-04-26 18:00:00'
          }
        ],
        total: 1
      }
    })
    getBookSimulationDetail.mockResolvedValue({
      data: {
        id: 1,
        bookId: 1,
        title: '天回医简专题图录',
        author: '成都中医药大学',
        publisher: '中医古籍出版社',
        publishYear: 2024,
        isbn: '978-7-0000-0000-1',
        description: '图录简介',
        coverUrl: '/uploads/images/cover.jpg',
        backCoverUrl: '/uploads/images/back.jpg',
        chapterImages: [
          { pageId: 1, pageNo: 1, imageUrl: '/uploads/images/page1.jpg', sort: 1 },
          { pageId: 2, pageNo: 2, imageUrl: '/uploads/images/page2.jpg', sort: 2 }
        ],
        status: '1'
      }
    })
  })

  it('loads paged books and supports title/year query', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(pageBookSimulation).toHaveBeenCalledWith({
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

    expect(pageBookSimulation).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '天回',
      publishYear: 2024,
      status: ''
    })
  })

  it('adds a book simulation record with chapter images', async () => {
    addBookSimulation.mockResolvedValue({ data: { bookId: 2 } })
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.formRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.form = {
      id: undefined,
      bookId: undefined,
      title: '新书籍',
      author: '作者A',
      publisher: '出版社A',
      publishYear: 2025,
      isbn: '978-7-1111-1111-1',
      description: '简介',
      coverUrl: '/uploads/images/new-cover.jpg',
      backCoverUrl: '/uploads/images/new-back.jpg',
      chapterImageUrls: '/uploads/images/page1.jpg,/uploads/images/page2.jpg',
      status: '1'
    }

    wrapper.vm.submitForm()
    await flushPromises()

    expect(addBookSimulation).toHaveBeenCalledWith({
      id: undefined,
      bookId: undefined,
      title: '新书籍',
      author: '作者A',
      publisher: '出版社A',
      publishYear: 2025,
      isbn: '978-7-1111-1111-1',
      description: '简介',
      coverUrl: '/uploads/images/new-cover.jpg',
      backCoverUrl: '/uploads/images/new-back.jpg',
      chapterImages: [
        { pageTitle: '', pageNo: 1, imageUrl: '/uploads/images/page1.jpg', sort: 1, status: '1' },
        { pageTitle: '', pageNo: 2, imageUrl: '/uploads/images/page2.jpg', sort: 2, status: '1' }
      ],
      status: '1'
    })
  })

  it('loads detail for edit and preview, then updates and deletes', async () => {
    updateBookSimulation.mockResolvedValue({ data: { bookId: 1 } })
    confirmMock.mockResolvedValueOnce('confirm')
    deleteBookSimulation.mockResolvedValue({})

    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleUpdate({ bookId: 1 })
    await flushPromises()
    expect(getBookSimulationDetail).toHaveBeenCalledWith(1)
    expect(wrapper.vm.form.chapterImageUrls).toBe('/uploads/images/page1.jpg,/uploads/images/page2.jpg')

    wrapper.vm.formRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.form.status = '0'
    wrapper.vm.submitForm()
    await flushPromises()

    expect(updateBookSimulation).toHaveBeenCalledWith({
      id: 1,
      bookId: 1,
      title: '天回医简专题图录',
      author: '成都中医药大学',
      publisher: '中医古籍出版社',
      publishYear: 2024,
      isbn: '978-7-0000-0000-1',
      description: '图录简介',
      coverUrl: '/uploads/images/cover.jpg',
      backCoverUrl: '/uploads/images/back.jpg',
      chapterImages: [
        { pageTitle: '', pageNo: 1, imageUrl: '/uploads/images/page1.jpg', sort: 1, status: '1' },
        { pageTitle: '', pageNo: 2, imageUrl: '/uploads/images/page2.jpg', sort: 2, status: '1' }
      ],
      status: '0'
    })

    await wrapper.vm.handlePreview({ bookId: 1 })
    await flushPromises()
    expect(wrapper.vm.previewBook.chapterImages).toHaveLength(2)

    await wrapper.vm.handleDelete({ bookId: 1, title: '待删书籍' })
    await flushPromises()
    expect(deleteBookSimulation).toHaveBeenCalledWith(1)
  })
})
