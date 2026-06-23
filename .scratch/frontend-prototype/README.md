# frontend-prototype

**标签**: `ready-for-agent`  
**依赖**: 无

## 目标

确保前端原型页面完整、可正常打开，并产出说明书所需的截图。

## 任务内容

1. 验证 `assets/prototype/campus-nav-prototype/` 下所有页面能正常打开。
2. 检查页面链接、主题切换、地图渲染是否正常。
3. 如发现问题，修复 HTML/CSS/JS。
4. 产出关键页面截图，放入 `docs/reports/screenshots/`。
5. 可选：将 C 程序计算结果与前端原型结果对比，确保一致。

## 验收标准

- [ ] `index.html`、`query.html`、`result.html`、`locations.html`、`paths.html`、`algorithm.html`、`about.html` 均可正常打开。
- [ ] 查询页能选择起终点并跳转到结果页。
- [ ] 结果页展示最短距离、文字路径、地图高亮。
- [ ] `docs/reports/screenshots/` 包含至少 5 张关键页面截图。

## Review 要求

完成后提交代码，人工 review：
- 页面是否完整、美观
- 截图是否清晰、能用于说明书
- 前端展示数据是否与 C 程序一致

## 关联

- PRD §7.1 UX / 原型
- 任务书 §2 设计要求（2）
