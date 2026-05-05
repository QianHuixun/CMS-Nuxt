<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="名称">
          <el-input v-model="queryParams.title" placeholder="请输入屏保名称" clearable style="width: 220px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.mediaType" placeholder="请选择类型" clearable style="width: 140px">
            <el-option label="图片" value="image" />
            <el-option label="视频" value="video" />
          </el-select>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增屏保</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="screenSaverList">
        <el-table-column label="配置名称" prop="title" min-width="180" show-overflow-tooltip />
        <el-table-column label="类型" prop="mediaType" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.mediaType === 'video' ? 'warning' : 'success'">{{ row.mediaType === 'video' ? '视频' : '图片' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="媒体预览" prop="mediaUrl" width="130" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.mediaType === 'image' && row.mediaUrl"
              :src="row.mediaUrl"
              :preview-src-list="[row.mediaUrl]"
              fit="cover"
              style="width: 80px; height: 48px; border-radius: 4px"
            />
            <el-tag v-else-if="row.mediaType === 'video' && row.mediaUrl" type="warning" effect="plain">视频已上传</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="视频封面" prop="coverUrl" width="120" align="center">
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
        <el-table-column label="触发秒数" prop="triggerSeconds" width="100" align="center" />
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

      <el-empty v-if="!loading && !screenSaverList.length" description="暂无屏保配置" />

      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="配置名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入配置名称" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item label="媒体类型" prop="mediaType">
          <el-radio-group v-model="form.mediaType" @change="handleMediaTypeChange">
            <el-radio label="image">图片</el-radio>
            <el-radio label="video">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.mediaType === 'image'" label="屏保图片" prop="mediaUrl">
          <ImageUpload v-model="form.mediaUrl" :limit="1" :file-size="10" :file-type="['png', 'jpg', 'jpeg', 'webp']" />
        </el-form-item>
        <template v-else>
          <el-form-item label="屏保视频" prop="mediaUrl">
            <VideoUploader
              v-model="form.mediaUrl"
              v-model:cover="form.coverUrl"
              :status="videoUploadStatus"
              @status-change="videoUploadStatus = $event"
            />
          </el-form-item>
          <el-form-item label="视频封面">
            <ImageUpload v-model="form.coverUrl" :limit="1" :file-size="8" :file-type="['png', 'jpg', 'jpeg', 'webp']" />
          </el-form-item>
        </template>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="触发秒数" prop="triggerSeconds">
              <el-input-number v-model="form.triggerSeconds" :min="5" :max="86400" controls-position="right" style="width: 160px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" :max="999999" controls-position="right" style="width: 160px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio label="active">启用</el-radio>
                <el-radio label="inactive">停用</el-radio>
              </el-radio-group>
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

<script setup name="SystemBaseConfigScreenSaverConfigIndex">
import Pagination from '@/components/Pagination/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import VideoUploader from '@/components/VideoUploader/index.vue'
import {
  addScreenSaverConfig,
  deleteScreenSaverConfig,
  getScreenSaverConfig,
  pageScreenSaverConfig,
  updateScreenSaverConfig
} from '@/api/systemBaseConfig/screenSaverConfig'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const screenSaverList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const videoUploadStatus = ref('idle')

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  mediaType: '',
  status: ''
})

const form = reactive(buildDefaultForm())

const rules = {
  title: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
  mediaType: [{ required: true, message: '请选择媒体类型', trigger: 'change' }],
  mediaUrl: [{ required: true, message: '请上传屏保媒体', trigger: 'change' }],
  triggerSeconds: [{ required: true, message: '请输入触发秒数', trigger: 'change' }]
}

function buildDefaultForm() {
  return {
    id: undefined,
    screensaverConfigId: undefined,
    title: '',
    mediaType: 'image',
    mediaUrl: '',
    coverUrl: '',
    triggerSeconds: 300,
    sort: 0,
    status: 'active',
    remark: ''
  }
}

function resetFormData(data = buildDefaultForm()) {
  Object.assign(form, buildDefaultForm(), data)
  videoUploadStatus.value = form.mediaType === 'video' && form.mediaUrl ? 'success' : 'idle'
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
    const res = await pageScreenSaverConfig(queryParams)
    screenSaverList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
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
  queryParams.mediaType = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  getList()
}

function handleAdd() {
  dialogTitle.value = '新增屏保'
  resetFormData()
  dialogVisible.value = true
}

async function handleUpdate(row) {
  dialogTitle.value = '编辑屏保'
  const res = await getScreenSaverConfig(row.id || row.screensaverConfigId)
  resetFormData(res?.data || row)
  dialogVisible.value = true
}

function handleMediaTypeChange() {
  form.mediaUrl = ''
  form.coverUrl = ''
  videoUploadStatus.value = 'idle'
  nextTick(() => formRef.value?.clearValidate?.('mediaUrl'))
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除屏保“${row.title}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await deleteScreenSaverConfig(row.id || row.screensaverConfigId)
  ElMessage.success('删除成功')
  if (screenSaverList.value.length === 1 && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }
  getList()
}

async function submitForm() {
  const valid = await formRef.value?.validate?.().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (form.id || form.screensaverConfigId) {
      await updateScreenSaverConfig(form)
      ElMessage.success('修改成功')
    } else {
      await addScreenSaverConfig(form)
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
.search-card,
.mb8 {
  margin-bottom: 16px;
}
</style>
