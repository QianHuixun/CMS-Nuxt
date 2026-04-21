<template>
  <div class="chart-generator">
    <div class="input-section">
      <h3>数据输入</h3>
      <el-form>
        <el-form-item label="数据类型">
          <el-select v-model="dataType" placeholder="请选择数据类型">
            <el-option label="手动输入" value="manual"></el-option>
            <el-option label="JSON导入" value="json"></el-option>
            <el-option label="CSV导入" value="csv"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataType === 'manual'">
          <el-button type="primary" @click="addDataRow">添加数据行</el-button>
          <el-button @click="clearData">清空数据</el-button>
        </el-form-item>
        <el-form-item v-if="dataType === 'manual'">
          <el-table :data="chartData" style="width: 100%">
            <el-table-column prop="name" label="名称">
              <template #default="scope">
                <el-input
                  v-model="scope.row.name"
                  placeholder="请输入名称"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="数值">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.value"
                  :min="0"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="removeDataRow(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-else>
          <el-input
            v-model="dataInput"
            type="textarea"
            :rows="6"
            placeholder="请输入数据"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="params-section">
      <h3>图表设置</h3>
      <el-form :inline="true" size="small">
        <el-form-item label="图表类型">
          <el-select v-model="chartType" placeholder="请选择图表类型">
            <el-option label="柱状图" value="bar"></el-option>
            <el-option label="折线图" value="line"></el-option>
            <el-option label="饼图" value="pie"></el-option>
            <el-option label="雷达图" value="radar"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图表标题">
          <el-input
            v-model="chartTitle"
            placeholder="请输入图表标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="X轴标签">
          <el-input v-model="xAxisLabel" placeholder="请输入X轴标签"></el-input>
        </el-form-item>
        <el-form-item label="Y轴标签">
          <el-input v-model="yAxisLabel" placeholder="请输入Y轴标签"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generateChart">生成图表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="preview-section">
      <h3>图表预览</h3>
      <div class="preview-container">
        <div v-if="!generated" class="placeholder">
          <el-icon class="placeholder-icon"><PieChart /></el-icon>
          <p>点击生成图表按钮查看效果</p>
        </div>
        <div v-else class="chart-preview">
          <!-- 图表预览区域 -->
          <div class="chart-content">
            <h4>{{ chartTitle || "图表标题" }}</h4>
            <div class="chart-visualization">
              <template v-if="chartType === 'bar'">
                <div class="bar-chart">
                  <div
                    v-for="(item, index) in chartData"
                    :key="index"
                    class="bar"
                    :style="{ height: `${item.value * 2}px` }"
                  >
                    <span class="bar-label">{{ item.name }}</span>
                    <span class="bar-value">{{ item.value }}</span>
                  </div>
                </div>
              </template>
              <template v-else-if="chartType === 'pie'">
                <div class="pie-chart">
                  <div class="pie-slices">
                    <div
                      v-for="(item, index) in chartData"
                      :key="index"
                      class="pie-slice"
                      :style="{ backgroundColor: getColor(index) }"
                    ></div>
                  </div>
                  <div class="pie-legend">
                    <div
                      v-for="(item, index) in chartData"
                      :key="index"
                      class="legend-item"
                    >
                      <span
                        class="legend-color"
                        :style="{ backgroundColor: getColor(index) }"
                      ></span>
                      <span class="legend-label"
                        >{{ item.name }}: {{ item.value }}</span
                      >
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="other-chart">
                  <p>{{ chartType === "line" ? "折线图" : "雷达图" }} 预览</p>
                </div>
              </template>
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
          <el-button type="success" @click="exportChart">导出图表</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChartGenerator",
  data() {
    return {
      dataType: "manual",
      dataInput: "",
      chartType: "bar",
      chartTitle: "示例图表",
      xAxisLabel: "类别",
      yAxisLabel: "数值",
      chartData: [
        { name: "类别1", value: 100 },
        { name: "类别2", value: 200 },
        { name: "类别3", value: 150 },
        { name: "类别4", value: 300 },
      ],
      exportFormat: "png",
      generated: false,
    };
  },
  methods: {
    addDataRow() {
      this.chartData.push({ name: "", value: 0 });
    },
    removeDataRow(index) {
      this.chartData.splice(index, 1);
    },
    clearData() {
      this.chartData = [];
    },
    generateChart() {
      // 生成图表逻辑
      this.generated = true;
      this.$message.success("图表生成成功");
    },
    exportChart() {
      // 导出图表逻辑
      this.$message.success(`图表已导出为${this.exportFormat}格式`);
    },
    getColor(index) {
      const colors = [
        "#3498db",
        "#e74c3c",
        "#2ecc71",
        "#f39c12",
        "#9b59b6",
        "#1abc9c",
        "#34495e",
      ];
      return colors[index % colors.length];
    },
  },
};
</script>

<style scoped>
.chart-generator {
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

h4 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
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

.chart-preview {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-content {
  width: 100%;
  height: 100%;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 300px;
  padding-bottom: 30px;
}

.bar {
  width: 60px;
  background-color: #3498db;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s ease;
}

.bar:hover {
  background-color: #2980b9;
}

.bar-label {
  position: absolute;
  bottom: -25px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

.pie-chart {
  display: flex;
  height: 300px;
}

.pie-slices {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-slice {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.pie-slice:hover {
  transform: scale(1.1);
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 10px;
}

.other-chart {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
