<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="书名">
          <el-input v-model="queryParams.title" placeholder="请输入书名" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="queryParams.author" placeholder="请输入作者" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="queryParams.category" placeholder="请选择类别" clearable style="width: 150px">
            <el-option label="中医理论" value="theory" />
            <el-option label="临床实践" value="clinical" />
            <el-option label="中药学" value="pharmacy" />
            <el-option label="针灸推拿" value="acupuncture" />
            <el-option label="养生保健" value="health" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="已发布" value="1" />
            <el-option label="草稿" value="0" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增书籍</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Upload" @click="showImportDialog = true">批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="bookList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="书名" prop="title" min-width="180" show-overflow-tooltip />
        <el-table-column label="作者" prop="author" width="120" />
        <el-table-column label="封面" prop="cover" width="80" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 40px; height: 50px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="category" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ categoryLabelMap[row.category] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出版时间" prop="publishDate" width="120" align="center" />
        <el-table-column label="ISBN" prop="isbn" width="150" />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'">
              {{ row.status === '1' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
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
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="form.isbn" placeholder="请输入ISBN" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="书籍类别" prop="category">
              <el-select v-model="form.category" placeholder="请选择类别" style="width: 100%">
                <el-option label="中医理论" value="theory" />
                <el-option label="临床实践" value="clinical" />
                <el-option label="中药学" value="pharmacy" />
                <el-option label="针灸推拿" value="acupuncture" />
                <el-option label="养生保健" value="health" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版时间" prop="publishDate">
              <el-date-picker v-model="form.publishDate" type="date" placeholder="选择出版时间" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图片">
          <el-input v-model="form.cover" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="书籍简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入书籍简介" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">发布</el-radio>
            <el-radio label="0">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="书籍详情" width="700px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="书名" :span="2">{{ currentBook.title }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ currentBook.author }}</el-descriptions-item>
        <el-descriptions-item label="ISBN">{{ currentBook.isbn }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ categoryLabelMap[currentBook.category] }}</el-descriptions-item>
        <el-descriptions-item label="出版时间">{{ currentBook.publishDate }}</el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">{{ currentBook.description || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="showImportDialog" title="批量导入" width="500px" append-to-body>
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx/xls 文件，建议先<el-link type="primary">下载导入模板</el-link></div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="showImportDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleImportConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PaperAchievementBookImportIndex">
import Pagination from '@/components/Pagination/index.vue'
import { UploadFilled } from '@element-plus/icons-vue'

const loading = ref(true)
const bookList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const categoryLabelMap = { theory: '中医理论', clinical: '临床实践', pharmacy: '中药学', acupuncture: '针灸推拿', health: '养生保健' }

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  author: '',
  category: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const showImportDialog = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentBook = ref({})

const form = ref({
  id: undefined,
  title: '',
  author: '',
  isbn: '',
  category: '',
  publishDate: '',
  cover: '',
  description: '',
  status: '0'
})

const rules = {
  title: [{ required: true, message: '书名不能为空', trigger: 'blur' }],
  author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }]
}

// 模拟数据
const mockData = [
  { id: 1, title: '《伤寒论》注疏', author: '张仲景', isbn: '978-7-5322-0001-2', category: 'theory', publishDate: '2023-06-15', cover: 'https://picsum.photos/80/100?random=1', description: '对《伤寒论》的深度注解与阐释。', status: '1', createTime: '2024-01-15 10:30:00' },
  { id: 2, title: '《本草纲目》精要', author: '李时珍', isbn: '978-7-5322-0002-3', category: 'pharmacy', publishDate: '2023-03-20', cover: 'https://picsum.photos/80/100?random=2', description: '《本草纲目》核心内容精选。', status: '1', createTime: '2024-01-14 09:20:00' },
  { id: 3, title: '针灸学教程', author: '王医师', isbn: '978-7-5322-0003-4', category: 'acupuncture', publishDate: '2023-09-10', cover: '', description: '系统介绍针灸学理论与实践。', status: '1', createTime: '2024-01-13 14:00:00' },
  { id: 4, title: '中医养生大全', author: '刘教授', isbn: '978-7-5322-0004-5', category: 'health', publishDate: '2023-12-01', cover: 'https://picsum.photos/80/100?random=4', description: '中医养生保健知识汇编。', status: '0', createTime: '2024-01-12 16:45:00' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    bookList.value = mockData.map(item => ({ ...item }))
    total.value = bookList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.title = ''
  queryParams.author = ''
  queryParams.category = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = { id: undefined, title: '', author: '', isbn: '', category: '', publishDate: '', cover: '', description: '', status: '0' }
  dialogTitle.value = '新增书籍'
  dialogVisible.value = true
}

function handleDetail(row) {
  currentBook.value = { ...row }
  detailVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑书籍'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除书籍"${row.title || ids.value}"？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getList()
  })
}

function handleExport() {
  ElMessage.info('导出功能开发中')
}

function handleImportConfirm() {
  ElMessage.success('导入成功')
  showImportDialog.value = false
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
