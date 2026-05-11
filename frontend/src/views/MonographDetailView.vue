<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentReaderLayout from '@/components/DocumentReaderLayout.vue'
import PdfReader from '@/components/PdfReader.vue'
import documentPage from '@/assets/images/pages/paper-detail/document-page.png'
import { fetchBookDetail } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const route = useRoute()
const router = useRouter()
const normalizeList = (value, separator = ';') => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') return value.split(separator).map(item => item.trim()).filter(Boolean)
  return []
}

const getAttachmentPdfUrl = (attachments) => {
  const file = (Array.isArray(attachments) ? attachments : []).find((item) => {
    const url = item?.url || item?.fileUrl || item?.downloadUrl || ''
    const name = item?.name || ''
    return /\.pdf($|[?#])/i.test(url) || /\.pdf$/i.test(name)
  })
  return file?.url || file?.fileUrl || file?.downloadUrl || ''
}

const isPdfUrl = (url = '') => /\.pdf($|[?#])/i.test(url)
const isPreviewUrl = (url = '') => /\.(pdf|png|jpe?g|gif|webp|bmp|svg)($|[?#])/i.test(url)

const getAttachmentPreviewUrl = (attachments) => {
  const file = (Array.isArray(attachments) ? attachments : []).find((item) => {
    const url = item?.url || item?.fileUrl || item?.downloadUrl || ''
    const name = item?.name || ''
    return isPreviewUrl(url) || isPreviewUrl(name)
  })
  return file?.url || file?.fileUrl || file?.downloadUrl || ''
}

const getPreviewUrl = (data) => {
  const directUrl = data?.previewUrl || data?.pdfUrl || data?.fileUrl || data?.downloadUrl || data?.url || data?.coverImage || ''
  if (isPreviewUrl(directUrl)) return directUrl

  const attachmentUrl = getAttachmentPreviewUrl(data?.attachments)
  return isPreviewUrl(attachmentUrl) ? attachmentUrl : ''
}

const getPdfUrl = (data) => {
  const directUrl = data?.pdfUrl || data?.fileUrl || data?.downloadUrl || data?.url || ''
  if (isPdfUrl(directUrl)) return directUrl

  const attachmentUrl = getAttachmentPdfUrl(data?.attachments)
  return isPdfUrl(attachmentUrl) ? attachmentUrl : ''
}

const monograph = ref({
  title: '',
  subtitle: '',
  source: '',
  authors: [],
  date: '',
  edition: '',
  isbn: '',
  previewUrl: '',
  pdfUrl: '',
  abstract: '',
  keywords: [],
  downloads: '',
})

onMounted(async () => {
  try {
    const data = await fetchBookDetail(route.params.id || 'book_001')
    if (data) {
      monograph.value = {
        title: `《${data.title}》`,
        subtitle: data.description ? data.description.slice(0, 30) : '',
        source: data.publisher || '',
        authors: [data.author || '未知'],
        date: data.year ? `${data.year}年` : '',
        edition: '第一版',
        isbn: data.isbn || '',
        previewUrl: getPreviewUrl(data),
        pdfUrl: getPdfUrl(data),
        abstract: data.description || '',
        keywords: normalizeList(data.keywords || data.keywordsText || data.tags || ''),
        downloads: '68 MB',
      }
    }
  } catch (e) {
    console.error('获取专著详情失败', e)
  }
})

const closePage = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <DocumentReaderLayout :reader-label="'\u4e13\u8457\u9605\u8bfb\u533a'" :aside-label="'\u4e13\u8457\u8be6\u60c5'">
    <template #reader>
      <PdfReader
        :src="monograph.previewUrl"
        :fallback-image="documentPage"
      />
    </template>

    <template #aside>
      <div class="aside-close">
        <button type="button" aria-label="关闭专著详情" @click="closePage">×</button>
      </div>

      <section class="monograph-hero">
        <span>学术著作</span>
        <h1>{{ monograph.title }}</h1>
        <p class="monograph-subtitle">{{ monograph.subtitle }}</p>
        <div class="monograph-meta">
          <p>{{ monograph.authors.join(' / ') }}</p>
          <i aria-hidden="true"></i>
          <p>{{ monograph.source }}</p>
          <i aria-hidden="true"></i>
          <time>{{ monograph.date }}</time>
        </div>
        <div class="monograph-id">
          <span>ISBN: {{ monograph.isbn }}</span>
          <span>{{ monograph.edition }}</span>
        </div>
      </section>

      <section class="detail-section">
        <h2>内容简介</h2>
        <p>{{ monograph.abstract }}</p>
      </section>

      <section class="detail-section">
        <h2>关键词</h2>
        <div class="keyword-list">
          <span v-for="keyword in monograph.keywords" :key="keyword">{{ keyword }}</span>
        </div>
      </section>

      <section class="monograph-actions">
        <a
          class="download-button"
          :href="monograph.pdfUrl || undefined"
          :aria-disabled="!monograph.pdfUrl"
        >
          下载全文 PDF ({{ monograph.downloads }})
        </a>
        <div class="secondary-actions">
          <button type="button">请求纸本</button>
          <button type="button">引用导出</button>
        </div>
      </section>
    </template>
  </DocumentReaderLayout>
</template>

<style scoped>
.aside-close {
  min-height: 58px;
  padding: 16px 0 8px;
  display: flex;
  justify-content: flex-end;
  flex: 0 0 auto;
}

.aside-close button {
  width: 30px;
  height: 30px;
  border: 0;
  background: transparent;
  color: #9a9692;
  font-size: var(--font-size-9xl);
  line-height: var(--line-height-icon);
  cursor: pointer;
  transition: color 0.2s ease;
}

.aside-close button:hover {
  color: #615d59;
}

.monograph-hero {
  padding-bottom: 28px;
}

.monograph-hero > span {
  margin-bottom: 16px;
  padding: 4px 8px;
  display: inline-flex;
  border-radius: 4px;
  background-color: #fdf2f2;
  color: var(--color-primary);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-control);
}

.monograph-hero h1 {
  color: #333;
  font-family: var(--font-serif);
  font-size: var(--font-size-7xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

.monograph-subtitle {
  margin-top: 8px;
  color: #9a9692;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-regular);
}

.monograph-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #9a9692;
  font-size: var(--font-size-md);
  line-height: var(--line-height-control);
}

.monograph-meta i {
  width: 1px;
  height: 12px;
  margin-top: 2px;
  background-color: #eee;
}

.monograph-id {
  margin-top: 12px;
  display: flex;
  gap: 16px;
  color: #b0aba7;
  font-size: var(--font-size-sm);
}

.detail-section {
  margin-bottom: 28px;
}

.detail-section h2 {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4f4945;
  font-family: var(--font-sans);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-control);
}

.detail-section h2::before {
  content: "";
  width: 4px;
  height: 12px;
  background-color: var(--color-primary);
}

.detail-section p {
  color: #77716d;
  font-size: var(--font-size-md);
  line-height: var(--line-height-article);
  text-align: justify;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
}

.keyword-list span {
  min-height: 24px;
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #9a9692;
  font-size: var(--font-size-xs);
  transition: background-color 0.2s ease;
}

.keyword-list span:hover {
  background-color: #f1f1f1;
}

.monograph-actions {
  margin-top: auto;
  display: grid;
  gap: 12px;
}

.download-button,
.secondary-actions button {
  border-radius: 6px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.download-button {
  min-height: 44px;
  border: 0;
  background-color: var(--color-primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  text-decoration: none;
  box-shadow: 0 12px 22px rgba(132, 33, 48, 0.1);
}

.download-button:hover:not([aria-disabled="true"]) {
  background-color: #6e1414;
}

.download-button[aria-disabled="true"] {
  opacity: 0.72;
  cursor: not-allowed;
}

.secondary-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.secondary-actions button {
  min-height: 36px;
  border: 1px solid #f0eeee;
  background-color: #fff;
  color: #77716d;
  font-size: var(--font-size-md);
}

.secondary-actions button:hover {
  background-color: #fafafa;
}

@media (max-width: 680px) {
  .monograph-hero h1 {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-heading);
  }

  .secondary-actions {
    grid-template-columns: 1fr;
  }
}
</style>
