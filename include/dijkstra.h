#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include "graph.h"

#define DIJKSTRA_MAX_PATH  32   /* 路径最多经过的顶点数 */
#define DIJKSTRA_UNREACH   -1   /* 不可达标志 */

/* 最短路径结果 */
typedef struct {
    int distance;                /* 最短距离（米），不可达时为 DIJKSTRA_UNREACH */
    int path[DIJKSTRA_MAX_PATH]; /* 路径顶点序列（PlaceId） */
    int path_len;                /* 路径顶点数（≥ 1） */
} DijkstraResult;

/* 计算从 start 到 end 的最短路径。start == end 时 distance = 0、path = {start}。
   参数非法或不可达时，distance = DIJKSTRA_UNREACH、path_len = 0。 */
DijkstraResult dijkstra_shortest_path(const Graph *g, int start, int end);

#endif /* DIJKSTRA_H */
