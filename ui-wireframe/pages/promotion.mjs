// 转职 —— 五区：顶栏 / 觉醒方向 / 立绘 / 觉醒能力 / 伙伴栏
import { keycap, currency, closeBtn, slotRow } from '../kit/core.mjs';

export default {
  title: '转职 线框图',
  file: 'promotion-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    {
      id: 'A', label: '顶部栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        p.text({ x: 32, y: 40, s: '转职', size: 18, weight: 700 });
        currency(p, { right: 1198, y: 32, items: ['300', '250', '100'], pitch: 78 });
        closeBtn(p, { cx: 1254, cy: 32, r: 15 });
      },
    },
    {
      id: 'B', label: '觉醒方向', color: '#e8952f',
      box: { left: 'L', width: 410, top: 'A.bottom+8', bottom: 'E.top-8' },
      draw(p) {
        p.text({ x: 16, y: 26, s: '觉醒方向', size: 13, weight: 600 });
        p.box({ x: 0, y: 34, w: 410, h: p.region.h - 34, cls: 'sub' });

        // 角色卡
        p.box({ x: 12, y: 46, w: 386, h: 96, cls: 'sub' });
        p.box({ x: 22, y: 54, w: 76, h: 80, cls: 'sub' });
        p.text({ x: 112, y: 84, s: '绝境斗士', size: 13, weight: 600 });
        p.text({ x: 112, y: 104, s: '人类', size: 10 });
        p.text({ x: 164, y: 104, s: '近战输出', size: 10 });
        p.circle({ cx: 366, cy: 94, r: 16, cls: 'sub' });

        // 觉醒介绍
        p.text({ cx: 'center', y: 176, s: '觉醒介绍', size: 11, anchor: 'middle', weight: 600 });
        p.text({ x: 16, y: 202, s: '装备重剑，舍防换伤的战场凶兽，伤痛只会让其战意愈发炽烈，破坏力越恐怖。', size: 10 });
        p.text({ x: 16, y: 220, s: '觉醒后获得被动「背水一战」，损失生命值提升攻击力。', size: 10 });

        // 属性提升
        p.text({ cx: 'center', y: 268, s: '属性提升', size: 11, anchor: 'middle', weight: 600 });
        const left = [['生命', '50', '75'], ['精力', '3', '4'], ['暴击伤害', '150%', '150%'], ['闪避', '5', '5'], ['先攻', '13', '15']];
        const right = [['攻击力', '11', '16'], ['暴击率', '10%', '10%'], ['命中', '100', '100'], ['移动步数', '5', '5']];
        const row = (x, y, [l, a, b], up) => {
          p.text({ x, y, s: l, size: 10 });
          p.text({ x: x + 122, y, s: a, size: 10, anchor: 'end' });
          p.text({ x: x + 132, y, s: '›', size: 10, anchor: 'middle' });
          p.text({ x: x + 144, y, s: b, size: 10 });
          if (up) p.text({ x: x + 176, y, s: '↑', size: 10 });
        };
        left.forEach((r, i) => row(16, 296 + i * 30, r, r[1] !== r[2]));
        right.forEach((r, i) => row(210, 296 + i * 30, r, r[1] !== r[2]));
      },
    },
    {
      id: 'C', label: '角色立绘', color: '#6fb8e0',
      box: { left: 'B.right+8', right: 'D.left-8', top: 'A.bottom+8', bottom: 'E.top-8' },
      draw(p) {
        p.text({ cx: 'center', y: p.region.h / 2, s: '角色立绘（3D 场景，不绘制）', size: 12, anchor: 'middle' });
      },
    },
    {
      id: 'D', label: '觉醒能力', color: '#9b7fd4',
      box: { left: 'R-342', width: 342, top: 'A.bottom+8', bottom: 'E.top-8' },
      draw(p) {
        p.text({ x: 16, y: 26, s: '觉醒能力', size: 13, weight: 600 });
        p.box({ x: 0, y: 34, w: 342, h: p.region.h - 34, cls: 'sub' });

        const kv = (y, label, a, b) => {
          p.text({ x: 16, y, s: label, size: 10 });
          p.text({ x: 250, y, s: a, size: 10, anchor: 'end' });
          p.text({ x: 264, y, s: '›', size: 10, anchor: 'middle' });
          p.text({ x: 326, y, s: b, size: 10, anchor: 'end' });
        };
        kv(62, '等级上限', '20', '31');
        kv(98, '当前等级', '1', '1');

        p.text({ cx: 'center', y: 138, s: '角色特质', size: 11, anchor: 'middle', weight: 600 });
        p.circle({ cx: 171, cy: 190, r: 34, cls: 'sub' });
        p.text({ cx: 'center', y: 244, s: '背水一战', size: 10, anchor: 'middle' });

        p.text({ cx: 'center', y: 282, s: '角色技能', size: 11, anchor: 'middle', weight: 600 });
        const skills = [['斩击风暴', 'Lv.2 解锁'], ['舍身斩', 'Lv.3 解锁'], ['弧光斩', 'Lv.4 解锁'], ['星陨坠击', 'Lv.5 解锁']];
        skills.forEach(([n, l], i) => {
          const x = 16 + (i % 2) * 160, y = 300 + Math.floor(i / 2) * 92;
          p.box({ x, y, w: 150, h: 86, cls: 'sub' });
          p.text({ x: x + 10, y: y + 24, s: n, size: 10 });
          p.text({ x: x + 10, y: y + 74, s: l, size: 9 });
        });

        p.text({ x: 16, y: 496, s: '觉醒所需', size: 10 });
        p.text({ x: 140, y: 496, s: '等级 20', size: 10 });
        p.circle({ cx: 232, cy: 492, r: 8, cls: 'sub' });
        p.text({ x: 326, y: 496, s: '180', size: 10, anchor: 'end' });

        p.box({ cx: 'center', y: 512, w: 306, h: 32, cls: 'sub' });
        p.text({ cx: 'center', y: 533, s: '职业觉醒', size: 12, anchor: 'middle' });
      },
    },
    {
      id: 'E', label: '伙伴栏', color: '#6fc4a8',
      box: { left: 'L', right: 'R', bottom: 'B', height: 86 },
      draw(p) {
        slotRow(p, { x: 8, y: 8, w: p.region.w - 16, count: 13, h: 58, gap: 6, fillFirst: 2 });
        [['雷恩', 98], ['电箱', 200]].forEach(([n, cx]) => {
          p.text({ cx, y: 80, s: '等级不足', size: 9, anchor: 'middle' });
        });
      },
    },
  ],
};
