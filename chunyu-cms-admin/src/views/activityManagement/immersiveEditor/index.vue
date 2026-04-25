<template>
  <div class="app-container immersive-editor">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="6" :lg="5">
        <el-card shadow="never" class="scene-list-card">
          <template #header>
            <div class="card-header">
              <div>
                <strong>场景列表</strong>
                <p>保留现有场景管理入口</p>
              </div>
              <el-button type="primary" :icon="Plus" circle @click="handleAddScene" />
            </div>
          </template>

          <div class="scene-list">
            <div
              v-for="scene in orderedSceneList"
              :key="scene.id"
              class="scene-item"
              :class="{ active: currentScene?.id === scene.id }"
              @click="handleSelectScene(scene)"
            >
              <el-image :src="scene.thumbnail || defaultThumbnail" fit="cover" class="scene-thumbnail">
                <template #error>
                  <div class="scene-thumb-placeholder">Scene</div>
                </template>
              </el-image>
              <div class="scene-info">
                <div class="scene-name-row">
                  <strong class="scene-name">{{ scene.name }}</strong>
                  <el-tag v-if="scene.isHeadline === '1'" size="small" type="danger">头条</el-tag>
                </div>
                <span class="scene-desc">{{ scene.description || '暂无描述' }}</span>
              </div>
              <div class="scene-footer">
                <el-tag size="small" :type="scene.status === '1' ? 'success' : 'info'">
                  {{ scene.status === '1' ? '已发布' : '草稿' }}
                </el-tag>
                <div class="scene-actions">
                  <el-button link type="primary" :icon="Edit" @click.stop="handleEditScene(scene)" />
                  <el-button link type="danger" :icon="Delete" @click.stop="handleDeleteScene(scene)" />
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="11" :lg="12">
        <el-card shadow="never" class="editor-card">
          <template #header>
            <div class="card-header">
              <div>
                <strong>沉浸式编辑</strong>
                <p>{{ currentScene?.name || '请选择左侧场景' }}</p>
              </div>
              <el-space wrap>
                <el-radio-group v-model="editMode" size="small">
                  <el-radio-button label="visual">可视化编排</el-radio-button>
                  <el-radio-button label="code">富文本模式</el-radio-button>
                </el-radio-group>
                <el-button size="small" :icon="View" @click="handlePreview">预览</el-button>
                <el-button size="small" type="primary" :icon="Check" @click="handleSave">保存</el-button>
              </el-space>
            </div>
          </template>

          <div class="editor-container" v-loading="loading">
            <el-empty v-if="!currentScene" description="请从左侧选择一个场景或创建新场景" />

            <template v-else-if="editMode === 'code'">
              <RichTextEditor v-model="htmlContent" :options="{ height: 620 }" />
            </template>

            <template v-else>
              <div class="editor-toolbar">
                <div class="toolbar-left">
                  <span class="toolbar-label">新增内容块</span>
                  <el-button
                    v-for="blockType in blockTypes"
                    :key="blockType.type"
                    size="small"
                    :icon="blockType.icon"
                    @click="handleAddBlock(blockType.type)"
                  >
                    {{ blockType.label }}
                  </el-button>
                </div>
                <div class="toolbar-right">
                  <span>{{ blocks.length }} 个块</span>
                  <span>统一 blocks 数据结构</span>
                </div>
              </div>

              <div class="editor-stage">
                <div class="stage-intro">
                  <div>
                    <strong>画布编排区</strong>
                    <p>文本和表格支持直接在画布编辑，图片和视频用右侧配置补充属性。</p>
                  </div>
                  <el-button size="small" plain @click="insertBlockAt(0, 'text')">在顶部插入文本</el-button>
                </div>

                <div v-if="!blocks.length" class="stage-empty">
                  <el-empty description="当前场景还没有内容块">
                    <template #default>
                      <el-space wrap>
                        <el-button type="primary" @click="handleAddBlock('text')">添加文本块</el-button>
                        <el-button @click="handleAddBlock('image')">添加图片块</el-button>
                        <el-button @click="handleAddBlock('table')">添加表格块</el-button>
                        <el-button @click="handleAddBlock('video')">添加视频块</el-button>
                      </el-space>
                    </template>
                  </el-empty>
                </div>

                <draggable
                  v-else
                  v-model="blocks"
                  item-key="id"
                  handle=".drag-handle"
                  ghost-class="ghost-block"
                  class="stage-list"
                  @end="onDragEnd"
                >
                  <template #item="{ element: block, index }">
                    <div class="stage-node-shell">
                      <div class="insert-slot" @click="insertBlockAt(index, 'text')">
                        <el-icon><Plus /></el-icon>
                        <span>在这里插入内容块</span>
                      </div>

                      <div
                        class="stage-node"
                        :class="{ active: currentBlock?.id === block.id }"
                        @click="handleSelectBlock(block)"
                      >
                        <div class="node-header">
                          <div class="node-header-left">
                            <div class="drag-handle" title="拖拽排序">
                              <el-icon><Rank /></el-icon>
                            </div>
                            <el-tag size="small" effect="plain">{{ typeLabelMap[block.type] }}</el-tag>
                            <span class="node-order">#{{ index + 1 }}</span>
                          </div>
                          <div class="node-actions">
                            <el-button size="small" :icon="Top" @click.stop="handleMoveBlock(index, 'up')" :disabled="index === 0" />
                            <el-button size="small" :icon="Bottom" @click.stop="handleMoveBlock(index, 'down')" :disabled="index === blocks.length - 1" />
                            <el-dropdown trigger="click" @command="(command) => insertBlockAt(index + 1, command)">
                              <el-button size="small" :icon="Plus" @click.stop="() => {}" />
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item v-for="type in blockTypes" :key="type.type" :command="type.type">
                                    插入{{ type.label }}块
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                            <el-button size="small" :icon="Delete" type="danger" @click.stop="handleDeleteBlock(block)" />
                          </div>
                        </div>

                        <ContentBlocks
                          :block="block"
                          :is-selected="currentBlock?.id === block.id"
                          :editable="true"
                          @select="handleSelectBlock(block)"
                          @update="(data) => handleBlockUpdate(block.id, data)"
                        />
                      </div>

                      <div v-if="index === blocks.length - 1" class="insert-slot tail" @click="insertBlockAt(blocks.length, 'text')">
                        <el-icon><Plus /></el-icon>
                        <span>在末尾继续添加内容块</span>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </template>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="7" :lg="7">
        <el-card shadow="never" class="property-card">
          <template #header>
            <div class="card-header">
              <div>
                <strong>属性配置</strong>
                <p>{{ currentBlock ? `当前块：${typeLabelMap[currentBlock.type]}` : '请选择中间画布中的块' }}</p>
              </div>
            </div>
          </template>

          <div class="property-panel">
            <el-empty v-if="!currentScene" description="请先选择场景" />
            <el-empty v-else-if="editMode !== 'visual'" description="富文本模式下不显示 blocks 属性面板" />
            <el-empty v-else-if="!currentBlock" description="请选择一个内容块进行配置" />

            <template v-else>
              <el-form label-width="86px" class="property-form">
                <el-divider content-position="left">基础配置</el-divider>
                <el-form-item label="块 ID">
                  <el-input :model-value="currentBlock.id" disabled />
                </el-form-item>
                <el-form-item label="块类型">
                  <el-tag>{{ typeLabelMap[currentBlock.type] }}</el-tag>
                </el-form-item>
                <el-form-item label="背景色">
                  <el-color-picker v-model="currentBlock.bgColor" show-alpha />
                </el-form-item>
                <el-form-item label="内边距">
                  <el-slider v-model="currentBlock.padding" :min="0" :max="64" show-input />
                </el-form-item>

                <template v-if="currentBlock.type === 'text'">
                  <el-divider content-position="left">文本属性</el-divider>
                  <el-form-item label="字体大小">
                    <el-slider v-model="currentBlock.config.fontSize" :min="12" :max="48" show-input />
                  </el-form-item>
                  <el-form-item label="文字颜色">
                    <el-color-picker v-model="currentBlock.config.color" />
                  </el-form-item>
                  <el-form-item label="对齐方式">
                    <el-radio-group v-model="currentBlock.config.align">
                      <el-radio-button label="left">左对齐</el-radio-button>
                      <el-radio-button label="center">居中</el-radio-button>
                      <el-radio-button label="right">右对齐</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="字重">
                    <el-switch v-model="currentBlock.config.bold" />
                  </el-form-item>
                  <el-form-item label="斜体">
                    <el-switch v-model="currentBlock.config.italic" />
                  </el-form-item>
                </template>

                <template v-else-if="currentBlock.type === 'image'">
                  <el-divider content-position="left">图片属性</el-divider>
                  <el-form-item label="图片上传">
                    <ImageUpload v-model="currentBlock.content" :limit="1" :is-show-tip="false" />
                  </el-form-item>
                  <el-form-item label="图片地址">
                    <el-input v-model="currentBlock.content" placeholder="也可以直接粘贴图片 URL" />
                  </el-form-item>
                  <el-form-item label="显示宽度">
                    <el-slider v-model="currentBlock.config.width" :min="20" :max="100" :step="5" show-input />
                  </el-form-item>
                  <el-form-item label="圆角">
                    <el-slider v-model="currentBlock.config.borderRadius" :min="0" :max="40" show-input />
                  </el-form-item>
                  <el-form-item label="图片描述">
                    <el-input v-model="currentBlock.config.alt" placeholder="图片 alt 描述" />
                  </el-form-item>
                </template>

                <template v-else-if="currentBlock.type === 'table'">
                  <el-divider content-position="left">表格属性</el-divider>
                  <el-form-item label="行数">
                    <el-input-number v-model="currentBlock.config.rows" :min="2" :max="12" @change="syncTableStructure" />
                  </el-form-item>
                  <el-form-item label="列数">
                    <el-input-number v-model="currentBlock.config.cols" :min="1" :max="8" @change="syncTableStructure" />
                  </el-form-item>
                  <el-form-item label="表头背景">
                    <el-color-picker v-model="currentBlock.config.headerBgColor" show-alpha />
                  </el-form-item>
                  <el-form-item label="边框颜色">
                    <el-color-picker v-model="currentBlock.config.borderColor" />
                  </el-form-item>
                  <el-form-item label="斑马纹">
                    <el-switch v-model="currentBlock.config.striped" />
                  </el-form-item>
                  <el-form-item label="批量编辑">
                    <el-input
                      v-model="tableContentText"
                      type="textarea"
                      :rows="8"
                      placeholder="每行一个数组，单元格使用英文逗号分隔"
                    />
                  </el-form-item>
                </template>

                <template v-else-if="currentBlock.type === 'video'">
                  <el-divider content-position="left">视频属性</el-divider>
                  <el-form-item label="视频上传">
                    <VideoUploader
                      ref="videoUploaderRef"
                      v-model="currentBlock.content"
                      v-model:cover="currentBlock.config.cover"
                      :status="currentBlock.config.uploadStatus"
                      @status-change="(status) => currentBlock.config.uploadStatus = status"
                    />
                  </el-form-item>
                  <el-form-item label="抽帧秒数">
                    <div class="video-cover-tools">
                      <el-input-number v-model="currentBlock.config.coverTime" :min="0" :step="0.1" :precision="1" />
                      <el-button @click="handleExtractVideoCover">重新提取</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="视频标题">
                    <el-input v-model="currentBlock.config.title" placeholder="用于视频卡片展示标题" />
                  </el-form-item>
                  <el-form-item label="手动封面">
                    <ImageUpload v-model="currentBlock.config.cover" :limit="1" :is-show-tip="false" />
                  </el-form-item>
                  <el-form-item label="封面地址">
                    <el-input v-model="currentBlock.config.cover" placeholder="也可以直接粘贴封面 URL" />
                  </el-form-item>
                  <el-form-item label="上传状态">
                    <el-tag :type="videoStatusTagType(currentBlock.config.uploadStatus)">
                      {{ videoStatusText(currentBlock.config.uploadStatus) }}
                    </el-tag>
                  </el-form-item>
                  <el-form-item label="自动播放">
                    <el-switch v-model="currentBlock.config.autoplay" />
                  </el-form-item>
                  <el-form-item label="循环播放">
                    <el-switch v-model="currentBlock.config.loop" />
                  </el-form-item>
                  <el-form-item label="显示控件">
                    <el-switch v-model="currentBlock.config.controls" />
                  </el-form-item>
                </template>
              </el-form>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="sceneDialogVisible" :title="sceneForm.id ? '编辑场景' : '添加场景'" width="520px" append-to-body>
      <el-form ref="sceneFormRef" :model="sceneForm" :rules="sceneRules" label-width="80px">
        <el-form-item label="场景名称" prop="name">
          <el-input v-model="sceneForm.name" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="场景描述">
          <el-input v-model="sceneForm.description" type="textarea" :rows="3" placeholder="请输入场景描述" />
        </el-form-item>
        <el-form-item label="缩略图">
          <ImageUpload v-model="sceneForm.thumbnail" :limit="1" :is-show-tip="false" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="sceneForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="sceneForm.status">
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设为头条">
          <el-switch v-model="sceneForm.isHeadline" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sceneDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitScene">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="沉浸式预览" width="90%" append-to-body fullscreen>
      <div class="preview-container">
        <div class="preview-header">
          <h2>{{ currentScene?.name }}</h2>
          <p>{{ currentScene?.description }}</p>
        </div>
        <div v-if="editMode === 'visual'">
          <div v-for="block in blocks" :key="block.id" class="preview-block">
            <ContentBlocks :block="block" :is-preview="true" />
          </div>
        </div>
        <div v-else class="preview-html" v-html="htmlContent"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="ActivityManagementImmersiveEditorIndex">
import { Bottom, Check, Delete, Edit, Plus, Rank, Top, View } from '@element-plus/icons-vue'
import { Document, Grid, Picture, VideoCamera } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import ContentBlocks from '@/components/ContentBlocks/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import RichTextEditor from '@/components/RichTextEditor/index.vue'
import VideoUploader from '@/components/VideoUploader/index.vue'
import { addActivity, delActivity, listActivity, updateActivity } from '@/api/activityManagement/activity'
import { compareActivitiesHeadlineFirst } from '../utils/headline'
import {
  addBlock as addBlockItem,
  getBlockById as getBlockByIdFromList,
  moveBlock as moveBlockItem,
  removeBlock as removeBlockItem,
  updateBlock as updateBlockItem
} from './utils/blockUtils'
import { buildSceneContentPayload, normalizeScene, parseSceneBlocks } from './utils/scenePersistence'

const loading = ref(false)
const currentScene = ref(null)
const currentBlock = ref(null)
const blocks = ref([])
const sceneList = ref([])
const htmlContent = ref('')
const editMode = ref('visual')
const previewVisible = ref(false)
const sceneDialogVisible = ref(false)
const sceneFormRef = ref(null)
const videoUploaderRef = ref(null)
const defaultThumbnail = 'https://picsum.photos/480/320?grayscale'

const sceneForm = ref({
  id: undefined,
  name: '',
  description: '',
  thumbnail: '',
  sort: 0,
  status: '0',
  isHeadline: '0'
})

function buildSceneForm(scene = {}) {
  return {
    id: scene.id ?? scene.activityId,
    name: scene.name ?? '',
    description: scene.description ?? '',
    thumbnail: scene.thumbnail ?? '',
    sort: Number(scene.sort ?? 0),
    status: scene.status ?? '0',
    isHeadline: scene.isHeadline ?? '0'
  }
}

const sceneRules = {
  name: [{ required: true, message: '场景名称不能为空', trigger: 'blur' }]
}

const blockTypes = [
  { type: 'text', label: '文本', icon: Document },
  { type: 'image', label: '图片', icon: Picture },
  { type: 'table', label: '表格', icon: Grid },
  { type: 'video', label: '视频', icon: VideoCamera }
]

const typeLabelMap = {
  text: '文本块',
  image: '图片块',
  table: '表格块',
  video: '视频块'
}

const orderedSceneList = computed(() => [...sceneList.value].sort(compareActivitiesHeadlineFirst))

const tableContentText = computed({
  get() {
    if (currentBlock.value?.type !== 'table') return ''
    return (currentBlock.value.content || []).map((row) => row.join(',')).join('\n')
  },
  set(value) {
    if (currentBlock.value?.type !== 'table') return
    const rows = value
      .split('\n')
      .map((line) => line.split(',').map((item) => item.trim()))
      .filter((row) => row.some(Boolean))
    if (!rows.length) return
    currentBlock.value.content = normalizeTable(rows, currentBlock.value.config.rows, currentBlock.value.config.cols)
  }
})

function baseBlock(type) {
  const block = {
    id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    sort: blocks.value.length,
    bgColor: '#ffffff',
    padding: 20,
    content: '',
    config: {}
  }

  if (type === 'text') {
    block.content = '<p>请输入正文内容</p>'
    block.config = { fontSize: 16, color: '#223047', align: 'left', bold: false, italic: false, lineHeight: '1.8' }
  }

  if (type === 'image') {
    block.content = ''
    block.config = { width: 100, borderRadius: 16, alt: '', align: 'center' }
  }

  if (type === 'table') {
    block.config = { rows: 4, cols: 3, headerBgColor: '#f3f6fb', borderColor: '#d7dfeb', striped: true }
    block.content = createTableMatrix(block.config.rows, block.config.cols)
  }

  if (type === 'video') {
    block.content = ''
    block.config = { title: '', cover: '', coverTime: 0.1, autoplay: false, loop: false, controls: true, uploadStatus: 'idle' }
  }

  return block
}

function createTableMatrix(rows, cols) {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => (rowIndex === 0 ? `表头${colIndex + 1}` : `内容${rowIndex}-${colIndex + 1}`))
  )
}

function normalizeTable(content, rows, cols) {
  const safeRows = Number(rows || 2)
  const safeCols = Number(cols || 1)
  const next = Array.from({ length: safeRows }, (_, rowIndex) =>
    Array.from({ length: safeCols }, (_, colIndex) => {
      const value = Array.isArray(content?.[rowIndex]) ? content[rowIndex][colIndex] : undefined
      if (value !== undefined && value !== null && value !== '') return value
      return rowIndex === 0 ? `表头${colIndex + 1}` : ''
    })
  )
  return next
}

function normalizeBlock(block, index) {
  const nextBlock = {
    ...baseBlock(block.type || 'text'),
    ...block,
    sort: index
  }
  nextBlock.config = { ...baseBlock(block.type || 'text').config, ...(block.config || {}) }

  if (nextBlock.type === 'table') {
    const legacyTable = typeof block.tableData === 'string' ? block.tableData.split('\n').map((line) => line.split(',').map((cell) => cell.trim())) : null
    nextBlock.content = normalizeTable(Array.isArray(block.content) ? block.content : legacyTable, nextBlock.config.rows, nextBlock.config.cols)
  }

  if (nextBlock.type !== 'table' && Array.isArray(nextBlock.content)) {
    nextBlock.content = ''
  }

  return nextBlock
}

async function loadSceneList() {
  try {
    const res = await listActivity({ pageNum: 1, pageSize: 100 })
    const rows = Array.isArray(res?.data?.rows) ? res.data.rows : []
    if (res.code === 200) {
      sceneList.value = rows.map((scene) => normalizeScene(scene))
    } else {
      sceneList.value = []
    }
  } catch (error) {
    sceneList.value = [
      {
        id: 1,
        name: '中医药文化展',
        description: '沉浸式体验中医药文化',
        thumbnail: 'https://picsum.photos/480/320?random=21',
        status: '1',
        sort: 1,
        isHeadline: '0'
      },
      {
        id: 2,
        name: '本草数字展台',
        description: '图文混排和视频讲解演示场景',
        thumbnail: 'https://picsum.photos/480/320?random=22',
        status: '0',
        sort: 2,
        isHeadline: '0'
      }
    ]
  }

  if (sceneList.value.length && !currentScene.value) {
    handleSelectScene(orderedSceneList.value[0])
  }
}

function handleSelectScene(scene) {
  loading.value = true
  currentScene.value = normalizeScene(scene)

  setTimeout(() => {
    let nextBlocks = parseSceneBlocks(currentScene.value.content_blocks)

    if (!nextBlocks.length) {
      nextBlocks = [
        {
          ...baseBlock('text'),
          content: '<h2>欢迎进入沉浸式图文编排</h2><p>这里已经不是简单的区块列表，而是更接近所见即所得的内容画布。</p>'
        },
        {
          ...baseBlock('image'),
          content: 'https://picsum.photos/1200/680?random=40',
          config: { width: 100, borderRadius: 18, alt: '默认示例图', align: 'center' }
        },
        {
          ...baseBlock('video'),
          config: {
            title: '馆藏讲解视频',
            cover: 'https://picsum.photos/960/540?random=41',
            coverTime: 0.1,
            autoplay: false,
            loop: false,
            controls: true,
            uploadStatus: 'success'
          }
        }
      ]
    }

    blocks.value = nextBlocks.map((block, index) => normalizeBlock(block, index))
    htmlContent.value = currentScene.value.content_html || ''
    currentBlock.value = blocks.value[0] || null
    loading.value = false
  }, 240)
}

function handleAddScene() {
  sceneForm.value = buildSceneForm({ sort: sceneList.value.length })
  sceneDialogVisible.value = true
}

function handleEditScene(scene) {
  sceneForm.value = buildSceneForm(scene)
  sceneDialogVisible.value = true
}

async function handleDeleteScene(scene) {
  try {
    await ElMessageBox.confirm(`确认删除场景「${scene.name}」？`, '提示', { type: 'warning' })
    await delActivity(scene.id)
  } catch (error) {
    if (error === 'cancel') return
  }

  sceneList.value = sceneList.value.filter((item) => item.id !== scene.id)
  if (currentScene.value?.id === scene.id) {
    currentScene.value = null
    currentBlock.value = null
    blocks.value = []
  }
  ElMessage.success('场景已删除')
}

async function submitScene() {
  await sceneFormRef.value.validate()
  const scenePayload = buildSceneForm(sceneForm.value)

  if (scenePayload.id) {
    await updateActivity(scenePayload)
    const index = sceneList.value.findIndex((scene) => scene.id === scenePayload.id)
    if (index > -1) {
      sceneList.value[index] = normalizeScene({ ...sceneList.value[index], ...scenePayload })
    }
  } else {
    const res = await addActivity(scenePayload)
    const newScene = normalizeScene({
      ...scenePayload,
      ...(res?.data || {})
    })
    sceneList.value.push(newScene)
    if (!currentScene.value) {
      currentScene.value = newScene
    }
  }

  sceneDialogVisible.value = false
  ElMessage.success(scenePayload.id ? '场景已更新' : '场景已创建')
  if (!currentScene.value) {
    handleSelectScene(orderedSceneList.value[0])
  }
}

function handleSelectBlock(block) {
  currentBlock.value = block
}

function insertBlockAt(index, type) {
  const result = addBlockItem(blocks.value, type, index, currentBlock.value?.id || null)
  blocks.value = result.blocks
  currentBlock.value = getBlockByIdFromList(blocks.value, result.selectedBlockId)
}

function handleAddBlock(type) {
  insertBlockAt(blocks.value.length, type)
}

async function handleDeleteBlock(block) {
  try {
    await ElMessageBox.confirm('确认删除该内容块？', '提示', { type: 'warning' })
  } catch (error) {
    return
  }

  const index = blocks.value.findIndex((item) => item.id === block.id)
  if (index === -1) return
  const result = removeBlockItem(blocks.value, block.id, currentBlock.value?.id || null)
  blocks.value = result.blocks
  currentBlock.value = getBlockByIdFromList(blocks.value, result.selectedBlockId)
}

function handleMoveBlock(index, direction) {
  const result = moveBlockItem(blocks.value, index, direction, currentBlock.value?.id || null)
  blocks.value = result.blocks
  currentBlock.value = getBlockByIdFromList(blocks.value, result.selectedBlockId)
}

function updateBlockSorts() {
  blocks.value = blocks.value.map((block, index) => normalizeBlock(block, index))
  if (currentBlock.value) {
    currentBlock.value = getBlockByIdFromList(blocks.value, currentBlock.value.id)
  }
}

function onDragEnd() {
  updateBlockSorts()
}

function handleBlockUpdate(blockId, patch) {
  const result = updateBlockItem(blocks.value, blockId, patch, currentBlock.value?.id || null)
  blocks.value = result.blocks
  currentBlock.value = getBlockByIdFromList(blocks.value, result.selectedBlockId)
}

function syncTableStructure() {
  if (currentBlock.value?.type !== 'table') return
  currentBlock.value.content = normalizeTable(
    currentBlock.value.content,
    currentBlock.value.config.rows,
    currentBlock.value.config.cols
  )
}

async function handleExtractVideoCover() {
  if (currentBlock.value?.type !== 'video' || !currentBlock.value.content) {
    ElMessage.warning('请先上传视频')
    return
  }

  const seconds = Number(currentBlock.value.config.coverTime || 0)
  try {
    await videoUploaderRef.value?.extractCoverAt(seconds)
  } catch (error) {
    console.error(error)
  }
}

function handlePreview() {
  if (editMode.value === 'visual' && !blocks.value.length) {
    ElMessage.warning('请先添加内容块')
    return
  }
  if (editMode.value === 'code' && !htmlContent.value) {
    ElMessage.warning('请先输入富文本内容')
    return
  }
  previewVisible.value = true
}

async function handleSave() {
  if (!currentScene.value) {
    ElMessage.warning('请先选择场景')
    return
  }

  const payload = buildSceneContentPayload(currentScene.value, blocks.value, htmlContent.value)

  await updateActivity(payload)

  currentScene.value = normalizeScene({ ...currentScene.value, ...payload })
  const target = sceneList.value.find((scene) => scene.id === currentScene.value.id)
  if (target) Object.assign(target, currentScene.value)
  ElMessage.success('沉浸式内容已保存')
}

function videoStatusTagType(status) {
  const map = { idle: 'info', uploading: 'warning', processing: 'warning', success: 'success', error: 'danger' }
  return map[status] || 'info'
}

function videoStatusText(status) {
  const map = { idle: '未上传', uploading: '上传中', processing: '处理中', success: '成功', error: '失败' }
  return map[status] || '未上传'
}

onMounted(() => {
  loadSceneList()
})
</script>

<style lang="scss" scoped>
.immersive-editor {
  .scene-list-card,
  .editor-card,
  .property-card {
    height: calc(100vh - 118px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  strong {
    display: block;
    font-size: 16px;
    color: #1d2d44;
  }

  p {
    margin: 6px 0 0;
    font-size: 12px;
    color: #7d8ba1;
  }
}

.scene-list-card {
  :deep(.el-card__body) {
    height: calc(100% - 72px);
    padding: 16px;
  }
}

.scene-list {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scene-item {
  padding: 12px;
  border-radius: 18px;
  border: 1px solid #e2e8f2;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  cursor: pointer;
  transition: 0.24s ease;

  &:hover,
  &.active {
    border-color: #8fb0ff;
    box-shadow: 0 12px 28px rgba(51, 91, 173, 0.12);
    transform: translateY(-1px);
  }
}

.scene-thumbnail,
.scene-thumb-placeholder {
  width: 100%;
  height: 112px;
  border-radius: 14px;
}

.scene-thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dae6fb 0%, #eef3fb 100%);
  color: #5570a8;
}

.scene-info {
  margin-top: 10px;
}

.scene-name {
  display: block;
  font-size: 14px;
  color: #1f3048;
}

.scene-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scene-desc {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #7d8ba1;
  line-height: 1.6;
}

.scene-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scene-actions {
  display: flex;
  gap: 4px;
}

.editor-card,
.property-card {
  :deep(.el-card__body) {
    height: calc(100% - 72px);
  }
}

.editor-container {
  height: 100%;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #eef2f7;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 13px;
  color: #617189;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #7d8ba1;
}

.editor-stage {
  height: calc(100% - 64px);
  overflow-y: auto;
  padding-right: 6px;
}

.stage-intro {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #eff5ff 0%, #f7fbff 100%);
  border: 1px solid #d9e5fb;

  strong {
    color: #203047;
  }

  p {
    margin: 6px 0 0;
    font-size: 12px;
    color: #71839c;
  }
}

.stage-empty {
  margin-top: 18px;
  padding: 24px 0;
  border-radius: 20px;
  background: #fbfcfe;
}

.stage-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.stage-node-shell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insert-slot {
  height: 34px;
  border: 1px dashed #cad7eb;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #7b8aa3;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    border-color: #7ea2ff;
    color: #3f6eff;
    background: #f4f8ff;
  }

  &.tail {
    margin-top: 2px;
  }
}

.stage-node {
  border-radius: 22px;
  border: 1px solid #e3eaf4;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
  padding: 14px;
  transition: 0.24s ease;

  &:hover,
  &.active {
    border-color: #7ea2ff;
    box-shadow: 0 18px 40px rgba(47, 82, 161, 0.1);
  }
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.node-header-left,
.node-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-order {
  font-size: 12px;
  color: #8190a7;
}

.drag-handle {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2f6fb;
  color: #66788f;
  cursor: grab;
}

.ghost-block {
  opacity: 0.55;
}

.property-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 6px;
}

.property-form {
  padding-bottom: 24px;
}

.video-cover-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-container {
  height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 20px 32px 48px;
  background: #f6f8fb;
}

.preview-header {
  max-width: 960px;
  margin: 0 auto 24px;

  h2 {
    margin: 0;
    font-size: 28px;
    color: #1c2e47;
  }

  p {
    margin: 10px 0 0;
    color: #71839c;
  }
}

.preview-block {
  max-width: 960px;
  margin: 0 auto 18px;
}

.preview-html {
  max-width: 960px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 32px;
}

@media (max-width: 991px) {
  .immersive-editor {
    .scene-list-card,
    .editor-card,
    .property-card {
      height: auto;
      margin-bottom: 16px;
    }
  }

  .editor-container,
  .property-panel,
  .editor-stage {
    height: auto;
  }

  .editor-toolbar,
  .stage-intro,
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
