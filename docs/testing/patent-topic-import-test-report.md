# 专利导入最小版 + 课题导入最小版测试报告

## 测试结论

- 本轮 5.1 专利导入最小版 + 课题导入最小版可以进入人工验收
- 人工验收通过后可以收口

## 修改文件清单

### 后端数据与服务

- `chunyu-cms-web/server/db/migrations/0019_create_patent_and_topic_tables.sql`
- `chunyu-cms-web/server/db/schema/admin/patent.ts`
- `chunyu-cms-web/server/db/schema/admin/topic.ts`
- `chunyu-cms-web/server/db/schema/index.ts`
- `chunyu-cms-web/server/services/admin/patent/patent.services.ts`
- `chunyu-cms-web/server/services/admin/topic/topic.services.ts`

### 后端接口

- `chunyu-cms-web/server/api/admin/patent/page.get.ts`
- `chunyu-cms-web/server/api/admin/patent/[id].get.ts`
- `chunyu-cms-web/server/api/admin/patent/index.post.ts`
- `chunyu-cms-web/server/api/admin/patent/index.put.ts`
- `chunyu-cms-web/server/api/admin/patent/[id].delete.ts`
- `chunyu-cms-web/server/api/admin/topic/page.get.ts`
- `chunyu-cms-web/server/api/admin/topic/[id].get.ts`
- `chunyu-cms-web/server/api/admin/topic/index.post.ts`
- `chunyu-cms-web/server/api/admin/topic/index.put.ts`
- `chunyu-cms-web/server/api/admin/topic/[id].delete.ts`

### 前端页面与 API

- `chunyu-cms-admin/src/api/paperAchievement/patent.js`
- `chunyu-cms-admin/src/api/paperAchievement/topic.js`
- `chunyu-cms-admin/src/views/paperAchievement/bookImport/index.vue`

### 测试文件

- `chunyu-cms-admin/src/views/paperAchievement/bookImport/index.test.ts`

## migration 文件

- `0019_create_patent_and_topic_tables.sql`

数据库验证摘要：

- `patent` 表已存在
- `topic` 表已存在

## 新增接口说明

专利接口：

- `GET /api/admin/patent/page`
- `GET /api/admin/patent/:id`
- `POST /api/admin/patent`
- `PUT /api/admin/patent`
- `DELETE /api/admin/patent/:id`

课题接口：

- `GET /api/admin/topic/page`
- `GET /api/admin/topic/:id`
- `POST /api/admin/topic`
- `PUT /api/admin/topic`
- `DELETE /api/admin/topic/:id`

## 视频复用说明

- 复用 `VideoUploader`
- 复用 `ImageUpload`
- 复用 `common/upload`
- 不新增视频上传接口
- 自动封面来自现有前端首帧抽取能力
- 不做后端抽帧、压缩、转码

## 自动化测试结果

执行命令：

```bash
cd chunyu-cms-admin
pnpm test:unit -- src/views/paperAchievement/bookImport/index.test.ts
pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts
pnpm test:unit -- src/views/automationTools/chartGenerator/index.test.ts
pnpm build:prod

cd ../chunyu-cms-web
pnpm build
```

测试摘要：

- `7 files / 35 tests passed`
- 前端构建通过
- 后端构建通过

覆盖摘要：

- 专利列表 / 新增 / 编辑 / 删除 / 查询
- 课题列表 / 新增 / 编辑 / 删除 / 查询
- 专利视频和封面字段提交与回显
- 论文 tab 回归
- 6.1 词云回归
- 6.2 图表回归

## 人工验收结果

| 验收项 | 结果 |
| --- | --- |
| 进入数据导入页面 | 待执行 |
| 页面包含论文 / 专利 / 课题三个 tab | 待执行 |
| 论文 tab 原功能正常 | 待执行 |
| 专利名称 / 年份查询正常 | 待执行 |
| 新增专利正常 | 待执行 |
| 编辑专利正常 | 待执行 |
| 删除专利正常 | 待执行 |
| MP4 上传正常 | 待执行 |
| `operationVideoUrl` 保存并回显 | 待执行 |
| `videoCoverUrl` 保存并回显 | 待执行 |
| 专利视频卡片展示正常 | 待执行 |
| 课题名称 / 年份查询正常 | 待执行 |
| 新增课题正常 | 待执行 |
| 编辑课题正常 | 待执行 |
| 删除课题正常 | 待执行 |
| 6.1 词云页正常 | 待执行 |
| 6.2 图表页正常 | 待执行 |

## 已知遗留问题

- 真实批量导入未实现
- 专利视频压缩未实现
- 后端自动抽帧未实现
- 视频转码未实现
- 课题时空管理字段未接入
- 未做全量 E2E
- 本地库没有预置专利 / 课题样例数据

## 是否阻塞

- 以上遗留问题不阻塞本轮最小版收口

原因：

- 本轮范围是专利 / 课题主数据导入最小版，复杂批量导入和视频增强后续单独开发
