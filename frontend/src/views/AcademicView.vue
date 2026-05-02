<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const teamList = ref([
  {
    name: 'Dr. Chen Wei',
    title: '首席研究员',
    desc: '"Pioneering the digitization of meridian systems through..."',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Prof. Li Na',
    title: '基因组学专家',
    desc: 'Focusing on the Herbone project and traditional...',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Researcher Wang',
    title: '临床分析师',
    desc: 'Leading trials on the integration of Tianhui...',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Dr. Chen Wei',
    title: '首席研究员',
    desc: '"Pioneering the digitization of meridian systems through..."',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Dr. Chen Wei',
    title: '首席研究员',
    desc: '"Pioneering the digitization of meridian systems through..."',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Dr. Zhang Li',
    title: '数据分析师',
    desc: 'Focus on TCM literature data mining and visualization...',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Prof. Wang Hong',
    title: '中医药传承专家',
    desc: 'Research on inheritance and innovation of ancient TCM prescriptions...',
    avatar: 'https://via.placeholder.com/48',
  },
])

const projectList = ref([
  {
    tag: 'NATIONAL NATURAL SCIENCE FOUNDATION',
    title: 'Multi-modal AI Analysis for Ancient TCM Manuscripts',
    meta: 'PI: Dr. Zhou Ming · ¥2.4M',
  },
  {
    tag: 'STATE KEY LABORATORY FUND',
    title: 'Digital Reconstruction of the Song Dynasty Bronze Figure',
    meta: 'PI: Prof. Zhang Hua · ¥1.8M',
  },
  {
    tag: 'PROVINCIAL HEALTH GRANT',
    title: 'Metabolomics in Herb-Drug Interaction Studies',
    meta: 'PI: Dr. Sun Qian · ¥0.9M',
  },
  {
    tag: 'INSTITUTIONAL CORE FUND',
    title: 'Machine Learning for Pulse Pattern Recognition',
    meta: 'PI: Researcher Liu · ¥1.2M',
  },
  {
    tag: 'INSTITUTIONAL CORE FUND',
    title: 'Machine Learning for Pulse Pattern Recognition',
    meta: 'PI: Researcher Liu · ¥1.2M',
  },
  {
    tag: 'INSTITUTIONAL CORE FUND',
    title: 'Machine Learning for Pulse Pattern Recognition',
    meta: 'PI: Researcher Liu · ¥1.2M',
  },
  {
    tag: 'NATIONAL SOCIAL SCIENCE FUND',
    title: 'Textual Research on Tianhui Medical Bamboo Slips',
    meta: 'PI: Prof. Li Ming · ¥1.5M',
  },
  {
    tag: 'MINISTRY OF EDUCATION FUND',
    title: 'TCM Meridian Digital Model Construction',
    meta: 'PI: Dr. Zhao Jie · ¥0.8M',
  },
])

const wordCloud = ref([
  { text: '天回医简', top: '10%', left: '20%', height: '200px', fontSize: '18px' },
  { text: '经络数字化', top: '5%', left: '45%', height: '280px', fontSize: '22px' },
  { text: '针灸铜人', top: '20%', right: '30%', height: '180px', fontSize: '18px' },
  { text: '金石篆刻', top: '15%', right: '15%', height: '220px', fontSize: '18px' },
  { text: '天回医简', bottom: '20%', left: '30%', height: '160px', fontSize: '18px' },
  { text: '金石篆刻', bottom: '10%', right: '20%', height: '240px', fontSize: '18px' },
  { text: '针灸铜人', bottom: '30%', left: '50%', height: '140px', fontSize: '18px', center: true },
])

function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="academic-page">
    <div class="main-container">
      <div class="team-section">
        <h2 class="section-title">人才队伍</h2>
        <p class="section-subtitle">核心科研力量</p>
        <div class="team-cards">
          <div v-for="(member, index) in teamList" :key="index" class="team-card">
            <div class="avatar">
              <img :src="member.avatar" :alt="member.name" />
            </div>
            <div class="card-info">
              <div class="name">{{ member.name }}</div>
              <div class="title">{{ member.title }}</div>
              <div class="desc">{{ member.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="wordcloud-section">
        <div
          v-for="(word, index) in wordCloud"
          :key="index"
          class="word-rect"
          :style="{
            top: word.top,
            left: word.left,
            right: word.right,
            bottom: word.bottom,
            height: word.height,
            fontSize: word.fontSize,
            transform: word.center ? 'translateX(-50%)' : undefined,
          }"
        >
          {{ word.text }}
        </div>
        <div class="more-btn">
          <div class="more-text">查看更多研究成果</div>
          <div class="more-icon">▼</div>
        </div>
      </div>

      <div class="project-section">
        <h2 class="section-title">获批课题</h2>
        <p class="section-subtitle">2024 科研资助项目</p>
        <div class="project-list">
          <div v-for="(project, index) in projectList" :key="index" class="project-item">
            <div class="project-tag">{{ project.tag }}</div>
            <div class="project-title">{{ project.title }}</div>
            <div class="project-meta">{{ project.meta }}</div>
          </div>
        </div>
        <div class="view-all-btn">
          <span>查看</span>
          <span>全部</span>
        </div>
      </div>
    </div>

    <button class="back-home-btn" @click="goHome">
      <span class="back-home-icon">🏠</span>
      <span>返回首页</span>
    </button>
  </div>
</template>

<style scoped>
.academic-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-page);
  background-image:
    linear-gradient(rgba(220, 210, 190, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220, 210, 190, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  color: var(--color-text);
  padding: 24px 40px 80px;
  overflow-x: hidden;
}

.main-container {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  gap: 20px;
  align-items: flex-start;
  height: calc(100vh - 140px);
}

.team-section {
  padding: 0 20px;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) var(--bg-page);
  padding-right: 8px;
}

.team-section::-webkit-scrollbar {
  width: 4px;
  display: block;
}

.team-section::-webkit-scrollbar-track {
  background: var(--bg-page);
  margin: 10px 0;
}

.team-section::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 2px;
  border: 1px solid var(--bg-page);
}

.team-section::-webkit-scrollbar-button {
  display: block;
  height: 10px;
  background: var(--bg-page);
}

.section-title {
  font-size: 24px;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 8px;
  position: relative;
  padding-left: 12px;
}

.section-subtitle {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
  padding-left: 12px;
}

.team-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.team-card {
  background-color: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e8e3d8;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.wordcloud-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

.word-rect {
  position: absolute;
  background-color: rgba(240, 230, 210, 0.6);
  border: 1px solid rgba(180, 160, 140, 0.3);
  writing-mode: vertical-rl;
  padding: 12px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-weight: bold;
  letter-spacing: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  width: 40px;
}

.more-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  cursor: pointer;
}

.more-text {
  font-size: 20px;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 8px;
}

.more-icon {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--color-primary);
}

.project-section {
  padding: 0 20px;
  text-align: right;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) var(--bg-page);
  padding-left: 8px;
}

.project-section::-webkit-scrollbar {
  width: 4px;
  display: block;
}

.project-section::-webkit-scrollbar-track {
  background: var(--bg-page);
  margin: 10px 0;
}

.project-section::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 2px;
  border: 1px solid var(--bg-page);
}

.project-section::-webkit-scrollbar-button {
  display: block;
  height: 10px;
  background: var(--bg-page);
}

.project-section .section-title {
  padding-left: 0;
  padding-right: 12px;
}

.project-section .section-subtitle {
  padding-left: 0;
  padding-right: 12px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-item {
  margin-bottom: 8px;
}

.project-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e8e3d8;
  color: #999;
  font-size: 10px;
  border-radius: 2px;
  margin-bottom: 6px;
}

.project-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  line-height: 1.6;
}

.project-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.view-all-btn {
  width: 60px;
  height: 60px;
  background-color: rgba(132, 33, 48, 0.1);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto;
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 12px;
}

.back-home-btn {
  position: fixed;
  bottom: 24px;
  right: 40px;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  transition: background-color 0.2s ease;
}

.back-home-btn:hover {
  background-color: var(--color-primary-hover);
}

.back-home-icon {
  font-size: 16px;
}
</style>
