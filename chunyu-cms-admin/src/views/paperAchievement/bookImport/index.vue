<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="论文标题">
          <el-input v-model="queryParams.title" placeholder="请输入论文标题" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item label="发表年份">
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增论文</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Upload" @click="handleImportPlaceholder">批量导入</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="paperList">
        <el-table-column label="标题" prop="title" min-width="220" show-overflow-tooltip />
        <el-table-column label="年份" prop="publishYear" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.publishYear || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关键词" prop="keywords" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.keywords || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否精选" prop="isFeatured" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isFeatured === '1' ? 'warning' : 'info'">
              {{ row.isFeatured === '1' ? '是' : '否' }}
            </el-tag>
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
        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
            <el-button
              link
              :type="row.isFeatured === '1' ? 'warning' : 'success'"
              @click="handleToggleFeatured(row)"
            >
              {{ row.isFeatured === '1' ? '取消精选' : '设为精选' }}
            </el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="760px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="论文标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入论文标题" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发表年份" prop="publishYear">
              <el-input-number v-model="form.publishYear" :min="0" :max="9999" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否精选" prop="isFeatured">
              <el-radio-group v-model="form.isFeatured">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="form.keywords" type="textarea" :rows="3" placeholder="请输入关键词，建议使用逗号分隔" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.abstract" type="textarea" :rows="4" placeholder="请输入论文摘要" />
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
  </div>
</template>

<script setup name="PaperAchievementBookImportIndex">
import Pagination from '@/components/Pagination/index.vue'
import { addPaper, deletePaper, getPaperDetail, pagePaper, updatePaper, updatePaperFeatured } from '@/api/paperAchievement/paper'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const paperList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  publishYear: undefined,
  status: ''
})

const form = ref(createEmptyForm())

const rules = {
  title: [{ required: true, message: '论文标题不能为空', trigger: 'blur' }]
}

function createEmptyForm() {
  return {
    id: undefined,
    paperId: undefined,
    title: '',
    publishYear: undefined,
    keywords: '',
    abstract: '',
    isFeatured: '0',
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
    const res = await pagePaper({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      title: queryParams.title,
      publishYear: queryParams.publishYear,
      status: queryParams.status
    })

    paperList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
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
  dialogTitle.value = '新增论文'
  dialogVisible.value = true
}

async function handleUpdate(row) {
  const res = await getPaperDetail(row.paperId)
  form.value = {
    id: res.data?.id,
    paperId: res.data?.paperId,
    title: res.data?.title || '',
    publishYear: res.data?.publishYear,
    keywords: res.data?.keywords || '',
    abstract: res.data?.abstract || '',
    isFeatured: res.data?.isFeatured || '0',
    status: res.data?.status || '0'
  }
  dialogTitle.value = '编辑论文'
  dialogVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除论文“${row.title}”？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await deletePaper(row.paperId)
  ElMessage.success('删除成功')

  if (paperList.value.length === 1 && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }

  getList()
}

async function handleToggleFeatured(row) {
  const nextValue = row.isFeatured === '1' ? '0' : '1'
  await updatePaperFeatured(row.paperId, { isFeatured: nextValue })
  ElMessage.success(nextValue === '1' ? '已设为精选论文' : '已取消精选')
  getList()
}

function handleImportPlaceholder() {
  ElMessageBox.alert('批量导入能力后续接入', '提示', {
    confirmButtonText: '我知道了',
    type: 'info'
  })
}

function submitForm() {
  formRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      const payload = {
        id: form.value.id,
        paperId: form.value.paperId,
        title: form.value.title,
        publishYear: form.value.publishYear,
        keywords: form.value.keywords,
        abstract: form.value.abstract,
        isFeatured: form.value.isFeatured,
        status: form.value.status
      }

      if (form.value.paperId) {
        await updatePaper(payload)
        ElMessage.success('修改成功')
      } else {
        await addPaper(payload)
        ElMessage.success('新增成功')
      }

      dialogVisible.value = false
      getList()
    } finally {
      submitLoading.value = false
    }
  })
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
</style>
