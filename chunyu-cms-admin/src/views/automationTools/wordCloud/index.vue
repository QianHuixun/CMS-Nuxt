<template>
  <div class="word-cloud">
    <div class="input-section">
      <h3>输入文本</h3>
      <el-form>
        <el-form-item>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="6"
            placeholder="请输入要生成词云的文本内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generateWordCloud"
            >生成词云</el-button
          >
          <el-button @click="clearText">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="params-section">
      <h3>参数设置</h3>
      <el-form :inline="true" size="small">
        <el-form-item label="词云形状">
          <el-select v-model="params.shape" placeholder="请选择形状">
            <el-option label="圆形" value="circle"></el-option>
            <el-option label="方形" value="square"></el-option>
            <el-option label="心形" value="heart"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字体大小">
          <el-input-number
            v-model="params.fontSize"
            :min="12"
            :max="72"
            :step="4"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="颜色方案">
          <el-select v-model="params.colorScheme" placeholder="请选择颜色">
            <el-option label="默认" value="default"></el-option>
            <el-option label="暖色" value="warm"></el-option>
            <el-option label="冷色" value="cool"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="词云大小">
          <el-input-number
            v-model="params.size"
            :min="200"
            :max="800"
            :step="50"
          ></el-input-number>
        </el-form-item>
      </el-form>
    </div>

    <div class="preview-section">
      <h3>词云预览</h3>
      <div class="preview-container">
        <div v-if="!generated" class="placeholder">
          <el-icon class="placeholder-icon"><Picture /></el-icon>
          <p>点击生成词云按钮查看效果</p>
        </div>
        <div v-else class="word-cloud-preview">
          <!-- 词云预览区域 -->
          <div class="word-cloud-content">
            <div
              class="word"
              v-for="(word, index) in wordList"
              :key="index"
              :style="getWordStyle(word)"
            >
              {{ word.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="export-section">
      <h3>导出设置</h3>
      <el-form :inline="true" size="small">
        <el-form-item label="导出格式">
          <el-select v-model="exportFormat" placeholder="请选择格式">
            <el-option label="PNG" value="png"></el-option>
            <el-option label="SVG" value="svg"></el-option>
            <el-option label="JSON" value="json"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="exportWordCloud"
            >导出词云</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "WordCloud",
  data() {
    return {
      inputText:
        "这是一个词云生成工具，你可以输入任意文本，生成美观的词云效果。词云是一种可视化技术，用于展示文本中出现频率较高的词语。",
      params: {
        shape: "circle",
        fontSize: 24,
        colorScheme: "default",
        size: 400,
      },
      exportFormat: "png",
      generated: false,
      wordList: [
        { text: "词云", weight: 10 },
        { text: "生成", weight: 8 },
        { text: "文本", weight: 7 },
        { text: "可视化", weight: 6 },
        { text: "工具", weight: 5 },
        { text: "效果", weight: 4 },
        { text: "频率", weight: 3 },
        { text: "词语", weight: 3 },
      ],
    };
  },
  methods: {
    generateWordCloud() {
      // 生成词云逻辑
      this.generated = true;
      this.$message.success("词云生成成功");
    },
    clearText() {
      this.inputText = "";
      this.generated = false;
    },
    exportWordCloud() {
      // 导出词云逻辑
      this.$message.success(`词云已导出为${this.exportFormat}格式`);
    },
    getWordStyle(word) {
      const colors = {
        default: ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"],
        warm: ["#e74c3c", "#f39c12", "#e67e22", "#d35400", "#c0392b"],
        cool: ["#3498db", "#2ecc71", "#1abc9c", "#34495e", "#27ae60"],
      };
      const colorList = colors[this.params.colorScheme];
      const color = colorList[Math.floor(Math.random() * colorList.length)];
      const fontSize = this.params.fontSize * (word.weight / 10);
      const rotate = Math.random() * 60 - 30;

      return {
        fontSize: `${fontSize}px`,
        color: color,
        transform: `rotate(${rotate}deg)`,
        position: "absolute",
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
        fontWeight: word.weight > 5 ? "bold" : "normal",
      };
    },
  },
};
</script>

<style scoped>
.word-cloud {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-section,
.params-section,
.preview-section,
.export-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.preview-container {
  width: 100%;
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.word-cloud-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.word-cloud-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.word {
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.word:hover {
  transform: scale(1.1);
}
</style>
