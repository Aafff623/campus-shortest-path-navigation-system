# 前端改造记录（2026-06 合并存档）

> 本文整合了 2026 年 6 月一轮前端改造的调研、计划、实施与验收，原 8 份过程文档已合并至此。
> 完整规格见关联 PRD：`docs/prd/PRD-Polish-Frontend.md`（IA 合并）、`docs/prd/PRD-Frontend-Visual-Polish.md`（视觉收紧）。

---

## 0. 背景与决策

- 前端原型 `assets/prototype/campus-nav-prototype/` 完成功能后，视觉残留明显 AI 模板痕迹：hero 径向渐变球、全大写英文 kicker、48px 渐变 stat 图标、50px 戏剧化距离数字、自指型侧边栏文案。
- query.html 布局松散，表单与地图高度差 300+px，异常说明区占满整屏。
- 7 个页面本质为 4 类功能，冗余。
- **决策**：以减法与收紧为核心，7→4 页面合并 + 去 AI 化视觉收紧 + Art Design Pro 风格对齐，保持纯静态、不动 C 端/算法/数据。

---

## 1. 调研与现状测量

| 页面 | 文档总高 | 主要问题 |
|------|----------|----------|
| index.html | 865px | hero 337px、3 张卡 151px，信息散 |
| query.html | 1367px | 左侧表单 315px vs 右侧地图 627px，错位 |
| result.html | 1462px | 左侧结果 579px vs 右侧地图 627px，分段堆叠 |
| locations.html / paths.html | 严重滚动 | 表格行距大、padding 厚重 |

- **根本问题**：grid 双列对齐错位；垂直空间被装饰组件占据（hero-visual 360×360、topbar 60+、侧边栏 236）；信息密度低；emoji / 插画 / 说教文案残留。
- **Art Design Pro 差距**（vibecoding-template 自带 admin 模板）：
  - 页面底色 `#f4f8ff` 淡蓝 → 应改 `#fafbfc` 中性灰（P0）
  - 卡片背景 `rgba(255,255,255,0.86)` 半透 → 应改 `#ffffff` 实色（P0）
  - 菜单圆角 15px → 应改 6px（P0）
  - 菜单选中态缺左竖条 → 应加 3px 主色竖条（P0）
  - stat-card 数字 18px → 应改 30px（P0）
  - 卡片圆角 6px → 可升 12px（P1）
  - 表格缺 ElCard 式包裹（P1）

---

## 2. 信息架构合并 7→4

- **删除 5 页**：`result.html` / `locations.html` / `paths.html` / `algorithm.html` / `about.html`
- **保留 2 页并重写**：`index.html`（hero 压缩、SVG 替换 emoji）、`query.html`（query+result 合并为单页 section）
- **新建 2 页**：
  - `data.html`：tab 切换 `[地点]` 表格 / `[边]` 表格 + 地图占位
  - `docs.html`：tab 切换 `[系统功能]` timeline / `[算法说明]` timeline + 伪代码 + 复杂度
- **导航 7→4**：`navItems` 改为 `['index.html','首页','⌂']` / `['query.html','路径查询','⌕']` / `['data.html','数据管理','▦']` / `['docs.html','系统说明','ⓘ']`
- **CSS 新增**：`.tabs` / `.tab-btn` / `.panel` 组件；全局圆角收紧到 `6px`
- **JS 新增**：`initTabs()`；`initQueryForm` 去掉 `result.html` 跳转，改为同页填充 `[data-result-root]`
- **Commit**：`feat(frontend): merge 7 pages to 4 modules + tab/section components`

---

## 3. 视觉收紧 / 去 AI 化

**删除的装饰**：
- `.hero::after` 420px 径向渐变球（整段删除）
- 全大写英文 `page-kicker`（`Campus Path System` → `系统概览` 等）
- emoji 图标（📍⛓ƒ🏫📚）全部换 SVG
- “课程设计原型”等自指型侧边栏文案最小化为单行 muted 文字

**压缩的尺寸**：
- `.hero`：min-height 200px → 160px；grid 1fr 360px → 1fr 280px
- `.hero-visual`：min-height 240px → 180px
- `.stat-card`：padding 20px → 14px；3 行复杂 grid → `auto 1fr` 单行
- `.stat-card .icon`：48px / radius-lg → 32px / 8px
- `.stat-card strong`：30px / fw 800 → 22px / fw 700
- `.distance-number`：50px / fw 900 → 32px / fw 700
- `.input-wrap`：56px / radius 16px → 44px / radius 10px
- `.empty-state .big-icon`：72px → 48px
- `.table-wrap`：radius 18px → 12px；table min-width 720px → 560px
- `.timeline-dot` / `.timeline-body` / `.path-step`：radius 16px → 10px–12px

**布局修复**：
- query.html 异常说明区：3 个高卡片 → 单行横幅
- docs.html 算法页底部 3 个 stat-card → 扁平 Bento 文本卡
- `.route-bar`：渐变 + inset 阴影 → `--surface-soft` 纯色、radius 10px、无阴影

**新增元素**：
- `.bg-dots`：8px 点阵背景（`radial-gradient(circle at 0.5px 0.5px, rgba(0,0,0,0.08) 0.5px, transparent 0)`），亮/暗双主题
- `--shadow-card`：refined 卡片阴影

**验收结果**（1511×759 视口）：
- index.html：759px（目标 ≤760）✅
- query.html（空状态）：759px（目标 ≤1100）✅
- docs.html：1007px（目标 ≤1000，略超 7px 可接受）⚠️
- data.html：1478px（无硬性目标，表格+地图较长）⚠️
- 功能回归：亮/暗主题、路径查询、地图高亮、tab、dialog 均正常 ✅
- 控制台无项目相关报错 ✅

**Commit**：`feat(frontend): reduce AI-generated feel and tighten layouts`

---

## 4. 风格对齐（4 阶段）

| Phase | 主题 | Commit |
|-------|------|--------|
| 1 | 色板 | `92f4f12` |
| 2 | 菜单 | `eaf4ce9` |
| 3 | 卡片 | `24659c5` |
| 4 | stat-card | `96aaa67` |

**Phase 1 — 色板（`92f4f12`）**：
- Light：`--bg: #fafbfc`（去蓝）、`--surface: #ffffff`（实色）、`--text: #323251`（更深）、`--primary: #6366f1`（indigo 500 偏紫）、`--primary-soft: #eef2ff`、 `--line: rgba(0,0,0,0.08)`、`--shadow: 0 1px 3px rgba(0,0,0,0.04)`、`--radius: 6px`、`--radius-lg: 12px`
- Dark：`--bg: #070707`、`--surface: #161618`、`--surface-soft: #17171c`、`--text: #e3e3e8`、`--muted: #8f8fa3`、`--line: rgba(255,255,255,0.08)`、`--primary: #818cf8`、`--primary-soft: rgba(129,140,248,0.16)`

**Phase 2 — 菜单（`eaf4ce9`）**：
- `.nav-item`：padding `10px 12px 10px 16px`；border-radius 6px；margin-bottom 4px
- hover：`background: var(--surface-soft)`；active：`color: var(--primary)` + `background: var(--primary-soft)`
- 新增 `.nav-item.active::before`：左 3px 竖条，`width: 3px`；`top: 6px; bottom: 6px`；`border-radius: 0 3px 3px 0`
- `.sidebar`：padding 18px 14px
- 附带：query.html form 改用 `.route-points` 横排 + `.input-wrap-compact`

**Phase 3 — 卡片（`24659c5`）**：
- `.card`：border-radius `var(--radius-lg)`（8→12）
- `.card.pad`：padding 20px（14px 16px→20px）

**Phase 4 — stat-card + form（`96aaa67`）**：
- `.stat-card`：grid `1fr auto`；areas `label icon / num icon / sub sub`；gap 6px 12px；padding 20px
- `.stat-card .icon`：48px × 48px；border-radius `var(--radius-lg)`
- `.stat-card .label`：14px / `var(--muted)` / fw 500
- `.stat-card strong`：30px / fw 800 / `line-height: 1.1` / `letter-spacing: -0.02em`
- `.stat-card .sub`：12px / `var(--muted)`；flex gap 12px；margin-top 8px
- index.html DOM 调整为 `.label` + `strong` + `.icon` + `.sub` 结构
- 附带：`.query-section .grid.two` 局部覆盖（input 限宽 360px + gap 18px）

**整体验收**：
- 4 页面文件 ✅ | 侧边栏 4 项 ✅ | 选中菜单竖条 3px ✅ | index 759px ✅ | query 1061px ✅ | emoji 残留 0 ✅

---

## 5. 主题切换动画

- 目标：亮/暗主题切换从瞬间跳变改为约 250ms 平滑渐变。
- 做法：`body` 加 `transition: background-color 250ms ease, color 250ms ease`；对 `*, *::before, *::after` 统一过渡 `background-color / color / border-color / box-shadow / fill / stroke`。
- 尊重 `prefers-reduced-motion`：整套过渡包进 `@media (prefers-reduced-motion: no-preference)`。
- 实测：body、sidebar、card、topbar、地图节点/边均平滑渐变；原有 hover/动画不被覆盖；减少动效模式下瞬间完成 ✅

---

## 6. 数据录入弹窗

**Commit**：`2c6e58d`

**三件事合并**：
1. **新增地点弹窗**：data.html `[地点]` tab 顶部加“新增地点”按钮 → dialog → 填名称/类型/坐标 + 与 9 现有地点的距离 → 提交后表格 + 地图自动更新
   - 持久化：仅前端内存（刷新后从 `routes.json` 重新加载），不引入 POST 接口
   - ID 生成：`buildPlaceId(name)` — 英文转 kebab-case；全中文用 codepoint 拼成稳定 ID；自动去重加 `-2` / `-3`
   - 校验：名称空、同名、距离 ≤0 / NaN 均给出明确提示；距离留空则不连边；坐标留空则按均值 + 偏移估算
   - 关闭方式：点遮罩 / 取消 / Esc
2. **.code-block 主题适配**：
   - 新增 `--code-bg` / `--code-fg` / `--code-keyword` 主题变量
   - Light：`--code-bg: #f9fafb` / `--code-fg: #323251` / `--code-keyword: #6366f1`
   - Dark：`--code-bg: #07111f` / `--code-fg: #dbeafe` / `--code-keyword: #a5b4fc`
3. **主题按钮重命名**：4 个 HTML 主题按钮“蓝白” → “亮色”（4 处）

**验收**：弹窗 9 行输入 ✅ / 提交后地点 9→10、边 15→18 ✅ / 地图自动渲染 ✅ / code-block 亮/暗色正确 ✅ / 按钮文案 ✅

---

## 关联文档

仍保留的关联文档：

| 文档 | 说明 |
|------|------|
| `docs/prd/PRD-Polish-Frontend.md` | IA 合并 PRD（7→4 页面） |
| `docs/prd/PRD-Frontend-Visual-Polish.md` | 视觉收紧 PRD（去 AI 化） |
| `docs/adr/20260623-frontend-visual-polish.md` | ADR 正式决策记录 |

本文已整合并删除下列原始过程文档（内容均并入以上各章节）：
`frontend-polish-investigation.md`、`frontend-ia-merge-plan.md`、`frontend-visual-polish.md`、`frontend-visual-polish-progress-handoff.md`、`frontend-style-align-plan.md`、`frontend-theme-transition.md`、`frontend-data-dialog.md`。
