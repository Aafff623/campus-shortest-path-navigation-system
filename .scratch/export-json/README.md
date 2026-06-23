# export-json

**标签**: `ready-for-agent`  
**依赖**: dijkstra-algorithm

## 目标

让 C 程序能够预计算所有地点对的最短路径，并导出为 `assets/data/routes.json`，供前端页面读取。

## 任务内容

1. 在 `src/export.h` / `src/export.c` 中实现 `export_routes_json(Graph *g, const char *filename)`。
2. 函数内部遍历所有 `i ≠ j` 的地点对，调用 Dijkstra 计算最短路径。
3. 将结果写入 JSON 文件，结构示例：

```json
{
  "places": [
    {"id": "teaching", "name": "教学楼", "type": "教学区域", "x": 145, "y": 95},
    ...
  ],
  "routes": [
    {"start": "teaching", "end": "library", "distance": 360, "path": ["teaching", "playground", "library"]},
    ...
  ]
}
```

4. 在 `src/main.c` 中实现 `--export` 参数解析，调用导出函数。
5. 确保 `assets/data/` 目录存在，导出文件路径为 `assets/data/routes.json`。

## 验收标准

- [ ] 运行 `./bin/campus_nav --export` 后，`assets/data/routes.json` 文件生成成功。
- [ ] JSON 包含 `places` 和 `routes` 两个顶层字段。
- [ ] `routes` 中包含所有 `n × (n-1)` 条有向路径结果。
- [ ] 任意挑 3 条结果，与 C 程序命令行交互输出对比，数据一致。

## Review 要求

完成后提交代码，人工 review：
- JSON 格式是否正确、可解析
- 导出数据是否与交互模式结果一致
- 文件路径是否写死为 `assets/data/routes.json`

## 关联

- PRD §7.2 Key Features（JSON 导出）
- PRD 前后端数据流通图
- `.scratch/frontend-prototype`
