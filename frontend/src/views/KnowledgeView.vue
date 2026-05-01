<script setup>
import { ref } from 'vue'

const symptoms = ref([
  '头痛', '发热', '咳嗽', '脉浮', '咳嗽', '脉浮', '咳嗽',
  '头痛', '咳嗽', '脉浮', '咳嗽', '脉浮', '咳嗽', '脉浮',
  '头痛', '咳嗽', '脉浮', '咳嗽', '发热', '脉浮', '咳嗽',
  '头痛', '咳嗽', '发热', '脉浮', '咳嗽', '脉浮', '咳嗽'
])

const medicines = ref([
  '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
  '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
  '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
  '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
  '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '薄荷'
])

const causes = ref(['风热犯肺', '营分热炽', '营分热炽'])

const SIZE_RADIUS = {
  'size-xl': 10,
  'size-m': 6.5,
  'size-s': 5.5,
  'size-xs': 4.5,
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function interleave(scholars, books) {
  const list = []
  let si = 0, bi = 0
  let turn = Math.random() > 0.5 ? 's' : 'b'
  while (si < scholars.length || bi < books.length) {
    if (turn === 's' && si < scholars.length) {
      list.push(scholars[si++])
      turn = 'b'
    } else if (turn === 'b' && bi < books.length) {
      list.push(books[bi++])
      turn = 's'
    } else if (si < scholars.length) {
      list.push(scholars[si++])
    } else if (bi < books.length) {
      list.push(books[bi++])
    }
  }
  return list
}

function generatePositions(rawNodes) {
  const centerNode = rawNodes.find(n => n.size === 'size-xl')
  const rest = rawNodes.filter(n => n.size !== 'size-xl')

  const scholars = rest.filter(n => n.type === 'scholar')
  const books = rest.filter(n => n.type === 'book')
  const queue = interleave([...scholars].sort(() => Math.random() - 0.5), [...books].sort(() => Math.random() - 0.5))

  const placed = [{
    ...centerNode,
    x: 50,
    y: 38,
  }]

  const placedAngles = []

  for (const node of queue) {
    const nodeR = SIZE_RADIUS[node.size]
    const centerR = SIZE_RADIUS['size-xl']

    let bestX = 0, bestY = 0
    let bestScore = -Infinity

    for (let attempt = 0; attempt < 200; attempt++) {
      const angle = Math.random() * Math.PI * 2
      const jitterR = nodeR + centerR + 6 + Math.random() * 32

      const cx = 50 + jitterR * Math.cos(angle)
      const cy = 38 + jitterR * Math.sin(angle)

      if (cx < 6 || cx > 94 || cy < 5 || cy > 92) continue

      let ok = true
      for (const p of placed) {
        if (distance({ x: cx, y: cy }, p) < nodeR + SIZE_RADIUS[p.size] + 2.5) {
          ok = false
          break
        }
      }
      if (!ok) continue

      let angleScore = 0
      for (const pa of placedAngles) {
        const da = Math.abs(angle - pa)
        const d = da > Math.PI ? 2 * Math.PI - da : da
        if (d < 0.35) angleScore += 1
      }

      const score = -jitterR * 0.15 - angleScore * 1.5
      if (score > bestScore) {
        bestScore = score
        bestX = cx
        bestY = cy
      }
    }

    placed.push({ ...node, x: bestX, y: bestY })
    placedAngles.push(Math.atan2(bestY - 38, bestX - 50))
  }

  return placed
}

const allNodes = ref(generatePositions([
  { name: '叶天士', type: 'scholar', size: 'size-xl' },
  { name: '张仲景', type: 'scholar', size: 'size-m' },
  { name: '孙思邈', type: 'scholar', size: 'size-m' },
  { name: '李时珍', type: 'scholar', size: 'size-s' },
  { name: '王清任', type: 'scholar', size: 'size-s' },
  { name: '皇甫谧', type: 'scholar', size: 'size-s' },
  { name: '温热论', type: 'book', size: 'size-m' },
  { name: '临证指南', type: 'book', size: 'size-s' },
  { name: '温病条辨', type: 'book', size: 'size-s' },
  { name: '伤寒论', type: 'book', size: 'size-m' },
  { name: '金匮要略', type: 'book', size: 'size-s' },
  { name: '千金要方', type: 'book', size: 'size-s' },
  { name: '千金翼方', type: 'book', size: 'size-xs' },
  { name: '本草纲目', type: 'book', size: 'size-xs' },
  { name: '叶氏医案', type: 'book', size: 'size-xs' },
  { name: '医林改错', type: 'book', size: 'size-xs' },
]))

const detail = ref({
  title: '温热论',
  subtitle: '学术思想：卫气营血辨证',
  year: '清代(1746年)',
  citations: '2,482 次',
  abstract: '温邪上受，首先犯肺，逆传心包。肺主气属卫，心主血属营。大凡看法，卫之后方言气，营之后方言血...',
  relatedCount: 12,
  related: [
    { name: '银翘散', type: '治疗方剂' },
    { name: '邪留三焦', type: '病机描述' },
  ]
})
</script>

<template>
  <div class="knowledge-page">
    <!-- 核心三栏布局 -->
    <div class="main-container">
      <!-- 左侧：图谱检索区 -->
      <div class="left-column">
        <div class="search-panel card">
          <h2 class="panel-title">图谱检索</h2>

          <!-- 症状分类 -->
          <div class="search-category">
            <div class="category-label">症状</div>
            <div class="tag-grid">
              <div
                v-for="(item, index) in symptoms"
                :key="index"
                :class="['tag-item', { highlight: item === '发热' }]"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <!-- 药物分类 -->
          <div class="search-category">
            <div class="category-label">药物</div>
            <div class="tag-grid">
              <div
                v-for="(item, index) in medicines"
                :key="index"
                class="tag-item"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <!-- 病因病机 -->
          <div class="search-category">
            <div class="category-label">病因病机</div>
            <div class="cause-list">
              <div
                v-for="(item, index) in causes"
                :key="index"
                class="cause-item"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <!-- 关联实体总量 -->
          <div class="total-count">12,842</div>
          <div class="total-desc">关联实体总量</div>
        </div>
        <span class="column-spacer"></span>
      </div>

      <!-- 中间：图谱可视化区 -->
      <div class="middle-column">
        <div class="graph-panel">
          <div
            v-for="(node, index) in allNodes"
            :key="index"
            :class="['graph-node', `node-${node.type}`, node.size]"
            :style="{ left: node.x + '%', top: node.y + '%', '--i': index }"
          >
            {{ node.name }}
          </div>

          <!-- 图谱图例 -->
          <div class="graph-legend">
            <div class="legend-item">
              <div class="legend-dot dot-scholar" />
              <span>核心学者</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot dot-book" />
              <span>文献古籍</span>
            </div>
          </div>
        </div>
        <span class="column-spacer"></span>
      </div>

      <!-- 右侧：详情面板 -->
      <div class="right-column">
        <div class="detail-panel card">
          <div class="close-btn">×</div>

          <h2 class="detail-title">{{ detail.title }}</h2>
          <p class="detail-subtitle">{{ detail.subtitle }}</p>

          <!-- 信息卡片 -->
          <div class="info-cards">
            <div class="info-card">
              <div class="info-card-label">成书年代</div>
              <div class="info-card-value">{{ detail.year }}</div>
            </div>
            <div class="info-card">
              <div class="info-card-label">引用频次</div>
              <div class="info-card-value">{{ detail.citations }}</div>
            </div>
          </div>

          <!-- 核心论述 -->
          <div class="abstract-block">
            <h3 class="abstract-title">核心论述摘要</h3>
            <p class="abstract-content">"{{ detail.abstract }}"</p>
          </div>

          <!-- 相关实体 -->
          <div class="related-entities">
            <h3 class="entities-title">
              相关联实体
              <span class="entities-count">{{ detail.relatedCount }}</span>
            </h3>
            <div
              v-for="(item, index) in detail.related"
              :key="index"
              class="entity-item"
            >
              <span class="entity-name">{{ item.name }}</span>
              <span class="entity-type">{{ item.type }}</span>
            </div>
          </div>

          <a href="#" class="btn-deep">深入文献归档</a>
        </div>
        <button class="btn-back">返回首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-page {
  min-height: calc(100vh - 70px);
  background-color: var(--bg-page);
}

/* 核心布局：三栏结构 */
.main-container {
  display: grid;
  grid-template-columns: 300px 1fr 400px;
  gap: 20px;
  padding: 24px 40px;
  min-height: calc(100vh - 70px);
}

.left-column,
.middle-column,
.right-column {
  display: flex;
  flex-direction: column;
}

.left-column,
.middle-column {
  gap: 8px;
}

.right-column {
  gap: 8px;
}

.column-spacer {
  height: 38px;
  flex-shrink: 0;
}

/* 左侧：图谱检索区 */
.search-panel {
  padding: 24px;
  border-radius: 2px;
  flex: 1;
}

.panel-title {
  font-size: 20px;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 24px;
  padding-bottom: 12px;
}

.search-category {
  margin-bottom: 16px;
}

.category-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-label::before {
  content: "◎";
  font-size: 10px;
  color: var(--color-primary);
}

/* 标签网格 */
.tag-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 12px;
}

.tag-item {
  padding: 4px 2px;
  text-align: center;
  border-radius: 2px;
  background-color: var(--bg-page);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tag-item:hover {
  background-color: #e8e3d8;
}

.tag-item.highlight {
  background-color: var(--color-primary);
  color: #fff;
}

.tag-item.highlight:hover {
  background-color: #701f2a;
}

/* 病因病机 */
.cause-list {
  margin-top: 16px;
  font-size: 13px;
}

.cause-item {
  padding: 8px 0 8px 16px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 2px;
  position: relative;
}

.cause-item:hover {
  background-color: #e8e3d8;
}

.cause-item::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: var(--color-primary);
}

/* 关联实体总量 */
.total-count {
  margin-top: 20px;
  font-size: 36px;
  color: var(--color-primary);
  font-weight: bold;
}

.total-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 中间：图谱可视化区 */
.graph-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  box-shadow: none !important;
  overflow: hidden;
  min-height: 500px;
  flex: 1;
}

/* 图谱节点基础样式 */
.graph-node {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
  text-align: center;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  font-family: "SimSun", "宋体", serif;
  transform: translate(-50%, -50%);
  animation: node-in 0.5s ease-out both;
  animation-delay: calc(var(--i) * 50ms);
}

@keyframes node-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.graph-node:hover {
  transform: translate(-50%, -50%) scale(1.05);
}

/* 核心学者节点（红底白字） */
.node-scholar {
  background-color: var(--color-primary) !important;
  color: #fff !important;
}

.node-scholar.size-xl {
  width: 110px;
  height: 110px;
  font-size: 16px;
}

.node-scholar.size-m {
  width: 65px;
  height: 65px;
  font-size: 12px;
}

.node-scholar.size-s {
  width: 55px;
  height: 55px;
  font-size: 11px;
}

/* 文献古籍节点（白底红字） */
.node-book {
  background-color: #fff !important;
  color: var(--color-primary) !important;
}

.node-book.size-m {
  width: 60px;
  height: 60px;
  font-size: 12px;
}

.node-book.size-s {
  width: 50px;
  height: 50px;
  font-size: 11px;
}

.node-book.size-xs {
  width: 40px;
  height: 40px;
  font-size: 10px;
}

/* 图谱图例 */
.graph-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.dot-scholar {
  background-color: var(--color-primary);
}

.dot-book {
  background-color: #fff;
  box-shadow: 0 0 0 1px #ccc inset;
}

/* 右侧：详情面板 */
.detail-panel {
  background-color: #F5F3EE99 !important;
  padding: 24px;
  border-radius: 2px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #999;
}

.detail-title {
  font-size: 24px;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 8px;
}

.detail-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

/* 信息卡片 */
.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.info-card {
  padding: 12px 16px;
  background-color: #f9f6f0;
  border-radius: 4px;
  border-left: 2px solid var(--color-primary);
}

.info-card-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-card-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 核心论述 */
.abstract-block {
  margin-bottom: 16px;
  border-left: 2px solid #d4c4b8;
  padding-left: 12px;
}

.abstract-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.abstract-content {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

/* 相关实体 */
.related-entities {
  margin-bottom: 16px;
}

.entities-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entities-count {
  font-size: 12px;
  color: #999;
  background-color: #f0ece4;
  padding: 2px 8px;
  border-radius: 10px;
}

.entity-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  margin-bottom: 4px;
  font-size: 13px;
}

.entity-name {
  color: #333;
}

.entity-type {
  color: #999;
}

/* 按钮样式 */
.btn-deep {
  display: block;
  width: 100%;
  padding: 16px;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-bottom: 16px;
  border-radius: 0;
  transition: background-color 0.2s ease;
}

.btn-deep:hover {
  background-color: var(--color-primary-hover);
}
</style>
