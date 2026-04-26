// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import TalentManagementPage from './index.vue'

const {
  pageTalent,
  getTalentDetail,
  addTalent,
  updateTalent,
  deleteTalent,
  listPaper,
  listPatent,
  listTopic,
  messageSuccess,
  confirmMock
} = vi.hoisted(() => ({
  pageTalent: vi.fn(),
  getTalentDetail: vi.fn(),
  addTalent: vi.fn(),
  updateTalent: vi.fn(),
  deleteTalent: vi.fn(),
  listPaper: vi.fn(),
  listPatent: vi.fn(),
  listTopic: vi.fn(),
  messageSuccess: vi.fn(),
  confirmMock: vi.fn()
}))

vi.mock('@/api/talentResearch/talent', () => ({
  pageTalent,
  getTalentDetail,
  addTalent,
  updateTalent,
  deleteTalent
}))

vi.mock('@/api/paperAchievement/paper', () => ({
  listPaper
}))

vi.mock('@/api/paperAchievement/patent', () => ({
  listPatent
}))

vi.mock('@/api/paperAchievement/topic', () => ({
  listTopic
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
  return shallowMount(TalentManagementPage, {
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
        'el-row': { template: '<div><slot /></div>' },
        'el-col': { template: '<div><slot /></div>' },
        'el-tag': { template: '<span><slot /></span>' },
        'el-dialog': { template: '<div><slot /><slot name="footer" /></div>' },
        'el-radio-group': { template: '<div><slot /></div>' },
        'el-radio': { template: '<label><slot /></label>' },
        'el-empty': { template: '<div class="empty-stub" />' },
        Pagination: { template: '<div class="pagination-stub" />' },
        ImageUpload: { template: '<div class="image-upload-stub" />' }
      }
    }
  })
}

describe('talent management page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pageTalent.mockResolvedValue({
      data: {
        rows: [
          {
            talentId: 1,
            id: 1,
            name: '张明远',
            title: '教授',
            organization: '成都中医药大学',
            researchDirection: '医简文献整理',
            resume: '长期从事医简文献整理研究。',
            photoUrl: '/uploads/images/talent.jpg',
            paperCount: 2,
            patentCount: 1,
            topicCount: 1,
            status: '1',
            updateTime: '2026-04-26 20:00:00'
          }
        ],
        total: 1
      }
    })
    getTalentDetail.mockResolvedValue({
      data: {
        id: 1,
        talentId: 1,
        name: '张明远',
        title: '教授',
        organization: '成都中医药大学',
        researchDirection: '医简文献整理',
        resume: '长期从事医简文献整理研究。',
        photoUrl: '/uploads/images/talent.jpg',
        paperIds: [1, 2],
        patentIds: [5],
        topicIds: [9],
        papers: [{ id: 1, title: '论文A' }, { id: 2, title: '论文B' }],
        patents: [{ id: 5, title: '专利A' }],
        topics: [{ id: 9, title: '课题A' }],
        status: '1'
      }
    })
    listPaper.mockResolvedValue({ data: { rows: [{ id: 1, title: '论文A' }, { id: 2, title: '论文B' }] } })
    listPatent.mockResolvedValue({ data: { rows: [{ id: 5, title: '专利A' }] } })
    listTopic.mockResolvedValue({ data: { rows: [{ id: 9, title: '课题A' }] } })
  })

  it('loads talent cards and supports name/organization/direction query', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(pageTalent).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 9,
      name: '',
      organization: '',
      researchDirection: '',
      status: ''
    })
    expect(wrapper.html()).toContain('张明远')
    expect(wrapper.html()).toContain('成都中医药大学')
    expect(wrapper.vm.buildCardStyle('/uploads/images/talent.jpg')).toEqual({
      backgroundImage: 'url(/uploads/images/talent.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    })

    wrapper.vm.queryParams.name = '张'
    wrapper.vm.queryParams.organization = '成都'
    wrapper.vm.queryParams.researchDirection = '医简'
    wrapper.vm.handleQuery()
    await flushPromises()

    expect(pageTalent).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 9,
      name: '张',
      organization: '成都',
      researchDirection: '医简',
      status: ''
    })
  })

  it('adds a talent with paper/patent/topic relations', async () => {
    addTalent.mockResolvedValue({ data: { talentId: 2 } })
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.formRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.form = {
      id: undefined,
      talentId: undefined,
      name: '李青禾',
      title: '研究员',
      organization: '中国中医科学院',
      researchDirection: '知识图谱',
      resume: '人才简历',
      photoUrl: '/uploads/images/li.jpg',
      paperIds: [1, 2],
      patentIds: [5],
      topicIds: [9],
      status: '1'
    }

    wrapper.vm.submitForm()
    await flushPromises()

    expect(addTalent).toHaveBeenCalledWith({
      id: undefined,
      talentId: undefined,
      name: '李青禾',
      title: '研究员',
      organization: '中国中医科学院',
      researchDirection: '知识图谱',
      resume: '人才简历',
      photoUrl: '/uploads/images/li.jpg',
      paperIds: [1, 2],
      patentIds: [5],
      topicIds: [9],
      status: '1'
    })
  })

  it('loads detail for edit, replays achievement relations, and deletes talent', async () => {
    updateTalent.mockResolvedValue({ data: { talentId: 1 } })
    confirmMock.mockResolvedValueOnce('confirm')
    deleteTalent.mockResolvedValue({})

    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleUpdate({ talentId: 1 })
    await flushPromises()

    expect(getTalentDetail).toHaveBeenCalledWith(1)
    expect(wrapper.vm.form.paperIds).toEqual([1, 2])
    expect(wrapper.vm.form.patentIds).toEqual([5])
    expect(wrapper.vm.form.topicIds).toEqual([9])

    wrapper.vm.formRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.form.status = '0'
    wrapper.vm.submitForm()
    await flushPromises()

    expect(updateTalent).toHaveBeenCalledWith({
      id: 1,
      talentId: 1,
      name: '张明远',
      title: '教授',
      organization: '成都中医药大学',
      researchDirection: '医简文献整理',
      resume: '长期从事医简文献整理研究。',
      photoUrl: '/uploads/images/talent.jpg',
      paperIds: [1, 2],
      patentIds: [5],
      topicIds: [9],
      status: '0'
    })

    await wrapper.vm.handleDelete({ talentId: 1, name: '张明远' })
    await flushPromises()
    expect(deleteTalent).toHaveBeenCalledWith(1)
  })
})
