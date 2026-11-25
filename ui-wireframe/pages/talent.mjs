// 天赋界面 —— 锚点版
// 布局只挂锚点：L/R/C/T/B 轴线 + 区域边 + 父容器中心
import { tabs, keycap, currency, closeBtn, grid } from '../kit/core.mjs';

export default {
  title: '天赋界面 线框图',
  file: 'talent-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    /* ============ A 顶部标签栏 ============ */
    {
      id: 'A', label: '顶部标签栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        keycap(p, { x: 37, y: 17, s: 'Q' });
        tabs(p, { x: 79, y: 10, w: 150, h: 42, gap: 10, labels: ['角色', '天赋', '技能', '仓库'], active: 1 });
        keycap(p, { x: 727, y: 17, s: 'E' });
        currency(p, { right: 1198, y: 32, items: ['300', '250', '100'], pitch: 78 });
        closeBtn(p, { cx: 1254, cy: 32, r: 15 });
      },
    },

    /* ============ B 角色面板 ============ */
    {
      id: 'B', label: '角色面板', color: '#e8952f',
      box: { left: 'L', width: 438, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        // 名称条
        p.box({ x: 136, y: 10, w: 181, h: 28, cls: 'subfill' });
        p.text({ cx: 226, y: 29, s: '雷恩', size: 13, anchor: 'middle' });
        p.circle({ cx: 296, cy: 24, r: 11, cls: 'subfill' });
        p.text({ cx: 296, y: 28, s: '▣', size: 10, anchor: 'middle' });

        // 头像
        p.box({ x: 58, y: 46, w: 176, h: 262, cls: 'sub' });
        p.circle({ cx: 67, cy: 66, r: 14, cls: 'subfill' });
        p.text({ cx: 67, y: 70, s: '1', size: 10, anchor: 'middle', weight: 700 });
        p.text({ cx: 146, y: 180, s: '角色立绘', size: 12, anchor: 'middle', cls: 'ghost' });
        p.box({ x: 54, y: 267, w: 83, h: 16, cls: 'sub' });
        p.text({ cx: 95, y: 279, s: '人类', size: 10, anchor: 'middle' });
        p.box({ x: 145, y: 267, w: 83, h: 16, cls: 'sub' });
        p.text({ cx: 186, y: 279, s: '近战输出', size: 10, anchor: 'middle' });

        // 属性面板
        p.box({ x: 246, y: 58, w: 148, h: 252, cls: 'sub' });
        p.text({ x: 252, y: 73, s: '护盾', size: 10 });
        p.text({ x: 388, y: 73, s: '20/20', size: 10, anchor: 'end' });
        p.line({ x1: 246, y1: 78, x2: 394, y2: 78, cls: 'rule-thin' });
        p.text({ x: 252, y: 93, s: '生命', size: 10 });
        p.text({ x: 388, y: 93, s: '50/50', size: 10, anchor: 'end' });
        p.line({ x1: 246, y1: 98, x2: 394, y2: 98, cls: 'rule-thin' });

        // 四属性
        ['⬢', '⚔', '🛡', '✧'].forEach((g, i) => {
          p.circle({ cx: 267 + i * 38, cy: 123, r: 9 });
          p.text({ cx: 267 + i * 38, y: 127, s: g, size: 9, anchor: 'middle' });
          p.text({ cx: 267 + i * 38, y: 152, s: ['11', '2', '5', '5'][i], size: 11, anchor: 'middle' });
        });

        // 五行属性
        [
          ['◎ 命中', '100'], ['◈ 暴击率', '10%'], ['◈ 暴击伤害', '150%'],
          ['◈ 先攻', '13'], ['◈ 精力', '3'],
        ].forEach(([k, v], i) => {
          const y = 170 + i * 18;
          p.text({ x: 252, y: y + 12, s: k, size: 10 });
          p.text({ x: 388, y: y + 12, s: v, size: 10, anchor: 'end' });
        });

        p.box({ x: 290, y: 262, w: 104, h: 18, cls: 'sub' });
        p.text({ cx: 342, y: 275, s: '更多属性 ▸', size: 10, anchor: 'middle' });

        // 角色特质
        p.line({ x1: 8, y1: 318, x2: 430, y2: 318, cls: 'rule' });
        p.text({ cx: 219, y: 313, s: '角色特质', size: 11, anchor: 'middle', cls: 't-sub' });

        const sp = ['战意', '？', '？', '？'];
        [[72, 332], [244, 332], [72, 434], [244, 434]].forEach(([x, y], i) => {
          p.box({ x, y, w: 152, h: 92, cls: 'sub' });
          p.text({ cx: x + 76, y: y + 84, s: sp[i], size: 11, anchor: 'middle' });
        });
      },
    },

    /* ============ C 天赋主区 ============ */
    {
      id: 'C', label: '天赋主区', color: '#6fb8e0',
      box: { left: 'B.right+14', width: 570, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        // 三个负载槽
        [
          ['攻击负载 0/0', '#f6dede', '#8c2b2b'],
          ['生存负载 0/0', '#d9e9f7', '#1f5f8c'],
          ['机制负载 0/0', '#f7ecd9', '#8c6a1f'],
        ].forEach(([label, fill, ink], i) => {
          const x = 5 + i * 186;
          p.box({ x, y: 10, w: 178, h: 30, cls: 'sub', fill });
          p.text({ cx: x + 89, y: 30, s: label, size: 11, anchor: 'middle', fill: ink, weight: 600 });
          p.circle({ cx: x + 158, cy: 25, r: 6 });
        });

        // 主网格 6×4
        grid(p, { x: 5, y: 52, cols: 6, rows: 4, cw: 89, ch: 64, gx: 5, gy: 6 });

        // 筛选行
        ['全部', '攻击', '生存', '机制'].forEach((s, i) => {
          const x = 5 + i * 63;
          p.box({ x, y: 340, w: 58, h: 26, cls: 'sub', fill: i === 0 ? '#b7e4c7' : undefined });
          p.text({ cx: x + 29, y: 358, s, size: 11, anchor: 'middle', weight: i === 0 ? 600 : 400 });
        });
        p.box({ x: 330, y: 340, w: 140, h: 26, cls: 'sub' });
        p.text({ x: 338, y: 358, s: '输入要搜索的关键字', size: 10, cls: 't-sub' });
        p.box({ x: 476, y: 340, w: 88, h: 26, cls: 'sub' });
        p.text({ cx: 520, y: 358, s: '全部 ⌄', size: 10, anchor: 'middle' });

        // 7 个候选槽
        for (let i = 0; i < 7; i++) p.box({ x: 5 + i * 81, y: 374, w: 74, h: 114, cls: 'sub' });

        // 翻页箭头 + 页码
        p.raw('<path d="M-12 431 L-2 423 L-2 439 Z" fill="#8a929c"/>');
        p.raw('<path d="M574 431 L564 423 L564 439 Z" fill="#8a929c"/>');
        p.box({ cx: 'center', y: 506, w: 66, h: 20, cls: 'sub' });
        p.text({ cx: 'center', y: 520, s: '1 / 1', size: 10, anchor: 'middle' });
      },
    },

    /* ============ D 天赋羁绊 ============ */
    {
      id: 'D', label: '天赋羁绊', color: '#9b7fd4',
      box: { left: 'C.right+10', right: 'R', top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        p.text({ cx: 'center', y: 22, s: '天赋羁绊', size: 13, anchor: 'middle', weight: 600 });
        p.box({ x: 12, y: 32, w: 218, h: 494, cls: 'sub' });
        p.text({ cx: 'center', y: 284, s: '羁绊树（未解锁）', size: 12, anchor: 'middle', cls: 'ghost' });
      },
    },

    /* ============ E 底部伙伴栏 ============ */
    {
      id: 'E', label: '底部伙伴栏', color: '#6fc4a8',
      box: { left: 'L', right: 'R', bottom: 'B', height: 106 },
      draw(p) {
        [['雷恩', 57], ['电箱', 157]].forEach(([name, x], i) => {
          p.box({ x, y: 10, w: 87, h: 84, cls: i === 0 ? 'subfill' : 'sub' });
          p.circle({ cx: x + 7, cy: 18, r: 9, cls: 'subfill' });
          p.text({ cx: x + 7, y: 22, s: '1', size: 9, anchor: 'middle', weight: 700 });
          p.circle({ cx: x + 7, cy: 52, r: 11 });
          p.text({ cx: x + 43, y: 86, s: name, size: 11, anchor: 'middle' });
        });
      },
    },
  ],
};
