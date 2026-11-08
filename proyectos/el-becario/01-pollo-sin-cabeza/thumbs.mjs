// Thumbnail variants for "El pollo sin cabeza". Art comes from the rig; text/arrows are painted on top with heavy outlines.
import fs from 'node:fs';
const R0 = '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/';
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

// V1 — arrow + circle on the stump, shocked Becario close-up, "18 MESES / SIN CABEZA".
{
  const mx = 760, my = 1660, ms = 2.35;
  await render('v1-flecha', [...rays('#ffc21a', '#ffe16b', 900, 900), E(700, 1640, 1200, 200, {fill: '#e9a514', stroke: 'none'}), mike({x: mx, y: my, scale: ms}),
    becario({x: 70, y: 2700, scale: 2.0, expr: 'sorpresa', look: 1})], ctx => {
    const [sx, sy] = stump(mx, my, ms); ring(ctx, sx, sy - 10, 115); arrow(ctx, 170, 760, sx - 140, sy - 30);
    txt(ctx, '18 MESES', 540, 245, 230, {fill: '#fff', maxW: 1000});
    bar(ctx, 540, 470, 1000, 190, RED, -2); txt(ctx, 'SIN CABEZA', 540, 470, 170, {fill: '#fff', maxW: 930, angle: -2, shadow: false});
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
    mike({x: 680, y: 2020, scale: 1.75})], ctx => {
    txt(ctx, 'ANTES', 230, 230, 120, {fill: '#fff', maxW: 420, angle: -4});
    txt(ctx, 'DESPUÉS', 820, 1060, 120, {fill: '#fff', maxW: 460, angle: -4});
    bar(ctx, 540, 1790, 980, 200, RED, -3); txt(ctx, 'VIVIÓ 18 MESES', 540, 1790, 150, {fill: '#fff', maxW: 920, angle: -3, shadow: false});
  });
}
// V3 — dark spotlight, the cold open as a poster, Becario peeking: "¿Y SU CABEZA?".
{
  const mx = 600, my = 1720, ms = 2.6;
  await render('v3-foco', [full('#141729'), S([['M', 470, -60], ['L', 830, -60], ['L', 1300, 1880], ['L', -40, 1880], ['Z']], '#2a2f52', {stroke: 'none'}), E(640, 1820, 1300, 260, {fill: '#3c4475', stroke: 'none'}),
    mike({x: mx, y: my, scale: ms}), becario({x: 1180, y: 2560, scale: 2.1, expr: 'sarcastico', look: -1})], ctx => {
    const [sx, sy] = stump(mx, my, ms); ring(ctx, sx, sy - 20, 125);
    txt(ctx, '¿Y SU', 540, 250, 210, {fill: YEL, maxW: 1000}); txt(ctx, 'CABEZA?', 540, 470, 240, {fill: YEL, maxW: 1020});
    bar(ctx, 300, 1610, 470, 110, '#fff', -4); txt(ctx, '18 MESES VIVO', 300, 1610, 64, {fill: RED, stroke: '#fff', lw: 0.02, maxW: 430, angle: -4, shadow: false});
  });
}
// V4 — case file (series look): manila folder, polaroid, red SIN CABEZA stamp.
{
  await render('v4-expediente', [full('#3b2f2a'), R(60, 260, 1160, 1780, {radius: 30, fill: '#e7c27a', lineWidth: 12}), R(60, 200, 420, 120, {radius: 24, fill: '#e7c27a', lineWidth: 12}),
    G([R(-380, -440, 760, 900, {radius: 8, fill: PAPER, lineWidth: 12}), R(-330, -390, 660, 660, {fill: '#ffe08a', lineWidth: 8}), E(0, 200, 520, 80, {fill: '#f2c85f', stroke: 'none'}), mike({x: -40, y: 220, scale: 1.55})], {x: 640, y: 1220, angle: deg(-5)}),
    G([R(-70, -30, 140, 60, {fill: 'rgba(255,255,255,0.6)', stroke: 'none'})], {x: 640, y: 780, angle: deg(8)}),
    becario({x: 1230, y: 2520, scale: 1.6, expr: 'sarcastico', look: -1})], ctx => {
    txt(ctx, 'EXPEDIENTE 014', 560, 400, 96, {fill: INK, stroke: '#e7c27a', lw: 0.02, maxW: 900, shadow: false});
    ctx.save(); ctx.translate(500, 1450); ctx.rotate(deg(-14)); ctx.lineWidth = 22; ctx.strokeStyle = RED; ctx.strokeRect(-400, -105, 800, 210); ctx.restore();
    txt(ctx, 'SIN CABEZA', 500, 1450, 160, {fill: RED, stroke: RED, lw: 0.01, maxW: 760, angle: -14, shadow: false});
    txt(ctx, '18 MESES', 560, 620, 150, {fill: '#fff', maxW: 900});
  });
}
console.log('ok');
