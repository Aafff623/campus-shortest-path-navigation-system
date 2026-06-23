#include "dijkstra.h"
#include <string.h>
#include <limits.h>
#include <stdbool.h>

/* 朴素 Dijkstra：O(V²)。V ≤ PLACE_COUNT，规模够用。 */
DijkstraResult dijkstra_shortest_path(const Graph *g, int start, int end)
{
    DijkstraResult result;
    result.distance = DIJKSTRA_UNREACH;
    result.path_len = 0;
    memset(result.path, 0, sizeof(result.path));

    if (!graph_valid_place(g, start) || !graph_valid_place(g, end)) {
        return result;
    }

    if (start == end) {
        result.distance = 0;
        result.path[0] = start;
        result.path_len = 1;
        return result;
    }

    int dist[PLACE_COUNT];
    bool visited[PLACE_COUNT];
    int prev[PLACE_COUNT];

    for (int i = 0; i < PLACE_COUNT; i++) {
        dist[i]    = INT_MAX;
        visited[i] = false;
        prev[i]    = -1;
    }
    dist[start] = 0;

    for (int iter = 0; iter < PLACE_COUNT; iter++) {
        /* 找当前未访问的最小距离顶点 */
        int u = -1;
        int best = INT_MAX;
        for (int i = 0; i < PLACE_COUNT; i++) {
            if (!visited[i] && dist[i] < best) {
                best = dist[i];
                u = i;
            }
        }

        if (u == -1 || dist[u] == INT_MAX) {
            break;  /* 剩余顶点不可达 */
        }
        if (u == end) {
            break;  /* 终点已确定最短 */
        }

        visited[u] = true;

        /* 松弛 u 的所有邻接边 */
        int deg = graph_degree(g, u);
        for (int k = 0; k < deg; k++) {
            Edge e = graph_edge_at(g, u, k);
            int v = e.to;
            if (visited[v]) continue;

            long candidate = (long)dist[u] + (long)e.distance;
            if (candidate < dist[v]) {
                dist[v] = (int)candidate;
                prev[v] = u;
            }
        }
    }

    if (dist[end] == INT_MAX) {
        return result;  /* 不可达 */
    }

    /* 回溯路径：end -> ... -> start */
    int stack[PLACE_COUNT];
    int top = 0;
    int cursor = end;
    while (cursor != -1) {
        stack[top++] = cursor;
        if (cursor == start) break;
        cursor = prev[cursor];
    }

    /* 检查是否真的回到 start（start 与 end 连通） */
    if (top == 0 || stack[top - 1] != start) {
        result.distance = DIJKSTRA_UNREACH;
        result.path_len = 0;
        return result;
    }

    /* 反转 stack 到 result.path */
    for (int i = 0; i < top; i++) {
        result.path[i] = stack[top - 1 - i];
    }
    result.path_len = top;
    result.distance = dist[end];

    return result;
}
