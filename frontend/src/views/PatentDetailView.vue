<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PdfReader from '@/components/PdfReader.vue'
import documentPage from '@/assets/images/pages/paper-detail/document-page.png'

const route = useRoute()
const router = useRouter()
const currentPage = ref(1)

const patentData = [
  {
    id: 'patent-001',
    expertId: 'chen-wei',
    title: '一种中医经络穴位自动定位装置及方法',
    category: '发明专利详情',
    // 专利特有的字段
    patentNumber: 'ZL 2023 1 0123456.7',
    applicants: ['成都中医药大学', '四川中医药研究所'],
    inventors: ['陈伟 教授', '李明 博士', '王芳 研究员'],
    patentType: '发明专利',
    publicationDate: '2023年8月15日',
    authorizationDate: '2024年3月20日',
    legalStatus: '授权',
    ipcClassification: 'A61H39/00(2006.01)I',
    // 通用字段
    downloads: '8.5 MB',
    citations: 45,
    reads: '3.2k',
    pdfUrl: '',
    previewImage: documentPage,
    abstract:
      '本发明公开了一种中医经络穴位自动定位装置及方法，涉及中医诊疗设备技术领域。该装置包括：影像采集模块，用于获取人体体表图像；特征提取模块，用于识别体表解剖标志点；穴位定位算法模块，基于深度学习模型预测穴位坐标；以及反馈输出模块，用于显示定位结果并引导针刺操作。本发明能够实现穴位的精准自动定位，定位精度达到±2mm，大幅提高了针灸治疗的标准化程度和临床疗效。',
    keywords: ['穴位定位', '深度学习', '中医诊疗', '智能针灸', '图像识别'],
  },
  {
    id: 'patent-002',
    expertId: 'zhang-tinghe',
    title: '基于多光谱成像的中药材质量快速检测系统',
    category: '实用新型专利详情',
    // 专利特有的字段
    patentNumber: 'ZL 2024 2 0089012.3',
    applicants: ['国家重点中医药实验室'],
    inventors: ['张廷和 教授', '赵强 副教授'],
    patentType: '实用新型',
    publicationDate: '2024年2月10日',
    authorizationDate: '2024年7月5日',
    legalStatus: '授权',
    ipcClassification: 'G01N21/25(2006.01)U',
    // 通用字段
    downloads: '6.2 MB',
    citations: 23,
    reads: '1.5k',
    pdfUrl: '',
    previewImage: documentPage,
    abstract:
      '本实用新型涉及中药材质量检测技术领域，提供了一种基于多光谱成像的中药材质量快速检测系统。系统包括：多光谱光源模组、高光谱成像单元、样品传送装置、数据处理工作站。该系统能够在数秒内完成中药材的真伪鉴别和品质分级，检测准确率超过95%，显著提升了中药材质量控制的效率和标准化水平。',
    keywords: ['多光谱成像', '中药材检测', '质量分级', '快速检测'],
  },
]

const patent = computed(() => {
  return patentData.find((item) => item.id === route.params.id) ?? patentData[0]
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
  <main class="patent-page">
    <section class="patent-workspace" aria-label="专利文献阅读区">
      <PdfReader
        v-model:page="currentPage"
        :src="patent.pdfUrl"
        :fallback-image="patent.previewImage"
      />
    </section>

    <aside class="patent-aside" aria-label="专利详情">
      <div class="aside-close">
        <button type="button" aria-label="关闭专利详情" @click="closePage">×</button>
      </div>

      <section class="patent-hero">
        <span class="category-tag">{{ patent.category }}</span>
        <h1>{{ patent.title }}</h1>
        <div class="patent-meta-grid">
          <div class="meta-col">
            <span class="meta-label">主要发明人</span>
            <p>{{ patent.inventors.join('、') }}</p>
          </div>
          <div class="meta-col">
            <span class="meta-label">专利编号</span>
            <p>{{ patent.patentNumber }}</p>
          </div>
        </div>
      </section>

      <section class="detail-section patent-abstract">
        <h2><span class="section-line"></span>摘要信息</h2>
        <p>{{ patent.abstract }}</p>
      </section>

      <section class="detail-section patent-keywords">
        <h2><span class="section-line"></span>核心关键词</h2>
        <div class="keyword-list">
          <span v-for="keyword in patent.keywords" :key="keyword">{{ keyword }}</span>
        </div>
      </section>

      <section class="patent-actions" aria-label="专利操作">
        <a
          class="download-button"
          :href="patent.pdfUrl || undefined"
          :aria-disabled="!patent.pdfUrl"
          :download="patent.pdfUrl ? '' : undefined"
        >
          下载专利全文
        </a>
      </section>
    </aside>
  </main>
</template>

<style scoped>
.patent-page {
  height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  background-color: #f0f0f0;
  color: #2b2520;
  overflow: hidden;
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.patent-workspace {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f2ed;
  overflow: hidden;
}

.patent-aside::-webkit-scrollbar {
  display: none;
}

.patent-aside {
  min-height: 0;
  padding: 0 28px 28px;
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

.patent-hero {
  padding-bottom: 24px;
}

.category-tag {
  margin-bottom: 12px;
  padding: 4px 10px;
  display: inline-flex;
  border-radius: 4px;
  background-color: var(--color-primary);
  color: #fff;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
}

.patent-hero h1 {
  color: #333;
  font-family: "Noto Serif SC", "SimSun", serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 20px;
}

.patent-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-col .meta-label {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
}

.meta-col p {
  color: #4f4945;
  font-size: 13px;
  line-height: 1.5;
}

.patent-abstract {
  margin-bottom: 24px;
}

.patent-keywords {
  margin-bottom: 24px;
}

.detail-section h2 {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-primary);
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.section-line {
  width: 3px;
  height: 16px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

.detail-section p {
  color: #666;
  font-size: 13px;
  line-height: 1.8;
  text-align: justify;
  padding-left: 13px;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 13px;
}

.keyword-list span {
  padding: 6px 14px;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.keyword-list span:hover {
  background-color: #ebebeb;
}

.patent-actions {
  margin-top: auto;
  padding-top: 20px;
}

.download-button {
  min-height: 44px;
  width: 100%;
  border: 0;
  border-radius: 6px;
  background-color: var(--color-primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.download-button:hover:not([aria-disabled="true"]) {
  background-color: #6e1414;
}

.download-button[aria-disabled="true"] {
  opacity: 0.72;
  cursor: not-allowed;
}

@media (max-width: 1180px) {
  .patent-page {
    min-height: 100vh;
    height: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  .patent-workspace {
    min-height: 720px;
    overflow: visible;
  }

  .patent-aside {
    min-height: auto;
    padding: 0 28px 32px;
    overflow: visible;
  }
}

@media (max-width: 680px) {
  .patent-hero h1 {
    font-size: 18px;
    line-height: 1.5;
  }

  .patent-meta-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .patent-aside {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
