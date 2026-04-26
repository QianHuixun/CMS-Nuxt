# 测试文档索引

## 沉浸式编排

- `immersive-editor-test-plan.md`
- `immersive-editor-test-report.md`
- `immersive-editor-integration-checklist.md`

说明：

- 沉浸式编排已完成单元测试
- 沉浸式编排未做全量 E2E 测试
- 沉浸式编排主链路已通过人工联调与手动验收

## 头条精选

- `headline-featured-test-plan.md`
- `headline-featured-test-report.md`

说明：

- 头条精选已完成逻辑单元测试
- 头条精选已完成页面交互层组件测试
- 头条精选未做全量 E2E 测试

## 词云功能

- `word-cloud-test-report.md`

说明：

- 词云功能已完成最小自动化测试
- 词云功能已完成前后端构建验证
- 词云功能未做全量 E2E 测试

## 论文数据导入

- `paper-import-test-plan.md`
- `paper-import-test-report.md`

说明：

- 论文数据导入最小版已完成最小自动化测试
- 论文数据导入最小版已完成前后端构建验证
- 论文数据导入最小版未做全量 E2E 测试
- 当前需额外确认 `0018_extend_paper_for_import_and_chart.sql` 是否已在目标数据库执行

## 图表生成

- `chart-generator-test-plan.md`
- `chart-generator-test-report.md`

说明：

- 图表生成最小版已完成最小自动化测试
- 图表生成最小版已完成前后端构建验证
- 图表生成最小版未做全量 E2E 测试

## 目录说明

- `immersive-editor-*` 文档仅用于沉浸式编排功能
- `headline-featured-*` 文档仅用于头条精选功能
- 测试目录总入口统一放在本文件

## 测试文档约束

- 从当前阶段开始，每个独立功能默认补充测试文档
- 测试文档默认至少包含：
  - `<feature>-test-plan.md`
  - `<feature>-test-report.md`
- 如功能存在真实联调链路，可补充联调清单或验收清单
- 新功能测试文档创建后，应同步更新本索引文件
- 不同功能的测试内容不得混写到其他功能测试文档中
- 未执行的测试项必须明确标注“未做”或“未覆盖”
- 测试报告需写清：
  - 功能范围
  - 非本期范围
  - 自动化测试范围
  - 是否做了单元测试
  - 是否做了组件测试
  - 是否做了 E2E
  - 人工验收范围
  - 实际测试命令与结果
  - 未覆盖项
  - 是否阻塞收口
