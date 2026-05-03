<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PdfReader from '@/components/PdfReader.vue'
import documentPage from '@/assets/images/pages/paper-detail/document-page.png'

const route = useRoute()
const router = useRouter()
const currentPage = ref(1)

const monographData = [
  {
    id: 'mono-001',
    expertId: 'chen-wei',
    title: '《天回医简经脉系统研究》',
    subTitle: 'Research on the Meridian System in the Tianhui Medical Bamboo Slips',
    category: '学术专著',
    // 专著特有的字段
    authors: ['中国出土医学文献与文物研究中心'],
    publisher: '科学出版社',
    publishLocation: '北京',
    isbn: '978-7-03-076123-4',
    publishDate: '2023年10月',
    edition: '第1版',
    pages: 480,
    language: '中文',
    series: '出土医学文献与文物研究丛书',
    // 通用字段
    downloads: '14.2 MB',
    citations: 234,
    reads: '8.6k',
    pdfUrl: '',
    previewImage: documentPage,
    abstract:
      '本书是对成都老官山"天回医简"中有关经脉系统理论的深度挖掘与学术系统性整理。天回医简作为我国考古史上极其罕见的西汉医学文献，其内容直接关联到《黄帝内经》成书前的经脉原型，为研究中医经络学说的起源与演变提供了珍贵的一手资料。\n\n研究团队通过对竹简原文的细致考释，系统重构了简文中所述的经脉循行径路、主治病症及针灸施治原信。研究成果揭示了扁鹊医籍在蜀地的传承谱系，并对比了其与传世文献的异同，有力地证明了我国古代经脉理论在西汉早期已具备高度的逻辑性与实操性。本书不仅是出土医学文献研究的重大突破，更是中医药文化数字化保护与传承的关键学术支柱。',
    keywords: ['天回医简', '经脉系统', '出土文献', '经络学说', '针灸理论'],
  },
  {
    id: 'mono-002',
    expertId: 'zhang-tinghe',
    title: '《黄帝内经》现代诠释与临床应用研究',
    subTitle: 'Modern Interpretation and Clinical Application of Huangdi Neijing',
    category: '学术专著',
    // 专著特有的字段
    authors: ['陈伟 主编', '李明 副主编'],
    publisher: '人民卫生出版社',
    publishLocation: '北京',
    isbn: '978-7-117-34567-8',
    publishDate: '2023年6月',
    edition: '第1版',
    pages: 586,
    language: '中文',
    series: '中医药经典现代研究丛书',
    // 通用字段
    downloads: '45.8 MB',
    citations: 156,
    reads: '5.3k',
    pdfUrl: '',
    previewImage: documentPage,
    abstract:
      '本书以《黄帝内经》原文为基础，结合现代医学研究成果，对中医基础理论进行了系统深入的现代诠释。全书分上下两篇，上篇为理论阐释，对阴阳五行、藏象经络、病因病机等核心概念进行现代解读；下篇为临床应用，详细介绍了内经理论在常见病、疑难病诊疗中的具体应用。',
    keywords: ['黄帝内经', '中医经典', '现代诠释', '临床应用'],
  },
]

const monograph = computed(() => {
  return monographData.find((item) => item.id === route.params.id) ?? monographData[0]
})

const closePage = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/academic')
}
</script>

<template>
  <main class="monograph-page">
    <section class="monograph-workspace" aria-label="专著阅读区">
      <PdfReader
        v-model:page="currentPage"
        :src="monograph.pdfUrl"
        :fallback-image="monograph.previewImage"
      />
    </section>

    <aside class="monograph-aside" aria-label="专著详情">
      <div class="aside-close">
        <button type="button" aria-label="关闭专著详情" @click="closePage">×</button>
      </div>

      <section class="monograph-hero">
        <span class="category-tag">{{ monograph.category }}</span>
        <h1>{{ monograph.title }}</h1>
        <p class="sub-title">{{ monograph.subTitle }}</p>
        
        <div class="monograph-meta-grid">
          <div class="meta-item">
            <span class="meta-label">著者/主编</span>
            <p class="meta-value">{{ monograph.authors[0] }}</p>
          </div>
          <div class="meta-item">
            <span class="meta-label">出版单位</span>
            <p class="meta-value">{{ monograph.publisher }}</p>
          </div>
          <div class="meta-item">
            <span class="meta-label">出版日期</span>
            <p class="meta-value">{{ monograph.publishDate }}</p>
          </div>
          <div class="meta-item">
            <span class="meta-label">ISBN</span>
            <p class="meta-value isbn-code">{{ monograph.isbn }}</p>
          </div>
        </div>
      </section>

      <section class="detail-section abstract-section">
        <h2>
          <span class="section-icon">—</span>
          内容简介
        </h2>
        <p>{{ monograph.abstract }}</p>
      </section>

      <section class="monograph-actions" aria-label="专著操作">
        <a
          class="download-button"
          :href="monograph.pdfUrl || undefined"
          :aria-disabled="!monograph.pdfUrl"
          :download="monograph.pdfUrl ? '' : undefined"
        >
          <span class="download-icon">⬇</span>
          下载全本-PDF ({{ monograph.downloads }})
        </a>
        <div class="secondary-actions">
          <button type="button" class="action-btn">
            <span class="btn-icon">📚</span>
            馆藏书目查询
          </button>
          <button type="button" class="action-btn">
            <span class="btn-icon">↗</span>
            分享本书
          </button>
        </div>
      </section>
    </aside>
  </main>
</template>

<style scoped>
.monograph-page {
  height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  background-color: #f0f0f0;
  color: #2b2520;
  overflow: hidden;
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.monograph-workspace {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f2ed;
  overflow: hidden;
}

.monograph-aside::-webkit-scrollbar {
  display: none;
}

.monograph-aside {
  min-height: 0;
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 16px 48px rgba(43, 37, 32, 0.12);
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 3;
}

.aside-close {
  min-height: 40px;
  padding: 0 0 16px;
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

.monograph-hero {
  padding-bottom: 24px;
}

.category-tag {
  margin-bottom: 16px;
  padding: 4px 12px;
  display: inline-flex;
  border-radius: 4px;
  background-color: #f5f0ed;
  color: #8b6f5c;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
}

.monograph-hero h1 {
  color: #333;
  font-family: "Noto Serif SC", "SimSun", serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 8px;
}

.sub-title {
  color: #a0a0a0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 24px;
  font-style: italic;
}

.monograph-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
  padding-top: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-label {
  color: #8b5a5a;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label::before {
  content: "—";
  color: #8b5a5a;
  font-weight: 600;
}

.meta-value {
  color: #333;
  font-size: 13px;
  line-height: 1.5;
  padding-left: 18px;
}

.isbn-code {
  color: #333;
  font-family: "Noto Serif SC", serif;
  letter-spacing: 0.5px;
}

.abstract-section {
  margin-bottom: 24px;
}

.abstract-section h2 {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b5a5a;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.section-icon {
  color: #8b5a5a;
  font-weight: 600;
}

.abstract-section p {
  color: #666;
  font-size: 13px;
  line-height: 1.9;
  text-align: justify;
  white-space: pre-line;
}

.monograph-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
}

.download-button {
  min-height: 48px;
  border: 0;
  border-radius: 4px;
  background-color: #8b3a3a;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.download-icon {
  font-size: 16px;
}

.download-button:hover:not([aria-disabled="true"]) {
  background-color: #6e2a2a;
}

.download-button[aria-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  min-height: 42px;
  border: 1px solid #e8e4e0;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #faf8f5;
  border-color: #d8d4d0;
}

.btn-icon {
  font-size: 14px;
}

@media (max-width: 1180px) {
  .monograph-page {
    min-height: 100vh;
    height: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  .monograph-workspace {
    min-height: 720px;
    overflow: visible;
  }

  .monograph-aside {
    min-height: auto;
    padding: 24px 32px 40px;
    overflow: visible;
  }
}

@media (max-width: 680px) {
  .monograph-hero h1 {
    font-size: 22px;
    line-height: 1.4;
  }

  .sub-title {
    font-size: 12px;
  }

  .monograph-meta-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .secondary-actions {
    grid-template-columns: 1fr;
  }

  .monograph-aside {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
