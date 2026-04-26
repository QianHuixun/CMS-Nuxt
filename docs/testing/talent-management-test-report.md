# 4.1 人才管理测试报告

## 测试结论

- 4.1 人才管理已完成人工验收，可以收口。

## 修改文件清单

### 后端 migration / schema / service / api

- `chunyu-cms-web/server/db/migrations/0021_create_talent_tables_and_adjust_menus.sql`
- `chunyu-cms-web/server/db/schema/admin/talent.ts`
- `chunyu-cms-web/server/db/schema/admin/talentAchievementRelation.ts`
- `chunyu-cms-web/server/db/schema/index.ts`
- `chunyu-cms-web/server/services/admin/talent/talent.services.ts`
- `chunyu-cms-web/server/services/admin/patent/patent.services.ts`
- `chunyu-cms-web/server/services/admin/topic/topic.services.ts`
- `chunyu-cms-web/server/api/admin/talent/page.get.ts`
- `chunyu-cms-web/server/api/admin/talent/[id].get.ts`
- `chunyu-cms-web/server/api/admin/talent/index.post.ts`
- `chunyu-cms-web/server/api/admin/talent/index.put.ts`
- `chunyu-cms-web/server/api/admin/talent/[id].delete.ts`
- `chunyu-cms-web/server/api/admin/patent/list.get.ts`
- `chunyu-cms-web/server/api/admin/topic/list.get.ts`

### 前端 api / 页面

- `chunyu-cms-admin/src/api/talentResearch/talent.js`
- `chunyu-cms-admin/src/api/paperAchievement/paper.js`
- `chunyu-cms-admin/src/api/paperAchievement/patent.js`
- `chunyu-cms-admin/src/api/paperAchievement/topic.js`
- `chunyu-cms-admin/src/views/talentResearch/expertLibrary/index.vue`

### 测试文件

- `chunyu-cms-admin/src/views/talentResearch/expertLibrary/index.test.ts`

## migration 文件

- `0021_create_talent_tables_and_adjust_menus.sql`
- `talent` / `talent_achievement_relation` 已创建
- 当前库菜单实际 ID 为 `140 / 141`，已完成菜单修正

## 菜单调整说明

- `专家库管理` 已改名为 `人才管理`
- `课题时空管理` 已隐藏
- `component` 保持 `talentResearch/expertLibrary/index`
- `perms` 保持不变

## 新增接口说明

- `GET /api/admin/talent/page`
- `GET /api/admin/talent/:id`
- `POST /api/admin/talent`
- `PUT /api/admin/talent`
- `DELETE /api/admin/talent/:id`
- `GET /api/admin/patent/list`
- `GET /api/admin/topic/list`
- `paper/list` 复用

## 成果关联保存说明

- 使用 `talent_achievement_relation`
- `achievementType` 为 `paper / patent / topic`
- 编辑时清旧关联再写新关联

## 照片上传复用说明

- 复用 `ImageUpload`
- 复用 `common/upload`
- 本期不做裁剪

## 自动化测试命令与结果

执行命令：

- `pnpm test:unit -- src/views/talentResearch/expertLibrary/index.test.ts`
- `pnpm test:unit -- src/views/paperAchievement/bookImport/index.test.ts`
- `pnpm test:unit -- src/views/paperAchievement/simulationEntry/index.test.ts`
- `pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts`
- `pnpm test:unit -- src/views/automationTools/chartGenerator/index.test.ts`
- `pnpm build:prod`
- `pnpm build`

结果摘要：

- `9 files / 43 tests passed`
- 前端构建通过
- 后端构建通过
- 现有 warning 不阻塞

## 人工验收结果

| 验收项 | 结果 | 备注 |
| --- | --- | --- |
| 重新登录后台后菜单显示“人才管理” | 通过 |  |
| 课题时空管理菜单已隐藏 | 通过 |  |
| 进入人才管理页面正常 | 通过 |  |
| 姓名查询正常 | 通过 |  |
| 单位/机构查询正常 | 通过 |  |
| 研究方向查询正常 | 通过 |  |
| 状态查询正常 | 通过 |  |
| 新增人才正常 | 通过 |  |
| 上传高清照片正常 | 通过 |  |
| 卡片背景显示 `photoUrl` 正常 | 通过 |  |
| 关联论文正常 | 通过 |  |
| 关联专利正常 | 通过 |  |
| 关联课题正常 | 通过 |  |
| 编辑时关联成果回显正常 | 通过 |  |
| 详情页展示人才信息和关联成果正常 | 通过 |  |
| 删除人才后列表刷新正常 | 通过 |  |
| 5.1 数据导入正常 | 通过 |  |
| 5.2 书籍仿真录入正常 | 通过 |  |
| 6.1 词云正常 | 通过 |  |
| 6.2 图表生成正常 | 通过 |  |

## 已知遗留问题

- 未做照片裁剪
- 课题时空管理页面代码仍保留但菜单隐藏
- 未在人才页新增成果
- 未做全量 E2E

## 收口结论

- 4.1 人才管理最小版已完成数据库验证、菜单验证、自动化测试、构建验证和人工主链路验收，可以收口。
