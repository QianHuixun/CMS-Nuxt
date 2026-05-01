<script setup>
const galleryImages = [
  '/images/activity/side-image-1-56586a.png',
  '/images/activity/side-image-2-56586a.png',
]
</script>

<template>
  <main class="activity-page">
    <section class="activity-hero">
      <img src="/images/activity/hero-image-176857.png" alt="学术活动现场">
      <div class="hero-copy">
        <p>活动剪影</p>
        <h1>出土医学文献数字化保护专题研讨</h1>
      </div>
    </section>

    <section class="activity-content">
      <article class="feature-image">
        <img src="/images/activity/large-image-50daff.png" alt="研讨会交流场景">
      </article>

      <div class="activity-copy">
        <h2>跨学科协作现场</h2>
        <p>
          围绕出土医学文献整理、影像采集、知识标注与数字化保护流程，项目团队展示了最新阶段成果，并与考古、医学史、数字人文方向的研究者展开交流。
        </p>
        <router-link to="/academic">返回资源动态</router-link>
      </div>

      <aside class="side-gallery">
        <img
          v-for="image in galleryImages"
          :key="image"
          :src="image"
          alt="活动侧记"
        >
      </aside>
    </section>
  </main>
</template>

<style scoped>
.activity-page {
  min-height: calc(100vh - 57px);
  padding: 34px;
  background-color: #f8f6f0;
  color: #1b1c19;
  font-family: "Noto Serif SC", "SimSun", serif;
}

.activity-hero {
  position: relative;
  height: 320px;
  overflow: hidden;
}

.activity-hero img,
.feature-image img,
.side-gallery img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.activity-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(20, 16, 14, 0.72), rgba(20, 16, 14, 0.08));
}

.hero-copy {
  position: absolute;
  left: 40px;
  bottom: 38px;
  max-width: 680px;
  color: #fff;
  z-index: 1;
}

.hero-copy p {
  margin-bottom: 8px;
  font-size: 14px;
  letter-spacing: 4px;
}

.hero-copy h1 {
  font-size: 34px;
  line-height: 1.35;
}

.activity-content {
  max-width: 1180px;
  margin: 32px auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr) 180px;
  gap: 24px;
  align-items: stretch;
}

.feature-image {
  min-height: 360px;
  overflow: hidden;
}

.activity-copy {
  padding: 30px;
  background-color: #fff;
}

.activity-copy h2 {
  margin-bottom: 18px;
  color: var(--color-primary);
  font-size: 24px;
  line-height: 1.35;
}

.activity-copy p {
  color: #655d58;
  font-size: 15px;
  line-height: 1.9;
}

.activity-copy a {
  margin-top: 28px;
  min-width: 112px;
  height: 38px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 14px;
  text-decoration: none;
}

.side-gallery {
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.side-gallery img {
  min-height: 0;
}

@media (max-width: 980px) {
  .activity-page {
    padding: 20px;
  }

  .activity-content {
    grid-template-columns: 1fr;
  }

  .side-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 180px;
  }
}

@media (max-width: 620px) {
  .activity-hero {
    height: 260px;
  }

  .hero-copy {
    left: 22px;
    right: 22px;
  }

  .hero-copy h1 {
    font-size: 25px;
  }

  .side-gallery {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 180px);
  }
}
</style>
