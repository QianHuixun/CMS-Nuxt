<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="resource-page">
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
            <div class="db-card db-card-tianhui">
              <div class="db-card-bg"></div>
              <div class="db-card-content">
                <h4 class="db-card-title">《天回医简》数据库</h4>
                <p class="db-card-desc">包含天回汉墓出土医简的高清原简照片、单字切分图像、释文文本及相关注释。</p>
                <img src="@/assets/icons/resources/Vector 1.svg" alt="icon" class="db-card-icon" />
              </div>
            </div>
            <div class="db-card db-card-wanjuan">
              <div class="db-card-bg"></div>
              <div class="db-card-content">
                <h4 class="db-card-title">"万卷精华"数据库</h4>
                <p class="db-card-desc">包含出土医学文献、出土医学文物、传世中医古籍、文史工具书四个子库的数据。</p>
                <img src="@/assets/icons/resources/Vector 1.svg" alt="icon" class="db-card-icon" />
              </div>
            </div>
            <div class="db-card db-card-bashu">
              <div class="db-card-bg"></div>
              <div class="db-card-content">
                <h4 class="db-card-title">巴蜀古医籍数据库</h4>
                <p class="db-card-desc">具有地域特色的古医籍扫描件及元数据，展现巴蜀医学像、释文文本及相关注释。</p>
                <img src="@/assets/icons/resources/Vector 1.svg" alt="icon" class="db-card-icon" />
              </div>
            </div>
            <div class="db-card db-card-vr">
              <div class="db-card-bg"></div>
              <div class="db-card-content">
                <h4 class="db-card-title">博物馆VR展厅</h4>
                <p class="db-card-desc">沉浸式实景VR全景图像，全方位在线观览出土医学文物陈列展。</p>
                <img src="@/assets/icons/resources/Vector 1.svg" alt="icon" class="db-card-icon" />
              </div>
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
        </div>
      </div>
      <button class="btn-back" @click="goBack">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.resource-page {
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
}

.resource-section {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 24px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
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
  flex: 1;
}

.group-title {
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
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
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  transition: var(--transition-fast);
  min-height: 180px;
}

.db-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.db-card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.db-card-bg::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 35%, rgba(255, 255, 255, 0.85) 65%, rgba(255, 255, 255, 0.7) 100%);
}

.db-card-tianhui .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/tianhui-yijian-bg.svg');
}

.db-card-wanjuan .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/wanjuanhua-bg.svg');
}

.db-card-bashu .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/bashu-guyiji-bg.svg');
}

.db-card-vr .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/image 2.svg');
  background-position: right center;
}

.db-card-content {
  position: relative;
  z-index: 1;
  padding: 32px 24px 56px;
  height: 100%;
  box-sizing: border-box;
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
  z-index: 2;
}

.db-card:hover::before {
  opacity: 1;
}

.db-card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: var(--color-text);
}

.db-card-desc {
  font-size: 13px;
  color: var(--color-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
}

.db-card-icon {
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 20px;
  height: 20px;
  filter: invert(22%) sepia(37%) saturate(2164%) hue-rotate(331deg) brightness(93%) contrast(92%);
  opacity: 0.5;
  transition: opacity 0.2s ease;
  z-index: 3;
}

.db-card:hover .db-card-icon {
  opacity: 1;
}

.software-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: -58px;
}

.software-item {
  background-color: #fff;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  border-radius: 2px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition-fast);
}

.software-item:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
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
  color: var(--color-text);
  margin-bottom: 4px;
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
}

.tech-block p {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 32px;
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
  transition: background-color 0.2s ease;
}

.tech-btn:hover {
  background-color: #f5f0f0;
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

  .software-group {
    margin-top: 0;
  }
}
</style>
