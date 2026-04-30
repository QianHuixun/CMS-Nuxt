<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item :label="`${resourceName}名称`">
          <el-input v-model="queryParams.name" :placeholder="`请输入${resourceName}名称`" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="`${resourceName}类型`">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable style="width: 150px">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增{{ resourceName }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="importList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column :label="`${resourceName}名称`" prop="name" min-width="150" show-overflow-tooltip />
        <el-table-column :label="`${resourceName}类型`" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="typeColorMap[row.type]">{{ typeLabelMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="难度等级" prop="difficulty" width="100" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.difficulty" disabled text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column label="预计时长" prop="duration" width="100" align="center">
          <template #default="{ row }">
            {{ row.duration }}分钟
          </template>
        </el-table-column>
        <el-table-column label="适用对象" prop="target" width="120" align="center" />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="VideoPlay" @click="handlePreview(row)">预览</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="`${resourceName}名称`" prop="name">
          <el-input v-model="form.name" :placeholder="`请输入${resourceName}名称`" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="`${resourceName}类型`" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度等级" prop="difficulty">
              <el-rate v-model="form.difficulty" show-text />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预计时长" prop="duration">
              <el-input-number v-model="form.duration" :min="10" :max="300" /> 分钟
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用对象" prop="target">
              <el-input v-model="form.target" placeholder="请输入适用对象" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="`${resourceName}描述`">
          <el-input v-model="form.description" type="textarea" :rows="3" :placeholder="`请输入${resourceName}描述`" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" :title="`${resourceName}预览`" width="800px" append-to-body>
      <div class="preview-container">
        <el-empty :description="`${currentEntry?.name || resourceName}预览功能开发中...`">
          <template #image>
            <el-icon :size="60"><VideoPlay /></el-icon>
          </template>
        </el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import { VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  resourceName: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const importList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])
const currentEntry = ref(null)

const typeOptions = [
  { label: `${props.resourceName}基础信息`, value: 'basic' },
  { label: `${props.resourceName}成果信息`, value: 'achievement' },
  { label: `${props.resourceName}关联信息`, value: 'relation' },
  { label: `${props.resourceName}附件信息`, value: 'attachment' }
]

const typeColorMap = { basic: 'danger', achievement: 'warning', relation: 'success', attachment: 'primary' }
const typeLabelMap = Object.fromEntries(typeOptions.map(item => [item.value, item.label]))

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const previewVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const form = ref(createEmptyForm())

const rules = {
  name: [{ required: true, message: `${props.resourceName}名称不能为空`, trigger: 'blur' }],
  type: [{ required: true, message: `请选择${props.resourceName}类型`, trigger: 'change' }],
  duration: [{ required: true, message: '请输入预计时长', trigger: 'blur' }]
}

const mockData = [
  createMockItem(1, `${props.resourceName}基础信息导入`, 'basic', 2, 30, '科研人员', '2024-01-15 10:30:00'),
  createMockItem(2, `${props.resourceName}成果信息导入`, 'achievement', 4, 45, '成果管理员', '2024-01-14 09:20:00'),
  createMockItem(3, `${props.resourceName}关联信息导入`, 'relation', 3, 60, '审核人员', '2024-01-13 14:00:00'),
  createMockItem(4, `${props.resourceName}附件信息导入`, 'attachment', 5, 40, '数据维护员', '2024-01-12 16:45:00', '0')
]

function createEmptyForm() {
  return { id: undefined, name: '', type: 'basic', difficulty: 3, duration: 30, target: '', description: '', status: '1' }
}

function createMockItem(id, name, type, difficulty, duration, target, createTime, status = '1') {
  return {
    id,
    name,
    type,
    difficulty,
    duration,
    target,
    description: `${name}的批量导入配置。`,
    status,
    createTime
  }
}

function getList() {
  loading.value = true
  setTimeout(() => {
    importList.value = mockData.map(item => ({ ...item }))
    total.value = importList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.type = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = createEmptyForm()
  dialogTitle.value = `新增${props.resourceName}`
  dialogVisible.value = true
}

function handlePreview(row) {
  currentEntry.value = { ...row }
  previewVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = `编辑${props.resourceName}`
  dialogVisible.value = true
}

function handleDelete(row = {}) {
  ElMessageBox.confirm(`是否确认删除${props.resourceName}"${row.name || ids.value}"？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getList()
  })
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      ElMessage.success(form.value.id ? '修改成功' : '新增成功')
      dialogVisible.value = false
      getList()
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

.preview-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
}
</style>
