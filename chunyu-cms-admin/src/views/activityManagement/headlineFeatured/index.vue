<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="活动名称">
          <el-input v-model="queryParams.keyword" placeholder="请输入活动名称" clearable style="width: 240px" />
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

    <el-card shadow="never">
      <el-table v-loading="loading" :data="headlineList">
        <el-table-column label="头条" width="80" align="center">
          <template #default>
            <el-tag type="danger" size="small">头条</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="封面图" prop="thumbnail" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.thumbnail"
              :src="row.thumbnail"
              :preview-src-list="[row.thumbnail]"
              fit="cover"
              style="width: 80px; height: 50px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" prop="name" min-width="220" show-overflow-tooltip />
        <el-table-column label="描述" prop="description" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.description || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="90" align="center" />
        <el-table-column label="状态" prop="status" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'">{{ row.status === '1' ? '发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
          <template #default="{ row }">
            <span>{{ formatUpdateTime(row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="warning" :icon="Bottom" @click="handleCancelHeadline(row)">取消头条</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && !headlineList.length" description="当前暂无头条活动" />

      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script setup name="ActivityManagementHeadlineFeaturedIndex">
import Pagination from '@/components/Pagination/index.vue'
import { listActivity, updateActivity } from '@/api/activityManagement/activity'
import { buildHeadlineActivityQuery, compareActivitiesHeadlineFirst } from '../utils/headline'
import { Bottom } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const headlineList = ref([])
const total = ref(0)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: ''
})

function formatUpdateTime(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function getList() {
  loading.value = true

  try {
    const res = await listActivity(buildHeadlineActivityQuery(queryParams))
    const rows = Array.isArray(res?.data?.rows) ? res.data.rows : []
    headlineList.value = rows.sort(compareActivitiesHeadlineFirst)
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
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  getList()
}

async function handleCancelHeadline(row) {
  try {
    await ElMessageBox.confirm(`确认取消活动“${row.name}”的头条标记吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  await updateActivity({ id: row.id, isHeadline: '0' })
  ElMessage.success('头条已取消')

  if (headlineList.value.length === 1 && queryParams.pageNum > 1) {
    queryParams.pageNum -= 1
  }

  getList()
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
