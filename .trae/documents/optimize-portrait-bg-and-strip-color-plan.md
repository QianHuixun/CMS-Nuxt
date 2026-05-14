# 优化专家详情页图片背景模糊 + 卡片文字颜色计划

## 需求理解

1. **图片作为模糊背景**：将专家照片作为背景层，放在主图背后，施加模糊（blur）和渐变淡出效果
2. **主图完整显示在上方**：`object-fit: contain`，不受影响
3. **下方 strip 卡片文字颜色改为** **`#842130`**：姓名、职位颜色统一改为深红色
4. **不需要取色**：直接使用图片自身作为背景，模糊处理即可

## 执行步骤

### 步骤 1：恢复 portrait 为 contain 并移除 mask

修改 `.portrait`：

* `object-fit: cover` → `object-fit: contain`

* 删除 `mask-image` 和 `-webkit-mask-image` 两行

* 保留 `transition: transform 0.45s ease`

### 步骤 2：添加图片模糊背景层

在 `portrait-wrap` 中添加图片背景层（用伪元素或增加 img 副本）：

方案：使用 portrait-wrap 的 `::before` 伪元素，同样引用 `currentExpert.photo` 做 background-image，然后施加 blur 和 `mask-image` 渐变淡出。

但由于 CSS 伪元素无法动态获取 Vue 数据源，需要用另一种方式：

**在 portrait-wrap 中添加一个** **`img.portrait-bg`** **作为背景层**：

* 与主图相同的 `:src`

* 绝对定位铺满 portrait-wrap

* 应用 CSS blur 滤镜 + mask 渐变淡出

* `z-index` 低于主图

* `pointer-events: none`

模板改动：

```html
<div class="portrait-wrap">
  <img :src="currentExpert.photo" alt="" class="portrait-bg" aria-hidden="true">
  <img :src="currentExpert.photo" :alt="..." class="portrait">
</div>
```

CSS 改动：

* `.portrait-wrap` 改为 `position: relative`

* `.portrait-bg`：绝对定位，`inset: 0`，`width: 100%`，`height: 100%`，`object-fit: cover`，`filter: blur(20px)`，`z-index: 0`

* `.portrait`：`position: relative`，`z-index: 1`，`object-fit: contain`

* 在 `portrait-bg` 上添加 `mask-image` 渐变（从中心到边缘逐渐淡出到透明）

渐变方向：从中间向四周 radial-gradient 淡出，或左右 linear-gradient 淡出。

用户说"两端"，所以应该是左右两端渐变延伸：

```
mask-image: linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%);
-webkit-mask-image: linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%);
```

结合 blur，让图片背景在左右两端被模糊后自然淡出。

### 步骤 3：修改 strip 卡片文字颜色为 #842130

* `.expert-card-copy h2`：`color: #842130`

* `.expert-card-copy p`：`color: #842130`

* `.expert-card-copy span`：`color: #842130`（可用 opacity 0.7 保持层级）

## 不需要修改的文件

* `frontend/mock/index.js` — 无关

* 其他 Vue 组件 — 无关

