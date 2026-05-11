<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { fetchActivities } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const router = useRouter()
const activityArchivePageSize = 6

// 新增核心状态：
// scrollProgress 用于控制线段的真实弧长渲染比例 (0 到 1)
// currentY 用于保存屏幕中心所对应的 SVG 内部绝对 Y 坐标 (像素)
const scrollProgress = ref(0)
const currentY = ref(-9999) 
const pathLookupTable = ref([]) // 用于存储 Y轴坐标 到 弧长比例 的映射表

const pageInfo = ref({
  eyebrow: 'Chronicles of Excellence',
  title: '活动足迹·时光影卷',
  description: '穿梭于传统与创新的交汇点，记录实验室每一个具有里程碑意义的瞬间。\n每一张照片都是智慧的沉淀，每一段历程都是对未来的承诺。'
})

const timelineLayout = {
  viewBoxWidth: 978,
  topPercent: 15.35,
  leftPercent: 24.5,
  widthPercent: 51,
  heightPercent: 74,
  cardGap: 44,
  cardHalfHeight: 68,
  nodeRadius: 28,
  nodeStartY: 300,
  nodeSpacing: 330,
  nodeCenterX: 489,
  nodeOffsetX: 220,
  pathLead: 240,
  pathTail: 240,
}

const createTimelinePath = (nodes) => {
  if (!nodes.length) return ''

  const points = [
    { cx: timelineLayout.nodeCenterX, cy: Math.max(0, nodes[0].cy - timelineLayout.pathLead) },
    ...nodes,
    { cx: nodes[nodes.length - 1].cx, cy: nodes[nodes.length - 1].cy + timelineLayout.pathTail },
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
    id: 'fallback-activity-1',
    title: '活动剪影',
    description: '活动剪影图片区域展示的现场照片，记录了最具代表性的学术活动瞬间。',
    highlights: [
      { value: '图片卡', label: '入口类型' },
      { value: '活动剪影', label: '对应区域' },
    ],
  },
  {
    id: 'fallback-activity-2',
    title: '活动剪影',
    description: '点击后对应 academic-news 页面中的活动剪影图片卡入口。',
    highlights: [
      { value: '图像入口', label: '对应动作' },
      { value: 'activityId', label: '跳转键' },
    ],
  },
])

const descriptionLines = computed(() => String(pageInfo.value.description || '').split('\n'))
const timelineNodePositions = computed(() => activityCards.value.map((_, index) => ({
  id: `timeline-node-${index + 1}`,
  className: index === 0 ? 'timeline-dot-primary' : 'timeline-dot-secondary',
  cx: timelineLayout.nodeCenterX + (index % 2 === 0 ? -timelineLayout.nodeOffsetX : timelineLayout.nodeOffsetX),
  cy: timelineLayout.nodeStartY + index * timelineLayout.nodeSpacing,
})))
const activeTimelineNodePositions = computed(() => timelineNodePositions.value)

const timelineViewBoxHeight = computed(() => {
  const nodes = activeTimelineNodePositions.value
  const lastNode = nodes[nodes.length - 1]
  return Math.max(1600, (lastNode?.cy || timelineLayout.nodeStartY) + timelineLayout.pathTail + 120)
})

const timelineCanvasHeight = computed(() => Math.max(1600, 640 + activityCards.value.length * 260))
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

// 监听路径数据，渲染完成后重构表
watch(timelinePathD, async () => {
  await nextTick()
  updateLookupTable()
})

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

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  try {
    const res = await fetchActivities({ pageNum: 1, pageSize: activityArchivePageSize })
    const activities = res.rows || []
    if (activities.length) {
      pageInfo.value = {
        eyebrow: 'Activity Archive',
        title: '活动足迹·时光影卷',
        description: `已收录 ${res.total || activities.length} 场学术活动，记录每一次交流的现场瞬间。\n时间轴与学术动态页的活动存档保持同源。`
      }
      activityCards.value = activities.slice(0, activityArchivePageSize).map((activity, index) => ({
        id: activity.id || `activity-${index}`,
        title: activity.title || activity.name || '学术活动',
        description: activity.summary || activity.organizer || '活动详情整理中。',
        highlights: [
          { value: formatDate(activity.time), label: '活动时间' },
          { value: activity.location || '待定', label: '活动地点' }
        ]
      }))
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
        <p>{{ pageInfo.eyebrow }}</p>
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
        <defs>
          <circle id="timeline-node" :r="timelineLayout.nodeRadius" />
        </defs>
        
        <!-- 1. 基础底层线条 -->
        <path
          class="timeline-line"
          :d="timelinePathD"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
        />
        
        <!-- 2. 跟随滚动的深红色成长实线 -->
        <path
          class="timeline-progress-line"
          :d="timelinePathD"
          stroke="#842130"
          stroke-width="5"
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

        <!-- 节点：严格触碰点亮 -->
        <use
          v-for="dot in activeTimelineNodePositions"
          :key="dot.id"
          :class="['timeline-dot', dot.className, { 'is-active': isNodeActive(dot.cy) }]"
          href="#timeline-node"
          :x="dot.cx"
          :y="dot.cy"
        />
      </svg>

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
        <div class="card-content">
          <h2>{{ card.title }}</h2>
          <p>{{ card.description }}</p>
          <div class="impact-grid">
            <div v-for="item in card.highlights" :key="item.label">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
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
    url('@/assets/images/backgrounds/mult-page/bg.jpg') center top / cover fixed,
    #fbf9f4;
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

.hero-copy p {
  width: fit-content;
  margin: 0 auto 22px;
  padding: 4px 16px;
  border-radius: 12px;
  background-color: rgba(132, 33, 48, 0.1);
  color: #842130;
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-control);
  letter-spacing: var(--letter-spacing-title);
  text-transform: uppercase;
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
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.timeline-dot {
  fill: #d1acac;
  opacity: 0.8;
  position: relative;
  transition: all 0.2s ease;
}

.timeline-dot-primary {
  fill: #d2aeae;
}

.timeline-dot.is-active {
  opacity: 1;
  fill: #842130;
}

.event-card {
  position: absolute;
  top: var(--card-top);
  left: var(--card-left);
  right: var(--card-right);
  width: clamp(180px, 11.5vw, 220px);
  min-height: 132px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #f0eee9;
  box-shadow: 0 14px 34px rgba(132, 33, 48, 0.12);
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

.card-content {
  width: 100%;
  padding: 16px;
}

.card-content h2 {
  margin-bottom: 8px;
  color: #842130;
  font-size: 13px;
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  letter-spacing: 0;
}

.card-content p {
  max-width: none;
  margin-bottom: 12px;
  color: #745853;
  font-family: var(--font-sans);
  font-size: 11px;
  line-height: 1.45;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.impact-grid div {
  min-height: 42px;
  padding: 7px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f5f3ef;
}

.impact-grid strong {
  overflow: hidden;
  color: #842130;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.impact-grid span {
  margin-top: 4px;
  color: #745853;
  font-family: var(--font-sans);
  font-size: 10px;
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
    width: clamp(170px, 18vw, 210px);
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
    font-size: var(--font-size-2xs);
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
    padding: 24px;
  }

  .impact-grid {
    grid-template-columns: 1fr;
  }
}
</style>