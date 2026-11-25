#!/usr/bin/env node
// UI 线框图构建器
// 用法: node build.mjs <page.mjs> [--no-png] [--out <dir>]
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

import { renderPage, checkLayout } from './render.mjs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = process.argv.slice(2);
const pagePath = args.find(a => !a.startsWith('--'));
const noPng = args.includes('--no-png');
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : path.resolve('Docs/UI');

if (!pagePath) {
  console.error('用法: node build.mjs <page.mjs> [--no-png] [--out <dir>]');
  process.exit(1);
}

const page = (await import(pathToFileURL(path.resolve(pagePath)).href)).default;
const result = renderPage(page);

// ---- 校验 ----
const { errors, warns } = checkLayout(result, page);
const fileBase = page.file || path.basename(pagePath, '.mjs');
const htmlPath = path.join(outDir, `${fileBase}.html`);
const pngPath = path.join(outDir, `${fileBase}.png`);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(htmlPath, result.html, 'utf8');

console.log(`\n=== ${page.title || fileBase} ===`);
console.log(`画布 ${result.canvas.w}×${result.canvas.h}　区域 ${result.regions.length} 个`);
result.regions.forEach(r => {
  console.log(`  ${r.id} ${r.label.padEnd(8, '　')} x=${r.x} y=${r.y} w=${r.w} h=${r.h}`);
});

// ---- 直接可粘进回复的 Markdown 区域表 ----
const md = ['', '| 区域 | 名称 | 位置 | 尺寸 | 锚点写法 |', '|---|---|---|---|---|'];
result.regions.forEach((r, i) => {
  const b = (page.regions[i] && page.regions[i].box) || {};
  const expr = Object.entries(b).map(([k, v]) => `${k}:${v}`).join(' ');
  md.push(`| ${r.id} | ${r.label} | ${r.x},${r.y} | ${r.w}×${r.h} | \`${expr}\` |`);
});
console.log(md.join('\n'));

if (errors.length) {
  console.log(`\n✗ 错误 ${errors.length} 条`);
  errors.forEach(e => console.log('  - ' + e));
} else {
  console.log('\n✓ 锚点校验通过（无越界、无重叠）');
}
if (warns.length) {
  console.log(`\n⚠ 提示 ${warns.length} 条`);
  warns.forEach(w => console.log('  - ' + w));
}

console.log(`\nHTML → ${htmlPath}`);

if (!noPng) {
  if (!fs.existsSync(EDGE)) {
    console.log('⚠ 未找到 Edge，跳过 PNG 导出');
    process.exit(errors.length ? 1 : 0);
  }
  fs.rmSync(pngPath, { force: true });
  // 画布外留 36px 一圈，让灰底与外框一起入镜
  const pad = 36;
  const r = spawnSync(EDGE, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${result.canvas.w + pad * 2},${result.canvas.h + pad * 2}`,
    `--screenshot=${pngPath}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore', timeout: 60000 });

  if (fs.existsSync(pngPath)) {
    console.log(`PNG  → ${pngPath} (${fs.statSync(pngPath).size} B)`);
  } else {
    console.log('✗ PNG 导出失败');
    process.exitCode = 1;
  }
}

if (errors.length) process.exitCode = 1;

// ---- 自动刷新交付索引（可用 --no-index 关闭）----
if (!args.includes('--no-index')) {
  try {
    const { scan, renderIndex } = await import('./index.mjs');
    const items = scan(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), renderIndex(outDir, items), 'utf8');
    console.log(`索引  → index.html（${items.length} 张，最新：${items[0] ? items[0].title : '—'}）`);
  } catch (e) {
    console.log('⚠ 索引刷新失败: ' + e.message);
  }
}
