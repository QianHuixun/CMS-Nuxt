<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentReaderLayout from '@/components/DocumentReaderLayout.vue'
import PdfReader from '@/components/PdfReader.vue'
import { fetchProjectDetail } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const route = useRoute()
const router = useRouter()

const normalizeList = (value, separator = /[;；、]/) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') return value.split(separator).map(item => item.trim()).filter(Boolean)
  return []
}

const normalizeText = (value) => String(value ?? '').trim()
const isPdfUrl = (url = '') => /\.pdf($|[?#])/i.test(url)
const isPreviewUrl = (url = '') => /\.(pdf|png|jpe?g|gif|webp|bmp|svg)($|[?#])/i.test(url)

const getAttachmentUrl = (attachments, checker) => {
  const file = (Array.isArray(attachments) ? attachments : []).find((item) => {
    const url = item?.url || item?.fileUrl || item?.downloadUrl || ''
    const name = item?.name || ''
    return checker(url) || checker(name)
  })
  return file?.url || file?.fileUrl || file?.downloadUrl || ''
}

const getPreviewUrl = (data) => {
  const directUrl = data?.previewUrl || data?.pdfUrl || data?.fileUrl || data?.downloadUrl || data?.url || ''
  if (isPreviewUrl(directUrl)) return directUrl

  const attachmentUrl = getAttachmentUrl(data?.attachments, isPreviewUrl)
  return isPreviewUrl(attachmentUrl) ? attachmentUrl : ''
}

const getPdfUrl = (data) => {
  const directUrl = data?.pdfUrl || data?.fileUrl || data?.downloadUrl || data?.url || ''
  if (isPdfUrl(directUrl)) return directUrl

  const attachmentUrl = getAttachmentUrl(data?.attachments, isPdfUrl)
  return isPdfUrl(attachmentUrl) ? attachmentUrl : ''
}

const project = ref({
  title: '',
  category: '获批课题',
  leader: '',
  institution: '',
  date: '',
  period: '',
  projectNo: '',
  members: [],
  previewUrl: '',
  pdfUrl: '',
  abstract: '',
  keywords: [],
  downloads: 'PDF',
})

onMounted(async () => {
  try {
    const data = await fetchProjectDetail(route.params.id || 'project_001')
    if (!data) return

    const startYear = data.startYear ? String(data.startYear) : ''
    const endYear = data.endYear ? String(data.endYear) : ''
    const period = [startYear, endYear].filter(Boolean).join('-')

    project.value = {
      title: normalizeText(data.title),
      category: data.type || data.level || '获批课题',
      leader: normalizeText(data.leader),
      institution: normalizeText(data.institution),
      date: startYear ? `${startYear}年` : '',
      period,
      projectNo: normalizeText(data.projectNo),
      members: normalizeList(data.members?.length ? data.members : data.participant),
      previewUrl: getPreviewUrl(data),
      pdfUrl: getPdfUrl(data),
      abstract: normalizeText(data.description || data.summary) || `${data.title}，负责人：${data.leader || '待补充'}，立项周期：${period || '待补充'}。`,
      keywords: normalizeList(data.keywords),
      downloads: 'PDF',
    }
  } catch (e) {
    console.error('获取课题详情失败', e)
  }
})

const closePage = () => {
  safeBack(router, '/achievements?tab=topics')
}

const projectInfoRows = computed(() => [
  { label: '课题类型', value: project.value.category },
  { label: '负责人', value: project.value.leader },
  { label: '承担单位', value: project.value.institution },
  { label: '项目周期', value: project.value.period },
  { label: '项目编号', value: project.value.projectNo },
  { label: '参与人员', value: project.value.members.join(' / ') }
].filter(item => item.value))
</script>

<template>
  <DocumentReaderLayout :reader-label="'\u8bfe\u9898\u9605\u8bfb\u533a'" :aside-label="'\u8bfe\u9898\u8be6\u60c5'">
    <template #reader>
      <PdfReader
        :src="project.previewUrl"
      />
    </template>

    <template #aside>
      <div class="aside-close">
        <button type="button" aria-label="关闭课题详情" @click="closePage">×</button>
      </div>

      <section class="project-hero">
        <span>{{ project.category }}</span>
        <h1>{{ project.title }}</h1>
        <p class="project-subtitle">{{ project.period || '项目周期待补充' }}</p>
        <div class="project-meta">
          <p>{{ project.leader }}</p>
          <i aria-hidden="true"></i>
          <p>{{ project.institution }}</p>
          <i aria-hidden="true"></i>
          <time>{{ project.date }}</time>
        </div>
      </section>

      <section class="info-section">
        <h2>基础信息</h2>
        <dl class="info-grid">
          <div v-for="item in projectInfoRows" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="detail-section">
        <h2>课题简介</h2>
        <p>{{ project.abstract }}</p>
      </section>

      <section class="detail-section">
        <h2>关键词</h2>
        <div v-if="project.keywords.length" class="keyword-list">
          <span v-for="keyword in project.keywords" :key="keyword">{{ keyword }}</span>
        </div>
        <p v-else class="empty-text">暂无关键词，当前条目展示基础立项信息。</p>
      </section>

      <section class="project-actions">
        <a
          class="download-button"
          :href="project.pdfUrl || undefined"
          :aria-disabled="!project.pdfUrl"
          :download="project.pdfUrl ? '' : undefined"
        >
          {{ project.pdfUrl ? `下载课题文件 (${project.downloads})` : '暂无课题文件' }}
        </a>
        <div class="secondary-actions">
          <button type="button">引用导出</button>
          <button type="button">收藏课题</button>
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

.project-hero {
  padding-bottom: 28px;
}

.project-hero > span {
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

.project-hero h1 {
  color: #333;
  font-family: var(--font-serif);
  font-size: var(--font-size-7xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

.project-subtitle {
  margin-top: 8px;
  color: #9a9692;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-regular);
}

.project-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #9a9692;
  font-size: var(--font-size-md);
  line-height: var(--line-height-control);
}

.project-meta i {
  width: 1px;
  height: 12px;
  margin-top: 2px;
  background-color: #eee;
}

.detail-section,
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

.project-actions {
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
  .project-hero h1 {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-heading);
  }

  .secondary-actions {
    grid-template-columns: 1fr;
  }
}
</style>
