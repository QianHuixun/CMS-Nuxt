<template>
  <div class="app-container immersive-editor">
    <el-row :gutter="20">
      <!-- 左侧：场景列表 -->
      <el-col :span="5">
        <el-card shadow="never" class="scene-list-card">
          <template #header>
            <div class="card-header">
              <span>场景列表</span>
              <el-button type="primary" size="small" icon="Plus" circle @click="handleAddScene" />
            </div>
          </template>
          
          <el-scrollbar height="calc(100vh - 280px)">
            <div
              v-for="scene in sceneList"
              :key="scene.id"
              class="scene-item"
              :class="{ active: currentScene?.id === scene.id }"
              @click="handleSelectScene(scene)"
            >
              <el-image :src="scene.thumbnail" fit="cover" class="scene-thumbnail" />
              <div class="scene-info">
                <span class="scene-name">{{ scene.name }}</span>
                <span class="scene-status">
                  <el-tag size="small" :type="scene.status === 'published' ? 'success' : 'info'">
                    {{ scene.status === 'published' ? '已发布' : '草稿' }}
                  </el-tag>
                </span>
              </div>
              <div class="scene-actions">
                <el-button link type="primary" icon="Edit" @click.stop="handleEditScene(scene)" />
                <el-button link type="danger" icon="Delete" @click.stop="handleDeleteScene(scene)" />
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>

      <!-- 中间：编辑器区域 -->
      <el-col :span="12">
        <el-card shadow="never" class="editor-card">
          <template #header>
            <div class="card-header">
              <span>沉浸式编辑 - {{ currentScene?.name || '未选择场景' }}</span>
              <el-space>
                <el-button size="small" icon="View" @click="handlePreview">预览</el-button>
                <el-button size="small" type="primary" icon="Check" @click="handleSave">保存</el-button>
              </el-space>
            </div>
          </template>

          <div class="editor-container">
            <el-empty v-if="!currentScene" description="请从左侧选择一个场景或创建新场景" />
            
            <div v-else class="block-list">
              <!-- 场景区块列表 -->
              <div v-for="(block, index) in blocks" :key="block.id" class="block-item" :class="{ active: currentBlock?.id === block.id }" @click="handleSelectBlock(block)">
                <div class="block-drag-handle">
                  <el-icon><Rank /></el-icon>
                </div>
                <div class="block-content">
                  <el-icon :size="24" :color="block.color">
                    <component :is="block.icon" />
                  </el-icon>
                  <span class="block-name">{{ block.name }}</span>
                  <span class="block-type">{{ block.typeLabel }}</span>
                </div>
                <div class="block-actions">
                  <el-button link type="primary" icon="Top" @click.stop="handleMoveBlock(index, 'up')" :disabled="index === 0" />
                  <el-button link type="primary" icon="Bottom" @click.stop="handleMoveBlock(index, 'down')" :disabled="index === blocks.length - 1" />
                  <el-button link type="danger" icon="Delete" @click.stop="handleDeleteBlock(block)" />
                </div>
              </div>

              <!-- 添加区块按钮 -->
              <div class="add-block-area" @click="showBlockDialog = true">
                <el-icon><Plus /></el-icon>
                <span>添加内容区块</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：属性配置 -->
      <el-col :span="7">
        <el-card shadow="never" class="property-card">
          <template #header>
            <div class="card-header">
              <span>属性配置</span>
            </div>
          </template>

          <el-empty v-if="!currentBlock" description="请选择一个区块进行配置" />

          <el-form v-else label-width="80px" size="default">
            <el-divider content-position="left">基本信息</el-divider>
            
            <el-form-item label="区块名称">
              <el-input v-model="currentBlock.name" placeholder="请输入区块名称" />
            </el-form-item>

            <el-form-item label="区块类型">
              <el-select v-model="currentBlock.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="图文" value="image-text" />
                <el-option label="视频" value="video" />
                <el-option label="音频" value="audio" />
                <el-option label="3D模型" value="3d" />
                <el-option label="交互" value="interactive" />
              </el-select>
            </el-form-item>

            <el-divider content-position="left">样式配置</el-divider>

            <el-form-item label="背景色">
              <el-color-picker v-model="currentBlock.bgColor" show-alpha />
            </el-form-item>

            <el-form-item label="文字颜色">
              <el-color-picker v-model="currentBlock.textColor" />
            </el-form-item>

            <el-form-item label="内边距">
              <el-slider v-model="currentBlock.padding" :min="0" :max="100" show-input />
            </el-form-item>

            <el-form-item label="动画效果">
              <el-select v-model="currentBlock.animation" placeholder="请选择动画" style="width: 100%">
                <el-option label="无" value="none" />
                <el-option label="淡入" value="fadeIn" />
                <el-option label="滑入" value="slideIn" />
                <el-option label="缩放" value="scaleIn" />
              </el-select>
            </el-form-item>

            <el-form-item label="动画时长">
              <el-input-number v-model="currentBlock.animationDuration" :min="0" :max="3000" :step="100" /> ms
            </el-form-item>

            <el-divider content-position="left">交互配置</el-divider>

            <el-form-item label="可点击">
              <el-switch v-model="currentBlock.clickable" />
            </el-form-item>

            <el-form-item label="点击事件" v-if="currentBlock.clickable">
              <el-select v-model="currentBlock.clickAction" placeholder="请选择事件" style="width: 100%">
                <el-option label="跳转链接" value="link" />
                <el-option label="弹出内容" value="popup" />
                <el-option label="切换区块" value="switch" />
              </el-select>
            </el-form-item>

            <el-form-item label="跳转链接" v-if="currentBlock.clickAction === 'link'">
              <el-input v-model="currentBlock.linkUrl" placeholder="请输入链接地址" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加场景弹窗 -->
    <el-dialog v-model="sceneDialogVisible" title="添加场景" width="500px" append-to-body>
      <el-form ref="sceneFormRef" :model="sceneForm" :rules="sceneRules" label-width="80px">
        <el-form-item label="场景名称" prop="name">
          <el-input v-model="sceneForm.name" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="场景描述">
          <el-input v-model="sceneForm.description" type="textarea" :rows="3" placeholder="请输入场景描述" />
        </el-form-item>
        <el-form-item label="缩略图">
          <el-input v-model="sceneForm.thumbnail" placeholder="请输入缩略图URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sceneDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitScene">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 添加区块弹窗 -->
    <el-dialog v-model="showBlockDialog" title="添加区块" width="500px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="8" v-for="blockType in blockTypes" :key="blockType.type">
          <div class="block-type-item" @click="handleAddBlock(blockType)">
            <el-icon :size="40" :color="blockType.color">
              <component :is="blockType.icon" />
            </el-icon>
            <span>{{ blockType.label }}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="沉浸式预览" width="90%" fullscreen>
      <div class="preview-container">
        <div v-for="block in blocks" :key="block.id" class="preview-block" :style="{ backgroundColor: block.bgColor, color: block.textColor }">
          <span>{{ block.name }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="ActivityManagementImmersiveEditorIndex">
import { Plus, Rank, Top, Bottom } from '@element-plus/icons-vue'
import { Picture, VideoCamera, Headset,Box,Pointer,Link,Star } from '@element-plus/icons-vue'

const currentScene = ref(null)
const currentBlock = ref(null)
const blocks = ref([])
const sceneDialogVisible = ref(false)
const showBlockDialog = ref(false)
const previewVisible = ref(false)
const sceneFormRef = ref(null)

const sceneForm = ref({
  name: '',
  description: '',
  thumbnail: ''
})

const sceneRules = {
  name: [{ required: true, message: '场景名称不能为空', trigger: 'blur' }]
}

// 场景列表
const sceneList = ref([
  { id: 1, name: '中医药文化展', description: '沉浸式体验中医药文化', thumbnail: 'https://picsum.photos/200/150?random=10', status: 'published' },
  { id: 2, name: '本草纲目数字展', description: '数字化展示本草纲目', thumbnail: 'https://picsum.photos/200/150?random=11', status: 'draft' },
  { id: 3, name: '针灸发展史', description: '针灸发展历程展示', thumbnail: 'https://picsum.photos/200/150?random=12', status: 'draft' }
])

const blockTypes = [
  { type: 'image-text', label: '图文', icon: Picture, color: '#409EFF' },
  { type: 'video', label: '视频', icon: VideoCamera, color: '#67C23A' },
  { type: 'audio', label: '音频', icon: Headset, color: '#E6A23C' },
  { type: '3d', label: '3D模型', icon: Box, color: '#F56C6C' },
  { type: 'interactive', label: '交互', icon: Pointer, color: '#909399' }
]

const typeLabelMap = {
  'image-text': '图文',
  'video': '视频',
  'audio': '音频',
  '3d': '3D模型',
  'interactive': '交互'
}

function handleSelectScene(scene) {
  currentScene.value = scene
  // 模拟加载区块数据
  blocks.value = [
    { id: 1, name: '欢迎区', type: 'image-text', typeLabel: '图文', icon: Picture, bgColor: '#f0f9eb', textColor: '#606266', padding: 20, animation: 'fadeIn', animationDuration: 500, clickable: false, clickAction: '', linkUrl: '' },
    { id: 2, name: '视频介绍', type: 'video', typeLabel: '视频', icon: VideoCamera, bgColor: '#fef0f0', textColor: '#606266', padding: 20, animation: 'slideIn', animationDuration: 800, clickable: true, clickAction: 'popup', linkUrl: '' }
  ]
  currentBlock.value = null
}

function handleAddScene() {
  sceneForm.value = { name: '', description: '', thumbnail: '' }
  sceneDialogVisible.value = true
}

function handleEditScene(scene) {
  sceneForm.value = { ...scene }
  sceneDialogVisible.value = true
}

function handleDeleteScene(scene) {
  ElMessageBox.confirm(`是否确认删除场景"${scene.name}"？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    sceneList.value = sceneList.value.filter(s => s.id !== scene.id)
    if (currentScene.value?.id === scene.id) {
      currentScene.value = null
      blocks.value = []
    }
  })
}

function submitScene() {
  sceneFormRef.value.validate(valid => {
    if (valid) {
      const id = sceneForm.value.id || Date.now()
      if (sceneForm.value.id) {
        const index = sceneList.value.findIndex(s => s.id === sceneForm.value.id)
        sceneList.value[index] = { ...sceneForm.value }
      } else {
        sceneList.value.push({ ...sceneForm.value, id, status: 'draft' })
      }
      ElMessage.success(sceneForm.value.id ? '修改成功' : '添加成功')
      sceneDialogVisible.value = false
    }
  })
}

function handleSelectBlock(block) {
  currentBlock.value = block
}

function handleAddBlock(blockType) {
  const newBlock = {
    id: Date.now(),
    name: `新${blockType.label}区块`,
    type: blockType.type,
    typeLabel: blockType.label,
    icon: blockType.icon,
    bgColor: '#ffffff',
    textColor: '#303133',
    padding: 20,
    animation: 'none',
    animationDuration: 500,
    clickable: false,
    clickAction: '',
    linkUrl: ''
  }
  blocks.value.push(newBlock)
  currentBlock.value = newBlock
  showBlockDialog.value = false
  ElMessage.success('区块添加成功')
}

function handleDeleteBlock(block) {
  ElMessageBox.confirm(`是否确认删除区块"${block.name}"？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    blocks.value = blocks.value.filter(b => b.id !== block.id)
    if (currentBlock.value?.id === block.id) {
      currentBlock.value = null
    }
    ElMessage.success('删除成功')
  })
}

function handleMoveBlock(index, direction) {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  const temp = blocks.value[index]
  blocks.value[index] = blocks.value[newIndex]
  blocks.value[newIndex] = temp
}

function handlePreview() {
  if (!blocks.value.length) {
    ElMessage.warning('请先添加内容区块')
    return
  }
  previewVisible.value = true
}

function handleSave() {
  if (!currentScene.value) {
    ElMessage.warning('请先选择或创建场景')
    return
  }
  ElMessage.success('保存成功')
}

onMounted(() => {
  if (sceneList.value.length) {
    handleSelectScene(sceneList.value[0])
  }
})
</script>

<style lang="scss" scoped>
.immersive-editor {
  .scene-list-card, .editor-card, .property-card {
    height: calc(100vh - 120px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scene-list-card {
  .scene-item {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    background: #f5f7fa;
    
    &:hover, &.active {
      background: #ecf5ff;
      box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
    }
    
    .scene-thumbnail {
      width: 100%;
      height: 80px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    
    .scene-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .scene-name {
        font-weight: 500;
        color: #303133;
      }
    }
    
    .scene-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 8px;
    }
  }
}

.editor-card {
  .editor-container {
    min-height: 400px;
  }
  
  .block-list {
    .block-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: #f5f7fa;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover, &.active {
        background: #ecf5ff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
      }
      
      .block-drag-handle {
        margin-right: 12px;
        cursor: move;
        color: #909399;
      }
      
      .block-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .block-name {
          font-weight: 500;
          color: #303133;
        }
        
        .block-type {
          font-size: 12px;
          color: #909399;
        }
      }
      
      .block-actions {
        display: flex;
        gap: 4px;
      }
    }
    
    .add-block-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px;
      border: 2px dashed #dcdfe6;
      border-radius: 8px;
      color: #909399;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409EFF;
        color: #409EFF;
      }
    }
  }
}

.block-type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #ecf5ff;
    transform: scale(1.05);
  }
  
  span {
    margin-top: 8px;
    font-size: 13px;
    color: #606266;
  }
}

.preview-container {
  height: 80vh;
  overflow-y: auto;
  
  .preview-block {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
  }
}
</style>
