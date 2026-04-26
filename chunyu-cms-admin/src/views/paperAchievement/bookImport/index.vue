<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="论文" name="paper">
        <el-card shadow="never" class="search-card">
          <el-form :model="paperQueryParams" :inline="true">
            <el-form-item label="论文标题">
              <el-input v-model="paperQueryParams.title" placeholder="请输入论文标题" clearable style="width: 240px" />
            </el-form-item>
            <el-form-item label="发表年份">
              <el-input-number v-model="paperQueryParams.publishYear" :min="0" :max="9999" controls-position="right" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="paperQueryParams.status" placeholder="请选择状态" clearable style="width: 120px">
                <el-option label="发布" value="1" />
                <el-option label="草稿" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="只看精选">
              <el-select v-model="paperQueryParams.isFeatured" placeholder="全部" clearable style="width: 120px">
                <el-option label="是" value="1" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增论文</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Upload" @click="openImportDialog('paper')">批量导入</el-button>
          </el-col>
        </el-row>

        <el-card shadow="never">
          <el-table v-loading="paperLoading" :data="paperList">
            <el-table-column label="标题" prop="title" min-width="220" show-overflow-tooltip />
            <el-table-column label="年份" prop="publishYear" width="100" align="center">
              <template #default="{ row }">
                <span>{{ row.publishYear || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关键词" prop="keywords" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.keywords || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否精选" prop="isFeatured" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.isFeatured === '1' ? 'warning' : 'info'">
                  {{ row.isFeatured === '1' ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '1' ? 'success' : 'info'">
                  {{ row.status === '1' ? '发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
              <template #default="{ row }">
                <span>{{ formatDateTime(row.updateTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
                <el-button
                  link
                  :type="row.isFeatured === '1' ? 'warning' : 'success'"
                  @click="handleToggleFeatured(row)"
                >
                  {{ row.isFeatured === '1' ? '取消精选' : '设为精选' }}
                </el-button>
                <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="paperTotal > 0"
            :total="paperTotal"
            v-model:page="paperQueryParams.pageNum"
            v-model:limit="paperQueryParams.pageSize"
            @pagination="getPaperList"
          />
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="专利" name="patent">
        <el-card shadow="never" class="search-card">
          <el-form :model="patentQueryParams" :inline="true">
            <el-form-item label="专利名称">
              <el-input v-model="patentQueryParams.title" placeholder="请输入专利名称" clearable style="width: 240px" />
            </el-form-item>
            <el-form-item label="申请年份">
              <el-input-number v-model="patentQueryParams.applyYear" :min="0" :max="9999" controls-position="right" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="patentQueryParams.status" placeholder="请选择状态" clearable style="width: 120px">
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增专利</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Upload" @click="openImportDialog('patent')">批量导入</el-button>
          </el-col>
        </el-row>

        <el-card shadow="never">
          <el-table v-loading="patentLoading" :data="patentList">
            <el-table-column label="专利名称" prop="title" min-width="220" show-overflow-tooltip />
            <el-table-column label="专利号" prop="patentNo" min-width="160" show-overflow-tooltip />
            <el-table-column label="申请人" prop="applicant" min-width="160" show-overflow-tooltip />
            <el-table-column label="申请年份" prop="applyYear" width="100" align="center">
              <template #default="{ row }">
                <span>{{ row.applyYear || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作视频" min-width="220">
              <template #default="{ row }">
                <div v-if="row.operationVideoUrl" class="video-card" :style="buildVideoCardStyle(row.videoCoverUrl)">
                  <div class="video-card-mask"></div>
                  <div class="video-card-content">
                    <span class="video-card-title">操作视频</span>
                    <el-link :href="row.operationVideoUrl" type="primary" target="_blank" :underline="false">预览视频</el-link>
                  </div>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '1' ? 'success' : 'info'">
                  {{ row.status === '1' ? '发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
              <template #default="{ row }">
                <span>{{ formatDateTime(row.updateTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
                <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="patentTotal > 0"
            :total="patentTotal"
            v-model:page="patentQueryParams.pageNum"
            v-model:limit="patentQueryParams.pageSize"
            @pagination="getPatentList"
          />
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="课题" name="topic">
        <el-card shadow="never" class="search-card">
          <el-form :model="topicQueryParams" :inline="true">
            <el-form-item label="课题名称">
              <el-input v-model="topicQueryParams.title" placeholder="请输入课题名称" clearable style="width: 240px" />
            </el-form-item>
            <el-form-item label="立项年份">
              <el-input-number v-model="topicQueryParams.projectYear" :min="0" :max="9999" controls-position="right" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="topicQueryParams.status" placeholder="请选择状态" clearable style="width: 120px">
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增课题</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Upload" @click="openImportDialog('topic')">批量导入</el-button>
          </el-col>
        </el-row>

        <el-card shadow="never">
          <el-table v-loading="topicLoading" :data="topicList">
            <el-table-column label="课题名称" prop="title" min-width="220" show-overflow-tooltip />
            <el-table-column label="课题编号" prop="topicNo" min-width="160" show-overflow-tooltip />
            <el-table-column label="负责人" prop="leader" min-width="120" show-overflow-tooltip />
            <el-table-column label="立项年份" prop="projectYear" width="100" align="center">
              <template #default="{ row }">
                <span>{{ row.projectYear || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目来源" prop="source" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.source || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '1' ? 'success' : 'info'">
                  {{ row.status === '1' ? '发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="180" align="center">
              <template #default="{ row }">
                <span>{{ formatDateTime(row.updateTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(row)">编辑</el-button>
                <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="topicTotal > 0"
            :total="topicTotal"
            v-model:page="topicQueryParams.pageNum"
            v-model:limit="topicQueryParams.pageSize"
            @pagination="getTopicList"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="paperDialogVisible" :title="paperDialogTitle" width="760px" append-to-body>
      <el-form ref="paperFormRef" :model="paperForm" :rules="paperRules" label-width="100px">
        <el-form-item label="论文标题" prop="title">
          <el-input v-model="paperForm.title" placeholder="请输入论文标题" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发表年份" prop="publishYear">
              <el-input-number v-model="paperForm.publishYear" :min="0" :max="9999" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否精选" prop="isFeatured">
              <el-radio-group v-model="paperForm.isFeatured">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="paperForm.keywords" type="textarea" :rows="3" placeholder="请输入关键词，建议使用逗号分隔" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="paperForm.abstract" type="textarea" :rows="4" placeholder="请输入论文摘要" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="paperForm.status">
            <el-radio label="1">发布</el-radio>
            <el-radio label="0">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="paperDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="patentDialogVisible" :title="patentDialogTitle" width="880px" append-to-body>
      <el-form ref="patentFormRef" :model="patentForm" :rules="patentRules" label-width="110px">
        <el-form-item label="专利名称" prop="title">
          <el-input v-model="patentForm.title" placeholder="请输入专利名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专利号" prop="patentNo">
              <el-input v-model="patentForm.patentNo" placeholder="请输入专利号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicant">
              <el-input v-model="patentForm.applicant" placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请年份" prop="applyYear">
              <el-input-number v-model="patentForm.applyYear" :min="0" :max="9999" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="patentForm.status">
                <el-radio label="1">发布</el-radio>
                <el-radio label="0">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="摘要">
          <el-input v-model="patentForm.abstract" type="textarea" :rows="4" placeholder="请输入专利摘要/简介" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作视频">
              <VideoUploader
                v-model="patentForm.operationVideoUrl"
                v-model:cover="patentForm.videoCoverUrl"
                :cover="patentForm.videoCoverUrl"
                :status="patentVideoStatus"
                @status-change="handlePatentVideoStatusChange"
              />
              <div class="upload-tip">支持 MP4 上传，上传后自动尝试抽取首帧作为封面。</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频封面">
              <ImageUpload
                v-model="patentForm.videoCoverUrl"
                :limit="1"
                :file-size="5"
                :file-type="['png', 'jpg', 'jpeg', 'webp']"
              />
              <div class="upload-tip">支持手动替换封面图，卡片背景优先使用封面图。</div>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-if="patentForm.operationVideoUrl || patentForm.videoCoverUrl" class="video-actions">
          <el-button v-if="patentForm.operationVideoUrl" size="small" type="danger" plain @click="handleRemovePatentVideo">
            删除视频
          </el-button>
          <el-button v-if="patentForm.videoCoverUrl" size="small" plain @click="handleRemovePatentCover">删除封面</el-button>
        </div>

        <div v-if="patentForm.operationVideoUrl" class="dialog-video-preview" :style="buildVideoCardStyle(patentForm.videoCoverUrl)">
          <div class="video-card-mask"></div>
          <div class="video-card-content">
            <span class="video-card-title">{{ patentForm.title || '专利操作视频' }}</span>
            <el-link :href="patentForm.operationVideoUrl" target="_blank" type="primary" :underline="false">预览视频</el-link>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="patentDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="topicDialogVisible" :title="topicDialogTitle" width="760px" append-to-body>
      <el-form ref="topicFormRef" :model="topicForm" :rules="topicRules" label-width="100px">
        <el-form-item label="课题名称" prop="title">
          <el-input v-model="topicForm.title" placeholder="请输入课题名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课题编号" prop="topicNo">
              <el-input v-model="topicForm.topicNo" placeholder="请输入课题编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="topicForm.leader" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="立项年份" prop="projectYear">
              <el-input-number v-model="topicForm.projectYear" :min="0" :max="9999" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="topicForm.status">
                <el-radio label="1">发布</el-radio>
                <el-radio label="0">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目来源" prop="source">
          <el-input v-model="topicForm.source" placeholder="请输入项目来源/类别" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="topicForm.abstract" type="textarea" :rows="4" placeholder="请输入课题摘要/简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="topicDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="importDialogVisible" :title="importDialogTitle" width="980px" append-to-body>
      <div class="import-toolbar">
        <el-button type="primary" plain @click="handleDownloadTemplate">下载模板</el-button>
        <el-button type="success" plain @click="triggerImportFileSelect">上传并解析 .xlsx</el-button>
        <span v-if="importFileName" class="import-file-name">当前文件：{{ importFileName }}</span>
      </div>

      <div class="import-summary">
        <div class="summary-card">
          <span class="summary-label">总行数</span>
          <strong>{{ importPreview.summary.total }}</strong>
        </div>
        <div class="summary-card is-success">
          <span class="summary-label">有效行数</span>
          <strong>{{ importPreview.summary.valid }}</strong>
        </div>
        <div class="summary-card is-danger">
          <span class="summary-label">错误行数</span>
          <strong>{{ importPreview.summary.invalid }}</strong>
        </div>
      </div>

      <el-table v-if="importPreview.rows.length" v-loading="importLoading" :data="importPreview.rows" max-height="420">
        <el-table-column label="行号" prop="rowNo" width="80" align="center" />
        <el-table-column
          v-for="column in importColumns"
          :key="column.key"
          :label="column.label"
          min-width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.data?.[column.key] ?? '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="校验结果" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.valid ? 'success' : 'danger'">{{ row.valid ? '通过' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误原因" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <span :class="{ 'error-copy': !row.valid }">{{ row.errors?.length ? row.errors.join('；') : '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="请先下载模板并上传 .xlsx 文件进行解析预览" />

      <template #footer>
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="importPreview.summary.valid === 0" :loading="importSubmitting" @click="handleConfirmImport">
          确认导入有效行
        </el-button>
      </template>
    </el-dialog>

    <input ref="importFileInput" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="hidden-file-input" @change="handleImportFileChange" />
  </div>
</template>

<script setup name="PaperAchievementBookImportIndex">
import Pagination from '@/components/Pagination/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import VideoUploader from '@/components/VideoUploader/index.vue'
import { saveAs } from 'file-saver'
import { addPaper, deletePaper, getPaperDetail, pagePaper, updatePaper, updatePaperFeatured } from '@/api/paperAchievement/paper'
import { addPatent, deletePatent, getPatentDetail, pagePatent, updatePatent } from '@/api/paperAchievement/patent'
import { addTopic, deleteTopic, getTopicDetail, pageTopic, updateTopic } from '@/api/paperAchievement/topic'
import { confirmImport, downloadImportTemplate, previewImport } from '@/api/paperAchievement/import'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('paper')
const submitLoading = ref(false)
const importFileInput = ref(null)
const importDialogVisible = ref(false)
const importLoading = ref(false)
const importSubmitting = ref(false)
const importType = ref('paper')
const importFileName = ref('')
const importPreview = ref(createEmptyImportPreview())

const paperLoading = ref(false)
const paperList = ref([])
const paperTotal = ref(0)
const paperDialogVisible = ref(false)
const paperDialogTitle = ref('')
const paperFormRef = ref(null)

const patentLoading = ref(false)
const patentList = ref([])
const patentTotal = ref(0)
const patentDialogVisible = ref(false)
const patentDialogTitle = ref('')
const patentFormRef = ref(null)
const patentVideoStatus = ref('idle')

const topicLoading = ref(false)
const topicList = ref([])
const topicTotal = ref(0)
const topicDialogVisible = ref(false)
const topicDialogTitle = ref('')
const topicFormRef = ref(null)

const paperQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  publishYear: undefined,
  isFeatured: '',
  status: ''
})

const patentQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  applyYear: undefined,
  status: ''
})

const topicQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  projectYear: undefined,
  status: ''
})

const paperForm = ref(createEmptyPaperForm())
const patentForm = ref(createEmptyPatentForm())
const topicForm = ref(createEmptyTopicForm())

const paperRules = {
  title: [{ required: true, message: '论文标题不能为空', trigger: 'blur' }]
}

const patentRules = {
  title: [{ required: true, message: '专利名称不能为空', trigger: 'blur' }]
}

const topicRules = {
  title: [{ required: true, message: '课题名称不能为空', trigger: 'blur' }]
}

function createEmptyPaperForm() {
  return {
    id: undefined,
    paperId: undefined,
    title: '',
    publishYear: undefined,
    keywords: '',
    abstract: '',
    isFeatured: '0',
    status: '0'
  }
}

function createEmptyPatentForm() {
  return {
    id: undefined,
    patentId: undefined,
    title: '',
    patentNo: '',
    applicant: '',
    applyYear: undefined,
    abstract: '',
    operationVideoUrl: '',
    videoCoverUrl: '',
    status: '0'
  }
}

function createEmptyTopicForm() {
  return {
    id: undefined,
    projectId: undefined,
    title: '',
    topicNo: '',
    leader: '',
    projectYear: undefined,
    source: '',
    abstract: '',
    status: '0'
  }
}

function createEmptyImportPreview() {
  return {
    summary: {
      total: 0,
      valid: 0,
      invalid: 0
    },
    rows: []
  }
}

const importTypeMeta = {
  paper: {
    label: '论文',
    columns: [
      { key: 'title', label: '论文标题' },
      { key: 'publishYear', label: '发表年份' },
      { key: 'keywords', label: '关键词' },
      { key: 'abstract', label: '摘要' },
      { key: 'isFeatured', label: '是否精选' },
      { key: 'status', label: '状态' }
    ]
  },
  patent: {
    label: '专利',
    columns: [
      { key: 'title', label: '专利名称' },
      { key: 'patentNo', label: '专利号' },
      { key: 'applicant', label: '申请人' },
      { key: 'applyYear', label: '申请年份' },
      { key: 'abstract', label: '摘要' },
      { key: 'status', label: '状态' }
    ]
  },
  topic: {
    label: '课题',
    columns: [
      { key: 'title', label: '课题名称' },
      { key: 'topicNo', label: '课题编号' },
      { key: 'leader', label: '负责人' },
      { key: 'projectYear', label: '立项年份' },
      { key: 'source', label: '来源' },
      { key: 'abstract', label: '摘要' },
      { key: 'status', label: '状态' }
    ]
  }
}

const importDialogTitle = computed(() => `${importTypeMeta[importType.value]?.label || ''}批量导入`)
const importColumns = computed(() => importTypeMeta[importType.value]?.columns || [])

function formatDateTime(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

function buildVideoCardStyle(coverUrl) {
  return {
    backgroundImage: coverUrl
      ? `linear-gradient(180deg, rgba(10, 17, 31, 0.16), rgba(10, 17, 31, 0.78)), url(${coverUrl})`
      : 'linear-gradient(135deg, #13233d 0%, #2b4c97 50%, #7ca6ff 100%)'
  }
}

function handlePatentVideoStatusChange(status) {
  patentVideoStatus.value = status
}

function syncPatentVideoStatusByForm() {
  patentVideoStatus.value = patentForm.value.operationVideoUrl ? 'success' : 'idle'
}

async function handleTabChange(name) {
  if (name === 'paper' && !paperList.value.length) {
    await getPaperList()
  }
  if (name === 'patent' && !patentList.value.length) {
    await getPatentList()
  }
  if (name === 'topic' && !topicList.value.length) {
    await getTopicList()
  }
}

async function getPaperList() {
  paperLoading.value = true
  try {
    const res = await pagePaper({
      pageNum: paperQueryParams.pageNum,
      pageSize: paperQueryParams.pageSize,
      title: paperQueryParams.title,
      publishYear: paperQueryParams.publishYear,
      isFeatured: paperQueryParams.isFeatured,
      status: paperQueryParams.status
    })

    paperList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
    paperTotal.value = Number(res?.data?.total || 0)
  } finally {
    paperLoading.value = false
  }
}

async function getPatentList() {
  patentLoading.value = true
  try {
    const res = await pagePatent({
      pageNum: patentQueryParams.pageNum,
      pageSize: patentQueryParams.pageSize,
      title: patentQueryParams.title,
      applyYear: patentQueryParams.applyYear,
      status: patentQueryParams.status
    })

    patentList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
    patentTotal.value = Number(res?.data?.total || 0)
  } finally {
    patentLoading.value = false
  }
}

async function getTopicList() {
  topicLoading.value = true
  try {
    const res = await pageTopic({
      pageNum: topicQueryParams.pageNum,
      pageSize: topicQueryParams.pageSize,
      title: topicQueryParams.title,
      projectYear: topicQueryParams.projectYear,
      status: topicQueryParams.status
    })

    topicList.value = Array.isArray(res?.data?.rows) ? res.data.rows : []
    topicTotal.value = Number(res?.data?.total || 0)
  } finally {
    topicLoading.value = false
  }
}

function handleQuery() {
  if (activeTab.value === 'paper') {
    paperQueryParams.pageNum = 1
    getPaperList()
    return
  }

  if (activeTab.value === 'patent') {
    patentQueryParams.pageNum = 1
    getPatentList()
    return
  }

  topicQueryParams.pageNum = 1
  getTopicList()
}

function resetQuery() {
  if (activeTab.value === 'paper') {
    paperQueryParams.title = ''
    paperQueryParams.publishYear = undefined
    paperQueryParams.isFeatured = ''
    paperQueryParams.status = ''
    paperQueryParams.pageNum = 1
    getPaperList()
    return
  }

  if (activeTab.value === 'patent') {
    patentQueryParams.title = ''
    patentQueryParams.applyYear = undefined
    patentQueryParams.status = ''
    patentQueryParams.pageNum = 1
    getPatentList()
    return
  }

  topicQueryParams.title = ''
  topicQueryParams.projectYear = undefined
  topicQueryParams.status = ''
  topicQueryParams.pageNum = 1
  getTopicList()
}

function handleAdd() {
  if (activeTab.value === 'paper') {
    paperForm.value = createEmptyPaperForm()
    paperDialogTitle.value = '新增论文'
    paperDialogVisible.value = true
    return
  }

  if (activeTab.value === 'patent') {
    patentForm.value = createEmptyPatentForm()
    patentDialogTitle.value = '新增专利'
    patentDialogVisible.value = true
    syncPatentVideoStatusByForm()
    return
  }

  topicForm.value = createEmptyTopicForm()
  topicDialogTitle.value = '新增课题'
  topicDialogVisible.value = true
}

async function handleUpdate(row) {
  if (activeTab.value === 'paper') {
    const res = await getPaperDetail(row.paperId)
    paperForm.value = {
      id: res.data?.id,
      paperId: res.data?.paperId,
      title: res.data?.title || '',
      publishYear: res.data?.publishYear,
      keywords: res.data?.keywords || '',
      abstract: res.data?.abstract || '',
      isFeatured: res.data?.isFeatured || '0',
      status: res.data?.status || '0'
    }
    paperDialogTitle.value = '编辑论文'
    paperDialogVisible.value = true
    return
  }

  if (activeTab.value === 'patent') {
    const res = await getPatentDetail(row.patentId)
    patentForm.value = {
      id: res.data?.id,
      patentId: res.data?.patentId,
      title: res.data?.title || '',
      patentNo: res.data?.patentNo || '',
      applicant: res.data?.applicant || '',
      applyYear: res.data?.applyYear,
      abstract: res.data?.abstract || '',
      operationVideoUrl: res.data?.operationVideoUrl || '',
      videoCoverUrl: res.data?.videoCoverUrl || '',
      status: res.data?.status || '0'
    }
    patentDialogTitle.value = '编辑专利'
    patentDialogVisible.value = true
    syncPatentVideoStatusByForm()
    return
  }

  const res = await getTopicDetail(row.projectId || row.topicId)
  topicForm.value = {
    id: res.data?.id,
    projectId: res.data?.projectId || res.data?.topicId,
    title: res.data?.title || '',
    topicNo: res.data?.topicNo || '',
    leader: res.data?.leader || '',
    projectYear: res.data?.projectYear,
    source: res.data?.source || '',
    abstract: res.data?.abstract || '',
    status: res.data?.status || '0'
  }
  topicDialogTitle.value = '编辑课题'
  topicDialogVisible.value = true
}

async function handleDelete(row) {
  const titleMap = {
    paper: row.title,
    patent: row.title,
    topic: row.title
  }
  const typeLabelMap = {
    paper: '论文',
    patent: '专利',
    topic: '课题'
  }

  try {
    await ElMessageBox.confirm(`是否确认删除${typeLabelMap[activeTab.value]}“${titleMap[activeTab.value]}”？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  if (activeTab.value === 'paper') {
    await deletePaper(row.paperId)
    ElMessage.success('删除成功')
    if (paperList.value.length === 1 && paperQueryParams.pageNum > 1) {
      paperQueryParams.pageNum -= 1
    }
    getPaperList()
    return
  }

  if (activeTab.value === 'patent') {
    await deletePatent(row.patentId)
    ElMessage.success('删除成功')
    if (patentList.value.length === 1 && patentQueryParams.pageNum > 1) {
      patentQueryParams.pageNum -= 1
    }
    getPatentList()
    return
  }

  await deleteTopic(row.projectId || row.topicId)
  ElMessage.success('删除成功')
  if (topicList.value.length === 1 && topicQueryParams.pageNum > 1) {
    topicQueryParams.pageNum -= 1
  }
  getTopicList()
}

async function handleToggleFeatured(row) {
  const nextValue = row.isFeatured === '1' ? '0' : '1'
  await updatePaperFeatured(row.paperId, { isFeatured: nextValue })
  ElMessage.success(nextValue === '1' ? '已设为精选论文' : '已取消精选')
  getPaperList()
}

function openImportDialog(type) {
  importType.value = type
  importFileName.value = ''
  importPreview.value = createEmptyImportPreview()
  importDialogVisible.value = true
}

async function handleDownloadTemplate() {
  const blob = await downloadImportTemplate(importType.value)
  const fileName = `${importTypeMeta[importType.value]?.label || '导入'}模板.xlsx`
  saveAs(blob, fileName)
}

function triggerImportFileSelect() {
  importFileInput.value?.click()
}

async function handleImportFileChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!file.name.toLowerCase().endsWith('.xlsx')) {
    ElMessage.error('仅支持上传 .xlsx 文件')
    return
  }

  importFileName.value = file.name
  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('type', importType.value)
    formData.append('file', file)
    const res = await previewImport(formData)
    importPreview.value = res.data || createEmptyImportPreview()
  } finally {
    importLoading.value = false
  }
}

async function handleConfirmImport() {
  importSubmitting.value = true
  try {
    const res = await confirmImport({
      type: importType.value,
      rows: importPreview.value.rows
    })
    const result = res.data || {}
    ElMessage.success(`导入完成：成功 ${result.successCount || 0} 条，失败 ${result.failCount || 0} 条`)
    importDialogVisible.value = false
    importPreview.value = createEmptyImportPreview()

    if (importType.value === 'paper') {
      getPaperList()
    } else if (importType.value === 'patent') {
      getPatentList()
    } else {
      getTopicList()
    }
  } finally {
    importSubmitting.value = false
  }
}

async function handleRemovePatentVideo() {
  try {
    await ElMessageBox.confirm('删除视频后将同步清空当前封面，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  patentForm.value.operationVideoUrl = ''
  patentForm.value.videoCoverUrl = ''
  patentVideoStatus.value = 'idle'
  ElMessage.success('已删除视频并清空封面')
}

function handleRemovePatentCover() {
  patentForm.value.videoCoverUrl = ''
  ElMessage.success('已删除封面')
}

function handleImportPlaceholder() {
  openImportDialog(activeTab.value)
}

function submitForm() {
  if (activeTab.value === 'paper') {
    paperFormRef.value.validate(async valid => {
      if (!valid) return

      submitLoading.value = true
      try {
        const payload = {
          id: paperForm.value.id,
          paperId: paperForm.value.paperId,
          title: paperForm.value.title,
          publishYear: paperForm.value.publishYear,
          keywords: paperForm.value.keywords,
          abstract: paperForm.value.abstract,
          isFeatured: paperForm.value.isFeatured,
          status: paperForm.value.status
        }

        if (paperForm.value.paperId) {
          await updatePaper(payload)
          ElMessage.success('修改成功')
        } else {
          await addPaper(payload)
          ElMessage.success('新增成功')
        }

        paperDialogVisible.value = false
        getPaperList()
      } finally {
        submitLoading.value = false
      }
    })
    return
  }

  if (activeTab.value === 'patent') {
    patentFormRef.value.validate(async valid => {
      if (!valid) return

      submitLoading.value = true
      try {
        const payload = {
          id: patentForm.value.id,
          patentId: patentForm.value.patentId,
          title: patentForm.value.title,
          patentNo: patentForm.value.patentNo,
          applicant: patentForm.value.applicant,
          applyYear: patentForm.value.applyYear,
          abstract: patentForm.value.abstract,
          operationVideoUrl: patentForm.value.operationVideoUrl,
          videoCoverUrl: patentForm.value.videoCoverUrl,
          status: patentForm.value.status
        }

        if (patentForm.value.patentId) {
          await updatePatent(payload)
          ElMessage.success('修改成功')
        } else {
          await addPatent(payload)
          ElMessage.success('新增成功')
        }

        patentDialogVisible.value = false
        getPatentList()
      } finally {
        submitLoading.value = false
      }
    })
    return
  }

  topicFormRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      const payload = {
        id: topicForm.value.id,
        projectId: topicForm.value.projectId,
        title: topicForm.value.title,
        topicNo: topicForm.value.topicNo,
        leader: topicForm.value.leader,
        projectYear: topicForm.value.projectYear,
        source: topicForm.value.source,
        abstract: topicForm.value.abstract,
        status: topicForm.value.status
      }

      if (topicForm.value.projectId) {
        await updateTopic(payload)
        ElMessage.success('修改成功')
      } else {
        await addTopic(payload)
        ElMessage.success('新增成功')
      }

      topicDialogVisible.value = false
      getTopicList()
    } finally {
      submitLoading.value = false
    }
  })
}

onMounted(() => {
  getPaperList()
})
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
}

.mb8 {
  margin-bottom: 16px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #6b7280;
}

.import-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.import-file-name {
  font-size: 12px;
  color: #6b7280;
}

.import-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.summary-card {
  padding: 16px;
  border-radius: 12px;
  background: #f6f8fb;
  border: 1px solid #e5e9f2;

  &.is-success {
    background: #f0f9f4;
    border-color: #c8e9d6;
  }

  &.is-danger {
    background: #fff3f0;
    border-color: #f4cec7;
  }

  strong {
    display: block;
    font-size: 24px;
    color: #1f3048;
  }
}

.summary-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
}

.error-copy {
  color: #d84b37;
}

.video-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.video-card,
.dialog-video-preview {
  position: relative;
  overflow: hidden;
  min-height: 104px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
}

.video-card-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 17, 31, 0.08), rgba(10, 17, 31, 0.78));
}

.video-card-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 104px;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px;
}

.video-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.dialog-video-preview {
  margin-top: 16px;
}

.hidden-file-input {
  display: none;
}
</style>
