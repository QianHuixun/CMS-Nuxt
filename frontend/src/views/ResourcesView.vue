<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchDatabases, fetchTools } from '@/api/index.js'

const router = useRouter()
const fallbackDatabases = [
  { id: 'db_tianhui', title: '天回医简数据库', info: '汇聚天回汉墓出土医简高清图像、释文、注释、单字切分图像与检索数据。', icon: 'database' },
  { id: 'db_bashu', title: '巴蜀古籍医籍数据库', info: '收录巴蜀地区历代中医古籍文献，支持全文检索与图像对照。', icon: 'book' },
  { id: 'db_wanjuan', title: '万卷华章数据库', info: '整合出土医学文献与传世医籍，构建多维度知识关联。', icon: 'scroll' },
]
const fallbackTools = [
  { id: 'tool_annotation', title: '出土医学文献标注工具', description: '支持原简图像、释文、注释、实体和关系的协同标注。' },
  { id: 'tool_digitize', title: '简牍图像数字化处理工具', description: '提供简牍图像增强、切分、字符识别与批量导出功能。' },
]
const databases = ref([...fallbackDatabases])
const tools = ref([...fallbackTools])

onMounted(async () => {
  try {
    const dbRes = await fetchDatabases()
    if (dbRes.list?.length) databases.value = dbRes.list
  } catch (e) {
    console.error('获取数据库列表失败', e)
  }
  try {
    const toolRes = await fetchTools()
    if (toolRes.list?.length) tools.value = toolRes.list
  } catch (e) {
    console.error('获取工具列表失败', e)
  }
})

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
            <div
              v-for="db in databases"
              :key="db.id"
              class="db-card"
              :class="`db-card-${db.icon || 'default'}`"
            >
              <div class="db-card-bg"></div>
              <div class="db-card-content">
                <h4 class="db-card-title">{{ db.title }}</h4>
                <p class="db-card-desc">{{ db.info }}</p>
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
          <div
            v-for="tool in tools"
            :key="tool.id"
            class="software-item"
          >
            <div class="software-icon">❯</div>
            <div class="software-info">
              <h4>{{ tool.title }}</h4>
              <p>{{ tool.description }}</p>
            </div>
          </div>
          <div class="tech-block">
            <h3>技术助力研究</h3>
            <p>我们利用人工智能与数字人文技术，重现古代医学的文字之美与理法之光。</p>
            <a href="#" class="tech-btn">了解学术成果</a>
          </div>
        </div>
      </div>
      <button class="btn-back return-action return-action--home" @click="goBack">
        返回首页
      </button>
    </div>
  </div>
</template>

<style scoped>
.resource-page {
  height: calc(100vh - 53px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  font-size: var(--font-size-10xl);
  color: var(--color-primary);
  font-weight: var(--font-weight-regular);
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: var(--font-size-xl);
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
  font-size: var(--font-size-4xl);
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

.db-card-database .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/tianhui-yijian-bg.svg');
}
.db-card-book .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/bashu-guyiji-bg.svg');
}
.db-card-scroll .db-card-bg {
  background-image: url('@/assets/images/backgrounds/nav/wanjuanhua-bg.svg');
}
.db-card-default .db-card-bg {
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
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 12px;
  color: var(--color-text);
}

.db-card-desc {
  font-size: var(--font-size-lg);
  color: var(--color-secondary);
  line-height: var(--line-height-card);
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
  border-radius: 2px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition-fast);
}

.software-item:hover {
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
  font-size: var(--font-size-5xl);
  flex-shrink: 0;
}

.software-info h4 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 4px;
}

.software-info p {
  font-size: var(--font-size-sm);
  color: #999;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-xs);
  font-family: var(--font-sans);
}

.tech-block {
  background-color: var(--color-primary);
  color: #fff;
  padding: 24px;
  border-radius: 2px;
}

.tech-block h3 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 12px;
}

.tech-block p {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-loose);
  margin-bottom: 20px;
}

.tech-btn {
  display: block;
  width: 100%;
  padding: 10px 12px;
  background-color: #fff;
  color: var(--color-primary);
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.tech-btn:hover {
  background-color: #f5f0f0;
}

@media (max-width: 900px) {
  .resource-page {
    height: auto;
    min-height: calc(100vh - 53px);
    overflow: visible;
  }

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
