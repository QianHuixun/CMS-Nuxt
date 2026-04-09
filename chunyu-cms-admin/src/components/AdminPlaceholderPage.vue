<template>
  <div class="app-container admin-placeholder-page">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <div>
            <div class="page-title">{{ title }}</div>
            <div class="page-desc">{{ description }}</div>
          </div>
          <el-tag type="info">占位页</el-tag>
        </div>
      </template>

      <el-empty :description="emptyDescription">
        <template #image>
          <svg-icon :icon-class="icon" class-name="empty-icon" />
        </template>
      </el-empty>

      <el-alert :title="alertText" type="success" :closable="false" />
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  emptyDescription: {
    type: String,
    required: true,
  },
  alertText: {
    type: String,
    default: "当前页面仅完成菜单和路由接入，后续可在此继续补业务表单、列表和接口能力。",
  },
  icon: {
    type: String,
    default: "form",
  },
});
</script>

<style lang="scss" scoped>
.admin-placeholder-page {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  .page-desc {
    margin-top: 6px;
    color: #909399;
    font-size: 13px;
  }

  .empty-icon {
    width: 72px;
    height: 72px;
    color: #409eff;
  }
}
</style>
