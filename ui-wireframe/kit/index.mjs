#!/usr/bin/env node
// 自动生成 Docs/UI/index.html：扫描目录、读每页的 <meta name="wireframe">、按修改时间排序
// 用法: node kit/index.mjs [Docs/UI]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function regionText(labels) {
  const n = labels.length;
  const num = CN[n] || String(n);
  return `${num}区：${labels.join(' / ')}`;
}

function cleanTitle(t, file) {
  return (t || file.replace(/\.html$/, ''))
    .replace(/\s*[·・]\s*UI\s*线框图\s*$/, '')
    .replace(/\s*[·・]\s*线框图\s*$/, '')
    .replace(/\s*线框图\s*$/, '')
    .trim();
}

export function scan(dir) {
  const files = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.html') && f !== 'index.html');

  return files
    .map(f => {
      const p = path.join(dir, f);
      const s = fs.readFileSync(p, 'utf8');
      const st = fs.statSync(p);

      const titleRaw = (s.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const metaRaw = (s.match(/<meta name="wireframe" content='(.*?)'>/) || [])[1];
      let meta = null;
      if (metaRaw) {
        try { meta = JSON.parse(metaRaw.replace(/&#39;/g, "'")); } catch { meta = null; }
      }

      const svg = s.match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/);
      const w = meta?.w ?? (svg ? Number(svg[1]) : null);
      const h = meta?.h ?? (svg ? Number(svg[2]) : null);

      const png = f.replace(/\.html$/, '.png');
      return {
        file: f,
        png,
        hasPng: fs.existsSync(path.join(dir, png)),
        title: cleanTitle(titleRaw, f),
        regions: meta?.r || null,
        w, h,
        mtime: st.mtimeMs,
      };
    })
    .sort((a, b) => b.mtime - a.mtime);
}

export function renderIndex(dir, items) {
  const cards = items.map((it, i) => {
    const sizeText = it.w && it.h ? `${it.w}×${it.h}` : '尺寸未知';
    const metaText = it.regions
      ? `${sizeText}　·　${regionText(it.regions)}`
      : sizeText;

    const thumb = it.hasPng
      ? `<a class="thumb" href="${it.file}" target="_blank"><img src="${it.png}" alt="${it.title}"></a>`
      : `<div class="thumb empty">无 PNG 预览</div>`;

    const pngLink = it.hasPng
      ? `\n        <a href="${it.png}" target="_blank">查看 PNG</a>`
      : '';

    return `  <div class="card">
    ${thumb}
    <div class="body">
      <div class="title">${it.title}${i === 0 ? ' <span class="tag">最新</span>' : ''}</div>
      <div class="meta">${metaText}</div>
      <div class="links">
        <a href="${it.file}" target="_blank">打开 HTML</a>${pngLink}
      </div>
    </div>
  </div>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>UI 线框图 · 交付索引</title>
<style>
  :root{--bg:#f5f7fa; --card:#fff; --line:#dde3ea; --ink:#1f2733;
        --dim:#7b8794; --accent:#2f81f7;}
  *{box-sizing:border-box}
  body{margin:0; padding:28px 32px 48px; background:var(--bg); color:var(--ink);
       font:14px/1.6 "Microsoft YaHei","PingFang SC",system-ui,sans-serif}
  header{margin-bottom:24px}
  h1{margin:0 0 6px; font-size:20px; font-weight:700; letter-spacing:.3px}
  .sub{color:var(--dim); font-size:13px}
  .sub code{background:#e8edf3; padding:1px 6px; border-radius:4px; font-size:12px}
  .grid{display:grid; gap:20px; grid-template-columns:repeat(auto-fill,minmax(400px,1fr))}
  .card{background:var(--card); border:1px solid var(--line); border-radius:10px;
        overflow:hidden; transition:box-shadow .18s, transform .18s}
  .card:hover{box-shadow:0 6px 20px rgba(31,39,51,.10); transform:translateY(-2px)}
  .thumb{display:flex; align-items:center; justify-content:center; background:#e8edf3;
         border-bottom:1px solid var(--line); height:220px; overflow:hidden}
  .thumb.empty{color:var(--dim); font-size:13px}
  .thumb img{max-width:100%; max-height:100%; object-fit:contain; display:block}
  .body{padding:14px 16px 16px}
  .title{font-size:15px; font-weight:600; margin-bottom:4px; display:flex; align-items:center; gap:8px}
  .tag{font-size:11px; font-weight:500; color:#2b6b46; background:#e4f5ec;
       border-radius:20px; padding:1px 8px}
  .meta{color:var(--dim); font-size:12px; margin-bottom:10px}
  .meta em{color:#a3adb9; font-style:normal}
  .links{display:flex; gap:14px; font-size:13px}
  .links a{color:var(--accent); text-decoration:none; border-bottom:1px solid transparent}
  .links a:hover{border-bottom-color:var(--accent)}
  footer{margin-top:32px; color:var(--dim); font-size:12px; line-height:1.9}
  footer a{color:var(--accent); text-decoration:none}
</style>
</head>
<body>
<header>
  <h1>UI 线框图 · 交付索引</h1>
  <div class="sub">全部产物在 <code>${dir}</code>　·　HTML 为矢量主件，PNG 为 1x 预览</div>
</header>

<div class="grid">

${cards}

</div>

<footer>
  索引由 <code>kit/index.mjs</code> 自动生成，新增页面后跑一次 build 即可，不用手工登记。<br>
  画图规范：<a href="wireframe-spec.md" target="_blank">wireframe-spec.md</a>
</footer>
</body>
</html>
`;
}

// CLI
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const dir = path.resolve(process.argv[2] || 'Docs/UI');
  const items = scan(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), renderIndex(dir, items), 'utf8');
  console.log(`index.html → ${items.length} 张`);
  items.forEach(it => console.log(`  ${it.title.padEnd(18, '　')} ${it.file}`));
}
