---
name: ui-wireframe
description: 用锚点画游戏 UI 线框图（布局图）。两种输入都支持：① 用户发界面截图说"画线框图 / 照这个画布局"；② 用户给需求说明（文字 / TAPD 需求）说"按需求画线框图"。产出 HTML（矢量主件）+ PNG（预览），不再手写散落的 SVG 坐标。
---

# UI 线框图（锚点驱动）

## 这个技能解决什么

以前每张图都手写 SVG 坐标，导致两个反复出现的问题：

1. **对齐靠肉眼** —— 页码跑到画布中轴而不是父容器中轴、三个区域底边差 12px，只能导出→看→改。
2. **重复结构重复写** —— 顶部标签栏、底部伙伴栏每张图重写一遍。

现在改成：**布局只用锚点表达，坐标由引擎推导，导出前自动校验**。

---

## 两种输入，两条路径

| 输入 | 判断特征 | 走哪条 |
|---|---|---|
| **界面截图** | 有图，控件肉眼可见 | 目测分区 → 在 `references/patterns.md` 找最接近的骨架 → 填内容。13 张实图验证过 |
| **需求说明** | 只有文字 / 需求文档 / TAPD 链接 | `references/brief-parsing.md` 七步法：抽五要素 → 选模式 → 需求名词落区域 → 列内容清单 → 状态语法 → 不编造 → 交付说明推导链路 |

两条路径共用同一套 kit、同一套锚点语法、同一个交付格式，区别只在"布局信息从哪来"：
截图是**照着还原**，需求是**从文字推出来**。需求推出来的图，每个区域都要能指回需求里的一句话。

---

## 四条铁律

| 铁律 | 含义 |
|---|---|
| **锚点，不像素** | 区域挂轴线（L/R/C/T/B）或别的区域边；子块挂父容器边或中心。永远不写"从截图量到 x=460" |
| **先区域，后内容** | 第一步只定区域框，跑一次确认分区对了；第二步再往区域里填子块 |
| **能复用就复用** | 顶部栏、底栏、属性面板、网格、圆按钮组都有现成组件，不要重画 |
| **先校验，再交付** | `build.mjs` 内置校验：越界、重叠、底边不齐都会报，不要靠看图找错 |

## 线框图只交付两层

1. **布局层**：界面分几个区域、各在哪、谁大谁小、谁挨着谁。
2. **内容层**：每个区域里有什么块、放什么文案/数值。

不画：场景内 UI、图标细节、装饰线、光效、操作提示文案（"拖动至槽位"这类）、立绘。

---

## 快速开始

### 1. 复制模板

```
copy .workbuddy\skills\ui-wireframe\templates\page-template.mjs ^
     .workbuddy\skills\ui-wireframe\pages\<name>.mjs
```

### 2. 只写区域，先跑一次

```js
regions: [
  { id: 'A', label: '顶部栏', color: '#5bb8d8',
    box: { left: 'L', right: 'R', top: 'T', height: 64 }, draw() {} },
  { id: 'B', label: '主面板', color: '#e8952f',
    box: { left: 'L', width: 438, top: 'A.bottom', bottom: 'E.top-10' }, draw() {} },
  ...
]
```

### 3. 构建

```powershell
cd F:\XM\trunk\NewXuanMen
node .workbuddy\skills\ui-wireframe\kit\build.mjs .workbuddy\skills\ui-wireframe\pages\<name>.mjs
```

输出：`Docs\UI\<file>.html` + `Docs\UI\<file>.png`，终端打印每个区域的解析后坐标 + 校验结果。

### 4. 填内容，再构建一次

在 `draw(p, geo)` 里用组件画子块。坐标**相对区域左上角**（`p` 已做偏移），`cx: 'center'` 表示父容器水平居中。

```js
draw(p) {
  p.box({ x: 10, y: 12, w: 120, h: 24 });          // 距区域左上
  p.text({ cx: 'center', y: 40, s: '标题', anchor: 'middle' });
}
```

---

## 锚点语法

### 全局轴线（页面级 `axes`）

| 锚 | 默认 | 含义 |
|---|---|---|
| `L` / `R` | 8 / 画布宽−8 | 左缘 / 右缘 |
| `C` | (L+R)/2 | 画布中轴 |
| `T` / `B` | 8 / 画布高−8 | 顶边 / 底边 |

### 区域边引用

`A.bottom`、`B.right`、`C.left`、`D.top`，还支持 `A.cx`、`A.cy`、`A.w`、`A.h`。

### 表达式

任何字符串都能算：

```
'A.bottom'        // A 的下边
'A.bottom+8'      // 再往下 8
'E.top-10'        // E 的上边往上 10
'C-140'           // 中轴左移 140
'B.right+14'      // B 右侧 14
```

区域可以引用**后面**声明的区域，引擎会多轮解析直到收敛（检测循环依赖并报错）。

### 区域 box 的合法组合

| 方向 | 组合 |
|---|---|
| 水平 | `left + right` ／ `left + width` ／ `centerX + width` ／ `right + width` |
| 垂直 | `top + bottom` ／ `top + height` ／ `centerY + height` ／ `bottom + height` |

### 子块坐标

相对父区域左上角。`cx: 'center'` / `cy: 'center'` 表示父容器中心 —— **父容器中心 ≠ 画布中心，这一步最容易错**。

---

## 组件清单

`import { ... } from '../kit/core.mjs'`

| 组件 | 用途 | 关键参数 |
|---|---|---|
| `tabs` | 页签组 | `x y w h gap labels active` |
| `keycap` | 键帽（Q/E） | `x y s w h` |
| `currency` | 货币组（圆+数值，右对齐等距） | `right y items pitch` |
| `closeBtn` | 关闭圆 | `cx cy r` |
| `grid` | 网格 | `x y cols rows cw ch gx gy fill` |
| `statList` | 属性行（左标签右数值） | `x y w rows rowH` |
| `roundGroup` | 圆按钮组（圆+标签+角标） | `x y dir count r gap labels badge` |
| `cardRow` | 角色/伙伴卡 | `x y w h count gap labels` |
| `slotRow` | **等宽铺满一行**（给宽度和数量，自动算格宽） | `x y w count h gap keys labels icons fillFirst` |
| `charStatPanel` | **角色属性面板**（护盾/生命/四属性/五行/更多属性） | `x y w h shield hp attrs rows more` |
| `pinCard` | **场景内浮层卡**（框外小字部位名 + 图标 + 名称） | `x y w h tag name icon` |

原语：`p.box` `p.circle` `p.line` `p.text` `p.raw`。`p.raw` 的坐标也是相对区域的。

**优先用 `slotRow` 排任何一排等宽格**（技能槽、伙伴位、背包格）。手写 `x + i * pitch` 是上一轮返工的头号来源：算错 pitch 就会一边挤一边空。

---

## 校验规则

`build.mjs` 自动跑，输出 `✗错误` / `⚠提示`：

| 级别 | 规则 |
|---|---|
| 错误 | 区域越出画布 |
| 错误 | 两个区域重叠 |
| 错误 | 子块越出所属区域 |
| 提示 | 同排区域底边不一致 |
| 提示 | 各区域"内容底边距框底"不一致 |
| 提示 | 区域内有 >40% 高度的竖向空白（漏画 / 没铺满） |
| 提示 | 同一 y 上多个矩形高度不一致（同组控件尺寸要统一） |

处理原则：**错误必须改；提示看一眼，若是有意为之（如底部栏矮）就忽略**。

---

## 一轮出图的节奏（本轮复盘得出）

实测：一张中等复杂度界面（5 区域）要 build 4–8 次，其中一半是本可避免的返工。

| 返工原因 | 现在的对策 |
|---|---|
| 排一排格子手算 pitch，不是挤就是空 | `slotRow` 自动铺满 |
| 属性面板三页各写一遍，改一处漏两处 | `charStatPanel` 一个组件 |
| 区域下部大片空白，看图才发现 | 校验器报"竖向空白 >40%" |
| 同组控件尺寸不齐 | 校验器报"同 y 矩形高度不一致" |
| 批量改历史页要临时写脚本，参数还容易错 | `kit/restyle.mjs` 固化 |

**目标节奏：区域定完 build 1 次 → 填内容 build 1 次 → 看图只改视觉，不再结构性返工。**

`build.mjs` 会直接打印可粘贴的 Markdown 区域表，回复时不用手写。

---

## 画布尺寸

画布高度 = 截图高度 − 标题栏高度。**标题栏必须目测确认，不能套用**：同一游戏不同窗口状态出现过 20 / 29 / 31。

宽度固定 1290（客户区宽度），坐标 = 截图 y − 标题栏高度。

**需求出图没有截图可量**，直接用 **1290×734**（游戏默认客户区），区域按 `references/patterns.md` 里该模式的相对比例分配；不要为了"看起来丰满"把边距改大，1290 宽的画布上左右缘永远是 8 和 1282。

---

## 交付格式

每次画完必须给三样：

1. 总入口：`file:///F:/XM/trunk/NewXuanMen/Docs/UI/index.html`
2. 本次成品：HTML（矢量主件）+ PNG（预览）两条链接
3. 位置：`F:\XM\trunk\NewXuanMen\Docs\UI`

**索引页不再手工登记**：`build.mjs` 每次构建完自动重扫 `Docs/UI` 并重写 `index.html`。

- 页面标题取自 `<title>`，区域列表取自构建时注入的 `<meta name="wireframe">`
- 卡片按文件修改时间倒序，最新一张自动标「最新」
- 只想刷索引不重建图：`node kit/index.mjs Docs/UI`
- 不想刷索引：`node kit/build.mjs <page> --no-index`

---

## 目录

```
.workbuddy/skills/ui-wireframe/
├── SKILL.md                 本文件
├── references/
│   ├── patterns.md          7 种界面骨架 + 区域锚点写法（先在这里找模式）
│   └── brief-parsing.md     需求说明 → 线框图的七步法
├── kit/
│   ├── core.mjs             锚点解析 + 原语 + 复合组件
│   ├── render.mjs           HTML 渲染 + 布局校验
│   ├── build.mjs            CLI：渲染 → 校验 → 导出 PNG
│   ├── index.mjs            扫描目录 → 生成交付索引页
│   ├── new.mjs              一条命令生成五区可跑骨架
│   └── restyle.mjs          历史页面统一外框（一次性工具）
├── pages/                   每张界面的页面定义（可复用/回改）
│   ├── talent.mjs           模式 1（左面板+主区+右栏+底栏）
│   ├── skill.mjs            模式 1
│   ├── mecha.mjs            模式 1+场景（pinCard）
│   ├── module.mjs           模式 2（三栏通高）
│   ├── promotion.mjs        模式 2 + 底栏
│   ├── partner.mjs          模式 3（左列表+中详情+右信息+底操作）
│   └── training.mjs         模式 4（单弹窗）
└── templates/
    └── page-template.mjs    新页面骨架
```

## 常见错误

| 症状 | 原因 | 处理 |
|---|---|---|
| 控件偏左 | 用了画布中轴 `C`，实际应在父容器中心 | 改 `cx: 'center'` |
| 区域报"无法解析" | 锚点循环依赖，或引用了不存在的边 | 检查 `id` 拼写 |
| 子块报越界 | 子块高度加间距超出区域 | 缩小子块或加高区域 |
| 底边不齐 | 各区域内容末端没统一 | 统一"内容底边 = 框底 − 12" |
| PNG 空白 | 页面有入场动画，截图不等 | 本技能不注入动画，若手工加过要删 |
| 改完图没变化 | 用 PowerShell 跨行替换 LF 文件，静默失败 | 多行改动一律用 edit / apply_patch |
| 子块越界 | 内容清单没列全就先写代码，边写边加 | 先把每区域清单列出来，再写 |
| 需求出图补了没要求的控件 | 把"一般都会有"当成需求 | 补的必须单列一行说明 |

## 时间预算（目标 ≤ 120s）

3:31 那次的实测拆解：写页面定义 70s、build×4 往返 55s、看图×2 10s、回复长表格 25s、分区思考 50s。
返工的 2 次 build 全部来自「没想清就先画」和「裸写 B 撞轴」。

| 阶段 | 上限 | 硬做法 |
|---|---|---|
| 看截图分区 | 25s | 只数区域数量与大致比例，**不量像素、不裁图** |
| 生成骨架 | 5s | `node kit/new.mjs <name> <标题>`，不要从空白文件写 |
| 填内容 | 45s | **一次填满**：槽位数量、列表行数、空位数在写之前就定死 |
| build | 8s | 只 build 一次；`new.mjs` 的骨架锚点已保证不撞轴 |
| 看图确认 | 8s | 只看三件事：框是否越界、内容是否铺满、同排底边是否齐 |
| 交付回复 | 15s | 用下面的固定模板，正文 ≤ 200 字 |

### 交付回复模板

```
![<标题>](F:\XM\trunk\NewXuanMen\Docs\UI\<file>.png)

一句话说明这版的判断（例如"六区，左列表 + 中详情 + 右事件 + 底礼物"）。

- 区域：A 顶栏 / B 左列表 / C 详情 / D 事件 / E 礼物
- [HTML](file:///F:/XM/trunk/NewXuanMen/Docs/UI/<file>.html) · [PNG](file:///F:/XM/trunk/NewXuanMen/Docs/UI/<file>.png)
- [索引](file:///F:/XM/trunk/NewXuanMen/Docs/UI/index.html)
```

不要再贴完整区域坐标表——build 的输出里已经有了，用户看图就够。

### 改页面文件：只用 edit 工具

`page .mjs` 是 LF 换行。用 PowerShell `Get-Content -Raw` + `-replace "a`r`nb"` 跨行替换会**静默不匹配**，改动看不见、build 出来还是老样子，白跑两三轮。多行改动一律用 edit / apply_patch，单行简单替换才可以考虑脚本。
