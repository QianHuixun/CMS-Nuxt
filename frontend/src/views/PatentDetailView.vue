<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentReaderLayout from '@/components/DocumentReaderLayout.vue'
import PdfReader from '@/components/PdfReader.vue'
import documentPage from '@/assets/images/pages/paper-detail/document-page.png'
import { fetchSoftwarePatentDetail } from '@/api/index.js'
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

const patent = ref({
  title: '',
  subtitle: '',
  source: '',
  inventors: [],
  date: '',
  patentNo: '',
  previewUrl: '',
  pdfUrl: '',
  abstract: '',
  keywords: [],
  downloads: '',
})

onMounted(async () => {
  try {
    const data = await fetchSoftwarePatentDetail(route.params.id || 'software_001')
    if (data) {
      patent.value = {
        title: data.title,
        subtitle: `${data.typeName || data.type} · ${data.year}年`,
        source: data.owner || '',
        inventors: normalizeList(data.inventors),
        date: data.year ? `${data.year}年` : '',
        patentNo: data.registrationNo || '',
        previewUrl: getPreviewUrl(data),
        pdfUrl: getPdfUrl(data),
        abstract: data.description || '',
        keywords: normalizeList(data.keywords || data.keywordsText || data.tags || ''),
        downloads: '12 MB',
      }
    }
  } catch (e) {
    console.error('获取软著专利详情失败', e)
  }
})

const closePage = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <DocumentReaderLayout :reader-label="'\u6587\u6863\u9605\u8bfb\u533a'" :aside-label="'\u4e13\u5229\u8be6\u60c5'">
    <template #reader>
      <PdfReader
        :src="patent.previewUrl"
        :fallback-image="documentPage"
      />
    </template>

    <template #aside>
      <div class="aside-close">
        <button type="button" aria-label="关闭专利详情" @click="closePage">×</button>
      </div>

      <section class="patent-hero">
        <span>知识产权</span>
        <h1>{{ patent.title }}</h1>
        <p class="patent-subtitle">{{ patent.subtitle }}</p>
        <div class="patent-meta">
          <p>{{ patent.source }}</p>
          <i aria-hidden="true"></i>
          <time>{{ patent.date }}</time>
        </div>
        <div class="patent-id">
          <span>登记号: {{ patent.patentNo }}</span>
        </div>
      </section>

      <section class="inventor-section">
        <h2>发明人</h2>
        <div class="inventor-list">
          <span v-for="inventor in patent.inventors" :key="inventor">{{ inventor }}</span>
        </div>
      </section>

      <section class="detail-section">
        <h2>摘要</h2>
        <p>{{ patent.abstract }}</p>
      </section>

      <section class="detail-section">
        <h2>关键词</h2>
        <div class="keyword-list">
          <span v-for="keyword in patent.keywords" :key="keyword">{{ keyword }}</span>
        </div>
      </section>

      <section class="patent-actions">
        <a
          class="download-button"
          :href="patent.pdfUrl || undefined"
          :aria-disabled="!patent.pdfUrl"
        >
          下载说明书 ({{ patent.downloads }})
        </a>
        <div class="secondary-actions">
          <button type="button">法律状态</button>
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

.patent-hero {
  padding-bottom: 28px;
}

.patent-hero > span {
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

.patent-hero h1 {
  color: #333;
  font-family: var(--font-serif);
  font-size: var(--font-size-7xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

.patent-subtitle {
  margin-top: 8px;
  color: #9a9692;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-regular);
}

.patent-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #9a9692;
  font-size: var(--font-size-md);
  line-height: var(--line-height-control);
}

.patent-meta i {
  width: 1px;
  height: 12px;
  margin-top: 2px;
  background-color: #eee;
}

.patent-id {
  margin-top: 12px;
  color: #b0aba7;
  font-size: var(--font-size-sm);
}

.inventor-section {
  margin-bottom: 28px;
}

.inventor-section h2,
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

.inventor-section h2::before,
.detail-section h2::before {
  content: "";
  width: 4px;
  height: 12px;
  background-color: var(--color-primary);
}

.inventor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.inventor-list span {
  min-height: 28px;
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  background-color: #faf8f5;
  color: var(--color-primary);
  font-size: var(--font-size-md);
}

.detail-section {
  margin-bottom: 28px;
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

.patent-actions {
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
  .patent-hero h1 {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-heading);
  }

  .secondary-actions {
    grid-template-columns: 1fr;
  }
}
</style>
