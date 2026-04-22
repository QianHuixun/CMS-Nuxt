<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="专家姓名">
          <el-input v-model="queryParams.name" placeholder="请输入专家姓名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="研究方向">
          <el-select v-model="queryParams.researchArea" placeholder="请选择研究方向" clearable style="width: 180px">
            <el-option label="中医基础理论" value="中医基础理论" />
            <el-option label="中药学" value="中药学" />
            <el-option label="针灸推拿" value="针灸推拿" />
            <el-option label="中医临床" value="中医临床" />
            <el-option label="中西医结合" value="中西医结合" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="queryParams.title" placeholder="请选择职称" clearable style="width: 150px">
            <el-option label="教授" value="教授" />
            <el-option label="副教授" value="副教授" />
            <el-option label="主任医师" value="主任医师" />
            <el-option label="副主任医师" value="副主任医师" />
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

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="expertList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="专家姓名" prop="name" min-width="120" />
        <el-table-column label="头像" prop="avatar" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              {{ row.name?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="职称" prop="title" width="120" align="center" />
        <el-table-column label="研究方向" prop="researchArea" min-width="150" show-overflow-tooltip />
        <el-table-column label="所在机构" prop="institution" min-width="150" show-overflow-tooltip />
        <el-table-column label="联系电话" prop="phone" width="130" align="center" />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '启用' : '禁用' }}
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专家姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入专家姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职称" prop="title">
              <el-select v-model="form.title" placeholder="请选择职称" style="width: 100%">
                <el-option label="教授" value="教授" />
                <el-option label="副教授" value="副教授" />
                <el-option label="主任医师" value="主任医师" />
                <el-option label="副主任医师" value="副主任医师" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="研究方向" prop="researchArea">
              <el-select v-model="form.researchArea" placeholder="请选择研究方向" style="width: 100%">
                <el-option label="中医基础理论" value="中医基础理论" />
                <el-option label="中药学" value="中药学" />
                <el-option label="针灸推拿" value="针灸推拿" />
                <el-option label="中医临床" value="中医临床" />
                <el-option label="中西医结合" value="中西医结合" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所在机构" prop="institution">
          <el-input v-model="form.institution" placeholder="请输入所在机构" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="3" placeholder="请输入个人简介" />
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="专家详情" width="700px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="专家姓名">{{ currentExpert.name }}</el-descriptions-item>
        <el-descriptions-item label="职称">{{ currentExpert.title }}</el-descriptions-item>
        <el-descriptions-item label="研究方向">{{ currentExpert.researchArea }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentExpert.phone }}</el-descriptions-item>
        <el-descriptions-item label="所在机构" :span="2">{{ currentExpert.institution }}</el-descriptions-item>
        <el-descriptions-item label="个人简介" :span="2">{{ currentExpert.bio || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="TalentResearchExpertLibraryIndex">
import Pagination from '@/components/Pagination/index.vue'

const loading = ref(true)
const expertList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  researchArea: '',
  title: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const currentExpert = ref({})

const form = ref({
  id: undefined,
  name: '',
  avatar: '',
  title: '',
  researchArea: '',
  institution: '',
  phone: '',
  bio: '',
  status: '1'
})

const rules = {
  name: [{ required: true, message: '专家姓名不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '请选择职称', trigger: 'change' }],
  researchArea: [{ required: true, message: '请选择研究方向', trigger: 'change' }],
  phone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
}

// 模拟数据
const mockData = [
  { id: 1, name: '张仲景', avatar: 'https://picsum.photos/100/100?random=1', title: '教授', researchArea: '中医基础理论', institution: '北京中医药大学', phone: '13800138001', bio: '从事中医基础理论研究40年，发表学术论文百余篇。', status: '1', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '李时珍', avatar: 'https://picsum.photos/100/100?random=2', title: '主任医师', researchArea: '中药学', institution: '中国中医科学院', phone: '13800138002', bio: '中药学专家，擅长中药鉴定与临床应用。', status: '1', createTime: '2024-01-14 09:20:00' },
  { id: 3, name: '孙思邈', avatar: 'https://picsum.photos/100/100?random=3', title: '教授', researchArea: '针灸推拿', institution: '上海中医药大学', phone: '13800138003', bio: '针灸推拿学专家，国家级非物质文化遗产传承人。', status: '1', createTime: '2024-01-13 14:00:00' },
  { id: 4, name: '华佗', avatar: 'https://picsum.photos/100/100?random=4', title: '副主任医师', researchArea: '中西医结合', institution: '广州中医药大学附属医院', phone: '13800138004', bio: '中西医结合临床专家。', status: '0', createTime: '2024-01-12 16:45:00' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    expertList.value = mockData.map(item => ({ ...item }))
    total.value = expertList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.researchArea = ''
  queryParams.title = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = { id: undefined, name: '', avatar: '', title: '', researchArea: '', institution: '', phone: '', bio: '', status: '1' }
  dialogTitle.value = '新增专家'
  dialogVisible.value = true
}

function handleDetail(row) {
  currentExpert.value = { ...row }
  detailVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑专家'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除专家"${row.name || ids.value}"？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getList()
  })
}

function handleImport() {
  ElMessage.info('导入功能开发中')
}

function handleExport() {
  ElMessage.info('导出功能开发中')
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
