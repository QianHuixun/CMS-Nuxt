# 核心资源库管理测试报告

## 测试结论

通过。核心资源库管理已完成构建验证、migration 验证、前台只读接口验证和人工验收，可收口。

## 修改文件清单

### 后端 schema / migration / service / api

- `chunyu-cms-web/server/db/schema/admin/resourceDatabase.ts`
- `chunyu-cms-web/server/db/schema/admin/researchTool.ts`
- `chunyu-cms-web/server/db/schema/index.ts`
- `chunyu-cms-web/server/db/migrations/0022_create_core_resource_tables_and_menus.sql`
- `chunyu-cms-web/server/services/admin/coreResource/resourceDatabase.services.ts`
- `chunyu-cms-web/server/services/admin/coreResource/researchTool.services.ts`
- `chunyu-cms-web/server/api/admin/resource-database/*`
- `chunyu-cms-web/server/api/admin/research-tool/*`
- `chunyu-cms-web/server/api/v1/databases.get.ts`
- `chunyu-cms-web/server/api/v1/tools.get.ts`

### 前端 api / 页面

- `chunyu-cms-admin/src/api/coreResource/database.js`
- `chunyu-cms-admin/src/api/coreResource/tool.js`
- `chunyu-cms-admin/src/views/coreResource/database/index.vue`
- `chunyu-cms-admin/src/views/coreResource/tool/index.vue`

## migration 文件

- `0022_create_core_resource_tables_and_menus.sql`

该 migration 创建：

- `resource_database`
- `research_tool`

该 migration 插入菜单：

- 核心资源库管理
- 数据库管理
- 自研工具管理

菜单插入说明：

- 不硬编码 `menu_id`
- 按 `menu_name` / `path` / `component` / `parent_menu_id` 判断是否已存在
- 使用数据库实际自增 ID 插入
- 本地实际菜单 ID 为 `148 / 149 / 150`

## 新增后台接口说明

- `GET /api/admin/resource-database/page`
- `GET /api/admin/resource-database/:id`
- `POST /api/admin/resource-database`
- `PUT /api/admin/resource-database`
- `DELETE /api/admin/resource-database/:id`
- `GET /api/admin/research-tool/page`
- `GET /api/admin/research-tool/:id`
- `POST /api/admin/research-tool`
- `PUT /api/admin/research-tool`
- `DELETE /api/admin/research-tool/:id`

删除接口使用逻辑删除。

## 新增前台只读接口说明

- `GET /api/v1/databases`
- `GET /api/v1/tools`

接口规则：

- 只返回 `active` 且未删除数据
- 不分页
- 返回 `{ total, list }`

## 上传复用说明

- 数据库管理 `coverUrl` 复用 `ImageUpload`
- 上传接口复用 `common/upload`
- `icon` 本期为文本输入，允许填写图标 class 或图片 URL

## 自动化/构建验证

| 验证项 | 结果 | 说明 |
| --- | --- | --- |
| `cd chunyu-cms-admin && pnpm build:prod` | 通过 | 后台管理端构建成功 |
| `cd chunyu-cms-web && pnpm build` | 通过 | Nuxt 服务端/前台构建成功 |
| `0022` migration 重复执行两次 | 通过 | 菜单未重复插入 |
| `/api/v1/databases` 冒烟验证 | 通过 | 仅返回 `active` 且未删除数据 |
| `/api/v1/tools` 冒烟验证 | 通过 | 仅返回 `active` 且未删除数据 |

## 人工验收结果

| 验收项 | 结果 | 备注 |
| --- | --- | --- |
| 登录后台后出现“核心资源库管理” | 通过 |  |
| 数据库管理页面可进入 | 通过 |  |
| 数据库资源新增正常 | 通过 |  |
| 数据库资源编辑正常 | 通过 |  |
| 数据库资源删除正常 | 通过 |  |
| 数据库资源名称筛选正常 | 通过 |  |
| 数据库资源状态筛选正常 | 通过 |  |
| 数据库资源排序保存正常 | 通过 |  |
| 数据库资源 `coverUrl` 上传回显正常 | 通过 |  |
| 自研工具管理页面可进入 | 通过 |  |
| 自研工具新增正常 | 通过 |  |
| 自研工具编辑正常 | 通过 |  |
| 自研工具删除正常 | 通过 |  |
| 自研工具名称筛选正常 | 通过 |  |
| 自研工具状态筛选正常 | 通过 |  |
| 自研工具排序保存正常 | 通过 |  |
| `/api/v1/databases` 只返回 `active` 且未删除数据 | 通过 | 已完成冒烟验证 |
| `/api/v1/tools` 只返回 `active` 且未删除数据 | 通过 | 已完成冒烟验证 |
| 已完成功能回归正常 | 通过 | 覆盖 4.1 / 5.1 / 5.2 / 6.1 / 6.2 / 活动管理 |

## 已知遗留问题

- 未做前台页面开发
- 未校验 URL 是否可访问
- 未做复杂图标库管理
- 旧“资源导航管理”菜单按要求保留
- Drizzle migration meta 与手写 migration 仍存在历史不一致

## 收口结论

核心资源库管理已完成开发、构建验证、migration 验证、前台只读接口冒烟验证和后台页面人工验收，结论为通过，可以收口。
