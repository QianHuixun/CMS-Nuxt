<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentReaderLayout from '@/components/DocumentReaderLayout.vue'
import PdfReader from '@/components/PdfReader.vue'
import documentPage from '@/assets/images/pages/paper-detail/document-page.png'
import { fetchPaperDetail } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'
import { normalizeList, normalizeText, getPreviewUrl, getPdfUrl } from '@/utils/normalize.js'

const route = useRoute()
const router = useRouter()
const currentPage = ref(1)

const paper = ref({
  title: '',
  category: '',
  authors: [],
  corresponding: '',
  source: '',
  date: '',
  doi: '',
  downloads: '',
  previewUrl: '',
  pdfUrl: '',
  previewImage: documentPage,
  abstract: '',
  keywords: [],
})

onMounted(async () => {
  try {
    const id = route.params.id
    if (!id) return
    const data = await fetchPaperDetail(id)
    if (data) {
      const authors = normalizeList(data.authors).length ? normalizeList(data.authors) : [data.firstAuthor || '未知']
      paper.value = {
        title: data.title,
        category: normalizeText(data.type),
        authors,
        corresponding: normalizeText(data.corresponding),
        source: normalizeText(data.journal),
        date: data.year ? `${data.year}年` : '',
        doi: normalizeText(data.doi),
        downloads: '14.2 MB',
        previewUrl: getPreviewUrl(data),
        pdfUrl: getPdfUrl(data),
        previewImage: documentPage,
        abstract: normalizeText(data.abstract),
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

const paperInfoRows = computed(() => [
  { label: '成果类型', value: paper.value.category },
  { label: '作者', value: paper.value.authors.join(' / ') },
  { label: '通讯作者', value: paper.value.corresponding },
  { label: '来源', value: paper.value.source },
  { label: '年份', value: paper.value.date },
  { label: 'DOI', value: paper.value.doi }
].filter(item => item.value))
</script>

<template>
  <DocumentReaderLayout :reader-label="'\u8bba\u6587\u9605\u8bfb\u533a'" :aside-label="'\u8bba\u6587\u8be6\u60c5'">
    <template #reader>
      <PdfReader
        v-model:page="currentPage"
        :src="paper.previewUrl"
        :fallback-image="paper.previewImage"
      />
    </template>

    <template #aside>
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

      <section class="info-section">
        <h2>基础信息</h2>
        <dl class="info-grid">
          <div v-for="item in paperInfoRows" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="detail-section">
        <h2>摘要</h2>
        <p>{{ paper.abstract }}</p>
      </section>

      <section class="detail-section">
        <h2>关键词</h2>
        <div v-if="paper.keywords.length" class="keyword-list">
          <span v-for="keyword in paper.keywords" :key="keyword">{{ keyword }}</span>
        </div>
        <p v-else class="empty-text">暂无关键词，当前条目展示基础题录信息。</p>
      </section>

      <section class="paper-actions" aria-label="论文操作">
        <a
          class="download-button"
          :href="paper.pdfUrl || undefined"
          :aria-disabled="!paper.pdfUrl"
          :download="paper.pdfUrl ? '' : undefined"
        >
          {{ paper.pdfUrl ? `下载全文 PDF (${paper.downloads})` : '暂无 PDF 文件' }}
        </a>
        <div class="secondary-actions">
          <button type="button">打印全文</button>
          <button type="button">分享成果</button>
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
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-control);
}

.paper-hero h1 {
  color: #333;
  font-family: var(--font-serif);
  font-size: var(--font-size-7xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

.paper-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #9a9692;
  font-size: var(--font-size-md);
  line-height: var(--line-height-control);
}

.paper-meta i {
  width: 1px;
  height: 12px;
  margin-top: 2px;
  background-color: #eee;
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

.paper-actions {
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
  .paper-hero h1 {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-heading);
  }

  .metric-grid,
  .secondary-actions {
    grid-template-columns: 1fr;
  }
}
</style>
