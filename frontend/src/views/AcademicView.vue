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
const fallbackWords = [
  '天回医简',
  '脉书',
  '简帛医书',
  '中医药',
  '三世医学',
  '黄帝内经',
  '生成式人工智能',
  '川派中医',
  '多模态',
  '知识图谱',
  '高质量数据集',
  '中医药AI模型',
  '数字人文',
  '知识库',
  '特藏文献',
  '文物保护',
  '中医生命伦理',
  '非物质文化遗产',
  '中华优秀传统文化',
  '深度学习',
  '中医古籍著录规则'
]

const fallbackProjectList = [
  { tag: 'NATIONAL NATURAL SCIENCE FOUNDATION', title: 'Multi-modal AI Analysis for Ancient TCM Manuscripts', meta: 'PI: Dr. Zhou Ming · ¥2.4M' },
  { tag: 'STATE KEY LABORATORY FUND', title: 'Digital Reconstruction of the Song Dynasty Bronze Figure', meta: 'PI: Prof. Zhang Hua · ¥1.8M' },
  { tag: 'PROVINCIAL HEALTH GRANT', title: 'Metabolomics in Herb-Drug Interaction Studies', meta: 'PI: Dr. Sun Qian · ¥0.9M' },
  { tag: 'INSTITUTIONAL CORE FUND', title: 'Machine Learning for Pulse Pattern Recognition', meta: 'PI: Researcher Liu · ¥1.2M' },
  { tag: 'INSTITUTIONAL CORE FUND', title: 'Machine Learning for Pulse Pattern Recognition', meta: 'PI: Researcher Liu · ¥1.2M' },
]

// 固定中心点槽位：每根竹简优先占一个横向位置，避免 X 轴重叠
const bambooLayoutSlots = [
  { left: 50, bottom: 44, depthBias: 18 },
  { left: 39, bottom: 57, depthBias: 8 },
  { left: 61, bottom: 54, depthBias: 8 },
  { left: 32, bottom: 34, depthBias: -6 },
  { left: 68, bottom: 35, depthBias: -6 },
  { left: 25, bottom: 64, depthBias: -28 },
  { left: 75, bottom: 62, depthBias: -28 },
  { left: 18, bottom: 23, depthBias: -42 },
  { left: 82, bottom: 24, depthBias: -42 },
  { left: 43, bottom: 15, depthBias: -14 },
  { left: 57, bottom: 18, depthBias: -16 },
  { left: 12, bottom: 46, depthBias: -52 },
  { left: 88, bottom: 46, depthBias: -52 },
  { left: 29, bottom: 8, depthBias: -58 },
  { left: 71, bottom: 9, depthBias: -58 },
  { left: 22, bottom: 52, depthBias: -68 },
  { left: 78, bottom: 51, depthBias: -68 },
  { left: 36, bottom: 25, depthBias: -44 },
  { left: 64, bottom: 24, depthBias: -44 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * 水平分轨错落算法 (复刻设计图的竹简散落美学)
 */
const createWordCloud = (words) => {
  const MAX_WORDS = bambooLayoutSlots.length
  const MIN_DEPTH = -90
  const MAX_DEPTH = 90
  const displayWords = words.slice(0, MAX_WORDS)
  const totalWords = displayWords.length
  
  if (totalWords === 0) return []

  // 1. 权重分布 (0.0 到 1.0)
  let wordsWithWeight = displayWords.map((word) => {
    let text = typeof word === 'string' ? word : word.text
    let weight = typeof word === 'object' && word.weight ? word.weight / 100 : null
    return { text, weight }
  })

  const hasManualWeights = wordsWithWeight[0].weight !== null

  if (!hasManualWeights) {
    wordsWithWeight = wordsWithWeight.map((w, i) => {
      const normalized = totalWords === 1 ? 1 : 1 - (i / (totalWords - 1))
      w.weight = normalized * 0.9 + 0.1
      return w
    })
  } else {
    const weights = wordsWithWeight.map(w => w.weight)
    const minW = Math.min(...weights)
    const maxW = Math.max(...weights)
    const range = maxW - minW || 1
    wordsWithWeight = wordsWithWeight.map(w => {
      w.weight = ((w.weight - minW) / range) * 0.9 + 0.1
      return w
    })
  }

  // 按权重严格降序
  wordsWithWeight.sort((a, b) => b.weight - a.weight)

  return wordsWithWeight.map((wordObj, i) => {
    const { text, weight } = wordObj
    const slot = bambooLayoutSlots[i]
    
    const charCount = text.length
    // --- 视觉特征映射 ---
    const baseFontSize = Math.max(12, 10 + weight * 22)
    // 高度根据字数决定，每个字占 fontSize * 2，再加上下内边距
    const baseHeight = charCount * (baseFontSize * 2) + 24
    // 宽度随高度增长但长词比例更高，竹简更修长
    const baseWidth = Math.max(10, baseHeight / (3.5 + charCount * 0.55))
    const baseOpacity = 0.14 + weight * 0.86

    const leftPct = slot.left
    // 整体纵向分布区间向下压缩收紧，把原本 8~64 映射到 11~53，自然避开天花板
    const bottomPct = slot.bottom * 0.75 + 5
    const centerBias = 1 - Math.abs(leftPct - 50) / 40
    const depth = clamp(Math.round(-72 + weight * 130 + centerBias * 16 + slot.depthBias), MIN_DEPTH, MAX_DEPTH)
    const depthRatio = clamp((depth - MIN_DEPTH) / (MAX_DEPTH - MIN_DEPTH), 0, 1)

    const sizeScale = 0.72 + depthRatio * 0.27
    const height = Math.floor(baseHeight * sizeScale)
    const width = Math.floor(baseWidth * sizeScale)
    const fontSize = Math.floor(baseFontSize * sizeScale)
    const opacity = clamp(baseOpacity * (0.48 + depthRatio * 0.52), 0.1, 1).toFixed(2)
    const zIndex = Math.floor(depthRatio * 12) + 1

    const tiltY = clamp(((leftPct - 50) / 50) * 3.8, -3.8, 3.8)
    const tiltX = clamp(((32 - bottomPct) / 32) * 2.6, -2.6, 2.6)

    const floatDelay = `${((i % 5) * 0.35).toFixed(2)}s`
    const entranceDelay = `${(i * 0.08).toFixed(2)}s`

    return {
      text, 
      left: `clamp(calc(${width}px / 2 + 16px), ${leftPct}%, calc(100% - ${width}px / 2 - 16px))`, 
      bottom: `clamp(70px, ${bottomPct}%, calc(100% - ${height}px))`, 
      height: `${height}px`, 
      width: `${width}px`, 
      fontSize: `${fontSize}px`, 
      opacity, zIndex, floatDelay, entranceDelay,
      depth: `${depth}px`,
      tiltX: `${tiltX.toFixed(2)}deg`,
      tiltY: `${tiltY.toFixed(2)}deg`
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
      desc: t.summary || t.description || t.researchAreas?.join('、') || t.researchArea || '',
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
    const projectRes = await fetchProjects({ pageNum: 1, pageSize: 50 })
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
            <div class="member-main">
              <div class="member-profile">
                <div class="avatar">
                  <img :src="member.avatar" :alt="member.name" />
                </div>
              </div>
              <div class="card-info">
                <div class="name">{{ member.name }}</div>
                <div class="title">{{ member.title }}</div>
              </div>
            </div>
            <div class="member-intro">{{ member.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 中间：专业算法分布的竹简词云 -->
      <div class="wordcloud-section">
        <div class="wordcloud-wrapper">
          <div
            v-for="(word, index) in wordCloud"
            :key="index"
            class="word-rect"
            :style="{
              bottom: word.bottom,
              left: word.left,
              height: word.height,
              width: word.width,
              fontSize: word.fontSize,
              zIndex: word.zIndex,
              '--target-opacity': word.opacity,
              '--float-delay': word.floatDelay,
              '--entrance-delay': word.entranceDelay,
              '--depth': word.depth,
              '--tilt-x': word.tiltX,
              '--tilt-y': word.tiltY
            }"
          >
            <div class="word-rect-inner">
              <img src="@/assets/images/backgrounds/academic/bamboo-slip.svg" class="word-bg" alt="" />
              <span class="word-text">{{ word.text }}</span>
            </div>
          </div>
        </div>
        
        <!-- 中间底部的渐变遮罩与查看更多按钮 -->
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
            <div class="project-title">
              <span class="project-title-main">{{ project.title }}</span>
              <span class="project-title-sub">{{ project.tag }}</span>
            </div>
            <div class="project-meta">{{ project.meta }}</div>
          </div>
        </div>
        <router-link class="view-all-btn" :to="{ path: '/achievements', query: { tab: 'topics' } }">
          <span>查看</span>
          <span>全部</span>
        </router-link>
      </div>
    </div>

    <button class="btn-back return-action return-action--home" @click="goHome">返回首页</button>
  </div>
</template>

<style scoped>
/* =========== 基础布局样式 =========== */
.academic-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 53px);
  overflow: hidden;
  background: url('@/assets/images/backgrounds/mult-page/page-bg.png') center center / cover fixed;
  color: var(--color-text, #333);
  padding: 24px 40px 80px;
}

.main-container {
  display: grid;
  grid-template-columns: 23% 54% 23%;
  gap: 20px;
  align-items: flex-start;
  height: calc(100vh - 150px);
}

.section-title {
  font-size: 20px;
  color: var(--color-primary, #842130);
  font-weight: bold;
  margin-bottom: 8px;
  position: relative;
  
  /* 强制去除可能从全局继承的左侧竖线和内边距 */
  border-left: none !important;
  padding-left: 0 !important;
}

/* 强力覆盖：清除可能用于绘制竖线的伪元素 */
.section-title::before,
.section-title::after {
  display: none !important;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 24px;
}

/* =========== 左侧：人才队伍 =========== */
.team-section {
  height: 100%;
  overflow-y: auto;
  direction: rtl;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary, #842130) transparent;
  padding-left: 20px;
  padding-right: 8px;
}
.team-section > * { direction: ltr; }
.team-section::-webkit-scrollbar { width: 2px; }
.team-section::-webkit-scrollbar-button { display: none; }
.team-section::-webkit-scrollbar-track {
  background: transparent;
  margin: 150px 0;
}
.team-section::-webkit-scrollbar-thumb {
  background-color: var(--color-primary, #842130);
  border-radius: 1px;
}

.team-cards { 
  display: block; 
}
.team-card {
  background-color: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px; 
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.team-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(132, 33, 48, 0.1); }
.member-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.member-profile { width: 48px; flex-shrink: 0; }
.avatar { width: 48px; height: 48px; border-radius: 4px; background-color: #e8e3d8; overflow: hidden; margin: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.member-intro {
  display: -webkit-box;
  overflow: hidden;
  color: #666;
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.card-info { flex: 1; }
.name { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 4px; }
.title { font-size: 12px; color: #999; margin-bottom: 8px; }
.desc { font-size: 12px; color: #666; line-height: 1.5; }

/* =========== 中间：竹简词云 =========== */
.wordcloud-section {
  height: 100%;
  position: relative; 
  display: block; 
  overflow: hidden;
}

.wordcloud-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  perspective: 1800px;
  perspective-origin: 50% 45%;
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 95%);
  mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 95%);
}

@keyframes slip-entrance {
  0% { 
    opacity: 0; 
    transform: translateY(80px); 
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
  50% { transform: translateY(-8px); }
}

.word-rect {
  position: absolute;
  transform: translateX(-50%) translateZ(var(--depth)) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transform-style: preserve-3d;
  transform-origin: center center;
  overflow: hidden;
  cursor: pointer;
  animation:
    slip-entrance 1.5s cubic-bezier(0.25, 0.8, 0.25, 1) both;
  animation-delay: var(--entrance-delay);
}

.word-rect-inner {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  writing-mode: vertical-rl;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--color-primary, #842130);
  font-weight: bold;
  letter-spacing: 6px;
  opacity: var(--target-opacity); 
  
  filter: 
    drop-shadow(3px 5px 4px rgba(0, 0, 0, 0.18))
    drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.10));
  
  animation: 
    slip-float 6s ease-in-out infinite alternate;
  animation-delay: calc(1.5s + var(--float-delay));
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  -webkit-mask-image: linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%);
  mask-image: linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%);
}

.word-rect:hover {
  z-index: 99 !important;
  animation-play-state: paused;
}

.word-rect:hover .word-rect-inner {
  animation-play-state: paused;
  transform: scale(1.03) translateY(-2px) !important;
  opacity: 1 !important;
  filter: drop-shadow(6px 10px 16px rgba(132, 33, 48, 0.35)) drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.25));
  -webkit-mask-image: none;
  mask-image: none;
}

.word-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.word-text {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 10% 0;
  font-family: "TengXiangFanXiaoGeJianDu", "STKaiti", "SimSun", serif;
  font-weight: 500;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.4);
  max-height: 100%;
  white-space: nowrap;
  overflow: hidden;
  pointer-events: none;
  transform: scaleX(0.76);
  transform-origin: center center;
}

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
  z-index: 50; 
  pointer-events: none; 
}

.more-btn {
  pointer-events: auto; 
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
  transform: translateY(4px); 
}

/* =========== 右侧：获批课题 =========== */
.project-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 8px;
  padding-right: 20px;
  position: relative;
}

.project-section > .section-title,
.project-section > .section-subtitle {
  text-align: right;
  flex-shrink: 0;
}

/* 让列表承接滚动能力，撑开中间区域 */
.project-list { 
  flex: 1 1 0;
  min-height: 0;
  max-height: calc(100% - 188px);
  overflow-y: auto;
  scrollbar-width: none;
  padding-right: 4px;
}
.project-list::-webkit-scrollbar { display: none; }

.project-item { 
  margin-bottom: 24px; 
  transition: opacity 0.2s; 
  cursor: pointer; 
}
.project-item:hover { opacity: 0.8; }
.project-title { font-size: 16px; color: #333; font-family: serif; }
.project-title-main {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-align: left;
  line-height: 1.4;
  word-break: break-all;
}
.project-title-sub { display: inline-block; text-align: left; line-height: 1.4; margin-top: 4px; font-size: 11px; color: var(--color-primary, #842130); background-color: rgba(132, 33, 48, 0.08); padding: 3px 8px; border-radius: 2px; }
.project-meta { font-size: 12px; color: #999; margin-top: 6px; }

.view-all-btn {
  position: absolute;
  bottom: 0;
  right: 20px;
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
  font-size: 12px;
  font-weight: bold;
  line-height: 1.35;
  text-decoration: none;
  transition: all 0.2s ease;
}
.view-all-btn:hover { background-color: rgba(132, 33, 48, 0.15); }

.btn-back {
  position: fixed;
  bottom: 24px;
  right: 40px;
  z-index: 100;
}
</style>
