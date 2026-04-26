<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="单位/机构">
          <el-input v-model="queryParams.organization" placeholder="请输入单位/机构" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item label="研究方向">
          <el-input v-model="queryParams.researchDirection" placeholder="请输入研究方向" clearable style="width: 220px" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增人才</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div v-loading="loading" class="talent-grid">
        <div
          v-for="item in talentList"
          :key="item.talentId"
          class="talent-card"
          :style="buildCardStyle(item.photoUrl)"
        >
          <div class="talent-overlay" />
          <div class="talent-content">
            <div class="talent-card-header">
              <el-tag :type="item.status === '1' ? 'success' : 'info'" effect="dark">
                {{ item.status === '1' ? '发布' : '草稿' }}
              </el-tag>
            </div>
            <div class="talent-main">
              <div class="talent-name">{{ item.name }}</div>
              <div class="talent-subtitle">{{ item.title || '未填写职称' }}</div>
              <div class="talent-organization">{{ item.organization || '未填写单位/机构' }}</div>
              <div class="talent-direction">{{ item.researchDirection || '未填写研究方向' }}</div>
              <div class="talent-resume">{{ buildResumePreview(item.resume) }}</div>
            </div>
            <div class="talent-footer">
              <div class="talent-achievements">
                <span>论文 {{ item.paperCount || 0 }}</span>
                <span>专利 {{ item.patentCount || 0 }}</span>
                <span>课题 {{ item.topicCount || 0 }}</span>
              </div>
              <div class="talent-actions">
                <el-button link type="primary" icon="View" @click="handleDetail(item)">详情</el-button>
                <el-button link type="primary" icon="Edit" @click="handleUpdate(item)">编辑</el-button>
                <el-button link type="danger" icon="Delete" @click="handleDelete(item)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="!loading && !talentList.length" description="暂无人才数据" />
      </div>

      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="960px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职称/头衔">
              <el-input v-model="form.title" placeholder="请输入职称/头衔" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位/机构">
              <el-input v-model="form.organization" placeholder="请输入单位/机构" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研究方向">
              <el-input v-model="form.researchDirection" placeholder="请输入研究方向" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个人简历">
          <el-input v-model="form.resume" type="textarea" :rows="4" placeholder="请输入个人简历" />
        </el-form-item>
        <el-form-item label="高清照片">
          <ImageUpload
            v-model="form.photoUrl"
            :limit="1"
            :file-size="8"
            :file-type="['png', 'jpg', 'jpeg', 'webp']"
          />
          <div class="upload-tip">本期支持上传与回显，照片裁剪后续增强。</div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="关联论文">
              <el-select
                v-model="form.paperIds"
                multiple
                filterable
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择已录入论文"
                style="width: 100%"
              >
                <el-option v-for="item in paperOptions" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联专利">
              <el-select
                v-model="form.patentIds"
                multiple
                filterable
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择已录入专利"
                style="width: 100%"
              >
                <el-option v-for="item in patentOptions" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联课题">
              <el-select
                v-model="form.topicIds"
                multiple
                filterable
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择已录入课题"
                style="width: 100%"
              >
                <el-option v-for="item in topicOptions" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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

    <el-dialog v-model="detailVisible" title="人才详情" width="920px" append-to-body>
      <div v-if="currentTalent" class="detail-layout">
        <div class="detail-photo" :style="buildCardStyle(currentTalent.photoUrl)">
          <div class="detail-photo-overlay" />
          <div class="detail-photo-name">
            <strong>{{ currentTalent.name }}</strong>
            <span>{{ currentTalent.title || '未填写职称' }}</span>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-item">
            <span class="detail-label">单位/机构</span>
            <span>{{ currentTalent.organization || '未填写' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">研究方向</span>
            <span>{{ currentTalent.researchDirection || '未填写' }}</span>
          </div>
          <div class="detail-item detail-resume-block">
            <span class="detail-label">个人简历</span>
            <span>{{ currentTalent.resume || '未填写' }}</span>
          </div>
        </div>
        <div class="detail-relation-grid">
          <div class="detail-relation-card">
            <div class="relation-title">关联论文</div>
            <div class="relation-list">
              <el-tag v-for="item in currentTalent.papers" :key="`paper-${item.id}`" type="info" effect="plain">
                {{ item.title }}
              </el-tag>
              <span v-if="!currentTalent.papers?.length" class="relation-empty">暂无关联论文</span>
            </div>
          </div>
          <div class="detail-relation-card">
            <div class="relation-title">关联专利</div>
            <div class="relation-list">
              <el-tag v-for="item in currentTalent.patents" :key="`patent-${item.id}`" type="success" effect="plain">
                {{ item.title }}
              </el-tag>
              <span v-if="!currentTalent.patents?.length" class="relation-empty">暂无关联专利</span>
            </div>
          </div>
          <div class="detail-relation-card">
            <div class="relation-title">关联课题</div>
            <div class="relation-list">
              <el-tag v-for="item in currentTalent.topics" :key="`topic-${item.id}`" type="warning" effect="plain">
                {{ item.title }}
              </el-tag>
              <span v-if="!currentTalent.topics?.length" class="relation-empty">暂无关联课题</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="TalentResearchExpertLibraryIndex">
import Pagination from '@/components/Pagination/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import { pageTalent, getTalentDetail, addTalent, updateTalent, deleteTalent } from '@/api/talentResearch/talent'
import { listPaper } from '@/api/paperAchievement/paper'
import { listPatent } from '@/api/paperAchievement/patent'
import { listTopic } from '@/api/paperAchievement/topic'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const talentList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentTalent = ref(null)
const paperOptions = ref([])
const patentOptions = ref([])
const topicOptions = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 9,
  name: '',
  organization: '',
  researchDirection: '',
  status: ''
})

const form = ref(createEmptyForm())

const rules = {
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
}

function createEmptyForm() {
  return {
    id: undefined,
    talentId: undefined,
    name: '',
    title: '',
    organization: '',
    researchDirection: '',
    resume: '',
    photoUrl: '',
    paperIds: [],
    patentIds: [],
    topicIds: [],
    status: '0'
  }
}

function buildResumePreview(value) {
  if (!value) return '未填写个人简历'
  return value.length > 68 ? `${value.slice(0, 68)}...` : value
}

function buildCardStyle(photoUrl) {
  if (!photoUrl) {
    return {
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #e0f2fe 100%)'
    }
  }

  return {
    backgroundImage: `url(${photoUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

async function getList() {
  loading.value = true
  try {
    const res = await pageTalent({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      name: queryParams.name,
      organization: queryParams.organization,
      researchDirection: queryParams.researchDirection,
      status: queryParams.status
    })

    talentList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
    total.value = Number(res?.data?.total || 0)
  } finally {
    loading.value = false
  }
}

async function loadAchievementOptions() {
  const [paperRes, patentRes, topicRes] = await Promise.all([listPaper(), listPatent(), listTopic()])
  paperOptions.value = Array.isArray(paperRes?.data?.rows) ? paperRes.data.rows : []
  patentOptions.value = Array.isArray(patentRes?.data?.rows) ? patentRes.data.rows : []
  topicOptions.value = Array.isArray(topicRes?.data?.rows) ? topicRes.data.rows : []
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.organization = ''
  queryParams.researchDirection = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  getList()
}

function handleAdd() {
  form.value = createEmptyForm()
  dialogTitle.value = '新增人才'
  dialogVisible.value = true
}

async function handleUpdate(row) {
  const res = await getTalentDetail(row.talentId)
  form.value = mapDetailToForm(res.data)
  dialogTitle.value = '编辑人才'
  dialogVisible.value = true
}

async function handleDetail(row) {
  const res = await getTalentDetail(row.talentId)
  currentTalent.value = res.data
  detailVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除人才“${row.name}”？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await deleteTalent(row.talentId)
  ElMessage.success('删除成功')
  if (talentList.value.length === 1 && queryParams.pageNum > 1) {
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
        talentId: form.value.talentId,
        name: form.value.name,
        title: form.value.title,
        organization: form.value.organization,
        researchDirection: form.value.researchDirection,
        resume: form.value.resume,
        photoUrl: form.value.photoUrl,
        paperIds: form.value.paperIds,
        patentIds: form.value.patentIds,
        topicIds: form.value.topicIds,
        status: form.value.status
      }

      if (form.value.talentId) {
        await updateTalent(payload)
        ElMessage.success('修改成功')
      } else {
        await addTalent(payload)
        ElMessage.success('新增成功')
      }

      dialogVisible.value = false
      getList()
    } finally {
      submitLoading.value = false
    }
  })
}

function mapDetailToForm(data = {}) {
  return {
    id: data.id,
    talentId: data.talentId,
    name: data.name || '',
    title: data.title || '',
    organization: data.organization || '',
    researchDirection: data.researchDirection || '',
    resume: data.resume || '',
    photoUrl: data.photoUrl || '',
    paperIds: Array.isArray(data.paperIds) ? data.paperIds : [],
    patentIds: Array.isArray(data.patentIds) ? data.patentIds : [],
    topicIds: Array.isArray(data.topicIds) ? data.topicIds : [],
    status: data.status || '0'
  }
}

onMounted(async () => {
  await Promise.all([loadAchievementOptions(), getList()])
})
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
}

.mb8 {
  margin-bottom: 16px;
}

.talent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
  min-height: 180px;
}

.talent-card {
  position: relative;
  overflow: hidden;
  min-height: 360px;
  border-radius: 24px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
}

.talent-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.82) 100%);
}

.talent-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 360px;
  padding: 20px;
  color: #fff;
}

.talent-card-header {
  display: flex;
  justify-content: flex-end;
}

.talent-main {
  margin-top: auto;
}

.talent-name {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
}

.talent-subtitle,
.talent-organization,
.talent-direction {
  margin-top: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.talent-resume {
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
}

.talent-footer {
  display: grid;
  gap: 12px;
}

.talent-achievements {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.92);
}

.talent-actions {
  display: flex;
  gap: 12px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.detail-layout {
  display: grid;
  gap: 18px;
}

.detail-photo {
  position: relative;
  overflow: hidden;
  min-height: 260px;
  border-radius: 24px;
}

.detail-photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.75) 100%);
}

.detail-photo-name {
  position: absolute;
  left: 20px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #fff;

  strong {
    font-size: 26px;
  }

  span {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.detail-section {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fafc;
  color: #334155;
}

.detail-label {
  font-size: 12px;
  color: #64748b;
}

.detail-relation-grid {
  display: grid;
  gap: 14px;
}

.detail-relation-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.relation-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.relation-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.relation-empty {
  font-size: 13px;
  color: #94a3b8;
}
</style>
