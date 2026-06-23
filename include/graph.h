#ifndef GRAPH_H
#define GRAPH_H

#include <stdbool.h>

#define MAX_PLACES 32   /* 最多地点数 */
#define MAX_EDGES  128  /* 最多边数（双向） */
#define MAX_NAME   32   /* 地点名称最大长度（含 \0） */
#define MAX_TYPE   16   /* 地点类型最大长度 */

/* 地点类型：与 places 数组下标一一对应 */
typedef enum {
    PLACE_TEACHING = 0,
    PLACE_LIBRARY,
    PLACE_CANTEEN,
    PLACE_DORM,
    PLACE_GYM,
    PLACE_LAB,
    PLACE_HOSPITAL,
    PLACE_OFFICE,
    PLACE_PLAYGROUND,
    PLACE_COUNT
} PlaceId;

/* 边（一条有向记录；无向图成对添加） */
typedef struct {
    int from;       /* 起点 PlaceId */
    int to;         /* 终点 PlaceId */
    int distance;   /* 路径长度，单位米 */
} Edge;

/* 图：邻接表 + 索引表 */
typedef struct {
    const char *names[PLACE_COUNT];
    const char *types[PLACE_COUNT];
    int  coord_x[PLACE_COUNT];
    int  coord_y[PLACE_COUNT];

    Edge edges[MAX_EDGES];
    int  edge_count;
} Graph;

/* 初始化：清空并填充示例地点/路径（与前端原型保持一致） */
void graph_init(Graph *g);

/* 工具：返回 place 名称，未知 id 返回 "?" */
const char *graph_place_name(const Graph *g, int place_id);

/* 工具：判断 id 是否合法 */
bool graph_valid_place(const Graph *g, int place_id);

/* 工具：返回 place 的邻接边数 */
int graph_degree(const Graph *g, int place_id);

/* 工具：取第 k 条邻接边（k 从 0 开始） */
Edge graph_edge_at(const Graph *g, int place_id, int k);

/* 打印地点列表（带编号） */
void graph_print_places(const Graph *g);

/* 打印路径边表 */
void graph_print_edges(const Graph *g);

#endif /* GRAPH_H */
