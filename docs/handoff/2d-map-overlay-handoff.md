# Handoff — 2D 校园图 overlay 集成

> 生成时间：2026-06-24  
> 对应资产包：`docs/backup/nuc-2d-map-asset-pack-v2.zip`

---

## 1. 背景上下文

这是**中北大学软件学院《数据结构》课程设计**项目：校园最短路径导航系统。

前端原型位于：

```
assets/prototype/campus-nav-prototype/
```

技术栈：纯静态 HTML / CSS / JavaScript，读取 C 程序导出的 `assets/data/routes.json`。

### 本次任务目标

将前端 Demo 的抽象 SVG 网格地图升级为基于真实校园平面图的 2D overlay：底图 + 道路 polyline + 地点 marker + 路径高亮。

---

## 2. 当前进度

### 已完成

| 任务 | 状态 | 说明 |
|---|---|---|
| 生成 2D 校园图资产包 | ✅ | `nuc-2d-map-asset-pack-v2.zip`，含示意 SVG/PNG、坐标 JSON、集成 Prompt、转换文档 |
| 下载官方校园平面图 | ✅ | 来源：中北大学本科招生信息网 `zbzs.nuc.edu.cn/info/1002/2385.htm` |
| 资产归档 | ✅ | 资产包 zip 与官方图副本已放入 `docs/backup/` |
| 资产入项目 | ✅ | `images/`、`data/`、`tools/` 下已放置对应文件 |
| 前端代码集成 | ✅ | `app.js` 加载 `campus-layout.json` 并渲染底图；`styles.css` 增加 overlay 样式 |
| 回退逻辑 | ✅ | `campus-layout.json` 缺失时自动回退到旧版 760×390 抽象网格地图 |
| 文档更新 | ✅ | `README.md`、`CONTEXT.md`、`docs/handoff/运行说明.md` 已更新 |
| 本地验证 | ✅ | 8081 端口启动，index/query/calibrate 页面均正常 |
| 坐标标定工具嵌入菜单 | ✅ | 新增 `calibrate.html`，通过 iframe 嵌入 `tools/coordinate-debug-tool.html`，并在 `navItems` 中新增“坐标标定”入口 |
| 真实坐标第一轮标定 | ✅ | 已根据官方校园平面图重新标定 9 个地点坐标，并重新生成 `edgePolylines`；状态更新为 `official-map-manual-calibrated-v1` |

### 已生成工件

- `assets/prototype/campus-nav-prototype/images/nuc-campus-map-official.jpg` — 官方校园平面图底图
- `assets/prototype/campus-nav-prototype/images/nuc-campus-map-schematic-v2.svg` — 示意底图 fallback
- `assets/prototype/campus-nav-prototype/images/nuc-campus-map-schematic-v2.png` — 示意底图 PNG
- `assets/prototype/campus-nav-prototype/data/campus-layout.json` — 展示层坐标与道路 polyline 配置
- `assets/prototype/campus-nav-prototype/tools/coordinate-debug-tool.html` — 坐标标定调试工具
- `docs/backup/nuc-2d-map-asset-pack-v2.zip` — 完整资产包备份
- `docs/backup/nuc-campus-map-official.jpg` — 官方图备份
- `assets/prototype/campus-nav-prototype/calibrate.html` — 坐标标定页面（嵌入坐标工具 iframe，含主导航）
- `docs/reports/screenshots/calibrate-page-nav-embedded.png` — 坐标标定页截图
- `docs/reports/screenshots/index-after-calibration.png` — 首页 overlay 效果图（标定后）
- `docs/reports/screenshots/query-result-after-calibration.png` — 路径查询结果与地图高亮截图（标定后）

---

## 3. 修改文件清单

| 文件 | 变更内容 |
|---|---|
| `assets/prototype/campus-nav-prototype/js/app.js` | 新增 `campusLayout` 全局变量、`loadCampusLayout()`；改造 `renderMap()` 支持底图 overlay；新增 `renderCampusOverlay()` 与 `renderMapNode()`；`initPage()` 中追加 layout 加载；`navItems` 新增“坐标标定” |
| `assets/prototype/campus-nav-prototype/css/styles.css` | 新增 `.campus-map-image { pointer-events: none; }`；`.map-edge` 增加 `fill: none` / `stroke-linejoin` 以兼容 polyline；`.map-node-label` 增加描边提升底图可读性；新增 `.calibrate-frame` iframe 样式 |
| `assets/prototype/campus-nav-prototype/data/campus-layout.json` | 新增：官方图底图、1024×682 坐标系、9 个地点坐标、15 条边 polyline；已更新为 `official-map-manual-calibrated-v1` |
| `.gitignore` | 调整 `assets/prototype/campus-nav-prototype/data/` 忽略规则，保留并跟踪 `campus-layout.json` |
| `assets/prototype/campus-nav-prototype/calibrate.html` | 新增：坐标标定页面，含标准侧边栏导航，iframe 嵌入坐标工具 |
| `assets/prototype/campus-nav-prototype/tools/coordinate-debug-tool.html` | 新增 iframe 嵌入模式：检测到在 iframe 中时隐藏页面头部 |
| `README.md` | 新增 2D 校园图 overlay 说明段落 |
| `CONTEXT.md` | 记录 overlay 架构决策与数据契约 |
| `docs/handoff/运行说明.md` | 运行端口改为 8081；新增坐标标定工具访问说明 |

---

## 4. 当前限制与注意事项

### 坐标已完成第一轮人工标定

`campus-layout.json` 中的 `places.x/y` 已根据官方校园平面图重新标定，状态为：

```json
"status": "official-map-manual-calibrated-v1",
"calibration": {
  "method": "manual marker calibration on official map (round 1)"
}
```

### 距离测量使用固定近似比例尺

坐标标定工具 `coordinate-debug-tool.html` 已内置**近似比例尺 1:20000**（图上 1cm ≈ 200m），该比例根据图中田径场一圈约 800m 估算得出。点击任意两点即可按标准 96ppi 屏幕估算实际距离，仅用于课程设计 Demo 展示，**不作为 GIS 精确测量依据**。

| 地点 | 标定依据 |
|---|---|
| 教学楼 | 校园中部东侧教学楼建筑群（如 教学楼14# / 软件学院 附近） |
| 图书馆 | 校园中央、行知广场西侧/体育场北侧的主馆位置 |
| 校医院 | 东北区域带红色十字标识的医疗卫生建筑 |
| 食堂 | 中部东侧、行知广场东南侧生活服务建筑 |
| 实验楼 | 东北区域科学楼建筑群（科学楼 A/C 座） |
| 体育馆 | 体育场西侧橙色体育馆建筑 |
| 操场 | 校园中央带跑道的绿色体育场 |
| 宿舍区 | 西南区域文瀛公寓区宿舍建筑群 |
| 行政楼 | 校园西侧行政/办公建筑群 |

> 由于官方图分辨率有限，部分建筑名称无法 100% 确认。上述坐标是按“功能区 + 可见建筑”做的最佳估计，若与实际楼栋有出入，可在 `calibrate.html` 中点击修正。

### `edgePolylines` 为近似折线

当前每条边的 polyline 采用“起点 → 中点 → 终点”的折线近似，能大致跟随校园道路网格，但并非逐条道路精确绘制。后续如需更真实的路网，可在 `coordinate-debug-tool.html` 中沿道路逐点采集拐点。

### 数据目录的 Git 忽略已调整

`.gitignore` 原忽略 `assets/prototype/campus-nav-prototype/data/` 全部文件。现改为忽略该目录下其他运行时镜像，但保留并跟踪 `campus-layout.json`：

```gitignore
assets/prototype/campus-nav-prototype/data/*
!assets/prototype/campus-nav-prototype/data/campus-layout.json
```

---

## 5. 下一阶段任务

| Task | 任务 | 说明 |
|---|---|---|
| #1 | 提交代码 | 当前工作区有未提交修改，需做一次原子 commit |
| #2 | 可选精调 | 若发现某栋楼位置不准确，可在 `calibrate.html` 中点击修正坐标与 polyline |
| #3 | 可选优化 | 进一步压缩 data.html / docs.html 垂直空间，减少滚动 |

## 6. 引导 Prompt（给 Compact 压缩后的 Agent）

```text
你正在接手校园最短路径导航系统的 2D 校园图 overlay 任务。请按以下顺序阅读：

1. 读 handoff：docs/handoff/2d-map-overlay-handoff.md —— 了解已完成工作、当前限制和下一阶段任务。
2. 读项目规范：CLAUDE.md —— 了解技术栈与约束。
3. 读前端入口：assets/prototype/campus-nav-prototype/js/app.js、css/styles.css。
4. 读配置文件：assets/prototype/campus-nav-prototype/data/campus-layout.json。
5. 看当前截图：docs/reports/screenshots/index-after-calibration.png、query-result-after-calibration.png。

当前剩余工作：
- 提交本次修改的原子 commit。
- 如有必要，针对 data.html / docs.html 的高度做最后微调，或继续精调 campus-layout.json 坐标。

注意：本项目是纯静态 HTML/CSS/JS，不要引入 React/Vue/构建工具；保持所有现有功能（主题切换、Dijkstra 查询、地图、tab、dialog）正常。
```

---

## 7. 快速启动命令

本地预览：

```bash
cd assets/prototype/campus-nav-prototype
python -m http.server 8081
```

浏览器访问：

- 首页：`http://localhost:8081/index.html`
- 路径查询：`http://localhost:8081/query.html`
- 数据管理：`http://localhost:8081/data.html`
- 系统说明：`http://localhost:8081/docs.html`
- 坐标标定：`http://localhost:8081/calibrate.html`（主导航新增入口）

---

## 8. 备注

- 端口 8080 被其他项目占用，当前统一使用 8081。
- 官方校园平面图版权归中北大学所有，仅供教学使用。
- 示意 schematic 底图由本资产包生成，可保留作为 fallback。
