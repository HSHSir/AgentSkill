#!/usr/bin/env node
// 把「旧版手写 SVG」的线框图统一成：灰底 + 白画布外框 + 居中，并重导 PNG
// 只用一次（历史页面），新页面走 build.mjs 自带外框。
// 用法: node kit/restyle.mjs [Docs/UI]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const dir = path.resolve(process.argv[2] || 'Docs/UI');
const PAD = 36;

const CSS_NEW = [
  'html,body{margin:0;padding:0;background:#e3e8ee}',
  `  body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:${PAD}px}`,
  '  .frame{background:#fff;border:1px solid #a9b4c0;border-radius:4px;box-shadow:0 14px 36px rgba(31,39,51,.16);overflow:hidden}',
  '  svg{display:block;background:#fff}',
].join('\n');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const f of files) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, 'utf8');

  const sizeMatch = s.match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/);
  if (!sizeMatch) {
    console.log(`跳过 ${f}（无固定画布尺寸，可能是工具页）`);
    continue;
  }
  const w = Number(sizeMatch[1]);
  const h = Number(sizeMatch[2]);

  if (!s.includes('class="frame"')) {
    s = s.replace(/html,body\{[^}]*\}/, CSS_NEW);
    s = s.replace(/<body([^>]*)>\s*/, (m, attrs) => `<body${attrs}>\n<div class="frame">\n`);
    s = s.replace(/<\/body>/, '</div>\n</body>');
    fs.writeFileSync(p, s, 'utf8');
  }

  const png = p.replace(/\.html$/, '.png');
  fs.rmSync(png, { force: true });
  const r = spawnSync(EDGE, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${w + PAD * 2},${h + PAD * 2}`,
    `--screenshot=${png}`,
    pathToFileURL(p).href,
  ], { stdio: 'ignore', timeout: 60000 });

  console.log(`${f}  ${w}×${h}  png=${fs.existsSync(png) ? fs.statSync(png).size + 'B' : '失败'}`);
}
