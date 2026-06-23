# Plan — C 端 routes.json 预计算 + 前端数据流通

> 任务 #4 + #3 后端/前端联动
> 日期：2026-06-23
> 状态：✅ 已 commit

## 1. 目标

C 程序 `--export` 不仅导出 places，还对每对 (i, j) i≠j 跑 dijkstra，把 9×8=72 条最短路径写到 routes 数组。前端 fetch 后可直接 `routesIndex` O(1) 查询，不必每次跑 JS dijkstra。

## 2. 文件改动

| 文件 | 改动 |
|------|------|
| `src/main.c` v0.3.0 → v0.4.0 | 加 `fprint_json_string()`；`export_routes_json()` 遍历 (i, j) 对写入 routes；同步到 mirror |
| `assets/data/routes.json` | routes 从 `[]` → 72 条（places 不变）|
| `assets/prototype/campus-nav-prototype/js/app.js` | `loadCProgramData` 加 cache buster |
| `.gitignore` | mirror 目录忽略；移除已跟踪的 `routes.json`（git rm --cached）|

## 3. 关键设计决策

### 决策 1：路由范围（跟用户对齐）

**选 A：全部对 9×8=72 条**（推荐）。理由：
- 课程设计规模小，写入成本低（< 1ms × 72 ≈ 几十 ms）
- 前端查询 O(1)，避免运行时再跑 dijkstra
- 数据可静态校验（72 条覆盖完整有向图）

**对比 B（仅原始边 15 条）**：查询时仍要 JS dijkstra，路由 JSON 价值小。
**对比 C（仅多跳路径）**：丢失直达信息，badge 看着不直观。

### 决策 2：导出路径（跟用户对齐）

**选 A：两份都写**（C 端 + 前端 dev mirror）。理由：
- C 端 source of truth 不变（`assets/data/routes.json`）
- 前端 dev 用的 mirror（`assets/prototype/campus-nav-prototype/data/routes.json`）由 C 端自动同步
- mirror 已在 .gitignore，不入库

**对比 B（只写一份）**：需要让前端 fetch `../../data/routes.json`，但 Python http.server 默认不允许 `..` 路径。
**对比 C（Makefile 加 cp）**：可行但与 C 端代码耦合，C 端路径改了 Makefile 也得改。

## 4. JSON 格式（与前端 routesIndex 对齐）

```json
{
  "places": [
    {"id": "teaching", "name": "教学楼", "type": "教学区域", "icon": "🏫", "x": 145, "y": 95},
    ...
  ],
  "routes": [
    {"start": "teaching", "end": "library", "distance": 220, "path": ["teaching", "library"]},
    ...
  ]
}
```

前端 `loadCProgramData`：
```js
routesIndex.set(`${r.start}|${r.end}`, { distance: r.distance, path: r.path });
```
72 条 → `routesIndex.size === 72`，badge 显示 `(places+routes)`。

## 5. 关键代码片段

### src/main.c：写 routes

```c
fprintf(fp, "  \"routes\": [\n");
int total = 0;
int first = 1;
for (int i = 0; i < PLACE_COUNT; i++) {
    for (int j = 0; j < PLACE_COUNT; j++) {
        if (i == j) continue;
        DijkstraResult r = dijkstra_shortest_path(g, i, j);
        if (r.distance == DIJKSTRA_UNREACH || r.path_len == 0) continue;

        if (!first) fputc(',', fp);
        fputc('\n', fp);
        first = 0;

        fprintf(fp, "    {");
        fprint_json_string(fp, "start"); fprintf(fp, ": ");
        fprint_json_string(fp, g->ids[i]); fprintf(fp, ", ");
        // ... 同样写 end / distance / path
        total++;
    }
}
```

### src/main.c：同步 mirror

```c
if (export_mode) {
    if (export_routes_json(&g, EXPORT_PATH) != 0) return 1;
    if (strcmp(EXPORT_PATH, EXPORT_MIRROR_PATH) != 0) {
        return export_routes_json(&g, EXPORT_MIRROR_PATH);
    }
    return 0;
}
```

### app.js：cache buster

```js
const res = await fetch('data/routes.json?_=' + Date.now(), { cache: 'no-store' });
```

## 6. 验收（Playwright + 实测）

| 项 | 期望 | 实测 |
|----|------|------|
| C 端 export 输出 | 9 地点 + 72 路径 | ✅ |
| Node 解析 routes.json | places=9, routes=72 | ✅ |
| 浏览器 badge | `c-program (places+routes) · routes: 72` | ✅ |
| query dorm→lab | 540m | ✅（与 JS dijkstra 数值一致）|
| query office→hospital | 670m | ✅（来自 C 端预计算）|

## 7. 顺手修的 bug

### Bug 1：HTTP 缓存让 routes 看起来是空

dev 期 Python http.server + 浏览器 disk cache 会让 routes.json 在 `Last-Modified` 不变时拿 304，前端解析时 routes 永远 0。

**修**：fetch 加 `?_=${Date.now()}` query string + `cache: 'no-store'`，强制 bypass 缓存。

### Bug 2：mirror/routes.json 被跟踪

之前某次 commit（0222b31 之前）把 mirror 文件加入了 git 跟踪。导致每次 C 端 export 都让该文件变 modified，污染 commit diff。

**修**：`git rm --cached assets/prototype/campus-nav-prototype/data/routes.json` + 确认 .gitignore 已包含该目录。

## 8. 回滚

```bash
git revert dbe26d4
```

会回退：
- src/main.c v0.4.0 → v0.3.0
- assets/data/routes.json routes 数组清空
- js/app.js 去掉 cache buster

## 9. 后续可改进

- **路由分页**：72 条都在一个文件，体积 ~8KB。课程设计无压力。
- **双向合并**：当前写有向 (i,j)，可改成只写 `(min, max)` + `direction` 字段，文件更小但前端要处理方向。**暂不必要**。
- **增量 export**：检测 places/edges 变化才重写。当前每次全量重写，9 节点 < 1ms 可忽略。
- **真后端化**：如果将来加 Spring Boot / Node.js 后端，本任务模式可平移：routes 表入 SQL，API 返回 JSON。

## 10. 仍待办

- 任务 #39：亮暗色切换渐变动画
- 任务 #9：课程设计说明书
- 远程 main 分支与 master 同步
