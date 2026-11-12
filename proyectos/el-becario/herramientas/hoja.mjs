// Hoja de fotogramas para QA barato: un fotograma por plano (en el punto `--at` del plano, 0..1) en una sola imagen.
// Uso (desde la carpeta del expediente): node ../herramientas/hoja.mjs project.json [salida.png] [--at 0.6] [--cols 8] [--w 180] [--from A --to B]
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/scripts/', import.meta.url).pathname);
const {painter} = await import(R0 + 'autopilot-render.mjs');
const {createRequire} = await import('node:module');
const {createCanvas} = createRequire(R0 + 'autopilot-render.mjs')('@napi-rs/canvas');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? Number(args[i + 1]) : d; };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--')));
const p = JSON.parse(fs.readFileSync(pos[0] || 'project.json', 'utf8')), out = pos[1] || 'hoja.png';
const at = opt('at', 0.6), cols = opt('cols', 8), w = opt('w', 180), from = opt('from', 0), to = opt('to', 1e9);
const shots = p.shots.filter(s => s.end > from && s.start < to);
const draw = await painter({...p, base: process.cwd()});
const h = Math.round(w * p.height / p.width), rows = Math.ceil(shots.length / cols), lab = 18;
const sheet = createCanvas(cols * w, rows * (h + lab)), ctx = sheet.getContext('2d');
ctx.fillStyle = '#222'; ctx.fillRect(0, 0, sheet.width, sheet.height);
shots.forEach((s, i) => {
  const t = s.start + (s.end - s.start) * at, x = (i % cols) * w, y = Math.floor(i / cols) * (h + lab);
  ctx.drawImage(draw(t), x, y, w, h);
  ctx.fillStyle = '#fff'; ctx.font = '13px sans-serif'; ctx.fillText(`${i} · ${t.toFixed(2)}s`, x + 4, y + h + 14);
});
fs.writeFileSync(out, sheet.toBuffer('image/png'));
console.log(out, shots.length, 'planos');
