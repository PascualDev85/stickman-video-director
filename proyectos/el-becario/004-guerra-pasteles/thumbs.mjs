// Portadas TikTok/IG del EXP 004 (2 opciones). Copiado de 003/thumbs.mjs.
// arte con el rig (coordenadas de mundo 1280 de ancho) + texto/flechas pintados encima (píxeles 1080×1920).
// Texto dentro de la franja 3:4 (y 240–1680 px) para que no se corte en la cuadrícula del perfil.
// Uso: node thumbs.mjs  → thumbs/exp003-*.png
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/', import.meta.url).pathname);
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
const {becario, santaAnna, ctext, G, R, S, E, P, deg, PAPER, INK} = await import('../kit.mjs');
const H = 1280 * 1920 / 1080, K = 1080 / 1280, RED = '#e0261b', YEL = '#ffd21f', FONT = 'KitSans';
fs.mkdirSync('thumbs', {recursive: true});

const full = c => ({type: 'rect', x: -60, y: -60, w: 1400, h: H + 120, radius: 0, fill: c, stroke: 'none'});
const rays = (c1, c2, cx, cy, n = 16) => [full(c1), G(Array.from({length: n}, (_, i) => { const a = i * 360 / n, w = 180 / n * 0.55;
  return S([['M', 0, 0], ['L', Math.cos(deg(a - w)) * 2800, Math.sin(deg(a - w)) * 2800], ['L', Math.cos(deg(a + w)) * 2800, Math.sin(deg(a + w)) * 2800], ['Z']], c2, {stroke: 'none'}); }), {x: cx, y: cy})];
const ground = (y, c = '#d9b25c', c2 = '#c49a45') => [E(640, y + 260, 2200, 700, {fill: c, stroke: 'none'}), ...Array.from({length: 14}, (_, i) => P([['M', 60 + i * 90, y + 60 + (i % 3) * 40], ['L', 70 + i * 90, y + 20 + (i % 3) * 40]], {stroke: c2, lineWidth: 8}))];
const medal = (x, y, s = 1) => G([S([['M', -26, -70], ['L', 26, -70], ['L', 14, 0], ['L', -14, 0], ['Z']], '#2b4a7a', {lineWidth: 6}), E(0, 22, 64, 64, {fill: '#e9c46a', lineWidth: 7}), ctext('★', 0, 2, 34, {maxW: 40, color: '#a8743f'})], {x, y, scaleX: s, scaleY: s});
const spark = (x, y, s = 1) => S([['M', 0, -40], ['L', 10, -10], ['L', 40, 0], ['L', 10, 10], ['L', 0, 40], ['L', -10, 10], ['L', -40, 0], ['L', -10, -10], ['Z']], YEL, {lineWidth: 5, x, y, scaleX: s, scaleY: s});
const sweat = (x, y) => [0, 1].map(i => E(x + i * 46, y + i * 30, 22, 34, {fill: '#9fd7ff', lineWidth: 5}));

async function render(name, layers, overlay) {
  const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
  const art = draw(0.1), c = createCanvas(1080, 1920), ctx = c.getContext('2d');
  ctx.drawImage(art, 0, 0); overlay(ctx);
  fs.writeFileSync(`thumbs/${name}.png`, c.toBuffer('image/png'));
}
function txt(ctx, s, cx, cy, size, {fill = '#fff', stroke = INK, lw = 0.16, maxW = 1000, angle = 0, shadow = true} = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle));
  let z = size; const font = v => `700 ${v}px ${FONT}`;
  ctx.font = font(z); while (ctx.measureText(s).width > maxW && z > 20) { z -= 4; ctx.font = font(z); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (shadow) { ctx.fillStyle = ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = z * lw; ctx.strokeText(s, 10, 14); ctx.fillText(s, 10, 14); }
  ctx.lineWidth = z * lw; ctx.strokeStyle = stroke; ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0);
  ctx.restore();
}
function bar(ctx, cx, cy, w, h, color, angle = 0) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle)); ctx.fillStyle = INK; ctx.fillRect(-w / 2 + 10, -h / 2 + 12, w, h); ctx.fillStyle = color; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore(); }
function arrow(ctx, x0, y0, x1, y1) {
  const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, -22); ctx.quadraticCurveTo(L * 0.5, -40, L - 90, -26); ctx.lineTo(L - 100, -70); ctx.lineTo(L, 0);
  ctx.lineTo(L - 100, 70); ctx.lineTo(L - 90, 26); ctx.quadraticCurveTo(L * 0.5, 10, 0, 22); ctx.closePath(); ctx.lineWidth = 22; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
}
function vignette(ctx, strength = 0.4) { const g = ctx.createRadialGradient(540, 980, 420, 540, 980, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(40,10,0,${strength})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }

// A — AMETRALLADORAS CONTRA PÁJAROS: emú gigante impasible, soldado diminuto con la Lewis echando chispas.
const Pr = await import('./props.mjs');
// A — ENTERRÓ SU PIERNA: Santa Anna grande (pelo + bicornio) con muleta, ataúd con la bota asomando.
await render('exp004-a-enterro', [...rays('#f6d27a', '#fbe3a0', 640, 1100, 16), ...ground(1640, '#c9a26a', '#a8824a'),
  Pr.ataud({x: 380, y: 1640, scaleX: 1.15, scaleY: 1.15}),
  santaAnna({x: 970, y: 1700, scale: 1.4, expr: 'agobiado', look: -1, peg: 'R'}), Pr.muleta({x: 1115, y: 1060, scaleX: 1.45, scaleY: 1.45}),
  ...sweat(840, 840)], ctx => {
  vignette(ctx, 0.35);
  bar(ctx, 300, 330, 470, 86, RED, -3); txt(ctx, 'HISTORIA REAL · 1838', 300, 330, 46, {shadow: false, lw: 0.1});
  txt(ctx, 'ENTERRÓ', 330, 470, 150, {maxW: 560, angle: -4}); txt(ctx, 'SU PIERNA', 340, 620, 140, {fill: YEL, maxW: 580, angle: -4});
  arrow(ctx, 300, 760, 300, 1150);
});
// B — 2 FUNERALES. 1 PIERNA: la pierna en el cojín de terciopelo con foco y corona.
await render('exp004-b-funerales', [...rays('#6b4f8a', '#8a6fb0', 640, 1250, 14), E(640, 1300, 1100, 1100, {fill: 'rgba(255,240,200,0.35)', stroke: 'none'}),
  G([Pr.cojin()], {x: 640, y: 1500, scaleX: 1.7, scaleY: 1.7}), Pr.corona({x: 640, y: 880, scaleX: 0.8, scaleY: 0.8})], ctx => {
  txt(ctx, '2 FUNERALES', 540, 380, 150, {maxW: 900, angle: -3}); txt(ctx, '1 PIERNA', 540, 540, 170, {fill: YEL, maxW: 900, angle: -3});
});
console.log('ok');
