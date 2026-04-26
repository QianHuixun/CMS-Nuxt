# 论文数据导入最小版测试计划

## 功能范围

- 基于现有 `paper` 表补充论文导入最小承接能力
- 页面改造“论文著作与成果管理 > 书籍导入”为“论文数据导入”
- 支持论文分页列表
- 支持按标题查询
- 支持按年份查询
- 支持新增论文
- 支持编辑论文
- 支持逻辑删除论文
- 支持设置/取消精选论文
- 保留“批量导入”按钮并以提示弹窗形式预留入口
- 保持 `keywords` 继续供 6.1 词云读取

## 本期不做范围

- 不做专利导入
- 不做课题导入
- 不做真实 Excel/CSV 批量导入
- 不做完整论文管理系统
- 不做全量 E2E
- 不开发 6.2 图表生成
- 不新增图表专用数据表
- 不重构 6.1 词云

## 数据与接口前置条件

- `paper` 表已存在
- `paper_keyword` 表已存在
- 需要在 `paper` 表执行 `0018_extend_paper_for_import_and_chart.sql`
- 执行后 `paper` 表应新增：
  - `publish_year`
  - `is_featured`
- 样例论文应能查到 `publish_year` / `is_featured`

## 自动化测试范围

- 论文分页列表请求与回显
- 标题查询参数传递
- 年份查询参数传递
- 新增论文提交
- 编辑论文回显与提交
- 逻辑删除
- 设置/取消精选
- 6.1 词云回归读取 `keywords`

## 自动化测试命令

```bash
cd chunyu-cms-admin
pnpm test:unit -- src/views/paperAchievement/bookImport/index.test.ts
pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts
```

## 构建验证命令

```bash
cd chunyu-cms-admin
pnpm build:prod

cd ../chunyu-cms-web
pnpm build
```

## 人工验收建议

1. 进入“论文著作与成果管理 > 书籍导入”，确认页面内部显示“论文数据导入”
2. 验证样例论文列表可见
3. 按标题查询论文
4. 按年份查询论文
5. 新增一篇论文并填写摘要、关键词、年份、精选、状态
6. 编辑已存在论文
7. 删除一篇论文
8. 设置与取消精选
9. 点击“批量导入”按钮，确认仅弹出“后续接入”提示
10. 打开 6.1 词云页面，确认论文关键词仍可被读取

## 收口判定

- 若自动化测试通过、前后端构建通过、人工验收通过，且 `0018` 已在目标数据库执行，则本期可收口
- 若 `0018` 未执行，则代码层可收口，数据库层不可收口
