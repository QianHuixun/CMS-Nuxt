<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="导航名称">
          <el-input v-model="queryParams.name" placeholder="请输入导航名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增导航</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="navList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="导航名称" prop="name" min-width="150" show-overflow-tooltip />
        <el-table-column label="导航图标" prop="icon" width="100" align="center">
          <template #default="{ row }">
            <el-icon :size="20">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" prop="url" min-width="200" show-overflow-tooltip />
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="导航名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入导航名称" />
        </el-form-item>
        <el-form-item label="导航图标" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择图标" clearable style="width: 100%">
            <el-option label="HomeFilled" value="HomeFilled" />
            <el-option label="Document" value="Document" />
            <el-option label="Setting" value="Setting" />
            <el-option label="User" value="User" />
            <el-option label="Star" value="Star" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入跳转地址" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SystemBaseConfigNavConfigIndex">
import Pagination from '@/components/Pagination/index.vue'

const loading = ref(true)
const navList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const form = ref({
  id: undefined,
  name: '',
  icon: '',
  url: '',
  sort: 0,
  status: '1',
  remark: ''
})

const rules = {
  name: [{ required: true, message: '导航名称不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '跳转地址不能为空', trigger: 'blur' }]
}

// 模拟数据
const mockData = [
  { id: 1, name: '首页', icon: 'HomeFilled', url: '/home', sort: 1, status: '1', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '关于我们', icon: 'Document', url: '/about', sort: 2, status: '1', createTime: '2024-01-14 09:20:00' },
  { id: 3, name: '产品中心', icon: 'Goods', url: '/products', sort: 3, status: '1', createTime: '2024-01-13 14:00:00' },
  { id: 4, name: '联系我们', icon: 'Phone', url: '/contact', sort: 4, status: '0', createTime: '2024-01-12 16:45:00' },
  { id: 5, name: '新闻动态', icon: 'News', url: '/news', sort: 5, status: '1', createTime: '2024-01-11 11:10:00' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    navList.value = mockData.filter(item => {
      const nameMatch = !queryParams.name || item.name.includes(queryParams.name)
      const statusMatch = !queryParams.status || item.status === queryParams.status
      return nameMatch && statusMatch
    })
    total.value = navList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleAdd() {
  form.value = { id: undefined, name: '', icon: '', url: '', sort: 0, status: '1', remark: '' }
  dialogTitle.value = '新增导航'
  dialogVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑导航'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除导航"${row.name || ids.value}"？`, '警告', {
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
