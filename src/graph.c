#include "graph.h"
#include <stdio.h>

/* 内部：添加一条双向边 */
static void add_edge(Graph *g, int a, int b, int distance)
{
    if (g->edge_count + 1 >= MAX_EDGES) {
        return;
    }
    g->edges[g->edge_count++] = (Edge){a, b, distance};
    g->edges[g->edge_count++] = (Edge){b, a, distance};
}

void graph_init(Graph *g)
{
    g->edge_count = 0;

    /* 地点信息：与前端原型 js/app.js 中的 places 保持一致 */
    g->names[PLACE_TEACHING]   = "教学楼";
    g->types[PLACE_TEACHING]   = "教学区域";
    g->coord_x[PLACE_TEACHING] = 145;
    g->coord_y[PLACE_TEACHING] = 95;

    g->names[PLACE_LIBRARY]    = "图书馆";
    g->types[PLACE_LIBRARY]    = "学习场所";
    g->coord_x[PLACE_LIBRARY]  = 345;
    g->coord_y[PLACE_LIBRARY]  = 82;

    g->names[PLACE_CANTEEN]    = "食堂";
    g->types[PLACE_CANTEEN]    = "生活服务";
    g->coord_x[PLACE_CANTEEN]  = 520;
    g->coord_y[PLACE_CANTEEN]  = 152;

    g->names[PLACE_DORM]       = "宿舍区";
    g->types[PLACE_DORM]       = "生活区域";
    g->coord_x[PLACE_DORM]     = 210;
    g->coord_y[PLACE_DORM]     = 275;

    g->names[PLACE_GYM]        = "体育馆";
    g->types[PLACE_GYM]        = "体育设施";
    g->coord_x[PLACE_GYM]      = 430;
    g->coord_y[PLACE_GYM]      = 292;

    g->names[PLACE_LAB]        = "实验楼";
    g->types[PLACE_LAB]        = "教学区域";
    g->coord_x[PLACE_LAB]      = 675;
    g->coord_y[PLACE_LAB]      = 255;

    g->names[PLACE_HOSPITAL]   = "校医院";
    g->types[PLACE_HOSPITAL]   = "公共服务";
    g->coord_x[PLACE_HOSPITAL] = 620;
    g->coord_y[PLACE_HOSPITAL] = 82;

    g->names[PLACE_OFFICE]     = "行政楼";
    g->types[PLACE_OFFICE]     = "办公区域";
    g->coord_x[PLACE_OFFICE]   = 95;
    g->coord_y[PLACE_OFFICE]   = 230;

    g->names[PLACE_PLAYGROUND] = "操场";
    g->types[PLACE_PLAYGROUND] = "体育设施";
    g->coord_x[PLACE_PLAYGROUND] = 320;
    g->coord_y[PLACE_PLAYGROUND] = 185;

    /* 路径：15 条双向边，数值与前端原型 js/app.js 中的 edges 一致 */
    add_edge(g, PLACE_TEACHING,   PLACE_LIBRARY,    220);
    add_edge(g, PLACE_TEACHING,   PLACE_OFFICE,     180);
    add_edge(g, PLACE_TEACHING,   PLACE_PLAYGROUND, 260);
    add_edge(g, PLACE_LIBRARY,    PLACE_CANTEEN,    210);
    add_edge(g, PLACE_LIBRARY,    PLACE_HOSPITAL,   300);
    add_edge(g, PLACE_LIBRARY,    PLACE_PLAYGROUND, 140);
    add_edge(g, PLACE_CANTEEN,    PLACE_LAB,        240);
    add_edge(g, PLACE_CANTEEN,    PLACE_GYM,        190);
    add_edge(g, PLACE_DORM,       PLACE_OFFICE,     170);
    add_edge(g, PLACE_DORM,       PLACE_PLAYGROUND, 160);
    add_edge(g, PLACE_DORM,       PLACE_GYM,        260);
    add_edge(g, PLACE_GYM,        PLACE_LAB,        280);
    add_edge(g, PLACE_GYM,        PLACE_PLAYGROUND, 170);
    add_edge(g, PLACE_HOSPITAL,   PLACE_LAB,        210);
    add_edge(g, PLACE_OFFICE,     PLACE_PLAYGROUND, 230);
}

const char *graph_place_name(const Graph *g, int place_id)
{
    (void)g;
    if (place_id < 0 || place_id >= PLACE_COUNT) {
        return "?";
    }
    return g->names[place_id];
}

bool graph_valid_place(const Graph *g, int place_id)
{
    (void)g;
    return place_id >= 0 && place_id < PLACE_COUNT;
}

int graph_degree(const Graph *g, int place_id)
{
    int n = 0;
    for (int i = 0; i < g->edge_count; i++) {
        if (g->edges[i].from == place_id) {
            n++;
        }
    }
    return n;
}

Edge graph_edge_at(const Graph *g, int place_id, int k)
{
    int seen = 0;
    for (int i = 0; i < g->edge_count; i++) {
        if (g->edges[i].from == place_id) {
            if (seen == k) {
                return g->edges[i];
            }
            seen++;
        }
    }
    return (Edge){-1, -1, -1};
}

void graph_print_places(const Graph *g)
{
    printf("校园地点列表（共 %d 个）：\n", PLACE_COUNT);
    for (int i = 0; i < PLACE_COUNT; i++) {
        printf("  %d. %s  [%s]  坐标(%d, %d)\n",
               i, g->names[i], g->types[i], g->coord_x[i], g->coord_y[i]);
    }
}

void graph_print_edges(const Graph *g)
{
    printf("\n路径边表（共 %d 条有向记录，无向图成对存储）：\n", g->edge_count);
    printf("  %-4s %-8s %-8s %-8s\n", "序号", "起点", "终点", "距离(米)");
    for (int i = 0; i < g->edge_count; i++) {
        printf("  %-4d %-8s %-8s %-8d\n",
               i,
               graph_place_name(g, g->edges[i].from),
               graph_place_name(g, g->edges[i].to),
               g->edges[i].distance);
    }
}
