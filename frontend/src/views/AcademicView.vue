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
  { text: '经络数字化', top: '2%', left: '36%', height: '320px', width: '52px', fontSize: '28px', opacity: 1, zIndex: 3 },
  { text: '天回医简', top: '0%', left: '12%', height: '260px', width: '42px', fontSize: '22px', opacity: 0.9, zIndex: 2 },
  { text: '金石篆刻', top: '4%', right: '10%', height: '280px', width: '46px', fontSize: '24px', opacity: 0.92, zIndex: 2 },
  { text: '针灸铜人', top: '16%', right: '26%', height: '240px', width: '38px', fontSize: '20px', opacity: 0.85, zIndex: 2 },
  { text: '出土文献', top: '12%', left: '54%', height: '220px', width: '30px', fontSize: '15px', opacity: 0.4, zIndex: 1 },
  { text: '马王堆', top: '8%', left: '2%', height: '160px', width: '26px', fontSize: '12px', opacity: 0.3, zIndex: 1 },
  { text: '天回医简', top: '30%', left: '22%', height: '260px', width: '42px', fontSize: '22px', opacity: 0.88, zIndex: 2 },
  { text: '本草纲目', top: '28%', right: '16%', height: '230px', width: '36px', fontSize: '18px', opacity: 0.78, zIndex: 2 },
  { text: '文物修复', top: '38%', left: '46%', height: '180px', width: '28px', fontSize: '13px', opacity: 0.35, zIndex: 1 },
  { text: '金石篆刻', top: '42%', right: '6%', height: '240px', width: '38px', fontSize: '20px', opacity: 0.82, zIndex: 2 },
  { text: '方剂配伍', top: '48%', left: '8%', height: '160px', width: '26px', fontSize: '12px', opacity: 0.3, zIndex: 1 },
  { text: '天回医简', top: '55%', right: '22%', height: '270px', width: '44px', fontSize: '23px', opacity: 0.9, zIndex: 2 },
  { text: '简帛医书', top: '52%', left: '34%', height: '200px', width: '30px', fontSize: '14px', opacity: 0.38, zIndex: 1 },
  { text: '金石篆刻', bottom: '6%', left: '18%', height: '250px', width: '40px', fontSize: '21px', opacity: 0.86, zIndex: 2 },
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
            width: word.width,
            fontSize: word.fontSize,
            opacity: word.opacity,
            zIndex: word.zIndex,
          }"
        >
          <img src="@/assets/images/backgrounds/academic/bamboo-slip.svg" class="word-bg" alt="" />
          <span class="word-text">{{ word.text }}</span>
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
          <div v-for="(project, index) in projectList.slice(0, 5)" :key="index" class="project-item">
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

    <button class="btn-back" @click="goHome">返回首页</button>
  </div>
</template>

<style scoped>
.academic-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-page);
  background-image:
    linear-gradient(rgba(220, 210, 190, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220, 210, 190, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  color: var(--color-text);
  padding: 24px 40px 80px;
}

:global(body),
:global(html),
:global(#app) {
  overflow: hidden;
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
  direction: rtl;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) var(--bg-page);
  padding-left: 8px;
}

.team-section > * {
  direction: ltr;
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
  writing-mode: vertical-rl;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-weight: bold;
  letter-spacing: 4px;
}

.word-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
}

.word-text {
  position: relative;
  z-index: 1;
  padding: 12px 0;
  font-family: "TengXiangFanXiaoGeJianDu", "SimSun", "宋体", serif;
}

.more-btn {
  position: absolute;
  bottom: 16px;
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
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--color-primary);
}

.project-section {
  padding: 0 20px;
  text-align: left;
  height: 100%;
  padding-left: 8px;
}

.project-section .section-title {
  padding-left: 0;
  padding-right: 12px;
  text-align: right;
}

.project-section .section-subtitle {
  padding-left: 0;
  padding-right: 12px;
  text-align: right;
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
  background-color: #84213033;
  color: var(--color-primary);
  font-size: 10px;
  border-radius: 2px;
  margin-bottom: 6px;
  text-align: left;
}

.project-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  line-height: 1.6;
  text-align: right;
}

.project-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: left;
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

.academic-page .btn-back {
  position: fixed;
  bottom: 24px;
  right: 40px;
  z-index: 10;
}
</style>
