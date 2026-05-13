<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchActivityPhotos, fetchActivities, fetchBooks, fetchPapers, fetchSoftwarePatents } from '@/api/index.js'
import { safeBack } from '@/router/navigation.js'
import pageBg from '@/assets/images/backgrounds/mult-page/page-bg.png'

const router = useRouter()
const papers = ref([])
const patents = ref([])
const activities = ref([])
const books = ref([])
const activityPhotos = ref([])
const fallbackPaperId = 'meridian-bioelectric'
const fallbackBookId = 'book_001'
const fallbackPatentId = 'software_001'
const fallbackBookTitle = '出土医学文献叙录'
const featuredBookCover = '/mock-assets/books/book-tianhui-threadbound-cover.jpg'

const paperRoute = (id) => `/paper/${id || fallbackPaperId}`
const bookRoute = (id) => `/monograph/${id || fallbackBookId}`
const patentRoute = (id) => `/patent/${id || fallbackPatentId}`
const activityTimelineRoute = '/activity-timeline'
const fallbackActivityImages = [
  '/mock-assets/activities/activity-group-photo.jpg',
  '/mock-assets/activities/activity-training.jpg',
]
const fallbackActivityPhotos = [
  { id: 'fallback-photo-1', title: '出土医学文献数字化研讨会现场', thumbUrl: fallbackActivityImages[0] },
  { id: 'fallback-photo-2', title: '中医药冷门绝学继承型人才学术能力提升培训班', thumbUrl: fallbackActivityImages[1] },
]

const activityPhotoSrc = (photo, index) => photo?.thumbUrl || photo?.imageUrl || fallbackActivityImages[index % fallbackActivityImages.length]
const formatBookTitle = (title) => {
  const value = title || fallbackBookTitle
  return value.startsWith('《') ? value : `《${value}》`
}

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
    const res = await fetchPapers({ pageNum: 1, pageSize: 18 })
    papers.value = (res.rows || []).map(p => ({
      id: p.id,
      journal: p.journal || '',
      title: p.title,
      date: p.year ? `${p.year}年` : '',
      author: `作者：${p.firstAuthor || ''} 等`,
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
    const res = await fetchSoftwarePatents({ pageNum: 1, pageSize: 5 })
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
    const rows = res.rows || []
    activityPhotos.value = [...rows.slice(0, 2), ...fallbackActivityPhotos.slice(rows.length)].slice(0, 2)
  } catch (e) {
    console.error('获取活动剪影失败', e)
    activityPhotos.value = fallbackActivityPhotos
  }
  try {
    const res = await fetchActivities({ pageNum: 1, pageSize: 6 })
    activities.value = (res.rows || []).map(a => ({
      id: a.id,
      title: a.title,
      date: formatDate(a.time),
    }))
  } catch (e) {
    console.error('获取活动列表失败', e)
  }
})
</script>

<template>
  <main class="academic-page" :style="{ '--page-bg': `url(${pageBg})` }">
    <section class="academic-hero">
      <h1>学术动态</h1>
      <p>汇集本实验室最新的科研成果、出版论著以及重要学术进展。</p>
    </section>

    <section class="academic-grid">
      <section class="panel paper-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>发表论文</h2>
          <router-link class="header-action" :to="{ path: '/achievements', query: { tab: 'papers' } }">查看全部</router-link>
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
          <router-link class="header-action" :to="{ path: '/achievements', query: { tab: 'books' } }">查看全部</router-link>
        </header>

        <div class="book-content">
          <div class="book-copy">
            <h3>{{ formatBookTitle(books[0]?.title) }}</h3>
            <p>{{ books[0]?.author || '出土医学文献分析书目' }}，{{ books[0]?.year || '2024' }} 年，{{ books[0]?.publisher || '大学出版社' }}。</p>
            <router-link class="book-action" :to="bookRoute(books[0]?.id)">阅读提要</router-link>
          </div>
          <div class="book-cover" :aria-label="`${books[0]?.title || fallbackBookTitle}封面`">
            <img :src="featuredBookCover" :alt="`${books[0]?.title || fallbackBookTitle}封面`">
          </div>
        </div>
      </section>

      <section class="panel patent-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>软著专利</h2>
          <router-link class="header-action" :to="{ path: '/achievements', query: { tab: 'patents' } }">查看全部</router-link>
        </header>

        <div class="patent-list">
          <router-link v-for="patent in patents" :key="`${patent.code}-${patent.title}`" class="patent-item" :to="patentRoute(patent.id)">
            <div>
              <span>{{ patent.code }}</span>
              <h3>{{ patent.title }}</h3>
            </div>
            <span class="gear">◆</span>
          </router-link>
        </div>
      </section>

      <section class="panel gallery-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>活动剪影</h2>
        </header>

        <div class="gallery-layout">
          <div class="gallery-list">
            <router-link
              v-for="(photo, index) in activityPhotos"
              :key="photo.id"
              :class="['gallery-card', index === 0 ? 'meeting-card' : 'lab-card']"
              :to="activityTimelineRoute"
            >
              <img :src="activityPhotoSrc(photo, index)" :alt="photo.title || '活动剪影'">
              <figcaption>{{ photo.title }}</figcaption>
            </router-link>
          </div>

          <section class="activity-panel">
            <header class="activity-header">
              <span>学术活动存档</span>
              <router-link class="header-action" to="/activity-timeline">查看全部</router-link>
            </header>

            <ol>
              <li v-for="activity in activities" :key="`${activity.title}-${activity.date}`">
                <router-link :to="`/activity/${activity.id}`">
                  <span></span>
                  <p>{{ activity.title }}</p>
                  <time>{{ activity.date }}</time>
                </router-link>
              </li>
            </ol>
          </section>
        </div>
      </section>
    </section>

    <div class="page-actions return-actions">
      <button type="button" class="return-action return-action--back" @click="goBack">
        <span aria-hidden="true">←</span>
        返回上一页
      </button>
      <router-link class="return-action return-action--home" to="/home">
        返回首页
      </router-link>
    </div>
  </main>
</template>

<style scoped>
.academic-page {
  height: calc(100vh - 53px);
  padding: 18px 0 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(250, 246, 237, 0.32), rgba(250, 246, 237, 0.36)),
    var(--page-bg);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  color: #2e2721;
  font-family: var(--font-serif);
}

.academic-hero,
.academic-grid,
.page-actions {
  padding: 0 56px;
  max-width: 100%;
  box-sizing: border-box;
}

.academic-hero {
  margin-bottom: 16px;
}

.academic-hero h1 {
  margin-bottom: 6px;
  color: var(--color-primary);
  font-size: var(--font-size-8xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-hero);
}

.academic-hero p {
  color: #8a8078;
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
}

.academic-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(340px, 1.12fr) minmax(300px, 0.95fr);
  grid-template-rows: minmax(0, 0.98fr) minmax(0, 0.62fr);
  gap: 14px 16px;
  align-items: stretch;
}

.panel {
  min-width: 0;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.86);
  box-shadow: 0 12px 28px rgba(90, 72, 54, 0.04);
  min-height: 0;
  overflow: hidden;
}

.paper-panel {
  grid-column: 1;
  grid-row: 1 / span 2;
  border-left: 2px solid rgba(132, 33, 48, 0.25);
  height: 100%;
  min-height: 0;
  background-color: rgba(248, 247, 242, 0.86);
}

.book-panel {
  position: relative;
  grid-column: 2;
  grid-row: 1;
}

.patent-panel {
  grid-column: 3;
  grid-row: 1;
  background-color: rgba(248, 246, 240, 0.84);
}

.gallery-panel {
  grid-column: 2 / 4;
  grid-row: 2;
  height: 100%;
  min-height: 0;
}

.activity-panel {
  min-width: 0;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header,
.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.panel-header h2 {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #3f332c;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-title);
}

.header-icon {
  width: 11px;
  height: 11px;
  display: inline-block;
  border: 2px solid var(--color-primary);
  background-color: var(--color-primary);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.85);
}

.panel-header button,
.activity-header button,
.header-action {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-control);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

.panel-header button:hover,
.activity-header button:hover,
.header-action:hover {
  color: var(--color-primary-hover);
}

.paper-list {
  flex: 1;
  min-height: 0;
  max-height: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
  overflow: hidden;
  scrollbar-width: none;
}

.paper-list::-webkit-scrollbar {
  display: none;
}

.paper-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 104px;
  gap: 14px;
  min-height: 46px;
  padding-bottom: 2px;
  color: inherit;
  text-decoration: none;
}

.journal {
  display: block;
  margin-bottom: 4px;
  color: var(--color-primary);
  font-family: var(--font-number);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
}

.paper-item h3 {
  overflow: hidden;
  color: #312821;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
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
  font-size: var(--font-size-sm);
  line-height: var(--line-height-heading);
}

.paper-item strong {
  display: block;
  margin-top: 5px;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.book-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px;
  gap: 16px;
  align-items: center;
}

.book-copy h3 {
  margin-bottom: 10px;
  color: #352a24;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

.book-copy p {
  color: #8a8078;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.book-copy button,
.book-action {
  position: absolute;
  left: 18px;
  bottom: 16px;
  padding: 8px 14px;
  display: inline-flex;
  border: 0;
  background-color: var(--color-primary);
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-control);
  text-decoration: none;
  cursor: pointer;
}

.book-cover {
  aspect-ratio: 3 / 4;
  padding: 6px;
  border: 5px solid #4b3128;
  background: #efe2c7;
  box-shadow: 0 10px 18px rgba(42, 30, 22, 0.2);
}

.book-cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.patent-list {
  display: grid;
  gap: 8px;
}

.patent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 42px;
  padding: 8px 12px;
  border-left: 3px solid #d8a4aa;
  background-color: rgba(255, 255, 255, 0.92);
  color: inherit;
  text-decoration: none;
}

.patent-item span:not(.gear) {
  display: block;
  color: #9d938c;
  font-family: var(--font-number);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-snug);
}

.patent-item h3 {
  color: #3b302a;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.gear {
  flex: 0 0 auto;
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
}

.gallery-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  height: 100%;
  min-height: 0;
  gap: 10px;
}

.gallery-layout {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(260px, 0.92fr);
  gap: 14px;
  align-items: start;
}

.gallery-card {
  position: relative;
  height: 168px;
  display: block;
  overflow: hidden;
  background-color: #333;
  color: inherit;
  text-decoration: none;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
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

.gallery-card figcaption {
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 3px 6px;
  background-color: rgba(132, 33, 48, 0.92);
  color: #fff;
  font-size: var(--font-size-xs);
}

.activity-header {
  margin-bottom: 8px;
}

.activity-header span {
  color: #3f332c;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-title);
}

.activity-panel ol {
  flex: 1;
  min-height: 0;
  list-style: none;
  max-height: none;
  overflow: hidden;
}

.activity-panel li {
  padding: 7px 0;
}

.activity-panel li > a {
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr) 88px;
  gap: 10px;
  align-items: start;
  color: inherit;
  text-decoration: none;
}

.activity-panel li > a > span {
  width: 5px;
  height: 5px;
  margin-top: 6px;
  background-color: var(--color-primary);
}

.activity-panel p {
  overflow: hidden;
  color: var(--color-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-panel time {
  text-align: right;
  line-height: var(--line-height-snug);
  white-space: nowrap;
}

.page-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 1280px) {
  .academic-page {
    padding: 16px 0 16px;
  }

  .academic-hero,
  .page-actions,
  .academic-grid {
    padding: 0 28px;
  }

  .academic-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto;
    gap: 12px;
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
    max-height: 260px;
  }

  .book-content {
    grid-template-columns: minmax(0, 1.4fr) 92px;
  }

  .gallery-layout {
    grid-template-columns: minmax(0, 1.08fr) minmax(280px, 0.92fr);
  }

  .gallery-card {
    height: 104px;
  }
}

@media (max-width: 768px) {
  .academic-page {
    padding: 14px 0 14px;
  }

  .academic-hero,
  .page-actions,
  .academic-grid {
    padding: 0 18px;
  }

  .academic-hero h1 {
    font-size: var(--font-size-5xl);
  }

  .academic-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .panel {
    min-height: auto;
  }

  .paper-list,
  .activity-panel ol {
    max-height: none;
  }

  .book-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .book-cover {
    max-width: 128px;
    margin: 0 auto;
  }

  .gallery-list {
    grid-template-columns: 1fr;
  }

  .gallery-layout {
    grid-template-columns: 1fr;
  }

  .paper-item,
  .activity-panel li > a {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .paper-item aside {
    text-align: left;
    display: flex;
    gap: 8px;
  }

  .paper-item h3,
  .activity-panel p {
    white-space: normal;
  }

  .page-actions {
    justify-content: stretch;
    flex-direction: column;
  }

  .return-action {
    flex: 1;
    width: 100%;
  }
}
</style>
