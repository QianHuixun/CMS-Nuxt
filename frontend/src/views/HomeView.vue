<script setup>
</script>

<template>
  <div class="home-page">
    <div class="bg-layer"></div>
    <div class="content">
      <div class="sub-english">DIGITAL HUMANITIES ARCHIVE</div>
      <h2 class="main-title">传承出土文献，赓续中医文脉</h2>
      <p class="desc">
        本中心致力于通过数字化技术与现代科研手段，深挖中国出土医学文献与文物的学术价值，构建跨学科的知识服务平台。
      </p>

      <div class="cards">
        <div class="card">
          <img src="@/assets/icons/home/Group 1.svg" alt="资源导航" class="card-icon" />
          <h3 class="card-title">资源导航</h3>
          <p class="card-desc">整合分散的出土医学文献资源，提供多维度的检索与分类导航服务。</p>
          <router-link to="/resources" class="card-btn">进入导航</router-link>
        </div>

        <div class="card">
          <img src="@/assets/icons/home/Union2.svg" alt="知识图谱" class="card-icon" />
          <h3 class="card-title">知识图谱</h3>
          <p class="card-desc">基于本体建模技术，可视化展示古医籍中药、方剂与经络的内在关联。</p>
          <router-link to="/knowledge" class="card-btn">开启探索</router-link>
        </div>

        <div class="card">
          <img src="@/assets/icons/home/Union3.svg" alt="学术动态" class="card-icon" />
          <h3 class="card-title">学术动态</h3>
          <p class="card-desc">发布最新考古发现、学术论文及科研成果，促进中医文献学界交流。</p>
          <router-link to="/academic" class="card-btn">查看详情</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  overflow-x: hidden;
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
  padding: 120px 40px 80px;
}

.sub-english {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--color-primary);
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
  font-family: system-ui, sans-serif;
}

.sub-english::after {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: var(--color-primary);
}

.main-title {
  font-size: 42px;
  font-weight: bold;
  margin: 24px 0;
  color: #000;
  letter-spacing: 2px;
}

.desc {
  max-width: 800px;
  margin: 0 auto 60px;
  font-size: 14px;
  color: var(--color-secondary);
  line-height: 1.8;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.card {
  background-color: #fff;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  border-radius: 2px;
  width: 300px;
  padding: 40px 24px;
  text-align: left;
  transition: var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.card-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 16px;
  color: var(--color-primary);
  font-size: 20px;
  line-height: 32px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: var(--color-text);
}

.card-desc {
  font-size: 12px;
  color: var(--color-secondary);
  margin-bottom: 24px;
  line-height: 1.7;
}

.card-btn {
  font-size: 12px;
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
  font-size: 10px;
}
</style>
