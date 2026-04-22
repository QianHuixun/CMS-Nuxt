<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 左侧：输入和配置区域 -->
      <el-col :span="10">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>词云生成</span>
              <el-button type="primary" size="small" icon="Refresh" @click="handleGenerate">生成词云</el-button>
            </div>
          </template>

          <!-- 文本输入 -->
          <el-form label-width="100px">
            <el-form-item label="文本内容">
              <el-input
                v-model="form.text"
                type="textarea"
                :rows="8"
                placeholder="请输入要生成词云的文本内容，每行一个词或短语"
              />
            </el-form-item>
            <el-form-item label="或上传文本文件">
              <el-upload
                class="upload-file"
                drag
                action="#"
                :auto-upload="false"
                :limit="1"
                accept=".txt"
              >
                <el-icon class="el-icon--upload"><Upload /></el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                  <div class="el-upload__tip">只能上传 txt 文件</div>
                </template>
              </el-upload>
            </el-form-item>

            <el-divider content-position="left">高级配置</el-divider>

            <el-form-item label="词云形状">
              <el-select v-model="form.shape" placeholder="请选择词云形状" style="width: 100%">
                <el-option label="圆形" value="circle" />
                <el-option label="方形" value="square" />
                <el-option label="心形" value="heart" />
                <el-option label="星形" value="star" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>

            <el-form-item label="配色方案">
              <el-select v-model="form.colorScheme" placeholder="请选择配色方案" style="width: 100%">
                <el-option label="默认" value="default" />
                <el-option label="渐变" value="gradient" />
                <el-option label="中医绿" value="tcmmain" />
                <el-option label="古典红" value="classical" />
                <el-option label="清新蓝" value="fresh" />
              </el-select>
            </el-form-item>

            <el-form-item label="最小词频">
              <el-slider v-model="form.minFreq" :min="1" :max="10" show-stops :marks="freqMarks" />
            </el-form-item>

            <el-form-item label="最大词数">
              <el-input-number v-model="form.maxWords" :min="10" :max="200" />
            </el-form-item>

            <el-form-item label="允许英文">
              <el-switch v-model="form.allowEnglish" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：预览和导出区域 -->
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>词云预览</span>
              <el-space>
                <el-button size="small" icon="ZoomIn" @click="handleZoomIn">放大</el-button>
                <el-button size="small" icon="ZoomOut" @click="handleZoomOut">缩小</el-button>
                <el-button type="primary" size="small" icon="Download" :disabled="!hasGenerated" @click="handleExport">导出图片</el-button>
              </el-space>
            </div>
          </template>

          <div class="preview-area" :style="{ transform: `scale(${zoomLevel})` }">
            <el-empty v-if="!hasGenerated" description="请在左侧输入文本内容后点击「生成词云」">
              <template #image>
                <el-icon :size="80" color="#409EFF"><DataAnalysis /></el-icon>
              </template>
            </el-empty>
            <div v-else class="word-cloud-container">
              <!-- 模拟词云效果 -->
              <div class="mock-word-cloud">
                <span v-for="(word, index) in generatedWords" :key="index" :style="{ fontSize: word.size + 'px', color: word.color, transform: `rotate(${word.rotate}deg)` }">
                  {{ word.text }}
                </span>
              </div>
            </div>
          </div>

          <!-- 词频统计 -->
          <el-divider content-position="left" v-if="hasGenerated">词频统计 Top 10</el-divider>
          <el-table v-if="hasGenerated" :data="wordStats" size="small" max-height="200">
            <el-table-column prop="word" label="词语" width="120" />
            <el-table-column prop="count" label="频次" width="80" align="center" />
            <el-table-column label="占比" min-width="200">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="row.color" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="AutomationToolsWordCloudIndex">
import { Upload } from '@element-plus/icons-vue'
import { DataAnalysis } from '@element-plus/icons-vue'

const hasGenerated = ref(false)
const zoomLevel = ref(1)
const generatedWords = ref([])

const form = ref({
  text: '中医 中药 针灸 推拿 养生 健康 调理 气血 阴阳 五行\n脏腑 经络 脉象 辨证 论治 处方 配伍 炮制 疗效\n望闻问切 标本兼治 未病先防 既病防变 扶正祛邪',
  shape: 'circle',
  colorScheme: 'default',
  minFreq: 1,
  maxWords: 50,
  allowEnglish: false
})

const freqMarks = { 1: '1', 3: '3', 5: '5', 7: '7', 10: '10' }

const colorSchemes = {
  default: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
  gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
  tcmmain: ['#2d5a27', '#4a7c44', '#6b9b63', '#8fc082'],
  classical: ['#8B0000', '#CD5C5C', '#F08080', '#FA8072'],
  fresh: ['#00CED1', '#20B2AA', '#48D1CC', '#40E0D0']
}

const wordStats = ref([
  { word: '中医', count: 15, percentage: 100, color: '#409EFF' },
  { word: '中药', count: 12, percentage: 80, color: '#67C23A' },
  { word: '针灸', count: 10, percentage: 67, color: '#E6A23C' },
  { word: '养生', count: 8, percentage: 53, color: '#F56C6C' },
  { word: '健康', count: 7, percentage: 47, color: '#909399' }
])

function handleGenerate() {
  if (!form.value.text.trim()) {
    ElMessage.warning('请输入文本内容')
    return
  }
  
  ElMessage.success('正在生成词云...')
  
  // 模拟生成词云
  const colors = colorSchemes[form.value.colorScheme] || colorSchemes.default
  const words = form.value.text.split(/[\s,\n]+/).filter(w => w.length > 0)
  const uniqueWords = [...new Set(words)]
  
  generatedWords.value = uniqueWords.slice(0, form.value.maxWords).map((word, index) => ({
    text: word,
    size: 14 + Math.random() * 40,
    color: colors[index % colors.length],
    rotate: Math.random() * 60 - 30
  }))
  
  hasGenerated.value = true
  
  // 更新词频统计
  wordStats.value = uniqueWords.slice(0, 10).map((word, index) => ({
    word,
    count: Math.floor(Math.random() * 15) + 1,
    percentage: 100 - index * 8,
    color: colors[index % colors.length]
  })).sort((a, b) => b.count - a.count)
  
  ElMessage.success('词云生成成功')
}

function handleZoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.2, 2)
}

function handleZoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5)
}

function handleExport() {
  ElMessage.success('图片导出中...')
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-card {
  margin-bottom: 16px;
}

.mb8 {
  margin-bottom: 16px;
}

.preview-area {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.word-cloud-container {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-word-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px 20px;
  
  span {
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    
    &:hover {
      transform: scale(1.2);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
}

.upload-file {
  width: 100%;
}
</style>
