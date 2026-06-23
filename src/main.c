#include <stdio.h>
#include <string.h>

#define VERSION "0.1.0"
#define EXPORT_PATH "assets/data/routes.json"

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
    printf("  2. 查询两点间最短路径\n");
    printf("  0. 退出系统\n");
    printf("\n");
    printf("提示：使用 --export 参数可导出前端所需的 routes.json。\n");
    printf("\n");
}

static int export_routes_json_stub(const char *path)
{
    FILE *fp = fopen(path, "w");
    if (fp == NULL) {
        fprintf(stderr, "错误：无法写入文件 %s\n", path);
        return 1;
    }

    fprintf(fp, "{\n");
    fprintf(fp, "  \"places\": [],\n");
    fprintf(fp, "  \"routes\": []\n");
    fprintf(fp, "}\n");

    fclose(fp);
    printf("已导出占位数据到 %s\n", path);
    return 0;
}

int main(int argc, char *argv[])
{
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
        return export_routes_json_stub(EXPORT_PATH);
    }

    print_welcome();
    print_menu();

    printf("（当前为占位菜单，具体交互在后续任务中实现。）\n\n");

    return 0;
}
