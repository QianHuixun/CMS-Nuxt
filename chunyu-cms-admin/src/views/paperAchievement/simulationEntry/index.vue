<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="仿真名称">
          <el-input v-model="queryParams.name" placeholder="请输入仿真名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="仿真类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable style="width: 150px">
            <el-option label="脉象仿真" value="pulse" />
            <el-option label="针灸仿真" value="acupuncture" />
            <el-option label="辨证仿真" value="diagnosis" />
            <el-option label="用药仿真" value="medication" />
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

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增仿真</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="simulationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="仿真名称" prop="name" min-width="150" show-overflow-tooltip />
        <el-table-column label="仿真类型" prop="type" width="120" align="center">
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
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="仿真名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入仿真名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="仿真类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="脉象仿真" value="pulse" />
                <el-option label="针灸仿真" value="acupuncture" />
                <el-option label="辨证仿真" value="diagnosis" />
                <el-option label="用药仿真" value="medication" />
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
        <el-form-item label="仿真描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入仿真描述" />
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

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="仿真预览" width="800px" append-to-body>
      <div class="preview-container">
        <el-empty description="仿真预览功能开发中...">
          <template #image>
            <el-icon :size="60"><VideoPlay /></el-icon>
          </template>
        </el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="PaperAchievementSimulationEntryIndex">
import Pagination from '@/components/Pagination/index.vue'
import { VideoPlay } from '@element-plus/icons-vue'

const loading = ref(true)
const simulationList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const typeColorMap = { pulse: 'danger', acupuncture: 'warning', diagnosis: 'success', medication: 'primary' }
const typeLabelMap = { pulse: '脉象仿真', acupuncture: '针灸仿真', diagnosis: '辨证仿真', medication: '用药仿真' }

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

const form = ref({
  id: undefined,
  name: '',
  type: 'pulse',
  difficulty: 3,
  duration: 30,
  target: '',
  description: '',
  status: '1'
})

const rules = {
  name: [{ required: true, message: '仿真名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择仿真类型', trigger: 'change' }],
  duration: [{ required: true, message: '请输入预计时长', trigger: 'blur' }]
}

// 模拟数据
const mockData = [
  { id: 1, name: '浮脉仿真训练', type: 'pulse', difficulty: 2, duration: 30, target: '中医学生', description: '模拟浮脉的触感和辨识方法。', status: '1', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '针灸穴位定位', type: 'acupuncture', difficulty: 4, duration: 45, target: '针灸学习者', description: '虚拟环境下练习针灸穴位定位。', status: '1', createTime: '2024-01-14 09:20:00' },
  { id: 3, name: '八纲辨证练习', type: 'diagnosis', difficulty: 3, duration: 60, target: '临床医师', description: '八纲辨证的虚拟病例练习。', status: '1', createTime: '2024-01-13 14:00:00' },
  { id: 4, name: '中药配伍禁忌', type: 'medication', difficulty: 5, duration: 40, target: '中药师', description: '中药配伍禁忌的模拟训练。', status: '0', createTime: '2024-01-12 16:45:00' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    simulationList.value = mockData.map(item => ({ ...item }))
    total.value = simulationList.value.length
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
  form.value = { id: undefined, name: '', type: 'pulse', difficulty: 3, duration: 30, target: '', description: '', status: '1' }
  dialogTitle.value = '新增仿真'
  dialogVisible.value = true
}

function handlePreview(row) {
  currentSimulation.value = { ...row }
  previewVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑仿真'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除仿真"${row.name || ids.value}"？`, '警告', {
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
