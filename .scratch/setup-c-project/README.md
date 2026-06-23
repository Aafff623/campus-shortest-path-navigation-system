# setup-c-project

**标签**: `ready-for-agent`  
**依赖**: 无

## 目标

搭建 C 语言项目骨架，让后续算法代码有可编译、可运行的基础。

## 任务内容

1. 创建目录结构：
   - `src/` — C 源码
   - `include/` — 头文件（可选）
   - `bin/` — 编译产物
   - `assets/data/` — C 程序导出的 JSON 输出目录
2. 创建初始 `src/main.c`，包含 `int main(void)` 入口，支持两种模式：
   - 默认：命令行交互菜单
   - `--export`：导出 `assets/data/routes.json`
3. 创建 `Makefile`，至少支持：
   - `make` 或 `make build`：编译出 `bin/campus_nav`
   - `make run`：编译并运行交互模式
   - `make export`：编译并导出 JSON
4. 更新 `docs/handoff/运行说明.md`，说明如何编译、运行、导出 JSON。

## 验收标准

- [ ] `src/main.c` 存在且能通过 `make build` 编译。
- [ ] 运行 `./bin/campus_nav` 能看到欢迎信息和菜单。
- [ ] 运行 `./bin/campus_nav --export` 能在 `assets/data/` 目录下生成 `routes.json`（即使此时内容为空/占位）。
- [ ] `docs/handoff/运行说明.md` 包含编译、运行、导出命令。

## Review 要求

完成后提交代码，人工 review：
- 目录结构是否清晰
- Makefile 是否能在本地正常编译
- `--export` 参数是否被正确解析
- 是否遵循项目 CLAUDE.md 的约定

## 关联

- PRD §7.3 Technology
- PRD 前后端数据流通图
- CLAUDE.md §目录结构
