# 新中医大后台静态页面

本文件夹包含新中医大 CMS 后台的静态页面设计稿，遵循统一的 UI 风格规范。

## 目录结构

```
后台静态页面-新中医大/
├── 后台静态页面导航.html      # 首页导航
├── static-admin-shell.js     # 共享 JS 框架
├── static-admin-theme.css    # 主题样式
├── 系统基础配置管理/
│   ├── 导航配置.html
│   └── 屏保配置.html
├── 人才与对应科研管理/
│   ├── 专家库管理.html
│   └── 课题时空管理.html
├── 论文著作与成果管理/
│   ├── 书籍导入.html
│   └── 仿真录入.html
├── 自动化辅助/
│   ├── 词云.html
│   └── 图表生成.html
└── 活动管理/
    ├── 沉浸式编辑.html
    └── 头条精选.html
```

## UI 风格

- **配色**: 深蓝灰侧边栏 (#1f2747) + 白色内容区
- **圆角**: 大圆角设计 (rounded-[28px], rounded-3xl)
- **字体**: PingFang SC / Microsoft YaHei
- **框架**: Tailwind CSS
- **色调**: sky / emerald / amber / violet 等语义化配色

## 使用方式

直接在浏览器中打开 `后台静态页面导航.html` 即可预览所有页面。
