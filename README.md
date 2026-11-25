# AgentSkill

Agent 可复用的技能集合。每个技能一个独立目录，目录名即技能名，复制到工作区的 `.workbuddy/skills/` 下即可使用。

## 目录约定

```
<skill-name>/
├── SKILL.md          技能入口：frontmatter（name / description）+ 完整使用说明
├── kit/              脚本引擎（可选）
├── pages/            示例或产出页面（可选）
├── references/       参考资料（可选）
└── templates/        模板（可选）
```

规则：

- 根目录只放技能目录和本 README，不把技能文件散落在根上。
- 一个技能的全部依赖都在它自己的目录内，不跨目录引用。
- 目录名与 `SKILL.md` frontmatter 里的 `name` 保持一致。

## 技能清单

| 技能 | 用途 | 依赖 |
|---|---|---|
| [ui-wireframe](./ui-wireframe) | 用锚点画游戏 UI 线框图：输入界面截图或文字需求，产出 HTML（矢量）+ PNG（预览），坐标由引擎推导、导出前自动校验越界/重叠/底边不齐 | Node.js（仅标准库，无第三方包） |

## 安装

把技能目录整体放进工作区的技能目录：

```powershell
# Windows
Copy-Item -Recurse .\ui-wireframe "F:\path\to\workspace\.workbuddy\skills\"
```

```bash
# macOS / Linux
cp -r ./ui-wireframe /path/to/workspace/.workbuddy/skills/
```

支持 `git submodule` 或直接引用的宿主，可只取单个技能目录：

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/HSHSir/AgentSkill.git
cd AgentSkill && git sparse-checkout set ui-wireframe
```

## ui-wireframe 快速上手

```bash
# 1. 从模板生成页面骨架
node .workbuddy/skills/ui-wireframe/kit/new.mjs <name> <标题>

# 2. 只写区域框，先跑一次确认分区
node .workbuddy/skills/ui-wireframe/kit/build.mjs .workbuddy/skills/ui-wireframe/pages/<name>.mjs

# 3. 往区域里填内容，再 build 一次
node .workbuddy/skills/ui-wireframe/kit/build.mjs .workbuddy/skills/ui-wireframe/pages/<name>.mjs
```

产出为同名 HTML 与 PNG。只重建设计索引不重构页面：`node kit/index.mjs Docs/UI`；不生成索引：`build.mjs <page> --no-index`。

四条核心约束：布局只写锚点不写像素；先定区域再填内容；能复用组件就不要重画；build 内置校验（越界 / 重叠 / 底边不齐）通过后再交付。

详细规则、模式库与错误排查见 [SKILL.md](./ui-wireframe/SKILL.md)、[references/patterns.md](./ui-wireframe/references/patterns.md)、[references/brief-parsing.md](./ui-wireframe/references/brief-parsing.md)。

## 新增技能

1. 新建 `<skill-name>/` 目录，写入 `SKILL.md`，frontmatter 至少包含 `name` 和 `description`（description 要写清「什么时候该用」）。
2. 把脚本、参考、模板分别放进 `kit/`、`references/`、`templates/`，保证目录自包含。
3. 在上面的技能清单表格里加一行。
4. 提交时一个技能一个目录，不与其它技能的文件混在同一次改动里。
