// Portadas TikTok/IG del EXP 003 (3 opciones). Mismo método que 001-torre-eiffel/thumbs.mjs:
// arte con el rig (coordenadas de mundo 1280 de ancho) + texto/flechas pintados encima (píxeles 1080×1920).
// Texto dentro de la franja 3:4 (y 240–1680 px) para que no se corte en la cuadrícula del perfil.
// Uso: node thumbs.mjs  → thumbs/exp003-*.png
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/', import.meta.url).pathname);
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
const {becario, mayor, soldado, emu, lewisGun, ctext, G, R, S, E, P, deg, PAPER, INK} = await import('../kit.mjs');
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
{
  const HX = 850, HY = 2330, HS = 2.05;
  await render('exp003-a-ametralladoras', [...rays('#8fcdf0', '#a8daf5', 640, 1300, 16), ...ground(1700),
    soldado(1, {x: 200, y: 1900, scale: 0.62, expr: 'miedo', look: 1, armL: {shoulder: 70, elbow: 40}, armR: {shoulder: 80, elbow: 20}}),
    lewisGun({x: 290, y: 1900, scale: 0.7}), ...sweat(260, 1440),
    ...[[470, 1640, 1.2], [560, 1560, 0.8], [520, 1730, 0.9]].map(([x, y, s]) => spark(x, y, s)),
    emu({x: HX, y: HY, scale: HS, flip: true, eye: 'grande'})], ctx => {
    vignette(ctx, 0.3);
    txt(ctx, 'AMETRALLADORAS', 540, 360, 150, {maxW: 1010});
    bar(ctx, 540, 560, 1000, 180, RED, -2); txt(ctx, 'CONTRA PÁJAROS', 540, 560, 140, {maxW: 930, angle: -2, shadow: false});
    arrow(ctx, 90, 700, 440, 800);
  });
}
// B — GANARON LOS PÁJAROS: el emú con medalla y el mayor hundido; marcador EMÚS 1 – 0 EJÉRCITO.
{
  await render('exp003-b-ganaron', [...rays('#ffc21a', '#ffe16b', 640, 1150, 18), ...ground(1760, '#e39a10', '#c47f08'),
    mayor({x: 300, y: 2000, scale: 1.05, expr: 'agobiado', look: 1, armL: {shoulder: 10}, armR: {shoulder: 10}}), ...sweat(380, 1420),
    emu({x: 900, y: 2200, scale: 1.6, flip: true, eye: 'normal'}), medal(760, 1420, 1.6),
    G([R(-430, -100, 860, 200, {radius: 18, fill: "#1f2a1f", lineWidth: 10}), ctext("EMÚS 1 – 0 EJÉRCITO", 0, -58, 104, {maxW: 800, color: YEL})], {x: 640, y: 1000, angle: deg(-2)})], ctx => {
    vignette(ctx, 0.25);
    txt(ctx, 'GANARON', 540, 360, 200, {maxW: 1000});
    bar(ctx, 540, 570, 1000, 180, RED, -2); txt(ctx, 'LOS PÁJAROS', 540, 570, 150, {maxW: 930, angle: -2, shadow: false});
  });
}
// C — estética de serie: carpeta EXPEDIENTE 003 con la foto (emú + soldado), sello DERROTA, El Becario señalando.
{
  await render('exp003-c-expediente', [full('#3b2f2a'), R(60, 260, 1160, 1780, {radius: 30, fill: '#e7c27a', lineWidth: 12}), R(60, 200, 420, 120, {radius: 24, fill: '#e7c27a', lineWidth: 12}),
    G([R(-380, -440, 760, 900, {radius: 8, fill: PAPER, lineWidth: 12}), R(-330, -390, 660, 660, {fill: '#a8daf5', lineWidth: 8}), E(0, 230, 660, 160, {fill: '#d9b25c', stroke: 'none'}),
      soldado(1, {x: -200, y: 250, scale: 0.42, expr: 'miedo', look: 1}), lewisGun({x: -140, y: 250, scale: 0.45}),
      emu({x: 170, y: 255, scale: 0.85, flip: true, eye: 'grande'})], {x: 520, y: 1180, angle: deg(-5)}),
    E(1060, 2010, 380, 50, {fill: '#2a201c', stroke: 'none', alpha: 0.5}), becario({x: 1060, y: 2010, scale: 1.2, expr: 'sarcastico', look: -1, armL: {shoulder: 95, elbow: 5}})], ctx => {
    txt(ctx, 'EXPEDIENTE 003', 540, 400, 96, {fill: INK, stroke: '#e7c27a', lw: 0.02, maxW: 900, shadow: false});
    txt(ctx, 'EL EJÉRCITO PERDIÓ', 500, 600, 120, {maxW: 920});
    ctx.save(); ctx.translate(400, 1500); ctx.rotate(deg(-14)); ctx.lineWidth = 22; ctx.strokeStyle = RED; ctx.strokeRect(-340, -100, 680, 200); ctx.restore();
    txt(ctx, 'DERROTA', 400, 1500, 160, {fill: RED, stroke: RED, lw: 0.01, maxW: 610, angle: -14, shadow: false});
  });
}
console.log('ok');
