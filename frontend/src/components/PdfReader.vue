<script setup>
import { computed, markRaw, nextTick, onBeforeUnmount, shallowRef, ref, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'

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

const containerRef = ref(null)
const canvasRef = ref(null)
const imageRef = ref(null)
const imageLoaded = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const pageCount = ref(0)
const scale = ref(props.initialScale)
const pdfDoc = shallowRef(null)
const imageNaturalWidth = ref(0)
const imageNaturalHeight = ref(0)
const isDragging = ref(false)
const dragStartMouseX = ref(0)
const dragStartMouseY = ref(0)
const dragStartScrollLeft = ref(0)
const dragStartScrollTop = ref(0)
let activeRenderTask
let activeLoadingTask
let activeFetchController
let loadVersion = 0

const isPdfUrl = (url = '') => /\.pdf($|[?#])/i.test(url)
const isImageUrl = (url = '') => /\.(png|jpe?g|gif|webp|bmp|svg)($|[?#])/i.test(url)
const documentSrc = computed(() => {
  if (isPdfUrl(props.src) || isImageUrl(props.src)) return props.src
  return ''
})
const documentType = computed(() => {
  if (isPdfUrl(documentSrc.value)) return 'pdf'
  if (isImageUrl(documentSrc.value)) return 'image'
  return ''
})
const hasPdf = computed(() => documentType.value === 'pdf')
const hasImage = computed(() => documentType.value === 'image')
const hasDocument = computed(() => Boolean(documentSrc.value))
const canPrev = computed(() => hasPdf.value && currentPage.value > 1)
const canNext = computed(() => hasPdf.value && pageCount.value > 0 && currentPage.value < pageCount.value)
const canZoom = computed(() => hasDocument.value && !errorMessage.value)
const pageLabel = computed(() => {
  const total = pageCount.value || '...'
  return `第 ${currentPage.value} / ${total} 页`
})
const toolbarLabel = computed(() => {
  if (hasPdf.value) return pageLabel.value
  if (hasImage.value) return '图片预览'
  return '文件未上传'
})
const loadingLabel = computed(() => hasImage.value ? '图片加载中...' : 'PDF 加载中...')
const imageStyle = computed(() => {
  if (!imageNaturalWidth.value) return { width: `${Math.round(scale.value * 100)}%` }
  return { width: `${Math.round(imageNaturalWidth.value * scale.value)}px` }
})

const cleanupTasks = () => {
  activeFetchController?.abort()
  activeFetchController = null
  activeRenderTask?.cancel()
  activeRenderTask = null
  activeLoadingTask?.destroy()
  activeLoadingTask = null
}

const renderCurrentPage = async () => {
  if (!pdfDoc.value || !canvasRef.value) return

  const previousRenderTask = activeRenderTask
  if (previousRenderTask) {
    previousRenderTask.cancel()
    try {
      await previousRenderTask.promise
    } catch (error) {
      if (error?.name !== 'RenderingCancelledException') throw error
    }
  }
  activeRenderTask = null

  const page = await pdfDoc.value.getPage(currentPage.value)
  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasRef.value
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`

  const renderTask = page.render({ canvas, viewport })
  activeRenderTask = renderTask

  try {
    await renderTask.promise
  } catch (error) {
    if (error?.name !== 'RenderingCancelledException') throw error
  } finally {
    if (activeRenderTask === renderTask) activeRenderTask = null
  }
}

const loadPdf = async (version) => {
  activeFetchController = new AbortController()
  const response = await fetch(documentSrc.value, { signal: activeFetchController.signal })
  if (!response.ok) throw new Error(`PDF request failed: ${response.status} ${response.statusText}`)

  const pdfData = new Uint8Array(await response.arrayBuffer())
  if (version !== loadVersion) return

  activeFetchController = null
  activeLoadingTask = pdfjsLib.getDocument({ data: pdfData, disableWorker: true })
  const loadedPdf = await activeLoadingTask.promise
  if (version !== loadVersion) {
    await loadedPdf.destroy()
    return
  }

  pdfDoc.value = markRaw(loadedPdf)
  pageCount.value = loadedPdf.numPages

  if (currentPage.value < 1 || currentPage.value > loadedPdf.numPages) {
    currentPage.value = 1
  }

  await nextTick()
  await applyFitScale()
  if (version !== loadVersion) return

  emit('loaded', { type: 'pdf', pages: loadedPdf.numPages })
}

const loadDocument = async () => {
  loadVersion += 1
  const version = loadVersion
  cleanupTasks()
  pdfDoc.value = null
  pageCount.value = 0
  imageLoaded.value = false
  errorMessage.value = ''

  if (!hasDocument.value) {
    loading.value = false
    return
  }

  loading.value = true

  if (hasImage.value) return

  try {
    await loadPdf(version)
  } catch (error) {
    if (version !== loadVersion || error?.name === 'AbortError') return
    console.error('PDF 加载失败', { src: documentSrc.value, error })
    errorMessage.value = 'PDF 加载失败，请检查文件地址。'
    emit('error', error)
  } finally {
    if (version === loadVersion) loading.value = false
  }
}

const applyFitScale = async () => {
  const container = containerRef.value
  if (!container) return
  const pad = 64
  const cw = container.clientWidth - pad
  const ch = container.clientHeight - pad
  if (cw <= 0 || ch <= 0) return

  if (hasImage.value && imageNaturalWidth.value > 0 && imageNaturalHeight.value > 0) {
    const fitX = cw / imageNaturalWidth.value
    const fitY = ch / imageNaturalHeight.value
    scale.value = Math.min(fitX, fitY, 1)
    return
  }

  if (hasPdf.value && pdfDoc.value) {
    const page = await pdfDoc.value.getPage(currentPage.value)
    const viewport = page.getViewport({ scale: 1 })
    scale.value = cw / viewport.width
    await nextTick()
    await renderCurrentPage()
  }
}

const handleImageLoad = async (e) => {
  const img = e.target
  imageNaturalWidth.value = img.naturalWidth
  imageNaturalHeight.value = img.naturalHeight
  await nextTick()
  await applyFitScale()
  imageLoaded.value = true
  loading.value = false
  emit('loaded', { type: 'image' })
}

const handleImageError = (error) => {
  imageLoaded.value = false
  loading.value = false
  errorMessage.value = '图片加载失败，请检查文件地址。'
  emit('error', error)
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

const onPanStart = (e) => {
  if (!hasDocument.value || errorMessage.value) return
  if (e.button !== 0) return
  const el = containerRef.value
  if (!el) return
  isDragging.value = true
  dragStartMouseX.value = e.clientX
  dragStartMouseY.value = e.clientY
  dragStartScrollLeft.value = el.scrollLeft
  dragStartScrollTop.value = el.scrollTop
  document.addEventListener('mousemove', onPanMove)
  document.addEventListener('mouseup', onPanEnd)
  e.preventDefault()
}

const onPanMove = (e) => {
  if (!isDragging.value) return
  const el = containerRef.value
  if (!el) return
  el.scrollLeft = dragStartScrollLeft.value - (e.clientX - dragStartMouseX.value)
  el.scrollTop = dragStartScrollTop.value - (e.clientY - dragStartMouseY.value)
}

const onPanEnd = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onPanMove)
  document.removeEventListener('mouseup', onPanEnd)
}

watch([documentSrc, documentType], () => {
  imageNaturalWidth.value = 0
  imageNaturalHeight.value = 0
  loadDocument()
}, { immediate: true })
watch(currentPage, () => {
  if (hasPdf.value) renderCurrentPage()
})
watch(scale, () => {
  if (hasPdf.value) {
    renderCurrentPage()
  }
})

onBeforeUnmount(() => {
  cleanupTasks()
  pdfDoc.value?.destroy()
  document.removeEventListener('mousemove', onPanMove)
  document.removeEventListener('mouseup', onPanEnd)
})
</script>

<template>
  <section class="pdf-reader">
    <div class="pdf-toolbar" aria-label="文档预览工具栏">
      <button type="button" :disabled="!canPrev" @click="goPrev">‹</button>
      <strong>{{ toolbarLabel }}</strong>
      <button type="button" :disabled="!canNext" @click="goNext">›</button>

      <div class="zoom-controls" aria-label="缩放">
        <button type="button" :disabled="!canZoom" @click="zoomOut">-</button>
        <span>{{ Math.round(scale * 100) }}%</span>
        <button type="button" :disabled="!canZoom" @click="zoomIn">+</button>
      </div>
    </div>

    <div
      ref="containerRef"
      class="pdf-canvas-wrap"
      :class="{ 'is-dragging': isDragging }"
      @mousedown="onPanStart"
    >
      <div v-if="loading" class="reader-state">{{ loadingLabel }}</div>
      <div v-else-if="errorMessage" class="reader-state">{{ errorMessage }}</div>

      <div class="pdf-inner">
        <canvas v-show="hasPdf && !errorMessage" ref="canvasRef" class="pdf-canvas"></canvas>
        <img
          v-if="hasImage && !errorMessage"
          v-show="imageLoaded"
          ref="imageRef"
          class="preview-image"
          :src="documentSrc"
          :style="imageStyle"
          alt="文档图片预览"
          @load="handleImageLoad"
          @error="handleImageError"
          @dragstart.prevent
        >

        <article v-if="!hasDocument" class="pdf-fallback">
          <img v-if="fallbackImage" :src="fallbackImage" alt="文档预览占位">
          <p v-else>请为该条目配置文件地址</p>
        </article>
      </div>
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
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-icon);
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
  font-family: var(--font-sans);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
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
  font-size: var(--font-size-sm);
  text-align: center;
}

.pdf-canvas-wrap {
  flex: 1;
  min-height: 0;
  padding: 32px;
  overflow: auto;
  scrollbar-width: none;
  position: relative;
  user-select: none;
}

.pdf-canvas-wrap.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}

.pdf-canvas-wrap::-webkit-scrollbar {
  display: none;
}

.pdf-inner {
  min-width: 100%;
  min-height: 100%;
  width: max-content;
}

.pdf-inner > .pdf-canvas,
.pdf-inner > .preview-image,
.pdf-inner > .pdf-fallback {
  margin-right: auto;
  margin-left: auto;
}

.pdf-canvas,
.pdf-fallback {
  background-color: #fff;
  box-shadow: 0 24px 60px rgba(43, 37, 32, 0.18);
}

.pdf-canvas {
  display: block;
}

.preview-image {
  display: block;
  max-width: none;
  height: auto;
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
  font-size: var(--font-size-md);
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
