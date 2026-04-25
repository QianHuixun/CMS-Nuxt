<template>
  <div class="video-uploader">
    <div v-if="status === 'idle'" class="upload-panel is-idle">
      <div class="panel-main" @click="triggerUpload">
        <el-icon :size="40" class="panel-icon"><VideoCamera /></el-icon>
        <div class="panel-copy">
          <strong>上传 MP4 视频</strong>
          <span>支持上传到服务端，并自动提取首帧作为封面</span>
        </div>
      </div>
      <div class="panel-footer">
        <el-button size="small" @click.stop="triggerUpload">选择文件</el-button>
        <el-button size="small" type="danger" plain @click.stop="runMockFailure">模拟失败流程</el-button>
      </div>
    </div>

    <div v-else-if="status === 'uploading'" class="upload-panel">
      <div class="progress-head">
        <el-icon :size="26" class="spin"><Loading /></el-icon>
        <div>
          <strong>视频上传中</strong>
          <span>{{ progress }}%</span>
        </div>
      </div>
      <el-progress :percentage="progress" :stroke-width="8" />
    </div>

    <div v-else-if="status === 'processing'" class="upload-panel">
      <div class="progress-head">
        <el-icon :size="26" class="spin success"><Loading /></el-icon>
        <div>
          <strong>封面处理中</strong>
          <span>正在从视频中提取封面帧</span>
        </div>
      </div>
      <el-progress :percentage="100" :stroke-width="8" :show-text="false" indeterminate />
    </div>

    <div v-else-if="status === 'success'" class="upload-panel success-panel">
      <div class="success-preview" :style="previewStyle">
        <div class="preview-mask"></div>
        <div class="preview-copy">
          <strong>{{ fileName || '视频上传成功' }}</strong>
          <span>{{ cover ? '封面已上传，可继续手动替换' : '可在右侧继续补充封面图' }}</span>
        </div>
        <el-icon :size="26" class="play-icon"><VideoPlay /></el-icon>
      </div>
      <div class="panel-footer">
        <el-button size="small" @click="triggerUpload">重新上传</el-button>
        <el-button size="small" type="danger" plain @click="handleRemove">删除</el-button>
      </div>
    </div>

    <div v-else class="upload-panel error-panel">
      <div class="progress-head">
        <el-icon :size="26" class="error"><CircleClose /></el-icon>
        <div>
          <strong>上传失败</strong>
          <span>{{ errorMessage }}</span>
        </div>
      </div>
      <div class="panel-footer">
        <el-button size="small" type="primary" @click="triggerUpload">重新上传</el-button>
        <el-button size="small" plain @click="resetUploader">重置状态</el-button>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="video/mp4,video/*" style="display: none" @change="handleFileChange" />
  </div>
</template>

<script setup>
import { CircleClose, Loading, VideoCamera, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'idle'
  }
})

const emit = defineEmits(['update:modelValue', 'update:cover', 'status-change'])

const fileInput = ref(null)
const progress = ref(0)
const fileName = ref('')
const errorMessage = ref('请重新上传 MP4 文件')
const uploadEndpoint = `${import.meta.env.VITE_APP_BASE_API}/common/upload`
let progressTimer = null
let finishTimer = null

const previewStyle = computed(() => ({
  backgroundImage: props.cover
    ? `linear-gradient(180deg, rgba(10, 17, 31, 0.12), rgba(10, 17, 31, 0.75)), url(${props.cover})`
    : 'linear-gradient(135deg, #13233d 0%, #2b4c97 50%, #7ca6ff 100%)'
}))

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!file.type.startsWith('video/') && !file.name.toLowerCase().endsWith('.mp4')) {
    ElMessage.error('请上传 MP4 视频文件')
    return
  }

  if (file.size > 500 * 1024 * 1024) {
    ElMessage.error('视频大小不能超过 500MB')
    return
  }

  uploadVideo(file)
}

function uploadVideo(file) {
  clearTimers()
  fileName.value = file.name
  progress.value = 0
  emit('status-change', 'uploading')

  progressTimer = setInterval(() => {
    progress.value = Math.min(90, progress.value + Math.floor(Math.random() * 12 + 5))
  }, 180)

  finishTimer = setTimeout(async () => {
    clearInterval(progressTimer)
    progress.value = 94

    const shouldFail = /fail|error/i.test(file.name)
    if (shouldFail) {
      emitFailure('mock 处理失败，可重新上传')
      return
    }

    try {
      const videoUpload = await uploadAsset(file, 'videos')
      emit('update:modelValue', videoUpload.url)
      progress.value = 100
      emit('status-change', 'processing')

      const localVideoUrl = URL.createObjectURL(file)
      try {
        const coverBlob = await extractFrameFromUrl(localVideoUrl, 0.1)
        const coverFile = new File([coverBlob], `${file.name.replace(/\.[^.]+$/, '') || 'video-cover'}.jpg`, {
          type: 'image/jpeg'
        })
        const coverUpload = await uploadAsset(coverFile, 'images')
        emit('update:cover', coverUpload.url)
      } finally {
        URL.revokeObjectURL(localVideoUrl)
      }

      emit('status-change', 'success')
      ElMessage.success('视频上传完成')
    } catch (error) {
      emitFailure(resolveUploadError(error))
    }
  }, 500)
}

function runMockFailure() {
  clearTimers()
  progress.value = 32
  fileName.value = 'mock-failure.mp4'
  emit('update:modelValue', '')
  emit('status-change', 'uploading')

  finishTimer = setTimeout(() => {
    emitFailure('mock 失败流程已触发')
  }, 900)
}

function emitFailure(message) {
  clearTimers()
  progress.value = 0
  errorMessage.value = message
  emit('status-change', 'error')
  ElMessage.error(message || '视频上传失败')
}

function handleRemove() {
  clearTimers()
  fileName.value = ''
  emit('update:modelValue', '')
  emit('update:cover', '')
  emit('status-change', 'idle')
}

function resetUploader() {
  clearTimers()
  progress.value = 0
  fileName.value = ''
  errorMessage.value = '请重新上传 MP4 文件'
  emit('status-change', 'idle')
}

async function extractCoverAt(seconds = 0.1) {
  if (!props.modelValue) {
    throw new Error('no-video')
  }

  emit('status-change', 'processing')
  try {
    const coverBlob = await extractFrameFromUrl(props.modelValue, seconds)
    const coverFile = new File([coverBlob], `video-cover-${Date.now()}.jpg`, {
      type: 'image/jpeg'
    })
    const coverUpload = await uploadAsset(coverFile, 'images')
    emit('update:cover', coverUpload.url)
    emit('status-change', 'success')
    ElMessage.success('封面已按指定时间重新提取')
    return coverUpload.url
  } catch (error) {
    emit('status-change', 'error')
    ElMessage.error('提取视频封面失败')
    throw error
  }
}

async function uploadAsset(file, folder) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken() || ''}`
    },
    body: formData
  })

  const result = await response.json().catch(() => null)
  if (!response.ok || result?.code !== 200 || !result?.data?.url) {
    throw new Error(result?.msg || `upload-failed-${response.status}`)
  }

  return result.data
}

function resolveUploadError(error) {
  return error instanceof Error ? error.message : '上传失败，请重试'
}

function extractFrameFromUrl(videoUrl, seconds = 0.1) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = videoUrl
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    let loadedMetadata = false

    const cleanup = () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }

    video.onerror = () => {
      cleanup()
      reject(new Error('video-load-failed'))
    }

    video.onloadedmetadata = () => {
      loadedMetadata = true
      const duration = Number.isFinite(video.duration) ? video.duration : 0
      const fallbackTime = duration > 0 ? Math.min(Math.max(seconds, 0), Math.max(duration - 0.05, 0)) : 0
      video.currentTime = fallbackTime
    }

    video.onloadeddata = () => {
      if (!loadedMetadata) return
      if (video.currentTime === 0) {
        drawFrame(video, cleanup, resolve, reject)
      }
    }

    video.onseeked = () => {
      drawFrame(video, cleanup, resolve, reject)
    }
  })
}

function drawFrame(video, cleanup, resolve, reject) {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 960
    canvas.height = video.videoHeight || 540
    const context = canvas.getContext('2d')
    if (!context) {
      cleanup()
      reject(new Error('canvas-context-failed'))
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        cleanup()
        if (!blob) {
          reject(new Error('cover-blob-empty'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      0.85
    )
  } catch (error) {
    cleanup()
    reject(error)
  }
}

function clearTimers() {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  if (finishTimer) {
    clearTimeout(finishTimer)
    finishTimer = null
  }
}

onBeforeUnmount(() => {
  clearTimers()
})

defineExpose({
  extractCoverAt
})
</script>

<style lang="scss" scoped>
.video-uploader {
  width: 100%;
}

.upload-panel {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #dbe3ef;
  background: linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%);
}

.is-idle {
  .panel-main {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 0 16px;
    cursor: pointer;
  }
}

.panel-icon {
  color: #3f6eff;
}

.panel-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 15px;
    color: #203047;
  }

  span {
    font-size: 12px;
    color: #7b8aa3;
  }
}

.panel-footer {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.progress-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: #1f3048;
  }

  span {
    font-size: 12px;
    color: #7b8aa3;
  }
}

.spin {
  animation: rotate 1s linear infinite;
  color: #3f6eff;

  &.success {
    color: #28a46d;
  }
}

.success-preview {
  position: relative;
  min-height: 140px;
  border-radius: 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  margin-bottom: 14px;
}

.preview-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 15, 29, 0.08) 0%, rgba(8, 15, 29, 0.72) 100%);
}

.preview-copy {
  position: absolute;
  left: 18px;
  right: 60px;
  bottom: 18px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #fff;

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.78);
  }
}

.play-icon {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 1;
  color: #fff;
}

.error-panel {
  border-color: #f2c2bb;
  background: linear-gradient(180deg, #fff6f4 0%, #fff1ef 100%);
}

.error {
  color: #d84b37;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
