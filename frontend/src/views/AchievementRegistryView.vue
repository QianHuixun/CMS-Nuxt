<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()

const sections = [
  { key: 'papers', title: '发表论文', icon: 'home' },
  { key: 'patents', title: '软著专利', icon: 'badge' },
  { key: 'books', title: '学术著作', icon: 'doc' },
  { key: 'topics', title: '获批课题', icon: 'chart' },
]

const currentKey = ref('papers')

const currentSection = computed(() => {
  return sections.find((section) => section.key === currentKey.value) ?? sections[0]
})

const typeLabel = computed(() => {
  const labels = { papers: '发表论文', patents: '软件著作权', books: '学术著作', topics: '获批课题' }
  return labels[currentKey.value]
})

const results = ref([])
const fallbackChartBars = [
  { year: '2020', value: 34 },
  { year: '2021', value: 48 },
  { year: '2022', value: 62 },
  { year: '2023', value: 78 },
  { year: '2024(Q1)', value: 100, active: true },
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
      const res = await fetchPapers({ pageNum: 1, pageSize: 10 })
      nextResults = (res.rows || []).map(p => ({
        category: p.type || '论文',
        title: p.title,
        number: p.doi || '',
        owner: p.firstAuthor || '',
        date: p.year ? String(p.year) : '',
      }))
    } else if (key === 'patents') {
      const res = await fetchSoftwarePatents({ pageNum: 1, pageSize: 10 })
      nextResults = (res.rows || []).map(p => ({
        category: p.type || '软著',
        title: p.title,
        number: p.registrationNo || '',
        owner: p.owner || '',
        date: p.year ? String(p.year) : '',
      }))
    } else if (key === 'books') {
      const res = await fetchBooks({ pageNum: 1, pageSize: 10 })
      nextResults = (res.rows || []).map(b => ({
        category: '专著',
        title: b.title,
        number: b.isbn || '',
        owner: b.author || '',
        date: b.year ? String(b.year) : '',
      }))
    } else if (key === 'topics') {
      const res = await fetchProjects({ pageNum: 1, pageSize: 10 })
      nextResults = (res.rows || []).map(p => ({
        category: p.type || '课题',
        title: p.title,
        number: '',
        owner: p.leader || '',
        date: p.startYear ? String(p.startYear) : '',
      }))
    }
    if (currentKey.value === key) results.value = nextResults
  } catch (e) {
    console.error('加载成果列表失败', e)
  }
  await loadStats(key)
}

const switchSection = (key) => {
  currentKey.value = key
  loadData(key)
}

onMounted(() => loadData())

const goBack = () => {
  safeBack(router, '/academic')
}
</script>

<template>
  <main class="registry-page">
    <div class="registry-shell">
      <aside class="side-panel" aria-label="成果库分类">
        <div class="side-title">
          <span class="flask-icon" aria-hidden="true"></span>
          <strong>成果库</strong>
        </div>

        <button
          v-for="section in sections"
          :key="section.key"
          type="button"
          :class="['side-link', section.icon, { active: currentKey === section.key }]"
          @click="switchSection(section.key)"
        >
          <span aria-hidden="true"></span>
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

        <div class="result-list">
          <article v-for="item in results" :key="`${item.number}-${item.title}`" class="result-item">
            <div class="result-copy">
              <span>{{ item.category }}</span>
              <h2>{{ item.title }}</h2>
              <p>
                登记号: {{ item.number }}
                <b></b>
                负责人: {{ item.owner }}
              </p>
            </div>
            <time>{{ item.date }}<small>PUBLICATION DATE</small></time>
          </article>
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

    <footer class="registry-actions">
      <button type="button" class="ghost-button" @click="goBack">
        <span aria-hidden="true">‹</span>
        返回上一页
      </button>
      <router-link class="home-button" to="/home">
        <span aria-hidden="true">⌂</span>
        返回首页
      </router-link>
    </footer>
  </main>
</template>

<style scoped>
.registry-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(rgba(250, 247, 242, 0.88), rgba(250, 247, 242, 0.9)),
    url('@/assets/images/backgrounds/home/home-bg2.png') center top / cover fixed,
    #faf7f2;
  color: #2f2522;
  font-family: "Noto Serif SC", "SimSun", "宋体", serif;
}

.registry-shell {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 26px 37px 0;
  display: grid;
  grid-template-columns: 250px minmax(520px, 1fr) 436px;
  gap: 38px;
  flex: 1;
}

.side-panel {
  padding-top: 0;
}

.side-title {
  margin-bottom: 34px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #842130;
}

.side-title strong {
  font-size: 28px;
  font-weight: 700;
}

.flask-icon {
  width: 22px;
  height: 28px;
  display: inline-block;
  position: relative;
  background-color: #842130;
  clip-path: polygon(28% 0, 72% 0, 72% 28%, 100% 82%, 86% 100%, 14% 100%, 0 82%, 28% 28%);
}

.side-link {
  width: 250px;
  height: 50px;
  margin-bottom: 9px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  color: #6f6a66;
  font: inherit;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.side-link.active {
  background-color: #fff;
  color: #842130;
}

.side-link span {
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  position: relative;
}

.side-link.home span {
  border-radius: 3px 3px 2px 2px;
  transform: translateY(3px);
}

.side-link.home span::before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  left: 1px;
  top: -8px;
  border-left: 2px solid currentColor;
  border-top: 2px solid currentColor;
  transform: rotate(45deg);
  background: transparent;
}

.side-link.badge span {
  border-radius: 50%;
}

.side-link.badge span::after {
  content: "";
  position: absolute;
  inset: 5px;
  background-color: currentColor;
  border-radius: 50%;
}

.side-link.doc span::before,
.side-link.doc span::after,
.side-link.chart span::before,
.side-link.chart span::after {
  content: "";
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background-color: currentColor;
}

.side-link.doc span::before {
  top: 5px;
}

.side-link.doc span::after {
  top: 10px;
}

.side-link.chart span::before {
  bottom: 4px;
}

.side-link.chart span::after {
  left: 8px;
  width: 4px;
  height: 8px;
  bottom: 4px;
}

.content-panel {
  min-width: 0;
  padding-top: 0;
}

.content-heading {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, 402px);
  gap: 32px;
  align-items: start;
}

.content-heading h1 {
  color: #842130;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
}

.content-heading p {
  margin-top: 20px;
  color: #6d625d;
  font-size: 16px;
}

.search-box {
  height: 61px;
  padding: 0 18px;
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
  font-size: 14px;
}

.search-box input::placeholder {
  color: #c59aa0;
}

.filters {
  margin: 20px 10px 9px 0;
  display: flex;
  justify-content: flex-end;
  gap: 48px;
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
  font-size: 16px;
}

.filters i {
  width: 8px;
  height: 8px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  transform: rotate(45deg) translateY(-2px);
}

.result-list {
  display: grid;
  gap: 20px;
}

.result-item {
  min-height: 130px;
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 24px;
  align-items: center;
  border-left: 4px solid rgba(132, 33, 48, 0.18);
  background-color: rgba(255, 253, 250, 0.82);
}

.result-copy span {
  color: #842130;
  font-size: 13px;
}

.result-copy h2 {
  margin-top: 12px;
  color: #1f1714;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
}

.result-copy p {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  color: #6f6660;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
}

.result-copy b {
  display: none;
}

.result-item time {
  display: grid;
  justify-items: end;
  color: #aa263b;
  font-family: "Noto Serif SC", serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
}

.result-item small {
  margin-top: 7px;
  color: #a59b96;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 10px;
  font-weight: 400;
}

.stats-panel {
  padding-top: 24px;
}

.stats-panel h2 {
  margin-bottom: 60px;
  padding-left: 26px;
  border-left: 3px solid #842130;
  color: #842130;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}

.stats-card {
  min-height: 569px;
  padding: 40px;
  background-color: rgba(255, 253, 250, 0.82);
  box-shadow: 0 1px 3.8px rgba(0, 0, 0, 0.25);
}

.stats-card > p {
  color: #88807b;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 13px;
  letter-spacing: 0.08em;
}

.total-count {
  margin-top: 22px;
  display: flex;
  align-items: end;
  gap: 18px;
}

.total-count strong {
  color: #842130;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 82px;
  font-weight: 400;
  line-height: 0.9;
  text-shadow: 0 4px 5px rgba(94, 42, 49, 0.26);
}

.total-count span {
  margin-bottom: 8px;
  color: #aaa29d;
  font-size: 26px;
}

.stats-pair {
  margin: 78px 0 48px;
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
  font-size: 12px;
}

.stats-pair dd {
  color: #842130;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 1;
}

.chart-title {
  margin-bottom: 20px;
  color: #827872;
  font-size: 13px;
}

.bar-chart {
  height: 142px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
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
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 10px;
  font-style: normal;
}

.note-card {
  margin-top: 20px;
  min-height: 139px;
  padding: 32px 40px;
  background-color: rgba(234, 232, 227, 0.5);
  color: #6f6660;
  font-size: 13px;
  line-height: 1.75;
}

.registry-actions {
  width: 100%;
  max-width: 1920px;
  margin: 20px auto 40px;
  padding: 0 62px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.ghost-button,
.home-button {
  min-height: 45px;
  padding: 12px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(221, 192, 192, 0.15);
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
}

.ghost-button {
  background-color: #fff;
  color: #842130;
}

.home-button {
  border-color: #842130;
  background-color: #842130;
  color: #fff;
}

@media (max-width: 1360px) {
  .registry-shell {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  .stats-panel {
    grid-column: 2;
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
    font-size: 32px;
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
