// 模块生产 —— 四区：顶栏 / 模块信息 / 模块背包 / 模块详情
import { tabs, keycap, currency, closeBtn, slotRow } from '../kit/core.mjs';

export default {
  title: '模块生产 线框图',
  file: 'module-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    {
      id: 'A', label: '顶部标签栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        keycap(p, { x: 37, y: 17, s: 'Q' });
        tabs(p, { x: 79, y: 10, w: 150, h: 42, gap: 10, labels: ['机甲拼装', '模块生产', '模块拆解'], active: 1 });
        keycap(p, { x: 727, y: 17, s: 'E' });
        currency(p, { right: 1198, y: 32, items: ['300', '250', '100'], pitch: 78 });
        closeBtn(p, { cx: 1254, cy: 32, r: 15 });
      },
    },
    {
      id: 'B', label: '模块信息', color: '#e8952f',
      box: { left: 'L', width: 244, top: 'A.bottom+8', bottom: 'B-16' },
      draw(p) {
        p.text({ x: 16, y: 24, s: '模块信息', size: 12, weight: 600 });
        p.box({ x: 0, y: 34, w: 244, h: 470, cls: 'sub' });

        p.text({ cx: 'center', y: 60, s: '单手圆锤·初', size: 13, anchor: 'middle', weight: 600 });
        p.box({ cx: 'center', y: 74, w: 92, h: 92, cls: 'sub' });

        p.text({ x: 16, y: 188, s: '品质', size: 10 });
        p.text({ x: 62, y: 188, s: '白色', size: 10 });
        p.text({ x: 16, y: 208, s: '模块类型', size: 10 });
        p.text({ x: 232, y: 208, s: '单手武器', size: 10, anchor: 'end' });

        p.line({ x1: 12, y1: 220, x2: 232, y2: 220 });

        const stats = [['攻击力', '48'], ['命中', '110'], ['暴击率', '1%'], ['暴击伤害', '165%'],
          ['先攻', '7'], ['移动步数', '6'], ['防御', '8'], ['闪避', '0'], ['格挡', '0'], ['更多属性', '›']];
        stats.forEach(([l, v], i) => {
          const y = 242 + i * 24;
          p.text({ x: 16, y, s: l, size: 10 });
          p.text({ x: 230, y, s: v, size: 10, anchor: 'end' });
        });

        p.text({ x: 16, y: 528, s: '模块技能', size: 12, weight: 600 });
        slotRow(p, { x: 12, y: 554, w: 220, count: 4, h: 56, gap: 8, keys: ['1', '2', '3', '4'], fillFirst: 1 });
        p.text({ cx: 'center', y: 626, s: '模块技能（未装备）', size: 10, anchor: 'middle' });
      },
    },
    {
      id: 'C', label: '模块背包', color: '#6fb8e0',
      box: { left: 'B.right+8', right: 'D.left-8', top: 'A.bottom+8', bottom: 'B-16' },
      draw(p) {
        p.text({ x: 16, y: 24, s: '模块背包', size: 13, anchor: 'start', weight: 600 });
        p.box({ x: p.region.w - 116, y: 8, w: 100, h: 26, cls: 'sub' });
        p.text({ x: p.region.w - 66, y: 25, s: '全部 ⌄', size: 10, anchor: 'middle' });

        const cw = 176, ch = 176, gapx = 14, gapy = 14, x0 = 16, y0 = 44;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 4; c++) {
            const x = x0 + c * (cw + gapx), y = y0 + r * (ch + gapy);
            p.box({ x, y, w: cw, h: ch, cls: (r === 0 && c === 0) ? 'subfill' : 'sub' });
            p.text({ x: x + 12, y: y + 20, s: '单手圆锤', size: 10 });
            p.box({ cx: x + cw / 2, y: y + 30, w: 64, h: 64, cls: 'sub' });
            p.text({ x: x + 12, y: y + 116, s: '攻击力 48', size: 9 });
            p.text({ x: x + 12, y: y + 134, s: '命中 110', size: 9 });
            p.text({ x: x + 12, y: y + 152, s: '暴击率 1%', size: 9 });
          }
        }

        p.text({ cx: 'center', y: 618, s: '1 / 1', size: 10, anchor: 'middle' });
        p.text({ x: 6, y: 340, s: '‹', size: 18, anchor: 'middle' });
        p.text({ x: p.region.w - 6, y: 340, s: '›', size: 18, anchor: 'middle' });
      },
    },
    {
      id: 'D', label: '模块详情', color: '#9b7fd4',
      box: { left: 'R-234', width: 234, top: 'A.bottom+8', bottom: 'B-16' },
      draw(p) {
        p.text({ x: 16, y: 24, s: '模块详情', size: 12, weight: 600 });
        p.box({ x: 0, y: 34, w: 234, h: 300, cls: 'sub' });
        p.text({ cx: 'center', y: 190, s: '模块预览', size: 11, anchor: 'middle' });

        p.text({ cx: 'center', y: 362, s: '单手圆锤·初', size: 12, anchor: 'middle', weight: 600 });
        p.text({ x: 16, y: 386, s: '白色', size: 10 });
        p.text({ x: 218, y: 386, s: '单手武器', size: 10, anchor: 'end' });

        p.line({ x1: 12, y1: 400, x2: 222, y2: 400 });
        [['攻击力', '48'], ['命中', '110'], ['暴击率', '1%'], ['暴击伤害', '165%'], ['先攻', '7']].forEach(([l, v], i) => {
          const y = 424 + i * 24;
          p.text({ x: 16, y, s: l, size: 10 });
          p.text({ x: 218, y, s: v, size: 10, anchor: 'end' });
        });

        p.box({ cx: 'center', y: 550, w: 132, h: 30, cls: 'sub' });
        p.text({ cx: 'center', y: 570, s: '模块拆解', size: 11, anchor: 'middle' });
        p.box({ cx: 'center', y: 590, w: 132, h: 28, cls: 'sub' });
        p.text({ cx: 'center', y: 609, s: '模块强化', size: 11, anchor: 'middle' });
      },
    },
  ],
};
