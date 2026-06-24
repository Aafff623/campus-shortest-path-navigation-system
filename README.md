# 校园最短路径导航系统

![校园最短路径导航系统 Banner](docs/images/readme-banner.png)

中北大学软件学院《数据结构》课程设计项目。

## 项目简介

输入校园主要地点及路径长度，使用图结构存储，基于 Dijkstra 或 Floyd 算法查询任意两点间的最短路径，并以文字描述形式输出结果。

## 功能需求

- 地点录入：教学楼、食堂、宿舍、图书馆等。
- 路径维护：地点之间的路径长度。
- 最短路径查询：任意两点间的最短路径及总距离。
- 结果可视化：文字路径输出，如 `教学楼 → 图书馆`；并在 2D 校园平面图上高亮路径。
- 异常处理：不存在的节点、起终点相同等。

## 仓库

GitHub public repo: `https://github.com/Aafff623/campus-shortest-path-navigation-system`

## 快速开始

1. 查看整理后的需求：`requirements.md`
2. 查看前端原型：`assets/prototype/campus-nav-prototype/index.html`（可直接用浏览器打开，或启动 `python -m http.server`；推荐端口见 `docs/handoff/运行说明.md`）
3. 查看任务书原件：`docs/原始资料/课程设计任务书.doc`
4. 查看 PRD：
   - `PRD-校园最短路径导航系统.md`
   - `PRD-Frontend-Visual-Polish.md`（前端视觉去 AI 化升级）
5. 查看任务清单：`.scratch/README.md`
6. 查看运行说明：`docs/handoff/运行说明.md`

## 目录结构

```
├── assets/                 # 静态资产
│   ├── data/               # C 程序导出的 routes.json
│   └── prototype/          # 前端静态原型
│       └── campus-nav-prototype/  # 4 页 HTML/CSS/JS 原型
├── bin/                    # 编译产物
├── docs/                   # 文档资料
│   ├── agents/             # Matt Pocock 技能配置
│   ├── adr/                # 架构决策记录
│   ├── backup/             # 备份资料
│   ├── handoff/            # 交接与运行说明
│   ├── reports/            # 课程设计说明书、测试报告、截图
│   └── 原始资料/           # 老师下发的任务书、原始需求
├── src/                    # C 源码
│   ├── dijkstra.c          # Dijkstra 算法实现
│   └── main.c              # 主程序与 JSON 导出
├── include/                # C 头文件
├── tests/                  # 测试用例
├── Makefile                # 构建脚本
├── requirements.md         # 整理后的需求文档
├── requirements.txt        # 任务书文本副本
├── PRD-校园最短路径导航系统.md  # 产品需求文档
├── PRD-Frontend-Visual-Polish.md  # 前端视觉升级 PRD
├── CONTEXT.md              # 领域上下文
├── CLAUDE.md               # 项目规范
└── README.md               # 本文件
```

## 2D 校园图 overlay

前端已接入中北大学本科招生信息网官方校园平面图：

- 底图：`assets/prototype/campus-nav-prototype/images/nuc-campus-map-official.jpg`
- 坐标配置：`assets/prototype/campus-nav-prototype/data/campus-layout.json`
- 坐标标定工具：`assets/prototype/campus-nav-prototype/tools/coordinate-debug-tool.html`

当前坐标为草稿值（由示意 schematic 等比缩放得到），尚未根据真实建筑位置精确校准。校准方式见工具内说明。

## 技术栈

- 前端：HTML / CSS / JavaScript（纯静态，4 页面：首页、路径查询、数据管理、系统说明）
- 算法后端：C（C99 标准），Dijkstra 最短路径
- 数据交换：JSON（`assets/data/routes.json`）
- 构建工具：gcc / MinGW + Makefile

## 开发规范

详见 `CLAUDE.md`。

## 交付物

- 可运行程序 + 源码（C + 静态前端）
- 课程设计说明书（放入 `docs/reports/`）
- 前端升级 PRD 与 handoff（`PRD-Frontend-Visual-Polish.md`、`docs/handoff/frontend-visual-polish-progress-handoff.md`）
