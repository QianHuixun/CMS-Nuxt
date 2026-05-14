# 基于 CSV 人才队伍数据修改 mock 数据计划

## 背景与已确认信息

1. 用户要求读取 `/src/mock/index.js` 与 `副本待收集资料5.13.csv`，并基于“人才队伍”中的数据修改 mock 数据。
2. 当前仓库中未找到 `/Users/hjx/Desktop/CMS-Nuxt/src/mock/index.js`，实际匹配到的 mock 文件为：`/Users/hjx/Desktop/CMS-Nuxt/frontend/mock/index.js`。
3. `frontend/mock/index.js` 中存在 `talents` 数组，当前为占位人才数据，字段包括：
   - `id`
   - `name`
   - `avatar`
   - `title`
   - `researchAreas`
   - `institution`
4. CSV 表头包含：
   - `姓名`
   - `职务`
   - `职称`
   - `核心研究方向`
   - `简介（30字内）`
   - `详细介绍（300字以内）`
   - `照片`
   - `课题`
   - `论文`
   - `专著`
   - `专利`
   - `软著`
5. CSV 中每个人才通常由一行带姓名的主记录开始，后续多行通过空姓名延续该人才的课题、论文、专著、专利、软著等成果数据。

## 目标

将 `frontend/mock/index.js` 中现有 `talents` mock 数据从占位内容替换为 CSV 中“人才队伍”真实数据，并尽量保持现有前端消费字段兼容。

## 字段映射方案

### 保持现有字段

现有前端可能依赖 `talents` 的字段，因此计划保留以下字段：

- `id`：按 CSV 中人才出现顺序从 1 递增生成。
- `name`：对应 CSV `姓名`。
- `avatar`：根据 CSV `照片` 字段判断。
  - 如果为 `√`，暂使用现有占位资源 `asset('talents/expert-photo.png')`。
  - 如果为空，也先使用同一占位资源，避免前端图片缺失。
- `title`：优先组合 CSV `职务` 与 `职称`。
  - 若二者都有，格式为 `职务 / 职称`。
  - 若只有其中之一，则使用已有值。
- `researchAreas`：由 CSV `核心研究方向` 拆分生成数组。
  - 优先按 `、`、`,`、`，`、`;`、`；` 等分隔符拆分。
  - 如无法拆分，则作为单项数组。
- `institution`：保持为 `成都中医药大学`，与当前 mock 数据一致。

### 建议新增字段

为承载 CSV 中更完整的人才信息，计划在每个人才对象中新增以下字段：

- `position`：CSV `职务`。
- `professionalTitle`：CSV `职称`。
- `summary`：CSV `简介（30字内）`。
- `description`：CSV `详细介绍（300字以内）`。
- `projects`：聚合该人才所有非空 `课题`。
- `papers`：聚合该人才所有非空 `论文`。
- `books`：聚合该人才所有非空 `专著`。
- `patents`：聚合该人才所有非空 `专利`。
- `softwareCopyrights`：聚合该人才所有非空 `软著`。

## 实施步骤

1. 再次完整读取 `frontend/mock/index.js` 中 `talents` 数组及其下游接口导出逻辑，确认 talents 数据是否只在该数组中维护，避免遗漏关联字段。
   - 验证方式：搜索 `talents` 的引用与 mock API 返回结构。

2. 解析 `副本待收集资料5.13.csv` 的人才数据。
   - 以非空 `姓名` 行作为一个新人才的开始。
   - 将后续空 `姓名` 行中的 `课题`、`论文`、`专著`、`专利`、`软著` 追加到最近一个人才对象。
   - 跳过完全空白行。
   - 保留字段中的换行与中文标点，避免破坏原始介绍内容。
   - 验证方式：统计解析后人才数量与 CSV 中非空姓名数量一致。

3. 将解析结果整理为符合 `frontend/mock/index.js` 风格的 JavaScript 数组字面量。
   - 使用单引号。
   - 保持当前缩进与对象格式。
   - 不添加额外注释。
   - 验证方式：确保生成的数据是合法 JavaScript 语法。

4. 替换 `frontend/mock/index.js` 中现有 `const talents = [...]` 内容。
   - 仅替换 `talents` 数组。
   - 不修改 databases、tools、wordClouds、projects 等其他 mock 数据。
   - 验证方式：检查 diff，确认变更范围只集中在 talents 数据。

5. 检查前端是否存在只读取旧字段的页面。
   - 若只读取 `name`、`avatar`、`title`、`researchAreas`、`institution`，新增字段不会破坏兼容性。
   - 若已有详情页可展示更多字段，再确认字段名是否需要适配。
   - 验证方式：搜索 `researchAreas`、`summary`、`description`、`projects` 等引用。

6. 运行项目可用的校验命令。
   - 先查看 `package.json` 中 scripts。
   - 如存在 lint/typecheck/build 命令，按项目约定运行。
   - 验证方式：命令通过；如失败，记录失败原因并修复与本次改动相关的问题。

## 风险与处理

1. CSV 中存在跨行字段，直接按文本行解析可能误判记录边界。
   - 处理：实施时优先使用可靠 CSV 解析方式，或基于已读取内容人工核对关键跨行字段。

2. CSV 中部分人才缺少职称、简介、详细介绍或照片标记。
   - 处理：缺失字段保留为空字符串或空数组，避免生成 `undefined`。

3. 前端可能当前只支持简化人才卡片字段。
   - 处理：保留旧字段，新增字段只作为扩展数据，不主动改页面逻辑，除非后续确认需要展示。

## 预期结果

完成后，`frontend/mock/index.js` 中 `talents` 数组将由 CSV 中的真实人才队伍数据构成，且保持现有 mock API 数据结构兼容。