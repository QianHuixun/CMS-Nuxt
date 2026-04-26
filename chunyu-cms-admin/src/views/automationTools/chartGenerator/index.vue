<template>
  <div class="app-container">
    <el-card shadow="never" class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-main">
          <div class="toolbar-title">历年论文数量统计</div>
          <div class="toolbar-desc">数据来自论文数据导入中的 publishYear，用于展示各年份论文数量变化趋势。</div>
        </div>
        <div class="toolbar-actions">
          <el-button :loading="loading" icon="Refresh" @click="loadStatistics">刷新图表</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16" class="mt16">
      <el-col :span="24">
        <el-card shadow="never" class="chart-card" v-loading="loading">
          <template #header>
            <div class="card-header">
              <span>历年论文数量折线图</span>
              <span class="card-meta">{{ statisticsList.length }} 个年份</span>
            </div>
          </template>

          <el-empty v-if="!statisticsList.length" description="暂无论文年度统计数据" />
          <div v-else ref="chartRef" class="line-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt16">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>统计明细</span>
              <span class="card-meta">年份 / 论文数量</span>
            </div>
          </template>

          <el-empty v-if="!statisticsList.length" description="暂无统计明细" />
          <el-table v-else :data="statisticsList" size="small">
            <el-table-column prop="year" label="年份" min-width="180" align="center" />
            <el-table-column prop="count" label="论文数量" min-width="180" align="center" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="AutomationToolsChartGeneratorIndex">
import * as echarts from 'echarts'
import { getPaperYearlyCountStatistics } from '@/api/automationTools/chartGenerator'
import { buildYearlyCountLineOption, normalizeYearlyStatisticsList } from './utils'

const chartRef = ref(null)
const chartInstance = shallowRef(null)
const loading = ref(false)
const statisticsList = ref([])

onMounted(async () => {
  await loadStatistics()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  disposeChart()
})

async function loadStatistics() {
  loading.value = true
  try {
    const res = await getPaperYearlyCountStatistics()
    statisticsList.value = normalizeYearlyStatisticsList(res.data?.list || [])
    renderChart()
  } finally {
    loading.value = false
  }
}

function renderChart() {
  nextTick(() => {
    if (!statisticsList.value.length) {
      disposeChart()
      return
    }

    if (!chartRef.value) {
      return
    }

    if (!chartInstance.value) {
      chartInstance.value = echarts.init(chartRef.value)
      window.addEventListener('resize', handleResize)
    }

    chartInstance.value.setOption(buildYearlyCountLineOption(statisticsList.value))
  })
}

function handleResize() {
  chartInstance.value?.resize()
}

function disposeChart() {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
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
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-meta {
  font-size: 13px;
  color: #6b7280;
}

.line-chart {
  height: 420px;
}
</style>
