<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SubNavBar from '@/components/SubNavBar.vue'

const route = useRoute()
const router = useRouter()
const profilePanel = ref(null)
const connectorSvg = ref(null)
const publicationList = ref(null)
const expertStrip = ref(null)
const connectorPaths = ref([])
const dragStartX = ref(0)
const dragOffsetX = ref(0)
const isDraggingStrip = ref(false)
const suppressStripClick = ref(false)
let wheelLock = false
let connectorResizeObserver

const experts = [
  {
    id: 'chen-wei',
    name: '陈伟',
    degree: '博士',
    title: '首席研究员',
    subtitle: '博士生导师',
    photo: '/images/expert-detail/expert-photo-24de6d.png',
    focus: '出土医简保护',
    bio: '陈伟博士是将古代医学文献与现代计算诊断相结合的权威专家。他三十年的职业生涯致力于天回医简的保护工作，将失传的经脉转化为数字模型。他的工作在传统经验智慧与现代科学验证之间架起了一座桥梁，确保了中医珍贵遗产在数字时代的传承与演进。',
    publications: [
      { number: '01', title: '《天回医简研究》专题论丛' },
      { number: '02', title: '《汉代医学文献编年》学术专著' },
      { number: '03', title: '多光谱技术在出土竹木简牍中的应用研究' },
      { number: '04', title: '古代经脉文献数字模型构建方法' },
      { number: '05', title: '天回医简保护修复技术报告' },
      { number: '06', title: '出土医学文献知识标注规范' },
    ],
  },
  {
    id: 'lin-yue',
    name: '林悦',
    degree: '博士',
    title: '图像计算专家',
    subtitle: '副研究员',
    photo: '/images/expert-detail/card-image-1-3d674a.png',
    focus: '多光谱影像',
    bio: '林悦博士长期从事简牍多光谱采集与低对比度字迹增强研究，负责实验室影像采集流程、图像质量评估和残损文字复原模型建设。',
    publications: [
      { number: '01', title: '多光谱影像在竹木简牍识读中的应用' },
      { number: '02', title: '低对比度墨迹增强算法评估' },
      { number: '03', title: '出土文献影像采集质量控制规范' },
      { number: '04', title: '残损医简文字复原实验报告' },
    ],
  },
  {
    id: 'zhou-ming',
    name: '周明',
    degree: '博士',
    title: '医学史研究员',
    subtitle: '教授',
    photo: '/images/expert-detail/card-image-2-4cbd0d.png',
    focus: '汉代医学史',
    bio: '周明教授关注汉代医学知识体系、方剂谱系和医籍流传路径，参与多批出土医学文献的释读、编年和术语考证工作。',
    publications: [
      { number: '01', title: '汉代医学文献编年与术语演变' },
      { number: '02', title: '出土方剂文本的知识谱系研究' },
      { number: '03', title: '早期医籍流传路径考辨' },
      { number: '04', title: '简帛医学术语校释札记' },
    ],
  },
  {
    id: 'xu-qing',
    name: '徐青',
    degree: '博士',
    title: '知识工程专家',
    subtitle: '研究员',
    photo: '/images/expert-detail/expert-photo-24de6d.png',
    focus: '知识图谱',
    bio: '徐青博士负责中医药古籍实体抽取、关系建模与知识图谱平台建设，将文献、文物、方剂和疾病概念纳入可检索的结构化网络。',
    publications: [
      { number: '01', title: '出土医学文献实体识别体系研究' },
      { number: '02', title: '面向古医籍的知识图谱建模方法' },
      { number: '03', title: '方剂、药物与病证关系抽取实验' },
      { number: '04', title: '医学文献数字平台语义检索设计' },
    ],
  },
  {
    id: 'he-ran',
    name: '何然',
    degree: '博士',
    title: '文物保护专家',
    subtitle: '研究馆员',
    photo: '/images/expert-detail/card-image-1-3d674a.png',
    focus: '文物保护',
    bio: '何然博士专注出土竹木简牍稳定化处理、保存环境评估和数字化前置保护，推动文物保护流程与数字采集流程协同。',
    publications: [
      { number: '01', title: '竹木简牍保存环境风险评估' },
      { number: '02', title: '出土医学文物数字化前置保护流程' },
      { number: '03', title: '简牍材料病害识别与记录规范' },
      { number: '04', title: '文物保护数据集成平台建设实践' },
    ],
  },
  {
    id: 'wan-li',
    name: '万理',
    degree: '博士',
    title: '数据治理专家',
    subtitle: '副教授',
    photo: '/images/expert-detail/card-image-2-4cbd0d.png',
    focus: '数据标准',
    bio: '万理博士负责多源医学文献数据清洗、版本管理和元数据标准设计，推动实验室数据从采集、标注到发布的全流程治理。',
    publications: [
      { number: '01', title: '出土医学文献元数据标准研究' },
      { number: '02', title: '多源文献数据质量评估模型' },
      { number: '03', title: '数字实验室数据治理流程设计' },
      { number: '04', title: '医学文献版本管理与溯源机制' },
    ],
  },
  {
    id: 'zhao-ning',
    name: '赵宁',
    degree: '博士',
    title: '语义检索专家',
    subtitle: '研究员',
    photo: '/images/expert-detail/expert-photo-24de6d.png',
    focus: '智能检索',
    bio: '赵宁博士从事古医籍语义检索、跨文献问答和研究辅助系统设计，让复杂的出土医学资料能够被更自然地发现、比较和引用。',
    publications: [
      { number: '01', title: '古医籍语义检索系统设计' },
      { number: '02', title: '跨文献证据链组织方法' },
      { number: '03', title: '面向医学史研究的问答模型评估' },
      { number: '04', title: '出土文献智能检索交互研究' },
    ],
  },
]

const currentExpert = computed(() => {
  return experts.find((expert) => expert.id === route.params.id) ?? experts[0]
})

const currentExpertIndex = computed(() => {
  const index = experts.findIndex((expert) => expert.id === currentExpert.value.id)
  return index === -1 ? 0 : index
})

const normalizeOffset = (index) => {
  const half = Math.floor(experts.length / 2)
  let offset = index - currentExpertIndex.value

  if (offset > half) offset -= experts.length
  if (offset < -half) offset += experts.length
  return offset
}

const getOffsetX = (offset) => {
  const positions = {
    '-3': -760,
    '-2': -520,
    '-1': -315,
    0: 0,
    1: 315,
    2: 520,
    3: 760,
  }

  return positions[offset] ?? offset * 260
}

const stripExperts = computed(() => {
  return experts.map((expert, index) => {
    const offset = normalizeOffset(index)
    const distance = Math.abs(offset)
    return {
      expert,
      offset,
      distance,
      style: {
        '--x': `${getOffsetX(offset) + dragOffsetX.value}px`,
        '--z': `${10 - distance}`,
      },
    }
  })
})

const getStripCardClass = (distance) => {
  if (distance === 0) return 'is-current'
  if (distance === 1) return 'is-near'
  if (distance === 2) return 'is-mid'
  return 'is-far'
}

const isCurrentStripCard = (item) => {
  return item.offset === 0
}

const goToExpertByIndex = (index) => {
  const nextIndex = (index + experts.length) % experts.length
  router.push(`/expert/${experts[nextIndex].id}`)
}

const goToAdjacentExpert = (direction) => {
  goToExpertByIndex(currentExpertIndex.value + direction)
}

const handleStripWheel = (event) => {
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

  if (Math.abs(delta) < 18 || wheelLock) return

  event.preventDefault()
  wheelLock = true
  goToAdjacentExpert(delta > 0 ? 1 : -1)
  window.setTimeout(() => {
    wheelLock = false
  }, 560)
}

const handleStripPointerDown = (event) => {
  isDraggingStrip.value = true
  dragStartX.value = event.clientX
  dragOffsetX.value = 0
  expertStrip.value?.setPointerCapture?.(event.pointerId)
}

const handleStripPointerMove = (event) => {
  if (!isDraggingStrip.value) return
  dragOffsetX.value = Math.max(-140, Math.min(140, event.clientX - dragStartX.value))
}

const finishStripDrag = () => {
  if (!isDraggingStrip.value) return

  const distance = dragOffsetX.value
  isDraggingStrip.value = false
  dragOffsetX.value = 0

  if (Math.abs(distance) > 70) {
    suppressStripClick.value = true
    goToAdjacentExpert(distance < 0 ? 1 : -1)
    window.setTimeout(() => {
      suppressStripClick.value = false
    }, 0)
  }
}

const handleStripCardClick = (event) => {
  if (!suppressStripClick.value) return
  event.preventDefault()
  event.stopPropagation()
}

const updateConnectorPaths = () => {
  const panelEl = profilePanel.value
  const svgEl = connectorSvg.value
  const listEl = publicationList.value

  if (!panelEl || !svgEl || !listEl) {
    connectorPaths.value = []
    return
  }

  const svgRect = svgEl.getBoundingClientRect()
  const listRect = listEl.getBoundingClientRect()
  const itemEls = [...listEl.querySelectorAll('.publication-item')]

  if (!svgRect.width || !svgRect.height || !itemEls.length) {
    connectorPaths.value = []
    return
  }

  const startX = 0
  const startY = svgRect.height / 2
  const endX = svgRect.width
  const listLeftInSvg = listRect.left - svgRect.left
  const targetX = Math.min(endX, Math.max(startX, listLeftInSvg))

  connectorPaths.value = itemEls.map((itemEl) => {
    const itemRect = itemEl.getBoundingClientRect()
    const targetY = itemRect.top + itemRect.height / 2 - svgRect.top
    const controlOneX = svgRect.width * 0.36
    const controlTwoX = svgRect.width * 0.64
    return `M${startX} ${startY} C${controlOneX} ${startY}, ${controlTwoX} ${targetY}, ${targetX} ${targetY}`
  })
}

const syncLayout = () => {
  nextTick(updateConnectorPaths)
}

onMounted(() => {
  syncLayout()
  window.addEventListener('resize', updateConnectorPaths)
  connectorResizeObserver = new ResizeObserver(updateConnectorPaths)
  ;[profilePanel.value, connectorSvg.value, publicationList.value].forEach((element) => {
    if (element) connectorResizeObserver.observe(element)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateConnectorPaths)
  connectorResizeObserver?.disconnect()
})

watch(() => route.params.id, syncLayout)
watch(() => currentExpert.value.publications.length, () => nextTick(updateConnectorPaths))
</script>

<template>
  <main class="expert-detail-page">
    <SubNavBar class="expert-sub-nav" />

    <section class="expert-stage" aria-label="专家详情">
      <article ref="profilePanel" class="profile-panel">
        <section class="profile-column">
          <div class="portrait-wrap">
            <img
              :src="currentExpert.photo"
              :alt="`${currentExpert.name}${currentExpert.degree}`"
              class="portrait"
            >
          </div>

          <div class="expert-copy">
            <div class="name-row">
              <h1>{{ currentExpert.name }} {{ currentExpert.degree }}</h1>
              <p>{{ currentExpert.title }}<br>{{ currentExpert.subtitle }}</p>
            </div>

            <p class="bio">{{ currentExpert.bio }}</p>
          </div>
        </section>

        <svg ref="connectorSvg" class="connector-lines" aria-hidden="true">
          <path
            v-for="(path, index) in connectorPaths"
            :key="`${currentExpert.id}-${index}`"
            :d="path"
          />
        </svg>

        <section ref="publicationList" class="publication-list" aria-label="专家成果">
          <router-link
            v-for="(publication, index) in currentExpert.publications"
            :key="`${currentExpert.id}-${index}`"
            class="publication-item"
            :to="index === 0 ? '/paper/tianhui-medical-slip' : '/paper/meridian-bioelectric'"
          >
            <div class="publication-copy">
              <span>{{ publication.number }}</span>
              <h2>{{ publication.title }}</h2>
            </div>
            <img src="/images/expert-detail/arrow-icon.svg" alt="" aria-hidden="true">
          </router-link>
        </section>
      </article>

      <section ref="expertStrip" class="expert-strip" aria-label="专家列表">
        <div
          class="expert-strip-track"
          @wheel="handleStripWheel"
          @pointerdown="handleStripPointerDown"
          @pointermove="handleStripPointerMove"
          @pointerup="finishStripDrag"
          @pointercancel="finishStripDrag"
          @pointerleave="finishStripDrag"
        >
          <router-link
          v-for="item in stripExperts"
          :key="item.expert.id"
          :to="`/expert/${item.expert.id}`"
          :class="['expert-card', getStripCardClass(item.distance), { 'is-dragging': isDraggingStrip }]"
          :style="item.style"
          :aria-current="isCurrentStripCard(item) ? 'page' : undefined"
          :data-current="isCurrentStripCard(item) ? 'true' : undefined"
          @click="handleStripCardClick"
          >
            <img :src="item.expert.photo" :alt="`${item.expert.name}${item.expert.degree}`">
            <div class="expert-card-copy">
              <h2>{{ item.expert.name }} {{ item.expert.degree }}</h2>
              <p>{{ item.expert.title }}</p>
              <span>{{ item.expert.focus }} / {{ item.expert.subtitle }}</span>
            </div>
          </router-link>
        </div>
      </section>
    </section>

    <footer class="page-actions">
      <button type="button" class="secondary-action" @click="$router.back()">
        <img src="/images/expert-detail/back-icon.svg" alt="" aria-hidden="true">
        返回上一页
      </button>
      <router-link class="primary-action" to="/home">
        <img src="/images/expert-detail/home-icon.svg" alt="" aria-hidden="true">
        返回首页
      </router-link>
    </footer>
  </main>
</template>

<style scoped>
.expert-detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    linear-gradient(rgba(248, 245, 240, 0.88), rgba(248, 245, 240, 0.9)),
    url('/home-bg2.png') center / cover fixed;
  color: #2b2520;
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.expert-detail-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(132, 33, 48, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(132, 33, 48, 0.02) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.55;
}

.expert-stage,
.page-actions {
  position: relative;
  z-index: 1;
  width: min(1280px, 100%);
  margin-right: auto;
  margin-left: auto;
}

.expert-sub-nav {
  flex: 0 0 auto;
  width: 100%;
  margin-bottom: clamp(14px, 2vh, 26px);
  background-color: #f8f6f0;
}

.expert-stage {
  flex: 1;
  min-height: 0;
  padding: 0 clamp(16px, 2.4vw, 32px) 184px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.profile-panel {
  width: 1160px;
  max-width: 100%;
  height: 570px;
  max-height: calc(100vh - 276px);
  margin: 0 auto;
  padding: 36px 48px;
  display: grid;
  grid-template-columns: minmax(260px, 0.86fr) clamp(56px, 8vw, 112px) minmax(340px, 1.14fr);
  gap: clamp(16px, 2vw, 26px);
  align-items: stretch;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: clamp(16px, 2vw, 24px);
  background-color: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 42px -18px rgba(36, 28, 22, 0.28);
}

.profile-column {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.portrait-wrap {
  width: 100%;
  max-width: 386px;
  height: auto;
  max-height: 330px;
  aspect-ratio: 1 / 0.86;
  overflow: hidden;
  border-radius: 3px;
  background-color: #eee4dc;
  box-shadow: 0 12px 26px rgba(43, 37, 32, 0.16);
}

.portrait {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1);
  transition: filter 0.45s ease, transform 0.45s ease;
}

.portrait-wrap:hover .portrait {
  filter: grayscale(0);
  transform: scale(1.015);
}

.expert-copy {
  margin-top: clamp(14px, 2vh, 22px);
}

.name-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
}

.name-row h1 {
  min-width: 0;
  color: #2b2520;
  font-family: "Noto Serif SC", "SimSun", serif;
  font-size: clamp(26px, 2.4vw, 32px);
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
}

.name-row p {
  flex: 0 0 auto;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  text-align: right;
}

.bio {
  margin-top: clamp(12px, 1.7vh, 18px);
  color: #615d59;
  font-size: clamp(13px, 1.1vw, 14px);
  line-height: 1.8;
  text-align: justify;
}

.connector-lines {
  width: 100%;
  height: 100%;
  min-height: 0;
  align-self: center;
  overflow: visible;
}

.connector-lines path {
  fill: none;
  stroke: #c9c3bd;
  stroke-width: 1;
  stroke-dasharray: 5 5;
  vector-effect: non-scaling-stroke;
}

.publication-list {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(10px, 1.45vh, 16px);
}

.publication-item {
  min-height: clamp(46px, 5vh, 58px);
  padding: clamp(10px, 1.2vh, 14px) 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid rgba(132, 33, 48, 0.06);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.82);
  box-shadow: 0 1px 2px rgba(43, 37, 32, 0.05);
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.publication-item:hover {
  border-color: rgba(132, 33, 48, 0.24);
  background-color: #fff;
  transform: translateX(2px);
}

.publication-copy {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 18px;
}

.publication-copy span {
  flex: 0 0 auto;
  color: #99908b;
  font-family: "Liberation Mono", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  line-height: 1;
}

.publication-copy h2 {
  overflow: hidden;
  color: #504945;
  font-size: clamp(15px, 1.25vw, 17px);
  font-weight: 500;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.publication-item:hover h2 {
  color: var(--color-primary);
}

.publication-item img {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  opacity: 0.55;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.publication-item:hover img {
  opacity: 1;
  transform: translateX(2px);
}

.expert-strip {
  width: min(1280px, 100%);
  flex: 0 0 auto;
  height: 150px;
  padding: 0 34px clamp(8px, 1.4vh, 14px);
  position: fixed;
  left: 50%;
  bottom: 58px;
  z-index: 2;
  transform: translateX(-50%);
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%);
}

.expert-strip-track {
  position: absolute;
  inset: 0;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}

.expert-strip-track:active {
  cursor: grabbing;
}

.expert-card {
  width: 204px;
  min-width: 204px;
  height: 94px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border: 1px solid rgba(223, 212, 204, 0.9);
  border-radius: 10px;
  background-color: rgba(250, 246, 240, 0.88);
  box-shadow: 0 10px 24px -14px rgba(43, 37, 32, 0.32);
  color: inherit;
  text-decoration: none;
  opacity: 0.46;
  position: absolute;
  left: 50%;
  bottom: 12px;
  z-index: var(--z);
  transform: translateX(calc(-50% + var(--x))) scale(0.78);
  transform-origin: bottom center;
  transition:
    opacity 0.52s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.52s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.52s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.52s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.52s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.52s cubic-bezier(0.22, 1, 0.36, 1);
}

.expert-card.is-dragging {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease,
    width 0.12s ease,
    height 0.12s ease;
}

.expert-card:hover,
.expert-card:focus-visible {
  opacity: 1;
  border-color: rgba(132, 33, 48, 0.28);
  outline: none;
}

.expert-card.is-near {
  width: 226px;
  min-width: 226px;
  height: 102px;
  opacity: 0.76;
  transform: translateX(calc(-50% + var(--x))) scale(0.9);
  box-shadow: 0 12px 28px -16px rgba(43, 37, 32, 0.42);
}

.expert-card.is-mid {
  width: 194px;
  min-width: 194px;
  height: 90px;
  opacity: 0.44;
  transform: translateX(calc(-50% + var(--x))) scale(0.78);
}

.expert-card.is-far {
  width: 164px;
  min-width: 164px;
  height: 78px;
  opacity: 0.18;
  transform: translateX(calc(-50% + var(--x))) scale(0.66);
}

.expert-card.is-current {
  width: 300px;
  min-width: 300px;
  height: 126px;
  grid-template-columns: 86px minmax(0, 1fr);
  margin-bottom: 2px;
  border-color: rgba(132, 33, 48, 0.28);
  background-color: rgba(250, 246, 240, 0.96);
  box-shadow: 0 18px 34px -16px rgba(43, 37, 32, 0.48);
  opacity: 1;
  transform: translateX(calc(-50% + var(--x))) scale(1);
}

.expert-card img {
  width: 58px;
  max-width: 58px;
  height: 72px;
  max-height: 72px;
  display: block;
  border-radius: 5px;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1);
  background-color: #eee4dc;
}

.expert-card.is-current img {
  width: 86px;
  max-width: 86px;
  height: 104px;
  max-height: 104px;
}

.expert-card-copy {
  min-width: 0;
}

.expert-card-copy h2 {
  overflow: hidden;
  color: #2b2520;
  font-family: "Noto Serif SC", "SimSun", serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expert-card-copy p {
  overflow: hidden;
  margin-top: 4px;
  color: var(--color-primary);
  font-size: 11px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expert-card-copy span {
  overflow: hidden;
  display: block;
  margin-top: 7px;
  color: #99908b;
  font-size: 10px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-actions {
  position: fixed;
  right: max(32px, calc((100vw - 1280px) / 2 + 32px));
  bottom: 12px;
  z-index: 3;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.secondary-action,
.primary-action {
  min-width: 118px;
  height: 40px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.secondary-action {
  border: 1px solid #d4ccc6;
  background-color: rgba(255, 255, 255, 0.74);
  color: #615d59;
}

.secondary-action:hover {
  background-color: #fff;
}

.primary-action {
  border: 1px solid var(--color-primary);
  background-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 10px 18px -14px rgba(132, 33, 48, 0.7);
}

.primary-action:hover {
  background-color: var(--color-primary-hover);
}

.secondary-action img,
.primary-action img {
  width: 10px;
  height: 10px;
}

@media (max-width: 1180px) {
  .profile-panel {
    width: calc(100vw - 32px);
    grid-template-columns: minmax(260px, 0.86fr) minmax(360px, 1.14fr);
  }

  .connector-lines {
    display: none;
  }
}

@media (min-width: 821px) and (max-height: 820px) {
  .profile-panel {
    height: calc(100vh - 250px);
    min-height: 430px;
    padding: 24px 34px;
    grid-template-columns: minmax(230px, 0.8fr) clamp(40px, 6vw, 78px) minmax(320px, 1.2fr);
  }

  .portrait-wrap {
    max-height: 260px;
  }

  .bio {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  .connector-lines {
    min-height: 0;
  }

  .expert-strip {
    height: 118px;
    padding-top: 0;
    bottom: 50px;
  }

  .expert-card {
    height: 88px;
  }

  .expert-card.is-current {
    height: 104px;
    margin-bottom: 4px;
  }

  .expert-card img {
    height: 72px;
  }

  .expert-card.is-current img {
    height: 82px;
  }
}

@media (max-width: 820px) {
  .expert-stage {
    padding: 0 16px 158px;
  }

  .profile-panel {
    width: calc(100vw - 32px);
    height: 410px;
    max-height: calc(100vh - 244px);
    padding: 16px;
    grid-template-columns: minmax(140px, 0.78fr) minmax(0, 1fr);
    gap: 16px;
    border-radius: 18px;
    overflow: hidden;
  }

  .portrait-wrap {
    max-height: 220px;
  }

  .name-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .name-row h1 {
    font-size: 24px;
  }

  .name-row p {
    text-align: left;
  }

  .bio {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  .publication-list {
    align-self: center;
  }

  .publication-item {
    min-height: 42px;
    padding: 9px 12px;
  }

  .publication-copy {
    gap: 10px;
  }

  .publication-copy h2 {
    font-size: 14px;
    white-space: nowrap;
  }

  .publication-item img {
    width: 14px;
    height: 14px;
  }

  .expert-strip {
    height: 122px;
    padding: 0 8px 10px;
    bottom: 48px;
  }

  .expert-card {
    width: 190px;
    min-width: 190px;
    height: 92px;
  }

  .expert-card.is-current {
    width: 244px;
    min-width: 244px;
    height: 108px;
    grid-template-columns: 76px minmax(0, 1fr);
  }

  .page-actions {
    right: 16px;
    bottom: 10px;
    flex-direction: row;
  }

  .secondary-action,
  .primary-action {
    height: 34px;
  }
}

@media (max-width: 520px) {
  .expert-stage {
    padding-bottom: 144px;
  }

  .profile-panel {
    width: calc(100vw - 24px);
    height: 380px;
    grid-template-columns: minmax(110px, 0.7fr) minmax(0, 1fr);
    gap: 12px;
    padding: 12px;
  }

  .portrait-wrap {
    max-height: 180px;
  }

  .name-row h1 {
    font-size: 20px;
  }

  .name-row p,
  .bio {
    font-size: 12px;
  }

  .bio {
    -webkit-line-clamp: 3;
  }

  .publication-item {
    align-items: center;
  }

  .publication-copy {
    gap: 12px;
  }

  .expert-card {
    width: 164px;
    min-width: 164px;
    height: 92px;
  }

  .expert-card.is-current {
    width: 210px;
    min-width: 210px;
    height: 96px;
    grid-template-columns: 64px minmax(0, 1fr);
    transform: translateX(calc(-50% + var(--x))) scale(1.02);
  }

  .page-actions {
    gap: 8px;
  }

  .secondary-action,
  .primary-action {
    min-width: 0;
    padding: 0 12px;
    font-size: 12px;
  }
}
</style>
