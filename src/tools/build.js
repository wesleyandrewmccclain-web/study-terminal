/* Bundle the Study Terminal into a fast build: one minified JS + one minified CSS.
   Usage: node build.js <srcDir> <outDir> <cacheName> */
const fs = require('fs'), path = require('path'), esbuild = require('esbuild');
const [src, out, cacheName] = process.argv.slice(2);
if (!src || !out || !cacheName) throw Error('usage: build.js src out cacheName');
const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m => m[1]);
const js = [...html.matchAll(/<script defer src="([^"]+)"><\/script>/g)].map(m => m[1]);
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
// JS: each file stays its own IIFE/scope; join in index.html order.
const jsSrc = js.map(f => `/* ${f} */\n` + fs.readFileSync(path.join(src, f), 'utf8')).join(';\n');
const jsMin = esbuild.transformSync(jsSrc, { minify: true, target: 'es2020', legalComments: 'none' }).code;
const cssSrc = css.map(f => fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
const cssMin = esbuild.transformSync(cssSrc, { loader: 'css', minify: true, legalComments: 'none' }).code;
const h = s => require('crypto').createHash('sha1').update(s).digest('hex').slice(0, 8);
const jsName = `app.${h(jsMin)}.min.js`, cssName = `app.${h(cssMin)}.min.css`;
fs.writeFileSync(path.join(out, jsName), jsMin); fs.writeFileSync(path.join(out, cssName), cssMin);
let outHtml = html.replace(/(\s*<link rel="stylesheet" href="[^"]+">)+/, `\n  <link rel="stylesheet" href="${cssName}">`);
outHtml = outHtml.replace(/\n?\s*<script defer src="[^"]+"><\/script>/g, '');
outHtml = outHtml.replace('</head>', `  <script defer src="${jsName}"></script>\n</head>`);
fs.writeFileSync(path.join(out, 'index.html'), outHtml);
// Static files the app still needs at runtime.
for (const f of ['manifest.webmanifest']) fs.copyFileSync(path.join(src, f), path.join(out, f));
fs.cpSync(path.join(src, 'assets'), path.join(out, 'assets'), { recursive: true, filter: p => !p.endsWith('.DS_Store') });
fs.mkdirSync(path.join(out, 'vendor'), { recursive: true });
for (const f of fs.readdirSync(path.join(src, 'vendor'))) fs.copyFileSync(path.join(src, 'vendor', f), path.join(out, 'vendor', f));
// Service worker: precache only what the app shell needs (no big legacy images / music).
const big = /screen-loading|bg-title|bg-tile|panel-frame|ui-cursor|quiet-relay/;
const assets = fs.readdirSync(path.join(src, 'assets')).filter(f => /\.(png|svg)$/.test(f) && !big.test(f)).map(f => './assets/' + f);
const FILES = ['./', './index.html', './' + jsName, './' + cssName, './manifest.webmanifest', './vendor/jsQR.js', ...assets];
let sw = fs.readFileSync(path.join(src, 'sw.js'), 'utf8')
  .replace(/const CACHE='[^']+';/, `const CACHE='${cacheName}';`)
  .replace(/const FILES=\[[^\]]*\];/, `const FILES=${JSON.stringify(FILES)};`);
fs.writeFileSync(path.join(out, 'sw.js'), sw);
const kb = n => (n / 1024).toFixed(0) + 'KB';
console.log(`JS ${js.length} files ${kb(jsSrc.length)} -> ${jsName} ${kb(jsMin.length)}; CSS ${css.length} files ${kb(cssSrc.length)} -> ${cssName} ${kb(cssMin.length)}; precache ${FILES.length} files`);
