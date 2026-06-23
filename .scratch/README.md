# Todo List — 校园最短路径导航系统

本目录使用 local-markdown issue tracker。每个子目录是一个任务，完成后移动或归档。

## 任务清单

| 编号 | 任务 | 状态 | 依赖 |
|------|------|------|------|
| 1 | [setup-c-project](./setup-c-project/) | `ready-for-agent` | - |
| 2 | [graph-data-structure](./graph-data-structure/) | `ready-for-agent` | #1 |
| 3 | [dijkstra-algorithm](./dijkstra-algorithm/) | `ready-for-agent` | #2 |
| 4 | [cli-menu-query](./cli-menu-query/) | `ready-for-agent` | #2 |
| 5 | [input-validation](./input-validation/) | `ready-for-agent` | #4 |
| 6 | [test-cases](./test-cases/) | `ready-for-agent` | #3, #5 |
| 7 | [frontend-prototype](./frontend-prototype/) | `ready-for-agent` | - |
| 8 | [course-design-report](./course-design-report/) | `ready-for-agent` | #6, #7 |
| 9 | [final-review](./final-review/) | `ready-for-human` | #8 |

## 工作流

1. 每个任务目录下的 `README.md` 包含需求、验收标准和 review 要求。
2. 开始任务时，将状态改为 `in_progress`。
3. 完成后，在本地做一次原子 commit，并将任务状态更新为 `ready-for-review`，等待人工 review。
4. 人工 review 通过后：
   - 更新状态为 `completed`。
   - 执行 `git push origin main` 推送到 GitHub。
5. **未经 review 不要 push**。

## Git 命令参考

```bash
# 查看状态
git status

# 提交完成的工作
git add -A
git commit -m "feat(scope): description"

# review 通过后推送
git push origin main
```
## 参考

- PRD: `../PRD-校园最短路径导航系统.md`
- 项目规范: `../CLAUDE.md`
- 任务书: `../docs/原始资料/课程设计任务书.txt`
