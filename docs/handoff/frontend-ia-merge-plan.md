# 实现 Plan — 前端 IA 合并 + 视觉 Polish

> 关联 PRD：`PRD-Polish-Frontend.md`
> 关联调研：`docs/reports/frontend-polish-investigation.md`
> 状态：Draft（待 human review 后开工）

## 1. 目标

7 个页面 → 4 个页面；信息密度提升；去 AI 味。
- index / query / data / docs
- query 单页 section（query+result 合并）
- data / docs 用 tab 切换
- 删 result / locations / paths / algorithm / about

## 2. 文件操作清单

### 删除

| 文件 | 内容来源 |
|------|----------|
| `result.html` | 查询结果 |
| `locations.html` | 地点管理表格 + 表单 |
| `paths.html` | 路径管理表格 + 表单 |
| `algorithm.html` | Dijkstra 时间线 + 伪代码 |
| `about.html` | 系统功能时间线 + 页面清单 |

### 新建

| 文件 | 内容 |
|------|------|
| `data.html` | tab 切换：[地点] 表格 + 地图占位 / [边] 表格 |
| `docs.html` | tab 切换：[系统] timeline + 页面清单 / [算法] timeline + 伪代码 + 复杂度 |

### 重写

| 文件 | 改前 | 改后 |
|------|------|------|
| `index.html` | 云朵插画 + emoji 卡片 | hero-visual 用 renderMap 渲染真实校园图；stat-card 压缩；SVG icon 替换 emoji |
| `query.html` | 跳转到 result.html | 单页：query-input + query-exceptions + query-result（同页填充） |

### 修改（共享）

| 文件 | 改动 |
|------|------|
| `css/styles.css` | 新增 `.tabs` / `.tabs button` / `.panel`；压缩 `.hero`、`.stat-card`、`.btn` 圆角；收紧全局圆角到 6px |
| `js/app.js` | `navItems` 7→4；新增 `initTabs()`；删除跳转 `result.html` 逻辑；保留 `initResultPage` 但挂在 query.html |

## 3. 关键 HTML 结构

### index.html（重写后）

```html
<section class="content">
  <div class="card hero">
    <div>
      <span class="badge">数据结构课程设计</span>
      <h1>校园最短路径导航系统</h1>
      <p>输入校园主要地点与路径长度，使用 Dijkstra 算法查询任意两点之间的最短路径。</p>
      <div class="hero-actions">
        <a class="btn primary" href="query.html">开始查询路径</a>
        <a class="btn secondary" href="data.html">查看校园数据</a>
        <a class="btn ghost" href="docs.html">了解系统</a>
      </div>
    </div>
    <div class="hero-visual" data-campus-map data-active="teaching,library,playground,dorm"></div>
  </div>

  <div class="grid three stat-row">
    <div class="card stat-card">
      <div class="icon"><!-- SVG: place --></div>
      <strong>9</strong>
      <span>校园主要地点。</span>
    </div>
    <div class="card stat-card">
      <div class="icon"><!-- SVG: edge --></div>
      <strong>15</strong>
      <span>双向路径边。</span>
    </div>
    <div class="card stat-card">
      <div class="icon"><!-- SVG: chart --></div>
      <strong>Dijkstra</strong>
      <span>最短路径计算。</span>
    </div>
  </div>

  <div class="card pad">
    <div class="section-head"><div><h2>常用地点</h2><p>点击地点快速查询路径。</p></div></div>
    <div class="quick-grid" data-place-grid></div>
  </div>
</section>
```

### query.html（重写后）

```html
<section class="content">
  <!-- section 1: 输入 -->
  <section class="card pad query-section">
    <div class="section-head"><div><h2>选择起点与终点</h2><p>选择起终点后点击查询，结果会在下方展示。</p></div></div>
    <div class="grid two">
      <form class="form" data-query-form>
        <div class="form-row">
          <label for="start">起点</label>
          <div class="input-wrap">
            <span class="input-icon"><!-- SVG: place --></span>
            <select id="start" name="start" data-place-select></select>
          </div>
        </div>
        <div class="form-row">
          <label for="end">终点</label>
          <div class="input-wrap">
            <span class="input-icon"><!-- SVG: flag --></span>
            <select id="end" name="end" data-place-select data-default="library"></select>
          </div>
        </div>
        <div class="alert" data-query-error></div>
        <button class="btn primary" type="submit">查询最短路径</button>
      </form>
      <div class="card map-card" data-campus-map data-active=""></div>
    </div>
  </section>

  <!-- section 2: 异常说明 -->
  <section class="card pad query-section" style="margin-top:10px">
    <div class="section-head"><div><h2>异常输入处理</h2><p>未选择 / 相同地点 / 不可达 都会给出提示。</p></div></div>
    <div class="grid three">
      <div class="stat-card card"><div class="icon"><!-- SVG: alert --></div><strong>未选择</strong><span>提示补全起点或终点。</span></div>
      <div class="stat-card card"><div class="icon"><!-- SVG: same --></div><strong>相同地点</strong><span>起终点相同时阻止查询。</span></div>
      <div class="stat-card card"><div class="icon"><!-- SVG: broken --></div><strong>不可达</strong><span>图中不存在路径时提示。</span></div>
    </div>
  </section>

  <!-- section 3: 结果（默认 empty） -->
  <section class="query-section" data-result-root style="margin-top:10px">
    <div class="card pad empty-state">
      <div class="big-icon"><!-- SVG: route --></div>
      <h2>选择起终点后查询</h2>
      <p>结果会出现在此处，包括最短距离、路径文字序列和地图高亮。</p>
    </div>
  </section>
</section>
```

### data.html（新建）

```html
<section class="content">
  <div class="card pad">
    <nav class="tabs">
      <button class="tab-btn active" data-tab="places">地点 (9)</button>
      <button class="tab-btn" data-tab="edges">边 (15)</button>
    </nav>

    <div class="panel active" data-panel="places">
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>地点</th><th>类型</th><th>坐标</th></tr></thead>
          <tbody data-location-table></tbody>
        </table>
      </div>
    </div>

    <div class="panel" data-panel="edges">
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>起点</th><th>终点</th><th>距离</th></tr></thead>
          <tbody data-path-table></tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="card pad" style="margin-top:10px">
    <div class="section-head"><div><h2>校园地图</h2><p>查看 9 个地点与 15 条边的空间分布。</p></div></div>
    <div class="card map-card" data-campus-map></div>
  </div>
</section>
```

### docs.html（新建）

```html
<section class="content">
  <div class="card pad">
    <nav class="tabs">
      <button class="tab-btn active" data-tab="about">系统功能</button>
      <button class="tab-btn" data-tab="algorithm">算法说明</button>
    </nav>

    <div class="panel active" data-panel="about">
      <div class="timeline">
        <div class="timeline-item"><div class="timeline-dot">✓</div>
          <div class="timeline-body"><h3>输入校园地点和路径长度</h3><p>通过数据管理页维护地点与边。</p></div>
        </div>
        <!-- 其余 3 项沿用 about.html 内容 -->
      </div>
      <div class="card pad" style="margin-top:14px">
        <div class="section-head"><div><h2>页面清单</h2><p>压缩包内包含的静态页面。</p></div></div>
        <div class="path-list" id="page-list"></div>
      </div>
    </div>

    <div class="panel" data-panel="algorithm">
      <div class="timeline">
        <!-- 沿用 algorithm.html 的 4 步 timeline -->
      </div>
      <pre class="code-block">function Dijkstra(...) ...</pre>
      <div class="grid three" style="margin-top:14px">
        <!-- 图结构 / 复杂度 / 限制 3 张卡片 -->
      </div>
    </div>
  </div>
</section>
```

## 4. CSS 新增（追加到 styles.css）

```css
/* tabs */
.tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--line);
  margin-bottom: 14px;
}
.tab-btn {
  padding: 8px 16px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--muted);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.tab-btn:hover { color: var(--text); }
.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.panel { display: none; }
.panel.active { display: block; }

/* polish */
:root { --radius: 6px; }
.hero { min-height: 200px; padding: 16px 18px; gap: 18px; }
.hero-visual { min-height: 240px; border-radius: 12px; }
.stat-card { padding: 10px 12px; gap: 4px; }
.stat-card .icon { width: 24px; height: 24px; }
.btn { border-radius: 6px; }
.card { border-radius: 6px; }
.input-wrap { border-radius: 10px; }
```

## 5. JS 改动（app.js）

### navItems

```js
const navItems = [
  ['index.html', '首页', '⌂'],
  ['query.html', '路径查询', '⌕'],
  ['data.html', '数据管理', '▦'],
  ['docs.html', '系统说明', 'ⓘ']
];
```

### initTabs（新增）

```js
function initTabs() {
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.card');
      if (!group) return;
      group.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('active', b === btn));
      const key = btn.dataset.tab;
      group.querySelectorAll('[data-panel]').forEach((p) => {
        p.classList.toggle('active', p.dataset.panel === key);
      });
    });
  });
}
```

### initQueryForm（改：去掉跳转）

```js
form.addEventListener('submit', (event) => {
  event.preventDefault();
  // 校验同前
  // 找到 [data-result-root] 改为同页渲染（调用 initResultPage 的渲染逻辑但不依赖 location）
});
```

把 `initResultPage` 拆成两个：
- `renderResultInto(rootEl, start, end)`：纯渲染函数
- `initResultPage()`：兼容旧 result.html 调用（留 fallback）

`initPage()` 加 `initTabs()` 调用。

## 6. 验收（Playwright）

```js
// 1. 文件系统
//    fs.existsSync('index.html' / 'query.html' / 'data.html' / 'docs.html') === true
//    fs.existsSync('result.html' / 'locations.html' / ...) === false

// 2. 4 页面渲染 + 截图
//    goto + screenshot

// 3. 侧边栏 4 项
//    document.querySelectorAll('[data-nav] .nav-item').length === 4

// 4. query 单页 section
//    query.html 内存在 [data-result-root]
//    初始为 empty state；选择起终点点击后填充

// 5. data tab 切换
//    data.html 内 [data-tab="places"].click()
//    [data-panel="places"].classList.contains('active') === true

// 6. docs tab 切换
//    docs.html 内 [data-tab="algorithm"].click()
//    [data-panel="algorithm"].classList.contains('active') === true

// 7. 文档高度
//    index.html: document.documentElement.scrollHeight <= 760
//    query.html: <= 1100

// 8. emoji 残留
//    grep -P "[\x{1F300}-\x{1F9FF}]" assets/prototype/campus-nav-prototype/*.html
//    期望 0 命中（图标用 SVG）

// 9. 数据流通
//    query.html 输入 teaching + library，submit
//    [data-result-root] 内容更新为 "教学楼 → 操场 → 图书馆 · 400 米"
//    routes.json badge 显示 c-program (places+routes)
```

## 7. 提交策略

单一原子 commit：

```
feat(frontend): merge 7 pages to 4 modules + tab/section components

- 删除 result/locations/paths/algorithm/about 5 个页面
- 新增 data.html（tab 切换 [地点][边]）、docs.html（tab 切换 [系统][算法]）
- 重写 query.html（query+result 合并为单页 section）
- index.html hero-visual 改用真实校园图，stat-card 压缩
- 新增 .tabs / .panel CSS 组件
- app.js: navItems 7→4；新增 initTabs()；query 改为同页填充
```

## 8. 风险与回滚

| 风险 | 缓解 |
|------|------|
| 旧页面有 deep link 引用 | 课程设计场景下不会有外部引用；本机自检即可 |
| data.json routes 缺失 | fallback 已覆盖；不阻断视觉验收 |
| 移动端 tab 点击 | tabs 在 mobile 宽度下 flex-wrap，由 CSS @media 控制；无需 JS 改 |
| 浏览器缓存 | 链接加 ?t=timestamp（开发期） |

回滚：`git revert <commit>` 即可恢复 5 个旧页面 + 旧 navItems。

## 9. 验收顺序

1. CSS 加完，先看 data.html / docs.html 的 tab 是否生效
2. JS 改完，刷新 index 看侧边栏是否 4 项
3. query.html 改完，提交表单看结果是否同页填充
4. 删除 5 个旧页面
5. 整体截图对比
6. 提交

---

等待 human review。批准后按 #16→#17→#18→#19→#20→#21→#22→#23→#24 顺序执行。
