#!/usr/bin/env node
// 新建页面骨架：直接生成可跑的 .mjs，不用从零写 import / 画布 / 轴
// 用法: node kit/new.mjs <name> [标题]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
const title = process.argv[3] || name;

if (!name) {
  console.error('用法: node kit/new.mjs <name> [标题]');
  process.exit(1);
}

const target = path.join(root, 'pages', name + '.mjs');
if (fs.existsSync(target)) {
  console.error('已存在: ' + target);
  process.exit(1);
}

const tpl = `// ${title} —— 骨架由 kit/new.mjs 生成，只改数值与内容
import { tabs, keycap, currency, closeBtn, slotRow, charStatPanel } from '../kit/core.mjs';

export default {
  title: '${title} 线框图',
  file: '${name}-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    {
      id: 'A', label: '顶部栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        keycap(p, { x: 37, y: 17, s: 'Q' });
        tabs(p, { x: 79, y: 10, w: 150, h: 42, gap: 10, labels: ['角色', '天赋', '技能', '仓库'], active: 0 });
        keycap(p, { x: 727, y: 17, s: 'E' });
        currency(p, { right: 1198, y: 32, items: ['300', '250', '100'], pitch: 78 });
        closeBtn(p, { cx: 1254, cy: 32, r: 15 });
      },
    },
    {
      id: 'B', label: '左侧面板', color: '#e8952f',
      box: { left: 'L', width: 438, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        p.box({ x: 0, y: 0, w: 438, h: p.region.h, cls: 'sub' });
        // charStatPanel(p, { x: 246, y: 58, w: 148, h: 252 });
        // slotRow(p, { x: 16, y: p.region.h - 120, w: 406, count: 5, h: 64, gap: 10, keys: ['1','2','3','4','5'] });
      },
    },
    {
      id: 'C', label: '主内容区', color: '#6fb8e0',
      box: { left: 'B.right+14', right: 'D.left-10', top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        // slotRow(p, { x: 12, y: 12, w: p.region.w - 24, count: 6, h: 64, gap: 6 });
      },
    },
    {
      id: 'D', label: '右侧栏', color: '#9b7fd4',
      box: { left: 'R-242', width: 242, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        p.text({ cx: 'center', y: 22, s: '标题', size: 12, anchor: 'middle', weight: 600 });
        p.box({ x: 12, y: 32, w: 218, h: p.region.h - 44, cls: 'sub' });
      },
    },
    {
      id: 'E', label: '底部栏', color: '#6fc4a8',
      box: { left: 'L', right: 'R', bottom: 'B', height: 106 },
      draw(p) {
        slotRow(p, { x: 10, y: 10, w: p.region.w - 20, count: 13, h: 84, gap: 6, fillFirst: 2 });
      },
    },
  ],
};
`;

fs.writeFileSync(target, tpl, 'utf8');
console.log('新建 → ' + target);
console.log('构建: node kit/build.mjs "' + target + '"');
