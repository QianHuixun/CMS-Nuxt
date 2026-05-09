<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchActivityTimeline } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const router = useRouter()

const pageInfo = ref({
  eyebrow: 'Chronicles of Excellence',
  title: '活动足迹·时光影卷',
  description: '穿梭于传统与创新的交汇点，记录实验室每一个具有里程碑意义的瞬间。\n每一张照片都是智慧的沉淀，每一段历程都是对未来的承诺。'
})

const eventCards = ref([
  {
    className: 'event-card-primary',
    title: '科普影响力',
    description: '为期两周的展览吸引了超过5000名观众，现场展示的分子生药学交互装置广受好评。',
    highlights: [
      { value: '5,000+', label: '观展人次' },
      { value: '2周', label: '展览周期' },
    ],
  },
  {
    className: 'event-card-secondary',
    title: '跨学科研讨',
    description: '邀请医学史、文物保护、人工智能团队共同参与，围绕出土医学文献数字化方法展开交流。',
    highlights: [
      { value: '12场', label: '专题报告' },
      { value: '8组', label: '协作团队' },
    ],
  },
])

const timelineDots = ref([
  { className: 'dot-large dot-one' },
  { className: 'dot-medium dot-two' },
  { className: 'dot-large dot-three' },
  { className: 'dot-small dot-four' },
])

const descriptionLines = computed(() => String(pageInfo.value.description || '').split('\n'))

onMounted(async () => {
  try {
    const data = await fetchActivityTimeline()
    pageInfo.value = {
      eyebrow: data.eyebrow || pageInfo.value.eyebrow,
      title: data.title || pageInfo.value.title,
      description: data.description || pageInfo.value.description
    }
    eventCards.value = data.eventCards || eventCards.value
    timelineDots.value = data.timelineDots || timelineDots.value
  } catch (e) {
    console.error(e)
  }
})

const back = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <main class="chronicle-page">
    <section class="timeline-canvas" aria-labelledby="timeline-title">
      <section class="hero-copy">
        <p>{{ pageInfo.eyebrow }}</p>
        <h1 id="timeline-title">{{ pageInfo.title }}</h1>
        <div class="hero-description">
          <template v-for="line in descriptionLines" :key="line">
            {{ line }}<br>
          </template>
        </div>
        <div class="scroll-hint">
          <span>SCROLL TO EXPLORE</span>
          <i aria-hidden="true"></i>
        </div>
      </section>

      <svg class="timeline-path" viewBox="0 0 978 2188" fill="none" aria-hidden="true">
        <path
          d="M487 0C503 146 471 196 311 252C108 322 20 454 136 604C268 772 633 688 794 829C992 1002 847 1248 562 1325C299 1396 83 1468 158 1633C239 1812 632 1741 642 1895C651 2041 447 1974 417 2065C391 2142 530 2135 622 2124C714 2113 771 2132 778 2188"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
        />
      </svg>
      <span class="path-accent" aria-hidden="true"></span>

      <span
        v-for="dot in timelineDots"
        :key="dot.className"
        :class="['timeline-dot', dot.className]"
        aria-hidden="true"
      ></span>

      <article
        v-for="card in eventCards"
        :key="card.title"
        :class="['event-card', card.className]"
      >
        <div class="card-content">
          <h2>{{ card.title }}</h2>
          <p>{{ card.description }}</p>
          <div class="impact-grid">
            <div v-for="item in card.highlights" :key="item.label">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </article>

      <div class="page-actions">
        <button type="button" class="ghost-button" @click="back">
          <span aria-hidden="true">‹</span>
          返回上一页
        </button>
        <router-link class="home-button" to="/home">
          <span aria-hidden="true">⌂</span>
          返回首页
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
.chronicle-page {
  min-height: 100vh;
  background:
    linear-gradient(rgba(251, 249, 244, 0.9), rgba(251, 249, 244, 0.92)),
    url('@/assets/images/backgrounds/home/home-bg2.png') center top / cover fixed,
    #fbf9f4;
  color: #842130;
  font-family: "Noto Serif SC", "SimSun", "宋体", serif;
}

.timeline-canvas {
  --canvas-width: min(100vw, 1920px);
  position: relative;
  width: 100%;
  max-width: 1920px;
  min-height: max(1600px, calc(var(--canvas-width) * 1.12));
  margin: 0 auto;
  overflow: hidden;
}

.hero-copy {
  position: absolute;
  top: 3.4%;
  left: 50%;
  width: min(760px, 80vw);
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}

.hero-copy p {
  width: fit-content;
  margin: 0 auto 22px;
  padding: 4px 16px;
  border-radius: 12px;
  background-color: rgba(132, 33, 48, 0.1);
  color: #842130;
  font-family: Inter, "Microsoft YaHei", sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-copy h1 {
  color: #842130;
  font-size: clamp(42px, 3.75vw, 72px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.15em;
}

.hero-description {
  margin-top: 24px;
  color: rgba(116, 88, 83, 0.8);
  font-size: 18px;
  line-height: 1.62;
}

.scroll-hint {
  margin-top: 40px;
  display: grid;
  justify-items: center;
  gap: 16px;
  color: rgba(168, 162, 158, 0.82);
  font-family: Inter, "Microsoft YaHei", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
}

.scroll-hint i {
  width: 12px;
  height: 14px;
  position: relative;
}

.scroll-hint i::before,
.scroll-hint i::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-right: 1px solid #842130;
  border-bottom: 1px solid #842130;
  transform: rotate(45deg);
}

.scroll-hint i::after {
  top: 6px;
}

.timeline-path {
  position: absolute;
  top: 15.35%;
  left: 24.5%;
  width: 51%;
  height: 74%;
  color: rgba(132, 33, 48, 0.11);
  z-index: 0;
}

.path-accent {
  position: absolute;
  top: 18.7%;
  left: 40.4%;
  width: 5.3%;
  height: 0.55%;
  border-radius: 999px;
  background-color: #c8828c;
  transform: rotate(-13deg);
  z-index: 1;
}

.timeline-dot {
  position: absolute;
  border-radius: 50%;
  background-color: #d1acac;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.dot-large {
  width: clamp(86px, 8.9vw, 171px);
  aspect-ratio: 1;
}

.dot-medium {
  width: clamp(70px, 7.3vw, 140px);
  aspect-ratio: 1;
}

.dot-small {
  width: clamp(60px, 6.15vw, 118px);
  aspect-ratio: 1;
}

.dot-one {
  top: calc(15.35% + 74% * (252 / 2188));
  left: calc(24.5% + 51% * (311 / 978));
  background-color: #d2aeae;
}

.dot-two {
  top: calc(15.35% + 74% * (829 / 2188));
  left: calc(24.5% + 51% * (794 / 978));
}

.dot-three {
  top: calc(15.35% + 74% * (1325 / 2188));
  left: calc(24.5% + 51% * (562 / 978));
}

.dot-four {
  top: calc(15.35% + 74% * (1895 / 2188));
  left: calc(24.5% + 51% * (642 / 978));
}

.event-card {
  position: absolute;
  width: 23.5%;
  min-width: 360px;
  min-height: 420px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #f0eee9;
  box-shadow: 0 20px 50px -12px rgba(132, 33, 48, 0.15);
  z-index: 2;
}

.event-card-primary {
  top: 25.5%;
  left: 15%;
}

.event-card-secondary {
  top: 57.5%;
  left: 58%;
}

.card-content {
  width: 100%;
  padding: 32px;
}

.card-content h2 {
  margin-bottom: 16px;
  color: #842130;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
}

.card-content p {
  max-width: 340px;
  color: #745853;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  line-height: 1.45;
}

.impact-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.impact-grid div {
  min-height: 80px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f5f5f4;
}

.impact-grid strong {
  color: #842130;
  font-family: Inter, "Microsoft YaHei", sans-serif;
  font-size: 24px;
  line-height: 1.1;
}

.impact-grid span {
  margin-top: 6px;
  color: #745853;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 12px;
}

.page-actions {
  position: absolute;
  right: 32px;
  bottom: 24px;
  display: flex;
  gap: 16px;
  z-index: 3;
}

.ghost-button,
.home-button {
  min-height: 45px;
  padding: 12px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(221, 192, 192, 0.15);
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
}

.ghost-button {
  background-color: #fff;
  color: #842130;
}

.home-button {
  border-color: #842130;
  background-color: #842130;
  color: #fff;
}

@media (max-width: 1200px) {
  .event-card {
    min-width: 320px;
  }
}

@media (max-width: 860px) {
  .timeline-canvas {
    min-height: 1780px;
  }

  .hero-copy {
    top: 56px;
    width: calc(100% - 32px);
  }

  .hero-copy p {
    margin-bottom: 24px;
    font-size: 10px;
  }

  .hero-copy h1 {
    font-size: 42px;
    letter-spacing: 0.05em;
  }

  .hero-description {
    font-size: 15px;
  }

  .timeline-path {
    top: 270px;
    left: 4%;
    width: 92%;
    height: 1180px;
  }

  .path-accent {
    top: 334px;
    left: 43%;
    width: 80px;
    height: 10px;
  }

  .timeline-dot {
    display: none;
  }

  .event-card {
    position: relative;
    inset: auto;
    width: calc(100% - 40px);
    min-width: 0;
    max-width: 490px;
    margin: 0 auto;
    min-height: 420px;
  }

  .event-card-primary {
    top: auto;
    margin-top: 520px;
  }

  .event-card-secondary {
    margin-top: 220px;
  }

  .page-actions {
    position: relative;
    right: auto;
    bottom: auto;
    width: calc(100% - 40px);
    margin: 56px auto 32px;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .hero-copy h1 {
    font-size: 34px;
    line-height: 1.2;
  }

  .hero-description br {
    display: none;
  }

  .card-content {
    padding: 24px;
  }

  .impact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
