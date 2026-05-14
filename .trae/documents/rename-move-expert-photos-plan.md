# 重命名并移动专家照片 & 更新 mock 数据计划

## 背景

根目录散落着 12 位专家的个人照片，目前 mock 数据中所有 17 位专家统一使用默认占位图 `expert-photo.png`。需要将这些真实照片重命名、移动到正确目录，并更新 mock 数据让前台展示真实照片。同时，没有照片的 5 位专家直接从 mock 数据中删除。

## 当前状态

### 根目录图片（12张专家照片，1张活动图）
| 文件名 | 对应专家 |
|--------|---------|
| 杨静-个人照片.jpeg | 杨静 |
| 柳长华-个人照片.jpg | 柳长华 |
| 温川飙-个人照片.jpg | 温川飙 |
| 任玉兰-个人照片.jpeg | 任玉兰 |
| 章红梅-个人照片.jpg | 章红梅 |
| 王丽-个人照片.jpg | 王丽 |
| 陈菊-个人照片.png | 陈菊 |
| 闵新-个人照片.jpg | 闵新 |
| 赵智慧-个人照片.jpg | 赵智慧 |
| 谭超群-个人照片.png | 谭超群 |
| 赖雪瑜-个人照片.jpg | 赖雪瑜 |
| 雷霆-个人照片.jpg | 雷霆 |

### 专家与照片对应关系
- **有照片（12人）**：杨静、柳长华、温川飙、任玉兰、章红梅、王丽、陈菊、闵新、赵智慧、谭超群、赖雪瑜、雷霆
- **无照片（5人）**：赵琼、林英、张肖瑾、毕洋、杨恺 → **从 mock 数据中直接删除**

### 影响范围分析

删除 5 位专家只影响 `frontend/mock/index.js`，前端 Vue 组件（ExpertDetailView.vue、AcademicView.vue）通过 `fetchTalents()` 动态获取列表，删除后自动不再展示。后端管理系统通过独立数据库 API 运行，不受 mock 数据影响。无需修改任何 Vue 组件代码。

## 执行步骤

### 步骤 1：重命名并移动专家照片

将 12 张照片改为拼音命名并移动到 `frontend/public/mock-assets/talents/`：

| 原文件 | 目标文件 |
|--------|---------|
| 杨静-个人照片.jpeg | frontend/public/mock-assets/talents/yang-jing.jpg |
| 柳长华-个人照片.jpg | frontend/public/mock-assets/talents/liu-changhua.jpg |
| 温川飙-个人照片.jpg | frontend/public/mock-assets/talents/wen-chuanbiao.jpg |
| 任玉兰-个人照片.jpeg | frontend/public/mock-assets/talents/ren-yulan.jpg |
| 章红梅-个人照片.jpg | frontend/public/mock-assets/talents/zhang-hongmei.jpg |
| 王丽-个人照片.jpg | frontend/public/mock-assets/talents/wang-li.jpg |
| 陈菊-个人照片.png | frontend/public/mock-assets/talents/chen-ju.jpg |
| 闵新-个人照片.jpg | frontend/public/mock-assets/talents/min-xin.jpg |
| 赵智慧-个人照片.jpg | frontend/public/mock-assets/talents/zhao-zhihui.jpg |
| 谭超群-个人照片.png | frontend/public/mock-assets/talents/tan-chaoqun.jpg |
| 赖雪瑜-个人照片.jpg | frontend/public/mock-assets/talents/lai-xueyu.jpg |
| 雷霆-个人照片.jpg | frontend/public/mock-assets/talents/lei-ting.jpg |

> 扩展名统一为 .jpg，浏览器按 MIME 识别不受影响。

### 步骤 2：更新 mock 数据 — 删除无照片专家

在 `frontend/mock/index.js` 中删除以下 5 位专家的数据条目：
- 赵琼（id: 4, 第 125-141 行）
- 林英（id: 6, 第 159-175 行）
- 张肖瑾（id: 10, 第 227-243 行）
- 毕洋（id: 14, 第 295-311 行）
- 杨恺（id: 17, 第 346-362 行）

保留原有 id 不变（不重新编号），剩余 12 位专家 id 为：1, 2, 3, 5, 7, 8, 9, 11, 12, 13, 15, 16。

### 步骤 3：更新 mock 数据 — 修改有照片专家的 avatar

修改 `frontend/mock/index.js` 中保留的 12 位专家的 `avatar` 字段：

| 专家（id） | 新 avatar 值 |
|-----------|-------------|
| 杨静 (1) | `asset('talents/yang-jing.jpg')` |
| 柳长华 (2) | `asset('talents/liu-changhua.jpg')` |
| 温川飙 (3) | `asset('talents/wen-chuanbiao.jpg')` |
| 任玉兰 (5) | `asset('talents/ren-yulan.jpg')` |
| 章红梅 (7) | `asset('talents/zhang-hongmei.jpg')` |
| 王丽 (8) | `asset('talents/wang-li.jpg')` |
| 陈菊 (9) | `asset('talents/chen-ju.jpg')` |
| 闵新 (11) | `asset('talents/min-xin.jpg')` |
| 赵智慧 (12) | `asset('talents/zhao-zhihui.jpg')` |
| 谭超群 (13) | `asset('talents/tan-chaoqun.jpg')` |
| 赖雪瑜 (15) | `asset('talents/lai-xueyu.jpg')` |
| 雷霆 (16) | `asset('talents/lei-ting.jpg')` |

### 步骤 4：清理旧的无用文件

删除 `frontend/public/mock-assets/talents/` 中不再需要的旧 mock 图片：
- `zhou-ming.jpg`
- `li-qing.jpg`
- `chen-wei.jpg`

保留：
- `expert-photo.png`（作为无照片专家的默认图，保留以备将来使用）
- `expert-card-1.png`、`expert-card-2.png`（卡片背景）

### 步骤 5：验证
- 确认 12 张照片已移动到 `frontend/public/mock-assets/talents/` 并使用拼音命名
- 确认 mock 数据中仅保留 12 位专家且 avatar 路径正确
- 确认根目录不再有散落的专家照片
- 确认 `expert-photo.png` 默认图未被删除（保留备用的合理性）

## 不需要修改的文件
- `frontend/src/views/ExpertDetailView.vue` — 通过 `fetchTalents()` 动态获取列表，删除后自动适配
- `frontend/src/views/AcademicView.vue` — 同上，动态获取无需修改
- `chunyu-cms-web/` 后端 — 使用独立数据库，不受 mock 数据影响
- `chunyu-cms-admin/` 管理后台 — 通过后端 API 操作，不受 mock 数据影响
- `副本待收集资料5.13.csv` — 原始数据文件，保留不删
