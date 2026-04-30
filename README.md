# CMS-Nuxt

基于 Nuxt 4、Vue 3、Element Plus、Drizzle ORM、MySQL 和 Redis 的内容管理系统。项目采用前后台分离结构：`chunyu-cms-web` 同时承载用户端页面与 Nitro 后端接口，`chunyu-cms-admin` 提供后台管理端。

当前代码在原淳渔 CMS V2 基础上扩展了科研与成果管理场景，包含人才科研、论文著作、活动管理、资源导航、基础配置、自动化辅助等后台模块。

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 用户端/后端 | Nuxt 4、Nitro、TypeScript |
| 管理端 | Vue 3、Vite、Element Plus、Pinia、Vue Router |
| 数据库 | MySQL 8.x |
| ORM | Drizzle ORM |
| 缓存 | Redis |
| 文件/对象存储 | 本地上传目录、S3/RustFS 兼容对象存储 |
| 构建工具 | pnpm、Vite、Nuxt |

## 功能模块

- 用户端：影视内容展示、栏目/分类、短视频、会员中心、收藏/点赞/评论、订单与钱包。
- 后台系统：登录、权限菜单、用户/角色/部门、字典、系统配置、文件配置。
- 活动管理：头条精选、沉浸式编辑、活动内容区块。
- 资源导航：资源卡片与导航配置。
- 人才科研：专家库管理、课题时空管理、专家与论文/课题/专利关联。
- 论文著作与成果：书籍导入、论文导入、专利导入、导入历史、Excel 模板、对象存储文件绑定。
- 基础数据：国家、语言、分类、级别、职业等基础配置。
- 自动化辅助：图表生成、词云等静态/管理端辅助页面。

## 目录结构

```text
CMS-Nuxt/
├── README.md                         # 项目说明
├── package.json                      # 根目录元信息
├── pnpm-lock.yaml                    # pnpm 锁文件
├── nginx.conf                        # Nginx 部署示例
├── bin/
│   └── deploy.js                     # 单服务部署辅助脚本
├── chunyu-cms-admin/                 # 后台管理端，Vue 3 + Vite
│   ├── package.json                  # 管理端依赖与脚本
│   ├── vite.config.js                # Vite 配置，含 dev-api 代理
│   ├── public/                       # 静态资源
│   ├── html/                         # HTML 模板/静态文件
│   ├── bin/                          # 管理端构建辅助脚本
│   ├── vite/
│   │   └── plugins/                  # Vite 插件配置
│   └── src/
│       ├── api/                      # 后台接口请求封装
│       │   ├── activityManagement/   # 活动管理 API
│       │   ├── paperAchievement/     # 论文著作/书籍导入 API
│       │   ├── system/               # 系统管理 API
│       │   └── talentResearch/       # 人才科研 API
│       ├── assets/                   # 图片、图标、全局样式
│       │   ├── icons/svg/            # SVG 图标
│       │   ├── images/               # 图片资源
│       │   ├── logo/                 # Logo 资源
│       │   └── styles/               # SCSS/CSS 样式
│       ├── components/               # 通用业务组件
│       │   ├── ContentBlocks/        # 内容区块编辑组件
│       │   ├── FileUpload/           # 文件上传
│       │   ├── ImageUpload/          # 图片上传
│       │   ├── RichTextEditor/       # 富文本编辑器
│       │   ├── TablePro/             # 表格封装
│       │   ├── VideoUpload/          # 视频上传
│       │   └── ...                   # 面包屑、分页、工具栏等组件
│       ├── directive/                # Vue 指令
│       │   ├── common/               # 通用指令
│       │   └── permission/           # 权限指令
│       ├── layout/                   # 后台布局
│       │   └── components/           # 侧边栏、标签栏、顶部导航等
│       ├── plugins/                  # 前端插件注册
│       ├── router/                   # 路由与动态菜单处理
│       ├── store/                    # Pinia 状态管理
│       │   └── modules/              # 用户、权限、应用配置等模块
│       ├── utils/                    # 请求、鉴权、格式化等工具
│       └── views/                    # 后台页面
│           ├── activityManagement/   # 活动管理
│           │   ├── headlineFeatured/ # 头条精选
│           │   └── immersiveEditor/  # 沉浸式编辑器
│           ├── automationTools/      # 自动化辅助
│           │   ├── chartGenerator/   # 图表生成
│           │   └── wordCloud/        # 词云
│           ├── paperAchievement/     # 论文著作与成果
│           │   ├── bookImport/       # 书籍导入
│           │   ├── components/       # 导入页面通用组件
│           │   ├── paperImport/      # 论文导入
│           │   ├── patentImport/     # 专利导入
│           │   └── simulationEntry/  # 仿真录入旧入口
│           ├── resource/             # 资源导航
│           ├── system/               # 系统管理
│           ├── systemBaseConfig/     # 系统基础配置
│           └── talentResearch/       # 人才与科研管理
│               ├── expertLibrary/    # 专家库
│               └── topicSpaceTime/   # 课题时空
├── chunyu-cms-web/                   # 用户端与后端服务，Nuxt 4
│   ├── package.json                  # Web/服务端依赖与脚本
│   ├── nuxt.config.ts                # Nuxt、运行时配置、Redis、数据库配置
│   ├── pm2.config.cjs                # PM2 部署配置
│   ├── chunyu-cms-v2.sql             # 初始数据库 SQL
│   ├── app/                          # Nuxt 用户端应用
│   │   ├── assets/                   # 用户端静态资源与样式
│   │   ├── components/               # 用户端组件
│   │   ├── composables/              # Nuxt composables
│   │   ├── layouts/                  # 页面布局
│   │   ├── middleware/               # 前端路由中间件
│   │   ├── pages/                    # 用户端页面路由
│   │   ├── plugins/                  # Nuxt 插件
│   │   └── utils/                    # 用户端工具函数
│   ├── server/                       # Nitro 后端
│   │   ├── api/                      # API 路由
│   │   │   ├── admin/                # 后台接口
│   │   │   │   ├── activity/         # 活动管理接口
│   │   │   │   ├── common/           # 上传等通用接口
│   │   │   │   ├── paperAchievement/ # 论文著作/书籍导入接口
│   │   │   │   ├── system/           # 系统管理接口
│   │   │   │   └── talent/           # 人才科研接口
│   │   │   └── web/                  # 用户端接口
│   │   │       ├── basic/            # 基础数据
│   │   │       ├── column/           # 栏目
│   │   │       ├── member/           # 会员中心
│   │   │       ├── movie/            # 影视内容
│   │   │       ├── short/            # 短视频
│   │   │       └── video/            # 视频资源
│   │   ├── composables/              # 服务端 composables
│   │   ├── contants/                 # 常量与导出列配置
│   │   ├── db/                       # 数据库层
│   │   │   ├── columns.helpers.ts    # 通用字段定义
│   │   │   ├── query.helper.ts       # 查询辅助函数
│   │   │   ├── migrations/           # Drizzle/手写 SQL 迁移
│   │   │   └── schema/               # Drizzle 表结构
│   │   │       ├── admin/            # 后台业务表
│   │   │       ├── basic/            # 基础数据表
│   │   │       ├── member/           # 会员相关表
│   │   │       ├── monitor/          # 监控日志表
│   │   │       ├── movie/            # 影视相关表
│   │   │       ├── paperAchievement/ # 论文著作/书籍导入表
│   │   │       ├── shorts/           # 短视频表
│   │   │       ├── system/           # 系统权限表
│   │   │       ├── talent/           # 人才科研表
│   │   │       └── index.ts          # schema 汇总导出
│   │   ├── middleware/               # 服务端中间件
│   │   ├── plugins/                  # 服务端插件，如数据库初始化
│   │   ├── routes/                   # 自定义 Nitro routes
│   │   ├── services/                 # 业务服务层
│   │   │   ├── admin/                # 后台业务服务
│   │   │   │   ├── activity/         # 活动管理服务
│   │   │   │   ├── common/           # 通用上传服务
│   │   │   │   ├── paperAchievement/ # 书籍导入与对象存储服务
│   │   │   │   ├── system/           # 系统管理服务
│   │   │   │   └── talent/           # 人才科研服务
│   │   │   ├── basic/                # 基础数据服务
│   │   │   ├── common/excel/         # Excel 导入导出服务
│   │   │   ├── member/               # 会员业务服务
│   │   │   ├── movie/                # 影视业务服务
│   │   │   └── short/                # 短视频服务
│   │   └── utils/                    # 数据库、响应、上传等工具
│   ├── public/                       # Nuxt public 静态资源
│   │   ├── images/                   # 公共图片
│   │   └── uploads/                  # public 下上传资源
│   ├── uploads/                      # 本地上传目录
│   ├── i18n/locales/                 # 国际化文案
│   ├── types/api/                    # API 类型声明
│   ├── shared/                       # 前后端共享代码
│   └── db/migrations/                # 旧/独立 SQL 迁移目录
├── docs/                             # 项目文档与开发计划
│   ├── rules/                        # 协作规范
│   ├── testing/                      # 测试计划与报告
│   ├── 后台静态页面-新中医大/       # 静态原型/页面资料
│   ├── 数据库字段规划.md
│   ├── 项目需求.md
│   ├── 项目需求分析.md
│   ├── 开发计划.md
│   ├── 专家库管理开发计划.md
│   ├── 课题时空管理开发计划.md
│   └── 书籍导入开发计划.md
└── skills/                           # 本地辅助技能/规范
    └── git-commit-convention/
```

## 环境要求

- Node.js：后端/用户端要求 `>= 20.19.0`，管理端要求 `>= 18.16.0`，建议统一使用 Node 20。
- pnpm：`>= 8.9.2`。
- MySQL：8.x。
- Redis：7.x。
- 可选：PM2、Nginx、RustFS 或其他 S3 兼容对象存储。

## 环境变量

后端配置可参考 `chunyu-cms-web/.env.example`，实际运行配置写入 `chunyu-cms-web/.env`：

```dotenv
DATABASE_USERNAME=root
DATABASE_PASSWORD=123456
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_DB=chunyu-cms-v2

JWT_SECRET=

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=86400

# Runtime
IS_DEMO_ENVIRONMENT=false
SERVER_HOST=http://localhost:3000
IMG_HOST=http://localhost:3000
ANTI_DEBUG_ENABLED=true

# RustFS / S3-compatible object storage
PUBLIC_STORAGE_PROVIDER=rustfs
PUBLIC_STORAGE_REGION=auto
PUBLIC_STORAGE_ENDPOINT=
PUBLIC_STORAGE_ACCESS_KEY_ID=
PUBLIC_STORAGE_SECRET_ACCESS_KEY=
PUBLIC_STORAGE_BUCKET_NAME=
PUBLIC_STORAGE_FORCE_PATH_STYLE=true

# Baidu Analytics
BAIDU_STATISTICS_ID=
```

该项目当前不需要微信支付和邮件发送能力，因此示例配置不包含 `WECHAT_PAY_*`、`USER_EMAIL_SERVICE`、`FORM_USER_EMAIL`、`FORM_USER_EMAIL_PASSWORD` 等变量。

管理端开发代理可写入 `chunyu-cms-admin/.env.development`：

```dotenv
VITE_API_PROXY_TARGET=http://localhost:3000
```

默认情况下，管理端会把 `/dev-api` 代理到 `http://localhost:3000/api/admin`。

## 数据库初始化

1. 创建 MySQL 数据库：

```sql
CREATE DATABASE `chunyu-cms-v2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 导入初始 SQL：

```shell
mysql -u root -p chunyu-cms-v2 < chunyu-cms-web/chunyu-cms-v2.sql
```

3. 如需应用后续迁移，按顺序执行：

```shell
mysql -u root -p chunyu-cms-v2 < chunyu-cms-web/server/db/migrations/0017_create_talent_tables.sql
mysql -u root -p chunyu-cms-v2 < chunyu-cms-web/server/db/migrations/0018_create_topic_table.sql
mysql -u root -p chunyu-cms-v2 < chunyu-cms-web/server/db/migrations/0019_create_book_import_tables.sql
mysql -u root -p chunyu-cms-v2 < chunyu-cms-web/server/db/migrations/0020_add_paper_patent_import_menus.sql
```

已有数据库请根据 `chunyu-cms-web/server/db/migrations/` 的文件编号顺序检查是否已执行。

## 本地开发

### 安装依赖

根目录已有统一锁文件，但两个子项目各自有脚本。建议分别安装：

```shell
cd chunyu-cms-web
pnpm install

cd ../chunyu-cms-admin
pnpm install
```

### 启动后端和用户端

```shell
cd chunyu-cms-web
pnpm dev
```

默认访问：

- 用户端：http://localhost:3000
- 后端接口：http://localhost:3000/api

### 启动后台管理端

```shell
cd chunyu-cms-admin
pnpm dev
```

默认访问：

- 管理端：http://localhost:4000
- 默认账号：admin
- 默认密码：admin123

如果后端端口不是 `3000`，设置 `VITE_API_PROXY_TARGET` 后再启动管理端。

## 常用脚本

### `chunyu-cms-web`

```shell
pnpm dev            # 启动 Nuxt 开发服务
pnpm build          # 构建生产包
pnpm preview        # 预览构建产物
pnpm lint           # ESLint + Prettier 检查
pnpm lintfix        # 自动格式化并修复 lint
pnpm generate       # 生成 Drizzle migration
pnpm sql-push       # 将 Drizzle schema 推送到数据库
```

### `chunyu-cms-admin`

```shell
pnpm dev            # 启动管理端开发服务
pnpm build:prod     # 构建独立管理端
pnpm build:single   # 构建可放入 Nuxt public/admin 的单服务版本
pnpm preview        # 预览管理端构建产物
pnpm test:unit      # 运行单元测试
```

## 数据库字段与后端开发入口

- Drizzle schema：`chunyu-cms-web/server/db/schema`
- schema 汇总入口：`chunyu-cms-web/server/db/schema/index.ts`
- 通用字段：`chunyu-cms-web/server/db/columns.helpers.ts`
- SQL 迁移：`chunyu-cms-web/server/db/migrations`
- 后台 API：`chunyu-cms-web/server/api/admin`
- 用户端 API：`chunyu-cms-web/server/api/web`
- 业务服务：`chunyu-cms-web/server/services`

新增表时通常需要：

1. 在 `server/db/schema/[module]/` 新增 Drizzle schema。
2. 在 `server/db/schema/index.ts` 汇总导出。
3. 新增或生成 `server/db/migrations/*.sql`。
4. 在 `server/services/` 添加业务服务。
5. 在 `server/api/admin` 或 `server/api/web` 添加接口。
6. 在 `chunyu-cms-admin/src/api` 和 `views` 接入后台页面。

## 构建与部署

### 分离部署

构建后端/用户端：

```shell
cd chunyu-cms-web
pnpm build
```

构建管理端：

```shell
cd chunyu-cms-admin
pnpm build:prod
```

后端可通过 PM2 启动：

```shell
cd chunyu-cms-web
pm2 start pm2.config.cjs
```

Nginx 可参考根目录 [nginx.conf](./nginx.conf)。典型部署方式：

- `/` 代理到 Nuxt 服务。
- `/uploads` 指向本地上传目录或由对象存储/CDN 承载。
- 管理端独立域名指向 `chunyu-cms-admin/dist`。
- 管理端 `/api/` 反向代理到 Nuxt 后端 `/api/`。

### 单服务部署

如果希望管理端挂载在 Nuxt 服务下：

```shell
cd chunyu-cms-admin
pnpm build:single

cd ..
node bin/deploy.js
```

部署后访问：

- 用户端：http://localhost:3000/
- 管理端：http://localhost:3000/admin/

## 代码提交建议

项目适合按功能边界拆分提交，例如：

- `feat: add talent research management`
- `feat: add paper achievement imports`
- `feat: register research and import admin modules`
- `docs: update project readme`

提交前建议执行：

```shell
git diff --check
git status --short
```

如改动涉及前端页面，建议至少运行对应项目的构建或单元测试。
