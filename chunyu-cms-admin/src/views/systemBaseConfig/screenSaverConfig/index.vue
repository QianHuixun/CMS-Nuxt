<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="屏保名称">
          <el-input v-model="queryParams.name" placeholder="请输入屏保名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable style="width: 150px">
            <el-option label="图片轮播" value="image" />
            <el-option label="视频" value="video" />
            <el-option label="动态特效" value="effect" />
          </el-select>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增屏保</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="screenSaverList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="屏保名称" prop="name" min-width="150" show-overflow-tooltip />
        <el-table-column label="类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="typeMap[row.type]">{{ typeLabelMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预览图" prop="cover" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 60px; height: 40px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="时长(秒)" prop="duration" width="100" align="center" />
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="1" inactive-value="0" @change="handleStatusChange(row)" />
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="屏保名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入屏保名称" />
        </el-form-item>
        <el-form-item label="屏保类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="image">图片轮播</el-radio>
            <el-radio label="video">视频</el-radio>
            <el-radio label="effect">动态特效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面图片" prop="cover">
          <el-input v-model="form.cover" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="播放时长" prop="duration">
          <el-input-number v-model="form.duration" :min="5" :max="300" /> 秒
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

<script setup name="SystemBaseConfigScreenSaverConfigIndex">
import Pagination from '@/components/Pagination/index.vue'

const loading = ref(true)
const screenSaverList = ref([])
const total = ref(0)
const multiple = ref(true)
const ids = ref([])

const typeMap = { image: '', video: 'warning', effect: 'success' }
const typeLabelMap = { image: '图片轮播', video: '视频', effect: '动态特效' }

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const form = ref({
  id: undefined,
  name: '',
  type: 'image',
  cover: '',
  duration: 30,
  sort: 0,
  status: '1',
  remark: ''
})

const rules = {
  name: [{ required: true, message: '屏保名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择屏保类型', trigger: 'change' }]
}

// 模拟数据
const mockData = [
  { id: 1, name: '首页轮播图', type: 'image', cover: 'https://picsum.photos/200/150?random=1', duration: 30, sort: 1, status: '1', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '品牌宣传片', type: 'video', cover: 'https://picsum.photos/200/150?random=2', duration: 60, sort: 2, status: '1', createTime: '2024-01-14 09:20:00' },
  { id: 3, name: '星空特效', type: 'effect', cover: 'https://picsum.photos/200/150?random=3', duration: 120, sort: 3, status: '0', createTime: '2024-01-13 14:00:00' },
  { id: 4, name: '节日祝福', type: 'image', cover: 'https://picsum.photos/200/150?random=4', duration: 45, sort: 4, status: '1', createTime: '2024-01-12 16:45:00' }
]

function getList() {
  loading.value = true
  setTimeout(() => {
    screenSaverList.value = mockData.map(item => ({ ...item }))
    total.value = screenSaverList.value.length
    loading.value = false
  }, 300)
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.type = ''
  queryParams.status = ''
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

function handleStatusChange(row) {
  ElMessage.success(`已${row.status === '1' ? '启用' : '禁用'}`)
}

function handleAdd() {
  form.value = { id: undefined, name: '', type: 'image', cover: '', duration: 30, sort: 0, status: '1', remark: '' }
  dialogTitle.value = '新增屏保'
  dialogVisible.value = true
}

function handleUpdate(row) {
  form.value = { ...row }
  dialogTitle.value = '编辑屏保'
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`是否确认删除屏保"${row.name || ids.value}"？`, '警告', {
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
