// Channel branding for Historias Sin Cabeza: profile picture (800x800) and banner (2560x1440, safe area 1546x423).
import fs from 'node:fs';
const R0 = '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/';
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {GlobalFonts, createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'ThumbBlack');
const {becario, lustig, mike, eiffel, caseFolder, G, R, S, E, P, deg, PAPER, INK} = await import('./kit.mjs');
const RED = '#e0261b', YEL = '#ffd21f';
async function art(w, h, layers) { const draw = await painter({style: 'B3', width: w, height: h, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]}); return draw(0.1); }
function txt(ctx, s, cx, cy, size, {fill = '#fff', stroke = INK, lw = 0.16, maxW = 1000, angle = 0} = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle)); let z = size; ctx.font = `${z}px ThumbBlack`;
  while (ctx.measureText(s).width > maxW && z > 10) { z -= 2; ctx.font = `${z}px ThumbBlack`; }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = z * lw; ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.strokeText(s, z * 0.05, z * 0.07); ctx.fillText(s, z * 0.05, z * 0.07);
  ctx.strokeStyle = stroke; ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0); ctx.restore();
}
const rays = (cx, cy, c, n = 18, r = 2600) => G(Array.from({length: n}, (_, i) => { const a = i * 360 / n, w = 180 / n * 0.5;
  return S([['M', 0, 0], ['L', Math.cos(deg(a - w)) * r, Math.sin(deg(a - w)) * r], ['L', Math.cos(deg(a + w)) * r, Math.sin(deg(a + w)) * r], ['Z']], c, {stroke: 'none'}); }), {x: cx, y: cy});
// ---- profile picture: the Becario's face on yellow rays (reads at 98 px) ----
{
  const W = 800, layers = [{type: 'rect', x: -60, y: -60, w: 1400, h: 1400, radius: 0, fill: YEL, stroke: 'none'}, rays(640, 640, '#ffe36b'),
    becario({x: 640, y: 640 + 592 * 2.75 + 40, scale: 2.75, expr: 'sarcastico', look: 0})];
  const a = await art(W, W, layers), c = createCanvas(W, W), ctx = c.getContext('2d'); ctx.drawImage(a, 0, 0);
  fs.writeFileSync('perfil-800.png', c.toBuffer('image/png'));
  // preview as YouTube shows it (circle, small)
  const p = createCanvas(240, 120), q = p.getContext('2d'); q.fillStyle = '#fff'; q.fillRect(0, 0, 240, 120);
  for (const [x, s] of [[60, 98], [180, 40]]) { q.save(); q.beginPath(); q.arc(x, 60, s / 2, 0, Math.PI * 2); q.clip(); q.drawImage(c, x - s / 2, 60 - s / 2, s, s); q.restore(); }
  fs.writeFileSync('perfil-preview.png', p.toBuffer('image/png'));
}
// ---- banner 2560x1440; safe area (all devices) 1546x423 centred ----
{
  const W = 2560, H = 1440, k = 1280 / W; // plane units per px
  const layers = [{type: 'rect', x: -60, y: -60, w: 1400, h: 900, radius: 0, fill: '#3b2f2a', stroke: 'none'},
    ...Array.from({length: 4}, (_, r) => Array.from({length: 9}, (_, i) => G([R(-60, -40, 120, 80, {radius: 6, fill: ['#e7c27a', '#d9a86c', '#c8955a'][(i + r) % 3], lineWidth: 5}), R(-24, -20, 48, 16, {radius: 3, fill: PAPER, lineWidth: 3})], {x: 70 + i * 145 + (r % 2) * 40, y: 80 + r * 190, angle: deg(((i * 7 + r * 3) % 9) - 4)}))).flat(),
    {type: 'rect', x: 230, y: 240, w: 820, h: 240, radius: 30, fill: YEL, stroke: INK, lineWidth: 8},
    becario({x: 150, y: 860, scale: 0.85, expr: 'sarcastico', look: 1}),
    G([eiffel({x: 0, y: 0, scale: 0.32})], {x: 1170, y: 640}), lustig({x: 1090, y: 860, scale: 0.6, expr: 'picaro', look: -1})];
  const a = await art(W, H, layers), c = createCanvas(W, H), ctx = c.getContext('2d'); ctx.drawImage(a, 0, 0);
  txt(ctx, 'HISTORIAS SIN CABEZA', W / 2, 640, 150, {fill: '#fff', maxW: 1480});
  txt(ctx, 'Historias reales que no tienen ni pies ni cabeza', W / 2, 800, 58, {fill: INK, stroke: YEL, lw: 0.02, maxW: 1460});
  fs.writeFileSync('banner-2560x1440.png', c.toBuffer('image/png'));
  // overlay of the safe areas for checking
  const o = createCanvas(W, H), oc = o.getContext('2d'); oc.drawImage(c, 0, 0); oc.lineWidth = 8; oc.strokeStyle = '#00ff88'; oc.strokeRect((W - 1546) / 2, (H - 423) / 2, 1546, 423); oc.strokeStyle = '#ff00ff'; oc.strokeRect(0, (H - 423) / 2, W, 423);
  fs.writeFileSync('banner-check.png', o.toBuffer('image/png'));
}
console.log('ok');
