# 系统基础配置管理测试报告

## 测试结论

通过。系统基础配置管理的导航配置与屏保配置已完成开发、构建验证、migration 验证、前台只读接口冒烟验证和人工验收，可收口。

## 修改文件清单

### 后端 schema / migration / service / api

- `chunyu-cms-web/server/db/schema/admin/navConfig.ts`
- `chunyu-cms-web/server/db/schema/admin/screenSaverConfig.ts`
- `chunyu-cms-web/server/db/schema/index.ts`
- `chunyu-cms-web/server/db/migrations/0023_create_system_base_config_tables.sql`
- `chunyu-cms-web/server/services/admin/systemBaseConfig/navConfig.services.ts`
- `chunyu-cms-web/server/services/admin/systemBaseConfig/screenSaverConfig.services.ts`
- `chunyu-cms-web/server/api/admin/nav-config/*`
- `chunyu-cms-web/server/api/admin/screensaver-config/*`
- `chunyu-cms-web/server/api/v1/navigation.get.ts`
- `chunyu-cms-web/server/api/v1/screensaver.get.ts`

### 前端 api / 页面

- `chunyu-cms-admin/src/api/systemBaseConfig/navConfig.js`
- `chunyu-cms-admin/src/api/systemBaseConfig/screenSaverConfig.js`
- `chunyu-cms-admin/src/views/systemBaseConfig/navConfig/index.vue`
- `chunyu-cms-admin/src/views/systemBaseConfig/screenSaverConfig/index.vue`

## migration 文件

- `0023_create_system_base_config_tables.sql`

该 migration 创建：

- `nav_config`
- `screen_saver_config`

菜单处理说明：

- 复用现有“导航配置”和“屏保配置”菜单
- 不新增重复菜单
- 通过 `menu_name + component` 做幂等修正
- 本地菜单 ID 为 `138 / 139`

## 新增后台接口说明

- `GET /api/admin/nav-config/page`
- `GET /api/admin/nav-config/:id`
- `POST /api/admin/nav-config`
- `PUT /api/admin/nav-config`
- `DELETE /api/admin/nav-config/:id`
- `GET /api/admin/screensaver-config/page`
- `GET /api/admin/screensaver-config/:id`
- `POST /api/admin/screensaver-config`
- `PUT /api/admin/screensaver-config`
- `DELETE /api/admin/screensaver-config/:id`

删除接口使用逻辑删除。

## 新增前台只读接口说明

- `GET /api/v1/navigation`
- `GET /api/v1/screensaver`

接口规则：

- 只返回 `active` 且未删除数据
- `navigation` 最多返回 3 条
- `screensaver` 顶层 `triggerSeconds` 取排序第一条 `active`

## 上传复用说明

- 屏保图片复用 `ImageUpload`
- 屏保视频复用 `VideoUploader`
- 视频封面复用 `ImageUpload`
- 上传接口复用 `common/upload`
- 导航 `icon` 本期为文本输入，允许填写图标 class 或图片 URL

## 自动化/构建验证

| 验证项 | 结果 | 说明 |
| --- | --- | --- |
| `0023` migration 重复执行两次 | 通过 | 菜单未重复插入 |
| `cd chunyu-cms-admin && pnpm build:prod` | 通过 | 后台管理端构建成功 |
| `cd chunyu-cms-web && pnpm build` | 通过 | Nuxt 服务端/前台构建成功 |
| `GET /api/v1/navigation` 冒烟 | 通过 | 仅返回 `active` 且未删除数据，最多 3 条 |
| `GET /api/v1/screensaver` 冒烟 | 通过 | 仅返回 `active` 且未删除数据，顶层 `triggerSeconds` 正确 |

## 人工验收结果

| 验收项 | 结果 | 备注 |
| --- | --- | --- |
| 系统基础配置管理下显示导航配置和屏保配置 | 通过 |  |
| 导航配置页面可进入 | 通过 |  |
| 导航配置新增正常 | 通过 |  |
| 导航配置编辑正常 | 通过 |  |
| 导航配置删除正常 | 通过 |  |
| 导航配置名称筛选正常 | 通过 |  |
| 导航配置状态筛选正常 | 通过 |  |
| 导航配置排序保存正常 | 通过 |  |
| `active` 超过 3 个时阻止保存 | 通过 |  |
| 屏保配置页面可进入 | 通过 |  |
| 屏保图片新增正常 | 通过 |  |
| 屏保视频新增正常 | 通过 |  |
| 屏保配置编辑正常 | 通过 |  |
| 屏保配置删除正常 | 通过 |  |
| `triggerSeconds` 保存正常 | 通过 |  |
| 图片/视频/封面上传和回显正常 | 通过 |  |
| `/api/v1/navigation` 数据符合规则 | 通过 | 已完成冒烟验证 |
| `/api/v1/screensaver` 数据符合规则 | 通过 | 已完成冒烟验证 |
| 已完成模块回归正常 | 通过 |  |

## 已知遗留问题

- 未做前台页面开发
- 未做复杂屏保播放逻辑
- 未做视频压缩/转码
- 未做后端抽帧
- 未校验外部 URL 是否可访问

## 收口结论

系统基础配置管理的导航配置与屏保配置已完成开发、构建验证、migration 验证、前台只读接口冒烟验证和后台页面人工验收，结论为通过，可以收口。
