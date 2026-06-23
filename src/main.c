#include <stdio.h>
#include <string.h>
#include "graph.h"
#include "dijkstra.h"

#define VERSION "0.4.0"
#define EXPORT_PATH "assets/data/routes.json"
#define EXPORT_MIRROR_PATH "assets/prototype/campus-nav-prototype/data/routes.json"

static void print_welcome(void)
{
    printf("\n");
    printf("╔══════════════════════════════════════════╗\n");
    printf("║     校园最短路径导航系统 v%s          ║\n", VERSION);
    printf("║     Campus Shortest Path Navigator       ║\n");
    printf("╚══════════════════════════════════════════╝\n");
    printf("\n");
}

static void print_menu(void)
{
    printf("功能菜单：\n");
    printf("  1. 查看校园地点列表\n");
    printf("  2. 查看所有路径\n");
    printf("  3. 查询两点间最短路径\n");
    printf("  0. 退出系统\n");
    printf("\n");
    printf("提示：使用 --export 参数可导出 routes.json。\n");
    printf("\n");
}

static void print_route(const Graph *g, const DijkstraResult *r)
{
    if (r->distance == DIJKSTRA_UNREACH || r->path_len == 0) {
        printf("结果：没有可达路径。\n");
        return;
    }
    printf("路径：");
    for (int i = 0; i < r->path_len; i++) {
        printf("%s", graph_place_name(g, r->path[i]));
        if (i < r->path_len - 1) printf(" → ");
    }
    printf("\n");
    printf("最短距离：%d 米\n", r->distance);
}

static int do_query(Graph *g)
{
    int start, end;
    char line[64];

    graph_print_places(g);
    printf("\n请输入起点编号：");
    if (!fgets(line, sizeof(line), stdin)) return 0;
    if (sscanf(line, "%d", &start) != 1) {
        printf("输入无效。\n");
        return 1;
    }
    if (!graph_valid_place(g, start)) {
        printf("起点编号 %d 不存在。\n", start);
        return 1;
    }

    printf("请输入终点编号：");
    if (!fgets(line, sizeof(line), stdin)) return 0;
    if (sscanf(line, "%d", &end) != 1) {
        printf("输入无效。\n");
        return 1;
    }
    if (!graph_valid_place(g, end)) {
        printf("终点编号 %d 不存在。\n", end);
        return 1;
    }

    if (start == end) {
        printf("起点和终点不能相同。\n");
        return 1;
    }

    DijkstraResult r = dijkstra_shortest_path(g, start, end);
    print_route(g, &r);
    return 1;
}

/* 简易 JSON 字符串转义：仅处理 ASCII 安全字符 + 中文。足够地点名场景。 */
static void fprint_json_string(FILE *fp, const char *s)
{
    fputc('"', fp);
    for (const unsigned char *p = (const unsigned char *)s; *p; p++) {
        unsigned char c = *p;
        if (c == '"') fputs("\\\"", fp);
        else if (c == '\\') fputs("\\\\", fp);
        else if (c == '\n') fputs("\\n", fp);
        else if (c == '\r') fputs("\\r", fp);
        else if (c == '\t') fputs("\\t", fp);
        else fputc(c, fp);
    }
    fputc('"', fp);
}

static int export_routes_json(const Graph *g, const char *path)
{
    FILE *fp = fopen(path, "w");
    if (fp == NULL) {
        fprintf(stderr, "错误：无法写入文件 %s\n", path);
        return 1;
    }

    fprintf(fp, "{\n");
    fprintf(fp, "  \"places\": [\n");
    for (int i = 0; i < PLACE_COUNT; i++) {
        fprintf(fp, "    {");
        fprint_json_string(fp, "id"); fprintf(fp, ": ");
        fprint_json_string(fp, g->ids[i]); fprintf(fp, ", ");
        fprint_json_string(fp, "name"); fprintf(fp, ": ");
        fprint_json_string(fp, g->names[i]); fprintf(fp, ", ");
        fprint_json_string(fp, "type"); fprintf(fp, ": ");
        fprint_json_string(fp, g->types[i]); fprintf(fp, ", ");
        fprint_json_string(fp, "icon"); fprintf(fp, ": ");
        fprint_json_string(fp, g->icons[i]); fprintf(fp, ", ");
        fprint_json_string(fp, "x"); fprintf(fp, ": %d, ", g->coord_x[i]);
        fprint_json_string(fp, "y"); fprintf(fp, ": %d}", g->coord_y[i]);
        if (i != PLACE_COUNT - 1) fputc(',', fp);
        fputc('\n', fp);
    }
    fprintf(fp, "  ],\n");

    /* 导出无向边（只保留 from < to 的一条，避免重复） */
    fprintf(fp, "  \"edges\": [\n");
    int edge_first = 1;
    for (int i = 0; i < g->edge_count; i++) {
        if (g->edges[i].from >= g->edges[i].to) continue;
        if (!edge_first) fputc(',', fp);
        fputc('\n', fp);
        edge_first = 0;
        fprintf(fp, "    {");
        fprint_json_string(fp, "source"); fprintf(fp, ": ");
        fprint_json_string(fp, g->ids[g->edges[i].from]); fprintf(fp, ", ");
        fprint_json_string(fp, "target"); fprintf(fp, ": ");
        fprint_json_string(fp, g->ids[g->edges[i].to]); fprintf(fp, ", ");
        fprint_json_string(fp, "distance"); fprintf(fp, ": %d}", g->edges[i].distance);
    }
    if (!edge_first) fputc('\n', fp);
    fprintf(fp, "  ],\n");

    /* 预计算所有 (i, j) i≠j 的最短路径 */
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
            fprint_json_string(fp, "end"); fprintf(fp, ": ");
            fprint_json_string(fp, g->ids[j]); fprintf(fp, ", ");
            fprint_json_string(fp, "distance"); fprintf(fp, ": %d, ", r.distance);
            fprint_json_string(fp, "path"); fprintf(fp, ": [");
            for (int k = 0; k < r.path_len; k++) {
                if (k > 0) fputc(',', fp);
                fputc(' ', fp);
                fprint_json_string(fp, g->ids[r.path[k]]);
            }
            fputs(" ]}", fp);
            total++;
        }
    }
    if (total > 0) fputc('\n', fp);
    fprintf(fp, "  ]\n");
    fprintf(fp, "}\n");

    fclose(fp);
    printf("已导出 %d 个地点、%d 条最短路径到 %s\n", PLACE_COUNT, total, path);
    return 0;
}

static int read_choice(void)
{
    char line[16];
    if (!fgets(line, sizeof(line), stdin)) return -1;
    int n;
    if (sscanf(line, "%d", &n) != 1) return -1;
    return n;
}

int main(int argc, char *argv[])
{
    Graph g;
    graph_init(&g);

    int export_mode = 0;
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--export") == 0) {
            export_mode = 1;
        } else if (strcmp(argv[i], "--help") == 0 || strcmp(argv[i], "-h") == 0) {
            printf("用法：%s [--export]\n", argv[0]);
            printf("  --export    导出 %s 供前端使用\n", EXPORT_PATH);
            printf("  --help      显示帮助信息\n");
            return 0;
        } else {
            fprintf(stderr, "未知参数：%s\n", argv[i]);
            return 1;
        }
    }

    if (export_mode) {
        if (export_routes_json(&g, EXPORT_PATH) != 0) return 1;
        /* 同步到前端 dev 用的 mirror（C 端的 source of truth 仍是 EXPORT_PATH） */
        if (strcmp(EXPORT_PATH, EXPORT_MIRROR_PATH) != 0) {
            return export_routes_json(&g, EXPORT_MIRROR_PATH);
        }
        return 0;
    }

    print_welcome();
    print_menu();
    printf("已加载 %d 个地点、%d 条有向路径记录。\n\n", PLACE_COUNT, g.edge_count);

    int running = 1;
    while (running) {
        printf("请选择功能：");
        int choice = read_choice();
        switch (choice) {
        case 1:
            graph_print_places(&g);
            printf("\n");
            break;
        case 2:
            graph_print_edges(&g);
            printf("\n");
            break;
        case 3:
            do_query(&g);
            printf("\n");
            break;
        case 0:
            running = 0;
            break;
        default:
            printf("无效选择。\n\n");
        }
    }

    printf("已退出。\n");
    return 0;
}
