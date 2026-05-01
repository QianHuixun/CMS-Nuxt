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
          <div class="card-icon">◎</div>
          <h3 class="card-title">资源导航</h3>
          <p class="card-desc">整合分散的出土医学文献资源，提供多维度的检索与分类导航服务。</p>
          <router-link to="/resources" class="card-btn">进入导航</router-link>
        </div>

        <div class="card">
          <div class="card-icon">☯</div>
          <h3 class="card-title">知识图谱</h3>
          <p class="card-desc">基于本体建模技术，可视化展示古医籍中药、方剂与经络的内在关联。</p>
          <router-link to="/knowledge" class="card-btn">开启探索</router-link>
        </div>

        <div class="card">
          <div class="card-icon">✎</div>
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
  background: url('/home-bg2.png') no-repeat center center;
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
  height: 1px;
  background-color: var(--color-primary);
}

.main-title {
  font-size: 42px;
  font-weight: bold;
  margin: 24px 0;
  color: #000;
  letter-spacing: 2px;
  font-family: "SimSun", "宋体", serif;
}

.desc {
  max-width: 800px;
  margin: 0 auto 60px;
  font-size: 14px;
  color: var(--color-secondary);
  line-height: 1.8;
  font-family: "SimSun", "宋体", serif;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.card {
  width: 300px;
  background-color: #fff;
  padding: 40px 24px;
  border: 1px solid #d6ccb8;
  text-align: left;
  box-shadow:
    0 1px 2px rgba(255, 255, 255, 0.6) inset,
    0 12px 28px rgba(0, 0, 0, 0.18),
    0 6px 12px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 1px 2px rgba(255, 255, 255, 0.6) inset,
    0 18px 36px rgba(0, 0, 0, 0.22),
    0 8px 16px rgba(0, 0, 0, 0.14),
    0 3px 6px rgba(0, 0, 0, 0.1);
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
  color: #333;
  font-family: "SimSun", "宋体", serif;
}

.card-desc {
  font-size: 12px;
  color: var(--color-secondary);
  margin-bottom: 24px;
  line-height: 1.7;
  font-family: "SimSun", "宋体", serif;
}

.card-btn {
  font-size: 12px;
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "SimSun", "宋体", serif;
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
