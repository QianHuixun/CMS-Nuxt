<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="书名">
          <el-input v-model="queryParams.title" placeholder="请输入书名" clearable style="width: 180px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="queryParams.author" placeholder="请输入作者" clearable style="width: 150px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="queryParams.isbn" placeholder="请输入ISBN" clearable style="width: 160px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="queryParams.category" placeholder="请选择类别" clearable style="width: 150px">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="已发布" value="1" />
            <el-option label="草稿" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增书籍</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Upload" @click="openImportDialog">批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">批量删除</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="bookList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="书名" prop="title" min-width="190" show-overflow-tooltip />
        <el-table-column label="作者" prop="author" width="130" show-overflow-tooltip />
        <el-table-column label="封面" prop="coverImage" width="80" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.coverImage"
              :src="row.coverImage"
              :preview-src-list="[row.coverImage]"
              fit="cover"
              style="width: 40px; height: 52px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="category" width="110" align="center">
          <template #default="{ row }">
            <el-tag>{{ getCategoryLabel(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出版社" prop="publisher" min-width="150" show-overflow-tooltip />
        <el-table-column label="出版日期" prop="publishDate" width="120" align="center" />
        <el-table-column label="ISBN" prop="isbn" width="160" show-overflow-tooltip />
        <el-table-column label="本体文件" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link v-if="row.objectKey" type="primary" :underline="false" @click="handleOpenObject(row)">
              {{ row.fileName || row.objectKey }}
            </el-link>
            <span v-else class="text-muted">未上传</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="1"
              inactive-value="0"
              active-text="发布"
              inactive-text="草稿"
              inline-prompt
              @change="value => handleStatusChange(row, value)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" />
        <el-table-column label="操作" width="230" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="getList"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="860px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="副标题">
              <el-input v-model="form.subtitle" placeholder="请输入副标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ISBN">
              <el-input v-model="form.isbn" placeholder="请输入ISBN" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书籍类别" prop="category">
              <el-select v-model="form.category" placeholder="请选择类别" style="width: 100%">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出版社">
              <el-input v-model="form.publisher" placeholder="请输入出版社" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版日期">
              <el-date-picker
                v-model="form.publishDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择出版日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio label="1">发布</el-radio>
                <el-radio label="0">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图片">
          <image-upload v-model="form.coverImage" :limit="1" :file-size="5" />
        </el-form-item>
        <el-form-item label="本体文件">
          <div class="object-upload">
            <el-upload
              action="#"
              :show-file-list="false"
              :http-request="handleObjectUpload"
              :before-upload="beforeObjectUpload"
            >
              <el-button icon="Upload" :loading="objectUploading">上传到 RustFS</el-button>
            </el-upload>
            <div v-if="form.objectKey" class="object-meta">
              <el-tag type="success">已绑定</el-tag>
              <span>{{ form.fileName || form.objectKey }}</span>
              <span v-if="form.fileSize">({{ formatFileSize(form.fileSize) }})</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="对象Key" v-if="form.objectKey">
          <el-input v-model="form.objectKey" readonly />
        </el-form-item>
        <el-form-item label="访问地址" v-if="form.objectUrl">
          <el-input v-model="form.objectUrl" readonly>
            <template #append>
              <el-button icon="Link" @click="openUrl(form.objectUrl)" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="书籍简介">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入书籍简介" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="书籍详情" width="820px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="书名" :span="2">{{ currentBook.title }}</el-descriptions-item>
        <el-descriptions-item label="副标题">{{ currentBook.subtitle || '-' }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ currentBook.author || '-' }}</el-descriptions-item>
        <el-descriptions-item label="ISBN">{{ currentBook.isbn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ getCategoryLabel(currentBook.category) }}</el-descriptions-item>
        <el-descriptions-item label="出版社">{{ currentBook.publisher || '-' }}</el-descriptions-item>
        <el-descriptions-item label="出版日期">{{ currentBook.publishDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="本体文件" :span="2">
          <el-link v-if="currentBook.objectUrl" type="primary" :underline="false" @click="openUrl(currentBook.objectUrl)">
            {{ currentBook.fileName || currentBook.objectKey }}
          </el-link>
          <span v-else>未上传</span>
        </el-descriptions-item>
        <el-descriptions-item label="对象Key" :span="2">{{ currentBook.objectKey || '-' }}</el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">{{ currentBook.summary || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="showImportDialog" title="批量导入" width="980px" append-to-body>
      <el-alert
        title="导入会先解析 Excel 并展示预览，只有校验通过的行会在确认后写入数据库。书籍本体文件仍需在单条书籍中上传到 RustFS。"
        type="info"
        show-icon
        :closable="false"
        class="import-alert"
      />
      <div class="import-actions">
        <el-upload
          action="#"
          :show-file-list="false"
          :http-request="handleImportPreview"
          :before-upload="beforeImportUpload"
        >
          <el-button type="primary" plain icon="Upload" :loading="importLoading">选择 Excel 并预览</el-button>
        </el-upload>
        <el-button icon="Download" @click="handleDownloadTemplate">下载模板</el-button>
      </div>
      <el-table v-if="importPreview.rows.length" :data="importPreview.rows" max-height="320" border>
        <el-table-column label="行号" prop="rowNo" width="70" align="center" />
        <el-table-column label="书名" prop="title" min-width="160" show-overflow-tooltip />
        <el-table-column label="作者" prop="author" width="120" show-overflow-tooltip />
        <el-table-column label="ISBN" prop="isbn" width="150" show-overflow-tooltip />
        <el-table-column label="类别" width="110" align="center">
          <template #default="{ row }">{{ getCategoryLabel(row.category) }}</template>
        </el-table-column>
        <el-table-column label="出版日期" prop="publishDate" width="120" align="center" />
        <el-table-column label="校验" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.importStatus === 'success' ? 'success' : 'danger'">
              {{ row.importStatus === 'success' ? '通过' : '错误' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误原因" prop="errorMessage" min-width="180" show-overflow-tooltip />
      </el-table>
      <el-empty v-else description="请选择导入文件" />
      <div class="import-summary" v-if="importPreview.rows.length">
        共 {{ importPreview.total }} 条，通过 {{ importPreview.successCount }} 条，错误 {{ importPreview.failCount }} 条
      </div>
      <template #footer>
        <el-button @click="showImportDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="!importPreview.successCount" :loading="importConfirmLoading" @click="handleImportConfirm">
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PaperAchievementBookImportIndex">
import { saveAs } from 'file-saver'
import Pagination from '@/components/Pagination/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import {
  addBook,
  changeBookStatus,
  confirmBookImport,
  delBook,
  downloadBookTemplate,
  exportBook,
  getBook,
  getBookAccessUrl,
  listBook,
  previewBookImport,
  updateBook,
  uploadBookObject
} from '@/api/paperAchievement/bookImport'

const loading = ref(false)
const submitLoading = ref(false)
const objectUploading = ref(false)
const importLoading = ref(false)
const importConfirmLoading = ref(false)
const bookList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const categoryOptions = [
  { label: '中医理论', value: 'theory' },
  { label: '临床实践', value: 'clinical' },
  { label: '中药学', value: 'pharmacy' },
  { label: '针灸推拿', value: 'acupuncture' },
  { label: '养生保健', value: 'health' },
  { label: '其他', value: 'other' }
]
const categoryLabelMap = categoryOptions.reduce((map, item) => {
  map[item.value] = item.label
  return map
}, {})

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  author: '',
  isbn: '',
  category: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const showImportDialog = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentBook = ref({})

const defaultForm = {
  id: undefined,
  bookId: undefined,
  title: '',
  subtitle: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  publishDate: '',
  coverImage: '',
  objectBucket: '',
  objectKey: '',
  objectUrl: '',
  objectEtag: '',
  fileName: '',
  fileSize: 0,
  mimeType: '',
  storageProvider: 'rustfs',
  summary: '',
  sort: 0,
  status: '0',
  remark: ''
}
const form = reactive({ ...defaultForm })

const importPreview = reactive({
  fileName: '',
  total: 0,
  successCount: 0,
  failCount: 0,
  rows: []
})

const rules = {
  title: [{ required: true, message: '书名不能为空', trigger: 'blur' }],
  author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }]
}

function getList() {
  loading.value = true
  listBook(queryParams)
    .then(res => {
      bookList.value = res.data?.rows || []
      total.value = res.data?.total || 0
    })
    .finally(() => {
      loading.value = false
    })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.title = ''
  queryParams.author = ''
  queryParams.isbn = ''
  queryParams.category = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id || item.bookId)
  multiple.value = !selection.length
}

function resetForm() {
  Object.assign(form, defaultForm)
  formRef.value?.clearValidate()
}

function handleAdd() {
  resetForm()
  dialogTitle.value = '新增书籍'
  dialogVisible.value = true
}

function handleDetail(row) {
  getBook(row.id || row.bookId).then(res => {
    currentBook.value = res.data || {}
    detailVisible.value = true
  })
}

function handleUpdate(row) {
  resetForm()
  getBook(row.id || row.bookId).then(res => {
    Object.assign(form, defaultForm, res.data || {})
    dialogTitle.value = '编辑书籍'
    dialogVisible.value = true
  })
}

function handleDelete(row) {
  const deleteIds = row ? [row.id || row.bookId] : ids.value
  if (!deleteIds.length) return
  const name = row?.title ? `“${row.title}”` : deleteIds.join(',')
  ElMessageBox.confirm(`是否确认删除书籍${name}？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delBook(deleteIds.join(',')).then(() => {
      ElMessage.success('删除成功')
      getList()
    })
  })
}

function handleStatusChange(row, status) {
  changeBookStatus({ ids: [row.id || row.bookId], status })
    .then(() => {
      ElMessage.success('状态已更新')
    })
    .catch(() => {
      row.status = status === '1' ? '0' : '1'
    })
}

function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return
    submitLoading.value = true
    const request = form.id || form.bookId ? updateBook : addBook
    request({ ...form })
      .then(() => {
        ElMessage.success(form.id || form.bookId ? '修改成功' : '新增成功')
        dialogVisible.value = false
        getList()
      })
      .finally(() => {
        submitLoading.value = false
      })
  })
}

function beforeObjectUpload(file) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowed = ['pdf', 'epub', 'mobi', 'azw3', 'txt', 'doc', 'docx']
  if (!allowed.includes(ext)) {
    ElMessage.error('请上传 pdf、epub、mobi、azw3、txt、doc 或 docx 文件')
    return false
  }
  if (file.size / 1024 / 1024 > 200) {
    ElMessage.error('书籍本体文件不能超过 200MB')
    return false
  }
  return true
}

function handleObjectUpload(option) {
  const data = new FormData()
  data.append('file', option.file)
  data.append('folder', 'books')
  objectUploading.value = true
  uploadBookObject(data)
    .then(res => {
      Object.assign(form, res.data || {})
      ElMessage.success('书籍本体已上传')
    })
    .catch(() => {
      option.onError?.()
    })
    .finally(() => {
      objectUploading.value = false
    })
}

function handleOpenObject(row) {
  getBookAccessUrl(row.id || row.bookId).then(res => {
    const url = res.data?.objectUrl || row.objectUrl
    if (!url) {
      ElMessage.warning('暂无可访问地址')
      return
    }
    openUrl(url)
  })
}

function openImportDialog() {
  resetImportPreview()
  showImportDialog.value = true
}

function beforeImportUpload(file) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['xlsx', 'xls'].includes(ext)) {
    ElMessage.error('请上传 xlsx 或 xls 文件')
    return false
  }
  return true
}

function handleImportPreview(option) {
  const data = new FormData()
  data.append('file', option.file)
  importLoading.value = true
  previewBookImport(data)
    .then(res => {
      Object.assign(importPreview, res.data || { rows: [] })
    })
    .catch(() => {
      option.onError?.()
    })
    .finally(() => {
      importLoading.value = false
    })
}

function handleImportConfirm() {
  importConfirmLoading.value = true
  confirmBookImport({
    fileName: importPreview.fileName,
    rows: importPreview.rows
  })
    .then(res => {
      ElMessage.success(`导入完成，成功 ${res.data?.successCount || 0} 条，失败 ${res.data?.failCount || 0} 条`)
      showImportDialog.value = false
      getList()
    })
    .finally(() => {
      importConfirmLoading.value = false
    })
}

function resetImportPreview() {
  Object.assign(importPreview, {
    fileName: '',
    total: 0,
    successCount: 0,
    failCount: 0,
    rows: []
  })
}

function handleDownloadTemplate() {
  downloadBookTemplate().then(blob => {
    saveAs(blob, '书籍导入模板.xlsx')
  })
}

function handleExport() {
  exportBook(queryParams).then(blob => {
    saveAs(blob, '书籍列表.csv')
  })
}

function getCategoryLabel(value) {
  return categoryLabelMap[value] || value || '-'
}

function formatFileSize(size) {
  const value = Number(size || 0)
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${value} B`
}

function openUrl(url) {
  if (!url) return
  window.open(url, '_blank')
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
}

.mb8 {
  margin-bottom: 16px;
}

.text-muted {
  color: #909399;
}

.object-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
}

.object-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #606266;
}

.import-alert {
  margin-bottom: 14px;
}

.import-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.import-summary {
  margin-top: 12px;
  color: #606266;
}
</style>
