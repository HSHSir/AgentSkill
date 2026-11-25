// 伙伴界面 —— 锚点版
import { currency, closeBtn, slotRow } from '../kit/core.mjs';

export default {
  title: '伙伴界面 线框图',
  file: 'partner-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    /* ============ A 顶部标题栏 ============ */
    {
      id: 'A', label: '顶部标题栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        p.text({ x: 100, y: 40, s: '伙伴', size: 20, weight: 600 });
        currency(p, { right: 1190, y: 32, items: ['300', '250', '100'], pitch: 62, r: 12 });
        closeBtn(p, { cx: 1254, cy: 32, r: 16 });
      },
    },

    /* ============ B 伙伴列表 ============ */
    {
      id: 'B', label: '伙伴列表', color: '#e8952f',
      box: { left: 'L+32', width: 340, top: 'A.bottom+20', bottom: 'B' },
      draw(p) {
        // 选中卡片
        p.box({ x: 12, y: 28, w: 316, h: 98, cls: 'subfill' });
        p.box({ x: 20, y: 36, w: 62, h: 82, cls: 'sub' });
        p.circle({ cx: 51, cy: 77, r: 22, cls: 'sub' });
        p.text({ x: 92, y: 58, s: '电箱', size: 14, weight: 600 });

        // 好感度
        p.circle({ cx: 96, cy: 92, r: 9, cls: 'sub', fill: '#f2c9c9' });
        p.text({ cx: 96, y: 96, s: '♥', size: 10, anchor: 'middle' });
        p.box({ x: 112, y: 84, w: 208, h: 18, cls: 'sub' });
        p.text({ cx: 216, y: 97, s: '0/100', size: 10, anchor: 'middle' });

        // 其余伙伴：虚线空位（列表尚未解锁 / 未获得）
        for (let i = 0; i < 4; i++) {
          p.box({ x: 12, y: 150 + i * 92, w: 316, h: 78, cls: 'sub', dash: '6 5' });
        }
        p.text({ cx: 170, y: 560, s: '（其余伙伴）', size: 11, anchor: 'middle', cls: 'ghost' });
      },
    },

    /* ============ C 伙伴详情 ============ */
    {
      id: 'C', label: '伙伴详情', color: '#7fb069',
      box: { left: 462, width: 206, top: 'A.bottom+20', height: 360 },
      draw(p) {
        // 立绘
        p.box({ x: 0, y: 8, w: 206, h: 300, cls: 'sub' });
        p.circle({ cx: 103, cy: 158, r: 62, cls: 'sub' });
        p.text({ cx: 103, y: 163, s: '伙伴立绘', size: 11, anchor: 'middle', cls: 'ghost' });

        // 好感度条
        p.box({ x: 0, y: 316, w: 206, h: 22, cls: 'sub' });
        p.circle({ cx: 20, cy: 331, r: 8, cls: 'sub', fill: '#f2c9c9' });
        p.text({ cx: 20, y: 335, s: '♥', size: 9, anchor: 'middle' });
        p.text({ cx: 103, y: 336, s: '0/100', size: 11, anchor: 'middle' });
      },
    },

    /* ============ D 事件与喜好 ============ */
    {
      id: 'D', label: '事件与喜好', color: '#6fb8e0',
      box: { left: 'C.right+8', width: 544, top: 'A.bottom+20', height: 360 },
      draw(p) {
        // 三条事件
        for (let i = 0; i < 3; i++) {
          const y = 8 + i * 44;
          p.box({ x: 0, y, w: 544, h: 38, cls: 'sub' });
          p.circle({ cx: 22, cy: y + 19, r: 11 });
          p.text({ x: 44, y: y + 24, s: `事件${i + 1}`, size: 12 });
          p.circle({ cx: 534, cy: y + 19, r: 14, cls: 'sub' });
          p.text({ cx: 534, y: y + 23, s: '♥', size: 11, anchor: 'middle' });
        }

        // 喜欢 / 讨厌
        p.text({ cx: 140, y: 172, s: '喜欢的东西', size: 11, anchor: 'middle' });
        p.box({ x: 0, y: 178, w: 280, h: 128, cls: 'sub' });
        p.line({ x1: 0, y1: 200, x2: 280, y2: 200, cls: 'rule-thin' });
        p.box({ x: 12, y: 216, w: 18, h: 18, cls: 'sub' });
        p.text({ x: 38, y: 230, s: '玩具摆件', size: 11 });

        p.text({ cx: 416, y: 172, s: '讨厌的东西', size: 11, anchor: 'middle' });
        p.box({ x: 288, y: 178, w: 256, h: 128, cls: 'sub' });
        p.line({ x1: 288, y1: 200, x2: 544, y2: 200, cls: 'rule-thin' });
        p.box({ x: 300, y: 216, w: 18, h: 18, cls: 'sub' });
        p.text({ x: 326, y: 230, s: '音乐', size: 11 });
      },
    },

    /* ============ E 礼物列表 ============ */
    {
      id: 'E', label: '礼物列表', color: '#9b7fd4',
      box: { left: 462, right: 'D.right', top: 'C.bottom+18', bottom: 'B' },
      draw(p) {
        p.text({ cx: 'center', y: 20, s: '礼物列表', size: 12, anchor: 'middle', weight: 600 });

        // 礼物格：6 列 × 2 行，等宽铺满
        const inner = p.region.w - 24;
        for (let r = 0; r < 2; r++) {
          slotRow(p, { x: 12, y: 32 + r * 78, w: inner, count: 6, h: 70, gap: 6 });
        }

        // 赠送按钮（父容器中下方居中）
        p.box({ cx: 'center', y: 198, w: 148, h: 34, cls: 'subfill' });
        p.text({ cx: 'center', y: 220, s: '赠送', size: 13, anchor: 'middle', weight: 600 });
      },
    },
  ],
};
