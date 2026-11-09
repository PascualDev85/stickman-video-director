// Channel branding for Historias Sin Cabeza: profile picture (800x800) and banner (2560x1440, safe area 1546x423).
import fs from 'node:fs';
const R0 = '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/';
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {GlobalFonts, createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'ThumbBlack');
const {becario, mike, eiffel, ctext, G, R, S, E, P, deg, PAPER, INK} = await import('./kit.mjs');
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
// ---- banner 2560x1440; safe area (all devices) 1546x423 centred; desktop shows the full-width 423 band ----
// Plane units (1280x720): desktop band y 254-466, mobile/all-devices x 253-1027.
{
  const W = 2560, H = 1440, X = v => v * 2; // plane -> px
  const WALL = '#1c2331', MANILA = '#e7c27a', CORK = '#c89058';
  const shelf = y => [R(-60, y, 1400, 22, {radius: 4, fill: '#6b4a2f', lineWidth: 6}),
    ...Array.from({length: 11}, (_, i) => G([R(-58, -86, 116, 86, {radius: 6, fill: ['#b98a52', '#a77945', '#c79a5e'][i % 3], lineWidth: 5}), R(-26, -64, 52, 18, {radius: 3, fill: '#efe6cf', lineWidth: 3})],
      {x: 20 + i * 124, y, angle: deg(((i * 5) % 5) - 2)}))];
  const card = (cx, cy, ang, pic, bg) => G([R(-46, -54, 92, 108, {radius: 4, fill: PAPER, lineWidth: 5}), R(-38, -46, 76, 70, {radius: 2, fill: bg, lineWidth: 4}), G(pic, {}),
    ], {x: cx, y: cy, angle: deg(ang)});
  const C1 = [1082, 318, -6], C2 = [1218, 326, 5], C3 = [1150, 408, -2];
  const pin = ([x, y, a]) => [x + 50 * Math.sin(deg(a)), y - 50 * Math.cos(deg(a))];
  const string = (p, q) => P([['M', ...p], ['Q', (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 14, ...q]], {stroke: RED, lineWidth: 4});
  const layers = [
    {type: 'rect', x: -60, y: -60, w: 1400, h: 900, radius: 0, fill: WALL, stroke: 'none'},
    rays(640, 360, '#232c3d', 22),
    ...shelf(150), ...shelf(640),
    // corkboard (desktop/TV only) with the series' cases tied by red string
    R(1036, 266, 236, 196, {radius: 10, fill: CORK, lineWidth: 8}),
    ...Array.from({length: 40}, (_, i) => E(1050 + (i * 53) % 214, 280 + (i * 37) % 170, 5, 4, {fill: '#a8733f', stroke: 'none'})),
    card(C1[0], C1[1], C1[2], [G([eiffel({x: 0, y: 0, scale: 0.042})], {y: 20})], '#bfe3f7'),
    card(C2[0], C2[1], C2[2], [mike({x: 6, y: 22, scale: 0.15, head: false})], '#d8ecc9'),
    card(C3[0], C3[1], C3[2], [ctext('?', 0, -44, 64, {color: RED})], '#fff3c4'),
    string(pin(C1), pin(C2)), string(pin(C2), pin(C3)), string(pin(C3), pin(C1)),
    ...[C1, C2, C3].map(k => E(...pin(k), 16, 16, {fill: RED, lineWidth: 3})),
    // the case folder that carries the title (inside the all-devices safe area)
    R(306, 258, 190, 46, {radius: 14, fill: MANILA, lineWidth: 8}),
    R(300, 276, 680, 184, {radius: 18, fill: MANILA, lineWidth: 8}),
    R(330, 300, 620, 104, {radius: 8, fill: PAPER, lineWidth: 6}),
    // the Becario presenting the archive (desktop/TV, outside mobile crop)
    becario({x: 94, y: 640, scale: 0.5, expr: 'sarcastico', look: 1, armR: {shoulder: 98, elbow: 8}}),
  ];
  const a = await art(W, H, layers), c = createCanvas(W, H), ctx = c.getContext('2d'); ctx.drawImage(a, 0, 0);
  { // title in two inks: HISTORIAS (ink) + SIN CABEZA (red)
    let z = 150; ctx.font = `${z}px ThumbBlack`; const full = 'HISTORIAS SIN CABEZA';
    while (ctx.measureText(full).width > X(590)) { z -= 2; ctx.font = `${z}px ThumbBlack`; }
    const w1 = ctx.measureText('HISTORIAS ').width, w = ctx.measureText(full).width, x0 = X(640) - w / 2;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    for (const [t, x, col] of [['HISTORIAS ', x0, INK], ['SIN CABEZA', x0 + w1, RED]]) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText(t, x + z * 0.04, X(354) + z * 0.06); ctx.fillStyle = col; ctx.fillText(t, x, X(354)); }
  }
  txt(ctx, 'Historias reales que no tienen ni pies ni cabeza', X(640), X(430), 50, {fill: INK, stroke: MANILA, lw: 0.0, maxW: X(600)});
  // rubber stamp
  ctx.save(); ctx.translate(X(890), X(280)); ctx.rotate(deg(-6)); ctx.font = '40px ThumbBlack'; const sw = ctx.measureText('CASOS REALES').width + 44;
  ctx.fillStyle = MANILA; ctx.fillRect(-sw / 2, -32, sw, 64); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.strokeRect(-sw / 2, -32, sw, 64);
  ctx.fillStyle = RED; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CASOS REALES', 0, 3); ctx.restore();
  // card captions
  for (const [[x, y], s] of [[C1, '001'], [C2, '002'], [C3, '¿003?']]) { ctx.save(); ctx.font = '26px ThumbBlack'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(s, X(x), X(y + 44)); ctx.restore(); }
  fs.writeFileSync('banner-2560x1440.png', c.toBuffer('image/png'));
  // overlay of the safe areas for checking
  const o = createCanvas(W, H), oc = o.getContext('2d'); oc.drawImage(c, 0, 0); oc.lineWidth = 8; oc.strokeStyle = '#00ff88'; oc.strokeRect((W - 1546) / 2, (H - 423) / 2, 1546, 423); oc.strokeStyle = '#ff00ff'; oc.strokeRect(0, (H - 423) / 2, W, 423);
  fs.writeFileSync('banner-check.png', o.toBuffer('image/png'));
}
console.log('ok');
