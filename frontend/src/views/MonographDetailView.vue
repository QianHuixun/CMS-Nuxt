<script setup>
import { computed, ref, onMounted } from 'vue'
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
const normalizeText = (value) => String(value ?? '').trim()

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
        title: data.title,
        subtitle: normalizeText(data.description) ? data.description.slice(0, 30) : `${data.publisher || '出版信息'} · ${data.year || ''}`,
        source: normalizeText(data.publisher),
        authors: [data.author || '未知'],
        date: data.year ? `${data.year}年` : '',
        edition: '第一版',
        isbn: normalizeText(data.isbn),
        previewUrl: getPreviewUrl(data),
        pdfUrl: getPdfUrl(data),
        abstract: normalizeText(data.description) || `${data.title}，${data.author || '作者信息待补充'}，${data.publisher || '出版单位待补充'}，${data.year ? `${data.year}年` : '出版年份待补充'}。`,
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

const monographInfoRows = computed(() => [
  { label: '作者', value: monograph.value.authors.join(' / ') },
  { label: '出版社', value: monograph.value.source },
  { label: '出版年份', value: monograph.value.date },
  { label: 'ISBN', value: monograph.value.isbn },
  { label: '版本', value: monograph.value.edition }
].filter(item => item.value))
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
          <span v-if="monograph.isbn">ISBN: {{ monograph.isbn }}</span>
          <span>{{ monograph.edition }}</span>
        </div>
      </section>

      <section class="info-section">
        <h2>基础信息</h2>
        <dl class="info-grid">
          <div v-for="item in monographInfoRows" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="detail-section">
        <h2>内容简介</h2>
        <p>{{ monograph.abstract }}</p>
      </section>

      <section class="detail-section">
        <h2>关键词</h2>
        <div v-if="monograph.keywords.length" class="keyword-list">
          <span v-for="keyword in monograph.keywords" :key="keyword">{{ keyword }}</span>
        </div>
        <p v-else class="empty-text">暂无关键词，当前条目展示基础出版信息。</p>
      </section>

      <section class="monograph-actions">
        <a
          class="download-button"
          :href="monograph.pdfUrl || undefined"
          :aria-disabled="!monograph.pdfUrl"
        >
          {{ monograph.pdfUrl ? `下载全文 PDF (${monograph.downloads})` : '暂无 PDF 文件' }}
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

.info-section {
  margin-bottom: 28px;
}

.info-section h2,
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

.info-section h2::before,
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

.info-grid {
  display: grid;
  gap: 10px;
}

.info-grid div {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 12px;
  color: #77716d;
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

.info-grid dt {
  color: #9a9692;
}

.info-grid dd {
  min-width: 0;
  margin: 0;
  color: #4f4945;
  overflow-wrap: anywhere;
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

.empty-text {
  color: #9a9692;
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
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
