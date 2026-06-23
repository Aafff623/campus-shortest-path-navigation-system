# Plan — 前端风格对齐 Art Design Pro（4 phase 实施）

> 关联 PRD：`PRD-Polish-Frontend.md`（已退化为 IA 合并记录，本轮是风格对齐）
> 关联调研：`docs/reports/frontend-polish-investigation.md` §5
> 实施日期：2026-06-23
> 状态：✅ 全部 4 phase 已 commit

## 1. 目标

把前端 4 个页面的视觉风格对齐到 **Art Design Pro**（vibecoding-template 自带的 admin 模板）。

策略：4 phase 独立 commit + handoff 同步更新 + 每个 phase 等你 review 后再 push。

## 2. 4 phase 概览

| Phase | 主题 | 改动 | Commit |
|-------|------|------|--------|
| 1 | 色板 | bg/surface/text/line/primary + dark 同步 | `92f4f12` |
| 2 | 菜单 | 圆角 6px + 间距 4px + 左 3px 主色竖条 | `eaf4ce9` |
| 3 | 卡片 | 圆角 12px + padding 20px + 阴影几乎不可见 | `24659c5` |
| 4 | stat-card | icon 48px rounded-xl + 数字 30px + label/num/icon/sub 三段 | `96aaa67` |

## 3. Phase 1 — 色板（commit 92f4f12）

### Light

```css
:root {
  --bg:              #fafbfc;   /* 改：去蓝 */
  --surface:         #ffffff;   /* 改：实色 */
  --surface-soft:    #f9fafb;
  --text:            #323251;   /* 改：更深 */
  --muted:           #7987a1;
  --line:            rgba(0, 0, 0, 0.08);
  --primary:         #6366f1;   /* 改：indigo 500，偏紫 */
  --primary-soft:    #eef2ff;
  --shadow:          0 1px 3px rgba(0, 0, 0, 0.04);  /* 改：几乎无阴影 */
  --radius:          6px;
  --radius-lg:       12px;      /* 新增 */
}
```

### Dark

```css
[data-theme="dark"] {
  --bg:              #070707;
  --surface:         #161618;
  --surface-soft:    #17171c;
  --text:            #e3e3e8;
  --muted:           #8f8fa3;
  --line:            rgba(255, 255, 255, 0.08);
  --primary:         #818cf8;
  --primary-soft:    rgba(129, 140, 248, 0.16);
}
```

### 验收

- 截图：`phase1-light.png` / `phase1-dark.png`
- 文档高度：759 ≤ 760 不变
- 不影响 KR1-9

## 4. Phase 2 — 菜单（commit eaf4ce9）

### 改动

```css
.nav-item {
  position: relative;
  padding: 10px 12px 10px 16px;  /* 改：左 padding 16 给竖条留位 */
  border-radius: 6px;             /* 改：15→6 */
  margin-bottom: 4px;             /* 改：8→4 */
}
.nav-item:hover {                 /* 拆分：hover 与 active 不同 */
  color: var(--text);
  background: var(--surface-soft);
}
.nav-item.active {
  color: var(--primary);
  background: var(--primary-soft);
}
.nav-item.active::before {        /* 新增：左 3px 竖条 */
  content: "";
  position: absolute;
  left: 0; top: 6px; bottom: 6px;
  width: 3px;
  background: var(--primary);
  border-radius: 0 3px 3px 0;
}
.sidebar { padding: 18px 14px; }  /* 改：紧凑 */
```

### 附带

- query.html form 改用 `.route-points` 横排 + `.input-wrap-compact`（linter 调整）
- styles.css 加 `.form-compact` / `.route-points` / `.route-point` / `.route-points-divider`

### 验收

- 截图：`phase2-light.png` / `phase2-dark.png` / `phase2-light-v2.png`
- nav-item.active::before width=3px bg=rgb(129,140,248)（dark）✅
- 文档高度 759 ≤ 760 不变

## 5. Phase 3 — 卡片（commit 24659c5）

### 改动

```css
.card { border-radius: var(--radius-lg); }  /* 8→12 */
.card.pad { padding: 20px; }                /* 14px 16px → 20px */
```

阴影已在 Phase 1 改为几乎不可见，本 phase 不动。

### 验收

- 改动仅 2 行（+2 / -2）
- 文档高度预计 +60px

## 6. Phase 4 — stat-card + form（commit 96aaa67）

### stat-card 改动

```css
.stat-card {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "label icon"
    "num   icon"
    "sub   sub";
  gap: 6px 12px;
  padding: 20px;            /* 10 12 → 20 */
}
.stat-card .icon {           /* 32×8 → 48×12 */
  width: 48px; height: 48px;
  border-radius: var(--radius-lg);
}
.stat-card .label {          /* 新增 */
  font-size: 14px; color: var(--muted); font-weight: 500;
}
.stat-card strong {          /* 18px → 30px font-weight 800 */
  font-size: 30px; font-weight: 800;
  line-height: 1.1; color: var(--text);
  letter-spacing: -0.02em;
}
.stat-card .sub {            /* 新增 */
  font-size: 12px; color: var(--muted);
  display: flex; gap: 12px; margin-top: 8px;
}
```

### index.html stat-card DOM 调整

```html
<div class="card stat-card">
  <div class="label">校园地点</div>
  <strong>9</strong>
  <div class="icon"><svg>...</svg></div>
  <div class="sub"><span>教学楼 图书馆 食堂 ...</span></div>
</div>
```

### 附带

- `.query-section .grid.two` 局部覆盖（input 限宽 360px + gap 18px）
- app.js 无功能变更（linter 调整）

### 验收

- 截图：`phase4-light.png` / `phase4-dark.png`
- 文档高度预计 +90px（stat-card padding +14px margin-top）

## 7. 整体验收（Playwright）

| 项 | 期望 | 实测 |
|----|------|------|
| 4 页面文件 | index/query/data/docs | ✅ |
| 侧边栏 4 项 | nav-item 数 4 | ✅ |
| 选中菜单竖条 | width 3px | ✅ |
| 文档高度 index | ≤ 760px | 759 |
| 文档高度 query | ≤ 1100px | 1061 |
| 数据流通 | dijkstra + 距离 | ✅ |
| emoji 残留 DOM | 0 | ✅ |
| routes.json routes | 0（任务 #4 待办）| OK fallback |

## 8. 回滚

任一 phase 独立 commit，`git revert <commit-hash>` 即可单独回退。

## 9. 仍待办

- ~~**任务 #4**：C 端 `--export` 生成 routes.json 的 `routes` 数组~~ ✅ 已完成（commit `dbe26d4`，详见 `backend-export-routes.md`）
- **任务 #39**：亮暗色切换渐变动画
- **任务 #9**：课程设计说明书
- 远程 main 分支与 master 同步（当前 master 领先 main 7 commit）

## 10. 截图清单

```
phase1-light.png    Phase 1 验收 light
phase1-dark.png     Phase 1 验收 dark
phase2-light.png    Phase 2 验收 light
phase2-dark.png     Phase 2 验收 dark
phase2-light-v2.png Phase 2 第二次 light（最终）
phase4-light.png    Phase 4 验收 light
phase4-dark.png     Phase 4 验收 dark
```

## 11. 后续关联

- 数据管理弹窗 + code-block + 主题按钮重命名：见 `frontend-data-dialog.md`（commit `2c6e58d`）
- C 端 routes 预计算 + 同步：见 `backend-export-routes.md`（commit `dbe26d4`）
