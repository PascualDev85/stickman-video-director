// Banner v3 for Historias Sin Cabeza: three distinct proposals (A, B, C) in the profile's palette
// (yellow rays + ink + tie red). Everything that matters sits inside YouTube's minimum safe area
// (1235x338 px, centred), so the Becario and the title survive the mobile crop.
// Output per proposal: banner-v3-X-2560x1440.png + banner-v3-X-vistas.png (TV / escritorio / móvil).
import fs from 'node:fs';
const R0 = '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/';
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {GlobalFonts, createCanvas} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'ThumbBlack');
const {becario, lustig, mike, eiffel, ctext, G, R, S, E, P, deg, PAPER, INK} = await import('./kit.mjs');
const RED = '#e0261b', YEL = '#ffd21f', YEL2 = '#ffe36b', MANILA = '#e7c27a', CORK = '#c89058', NAVY = '#1c2331';
const W = 2560, H = 1440, X = v => v * 2; // plane (1280x720) -> px
// Plane safe areas: min (all devices) x 331-949, y 276-444 · mobile 1546 x 253-1027 · desktop band y 254-466.
async function art(layers) { const draw = await painter({style: 'B3', width: W, height: H, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]}); return draw(0.1); }
const rays = (cx, cy, c, n = 20, r = 2600) => G(Array.from({length: n}, (_, i) => { const a = i * 360 / n, w = 180 / n * 0.5;
  return S([['M', 0, 0], ['L', Math.cos(deg(a - w)) * r, Math.sin(deg(a - w)) * r], ['L', Math.cos(deg(a + w)) * r, Math.sin(deg(a + w)) * r], ['Z']], c, {stroke: 'none'}); }), {x: cx, y: cy});
const bg = fill => ({type: 'rect', x: -60, y: -60, w: 1400, h: 900, radius: 0, fill, stroke: 'none'});
// ---- canvas text helpers (px) ----
function fit(ctx, s, size, maxW) { let z = size; ctx.font = `${z}px ThumbBlack`; while (ctx.measureText(s).width > maxW && z > 10) { z -= 2; ctx.font = `${z}px ThumbBlack`; } return z; }
function txt(ctx, s, cx, cy, size, {fill = '#fff', stroke = INK, lw = 0.16, maxW = 3000, angle = 0, shadow = true} = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle)); const z = fit(ctx, s, size, maxW);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = z * lw; ctx.strokeStyle = 'rgba(0,0,0,0.28)'; if (lw) ctx.strokeText(s, z * 0.05, z * 0.08); ctx.fillText(s, z * 0.05, z * 0.08); }
  if (lw) { ctx.lineWidth = z * lw; ctx.strokeStyle = stroke; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = fill; ctx.fillText(s, 0, 0); ctx.restore(); return z;
}
function stamp(ctx, s, cx, cy, size, angle, {color = RED, fill = null} = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg(angle)); ctx.font = `${size}px ThumbBlack`;
  const w = ctx.measureText(s).width + size * 1.1, h = size * 1.6;
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(-w / 2, -h / 2, w, h); }
  ctx.strokeStyle = color; ctx.lineWidth = size * 0.16; ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.lineWidth = size * 0.06; ctx.strokeRect(-w / 2 + size * 0.22, -h / 2 + size * 0.22, w - size * 0.44, h - size * 0.44);
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, size * 0.06); ctx.restore();
}
// Two-ink title "HISTORIAS / SIN CABEZA" (px), returns nothing.
function title2(ctx, cx, cy, size, maxW, {c1 = INK, c2 = RED, outline = null, oneLine = true} = {}) {
  const full = 'HISTORIAS SIN CABEZA', z = fit(ctx, full, size, maxW); ctx.font = `${z}px ThumbBlack`;
  const w1 = ctx.measureText('HISTORIAS ').width, w = ctx.measureText(full).width, x0 = cx - w / 2;
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round';
  for (const [t, x, col] of [['HISTORIAS ', x0, c1], ['SIN CABEZA', x0 + w1, c2]]) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillText(t, x + z * 0.05, cy + z * 0.07);
    if (outline) { ctx.lineWidth = z * 0.14; ctx.strokeStyle = outline; ctx.strokeText(t, x, cy); }
    ctx.fillStyle = col; ctx.fillText(t, x, cy);
  }
}
// ---- shared props (plane units) ----
const box = (x, y, i, s = 1) => G([R(-58, -86, 116, 86, {radius: 6, fill: ['#b98a52', '#a77945', '#c79a5e'][i % 3], lineWidth: 5}), R(-26, -64, 52, 18, {radius: 3, fill: '#efe6cf', lineWidth: 3})],
  {x, y, scaleX: s, scaleY: s, angle: deg(((i * 7) % 5) - 2)});
const shelf = (y, n = 11, x0 = 20) => [R(-60, y, 1400, 22, {radius: 4, fill: '#6b4a2f', lineWidth: 6}), ...Array.from({length: n}, (_, i) => box(x0 + i * 124, y, i))];
const polaroid = (cx, cy, ang, pic, bg, s = 1) => G([R(-46, -54, 92, 108, {radius: 4, fill: PAPER, lineWidth: 5}), R(-38, -46, 76, 70, {radius: 2, fill: bg, lineWidth: 4}), G(pic, {})], {x: cx, y: cy, angle: deg(ang), scaleX: s, scaleY: s});
const pinAt = (x, y) => [E(x, y, 16, 16, {fill: RED, lineWidth: 3}), E(x - 2, y - 3, 5, 5, {fill: '#ff8a80', stroke: 'none'})];
const string = (p, q, sag = 16) => P([['M', ...p], ['Q', (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + sag, ...q]], {stroke: RED, lineWidth: 4});
const magnifier = () => [G([R(-6, 0, 12, 90, {radius: 5, fill: '#5a3a22', lineWidth: 5}), E(0, -46, 92, 92, {fill: 'rgba(200,235,255,0.55)', lineWidth: 9}), P([['M', -24, -66], ['Q', -10, -80, 8, -78]], {stroke: '#fff', lineWidth: 6})], {y: 70, angle: deg(180)})];
const mug = () => [G([R(-26, -40, 52, 60, {radius: 8, fill: PAPER, lineWidth: 6}), P([['M', 26, -28], ['Q', 50, -16, 26, 6]], {lineWidth: 6}), ctext('☕', 0, -38, 26)], {y: 130})];
const sticky = (x, y, ang, label, col = '#fff38a') => ({g: G([R(-56, -50, 112, 100, {radius: 2, fill: col, lineWidth: 4})], {x, y, angle: deg(ang)}), label, x, y, ang});
const tape = (x, y, ang, w = 90) => G([R(-w / 2, -16, w, 32, {radius: 2, fill: 'rgba(245,240,220,0.85)', stroke: 'rgba(0,0,0,0.25)', lineWidth: 2})], {x, y, angle: deg(ang)});
const emuHead = () => [G([E(0, -10, 40, 70, {fill: '#6b5a48', lineWidth: 5}), E(0, -50, 44, 40, {fill: '#5a6aa0', lineWidth: 5}), E(8, -56, 10, 10, {fill: INK, stroke: 'none'}), S([['M', 20, -52], ['L', 40, -46], ['L', 20, -42], ['Z']], '#3a2a1a', {lineWidth: 4})], {y: 20})];

const out = [];
async function save(name, layers, paint) {
  const a = await art(layers), c = createCanvas(W, H), ctx = c.getContext('2d'); ctx.drawImage(a, 0, 0); paint(ctx);
  fs.writeFileSync(`banner-v3-${name}-2560x1440.png`, c.toBuffer('image/png'));
  // Views: TV (full, scaled), desktop band (2560x423), mobile/all devices (1546x423), with labels.
  const vw = 1600, s = vw / W, pad = 40, lab = 60;
  const tvH = H * s, dH = 423 * s, mW = 1546 * s, mH = 423 * s;
  const sheet = createCanvas(vw + pad * 2, pad + lab + tvH + pad + lab + dH + pad + lab + mH + pad), q = sheet.getContext('2d');
  q.fillStyle = '#f2f2f2'; q.fillRect(0, 0, sheet.width, sheet.height); q.font = '34px ThumbBlack'; q.fillStyle = '#333';
  let y = pad;
  const label = t => { q.fillText(t, pad, y + 40); y += lab; };
  label(`PROPUESTA ${name} · TV (imagen completa)`); q.drawImage(c, pad, y, vw, tvH); y += tvH + pad;
  label('ESCRITORIO (franja central 2560×423)'); q.drawImage(c, 0, (H - 423) / 2, W, 423, pad, y, vw, dH); y += dH + pad;
  label('MÓVIL (zona segura 1546×423, lo que ve casi todo el mundo)'); q.drawImage(c, (W - 1546) / 2, (H - 423) / 2, 1546, 423, pad + (vw - mW) / 2, y, mW, mH);
  q.strokeStyle = '#999'; q.lineWidth = 2; q.strokeRect(pad + (vw - mW) / 2, y, mW, mH);
  fs.writeFileSync(`banner-v3-${name}-vistas.png`, sheet.toBuffer('image/png'));
  out.push(name);
}

// ===== A · «El archivo»: yellow rays like the profile, Becario half-body inside the safe area pointing at the title,
//            archive shelves top/bottom and a filing cabinet + corkboard on the desktop wings.
{
  const C1 = [1110, 318, -6], C2 = [1206, 330, 5], C3 = [1160, 412, -3];
  const pin = ([x, y, a]) => [x + 50 * Math.sin(deg(a)), y - 50 * Math.cos(deg(a))];
  const cabinet = (x, y) => G([R(-70, -210, 140, 210, {radius: 8, fill: '#8a9099', lineWidth: 7}), ...[0, 1, 2].map(i => G([R(-58, -198 + i * 66, 116, 56, {radius: 5, fill: '#a3a9b1', lineWidth: 5}), R(-22, -182 + i * 66, 44, 12, {radius: 4, fill: '#d6d9dd', lineWidth: 3}), R(-26, -166 + i * 66, 52, 16, {radius: 2, fill: '#fff8e0', lineWidth: 3})], {}))], {x, y});
  const layers = [
    bg(YEL), rays(640, 360, YEL2, 22),
    // shelves (TV only)
    ...shelf(150), ...shelf(650),
    // desktop wings: filing cabinet + papers (left), corkboard with the cases (right)
    cabinet(150, 468), G([R(-40, -12, 80, 12, {radius: 2, fill: PAPER, lineWidth: 4})], {x: 150, y: 250, angle: deg(-8)}),
    R(1056, 266, 214, 196, {radius: 10, fill: CORK, lineWidth: 8}),
    ...Array.from({length: 36}, (_, i) => E(1068 + (i * 53) % 192, 280 + (i * 37) % 170, 5, 4, {fill: '#a8733f', stroke: 'none'})),
    polaroid(C1[0], C1[1], C1[2], [G([eiffel({x: 0, y: 0, scale: 0.042})], {y: 20})], '#bfe3f7'),
    polaroid(C2[0], C2[1], C2[2], [mike({x: 6, y: 22, scale: 0.15, head: false})], '#d8ecc9'),
    polaroid(C3[0], C3[1], C3[2], [ctext('?', 0, -44, 64, {color: RED})], '#fff3c4'),
    string(pin(C1), pin(C2)), string(pin(C2), pin(C3)), string(pin(C3), pin(C1)), ...[C1, C2, C3].flatMap(k => pinAt(...pin(k))),
    // title card (manila folder) inside the min safe area
    R(478, 274, 150, 34, {radius: 12, fill: MANILA, lineWidth: 8}),
    R(470, 292, 476, 140, {radius: 18, fill: MANILA, lineWidth: 8}),
    R(490, 308, 436, 78, {radius: 8, fill: PAPER, lineWidth: 6}),
    // the Becario, half body, pointing at the title (head inside the band)
    becario({x: 384, y: 662, scale: 0.52, expr: 'sarcastico', look: 1, armR: {shoulder: 128, elbow: -30}, armL: {shoulder: 10, elbow: 30}}),
  ];
  await save('A', layers, ctx => {
    title2(ctx, X(708), X(348), 130, X(416));
    txt(ctx, 'Historias reales que no tienen ni pies ni cabeza', X(708), X(410), 44, {fill: INK, lw: 0, shadow: false, maxW: X(440)});
    stamp(ctx, 'CASOS REALES', X(890), X(298), 32, -7, {fill: MANILA});
    for (const [[x, y], s] of [[C1, '001'], [C2, '002'], [C3, '¿003?']]) { ctx.save(); ctx.font = '26px ThumbBlack'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(s, X(x), X(y + 44)); ctx.restore(); }
    txt(ctx, 'EXPEDIENTES', X(150), X(236), 30, {fill: INK, lw: 0, shadow: false, angle: -8});
  });
}

// ===== B · «El tablón»: full corkboard; the title is a sheet pinned in the middle with red strings to the cases;
//            the Becario investigates with a magnifier; sticky notes with his running gag.
{
  const cards = [[150, 300, -8, 'eiffel'], [300, 452, 6, 'mike'], [1000, 300, 7, 'lustig'], [1150, 440, -6, 'q'], [70, 470, 4, 'emu'], [1220, 250, -3, 'q2']];
  const pic = k => ({
    eiffel: [[G([eiffel({x: 0, y: 0, scale: 0.042})], {y: 20})], '#bfe3f7'],
    mike: [[mike({x: 6, y: 22, scale: 0.15, head: false})], '#d8ecc9'],
    lustig: [[G([lustig({x: 0, y: 0, scale: 0.1, expr: 'picaro'})], {y: 56})], '#f4d6d6'],
    emu: [emuHead(), '#f0e2c8'],
    q: [[ctext('?', 0, -44, 64, {color: RED})], '#fff3c4'],
    q2: [[ctext('?', 0, -44, 64, {color: RED})], '#e6e0ff'],
  })[k];
  const centre = [600, 284];
  const layers = [
    bg(CORK),
    ...Array.from({length: 520}, (_, i) => E((i * 97) % 1300 - 10, (i * 61) % 740 - 10, 6 + (i % 3) * 2, 5 + (i % 2) * 2, {fill: i % 2 ? '#a8733f' : '#d6a26c', stroke: 'none'})),
    // wooden frame (TV only)
    R(-40, -40, 1360, 70, {radius: 0, fill: '#6b4a2f', lineWidth: 8}), R(-40, 690, 1360, 70, {radius: 0, fill: '#6b4a2f', lineWidth: 8}),
    // cases and strings
    ...cards.map(([x, y, a, k]) => polaroid(x, y, a, ...pic(k), 1.05)),
    ...cards.map(([x, y]) => string([x, y - 50], centre, 30)),
    ...cards.flatMap(([x, y]) => pinAt(x, y - 50)),
    // sticky notes (desktop wings + one in safe)
    G([R(-60, -54, 120, 108, {radius: 2, fill: '#fff38a', lineWidth: 4})], {x: 250, y: 316, angle: deg(-5)}),
    G([R(-60, -54, 120, 108, {radius: 2, fill: '#ffb3c7', lineWidth: 4})], {x: 1080, y: 438, angle: deg(5)}),
    // the title sheet
    G([R(-270, -92, 540, 184, {radius: 4, fill: '#fffdf4', lineWidth: 8}), ...[0, 1, 2, 3].map(i => P([['M', -246, -38 + i * 34], ['L', 246, -38 + i * 34]], {stroke: '#c9dcf2', lineWidth: 3})), P([['M', -214, -86], ['L', -214, 86]], {stroke: '#f2b5b5', lineWidth: 3})], {x: 600, y: 360, angle: deg(-1.5)}),
    tape(352, 272, -30), tape(846, 272, 28), ...pinAt(600, 278),
    // the Becario with the magnifier, peeking from the bottom right of the safe area
    becario({x: 930, y: 652, scale: 0.5, expr: 'picaro', look: -1, armL: {shoulder: 100, elbow: 40, hold: magnifier()}, armR: {shoulder: 10, elbow: 20}}),
  ];
  await save('B', layers, ctx => {
    title2(ctx, X(600), X(346), 112, X(460));
    txt(ctx, 'Historias reales que no tienen ni pies ni cabeza', X(600), X(406), 38, {fill: INK, lw: 0, shadow: false, maxW: X(450), angle: -1.5});
    stamp(ctx, 'CASO ABIERTO', X(430), X(298), 26, -10, {fill: '#fffdf4'});
    txt(ctx, 'SIN COBRAR', X(250), X(300), 26, {fill: INK, lw: 0, shadow: false, angle: -5}); txt(ctx, 'DESDE ENERO', X(250), X(330), 18, {fill: INK, lw: 0, shadow: false, angle: -5});
    txt(ctx, '¿ESTO PASÓ', X(1080), X(424), 22, {fill: INK, lw: 0, shadow: false, angle: 5}); txt(ctx, 'DE VERDAD?', X(1080), X(452), 22, {fill: INK, lw: 0, shadow: false, angle: 5});
    for (const [x, y, a, k] of cards) { const s = {eiffel: '001', mike: '002', lustig: '001', emu: '003', q: '¿?', q2: '¿?'}[k]; ctx.save(); ctx.translate(X(x), X(y + 46)); ctx.rotate(deg(a)); ctx.font = '26px ThumbBlack'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(s, 0, 0); ctx.restore(); }
  });
}

// ===== C · «Caso abierto»: bold and graphic. Navy wall, a huge yellow band (the profile's colour) as the desktop strip,
//            police tape at the corners, the Becario popping out of a case folder like the profile pose.
{
  const tapeBand = (y, ang) => G([R(-900, -26, 1800, 52, {radius: 0, fill: YEL, lineWidth: 6}), ...Array.from({length: 26}, (_, i) => S([['M', -900 + i * 70, -26], ['L', -870 + i * 70, -26], ['L', -900 + i * 70 + 10, 26], ['L', -930 + i * 70 + 10, 26], ['Z']], INK, {stroke: 'none'}))], {x: 640, y, angle: deg(ang)});
  const layers = [
    bg(YEL), rays(640, 360, YEL2, 26),
    // navy wall outside the desktop strip, so the strip reads as one yellow band
    R(-60, -60, 1400, 314, {radius: 0, fill: NAVY, lineWidth: 10}), R(-60, 466, 1400, 320, {radius: 0, fill: NAVY, lineWidth: 10}),
    ...Array.from({length: 18}, (_, i) => R(-60 + i * 80, -60, 30, 314, {radius: 0, fill: '#212a3a', stroke: 'none'})),
    ...Array.from({length: 18}, (_, i) => R(-60 + i * 80, 471, 30, 320, {radius: 0, fill: '#212a3a', stroke: 'none'})),
    // police tape (TV corners only)
    tapeBand(120, -7), tapeBand(610, 6),
    // desktop wings: boxes stack left, the three case folders fanned right
    ...[0, 1, 2].map(i => box(110 + (i % 2) * 40, 462 - i * 84, i, 1.2)),
    ...[[1180, 426, 14, 'EXP. 003'], [1135, 398, 4, 'EXP. 002'], [1090, 370, -7, 'EXP. 001']].map(([x, y, a, l]) => G([R(-80, -60, 160, 120, {radius: 8, fill: MANILA, lineWidth: 6}), R(-80, -76, 64, 22, {radius: 6, fill: MANILA, lineWidth: 6}), R(-56, -40, 112, 30, {radius: 4, fill: PAPER, lineWidth: 4}), ctext(l, 0, -38, 20)], {x, y, angle: deg(a)})),
    // the case folder the Becario pops out of (lower edge of the safe area)
    R(330, 412, 236, 90, {radius: 14, fill: MANILA, lineWidth: 8}),
    becario({x: 448, y: 706, scale: 0.6, expr: 'sarcastico', look: 1, armR: {shoulder: 40, elbow: 100}, armL: {shoulder: 30, elbow: 110}}),
    R(316, 438, 264, 80, {radius: 14, fill: MANILA, lineWidth: 8}),
  ];
  await save('C', layers, ctx => {
    // title stack on the right of the Becario
    txt(ctx, 'HISTORIAS', X(770), X(318), 150, {fill: '#fff', lw: 0.16, maxW: X(380)});
    txt(ctx, 'SIN CABEZA', X(770), X(386), 150, {fill: RED, stroke: INK, lw: 0.16, maxW: X(380)});
    txt(ctx, 'Historias reales que no tienen ni pies ni cabeza', X(770), X(434), 32, {fill: INK, lw: 0, shadow: false, maxW: X(360)});
    stamp(ctx, 'SIN COBRAR', X(448), X(458), 24, -6, {fill: MANILA});
  });
}
console.log('ok', out.join(','));
