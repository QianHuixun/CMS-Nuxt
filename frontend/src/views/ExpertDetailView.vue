<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTalentDetail } from '@/api/index.js'
import arrowIcon from '@/assets/images/pages/expert-detail/arrow-icon.svg'
import backIcon from '@/assets/images/pages/expert-detail/back-icon.svg'
import cardImageOne from '@/assets/images/pages/expert-detail/card-image-1-3d674a.png'
import cardImageTwo from '@/assets/images/pages/expert-detail/card-image-2-4cbd0d.png'
import expertPhoto from '@/assets/images/pages/expert-detail/expert-photo-24de6d.png'
import homeIcon from '@/assets/images/pages/expert-detail/home-icon.svg'

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
const wasRealDrag = ref(false)
let wheelLock = false
let connectorResizeObserver

const experts = ref([
  { id: 'chen-wei', name: '陈伟', degree: '博士', title: '首席研究员', subtitle: '博士生导师', photo: expertPhoto, focus: '出土医简保护', bio: '' },
  { id: 'lin-yue', name: '林悦', degree: '博士', title: '图像计算专家', subtitle: '副研究员', photo: cardImageOne, focus: '多光谱影像', bio: '' },
  { id: 'zhou-ming', name: '周明', degree: '博士', title: '医学史研究员', subtitle: '教授', photo: cardImageTwo, focus: '汉代医学史', bio: '' },
  { id: 'xu-qing', name: '徐青', degree: '博士', title: '知识工程专家', subtitle: '研究员', photo: expertPhoto, focus: '知识图谱', bio: '' },
  { id: 'he-ran', name: '何然', degree: '博士', title: '文物保护专家', subtitle: '研究馆员', photo: cardImageOne, focus: '文物保护', bio: '' },
  { id: 'wan-li', name: '万理', degree: '博士', title: '数据治理专家', subtitle: '副教授', photo: cardImageTwo, focus: '数据标准', bio: '' },
  { id: 'zhao-ning', name: '赵宁', degree: '博士', title: '语义检索专家', subtitle: '研究员', photo: expertPhoto, focus: '智能检索', bio: '' },
])

const publications = ref([])

const loadExpert = async (id) => {
  try {
    const numericId = Number(id)
    const data = await fetchTalentDetail(numericId)
    if (data) {
      const idx = experts.value.findIndex(e => e.id === route.params.id)
      if (idx >= 0) {
        experts.value[idx].bio = data.bio || ''
      }
      publications.value = (data.achievements || []).map((a, i) => ({
        number: String(i + 1).padStart(2, '0'),
        title: a.title,
        type: a.type,
        id: a.id,
      }))
    }
  } catch (e) {
    console.error('获取人才详情失败', e)
  }
}

onMounted(() => {
  if (route.params.id) {
    loadExpert(route.params.id)
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) loadExpert(newId)
})

const currentExpert = computed(() => {
  return experts.value.find((expert) => expert.id === route.params.id) ?? experts.value[0]
})

const currentExpertIndex = computed(() => {
  const index = experts.value.findIndex((expert) => expert.id === currentExpert.value.id)
  return index === -1 ? 0 : index
})

const getPublicationRoute = (publication) => {
  if (publication.type === 'book') return `/monograph/${publication.id}`
  if (publication.type === 'paper') return `/paper/${publication.id}`
  return '#'
}

const normalizeOffset = (index) => {
  const half = Math.floor(experts.value.length / 2)
  let offset = index - currentExpertIndex.value
  if (offset > half) offset -= experts.value.length
  if (offset < -half) offset += experts.value.length
  return offset
}

const getOffsetX = (offset) => {
  const positions = { '-3': -760, '-2': -520, '-1': -315, 0: 0, 1: 315, 2: 520, 3: 760 }
  return positions[offset] ?? offset * 260
}

const stripExperts = computed(() => {
  return experts.value.map((expert, index) => {
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

const isCurrentStripCard = (item) => item.offset === 0

const goToExpertByIndex = (index) => {
  const nextIndex = (index + experts.value.length) % experts.value.length
  router.push(`/expert/${experts.value[nextIndex].id}`)
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
  window.setTimeout(() => { wheelLock = false }, 560)
}

const handleStripPointerDown = (event) => {
  isDraggingStrip.value = true
  dragStartX.value = event.clientX
  dragOffsetX.value = 0
  wasRealDrag.value = false
}

const handleStripPointerMove = (event) => {
  if (!isDraggingStrip.value) return
  const newOffset = event.clientX - dragStartX.value
  if (Math.abs(newOffset) > 10) {
    dragOffsetX.value = Math.max(-140, Math.min(140, newOffset))
    wasRealDrag.value = true
  }
}

const finishStripDrag = () => {
  if (!isDraggingStrip.value) return
  const distance = dragOffsetX.value
  isDraggingStrip.value = false
  dragOffsetX.value = 0
  if (wasRealDrag.value && Math.abs(distance) > 70) {
    suppressStripClick.value = true
    goToAdjacentExpert(distance < 0 ? 1 : -1)
    window.setTimeout(() => { suppressStripClick.value = false }, 0)
  }
}

const handleStripCardClick = (item, event) => {
  if (wasRealDrag.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  if (item.expert.id === currentExpert.value.id) {
    event.preventDefault()
    return
  }
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
watch(() => publications.value.length, () => nextTick(updateConnectorPaths))
</script>

<template>
  <main class="expert-detail-page">
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

            <p class="bio">{{ currentExpert.bio || '暂无简介' }}</p>
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
            v-for="(publication, index) in publications"
            :key="`${currentExpert.id}-${index}`"
            class="publication-item"
            :to="getPublicationRoute(publication)"
          >
            <div class="publication-copy">
              <span>{{ publication.number }}</span>
              <h2>{{ publication.title }}</h2>
            </div>
            <img :src="arrowIcon" alt="" aria-hidden="true">
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
            @click="handleStripCardClick(item, $event)"
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
      <router-link class="secondary-action" to="/academic">
        <img :src="backIcon" alt="" aria-hidden="true">
        返回上一页
      </router-link>
      <router-link class="primary-action" to="/home">
        <img :src="homeIcon" alt="" aria-hidden="true">
        返回首页
      </router-link>
    </footer>
  </main>
</template>

<style scoped>
.expert-detail-page {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    linear-gradient(rgba(248, 245, 240, 0.88), rgba(248, 245, 240, 0.9)),
    url('@/assets/images/backgrounds/home/home-bg2.png') center / cover fixed;
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
  width: min(1440px, 100%);
  margin-right: auto;
  margin-left: auto;
}

.expert-stage {
  flex: 1;
  min-height: 0;
  padding: 24px clamp(16px, 2.4vw, 32px) 184px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.profile-panel {
  width: 1320px;
  max-width: 100%;
  height: 570px;
  max-height: calc(100vh - 300px);
  margin: 0 auto;
  padding: 36px 56px;
  display: grid;
  grid-template-columns: minmax(300px, 0.82fr) clamp(64px, 7vw, 112px) minmax(602px, 1.28fr);
  gap: clamp(20px, 2.2vw, 34px);
  align-items: stretch;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: clamp(16px, 2vw, 24px);
  background-color: rgb(245, 238, 234);
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
  height: min(420px, 100%);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0;
}

.publication-item {
  width: min(100%, 602px);
  height: 63px;
  min-height: 63px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid rgba(132, 33, 48, 0.06);
  border-radius: 0;
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
  height: 128px;
  padding: 0 28px 10px;
  position: fixed;
  left: 50%;
  bottom: 54px;
  z-index: 2;
  transform: translateX(-50%);
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
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
  width: 214px;
  min-width: 214px;
  height: 78px;
  padding: 9px 12px;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  border: 1px solid rgba(220, 211, 202, 0.85);
  border-radius: 3px;
  background-color: rgba(250, 247, 241, 0.78);
  box-shadow: 0 5px 12px rgba(54, 42, 32, 0.12);
  color: inherit;
  text-decoration: none;
  opacity: 0.42;
  position: absolute;
  left: 50%;
  bottom: 18px;
  z-index: var(--z);
  transform: translateX(calc(-50% + var(--x))) scale(0.86);
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
  border-color: rgba(132, 33, 48, 0.22);
  background-color: rgba(250, 247, 241, 0.96);
  outline: none;
  z-index: 12;
}

.expert-card:not(.is-current) {
  cursor: pointer;
}

.expert-card.is-near {
  width: 238px;
  min-width: 238px;
  height: 88px;
  opacity: 0.72;
  transform: translateX(calc(-50% + var(--x))) scale(0.94);
  box-shadow: 0 7px 16px rgba(54, 42, 32, 0.14);
}

.expert-card.is-mid {
  width: 204px;
  min-width: 204px;
  height: 74px;
  opacity: 0.38;
  transform: translateX(calc(-50% + var(--x))) scale(0.84);
}

.expert-card.is-far {
  width: 176px;
  min-width: 176px;
  height: 68px;
  opacity: 0.16;
  transform: translateX(calc(-50% + var(--x))) scale(0.76);
}

.expert-card.is-current {
  width: 286px;
  min-width: 286px;
  height: 104px;
  grid-template-columns: 74px minmax(0, 1fr);
  margin-bottom: 0;
  border-color: rgba(132, 33, 48, 0.24);
  background-color: rgba(250, 247, 241, 0.98);
  box-shadow: 0 10px 22px rgba(54, 42, 32, 0.18);
  opacity: 1;
  transform: translateX(calc(-50% + var(--x))) scale(1);
}

.expert-card img {
  width: 52px;
  max-width: 52px;
  height: 60px;
  max-height: 60px;
  display: block;
  border-radius: 2px;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1);
  background-color: #eee4dc;
}

.expert-card.is-current img {
  width: 74px;
  max-width: 74px;
  height: 86px;
  max-height: 86px;
}

.expert-card-copy {
  min-width: 0;
}

.expert-card-copy h2 {
  overflow: hidden;
  color: #2b2520;
  font-family: "Noto Serif SC", "SimSun", serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expert-card-copy p {
  overflow: hidden;
  margin-top: 4px;
  color: var(--color-primary);
  font-size: 10px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expert-card-copy span {
  overflow: hidden;
  display: block;
  margin-top: 7px;
  color: #99908b;
  font-size: 9px;
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

@media (max-width: 1360px) {
  .profile-panel {
    width: calc(100vw - 32px);
    grid-template-columns: minmax(280px, 0.88fr) minmax(460px, 1.12fr);
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
    grid-template-columns: minmax(230px, 0.78fr) clamp(40px, 6vw, 78px) minmax(440px, 1.22fr);
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

  .publication-list {
    height: min(360px, 100%);
    min-height: 280px;
  }

  .expert-strip {
    height: 108px;
    padding-top: 0;
    bottom: 50px;
  }

  .expert-card {
    height: 76px;
  }

  .expert-card.is-current {
    height: 92px;
    margin-bottom: 0;
  }

  .expert-card img {
    height: 60px;
  }

  .expert-card.is-current img {
    height: 76px;
  }
}

@media (max-width: 820px) {
  .expert-stage {
    padding: 18px 16px 158px;
  }

  .profile-panel {
    width: calc(100vw - 32px);
    height: 410px;
    max-height: calc(100vh - 262px);
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
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  .publication-item {
    padding: 9px 12px;
    height: 52px;
    min-height: 52px;
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
    height: 108px;
    padding: 0 8px 10px;
    bottom: 48px;
  }

  .expert-card {
    width: 176px;
    min-width: 176px;
    height: 76px;
  }

  .expert-card.is-current {
    width: 228px;
    min-width: 228px;
    height: 94px;
    grid-template-columns: 66px minmax(0, 1fr);
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
    width: 154px;
    min-width: 154px;
    height: 74px;
  }

  .expert-card.is-current {
    width: 202px;
    min-width: 202px;
    height: 88px;
    grid-template-columns: 58px minmax(0, 1fr);
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
