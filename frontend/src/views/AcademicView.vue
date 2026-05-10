<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchTalents, fetchWordClouds, fetchProjects } from '@/api/index.js'

const router = useRouter()

const fallbackTeamList = [
  { id: 1, name: 'Dr. Chen Wei', title: '首席研究员', desc: '"Pioneering the digitization of meridian systems throug...', avatar: 'https://example.edu/mock/talents/chen-wei.jpg' },
  { id: 2, name: 'Prof. Li Na', title: '基因组学专家', desc: 'Focusing on the Herbome project and traditional...', avatar: 'https://example.edu/mock/talents/zhou-ming.jpg' },
  { id: 3, name: 'Researcher Wang', title: '临床分析师', desc: 'Leading trials on the integration of Tianhui...', avatar: 'https://example.edu/mock/talents/li-qing.jpg' },
  { id: 4, name: 'Dr. Chen Wei', title: '首席研究员', desc: '"Pioneering the digitization of meridian systems throug...', avatar: 'https://example.edu/mock/talents/chen-wei.jpg' },
]

// 示例词库
const fallbackWords = ['天回医简', '经脉数字化', '出土文献', '知识服务', '简牍', '中医药', '古籍', '针灸铜人', '金石篆刻', '黄帝内经', '汉代医学', '现代医学']

const fallbackProjectList = [
  { tag: 'NATIONAL NATURAL SCIENCE FOUNDATION', title: 'Multi-modal AI Analysis for Ancient TCM Manuscripts', meta: 'PI: Dr. Zhou Ming · ¥2.4M' },
  { tag: 'STATE KEY LABORATORY FUND', title: 'Digital Reconstruction of the Song Dynasty Bronze Figure', meta: 'PI: Prof. Zhang Hua · ¥1.8M' },
  { tag: 'PROVINCIAL HEALTH GRANT', title: 'Metabolomics in Herb-Drug Interaction Studies', meta: 'PI: Dr. Sun Qian · ¥0.9M' },
  { tag: 'INSTITUTIONAL CORE FUND', title: 'Machine Learning for Pulse Pattern Recognition', meta: 'PI: Researcher Liu · ¥1.2M' },
  { tag: 'INSTITUTIONAL CORE FUND', title: 'Machine Learning for Pulse Pattern Recognition', meta: 'PI: Researcher Liu · ¥1.2M' },
]

/**
 * 碰撞检测算法 + 权重分区分布
 */
const createWordCloud = (words) => {
  const MAX_WORDS = 14 // 限制最大数量，保持画面留白
  const displayWords = words.slice(0, MAX_WORDS)
  const totalWords = displayWords.length
  
  if (totalWords === 0) return []

  // 1. 生成或计算权重分布 (0.0 到 1.0)
  let wordsWithWeight = displayWords.map((word) => {
    let text = typeof word === 'string' ? word : word.text
    let weight = typeof word === 'object' && word.weight ? word.weight / 100 : null
    return { text, weight }
  })

  // 如果没有后端返回的真实权重，则打乱数组并赋予渐进式曲线权重
  if (wordsWithWeight[0].weight === null) {
    wordsWithWeight.sort(() => Math.random() - 0.5)
    wordsWithWeight = wordsWithWeight.map((w, i) => {
      const normalized = 1 - (i / (totalWords - 1))
      w.weight = Math.pow(normalized, 2) * 0.85 + 0.15 
      return w
    })
  }

  // 关键一：按权重从大到小排序，优先放置大竹简，让小竹简见缝插针
  wordsWithWeight.sort((a, b) => b.weight - a.weight)

  const placed = [] // 记录已放置的竹简位置信息，用于碰撞检测
  // 预估词云容器的宽高比例，用于计算碰撞面积百分比
  const estContainerW = 600
  const estContainerH = 800

  return wordsWithWeight.map((wordObj) => {
    const { text, weight } = wordObj
    
    // --- 视觉特征映射 ---
    const height = Math.floor(140 + weight * 260) 
    const width = Math.floor(22 + weight * 32)    
    const fontSize = Math.floor(13 + weight * 16) 
    
    const opacity = (0.2 + weight * 0.8).toFixed(2)
    const zIndex = Math.floor(weight * 10) + 1

    // 将 px 转换为大致的百分比宽度，用于碰撞计算
    const widthPct = (width / estContainerW) * 100
    const heightPct = (height / estContainerH) * 100

    let leftNum, topNum
    let attempts = 0
    const maxAttempts = 150 // 给每个词 150 次找空地的机会
    let isCollision = true

    // 关键二：基于碰撞检测的 while 循环寻找安全位置
    while (isCollision && attempts < maxAttempts) {
      attempts++

      // 权重高的倾向中间，权重低的全局随机
      if (weight > 0.6) {
        leftNum = 35 + Math.random() * 30 // X: 35% ~ 65% (居中区域)
        topNum = 5 + Math.random() * 25   // Y: 5% ~ 30% 
      } else {
        leftNum = 12 + Math.random() * 76 // X: 12% ~ 88% (避免太贴边)
        topNum = 5 + Math.random() * 45   // Y: 5% ~ 50% 
      }

      // 遍历已放置的竹简，判断是否有矩形相交（重叠）
      isCollision = placed.some(p => {
        // 设置安全间距（Padding）：水平方向留多点空间防挡字，垂直方向允许微微交错
        const padX = 2.5 
        const padY = 2.0 
        const overlapX = leftNum < (p.left + p.widthPct + padX) && (leftNum + widthPct + padX) > p.left
        const overlapY = topNum < (p.top + p.heightPct + padY) && (topNum + heightPct + padY) > p.top
        return overlapX && overlapY
      })
    }

    // 找到合适的位置后，记录到 placed 数组中
    placed.push({ left: leftNum, top: topNum, widthPct, heightPct })

    const left = `${leftNum}%`
    const top = `${topNum}%` 

    const floatDelay = `${(Math.random() * 4).toFixed(2)}s`
    const entranceDelay = `${(Math.random() * 1.5).toFixed(2)}s`

    return {
      text, left, top, 
      height: `${height}px`, 
      width: `${width}px`, 
      fontSize: `${fontSize}px`, 
      opacity, zIndex, floatDelay, entranceDelay
    }
  })
}

const teamList = ref([...fallbackTeamList])
const wordCloud = ref([])
const projectList = ref([...fallbackProjectList])

wordCloud.value = createWordCloud(fallbackWords)

onMounted(async () => {
  try {
    const talentRes = await fetchTalents()
    const nextTeamList = (talentRes.list || []).map(t => ({
      id: t.id,
      name: t.name,
      title: t.title,
      desc: t.researchArea,
      avatar: t.avatar,
    }))
    if (nextTeamList.length) teamList.value = nextTeamList
  } catch (e) {
    console.warn('获取人才列表失败', e)
  }
  
  try {
    const wordRes = await fetchWordClouds()
    const words = (wordRes.list || []).flatMap(w => w.words || [])
    if (words.length) wordCloud.value = createWordCloud(words)
  } catch (e) {
    console.warn('获取词云失败', e)
  }
  
  try {
    const projectRes = await fetchProjects({ pageNum: 1, pageSize: 5 })
    const nextProjectList = (projectRes.rows || []).map(p => ({
      tag: p.type,
      title: p.title,
      meta: `负责人: ${p.leader} · ${p.startYear}-${p.endYear}`,
    }))
    if (nextProjectList.length) projectList.value = nextProjectList
  } catch (e) {
    console.warn('获取课题列表失败', e)
  }
})

function goHome() {
  router.push('/home')
}

function goExpert(id) {
  router.push(`/expert/${id || 'chen-wei'}`)
}
</script>

<template>
  <div class="academic-page">
    <div class="main-container">
      <!-- 左侧：人才队伍 -->
      <div class="team-section">
        <h2 class="section-title">人才队伍</h2>
        <p class="section-subtitle">核心科研力量</p>
        <div class="team-cards">
          <div
            v-for="member in teamList"
            :key="member.id"
            class="team-card"
            role="link"
            tabindex="0"
            @click="goExpert(member.id)"
            @keydown.enter="goExpert(member.id)"
          >
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

      <!-- 中间：不规则分布的竹简词云 -->
      <div class="wordcloud-section">
        <div class="wordcloud-wrapper">
          <div
            v-for="(word, index) in wordCloud"
            :key="index"
            class="word-rect"
            :style="{
              top: word.top,
              left: word.left,
              height: word.height,
              width: word.width,
              fontSize: word.fontSize,
              zIndex: word.zIndex,
              '--target-opacity': word.opacity,
              '--float-delay': word.floatDelay,
              '--entrance-delay': word.entranceDelay
            }"
          >
            <img src="@/assets/images/backgrounds/academic/bamboo-slip.svg" class="word-bg" alt="" />
            <span class="word-text">{{ word.text }}</span>
          </div>
        </div>
        
        <!-- 新增：中间底部的渐变遮罩与查看更多按钮 -->
        <div class="bottom-fade-mask">
          <div class="more-btn" @click="$router.push('/academic-news')">
            <div class="more-text">查看更多研究成果</div>
            <div class="more-icon-box">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 6.5L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：获批课题 -->
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

    <button class="btn-back" @click="goHome">返回首页</button>
  </div>
</template>

<style scoped>
/* =========== 基础布局样式 =========== */
.academic-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 53px);
  overflow: hidden;
  background-color: var(--bg-page, #f8f5f0);
  background-image:
    linear-gradient(rgba(220, 210, 190, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220, 210, 190, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
  color: var(--color-text, #333);
  padding: 24px 40px 80px;
}

.main-container {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  gap: 20px;
  align-items: flex-start;
  /* 固定主容器高度 */
  height: calc(100vh - 150px);
}

.section-title {
  font-size: 20px;
  color: var(--color-primary, #842130);
  font-weight: bold;
  margin-bottom: 8px;
  position: relative;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 24px;
}

/* =========== 左侧：人才队伍 =========== */
.team-section {
  /* 严格固定高度，防止弹性撑大 */
  height: 100%;
  overflow-y: auto;
  direction: rtl;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary, #842130) transparent;
  padding-left: 8px;
  padding-right: 20px;
}
.team-section > * { direction: ltr; }
.team-section::-webkit-scrollbar { width: 4px; }
.team-section::-webkit-scrollbar-track { background: transparent; }
.team-section::-webkit-scrollbar-thumb {
  background-color: var(--color-primary, #842130);
  border-radius: 2px;
}

/* 去除 flex，使用传统的 block 布局 */
.team-cards { 
  display: block; 
}
.team-card {
  background-color: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex; /* 卡片内部保留弹性排版 */
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px; /* 替代原来的 gap */
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.team-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(132, 33, 48, 0.1); }
.avatar { width: 48px; height: 48px; border-radius: 4px; background-color: #e8e3d8; overflow: hidden; flex-shrink: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.card-info { flex: 1; }
.name { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 4px; }
.title { font-size: 12px; color: #999; margin-bottom: 8px; }
.desc { font-size: 12px; color: #666; line-height: 1.5; }

/* =========== 中间：竹简词云 =========== */
.wordcloud-section {
  /* 固定高度，为底部遮罩留出相对定位空间 */
  height: 100%;
  position: relative; 
  display: block; /* 移除 flex */
}

.wordcloud-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  /* 使用 mask-image 实现内部竹简淡出，且绝对不会遮挡背景网格 */
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 95%);
  mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 95%);
}

/* 动效：水墨显影入场与呼吸悬浮 */
@keyframes slip-entrance {
  0% { 
    opacity: 0; 
    transform: translateY(-40px); 
    filter: blur(8px); 
  }
  100% { 
    opacity: var(--target-opacity); 
    transform: translateY(0); 
    filter: blur(0); 
  }
}
@keyframes slip-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.word-rect {
  position: absolute;
  writing-mode: vertical-rl;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary, #842130);
  font-weight: bold;
  letter-spacing: 6px;
  cursor: pointer;
  opacity: var(--target-opacity); /* 绑定目标透明度变量 */
  
  animation: 
    slip-entrance 1.5s cubic-bezier(0.25, 0.8, 0.25, 1) both,
    slip-float 6s ease-in-out infinite alternate;
  animation-delay: var(--entrance-delay), calc(1.5s + var(--float-delay));
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  -webkit-mask-image: linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%);
  mask-image: linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%);
}

.word-rect:hover {
  animation-play-state: paused, paused;
  transform: scale(1.1) !important;
  opacity: 1 !important;
  z-index: 99 !important;
  filter: drop-shadow(4px 4px 12px rgba(132, 33, 48, 0.3));
  -webkit-mask-image: none;
  mask-image: none;
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
  padding: 10% 0;
  font-family: "TengXiangFanXiaoGeJianDu", "STKaiti", "SimSun", serif;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.4);
  max-height: 90%;
  overflow: hidden;
  pointer-events: none;
}

/* 底部按钮包裹区域 (已移除原来的背景渐变色，仅作定位使用) */
.bottom-fade-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
  z-index: 50; /* 层级高于大部分词云 */
  pointer-events: none; /* 让鼠标透过区域正常点击后方词云 */
}

.more-btn {
  pointer-events: auto; /* 恢复按钮本身的点击响应 */
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.more-text {
  font-size: 20px;
  color: var(--color-primary, #842130);
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 12px;
  font-family: "STKaiti", "SimSun", serif;
}

.more-icon-box {
  width: 36px;
  height: 32px;
  border-radius: 6px;
  background-color: rgba(132, 33, 48, 0.08);
  border: 1px solid rgba(132, 33, 48, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary, #842130);
  transition: all 0.3s ease;
}

.more-btn:hover .more-icon-box {
  background-color: rgba(132, 33, 48, 0.15);
  transform: translateY(4px); /* 悬浮时下压反馈 */
}

/* =========== 右侧：获批课题 =========== */
.project-section {
  /* 严格固定高度 */
  height: 100%;
  overflow-y: auto;
  text-align: right;
  padding-left: 8px;
  padding-right: 20px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary, #842130) transparent;
}
.project-section::-webkit-scrollbar { width: 4px; }
.project-section::-webkit-scrollbar-track { background: transparent; }
.project-section::-webkit-scrollbar-thumb {
  background-color: var(--color-primary, #842130);
  border-radius: 2px;
}

/* 去除 flex */
.project-list { 
  display: block; 
}
.project-item { 
  margin-bottom: 24px; 
  transition: opacity 0.2s; 
  cursor: pointer; 
}
.project-item:hover { opacity: 0.8; }
.project-tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: rgba(132, 33, 48, 0.08);
  color: var(--color-primary, #842130);
  font-size: 10px;
  border-radius: 2px;
  margin-bottom: 8px;
  text-transform: uppercase; /* 根据图示全大写 */
}
.project-title { font-size: 16px; color: #333; line-height: 1.4; font-family: serif; }
.project-meta { font-size: 12px; color: #999; margin-top: 6px; }

.view-all-btn {
  width: 50px;
  height: 50px;
  background-color: rgba(132, 33, 48, 0.05);
  border: 1px solid rgba(132, 33, 48, 0.2);
  color: var(--color-primary, #842130);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto;
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
}
.view-all-btn:hover { background-color: rgba(132, 33, 48, 0.15); }

.btn-back {
  position: fixed;
  bottom: 24px;
  right: 40px;
  z-index: 100;
  padding: 8px 16px;
  background: var(--color-primary, #842130);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(132,33,48,0.3);
  transition: background-color 0.2s ease;
}
.btn-back:hover { background: #a32a3d; }
</style>