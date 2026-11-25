// 技能界面 —— 锚点版
import { tabs, keycap, currency, closeBtn, slotRow, charStatPanel } from '../kit/core.mjs';

export default {
  title: '技能界面 线框图',
  file: 'skill-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    /* ============ A 顶部标签栏 ============ */
    {
      id: 'A', label: '顶部标签栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        keycap(p, { x: 37, y: 17, s: 'Q' });
        tabs(p, { x: 79, y: 10, w: 150, h: 42, gap: 10, labels: ['角色', '天赋', '技能', '仓库'], active: 2 });
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

        // 属性面板（组件，与角色/天赋页共用）
        charStatPanel(p, { x: 246, y: 58, w: 148, h: 252 });

        // 角色技能
        p.line({ x1: 8, y1: 326, x2: 430, y2: 326, cls: 'rule' });
        p.text({ cx: 219, y: 321, s: '角色技能', size: 11, anchor: 'middle', cls: 't-sub' });

        // 第一行 5 槽（等宽铺满 340）
        slotRow(p, { x: 62, y: 340, w: 340, count: 5, h: 64, gap: 10, keys: ['1', '2', '3', '4', '5'], fillFirst: 1 });

        // 技能分组标签
        p.text({ x: 62, y: 424, s: '武器技能', size: 9, cls: 't-sub' });
        p.text({ x: 202, y: 424, s: '饰品技能', size: 9, cls: 't-sub' });
        p.text({ x: 342, y: 424, s: '工具技能', size: 9, cls: 't-sub' });

        // 第二行 5 槽（键位 R/T/Z/X/C），与第一行同宽同高
        slotRow(p, { x: 62, y: 438, w: 340, count: 5, h: 64, gap: 10, keys: ['R', 'T', 'Z', 'X', 'C'], fillFirst: 1 });
      },
    },

    /* ============ C 技能主区 ============ */
    {
      id: 'C', label: '技能主区', color: '#6fb8e0',
      box: { left: 'B.right+14', width: 508, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        // 基础职业
        p.box({ x: 12, y: 10, w: 484, h: 236, cls: 'sub' });
        p.circle({ cx: 32, cy: 30, r: 11 });
        p.text({ x: 50, y: 35, s: '基础职业', size: 12, weight: 600 });
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 3; c++) {
            const x = 26 + c * 158, y = 56 + r * 80;
            p.box({ x, y, w: 140, h: 70, cls: c === 0 && r === 0 ? 'subfill' : 'sub' });
            p.circle({ cx: x + 30, cy: y + 35, r: 14 });
            p.text({ x: x + 56, y: y + 31, s: ['沉重斩击', '击退劈砍', '潜能激发', '旋风斩', '十字斩', '战士姿态'][r * 3 + c], size: 10 });
            p.text({ x: x + 56, y: y + 47, s: ['已装备', 'Lv.2 解锁', 'Lv.4 解锁', 'Lv.6 解锁', 'Lv.8 解锁', 'Lv.9 解锁'][r * 3 + c], size: 9, cls: 't-sub' });
          }
        }

        // 转职职业：徽章居中，按钮组贴在中下方居中
        p.box({ x: 12, y: 262, w: 484, h: 264, cls: 'sub' });
        p.circle({ cx: 32, cy: 282, r: 11 });
        p.text({ x: 50, y: 287, s: '转职职业', size: 12, weight: 600 });

        p.circle({ cx: 'center', cy: 380, r: 38, cls: 'sub' });
        p.text({ cx: 'center', y: 385, s: '职业徽章', size: 10, anchor: 'middle', cls: 'ghost' });

        p.box({ cx: 'center', y: 446, w: 150, h: 26, cls: 'sub' });
        p.text({ cx: 'center', y: 464, s: '转职所需等级 20', size: 10, anchor: 'middle' });
        p.box({ cx: 'center', y: 480, w: 150, h: 26, cls: 'sub' });
        p.text({ cx: 'center', y: 498, s: '前往转职', size: 10, anchor: 'middle' });
      },
    },

    /* ============ D 右侧栏 ============ */
    {
      id: 'D', label: '被动与状态', color: '#9b7fd4',
      box: { left: 'C.right+10', width: 232, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        // 角色被动
        p.text({ cx: 'center', y: 22, s: '角色被动', size: 12, anchor: 'middle', weight: 600 });
        p.box({ x: 12, y: 32, w: 208, h: 284, cls: 'sub' });
        [['战意', 54], ['休整', 104]].forEach(([s, y]) => {
          p.circle({ cx: 34, cy: y, r: 11 });
          p.text({ x: 54, y: y + 4, s, size: 11 });
        });

        // 角色状态
        p.text({ cx: 'center', y: 350, s: '角色状态', size: 12, anchor: 'middle', weight: 600 });
        p.box({ x: 12, y: 360, w: 208, h: 166, cls: 'sub' });
        p.text({ cx: 'center', y: 448, s: '（状态列表）', size: 11, anchor: 'middle', cls: 'ghost' });
      },
    },

    /* ============ E 底部伙伴栏：整排等宽方格 ============ */
    {
      id: 'E', label: '底部伙伴栏', color: '#6fc4a8',
      box: { left: 'L', right: 'R', bottom: 'B', height: 106 },
      draw(p) {
        // 整排等宽方格，自动铺满 1254
        const labels = new Array(13).fill(undefined);
        labels[0] = '雷恩'; labels[1] = '电箱';
        const sw = slotRow(p, { x: 10, y: 10, w: 1254, count: 13, h: 84, gap: 6, fillFirst: 2, labels });
        // 前两格：头像 + 等级角标
        [0, 1].forEach(i => {
          const sx = 10 + i * (sw + 6);
          p.circle({ cx: sx + 22, cy: 52, r: 18, cls: 'sub' });
          p.circle({ cx: sx + 10, cy: 20, r: 9, cls: 'subfill' });
          p.text({ cx: sx + 10, y: 24, s: '1', size: 9, anchor: 'middle', weight: 700 });
        });
      },
    },
  ],
};
