# 词云功能测试报告

## 测试结论

- 本期“自动化辅助 > 词云”最小可用版本可以收口
- 已完成最小自动化测试、页面构建验证、后端构建验证和人工验收清单整理
- 未做全量 E2E，符合本期范围约束

## 收口结论

- 当前词云功能已满足本期最小交付目标
- 全部论文模式、单篇论文模式、权重保存回显、全库聚合同步和字号变化均已验证通过
- 当前唯一未单独验证项为“无明细关键词时从 `paper.keywords` 拆分默认权重”
- 该未测项不阻塞本期功能收口

## 功能范围

- 后台词云页面改造为真实论文数据驱动
- 支持展示全部论文关键词汇总词云
- 支持查看单篇论文关键词
- 支持人工调整单篇论文关键词权重
- 支持保存后刷新回显
- 支持按权重控制词云字号

## 非本期范围

- 不做完整论文 CRUD
- 不做论文新增/编辑页面
- 不改“书籍导入 / 仿真录入”页面
- 不改论文著作与成果管理模块
- 不做复杂 NLP 自动分词
- 不做全量 E2E

## 已完成自动化测试

### 词云页面与辅助逻辑测试

测试文件：

- `chunyu-cms-admin/src/views/automationTools/wordCloud/index.test.ts`

测试命令：

```bash
pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts
```

测试结果：

- 5/5 通过

覆盖能力：

- 关键词拆分去重
- 单篇关键词查询优先级
- 全库关键词聚合
- 前端保存 payload 构建
- 词云数据映射
- 保存后重新拉取并回显

### 相关回归测试

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/blockUtils.test.ts
pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/scenePersistence.test.ts
pnpm test:unit -- src/views/activityManagement/headlineFeatured/index.test.ts
```

说明：

- 本次未修改以上功能源码
- 在执行词云测试时，这些既有测试也一并通过

## 构建验证

### 后台前端构建

命令：

```bash
cd chunyu-cms-admin
pnpm build:prod
```

结果：

- 通过

### Nuxt 后端构建

命令：

```bash
cd chunyu-cms-web
pnpm build
```

结果：

- 通过

说明：

- 构建过程中存在既有警告：`/images/bg.jpg` 在构建时未解析，将在运行时解析
- 该警告不是本次词云功能引入

## 数据库与接口验证结论

- 已新增 `paper` 最小表
- 已新增 `paper_keyword` 最小表
- 已新增最小初始化论文数据
- 已新增词云页面所需最小接口：
  - `GET /api/admin/paper/list`
  - `GET /api/admin/paper/:id`
  - `GET /api/admin/paper/:id/keywords`
  - `PUT /api/admin/paper/:id/keywords`
  - `GET /api/admin/paper/keywords/cloud`

## 人工验收清单

| 验收项 | 结果 |
| --- | --- |
| 进入“自动化辅助 > 词云”页面 | 通过 |
| 默认显示全部论文词云 | 通过 |
| 全部论文关键词聚合列表显示 | 通过 |
| 初始化数据库后刷新页面恢复正常展示 | 通过 |
| 切换单篇论文模式 | 通过 |
| 选择单篇论文后显示关键词明细 | 通过 |
| 无关键词明细时从 `paper.keywords` 拆分默认权重 | 未测 |
| 修改权重并保存 | 通过 |
| 刷新页面后权重回显 | 通过 |
| 全库词云按 `paper_keyword` 聚合显示 | 通过 |
| 全库聚合权重同步变化 | 通过 |
| 权重高的词显示更大 | 通过 |

已确认现象：

- 初始化 `paper` 与 `paper_keyword` 表前，页面请求报错：`Table 'chunyu_cms_v2.paper_keyword' doesn't exist`
- 执行 `0017_create_paper_word_cloud_tables.sql` 后，数据库已写入：
  - `paper`：3 条
  - `paper_keyword`：9 条
- 页面刷新后，“全部论文”模式可正常展示关键词聚合数据
- 单篇论文模式切换、关键词明细展示、权重保存、刷新回显、全库聚合同步和字号变化均已人工验证通过
- “无明细时从 `paper.keywords` 拆分默认权重”本轮未单独构造空明细论文进行验证
- 当前人工确认来源包含：
  - 后台页面实际打开结果
  - 控制台报错修复前后对比
  - 数据初始化后的页面刷新结果
  - 单篇论文模式人工操作验证结果

## 未覆盖项

- 未做全量 E2E
- 未覆盖多用户同时编辑同一篇论文关键词
- 未覆盖超大关键词量下的前端渲染性能
- 未覆盖后台真实权限差异下的菜单可见性验证
- 未单独覆盖“无明细关键词时从 `paper.keywords` 拆分”的人工验收

## 是否阻塞

- 以上未覆盖项不阻塞本期收口

原因：

- 本期目标是交付词云最小可用版本，不包含完整论文管理与复杂联调场景

## 已知遗留问题

- 全库词云仅按 `paper_keyword` 聚合；如果某篇论文只有 `paper.keywords` 而还未形成 `paper_keyword` 明细，则不会自动进入全库聚合
- 词云颜色采用轻量随机配色，重复渲染时颜色可能变化，但权重和字号逻辑不受影响
- 当前人工验收清单已整理，仍需在真实联调环境手动执行并回填结果
