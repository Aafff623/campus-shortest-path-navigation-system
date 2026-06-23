# PRD — 前端 IA 合并与视觉 Polish

> 项目：校园最短路径导航系统
> 日期：2026-06-23
> 状态：Draft
> 关联调研：`docs/reports/frontend-polish-investigation.md`

## 1. Summary

本 PRD 把前端 7 个页面合并为 4 个模块（IA 重构），同时解决布局松散、信息密度低、AI 味重的问题。

**4 个模块**：
1. **首页** index.html — 系统入口
2. **路径查询** query.html — 输入 + 结果（单页 section）
3. **数据管理** data.html — 地点 + 边（tab 切换）
4. **系统说明** docs.html — 功能 + 算法（tab 切换）

## 2. Contacts

| 角色 | 姓名 | 说明 |
|------|------|------|
| 学生 | （待填写） | 项目实现者 |
| 指导教师 | 富丽贞 | 中北大学软件学院 |

## 3. Background

### 当前问题
- 7 个页面（index / query / result / locations / paths / algorithm / about）
- 7 个页面本质上是 4 类功能（导航/查询/数据/说明）
- query/result 用 grid 双列错位 300+px
- locations/paths 都是数据管理，重复
- about/algorithm 都是介绍文档，重复
- hero 区域是云朵插画，对功能无贡献
- emoji 装饰（📍⛓ƒ）残留 AI 味

### 改动范围
- 7 个原页面 → 4 个新页面
- 侧边栏菜单 7 项 → 4 项
- 视觉 Polish 同步进行

## 4. Objective

### 总体目标
7→4 页面 IA 重构，保留 grid 但压缩高度，引入 SVG icon。

### 关键结果
- **KR1**：4 个页面（index / query / data / docs），旧 7 个全部删除
- **KR2**：侧边栏 4 项菜单，对应 4 个页面
- **KR3**：query.html 单页包含输入 + 结果（无 tab，输入在 section 1，结果 section 默认空，查询后填充）
- **KR4**：data.html 用 tab 切换"地点 / 边"
- **KR5**：docs.html 用 tab 切换"系统 / 算法"
- **KR6**：index.html 一屏可见（docH ≤ 760px）
- **KR7**：query.html 文档总高 ≤ 1100px（1.5 屏内）
- **KR8**：所有装饰 emoji 替换为 SVG icon
- **KR9**：hero-visual 渲染真实校园图（9 节点 + 15 边）

## 5. Market Segments

**用户**：课程设计验收老师 + 现场演示观众。

**约束**：
- 不动 C 代码 / routes.json / 算法层
- 不动主题变量（蓝白 + 深色）
- 不破坏现有数据流通（C 端 JSON → 前端）

## 6. Value Proposition

- **专业感**：去掉 AI 生成的视觉痕迹
- **导航更清晰**：4 个一级模块比 7 个更易理解
- **信息密度**：单位面积展示更多有用信息
- **可读性**：主要功能页面接近一屏可见

## 7. Solution

### 7.1 新页面结构

```
index.html      首页：系统入口、概览数字、常用地点
query.html      路径查询：选择起终点 + 异常说明，结果区域默认空，查询后填充
data.html       数据管理：tab 切换 [地点] [边]
docs.html       系统说明：tab 切换 [系统功能] [算法说明]
```

### 7.2 侧边栏导航 4 项

| 顺序 | 名称 | 图标 | 跳转 |
|------|------|------|------|
| 1 | 首页 | ⌂ | index.html |
| 2 | 路径查询 | ⌕ | query.html |
| 3 | 数据管理 | ▦ | data.html |
| 4 | 系统说明 | ⓘ | docs.html |

`js/app.js` 中 `navItems` 数组改为 4 项。

### 7.3 关键页面结构

#### query.html（单页 section）

```html
<section id="query-input">
  <h2>选择起终点</h2>
  <form>
    <select start> <select end>
    <button>查询</button>
  </form>
</section>

<section id="query-exceptions" class="banner">
  异常输入处理：未选择 / 相同 / 不可达
</section>

<section id="query-result" data-result-root>
  <!-- 查询后由 JS 填充 -->
  <empty state: 选择起终点后点击查询>
</section>
```

#### data.html（tab 切换）

```html
<nav class="tabs">
  <button data-tab="places" class="active">地点 (9)</button>
  <button data-tab="edges">边 (15)</button>
</nav>

<panel data-tab="places" class="active">
  表格：9 个地点
</panel>
<panel data-tab="edges">
  表格：15 条边
</panel>
```

#### docs.html（tab 切换）

```html
<nav class="tabs">
  <button data-tab="about" class="active">系统功能</button>
  <button data-tab="algorithm">算法说明</button>
</nav>

<panel data-tab="about" class="active">
  系统功能时间线、页面清单、交付方式
</panel>
<panel data-tab="algorithm">
  Dijkstra 时间线、伪代码、复杂度
</panel>
```

### 7.4 视觉 Polish（同步）

| 元素 | 改前 | 改后 |
|------|------|------|
| `.hero` 高度 | 337 | 240 |
| `.hero-visual` | 云朵+楼栋 | 真实校园 SVG 280×200 |
| `.stat-card` 高度 | 151 | ≤ 100 |
| `.stat-card .icon` | emoji 32×32 | 24×24 SVG |
| `.btn` 圆角 | 12 | 6 |
| 全局圆角 | 8 | 6 |
| emoji | 📍⛓ƒ🏫📚 | 全部删除/换 SVG |

### 7.5 文件操作清单

**删除**：
- result.html
- locations.html
- paths.html
- algorithm.html
- about.html

**新建/重写**：
- index.html（重写 hero、3 卡片）
- query.html（合并 query + result）
- data.html（合并 locations + paths，加 tab）
- docs.html（合并 about + algorithm，加 tab）

**修改**：
- css/styles.css（tab 组件、icon 样式、紧凑化）
- js/app.js（navItems 数组、tab 切换逻辑、query 结果填充）

### 7.6 不在本 PRD 范围

- 真实校园平面图底图（用户已说明后续再做）
- 主题系统重做
- C 端 / 算法层

## 8. Release

### 第一版（课程设计交付）
- 4 个页面 + 侧边栏 4 项
- 视觉 Polish
- 数据流通保持（C 端 JSON → 前端）

### 后续版本
- 真实校园平面图底图替换 hero-visual
- locations/paths 表格行内编辑（替代演示提示）

### 验收方法

| 验证项 | 工具 | 标准 |
|--------|------|------|
| 页面数量 | 文件系统 | 4 个 HTML（不含 result/locations/paths/algorithm/about） |
| 侧边栏菜单 | Playwright | 4 项 |
| query 单页 section | Playwright | 输入 + 结果在同一页，初始结果空 |
| data tab 切换 | Playwright | 点击 tab 切换内容 |
| docs tab 切换 | Playwright | 点击 tab 切换内容 |
| 文档高度 | Playwright | index ≤ 760, query ≤ 1100 |
| emoji 残留 | grep -r "📍\|⛓\|ƒ\|🏫\|📚" | 0 个 |
| 数据流通 | 浏览器查询 | C 端 JSON 仍能取到 |

## 9. Tasks

| 任务 | 文件 | 状态 |
|------|------|------|
| 调研报告 | `docs/reports/frontend-polish-investigation.md` | ✅ |
| PRD | `PRD-Polish-Frontend.md` | ✅ 本文档 |
| Plan | （下一步） | ⏳ |
| 创建 4 个新页面 HTML | `assets/prototype/campus-nav-prototype/*.html` | ⏳ |
| 添加 tab / icon 样式 | `assets/prototype/campus-nav-prototype/css/styles.css` | ⏳ |
| 更新 navItems | `assets/prototype/campus-nav-prototype/js/app.js` | ⏳ |
| 删除 5 个旧页面 | — | ⏳ |
| 验收（Playwright） | — | ⏳ |
| 提交 + review | — | ⏳ |
