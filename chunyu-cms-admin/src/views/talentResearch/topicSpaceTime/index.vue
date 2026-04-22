<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="课题名称">
          <el-input v-model="queryParams.name" placeholder="请输入课题名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="课题级别">
          <el-select v-model="queryParams.level" placeholder="请选择课题级别" clearable style="width: 150px">
            <el-option label="国家级" value="national" />
            <el-option label="省部级" value="provincial" />
            <el-option label="厅局级" value="municipal" />
            <el-option label="校级" value="school" />
          </el-select>
        </el-form-item>
        <el-form-item label="研究状态">
          <el-select v-model="queryParams.researchStatus" placeholder="请选择研究状态" clearable style="width: 150px">
            <el-option label="筹备中" value="preparing" />
            <el-option label="进行中" value="ongoing" />
            <el-option label="已完成" value="completed" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增课题</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="topicList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="课题名称" prop="name" min-width="200" show-overflow-tooltip />
        <el-table-column label="课题编号" prop="code" width="150" />
        <el-table-column label="课题级别" prop="level" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="levelTypeMap[row.level]">{{ levelLabelMap[row.level] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="研究状态" prop="researchStatus" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.researchStatus]">{{ statusLabelMap[row.researchStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startDate" width="120" align="center" />
        <el-table-column label="结束时间" prop="endDate" width="120" align="center" />
        <el-table-column label="负责人" prop="leader" width="100" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
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
        <el-form-item label="课题名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入课题名称" />
        </el-form-item>
        <el-form-item label="课题编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入课题编号" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课题级别" prop="level">
              <el-select v-model="form.level" placeholder="请选择课题级别" style="width: 100%">
                <el-option label="国家级" value="national" />
                <el-option label="省部级" value="provincial" />
                <el-option label="厅局级" value="municipal" />
                <el-option label="校级" value="school" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研究状态" prop="researchStatus">
              <el-select v-model="form.researchStatus" placeholder="请选择研究状态" style="width: 100%">
                <el-option label="筹备中" value="preparing" />
                <el-option label="进行中" value="ongoing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" placeholder="选择结束时间" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="课题负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入课题负责人" />
        </el-form-item>
        <el-form-item label="课题简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入课题简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="课题详情" width="700px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="课题名称" :span="2">{{ currentTopic.name }}</el-descriptions-item>
        <el-descriptions-item label="课题编号">{{ currentTopic.code }}</el-descriptions-item>
        <el-descriptions-item label="课题级别">{{ levelLabelMap[currentTopic.level] }}</el-descriptions-item>
        <el-descriptions-item label="研究状态">{{ statusLabelMap[currentTopic.researchStatus] }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentTopic.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentTopic.endDate }}</el-descriptions-item>
        <el-descriptions-item label="课题负责人">{{ currentTopic.leader }}</el-descriptions-item>
        <el-descriptions-item label="课题简介" :span="2">{{ currentTopic.description || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="TalentResearchTopicSpaceTimeIndex">
import Pagination from '@/components/Pagination/index.vue'

const loading = ref(true)
const topicList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const levelTypeMap = { national: 'danger', provincial: 'warning', municipal: 'success', school: 'info' }
const levelLabelMap = { national: '国家级', provincial: '省部级', municipal: '厅局级', school: '校级' }
const statusTypeMap = { preparing: 'info', ongoing: 'primary', completed: 'success' }
const statusLabelMap = { preparing: '筹备中', ongoing: '进行中', completed: '已完成' }

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  level: '',
  researchStatus: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentTopic = ref({})

const form = ref({
  id: undefined,
  name: '',
  code: '',
  level: '',
  researchStatus: '',
  startDate: '',
  endDate: '',
  leader: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '课题名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '课题编号不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '请选择课题级别', trigger: 'change' }],
  researchStatus: [{ required: true, message: '请选择研究状态', trigger: 'change' }]
}

// 模拟数据
const mockData = [
  { id: 1, name: '中医药现代化研究', code: '2024ZY001', level: 'national', researchStatus: 'ongoing', startDate: '2024-01-01', endDate: '2026-12-31', leader: '张教授', description: '研究中医药现代化发展的路径与策略。', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '中药有效成分提取工艺优化', code: '2024ZY002', level: 'provincial', researchStatus: 'ongoing', startDate: '2024-03-01', endDate: '2025-12-31', leader: '李研究员', description: '优化中药有效成分的提取工艺。', createTime: '2024-01-14 09:20:00' },
  { id: 3, name: '针灸治疗慢性病临床研究', code: '2023ZY003', level: 'municipal', researchStatus: 'completed', startDate: '2023-06-01', endDate: '2024-05-31', leader: '王主任', description: '针灸治疗慢性病的临床疗效研究。', createTime: '2024-01-13 14:00:00' },
  { id: 4, name: '中医药文化传承创新', code: '2024ZY004', level: 'school', researchStatus: 'preparing', startDate: '2024-09-01', endDate: '2026-08-31', leader: '刘教授', description: '中医药文化的传承与创新发展研究。', createTime: '2024-01-12 16:45:00' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    topicList.value = mockData.map(item => ({ ...item }))
    total.value = topicList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.level = ''
  queryParams.researchStatus = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = { id: undefined, name: '', code: '', level: '', researchStatus: '', startDate: '', endDate: '', leader: '', description: '' }
  dialogTitle.value = '新增课题'
  dialogVisible.value = true
}

function handleDetail(row) {
  currentTopic.value = { ...row }
  detailVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑课题'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除课题"${row.name || ids.value}"？`, '警告', {
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
</style>
