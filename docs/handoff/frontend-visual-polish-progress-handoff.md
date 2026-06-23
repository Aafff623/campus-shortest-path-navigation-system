# Handoff — 前端视觉去 AI 化升级（进度检查点）

> 生成时间：2026-06-23  
> 对应 PRD：`PRD-Frontend-Visual-Polish.md`  
> 对应 Plan：`C:\Users\Lenovo\.claude\plans\zany-inventing-fiddle.md`

---

## 1. 背景上下文

这是**中北大学软件学院《数据结构》课程设计**项目：校园最短路径导航系统。仓库位置：

```
D:\OneDrive\Desktop\课设接单\27-campus-shortest-path-navigation-system
```

前端原型位于：

```
assets/prototype/campus-nav-prototype/
```

技术栈：纯静态 HTML / CSS / JavaScript，读取 C 程序导出的 `assets/data/routes.json`，核心算法为 Dijkstra。

### 本次升级目标

用户反馈当前界面“AI 味道太严重”，部分布局不合理。本次任务是对前端做一次**以减法为主**的视觉升级：

- 删除模板化装饰（hero 径向渐变球、全大写英文 kicker、oversized 图标）。
- 压缩组件尺寸，提高信息密度。
- 修复 query.html 表单/地图错配、异常说明区过高等布局问题。
- 参考用户资源库 `D:\OneDrive\Desktop\project\agentic-workbench\workbench\ui\aceternity\` 中的克制元素（点阵背景、卡片阴影、Bento 式信息卡），但**不**引入 React/动画/光束/玻璃拟态。

---

## 2. 当前进度

### 已完成

| 阶段 | 任务 | 状态 |
|---|---|---|
| Phase 1 | CSS 收紧：删除 hero 装饰球、压缩 stat-card、降低距离数字、统一输入框/表格/时间线圆角、新增 `.bg-dots` 与 `--shadow-card` | ✅ 完成 |
| Phase 2 | HTML 结构调整：kicker 中文化、侧边栏自指文案最小化、query 异常说明改为单行横幅、docs 算法信息卡扁平化、首页 hero 地图加点阵背景 | ✅ 完成 |
| 验证 | 4 页截图、高度测量、主题切换、查询流程、tab、dialog、控制台检查 | ✅ 完成 |

### 验证结果

| 页面 | 文档高度 | 目标 | 结果 |
|---|---|---|---|
| index.html | 759px | ≤760px | ✅ 通过 |
| query.html（空状态） | 759px | ≤1100px | ✅ 通过 |
| docs.html | 1007px | ≤1000px | ⚠️ 略超 7px，可接受 |
| data.html | 1478px | 无硬性目标 | ⚠️ 因表格+地图较长，后续可考虑压缩地图高度 |

功能回归：

- ✅ 亮/暗主题切换正常
- ✅ 路径查询与结果渲染正常
- ✅ 地图高亮正常
- ✅ data.html / docs.html tab 切换正常
- ✅ 新增地点 dialog 可打开
- ✅ 控制台无项目相关报错（仅 AdGuard 插件警告）

### 已生成工件

- `PRD-Frontend-Visual-Polish.md` — 产品需求文档
- `C:\Users\Lenovo\.claude\plans\zany-inventing-fiddle.md` — 实施计划
- `docs/handoff/frontend-visual-polish.md` — 基线 handoff
- `docs/reports/screenshots/after-*.png` — 升级后截图

---

## 3. 修改文件清单

| 文件 | 变更内容 |
|---|---|
| `assets/prototype/campus-nav-prototype/css/styles.css` | 删除 `.hero::after`；新增 `--shadow-card`、`.bg-dots`；压缩 stat-card/输入框/空状态/hero；简化 route-bar；降低距离数字；收紧表格/时间线/path 圆角；`.timeline-dot` 与 `.path-step::before` 改为纯色 |
| `assets/prototype/campus-nav-prototype/index.html` | kicker 改为“系统概览”；侧边栏文案最小化；hero 地图加 `.bg-dots` |
| `assets/prototype/campus-nav-prototype/query.html` | kicker 改为“路径查询”；侧边栏文案最小化；异常说明区改为单行横幅 |
| `assets/prototype/campus-nav-prototype/data.html` | kicker 改为“数据管理”；侧边栏文案最小化 |
| `assets/prototype/campus-nav-prototype/docs.html` | kicker 改为“系统说明”；侧边栏文案最小化；算法页底部 3 个 stat-card 改为扁平文本卡 |

---

## 4. 剩余任务

| Task ID | 任务 | 说明 |
|---|---|---|
| #9 | 生成 handoff 文档 | 本文档即为该任务输出 |
| #10 | 更新项目资产文档 | `CLAUDE.md`、`README.md`、`CONTEXT.md`、`docs/agents/*` 等需要同步本次升级 |
| — | 提交代码 | 当前工作区有未提交修改，需做一次原子 commit：`feat(frontend): reduce AI-generated feel and tighten layouts` |
| — | 可选优化 | data.html 地图高度可进一步压缩以减少滚动；docs.html 可微调至 ≤1000px |

---

## 5. 引导 Prompt（给 Compact 压缩后的 Agent）

```text
你正在接手校园最短路径导航系统的前端视觉升级任务。请按以下顺序阅读：

1. 先读 PRD：PRD-Frontend-Visual-Polish.md —— 了解本次升级的目标与验收标准。
2. 再读本 handoff 文档：docs/handoff/frontend-visual-polish-progress-handoff.md —— 掌握已完成工作、验证结果和剩余任务。
3. 浏览截图：docs/reports/screenshots/after-*.png —— 快速了解当前视觉状态。
4. 如需技术细节，查看实施计划：C:\Users\Lenovo\.claude\plans\zany-inventing-fiddle.md

当前剩余工作：
- 完成 Task #10：维护项目资产文档（CLAUDE.md、README.md、CONTEXT.md、docs/agents/* 等）。
- 提交本次前端修改的原子 commit。
- 如有必要，针对 data.html / docs.html 的高度做最后微调。

注意：本项目是纯静态 HTML/CSS/JS，不要引入 React/Vue/构建工具；保持所有现有功能（主题切换、Dijkstra 查询、地图、tab、dialog）正常。
```

---

## 6. 快速启动命令

本地预览：

```bash
python -m http.server 8081 --directory assets/prototype/campus-nav-prototype/
```

浏览器访问：

- http://localhost:8081/index.html
- http://localhost:8081/query.html
- http://localhost:8081/data.html
- http://localhost:8081/docs.html

---

## 7. 备注

- 端口 8080 被其他项目占用，当前使用 8081。
- 截图文件已加入 `docs/reports/screenshots/`，提交时是否需要纳入版本请按项目规范决定。
