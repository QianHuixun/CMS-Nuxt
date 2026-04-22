<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="标题">
          <el-input v-model="queryParams.title" placeholder="请输入标题" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryParams.category" placeholder="请选择分类" clearable style="width: 150px">
            <el-option label="重要通知" value="important" />
            <el-option label="学术动态" value="academic" />
            <el-option label="活动公告" value="activity" />
            <el-option label="新闻资讯" value="news" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="已发布" value="1" />
            <el-option label="草稿" value="0" />
            <el-option label="已下架" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="置顶">
          <el-select v-model="queryParams.isTop" placeholder="请选择" clearable style="width: 100px">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增头条</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Top" :disabled="multiple" @click="handleBatchTop">批量置顶</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Bottom" :disabled="multiple" @click="handleBatchUntop">取消置顶</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="headlineList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="置顶" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isTop === '1'" type="danger" size="small">置顶</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="封面图" prop="cover" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 80px; height: 50px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" min-width="250" show-overflow-tooltip />
        <el-table-column label="分类" prop="category" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="categoryColorMap[row.category]">{{ categoryLabelMap[row.category] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" prop="views" width="90" align="center">
          <template #default="{ row }">
            <span><el-icon><View /></el-icon> {{ row.views }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80" align="center">
          <template #default="{ row }">
            <el-input-number
              v-model="row.sort"
              :min="0"
              :max="999"
              size="small"
              @change="handleSortChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="statusColorMap[row.status]">{{ statusLabelMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="publishTime" width="160" align="center" />
        <el-table-column label="操作" width="220" align="center" fixed="right">
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="头条标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="100" show-word-limit />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="重要通知" value="important" />
            <el-option label="学术动态" value="academic" />
            <el-option label="活动公告" value="activity" />
            <el-option label="新闻资讯" value="news" />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片">
          <el-input v-model="form.cover" placeholder="请输入封面图片URL" />
        </el-form-item>

        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="请输入摘要" maxlength="200" show-word-limit />
        </el-form-item>

        <el-form-item label="详细内容">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入详细内容" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" :max="999" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="置顶">
              <el-switch v-model="form.isTop" active-value="1" inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio label="1">发布</el-radio>
                <el-radio label="0">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="submitForm">发 布</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="头条详情" width="800px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="标题" :span="2">{{ currentHeadline.title }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ categoryLabelMap[currentHeadline.category] }}</el-descriptions-item>
        <el-descriptions-item label="浏览量">{{ currentHeadline.views }}</el-descriptions-item>
        <el-descriptions-item label="置顶">{{ currentHeadline.isTop === '1' ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusLabelMap[currentHeadline.status] }}</el-descriptions-item>
        <el-descriptions-item label="发布时间" :span="2">{{ currentHeadline.publishTime }}</el-descriptions-item>
        <el-descriptions-item label="摘要" :span="2">{{ currentHeadline.summary || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="封面图" :span="2">
          <el-image v-if="currentHeadline.cover" :src="currentHeadline.cover" fit="cover" style="width: 200px; height: 120px; border-radius: 8px" />
          <span v-else>暂无封面</span>
        </el-descriptions-item>
        <el-descriptions-item label="详细内容" :span="2">
          <div v-html="currentHeadline.content" class="content-html"></div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="ActivityManagementHeadlineFeaturedIndex">
import Pagination from '@/components/Pagination/index.vue'
import { View } from '@element-plus/icons-vue'

const loading = ref(true)
const headlineList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const categoryColorMap = { important: 'danger', academic: 'primary', activity: 'success', news: 'warning' }
const categoryLabelMap = { important: '重要通知', academic: '学术动态', activity: '活动公告', news: '新闻资讯' }
const statusColorMap = { '1': 'success', '0': 'info', '2': 'warning' }
const statusLabelMap = { '1': '已发布', '0': '草稿', '2': '已下架' }

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  category: '',
  status: '',
  isTop: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentHeadline = ref({})

const form = ref({
  id: undefined,
  title: '',
  category: '',
  cover: '',
  summary: '',
  content: '',
  sort: 0,
  isTop: '0',
  status: '0'
})

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 模拟数据
const mockData = [
  { id: 1, title: '关于举办2024年中医药学术研讨会的通知', category: 'important', cover: 'https://picsum.photos/200/120?random=20', summary: '邀请国内外知名中医药专家进行学术交流', views: 1256, sort: 1, isTop: '1', status: '1', publishTime: '2024-01-15 10:30:00', content: '研讨会将于2024年3月在京举行...' },
  { id: 2, title: '我校中药学研究成果在国际期刊发表', category: 'academic', cover: 'https://picsum.photos/200/120?random=21', summary: '研究成果获得国际学术界认可', views: 892, sort: 2, isTop: '1', status: '1', publishTime: '2024-01-14 14:20:00', content: '近日，我校中药学研究团队...' },
  { id: 3, title: '春季养生健康讲座报名通知', category: 'activity', cover: 'https://picsum.photos/200/120?random=22', summary: '知名中医专家现场讲解春季养生', views: 654, sort: 3, isTop: '0', status: '1', publishTime: '2024-01-13 09:00:00', content: '讲座内容包括春季常见疾病预防...' },
  { id: 4, title: '中医药文化进校园活动圆满结束', category: 'news', cover: '', summary: '让学生近距离感受中医药文化魅力', views: 432, sort: 4, isTop: '0', status: '1', publishTime: '2024-01-12 16:45:00', content: '活动历时一周，覆盖全市10所中小学...' },
  { id: 5, title: '针灸推拿技能大赛即将开赛', category: 'activity', cover: 'https://picsum.photos/200/120?random=24', summary: '展示针灸推拿专业技能', views: 0, sort: 5, isTop: '0', status: '0', publishTime: '', content: '大赛报名工作正在进行中...' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    headlineList.value = mockData.map(item => ({ ...item }))
    total.value = headlineList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.title = ''
  queryParams.category = ''
  queryParams.status = ''
  queryParams.isTop = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleSortChange(row) {
  ElMessage.success('排序已更新')
}

function handleAdd() {
  form.value = { id: undefined, title: '', category: '', cover: '', summary: '', content: '', sort: 0, isTop: '0', status: '0' }
  dialogTitle.value = '新增头条'
  dialogVisible.value = true
}

function handleDetail(row) {
  currentHeadline.value = { ...row }
  detailVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑头条'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除头条"${row.title || ids.value}"？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getList()
  })
}

function handleBatchTop() {
  ElMessageBox.confirm(`是否确认将 ${ids.value.length} 条头条置顶？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量置顶成功')
    getList()
  })
}

function handleBatchUntop() {
  ElMessageBox.confirm(`是否确认取消 ${ids.value.length} 条头条的置顶？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量取消置顶成功')
    getList()
  })
}

function handleSaveDraft() {
  formRef.value.validate(valid => {
    if (valid) {
      form.value.status = '0'
      ElMessage.success('保存草稿成功')
      dialogVisible.value = false
      getList()
    }
  })
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      form.value.status = '1'
      ElMessage.success(form.value.id ? '修改成功' : '发布成功')
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

.content-html {
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.8;
}
</style>
