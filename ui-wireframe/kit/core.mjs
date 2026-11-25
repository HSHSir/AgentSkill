// UI 线框图 · 锚点核心
// 设计原则：布局只用锚点（轴线 / 区域边 / 父容器边），不写裸像素。

/* ---------------- 锚点表达式 ---------------- */

// 支持：数字 | 'L' | 'A.right+8' | 'C-140' | 'B-16'
export function evalExpr(expr, env) {
  if (typeof expr === 'number') return expr;
  if (expr === undefined || expr === null) return undefined;
  const s = String(expr).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);

  const parts = s.match(/[+-]?[A-Za-z_][\w.]*|[+-]?\d+(?:\.\d+)?/g);
  if (!parts) throw new Error(`无法解析锚点表达式: ${expr}`);

  let sum = 0;
  for (const raw of parts) {
    let sign = 1;
    let tok = raw;
    if (tok.startsWith('+')) tok = tok.slice(1);
    else if (tok.startsWith('-')) { sign = -1; tok = tok.slice(1); }

    let val;
    if (/^\d/.test(tok)) {
      val = Number(tok);
    } else if (env.vars && tok in env.vars) {
      val = env.vars[tok];
    } else if (tok.includes('.')) {
      const [id, prop] = tok.split('.');
      const r = env.regions && env.regions[id];
      if (!r) throw new Error(`锚点引用了未解析的区域: ${tok}`);
      const map = { left: 'x', right: 'x2', top: 'y', bottom: 'y2', cx: 'cx', cy: 'cy', w: 'w', h: 'h' };
      val = r[map[prop]];
      if (val === undefined) throw new Error(`区域 ${id} 没有边 ${prop}`);
    } else {
      throw new Error(`未知锚点: ${tok}`);
    }
    sum += sign * val;
  }
  return sum;
}

/* ---------------- 轴线 ---------------- */

export function makeAxes(canvas, axes = {}) {
  const w = canvas.w, h = canvas.h;
  const merged = {
    L: axes.L ?? 8,
    R: axes.R ?? w - 8,
    T: axes.T ?? 8,
    B: axes.B ?? h - 8,
  };
  merged.C = axes.C ?? (merged.L + merged.R) / 2;
  merged.W = w;
  merged.H = h;
  return merged;
}

/* ---------------- 区域解析 ---------------- */

// box: { left, right, centerX, width, top, bottom, centerY, height }
export function resolveRegions(regions, axes) {
  const env = { vars: { ...axes }, regions: {} };
  const pending = [...regions];
  let guard = 0;

  while (pending.length && guard++ < 8) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const r = pending[i];
      try {
        const box = resolveBox(r.box, env);
        env.regions[r.id] = { ...box, cx: box.x + box.w / 2, cy: box.y + box.h / 2 };
        pending.splice(i, 1);
      } catch { /* 依赖未就绪，下一轮再试 */ }
    }
  }
  if (pending.length) {
    throw new Error('区域锚点无法解析（可能存在循环依赖）: ' + pending.map(p => p.id).join(', '));
  }
  return env.regions;
}

function resolveBox(box, env) {
  const g = (k) => (box[k] === undefined ? undefined : evalExpr(box[k], env));

  let x, w, y, h;

  if (box.left !== undefined && box.right !== undefined) {
    x = g('left'); const r = g('right'); w = r - x;
  } else if (box.centerX !== undefined && box.width !== undefined) {
    w = g('width'); x = g('centerX') - w / 2;
  } else if (box.left !== undefined && box.width !== undefined) {
    x = g('left'); w = g('width');
  } else if (box.right !== undefined && box.width !== undefined) {
    w = g('width'); x = g('right') - w;
  } else {
    throw new Error('区域水平方向缺少定义');
  }

  if (box.top !== undefined && box.bottom !== undefined) {
    y = g('top'); const b = g('bottom'); h = b - y;
  } else if (box.centerY !== undefined && box.height !== undefined) {
    h = g('height'); y = g('centerY') - h / 2;
  } else if (box.top !== undefined && box.height !== undefined) {
    y = g('top'); h = g('height');
  } else if (box.bottom !== undefined && box.height !== undefined) {
    h = g('height'); y = g('bottom') - h;
  } else {
    throw new Error('区域垂直方向缺少定义');
  }

  if (w <= 0 || h <= 0) throw new Error(`区域尺寸非法: w=${w} h=${h}`);
  return { x, y, w, h, x2: x + w, y2: y + h };
}

/* ---------------- 基础绘图 ---------------- */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function createPainter() {
  const ops = [];
  const rects = [];   // 供校验用

  const api = {
    rects,
    raw(svg) { ops.push(svg); return api; },

    box({ x, y, w, h, cls = 'sub', fill, r = 0, dash }) {
      rects.push({ x, y, w, h, cls });
      const attrs = [
        `x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}"`,
        `class="${cls}"`,
      ];
      if (r) attrs.push(`rx="${num(r)}"`);
      if (fill) attrs.push(`style="fill:${fill}"`);
      if (dash) attrs.push(`stroke-dasharray="${dash}"`);
      ops.push(`<rect ${attrs.join(' ')}/>`);
      return api;
    },

    circle({ cx, cy, r, cls = 'sub', fill }) {
      ops.push(`<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" class="${cls}"${fill ? ` style="fill:${fill}"` : ''}/>`);
      return api;
    },

    line({ x1, y1, x2, y2, cls = 'rule' }) {
      ops.push(`<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}" class="${cls}"/>`);
      return api;
    },

    text({ x, y, s, size = 13, anchor = 'start', weight, fill, cls = 't' }) {
      const extra = [
        weight ? `font-weight="${weight}"` : '',
        fill ? `style="fill:${fill}"` : '',
      ].filter(Boolean).join(' ');
      ops.push(`<text x="${num(x)}" y="${num(y)}" text-anchor="${anchor}" class="${cls}"${size ? ` font-size="${size}"` : ''}${extra ? ' ' + extra : ''}>${esc(s)}</text>`);
      return api;
    },

    // 区域框（只画框，标签与编号进图例，避免遮挡内容）
    regionFrame({ x, y, w, h, color }) {
      ops.push(`<rect class="area" x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" stroke="${color}"/>`);
      return api;
    },

    toString() { return ops.join('\n'); },
  };
  return api;
}

const num = (v) => (Math.round(v * 100) / 100).toString();

/* ---------------- 复合控件 ---------------- */

// 页签组：从 startX 起等距，可指定宽度
export function tabs(p, { x, y, w, h, gap = 0, labels, active = 0, size = 14 }) {
  const n = labels.length;
  const pitch = w + gap;
  labels.forEach((label, i) => {
    const tx = x + i * pitch;
    p.box({ x: tx, y, w, h, cls: 'tab', fill: i === active ? '#b7e4c7' : undefined });
    p.text({ x: tx + w / 2, y: y + h / 2 + size * 0.36, s: label, size, anchor: 'middle', weight: i === active ? 600 : 400 });
  });
}

// 键帽
export function keycap(p, { x, y, s, w = 28, h = 20 }) {
  p.box({ x, y, w, h, cls: 'key' });
  p.text({ x: x + w / 2, y: y + h / 2 + 4, s, size: 11, anchor: 'middle', fill: '#5a6472' });
}

// 货币组：圆 + 数值，右对齐，等距
export function currency(p, { right, y, items, pitch = 75, r = 11 }) {
  const n = items.length;
  items.forEach((it, i) => {
    const cx = right - (n - 1 - i) * pitch - r;
    p.circle({ cx, cy: y, r });
    p.text({ x: cx + r + 6, y: y + 4, s: it, size: 12 });
  });
}

// 关闭按钮
export function closeBtn(p, { cx, cy, r = 15 }) {
  p.circle({ cx, cy, r, cls: 'sub', fill: '#f2c7c7' });
  p.text({ x: cx, y: cy + 4, s: '✕', size: 13, anchor: 'middle' });
}

// 网格
export function grid(p, { x, y, cols, rows, cw, ch, gx = 0, gy = 0, fill }) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      p.box({ x: x + c * (cw + gx), y: y + r * (ch + gy), w: cw, h: ch, fill });
    }
  }
}

// 属性行：左标签右数值，行高固定
export function statList(p, { x, y, w, rows, rowH = 20, size = 11 }) {
  rows.forEach((row, i) => {
    const ry = y + i * rowH;
    p.text({ x, y: ry + rowH - 6, s: row.label, size });
    p.text({ x: x + w, y: ry + rowH - 6, s: row.value, size, anchor: 'end' });
    if (i > 0 || row.divider) p.line({ x1: x, y1: ry, x2: x + w, y2: ry, cls: 'rule-thin' });
  });
}

// 圆按钮组：圆 + 下方标签，等距竖排或横排
export function roundGroup(p, { x, y, dir = 'v', count, r = 26, gap = 78, labels = [], badge = [] }) {
  for (let i = 0; i < count; i++) {
    const cx = dir === 'v' ? x : x + i * gap;
    const cy = dir === 'v' ? y + i * gap : y;
    p.circle({ cx, cy, r });
    if (labels[i]) p.text({ x: cx, y: dir === 'v' ? cy + r + 20 : cy + r + 20, s: labels[i], size: 12, anchor: 'middle' });
    if (badge[i]) {
      p.circle({ cx: cx + r * 0.75, cy: cy - r * 0.75, r: 9, cls: 'subfill' });
      p.text({ x: cx + r * 0.75, y: cy - r * 0.75 + 4, s: badge[i], size: 9, anchor: 'middle' });
    }
  }
}

// 角色 / 伙伴卡
export function cardRow(p, { x, y, w, h, count, gap = 12, labels = [] }) {
  for (let i = 0; i < count; i++) {
    const cx = x + i * (w + gap);
    p.box({ x: cx, y, w, h, cls: i === 0 ? 'subfill' : 'sub' });
    p.circle({ cx: cx + 10, cy: y + 10, r: 9, cls: 'subfill' });
    p.text({ x: cx + 10, y: y + 14, s: '1', size: 9, anchor: 'middle', weight: 700 });
    p.circle({ cx: cx + 10, cy: y + h / 2, r: 11 });
    if (labels[i]) p.text({ x: cx + w / 2, y: y + h - 8, s: labels[i], size: 12, anchor: 'middle' });
  }
}

// 等宽铺满一行：给外框宽度和数量，自动算每格宽，永远铺满、永远等距
export function slotRow(p, {
  x, y, w, count, h, gap = 6,
  keys = [], labels = [], fillFirst = 0, icons = [], keyPos = 'tl',
}) {
  const sw = (w - gap * (count - 1)) / count;
  for (let i = 0; i < count; i++) {
    const sx = x + i * (sw + gap);
    p.box({ x: sx, y, w: sw, h, cls: i < fillFirst ? 'subfill' : 'sub' });
    if (keys[i]) {
      if (keyPos === 'tl') p.text({ x: sx + 5, y: y + 14, s: keys[i], size: 9, cls: 't-sub' });
      else p.text({ x: sx + sw / 2, y: y + h - 8, s: keys[i], size: 9, cls: 't-sub', anchor: 'middle' });
    }
    if (icons[i]) p.circle({ cx: sx + sw / 2, cy: y + h / 2 - 6, r: Math.min(18, sw / 3) });
    if (labels[i]) p.text({ x: sx + sw / 2, y: y + h - 8, s: labels[i], size: 10, anchor: 'middle' });
  }
  return sw;
}

// 角色属性面板：护盾 / 生命 / 四属性 / 五行 / 更多属性
// 角色页、天赋页、技能页三处重复，统一到此
export function charStatPanel(p, {
  x, y, w, h = 252,
  shield = '20/20', hp = '50/50',
  attrs = ['11', '2', '5', '5'],
  attrIcons = ['⬢', '⚔', '🛡', '✧'],
  rows = [
    ['◎ 命中', '100'], ['◈ 暴击率', '10%'], ['◈ 暴击伤害', '150%'],
    ['◈ 先攻', '13'], ['◈ 精力', '3'],
  ],
  more = '更多属性 ▸',
}) {
  p.box({ x, y, w, h, cls: 'sub' });
  const lx = x + 6, rx = x + w - 6;

  p.text({ x: lx, y: y + 15, s: '护盾', size: 10 });
  p.text({ x: rx, y: y + 15, s: shield, size: 10, anchor: 'end' });
  p.line({ x1: x, y1: y + 20, x2: x + w, y2: y + 20, cls: 'rule-thin' });
  p.text({ x: lx, y: y + 35, s: '生命', size: 10 });
  p.text({ x: rx, y: y + 35, s: hp, size: 10, anchor: 'end' });
  p.line({ x1: x, y1: y + 40, x2: x + w, y2: y + 40, cls: 'rule-thin' });

  const step = (w - 12) / 4;
  attrs.forEach((v, i) => {
    const cx = x + 6 + step * i + step / 2;
    p.circle({ cx, cy: y + 65, r: 9 });
    p.text({ cx, y: y + 69, s: attrIcons[i], size: 9, anchor: 'middle' });
    p.text({ cx, y: y + 94, s: v, size: 11, anchor: 'middle' });
  });

  rows.forEach(([k, v], i) => {
    const ry = y + 112 + i * 18;
    p.text({ x: lx, y: ry + 12, s: k, size: 10 });
    p.text({ x: rx, y: ry + 12, s: v, size: 10, anchor: 'end' });
  });

  if (more) {
    const bw = 104;
    p.box({ x: x + (w - bw) / 2, y: y + h - 48, w: bw, h: 18, cls: 'sub' });
    p.text({ x: x + w / 2, y: y + h - 35, s: more, size: 10, anchor: 'middle' });
  }
}

/**
 * 场景内锚点卡：框 + 框外上方小字部位名 + 图标方块 + 底部名称。
 * 内层三段的纵向位置已定死，避免每张图重排（这次重排两次才对齐）。
 */
export function pinCard(p, { x, y, w = 92, h = 72, tag, name, icon = 28 }) {
  p.box({ x, y, w, h, cls: 'sub' });
  if (tag) p.text({ x: x + 6, y: y - 6, s: tag, size: 9 });
  p.box({ x: x + 6, y: y + 10, w: icon, h: icon, cls: 'sub' });
  if (name) p.text({ x: x + 6, y: y + h - 10, s: name, size: 10 });
}
