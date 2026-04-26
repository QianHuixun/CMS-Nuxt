# 论文数据导入最小版测试报告

## 测试结论

- 5.1 论文数据导入最小版的代码实现、自动化测试和构建验证已完成
- 当前本地数据库 `chunyu_cms_v2` 中，`0018_extend_paper_for_import_and_chart.sql` 尚未实际生效
- 因此本期目前属于“代码可收口，数据库迁移未收口”的状态

## 功能范围

- 在现有 `paper` 表能力上补齐论文导入最小承接能力
- 页面内部从“书籍导入”改造成“论文数据导入”
- 支持论文分页列表
- 支持按标题查询
- 支持按年份查询
- 支持新增论文
- 支持编辑论文
- 支持逻辑删除
- 支持设置/取消精选
- 保留批量导入入口并以提示弹窗方式占位

## 本期不做范围

- 不做专利导入
- 不做课题导入
- 不做真实 Excel/CSV 批量导入
- 不做完整论文管理系统
- 不做全量 E2E
- 不开发 6.2 图表生成
- 不新增图表专用数据表
- 不重构 6.1 词云

## 修改文件清单

### 后端数据与服务

- `chunyu-cms-web/server/db/migrations/0018_extend_paper_for_import_and_chart.sql`
- `chunyu-cms-web/server/db/schema/admin/paper.ts`
- `chunyu-cms-web/server/db/schema/index.ts`
- `chunyu-cms-web/server/services/admin/paper/paper.services.ts`

### 后端接口

- `chunyu-cms-web/server/api/admin/paper/page.get.ts`
- `chunyu-cms-web/server/api/admin/paper/index.post.ts`
- `chunyu-cms-web/server/api/admin/paper/index.put.ts`
- `chunyu-cms-web/server/api/admin/paper/[id].delete.ts`
- `chunyu-cms-web/server/api/admin/paper/[id]/featured.put.ts`

### 前端页面与 API

- `chunyu-cms-admin/src/api/paperAchievement/paper.js`
- `chunyu-cms-admin/src/views/paperAchievement/bookImport/index.vue`
- `chunyu-cms-admin/src/views/paperAchievement/bookImport/index.test.ts`

### 相关回归依赖

- `chunyu-cms-admin/src/views/automationTools/wordCloud/index.test.ts`

## migration 文件

- `chunyu-cms-web/server/db/migrations/0018_extend_paper_for_import_and_chart.sql`

内容概述：

- 为 `paper` 表新增 `publish_year`
- 为 `paper` 表新增 `is_featured`
- 为当前 3 条样例论文补充默认年份与精选状态

## 新增接口说明

保留不变，继续给 6.1 使用：

- `GET /api/admin/paper/list`
- `GET /api/admin/paper/:id`
- `GET /api/admin/paper/:id/keywords`
- `PUT /api/admin/paper/:id/keywords`
- `GET /api/admin/paper/keywords/cloud`

本期新增：

- `GET /api/admin/paper/page`
  - 查询参数：`pageNum` `pageSize` `title` `publishYear` `status`
  - 默认排序：`publishYear desc` -> `updateTime desc` -> `paperId desc`

- `POST /api/admin/paper`
  - 新增论文

- `PUT /api/admin/paper`
  - 编辑论文

- `DELETE /api/admin/paper/:id`
  - 逻辑删除论文

- `PUT /api/admin/paper/:id/featured`
  - 设置/取消精选

字段映射：

- DB `publish_year` -> API `publishYear`
- DB `is_featured` -> API `isFeatured`

## 数据库检查结果

检查时间：

- 本地环境当前轮次收口检查

检查库：

- `chunyu_cms_v2`

只读检查结果：

- `paper` 表存在
- `paper_keyword` 表存在
- `paper` 表当前字段中未查询到 `publish_year`
- `paper` 表当前字段中未查询到 `is_featured`
- 因此 `0018_extend_paper_for_import_and_chart.sql` 当前未实际生效

实际字段查询结果摘要：

- 当前 `paper` 表字段仍为：
  - `paper_id`
  - `title`
  - `abstract`
  - `keywords`
  - `status`
  - `del_flag`
  - `remark`
  - `create_by`
  - `create_time`
  - `update_by`
  - `update_time`

样例论文只读查询结果摘要：

- 能查到 3 条 6.1 阶段样例论文
- 但当前无法查询 `publish_year` / `is_featured`
- 原因不是样例论文缺失，而是表结构尚未补列

结论：

- 本地数据库当前未完成 5.1 所需 migration 落库

## 自动化测试命令与结果

### 论文数据导入页面

命令：

```bash
cd chunyu-cms-admin
pnpm test:unit -- src/views/paperAchievement/bookImport/index.test.ts
```

结果：

- 通过

覆盖能力：

- paper 分页列表
- 标题查询
- 年份查询
- 新增论文
- 编辑论文
- 逻辑删除
- 设置/取消精选

### 6.1 词云回归

命令：

```bash
cd chunyu-cms-admin
pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts
```

结果：

- 通过

覆盖能力：

- 确认 6.1 仍可基于 `keywords` / `paper_keyword` 工作

## 构建结果

### 前端构建

命令：

```bash
cd chunyu-cms-admin
pnpm build:prod
```

结果：

- 通过

### 后端构建

命令：

```bash
cd chunyu-cms-web
pnpm build
```

结果：

- 通过

说明：

- 后端构建存在既有 Nuxt Image 警告：`sharp binaries for linux-x64 cannot be found`
- 该警告不是本次论文数据导入功能引入

## 人工验收清单

| 验收项 | 当前状态 |
| --- | --- |
| 页面内部标题已改为“论文数据导入” | 待执行 |
| 样例论文列表可见 | 待执行 |
| 标题查询可用 | 待执行 |
| 年份查询可用 | 待执行 |
| 新增论文可用 | 待执行 |
| 编辑论文可用 | 待执行 |
| 逻辑删除可用 | 待执行 |
| 设置/取消精选可用 | 待执行 |
| 批量导入按钮仅弹出提示 | 待执行 |
| 6.1 词云仍可读取论文关键词 | 自动化回归通过，人工待执行 |

说明：

- 本轮按你的要求只做收口确认与文档补齐
- 未补充新的测试代码
- 未做新的业务开发

## 已知遗留问题

- 当前本地数据库尚未执行 `0018_extend_paper_for_import_and_chart.sql`
- 在 migration 未执行前，5.1 页面涉及 `publishYear` / `isFeatured` 的真实运行能力不能完全落地
- 批量导入仍是入口占位，仅弹出“后续接入”提示
- 当前编辑 `paper.keywords` 不会自动同步改写已有 `paper_keyword` 明细；若某篇论文已有单独关键词权重，6.1 单篇词云仍优先读取 `paper_keyword`
- 菜单名称仍是“书籍导入”，仅页面内部内容已按论文数据导入改造
- 未做全量 E2E

## 是否可以收口

- 当前不能判定为“完全收口”

原因：

- 代码层、自动化测试、构建验证已完成
- 但数据库层关键 migration `0018` 尚未在当前本地库实际生效

建议收口口径：

- 若先执行 `0018_extend_paper_for_import_and_chart.sql`，再完成一轮最小人工验收，则 5.1 可收口
- 在此之前，应标记为“待执行数据库迁移”
