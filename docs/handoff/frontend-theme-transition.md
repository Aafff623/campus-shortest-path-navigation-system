# Plan — 亮暗色主题切换渐变动画

> 任务 #39
> 日期：2026-06-23

## 1. 目标

让「亮色 / 深色」主题切换不再是瞬间跳变，而是在约 250ms 内平滑渐变到目标主题。

## 2. 关键设计决策

### 决策 1：过渡挂到 body 与全局元素

- `body` 本身用 `var(--bg)` / `var(--text)`，加 `transition: background-color 250ms ease, color 250ms ease`。
- 为了让卡片、按钮、地图、表格等也跟随主题变量渐变，对 `*, *::before, *::after` 统一加常见颜色属性的过渡。
- 只过渡 `background-color / color / border-color / box-shadow / fill / stroke`，不碰 `transform` 等已有动画属性。

### 决策 2：250ms 时长

- 太长显得迟钝，太短看不出渐变，250ms 是常见节奏。

### 决策 3：尊重 `prefers-reduced-motion`

- 把整套过渡包进 `@media (prefers-reduced-motion: no-preference)`，避免给需要减少动效的用户造成不适。

## 3. 文件改动

| 文件 | 改动 |
|------|------|
| `css/styles.css` | body 后新增 `@media (prefers-reduced-motion: no-preference)` 块，设置 body 与全局元素的 theme-aware 过渡 |

## 4. 关键代码

```css
@media (prefers-reduced-motion: no-preference) {
  body {
    transition: background-color 250ms ease, color 250ms ease;
  }

  *,
  *::before,
  *::after {
    transition: background-color 250ms ease,
                color 250ms ease,
                border-color 250ms ease,
                box-shadow 250ms ease,
                fill 250ms ease,
                stroke 250ms ease;
  }
}
```

## 5. 验收

| 项 | 期望 | 实测 |
|----|------|------|
| 点击「深色」按钮 | body、sidebar、card、topbar 等颜色在 ~250ms 内渐变 | ✅ |
| 点击「亮色」按钮 | 同样平滑恢复 | ✅ |
| 地图节点/边 | 填充色与描边色跟随主题渐变 | ✅ |
| 已有 hover/动画 | `.btn`、`.nav-item`、侧边栏抽屉等原有 transition 不被覆盖 | ✅ |
| 系统开启减少动效 | 主题切换瞬间完成，无过渡 | ✅ |

## 6. 仍待办

- 任务 #9：课程设计说明书
- 远程 main 分支与 master 同步

## 7. 回滚

```bash
git revert <本次 commit>
```
