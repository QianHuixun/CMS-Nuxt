# 沉浸式编排测试报告

## 测试结论

- 沉浸式编排功能已完成单元测试
- 沉浸式编排功能未做全量 E2E 自动化测试
- 沉浸式编排主链路已通过人工联调与手动验收

## 第一阶段

测试目标：覆盖 `blocks` 数据逻辑单元测试。

新增测试文件：

- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/utils/blockUtils.test.ts`

被测文件：

- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/utils/blockUtils.ts`

覆盖能力：

- 默认 block 创建
- block 新增
- block 删除
- block 更新
- block 排序移动
- block 查询
- 删除当前选中 block 后的选中状态修正

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/blockUtils.test.ts
```

测试结果：

- 1 个测试文件通过
- 9 个测试用例通过
- 结果：通过

失败与修复记录：

- 第一次运行失败：`vitest` 启动阶段触发 `vite/esbuild` 的 `spawn EPERM`
- 原因：测试命令在当前环境下无法正常拉起子进程
- 处理：使用提权重新执行同一条测试命令
- 重跑结果：测试全部通过

## 第二阶段

测试目标：覆盖沉浸式编排“保存与回显字段映射”逻辑。

新增测试文件：

- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/utils/scenePersistence.test.ts`

被测文件：

- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/utils/scenePersistence.ts`

覆盖能力：

- 场景数据标准化
- `content_blocks` JSON 解析
- 场景保存 payload 构建

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/scenePersistence.test.ts
```

测试结果：

- 1 个测试文件通过
- 6 个测试用例通过
- 结果：通过

失败与修复记录：

- 无断言失败
- 测试命令使用提权执行，以避免 `vite/esbuild` 在当前环境下的 `spawn EPERM`

## 第三阶段

测试目标：沉浸式编排“保存 - 刷新 - 回显”联调验证准备。

新增文件：

- `docs/testing/immersive-editor-integration-checklist.md`

已完成项：

- 输出联调验证清单
- 补充结果记录模板
- 进行环境冒烟检查

环境冒烟结果：

- `GET /api/admin/captchaImage`：`200`
- `POST /api/admin/logout`：`200`

说明：

- 第三阶段当前交付的是联调清单与环境可用性确认
- 真实“保存 - 刷新 - 回显”结果需结合第四阶段人工执行

## 第四阶段

测试目标：按联调清单执行沉浸式编排真实“保存 - 刷新 - 回显”验证。

人工验证结果：

- 场景新建与刷新回显：通过
- 文本块保存与刷新回显：通过
- 图片块保存与刷新回显：通过
- 视频块保存与刷新回显：通过
- block 删除后保存与刷新回显：通过
- block 排序后保存与刷新回显：通过
- 富文本模式保存与刷新回显：通过
- 后端重启后的页面恢复：通过

说明：

- 本期沉浸式编排没有新增 E2E 自动化测试
- 当前交付结论建立在单元测试、接口验证、上传验证与人工主链路验收之上

## 上传接口 ERR_CONNECTION_RESET 问题记录

### 问题现象

图片/视频上传时出现：

- `UploadAjaxError`
- `POST /dev-api/common/upload`
- `net::ERR_CONNECTION_RESET`

### 根因

前端上传地址为：

- `/dev-api/common/upload`

Vite 代理配置为：

- `/dev-api -> http://localhost:3000/api/admin`

因此真实后端请求为：

- `POST http://localhost:3000/api/admin/common/upload`

本地 `3000` 端口同时存在 `nuxt dev` 和 PM2 运行的旧 `.output/server/index.mjs`。  
PM2 旧构建产物缺少 `upload.post.mjs`，导致代理请求被旧进程重置。

### 修复方式

停止 PM2 的 `chunyu-cms-web`：

```bash
pm2 stop chunyu-cms-web
```

### 验证结果

停止 PM2 旧服务后，重新手动验证：

- 图片上传成功
- 视频上传成功
- `POST /dev-api/common/upload` 返回 `200`
- 图片/视频资源可访问
- 浏览器控制台不再出现 `ERR_CONNECTION_RESET`

### 源码改动

本次未修改上传地址、Vite proxy、前端上传组件或后端接口源码。

### 遗留风险

该问题属于本地运行环境冲突问题。  
如果后续继续使用 PM2 运行发布态服务，需要先重新构建：

```bash
pnpm build
pm2 restart chunyu-cms-web
```
