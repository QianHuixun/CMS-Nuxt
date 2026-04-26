# 5.2 书籍仿真录入测试报告

## 测试结论

- 5.2 书籍仿真录入最小版已完成数据库验证、自动化测试、构建验证和人工主链路验收，可以收口。

## 修改文件清单

### 后端 migration / schema / service / api

- `chunyu-cms-web/server/db/migrations/0020_create_book_simulation_tables.sql`
- `chunyu-cms-web/server/db/schema/admin/bookSimulation.ts`
- `chunyu-cms-web/server/db/schema/admin/bookSimulationPage.ts`
- `chunyu-cms-web/server/db/schema/index.ts`
- `chunyu-cms-web/server/services/admin/bookSimulation/bookSimulation.services.ts`
- `chunyu-cms-web/server/api/admin/book-simulation/page.get.ts`
- `chunyu-cms-web/server/api/admin/book-simulation/[id].get.ts`
- `chunyu-cms-web/server/api/admin/book-simulation/index.post.ts`
- `chunyu-cms-web/server/api/admin/book-simulation/index.put.ts`
- `chunyu-cms-web/server/api/admin/book-simulation/[id].delete.ts`

### 前端 api / 页面

- `chunyu-cms-admin/src/api/paperAchievement/bookSimulation.js`
- `chunyu-cms-admin/src/views/paperAchievement/simulationEntry/index.vue`

### 测试文件

- `chunyu-cms-admin/src/views/paperAchievement/simulationEntry/index.test.ts`

## migration 文件

- `0020_create_book_simulation_tables.sql`
- 该 migration 创建：
  - `book_simulation`
  - `book_simulation_page`
- 本地联调前需要先执行 `0020`，否则新增、编辑、列表和详情接口无法正常访问

## 新增接口说明

- `GET /api/admin/book-simulation/page`
- `GET /api/admin/book-simulation/:id`
- `POST /api/admin/book-simulation`
- `PUT /api/admin/book-simulation`
- `DELETE /api/admin/book-simulation/:id`

补充说明：

- 详情接口返回 `chapterImages` 数组
- 数据库字段 `summary` 对外映射为前端/API 字段 `description`

## 图片上传复用说明

- 复用 `ImageUpload`
- 复用 `common/upload`
- 封面单图
- 封底单图
- 核心章节图片多图
- 业务表只保存图片 URL

补充说明：

- 核心章节图片按上传顺序自动生成 `pageNo` 和 `sort`
- 本期不做 `pageTitle` 人工录入

## 自动化测试结果

执行命令：

- `pnpm test:unit -- src/views/paperAchievement/simulationEntry/index.test.ts`
- `pnpm test:unit -- src/views/paperAchievement/bookImport/index.test.ts`
- `pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts`
- `pnpm test:unit -- src/views/automationTools/chartGenerator/index.test.ts`
- `pnpm build:prod`
- `pnpm build`

结果摘要：

- `simulationEntry` 单测通过
- `bookImport` 回归通过
- `wordCloud` 回归通过
- `chartGenerator` 回归通过
- 前端构建通过
- 后端构建通过
- 既有 `@nuxt/image` `sharp` warning 不阻塞本轮

## 人工验收结果

| 验收项 | 结果 | 备注 |
| --- | --- | --- |
| 执行 `0020` migration | 通过 |  |
| 进入“论文著作与成果管理 > 书籍仿真录入” | 通过 |  |
| 页面正常显示书籍列表 | 通过 |  |
| 书名查询正常 | 通过 |  |
| 出版年份查询正常 | 通过 |  |
| 新增书籍正常 | 通过 |  |
| 封面单图上传并保存 | 通过 |  |
| 封底单图上传并保存 | 通过 |  |
| 核心章节图片多图上传并保存 | 通过 |  |
| 编辑时封面 / 封底 / 章节图片回显 | 通过 |  |
| 列表章节图片数量正确 | 通过 |  |
| 详情预览能看到图片 | 通过 |  |
| 编辑书籍后数据更新 | 通过 |  |
| 删除书籍后列表消失 | 通过 |  |
| 5.1 数据导入页仍正常 | 通过 |  |
| 6.1 词云仍正常 | 通过 |  |
| 6.2 图表生成仍正常 | 通过 |  |

## 已知遗留问题

- 未做 OCR
- 未做 PDF 解析
- 未做章节文字识别
- 未做真实三维翻页仿真
- 未做核心章节图片拖拽排序
- `pageTitle` 未开放人工录入
- 没有预置书籍样例数据
- 未做全量 E2E

## 是否阻塞

- 上述遗留问题不阻塞本轮最小版收口
- 原因：本轮范围是书籍基础信息 + 封面 / 封底 / 核心章节图片录入和回显
