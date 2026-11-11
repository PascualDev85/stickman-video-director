// Thumbnail variants for "El pollo sin cabeza". Art comes from the rig; text/arrows are painted on top with heavy outlines.
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/', import.meta.url).pathname);
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {GlobalFonts, createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'ThumbBlack');
const {becario, granjero, mike, archiveBox, choppingBlock, G, R, S, E, P, deg, PAPER, INK, TIE} = await import('../kit.mjs');
const H = 1280 * 1920 / 1080, K = 1080 / 1280, RED = '#e0261b', YEL = '#ffd21f';
const full = c => ({type: 'rect', x: -60, y: -60, w: 1400, h: H + 120, radius: 0, fill: c, stroke: 'none'});
const rays = (c1, c2, cx, cy, n = 16) => [full(c1), G(Array.from({length: n}, (_, i) => { const a = i * 360 / n, w = 180 / n * 0.55;
  return S([['M', 0, 0], ['L', Math.cos(deg(a - w)) * 2800, Math.sin(deg(a - w)) * 2800], ['L', Math.cos(deg(a + w)) * 2800, Math.sin(deg(a + w)) * 2800], ['Z']], c2, {stroke: 'none'}); }), {x: cx, y: cy})];
const stump = (x, y, s) => [(x + 122 * s) * K, (y - 335 * s) * K]; // pixel coords of the neck stump

async function render(name, layers, overlay) {
  const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
  const art = draw(0.1), c = createCanvas(1080, 1920), ctx = c.getContext('2d');
  ctx.drawImage(art, 0, 0); overlay(ctx);
  fs.writeFileSync(`thumbs/${name}.png`, c.toBuffer('image/png'));
}
// heavy outlined text, auto-fit to maxW
function txt(ctx, s, cx, cy, size, {fill = '#fff', stroke = INK, lw = 0.16, maxW = 1000, angle = 0, shadow = true, track = -0.02} = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle));
  let z = size; const font = v => `${v}px ThumbBlack`;
  ctx.font = font(z); while (ctx.measureText(s).width * (1 + track) > maxW && z > 20) { z -= 4; ctx.font = font(z); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = z * lw; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.strokeText(s, 10, 14); ctx.fillText(s, 10, 14); }
  ctx.lineWidth = z * lw; ctx.strokeStyle = stroke; ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0);
  ctx.restore(); return z;
}
function bar(ctx, cx, cy, w, h, color, angle = 0) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle)); ctx.fillStyle = INK; ctx.fillRect(-w / 2 + 10, -h / 2 + 12, w, h); ctx.fillStyle = color; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore(); }
function ring(ctx, x, y, r) { ctx.save(); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(x, y, r * 1.15, r, deg(-12), 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = RED; ctx.stroke(); ctx.restore(); }
function arrow(ctx, x0, y0, x1, y1) {
  const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(a);
  const path = () => { ctx.beginPath(); ctx.moveTo(0, -22); ctx.quadraticCurveTo(L * 0.5, -40, L - 90, -26); ctx.lineTo(L - 100, -70); ctx.lineTo(L, 0); ctx.lineTo(L - 100, 70); ctx.lineTo(L - 90, 26); ctx.quadraticCurveTo(L * 0.5, 10, 0, 22); ctx.closePath(); };
  path(); ctx.lineWidth = 22; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
}

const glow = (x, y, r) => [0.18, 0.28, 0.45, 0.8].map((a, i) => E(x, y, r * (2 - i * 0.4), r * (2 - i * 0.4), {fill: '#fffbe0', stroke: 'none', alpha: a}));
const impact = (x, y, r0, r1, n = 9, skip = []) => Array.from({length: n}, (_, i) => i).filter(i => !skip.includes(i)).map(i => { const a = deg(-170 + i * 160 / (n - 1)); return P([['M', x + Math.cos(a) * r0, y + Math.sin(a) * r0], ['L', x + Math.cos(a) * r1, y + Math.sin(a) * r1]], {lineWidth: 16}); });
const feather = (x, y, a, s = 1) => G([S([['M', 0, -40], ['Q', 26, 0, 0, 40], ['Q', -26, 0, 0, -40], ['Z']], '#fbf7ec', {lineWidth: 7}), P([['M', 0, -34], ['L', 0, 36]], {stroke: '#d9cfbb', lineWidth: 4})], {x, y, angle: deg(a), scaleX: s, scaleY: s});
const sweat = (x, y, s = 1) => S([['M', 0, -40], ['Q', 30, 10, 0, 30], ['Q', -30, 10, 0, -40], ['Z']], '#7fd0ff', {lineWidth: 7, x, y});
function vignette(ctx, strength = 0.45) { const g = ctx.createRadialGradient(540, 980, 420, 540, 980, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(40,10,0,${strength})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }
// V1 — arrow + ring on the glowing stump, feathers flying, shocked Becario (whole face), vignette.
{
  const mx = 800, my = 1700, ms = 2.3, SX = mx + 122 * ms, SY = my - 340 * ms;
  await render('v1-flecha', [...rays('#ffbb12', '#ffe066', SX, SY, 18), ...glow(SX, SY, 260), E(mx, my, 1150, 190, {fill: '#e39a10', stroke: 'none'}),
    mike({x: mx, y: my, scale: ms}), ...impact(SX, SY - 20, 170, 260, 9, [2, 3]),
    feather(1130, 1180, 30, 1.2), feather(170, 1050, -40, 1.1), feather(1170, 900, 70, 0.9), feather(260, 1330, 15, 0.8),
    becario({x: 250, y: 2600, scale: 1.75, expr: 'sorpresa', look: 1}), sweat(80, 1330, 1), sweat(470, 1300, 0.8)], ctx => {
    vignette(ctx, 0.4);
    const sx = SX * K, sy = SY * K; ring(ctx, sx, sy - 8, 112); arrow(ctx, 120, 790, sx - 135, sy - 25);
    txt(ctx, '18 MESES', 540, 240, 240, {fill: '#fff', maxW: 1010});
    bar(ctx, 540, 470, 1010, 200, RED, -2); txt(ctx, 'SIN CABEZA', 540, 470, 178, {fill: '#fff', maxW: 940, angle: -2, shadow: false});
  });
}
// V2 — before / after split: same rooster, 1945 with head vs. headless.
{
  await render('v2-antes-despues', [full('#ffc21a'),
    G(Array.from({length: 12}, (_, i) => S([['M', 0, 0], ['L', Math.cos(deg(i * 30 - 6)) * 1800, Math.sin(deg(i * 30 - 6)) * 1800], ['L', Math.cos(deg(i * 30 + 6)) * 1800, Math.sin(deg(i * 30 + 6)) * 1800], ['Z']], '#ffe16b', {stroke: 'none'})), {x: 760, y: 1900}),
    S([['M', -60, -60], ['L', 1340, -60], ['L', 1340, 1060], ['L', -60, 1160], ['Z']], '#9fd4f2', {stroke: 'none'}),
    S([['M', -60, 900], ['Q', 640, 780, 1340, 880], ['L', 1340, 1060], ['L', -60, 1160], ['Z']], '#8cc55a', {stroke: 'none'}),
    mike({x: 600, y: 1030, scale: 1.45, head: true}),
    P([['M', -60, 1160], ['L', 1340, 1060]], {lineWidth: 26}),
    mike({x: 520, y: 2020, scale: 1.75}), becario({x: 1060, y: 2010, scale: 1.15, expr: 'sorpresa', look: -1}), sweat(870, 1240, 0.8)], ctx => {
    txt(ctx, 'ANTES', 230, 230, 120, {fill: '#fff', maxW: 420, angle: -4});
    txt(ctx, 'DESPUÉS', 330, 1100, 120, {fill: '#fff', maxW: 460, angle: -4});
    bar(ctx, 540, 1790, 980, 200, RED, -3); txt(ctx, 'VIVIÓ 18 MESES', 540, 1790, 150, {fill: '#fff', maxW: 920, angle: -3, shadow: false});
  });
}
// V3 — dark spotlight, the cold open as a poster, Becario peeking: "¿Y SU CABEZA?".
{
  const mx = 500, my = 1720, ms = 2.5;
  await render('v3-foco', [full('#141729'), S([['M', 470, -60], ['L', 830, -60], ['L', 1300, 1880], ['L', -40, 1880], ['Z']], '#2a2f52', {stroke: 'none'}), E(640, 1820, 1300, 260, {fill: '#3c4475', stroke: 'none'}),
    mike({x: mx, y: my, scale: ms}), becario({x: 1020, y: 2480, scale: 1.85, expr: 'sarcastico', look: -1})], ctx => {
    const [sx, sy] = stump(mx, my, ms); ring(ctx, sx, sy - 20, 125);
    txt(ctx, '¿Y SU', 540, 250, 210, {fill: YEL, maxW: 1000}); txt(ctx, 'CABEZA?', 540, 470, 240, {fill: YEL, maxW: 1020});
    bar(ctx, 300, 1610, 470, 110, '#fff', -4); txt(ctx, '18 MESES VIVO', 300, 1610, 64, {fill: RED, stroke: '#fff', lw: 0.02, maxW: 430, angle: -4, shadow: false});
  });
}
// V4 — case file (series look): manila folder, polaroid, red SIN CABEZA stamp.
{
  await render('v4-expediente', [full('#3b2f2a'), R(60, 260, 1160, 1780, {radius: 30, fill: '#e7c27a', lineWidth: 12}), R(60, 200, 420, 120, {radius: 24, fill: '#e7c27a', lineWidth: 12}),
    G([R(-380, -440, 760, 900, {radius: 8, fill: PAPER, lineWidth: 12}), R(-330, -390, 660, 660, {fill: '#ffe08a', lineWidth: 8}), E(0, 200, 520, 80, {fill: '#f2c85f', stroke: 'none'}), mike({x: -40, y: 220, scale: 1.55})], {x: 520, y: 1180, angle: deg(-5)}),
    G([R(-70, -30, 140, 60, {fill: '#f4f1e6', stroke: 'none', alpha: 0.7})], {x: 520, y: 740, angle: deg(8)}),
    E(1060, 2010, 380, 50, {fill: '#2a201c', stroke: 'none', alpha: 0.5}), becario({x: 1060, y: 2010, scale: 1.2, expr: 'sarcastico', look: -1, armL: {shoulder: 95, elbow: 5}})], ctx => {
    txt(ctx, 'EXPEDIENTE 014', 540, 400, 96, {fill: INK, stroke: '#e7c27a', lw: 0.02, maxW: 900, shadow: false});
    ctx.save(); ctx.translate(400, 1500); ctx.rotate(deg(-14)); ctx.lineWidth = 22; ctx.strokeStyle = RED; ctx.strokeRect(-370, -100, 740, 200); ctx.restore();
    txt(ctx, 'SIN CABEZA', 400, 1500, 150, {fill: RED, stroke: RED, lw: 0.01, maxW: 760, angle: -14, shadow: false});
    txt(ctx, '18 MESES', 470, 600, 150, {fill: '#fff', maxW: 900});
  });
}
console.log('ok');
