<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTalentDetail, fetchTalents } from '@/api/index.js'
import backIcon from '@/assets/images/pages/expert-detail/back-icon.svg'
import cardImageOne from '@/assets/images/pages/expert-detail/card-image-1-3d674a.png'
import cardImageTwo from '@/assets/images/pages/expert-detail/card-image-2-4cbd0d.png'
import expertPhoto from '@/assets/images/pages/expert-detail/expert-photo-24de6d.png'

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
const windowWidth = ref(window.innerWidth)
let wheelLock = false
let connectorResizeObserver

const expertPhotos = [expertPhoto, cardImageOne, cardImageTwo]
const experts = ref([])

const publications = ref([])

const normalizeFocusAreas = (item) => {
  if (Array.isArray(item.researchAreas)) return item.researchAreas.filter(Boolean)
  if (typeof item.researchArea === 'string' && item.researchArea.trim()) {
    return item.researchArea
      .split(/[;；]/)
      .map(area => area.trim())
      .filter(Boolean)
  }
  return []
}

const splitTitleLines = (title = '') => title
  .split('/')
  .map(part => part.trim())
  .filter(Boolean)

const formatExpertName = (expert) => [expert?.name, expert?.professionalTitle].filter(Boolean).join(' ')

const isNumericId = (id) => id !== undefined && id !== null && id !== '' && Number.isFinite(Number(id))

const loadExperts = async () => {
  try {
    const data = await fetchTalents()
    const list = data.list || []
    if (list.length) {
      experts.value = list.map((item, index) => ({
        id: item.id,
        name: item.name,
        professionalTitle: item.professionalTitle || '',
        degree: item.degree || '博士',
        title: item.title || '',
        subtitle: item.institution || '',
        position: item.position || '',
        photo: item.avatar || expertPhotos[index % expertPhotos.length],
        focusAreas: normalizeFocusAreas(item),
        bio: ''
      }))
    }
  } catch (e) {
    console.error('获取人才列表失败', e)
  } finally {
    loadExpert(route.params.id || experts.value[0]?.id)
  }
}

const loadExpert = async (id) => {
  if (!isNumericId(id)) {
    publications.value = []
    return
  }

  try {
    const numericId = Number(id)
    const data = await fetchTalentDetail(numericId)
    if (data) {
      const idx = experts.value.findIndex(e => String(e.id) === String(id))
      if (idx >= 0) {
        experts.value[idx].bio = data.bio || ''
        experts.value[idx].position = data.position || experts.value[idx].position || ''
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
  loadExperts()
})

watch(() => route.params.id, (newId) => {
  if (newId) loadExpert(newId)
})

const currentExpert = computed(() => {
  return experts.value.find((expert) => String(expert.id) === String(route.params.id)) ?? experts.value[0] ?? {}
})

const currentExpertIndex = computed(() => {
  const id = currentExpert.value?.id
  if (id === undefined) return 0
  const index = experts.value.findIndex((expert) => expert.id === id)
  return index === -1 ? 0 : index
})

const normalizeOffset = (index) => {
  const half = Math.floor(experts.value.length / 2)
  let offset = index - currentExpertIndex.value
  if (offset > half) offset -= experts.value.length
  if (offset < -half) offset += experts.value.length
  return offset
}

const getOffsetX = (offset) => {
  const step = Math.round(Math.min(380, Math.max(240, windowWidth.value * 0.19)))
  return offset * step
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
  const itemEls = [...listEl.querySelectorAll('.publication-item')]
  if (!svgRect.width || !svgRect.height || !itemEls.length) {
    connectorPaths.value = []
    return
  }
  const startX = 0
  const startY = svgRect.height / 2
  const targetX = svgRect.width
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

const handleResize = () => {
  windowWidth.value = window.innerWidth
  updateConnectorPaths()
}

onMounted(() => {
  syncLayout()
  window.addEventListener('resize', handleResize)
  connectorResizeObserver = new ResizeObserver(updateConnectorPaths)
  ;[profilePanel.value, connectorSvg.value, publicationList.value].forEach((element) => {
    if (element) connectorResizeObserver.observe(element)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  connectorResizeObserver?.disconnect()
})

watch(() => route.params.id, syncLayout)
watch(() => publications.value.length, () => nextTick(updateConnectorPaths))
</script>

<template>
  <main class="expert-detail-page">
    <section v-if="currentExpert.id" class="expert-stage" aria-label="专家详情">
      <article ref="profilePanel" class="profile-panel">
        <div class="profile-content">
          <section class="profile-column">
          <div class="portrait-wrap">
            <img
              :key="currentExpert.id"
              :src="currentExpert.photo"
              :alt="formatExpertName(currentExpert)"
              class="portrait"
            >
          </div>

          <div class="expert-copy">
            <div class="name-row">
              <h1>{{ formatExpertName(currentExpert) }}</h1>
              <p v-if="currentExpert.position">{{ currentExpert.position }}</p>
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
          <article
            v-for="(publication, index) in publications"
            :key="`${currentExpert.id}-${index}`"
            class="publication-item"
          >
            <div class="publication-copy">
              <span>{{ publication.number }}</span>
              <h2>{{ publication.title }}</h2>
            </div>
          </article>
        </section>
        </div>
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
            <img :src="item.expert.photo" :alt="formatExpertName(item.expert)">
            <div class="expert-card-copy">
              <h2>{{ formatExpertName(item.expert) }}</h2>
              <p v-if="item.expert.position">{{ item.expert.position }}</p>
              <span>{{ item.expert.focusAreas?.slice(0, 2).join(' / ') }} / {{ item.expert.subtitle }}</span>
            </div>
          </router-link>
        </div>
      </section>
    </section>

    <footer class="page-actions return-actions">
      <router-link class="return-action return-action--back" to="/academic">
        <img :src="backIcon" alt="" aria-hidden="true">
        返回上一页
      </router-link>
      <router-link class="return-action return-action--home" to="/home">
        返回首页
      </router-link>
    </footer>
  </main>
</template>

<style scoped>
.expert-detail-page {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(rgba(248, 245, 240, 0.88), rgba(248, 245, 240, 0.9)),
    url('@/assets/images/backgrounds/mult-page/page-bg.png') center / cover fixed;
  color: #2b2520;
  font-family: var(--font-sans);
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
  padding: 24px clamp(16px, 2.4vw, 32px) 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.profile-panel {
  width: clamp(800px, 88vw, 1600px);
  max-width: 100%;
  min-height: clamp(430px, 58vh, 700px);
  margin: 0 auto;
  padding: clamp(24px, 3.5vh, 44px) clamp(34px, 4vw, 64px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: clamp(16px, 2vw, 24px);
  background-color: rgb(245, 238, 234);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 42px -18px rgba(36, 28, 22, 0.28);
}

.profile-content {
  height: 100%;
  min-height: inherit;
  display: flex;
  align-items: stretch;
  gap: clamp(20px, 2.2vw, 34px);
}

.profile-column {
  flex: 0.82 1 300px;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.portrait-wrap {
  width: 100%;
  max-width: clamp(190px, 16vw, 280px);
  height: auto;
  max-height: clamp(260px, 36vh, 440px);
  aspect-ratio: 7 / 9;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 3px;
  background-color: #eee4dc;
  box-shadow: 0 12px 26px rgba(43, 37, 32, 0.16);
  position: relative;
}

.portrait {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;
  position: relative;
  z-index: 1;
  animation: portrait-fade-in 0.35s ease;
}

@keyframes portrait-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.expert-copy {
  width: 100%;
  max-width: clamp(190px, 16vw, 280px);
  margin: clamp(10px, 1.4vh, 16px) auto 0;
}

.name-row {
  display: flex;
  flex-direction: column;
  color: #842130;
  gap: 4px;
}

.name-row h1 {
  min-width: 0;
  color: #842130;
  font-family: var(--font-serif);
  font-size: clamp(24px, 2.1vw, 34px);
  font-weight: var(--font-weight-bold);
  line-height: 1.08;
  white-space: nowrap;
}

.name-row p {
  margin: 0;
  color: #842130;
  font-size: clamp(13px, 0.95vw, 16px);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  text-align: left;
}

.name-row p span {
  display: block;
}

.expert-detail-page[data-current-expert-id="ren-yu-lan"] .name-row h1,
.expert-detail-page[data-current-expert-id="ren-yu-lan"] .name-row p {
  color: #842130;
}

.bio {
  margin-top: clamp(12px, 1.7vh, 18px);
  color: #8a817a;
  font-size: var(--font-size-expert-copy);
  line-height: var(--line-height-reading);
  text-align: justify;
}

.connector-lines {
  flex: 0 0 clamp(64px, 7vw, 112px);
  width: clamp(64px, 7vw, 112px);
  height: auto;
  min-height: 0;
  align-self: stretch;
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
  flex: 1.28 1 602px;
  min-width: 0;
  height: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(12px, 1.8vh, 18px);
}

.publication-item {
  width: min(100%, clamp(440px, 46vw, 720px));
  height: clamp(52px, 6.5vh, 72px);
  min-height: clamp(52px, 6.5vh, 72px);
  padding: clamp(10px, 1.2vh, 18px) clamp(12px, 1.2vw, 20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(10px, 1.2vw, 20px);
  border: 1px solid rgba(132, 33, 48, 0.06);
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.82);
  box-shadow: 0 1px 2px rgba(43, 37, 32, 0.05);
  color: inherit;
  text-decoration: none;
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
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wider);
  line-height: var(--line-height-none);
}

.publication-copy h2 {
  overflow: hidden;
  color: var(--color-primary);
  font-size: var(--font-size-expert-item);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expert-strip {
  width: clamp(760px, 84vw, 1560px);
  max-width: 100%;
  flex: 0 0 auto;
  height: clamp(120px, 14vh, 160px);
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
  width: clamp(170px, 14vw, 260px);
  min-width: clamp(170px, 14vw, 260px);
  height: clamp(68px, 7vh, 90px);
  padding: clamp(6px, 0.7vh, 12px) clamp(8px, 0.9vw, 16px);
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.7vw, 12px);
  border: 1px solid rgba(220, 211, 202, 0.85);
  border-radius: 3px;
  background-color: #F3ECE7;
  box-shadow: 0 5px 12px rgba(54, 42, 32, 0.12);
  color: inherit;
  text-decoration: none;
  opacity: 0.42;
  position: absolute;
  left: 50%;
  bottom: 8px;
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
  width: clamp(190px, 15.5vw, 288px);
  min-width: clamp(190px, 15.5vw, 288px);
  height: clamp(74px, 7.6vh, 100px);
  opacity: 0.72;
  transform: translateX(calc(-50% + var(--x))) scale(0.94);
  box-shadow: 0 7px 16px rgba(54, 42, 32, 0.14);
}

.expert-card.is-mid {
  width: clamp(164px, 13.4vw, 248px);
  min-width: clamp(164px, 13.4vw, 248px);
  height: clamp(62px, 6.4vh, 84px);
  opacity: 0.38;
  transform: translateX(calc(-50% + var(--x))) scale(0.84);
}

.expert-card.is-far {
  width: clamp(140px, 11.5vw, 214px);
  min-width: clamp(140px, 11.5vw, 214px);
  height: clamp(56px, 5.8vh, 78px);
  opacity: 0.16;
  transform: translateX(calc(-50% + var(--x))) scale(0.76);
}

.expert-card.is-current {
  width: clamp(230px, 18.8vw, 346px);
  min-width: clamp(230px, 18.8vw, 346px);
  height: clamp(90px, 9.2vh, 120px);
  margin-bottom: 0;
  border-color: rgba(132, 33, 48, 0.24);
  background-color: rgba(250, 247, 241, 0.98);
  box-shadow: 0 10px 22px rgba(54, 42, 32, 0.18);
  opacity: 1;
  transform: translateX(calc(-50% + var(--x))) scale(1);
}

.expert-card img {
  width: clamp(42px, 3.8vw, 56px);
  max-width: clamp(42px, 3.8vw, 56px);
  height: clamp(48px, 5.2vh, 66px);
  max-height: clamp(48px, 5.2vh, 66px);
  display: block;
  border-radius: 2px;
  object-fit: cover;
  object-position: center top;
  overflow: hidden;
}

.expert-card.is-current img {
  width: clamp(60px, 5.5vw, 82px);
  max-width: clamp(60px, 5.5vw, 82px);
  height: clamp(68px, 7.4vh, 94px);
  max-height: clamp(68px, 7.4vh, 94px);
}

.expert-card-copy {
  flex: 1 1 auto;
  min-width: 0;
}

.expert-card:not(.is-current) .expert-card-copy {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.expert-card-copy h2 {
  overflow: hidden;
  color: #842130;
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expert-card-copy p {
  overflow: hidden;
  margin-top: 4px;
  color: #842130;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: pre-line;
}

.expert-card-copy span {
  overflow: hidden;
  display: block;
  margin-top: 7px;
  color: #842130;
  font-size: var(--font-size-2xs);
  line-height: var(--line-height-control);
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.7;
}

.expert-card:not(.is-current) .expert-card-copy p {
  margin-top: 2px;
  -webkit-line-clamp: 1;
}

.expert-card:not(.is-current) .expert-card-copy span {
  margin-top: 3px;
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







@media (max-width: 1360px) {
  .profile-panel {
    width: calc(100vw - 32px);
  }

  .connector-lines {
    display: none;
  }
}

@media (min-width: 821px) and (max-height: 820px) {
  .profile-panel {
    min-height: 430px;
    padding: 24px 34px;
  }

  .profile-content {
    min-height: inherit;
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
    height: auto;
    min-height: 0;
  }

  .expert-strip {
    height: clamp(104px, 16vh, 118px);
    padding-top: 0;
    bottom: 50px;
  }

  .expert-card {
    height: clamp(60px, 8vh, 74px);
  }

  .expert-card.is-current {
    height: clamp(80px, 10vh, 90px);
    margin-bottom: 0;
  }

  .expert-card img {
    height: clamp(42px, 6vh, 58px);
  }

  .expert-card.is-current img {
    height: clamp(60px, 8vh, 74px);
  }
}

@media (max-width: 820px) {
  .expert-stage {
    padding: 18px 16px 80px;
  }

  .profile-panel {
    width: calc(100vw - 32px);
    min-height: 410px;
    padding: 16px;
    border-radius: 18px;
  }

  .profile-content {
    gap: 16px;
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
    font-size: var(--font-size-7xl);
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
    min-height: 0;
  }

  .publication-item {
    padding: 9px 12px;
    gap: 10px;
  }

  .publication-copy {
    gap: 10px;
  }

  .publication-copy h2 {
    font-size: var(--font-size-xl);
    white-space: nowrap;
  }

  .expert-strip {
    padding: 0 8px 10px;
    bottom: 48px;
  }

  .page-actions {
    right: 16px;
    bottom: 10px;
    flex-direction: row;
  }

  .return-action {
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
    padding: 12px;
  }

  .profile-content {
    gap: 12px;
  }

  .portrait-wrap {
    max-height: 180px;
  }

  .name-row h1 {
    font-size: var(--font-size-5xl);
  }

  .name-row p,
  .bio {
    font-size: var(--font-size-md);
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
    width: clamp(140px, 22vw, 170px);
    min-width: clamp(140px, 22vw, 170px);
    height: clamp(60px, 9vh, 76px);
  }

  .expert-card.is-current {
    width: clamp(180px, 28vw, 230px);
    min-width: clamp(180px, 28vw, 230px);
    height: clamp(74px, 11vh, 92px);
    transform: translateX(calc(-50% + var(--x))) scale(1.02);
  }

  .page-actions {
    gap: 8px;
  }

  .return-action {
    min-width: 0;
    padding: 0 12px;
    font-size: var(--font-size-md);
  }
}
</style>
