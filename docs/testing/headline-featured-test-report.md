# 头条精选测试报告

## 测试结论

- 本期“头条精选”功能可以收口
- 已完成最小自动化测试、组件交互测试、数据库落库验证和人工主链路验收

## 已完成自动化测试

### headline 逻辑测试

测试文件：

- `chunyu-cms-admin/src/views/activityManagement/utils/headline.test.ts`

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/utils/headline.test.ts
```

测试结果：

- 3/3 通过

覆盖能力：

- `isHeadline` 标志归一化
- 头条页查询参数构建
- 头条优先排序规则

### 组件测试

测试文件：

- `chunyu-cms-admin/src/views/activityManagement/headlineFeatured/index.test.ts`

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/headlineFeatured/index.test.ts
```

测试结果：

- 3/3 通过

### 相关回归测试

测试文件：

- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/utils/blockUtils.test.ts`
- `chunyu-cms-admin/src/views/activityManagement/immersiveEditor/utils/scenePersistence.test.ts`

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/blockUtils.test.ts
pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/scenePersistence.test.ts
```

测试结果：

- `pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/blockUtils.test.ts`
  - 9/9 通过
- `pnpm test:unit -- src/views/activityManagement/immersiveEditor/utils/scenePersistence.test.ts`
  - 6/6 通过

## 数据库与接口验证

- `activity` 表已存在 `is_headline` 字段
- 活动 `222` 的 `is_headline` 已成功写入 `'1'`
- `isHeadline='1'` 查询能命中该活动
- 活动列表支持头条优先排序

## 页面交互层组件测试结果

测试文件路径：

- `chunyu-cms-admin/src/views/activityManagement/headlineFeatured/index.test.ts`

测试命令：

```bash
pnpm test:unit -- src/views/activityManagement/headlineFeatured/index.test.ts
```

通过数量：

- 3

失败数量：

- 0

覆盖能力：

- 已覆盖：头条精选页真实数据展示
- 已覆盖：头条查询逻辑与搜索参数传递
- 已覆盖：取消头条后列表刷新
- 已覆盖：操作成功时成功提示
- 未覆盖：页面交互层设置头条
- 未覆盖：场景卡片头条标签展示
- 未覆盖：操作失败时错误提示或本地状态保护

说明：

- “页面交互层设置头条”和“场景卡片头条标签展示”由人工验收完成
- “失败交互反馈”本期未新增组件测试用例覆盖

## 人工验收结果

| 验收项 | 结果 |
| --- | --- |
| 设置活动为头条 | 通过 |
| 取消活动头条 | 通过 |
| 场景卡片显示头条标签 | 通过 |
| 头条精选页展示头条活动 | 通过 |
| 取消头条后从头条精选页消失 | 通过 |

## 未覆盖项

- 未做全量 E2E
- 未新增前台活动列表页联调
- 未覆盖多用户并发设置头条
- 未覆盖大量活动下的分页/排序性能

## 是否阻塞

- 以上未覆盖项不阻塞本期收口

原因：

- 本期范围为后台头条精选管理、数据落库、后台查询展示和头条优先排序能力

## 后续建议

- 如果后续接入真实前台活动卡片流，需要补充前台列表头条置顶验证
- 如果后续支持多个头条排序管理，再补拖拽排序或排序字段测试
