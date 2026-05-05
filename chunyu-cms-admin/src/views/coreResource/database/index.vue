<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="名称">
          <el-input v-model="queryParams.title" placeholder="请输入数据库名称" clearable style="width: 220px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 140px">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增数据库</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="databaseList">
        <el-table-column label="背景图" prop="coverUrl" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.coverUrl"
              :src="row.coverUrl"
              :preview-src-list="[row.coverUrl]"
              fit="cover"
              style="width: 80px; height: 48px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="数据库名称" prop="title" min-width="180" show-overflow-tooltip />
        <el-table-column label="简介" prop="info" min-width="260" show-overflow-tooltip />
        <el-table-column label="访问地址" prop="url" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.url || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" prop="icon" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.icon || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="90" align="center" />
        <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
          <template #default="{ row }">
            <span>{{ formatTime(row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && !databaseList.length" description="暂无数据库资源" />

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
        <el-form-item label="数据库名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入数据库名称" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.info" type="textarea" :rows="3" placeholder="请输入简介" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="访问地址">
          <el-input v-model="form.url" placeholder="请输入访问地址" maxlength="500" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标 class 或图片 URL" maxlength="500" />
        </el-form-item>
        <el-form-item label="背景图">
          <ImageUpload v-model="form.coverUrl" :limit="1" :file-size="8" :file-type="['png', 'jpg', 'jpeg', 'webp']" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio label="active">启用</el-radio>
                <el-radio label="inactive">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" :max="999999" controls-position="right" style="width: 180px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CoreResourceDatabaseIndex">
import Pagination from '@/components/Pagination/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import {
  addResourceDatabase,
  deleteResourceDatabase,
  getResourceDatabase,
  pageResourceDatabase,
  updateResourceDatabase
} from '@/api/coreResource/database'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const databaseList = ref([])
const total = ref(0)
const formRef = ref()

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  status: ''
})

const form = reactive(buildDefaultForm())

const rules = {
  title: [{ required: true, message: '数据库名称不能为空', trigger: 'blur' }]
}

function buildDefaultForm() {
  return {
    id: undefined,
    databaseId: undefined,
    title: '',
    info: '',
    url: '',
    icon: '',
    coverUrl: '',
    status: 'active',
    sort: 0,
    remark: ''
  }
}

function resetFormData(data = buildDefaultForm()) {
  Object.assign(form, buildDefaultForm(), data)
  nextTick(() => formRef.value?.clearValidate?.())
}

function formatTime(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function getList() {
  loading.value = true
  try {
    const res = await pageResourceDatabase(queryParams)
    databaseList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
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
  queryParams.status = ''
  queryParams.pageNum = 1
  getList()
}

function handleAdd() {
  dialogTitle.value = '新增数据库'
  resetFormData()
  dialogVisible.value = true
}

async function handleUpdate(row) {
  dialogTitle.value = '编辑数据库'
  const res = await getResourceDatabase(row.id || row.databaseId)
  resetFormData(res?.data || row)
  dialogVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除数据库“${row.title}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await deleteResourceDatabase(row.id || row.databaseId)
  ElMessage.success('删除成功')
  if (databaseList.value.length === 1 && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }
  getList()
}

async function submitForm() {
  const valid = await formRef.value?.validate?.().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (form.id || form.databaseId) {
      await updateResourceDatabase(form)
      ElMessage.success('修改成功')
    } else {
      await addResourceDatabase(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList()
  } finally {
    submitLoading.value = false
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
</style>
