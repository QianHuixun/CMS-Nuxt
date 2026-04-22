<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 左侧：配置区域 -->
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>图表配置</span>
            </div>
          </template>

          <el-form label-width="90px">
            <el-form-item label="图表类型">
              <el-select v-model="form.chartType" placeholder="请选择图表类型" style="width: 100%">
                <el-option label="柱状图" value="bar">
                  <el-icon><Histogram /></el-icon> 柱状图
                </el-option>
                <el-option label="折线图" value="line">
                  <el-icon><TrendCharts /></el-icon> 折线图
                </el-option>
                <el-option label="饼图" value="pie">
                  <el-icon><PieChart /></el-icon> 饼图
                </el-option>
                <el-option label="环形图" value="doughnut">
                  <el-icon><DataAnalysis /></el-icon> 环形图
                </el-option>
                <el-option label="雷达图" value="radar">
                  <el-icon><Odometer /></el-icon> 雷达图
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="图表标题">
              <el-input v-model="form.title" placeholder="请输入图表标题" />
            </el-form-item>

            <el-form-item label="数据来源">
              <el-radio-group v-model="form.dataSource" @change="handleDataSourceChange">
                <el-radio label="manual">手动输入</el-radio>
                <el-radio label="api">API接口</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="数据配置" v-if="form.dataSource === 'manual'">
              <div class="data-input-area">
                <el-input
                  v-model="form.chartData"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入JSON格式数据，如：
[
  { name: '类别1', value: 120 },
  { name: '类别2', value: 200 },
  { name: '类别3', value: 150 }
]"
                />
              </div>
            </el-form-item>

            <el-form-item label="API地址" v-if="form.dataSource === 'api'">
              <el-input v-model="form.apiUrl" placeholder="请输入API接口地址" />
            </el-form-item>

            <el-form-item label="配色方案">
              <el-color-picker v-model="form.color1" show-alpha />
              <el-color-picker v-model="form.color2" show-alpha />
              <el-color-picker v-model="form.color3" show-alpha />
            </el-form-item>

            <el-form-item label="显示图例">
              <el-switch v-model="form.showLegend" />
            </el-form-item>

            <el-form-item label="显示标签">
              <el-switch v-model="form.showLabel" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="Refresh" @click="handleGenerate">生成图表</el-button>
              <el-button icon="Download" @click="handleExport">导出</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 快捷模板 -->
        <el-card shadow="never" class="mt16">
          <template #header>
            <span>快捷模板</span>
          </template>
          <el-space wrap>
            <el-button size="small" @click="applyTemplate('monthly')">月度统计</el-button>
            <el-button size="small" @click="applyTemplate('quarter')">季度对比</el-button>
            <el-button size="small" @click="applyTemplate('category')">分类占比</el-button>
            <el-button size="small" @click="applyTemplate('performance')">绩效评估</el-button>
          </el-space>
        </el-card>
      </el-col>

      <!-- 右侧：预览区域 -->
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>图表预览</span>
              <el-space>
                <el-button size="small" icon="ZoomIn" @click="handleZoomIn">放大</el-button>
                <el-button size="small" icon="ZoomOut" @click="handleZoomOut">缩小</el-button>
                <el-button type="primary" size="small" icon="FullScreen" @click="handleFullScreen">全屏</el-button>
              </el-space>
            </div>
          </template>

          <div class="preview-container" :style="{ transform: `scale(${zoomLevel})` }">
            <el-empty v-if="!hasGenerated" description="请在左侧配置图表参数后点击「生成图表」">
              <template #image>
                <svg-icon icon-class="chart" class-name="empty-icon" />
              </template>
            </el-empty>
            
            <div v-else class="chart-wrapper">
              <h3 class="chart-title">{{ form.title || '图表预览' }}</h3>
              
              <!-- 模拟图表渲染 -->
              <div class="mock-chart" :class="form.chartType">
                <!-- 柱状图 -->
                <template v-if="form.chartType === 'bar'">
                  <div class="bar-chart">
                    <div v-for="(item, index) in chartData" :key="index" class="bar-item">
                      <div class="bar" :style="{ height: item.value + '%', backgroundColor: item.color }">
                        <span class="bar-value">{{ item.value }}</span>
                      </div>
                      <span class="bar-label">{{ item.name }}</span>
                    </div>
                  </div>
                </template>
                
                <!-- 折线图 -->
                <template v-else-if="form.chartType === 'line'">
                  <div class="line-chart">
                    <svg viewBox="0 0 400 200" class="line-svg">
                      <polyline
                        :points="linePoints"
                        fill="none"
                        stroke="#409EFF"
                        stroke-width="2"
                      />
                      <circle
                        v-for="(point, index) in linePointsArray"
                        :key="index"
                        :cx="point.x"
                        :cy="point.y"
                        r="4"
                        fill="#409EFF"
                      />
                    </svg>
                  </div>
                </template>
                
                <!-- 饼图 -->
                <template v-else-if="form.chartType === 'pie' || form.chartType === 'doughnut'">
                  <div class="pie-chart">
                    <el-progress
                      v-for="(item, index) in chartData"
                      :key="index"
                      type="circle"
                      :percentage="item.value"
                      :color="item.color"
                      :width="form.chartType === 'doughnut' ? 120 : 150"
                    >
                      <template #default>
                        <span class="pie-label">{{ item.name }}</span>
                      </template>
                    </el-progress>
                  </div>
                </template>
                
                <!-- 雷达图 -->
                <template v-else-if="form.chartType === 'radar'">
                  <div class="radar-chart">
                    <el-progress
                      v-for="(item, index) in chartData"
                      :key="index"
                      type="dashboard"
                      :percentage="item.value"
                      :color="item.color"
                      :width="100"
                    >
                      <template #default>
                        <span>{{ item.name }}</span>
                      </template>
                    </el-progress>
                  </div>
                </template>
              </div>
              
              <!-- 图例 -->
              <div v-if="form.showLegend && chartData.length" class="chart-legend">
                <span v-for="(item, index) in chartData" :key="index" class="legend-item">
                  <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                  {{ item.name }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="AutomationToolsChartGeneratorIndex">
import { Histogram, TrendCharts, PieChart, DataAnalysis, Odometer } from '@element-plus/icons-vue'

const hasGenerated = ref(false)
const zoomLevel = ref(1)
const chartData = ref([])
const linePoints = ref('')
const linePointsArray = ref([])

const form = ref({
  chartType: 'bar',
  title: '中医药数据统计',
  dataSource: 'manual',
  chartData: '[{ "name": "中医科", "value": 45 }, { "name": "中药科", "value": 30 }, { "name": "针灸科", "value": 25 }]',
  apiUrl: '',
  color1: '#409EFF',
  color2: '#67C23A',
  color3: '#E6A23C',
  showLegend: true,
  showLabel: true
})

const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#00CED1', '#7C3AED']

const templates = {
  monthly: {
    title: '月度门诊量统计',
    chartData: JSON.stringify([
      { name: '1月', value: 1200 },
      { name: '2月', value: 980 },
      { name: '3月', value: 1450 },
      { name: '4月', value: 1600 },
      { name: '5月', value: 1380 },
      { name: '6月', value: 1520 }
    ])
  },
  quarter: {
    title: '季度业绩对比',
    chartData: JSON.stringify([
      { name: 'Q1', value: 3500 },
      { name: 'Q2', value: 4200 },
      { name: 'Q3', value: 3800 },
      { name: 'Q4', value: 5100 }
    ])
  },
  category: {
    title: '病种分类占比',
    chartData: JSON.stringify([
      { name: '呼吸系统', value: 30 },
      { name: '消化系统', value: 25 },
      { name: '心脑血管', value: 20 },
      { name: '骨伤科', value: 15 },
      { name: '其他', value: 10 }
    ])
  },
  performance: {
    title: '医师绩效评估',
    chartData: JSON.stringify([
      { name: '专业能力', value: 85 },
      { name: '服务态度', value: 92 },
      { name: '患者满意度', value: 88 },
      { name: '学术研究', value: 76 },
      { name: '团队协作', value: 90 }
    ])
  }
}

function applyTemplate(templateKey) {
  const template = templates[templateKey]
  if (template) {
    form.value.title = template.title
    form.value.chartData = template.chartData
    ElMessage.success(`已应用「${template.title}」模板`)
  }
}

function handleDataSourceChange() {
  form.value.chartData = ''
  hasGenerated.value = false
}

function handleGenerate() {
  try {
    const data = JSON.parse(form.value.chartData)
    if (!Array.isArray(data)) {
      throw new Error('数据格式错误')
    }
    
    chartData.value = data.map((item, index) => ({
      ...item,
      color: item.color || colors[index % colors.length]
    }))
    
    // 计算折线图点
    if (form.value.chartType === 'line') {
      const maxValue = Math.max(...chartData.value.map(d => d.value))
      const step = 400 / (chartData.value.length - 1 || 1)
      linePointsArray.value = chartData.value.map((item, index) => ({
        x: index * step,
        y: 200 - (item.value / maxValue) * 180
      }))
      linePoints.value = linePointsArray.value.map(p => `${p.x},${p.y}`).join(' ')
    }
    
    hasGenerated.value = true
    ElMessage.success('图表生成成功')
  } catch (e) {
    ElMessage.error('数据格式错误，请输入有效的JSON数组')
  }
}

function handleZoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 1.5)
}

function handleZoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
}

function handleFullScreen() {
  ElMessage.info('全屏功能开发中')
}

function handleExport() {
  if (!hasGenerated.value) {
    ElMessage.warning('请先生成图表')
    return
  }
  ElMessage.success('图表导出中...')
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt16 {
  margin-top: 16px;
}

.preview-container {
  min-height: 450px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper {
  text-align: center;
}

.chart-title {
  margin-bottom: 20px;
  font-size: 18px;
  color: #303133;
}

.mock-chart {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 柱状图 */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;
  height: 250px;
  padding: 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 50px;
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.3s;
  
  .bar-value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    color: #303133;
  }
}

.bar-label {
  font-size: 12px;
  color: #606266;
}

/* 折线图 */
.line-chart {
  width: 100%;
  max-width: 500px;
}

.line-svg {
  width: 100%;
  height: auto;
}

/* 饼图 */
.pie-chart {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.pie-label {
  font-size: 12px;
  color: #606266;
}

/* 雷达图 */
.radar-chart {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

/* 图例 */
.chart-legend {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #409EFF;
}
</style>
