<script setup>
const papers = [
  { journal: 'Nature Scientific Data', title: '古医籍竹简数字化重构：基于神经计算的方法研究', date: '2023年11月', author: '作者：张三等' },
  { journal: '中医药文化遗产学报', title: '汉代早期出土医学文献处方文献学分析', date: '2025年05月', author: '作者：李四等' },
  { journal: 'Digital Humanities Quarterly', title: '古籍医学实体知识图谱构建与应用研究', date: '2023年05月', author: '作者：王五等' },
  { journal: '文化遗产科学', title: '荆州出土医学简牍的多光谱影像采集与复原', date: '2023年01月', author: '作者：赵六等' },
  { journal: '中医教育', title: '数字化语境下的中医古籍教学模式探索', date: '2022年12月', author: '作者：周七等' },
  { journal: '人工智能与医学', title: '基于深度学习的中医脉象识别系统研究', date: '2022年10月', author: '作者：孙八等' },
  { journal: 'Nature Scientific Data', title: '出土医药文献数据集的标注体系与质量控制', date: '2023年11月', author: '作者：张三等' },
  { journal: '中医药文化遗产学报', title: '早期方剂名物词汇的整理与知识关联', date: '2025年05月', author: '作者：李四等' },
]

const patents = [
  { code: 'CN2023SR124', title: '医学实体标注工具 1.2' },
  { code: 'CN2023SR089', title: '自动图像分割软件系统' },
  { code: 'PAT-2024-DH', title: '古籍手稿 OCR 识别引擎' },
  { code: 'PAT-2024-DH', title: '古籍版面结构分析系统' },
]

const activities = [
  { title: '古医籍竹简数字化重构方法研讨会', date: '2023年11月12日' },
  { title: '汉代早期出土医学文献专题讲座', date: '2025年05月05日' },
  { title: '荆州出土医学简牍多光谱采集工作坊', date: '2023年05月08日' },
  { title: '医学文献知识图谱建设圆桌会', date: '2025年01月22日' },
  { title: '数字人文与中医古籍整理青年论坛', date: '2023年11月12日' },
  { title: '实验室开放日与成果展示', date: '2023年11月12日' },
]
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
            to="/paper/meridian-bioelectric"
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
            <h3>《出土医学文献叙录》</h3>
            <p>出土医学文献分析书目，2024 年大学出版社。</p>
            <button type="button">阅读提要</button>
          </div>
          <div class="book-cover" aria-label="出土医学文献叙录封面">
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
          <article v-for="patent in patents" :key="`${patent.code}-${patent.title}`" class="patent-item">
            <div>
              <span>{{ patent.code }}</span>
              <h3>{{ patent.title }}</h3>
            </div>
            <span class="gear">◎</span>
          </article>
        </div>
      </section>

      <section class="panel gallery-panel">
        <header class="panel-header">
          <h2><span class="header-icon"></span>活动剪影</h2>
        </header>

        <div class="gallery-list">
          <figure class="gallery-card meeting-card">
            <figcaption>2024 青年学者圆桌会</figcaption>
          </figure>
          <figure class="gallery-card lab-card">
            <figcaption>实验室开放日</figcaption>
          </figure>
        </div>
      </section>

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
    </section>

    <div class="page-actions">
      <button type="button" class="plain-button" @click="$router.back()">返回上一页</button>
      <router-link class="home-button" to="/home">返回首页</router-link>
    </div>
  </main>
</template>

<style scoped>
.academic-page {
  min-height: calc(100vh - 53px);
  padding: 28px 62px 22px;
  background:
    linear-gradient(rgba(250, 246, 237, 0.88), rgba(250, 246, 237, 0.9)),
    url('/home-bg2.png') center center / cover fixed;
  color: #2e2721;
  font-family: "SimSun", "宋体", serif;
}

.academic-hero,
.academic-grid,
.page-actions {
  width: min(1200px, 95%);
  margin-right: auto;
  margin-left: auto;
}

.academic-hero {
  margin-bottom: 16px;
}

.academic-hero h1 {
  margin-bottom: 6px;
  color: var(--color-primary);
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
}

.academic-hero p {
  color: #8a8078;
  font-size: 13px;
  line-height: 1.7;
}

.academic-grid {
  display: grid;
  grid-template-columns: minmax(350px, 1.5fr) minmax(280px, 1fr) minmax(200px, 0.8fr);
  grid-template-rows: auto auto;
  gap: 24px 26px;
  align-items: stretch;
}

.panel {
  min-width: 0;
  padding: 20px 22px;
  background-color: rgba(255, 255, 255, 0.78);
  min-height: 280px;
}

.paper-panel {
  grid-row: 1 / span 2;
  border-left: 2px solid rgba(132, 33, 48, 0.25);
  min-height: 600px;
}

.patent-panel {
  background-color: rgba(248, 246, 240, 0.84);
}

.activity-panel {
  padding-top: 22px;
  min-height: 280px;
}

.panel-header,
.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.panel-header h2 {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #4a302a;
  font-size: 16px;
  line-height: 1.2;
}

.header-icon {
  width: 7px;
  height: 7px;
  display: inline-block;
  background-color: var(--color-primary);
}

.panel-header button,
.activity-header button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: "SimSun", "宋体", serif;
  font-size: 10px;
  white-space: nowrap;
  cursor: pointer;
}

.panel-header button:hover,
.activity-header button:hover {
  color: var(--color-primary-hover);
}

.paper-list {
  height: auto;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.paper-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 78px;
  gap: 18px;
  min-height: 44px;
  padding-bottom: 8px;
}

.journal {
  display: block;
  margin-bottom: 5px;
  color: var(--color-primary);
  font-family: Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
}

.paper-item h3 {
  overflow: hidden;
  color: #1b1c19;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paper-item aside {
  text-align: right;
}

.paper-item time,
.activity-panel time {
  display: block;
  color: #968b84;
  font-size: 10px;
  line-height: 1.2;
}

.paper-item strong {
  display: block;
  margin-top: 5px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
}

.book-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px;
  gap: 26px;
  align-items: center;
}

.book-copy h3 {
  margin-bottom: 14px;
  color: #4a302a;
  font-size: 18px;
  line-height: 1.4;
}

.book-copy p {
  color: #8a8078;
  font-size: 12px;
  line-height: 1.8;
}

.book-copy button {
  margin-top: 46px;
  padding: 7px 15px;
  border: 0;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 11px;
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
  gap: 9px;
}

.patent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 41px;
  padding: 8px 10px;
  border-left: 3px solid #d8a4aa;
  background-color: rgba(255, 255, 255, 0.82);
}

.patent-item span:not(.gear) {
  display: block;
  color: #9d938c;
  font-family: Arial, sans-serif;
  font-size: 9px;
  line-height: 1.2;
}

.patent-item h3 {
  color: #42352f;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.35;
}

.gear {
  flex: 0 0 auto;
  color: var(--color-primary);
  font-size: 18px;
}

.gallery-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.gallery-card {
  position: relative;
  height: 148px;
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
  margin-bottom: 12px;
}

.activity-header span {
  color: #6c625b;
  font-size: 11px;
}

.activity-panel ol {
  list-style: none;
}

.activity-panel li {
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr) 62px;
  gap: 8px;
  align-items: start;
  padding: 5px 0;
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
  font-size: 12px;
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
  font-family: "SimSun", "宋体", serif;
  font-size: 12px;
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
    padding: 28px 28px 44px;
  }

  .academic-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto;
    gap: 20px;
  }

  .paper-panel,
  .book-panel,
  .patent-panel,
  .gallery-panel,
  .activity-panel {
    grid-column: auto;
    grid-row: auto;
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
}

@media (max-width: 768px) {
  .academic-page {
    padding: 24px 18px 36px;
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
