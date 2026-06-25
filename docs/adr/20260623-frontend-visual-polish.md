# ADR 20260623 — 前端视觉去 AI 化升级

## 状态

已决策 / 已实施

## 背景

前端原型 `assets/prototype/campus-nav-prototype/` 在完成功能后，视觉层面仍带有明显的 AI 生成模板痕迹：

- hero 区 420px 径向渐变装饰球
- 全大写英文 `page-kicker`（Campus Path System / Path Query 等）
- 48px 带渐变背景的 stat-card 图标
- 50px 戏剧化距离数字
- 72px 空状态图标
- “课程设计原型”等自指型侧边栏文案
- query.html 布局松散，异常说明区占用过多垂直空间

这些元素让项目看起来像一个通用 SaaS 落地页，不符合学生课程设计工具的语境。

## 决策

对前端做一次以**减法与收紧**为核心的视觉升级：

1. **删除装饰性元素**：移除 hero 径向渐变球，将英文 kicker 改为中文，去掉 oversized 图标与自指文案。
2. **压缩组件尺寸**：stat-card 图标 48px→32px、数字 30px→22px；输入框 56px→44px；距离数字 50px→32px；空状态图标 72px→48px。
3. **修复布局**：query.html 异常说明区从 3 个高卡片改为单行横幅；收紧表格圆角与最小宽度；降低 hero 高度。
4. **引入克制的 Aceternity 元素**：使用 subtle 点阵背景（`.bg-dots`）和 refined 卡片阴影（`--shadow-card`），不引入 React/动画/光束/玻璃拟态。
5. **保持纯静态**：所有改动仅限 CSS 与 HTML，不新增依赖或构建工具。

## 后果

- 正面：界面更像聚焦的课程设计工具，信息密度提升，query.html 高度从 1367px 降至 759px（空状态）。
- 正面：保留了亮/暗主题切换、Dijkstra 查询、地图高亮、tab、dialog 等全部功能。
- 风险：data.html 因表格+地图仍较长（1478px），docs.html 略超 1000px，后续可继续微调。

## 相关文件

- `docs/prd/PRD-Frontend-Visual-Polish.md`
- `docs/handoff/frontend-polish-log.md`
- `assets/prototype/campus-nav-prototype/css/styles.css`
- `assets/prototype/campus-nav-prototype/index.html`
- `assets/prototype/campus-nav-prototype/query.html`
- `assets/prototype/campus-nav-prototype/data.html`
- `assets/prototype/campus-nav-prototype/docs.html`
