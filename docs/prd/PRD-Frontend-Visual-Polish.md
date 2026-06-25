# PRD — 校园导航前端视觉去 AI 化升级

## 1. Summary

本次升级针对 `assets/prototype/campus-nav-prototype/` 的静态前端原型，通过**做减法、收紧间距、替换模板化装饰**，降低页面“AI 生成感”，同时修复路径查询页等关键页面的布局不合理问题。升级范围仅限 CSS 与少量 HTML 结构，不引入新框架或依赖。

## 2. Contacts

| 角色 | 姓名 | 说明 |
|---|---|---|
| 产品/设计负责人 | 用户本人 | 提供视觉方向与验收标准 |
| 开发执行 | Claude Code | 负责 CSS/HTML 调整与验证 |
| 算法与数据 | 现有 C + JS 实现 | 保持不动，仅样式层升级 |

## 3. Background

当前原型已经完成 7 页合并为 4 页、主题切换、Dijkstra 查询、数据管理 dialog 等核心功能。但视觉层面仍带有明显的 AI 模板痕迹：巨大的 hero 装饰球、全大写英文 kicker、 oversized 图标、浮夸的距离数字、自指型“课程设计原型”文案等。这些元素让项目看起来像一个通用 SaaS 落地页，而不是一个学生课程设计工具。

同时，query.html 存在明显的布局问题：表单与地图高度错配、三列异常说明卡占用过多垂直空间，导致页面滚动到 1.8 屏，信息密度低。

## 4. Objective

让前端看起来像**一个干净、聚焦、可信赖的学生课程设计工具**，而非通用 AI 模板。

关键结果（SMART）：

- **KR1**: 4 个页面中不再出现全大写英文 kicker 和“课程设计原型”自指文案。
- **KR2**: index.html 与 query.html 在 1511×759 视口下文档高度分别降至 ≤760px 与 ≤1100px。
- **KR3**: stat-card 图标统一 ≤32px，输入框高度统一 44px，距离数字 ≤32px。
- **KR4**: 主题切换、查询、地图高亮、tab、dialog 等功能保持 100% 可用。
- **KR5**: 控制台无新增报错。

## 5. Market Segment(s)

- **主要用户**：中北大学软件学院《数据结构》课程设计评审老师与学生展示者。
- **使用场景**：课程设计说明书配图、课堂演示、代码评审。
- **约束**：
  - 必须保持纯静态 HTML/CSS/JS，不能引入 React/Vue/构建工具。
  - 必须兼容已有亮/暗两套主题。
  - 不能改动 Dijkstra 算法逻辑与数据文件 `routes.json`。

## 6. Value Proposition(s)

- **减少“AI 味”**：去掉模板化装饰，让界面更像手工打磨的课程项目。
- **提升信息密度**：压缩过大的卡片、输入框和空状态，让老师在同一屏内看到更多有效内容。
- **改善布局节奏**：query.html 表单与地图对齐，异常说明不再占用整屏。
- **保留专业感**：参考 Aceternity 中克制的点阵背景与 refined 卡片阴影，提升质感但不浮夸。

## 7. Solution

### 7.1 UX/Prototypes

- **首页 (index.html)**：hero 区高度从 200px 降至 160px，移除径向渐变装饰球，右侧地图容器加入 subtle 点阵背景；三列 stat-card 改为 icon+数字+label 的紧凑单行布局。
- **路径查询 (query.html)**：左侧表单与右侧地图保持同一水平基准；异常说明区从 3 个高卡片改为单行横幅；结果空状态图标缩小。
- **数据管理 (data.html)**：表格容器圆角与最小宽度收紧；侧边栏自指文案移除。
- **系统说明 (docs.html)**：算法页底部 3 个带图标 stat-card 改为扁平 Bento 式文本卡片。

### 7.2 Key Features

| 功能点 | 说明 | 文件 |
|---|---|---|
| 移除 hero 装饰球 | 删除 `.hero::after` 径向渐变 | `css/styles.css` |
| 点阵背景 | 新增 `.bg-dots` 工具类，应用到首页 hero 地图区 | `css/styles.css`, `index.html` |
| 弱化 kicker | 去掉 uppercase/letter-spacing，英文改为中文 | `css/styles.css`, `*.html` |
| 压缩 stat-card | 图标 48px→32px，数字 30px→22px，padding 20px→14px | `css/styles.css` |
| 收紧输入框 | 56px/16px → 44px/10px | `css/styles.css` |
| 简化 route-bar | 去掉渐变与 inset 阴影 | `css/styles.css` |
| 降低距离数字 | 50px/900 → 32px/700 | `css/styles.css` |
| 修复表格 | 圆角 18px→12px，min-width 720px→560px | `css/styles.css` |
| 缩小空状态 | 72px→48px | `css/styles.css` |
| 重构异常说明区 | 3 卡片 → 单行横幅 | `query.html` |
| 扁平算法信息卡 | 去掉 oversized 图标 | `docs.html` |
| 移除自指侧边栏文案 | “课程设计原型”等文字 | `*.html` |
| refined 卡片阴影 | 新增 `--shadow-card` | `css/styles.css` |

### 7.3 Technology

- 纯 CSS 变量与 HTML 结构微调。
- 参考 Aceternity 组件：`backgrounds/3.tsx`（点阵）、`bento-grids/1.tsx`（卡片阴影与扁平信息卡布局）。
- 不新增 npm 包、不引入 Tailwind、不动 JS。

### 7.4 Assumptions

- 用户接受“减法”为主的设计风格，不追求更多装饰或动画。
- 当前亮/暗主题变量体系可以覆盖所有新样式，无需新增主题。
- 评审老师更关注功能完整性与界面整洁度，而非品牌差异化。

## 8. Release

- **第一版（本次）**：完成上述 CSS/HTML 调整，提交并验证 4 页截图与功能回归。
- **后续可选**：
  - 引入真实校园平面图底图。
  - 对地图节点样式进一步扁平化。
  - 优化移动端布局（当前以桌面评审为主）。

预计本次升级耗时 1.5～2 小时（含验证与截图）。
