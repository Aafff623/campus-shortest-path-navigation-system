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

- 前端：纯静态 HTML / CSS / JavaScript，读取 C 程序导出的 `assets/data/routes.json`
- 算法后端：C（C99 标准）
- 数据结构：邻接矩阵/邻接表存储无向带权图
- 核心算法：Dijkstra（Floyd 可作为扩展）
- 数据交换：JSON（`assets/data/routes.json`）
- 构建工具：gcc / MinGW + Makefile
- 版本控制：Git + GitHub private repo + Conventional Commits
  - 远程仓库：`https://github.com/Aafff623/campus-shortest-path-navigation-system`
  - 详细流程见 `docs/handoff/git-workflow.md`

## 目录结构

```
.
├── assets/                 # 静态资产
│   ├── data/               # C 程序导出的 routes.json
│   └── prototype/          # 前端静态原型（来自 campus-nav-prototype.zip）
├── bin/                    # 编译产物
├── docs/                   # 文档资料
│   ├── agents/             # Matt Pocock 技能配置
│   ├── adr/                # 架构决策记录
│   ├── backup/             # 备份资料
│   ├── 原始资料/           # 老师下发的任务书、原始需求
│   ├── handoff/            # 交接与运行说明
│   └── reports/            # 课程设计说明书、测试报告、截图
├── src/                    # C 源码
├── tests/                  # 测试用例
├── Makefile                # 构建脚本
├── requirements.md         # 整理后的需求文档
├── requirements.txt        # 任务书文本副本
├── PRD-校园最短路径导航系统.md  # 产品需求文档
├── CONTEXT.md              # 领域上下文
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

- 新增资料放入 `docs/` 对应子目录。
- `docs/原始资料/` 中的文件为只读归档，不直接修改。
- 课程设计说明书最终版放入 `docs/reports/`。

## Git 工作流

1. **本地 commit**：每完成一个 `.scratch/` 任务，做一次原子 commit。
2. **人工 review**：代码/文档先由人工检查验收标准。
3. **通过后 push**：review 通过后，再执行 `git push origin main`。
4. **不 push 未经 review 的内容**。

详见 `docs/handoff/git-workflow.md`。

## 运行方式（待补充）

待源码目录确定后，在 `docs/handoff/运行说明.md` 中补充编译、运行、测试命令。

## 后续可改进点

- 将 `assets/prototype/js/app.js` 中的 mock 数据替换为真实后端接口。
- 增加校园平面图底图。
- 地点/路径的增删改从演示提示改为真实数据操作。
- 补充算法复杂度分析与性能测试。

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
