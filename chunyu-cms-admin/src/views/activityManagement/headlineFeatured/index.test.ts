// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import HeadlineFeaturedPage from './index.vue'

const {
  listActivity,
  updateActivity,
  messageSuccess,
  confirmMock
} = vi.hoisted(() => ({
  listActivity: vi.fn(),
  updateActivity: vi.fn(),
  messageSuccess: vi.fn(),
  confirmMock: vi.fn()
}))

vi.mock('@/api/activityManagement/activity', () => ({
  listActivity,
  updateActivity
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
  return shallowMount(HeadlineFeaturedPage, {
    global: {
      directives: {
        loading: () => {}
      },
      stubs: {
        'el-card': { template: '<div><slot /></div>' },
        'el-form': { template: '<form><slot /></form>' },
        'el-form-item': { template: '<div><slot /></div>' },
        'el-input': { template: '<input />' },
        'el-select': { template: '<select><slot /></select>' },
        'el-option': { template: '<option><slot /></option>' },
        'el-button': { template: '<button><slot /></button>' },
        'el-table': { template: '<div><slot /></div>' },
        'el-table-column': { template: '<div class="el-table-column-stub" />' },
        'el-tag': { template: '<span><slot /></span>' },
        'el-image': { template: '<img />' },
        'el-empty': { template: '<div class="el-empty-stub" />' },
        Pagination: {
          template: '<div class="pagination-stub" />'
        }
      }
    }
  })
}

describe('headlineFeatured page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads headline activities on mount with forced isHeadline filter', async () => {
    listActivity.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 2, name: '普通活动', isHeadline: '0', sort: 0, updateTime: '2026-04-24 10:00:00' },
          { id: 1, name: '头条活动', isHeadline: '1', sort: 1, updateTime: '2026-04-24 09:00:00' }
        ],
        total: 2
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    expect(listActivity).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
      isHeadline: '1'
    })
    expect(wrapper.vm.headlineList.map(item => item.id)).toEqual([1, 2])
    expect(wrapper.vm.total).toBe(2)
  })

  it('uses keyword and status when searching headline activities', async () => {
    listActivity.mockResolvedValue({
      data: {
        rows: [],
        total: 0
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.queryParams.keyword = '222'
    wrapper.vm.queryParams.status = '0'
    wrapper.vm.queryParams.pageNum = 3

    wrapper.vm.handleQuery()
    await flushPromises()

    expect(listActivity).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 10,
      keyword: '222',
      status: '0',
      isHeadline: '1'
    })
  })

  it('cancels headline status and refreshes the list', async () => {
    listActivity
      .mockResolvedValueOnce({
        data: {
          rows: [{ id: 10, name: '222', isHeadline: '1', sort: 0, status: '0', updateTime: '2026-04-24 20:40:52' }],
          total: 1
        }
      })
      .mockResolvedValueOnce({
        data: {
          rows: [],
          total: 0
        }
      })
    confirmMock.mockResolvedValueOnce('confirm')
    updateActivity.mockResolvedValueOnce({})

    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleCancelHeadline({ id: 10, name: '222' })
    await flushPromises()

    expect(confirmMock).toHaveBeenCalled()
    expect(updateActivity).toHaveBeenCalledWith({ id: 10, isHeadline: '0' })
    expect(messageSuccess).toHaveBeenCalledWith('头条已取消')
    expect(listActivity).toHaveBeenCalledTimes(2)
  })
})
