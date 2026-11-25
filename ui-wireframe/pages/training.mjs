// 训练中心 —— 弹窗层（背景基地界面不重复绘制）
import { closeBtn } from '../kit/core.mjs';

export default {
  title: '训练中心 线框图',
  file: 'training-wireframe',
  canvas: { w: 1290, h: 734 },
  axes: { L: 8, R: 1282, C: 645 },

  regions: [
    {
      id: 'A', label: '训练中心弹窗', color: '#5bb8d8',
      box: { left: 270, top: 165, width: 750, height: 485 },
      draw(p) {
        p.box({ x: 0, y: 0, w: 750, h: 485, cls: 'subfill' });

        // 标题条
        p.box({ x: 0, y: 0, w: 750, h: 48, cls: 'sub' });
        p.text({ cx: 'center', y: 31, s: '训练中心', size: 16, anchor: 'middle', weight: 700 });
        closeBtn(p, { cx: 730, cy: 24, r: 13 });

        // 关卡列表
        p.box({ x: 40, y: 54, w: 335, h: 365, cls: 'sub' });
        p.text({ x: 52, y: 76, s: '关卡列表', size: 11, weight: 600 });
        const levels = [['林民的警示', '7', true], ['潜入试验室', '14', false], ['角斗死域', '16', false]];
        levels.forEach(([n, lv, sel], i) => {
          const y = 96 + i * 40;
          p.box({ x: 52, y, w: 311, h: 36, cls: sel ? 'subfill' : 'sub' });
          p.text({ x: 62, y: y + 23, s: n, size: 11 });
          p.text({ x: 196, y: y + 23, s: '关卡平均等级', size: 9 });
          p.text({ x: 268, y: y + 23, s: lv, size: 11 });
          if (!sel) p.circle({ cx: 350, cy: y + 18, r: 8, cls: 'sub' });
        });

        // 关卡详情
        p.box({ x: 400, y: 54, w: 336, h: 365, cls: 'sub' });
        p.box({ x: 406, y: 60, w: 324, h: 150, cls: 'sub' });
        p.text({ cx: 568, y: 140, s: '关卡场景预览', size: 10, anchor: 'middle' });

        p.text({ x: 406, y: 234, s: '古老的齿轮载着前文明的旧日，却恐古老的暴行不容宽恕。', size: 9 });

        p.text({ x: 406, y: 272, s: '胜利条件', size: 10, weight: 600 });
        p.text({ x: 570, y: 272, s: '失败条件', size: 10, weight: 600 });
        p.text({ x: 406, y: 290, s: '保护古代装置机关 5 回合内', size: 9 });
        p.text({ x: 406, y: 306, s: '不被打破坏', size: 9 });
        p.text({ x: 570, y: 290, s: '小队全体阵亡或装置被', size: 9 });
        p.text({ x: 570, y: 306, s: '破坏', size: 9 });

        p.text({ x: 406, y: 340, s: '挑战奖励', size: 10, weight: 600 });
        for (let i = 0; i < 3; i++) p.box({ x: 406 + i * 56, y: 348, w: 48, h: 48, cls: 'sub' });
        p.text({ x: 470, y: 410, s: '240', size: 10 });

        // 进入战斗
        p.box({ cx: 'center', y: 437, w: 160, h: 34, cls: 'subfill' });
        p.text({ cx: 'center', y: 459, s: '进入战斗', size: 12, anchor: 'middle' });
      },
    },
  ],
};
