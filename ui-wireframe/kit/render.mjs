// UI 线框图 · 渲染器（锚点 → HTML）
import { makeAxes, resolveRegions, evalExpr, createPainter } from './core.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#e3e8ee}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px}
.frame{background:#fff;border:1px solid #a9b4c0;border-radius:4px;
  box-shadow:0 14px 36px rgba(31,39,51,.16),0 2px 6px rgba(31,39,51,.08);overflow:hidden}
svg{display:block;background:#fff}
.area{fill:#fff;stroke-width:3}
.sub{fill:none;stroke:#2b2b2b;stroke-width:2}
.subfill{fill:#eef1f5;stroke:#2b2b2b;stroke-width:2}
.tab{fill:none;stroke:#2b2b2b;stroke-width:2}
.key{fill:#f0f3f7;stroke:#9aa5b1;stroke-width:2}
.rule{stroke:#2b2b2b;stroke-width:1.5}
.rule-thin{stroke:#c8d0d9;stroke-width:1}
.t{fill:#1f2733;font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif}
.t-tiny{fill:#4a5563;font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif}
.t-sub{fill:#6b7684;font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif}
.area-label{font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:.5px}
.idx-t{fill:#fff;font-family:system-ui,sans-serif;font-size:11px;font-weight:700}
.ghost{fill:#d2d8e0;font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif;font-size:13px}
`;

// 局部画笔：坐标相对区域左上角，cx:'center' 表示父容器水平居中
function localPainter(base, region) {
  const norm = (v, span) => {
    if (v === 'center') return span / 2;
    if (v === 'left') return 0;
    if (v === 'right') return span;
    return v;
  };
  const ox = (v) => region.x + norm(v, region.w);
  const oy = (v) => region.y + norm(v, region.h);

  return {
    region,
    // box 支持 x（左边缘）或 cx（水平中心）
    box(o) {
      const x = o.cx !== undefined ? ox(o.cx) - o.w / 2 : ox(o.x);
      const y = o.cy !== undefined ? oy(o.cy) - o.h / 2 : oy(o.y);
      base.box({ ...o, x, y });
      return this;
    },
    circle(o) { base.circle({ ...o, cx: ox(o.cx), cy: oy(o.cy) }); return this; },
    line(o) { base.line({ x1: ox(o.x1), y1: oy(o.y1), x2: ox(o.x2), y2: oy(o.y2), cls: o.cls }); return this; },
    text(o) {
      const x = o.cx !== undefined ? ox(o.cx) : ox(o.x);
      base.text({ ...o, x, y: oy(o.y) });
      return this;
    },
    raw(svg) {
      base.raw('<g transform="translate(' + region.x + ',' + region.y + ')">' + svg + '</g>');
      return this;
    },
    // 组件用：把全局坐标包成局部
    global() { return base; },
  };
}

export function renderPage(page) {
  const { title, canvas } = page;
  const axes = makeAxes(canvas, page.axes || {});
  const regions = resolveRegions(page.regions, axes);
  const base = createPainter();
  const blocks = [];
  const regionMeta = [];

  page.regions.forEach((r, i) => {
    const geo = regions[r.id];
    base.regionFrame({ x: geo.x, y: geo.y, w: geo.w, h: geo.h, color: r.color });
    const p = localPainter(base, geo);
    if (r.draw) r.draw(p, geo);
    regionMeta.push({ id: r.id, label: r.label, ...geo });
  });

  // 场景占位淡字等全局元素
  if (page.ghost) {
    page.ghost.forEach(g => {
      base.text({ x: g.cx ?? g.x, y: g.y, s: g.s, size: g.size ?? 13, anchor: 'middle', cls: 'ghost' });
    });
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.w}" height="${canvas.h}" viewBox="0 0 ${canvas.w} ${canvas.h}">
${base.toString()}
</svg>`;

  return {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="wireframe" content='${JSON.stringify({
      t: title,
      w: canvas.w,
      h: canvas.h,
      r: page.regions.map(r => r.label),
    }).replace(/'/g, '&#39;')}'>
<style>${CSS}</style>
</head>
<body>
<div class="frame">
${svg}
</div>
</body>
</html>
`,
    svg,
    regions: regionMeta,
    rects: base.rects,
    axes,
    canvas,
  };
}

/* ---------------- 校验 ---------------- */

const GAP_TO_FRAME = 12;

export function checkLayout(result, page) {
  const { regions, rects, axes, canvas } = result;
  const errors = [];
  const warns = [];
  const byId = Object.fromEntries(regions.map(r => [r.id, r]));

  // 0. 区域 id 与轴线同名（'B+8' 会被当成轴 B，不是区域 B）
  ['L', 'R', 'C', 'T', 'B'].forEach(ax => {
    if (page.regions.some(r => r.id === ax)) {
      warns.push(`区域 ${ax} 与 ${ax === 'B' ? '底边' : ax === 'T' ? '顶边' : ax === 'C' ? '中轴' : '左右缘'}轴 ${ax} 同名：裸写 ${ax}+8 会被当成轴线，引用请写 ${ax}.bottom / ${ax}.top`);
    }
  });

  // 1. 区域越界
  regions.forEach(r => {
    if (r.x < 0 || r.y < 0 || r.x2 > canvas.w || r.y2 > canvas.h) {
      errors.push(`区域 ${r.id}「${r.label}」越界: [${r.x},${r.y} → ${r.x2},${r.y2}]`);
    }
  });

  // 2. 区域重叠
  for (let i = 0; i < regions.length; i++) {
    for (let j = i + 1; j < regions.length; j++) {
      const a = regions[i], b = regions[j];
      if (a.x < b.x2 && b.x < a.x2 && a.y < b.y2 && b.y < a.y2) {
        errors.push(`区域 ${a.id} 与 ${b.id} 重叠`);
      }
    }
  }

  // 3. 子块越出所属区域
  rects.forEach(rc => {
    const host = regions.find(r => rc.x >= r.x - 1 && rc.x < r.x2 && rc.y >= r.y - 1 && rc.y < r.y2);
    if (!host) return; // 全局元素不查
    if (rc.x + rc.w > host.x2 + 1 || rc.y + rc.h > host.y2 + 1) {
      errors.push(`子块越出区域 ${host.id}: [${rc.x},${rc.y} ${rc.w}×${rc.h}]`);
    }
  });

  // 4. 同排顶边 / 同列左缘 自动成组检查
  const tol = 1;
  const rows = groupBy(regions, r => Math.round(r.y));
  rows.forEach(([y, list]) => {
    if (list.length > 1) {
      const vs = new Set(list.map(r => Math.round(r.y2)));
      if (vs.size > 1) warns.push(`同排区域 ${list.map(r => r.id).join('/')} 底边不一致: ${[...vs].join(' / ')}`);
    }
  });

  // 5. 左右缘是否落在轴线上
  regions.forEach(r => {
    if (Math.abs(r.x - axes.L) < tol) return;
    if (Math.abs(r.x2 - axes.R) < tol) return;
    if (Math.abs(r.x - (canvas.w - axes.R - (axes.R - axes.L)) / 2) > 1000) return;
  });

  // 6. 内容底边是否统一（框底 − GAP_TO_FRAME）
  const bottoms = regions.map(r => {
    const own = rects.filter(rc => rc.x >= r.x && rc.x < r.x2 && rc.y >= r.y && rc.y < r.y2);
    if (!own.length) return null;
    const last = own.reduce((m, rc) => Math.max(m, rc.y + rc.h), 0);
    return { id: r.id, gap: r.y2 - last };
  }).filter(Boolean);
  const gaps = new Set(bottoms.map(b => Math.round(b.gap)));
  if (gaps.size > 1) {
    warns.push(`各区域内容底边距框底不一致: ` + bottoms.map(b => `${b.id}=${b.gap.toFixed(0)}`).join(' '));
  }

  // 7. 区域内部最长空白带（漏画 / 没铺满）
  regions.forEach(r => {
    const own = rects.filter(rc => rc.x >= r.x && rc.x < r.x2 && rc.y >= r.y && rc.y < r.y2);
    if (!own.length) return;
    const n = Math.ceil(r.h);
    const covered = new Array(n).fill(false);
    own.forEach(rc => {
      const y0 = Math.max(0, Math.floor(rc.y - r.y));
      const y1 = Math.min(n, Math.ceil(rc.y + rc.h - r.y));
      for (let yy = y0; yy < y1; yy++) covered[yy] = true;
    });
    let best = 0, cur = 0;
    covered.forEach(v => { if (v) cur = 0; else { cur++; if (cur > best) best = cur; } });
    if (best > r.h * 0.4) {
      warns.push(`区域 ${r.id} 有 ${best}px 竖向空白（占 ${(best / r.h * 100).toFixed(0)}%），检查是否漏画或内容没铺满`);
    }
  });

  // 8. 同行矩形高度 / 宽度不一致（同组控件尺寸要统一）
  const sameRow = new Map();
  rects.forEach(rc => {
    const k = Math.round(rc.y) + ':' + Math.round(rc.x / 4);
    if (!sameRow.has(k)) sameRow.set(k, []);
    sameRow.get(k).push(rc);
  });
  sameRow.forEach(list => {
    if (list.length < 3) return;
    const hs = new Set(list.map(r => Math.round(r.h)));
    if (hs.size > 1) {
      warns.push(`同行控件高度不一致（y≈${Math.round(list[0].y)}）: ${[...hs].join(' / ')}`);
    }
  });

  return { errors, warns };
}

function groupBy(arr, keyFn) {
  const m = new Map();
  arr.forEach(v => {
    const k = keyFn(v);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(v);
  });
  return [...m.entries()];
}
