<template>
  <div class="app-container resource-page">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <div>
            <div class="page-title">资源录入</div>
            <div class="page-desc">录入资源导航的基础信息、链接和展示内容。</div>
          </div>
          <el-tag type="info">占位页</el-tag>
        </div>
      </template>

      <el-empty description="资源录入功能待接入具体业务表单">
        <template #image>
          <svg-icon icon-class="form" class-name="empty-icon" />
        </template>
      </el-empty>

      <el-alert
        title="当前已完成菜单和路由接入，后续可以在这里继续补表单、接口和提交流程。"
        type="success"
        :closable="false"
      />
    </el-card>
  </div>
</template>

<script setup name="ResourceNavigationEntryIndex">
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
    color: #409eff;
  }
}
</style>
