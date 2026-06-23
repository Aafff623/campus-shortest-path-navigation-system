# 前端布局与"AI 味"问题 — 调研报告

> 日期：2026-06-23
> 调研方式：Playwright 实测 5 个页面（index / query / result / locations / paths）
> 视口参考：1511 × 759

## 1. 现状数据

| 页面 | 文档总高 | 滚动 | 主要问题 |
|------|----------|------|----------|
| index.html | 865 | 一屏 | hero 337、3 张卡 151，信息散 |
| query.html | 1367 | 1.8 屏 | 左侧表单 315 vs 右侧地图 627，错位 |
| result.html | 1462 | 1.9 屏 | 左侧结果 579 vs 右侧地图 627，垂直堆叠分段 |
| locations.html | — | 严重 | 表格行距大、padding 厚重 |
| paths.html | — | 严重 | 同上 |

## 2. 根本问题

1. **grid 双列对齐错位**：query/result 用 `grid two`，左右子元素高度差 300+px，整页垂直空间浪费
2. **垂直空间被装饰组件占据**：hero-visual（360×360）、topbar 60+、侧边栏 236
3. **信息密度低**：每张 stat-card 装 "图标 + 数字 + 一句话" 占用 151px
4. **AI 味残留**：
   - 装饰 emoji（📍⛓ƒ）
   - hero-visual 插画（云朵+楼栋）
   - hero `::after` 装饰伪元素
   - 说教式文案（"课程设计原型"等）
5. **页面冗余**：7 个页面本质上是 4 类功能（导航/查询/数据/说明）

## 3. 对齐后的需求（用户已确认）

### 3.1 视觉/布局（第一轮 PRD-Polish-Frontend）

| # | 决策 | 选择 |
|---|------|------|
| 1 | 布局方向 | **B. 保留 grid 但压缩高度** |
| 2 | hero 插画 | **B. 改成小尺寸真实地图占位**（用 prototype 现有 SVG 校园图） |
| 3 | emoji icon | **B. 换更克制的 SVG icon**（几何符号、不带彩色） |
| 4 | 是否进 PRD | **A. 是** |
| 5 | 页面优先级 | **A. 先 index + query** |

### 3.2 信息架构合并（第二轮 IA 合并）

| # | 决策 | 选择 |
|---|------|------|
| 1 | 模块数 | **A. 4 模块**：首页 / 路径查询 / 数据管理 / 系统说明 |
| 2 | query + result 形式 | **单页 section**（输入在上、结果在下，初始空） |
| 3 | about + algorithm 形式 | **tab 切换** |
| 4 | locations + paths 形式 | **tab 切换** |
| 5 | 旧页面处理 | **删除**（7 个原页面整体删除） |

## 4. 修复范围（按优先级）

### P0（第一轮：Polish + IA 合并）
- **新建 4 个页面**：index / query / data / docs
- **删除 7 个旧页面**：result / locations / paths / algorithm / about
- query.html 合并 query + result（单页 section）
- data.html 合并 locations + paths（tab）
- docs.html 合并 about + algorithm（tab）
- 侧边栏 7 项 → 4 项
- index.html：hero 压缩、3 卡片改 SVG icon、hero-visual 改真实地图占位
- 通用样式：SVG icon、card、btn 紧凑化

### P1（下一轮）
- algorithm.html / about.html：已合并到 docs.html，**不再单独优化**
- 真实校园地图底图（用户已说明后续再做）

---

## 5. vibecoding-template 风格基准（追加 2026-06-23）

用户反馈："你的界面管理系统的前端风格需要按照它的来设计"。vibecoding-template 实际就是 **Art Design Pro**（Vue 3 + Element Plus + Tailwind v4）。其 frontend 是高度结构化的 admin 模板，下面提取出可借鉴的设计 token。

### 5.1 来源样本

| 文件 | 路径 |
|------|------|
| exam（在线考试系统） | `docs/backup/website-demo/exam.zip` → `vue/` |
| pet-manager（宠物领养） | `docs/backup/website-demo/pet-manager.zip` → `vue/` |
| admin-v（Spring 后台） | `docs/backup/template/codeying-admin-v.zip`（**无前端，只有后端 + Java + 一份 ecommerce-v4 components 参考库**，本调研不采用其代码，只确认前端基础规范） |

### 5.2 颜色 token（Light / Dark 双主题）

```css
/* Light */
--art-color:       #ffffff
--default-bg-color: #fafbfc   /* 页面底色，比 #f4f8ff 更接近中性灰 */
--default-box-color: #ffffff
--art-gray-100:    #f9fafb
--art-gray-200:    #f2f4f5
--art-gray-300:    #e6eaeb
--art-gray-400:    #dbdfe1
--art-gray-500:    #949eb7   /* 占位 / muted */
--art-gray-600:    #7987a1
--art-gray-700:    #4d5875
--art-gray-800:    #383853
--art-gray-900:    #323251   /* 主文字 */
--art-card-border:  rgba(0,0,0,0.08)

/* Dark */
--default-bg-color: #070707
--default-box-color: #161618
--art-gray-100..900 反相
--art-card-border:  rgba(255,255,255,0.08)
```

**主色**：oklch(0.7 0.23 260) —— 蓝紫，比 `#2563eb` 更柔和、偏紫一点。

**对比当前项目**：
- 当前 `--bg: #f4f8ff`（淡蓝）→ 应改为 `#fafbfc`（中性灰）
- 当前 `--surface: rgba(255,255,255,0.86)` → 应改为 `#ffffff`
- 当前主色 `--primary: #2563eb` → 可保留或微调偏紫

### 5.3 间距 / 尺寸 / 圆角

| 项 | Art Design Pro | 当前项目 | 处理 |
|---|---|---|---|
| 菜单项高度 | 42px | 12px padding（≈ 40+px） | OK |
| 菜单项圆角 | 6px | 15px（过大） | **改 6px** |
| 菜单项间距 | 4px | 8px | 改 4px |
| 菜单 icon | 20px | 22px | OK |
| 菜单字号 | 14px | inherit (13px) | 升 14px |
| Topbar 高度 | h-15 = 60px | 10px padding (~50px) | OK |
| Card 圆角 | rounded-xl = 12px | 6px | 升 12px |
| Card 内边距 | p-5 = 20px | 14px | 升 20px |
| Banner 高度 | h-53 = 212px | hero 200px | OK |
| Stat 卡片 icon 容器 | 36-48px rounded-xl | 32px rounded-8 | 升 48 rounded-xl |
| Stat 卡片数字 | text-3xl = 30px | 18px | 升 30px |
| Stat 卡片 padding | p-5 | 10-12px | 升 20px |

### 5.4 菜单视觉规范（重点）

```
┌──────────────────────┐
│  [icon] 菜单项       │  ← hover: bg gray-200
│  [icon] 菜单项       │  ← active: bg primary-light-9 + text primary + 左 4px 主色竖条（light 主题）
│  [icon] 子菜单  ▸    │  
│  [icon] 菜单项       │
└──────────────────────┘
```

- 菜单项 `width: calc(100% - 16px); margin-left: 8px;`（侧栏边留 8px 内 padding）
- 选中态：**背景 `var(--el-color-primary-light-9)` + 文字主色 + 左 4px 竖条**
- hover 态：`var(--art-gray-200)`
- 折叠：竖向 popup，6px 圆角

### 5.5 Dashboard / Banner 模式

```
┌─────────────────────────────────────────────────┐
│ 欢迎回来，用户名                                  │  ← h-53 (212px)
│ bg-theme/10                                     │
│ ┌─────┬─────┬─────┐                             │
│ │ 123 │ 456 │ 789 │  ← text-3xl + 计数动画        │
│ │ 进行中│题库  │ 提交 │                            │
│ └─────┴─────┴─────┘                             │
└─────────────────────────────────────────────────┘

┌─────────┬─────────┬─────────┬─────────┐         ← 4 列 stat 卡片
│ 宠物总数 │ 领养申请 │ 上门回访 │ 完成数  │         ← ElCard shadow=never
│ [icon]  │ [icon]  │ [icon]  │ [icon]  │         ← ring-1 ring-g-200
│   123   │   456   │   789   │   012   │         ← text-3xl font-bold
│ 待领养 X │ 待审核 Y │ 待完成 Z│         │         ← 底部细分
└─────────┴─────────┴─────────┴─────────┘
```

**本项目对照**（首页）：
- 没有 banner（只有 hero）
- 3 列 stat-card 而不是 4 列
- 没有底部细分数字

### 5.6 表格规范

```vue
<ElCard shadow="never" class="mb-4">
  <ElTable :data="..." stripe>
    <ElTableColumn ...>
      <template #default="{ row }">
        <ElTag ...>{{ row.status }}</ElTag>
      </template>
    </ElTableColumn>
  </ElTable>
</ElCard>
```

- `ElCard shadow="never"`（**无默认阴影**）
- `ElTable` 用 stripe + show-header
- 状态用 `ElTag` size="small"
- 卡片圆角 `rounded-xl`

### 5.7 当前项目 vs Art Design Pro 差距清单

| # | 维度 | 当前 | Art | 优先级 |
|---|------|------|-----|--------|
| 1 | 页面底色 | `#f4f8ff` 淡蓝 | `#fafbfc` 中性灰 | **P0** |
| 2 | 卡片背景 | `rgba(255,255,255,0.86)` 半透 | `#ffffff` 实色 | **P0** |
| 3 | 主色饱和度 | `#2563eb` 鲜艳 | `oklch(0.7 0.23 260)` 柔和 | P1 |
| 4 | 菜单圆角 | 15px | 6px | **P0** |
| 5 | 菜单选中态 | bg primary-soft + text primary | bg primary-light-9 + text primary + 左 4px 竖条 | **P0** |
| 6 | 卡片圆角 | 6px | 12px | P1 |
| 7 | 卡片 padding | 14px | 20px | P1 |
| 8 | stat-card 数字 | 18px | 30px | **P0** |
| 9 | stat-card icon 容器 | 32px square | 36-48px rounded-xl | **P0** |
| 10 | stat-card 布局 | 单行一行 | 顶部 label + 数字 + 副标签 | P1 |
| 11 | 表格卡片 | 无 ElCard 包裹 | ElCard shadow=never 包裹 ElTable | P1 |
| 12 | hero banner | 简单 hero 200px | h-53 + bg-theme/10 + 顶部数字 + 装饰 | P1 |
| 13 | 顶栏高度 | 50px | 60px | P2 |
| 14 | 菜单项间距 | 8px | 4px | P2 |

### 5.8 不参考的部分（与本项目无关）

- Vue 3 / Element Plus / Tailwind v4 / Pinia / Vue Router（项目用纯 HTML+CSS+JS）
- 节日滚动条、聊天、通知、AI、国际化等业务组件
- 多菜单布局切换（horizontal / mixed / sidebar）—— 本项目固定 sidebar

### 5.9 对本项目可借鉴的设计 token 提取

即使继续用纯 HTML+CSS+JS，也可以按 Art Design Pro 的视觉规范对齐：

```css
:root {
  --bg: #fafbfc;             /* 改：去蓝 */
  --surface: #ffffff;        /* 改：实色 */
  --surface-soft: #f9fafb;   /* 改：neutral 100 */
  --text: #323251;           /* 改：neutral 900，更深 */
  --muted: #7987a1;          /* 改：neutral 600 */
  --line: rgba(0,0,0,0.08);  /* 改：透明度更低 */
  --primary: #6366f1;        /* 改：indigo 500，更偏紫 */
  --primary-soft: #eef2ff;   /* 改：indigo 50，对应 light-9 */
  --radius: 6px;             /* 菜单/卡片用 */
  --radius-lg: 12px;         /* 卡片用 */
  --shadow: 0 1px 3px rgba(0,0,0,0.04);  /* 改：几乎无阴影 */
}
[data-theme="dark"] {
  --bg: #070707;
  --surface: #161618;
  --surface-soft: #17171c;
  --text: #e3e3e8;
  --muted: #8f8fa3;
  --line: rgba(255,255,255,0.08);
  --primary: #818cf8;
  --primary-soft: rgba(99,102,241,0.16);
  --shadow: 0 1px 3px rgba(0,0,0,0.4);
}
```

**菜单选中态**（重点）：
```css
.nav-item.active {
  background: var(--primary-soft);
  color: var(--primary);
}
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--primary);
  border-radius: 0 4px 4px 0;
}
.nav-item { position: relative; padding: 12px 13px 12px 17px; border-radius: 6px; margin-bottom: 4px; }
```

**stat-card 升级**：
```css
.stat-card { padding: 20px; gap: 8px; }
.stat-card .icon { width: 48px; height: 48px; border-radius: 12px; }
.stat-card strong { font-size: 30px; font-weight: 800; }
.stat-card .label { font-size: 14px; color: var(--muted); }
.stat-card .sub { font-size: 12px; color: var(--muted); display: flex; gap: 12px; margin-top: 8px; }
```

