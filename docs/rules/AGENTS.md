# AGENTS.md

本文档用于指导后续开发工程师或编码代理在本仓库中开展第一阶段功能开发。

当前开发工作主要依据以下文档：

- `docs/开发计划.md`
- `docs/项目需求分析.md`
- `docs/数据库字段规划.md`
- `docs/项目需求.md`

如果文档之间存在差异，按以下优先级理解：

1. `docs/项目需求.md`：业务需求基线。
2. `docs/开发计划.md`：当前开发执行计划。
3. `docs/数据库字段规划.md`：第一阶段数据库字段和建表参考。
4. `docs/项目需求分析.md`：实施背景、模块边界和风险说明。

## 1. 项目背景

本仓库是淳渔 CMS V2，当前需要基于需求文档完成一批面向后台管理和前台展示的数据管理能力。

项目包含两个主要子工程：

- `chunyu-cms-admin`：后台管理端，技术栈为 Vue 3 + Element Plus。
- `chunyu-cms-web`：Nuxt Web/API 服务端，包含前台页面、后台接口、Drizzle ORM 和 SQL migration。

第一阶段开发目标是完成以下 6 个后台一级模块的 MVP 闭环：

- 系统基础配置管理
- 资源导航管理
- 人才与对应科研管理
- 论文著作与成果管理
- 自动化辅助功能
- 活动管理

总体原则：

- 先完成可上线的 MVP，再做增强能力。
- 优先复用现有组件和基础设施。
- 不新增重复上传、富文本、图表或接口方案。
- 后台数据结构优先标准化。
- 多对多关系必须使用中间表，不使用逗号分隔 ID 字符串。

## 2. 实际目录映射

部分需求文档使用了逻辑路径，例如 `server`、`src/views`。实际开发时必须使用当前仓库目录：

- 后端服务根目录：`chunyu-cms-web/server`
- 后台管理接口：`chunyu-cms-web/server/api/admin`
- 后端服务层：`chunyu-cms-web/server/services/admin`
- Drizzle schema：`chunyu-cms-web/server/db/schema`
- Drizzle migration：`chunyu-cms-web/server/db/migrations`
- 后台前端源码：`chunyu-cms-admin/src`
- 后台页面目录：`chunyu-cms-admin/src/views`
- 后台 API 封装：`chunyu-cms-admin/src/api`
- 后台公共组件：`chunyu-cms-admin/src/components`

不要在仓库根目录创建新的 `server` 或 `src/views`。

## 3. 推荐开发顺序

除非需求方明确指定其它模块，否则按以下顺序推进：

1. 校验菜单、路由、占位页和权限标识。
2. 创建第一阶段数据库 schema 和 migration。
3. 建立后端 service 与通用 CRUD 接口模式。
4. 实现系统基础配置管理。
5. 实现资源导航管理。
6. 实现论文著作与成果管理。
7. 实现人才与对应科研管理。
8. 实现自动化辅助功能。
9. 实现活动管理。
10. 做后台、接口、前台展示联调。
11. 做验收测试和发布准备。

该顺序的原因：

- 系统配置和资源导航依赖少，可以优先形成可见成果。
- 论文、课题、专利是人才关联和自动化功能的数据基础，应先于人才管理和自动化模块完成。
- 自动化辅助依赖真实论文数据，应放在成果数据之后。
- 活动管理相对独立，但依赖上传和富文本链路稳定，适合后置。

## 4. 第一阶段数据库范围

第一阶段只要求完成以下 16 张表：

1. `system_nav_config`
2. `screen_saver_config`
3. `screen_saver_media`
4. `resource_navigation`
5. `talent`
6. `paper`
7. `topic`
8. `patent`
9. `talent_paper`
10. `talent_topic`
11. `talent_patent`
12. `book_simulation`
13. `book_simulation_page`
14. `import_batch`
15. `paper_keyword`
16. `activity`

以下表属于第二阶段或增强能力，第一阶段不要创建，除非用户明确要求：

- `activity_content`：用于模块化沉浸式编辑。
- `activity_headline`：用于多栏目、多时间段头条配置。
- `statistics_snapshot`：用于统计结果快照缓存。

数据库约定：

- 表名使用小写下划线。
- 主键使用业务语义命名，例如 `talent_id`、`paper_id`。
- 状态字段统一使用 `status`，`0` 表示正常/启用/显示，`1` 表示停用/隐藏。
- 逻辑删除字段统一使用 `del_flag`，`0` 表示未删除，`1` 表示已删除。
- 排序字段统一使用 `sort`，数值越小越靠前。
- 文件字段存储可访问 URL 或相对路径，不直接存储二进制内容。
- 业务主表默认补齐 `remark`、`create_by`、`create_time`、`update_by`、`update_time`。
- 人才与论文、课题、专利的多对多关系必须通过中间表保存。

## 5. 后端开发规则

后台接口统一放在 `chunyu-cms-web/server/api/admin` 下，建议按模块建立目录：

- `systemBaseConfig`
- `resourceNavigation`
- `talentResearch`
- `paperAchievement`
- `automationTools`
- `activityManagement`

服务层统一放在 `chunyu-cms-web/server/services/admin` 下，建议使用相同模块名建立目录。

每个主资源至少实现以下接口能力：

- 分页列表
- 详情查询
- 新增
- 编辑
- 逻辑删除
- 状态切换
- 排序更新
- 下拉选项接口，供其它模块搜索选择

后端实现要求：

- 使用 Drizzle ORM 操作数据库。
- 复用现有响应结构、异常处理和鉴权模式。
- 后台业务接口保持在 `/api/admin` 命名空间下。
- 删除操作默认使用逻辑删除，不做物理删除。
- 写入前校验必填字段和核心业务约束。
- 接口命名、返回结构和分页字段尽量与现有后台模块保持一致。

专项要求：

- 保存人才时，必须同步维护 `talent_paper`、`talent_topic`、`talent_patent`。
- 人才页面只能选择已有论文、课题、专利，不能在人才页面内新增这些成果数据。
- 论文、课题、专利导入后需要记录 `import_batch`。
- 图表生成第一阶段直接基于 `paper.publish_year` 动态聚合，不落统计快照表。
- 活动头条第一阶段直接使用 `activity.is_headline` 和 `activity.headline_sort`。

## 6. 后台前端开发规则

后台前端应复用现有 Vue 3 + Element Plus 写法和项目已有请求工具。

优先在以下现有页面目录中替换占位页或补齐功能：

- `chunyu-cms-admin/src/views/systemBaseConfig/navConfig`
- `chunyu-cms-admin/src/views/systemBaseConfig/screenSaverConfig`
- `chunyu-cms-admin/src/views/resource/navigation/entry`
- `chunyu-cms-admin/src/views/resource/navigation/card`
- `chunyu-cms-admin/src/views/paperAchievement/bookImport`
- `chunyu-cms-admin/src/views/paperAchievement/simulationEntry`
- `chunyu-cms-admin/src/views/talentResearch/expertLibrary`
- `chunyu-cms-admin/src/views/automationTools/wordCloud`
- `chunyu-cms-admin/src/views/automationTools/chartGenerator`
- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor`
- `chunyu-cms-admin/src/views/activityManagement/headlineFeatured`

后台 API 封装按模块放在 `chunyu-cms-admin/src/api` 下。

组件复用要求：

- 图片上传复用 `ImageUpload`。
- 普通文件上传复用 `FileUpload`。
- 视频上传、分片上传、封面帧截取和手动封面优先复用 `VideoUpload`。
- 沉浸式编辑第一阶段复用 `RichTextEditor`。
- 人才照片裁剪优先复用现有用户头像裁剪能力。

页面实现约定：

- 列表页统一包含查询区、表格区、操作区。
- 简单新增/编辑优先使用弹窗表单。
- 复杂内容编辑可以使用独立页面。
- 人才关联论文、课题、专利时使用可搜索多选。
- 第一阶段排序可使用排序值或上移/下移，不强制做拖拽。
- 表单需要正确处理新增、编辑、重置、关闭弹窗和数据回显。

## 7. 模块规则

### 7.1 系统基础配置管理

子菜单：

- 导航配置
- 屏保配置

涉及表：

- `system_nav_config`
- `screen_saver_config`
- `screen_saver_media`

MVP 要求：

- 导航配置维护首页入口名称、副标题、简介、跳转链接、链接类型、图标、封面、排序和启用状态。
- 屏保配置维护配置名称、无人操作触发秒数、播放模式、循环状态和启用状态。
- 屏保素材支持图片或视频，维护素材地址、视频封面、标题、时长、排序和状态。
- 支持当前配置预览。

验收重点：

- 导航配置可新增、编辑、删除、启停和排序。
- 屏保配置可维护基础参数和素材列表。
- 图片、视频上传和预览可用。

### 7.2 资源导航管理

子菜单：

- 资源录入
- 卡片管理

涉及表：

- `resource_navigation`

MVP 要求：

- 资源录入维护资源名称、简介、封面图、访问链接、演示视频、视频封面、链接类型、打开方式、排序和显示状态。
- 卡片管理支持列表、删除、显示/隐藏和排序调整。
- 第一阶段排序可使用排序值或上移/下移。

验收重点：

- 资源可录入、编辑、删除。
- 资源卡片可控制显示隐藏和排序。
- 封面图、演示视频和视频封面可正常保存与回显。

### 7.3 论文著作与成果管理

子菜单：

- 数据导入
- 书籍仿真录入

涉及表：

- `paper`
- `topic`
- `patent`
- `book_simulation`
- `book_simulation_page`
- `import_batch`

MVP 要求：

- 数据导入支持论文、专利、课题三类。
- 导入结果支持分页展示。
- 导入批次写入 `import_batch`，记录原始文件、总数、成功数、失败数、状态和错误摘要。
- 论文支持基础信息、摘要、关键词、PDF 全文、精选标记和精选排序。
- 专利支持基础信息、演示视频、视频封面和视频时长。
- 课题支持基础信息、负责人、起止年份/日期、地点和经纬度。
- 书籍仿真支持基础信息、封面、封底和核心章节图片集。
- 如果视频压缩成本较高，第一阶段只做上传、MP4 校验、封面帧或手动封面。

验收重点：

- 论文、专利、课题可导入或录入。
- 导入结果可分页展示。
- 论文精选可标记和排序。
- 专利视频上传、封面帧或手动封面可用。
- 书籍封面、封底和页面图片可上传、排序和回显。

### 7.4 人才与对应科研管理

子菜单：

- 人才管理

涉及表：

- `talent`
- `talent_paper`
- `talent_topic`
- `talent_patent`

依赖表：

- `paper`
- `topic`
- `patent`

MVP 要求：

- 支持人才基础信息 CRUD。
- 支持高清照片上传。
- 支持照片裁剪。
- 支持关联已存在的论文、课题、专利。
- 关联选择使用可搜索多选。
- 保存人才时同步维护三张关联表。
- 编辑人才时正确回显已关联成果。
- 不允许在人才页面直接新增论文、课题、专利。

验收重点：

- 人才可新增、编辑、删除、启停和排序。
- 人才照片上传和裁剪可用。
- 论文、课题、专利关联可保存、回显和修改。
- 关联数据删除或停用后，页面有合理兼容处理。

### 7.5 自动化辅助功能

子菜单：

- 词云
- 图表生成

涉及表：

- `paper_keyword`

依赖表：

- `paper`

MVP 要求：

- 词云支持单篇论文关键词维护。
- 词云支持全部收录论文关键词展示。
- 支持人工调整关键词权重。
- 关键词来源支持人工、摘要提取和导入。
- 图表生成按年度统计论文数量，基于 `paper.publish_year` 动态聚合。
- 第一阶段不做定时任务，不落 `statistics_snapshot`。

验收重点：

- 词云可基于真实论文关键词生成。
- 关键词权重可编辑并影响展示。
- 年度论文数量图表聚合结果正确。

### 7.6 活动管理

子菜单：

- 沉浸式编辑
- 头条精选

涉及表：

- `activity`

MVP 要求：

- 支持活动基础信息 CRUD。
- 沉浸式编辑第一阶段采用富文本，内容保存到 `activity.content_html`。
- 支持图文混排，支持图片、表格、视频等富文本内容维护。
- 支持封面图、活动日期、地点、摘要、发布状态和发布时间。
- 头条精选使用 `is_headline` 和 `headline_sort` 实现。
- 支持活动置顶、排序、上下架状态。
- 第一阶段不做模块化页面搭建器。

验收重点：

- 活动内容可新增、编辑、预览和发布。
- 富文本内容可保存和回显。
- 头条精选可开启、关闭和排序。
- 活动上下架状态可控制前端展示。

## 8. 权限建议

每个子菜单至少配置以下权限：

- `list`
- `query`
- `add`
- `edit`
- `remove`

按模块需要再增加以下权限：

- `import`
- `export`
- `status`
- `sort`
- `featured`
- `headline`
- `upload`

## 9. 常用命令

后端：

```bash
cd chunyu-cms-web
pnpm dev
pnpm build
pnpm generate
pnpm sql-push
pnpm lint
```

后台前端：

```bash
cd chunyu-cms-admin
pnpm dev
pnpm build:prod
pnpm build:single
```

执行原则：

- 根据改动范围运行最小必要验证命令。
- 只改文档时，不需要运行构建。
- 修改 schema 或 migration 后，需要验证 migration 生成和数据库执行链路。
- 修改前后端联动功能时，需要至少验证接口和页面主流程。

## 10. 验收清单

功能完成前，至少检查相关项：

- 菜单路由打开无 404。
- 列表分页、查询、重置、刷新正常。
- 新增、编辑、逻辑删除、状态切换、排序正常。
- 图片、文件、视频上传、预览、删除、编辑回显正常。
- 人才关联论文、课题、专利的保存和回显正常。
- 导入功能能写入 `import_batch`，失败信息可追踪。
- 词云使用真实关键词数据，权重调整能影响展示。
- 年度图表聚合结果与 `paper.publish_year` 数据一致。
- 活动富文本内容可保存和回显。
- 头条精选开关和排序正常。

## 11. 第一阶段边界

第一阶段明确不做以下内容，除非用户单独要求：

- 不新增第二套上传技术栈。
- 不用字符串字段冗余保存多对多关联 ID。
- 不实现服务端视频自动压缩。
- 不实现模块化沉浸式页面搭建器。
- 不新增统计定时任务。
- 不新增统计快照缓存表。
- 不强制实现拖拽排序。
- 不在人才管理页面内新增论文、课题、专利。

## 12. 最终验收标准

第一阶段完成标准：

- 6 个父菜单和全部子菜单在后台可访问。
- 每个模块至少完成一条从录入到展示的 MVP 闭环。
- 论文、课题、专利可录入或导入，并能参与人才关联。
- 人才与论文、课题、专利关联可新增、回显和修改。
- 文件、图片、视频上传链路稳定可用。
- 人才照片裁剪链路可用。
- 视频封面处理链路可用。
- 词云和年度图表可基于真实论文数据生成。
- 活动可编辑、发布，并可配置为头条精选。
- 新增业务表的删除操作均为逻辑删除。
