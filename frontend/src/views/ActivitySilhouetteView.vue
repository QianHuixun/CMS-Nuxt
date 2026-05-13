<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import heroImage from '@/assets/images/pages/activity/hero-image-176857.png'
import largeImage from '@/assets/images/pages/activity/large-image-50daff.png'
import sideImageOne from '@/assets/images/pages/activity/side-image-1-56586a.png'
import sideImageTwo from '@/assets/images/pages/activity/side-image-2-56586a.png'
import pageBg from '@/assets/images/backgrounds/mult-page/page-bg.png'
import { fetchActivityDetail } from '@/api/index.js'

const route = useRoute()
const fallbackGalleryImages = [
  sideImageOne,
  sideImageTwo,
]
const activity = ref(null)

const pageTitle = computed(() => activity.value?.name || activity.value?.title || '第十二届中医药创新论坛：数字人文视角下的简帛医学文献研究')
const heroSrc = computed(() => activity.value?.coverImage || heroImage)
const featureSrc = computed(() => activity.value?.gallery?.[0] || sideImageTwo)
const galleryImages = computed(() => {
  const images = Array.isArray(activity.value?.gallery) ? activity.value.gallery.slice(1, 3) : []
  return [...images, ...fallbackGalleryImages].slice(0, 2)
})

const forumLabel = 'TCM INNOVATION FORUM 2024'
const metadataItems = [
  { label: 'ORGANIZER', value: '中国出土医学文献与文物研究中心' },
  { label: 'LOCATION', value: '古籍数字化国家实验室' },
  { label: 'DATE', value: '2024年10月24日' },
]

const introLead = '本届论坛聚焦“数字人文视角下的简帛医学文献研究”，探讨出土医学文物在现代中医临床中的应用价值。通过高光谱成像与数字化复原技术，为失传医籍的重建提供科技支撑。'
const introSupport = '研究中心近年来在成都老官山汉墓、甘肃武威汉简等关键领域取得突破性进展。本次会议将首次公开部分未发表的竹简红外扫描影像资料。数字化平台使我们能够超越物理层面的磨损，重现汉唐时期的用药逻辑。'
const bodyParagraphOne = '研究中心自成立以来，始终致力于构建多维度、立体化的中医药文献数据库。在古籍数字化国家实验室的技术支持下，我们实现了从二维图像到三维结构、从孤立碎片到语义网络的跨越式发展。此次论坛不仅是一次学术成果的检阅，更是一次方法论的深度反思。'
const bodyParagraphTwo = '我们如何在尊重传统真实性的前提下，利用生成式人工智能赋能医典考证？如何将博物馆中的“冷”文物转化为临床中的“活”处方？针对这些课题，与会学者展开了激烈的辩论。'
const closingParagraph = '论坛期间，来自全球的50余家学术机构共同签署了《中医出土文献数字化开放协作协议》。实验室展示了最新的VR沉浸式古方模拟系统，让与会者身临其境体验古代炮制工艺。通过该系统，复杂的古方演化过程得以视觉化呈现，极大提升了文献研究的直观性。'

function goBack() {
  window.history.back()
}

function goHome() {
  window.location.href = '/home'
}

onMounted(async () => {
  try {
    activity.value = await fetchActivityDetail(route.params.id || 'activity_001')
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <main class="activity-page" :style="{ '--page-bg': `url(${pageBg})` }">
    <section class="page-header">
      <div class="header-label">{{ forumLabel }}</div>
      <h1>{{ pageTitle }}</h1>
    </section>

    <section class="meta-band" aria-label="会议信息">
      <div class="meta-band-inner">
        <div class="meta-grid">
          <article v-for="item in metadataItems" :key="item.label" class="meta-item">
            <p>{{ item.label }}</p>
            <h3>{{ item.value }}</h3>
          </article>
        </div>
      </div>
    </section>

    <section class="quote-block">
      <div class="quote-line"></div>
      <div class="quote-content">
        <p class="quote-lead">{{ introLead }}</p>
        <p class="quote-support">{{ introSupport }}</p>
      </div>
    </section>

    <section class="image-block image-block--single">
      <figure class="feature-image feature-image--compact">
        <img :src="featureSrc">
        <figcaption>Reference Fragment: LGS-042-</figcaption>
      </figure>
    </section>

    <section class="body-block">
      <h2>文献复原与跨学科协作</h2>
      <p>{{ bodyParagraphOne }}</p>
      <p>{{ bodyParagraphTwo }}</p>
      <div class="dual-images">
        <figure>
          <img :src="heroSrc" alt="大会堂开会全景图">
        </figure>
        <figure>
          <img :src="galleryImages[0] || sideImageOne" alt="手持放大镜观察古籍纸张特写图">
        </figure>
      </div>
      <p class="body-caption">古籍数字化国家实验室：高精度光谱采集系统演示</p>
    </section>

    <section class="closing-block">
      <p>{{ closingParagraph }}</p>
    </section>

    <section class="bottom-stage">
      <img :src="largeImage" alt="扫描古代卷轴的特写照片">
    </section>

    <div class="action-buttons">
      <button class="button button--ghost" type="button" @click="goBack">
        <span class="button-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 13L5.5 8L10.5 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        返回上一页
      </button>
      <button class="button button--solid" type="button" @click="goHome">
        <span class="button-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 7.25L8 3L13.5 7.25V13.5H9.75V9.75H6.25V13.5H2.5V7.25Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </span>
        返回首页
      </button>
    </div>
  </main>
</template>
  
<style scoped>
.activity-page {
  min-height: calc(100vh - 57px);
  padding: 42px 34px 30px;
  background-image:
    linear-gradient(rgba(255, 253, 247, 0.28), rgba(255, 253, 247, 0.32)),
    var(--page-bg);
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  color: #171412;
  font-family: var(--font-serif);
}

.page-header,
.quote-block,
.image-block,
.body-block,
.closing-block,
.bottom-stage,
.action-buttons {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  padding: 4px 0 26px;
}

.header-label {
  color: #a52a3b;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 2.4px;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-family: var(--font-sans);
}

.page-header h1 {
  font-size: clamp(34px, 3.45vw, 58px);
  line-height: 1.13;
  font-weight: var(--font-weight-bold);
  max-width: 1080px;
  margin: 0;
  letter-spacing: 0;
}

.meta-band {
  width: calc(100% + 68px);
  margin-left: -34px;
  margin-right: -34px;
  padding: 28px 0 30px;
  border-top: 1px solid rgba(89, 74, 59, 0.15);
  border-bottom: 1px solid rgba(89, 74, 59, 0.1);
}

.meta-band-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 34px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
}

.meta-item {
  padding-right: 18px;
}

.meta-item p {
  margin: 0 0 10px;
  font-size: var(--font-size-xs);
  color: rgba(62, 56, 50, 0.48);
  letter-spacing: 1.7px;
  text-transform: uppercase;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
}

.meta-item h3 {
  margin: 0;
  color: #282521;
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-control);
  font-weight: var(--font-weight-medium);
}

.quote-block {
  display: grid;
  grid-template-columns: 9px minmax(0, 1fr);
  gap: 22px;
  padding: 34px 0 24px;
}

.quote-line {
  background-color: #a52a3b;
  border-radius: 0;
}

.quote-content {
  padding-top: 2px;
}

.quote-lead {
  margin: 0 0 16px;
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-article);
  color: #221d1a;
  font-weight: var(--font-weight-semibold);
}

.quote-support {
  margin: 0;
  font-size: var(--font-size-xl);
  line-height: 2;
  color: #6e6660;
}

.image-block {
  padding: 14px 0 30px;
}

.feature-image {
  margin: 0;
}

.feature-image img,
.dual-images img,
.bottom-stage img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.feature-image--compact img {
  height: 410px;
  border: 1px solid rgba(23, 20, 18, 0.08);
}

.feature-image figcaption,
.body-caption {
  text-align: center;
  color: #8b8580;
  font-size: var(--font-size-sm);
  font-style: italic;
  margin-top: 12px;
}

.body-block {
  padding: 8px 0 26px;
}

.body-block h2 {
  margin: 0 0 18px;
  color: #a52a3b;
  font-size: var(--font-size-9xl);
  line-height: var(--line-height-title);
}

.body-block p {
  max-width: 980px;
  margin: 0 0 18px;
  color: #2a2420;
  font-size: var(--font-size-2xl);
  line-height: 2.05;
}

.dual-images {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 22px;
}

.dual-images figure {
  margin: 0;
  height: 310px;
  overflow: hidden;
  border: 1px solid rgba(23, 20, 18, 0.08);
}

.dual-images img {
  height: 100%;
}

.closing-block {
  padding: 12px 0 30px;
}

.closing-block p {
  max-width: 980px;
  margin: 0;
  color: #4d4742;
  font-size: var(--font-size-xl);
  line-height: 2.05;
}

.bottom-stage {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(23, 20, 18, 0.08);
}

.bottom-stage img {
  height: 360px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding-top: 22px;
}

.button {
  height: 42px;
  min-width: 126px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button--ghost {
  background: rgba(255, 255, 255, 0.96);
  color: #a52a3b;
  border-color: #a52a3b;
}

.button--ghost:hover {
  background: #fff;
}

.button--solid {
  background: #7d1f2c;
  color: #fff;
  border-color: #7d1f2c;
}

.button--solid:hover {
  background: #912638;
}

@media (max-width: 980px) {
  .activity-page {
    padding: 26px 20px;
  }

  .meta-grid,
  .dual-images {
    grid-template-columns: 1fr;
  }

  .meta-band {
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
    padding: 22px 0;
  }

  .meta-band-inner {
    padding: 0 20px;
  }

  .feature-image--compact img,
  .bottom-stage img {
    height: 300px;
  }

  .dual-images figure {
    height: 260px;
  }

  .action-buttons {
    padding-top: 18px;
  }
}

@media (max-width: 620px) {
  .page-header h1 {
    font-size: var(--font-size-8xl);
  }

  .meta-grid {
    gap: 20px;
  }

  .quote-lead,
  .quote-support,
  .body-block p,
  .closing-block p {
    font-size: var(--font-size-lg);
  }

  .feature-image--compact img,
  .bottom-stage img {
    height: 220px;
  }

  .dual-images figure {
    height: 210px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
