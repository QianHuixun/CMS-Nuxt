<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const impactHighlights = [
  { value: '5,000+', label: '观展人次' },
  { value: '2周', label: '展览周期' },
]

const timelineDots = [
  { className: 'dot-large dot-one' },
  { className: 'dot-large dot-two' },
  { className: 'dot-large dot-three' },
  { className: 'dot-medium dot-four' },
  { className: 'dot-small dot-five' },
  { className: 'dot-medium dot-six' },
]

const back = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/academic')
}
</script>

<template>
  <main class="chronicle-page">
    <section class="timeline-canvas" aria-labelledby="timeline-title">
      <section class="hero-copy">
        <p>Chronicles of Excellence</p>
        <h1 id="timeline-title">活动足迹·时光影卷</h1>
        <div class="hero-description">
          穿梭于传统与创新的交汇点，记录实验室每一个具有里程碑意义的瞬间。<br>
          每一张照片都是智慧的沉淀，每一段历程都是对未来的承诺。
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

      <article class="impact-card">
        <div class="card-content">
          <h2>科普影响力</h2>
          <p>为期两周的展览吸引了超过5000名观众，现场展示的分子生药学交互装置广受好评。</p>
          <div class="impact-grid">
            <div v-for="item in impactHighlights" :key="item.label">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="future-card" aria-label="活动影像预留区域">
        <div class="future-card-inner">
          <span></span>
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
  min-height: max(1800px, calc(var(--canvas-width) * 1.754));
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
  height: 63.8%;
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
  z-index: 1;
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
  top: 25.85%;
  left: 21.35%;
  background-color: #d2aeae;
}

.dot-two {
  top: 37.9%;
  left: 71.1%;
}

.dot-three {
  top: 52.2%;
  left: 26%;
}

.dot-four {
  top: 62.55%;
  left: 60.05%;
}

.dot-five {
  top: 68.95%;
  left: 40.5%;
}

.dot-six {
  top: 72.95%;
  left: 60.05%;
}

.impact-card,
.future-card {
  position: absolute;
  width: 25.5%;
  min-width: 360px;
  aspect-ratio: 490 / 682;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 20px 50px -12px rgba(132, 33, 48, 0.15);
  z-index: 2;
}

.impact-card {
  top: 24.35%;
  left: 31.05%;
  display: flex;
  align-items: center;
  border: 1px solid #f0eee9;
}

.future-card {
  top: 61.15%;
  right: 4.32%;
  border-radius: 12px;
  box-shadow: 0 4px 8.1px rgba(0, 0, 0, 0.25);
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

.future-card-inner {
  height: 100%;
  padding: 32px;
}

.future-card-inner span {
  width: 100%;
  height: 80px;
  display: block;
  border-radius: 2px;
  background-color: #f5f5f4;
  opacity: 0;
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
  .impact-card,
  .future-card {
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

  .impact-card,
  .future-card {
    position: relative;
    inset: auto;
    width: calc(100% - 40px);
    min-width: 0;
    max-width: 490px;
    margin: 0 auto;
    aspect-ratio: auto;
    min-height: 520px;
  }

  .impact-card {
    top: auto;
    margin-top: 520px;
  }

  .future-card {
    margin-top: 260px;
    min-height: 480px;
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

  .card-content,
  .future-card-inner {
    padding: 24px;
  }

  .impact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
