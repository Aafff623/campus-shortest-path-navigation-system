# 后端与数据集成记录

> 本文整合了后端数据导出与前端集成两部分的交接记录。

---

## 1. 路由数据导出（C → routes.json）

### 1.1 运行命令

```bash
make
bin/campus_nav.exe --export
```

导出结果写入 `assets/data/routes.json`，并自动同步到前端 dev mirror `assets/prototype/campus-nav-prototype/data/routes.json`。

### 1.2 JSON 字段结构

```json
{
  "places": [
    {"id": "teaching", "name": "教学楼", "type": "教学区域", "icon": "🏫", "x": 145, "y": 95}
  ],
  "routes": [
    {"start": "teaching", "end": "library", "distance": 220, "path": ["teaching", "library"]}
  ]
}
```

- `places`：9 个地点，含 id / name / type / icon / x / y。
- `routes`：72 条（9×8 全对有向），含 start / end / distance / path。

### 1.3 前端读取与 fallback

`assets/prototype/campus-nav-prototype/js/app.js` 中 `loadCProgramData`：

```js
const res = await fetch('data/routes.json?_=' + Date.now(), { cache: 'no-store' });
```

- 加 `?_=${Date.now()}` + `cache: 'no-store'` 强制 bypass 浏览器缓存（修复 dev 期 304 导致 routes 为空的问题）。
- 读取后构建 `routesIndex`：`routesIndex.set(\`${r.start}|${r.end}\`, { distance, path })`，实现 O(1) 查询。
- 若 `routes.json` 缺失或 routes 为空，保留原有 JS Dijkstra fallback。

### 1.4 关键代码

`src/main.c` 中遍历 (i, j) 对，调用 `dijkstra_shortest_path(g, i, j)`，跳过 `i == j` 与不可达路径，写入 JSON。`export_mode` 下先后写入 `EXPORT_PATH` 与 `EXPORT_MIRROR_PATH`。

### 1.5 验收快照

| 项 | 结果 |
|---|---|
| C 端 export 输出 | 9 地点 + 72 路径 |
| 浏览器 badge | `c-program (places+routes) · routes: 72` |
| query dorm→lab | 540m（与 JS Dijkstra 一致） |
| query office→hospital | 670m（来自 C 端预计算） |

### 1.6 回滚

```bash
git revert dbe26d4
```

回退 `src/main.c` v0.4.0 → v0.3.0、`assets/data/routes.json` routes 清空、`js/app.js` 去掉 cache buster。

---

## 2. 2D 校园地图底图叠加

### 2.1 底图资源

| 文件 | 说明 |
|---|---|
| `assets/prototype/campus-nav-prototype/images/nuc-campus-map-official.jpg` | 官方校园平面图底图（来源：中北大学本科招生信息网 `zbzs.nuc.edu.cn/info/1002/2385.htm`） |
| `assets/prototype/campus-nav-prototype/images/nuc-campus-map-schematic-v2.svg` | 示意底图 SVG fallback |
| `assets/prototype/campus-nav-prototype/images/nuc-campus-map-schematic-v2.png` | 示意底图 PNG fallback |
| `assets/prototype/campus-nav-prototype/data/campus-layout.json` | 展示层坐标与道路 polyline 配置 |
| `docs/backup/nuc-2d-map-asset-pack-v2.zip` | 完整资产包备份 |

### 2.2 坐标标定

- `campus-layout.json` 状态：`"status": "official-map-manual-calibrated-v1"`
- 坐标系：1024×682，基于官方图人工标定 9 个地点。
- 比例尺：坐标标定工具内置固定近似比例尺 **1:20000**（图上 1cm ≈ 200m，按田径场一圈约 800m 估算），仅用于 Demo 展示，非 GIS 精确测量。
- 修正入口：`http://localhost:8081/calibrate.html`（iframe 嵌入 `tools/coordinate-debug-tool.html`）。

### 2.3 叠加渲染方式

`js/app.js` 中：

- `loadCampusLayout()` 异步加载 `data/campus-layout.json`。
- `renderCampusOverlay()` 在 SVG 地图容器内插入 `<image>` 底图 + `<polyline>` 道路 + `<circle>` 地点 marker。
- `campus-layout.json` 缺失时自动回退到旧版 760×390 抽象网格地图。
- `css/styles.css` 新增 `.campus-map-image { pointer-events: none; }`、`.map-edge` 增加 `fill: none` / `stroke-linejoin`、`.map-node-label` 增加描边。

### 2.4 相关页面

- `index.html` — 首页地图 overlay
- `query.html` — 路径查询结果高亮
- `calibrate.html` — 坐标标定（主导航新增“坐标标定”入口）
- `tools/coordinate-debug-tool.html` — 坐标调试工具（iframe 嵌入时自动隐藏头部）

### 2.5 快速启动

```bash
cd assets/prototype/campus-nav-prototype
python -m http.server 8081
```

访问：
- `http://localhost:8081/index.html`
- `http://localhost:8081/query.html`
- `http://localhost:8081/calibrate.html`

### 2.6 注意事项

- `edgePolylines` 当前为“起点 → 中点 → 终点”近似折线，非逐条道路精确绘制；如需更真实路网，可在坐标工具中沿道路逐点采集拐点。
- `.gitignore` 已调整：忽略 `assets/prototype/campus-nav-prototype/data/*`，但保留并跟踪 `campus-layout.json`：

```gitignore
assets/prototype/campus-nav-prototype/data/*
!assets/prototype/campus-nav-prototype/data/campus-layout.json
```

- 官方校园平面图版权归中北大学所有，仅供教学使用。
