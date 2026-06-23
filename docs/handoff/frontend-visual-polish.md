# Handoff — 前端视觉去 AI 化升级

> 对应 PRD：`PRD-Frontend-Visual-Polish.md`  
> 对应 Plan：`C:\Users\Lenovo\.claude\plans\zany-inventing-fiddle.md`  
> 日期：2026-06-23  
> 状态：待实施

## 1. 背景与目标

当前 `assets/prototype/campus-nav-prototype/` 前端原型功能完整，但视觉层面带有明显 AI 模板痕迹（hero 装饰球、全大写英文 kicker、oversized 图标、浮夸距离数字、自指型侧边栏文案）。本次升级以**减法与收紧**为核心，把它改造成一个干净、聚焦的学生课程设计工具界面，同时修复 query.html 的布局不合理问题。

**核心目标**：
- 消除 AI 模板感。
- 提升信息密度，减少无意义滚动。
- 保持所有现有功能不变。
- 参考 Aceternity 中克制的点阵背景与 refined 卡片阴影，但**不**引入 React/动画/光束/玻璃拟态。

## 2. 待修改文件清单

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `assets/prototype/campus-nav-prototype/css/styles.css` | 大量 CSS 调整 | 删除装饰、压缩组件、统一间距、新增 `.bg-dots` 与 `--shadow-card` |
| `assets/prototype/campus-nav-prototype/index.html` | 结构与文案 | kicker 中文化、移除/最小化侧边栏卡、hero 地图加 `.bg-dots` |
| `assets/prototype/campus-nav-prototype/query.html` | 结构重构 | 异常说明区 3 卡片 → 单行横幅 |
| `assets/prototype/campus-nav-prototype/data.html` | 文案 | 移除/最小化侧边栏自指文案 |
| `assets/prototype/campus-nav-prototype/docs.html` | 结构重构 | 算法说明底部 3 个 stat-card → 扁平 Bento 文本卡 |

## 3. 关键变更明细

### 3.1 CSS 调整

| 选择器 | 当前值 | 目标值 |
|---|---|---|
| `.hero::after` | 420px 径向渐变球 | **删除整段规则** |
| `.page-kicker` | uppercase, letter-spacing 0.08em, fw 700 | 去掉 uppercase/letter-spacing, fw 600 |
| `.hero` | min-height 200px, grid 1fr 360px | min-height 160px, grid 1fr 280px |
| `.hero-visual` | min-height 240px | min-height 180px |
| `.stat-card` | padding 20px, 3 行复杂 grid | padding 14px, `auto 1fr` 单行 |
| `.stat-card .icon` | 48px / radius-lg | 32px / 8px |
| `.stat-card strong` | 30px / fw 800 | 22px / fw 700 |
| `.distance-number` | 50px / fw 900 | 32px / fw 700 |
| `.input-wrap` | 56px / radius 16px | 44px / radius 10px |
| `.route-bar` | 渐变 + inset 阴影 | `--surface-soft`, radius 10px, 无阴影 |
| `.table-wrap` | radius 18px | radius 12px |
| `table` | min-width 720px | min-width 560px |
| `.empty-state .big-icon` | 72px / radius 24px | 48px / radius 14px |
| `.timeline-dot` | radius 16px | radius 10px |
| `.timeline-body` | radius 18px | radius 12px |
| `.path-step` | radius 16px | radius 10px |
| `.path-step::before` | 渐变背景 | 纯色 `--primary` |
| `.card` | 无阴影 | 新增 `--shadow-card` 阴影 |

新增工具类：

```css
.bg-dots {
  background-image: radial-gradient(circle at 0.5px 0.5px, rgba(0,0,0,0.08) 0.5px, transparent 0);
  background-size: 8px 8px;
}
[data-theme="dark"] .bg-dots {
  background-image: radial-gradient(circle at 0.5px 0.5px, rgba(255,255,255,0.06) 0.5px, transparent 0);
}
```

### 3.2 HTML 调整

- **所有页面**：`.page-kicker` 英文改为中文：
  - `Campus Path System` → `系统概览`
  - `Path Query` → `路径查询`
  - `Data` → `数据管理`
  - `Docs` → `系统说明`
- **所有页面**：`.sidebar-card` 中“课程设计原型”等自指文案移除或最小化为“数据结构课程设计”一行 muted 文字。
- **query.html**：异常说明区替换为单行横幅：
  ```html
  <section class="card pad query-section" style="padding:14px 18px">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <span style="font-size:13px;font-weight:600;color:var(--muted)">异常处理：</span>
      <span style="font-size:12px;color:var(--text)">未选择地点 · 起终点相同 · 路径不可达</span>
      <span style="font-size:12px;color:var(--muted)">均会给出明确提示</span>
    </div>
  </section>
  ```
- **docs.html**：算法说明底部 3 个 stat-card 改为：
  ```html
  <div class="grid three" style="margin-top:14px">
    <div class="card pad" style="background:var(--surface-soft)">
      <h3 style="font-size:14px;font-weight:600;margin:0 0 6px">图结构</h3>
      <p style="font-size:12px;color:var(--muted);margin:0">顶点保存地点，边保存两个地点之间的距离。</p>
    </div>
    ...
  </div>
  ```

## 4. 验收标准

- [ ] 4 页均无全大写英文 kicker 与“课程设计原型”自指文案。
- [ ] index.html 在 1511×759 视口下高度 ≤760px。
- [ ] query.html 在 1511×759 视口下高度 ≤1100px。
- [ ] stat-card 图标 ≤32px，输入框高 44px，距离数字 ≤32px。
- [ ] 亮/暗主题切换正常。
- [ ] 路径查询、地图高亮、结果渲染正常。
- [ ] data.html / docs.html tab 切换正常。
- [ ] 新增地点 dialog 打开/关闭/提交正常。
- [ ] 浏览器控制台无新增报错。

## 5. 参考资产

- Aceternity 组件库（仅参考克制元素）：`D:\OneDrive\Desktop\project\agentic-workbench\workbench\ui\aceternity\`
  - `backgrounds/3.tsx` — 点阵背景
  - `bento-grids/1.tsx` — 卡片阴影与扁平信息卡布局

## 6. 风险与注意事项

- **风险**：过度参考 Aceternity 可能反而增加“设计感”而非“去 AI 化”。应坚持减法，只使用点阵和卡片阴影。
- **注意**：所有改动必须保持纯静态，不可引入 npm 包或构建工具。
- **注意**：`js/app.js` 与 `assets/data/routes.json` 不动。

## 7. 下一步

1. 按 Task 列表实施 CSS/HTML 修改。
2. 本地启动服务（`python -m http.server 8081 --directory assets/prototype/campus-nav-prototype/`）。
3. 逐一验证 4 页截图与功能回归。
4. 提交原子 commit：`feat(frontend): reduce AI-generated feel and tighten layouts`。
