<template>
  <div class="immersive-editor">
    <div class="form-section">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="form.category"
            placeholder="请选择分类"
            style="width: 200px"
          >
            <el-option label="新闻" value="news"></el-option>
            <el-option label="活动" value="activity"></el-option>
            <el-option label="公告" value="announcement"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleImageChange"
            :file-list="fileList"
          >
            <el-button type="primary">选择图片</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传封面图片，建议尺寸为 1200x600
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容">
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button size="small" @click="insertBold">
                <el-icon><Bold /></el-icon>
              </el-button>
              <el-button size="small" @click="insertItalic">
                <el-icon><Italic /></el-icon>
              </el-button>
              <el-button size="small" @click="insertUnderline">
                <el-icon><Underline /></el-icon>
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button size="small" @click="insertH1">H1</el-button>
              <el-button size="small" @click="insertH2">H2</el-button>
              <el-button size="small" @click="insertH3">H3</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button size="small" @click="insertImage">
                <el-icon><Picture /></el-icon>
              </el-button>
              <el-button size="small" @click="insertLink">
                <el-icon><Link /></el-icon>
              </el-button>
            </div>
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="15"
              placeholder="请输入内容"
              class="content-editor"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select
            v-model="form.status"
            placeholder="请选择发布状态"
            style="width: 200px"
          >
            <el-option label="草稿" value="draft"></el-option>
            <el-option label="已发布" value="published"></el-option>
            <el-option label="已下线" value="offline"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="success" @click="publish">发布</el-button>
          <el-button @click="preview">预览</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="preview-section" v-if="showPreview">
      <h3>预览效果</h3>
      <div class="preview-container">
        <h2>{{ form.title || "标题预览" }}</h2>
        <div class="preview-meta">
          <span>{{
            form.category ? getCategoryName(form.category) : "分类"
          }}</span>
          <span>{{ form.publishTime ? form.publishTime : "发布时间" }}</span>
        </div>
        <div
          class="preview-content"
          v-html="form.content || '<p>内容预览</p>'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Bold,
  Italic,
  Underline,
  Picture,
  Link,
} from "@element-plus/icons-vue";

export default {
  name: "ImmersiveEditor",
  components: {
    Bold,
    Italic,
    Underline,
    Picture,
    Link,
  },
  data() {
    return {
      form: {
        title: "",
        category: "",
        content: "",
        status: "draft",
        publishTime: new Date(),
      },
      fileList: [],
      showPreview: false,
    };
  },
  methods: {
    handleImageChange(file, fileList) {
      this.fileList = fileList;
    },
    insertBold() {
      this.form.content += "<strong>粗体文本</strong>";
    },
    insertItalic() {
      this.form.content += "<em>斜体文本</em>";
    },
    insertUnderline() {
      this.form.content += "<u>下划线文本</u>";
    },
    insertH1() {
      this.form.content += "<h1>一级标题</h1>";
    },
    insertH2() {
      this.form.content += "<h2>二级标题</h2>";
    },
    insertH3() {
      this.form.content += "<h3>三级标题</h3>";
    },
    insertImage() {
      this.form.content +=
        '<img src="https://via.placeholder.com/800x400" alt="图片" />';
    },
    insertLink() {
      this.form.content += '<a href="#">链接文本</a>';
    },
    save() {
      this.$message.success("保存成功");
    },
    publish() {
      this.form.status = "published";
      this.$message.success("发布成功");
    },
    preview() {
      this.showPreview = true;
    },
    getCategoryName(category) {
      const categories = {
        news: "新闻",
        activity: "活动",
        announcement: "公告",
      };
      return categories[category] || category;
    },
  },
};
</script>

<style scoped>
.immersive-editor {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 30px;
}

.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  background-color: #f5f7fa;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.content-editor {
  border: none;
  resize: none;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.preview-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.preview-container {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.preview-container h2 {
  margin-bottom: 10px;
  color: #333;
}

.preview-meta {
  margin-bottom: 20px;
  color: #999;
  font-size: 14px;
}

.preview-meta span {
  margin-right: 20px;
}

.preview-content {
  line-height: 1.6;
  color: #333;
}

.preview-content img {
  max-width: 100%;
  margin: 10px 0;
}
</style>
