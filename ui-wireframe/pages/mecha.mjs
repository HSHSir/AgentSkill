// 机甲拼装 —— 五区：顶栏 / 左机甲面板 / 中拼装台 / 底类型卡
import { tabs, keycap, currency, closeBtn, slotRow } from '../kit/core.mjs';

export default {
  title: '机甲拼装 线框图',
  file: 'mecha-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    {
      id: 'A', label: '顶部标签栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        keycap(p, { x: 37, y: 17, s: 'Q' });
        tabs(p, { x: 79, y: 10, w: 150, h: 42, gap: 10, labels: ['机甲拼装', '模块生产', '模块拆解'], active: 0 });
        keycap(p, { x: 727, y: 17, s: 'E' });
        currency(p, { right: 1198, y: 32, items: ['300', '250', '100'], pitch: 78 });
        closeBtn(p, { cx: 1254, cy: 32, r: 15 });
      },
    },
    {
      id: 'B', label: '机甲属性面板', color: '#e8952f',
      box: { left: 'L', width: 384, top: 'A.bottom+8', height: 532 },
      draw(p) {
        p.box({ x: 0, y: 0, w: 384, h: 532, cls: 'sub' });

        p.text({ cx: 'center', y: 27, s: '卒级机甲', size: 15, anchor: 'middle', weight: 700 });

        // 护盾 / 生命
        [['护盾', '300/300', 52], ['生命', '100/100', 78]].forEach(([lbl, val, y]) => {
          p.circle({ cx: 26, cy: y, r: 11, cls: 'sub' });
          p.text({ x: 46, y: y + 5, s: lbl, size: 11 });
          p.box({ x: 104, y: y - 8, w: 176, h: 16, cls: 'sub' });
          p.text({ x: 360, y: y + 5, s: val, size: 10, anchor: 'end' });
        });

        // 两列属性
        const stats = [
          ['攻击力', '48', '命中', '110'],
          ['暴击率', '1%', '暴击伤害', '165%'],
          ['先攻', '7', '移动步数', '6'],
          ['防御', '8', '闪避', '0'],
          ['格挡', '0', '更多属性', '›'],
        ];
        stats.forEach(([l1, v1, l2, v2], i) => {
          const y = 112 + i * 28;
          p.text({ x: 24, y, s: l1, size: 11 });
          p.text({ x: 168, y, s: v1, size: 11, anchor: 'end' });
          p.text({ x: 196, y, s: l2, size: 11 });
          p.text({ x: 360, y, s: v2, size: 11, anchor: 'end' });
        });

        p.line({ x1: 16, y1: 258, x2: 368, y2: 258 });

        // 机甲技能
        p.text({ x: 16, y: 280, s: '机甲技能', size: 11, weight: 600 });
        p.text({ x: 360, y: 280, s: '燃料 100', size: 10, anchor: 'end' });
        const sw = slotRow(p, { x: 12, y: 292, w: 360, count: 5, h: 56, gap: 8, keys: ['1', '2', '3', '4', '5'], fillFirst: 4 });

        // 被动技能
        p.text({ x: 16, y: 380, s: '被动技能', size: 11, weight: 600 });
        for (let i = 0; i < 5; i++) p.circle({ cx: 44 + i * 64, cy: 406, r: 19, cls: 'sub' });
        p.text({ cx: 'center', y: 442, s: '需激活', size: 10, anchor: 'middle' });

        p.box({ cx: 'center', y: 486, w: 320, h: 34, cls: 'subfill' });
        p.text({ cx: 'center', y: 508, s: '当前出战机甲', size: 12, anchor: 'middle' });
      },
    },
    {
      id: 'C', label: '拼装台场景', color: '#6fb8e0',
      box: { left: 'B.right+8', right: 'R', top: 'A.bottom+8', height: 532 },
      draw(p) {
        p.text({ x: p.region.w - 16, y: 26, s: '机甲拼装台（3D 场景，不绘制）', size: 12, anchor: 'end' });

        const mods = [
          { x: 552, y: 44, w: 92, h: 72, t: '头部', n: '推进背包' },
          { x: 556, y: 246, w: 76, h: 66, t: '左肩', n: '基础钩爪' },
          { x: 64, y: 388, w: 92, h: 72, t: '右手', n: '基础圆锤' },
          { x: 596, y: 448, w: 86, h: 72, t: '腿部', n: '基础腿部' },
          { x: 96, y: 96, w: 92, h: 72, t: '主体', n: '卒级机甲' },
        ];
        mods.forEach(m => {
          p.box({ x: m.x, y: m.y, w: m.w, h: m.h, cls: 'sub' });
          p.text({ x: m.x + 6, y: m.y - 6, s: m.t, size: 9 });
          p.box({ x: m.x + 6, y: m.y + 10, w: 28, h: 28, cls: 'sub' });
          p.text({ x: m.x + 6, y: m.y + 62, s: m.n, size: 10 });
        });
      },
    },
    {
      id: 'D', label: '机体类型', color: '#9b7fd4',
      box: { left: 'B.right+8', right: 'R', bottom: 'B', height: 106 },
      draw(p) {
        const w = 92, gap = 14, total = w * 3 + gap * 2;
        const x0 = (p.region.w - total) / 2;
        ['类人型', '履带型', '悬浮型'].forEach((n, i) => {
          const x = x0 + i * (w + gap);
          p.box({ x, y: 12, w, h: 82, cls: i === 0 ? 'subfill' : 'sub' });
          p.text({ cx: x + w / 2, y: 58, s: n, size: 11, anchor: 'middle' });
        });
      },
    },
  ],
};
