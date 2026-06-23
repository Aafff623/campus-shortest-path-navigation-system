# Git 工作流

## 仓库地址

- **GitHub private 仓库**: `https://github.com/Aafff623/campus-shortest-path-navigation-system`
- **本地 remote**: `origin https://github.com/Aafff623/campus-shortest-path-navigation-system.git`

## 分支

- `main`（或当前 `master`）作为默认分支。
- 每个任务在本地完成并 commit 后，**不直接 push**。

## 提交规范

遵循 Conventional Commits：

```
type(scope): subject
```

常用类型：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`。

示例：

- `feat(algorithm): implement Dijkstra shortest path`
- `test(core): add edge case tests for disconnected nodes`
- `docs(reports): add course design cover page`

## 流程

1. **本地开发**：完成一个任务后，做一次原子 commit。
2. **人工 review**：提交代码/文档后，由人工检查验收标准是否满足。
3. **通过后 push**：review 通过后，再执行 `git push origin main`。
4. **不 push 未完成或未经 review 的内容**。

## 常用命令

```bash
# 查看状态
git status

# 添加并提交
git add -A
git commit -m "feat(graph): add Place and Graph structs with sample data"

# 查看提交历史
git log --oneline

# review 通过后推送
git push origin main
```

## 注意事项

- 不要在 commit 中提交敏感信息（密码、密钥、个人学号等）。
- 课程设计说明书等最终文档可在完成最终 review 后一并 push。
- 若需要协作，可在主分支上创建功能分支，但本课程设计建议单分支线性历史。
