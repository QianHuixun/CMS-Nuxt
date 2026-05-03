<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  fallbackImage: {
    type: String,
    default: '',
  },
  initialScale: {
    type: Number,
    default: 1.35,
  },
})

const currentPage = defineModel('page', {
  type: Number,
  default: 1,
})

const emit = defineEmits(['loaded', 'error'])

const canvasRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const pageCount = ref(0)
const scale = ref(props.initialScale)
const pdfDoc = ref(null)
let activeRenderTask
let activeLoadingTask

const hasPdf = computed(() => Boolean(props.src))
const canPrev = computed(() => currentPage.value > 1)
const canNext = computed(() => pageCount.value > 0 && currentPage.value < pageCount.value)
const pageLabel = computed(() => {
  const total = pageCount.value || '...'
  return `第 ${currentPage.value} / ${total} 页`
})

const cleanupTasks = () => {
  activeRenderTask?.cancel()
  activeRenderTask = null
  activeLoadingTask?.destroy()
  activeLoadingTask = null
}

const renderCurrentPage = async () => {
  if (!pdfDoc.value || !canvasRef.value) return

  activeRenderTask?.cancel()
  activeRenderTask = null

  const page = await pdfDoc.value.getPage(currentPage.value)
  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`

  activeRenderTask = page.render({ canvasContext: context, viewport })

  try {
    await activeRenderTask.promise
  } catch (error) {
    if (error?.name !== 'RenderingCancelledException') throw error
  } finally {
    activeRenderTask = null
  }
}

const loadPdf = async () => {
  cleanupTasks()
  pdfDoc.value = null
  pageCount.value = 0
  errorMessage.value = ''

  if (!props.src) return

  loading.value = true

  try {
    activeLoadingTask = pdfjsLib.getDocument(props.src)
    const loadedPdf = await activeLoadingTask.promise
    pdfDoc.value = loadedPdf
    pageCount.value = loadedPdf.numPages

    if (currentPage.value < 1 || currentPage.value > loadedPdf.numPages) {
      currentPage.value = 1
    }

    await nextTick()
    await renderCurrentPage()
    emit('loaded', { pages: loadedPdf.numPages })
  } catch (error) {
    errorMessage.value = 'PDF 加载失败，请检查文件地址。'
    emit('error', error)
  } finally {
    loading.value = false
  }
}

const goPrev = () => {
  if (canPrev.value) currentPage.value -= 1
}

const goNext = () => {
  if (canNext.value) currentPage.value += 1
}

const zoomOut = () => {
  scale.value = Math.max(0.7, Number((scale.value - 0.15).toFixed(2)))
}

const zoomIn = () => {
  scale.value = Math.min(2.4, Number((scale.value + 0.15).toFixed(2)))
}

watch(() => props.src, loadPdf, { immediate: true })
watch(currentPage, renderCurrentPage)
watch(scale, renderCurrentPage)

onBeforeUnmount(() => {
  cleanupTasks()
  pdfDoc.value?.destroy()
})
</script>

<template>
  <section class="pdf-reader">
    <div class="pdf-toolbar" aria-label="PDF 阅读器工具栏">
      <button type="button" :disabled="!hasPdf || !canPrev" @click="goPrev">‹</button>
      <strong>{{ hasPdf ? pageLabel : 'PDF 未上传' }}</strong>
      <button type="button" :disabled="!hasPdf || !canNext" @click="goNext">›</button>

      <div class="zoom-controls" aria-label="缩放">
        <button type="button" :disabled="!hasPdf" @click="zoomOut">-</button>
        <span>{{ Math.round(scale * 100) }}%</span>
        <button type="button" :disabled="!hasPdf" @click="zoomIn">+</button>
      </div>
    </div>

    <div class="pdf-canvas-wrap">
      <div v-if="loading" class="reader-state">PDF 加载中...</div>
      <div v-else-if="errorMessage" class="reader-state">{{ errorMessage }}</div>

      <canvas v-show="hasPdf && !errorMessage" ref="canvasRef" class="pdf-canvas"></canvas>

      <article v-if="!hasPdf" class="pdf-fallback">
        <img v-if="fallbackImage" :src="fallbackImage" alt="PDF 预览占位">
        <p v-else>请为该文章配置 PDF 地址</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pdf-reader {
  min-width: 0;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f2ed;
  overflow: hidden;
}

.pdf-toolbar {
  height: 48px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: #615d59;
  position: relative;
  z-index: 2;
}

.pdf-toolbar button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #504945;
  font-size: 22px;
  line-height: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pdf-toolbar button:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.pdf-toolbar button:disabled {
  opacity: 0.28;
  cursor: default;
}

.pdf-toolbar strong {
  min-width: 112px;
  color: var(--color-primary);
  font-family: Inter, "Microsoft YaHei", sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
}

.zoom-controls {
  position: absolute;
  right: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.zoom-controls span {
  min-width: 44px;
  color: #77716d;
  font-size: 12px;
  text-align: center;
}

.pdf-canvas-wrap {
  flex: 1;
  min-height: 0;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  scrollbar-width: none;
  position: relative;
}

.pdf-canvas-wrap::-webkit-scrollbar {
  display: none;
}

.pdf-canvas,
.pdf-fallback {
  background-color: #fff;
  box-shadow: 0 24px 60px rgba(43, 37, 32, 0.18);
}

.pdf-canvas {
  display: block;
}

.pdf-fallback {
  width: min(768px, 100%);
  padding: 40px;
}

.pdf-fallback img {
  width: 100%;
  aspect-ratio: 3 / 4;
  display: block;
  object-fit: cover;
  opacity: 0.82;
  mix-blend-mode: multiply;
  background-color: #e8f1f2;
}

.pdf-fallback p,
.reader-state {
  color: #77716d;
  font-size: 14px;
}

.reader-state {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 18px rgba(43, 37, 32, 0.08);
}

@media (max-width: 680px) {
  .pdf-canvas-wrap {
    padding: 14px;
  }

  .pdf-fallback {
    padding: 14px;
  }

  .zoom-controls {
    position: static;
  }
}
</style>
