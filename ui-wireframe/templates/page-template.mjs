// <界面名> —— 锚点版
// 复制本文件为 pages/<name>.mjs 后填写。
// 顺序：先只写 regions 的 box（跑一次），再往 draw 里填内容。
import { tabs, keycap, currency, closeBtn, grid, statList, roundGroup, cardRow } from '../kit/core.mjs';

export default {
  title: '界面名 线框图',
  file: 'xxx-wireframe',                 // 输出 Docs/UI/<file>.html|png
  canvas: { w: 1290, h: 734 },           // 高度 = 截图高 − 标题栏
  axes: { L: 8, R: 1282, C: 645 },       // 四条轴；C 默认取 L/R 中点

  regions: [
    /* ---------- 顶部栏 ---------- */
    {
      id: 'A', label: '顶部标签栏', color: '#5bb8d8',
      box: { left: 'L', right: 'R', top: 'T', height: 64 },
      draw(p) {
        keycap(p, { x: 37, y: 17, s: 'Q' });
        tabs(p, { x: 79, y: 10, w: 150, h: 42, gap: 10, labels: ['标签1', '标签2', '标签3', '标签4'], active: 0 });
        keycap(p, { x: 727, y: 17, s: 'E' });
        currency(p, { right: 1198, y: 32, items: ['300', '250', '100'], pitch: 78 });
        closeBtn(p, { cx: 1254, cy: 32, r: 15 });
      },
    },

    /* ---------- 左侧面板 ---------- */
    {
      id: 'B', label: '左侧面板', color: '#e8952f',
      box: { left: 'L', width: 438, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        p.box({ cx: 'center', y: 12, w: 180, h: 28, cls: 'subfill' });
        p.text({ cx: 'center', y: 31, s: '名称', size: 13, anchor: 'middle' });
      },
    },

    /* ---------- 中间主区 ---------- */
    {
      id: 'C', label: '主区', color: '#6fb8e0',
      box: { left: 'B.right+14', width: 570, top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        grid(p, { x: 5, y: 10, cols: 6, rows: 4, cw: 89, ch: 64, gx: 5, gy: 6 });
      },
    },

    /* ---------- 右侧区 ---------- */
    {
      id: 'D', label: '右侧区', color: '#9b7fd4',
      box: { left: 'C.right+10', right: 'R', top: 'A.bottom', bottom: 'E.top-10' },
      draw(p) {
        p.text({ cx: 'center', y: 22, s: '标题', size: 13, anchor: 'middle', weight: 600 });
        p.box({ x: 12, y: 32, w: 218, h: 494, cls: 'sub' });
      },
    },

    /* ---------- 底部栏 ---------- */
    {
      id: 'E', label: '底部栏', color: '#6fc4a8',
      box: { left: 'L', right: 'R', bottom: 'B', height: 106 },
      draw(p) {
        cardRow(p, { x: 57, y: 10, w: 87, h: 84, count: 2, gap: 13, labels: ['角色1', '角色2'] });
      },
    },
  ],
};
