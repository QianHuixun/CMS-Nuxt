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
  pagePatent,
  getPatentDetail,
  addPatent,
  updatePatent,
  deletePatent,
  pageTopic,
  getTopicDetail,
  addTopic,
  updateTopic,
  deleteTopic,
  previewImport,
  confirmImport,
  downloadImportTemplate,
  saveAs,
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
  pagePatent: vi.fn(),
  getPatentDetail: vi.fn(),
  addPatent: vi.fn(),
  updatePatent: vi.fn(),
  deletePatent: vi.fn(),
  pageTopic: vi.fn(),
  getTopicDetail: vi.fn(),
  addTopic: vi.fn(),
  updateTopic: vi.fn(),
  deleteTopic: vi.fn(),
  previewImport: vi.fn(),
  confirmImport: vi.fn(),
  downloadImportTemplate: vi.fn(),
  saveAs: vi.fn(),
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

vi.mock('@/api/paperAchievement/patent', () => ({
  pagePatent,
  getPatentDetail,
  addPatent,
  updatePatent,
  deletePatent
}))

vi.mock('@/api/paperAchievement/topic', () => ({
  pageTopic,
  getTopicDetail,
  addTopic,
  updateTopic,
  deleteTopic
}))

vi.mock('@/api/paperAchievement/import', () => ({
  previewImport,
  confirmImport,
  downloadImportTemplate
}))

vi.mock('file-saver', () => ({
  saveAs
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
        'el-tabs': { template: '<div><slot /></div>' },
        'el-tab-pane': { template: '<div><slot /></div>' },
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
        'el-link': { template: '<a><slot /></a>' },
        'el-empty': { template: '<div class="empty-stub" />' },
        Pagination: { template: '<div class="pagination-stub" />' },
        VideoUploader: { template: '<div class="video-uploader-stub" />' },
        ImageUpload: { template: '<div class="image-upload-stub" />' }
      }
    }
  })
}

describe('paper/patent/topic import page', () => {
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
    pagePatent.mockResolvedValue({
      data: {
        rows: [
          {
            patentId: 1,
            id: 1,
            title: '中医脉诊辅助诊断装置',
            patentNo: 'CN20240001',
            applicant: '成都中医药大学',
            applyYear: 2024,
            operationVideoUrl: '/uploads/videos/demo.mp4',
            videoCoverUrl: '/uploads/images/demo.jpg',
            status: '1',
            updateTime: '2026-04-26 10:00:00'
          }
        ],
        total: 1
      }
    })
    pageTopic.mockResolvedValue({
      data: {
        rows: [
          {
            projectId: 1,
            topicId: 1,
            id: 1,
            title: '川派医学数字化课题',
            topicNo: 'TOPIC-2024-001',
            leader: '张教授',
            projectYear: 2024,
            source: '省部级课题',
            status: '1',
            updateTime: '2026-04-26 10:00:00'
          }
        ],
        total: 1
      }
    })
    previewImport.mockResolvedValue({
      data: {
        summary: {
          total: 3,
          valid: 2,
          invalid: 1
        },
        rows: [
          { rowNo: 2, valid: true, errors: [], data: { title: '导入论文A', publishYear: 2024, status: '1' } },
          { rowNo: 3, valid: false, errors: ['标题不能为空'], data: { title: '', publishYear: 2023, status: '0' } },
          { rowNo: 4, valid: true, errors: [], data: { title: '导入论文B', publishYear: 2022, status: '1' } }
        ]
      }
    })
    confirmImport.mockResolvedValue({
      data: {
        successCount: 2,
        failCount: 1,
        failRows: [{ rowNo: 3, reason: '标题不能为空' }]
      }
    })
    downloadImportTemplate.mockResolvedValue(new Blob(['template']))
  })

  it('loads paged papers and keeps paper tab query behavior', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(pagePaper).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '',
      publishYear: undefined,
      isFeatured: '',
      status: ''
    })

    wrapper.vm.paperQueryParams.title = '天回'
    wrapper.vm.paperQueryParams.publishYear = 2024
    wrapper.vm.paperQueryParams.isFeatured = '1'
    wrapper.vm.handleQuery()
    await flushPromises()

    expect(pagePaper).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '天回',
      publishYear: 2024,
      isFeatured: '1',
      status: ''
    })
  })

  it('loads patent list and submits video and cover fields', async () => {
    addPatent.mockResolvedValue({ data: { patentId: 2 } })
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.activeTab = 'patent'
    await wrapper.vm.handleTabChange('patent')
    await flushPromises()

    expect(pagePatent).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '',
      applyYear: undefined,
      status: ''
    })

    wrapper.vm.patentFormRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.patentForm = {
      id: undefined,
      patentId: undefined,
      title: '新专利',
      patentNo: 'CN20250001',
      applicant: '申请人A',
      applyYear: 2025,
      abstract: '专利摘要',
      operationVideoUrl: '/uploads/videos/patent.mp4',
      videoCoverUrl: '/uploads/images/patent.jpg',
      status: '1'
    }

    wrapper.vm.submitForm()
    await flushPromises()

    expect(addPatent).toHaveBeenCalledWith({
      id: undefined,
      patentId: undefined,
      title: '新专利',
      patentNo: 'CN20250001',
      applicant: '申请人A',
      applyYear: 2025,
      abstract: '专利摘要',
      operationVideoUrl: '/uploads/videos/patent.mp4',
      videoCoverUrl: '/uploads/images/patent.jpg',
      status: '1'
    })
  })

  it('edits and deletes patent', async () => {
    getPatentDetail.mockResolvedValue({
      data: {
        id: 1,
        patentId: 1,
        title: '已存在专利',
        patentNo: 'CN20240002',
        applicant: '申请人B',
        applyYear: 2024,
        abstract: '摘要',
        operationVideoUrl: '/uploads/videos/exist.mp4',
        videoCoverUrl: '/uploads/images/exist.jpg',
        status: '0'
      }
    })
    updatePatent.mockResolvedValue({ data: { patentId: 1 } })
    confirmMock.mockResolvedValueOnce('confirm')
    deletePatent.mockResolvedValue({})

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.activeTab = 'patent'

    await wrapper.vm.handleUpdate({ patentId: 1 })
    await flushPromises()

    wrapper.vm.patentFormRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.patentForm.status = '1'
    wrapper.vm.submitForm()
    await flushPromises()

    expect(updatePatent).toHaveBeenCalledWith({
      id: 1,
      patentId: 1,
      title: '已存在专利',
      patentNo: 'CN20240002',
      applicant: '申请人B',
      applyYear: 2024,
      abstract: '摘要',
      operationVideoUrl: '/uploads/videos/exist.mp4',
      videoCoverUrl: '/uploads/images/exist.jpg',
      status: '1'
    })

    await wrapper.vm.handleDelete({ patentId: 1, title: '待删专利' })
    await flushPromises()

    expect(deletePatent).toHaveBeenCalledWith(1)
  })

  it('loads topic list and supports add/edit/delete/query', async () => {
    getTopicDetail.mockResolvedValue({
      data: {
        id: 1,
        projectId: 1,
        topicId: 1,
        title: '已存在课题',
        topicNo: 'TOPIC-001',
        leader: '李老师',
        projectYear: 2024,
        source: '国家级',
        abstract: '课题摘要',
        status: '0'
      }
    })
    addTopic.mockResolvedValue({ data: { topicId: 2 } })
    updateTopic.mockResolvedValue({ data: { topicId: 1 } })
    confirmMock.mockResolvedValueOnce('confirm')
    deleteTopic.mockResolvedValue({})

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.activeTab = 'topic'
    await wrapper.vm.handleTabChange('topic')
    await flushPromises()

    expect(pageTopic).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '',
      projectYear: undefined,
      status: ''
    })

    wrapper.vm.topicQueryParams.title = '川派'
    wrapper.vm.topicQueryParams.projectYear = 2024
    wrapper.vm.handleQuery()
    await flushPromises()

    expect(pageTopic).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 10,
      title: '川派',
      projectYear: 2024,
      status: ''
    })

    wrapper.vm.topicFormRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.topicForm = {
      id: undefined,
      projectId: undefined,
      title: '新课题',
      topicNo: 'TOPIC-NEW',
      leader: '王老师',
      projectYear: 2025,
      source: '省部级',
      abstract: '摘要',
      status: '1'
    }
    wrapper.vm.submitForm()
    await flushPromises()

    expect(addTopic).toHaveBeenCalledWith({
      id: undefined,
      projectId: undefined,
      title: '新课题',
      topicNo: 'TOPIC-NEW',
      leader: '王老师',
      projectYear: 2025,
      source: '省部级',
      abstract: '摘要',
      status: '1'
    })

    await wrapper.vm.handleUpdate({ projectId: 1, topicId: 1 })
    await flushPromises()

    wrapper.vm.topicFormRef = {
      validate: callback => callback(true)
    }
    wrapper.vm.topicForm.status = '1'
    wrapper.vm.submitForm()
    await flushPromises()

    expect(updateTopic).toHaveBeenCalledWith({
      id: 1,
      projectId: 1,
      title: '已存在课题',
      topicNo: 'TOPIC-001',
      leader: '李老师',
      projectYear: 2024,
      source: '国家级',
      abstract: '课题摘要',
      status: '1'
    })

    await wrapper.vm.handleDelete({ projectId: 1, title: '待删课题' })
    await flushPromises()
    expect(deleteTopic).toHaveBeenCalledWith(1)
  })

  it('toggles featured state without breaking paper tab', async () => {
    updatePaperFeatured.mockResolvedValue({})
    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.vm.handleToggleFeatured({ paperId: 1, isFeatured: '0' })
    await flushPromises()

    expect(updatePaperFeatured).toHaveBeenCalledWith(1, { isFeatured: '1' })
  })

  it('downloads template and previews plus confirms xlsx import rows', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.openImportDialog('paper')
    await wrapper.vm.handleDownloadTemplate()
    expect(downloadImportTemplate).toHaveBeenCalledWith('paper')
    expect(saveAs).toHaveBeenCalled()

    const file = new File(['xlsx-data'], 'paper.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    await wrapper.vm.handleImportFileChange({
      target: {
        files: [file],
        value: 'paper.xlsx'
      }
    })
    await flushPromises()

    expect(previewImport).toHaveBeenCalled()
    expect(wrapper.vm.importPreview.summary).toEqual({
      total: 3,
      valid: 2,
      invalid: 1
    })

    const previewRows = wrapper.vm.importPreview.rows
    await wrapper.vm.handleConfirmImport()
    await flushPromises()

    expect(confirmImport).toHaveBeenCalledWith({
      type: 'paper',
      rows: previewRows
    })
  })

  it('removes patent video and cover independently', async () => {
    confirmMock.mockResolvedValueOnce('confirm')
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.patentForm.operationVideoUrl = '/uploads/videos/demo.mp4'
    wrapper.vm.patentForm.videoCoverUrl = '/uploads/images/demo.jpg'
    wrapper.vm.patentVideoStatus = 'success'

    await wrapper.vm.handleRemovePatentVideo()
    expect(wrapper.vm.patentForm.operationVideoUrl).toBe('')
    expect(wrapper.vm.patentForm.videoCoverUrl).toBe('')

    wrapper.vm.patentForm.videoCoverUrl = '/uploads/images/demo.jpg'
    wrapper.vm.handleRemovePatentCover()
    expect(wrapper.vm.patentForm.videoCoverUrl).toBe('')
  })
})
