<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { fetchActivities } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const router = useRouter()
const activityArchivePageSize = 3

// 新增核心状态：
// scrollProgress 用于控制线段的真实弧长渲染比例 (0 到 1)
// currentY 用于保存屏幕中心所对应的 SVG 内部绝对 Y 坐标 (像素)
const scrollProgress = ref(0)
const currentY = ref(-9999) 
const pathLookupTable = ref([]) // 用于存储 Y轴坐标 到 弧长比例 的映射表

const pageInfo = ref({
  title: '活动足迹·时光影卷',
  description: '穿梭于传统与创新的交汇点，记录实验室每一个具有里程碑意义的瞬间。\n每一张照片都是智慧的沉淀，每一段历程都是对未来的承诺。'
})

const timelineLayout = {
  viewBoxWidth: 978,
  topPercent: 15.35,
  leftPercent: 24.5,
  widthPercent: 51,
  heightPercent: 74,
  cardGap: 56,
  cardHalfHeight: 130,
  nodeRadius: 38,
  nodeStartY: 300,
  nodeSpacing: 380,
  nodeCenterX: 489,
  nodeOffsetX: 220, // 减小曲线左右弧度宽度，让线条更集中在页面中间
  pathLead: 240,
  pathTail: 240,
}

const createTimelinePath = (nodes) => {
  if (!nodes.length) return ''

  const points = [
    { cx: timelineLayout.nodeCenterX, cy: Math.max(0, nodes[0].cy - timelineLayout.pathLead) },
    ...nodes,
    { cx: timelineLayout.nodeCenterX, cy: nodes[nodes.length - 1].cy + timelineLayout.pathTail },
  ]

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const midY = (previous.cy + point.cy) / 2
    return `${path} C ${previous.cx} ${midY} ${point.cx} ${midY} ${point.cx} ${point.cy}`
  }, `M ${points[0].cx} ${points[0].cy}`)
}

const createEventSlot = ({ cardClassName, dot, side }) => {
  const dotLeftPercent = timelineLayout.leftPercent + timelineLayout.widthPercent * (dot.cx / timelineLayout.viewBoxWidth)
  const dotTopPercent = timelineLayout.topPercent + timelineLayout.heightPercent * (dot.cy / timelineViewBoxHeight.value)
  const cardPosition = {
    top: `calc(${dotTopPercent.toFixed(3)}% - ${timelineLayout.cardHalfHeight}px)`,
  }

  if (side === 'left') {
    cardPosition.right = `calc(${(100 - dotLeftPercent).toFixed(3)}% + ${timelineLayout.cardGap}px)`
  } else {
    cardPosition.left = `calc(${dotLeftPercent.toFixed(3)}% + ${timelineLayout.cardGap}px)`
  }

  return { cardClassName, dot, cardPosition }
}

const activityCards = ref([
  {
    id: 'activity_001',
    title: '出土医学文献文物保护研究数字重点实验室发布成果暨举办学术研讨会',
    time: '2025.05.16',
    coverImage: '/mock-assets/activities/activity-lab-release.jpg',
  },
  {
    id: 'activity_002',
    title: '中国哲学史学会中医哲学专委会2025学术年会暨中医药社科哲学专家委员会成立大会',
    time: '2025.10.19',
    coverImage: '/mock-assets/activities/activity-philosophy-conf.jpg',
  },
  {
    id: 'activity_003',
    title: '2023年出土医学文献与文物学术会议（第二届）',
    time: '2023.12.23',
    coverImage: '/mock-assets/activities/activity-conf-2023.jpg',
  },
])

const descriptionLines = computed(() => String(pageInfo.value.description || '').split('\n'))
const timelineNodePositions = computed(() => activityCards.value.map((_, index) => ({
  id: `timeline-node-${index + 1}`,
  className: index === 0 ? 'timeline-marker-primary' : 'timeline-marker-secondary',
  cx: timelineLayout.nodeCenterX + (index % 2 === 0 ? -timelineLayout.nodeOffsetX : timelineLayout.nodeOffsetX),
  cy: timelineLayout.nodeStartY + index * timelineLayout.nodeSpacing,
})))
const activeTimelineNodePositions = computed(() => timelineNodePositions.value)

const timelineViewBoxHeight = computed(() => {
  const nodes = activeTimelineNodePositions.value
  const lastNode = nodes[nodes.length - 1]
  return Math.max(1600, (lastNode?.cy || timelineLayout.nodeStartY) + timelineLayout.pathTail + 120)
})

const timelineCanvasHeight = computed(() => Math.max(1800, 720 + activityCards.value.length * 320))
const timelinePathD = computed(() => {
  return createTimelinePath(activeTimelineNodePositions.value)
})

const eventCards = computed(() => activityCards.value.map((card, index) => {
  const slot = createEventSlot({
    cardClassName: index === 0 ? 'event-card-primary' : 'event-card-secondary',
    dot: activeTimelineNodePositions.value[index],
    side: index % 2 === 0 ? 'left' : 'right',
  })

  return {
    ...card,
    className: slot.cardClassName,
    cardPosition: slot.cardPosition,
  }
}))

// 节点圆点用 HTML 渲染（避免 SVG preserveAspectRatio="none" 把圆拉成椭圆）
const nodeMarkers = computed(() => activeTimelineNodePositions.value.map((dot) => {
  const leftPercent = timelineLayout.leftPercent + timelineLayout.widthPercent * (dot.cx / timelineLayout.viewBoxWidth)
  const topPercent = timelineLayout.topPercent + timelineLayout.heightPercent * (dot.cy / timelineViewBoxHeight.value)
  return {
    id: dot.id,
    className: dot.className,
    cy: dot.cy,
    style: {
      top: `${topPercent.toFixed(3)}%`,
      left: `${leftPercent.toFixed(3)}%`,
    },
  }
}))

const formatDate = (value) => {
  if (!value) return '待定'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

// === 超高精度映射逻辑：解决曲线路径弧度造成的偏移 ===

// 1. 预构建路径映射表 (Y 坐标 -> 弧长进度)
const updateLookupTable = () => {
  const pathEl = document.querySelector('.timeline-line')
  if (!pathEl) return
  const totalLength = pathEl.getTotalLength()
  if (totalLength === 0) return
  
  const table = []
  const steps = 800 // 采样 800 个点，足够顺滑
  for (let i = 0; i <= steps; i++) {
    const l = (i / steps) * totalLength
    const pt = pathEl.getPointAtLength(l)
    table.push({ y: pt.y, progress: i / steps })
  }
  pathLookupTable.value = table
  handleScroll() // 构建完毕后立即校准当前进度
}

// 监听路径数据，渲染完成后重构表（immediate 兜底，确保首次也能初始化）
watch(timelinePathD, async () => {
  await nextTick()
  updateLookupTable()
}, { immediate: true })

// 2. 滚动计算
const handleScroll = () => {
  const container = document.querySelector('.timeline-canvas')
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  const viewportCenter = window.innerHeight / 2
  
  // 屏幕中心线距离容器顶部的真实像素高度
  const offsetInContainer = viewportCenter - rect.top
  
  // 映射到 SVG 绘制区域
  const svgTopPixels = rect.height * (timelineLayout.topPercent / 100)
  const svgHeightPixels = rect.height * (timelineLayout.heightPercent / 100)
  
  // 计算在 SVG ViewBox 内的理想进度 (Y轴方向的线性进度)
  let svgProgress = (offsetInContainer - svgTopPixels) / svgHeightPixels
  svgProgress = Math.min(Math.max(svgProgress, 0), 1)
  
  // 这就是当前屏幕中心精确对应的 SVG 内部绝对 Y 坐标点
  const targetY = svgProgress * timelineViewBoxHeight.value
  currentY.value = targetY 
  
  // 3. 查表修正：使用二分查找，将线性 Y 轴进度，转换为非线性的真实路径弧长进度
  const table = pathLookupTable.value
  if (table.length > 0) {
    let low = 0, high = table.length - 1, bestProgress = 0
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (table[mid].y <= targetY) {
        bestProgress = table[mid].progress
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    // 最终应用修正后的真实渲染比例
    scrollProgress.value = bestProgress
  }
}

// 节点的点亮逻辑极大简化：屏幕中心线 (currentY) 碰到节点的绝对 cy 坐标，直接点亮！
const isNodeActive = (nodeY) => {
  return currentY.value >= nodeY
}

// 当前焦点节点：currentY 已越过且距离最近的那个节点
const currentNodeId = computed(() => {
  const nodes = activeTimelineNodePositions.value
  let target = null
  for (const node of nodes) {
    if (currentY.value >= node.cy) {
      if (!target || node.cy > target.cy) target = node
    }
  }
  return target?.id || null
})

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 等待 SVG 渲染完成后立即构建一次路径映射表，
  // 否则在 activityCards 长度未变化的情况下 watch 不会触发，
  // 会导致 .timeline-progress-line 和 .timeline-accent 滑块不显示。
  await nextTick()
  updateLookupTable()
  handleScroll()

  try {
    const activitiesRes = await fetchActivities({ pageNum: 1, pageSize: activityArchivePageSize })

    const activities = activitiesRes.rows || []
    const total = activitiesRes.total || activities.length

    const merged = activities.map((a, index) => ({
      id: a.id || `activity-${index}`,
      title: a.title || a.name || '学术活动',
      time: formatDate(a.time),
      coverImage: a.coverImage || '',
    }))

    if (merged.length) {
      pageInfo.value = {
        title: '活动足迹·时光影卷',
        description: `已收录 ${total} 场学术活动，记录每一次交流的现场瞬间。\n时间轴与学术动态页的活动存档保持同源。`
      }
      activityCards.value = merged
    }
  } catch (e) {
    console.error('加载活动概览失败', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const back = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <main class="chronicle-page">
    <section class="timeline-canvas" aria-labelledby="timeline-title" :style="{ '--timeline-canvas-height': `${timelineCanvasHeight}px` }">
      <section class="hero-copy">
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

      <!-- 注意：新增 preserveAspectRatio="none"，强制保证内部节点绝对匹配外层卡片的 CSS 百分比布局 -->
      <svg class="timeline-path" :viewBox="`0 0 ${timelineLayout.viewBoxWidth} ${timelineViewBoxHeight}`" fill="none" aria-hidden="true" preserveAspectRatio="none">
        <!-- 1. 基础底层线条 -->
        <path
          class="timeline-line"
          :d="timelinePathD"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
        
        <!-- 2. 跟随滚动的深红色成长实线 -->
        <path
          class="timeline-progress-line"
          :d="timelinePathD"
          stroke="#842130"
          stroke-width="3"
          stroke-linecap="round"
          pathLength="1000"
          :style="{
            strokeDasharray: '1000',
            strokeDashoffset: 1000 - scrollProgress * 1000
          }"
        />

        <!-- 3. 亮色短游标线 -->
        <path
          class="timeline-accent"
          :d="timelinePathD"
          pathLength="1000"
          :style="{
            strokeDasharray: '60 1000',
            strokeDashoffset: -(scrollProgress * 1000 - 60)
          }"
        />
      </svg>

      <!-- 节点圆点：用 HTML 渲染，确保是正圆 -->
      <div
        v-for="dot in nodeMarkers"
        :key="dot.id"
        :class="['timeline-marker', dot.className, { 'is-active': isNodeActive(dot.cy), 'is-current': dot.id === currentNodeId }]"
        :style="dot.style"
        aria-hidden="true"
      >
        <span v-if="dot.id === currentNodeId" class="timeline-marker-pulse"></span>
      </div>

      <article
        v-for="(card, index) in eventCards"
        :key="card.id"
        :class="['event-card', card.className, { 'is-active': isNodeActive(activeTimelineNodePositions[index].cy) }]"
        :style="{
          '--card-top': card.cardPosition.top,
          '--card-left': card.cardPosition.left || 'auto',
          '--card-right': card.cardPosition.right || 'auto'
        }"
      >
        <div class="card-cover">
          <img v-if="card.coverImage" :src="card.coverImage" :alt="card.title" loading="lazy" />
        </div>
        <div class="card-content">
          <span class="card-time">{{ card.time }}</span>
          <h2>{{ card.title }}</h2>
        </div>
      </article>

      <div class="page-actions return-actions">
        <button type="button" class="return-action return-action--back" @click="back">
          <span aria-hidden="true">←</span>
          返回上一页
        </button>
        <router-link class="return-action return-action--home" to="/home">
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
    url('@/assets/images/backgrounds/mult-page/page-bg.png') center top / cover fixed;
  color: #842130;
  font-family: var(--font-serif);
}

.timeline-canvas {
  --canvas-width: min(100vw, 1920px);
  position: relative;
  width: 100%;
  max-width: 1920px;
  min-height: max(var(--timeline-canvas-height, 1600px), calc(var(--canvas-width) * 1.12));
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


.hero-copy h1 {
  color: #842130;
  font-size: var(--font-size-timeline-title);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-none);
  letter-spacing: var(--letter-spacing-section);
}

.hero-description {
  margin-top: 24px;
  color: rgba(116, 88, 83, 0.8);
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-body);
}

.scroll-hint {
  margin-top: 52px;
  display: grid;
  justify-items: center;
  gap: 16px;
  color: rgba(168, 162, 158, 0.82);
  font-family: var(--font-sans);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-label);
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
  pointer-events: none;
}

.timeline-line {
  color: inherit;
}

.timeline-progress-line {
  transition: stroke-dashoffset 0.1s linear;
}

.timeline-accent {
  stroke: #c8828c;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.timeline-marker {
  position: absolute;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border-radius: 50%;
  background-color: #d1acac;
  opacity: 0.85;
  z-index: 1;
  pointer-events: none;
  transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.timeline-marker-primary {
  background-color: #d2aeae;
}

.timeline-marker.is-active {
  opacity: 1;
  background-color: #842130;
}

.timeline-marker.is-current {
  transform: scale(1.15);
  box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.5), 0 0 14px rgba(132, 33, 48, 0.55);
}

.timeline-marker-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background-color: rgba(132, 33, 48, 0.35);
  animation: timeline-pulse 1.6s ease-out infinite;
  pointer-events: none;
}

@keyframes timeline-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.9);
    opacity: 0;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-marker-pulse {
    animation: none;
    opacity: 0;
  }
}

.event-card {
  position: absolute;
  top: var(--card-top);
  left: var(--card-left);
  right: var(--card-right);
  width: clamp(340px, 28vw, 420px);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #f0eee9;
  box-shadow: 0 18px 40px rgba(132, 33, 48, 0.14);
  overflow: hidden;
  z-index: 2;

  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s 0.5s;
}

.event-card.is-active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity 0.5s ease 0.3s, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s, visibility 0s 0.3s;
}

.card-cover {
  width: 100%;
  background-color: #f5f3ef;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-cover img {
  display: block;
  width: 100%;
  height: auto;
}

.card-content {
  flex: 1;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-time {
  color: #b07a82;
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 0.04em;
}

.card-content h2 {
  margin: 0;
  color: #842130;
  font-size: 16px;
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
  letter-spacing: 0;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.page-actions {
  position: absolute;
  right: 32px;
  bottom: 24px;
  margin-top: 0;
  z-index: 3;
}

@media (max-width: 1200px) {
  .event-card {
    width: clamp(300px, 34vw, 400px);
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


  .hero-copy h1 {
    font-size: var(--font-size-14xl);
    letter-spacing: var(--letter-spacing-subtle);
  }

  .hero-description {
    font-size: var(--font-size-lg);
  }

  .timeline-path {
    top: 360px;
    left: 4%;
    width: 92%;
    height: 1180px;
  }

  .timeline-path .timeline-dot {
    display: none;
  }

  .timeline-marker {
    display: none;
  }

  .event-card {
    position: relative;
    inset: auto;
    width: calc(100% - 40px);
    min-width: 0;
    max-width: 490px;
    margin: 0 auto;
    min-height: 0;
  }

  .event-card-primary {
    top: auto;
    margin-top: 520px;
  }

  .event-card-secondary {
    margin-top: 72px;
  }

  .event-card + .event-card {
    margin-top: 72px;
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
    font-size: var(--font-size-10xl);
    line-height: var(--line-height-snug);
  }

  .hero-description br {
    display: none;
  }

  .card-content {
    padding: 18px 20px 22px;
  }
}
</style>