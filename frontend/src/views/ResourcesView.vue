<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="resource-section">
    <h2 class="section-title">核心资源库</h2>
    <p class="section-subtitle">汇聚数十年考古成果与数字化工程，构建全球领先的出土中医文献数字化平台。</p>

    <div class="resource-container">
      <div>
        <h3 class="group-title">
          <span class="group-bar"></span>
          现有数据库集群
        </h3>
        <div class="database-group">
          <div class="db-card">
            <h4 class="db-card-title">《天回医简》数据库</h4>
            <p class="db-card-desc">包含天回汉墓出土医简的高清原简照片、单字切分图像、释文文本及相关注释。</p>
            <span class="db-card-icon">🗄</span>
          </div>
          <div class="db-card">
            <h4 class="db-card-title">"万卷精华"数据库</h4>
            <p class="db-card-desc">包含出土医学文献、出土医学文物、传世中医古籍、文史工具书四个子库的数据。</p>
            <span class="db-card-icon">🗄</span>
          </div>
          <div class="db-card">
            <h4 class="db-card-title">巴蜀古医籍数据库</h4>
            <p class="db-card-desc">具有地域特色的古医籍扫描件及元数据，展现巴蜀医学像、释文文本及相关注释。</p>
            <span class="db-card-icon">🗄</span>
          </div>
          <div class="db-card">
            <h4 class="db-card-title">博物馆VR展厅</h4>
            <p class="db-card-desc">沉浸式实景VR全景图像，全方位在线观览出土医学文物陈列展。</p>
            <span class="db-card-icon">🎯</span>
          </div>
        </div>
      </div>

      <div class="software-group">
        <h3 class="group-title">
          <span class="group-bar"></span>
          自研数据分析软件
        </h3>
        <div class="software-item">
          <div class="software-icon">❯</div>
          <div class="software-info">
            <h4>出土文献实体标注工具</h4>
            <p>Natural Language Processing</p>
          </div>
        </div>
        <div class="software-item">
          <div class="software-icon">✂</div>
          <div class="software-info">
            <h4>简帛自动切字软件</h4>
            <p>Image Segmentation AI</p>
          </div>
        </div>
        <div class="tech-block">
          <h3>技术助力研究</h3>
          <p>我们利用人工智能与数字人文技术，重现古代医学的文字之美与理法之光。</p>
          <a href="#" class="tech-btn">了解学术成果</a>
        </div>
        <button class="back-btn" @click="goBack">⌂ 返回首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 40px;
  font-family: "SimSun", "宋体", serif;
}

.section-title {
  font-size: 32px;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: 40px;
}

.resource-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.group-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "SimSun", "宋体", serif;
}

.group-bar {
  width: 4px;
  height: 20px;
  background-color: var(--color-primary);
  display: inline-block;
  flex-shrink: 0;
}

.database-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.db-card {
  background-color: #fff;
  border: 1px solid #e0d8c8;
  box-shadow:
    0 2px 3px rgba(255, 255, 255, 0.8) inset,
    0 8px 15px rgba(0, 0, 0, 0.1),
    0 3px 5px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  padding: 32px 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.db-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--color-primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.db-card:hover::before {
  opacity: 1;
}

.db-card:hover {
  transform: translateY(-2px);
}

.db-card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
  font-family: "SimSun", "宋体", serif;
}

.db-card-desc {
  font-size: 13px;
  color: var(--color-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
  font-family: "SimSun", "宋体", serif;
}

.db-card-icon {
  position: absolute;
  bottom: 24px;
  right: 24px;
  color: var(--color-primary);
  font-size: 20px;
}

.software-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: -58px;
}

.software-item {
  background-color: #fff;
  border: 1px solid #e0d8c8;
  box-shadow:
    0 2px 3px rgba(255, 255, 255, 0.8) inset,
    0 8px 15px rgba(0, 0, 0, 0.1),
    0 3px 5px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.software-icon {
  width: 40px;
  height: 40px;
  background-color: #f8f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 20px;
  flex-shrink: 0;
}

.software-info h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  font-family: "SimSun", "宋体", serif;
}

.software-info p {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: system-ui, sans-serif;
}

.tech-block {
  background-color: var(--color-primary);
  color: #fff;
  padding: 32px 24px;
  border-radius: 2px;
}

.tech-block h3 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  font-family: "SimSun", "宋体", serif;
}

.tech-block p {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 32px;
  font-family: "SimSun", "宋体", serif;
}

.tech-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  color: var(--color-primary);
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-family: "SimSun", "宋体", serif;
  transition: background-color 0.2s ease;
}

.tech-btn:hover {
  background-color: #f5f0f0;
}

.back-btn {
  display: block;
  margin-left: auto;
  margin-top: 0;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  font-size: 12px;
  cursor: pointer;
  font-family: "SimSun", "宋体", serif;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: var(--color-primary-hover);
}

@media (max-width: 900px) {
  .resource-container {
    grid-template-columns: 1fr;
  }

  .database-group {
    grid-template-columns: 1fr;
  }

  .resource-section {
    padding: 0 20px;
    margin: 40px auto;
  }
}
</style>
