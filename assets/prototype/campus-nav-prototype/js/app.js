const FALLBACK_PLACES = [
  { id: 'teaching', name: '教学楼', type: '教学区域', icon: '🏫', x: 145, y: 95 },
  { id: 'library', name: '图书馆', type: '学习场所', icon: '📚', x: 345, y: 82 },
  { id: 'canteen', name: '食堂', type: '生活服务', icon: '🍽️', x: 520, y: 152 },
  { id: 'dorm', name: '宿舍区', type: '生活区域', icon: '🏠', x: 210, y: 275 },
  { id: 'gym', name: '体育馆', type: '体育设施', icon: '🏟️', x: 430, y: 292 },
  { id: 'lab', name: '实验楼', type: '教学区域', icon: '🧪', x: 675, y: 255 },
  { id: 'hospital', name: '校医院', type: '公共服务', icon: '🏥', x: 620, y: 82 },
  { id: 'office', name: '行政楼', type: '办公区域', icon: '🏢', x: 95, y: 230 },
  { id: 'playground', name: '操场', type: '体育设施', icon: '🌿', x: 320, y: 185 }
];

const FALLBACK_EDGES = [
  ['teaching', 'library', 220],
  ['teaching', 'office', 180],
  ['teaching', 'playground', 260],
  ['library', 'canteen', 210],
  ['library', 'hospital', 300],
  ['library', 'playground', 140],
  ['canteen', 'lab', 240],
  ['canteen', 'gym', 190],
  ['dorm', 'office', 170],
  ['dorm', 'playground', 160],
  ['dorm', 'gym', 260],
  ['gym', 'lab', 280],
  ['gym', 'playground', 170],
  ['hospital', 'lab', 210],
  ['office', 'playground', 230]
];

/* 数据来源：C 程序导出的 routes.json。fallback 是上面的硬编码数据。 */
let places = FALLBACK_PLACES.slice();
let edges  = FALLBACK_EDGES.slice();
let routesIndex = new Map();   // "start|end" -> { distance, path }
let dataSource = 'fallback';   // 'c-program' | 'fallback'

/* 加载 C 程序输出的 JSON（异步）。失败/未找到时使用 fallback。 */
async function loadCProgramData() {
  try {
    const res = await fetch('data/routes.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (Array.isArray(json.places) && json.places.length > 0) {
      places = json.places;
      dataSource = 'c-program (places)';
    }
    if (Array.isArray(json.routes)) {
      routesIndex = new Map();
      json.routes.forEach((r) => {
        routesIndex.set(`${r.start}|${r.end}`, {
          distance: r.distance,
          path: r.path
        });
      });
      if (routesIndex.size > 0) {
        dataSource = 'c-program (places+routes)';
      }
    }
  } catch (err) {
    console.warn('未能加载 C 程序导出的 routes.json，使用内置数据。', err);
  }
}

const navItems = [
  ['index.html', '首页', '⌂'],
  ['query.html', '路径查询', '⌕'],
  ['data.html', '数据管理', '▦'],
  ['docs.html', '系统说明', 'ⓘ']
];

function currentPage() {
  const page = location.pathname.split('/').pop() || 'index.html';
  return page === '' ? 'index.html' : page;
}

function initLayout() {
  const active = currentPage();
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.innerHTML = navItems.map(([href, label, icon]) => `
      <a class="nav-item ${href === active ? 'active' : ''}" href="${href}">
        <span class="nav-icon">${icon}</span><span>${label}</span>
      </a>
    `).join('');
  });

  const savedTheme = localStorage.getItem('campus-theme') || 'blue';
  setTheme(savedTheme);
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeBtn));
  });

  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => document.body.classList.toggle('drawer-open'));
  });
  document.querySelectorAll('[data-drawer-mask]').forEach((mask) => {
    mask.addEventListener('click', () => document.body.classList.remove('drawer-open'));
  });
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('campus-theme', theme);
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeBtn === theme);
  });
}

function buildGraph() {
  const graph = Object.fromEntries(places.map((p) => [p.id, []]));
  edges.forEach(([a, b, d]) => {
    graph[a].push({ node: b, distance: d });
    graph[b].push({ node: a, distance: d });
  });
  return graph;
}

function dijkstra(start, end) {
  if (!start || !end || start === end) {
    return null;
  }
  const graph = buildGraph();
  const distances = Object.fromEntries(places.map((p) => [p.id, Infinity]));
  const previous = Object.fromEntries(places.map((p) => [p.id, null]));
  const visited = new Set();
  distances[start] = 0;

  while (visited.size < places.length) {
    let current = null;
    for (const p of places) {
      if (!visited.has(p.id) && (current === null || distances[p.id] < distances[current])) {
        current = p.id;
      }
    }
    if (current === null || distances[current] === Infinity) break;
    if (current === end) break;
    visited.add(current);
    for (const edge of graph[current]) {
      const nextDistance = distances[current] + edge.distance;
      if (nextDistance < distances[edge.node]) {
        distances[edge.node] = nextDistance;
        previous[edge.node] = current;
      }
    }
  }

  const path = [];
  let cursor = end;
  while (cursor) {
    path.unshift(cursor);
    cursor = previous[cursor];
  }

  if (path[0] !== start) return null;
  return {
    distance: distances[end],
    path,
    names: path.map((id) => placeName(id))
  };
}

function placeName(id) {
  return places.find((p) => p.id === id)?.name || id;
}

function placeIcon(id) {
  return places.find((p) => p.id === id)?.icon || '📍';
}

function optionHtml(selectedId = '') {
  return `<option value="">请选择地点</option>` + places.map((p) => `
    <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>
  `).join('');
}

function initSelects() {
  document.querySelectorAll('select[data-place-select]').forEach((select) => {
    const params = new URLSearchParams(location.search);
    const selected = params.get(select.name) || select.dataset.default || '';
    select.innerHTML = optionHtml(selected);
  });
}

function initQueryForm() {
  const form = document.querySelector('[data-query-form]');
  if (!form) return;
  const error = document.querySelector('[data-query-error]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const start = form.start.value;
    const end = form.end.value;
    if (!start || !end) {
      showError(error, '请先选择起点和终点。');
      return;
    }
    if (start === end) {
      showError(error, '起点和终点不能相同，请重新选择。');
      return;
    }
    const result = lookupRoute(start, end) || dijkstra(start, end);
    if (!result) {
      showError(error, '未找到可达路径，请检查地点和路径数据。');
      return;
    }
    if (error) {
      error.classList.remove('show');
      error.textContent = '';
    }
    const root = document.querySelector('[data-result-root]');
    if (root) {
      renderResultInto(root, result, start, end);
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function showError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
}

/* 优先查 C 端预计算结果；查不到返回 null */
function lookupRoute(start, end) {
  const hit = routesIndex.get(`${start}|${end}`);
  if (!hit) return null;
  return {
    distance: hit.distance,
    path: hit.path.slice(),
    names: hit.path.map(placeName)
  };
}

/* 纯渲染函数：把 result 渲染到任意 root 容器内。同页 / result.html 都复用。 */
function renderResultInto(root, result, start, end) {
  const pathPairs = result.path.slice(0, -1).map((id, index) => [id, result.path[index + 1]]);
  root.innerHTML = `
    <section class="card pad">
      <div class="section-head">
        <div>
          <h2>最短路径结果</h2>
          <p>从 <strong>${placeName(start)}</strong> 到 <strong>${placeName(end)}</strong> 的推荐路线。</p>
        </div>
        <span class="badge success">Dijkstra 已计算</span>
      </div>
      <div class="distance-card">
        <small>最短距离</small>
        <div><span class="distance-number">${result.distance}</span> 米</div>
      </div>
      <div>
        <div class="section-note">路径文字输出</div>
        <div class="path-text">${result.names.join(' → ')}</div>
      </div>
      <div class="path-list" style="margin-top:14px">
        ${result.path.map((id) => `<div class="path-step"><span>${placeName(id)}</span></div>`).join('')}
      </div>
      <div class="route-chip-row" style="margin-top:14px">
        ${pathPairs.map(([a, b]) => `<span class="route-chip">${placeName(a)} → ${placeName(b)} · ${edgeDistance(a, b)}m</span>`).join('')}
      </div>
      <div class="form-actions" style="justify-content:flex-start">
        <button class="btn ghost" onclick="window.print()">打印结果</button>
      </div>
    </section>
    <div class="card map-card" style="margin-top:10px">
      ${renderMap(result.path)}
    </div>
  `;
}

/* 兼容老 result.html 的兜底（当前项目已删除 result.html，留作 fallback）。
   query.html 上的 [data-result-root] 不在此处处理，由 initQueryForm 表单提交后填充。 */
function initResultPage() {
  const root = document.querySelector('[data-result-root]');
  if (!root) return;
  /* 仅当路径名是 result.html 或 URL 显式带 start/end 参数时才渲染 */
  const page = location.pathname.split('/').pop();
  const params = new URLSearchParams(location.search);
  if (page !== 'result.html' && !params.get('start')) return;
  const start = params.get('start') || 'teaching';
  const end = params.get('end') || 'library';
  const result = lookupRoute(start, end) || dijkstra(start, end);
  if (!result) {
    root.innerHTML = `<div class="empty-state card"><div class="big-icon">⚠</div><h2>没有找到路径</h2><p>请返回路径查询页，重新选择合法的起点和终点。</p><a class="btn primary" href="query.html">重新查询</a></div>`;
    return;
  }
  renderResultInto(root, result, start, end);
}

function edgeDistance(a, b) {
  const item = edges.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return item ? item[2] : '-';
}

const PLACE_ICON_PATHS = {
  teaching: '<path d="M3 21h18"/><path d="M5 21V9l7-4 7 4v12"/><path d="M9 21v-6h6v6"/>',
  library: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h8"/>',
  canteen: '<path d="M3 11h18"/><path d="M5 11V7"/><path d="M9 11V5"/><path d="M13 11V7"/><path d="M17 11V5"/><path d="M3 15h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  dorm: '<path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  gym: '<ellipse cx="12" cy="12" rx="9" ry="5"/><path d="M3 12h18"/><path d="M7 9v6"/><path d="M17 9v6"/>',
  lab: '<path d="M9 3h6"/><path d="M10 3v5.5L5.5 18a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 8.5V3"/><path d="M8.5 14h7"/>',
  hospital: '<path d="M12 7v10"/><path d="M7 12h10"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>',
  office: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12h12"/><path d="M10 6h.01"/><path d="M14 6h.01"/><path d="M10 10h.01"/><path d="M14 10h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M10 18h.01"/><path d="M14 18h.01"/>',
  playground: '<path d="M12 22c4-4 7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 3 8 7 12z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>'
};

const PLACE_COLORS = {
  teaching: '#2563eb',
  library: '#7c3aed',
  canteen: '#ea580c',
  dorm: '#059669',
  gym: '#db2777',
  lab: '#0891b2',
  hospital: '#dc2626',
  office: '#4f46e5',
  playground: '#16a34a'
};

function renderMap(activePath = []) {
  const activePairs = new Set();
  activePath.slice(0, -1).forEach((id, index) => {
    const pair = [id, activePath[index + 1]].sort().join('-');
    activePairs.add(pair);
  });
  const edgeLines = edges.map(([a, b]) => {
    const pa = places.find((p) => p.id === a);
    const pb = places.find((p) => p.id === b);
    const active = activePairs.has([a, b].sort().join('-'));
    return `<line class="map-edge ${active ? 'active' : ''}" x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" />`;
  }).join('');
  const nodes = places.map((p) => {
    const active = activePath.includes(p.id);
    const radius = active ? 22 : 19;
    const color = PLACE_COLORS[p.id] || PLACE_COLORS.teaching;
    const iconScale = active ? 0.92 : 0.84;
    const iconPaths = PLACE_ICON_PATHS[p.id] || PLACE_ICON_PATHS.teaching;
    return `<g class="map-node ${active ? 'is-active' : ''}" data-place="${p.id}" transform="translate(${p.x}, ${p.y})">
      <circle class="map-node-bg" r="${radius}" fill="#ffffff" stroke="${color}" stroke-width="${active ? 3 : 2.4}" />
      <circle class="map-node-tint" r="${radius - 4}" fill="${color}" opacity="0.14" />
      <g class="map-node-icon" transform="translate(-12,-12) scale(${iconScale})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${iconPaths}
      </g>
      <text class="map-node-label" text-anchor="middle" y="${radius + 16}">${p.name}</text>
    </g>`;
  }).join('');

  return `<svg class="campus-map" viewBox="0 0 760 390" role="img" aria-label="校园路径地图">
    <defs>
      <linearGradient id="routeGradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="var(--primary)" />
        <stop offset="100%" stop-color="var(--primary-2)" />
      </linearGradient>
      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" stroke-width="1" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="760" height="390" fill="url(#gridPattern)" opacity="0.5" />
    ${edgeLines}
    ${nodes}
  </svg>`;
}

function initMapPlaceholders() {
  document.querySelectorAll('[data-campus-map]').forEach((el) => {
    const active = (el.dataset.active || '').split(',').filter(Boolean);
    el.innerHTML = renderMap(active);
  });
}

function initQuickPlaces() {
  document.querySelectorAll('[data-place-grid]').forEach((grid) => {
    grid.innerHTML = places.slice(0, 6).map((p) => `
      <a class="place-tile" href="query.html?start=${p.id}">
        <strong>${p.name}</strong>
      </a>
    `).join('');
  });
}

function initTables() {
  const locationBody = document.querySelector('[data-location-table]');
  if (locationBody) {
    locationBody.innerHTML = places.map((p, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge">${p.type}</span></td>
        <td>${Math.round(p.x)}, ${Math.round(p.y)}</td>
      </tr>
    `).join('');
  }

  const pathBody = document.querySelector('[data-path-table]');
  if (pathBody) {
    pathBody.innerHTML = edges.map(([a, b, distance], index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${placeName(a)}</td>
        <td>${placeName(b)}</td>
        <td><strong>${distance} 米</strong></td>
        <td><span class="badge success">双向可达</span></td>
      </tr>
    `).join('');
  }
}

function initInlineForms() {
  const demoButtons = document.querySelectorAll('[data-demo-submit]');
  demoButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.demoSubmit);
      if (target) {
        target.textContent = '原型提示：这里演示新增/编辑交互，静态版本不写入真实数据库。';
        target.classList.add('show');
      }
    });
  });
}

/* ---- 新增地点 dialog ---- */
function buildPlaceId(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return '';
  let base = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (!base) {
    /* 全中文/纯非 ASCII：用名称的 codepoint 拼接成稳定 ID（避免同义 ID） */
    base = 'p' + Array.from(trimmed).map((c) => c.codePointAt(0).toString(36)).join('');
  }
  let id = base;
  let n = 2;
  while (places.some((p) => p.id === id)) {
    id = `${base}-${n++}`;
  }
  return id;
}

function defaultCoords() {
  /* 没填坐标时，自动放在画布中心略偏右下，避免与已有节点重叠 */
  if (places.length === 0) return { x: 380, y: 200 };
  const xs = places.map((p) => p.x);
  const ys = places.map((p) => p.y);
  const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
  return {
    x: Math.round(Math.min(740, Math.max(40, avgX + 40))),
    y: Math.round(Math.min(370, Math.max(40, avgY + 30))),
  };
}

function openAddPlaceDialog() {
  const mask = document.querySelector('[data-add-place-mask]');
  const edgesBox = document.querySelector('[data-add-place-edges]');
  const errorBox = document.querySelector('[data-add-place-error]');
  const form = document.querySelector('[data-add-place-form]');
  if (!mask || !edgesBox) return;

  form.reset();
  if (errorBox) {
    errorBox.textContent = '';
    errorBox.classList.remove('show');
  }

  edgesBox.innerHTML = places.map((p) => `
    <label>
      <span>${p.name}</span>
      <input type="number" min="1" step="1" placeholder="米" data-edge-target="${p.id}" />
    </label>
  `).join('');

  mask.classList.add('show');
}

function closeAddPlaceDialog() {
  const mask = document.querySelector('[data-add-place-mask]');
  if (mask) mask.classList.remove('show');
}

function submitAddPlace() {
  const form = document.querySelector('[data-add-place-form]');
  const errorBox = document.querySelector('[data-add-place-error]');
  if (!form) return;

  const name = form.name.value.trim();
  const type = form.type.value.trim();
  const xRaw = form.x.value;
  const yRaw = form.y.value;
  const x = xRaw === '' ? null : Number(xRaw);
  const y = yRaw === '' ? null : Number(yRaw);

  if (!name) {
    showError(errorBox, '请填写地点名称。');
    return;
  }
  if (places.some((p) => p.name === name)) {
    showError(errorBox, `已存在同名地点"${name}"。`);
    return;
  }
  if ((x !== null && Number.isNaN(x)) || (y !== null && Number.isNaN(y))) {
    showError(errorBox, '坐标必须是数字，或留空。');
    return;
  }

  const id = buildPlaceId(name);
  if (!id) {
    showError(errorBox, '地点名称需含英文字母或数字作为 ID。');
    return;
  }
  const fallback = defaultCoords();

  const newEdges = [];
  document.querySelectorAll('[data-add-place-edges] input[data-edge-target]').forEach((input) => {
    const v = input.value.trim();
    if (v === '') return;
    const d = Number(v);
    if (!Number.isFinite(d) || d <= 0) {
      showError(errorBox, `到"${placeName(input.dataset.edgeTarget)}"的距离必须是正数，或留空。`);
      throw new Error('bad distance');
    }
    newEdges.push([id, input.dataset.edgeTarget, d]);
  });

  places.push({
    id,
    name,
    type: type || '其他',
    icon: '',
    x: x ?? fallback.x,
    y: y ?? fallback.y,
  });
  newEdges.forEach((e) => edges.push(e));

  initTables();
  initMapPlaceholders();
  initQuickPlaces();

  closeAddPlaceDialog();
}

function initAddPlaceDialog() {
  const openBtn = document.querySelector('[data-open-add-place]');
  const mask = document.querySelector('[data-add-place-mask]');
  if (!openBtn || !mask) return;

  openBtn.addEventListener('click', openAddPlaceDialog);
  mask.querySelectorAll('[data-add-place-close]').forEach((btn) => {
    btn.addEventListener('click', closeAddPlaceDialog);
  });
  mask.addEventListener('click', (event) => {
    if (event.target === mask) closeAddPlaceDialog();
  });
  const submitBtn = mask.querySelector('[data-add-place-submit]');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      try {
        submitAddPlace();
      } catch (_) { /* 校验错误已显示在 dialog 中 */ }
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mask.classList.contains('show')) {
      closeAddPlaceDialog();
    }
  });
}

/* tab 切换：每个 [data-tab] 按钮只影响它所在的 card 内的 [data-panel] */
function initTabs() {
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.card') || document;
      const key = btn.dataset.tab;
      group.querySelectorAll('[data-tab]').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      group.querySelectorAll('[data-panel]').forEach((p) => {
        p.classList.toggle('active', p.dataset.panel === key);
      });
    });
  });
}

async function initPage() {
  initLayout();
  await loadCProgramData();   /* 异步加载 C 端 JSON */
  initSelects();
  initTabs();
  initQueryForm();
  initResultPage();
  initMapPlaceholders();
  initQuickPlaces();
  initTables();
  initInlineForms();
  initAddPlaceDialog();
  showDataSourceBadge();
}

/* 在控制台和右下角小角标展示当前数据来源（review 时一眼可见） */
function showDataSourceBadge() {
  console.log('[campus-nav] data source:', dataSource,
              '| places:', places.length,
              '| routes:', routesIndex.size);
  let badge = document.getElementById('data-source-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'data-source-badge';
    badge.style.cssText = 'position:fixed;right:12px;bottom:12px;padding:6px 10px;border-radius:6px;font-size:12px;font-family:monospace;background:#1f2937;color:#fff;opacity:0.85;z-index:9999;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
    document.body.appendChild(badge);
  }
  badge.textContent = `data: ${dataSource}  ·  routes: ${routesIndex.size}`;
}

document.addEventListener('DOMContentLoaded', initPage);
