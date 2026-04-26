<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="24">
        <el-card shadow="never" class="toolbar-card">
          <div class="toolbar">
            <div class="toolbar-main">
              <div class="toolbar-title">论文词云</div>
              <div class="toolbar-desc">支持全部论文关键词汇总展示，以及单篇论文关键词权重人工维护。</div>
            </div>
            <div class="toolbar-actions">
              <el-radio-group v-model="currentMode" @change="handleModeChange">
                <el-radio-button label="all">全部论文</el-radio-button>
                <el-radio-button label="paper">单篇论文</el-radio-button>
              </el-radio-group>
              <el-select
                v-if="currentMode === 'paper'"
                v-model="selectedPaperId"
                placeholder="请选择论文"
                filterable
                clearable
                class="paper-select"
                @change="handlePaperChange"
              >
                <el-option
                  v-for="paper in paperOptions"
                  :key="paper.paperId"
                  :label="paper.title"
                  :value="paper.paperId"
                />
              </el-select>
              <el-button icon="Refresh" @click="handleRefresh">刷新</el-button>
              <el-button
                v-if="currentMode === 'paper'"
                type="primary"
                :disabled="!selectedPaperId || !editableKeywords.length"
                :loading="saveLoading"
                @click="handleSaveKeywords"
              >
                保存权重
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt16">
      <el-col :span="15">
        <el-card shadow="never" class="chart-card" v-loading="previewLoading">
          <template #header>
            <div class="card-header">
              <span>{{ currentMode === 'all' ? '全部论文词云' : '单篇论文词云' }}</span>
              <span class="card-meta">{{ activeWordCount }} 个关键词</span>
            </div>
          </template>

          <el-empty v-if="!activeWordCount" description="暂无词云数据" />
          <div v-else ref="chartRef" class="word-cloud-chart"></div>
        </el-card>
      </el-col>

      <el-col :span="9">
        <el-card shadow="never" class="detail-card" v-loading="detailLoading">
          <template #header>
            <div class="card-header">
              <span>关键词权重</span>
              <span v-if="currentMode === 'paper' && selectedPaper.title" class="paper-title">{{ selectedPaper.title }}</span>
            </div>
          </template>

          <div v-if="currentMode === 'paper' && selectedPaper.abstract" class="paper-abstract">
            {{ selectedPaper.abstract }}
          </div>

          <el-empty
            v-if="currentMode === 'paper' && !selectedPaperId"
            description="请选择一篇论文查看关键词"
          />

          <el-empty
            v-else-if="currentMode === 'paper' && !editableKeywords.length"
            description="当前论文暂无关键词"
          />

          <el-table
            v-else-if="currentMode === 'paper'"
            :data="editableKeywords"
            size="small"
            max-height="520"
          >
            <el-table-column prop="keyword" label="关键词" min-width="160" show-overflow-tooltip />
            <el-table-column prop="source" label="来源" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="row.source === '0' ? 'success' : 'info'">
                  {{ sourceLabelMap[row.source] || '未知' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="权重" width="140" align="center">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.weight"
                  :min="1"
                  :max="999"
                  controls-position="right"
                  @change="handleWeightChange"
                />
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-else
            :data="allCloudKeywords"
            size="small"
            max-height="520"
          >
            <el-table-column prop="keyword" label="关键词" min-width="160" show-overflow-tooltip />
            <el-table-column prop="weight" label="聚合权重" width="120" align="center" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="AutomationToolsWordCloudIndex">
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { ElMessage } from 'element-plus'
import { getPaperKeywordCloud, getPaperKeywords, listPapers, updatePaperKeywords } from '@/api/automationTools/wordCloud'
import { buildKeywordSavePayload, mapKeywordsToWordCloudData } from './utils'

const chartRef = ref(null)
const chartInstance = shallowRef(null)
const currentMode = ref('all')
const previewLoading = ref(false)
const detailLoading = ref(false)
const saveLoading = ref(false)
const paperOptions = ref([])
const selectedPaperId = ref(undefined)
const selectedPaper = ref({ paperId: undefined, title: '', abstract: '' })
const editableKeywords = ref([])
const allCloudKeywords = ref([])

const sourceLabelMap = {
  '0': '人工',
  '1': '摘要',
  '2': '导入'
}

const activeWordCount = computed(() => {
  return currentMode.value === 'all' ? allCloudKeywords.value.length : editableKeywords.value.length
})

onMounted(async () => {
  await loadAllCloud()
  initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})

async function handleModeChange(mode) {
  currentMode.value = mode

  if (mode === 'paper') {
    await ensurePaperOptions()
    if (selectedPaperId.value) {
      await loadPaperKeywords(selectedPaperId.value)
    } else {
      editableKeywords.value = []
      selectedPaper.value = { paperId: undefined, title: '', abstract: '' }
      renderWordCloud([])
    }
    return
  }

  renderWordCloud(allCloudKeywords.value)
}

async function handlePaperChange(paperId) {
  if (!paperId) {
    selectedPaper.value = { paperId: undefined, title: '', abstract: '' }
    editableKeywords.value = []
    renderWordCloud([])
    return
  }

  await loadPaperKeywords(paperId)
}

async function handleRefresh() {
  if (currentMode.value === 'paper' && selectedPaperId.value) {
    await loadPaperKeywords(selectedPaperId.value)
    return
  }

  await loadAllCloud()
}

async function handleSaveKeywords() {
  if (!selectedPaperId.value) {
    ElMessage.warning('请先选择论文')
    return
  }

  saveLoading.value = true
  try {
    await updatePaperKeywords(selectedPaperId.value, buildKeywordSavePayload(editableKeywords.value))
    ElMessage.success('关键词权重已保存')
    await loadPaperKeywords(selectedPaperId.value)
    await loadAllCloud(false)
  } finally {
    saveLoading.value = false
  }
}

function handleWeightChange() {
  if (currentMode.value === 'paper') {
    renderWordCloud(editableKeywords.value)
  }
}

async function ensurePaperOptions() {
  if (paperOptions.value.length > 0) {
    return
  }

  const res = await listPapers()
  paperOptions.value = res.data?.rows || []
}

async function loadAllCloud(showLoading = true) {
  previewLoading.value = showLoading
  try {
    const res = await getPaperKeywordCloud()
    allCloudKeywords.value = res.data?.keywords || []
    if (currentMode.value === 'all') {
      renderWordCloud(allCloudKeywords.value)
    }
  } finally {
    previewLoading.value = false
  }
}

async function loadPaperKeywords(paperId) {
  detailLoading.value = true
  previewLoading.value = true
  try {
    const res = await getPaperKeywords(paperId)
    selectedPaper.value = {
      paperId: res.data?.paperId,
      title: res.data?.paperTitle || '',
      abstract: res.data?.abstract || ''
    }
    editableKeywords.value = (res.data?.keywords || []).map(item => ({
      id: item.id ?? null,
      keyword: item.keyword,
      weight: item.weight,
      source: item.source || '0'
    }))
    renderWordCloud(editableKeywords.value)
  } finally {
    detailLoading.value = false
    previewLoading.value = false
  }
}

function initChart() {
  if (!chartRef.value || chartInstance.value) {
    return
  }

  chartInstance.value = echarts.init(chartRef.value)
  renderWordCloud(currentMode.value === 'all' ? allCloudKeywords.value : editableKeywords.value)
  window.addEventListener('resize', handleResize)
}

function handleResize() {
  chartInstance.value?.resize()
}

function renderWordCloud(rows) {
  nextTick(() => {
    if (!chartRef.value) {
      return
    }

    if (!chartInstance.value) {
      chartInstance.value = echarts.init(chartRef.value)
      window.addEventListener('resize', handleResize)
    }

    const data = mapKeywordsToWordCloudData(rows)
    chartInstance.value.setOption({
      backgroundColor: '#ffffff',
      tooltip: {
        trigger: 'item',
        formatter: params => `${params.name}: ${params.value}`
      },
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',
          sizeRange: [18, 64],
          rotationRange: [-15, 15],
          rotationStep: 15,
          gridSize: 10,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color() {
              const palette = ['#14532d', '#0f766e', '#0369a1', '#7c2d12', '#7f1d1d']
              return palette[Math.floor(Math.random() * palette.length)]
            }
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.25)'
            }
          },
          data
        }
      ]
    })
  })
}
</script>

<style lang="scss" scoped>
.mt16 {
  margin-top: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-main {
  min-width: 280px;
}

.toolbar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.toolbar-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.paper-select {
  width: 320px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-meta,
.paper-title {
  font-size: 13px;
  color: #6b7280;
}

.paper-abstract {
  margin-bottom: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f6f8fa;
  color: #4b5563;
  line-height: 1.6;
  font-size: 13px;
}

.word-cloud-chart {
  height: 520px;
}
</style>
