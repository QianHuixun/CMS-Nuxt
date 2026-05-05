<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="名称">
          <el-input v-model="queryParams.title" placeholder="请输入工具名称" clearable style="width: 220px" @keyup.enter="handleQuery" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增工具</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="toolList">
        <el-table-column label="工具名称" prop="title" min-width="180" show-overflow-tooltip />
        <el-table-column label="说明" prop="description" min-width="280" show-overflow-tooltip />
        <el-table-column label="访问地址" prop="url" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.url || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" prop="icon" min-width="150" show-overflow-tooltip>
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

      <el-empty v-if="!loading && !toolList.length" description="暂无自研工具" />

      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="720px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工具名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入工具名称" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item label="工具说明">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入工具说明" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="访问地址">
          <el-input v-model="form.url" placeholder="请输入访问地址" maxlength="500" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标 class 或图片 URL" maxlength="500" />
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

<script setup name="CoreResourceToolIndex">
import Pagination from '@/components/Pagination/index.vue'
import {
  addResearchTool,
  deleteResearchTool,
  getResearchTool,
  pageResearchTool,
  updateResearchTool
} from '@/api/coreResource/tool'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const toolList = ref([])
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
  title: [{ required: true, message: '工具名称不能为空', trigger: 'blur' }]
}

function buildDefaultForm() {
  return {
    id: undefined,
    toolId: undefined,
    title: '',
    description: '',
    url: '',
    icon: '',
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
    const res = await pageResearchTool(queryParams)
    toolList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
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
  dialogTitle.value = '新增工具'
  resetFormData()
  dialogVisible.value = true
}

async function handleUpdate(row) {
  dialogTitle.value = '编辑工具'
  const res = await getResearchTool(row.id || row.toolId)
  resetFormData(res?.data || row)
  dialogVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除工具“${row.title}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await deleteResearchTool(row.id || row.toolId)
  ElMessage.success('删除成功')
  if (toolList.value.length === 1 && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }
  getList()
}

async function submitForm() {
  const valid = await formRef.value?.validate?.().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (form.id || form.toolId) {
      await updateResearchTool(form)
      ElMessage.success('修改成功')
    } else {
      await addResearchTool(form)
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
