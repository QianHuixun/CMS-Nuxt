<script setup>
import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as d3 from 'd3'
import { fetchKnowledgeGraph } from '@/api/index.js'

const router = useRouter()

const graphSvg = ref(null)

const colorMap = {
  center: '#6e1c24',
  book: '#944046',
  case: '#b67b73',
  visit: '#cba891',
  symptom: '#c1bba4',
  formula: '#d5ccaa',
  herb: '#abb698',
  pathology: '#d9c8b3',
  patient: '#e3e3e3'
}

const books = ref([
  { id: 'b1', name: '《临证指南医案》', count: 224, active: true },
  { id: 'b2', name: '《叶天士晚年方案真本》', count: 200, active: false },
  { id: 'b3', name: '《叶氏医案存真》', count: 200, active: false },
  { id: 'b4', name: '《未刻本叶氏医案》', count: 200, active: false },
  { id: 'b5', name: '《眉寿堂方案选存》', count: 200, active: false },
  { id: 'b6', name: '《三家医案合刻》', count: 50, active: false },
  { id: 'b7', name: '《种福堂公选医案》', count: 50, active: false }
])

const entityTypes = [
  { type: 'formula', label: '方剂' },
  { type: 'herb', label: '中药' },
  { type: 'visit', label: '诊次' },
  { type: 'symptom', label: '症状' },
  { type: 'pathology', label: '病因病机' },
  { type: 'patient', label: '患者信息' }
]

const legends = [
  { type: 'book', label: '古籍' },
  { type: 'case', label: '医案' },
  { type: 'visit', label: '诊次' },
  { type: 'symptom', label: '症状' },
  { type: 'formula', label: '方剂' },
  { type: 'herb', label: '中药' }
]

const caseDetail = ref({
  title: '《临证指南医案》',
  subtitle: 'Case_1-4 · 叶天士医案知识图谱',
  text: '稚年纯阳体质，热症最多。病偏右胸高，呼气不利，肺气不能清肃。热郁内蒸，逆传膻中，致天君震动，状若痫症。夫肺主卫，心主营，二气循环于肺胃脉中。',
  tags: [
    { label: '肺气不能清肃', type: 'pathology' },
    { label: '痫症', type: 'symptom' },
    { label: '四苓', type: 'formula' },
    { label: '茯苓', type: 'herb' },
    { label: '淡竹叶', type: 'herb' }
  ],
  summary: [
    { label: '来源', value: '《临证指南医案》' },
    { label: '诊次', value: '5 次，默认显示诊次1' },
    { label: '实体', value: '症状 7 · 病机 6 · 方剂 5 · 中药 28' },
    { label: '关系', value: '组成、加味、减味、诊次用方' }
  ]
})

const graphData = ref({
  nodes: [
    { id: 'center', label: '叶天士医案\n知识图谱', type: 'center', level: 1, rings: 3 },
    { id: 'n1', label: '叶天士晚年\n方案真本', type: 'book', level: 2, rings: 1 },
    { id: 'n2', label: '案1-4', type: 'center', level: 3, rings: 1 },
    { id: 'n3', label: '眉寿堂\n方案选存', type: 'visit', level: 2, rings: 0 },
    { id: 'n4', label: '未刻本\n叶氏医案', type: 'symptom', level: 2, rings: 0 },
    { id: 'n5', label: '病因病机\n肺热', type: 'pathology', level: 2, rings: 1 },
    { id: 'n6', label: '症状\n咳嗽', type: 'formula', level: 3, rings: 1 },
    { id: 'n7', label: '方剂\n四苓', type: 'formula', level: 3, rings: 1 },
    { id: 'n8', label: '诊次1', type: 'center', level: 3, rings: 1 },
    { id: 'n9', label: '组成\n草药', type: 'formula', level: 3, rings: 1 },
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `p${i}`,
      label: '',
      type: ['herb', 'symptom', 'case', 'formula', 'pathology'][Math.floor(Math.random() * 5)],
      level: Math.random() > 0.6 ? 4 : 5,
      rings: 0
    }))
  ],
  links: [
    { source: 'center', target: 'n1' },
    { source: 'center', target: 'n2' },
    { source: 'center', target: 'n3' },
    { source: 'center', target: 'n4' },
    { source: 'center', target: 'n5' },
    { source: 'n1', target: 'n6' },
    { source: 'n1', target: 'n9' },
    { source: 'center', target: 'n8' },
    { source: 'center', target: 'n7' },
    { source: 'n2', target: 'n7' },
    { source: 'n5', target: 'n6' },
    ...Array.from({ length: 40 }, (_, i) => ({
      source: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8'][Math.floor(Math.random() * 8)],
      target: `p${i}`
    }))
  ]
})

function updateSidePanel(node) {
  if (!node.label) return
  const title = node.label.replace(/\n/g, '')
  caseDetail.value.title = title
  caseDetail.value.subtitle = '当前选中节点 · 知识图谱'
  caseDetail.value.text = `这是关于【${title}】的详细描述。当前为动态生成的交互数据。在真实系统中，此处将请求并展示该实体相关的医案内容、病症分析或古籍段落。`
}

function copyToClipboard() {
  try {
    document.execCommand('copy')
    showToast('医案ID已复制')
  } catch (err) {
    console.error('复制失败', err)
  }
}

function showToast(message) {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.7); color: white; padding: 10px 20px;
    border-radius: 4px; z-index: 1000; font-size: var(--font-size-md);
    transition: opacity 0.5s;
  `
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 500)
  }, 2000)
}

let simulation = null
let resizeHandler = null
let activeAnimations = new Set()

function getInitialPosition(node, index, width, height) {
  const centerX = width / 2
  const centerY = height / 2
  if (node.level === 1) {
    return { x: centerX, y: centerY, fx: centerX, fy: centerY }
  }

  const minSide = Math.min(width, height)
  const layerRadiusMap = {
    2: minSide * 0.18,
    3: minSide * 0.32,
    4: minSide * 0.43,
    5: minSide * 0.52
  }
  const sameLevelNodes = graphData.value.nodes.filter(item => item.level === node.level)
  const levelIndex = sameLevelNodes.findIndex(item => item.id === node.id)
  const count = Math.max(sameLevelNodes.length, 1)
  const angleOffset = node.level * Math.PI / 9
  const angle = (Math.PI * 2 * levelIndex / count) + angleOffset
  const jitter = node.level >= 4 ? ((index % 3) - 1) * minSide * 0.025 : 0
  const radius = (layerRadiusMap[node.level] || minSide * 0.52) + jitter

  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius
  }
}

function initD3Graph() {
  const svgElement = graphSvg.value
  if (!svgElement) return

  const parentRect = svgElement.parentElement.getBoundingClientRect()
  const width = parentRect.width || 800
  const height = parentRect.height || 600

  const svg = d3.select(svgElement)
    .attr('viewBox', [0, 0, width, height])
  svg.selectAll('*').remove()

  const g = svg.append('g')
  const zoom = d3.zoom()
    .scaleExtent([0.3, 4])
    .on('zoom', (event) => g.attr('transform', event.transform))
  svg.call(zoom)

  const nodes = graphData.value.nodes.map((node, index) => ({ ...node, ...getInitialPosition(node, index, width, height) }))
  const links = graphData.value.links.map(link => ({ ...link }))

  const getRadius = (level) => {
    const sizes = { 1: 55, 2: 38, 3: 28, 4: 15, 5: 10 }
    return sizes[level] || 10
  }

  const getLayerRadius = (level) => {
    const minSide = Math.min(width, height)
    const layers = {
      1: 0,
      2: minSide * 0.18,
      3: minSide * 0.32,
      4: minSide * 0.43,
      5: minSide * 0.52
    }
    return layers[level] || minSide * 0.52
  }

  simulation = d3.forceSimulation(nodes)
    .alphaTarget(0.025)
    .velocityDecay(0.38)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
      const sourceLevel = d.source.level || 3
      const targetLevel = d.target.level || 3
      return 45 + Math.max(sourceLevel, targetLevel) * 18
    }))
    .force('charge', d3.forceManyBody().strength(d => d.level <= 2 ? -460 : -180))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => getRadius(d.level) + 12))
    .force('radial', d3.forceRadial(d => getLayerRadius(d.level), width / 2, height / 2).strength(d => d.level === 1 ? 1 : 0.35))
    .force('x', d3.forceX(width / 2).strength(d => d.level === 1 ? 0.35 : 0.02))
    .force('y', d3.forceY(height / 2).strength(d => d.level === 1 ? 0.35 : 0.02))

  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#dfd3c3')
    .attr('stroke-opacity', 0.9)
    .attr('stroke-width', 1.5)

  const node = g.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation))

  node.each(function (d) {
    const el = d3.select(this)
    const r = getRadius(d.level)
    const color = colorMap[d.type] || '#ccc'

    if (d.rings > 0) {
      const ringGroup = el.append('g').attr('class', 'kg-node-rings')
      for (let i = 1; i <= d.rings; i++) {
        ringGroup.append('circle')
          .attr('fill', 'none')
          .attr('stroke-dasharray', '4, 4')
          .attr('pointer-events', 'none')
          .attr('r', r + i * 8)
          .attr('stroke', color)
          .attr('opacity', 0.7 - (i * 0.15))
      }
    }

    const bodyGroup = el.append('g').attr('class', 'kg-node-body')

    bodyGroup.append('circle')
      .attr('r', r)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', d.level === 1 ? 3 : 2)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        bodyGroup
          .transition().duration(200)
          .attr('transform', 'scale(1.05)')
        d3.select(this)
          .transition().duration(200)
          .attr('stroke', 'rgba(110,28,36,0.4)')
          .attr('stroke-width', 4)
      })
      .on('mouseout', function () {
        bodyGroup
          .transition().duration(200)
          .attr('transform', 'scale(1)')
        d3.select(this)
          .transition().duration(200)
          .attr('stroke', '#fff')
          .attr('stroke-width', d.level === 1 ? 3 : 2)
      })

    if (d.label) {
      const lines = d.label.split('\n')
      const textEl = bodyGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('pointer-events', 'none')
        .attr('fill', '#fff')
        .attr('font-size', d.level === 1 ? '18px' : '12px')
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.3)')

      lines.forEach((line, i) => {
        textEl.append('tspan')
          .attr('x', 0)
          .attr('y', lines.length > 1 ? (i === 0 ? '-0.6em' : '0.6em') : '0')
          .text(line)
      })
    }
  })

  node.on('click', function (event, d) {
    if (event.defaultPrevented || d.__dragged) return
    updateSidePanel(d)
  })

  let mousePos = null
  svg.on('mousemove', (event) => {
    mousePos = d3.pointer(event, g.node())
  })
  svg.on('mouseleave', () => {
    mousePos = null
  })

  let ringRotation = 0

  simulation.on('tick', () => {
    if (mousePos) {
      nodes.forEach(d => {
        if (d.level > 3) {
          const dx = mousePos[0] - d.x
          const dy = mousePos[1] - d.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150 && dist > 5) {
            d.vx += (dx / dist) * 0.4
            d.vy += (dy / dist) * 0.4
          }
        }
      })
    }

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    ringRotation = (ringRotation + 0.12) % 360
    node
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .select('.kg-node-rings')
      .attr('transform', d => `rotate(${d.level % 2 === 0 ? -ringRotation : ringRotation})`)
  })

  function animateNodeToCenter(d) {
    activeAnimations.delete(d.id)

    const centerX = width / 2
    const centerY = height / 2
    const startX = d.x
    const startY = d.y
    const duration = 650
    const startTime = performance.now()

    activeAnimations.add(d.id)

    function step(now) {
      if (!activeAnimations.has(d.id)) return

      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      d.fx = startX + (centerX - startX) * eased
      d.fy = startY + (centerY - startY) * eased
      simulation.alpha(0.12).restart()

      if (progress < 1) {
        requestAnimationFrame(step)
        return
      }

      d.fx = centerX
      d.fy = centerY
      activeAnimations.delete(d.id)
    }

    requestAnimationFrame(step)
  }

  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
      d.__dragged = false
    }
    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
      d.__dragged = true
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.025)
      if (d.level === 1) {
        animateNodeToCenter(d)
        return
      }
      d.fx = null
      d.fy = null
    }
    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  resizeHandler = () => {
    const newRect = svgElement.parentElement.getBoundingClientRect()
    const w = newRect.width || 800
    const h = newRect.height || 600
    const centerX = w / 2
    const centerY = h / 2
    svg.attr('viewBox', [0, 0, w, h])
    nodes.forEach(node => {
      if (node.level === 1) {
        node.fx = centerX
        node.fy = centerY
      }
    })
    simulation.force('center', d3.forceCenter(centerX, centerY))
    simulation.force('radial', d3.forceRadial(d => {
      const minSide = Math.min(w, h)
      const layers = {
        1: 0,
        2: minSide * 0.18,
        3: minSide * 0.32,
        4: minSide * 0.43,
        5: minSide * 0.52
      }
      return layers[d.level] || minSide * 0.52
    }, centerX, centerY).strength(d => d.level === 1 ? 1 : 0.35))
    simulation.force('x', d3.forceX(centerX).strength(d => d.level === 1 ? 0.35 : 0.02))
    simulation.force('y', d3.forceY(centerY).strength(d => d.level === 1 ? 0.35 : 0.02))
    simulation.alpha(0.3).restart()
  }

  window.addEventListener('resize', resizeHandler)
}

onMounted(async () => {
  try {
    const data = await fetchKnowledgeGraph()
    if (data?.books?.length) {
      books.value = data.books
    }
    if (data?.detail) {
      caseDetail.value = data.detail
    }
    if (data?.nodes?.length && data?.links?.length) {
      graphData.value = {
        nodes: data.nodes,
        links: data.links
      }
    }
  } catch (e) {
    console.error(e)
  }

  await nextTick()
  setTimeout(initD3Graph, 150)
})

onBeforeUnmount(() => {
  activeAnimations.clear()
  if (simulation) {
    simulation.stop()
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})

function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="knowledge-page">
    <aside class="sidebar-left">
      <div class="logo-title">图谱浏览</div>
      <div class="main-tabs">
        <button class="main-tab active">古籍总览</button>
        <button class="main-tab">医案浏览</button>
      </div>
      <div class="section-title">来源古籍</div>
      <div class="book-list">
        <div
          v-for="book in books"
          :key="book.id"
          :class="['kg-book-item', { active: book.active }]"
        >
          <span>{{ book.name }}</span>
          <span class="kg-book-count">{{ book.count }}</span>
        </div>
      </div>
      <div class="entity-types-container">
        <div class="section-title">实体类型</div>
        <div class="entity-tags">
          <span
            v-for="tag in entityTypes"
            :key="tag.type"
            class="kg-entity-tag"
            :style="{ backgroundColor: colorMap[tag.type] }"
          >
            {{ tag.label }}
          </span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <svg ref="graphSvg" id="graph-svg"></svg>
      <div class="graph-legend">
        <div v-for="leg in legends" :key="leg.type" class="kg-legend-item">
          <div class="kg-legend-dot" :style="{ backgroundColor: colorMap[leg.type] }"></div>
          <span>{{ leg.label }}</span>
        </div>
      </div>
    </main>

    <aside class="sidebar-right">
      <div class="search-wrapper">
        <input type="text" class="search-input" placeholder="搜索医案 / 古籍 / 实体" />
        <button class="search-btn">检索</button>
      </div>
      <div class="detail-card">
        <div class="detail-label">医案详情</div>
        <div class="kg-detail-title">{{ caseDetail.title }}</div>
        <div class="kg-detail-subtitle">{{ caseDetail.subtitle }}</div>
        <div class="kg-detail-tabs">
          <button class="kg-d-tab active">原文</button>
          <button class="kg-d-tab">诊次</button>
          <button class="kg-d-tab">实体</button>
          <button class="kg-d-tab">关系</button>
        </div>
        <div class="kg-content-box">
          <div class="kg-content-text">{{ caseDetail.text }}</div>
          <div class="kg-content-tags">
            <span
              v-for="tag in caseDetail.tags"
              :key="`${tag.type}-${tag.label}`"
              class="kg-c-tag"
              :style="{ backgroundColor: colorMap[tag.type] }"
            >
              {{ tag.label }}
            </span>
          </div>
        </div>
        <div class="kg-summary-section">
          <div class="kg-summary-header">结构化摘要</div>
          <div class="kg-summary-list">
            <div v-for="item in caseDetail.summary" :key="item.label" class="kg-summary-row">
              <span class="kg-s-label">{{ item.label }}</span>
              <span class="kg-s-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div class="action-row">
          <button class="action-btn" @click="copyToClipboard">复制医案ID</button>
          <button class="action-btn">分享当前视图</button>
        </div>
      </div>
      <button class="btn-back return-action return-action--home" @click="goHome">
        返回首页
      </button>
    </aside>
  </div>
</template>

<style scoped>
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d5c8bb; border-radius: 3px; }

.knowledge-page,
.knowledge-page * {
  box-sizing: border-box;
}

.knowledge-page {
  width: 100%;
  height: calc(100vh - 53px);
  display: flex;
  background: url('@/assets/images/backgrounds/mult-page/page-bg.png') center center / cover fixed;
  color: var(--color-text);
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.sidebar-left {
  width: 280px;
  background: #FBF9F466;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 10;
}

.logo-title {
  font-size: var(--font-size-8xl);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.main-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 18px;
  border-bottom: 1px solid #E5DCDC;
}

.main-tab {
  padding: 8px 16px;
  background: #eedddc;
  color: #8c5b5f;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  font-family: var(--font-sans);
  transition: all 0.3s;
  border-radius: 4px;
}

.main-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.section-title {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: 15px;
  position: relative;
  padding-left: 10px;
  font-weight: var(--font-weight-bold);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background-color: var(--color-primary);
}

.book-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.kg-book-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: var(--font-size-sm);
  border-radius: 4px;
  border-bottom: 1px solid #e8dfd5;
  transition: all 0.2s;
}

.kg-book-item:hover {
  background: rgba(255, 255, 255, 0.6);
}

.kg-book-item.active {
  background: #F0E3E4;
  border: 1px solid #d5c8bb;
  color: var(--color-primary);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.kg-book-count {
  color: var(--color-secondary);
}

.kg-book-item.active .kg-book-count {
  color: var(--color-primary);
}

.entity-types-container {
  margin-top: auto;
}

.entity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.kg-entity-tag {
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: transparent;
}

#graph-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
  display: block;
}

#graph-svg:active {
  cursor: grabbing;
}

.graph-legend {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  width: max-content;
  max-width: 90%;
  background: rgba(253, 250, 246, 0.95);
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(132, 33, 48, 0.08);
  border: 1px solid var(--color-border);
  z-index: 100;
  pointer-events: auto;
  backdrop-filter: blur(4px);
}

.kg-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  flex-shrink: 0;
}

.kg-legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.sidebar-right {
  width: 360px;
  background: #FBF9F466;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 10;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.02);
  overflow-y: auto;
}

.search-wrapper {
  display: flex;
  margin-bottom: 30px;
  border: 1px solid #d5c8bb;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
}

.search-input {
  flex: 1;
  border: none;
  padding: 10px 15px;
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  outline: none;
  background: transparent;
}

.search-btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 0 20px;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  transition: opacity 0.2s;
}

.search-btn:hover {
  opacity: 0.9;
}

.detail-card {
  flex: 1;
  overflow-y: auto;
}

.detail-label {
  padding: 8px 16px;
  background: #eedddc;
  color: #8c5b5f;
  border: none;
  font-size: var(--font-size-lg);
  font-family: var(--font-sans);
  border-radius: 4px;
  margin-bottom: 15px;
  display: inline-block;
}

.kg-detail-title {
  font-size: var(--font-size-5xl);
  color: var(--color-text);
  margin-bottom: 6px;
  font-weight: var(--font-weight-bold);
}

.kg-detail-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-secondary);
  margin-bottom: 20px;
}

.kg-detail-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.kg-d-tab {
  padding: 8px 16px;
  background: #eedddc;
  color: #8c5b5f;
  border: none;
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.kg-d-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.kg-content-box {
  background: #fff;
  border: 1px solid var(--color-border);
  padding: 20px;
  margin-bottom: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.kg-content-text {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-reading);
  color: var(--color-text);
  text-align: justify;
  margin-bottom: 20px;
}

.kg-content-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.kg-c-tag {
  padding: 4px 10px;
  font-size: var(--font-size-sm);
  color: #fff;
  border-radius: 4px;
}

.kg-summary-header {
  font-size: var(--font-size-md);
  color: var(--color-primary);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: var(--font-weight-bold);
}

.kg-summary-header::before {
  content: '';
  width: 12px;
  height: 3px;
  background: var(--color-primary);
  border-radius: 2px;
}

.kg-summary-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px dashed var(--color-border);
  font-size: var(--font-size-sm);
}

.kg-summary-row:last-child {
  border-bottom: none;
}

.kg-s-label {
  width: 50px;
  color: var(--color-secondary);
}

.kg-s-value {
  flex: 1;
  color: var(--color-text);
}

.action-row {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: 1px solid #d5c8bb;
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  border-radius: 4px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
