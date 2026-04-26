# 图表生成测试报告

## 测试结论

- 6.2 图表生成已完成自动化测试、构建验证和人工主链路验收，可以收口。

## 修改文件清单

### 后端文件

- `chunyu-cms-web/server/services/admin/paper/paper.services.ts`
- `chunyu-cms-web/server/services/admin/paper/paperStatistics.helpers.ts`
- `chunyu-cms-web/server/api/admin/paper/statistics/yearly-count.get.ts`

### 前端文件

- `chunyu-cms-admin/src/api/automationTools/chartGenerator.js`
- `chunyu-cms-admin/src/views/automationTools/chartGenerator/index.vue`
- `chunyu-cms-admin/src/views/automationTools/chartGenerator/utils.ts`

### 测试文件

- `chunyu-cms-admin/src/views/automationTools/chartGenerator/index.test.ts`

## 新增接口说明

- `GET /api/admin/paper/statistics/yearly-count`

返回格式：

```json
{
  "list": [
    { "year": 2022, "count": 1 }
  ]
}
```

统计口径：

- 数据来源：`paper.publish_year`
- 只统计 `del_flag = '0'`
- `publish_year` 为空不计入
- 不区分 `status`
- 不区分 `isFeatured`
- 按年份升序返回

## 自动化测试结果

执行命令：

```bash
cd chunyu-cms-admin
pnpm test:unit -- src/views/automationTools/chartGenerator/index.test.ts
pnpm test:unit -- src/views/paperAchievement/bookImport/index.test.ts
pnpm test:unit -- src/views/automationTools/wordCloud/index.test.ts
pnpm build:prod

cd ../chunyu-cms-web
pnpm build
```

测试摘要：

- 单测结果：`7 files / 35 tests passed`
- 前端构建通过
- 后端构建通过
- 现有 warning 不阻塞本期收口

覆盖摘要：

- 6.2 图表生成：
  - 后端按年份聚合
  - `publish_year` 为空不计入
  - `del_flag = '1'` 不计入
  - 结果按年份升序
  - 前端映射为折线图和表格
  - 空数据状态
- 5.1 回归：
  - `paper/page` 页面单测通过
- 6.1 回归：
  - 词云单测通过

构建摘要：

- `pnpm build:prod` 通过
- `pnpm build` 通过
- 现有 warning 包括前端 chunk size、`/images/bg.jpg` 运行时解析、`@nuxt/image` 的 `sharp binaries` 提示
- 以上 warning 均不是本期 6.2 引入

## 人工验收结果

| 验收项 | 结果 |
| --- | --- |
| 进入“自动化辅助 > 图表生成” | 通过 |
| 页面显示“历年论文数量统计” | 通过 |
| 页面加载后展示折线图 | 通过 |
| 图表下方展示年份 / 论文数量表格 | 通过 |
| 点击“刷新图表”可重新拉取数据 | 通过 |
| `publishYear` 为空的论文不计入统计 | 通过 |
| 逻辑删除论文不计入统计 | 通过 |
| 5.1 论文数据导入页仍正常 | 通过 |
| 6.1 词云页仍正常 | 通过 |

## 已知遗留问题

- 只做历年论文数量一张固定折线图
- 不支持多图表配置
- 不支持导出图片/PDF
- 不支持拖拽配置
- 大量论文缺少 `publish_year` 时图表数据会偏少
- 未做全量 E2E

## 是否阻塞

- 上述遗留问题不阻塞本期收口

原因：

- 本期范围仅为基于 `paper.publish_year` 的历年论文数量统计图
