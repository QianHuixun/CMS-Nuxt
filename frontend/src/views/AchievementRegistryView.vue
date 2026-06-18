<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import {
  fetchBookStats,
  fetchBooks,
  fetchPapers,
  fetchPaperStats,
  fetchProjectStats,
  fetchProjects,
  fetchSoftwarePatentStats,
  fetchSoftwarePatents
} from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'
import registryIcon from '@/assets/images/pages/academic-news/registry-icon.svg'
import papersIconRaw from '@/assets/images/pages/academic-news/registry-papers-icon.svg?raw'
import booksIconRaw from '@/assets/images/pages/academic-news/registry-books-icon.svg?raw'
import patentsIconRaw from '@/assets/images/pages/academic-news/registry-patents-icon.svg?raw'
import topicsIconRaw from '@/assets/images/pages/academic-news/registry-topics-icon.svg?raw'

const papersIcon = `data:image/svg+xml,${encodeURIComponent(papersIconRaw)}`
const booksIcon = `data:image/svg+xml,${encodeURIComponent(booksIconRaw)}`
const patentsIcon = `data:image/svg+xml,${encodeURIComponent(patentsIconRaw)}`
const topicsIcon = `data:image/svg+xml,${encodeURIComponent(topicsIconRaw)}`

const route = useRoute()
const router = useRouter()

const sections = [
  { key: 'papers', title: '发表论文', iconUrl: papersIcon },
  { key: 'patents', title: '软著专利', iconUrl: patentsIcon },
  { key: 'books', title: '学术著作', iconUrl: booksIcon },
  { key: 'topics', title: '获批课题', iconUrl: topicsIcon },
]

const sectionKeys = sections.map((section) => section.key)
const getRouteSectionKey = () => {
  return typeof route.query.tab === 'string' && sectionKeys.includes(route.query.tab)
    ? route.query.tab
    : 'papers'
}
const initialKey = getRouteSectionKey()
const currentKey = ref(initialKey)
const resultListRef = ref(null)
const scrollStorageKey = 'cms-nuxt:achievement-registry-scroll'

const normalizeScrollPositions = (value = {}) => {
  return sectionKeys.reduce((positions, key) => {
    const nextValue = Number(value?.[key])
    positions[key] = Number.isFinite(nextValue) ? nextValue : 0
    return positions
  }, {})
}

const readScrollPositions = () => {
  if (typeof window === 'undefined') return normalizeScrollPositions()

  try {
    const rawValue = window.sessionStorage.getItem(scrollStorageKey)
    return normalizeScrollPositions(rawValue ? JSON.parse(rawValue) : {})
  } catch (e) {
    console.warn('读取成果库滚动位置失败', e)
    return normalizeScrollPositions()
  }
}

const scrollPositions = ref(readScrollPositions())

const persistScrollPositions = () => {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(scrollStorageKey, JSON.stringify(scrollPositions.value))
  } catch (e) {
    console.warn('保存成果库滚动位置失败', e)
  }
}

const saveScrollPosition = (key = currentKey.value) => {
  scrollPositions.value = {
    ...scrollPositions.value,
    [key]: resultListRef.value?.scrollTop || 0,
  }
  persistScrollPositions()
}

const restoreScrollPosition = async (key = currentKey.value) => {
  await nextTick()
  if (currentKey.value !== key || !resultListRef.value) return

  resultListRef.value.scrollTop = scrollPositions.value[key] || 0
}

const syncRouteTab = async (key) => {
  if (route.query.tab === key) return

  await router.replace({
    name: 'Achievements',
    query: {
      ...route.query,
      tab: key,
    },
  })
}

const currentSection = computed(() => {
  return sections.find((section) => section.key === currentKey.value) ?? sections[0]
})

const typeLabel = computed(() => {
  const labels = { papers: '发表论文', patents: '软件著作权', books: '学术著作', topics: '获批课题' }
  return labels[currentKey.value]
})

const detailRoute = (type, id) => {
  if (!id) return ''
  const routes = { papers: '/paper', patents: '/patent', books: '/monograph' }
  return routes[type] ? `${routes[type]}/${id}` : ''
}

const patentTypeLabels = {
  software: '软著',
  patent: '发明专利'
}

const results = ref([])
const fallbackChartBars = [
  { year: '2021', value: 42 },
  { year: '2022', value: 56 },
  { year: '2023', value: 70 },
  { year: '2024', value: 86 },
  { year: '2025', value: 100, active: true },
]
const stats = ref({ total: 0, byType: {}, byYear: [] })

const chartBars = computed(() => {
  const rows = stats.value.byYear || []
  if (!rows.length) return fallbackChartBars
  const max = Math.max(...rows.map(item => item.count || 0), 1)
  return rows.map(item => ({
    year: String(item.year),
    value: Math.max(8, Math.round(((item.count || 0) / max) * 100)),
    active: item.count === max
  }))
})

const statsPairs = computed(() => {
  const entries = Object.entries(stats.value.byType || {})
  if (entries.length) return entries.slice(0, 2).map(([label, value]) => ({ label, value }))
  return [
    { label: typeLabel.value, value: results.value.length },
    { label: '总数', value: stats.value.total || results.value.length }
  ]
})

const loadStats = async (key = currentKey.value) => {
  try {
    let nextStats = { total: results.value.length, byType: {}, byYear: [] }
    if (key === 'papers') nextStats = await fetchPaperStats()
    else if (key === 'patents') nextStats = await fetchSoftwarePatentStats()
    else if (key === 'books') nextStats = await fetchBookStats()
    else if (key === 'topics') nextStats = await fetchProjectStats()
    if (currentKey.value === key) stats.value = nextStats
  } catch (e) {
    console.error('加载成果统计失败', e)
    if (currentKey.value === key) stats.value = { total: results.value.length, byType: {}, byYear: [] }
  }
}

const loadData = async (key = currentKey.value) => {
  results.value = []
  try {
    let nextResults = []
    if (key === 'papers') {
      const res = await fetchPapers({ pageNum: 1, pageSize: 200 })
      nextResults = (res.rows || []).map(p => ({
        id: p.id,
        route: detailRoute(key, p.id),
        category: p.type || '论文',
        title: p.title,
        number: p.doi || '',
        owner: p.firstAuthor || '',
        date: p.year ? String(p.year) : '',
      }))
    } else if (key === 'patents') {
      const res = await fetchSoftwarePatents({ pageNum: 1, pageSize: 11 })
      nextResults = (res.rows || []).map(p => ({
        id: p.id,
        route: detailRoute(key, p.id),
        category: patentTypeLabels[p.type] || p.typeName || '软著',
        title: p.title,
        number: p.registrationNo || '',
        owner: p.owner || '',
        date: p.year ? String(p.year) : '',
      }))
    } else if (key === 'books') {
      const res = await fetchBooks({ pageNum: 1, pageSize: 4 })
      nextResults = (res.rows || []).map(b => ({
        id: b.id,
        route: detailRoute(key, b.id),
        category: '专著',
        title: b.title,
        number: b.isbn || '',
        owner: b.author || '',
        date: b.year ? String(b.year) : '',
      }))
    } else if (key === 'topics') {
      const res = await fetchProjects({ pageNum: 1, pageSize: 105 })
      nextResults = (res.rows || []).map(p => ({
        id: p.id,
        route: detailRoute(key, p.id),
        category: p.type || '课题',
        title: p.title,
        number: '',
        owner: p.leader || '',
        date: p.startYear ? String(p.startYear) : '',
      }))
    }
    if (currentKey.value === key) {
      results.value = nextResults
      await restoreScrollPosition(key)
    }
  } catch (e) {
    console.error('加载成果列表失败', e)
  }
  await loadStats(key)
}

const switchSection = async (key) => {
  if (key === currentKey.value) return

  saveScrollPosition(currentKey.value)
  currentKey.value = key
  await syncRouteTab(key)
  await loadData(key)
}

watch(
  () => route.query.tab,
  async () => {
    const nextKey = getRouteSectionKey()
    if (nextKey === currentKey.value) return

    saveScrollPosition(currentKey.value)
    currentKey.value = nextKey
    await loadData(nextKey)
  }
)

onBeforeRouteLeave(() => {
  saveScrollPosition(currentKey.value)
})

onMounted(async () => {
  await syncRouteTab(currentKey.value)
  await loadData()
})

const goBack = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <main class="registry-page">
    <div class="registry-shell">
      <aside class="side-panel" aria-label="成果库分类">
        <div class="side-title">
          <img class="registry-icon" :src="registryIcon" alt="">
          <strong>成果库</strong>
        </div>

        <button
          v-for="section in sections"
          :key="section.key"
          type="button"
          :class="['side-link', { active: currentKey === section.key }]"
          @click="switchSection(section.key)"
        >
          <span
            class="side-icon"
            :style="{ maskImage: `url(${section.iconUrl})`, WebkitMaskImage: `url(${section.iconUrl})` }"
          ></span>
          {{ section.title }}
        </button>
      </aside>

      <section class="content-panel" aria-labelledby="registry-title">
        <div class="content-heading">
          <div>
            <h1 id="registry-title">{{ currentSection.title }}</h1>
            <p>实验室数字化成果与技术专利归档</p>
          </div>

          <label class="search-box">
            <span aria-hidden="true"></span>
            <input type="search" placeholder="搜索作者或论文标题..." />
          </label>
        </div>

        <div class="filters">
          <button type="button">年份: 全部 <i aria-hidden="true"></i></button>
          <button type="button">类型: 全部 <i aria-hidden="true"></i></button>
        </div>

        <div ref="resultListRef" class="result-list">
          <component
            :is="item.route ? 'router-link' : 'article'"
            v-for="item in results"
            :key="`${item.number}-${item.title}`"
            class="result-item"
            :to="item.route || undefined"
          >
            <div class="result-copy">
              <span>{{ item.category }}</span>
              <h2>{{ item.title }}</h2>
              <p>
                <span class="meta-number">登记号: {{ item.number }}</span>
                <span class="meta-owner">负责人: {{ item.owner }}</span>
              </p>
            </div>
            <time>{{ item.date }}<small>PUBLICATION DATE</small></time>
          </component>
        </div>
      </section>

      <aside class="stats-panel" aria-label="统计概览">
        <h2>统计概览</h2>
        <section class="stats-card">
          <p>TOTAL SUBMISSIONS / 成果总数</p>
          <div class="total-count">
            <strong>{{ stats.total || results.length }}</strong>
            <span>项</span>
          </div>

          <dl class="stats-pair">
            <div v-for="pair in statsPairs" :key="pair.label">
              <dt>{{ pair.label }}</dt>
              <dd>{{ pair.value }}</dd>
            </div>
          </dl>

          <div class="chart-title">五年增长趋势</div>
          <div class="bar-chart" aria-hidden="true">
            <div
              v-for="bar in chartBars"
              :key="bar.year"
              class="bar-wrap"
            >
              <i :class="{ active: bar.active }" :style="{ height: `${bar.value}%` }"></i>
              <em>{{ bar.year }}</em>
            </div>
          </div>
        </section>

        <section class="note-card">
          *本库所有软件著作权及发明专利权属归中国出土医学文献与文物研究中心及其依托实验室所有，未经许可严禁用于商业用途。
        </section>
      </aside>
    </div>

    <footer class="registry-actions return-actions">
      <button type="button" class="return-action return-action--back" @click="goBack">
        <span aria-hidden="true">←</span>
        返回上一页
      </button>
      <router-link class="return-action return-action--home" to="/home">
        返回首页
      </router-link>
    </footer>
  </main>
</template>

<style scoped>
.registry-page {
  height: calc(100vh - 53px);
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    linear-gradient(rgba(250, 247, 242, 0.88), rgba(250, 247, 242, 0.9)),
    url('@/assets/images/backgrounds/mult-page/page-bg.png') center top / cover fixed;
  color: #2f2522;
  font-family: var(--font-serif);
}

.registry-shell {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  min-height: 0;
  padding: 22px 37px 0;
  display: grid;
  grid-template-columns: 220px minmax(420px, 1fr) 360px;
  gap: 28px;
  flex: 1;
  overflow: hidden;
}

.side-panel {
  padding-top: 0;
}

.side-title {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #842130;
}

.side-title strong {
  font-size: var(--font-size-8xl);
  font-weight: var(--font-weight-bold);
}

.registry-icon {
  width: 22px;
  height: 22px;
  display: inline-block;
}

.side-link {
  width: 220px;
  height: 44px;
  margin-bottom: 9px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  color: #6f6a66;
  font: inherit;
  font-size: var(--font-size-xl);
  text-align: left;
  cursor: pointer;
}

.side-link.active {
  background-color: #fff;
  color: #842130;
}

.side-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.content-panel {
  width: 100%;
  min-width: 0;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.content-heading {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(280px, 360px);
  gap: 24px;
  align-items: start;
  flex-shrink: 0;
}

.content-heading h1 {
  color: #842130;
  font-size: var(--font-size-10xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
}

.content-heading p {
  margin-top: 10px;
  color: #6d625d;
  font-size: var(--font-size-xl);
}

.search-box {
  height: 50px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(132, 33, 48, 0.1);
  border-radius: 8px;
  background-color: rgba(255, 253, 250, 0.76);
  box-shadow: 0 1px 4px rgba(58, 44, 35, 0.14);
}

.search-box span {
  width: 20px;
  height: 20px;
  border: 3px solid #b76373;
  border-radius: 50%;
  position: relative;
}

.search-box span::after {
  content: "";
  position: absolute;
  right: -7px;
  bottom: -5px;
  width: 9px;
  height: 3px;
  background-color: #b76373;
  transform: rotate(45deg);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #7b6a66;
  font: inherit;
  font-size: var(--font-size-xl);
}

.search-box input::placeholder {
  color: #c59aa0;
}

.filters {
  margin: 14px 10px 9px 0;
  display: flex;
  justify-content: flex-end;
  gap: 48px;
  flex-shrink: 0;
}

.filters button {
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: #5f5753;
  font: inherit;
  font-size: var(--font-size-xl);
}

.filters i {
  width: 8px;
  height: 8px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  transform: rotate(45deg) translateY(-2px);
}

.result-list {
  width: 100%;
  min-height: 0;
  flex: 1;
  display: grid;
  gap: 14px;
  align-content: start;
  overflow-y: scroll;
  padding-right: 6px;
  scrollbar-gutter: stable;
}

.result-item {
  justify-self: stretch;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
  min-height: 92px;
  padding: 14px 20px 13px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px;
  gap: 18px;
  align-items: start;
  border-left: 4px solid rgba(132, 33, 48, 0.18);
  background-color: rgba(255, 253, 250, 0.82);
  color: inherit;
  text-decoration: none;
}

.result-copy {
  min-width: 0;
  display: grid;
  align-content: start;
}

.result-copy span {
  color: #842130;
  font-size: var(--font-size-lg);
  line-height: var(--line-height-tight);
}

.result-copy h2 {
  margin-top: 6px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1f1714;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

.result-copy p {
  margin-top: 7px;
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #737373;
  font-family: var(--font-sans);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

.result-copy .meta-number,
.result-copy .meta-owner {
  min-width: 0;
  color: #737373;
}

.result-copy .meta-owner {
  margin-left: 12px;
}

.result-item time {
  align-self: start;
  margin-top: calc(var(--font-size-lg) * var(--line-height-tight) + 6px);
  display: grid;
  justify-items: end;
  color: #aa263b;
  font-family: var(--font-serif);
  font-size: var(--font-size-6xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.result-item small {
  margin-top: 7px;
  color: #a59b96;
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  white-space: nowrap;
}

.stats-panel {
  min-height: 0;
  padding-top: 4px;
  overflow-y: auto;
}

.stats-panel h2 {
  margin-bottom: 22px;
  padding-left: 18px;
  border-left: 3px solid #842130;
  color: #842130;
  font-size: var(--font-size-10xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-none);
}

.stats-card {
  min-height: auto;
  padding: 28px;
  background-color: rgba(255, 253, 250, 0.82);
  box-shadow: 0 1px 3.8px rgba(0, 0, 0, 0.25);
}

.stats-card > p {
  color: #88807b;
  font-family: var(--font-sans);
  font-size: var(--font-size-lg);
  letter-spacing: var(--letter-spacing-wide);
}

.total-count {
  margin-top: 16px;
  display: flex;
  align-items: end;
  gap: 18px;
}

.total-count strong {
  color: #842130;
  font-family: "Noto Serif SC", serif;
  font-size: 64px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 4px 5px rgba(94, 42, 49, 0.26);
}

.total-count span {
  margin-bottom: 8px;
  color: #aaa29d;
  font-size: var(--font-size-8xl);
}

.stats-pair {
  margin: 34px 0 28px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 42px;
}

.stats-pair div {
  display: grid;
  justify-items: center;
  gap: 12px;
}

.stats-pair dt {
  color: #8b837e;
  font-size: var(--font-size-md);
}

.stats-pair dd {
  color: #842130;
  font-family: "Noto Serif SC", serif;
  font-size: var(--font-size-10xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-none);
}

.chart-title {
  margin-bottom: 20px;
  color: #827872;
  font-size: var(--font-size-lg);
}

.bar-chart {
  height: 112px;
  display: grid;
  grid-template-columns: repeat(5, 56px);
  justify-content: center;
  gap: 4px;
  align-items: end;
}

.bar-wrap {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: end;
  justify-items: center;
  position: relative;
}

.bar-wrap i {
  width: 100%;
  min-height: 22px;
  display: block;
  background-color: #e4cfd2;
}

.bar-wrap i.active {
  background-color: #8f1f31;
}

.bar-wrap em {
  margin-top: 12px;
  color: #9b928d;
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-style: var(--font-style-normal);
}

.note-card {
  margin-top: 14px;
  min-height: 0;
  padding: 20px 24px;
  background-color: rgba(234, 232, 227, 0.5);
  color: #6f6660;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-summary);
}

.registry-actions {
  width: 100%;
  max-width: 1920px;
  margin: 12px auto 18px;
  padding: 0 37px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  flex-shrink: 0;
}




@media (max-width: 1360px) {
  .registry-shell {
    grid-template-columns: 180px minmax(360px, 1fr) 300px;
    gap: 22px;
  }

  .side-link {
    width: 180px;
  }

  .stats-panel {
    padding-top: 10px;
  }

  .stats-panel h2 {
    margin-bottom: 24px;
  }
}

@media (max-width: 900px) {
  .registry-shell {
    padding: 24px 20px 0;
    grid-template-columns: 1fr;
  }

  .side-panel {
    padding-top: 0;
  }

  .side-title {
    margin-bottom: 16px;
  }

  .side-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .side-title {
    width: 100%;
  }

  .side-link {
    width: calc(50% - 5px);
    margin-bottom: 0;
  }

  .content-heading {
    grid-template-columns: 1fr;
  }

  .content-heading h1,
  .stats-panel h2 {
    font-size: var(--font-size-10xl);
  }

  .filters {
    justify-content: flex-start;
  }

  .stats-panel {
    grid-column: auto;
  }
}

@media (max-width: 620px) {
  .side-link {
    width: 100%;
  }

  .result-item {
    grid-template-columns: 1fr;
  }

  .result-item time {
    justify-items: start;
  }

  .stats-card {
    padding: 28px 22px;
  }

  .stats-pair {
    gap: 20px;
  }

  .registry-actions {
    padding: 0 20px;
    flex-direction: column;
  }
}
</style>
