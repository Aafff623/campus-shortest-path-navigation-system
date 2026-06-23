# 校园最短路径导航系统 — 项目规范

本项目为中北大学软件学院《数据结构》课程设计：校园最短路径导航系统。

## 项目目标

实现一个可运行的校园最短路径导航应用，掌握数据结构与算法的设计方法，按软件开发规范完成小型应用软件。

## 核心需求

1. 输入校园主要地点（教学楼、食堂、宿舍等）及路径长度。
2. 使用**图结构**存储地点与路径。
3. 实现 **Dijkstra** 或 **Floyd** 算法，支持查询任意两点间最短路径及距离。
4. 可视化输出路径文字描述，如 `教学楼 → 图书馆`。
5. 处理异常输入：不存在的节点、起终点相同、未选择等。
6. 界面友好美观，操作方便易行。

## 技术栈

- 前端：纯静态 HTML / CSS / JavaScript（原型已提供）
- 算法实现：C / Java / Python 任选其一（按课程要求）
- 构建工具：按需使用，不强制
- 版本控制：Git + Conventional Commits

## 目录结构

```
.
├── assets/                 # 静态资产
│   └── prototype/          # 前端静态原型（来自 campus-nav-prototype.zip）
├── Docs/                   # 文档资料
│   ├── backup/             # 备份资料
│   ├── 原始资料/           # 老师下发的任务书、原始需求
│   ├── handoff/            # 交接与运行说明
│   └── reports/            # 课程设计说明书、测试报告、截图
├── src/                    # 后端/算法源码（待创建）
├── tests/                  # 测试用例（待创建）
├── requirements.md         # 整理后的需求文档
├── requirements.txt        # 任务书文本副本
├── CLAUDE.md               # 本文件
└── README.md               # 项目总览
```

## 开发约定

- **最小够用**：只实现任务书要求的功能，不预加未要求的能力。
- **算法可验证**：核心 Dijkstra / Floyd 实现需配测试用例，覆盖正常路径、不可达、异常输入。
- **数据与界面分离**：地点、路径、算法逻辑应独立，便于后续替换为后端实现。
- **保持原型一致**：前端页面结构、主题、地图渲染尽量与 `assets/prototype/` 保持一致。

## 提交规范

遵循 Conventional Commits：

```
type(scope): subject
```

常用类型：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`。

示例：

- `feat(algorithm): implement Dijkstra shortest path`
- `docs(reports): add course design cover page`
- `test(core): add edge case tests for disconnected nodes`

## 文档规范

- 新增资料放入 `Docs/` 对应子目录。
- `Docs/原始资料/` 中的文件为只读归档，不直接修改。
- 课程设计说明书最终版放入 `Docs/reports/`。

## 运行方式（待补充）

待源码目录确定后，在 `Docs/handoff/运行说明.md` 中补充编译、运行、测试命令。

## 后续可改进点

- 将 `assets/prototype/js/app.js` 中的 mock 数据替换为真实后端接口。
- 增加校园平面图底图。
- 地点/路径的增删改从演示提示改为真实数据操作。
- 补充算法复杂度分析与性能测试。
