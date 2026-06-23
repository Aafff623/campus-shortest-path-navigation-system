# dijkstra-algorithm

**标签**: `ready-for-agent`  
**依赖**: graph-data-structure

## 目标

实现 Dijkstra 算法，计算任意两点间的最短距离和路径序列。

## 任务内容

1. 在 `src/dijkstra.h` / `src/dijkstra.c` 中实现 `dijkstra(Graph *g, int start, int end, int *path, int *path_len, int *distance)`。
2. 算法返回：
   - 最短距离
   - 路径顶点序列（用于后续输出 `A → B → C`）
   - 路径长度（顶点数）
3. 处理不可达情况（返回特殊值或错误码）。
4. 编写简单单元测试验证算法正确性（可放在 `tests/` 或 `src/main.c` 的测试分支）。

## 验收标准

- [ ] 对示例数据，教学楼 → 图书馆的最短路径与距离正确。
- [ ] 对示例数据，宿舍区 → 实验楼的最短路径与距离正确。
- [ ] 不可达节点返回明确错误，不崩溃。
- [ ] 至少覆盖 3 组手动可验证的测试用例。

## Review 要求

完成后提交代码，人工 review：
- Dijkstra 实现是否正确（优先队列或简单数组均可）
- 路径回溯逻辑是否正确
- 测试用例是否充分

## 关联

- PRD §7.2 Key Features（最短路径查询）
- PRD §7.3 Technology（Dijkstra 算法）
- 任务书 §2 设计内容（2）（5）
