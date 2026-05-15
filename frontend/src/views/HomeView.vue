  <script setup>
import iconResources from '@/assets/icons/home/Group 1.svg'
import iconKnowledge from '@/assets/icons/home/Union2.svg'
import iconAcademic from '@/assets/icons/home/Union3.svg'
import decorResources from '@/assets/images/backgrounds/home/card-resource.svg'
import decorAcademic from '@/assets/images/backgrounds/home/card-academic.svg'
import decorKnowledge from '@/assets/images/backgrounds/home/card-knowledge.svg'

const iconMap = {
  resources: iconResources,
  knowledge: iconKnowledge,
  academic: iconAcademic
}

const decorMap = {
  resources: decorResources,
  knowledge: decorAcademic,
  academic: decorKnowledge
}

const decorShiftMap = {
  resources: true,
  knowledge: false,
  academic: false
}

const pageConfig = {
  eyebrow: 'DIGITAL HUMANITIES ARCHIVE',
  title: '传承出土文献，赓续中医文脉',
  description: '本中心致力于通过数字化技术与现代科研手段，深挖中国出土医学文献与文物的学术价值，构建跨学科的知识服务平台。',
  cards: [
    { key: 'resources', title: '资源导航', description: '整合分散的出土医学文献资源，提供多维度的检索与分类导航服务。', route: '/resources', actionText: '进入导航' },
    { key: 'knowledge', title: '知识图谱', description: '基于本体建模技术，可视化展示古医籍中药、方剂与经络的内在关联。', route: '/knowledge', actionText: '开启探索' },
    { key: 'academic', title: '学术动态', description: '发布最新考古发现、学术论文及科研成果，促进中医文献学界交流。', route: '/academic', actionText: '查看详情' }
  ]
}
</script>

<template>
  <div class="home-page">
    <div class="bg-layer"></div>
    <div class="content">
      <div class="sub-english">{{ pageConfig.eyebrow }}</div>
      <h2 class="main-title">{{ pageConfig.title }}</h2>
      <p class="desc">{{ pageConfig.description }}</p>

      <div class="cards">
        <router-link v-for="card in pageConfig.cards" :key="card.key" :to="card.route" class="card">
          <img :src="iconMap[card.key] || iconResources" :alt="card.title" class="card-icon" />
          <h3 class="card-title" :class="{ 'card-title-black': card.key === 'knowledge' }">{{ card.title }}</h3>
          <p class="card-desc">{{ card.description }}</p>
          <span class="card-btn">{{ card.actionText }}</span>
          <img :src="decorMap[card.key]" alt="" class="card-decor" :class="{ 'card-decor-shift': decorShiftMap[card.key] }" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 53px);
  text-align: center;
  overflow: hidden;
}

.bg-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/backgrounds/home/home-bg2.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  transform: translateY(6px);
}

.sub-english {
  font-size: var(--font-size-md);
  letter-spacing: var(--letter-spacing-sm);
  color: var(--color-primary);
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
  transform: translateY(-24px);
}

.sub-english::after {
  content: "";
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: var(--color-primary);
}

.main-title {
  font-size: var(--font-size-15xl);
  font-weight: var(--font-weight-bold);
  margin: 24px 0;
  color: #000;
  letter-spacing: var(--letter-spacing-sm);
  transform: translateY(-24px);
}

.desc {
  max-width: 640px;
  margin: 0 auto 48px;
  font-size: var(--font-size-xl);
  color: #000;
  line-height: var(--line-height-reading);
  transform: translateY(-24px);
}

.cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.card {
  position: relative;
  display: block;
  background-color: #fafaf8;
  border: 1px solid var(--color-border);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.16), var(--shadow-card);
  border-radius: 2px;
  width: 300px;
  padding: 40px 24px;
  text-align: left;
  text-decoration: none;
  color: inherit;
  transition: var(--transition-fast);
}

.card:hover {
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.18), var(--shadow-card-hover);
  transform: translateY(-2px);
}

.card-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 16px;
  color: var(--color-primary);
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-card-title);
}

.card-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-black);
  margin-bottom: 16px;
  color: var(--color-text);
}

.card-title-black {
  color: #000;
}

.card-desc {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  margin-bottom: 24px;
  line-height: var(--line-height-card);
}

.card-btn {
  font-size: var(--font-size-md);
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: gap 0.2s ease;
}

.card-btn:hover {
  gap: 12px;
}

.card-btn::after {
  content: "→";
  font-size: var(--font-size-xs);
}

.card-decor {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 75%;
  width: auto;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  animation: decorFadeIn 1.2s ease-out 1.5s both;
}

.card-decor-shift {
  transform: translateX(50%);
}

@keyframes decorFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.12;
  }
}

.card-icon,
.card-title,
.card-desc,
.card-btn {
  position: relative;
  z-index: 1;
}

.card {
  animation: cardFadeIn 0.8s ease-out both;
}

.card:nth-child(1) {
  animation-delay: 0.1s;
}

.card:nth-child(2) {
  animation-delay: 0.3s;
}

.card:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-height: 760px) {
  .content {
    transform: translateY(0);
  }

  .desc {
    margin-bottom: 40px;
  }
}
</style>
