<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="书名">
          <el-input v-model="queryParams.title" placeholder="请输入书名" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item label="出版年份">
          <el-input-number v-model="queryParams.publishYear" :min="0" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="发布" value="1" />
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
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="bookList">
        <el-table-column label="书名" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column label="作者" prop="author" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.author || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出版年份" prop="publishYear" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.publishYear || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="88" align="center">
          <template #default="{ row }">
            <el-image v-if="row.coverUrl" :src="row.coverUrl" fit="cover" class="table-image" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="封底" width="88" align="center">
          <template #default="{ row }">
            <el-image v-if="row.backCoverUrl" :src="row.backCoverUrl" fit="cover" class="table-image" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="核心章节图片数" prop="chapterImageCount" width="130" align="center">
          <template #default="{ row }">
            <span>{{ row.chapterImageCount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'">
              {{ row.status === '1' ? '发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="handlePreview(row)">预览</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="920px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社">
              <el-input v-model="form.publisher" placeholder="请输入出版社" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出版年份" prop="publishYear">
              <el-input-number v-model="form.publishYear" :min="0" :max="9999" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ISBN">
              <el-input v-model="form.isbn" placeholder="请输入 ISBN" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入书籍简介" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="封面">
              <ImageUpload
                v-model="form.coverUrl"
                :limit="1"
                :file-size="5"
                :file-type="['png', 'jpg', 'jpeg', 'webp']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封底">
              <ImageUpload
                v-model="form.backCoverUrl"
                :limit="1"
                :file-size="5"
                :file-type="['png', 'jpg', 'jpeg', 'webp']"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="核心章节图片">
          <ImageUpload
            v-model="form.chapterImageUrls"
            :limit="20"
            :file-size="8"
            :file-type="['png', 'jpg', 'jpeg', 'webp']"
          />
          <div class="upload-tip">支持多图上传，系统将按上传顺序自动生成页码与排序。</div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">发布</el-radio>
            <el-radio label="0">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="书籍图片预览" width="880px" append-to-body>
      <div v-if="previewBook" class="preview-layout">
        <div class="preview-base">
          <div class="preview-book-card">
            <el-image v-if="previewBook.coverUrl" :src="previewBook.coverUrl" fit="cover" class="preview-cover" />
            <div v-else class="preview-placeholder">暂无封面</div>
            <div class="preview-meta">
              <strong>{{ previewBook.title }}</strong>
              <span>{{ previewBook.author || '未填写作者' }}</span>
            </div>
          </div>
          <div class="preview-book-card">
            <el-image v-if="previewBook.backCoverUrl" :src="previewBook.backCoverUrl" fit="cover" class="preview-cover" />
            <div v-else class="preview-placeholder">暂无封底</div>
            <div class="preview-meta">
              <strong>封底</strong>
              <span>{{ previewBook.publisher || '未填写出版社' }}</span>
            </div>
          </div>
        </div>
        <div class="preview-pages">
          <div class="preview-pages-title">核心章节图片</div>
          <div v-if="previewBook.chapterImages?.length" class="preview-grid">
            <div v-for="item in previewBook.chapterImages" :key="item.pageId || item.imageUrl" class="preview-page-card">
              <el-image :src="item.imageUrl" fit="cover" class="preview-page-image" />
              <div class="preview-page-text">第 {{ item.pageNo }} 页</div>
            </div>
          </div>
          <el-empty v-else description="暂无核心章节图片" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="PaperAchievementSimulationEntryIndex">
import Pagination from '@/components/Pagination/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import {
  addBookSimulation,
  deleteBookSimulation,
  getBookSimulationDetail,
  pageBookSimulation,
  updateBookSimulation
} from '@/api/paperAchievement/bookSimulation'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const bookList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const previewVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const previewBook = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  publishYear: undefined,
  status: ''
})

const form = ref(createEmptyForm())

const rules = {
  title: [{ required: true, message: '书名不能为空', trigger: 'blur' }]
}

function createEmptyForm() {
  return {
    id: undefined,
    bookId: undefined,
    title: '',
    author: '',
    publisher: '',
    publishYear: undefined,
    isbn: '',
    description: '',
    coverUrl: '',
    backCoverUrl: '',
    chapterImageUrls: '',
    status: '0'
  }
}

function formatDateTime(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function getList() {
  loading.value = true
  try {
    const res = await pageBookSimulation({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      title: queryParams.title,
      publishYear: queryParams.publishYear,
      status: queryParams.status
    })
    bookList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
    total.value = Number(res?.data?.total || 0)
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.title = ''
  queryParams.publishYear = undefined
  queryParams.status = ''
  queryParams.pageNum = 1
  getList()
}

function handleAdd() {
  form.value = createEmptyForm()
  dialogTitle.value = '新增书籍仿真记录'
  dialogVisible.value = true
}

async function handleUpdate(row) {
  const res = await getBookSimulationDetail(row.bookId)
  form.value = mapDetailToForm(res.data)
  dialogTitle.value = '编辑书籍仿真记录'
  dialogVisible.value = true
}

async function handlePreview(row) {
  const res = await getBookSimulationDetail(row.bookId)
  previewBook.value = res.data
  previewVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除书籍“${row.title}”？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await deleteBookSimulation(row.bookId)
  ElMessage.success('删除成功')
  if (bookList.value.length === 1 && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }
  getList()
}

function submitForm() {
  formRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      const payload = {
        id: form.value.id,
        bookId: form.value.bookId,
        title: form.value.title,
        author: form.value.author,
        publisher: form.value.publisher,
        publishYear: form.value.publishYear,
        isbn: form.value.isbn,
        description: form.value.description,
        coverUrl: form.value.coverUrl,
        backCoverUrl: form.value.backCoverUrl,
        chapterImages: buildChapterImages(form.value.chapterImageUrls),
        status: form.value.status
      }

      if (form.value.bookId) {
        await updateBookSimulation(payload)
        ElMessage.success('修改成功')
      } else {
        await addBookSimulation(payload)
        ElMessage.success('新增成功')
      }

      dialogVisible.value = false
      getList()
    } finally {
      submitLoading.value = false
    }
  })
}

function buildChapterImages(value) {
  return normalizeImageUrls(value).map((imageUrl, index) => ({
    pageTitle: '',
    pageNo: index + 1,
    imageUrl,
    sort: index + 1,
    status: '1'
  }))
}

function normalizeImageUrls(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item.trim() : item?.url || ''))
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

function mapDetailToForm(data = {}) {
  return {
    id: data.id,
    bookId: data.bookId,
    title: data.title || '',
    author: data.author || '',
    publisher: data.publisher || '',
    publishYear: data.publishYear,
    isbn: data.isbn || '',
    description: data.description || '',
    coverUrl: data.coverUrl || '',
    backCoverUrl: data.backCoverUrl || '',
    chapterImageUrls: Array.isArray(data.chapterImages) ? data.chapterImages.map(item => item.imageUrl).filter(Boolean).join(',') : '',
    status: data.status || '0'
  }
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

.table-image {
  width: 48px;
  height: 64px;
  border-radius: 6px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #6b7280;
}

.preview-layout {
  display: grid;
  gap: 20px;
}

.preview-base {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.preview-book-card {
  overflow: hidden;
  border: 1px solid #e5e9f2;
  border-radius: 16px;
  background: #f8fafc;
}

.preview-cover {
  width: 100%;
  height: 260px;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: #94a3b8;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;

  strong {
    color: #1f2937;
  }

  span {
    font-size: 12px;
    color: #6b7280;
  }
}

.preview-pages-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.preview-page-card {
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid #e5e9f2;
  background: #fff;
}

.preview-page-image {
  width: 100%;
  height: 160px;
}

.preview-page-text {
  padding: 10px 12px;
  font-size: 12px;
  color: #475569;
}
</style>
