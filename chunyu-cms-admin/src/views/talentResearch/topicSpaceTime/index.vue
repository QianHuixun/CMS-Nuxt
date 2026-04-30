<template>
  <div class="app-container">
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-panel">
          <div class="stat-label">课题总数</div>
          <div class="stat-value">{{ topicStats.total }}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-panel">
          <div class="stat-label">进行中</div>
          <div class="stat-value stat-primary">{{ topicStats.ongoing }}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-panel">
          <div class="stat-label">已完成</div>
          <div class="stat-value stat-success">{{ topicStats.completed }}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-panel">
          <div class="stat-label">即将到期</div>
          <div class="stat-value stat-warning">{{ topicStats.dueSoon }}</div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="课题名称">
          <el-input v-model="queryParams.title" placeholder="请输入课题名称" clearable style="width: 180px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="课题编号">
          <el-input v-model="queryParams.topicNo" placeholder="请输入课题编号" clearable style="width: 160px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="课题级别">
          <el-select v-model="queryParams.level" placeholder="请选择课题级别" clearable style="width: 140px">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="研究状态">
          <el-select v-model="queryParams.researchStatus" placeholder="请选择研究状态" clearable style="width: 140px">
            <el-option v-for="item in researchStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="queryParams.leader" placeholder="请输入负责人" clearable style="width: 140px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="年份">
          <el-date-picker v-model="queryParams.year" type="year" value-format="YYYY" placeholder="选择年份" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="启用" value="0" />
            <el-option label="停用" value="1" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增课题</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Upload" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">批量删除</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="topicList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="课题名称" prop="title" min-width="220" show-overflow-tooltip />
        <el-table-column label="课题编号" prop="topicNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.topicNo || '-' }}</template>
        </el-table-column>
        <el-table-column label="课题级别" prop="level" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="levelTypeMap[row.level] || 'info'">{{ levelLabelMap[row.level] || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="研究状态" prop="researchStatus" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="researchStatusTypeMap[row.researchStatus] || 'info'">{{ researchStatusLabelMap[row.researchStatus] || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="progress" width="150" align="center">
          <template #default="{ row }">
            <el-progress :percentage="Number(row.progress || 0)" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="起止时间" min-width="210" align="center">
          <template #default="{ row }">
            {{ formatDate(row.startDate) }} 至 {{ formatDate(row.endDate) }}
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="leader" width="110" align="center">
          <template #default="{ row }">{{ row.leader || '-' }}</template>
        </el-table-column>
        <el-table-column label="项目来源" prop="source" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.source || '-' }}</template>
        </el-table-column>
        <el-table-column label="关联专家" prop="talentCount" width="100" align="center">
          <template #default="{ row }">{{ row.talentCount || 0 }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'info'">
              {{ row.status === '0' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.updateTime || row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
            <el-button link :type="row.status === '0' ? 'warning' : 'success'" @click="handleStatusChange(row)">
              {{ row.status === '0' ? '停用' : '启用' }}
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课题名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入课题名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课题编号" prop="topicNo">
              <el-input v-model="form.topicNo" placeholder="请输入课题编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课题级别" prop="level">
              <el-select v-model="form.level" placeholder="请选择课题级别" style="width: 100%">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研究状态" prop="researchStatus">
              <el-select v-model="form.researchStatus" placeholder="请选择研究状态" style="width: 100%">
                <el-option v-for="item in researchStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目来源">
              <el-input v-model="form.source" placeholder="请输入项目来源" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" placeholder="选择开始日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" placeholder="选择结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="进度">
              <el-input-number v-model="form.progress" :min="0" :max="100" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="课题摘要">
          <el-input v-model="form.summary" type="textarea" :rows="4" placeholder="请输入课题摘要" />
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

    <el-dialog v-model="detailVisible" title="课题详情" width="760px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="课题名称" :span="2">{{ currentTopic.title }}</el-descriptions-item>
        <el-descriptions-item label="课题编号">{{ currentTopic.topicNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="课题级别">{{ levelLabelMap[currentTopic.level] || '-' }}</el-descriptions-item>
        <el-descriptions-item label="研究状态">{{ researchStatusLabelMap[currentTopic.researchStatus] || '-' }}</el-descriptions-item>
        <el-descriptions-item label="进度">{{ currentTopic.progress || 0 }}%</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ formatDate(currentTopic.startDate) }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ formatDate(currentTopic.endDate) }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentTopic.leader || '-' }}</el-descriptions-item>
        <el-descriptions-item label="项目来源">{{ currentTopic.source || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联专家">{{ currentTopic.talentCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ currentTopic.status === '0' ? '启用' : '停用' }}</el-descriptions-item>
        <el-descriptions-item label="课题摘要" :span="2">{{ currentTopic.summary || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentTopic.remark || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="TalentResearchTopicSpaceTimeIndex">
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import {
  addTopic,
  changeTopicStatus,
  delTopic,
  getTopic,
  getTopicStats,
  listTopic,
  updateTopic
} from '@/api/talentResearch/topicSpaceTime'

const levelOptions = [
  { label: '国家级', value: 'national', type: 'danger' },
  { label: '省部级', value: 'provincial', type: 'warning' },
  { label: '厅局级', value: 'municipal', type: 'success' },
  { label: '校级', value: 'school', type: 'info' }
]
const researchStatusOptions = [
  { label: '筹备中', value: 'preparing', type: 'info' },
  { label: '进行中', value: 'ongoing', type: 'primary' },
  { label: '已完成', value: 'completed', type: 'success' }
]
const levelLabelMap = Object.fromEntries(levelOptions.map(item => [item.value, item.label]))
const levelTypeMap = Object.fromEntries(levelOptions.map(item => [item.value, item.type]))
const researchStatusLabelMap = Object.fromEntries(researchStatusOptions.map(item => [item.value, item.label]))
const researchStatusTypeMap = Object.fromEntries(researchStatusOptions.map(item => [item.value, item.type]))

const loading = ref(false)
const submitLoading = ref(false)
const topicList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])
const topicStats = reactive({
  total: 0,
  ongoing: 0,
  completed: 0,
  dueSoon: 0
})

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  topicNo: '',
  level: '',
  researchStatus: '',
  leader: '',
  year: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentTopic = ref({})

const defaultForm = () => ({
  id: undefined,
  title: '',
  topicNo: '',
  level: '',
  source: '',
  leader: '',
  researchStatus: 'preparing',
  progress: 0,
  startDate: '',
  endDate: '',
  summary: '',
  sort: 0,
  status: '0',
  remark: ''
})

const form = ref(defaultForm())

const rules = {
  title: [{ required: true, message: '课题名称不能为空', trigger: 'blur' }],
  topicNo: [{ required: true, message: '课题编号不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '请选择课题级别', trigger: 'change' }],
  researchStatus: [{ required: true, message: '请选择研究状态', trigger: 'change' }],
  leader: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' },
    { validator: validateEndDate, trigger: 'change' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

function validateEndDate(rule, value, callback) {
  if (form.value.startDate && value && value < form.value.startDate) {
    callback(new Error('结束日期不能早于开始日期'))
    return
  }
  callback()
}

function formatDate(value) {
  if (!value) return '-'
  return String(value).slice(0, 10)
}

function formatDateTime(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value.replace('T', ' ').replace(/\.\d{3}Z$/, '')
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function getList() {
  loading.value = true
  try {
    const res = await listTopic(queryParams)
    topicList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
    total.value = Number(res?.data?.total || 0)
  } finally {
    loading.value = false
  }
}

async function refreshStats() {
  const res = await getTopicStats()
  Object.assign(topicStats, {
    total: Number(res?.data?.total || 0),
    ongoing: Number(res?.data?.ongoing || 0),
    completed: Number(res?.data?.completed || 0),
    dueSoon: Number(res?.data?.dueSoon || 0)
  })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.title = ''
  queryParams.topicNo = ''
  queryParams.level = ''
  queryParams.researchStatus = ''
  queryParams.leader = ''
  queryParams.year = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = defaultForm()
  dialogTitle.value = '新增课题'
  dialogVisible.value = true
}

async function handleDetail(row) {
  const res = await getTopic(row.id)
  currentTopic.value = res.data || {}
  detailVisible.value = true
}

async function handleUpdate(row) {
  const res = await getTopic(row.id)
  form.value = {
    ...defaultForm(),
    ...res.data,
    id: res.data?.id || res.data?.topicId,
    startDate: formatDate(res.data?.startDate) === '-' ? '' : formatDate(res.data?.startDate),
    endDate: formatDate(res.data?.endDate) === '-' ? '' : formatDate(res.data?.endDate)
  }
  dialogTitle.value = '编辑课题'
  dialogVisible.value = true
}

async function handleDelete(row) {
  const deleteIds = row?.id ? [row.id] : ids.value
  if (!deleteIds.length) return

  try {
    await ElMessageBox.confirm(`是否确认删除课题"${row?.title || deleteIds.join(',')}"？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await delTopic(deleteIds.join(','))
  ElMessage.success('删除成功')
  if (topicList.value.length === deleteIds.length && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }
  await getList()
  refreshStats()
}

async function handleStatusChange(row) {
  const nextStatus = row.status === '0' ? '1' : '0'
  await changeTopicStatus({ ids: [row.id], status: nextStatus })
  ElMessage.success(nextStatus === '0' ? '已启用' : '已停用')
  await getList()
}

function handleImport() {
  ElMessage.info('导入功能将在下一阶段接入')
}

function handleExport() {
  ElMessage.info('导出功能将在下一阶段接入')
}

async function submitForm() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (form.value.id) {
      await updateTopic(form.value)
      ElMessage.success('修改成功')
    } else {
      await addTopic(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    await getList()
    refreshStats()
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  getList()
  refreshStats()
})
</script>

<style lang="scss" scoped>
.stats-row {
  margin-bottom: 16px;
}

.stat-panel {
  min-height: 78px;
  padding: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.stat-label {
  color: #909399;
  font-size: 13px;
}

.stat-value {
  margin-top: 8px;
  color: #303133;
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
}

.stat-primary {
  color: #409eff;
}

.stat-success {
  color: #67c23a;
}

.stat-warning {
  color: #e6a23c;
}

.search-card {
  margin-bottom: 16px;
}

.mb8 {
  margin-bottom: 16px;
}
</style>
