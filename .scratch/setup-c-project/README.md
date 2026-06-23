# setup-c-project

**标签**: `ready-for-agent`  
**依赖**: 无

## 目标

搭建 C 语言项目骨架，让后续算法代码有可编译、可运行的基础。

## 任务内容

1. 创建 `src/` 目录。
2. 创建 `include/` 目录（可选）。
3. 创建初始 `src/main.c`，包含 `int main(void)` 入口，能打印欢迎信息并退出。
4. 提供编译脚本或命令（如 Windows 下 `gcc src/main.c -o bin/campus_nav.exe`）。
5. 更新 `docs/handoff/运行说明.md`，说明如何编译运行。

## 验收标准

- [ ] `src/main.c` 存在且能通过 gcc 编译。
- [ ] 运行后能在控制台看到欢迎信息。
- [ ] `docs/handoff/运行说明.md` 包含编译与运行命令。

## Review 要求

完成后提交代码，人工 review：
- 目录结构是否清晰
- 编译命令在本地是否可复现
- 是否遵循项目 CLAUDE.md 的约定

## 关联

- PRD §7.3 Technology
- CLAUDE.md §目录结构
