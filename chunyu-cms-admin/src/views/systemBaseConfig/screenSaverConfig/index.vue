<template>
  <div class="screen-saver-config">
    <div class="config-section">
      <h3>屏保设置</h3>
      <el-form :model="screenSaverForm" label-width="120px">
        <el-form-item label="启用屏保">
          <el-switch v-model="screenSaverForm.enabled"></el-switch>
        </el-form-item>
        <el-form-item label="屏保延迟时间">
          <el-input-number
            v-model="screenSaverForm.delayTime"
            :min="1"
            :max="60"
            :step="1"
            suffix="分钟"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="屏保类型">
          <el-select
            v-model="screenSaverForm.type"
            placeholder="请选择屏保类型"
          >
            <el-option label="图片轮播" value="image"></el-option>
            <el-option label="文字滚动" value="text"></el-option>
            <el-option label="时钟" value="clock"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片路径">
          <el-input
            v-model="screenSaverForm.imagePath"
            placeholder="请输入图片路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="滚动文字">
          <el-input
            v-model="screenSaverForm.scrollingText"
            placeholder="请输入滚动文字"
          ></el-input>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker
            v-model="screenSaverForm.backgroundColor"
          ></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveConfig">保存配置</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="preview-section">
      <h3>预览效果</h3>
      <div
        class="preview-container"
        :style="{ backgroundColor: screenSaverForm.backgroundColor }"
      >
        <template v-if="screenSaverForm.type === 'image'">
          <div class="image-preview">图片轮播预览</div>
        </template>
        <template v-else-if="screenSaverForm.type === 'text'">
          <div class="text-preview">
            {{ screenSaverForm.scrollingText || "滚动文字预览" }}
          </div>
        </template>
        <template v-else-if="screenSaverForm.type === 'clock'">
          <div class="clock-preview">{{ currentTime }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenSaverConfig",
  data() {
    return {
      screenSaverForm: {
        enabled: true,
        delayTime: 5,
        type: "image",
        imagePath: "/path/to/images",
        scrollingText: "欢迎使用春雨CMS管理系统",
        backgroundColor: "#000000",
      },
      currentTime: "",
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    },
    saveConfig() {
      // 保存配置逻辑
      this.$message.success("保存成功");
    },
    resetForm() {
      this.screenSaverForm = {
        enabled: true,
        delayTime: 5,
        type: "image",
        imagePath: "/path/to/images",
        scrollingText: "欢迎使用春雨CMS管理系统",
        backgroundColor: "#000000",
      };
    },
  },
};
</script>

<style scoped>
.screen-saver-config {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.config-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.preview-section {
  margin-top: 30px;
}

h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.preview-container {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
}

.text-preview {
  animation: scroll 10s linear infinite;
}

.clock-preview {
  font-size: 48px;
  font-weight: bold;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
