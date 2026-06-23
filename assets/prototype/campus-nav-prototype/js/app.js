const places = [
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

const edges = [
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

const navItems = [
  ['index.html', '首页', '⌂'],
  ['query.html', '路径查询', '⌕'],
  ['result.html', '查询结果', '⇢'],
  ['locations.html', '地点管理', '▦'],
  ['paths.html', '路径管理', '⛓'],
  ['algorithm.html', '算法说明', 'ƒ'],
  ['about.html', '关于系统', 'ⓘ']
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
    const result = dijkstra(start, end);
    if (!result) {
      showError(error, '未找到可达路径，请检查地点和路径数据。');
      return;
    }
    location.href = `result.html?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
  });
}

function showError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
}

function initResultPage() {
  const root = document.querySelector('[data-result-root]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const start = params.get('start') || 'teaching';
  const end = params.get('end') || 'library';
  const result = dijkstra(start, end);
  if (!result) {
    root.innerHTML = `<div class="empty-state card"><div class="big-icon">⚠</div><h2>没有找到路径</h2><p>请返回路径查询页，重新选择合法的起点和终点。</p><a class="btn primary" href="query.html">重新查询</a></div>`;
    return;
  }
  const pathPairs = result.path.slice(0, -1).map((id, index) => [id, result.path[index + 1]]);
  root.innerHTML = `
    <section class="grid two">
      <div class="card pad route-summary">
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
        <div class="path-list">
          ${result.path.map((id) => `<div class="path-step"><span>${placeIcon(id)} ${placeName(id)}</span></div>`).join('')}
        </div>
        <div class="form-actions" style="justify-content:flex-start">
          <a class="btn secondary" href="query.html">重新查询</a>
          <button class="btn ghost" onclick="window.print()">打印结果</button>
        </div>
      </div>
      <div class="card map-card">
        ${renderMap(result.path)}
      </div>
    </section>
    <section class="card pad" style="margin-top:20px">
      <div class="section-head">
        <div>
          <h2>分段距离</h2>
          <p>用于课程设计说明书中的路径输出与测试截图。</p>
        </div>
      </div>
      <div class="route-chip-row">
        ${pathPairs.map(([a, b]) => `<span class="route-chip">${placeName(a)} → ${placeName(b)} · ${edgeDistance(a, b)}m</span>`).join('')}
      </div>
    </section>
  `;
}

function edgeDistance(a, b) {
  const item = edges.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return item ? item[2] : '-';
}

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
    return `<g class="map-node" transform="translate(${p.x}, ${p.y})">
      <circle r="${active ? 19 : 15}" />
      <text text-anchor="middle" y="39">${p.name}</text>
      <text text-anchor="middle" y="5" font-size="16">${p.icon}</text>
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
        <div class="place-icon">${p.icon}</div>
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
        <td><strong>${p.icon} ${p.name}</strong></td>
        <td><span class="badge">${p.type}</span></td>
        <td>${Math.round(p.x)}, ${Math.round(p.y)}</td>
        <td><button class="action-link">编辑</button><button class="action-link" style="color:var(--danger)">删除</button></td>
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
        <td><button class="action-link">编辑</button><button class="action-link" style="color:var(--danger)">删除</button></td>
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

function initPage() {
  initLayout();
  initSelects();
  initQueryForm();
  initResultPage();
  initMapPlaceholders();
  initQuickPlaces();
  initTables();
  initInlineForms();
}

document.addEventListener('DOMContentLoaded', initPage);
