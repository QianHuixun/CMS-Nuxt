<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchActivityPhotos, fetchActivities, fetchBooks, fetchPapers, fetchSoftwarePatents } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'

const router = useRouter()
const papers = ref([])
const patents = ref([])
const activities = ref([])
const books = ref([])
const activityPhotos = ref([])
const fallbackPaperId = 'meridian-bioelectric'
const fallbackBookId = 'book_001'
const fallbackPatentId = 'software_001'

const paperRoute = (id) => `/paper/${id || fallbackPaperId}`
const bookRoute = (id) => `/monograph/${id || fallbackBookId}`
const patentRoute = (id) => `/patent/${id || fallbackPatentId}`

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

const goBack = () => {
  safeBack(router, '/academic')
}

onMounted(async () => {
  try {
    const res = await fetchPapers({ pageNum: 1, pageSize: 8 })
    papers.value = (res.rows || []).map(p => ({
      id: p.id,
      journal: p.journal || '',
      title: p.title,
      date: p.year ? `${p.year}年` : '',
      author: `作者：${p.firstAuthor || ''}等`,
    }))
  } catch (e) {
    console.error('获取论文列表失败', e)
  }
  try {
    const res = await fetchBooks({ pageNum: 1, pageSize: 1 })
    books.value = res.rows || []
  } catch (e) {
    console.error('获取著作列表失败', e)
  }
  try {
    const res = await fetchSoftwarePatents({ pageNum: 1, pageSize: 6 })
    patents.value = (res.rows || []).map(p => ({
      id: p.id,
      code: p.registrationNo || '',
      title: p.title,
    }))
  } catch (e) {
    console.error('获取软著专利列表失败', e)
  }
  try {
    const res = await fetchActivityPhotos({ pageNum: 1, pageSize: 2 })
    activityPhotos.value = res.rows || []
  } catch (e) {
    console.error('获取活动剪影失败', e)
  }
  try {
    const res = await fetchActivities({ pageNum: 1, pageSize: 6 })
    activities.value = (res.rows || []).map(a => ({
      title: a.title,
      date: formatDate(a.time),
    }))
  } catch (e) {
    console.error('获取活动列表失败', e)
  }
})
</script>

<template>
  <main class="academic-page">
    <section class="academic-hero">
      <h1>学术动态</h1>
      <p>汇集本实验室最新的科研成果、出版论著及重要学术进展。</p>
    </section>

    <section class="academic-grid">
      <section class="panel paper-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>发表论文</h2>
          <button type="button">查看全部</button>
        </header>

        <div class="paper-list">
          <router-link
            v-for="paper in papers"
            :key="`${paper.journal}-${paper.title}-${paper.date}`"
            class="paper-item"
            :to="paperRoute(paper.id)"
          >
            <div>
              <span class="journal">{{ paper.journal }}</span>
              <h3>{{ paper.title }}</h3>
            </div>
            <aside>
              <time>{{ paper.date }}</time>
              <strong>{{ paper.author }}</strong>
            </aside>
          </router-link>
        </div>
      </section>

      <section class="panel book-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>学术著作</h2>
          <button type="button">查看全部</button>
        </header>

        <div class="book-content">
          <div class="book-copy">
            <h3>《{{ books[0]?.title || '出土医学文献叙录' }}》</h3>
            <p>{{ books[0]?.author || '出土医学文献分析书目' }}，{{ books[0]?.year || '2024' }} 年 {{ books[0]?.publisher || '大学出版社' }}。</p>
            <router-link class="book-action" :to="bookRoute(books[0]?.id)">阅读提要</router-link>
          </div>
          <div class="book-cover" :aria-label="`${books[0]?.title || '出土医学文献叙录'}封面`">
            <div class="book-calligraphy">医<br>简</div>
          </div>
        </div>
      </section>

      <section class="panel patent-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>软著专利</h2>
          <button type="button">查看全部</button>
        </header>

        <div class="patent-list">
          <router-link v-for="patent in patents" :key="`${patent.code}-${patent.title}`" class="patent-item" :to="patentRoute(patent.id)">
            <div>
              <span>{{ patent.code }}</span>
              <h3>{{ patent.title }}</h3>
            </div>
            <span class="gear">◎</span>
          </router-link>
        </div>
      </section>

      <section class="panel gallery-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>活动剪影</h2>
        </header>

        <div class="gallery-layout">
          <div class="gallery-list">
            <figure
              v-for="(photo, index) in activityPhotos"
              :key="photo.id"
              :class="['gallery-card', index === 0 ? 'meeting-card' : 'lab-card']"
            >
              <figcaption>{{ photo.title }}</figcaption>
            </figure>
          </div>

          <section class="activity-panel">
            <header class="activity-header">
              <span>学术活动存档</span>
              <button type="button">查看全部</button>
            </header>

            <ol>
              <li v-for="activity in activities" :key="`${activity.title}-${activity.date}`">
                <span></span>
                <p>{{ activity.title }}</p>
                <time>{{ activity.date }}</time>
              </li>
            </ol>
          </section>
        </div>
      </section>
    </section>

    <div class="page-actions">
      <button type="button" class="plain-button" @click="goBack">返回上一页</button>
      <router-link class="home-button" to="/home">返回首页</router-link>
    </div>
  </main>
</template>

<style scoped>
.academic-page {
  min-height: calc(100vh - 64px);
  padding: 32px 0 24px;
  overflow-x: hidden;
  background:
    linear-gradient(rgba(250, 246, 237, 0.88), rgba(250, 246, 237, 0.9)),
    url('@/assets/images/backgrounds/home/home-bg2.png') center center / cover fixed;
  color: #2e2721;
  font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", "宋体", serif;
}

.academic-hero,
.page-actions {
  padding: 0 70px;
  max-width: 100%;
  box-sizing: border-box;
}

.academic-hero {
  margin-bottom: 24px;
}

.academic-hero h1 {
  margin-bottom: 8px;
  color: var(--color-primary);
  font-size: 34px;
  font-weight: 700;
  line-height: 1.15;
}

.academic-hero p {
  color: #8a8078;
  font-size: 14px;
  line-height: 1.65;
}

.academic-grid {
  padding: 0 70px;
  max-width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(360px, 1fr) minmax(280px, 0.78fr);
  grid-template-rows: auto auto;
  gap: 24px 36px;
  align-items: stretch;
}

.panel {
  min-width: 0;
  padding: 24px 26px;
  background-color: rgba(255, 255, 255, 0.86);
  box-shadow: 0 12px 28px rgba(90, 72, 54, 0.04);
  min-height: 280px;
}

.paper-panel {
  grid-row: 1 / span 2;
  border-left: 2px solid rgba(132, 33, 48, 0.25);
  min-height: 650px;
  background-color: rgba(248, 247, 242, 0.86);
}

.patent-panel {
  background-color: rgba(248, 246, 240, 0.84);
}

.gallery-panel {
  grid-column: 2 / 4;
  min-height: 250px;
}

.activity-panel {
  min-width: 0;
  padding-top: 0;
}

.panel-header,
.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.panel-header h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #3f332c;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.header-icon {
  width: 13px;
  height: 13px;
  display: inline-block;
  border: 2px solid var(--color-primary);
  background-color: var(--color-primary);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.85);
}

.panel-header button,
.activity-header button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.panel-header button:hover,
.activity-header button:hover {
  color: var(--color-primary-hover);
}

.paper-list {
  height: auto;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  scrollbar-width: none;
}

.paper-list::-webkit-scrollbar {
  display: none;
}

.paper-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  gap: 22px;
  min-height: 58px;
  padding-bottom: 4px;
  color: inherit;
  text-decoration: none;
}

.journal {
  display: block;
  margin-bottom: 7px;
  color: var(--color-primary);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
}

.paper-item h3 {
  overflow: hidden;
  color: #312821;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paper-item aside {
  text-align: right;
}

.paper-item time,
.activity-panel time {
  display: block;
  color: #9a9188;
  font-size: 11px;
  line-height: 1.35;
}

.paper-item strong {
  display: block;
  margin-top: 8px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
}

.book-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 30px;
  align-items: center;
}

.book-copy h3 {
  margin-bottom: 22px;
  color: #352a24;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
}

.book-copy p {
  color: #8a8078;
  font-size: 14px;
  line-height: 1.8;
}

.book-copy button,
.book-action {
  margin-top: 58px;
  padding: 10px 18px;
  display: inline-flex;
  border: 0;
  background-color: var(--color-primary);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
}

.book-cover {
  aspect-ratio: 3 / 4;
  padding: 8px;
  border: 7px solid #4b3128;
  background: #efe2c7;
  box-shadow: 0 10px 18px rgba(42, 30, 22, 0.2);
}

.book-calligraphy {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(132, 33, 48, 0.16);
  color: #2e1e17;
  font-family: "KaiTi", "STKaiti", serif;
  font-size: 34px;
  line-height: 1.25;
  transform: rotate(-8deg);
}

.patent-list {
  display: grid;
  gap: 12px;
}

.patent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 52px;
  padding: 10px 14px;
  border-left: 3px solid #d8a4aa;
  background-color: rgba(255, 255, 255, 0.92);
  color: inherit;
  text-decoration: none;
}

.patent-item span:not(.gear) {
  display: block;
  color: #9d938c;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  line-height: 1.2;
}

.patent-item h3 {
  color: #3b302a;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
}

.gear {
  flex: 0 0 auto;
  color: var(--color-primary);
  font-size: 18px;
}

.gallery-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.gallery-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 24px;
  align-items: start;
}

.gallery-card {
  position: relative;
  height: 198px;
  overflow: hidden;
  background-color: #333;
}

.meeting-card {
  background:
    linear-gradient(rgba(20, 20, 20, 0.08), rgba(20, 20, 20, 0.08)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 52px),
    linear-gradient(135deg, #202020, #777 45%, #151515);
}

.lab-card {
  background:
    radial-gradient(circle at 74% 22%, rgba(255, 255, 255, 0.9) 0 6px, transparent 7px),
    linear-gradient(145deg, #0f0f0f, #535353 45%, #101010);
}

.gallery-card::before,
.gallery-card::after {
  content: "";
  position: absolute;
  background-color: rgba(255, 255, 255, 0.18);
}

.meeting-card::before {
  left: 22px;
  bottom: 30px;
  width: 116px;
  height: 45px;
  border-radius: 50% 50% 0 0;
}

.meeting-card::after {
  left: 36px;
  top: 34px;
  width: 94px;
  height: 74px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  background: transparent;
}

.lab-card::before {
  left: 42px;
  bottom: 36px;
  width: 112px;
  height: 38px;
  transform: skewX(-12deg);
}

.lab-card::after {
  top: 22px;
  right: 34px;
  width: 38px;
  height: 88px;
  border-radius: 24px 24px 4px 4px;
  opacity: 0.24;
}

.gallery-card figcaption {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 4px 7px;
  background-color: rgba(132, 33, 48, 0.92);
  color: #fff;
  font-size: 10px;
}

.activity-header {
  margin-bottom: 14px;
}

.activity-header span {
  color: #5d524a;
  font-size: 14px;
  font-weight: 600;
}

.activity-panel ol {
  list-style: none;
}

.activity-panel li {
  display: grid;
  grid-template-columns: 7px minmax(0, 1fr) 82px;
  gap: 10px;
  align-items: start;
  padding: 7px 0;
}

.activity-panel li > span {
  width: 5px;
  height: 5px;
  margin-top: 6px;
  background-color: var(--color-primary);
}

.activity-panel p {
  overflow: hidden;
  color: var(--color-primary);
  font-size: 15px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-panel time {
  text-align: right;
}

.page-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.plain-button,
.home-button {
  min-width: 84px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  text-decoration: none;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}

.plain-button {
  background-color: rgba(255, 255, 255, 0.88);
  color: var(--color-primary);
}

.home-button {
  background-color: var(--color-primary);
  color: #fff;
}

@media (max-width: 1280px) {
  .academic-page {
    padding: 28px 0 44px;
  }

  .academic-hero,
  .page-actions,
  .academic-grid {
    padding: 0 28px;
  }

  .academic-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto;
    gap: 20px;
  }

  .paper-panel,
  .book-panel,
  .patent-panel,
  .gallery-panel {
    grid-column: auto;
    grid-row: auto;
  }

  .gallery-panel {
    grid-column: 1 / -1;
  }

  .paper-panel {
    grid-row: span 1;
    min-height: auto;
  }

  .paper-list {
    height: auto;
    max-height: 420px;
  }

  .book-content {
    grid-template-columns: minmax(0, 1.5fr) 100px;
  }

  .gallery-layout {
    grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  }
}

@media (max-width: 768px) {
  .academic-page {
    padding: 24px 0 36px;
  }

  .academic-hero,
  .page-actions,
  .academic-grid {
    padding: 0 18px;
  }

  .academic-hero h1 {
    font-size: 24px;
  }

  .academic-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .panel {
    min-height: auto;
  }

  .book-content {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .book-cover {
    max-width: 150px;
    margin: 0 auto;
  }

  .gallery-list {
    grid-template-columns: 1fr;
  }

  .gallery-layout {
    grid-template-columns: 1fr;
  }

  .paper-item,
  .activity-panel li {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .paper-item aside {
    text-align: left;
    display: flex;
    gap: 12px;
  }

  .paper-item h3,
  .activity-panel p {
    white-space: normal;
  }

  .page-actions {
    justify-content: stretch;
    flex-direction: column;
  }

  .plain-button,
  .home-button {
    flex: 1;
    width: 100%;
  }
}
</style>
