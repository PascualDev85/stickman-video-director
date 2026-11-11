// Thumbnail variants for "El pollo sin cabeza". Art comes from the rig; text/arrows are painted on top with heavy outlines.
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/', import.meta.url).pathname);
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {GlobalFonts, createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'ThumbBlack');
const {becario, lustig, poisson, eiffel, caseFolder, caneProp, ctext, G, R, S, E, P, deg, PAPER, INK, TIE} = await import('../kit.mjs');
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

const sellSign = (txt = 'SE VENDE', fill = '#ffd21f', color = '#e0261b') => G([R(-270, -80, 540, 160, {radius: 14, fill, lineWidth: 10}), ctext(txt, 0, -62, 116, {maxW: 490, color}), P([['M', -240, -80], ['L', -150, -170]], {lineWidth: 7}), P([['M', 240, -80], ['L', 150, -170]], {lineWidth: 7})], {y: -560, angle: deg(-6)});
const coin = (x, y, s = 1, a = 0) => G([E(0, 0, 60, 60, {fill: '#f2c230', lineWidth: 6}), E(0, 0, 38, 38, {fill: 'none', stroke: '#c8941a', lineWidth: 5}), R(-4, -12, 8, 24, {radius: 3, fill: '#c8941a', stroke: 'none'})], {x, y, scaleX: s, scaleY: s, angle: deg(a)});
const briefcase = (x, y, s = 1) => G([R(-90, -60, 180, 120, {radius: 12, fill: '#6b3e22', lineWidth: 8}), R(-30, -84, 60, 30, {radius: 10, fill: 'none', lineWidth: 8}), R(-14, -12, 28, 22, {radius: 4, fill: '#e9b93a', lineWidth: 5})], {x, y, scaleX: s, scaleY: s});
const sky = [full('#8fcdf0'), E(640, 700, 1500, 1500, {fill: '#a8daf5', stroke: 'none'})];
// A — tower wearing SE VENDE, Lustig winking in the foreground, arrow to the sign.
{
  const TX = 760, TY = 1640, TS = 1.0;
  await render('exp001-a-sevende', [...rays('#8fcdf0', '#a8daf5', TX, 1000, 16), ...glow(TX, TY - 560 * TS, 300), E(640, 1660, 1500, 240, {fill: '#d9c9a8', stroke: 'none'}),
    eiffel({x: TX, y: TY, scale: TS, extra: [sellSign()]}),
    lustig({x: 270, y: 2560, scale: 1.75, expr: 'picaro', look: 1, armL: {shoulder: 10}})], ctx => {
    vignette(ctx, 0.35);
    arrow(ctx, 200, 820, (TX - 300) * K, (TY - 560 * TS) * K + 10);
    txt(ctx, 'LA VENDIÓ', 540, 400, 220, {fill: '#fff', maxW: 1000});
    bar(ctx, 540, 620, 1000, 190, RED, -2); txt(ctx, 'Y NO ERA SUYA', 540, 620, 150, {fill: '#fff', maxW: 930, angle: -2, shadow: false});
  });
}
// B — the sale: Lustig with the briefcase, coins flying, tower stamped VENDIDA.
{
  await render('exp001-b-vendida', [...rays('#ffc21a', '#ffe16b', 640, 1000, 18), E(640, 1700, 1400, 220, {fill: '#e39a10', stroke: 'none'}),
    eiffel({x: 900, y: 1720, scale: 0.92, extra: [sellSign('VENDIDA', '#ffffff', '#e0261b')]}),
    lustig({x: 420, y: 2380, scale: 1.55, expr: 'picaro', look: 1, armR: {shoulder: 70, elbow: 20}, armL: {shoulder: 12, hold: [caneProp()]}}),
    briefcase(830, 1950, 1.25), ...[[620, 1100, 1, 20], [760, 1020, 0.8, -30], [1060, 1160, 1.1, 10], [700, 1250, 0.7, 40], [1120, 980, 0.9, -15]].map(([x, y, s, a]) => coin(x, y, s, a))], ctx => {
    vignette(ctx, 0.3);
    txt(ctx, 'VENDIÓ LA', 540, 400, 200, {fill: '#fff', maxW: 1000});
    bar(ctx, 540, 610, 1000, 190, RED, -2); txt(ctx, 'TORRE EIFFEL', 540, 610, 160, {fill: '#fff', maxW: 930, angle: -2, shadow: false});
  });
}
// C — series look: case folder with Lustig's photo, ESTAFA stamp, Becario full body pointing.
{
  await render('exp001-c-expediente', [full('#3b2f2a'), R(60, 260, 1160, 1780, {radius: 30, fill: '#e7c27a', lineWidth: 12}), R(60, 200, 420, 120, {radius: 24, fill: '#e7c27a', lineWidth: 12}),
    G([R(-380, -440, 760, 900, {radius: 8, fill: PAPER, lineWidth: 12}), R(-330, -390, 660, 660, {fill: '#a8daf5', lineWidth: 8}), eiffel({x: 170, y: 250, scale: 0.4}), lustig({x: -80, y: 520, scale: 1.0, expr: 'picaro', look: 1})], {x: 520, y: 1180, angle: deg(-5)}),
    G([R(-70, -30, 140, 60, {fill: '#f4f1e6', stroke: 'none', alpha: 0.7})], {x: 520, y: 740, angle: deg(8)}),
    E(1060, 2010, 380, 50, {fill: '#2a201c', stroke: 'none', alpha: 0.5}), becario({x: 1060, y: 2010, scale: 1.2, expr: 'sarcastico', look: -1, armL: {shoulder: 95, elbow: 5}})], ctx => {
    txt(ctx, 'EXPEDIENTE 001', 540, 400, 96, {fill: INK, stroke: '#e7c27a', lw: 0.02, maxW: 900, shadow: false});
    ctx.save(); ctx.translate(400, 1500); ctx.rotate(deg(-14)); ctx.lineWidth = 22; ctx.strokeStyle = RED; ctx.strokeRect(-330, -100, 660, 200); ctx.restore();
    txt(ctx, 'ESTAFA', 400, 1500, 170, {fill: RED, stroke: RED, lw: 0.01, maxW: 600, angle: -14, shadow: false});
    txt(ctx, 'TORRE EIFFEL', 470, 600, 120, {fill: '#fff', maxW: 900});
  });
}
console.log('ok');
