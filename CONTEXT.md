# CONTEXT

## Project

校园最短路径导航系统 — 中北大学软件学院《数据结构》课程设计。

## Domain language

- **地点（Place/Node）**：校园中的建筑物或区域，如图的顶点。
- **路径（Path/Edge）**：两个地点之间的可通行道路，如图的边，带权（长度）。
- **最短路径**：两点间总长度最小的路径。
- **图结构**：用邻接矩阵或邻接表存储地点与路径。
- **Dijkstra / Floyd**：计算最短路径的算法。

## Scope

- 录入地点与路径长度。
- 查询任意两点间最短路径及距离。
- 文字形式输出路径。
- 处理异常输入。
- 亮/暗主题切换与基础数据管理界面。

## Out of scope

- 真实地理坐标与 GIS 集成。
- 实时导航与语音播报。
- 多用户权限系统。
- 后端服务与持久化数据库。

## Architecture notes

- 前端：纯静态 HTML/CSS/JS 原型，4 个页面（index / query / data / docs），读取 `assets/data/routes.json`。
- 算法：C99 实现 Dijkstra，通过 `bin/campus_nav --export` 导出 `routes.json`；前端同时保留一份 JS 实现用于演示。
- 数据：地点与路径数据由 C 程序生成，前端仅做展示与交互。
- 视觉：近期完成一次去 AI 化视觉收紧，见 `docs/handoff/frontend-visual-polish-progress-handoff.md`。

## Decisions

See `docs/adr/`.
