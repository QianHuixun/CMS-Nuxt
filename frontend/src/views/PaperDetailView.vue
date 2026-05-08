<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PdfReader from '@/components/PdfReader.vue'
import documentPage from '@/assets/images/pages/paper-detail/document-page.png'
import { fetchPaperDetail } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const route = useRoute()
const router = useRouter()
const currentPage = ref(1)
const normalizeList = (value, separator = ',') => {
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

const getPdfUrl = (data) => {
  return data?.pdfUrl || data?.fileUrl || data?.downloadUrl || data?.url || getAttachmentPdfUrl(data?.attachments)
}

const paper = ref({
  title: '',
  category: '学术论文',
  authors: [],
  source: '',
  date: '',
  downloads: '',
  citations: 0,
  reads: '',
  pdfUrl: '',
  previewImage: documentPage,
  abstract: '',
  keywords: [],
})

onMounted(async () => {
  try {
    const data = await fetchPaperDetail(route.params.id)
    if (data) {
      paper.value = {
        title: data.title,
        category: data.type || '学术论文',
        authors: normalizeList(data.authors).length ? normalizeList(data.authors) : [data.firstAuthor || '未知'],
        source: data.journal || '',
        date: data.year ? `${data.year}年` : '',
        downloads: '14.2 MB',
        citations: 128,
        reads: '2.4k',
        pdfUrl: getPdfUrl(data),
        previewImage: documentPage,
        abstract: data.abstract || '',
        keywords: normalizeList(data.keywords || data.keywordsText || ''),
      }
    }
  } catch (e) {
    console.error('获取论文详情失败', e)
  }
})

const closePage = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <main class="paper-page">
    <section class="paper-workspace" aria-label="论文阅读区">
      <PdfReader
        v-model:page="currentPage"
        :src="paper.pdfUrl"
        :fallback-image="paper.previewImage"
      />
    </section>

    <aside class="paper-aside" aria-label="论文详情">
      <div class="aside-close">
        <button type="button" aria-label="关闭论文详情" @click="closePage">×</button>
      </div>

      <section class="paper-hero">
        <span>{{ paper.category }}</span>
        <h1>{{ paper.title }}</h1>
        <div class="paper-meta">
          <p>{{ paper.authors.join(' / ') }}</p>
          <i aria-hidden="true"></i>
          <p>{{ paper.source }}</p>
          <i aria-hidden="true"></i>
          <time>{{ paper.date }}</time>
        </div>
      </section>

      <section class="metric-grid" aria-label="论文指标">
        <article>
          <span>{{ paper.citations }}</span>
          <p>引用次数</p>
        </article>
        <article>
          <span>{{ paper.reads }}</span>
          <p>阅读量</p>
        </article>
      </section>

      <section class="detail-section">
        <h2>摘要</h2>
        <p>{{ paper.abstract }}</p>
      </section>

      <section class="detail-section">
        <h2>关键词</h2>
        <div class="keyword-list">
          <span v-for="keyword in paper.keywords" :key="keyword">{{ keyword }}</span>
        </div>
      </section>

      <section class="paper-actions" aria-label="论文操作">
        <a
          class="download-button"
          :href="paper.pdfUrl || undefined"
          :aria-disabled="!paper.pdfUrl"
          :download="paper.pdfUrl ? '' : undefined"
        >
          下载全文 PDF ({{ paper.downloads }})
        </a>
        <div class="secondary-actions">
          <button type="button">打印全文</button>
          <button type="button">分享成果</button>
        </div>
      </section>
    </aside>
  </main>
</template>

<style scoped>
.paper-page {
  height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  background-color: #f0f0f0;
  color: #2b2520;
  overflow: hidden;
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.paper-workspace {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f2ed;
  overflow: hidden;
}

.paper-aside::-webkit-scrollbar {
  display: none;
}

.paper-aside {
  min-height: 0;
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 16px 48px rgba(43, 37, 32, 0.12);
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 3;
}

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
  font-size: 28px;
  line-height: 24px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.aside-close button:hover {
  color: #615d59;
}

.paper-hero {
  padding-bottom: 28px;
}

.paper-hero > span {
  margin-bottom: 16px;
  padding: 4px 8px;
  display: inline-flex;
  border-radius: 4px;
  background-color: #fdf2f2;
  color: var(--color-primary);
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
}

.paper-hero h1 {
  color: #333;
  font-family: "Noto Serif SC", "SimSun", serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
}

.paper-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #9a9692;
  font-size: 12px;
  line-height: 1.4;
}

.paper-meta i {
  width: 1px;
  height: 12px;
  margin-top: 2px;
  background-color: #eee;
}

.metric-grid {
  margin-bottom: 28px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.metric-grid article {
  min-height: 105px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 4px;
  background-color: #faf8f5;
}

.metric-grid span {
  color: var(--color-primary);
  font-family: "Noto Serif SC", serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.metric-grid p {
  margin-top: 8px;
  color: #9a9692;
  font-size: 10px;
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
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.detail-section h2::before {
  content: "";
  width: 4px;
  height: 12px;
  background-color: var(--color-primary);
}

.detail-section p {
  color: #77716d;
  font-size: 12px;
  line-height: 1.85;
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
  font-size: 10px;
  transition: background-color 0.2s ease;
}

.keyword-list span:hover {
  background-color: #f1f1f1;
}

.paper-actions {
  margin-top: auto;
  display: grid;
  gap: 12px;
}

.download-button,
.secondary-actions button {
  border-radius: 6px;
  font-family: "Microsoft YaHei", sans-serif;
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
  font-size: 14px;
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
  font-size: 12px;
}

.secondary-actions button:hover {
  background-color: #fafafa;
}

@media (max-width: 1180px) {
  .paper-page {
    min-height: 100vh;
    height: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  .paper-workspace {
    min-height: 720px;
    overflow: visible;
  }

  .paper-aside {
    min-height: auto;
    padding: 0 32px 40px;
    overflow: visible;
  }
}

@media (max-width: 680px) {
  .paper-hero h1 {
    font-size: 22px;
    line-height: 1.35;
  }

  .metric-grid,
  .secondary-actions {
    grid-template-columns: 1fr;
  }

  .paper-aside {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
