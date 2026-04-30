<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="专家姓名">
          <el-input v-model="queryParams.name" placeholder="请输入专家姓名" clearable style="width: 160px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="研究方向">
          <el-select v-model="queryParams.researchDirection" placeholder="请选择研究方向" clearable style="width: 180px">
            <el-option v-for="item in researchDirectionOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="queryParams.title" placeholder="请选择职称" clearable style="width: 150px">
            <el-option v-for="item in titleOptions" :key="item" :label="item" :value="item" />
          </el-select>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增专家</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Upload" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="expertList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="专家姓名" min-width="150">
          <template #default="{ row }">
            <div class="expert-name">
              <el-avatar :size="36" :src="row.avatar">
                {{ row.name?.charAt(0) }}
              </el-avatar>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="职称" prop="title" width="120" align="center">
          <template #default="{ row }">{{ row.title || '-' }}</template>
        </el-table-column>
        <el-table-column label="研究方向" prop="researchDirection" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ row.researchDirection || '-' }}</template>
        </el-table-column>
        <el-table-column label="所在机构" prop="organization" min-width="170" show-overflow-tooltip>
          <template #default="{ row }">{{ row.organization || '-' }}</template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ row.email || row.phone || '-' }}</template>
        </el-table-column>
        <el-table-column label="关联成果" width="170" align="center">
          <template #default="{ row }">
            <span>论文 {{ row.paperCount || 0 }} / 课题 {{ row.topicCount || 0 }} / 专利 {{ row.patentCount || 0 }}</span>
          </template>
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
        <el-table-column label="操作" width="260" align="center" fixed="right">
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="860px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专家姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入专家姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名">
              <el-input v-model="form.nameEn" placeholder="请输入英文名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
                <el-radio label="3">未知</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职称" prop="title">
              <el-select v-model="form.title" placeholder="请选择职称" allow-create filterable style="width: 100%">
                <el-option v-for="item in titleOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="研究方向" prop="researchDirection">
              <el-select v-model="form.researchDirection" placeholder="请选择研究方向" allow-create filterable style="width: 100%">
                <el-option v-for="item in researchDirectionOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务">
              <el-input v-model="form.position" placeholder="请输入职务" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所在机构" prop="organization">
          <el-input v-model="form.organization" placeholder="请输入所在机构" />
        </el-form-item>
        <el-form-item label="院系/部门">
          <el-input v-model="form.department" placeholder="请输入院系或部门" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
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
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="专家照片">
          <ImageUpload v-model="form.avatar" :limit="1" :file-size="10" />
        </el-form-item>
        <el-form-item label="卡片背景">
          <ImageUpload v-model="form.cardBackground" :limit="1" :file-size="10" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="form.profile" type="textarea" :rows="4" placeholder="请输入个人简介" />
        </el-form-item>
        <el-divider content-position="left">成果关联</el-divider>
        <el-alert
          class="relation-tip"
          title="论文、课题、专利主数据完成后，可在这里通过可搜索下拉选择已有成果。当前接口已预留，不在专家页新增成果。"
          type="info"
          :closable="false"
        />
        <el-form-item label="关联论文">
          <el-select
            v-model="form.paperIds"
            multiple
            filterable
            remote
            reserve-keyword
            :remote-method="searchPaperOptions"
            :loading="optionLoading.paper"
            placeholder="搜索并选择已有论文"
            style="width: 100%"
          >
            <el-option v-for="item in paperOptions" :key="item.id" :label="item.title || item.name || `论文 ${item.id}`" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联课题">
          <el-select
            v-model="form.topicIds"
            multiple
            filterable
            remote
            reserve-keyword
            :remote-method="searchTopicOptions"
            :loading="optionLoading.topic"
            placeholder="搜索并选择已有课题"
            style="width: 100%"
          >
            <el-option v-for="item in topicOptions" :key="item.id" :label="item.title || item.name || `课题 ${item.id}`" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联专利">
          <el-select
            v-model="form.patentIds"
            multiple
            filterable
            remote
            reserve-keyword
            :remote-method="searchPatentOptions"
            :loading="optionLoading.patent"
            placeholder="搜索并选择已有专利"
            style="width: 100%"
          >
            <el-option v-for="item in patentOptions" :key="item.id" :label="item.title || item.name || `专利 ${item.id}`" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="专家详情" width="820px" append-to-body>
      <div class="detail-header">
        <el-avatar :size="64" :src="currentExpert.avatar">{{ currentExpert.name?.charAt(0) }}</el-avatar>
        <div>
          <div class="detail-name">{{ currentExpert.name }}</div>
          <div class="detail-meta">{{ currentExpert.title || '-' }} · {{ currentExpert.organization || '-' }}</div>
        </div>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="专家姓名">{{ currentExpert.name }}</el-descriptions-item>
        <el-descriptions-item label="英文名">{{ currentExpert.nameEn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ genderLabelMap[currentExpert.gender] || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="职称">{{ currentExpert.title || '-' }}</el-descriptions-item>
        <el-descriptions-item label="研究方向">{{ currentExpert.researchDirection || '-' }}</el-descriptions-item>
        <el-descriptions-item label="职务">{{ currentExpert.position || '-' }}</el-descriptions-item>
        <el-descriptions-item label="所在机构" :span="2">{{ currentExpert.organization || '-' }}</el-descriptions-item>
        <el-descriptions-item label="院系/部门" :span="2">{{ currentExpert.department || '-' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentExpert.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentExpert.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="个人简介" :span="2">{{ currentExpert.profile || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="关联成果" :span="2">
          论文 {{ currentExpert.paperIds?.length || 0 }} / 课题 {{ currentExpert.topicIds?.length || 0 }} / 专利 {{ currentExpert.patentIds?.length || 0 }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="TalentResearchExpertLibraryIndex">
import { ElMessage, ElMessageBox } from 'element-plus'
import ImageUpload from '@/components/ImageUpload/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import {
  addExpert,
  changeExpertStatus,
  delExpert,
  getExpert,
  listExpert,
  listPaperOptions,
  listPatentOptions,
  listTopicOptions,
  updateExpert
} from '@/api/talentResearch/expertLibrary'

const titleOptions = ['教授', '副教授', '讲师', '主任医师', '副主任医师']
const researchDirectionOptions = ['中医基础理论', '中药学', '针灸推拿', '中医临床', '中西医结合', '中医诊断学', '中药药理学']
const genderLabelMap = { 1: '男', 2: '女', 3: '未知' }

const loading = ref(false)
const submitLoading = ref(false)
const expertList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  researchDirection: '',
  title: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentExpert = ref({})

const paperOptions = ref([])
const topicOptions = ref([])
const patentOptions = ref([])
const optionLoading = reactive({
  paper: false,
  topic: false,
  patent: false
})

const defaultForm = () => ({
  id: undefined,
  name: '',
  nameEn: '',
  gender: '3',
  avatar: '',
  cardBackground: '',
  title: '',
  position: '',
  researchDirection: '',
  organization: '',
  department: '',
  phone: '',
  email: '',
  profile: '',
  sort: 0,
  status: '0',
  paperIds: [],
  topicIds: [],
  patentIds: []
})

const form = ref(defaultForm())

const rules = {
  name: [{ required: true, message: '专家姓名不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '请选择职称', trigger: 'change' }],
  researchDirection: [{ required: true, message: '请选择研究方向', trigger: 'change' }],
  organization: [{ required: true, message: '所在机构不能为空', trigger: 'blur' }]
}

function formatDateTime(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value.replace('T', ' ').replace(/\.\d{3}Z$/, '')
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

function normalizeRows(rows) {
  return rows.map(row => ({
    ...row,
    researchDirection: row.researchDirection || row.researchArea || '',
    organization: row.organization || row.institution || '',
    profile: row.profile || row.bio || ''
  }))
}

async function getList() {
  loading.value = true
  try {
    const res = await listExpert(queryParams)
    expertList.value = normalizeRows(Array.isArray(res?.data?.rows) ? res.data.rows : [])
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
  queryParams.name = ''
  queryParams.researchDirection = ''
  queryParams.title = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = defaultForm()
  dialogTitle.value = '新增专家'
  dialogVisible.value = true
}

async function handleDetail(row) {
  const res = await getExpert(row.id)
  currentExpert.value = {
    ...res.data,
    researchDirection: res.data?.researchDirection || res.data?.researchArea || '',
    organization: res.data?.organization || res.data?.institution || '',
    profile: res.data?.profile || res.data?.bio || ''
  }
  detailVisible.value = true
}

async function handleUpdate(row) {
  const res = await getExpert(row.id)
  form.value = {
    ...defaultForm(),
    ...res.data,
    researchDirection: res.data?.researchDirection || res.data?.researchArea || '',
    organization: res.data?.organization || res.data?.institution || '',
    profile: res.data?.profile || res.data?.bio || '',
    paperIds: res.data?.paperIds || [],
    topicIds: res.data?.topicIds || [],
    patentIds: res.data?.patentIds || []
  }
  paperOptions.value = form.value.paperIds.map(id => ({ id }))
  topicOptions.value = form.value.topicIds.map(id => ({ id }))
  patentOptions.value = form.value.patentIds.map(id => ({ id }))
  dialogTitle.value = '编辑专家'
  dialogVisible.value = true
}

async function handleDelete(row) {
  const deleteIds = row?.id ? [row.id] : ids.value
  if (!deleteIds.length) return

  try {
    await ElMessageBox.confirm(`是否确认删除专家"${row?.name || deleteIds.join(',')}"？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await delExpert(deleteIds.join(','))
  ElMessage.success('删除成功')
  if (expertList.value.length === deleteIds.length && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }
  getList()
}

async function handleStatusChange(row) {
  const nextStatus = row.status === '0' ? '1' : '0'
  await changeExpertStatus({ ids: [row.id], status: nextStatus })
  ElMessage.success(nextStatus === '0' ? '已启用' : '已停用')
  getList()
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
    const payload = {
      ...form.value,
      cardBackground: form.value.cardBackground || form.value.avatar
    }
    if (payload.id) {
      await updateExpert(payload)
      ElMessage.success('修改成功')
    } else {
      await addExpert(payload)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList()
  } finally {
    submitLoading.value = false
  }
}

async function loadOptions(loader, target, key, keyword) {
  optionLoading[key] = true
  try {
    const res = await loader({ keyword })
    target.value = Array.isArray(res?.data) ? res.data : []
  } finally {
    optionLoading[key] = false
  }
}

function searchPaperOptions(keyword) {
  loadOptions(listPaperOptions, paperOptions, 'paper', keyword)
}

function searchTopicOptions(keyword) {
  loadOptions(listTopicOptions, topicOptions, 'topic', keyword)
}

function searchPatentOptions(keyword) {
  loadOptions(listPatentOptions, patentOptions, 'patent', keyword)
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

.expert-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.relation-tip {
  margin-bottom: 18px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.detail-meta {
  margin-top: 6px;
  color: #909399;
}
</style>
