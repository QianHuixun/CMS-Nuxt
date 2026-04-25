# 沉浸式编排测试计划

## 测试范围说明

- 本功能已规划并执行单元测试
- 本功能未纳入全量 E2E 自动化测试范围
- 本功能主链路通过人工联调与手动验收补充验证

## 第一阶段

目标：先做 `blocks` 数据逻辑单元测试，不包含组件测试和 E2E。

当前状态：已完成

范围：

- `createDefaultBlock`
- `addBlock`
- `removeBlock`
- `updateBlock`
- `moveBlock`
- `getBlockById`
- 删除当前选中 block 后的 `selectedBlockId` 处理

实现策略：

1. 从 `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/index.vue` 中抽离纯数据逻辑到 `utils/blockUtils.ts`
2. 保持页面交互、弹窗确认、消息提示仍在组件中
3. 使用 `vitest` 运行纯函数单元测试

不在本阶段范围内：

- E2E
- 组件渲染测试
- 场景列表接口联调测试
- 富文本模式测试
- 视频上传流程测试

## 第二阶段

目标：补“保存与回显字段映射”纯逻辑测试，覆盖前端保存 payload 和后端回显字段映射风险。

当前状态：已完成

范围：

- `normalizeScene`
- `parseSceneBlocks`
- `buildSceneContentPayload`

验证点：

- 后端 `contentBlocks/contentHtml` 能否被前端正确映射
- `content_blocks` 非法 JSON 时能否安全降级为空数组
- 保存时 `id/activityId/content_blocks/content_html` 是否按预期构建

## 第三阶段

目标：整理沉浸式编排“保存 - 刷新 - 回显”联调验证清单。

当前状态：已完成

范围：

- 场景新建后的刷新回显
- 可视化编排文本、图片、视频 block 保存回显
- 删除与排序后的回显
- 富文本模式保存回显
- 后端重启后的页面恢复

交付物：

- `docs/testing/immersive-editor-integration-checklist.md`

## 第四阶段

目标：按联调清单执行沉浸式编排真实“保存 - 刷新 - 回显”验证。

当前状态：已执行并通过主链路人工验收

验证范围：

- 场景新建与刷新回显
- 文本块保存与刷新回显
- 图片块保存与刷新回显
- 视频块保存与刷新回显
- block 删除后保存与刷新回显
- block 排序后保存与刷新回显
- 富文本模式保存与刷新回显
- 后端重启后的页面恢复

执行依据：

- `docs/testing/immersive-editor-integration-checklist.md`

进入条件：

- 管理端已登录
- `chunyu-cms-admin` 可访问：`http://localhost:4000`
- `chunyu-cms-web` 可访问：`http://localhost:3000`
- MySQL / Redis 已启动
- 上传链路可用：`POST /dev-api/common/upload` 返回 `200`

说明：

- 第四阶段是第三阶段联调清单的真实执行阶段
- 本期沉浸式编排没有补充 E2E 自动化测试
- 若再次出现上传 `ERR_CONNECTION_RESET`，优先检查 `3000` 端口是否被旧 PM2 `.output` 服务占用
