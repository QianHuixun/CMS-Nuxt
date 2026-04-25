<template>
  <div class="content-block" :class="[`block-${block.type}`, { 'is-preview': isPreview, 'is-selected': isSelected }]" :style="blockStyle" @click.stop="emit('select')">
    <template v-if="block.type === 'text'">
      <div
        class="text-content"
        :style="textStyle"
        :contenteditable="editable"
        :data-placeholder="editable ? '输入正文内容' : ''"
        @input="handleTextInput"
        v-html="displayTextContent"
      ></div>
    </template>

    <template v-else-if="block.type === 'image'">
      <div class="image-content" :style="imageWrapStyle">
        <el-image
          v-if="block.content"
          :src="block.content"
          :style="imageStyle"
          fit="cover"
          :alt="block.config?.alt || ''"
          :preview-src-list="isPreview ? [block.content] : []"
        >
          <template #error>
            <div class="image-state image-error">
              <el-icon><Picture /></el-icon>
              <span>图片加载失败</span>
            </div>
          </template>
        </el-image>
        <div v-else class="image-state image-placeholder">
          <el-icon :size="40"><Picture /></el-icon>
          <span>右侧上传图片或粘贴地址</span>
        </div>
      </div>
    </template>

    <template v-else-if="block.type === 'table'">
      <div class="table-content">
        <table class="preview-table" :class="{ striped: block.config?.striped }" :style="tableStyle">
          <tbody>
            <tr v-for="(row, rowIndex) in tableRows" :key="`row-${rowIndex}`">
              <td
                v-for="(cell, colIndex) in row"
                :key="`cell-${rowIndex}-${colIndex}`"
                :class="{ 'is-header': rowIndex === 0 }"
                :style="rowIndex === 0 ? headerCellStyle : undefined"
              >
                <input
                  class="table-cell-input"
                  :readonly="!editable"
                  :value="cell"
                  @input="handleTableCellInput(rowIndex, colIndex, $event)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p class="table-tip">表格可在画布直接编辑，右侧调整行列和样式</p>
      </div>
    </template>

    <template v-else-if="block.type === 'video'">
      <div class="video-card" :style="videoCardStyle">
        <div class="video-mask"></div>
        <div class="video-card-body">
          <div class="video-play-button">
            <el-icon :size="28"><VideoPlay /></el-icon>
          </div>
          <div class="video-copy">
            <span class="video-status">{{ getUploadStatusText(block.config?.uploadStatus) }}</span>
            <strong class="video-title">{{ block.config?.title || defaultVideoTitle }}</strong>
            <span class="video-hint">{{ videoHintText }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Picture, VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'select'])

const displayTextContent = computed(() => props.block.content || '')

const blockStyle = computed(() => ({
  backgroundColor: props.block.bgColor || '#ffffff',
  padding: `${props.block.padding || 16}px`,
  borderRadius: props.isPreview ? '18px' : '14px',
  boxShadow: props.isSelected ? '0 0 0 2px rgba(63, 110, 255, 0.18)' : 'none'
}))

const textStyle = computed(() => {
  const config = props.block.config || {}
  return {
    fontSize: `${config.fontSize || 16}px`,
    color: config.color || '#303133',
    textAlign: config.align || 'left',
    fontWeight: config.bold ? '700' : '400',
    fontStyle: config.italic ? 'italic' : 'normal',
    lineHeight: config.lineHeight || '1.8'
  }
})

const imageWrapStyle = computed(() => ({
  textAlign: props.block.config?.align || 'center'
}))

const imageStyle = computed(() => ({
  width: `${props.block.config?.width || 100}%`,
  borderRadius: `${props.block.config?.borderRadius || 0}px`
}))

const tableRows = computed(() => {
  const content = props.block.content
  if (Array.isArray(content) && content.length) {
    return content
  }
  const rows = Number(props.block.config?.rows || 3)
  const cols = Number(props.block.config?.cols || 3)
  return createEmptyTable(rows, cols)
})

const tableStyle = computed(() => ({
  borderColor: props.block.config?.borderColor || '#dcdfe6'
}))

const headerCellStyle = computed(() => ({
  backgroundColor: props.block.config?.headerBgColor || '#f5f7fa'
}))

const defaultVideoTitle = computed(() => {
  if (props.block.content) {
    return '视频已上传'
  }
  return '等待上传 MP4 视频'
})

const videoHintText = computed(() => {
  const status = props.block.config?.uploadStatus || 'idle'
  if (status === 'success') {
    return props.block.config?.cover ? '封面已生成，可在右侧替换' : '可在右侧继续补充封面和播放参数'
  }
  if (status === 'error') {
    return '重新上传或触发一次 mock 失败重试'
  }
  if (status === 'processing') {
    return '正在模拟生成封面图'
  }
  if (status === 'uploading') {
    return '视频文件正在上传'
  }
  return '支持自动生成封面和手动替换封面图'
})

const videoCardStyle = computed(() => {
  const cover = props.block.config?.cover
  return {
    backgroundImage: cover
      ? `linear-gradient(180deg, rgba(12, 20, 37, 0.12), rgba(12, 20, 37, 0.78)), url(${cover})`
      : 'linear-gradient(135deg, #13233d 0%, #3055a6 48%, #79a6ff 100%)'
  }
})

function createEmptyTable(rows, cols) {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => (rowIndex === 0 ? `表头${colIndex + 1}` : `内容${rowIndex}-${colIndex + 1}`))
  )
}

function handleTextInput(event) {
  emit('update', { content: event.target.innerHTML })
}

function handleTableCellInput(rowIndex, colIndex, event) {
  const next = tableRows.value.map((row) => [...row])
  next[rowIndex][colIndex] = event.target.value
  emit('update', { content: next })
}

function getUploadStatusText(status) {
  const statusMap = {
    idle: '未上传',
    uploading: '上传中',
    processing: '处理中',
    success: '上传成功',
    error: '上传失败'
  }
  return statusMap[status] || '未上传'
}
</script>

<style lang="scss" scoped>
.content-block {
  width: 100%;

  &.is-preview {
    max-width: 100%;
  }
}

.text-content {
  min-height: 80px;
  padding: 4px 0;
  outline: none;
  word-break: break-word;

  &[contenteditable='true']:empty::before {
    content: attr(data-placeholder);
    color: #b5bdc9;
  }
}

.image-content {
  .el-image {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
  }
}

.image-state {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 18px;
}

.image-placeholder {
  background: linear-gradient(135deg, #f4f8ff 0%, #edf2fb 100%);
  color: #7c8ca3;
  border: 1px dashed #b8c7dd;
}

.image-error {
  background: #fff2f0;
  color: #d84b37;
  border: 1px solid #f3beb6;
}

.table-content {
  .preview-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid;
    overflow: hidden;
    border-radius: 16px;

    td {
      border: 1px solid;
      padding: 0;
      background: #fff;

      &.is-header {
        font-weight: 600;
      }
    }

    &.striped tr:nth-child(n + 2):nth-child(even) td {
      background: #fbfcfe;
    }
  }

  .table-cell-input {
    width: 100%;
    min-height: 44px;
    border: none;
    background: transparent;
    padding: 12px 14px;
    color: #223047;
    outline: none;
  }

  .table-tip {
    margin: 12px 0 0;
    font-size: 12px;
    color: #8190a7;
    text-align: center;
  }
}

.video-card {
  position: relative;
  min-height: 280px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.video-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 17, 31, 0.08) 0%, rgba(10, 17, 31, 0.72) 100%);
}

.video-card-body {
  position: relative;
  z-index: 1;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 24px;
  color: #fff;
  gap: 18px;
}

.video-play-button {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
}

.video-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.video-status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 12px;
}

.video-title {
  font-size: 22px;
  font-weight: 700;
}

.video-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
}
</style>
