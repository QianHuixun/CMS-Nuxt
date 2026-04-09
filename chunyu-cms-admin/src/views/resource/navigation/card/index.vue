<template>
  <div class="app-container resource-page">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <div>
            <div class="page-title">卡片管理</div>
            <div class="page-desc">维护资源导航卡片的展示内容、排序和状态。</div>
          </div>
          <el-tag type="info">占位页</el-tag>
        </div>
      </template>

      <el-empty description="卡片管理功能待接入具体列表和编辑能力">
        <template #image>
          <svg-icon icon-class="table" class-name="empty-icon" />
        </template>
      </el-empty>

      <el-alert
        title="当前已完成菜单和路由接入，后续可以在这里继续补列表、排序和卡片配置能力。"
        type="success"
        :closable="false"
      />
    </el-card>
  </div>
</template>

<script setup name="ResourceNavigationCardIndex">
</script>

<style lang="scss" scoped>
.resource-page {
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
    color: #67c23a;
  }
}
</style>
