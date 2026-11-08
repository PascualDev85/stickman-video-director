// "Mike, el pollo sin cabeza" — El Becario, Short 9:16. v2: rigged characters,
// detailed sets. Shot boundaries follow the real word timings of narration take A.
import fs from 'node:fs';
import {becario, granjero, person, mike, archiveBox, axeProp, osc, P, E, R, G, S, deg, INK, PAPER, TIE, ctext, sign, choppingBlock, roosterHead, featherBurst, dropperProp} from '../kit.mjs';

const H = 1280 * 1920 / 1080, GROUND = 1420;
const RED = '#d8352a';
const T = (text, x, y, size = 96, o = {}) => ({type: 'text', text, x, y, size, bold: true, color: INK, w: 1120 - x, ...o});
const fill = c => ({type: 'rect', x: -60, y: -60, w: 1400, h: H + 120, radius: 0, fill: c, stroke: 'none'});
const band = (y, h, c) => ({type: 'rect', x: -60, y, w: 1400, h, radius: 0, fill: c, stroke: 'none'});
const lin = (dur, a, b, prop = 'x', t0 = 0) => [{t: t0, [prop]: a}, {t: dur, [prop]: b}];
// every cut lands with a small punch (5% over-zoom settling in 0.18 s), then the slow push
const cam = (layers, dur, from = 1, to = 1.05, px = 640, py = 1000) => { const m = from + (to - from) * 0.18 / dur;
  return G(layers, {pivotX: px, pivotY: py, keys: dur > 0.5 ? [{t: 0, scaleX: from * 1.05, scaleY: from * 1.05}, {t: 0.18, scaleX: m, scaleY: m}, {t: dur, scaleX: to, scaleY: to}] : [{t: 0, scaleX: from, scaleY: from}, {t: dur, scaleX: to, scaleY: to}]}); };
function mergeKeys(keys) {
  const out = [];
  for (const k of [...keys].sort((a, b) => a.t - b.t)) { const last = out.at(-1); if (last && Math.abs(last.t - k.t) < 1e-6) Object.assign(last, k); else out.push({...k}); }
  return out;
}
const pop = (layer, at, dur = 0.25) => ({...layer, from: at, keys: mergeKeys([...(layer.keys || []).filter(k => k.t > at + dur), {t: at, alpha: 0}, {t: at + dur, alpha: 1}])});

// ---------- set pieces ----------
const cloud = (x, y, s, dur, dx = 60) => G([E(0, 0, 220, 90, {stroke: 'none'}), E(-70, 10, 140, 70, {stroke: 'none'}), E(70, 14, 150, 70, {stroke: 'none'}), E(10, -30, 130, 80, {stroke: 'none'})], {x, y, scaleX: s, scaleY: s, alpha: 0.95, keys: lin(dur, x, x + dx)});
const tree = (x, y, s = 1) => G([R(-18, -200, 36, 200, {radius: 6, fill: '#8a5a33', lineWidth: 8}), E(0, -260, 220, 180, {fill: '#5f9e48', lineWidth: 9}), E(-60, -220, 140, 120, {fill: '#6fb354', lineWidth: 9}), E(60, -230, 150, 130, {fill: '#6fb354', lineWidth: 9})], {x, y, scaleX: s, scaleY: s});
const tuft = (x, y) => P([['M', x - 16, y], ['L', x - 8, y - 22], ['L', x, y], ['L', x + 8, y - 26], ['L', x + 16, y]], {stroke: '#4f8a38', lineWidth: 6});
function barn(x, y, s = 1) {
  return G([
    R(0, -330, 340, 330, {radius: 4, fill: '#b83a2b'}),
    ...[60, 120, 180, 240, 300].map(px => P([['M', px, -320], ['L', px, -4]], {stroke: '#8e2b22', lineWidth: 5})),
    S([['M', -40, -330], ['L', 60, -450], ['L', 280, -450], ['L', 380, -330], ['Z']], '#5a2a24'),
    R(130, -420, 80, 70, {radius: 4, fill: '#f5d27a', lineWidth: 8}),
    R(110, -190, 120, 190, {radius: 2, fill: PAPER}), P([['M', 110, -190], ['L', 230, 0]], {lineWidth: 8}), P([['M', 230, -190], ['L', 110, 0]], {lineWidth: 8}),
  ], {x, y, scaleX: s, scaleY: s});
}
const silo = (x, y) => G([R(0, -420, 120, 420, {radius: 6, fill: '#c9ced3'}), S([['M', 0, -420], ['Q', 60, -500, 120, -420], ['Z']], '#9aa3ab'), ...[-340, -260, -180, -100].map(py => P([['M', 4, py], ['L', 116, py]], {stroke: '#9aa3ab', lineWidth: 5}))], {x, y});
const hay = (x, y) => G([S([['M', -90, 0], ['Q', -100, -130, 0, -140], ['Q', 100, -130, 90, 0], ['Z']], '#e9c46a'), ...[-40, 0, 40].map(px => P([['M', px, -110], ['L', px + 10, -20]], {stroke: '#c9a24a', lineWidth: 5}))], {x, y});
function fenceRow(x0, x1, y) {
  const out = [P([['M', x0, y - 95], ['L', x1, y - 95]], {stroke: '#8a5a33', lineWidth: 12}), P([['M', x0, y - 45], ['L', x1, y - 45]], {stroke: '#8a5a33', lineWidth: 12})];
  for (let px = x0; px <= x1; px += 130) out.push(R(px - 12, y - 135, 26, 135, {radius: 4, fill: '#c89a63', lineWidth: 7}));
  return out;
}
function farm(dur, {sky = '#bfe3f7', sun = true, sunY = 330, sunTo, light = 1} = {}) {
  const g = GROUND - 90;
  return [
    fill(sky),
    sun ? G([E(0, 0, 170, 170, {fill: '#ffd34d'}), ...[0, 45, 90, 135, 180, 225, 270, 315].map(a => P([['M', Math.cos(deg(a)) * 110, Math.sin(deg(a)) * 110], ['L', Math.cos(deg(a)) * 150, Math.sin(deg(a)) * 150]], {lineWidth: 10, stroke: '#e0a800'}))], {x: 1060, y: sunY, keys: sunTo !== undefined ? lin(dur, sunY, sunTo, 'y') : osc(dur, 6, 6)}) : null,
    cloud(260, 620, 0.8, dur, 50), cloud(900, 760, 0.6, dur, 70),
    E(200, g + 40, 900, 300, {fill: '#86b85a', stroke: 'none'}), E(1000, g + 60, 1000, 280, {fill: '#7aad50', stroke: 'none'}),
    band(g, 1200, '#9ccc65'),
    silo(40, g - 10), barn(170, g - 10, 0.85), tree(1110, g - 20, 0.9), hay(620, g - 10),
    ...fenceRow(480, 1240, g + 30),
    ...[[120, g + 140], [380, g + 200], [700, g + 160], [980, g + 230], [1150, g + 150], [520, g + 330], [860, g + 380]].map(([a, b]) => tuft(a, b)),
  ].filter(Boolean);
}
function office(dur) {
  return [
    fill('#efe6d4'), band(GROUND - 30, 1000, '#cbb995'), band(GROUND - 30, 16, '#a8956e'),
    R(560, 640, 360, 260, {radius: 6, fill: '#bfe3f7'}), ...[[595, 720, 60, 170], [675, 760, 55, 130], [750, 700, 70, 190], [840, 780, 45, 110]].map(([x, y, w, h]) => R(x, y, w, h, {radius: 2, fill: '#9fb6c9', lineWidth: 6})), P([['M', 740, 640], ['L', 740, 900]], {lineWidth: 8}),
    G([E(0, 0, 110, 110, {fill: PAPER}), G([P([['M', 0, 0], ['L', 0, -36]], {lineWidth: 7})], {keys: lin(dur, 0, deg(40), 'angle')}), P([['M', 0, 0], ['L', 24, 8]], {lineWidth: 7})], {x: 1040, y: 700}),
    R(980, 900, 200, 520, {radius: 6, fill: '#9c7a52'}), ...[950, 1110, 1260].map(y => R(998, y, 164, 130, {radius: 4, fill: '#c8955a', lineWidth: 7})),
    R(1000, 840, 70, 62, {radius: 6, fill: '#c8955a', lineWidth: 7}), R(1080, 820, 84, 82, {radius: 6, fill: '#d9a86c', lineWidth: 7}),
    G([R(-55, -100, 110, 100, {radius: 10, fill: '#a4693e', lineWidth: 8}), E(0, -140, 110, 80, {fill: '#5f9e48', lineWidth: 8}), E(-36, -176, 64, 72, {fill: '#6fb354', lineWidth: 8}), E(36, -180, 64, 72, {fill: '#6fb354', lineWidth: 8})], {x: 90, y: GROUND - 30, keys: osc(dur, 3, 1.5)}),
  ];
}
function desertNight(dur) {
  const g = GROUND - 60;
  const stars = [[120, 520], [300, 620], [520, 480], [760, 600], [880, 470], [1180, 560], [420, 760], [1000, 720], [200, 820]].map(([x, y], i) => E(x, y, 10, 10, {fill: '#fff6c8', stroke: 'none', keys: osc(dur, 1.4 + i * 0.2, 0.35, {prop: 'alpha', radians: false, base: 0.65})}));
  const cactus = (x, s) => G([R(-28, -300, 56, 300, {radius: 28, fill: '#3f6b46', lineWidth: 8}), R(-90, -220, 40, 120, {radius: 20, fill: '#3f6b46', lineWidth: 8}), R(-90, -120, 70, 36, {radius: 18, fill: '#3f6b46', lineWidth: 8}), R(50, -260, 40, 110, {radius: 20, fill: '#3f6b46', lineWidth: 8}), R(20, -170, 70, 36, {radius: 18, fill: '#3f6b46', lineWidth: 8})], {x, y: g + 10, scaleX: s, scaleY: s});
  return [
    fill('#141a36'), band(820, 400, '#1f2650'), band(1060, 300, '#2c2f5e'), ...stars,
    E(1030, 420, 150, 150, {fill: '#f4f1d0', lineWidth: 8}), E(1060, 400, 30, 30, {fill: '#e3dfb8', stroke: 'none'}),
    S([['M', -60, g], ['L', -60, 1040], ['L', 120, 1040], ['L', 180, 980], ['L', 380, 980], ['L', 440, g]], '#43304f', {lineWidth: 8}),
    S([['M', 760, g], ['L', 820, 1030], ['L', 1080, 1030], ['L', 1120, 990], ['L', 1340, 990], ['L', 1340, g]], '#3b2a4a', {lineWidth: 8}),
    band(g, 1000, '#5a4560'), band(g + 120, 140, '#2e2a35'), ...[0, 1, 2, 3, 4].map(i => R(40 + i * 270, g + 182, 140, 16, {radius: 4, fill: '#f2d36b', stroke: 'none'})),
    cactus(110, 0.9), cactus(1180, 0.75),
  ];
}

const WORDS = (w => w.words || w)(JSON.parse(fs.readFileSync('words.json', 'utf8')));
/** Mouth spans (shot-local) for the narration words that fall inside [shotStart, shotEnd]. */
function say(shotStart, shotEnd) {
  const spans = [];
  for (const w of WORDS) { if (w.end <= shotStart || w.start >= shotEnd) continue;
    const a = Math.max(0, w.start - shotStart), b = Math.min(shotEnd - shotStart - 0.01, w.end - shotStart);
    const last = spans.at(-1); if (last && a - last[1] < 0.22) last[1] = b; else spans.push([a, b]); }
  return spans;
}
const shots = [];
function shot(start, end, build) { shots.push({start, end, layers: build(Math.floor((end - start) * 1000 - 1) / 1000)}); }

// ---------- motion helpers (v4): frame-sampled keys so we can use easing, punches and shakes ----------
const clamp01 = v => Math.max(0, Math.min(1, v));
const eOut = v => 1 - Math.pow(1 - clamp01(v), 3);
const eInOut = v => { v = clamp01(v); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
const eBack = v => { v = clamp01(v); const c = 1.9; return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2); };
const mix = (a, b, v) => a + (b - a) * v;
const r3 = v => Math.round(v * 1000) / 1000;
// deterministic jitter
const jit = (t, seed) => Math.sin(t * 91.7 + seed * 12.9) * 0.6 + Math.sin(t * 47.3 + seed * 3.1) * 0.4;
const shake = (t, t0, len, amp) => { const k = t < t0 || t > t0 + len ? 0 : amp * (1 - (t - t0) / len); return {x: jit(t, 1) * k, y: jit(t, 2) * k}; };
/** Sample f(t) -> {x,y,s,a(deg),alpha} every frame from t0 to t1 into keys. */
function sample(f, t0, t1, step = 1 / 30) {
  const keys = []; let t = t0;
  while (t < t1 - 1e-6) { keys.push(t); t = r3(t + step); }
  keys.push(t1);
  return keys.map(t => { const v = f(t), k = {t: r3(t)};
    if (v.x !== undefined) k.x = r3(v.x); if (v.y !== undefined) k.y = r3(v.y);
    if (v.s !== undefined) { k.scaleX = r3(v.s); k.scaleY = r3(v.s); } if (v.a !== undefined) k.angle = r3(deg(v.a)); if (v.alpha !== undefined) k.alpha = r3(clamp01(v.alpha)); return k; });
}
/** Camera: f(t) -> {s, a, x, y}; zoom/rotation happen around (px, py). */
const camF = (layers, d, f, px = 640, py = 1000) => G(layers, {pivotX: px, pivotY: py, keys: sample(t => { const v = f(t); return {s: v.s ?? 1, a: v.a ?? 0, x: v.x ?? 0, y: v.y ?? 0}; }, 0, d)});
/** Text centred at (cx, cy) that slams in (scale 2.4 -> 1, ease back) at t0. */
function slam(text, cx, cy, size, t0, d, {color = INK, from = 2.4, tilt = 0, maxW = 1040, stamp = false} = {}) {
  const t = ctext(text, 0, -size * 0.68, size, {maxW, color});
  const parts = stamp ? [R(-t.w / 2 - 10, -size * 0.85, t.w + 20, size * 1.5, {radius: 14, fill: 'none', stroke: color, lineWidth: 12}), t] : [t];
  return G(parts, {x: cx, y: cy, from: t0, keys: sample(tt => ({s: mix(from, 1, eBack((tt - t0) / 0.16)), a: tilt, alpha: (tt - t0) / 0.05}), t0, d)});
}
const flash = (t0, len = 0.14, color = PAPER, peak = 0.85) => ({...fill(color), from: t0, keys: [{t: t0, alpha: peak}, {t: r3(t0 + len), alpha: 0}]});
const speedLines = (t0, t1, color = PAPER) => G(Array.from({length: 14}, (_, i) => { const a = i / 14 * Math.PI * 2; return P([['M', 640 + Math.cos(a) * 520, 1000 + Math.sin(a) * 880], ['L', 640 + Math.cos(a) * 1500, 1000 + Math.sin(a) * 2000]], {stroke: color, lineWidth: 18}); }),
  {from: t0, to: t1, alpha: 0.6});
const rays = (d, c1, c2, cx = 640, cy = 1000, speed = 20) => [fill(c1), G(Array.from({length: 12}, (_, i) => S([['M', 0, 0], ['L', Math.cos(deg(i * 30 - 7)) * 2600, Math.sin(deg(i * 30 - 7)) * 2600], ['L', Math.cos(deg(i * 30 + 7)) * 2600, Math.sin(deg(i * 30 + 7)) * 2600], ['Z']], c2, {stroke: 'none'})),
  {x: cx, y: cy, keys: [{t: 0, angle: 0}, {t: d, angle: deg(speed * d)}]})];
const desk = () => G([R(470, 1150, 720, 44, {radius: 8, fill: '#a9784b'}), R(500, 1194, 34, 230, {radius: 4, fill: '#8a5a33'}), R(1126, 1194, 34, 230, {radius: 4, fill: '#8a5a33'}), R(560, 1194, 520, 120, {radius: 6, fill: '#8a5a33'})]);
const sighPuff = (x, y, t0) => G([0, 1, 2].map(i => P([['M', i * 34, -i * 10], ['Q', i * 34 + 20, -i * 10 - 22, i * 34 + 40, -i * 10]], {stroke: '#8fa3b8', lineWidth: 8})),
  {x, y, from: t0, to: t0 + 0.9, keys: [{t: t0, alpha: 0, x, y}, {t: r3(t0 + 0.2), alpha: 1}, {t: r3(t0 + 0.9), alpha: 0, x: x + 90, y: y - 70}]});
/** Polaroid of Mike (headless, alive inside the photo). */
const photo = (d, extra = {}) => G([R(-300, -360, 600, 700, {radius: 8, fill: PAPER, lineWidth: 10}), R(-260, -320, 520, 520, {radius: 2, fill: '#ffe08a', lineWidth: 6}),
  E(0, 150, 420, 70, {fill: '#f2c85f', stroke: 'none'}), mike({x: -20, y: 160, scale: 1.0, idle: {dur: d}}), ctext('MIKE · 1945', 0, 230, 54, {maxW: 500})], extra);

// 1a · COLD OPEN (0–0.88): a headless rooster struts out of the dark into a spotlight; camera crashes in.
shot(0, 0.88, d => [camF([fill('#1d2033'), S([['M', 520, -60], ['L', 760, -60], ['L', 1180, 1560], ['L', 100, 1560], ['Z']], '#2c3150', {stroke: 'none'}), E(640, 1560, 1100, 200, {fill: '#3a4068', stroke: 'none'}),
  mike({x: 640, y: 1620, scale: 2.3, walk: {dur: d, period: 0.36}, flapAt: [0.3], move: lin(d, 380, 700)})], d,
  t => ({s: mix(1.55, 1.04, eOut(t / 0.45)), a: mix(-9, 0, eOut(t / 0.5)), ...shake(t, 0, 0.3, 14)}), 640, 1100),
  slam('¿Y SU CABEZA?', 640, 380, 104, 0.12, d, {color: PAPER})]);
// 1b · "Expediente catorce": box slams on the desk, the Becario sighs, the stamp hits on "catorce" (1.60).
shot(0.88, 2.72, d => [camF([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'cansado', idle: {dur: d}, talk: say(0.88, 2.72), headKeys: [{t: 0, angle: 0}, {t: 0.25, angle: deg(-4)}, {t: 0.9, angle: deg(6)}, {t: d, angle: deg(4)}]}),
  sighPuff(345, 780, 0.25), sighPuff(360, 800, 0.85),
  archiveBox({x: 860, y: 1150, scale: 0.9, lidOpenAt: 0.85, keys: [{t: 0, y: 640}, {t: 0.16, y: 1150}, {t: 0.24, y: 1110}, {t: 0.32, y: 1150}]}),
], d, t => ({s: mix(1.22, 1.32, eInOut(t / d)) + (t > 0.72 ? 0.07 * (1 - eOut((t - 0.72) / 0.25)) : 0), ...shake(t, 0.16, 0.18, 10), ...(t > 0.72 ? shake(t, 0.72, 0.25, 16) : {})}), 640, 1050),
  slam('EXP. 014', 640, 560, 150, 0.72, d, {color: RED, tilt: -8, stamp: true, from: 3})]);
// 1c · "Este pollo vivió un año y medio…": the photo spins out of the box, camera dives into it.
shot(2.72, 5.12, d => [camF([...office(d), desk(), archiveBox({x: 860, y: 1150, scale: 0.9}),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'sarcastico', look: 1, idle: {dur: d}, talk: say(2.72, 5.12), gestures: [{t0: 0.2, t1: 1.6, arm: 'R', shoulder: 70, elbow: 20}]}),
  photo(d, {x: 700, y: 1060, keys: sample(t => ({x: mix(860, 700, eOut(t / 0.4)), y: mix(1120, 1060, eOut(t / 0.4)), s: mix(0.15, 1, eBack(t / 0.42)), a: mix(-560, -4, eOut(t / 0.42))}), 0, d)}),
], d, t => ({s: mix(1.0, 1.42, eInOut((t - 0.5) / 1.8)), x: 0, y: 0}), 700, 1060),
  slam('1 AÑO Y MEDIO', 640, 380, 112, 1.04, d, {color: INK})]);
// 1d · "sin cabeza" (5.12): SMASH on the word — rays, flash, punch-in on the stump, shake.
const SX = 560, SY = 1720, SS = 2.4, STX = SX + 124 * SS, STY = SY - 329 * SS;
shot(5.12, 6.3, d => [camF([...rays(d, '#ffd34d', '#ffe9a0', STX, STY, 25), E(640, SY, 1300, 220, {fill: '#f2b93a', stroke: 'none'}),
  mike({x: SX, y: SY, scale: SS, idle: {dur: d}, flapAt: [0.05, 0.6]}),
  speedLines(0, 0.25, PAPER),
], d, t => ({s: mix(1.35, 1.0, eOut(t / 0.14)) + mix(0, 0.22, eInOut((t - 0.3) / 0.85)), a: mix(0, 5, eInOut((t - 0.3) / 0.85)), ...shake(t, 0, 0.35, 22)}), STX, STY),
  flash(0, 0.12, PAPER, 1), slam('SIN CABEZA', 640, 400, 150, 0.02, d, {color: RED, from: 1.8})]);
// 1e · "Sí." (6.30): whip-pan to the Becario's deadpan close-up, looking straight at us.
shot(6.3, 6.88, d => [camF([fill('#d9e8f5'), band(1700, 600, '#c0d3e6'),
  becario({x: 640, y: 2420, scale: 2.25, expr: 'serio', look: 0, idle: {dur: d}, talk: say(6.3, 6.88)})], d,
  t => ({x: mix(-520, 0, eOut(t / 0.12)), s: mix(1.0, 1.05, t / d)}), 640, 1050), slam('SÍ.', 640, 400, 170, 0.04, d, {color: INK, from: 1.8})]);
// 1f · "Sin cabeza." (6.88): he struts at the lens, Dutch angle rocking with each step, word-by-word.
shot(6.88, 8.1, d => [camF([...rays(d, '#ffe08a', '#fff1c2', 640, 1300, -18), E(640, 1700, 1400, 260, {fill: '#f2c85f', stroke: 'none'}),
  mike({x: 640, y: 1720, scale: 1.4, walk: {dur: d, period: 0.4}, flapAt: [0.5], move: sample(t => ({x: mix(520, 700, t / d), s: mix(1.3, 2.3, eInOut(t / d))}), 0, d)}),
], d, t => ({a: Math.sin(t * Math.PI / 0.4) * 7, s: 1.14, ...shake(t, 0.32, 0.15, 12)}), 640, 1300),
  slam('SIN', 640, 380, 150, 0.02, d, {color: INK, from: 1.8}), slam('CABEZA.', 640, 540, 150, 0.32, d, {color: RED})]);
// 1g · "Colorado, 1945": flashback. Sepia wash + film flicker, crane down from the sky; Mike (with head!) pecks.
shot(8.1, 10.8, d => [camF([...farm(d, {sunTo: 300, sunY: 420}), mike({x: 1010, y: GROUND + 40, scale: 0.8, head: true, idle: {dur: d}}),
  {...fill('#b8894a'), keys: [{t: 0, alpha: 0.55}, {t: 1.6, alpha: 0.28}, {t: d, alpha: 0.12}]},
  {...fill('#000000'), keys: sample(t => ({alpha: 0.05 + 0.04 * Math.abs(jit(t * 3, 5))}), 0, d, 1 / 15)},
], d, t => ({s: mix(1.45, 1.0, eInOut(t / 1.9)), y: mix(-260, 0, eInOut(t / 1.9))}), 640, 300),
  flash(0, 0.18, '#000000', 0.9), slam('COLORADO', 640, 380, 120, 0.06, d, {color: PAPER}), slam('1945', 640, 540, 130, 0.86, d, {color: RED, stamp: true, tilt: -6})]);
// 4 · The farmer walks out with his axe; the chicken (still with head) pecks by the chopping block.
shot(10.8, 12.8, d => [cam([...farm(d), choppingBlock(800, GROUND + 20, 1.2), mike({x: 1010, y: GROUND + 40, scale: 0.85, head: true, idle: {dur: d}}),
  granjero({x: 430, y: GROUND, scale: 1.05, expr: 'serio', axe: true, walk: {dur: 1.7}, idle: {dur: d}, move: lin(1.7, -140, 430)})], d)]);
// 5 · Puts the chicken on the block, winds up... chop. Cartoon: feathers + the head flies off, no blood.
const BX = 771, BY = GROUND, BS = 1.31, MS = 0.92, MY = GROUND - 150 * BS;
shot(12.8, 14.9, d => [cam([...farm(d), choppingBlock(BX, BY, BS),
  mike({x: BX, y: MY, scale: MS, head: true, idle: {dur: d}, to: 1.38}),
  mike({x: BX, y: MY, scale: MS, from: 1.38, idle: {dur: d}, flapAt: [1.45]}),
  granjero({x: 430, y: GROUND, scale: 1.05, expr: 'serio', axe: true, idle: {dur: d},
    poses: {R: [{t: 0, shoulder: 10, elbow: -10}, {t: 0.3, shoulder: 10, elbow: -10}, {t: 0.85, shoulder: 170, elbow: -40}, {t: 1.22, shoulder: 172, elbow: -45}, {t: 1.38, shoulder: 72, elbow: 30}, {t: d, shoulder: 70, elbow: 32}]}}),
  roosterHead({x: BX + 120 * MS, y: MY - 370 * MS, from: 1.38, keys: [{t: 1.38, x: BX + 120 * MS, y: MY - 370 * MS, angle: 0}, {t: 1.7, x: 1150, y: 560, angle: deg(260)}, {t: 2.05, x: 1420, y: 420, angle: deg(500)}]}),
  ...featherBurst(BX + 110 * MS, MY - 320 * MS, 1.38, 8, 240, d),
  {...fill(PAPER), alpha: 0.55, from: 1.38, to: 1.46},
], d), pop(T('¡ZAS!', 690, 420, 140, {color: RED}), 1.38, 0.08)]);
// 6 · ...and the chicken gets up (it had keeled over on the block).
shot(14.9, 16.45, d => [cam([...farm(d), choppingBlock(BX, BY, BS),
  granjero({x: 330, y: GROUND, scale: 1.0, expr: 'sorpresa', idle: {dur: d}, axe: true, armR: {shoulder: 5}, armL: {shoulder: 40, elbow: 30}, gestures: [{t0: 0.9, t1: 1.5, arm: 'L', shoulder: 120, elbow: 20}]}),
  ...featherBurst(BX, MY - 200, 0.0, 4, 120),
  mike({x: BX + 40, y: MY, scale: 1.0, idle: {dur: d}, flapAt: [0.9], move: [{t: 0, angle: deg(-82), y: MY + 60}, {t: 0.75, angle: deg(-82), y: MY + 60}, {t: 1.2, angle: 0, y: MY}]})], d), pop(T('SE LEVANTA', 100, 300, 110), 0.7)]);
// 7 · "...y sigue caminando, como si nada": the farmer's axe slips out of his hand (boing); camera tracks Mike.
shot(16.45, 18.6, d => [camF([...farm(d), granjero({x: 240, y: GROUND, scale: 1.0, expr: 'sorpresa', idle: {dur: d}, armL: {shoulder: 150, elbow: 15}, armR: {shoulder: 150, elbow: 15}, headKeys: osc(d, 0.6, 4)}),
  G([axeProp()], {x: 380, y: 920, keys: [{t: 0, y: 920, angle: deg(-30)}, {t: 0.25, y: 920, angle: deg(-30)}, {t: 0.55, y: 1330, angle: deg(-110)}, {t: 0.65, y: 1300, angle: deg(-100)}, {t: 0.75, y: 1330, angle: deg(-110)}]}),
  mike({x: 640, y: GROUND, scale: 1.15, walk: {dur: d}, move: lin(d, 560, 940)})], d,
  t => ({s: 1.12, x: mix(60, -140, eInOut(t / d)), ...shake(t, 0.55, 0.15, 8)}), 640, 1000), slam('COMO SI NADA', 640, 380, 104, 1.23, d)]);
// 8 · "Como yo los lunes": both drag themselves across the office (the Becario says it).
shot(18.6, 20.1, d => [cam([...office(d),
  becario({x: 380, y: GROUND, scale: 1.1, expr: 'cansado', walk: {dur: d, period: 0.85, stride: 14}, move: lin(d, 300, 470), headTilt: 10, talk: say(18.6, 20.1)}),
  mike({x: 900, y: GROUND + 20, scale: 0.9, walk: {dur: d, period: 0.6}, move: lin(d, 820, 960)})], d), slam('LUNES.', 640, 380, 150, 0.6, d, {color: RED, tilt: -4})]);
// 9 · "A la mañana siguiente… seguía vivo": sunrise time-lapse, then a crash zoom on Mike at "vivo".
shot(20.1, 22.45, d => [camF([...farm(d, {sky: '#ffd9a8', sunY: 900, sunTo: 520}), mike({x: 820, y: GROUND, scale: 1.15, idle: {dur: d}, flapAt: [1.72]}),
  granjero({x: 330, y: GROUND, scale: 1.0, expr: 'sorpresa', walk: {dur: 1.2}, idle: {dur: d}, move: lin(1.2, 120, 330)}),
  flash(1.7, 0.1, PAPER, 0.6)], d,
  t => ({s: t < 1.7 ? mix(1.0, 1.05, t / 1.7) : mix(1.05, 1.5, eOut((t - 1.7) / 0.18)), ...shake(t, 1.7, 0.3, 14)}), 940, 1150),
  T('AL DÍA SIGUIENTE…', 70, 300, 84), slam('¡VIVO!', 640, 520, 150, 1.7, d, {color: RED, tilt: 6})]);
// 10 · "¿Cómo?" — record scratch, Dutch crash-zoom on the Becario.
shot(22.45, 23.2, d => [camF([...office(d), becario({x: 640, y: 2080, scale: 1.75, expr: 'sorpresa', idle: {dur: d}, talk: say(22.45, 23.2), armL: {shoulder: 40, elbow: 120}, armR: {shoulder: 40, elbow: 120}})], d,
  t => ({s: mix(1.0, 1.22, eOut(t / 0.2)), a: mix(0, -7, eOut(t / 0.2)), ...shake(t, 0, 0.25, 12)}), 640, 1000), slam('¿CÓMO?', 640, 420, 140, 0.02, d, {color: RED, from: 1.5})]);
// 11a · X-ray: a scan line sweeps Mike; the brain stem lights up on "tronco del cerebro".
const XR = '#0f2a45', XL = '#6fd3ff';
shot(23.2, 26.16, d => [camF([fill(XR), ...Array.from({length: 9}, (_, i) => P([['M', 0, 300 + i * 220], ['L', 1280, 300 + i * 220]], {stroke: '#17395c', lineWidth: 4})), ...Array.from({length: 7}, (_, i) => P([['M', 40 + i * 200, 0], ['L', 40 + i * 200, 2300]], {stroke: '#17395c', lineWidth: 4})),
  mike({x: 520, y: 1700, scale: 2.1, idle: {dur: d}, alpha: 0.9}),
  G([E(0, 0, 70, 120, {fill: '#ff8fb1', stroke: '#ffffff', lineWidth: 8}), E(0, 0, 150, 220, {fill: 'none', stroke: XL, lineWidth: 6})], {x: 520 + 124 * 2.1, y: 1700 - 300 * 2.1, from: 1.85, keys: sample(t => ({s: mix(0.2, 1, eBack((t - 1.85) / 0.25)) * (1 + 0.06 * Math.sin(t * 9)), alpha: (t - 1.85) / 0.1}), 1.85, d)}),
  {...band(0, 26, XL), alpha: 0.75, keys: sample(t => ({y: mix(260, 1900, (t % 1.4) / 1.4)}), 0, d)},
], d, t => ({s: mix(1.0, 1.35, eInOut((t - 1.6) / 0.6))}), 520 + 124 * 2.1, 1700 - 300 * 2.1),
  T('RAYOS X', 70, 300, 70, {color: XL}), slam('TRONCO DEL CEREBRO', 640, 470, 84, 2.1, d, {color: PAPER})]);
// 11b · "...la parte que controla el corazón": a big heart beats on the cut, camera pulses with it.
shot(26.16, 27.72, d => [camF([...rays(d, '#ffe3e3', '#ffd0d0', 640, 1080, 12),
  G([S([['M', 0, 170], ['C', -330, -30, -180, -270, 0, -90], ['C', 180, -270, 330, -30, 0, 170], ['Z']], RED, {lineWidth: 12}), P([['M', -120, -110], ['Q', -150, -40, -100, 20]], {stroke: '#ff9a9a', lineWidth: 14})],
    {x: 640, y: 1080, keys: sample(t => { const b = (t - 0.95) % 0.75; return {s: 1.7 * (t < 0.95 ? mix(0.3, 1, eBack(t / 0.25)) : 1) + 1.7 * (t < 0.95 ? 0 : (b < 0.12 ? 0.14 * Math.sin(b / 0.12 * Math.PI) : b > 0.22 && b < 0.34 ? 0.08 * Math.sin((b - 0.22) / 0.12 * Math.PI) : 0))}; }, 0, d)}),
], d, t => ({s: 1.0 + 0.02 * Math.sin(t * 8)}), 640, 1080), slam('CORAZÓN', 640, 470, 130, 0.95, d, {color: RED})]);
// 11c · "...y la respiración": lungs inflate and deflate.
shot(27.72, 28.85, d => [camF([...rays(d, '#e3f1ff', '#d2e7fb', 640, 1080, -12),
  G([E(-130, 0, 220, 360, {fill: '#f6a6b2', lineWidth: 10}), E(130, 0, 220, 360, {fill: '#f6a6b2', lineWidth: 10}), P([['M', 0, -320], ['L', 0, -150], ['M', 0, -150], ['L', -70, -90], ['M', 0, -150], ['L', 70, -90]], {lineWidth: 12})],
    {x: 640, y: 1150, keys: sample(t => ({s: 1.35 * (t < 0.2 ? mix(0.3, 1, eBack(t / 0.2)) : 1 + 0.12 * Math.sin((t - 0.2) * Math.PI * 1.6))}), 0, d)}),
], d, t => ({s: 1.03}), 640, 1080), slam('RESPIRACIÓN', 600, 470, 110, 0.25, d, {color: '#2f6fb0', maxW: 900})]);
// 12 · "Lo lógico": the farmer feeds him with a dropper from his own hand, Mike on the block.
const FB = 400, FMS = 0.9, FMY = GROUND, FA = 92, FX = FB + 108 + 214 + 106;
shot(28.85, 32.5, d => [cam([...farm(d), mike({x: FB, y: FMY, scale: FMS, idle: {dur: d}}),
  granjero({x: FX, y: GROUND, scale: 1.05, expr: 'serio', idle: {dur: d},
    poses: {L: [{t: 0, shoulder: 10, elbow: 0}, {t: 0.7, shoulder: FA, elbow: 0}, {t: d, shoulder: FA, elbow: 0}]},
    armL: {shoulder: FA, hold: [{...dropperProp({dropsAt: [1.5, 2.3, 3.0], fall: 40, compensate: deg(-FA)}), from: 0}]}}),
], d), T('"LO LÓGICO"', 80, 300, 110)]);
// 13 · Straight down the neck (close-up): plaid sleeve + hand squeezing the bulb.
shot(32.5, 33.8, d => [cam([fill('#eaf4fb'), mike({x: 330, y: 1900, scale: 2.6, idle: {dur: d}}),
  G([P([['M', 1400, 560], ['L', 700, 700]], {lineWidth: 96}), P([['M', 1400, 560], ['L', 700, 700]], {stroke: '#c2412f', lineWidth: 78}), ...[0, 1, 2, 3].map(i => P([['M', 1300 - i * 150, 580 + i * 30], ['L', 1320 - i * 150, 660 + i * 30]], {stroke: '#8f2a1e', lineWidth: 6})),
     G([R(-26, 120, 52, 220, {radius: 16, fill: '#d9f1ff', lineWidth: 9}), P([['M', -10, 340], ['L', 0, 372], ['L', 10, 340]], {lineWidth: 8}),
        E(0, 70, 100, 120, {fill: TIE, lineWidth: 9, keys: [{t: 0.25, scaleX: 1, scaleY: 1}, {t: 0.42, scaleX: 0.8, scaleY: 0.8}, {t: 0.65, scaleX: 1, scaleY: 1}]}),
        E(30, 80, 110, 90, {lineWidth: 9}), ...[0, 1, 2].map(i => E(-30, 46 + i * 34, 46, 34, {lineWidth: 8})),
        {...E(0, 380, 30, 40, {fill: '#5fb7ef', lineWidth: 6}), from: 0.4, keys: [{t: 0.4, scaleX: 0.3, scaleY: 0.3, y: 360}, {t: 0.5, scaleX: 1, scaleY: 1, y: 370}, {t: 0.85, y: 560}]}],
       {x: 650, y: 560})],
    {keys: [{t: 0, x: 120, y: -60}, {t: 0.3, x: 0, y: 0}]}),
], d, 1, 1.08), T('POR EL CUELLO', 80, 300, 100, {color: RED})]);
// 14 · They named him Mike.
shot(33.8, 34.92, d => [cam([fill('#ffe9a8'), E(640, 1380, 800, 140, {fill: '#f2d68a', stroke: 'none'}), mike({x: 640, y: 1400, scale: 1.5, idle: {dur: d}, flapAt: [0.3]}), pop(sign('MIKE', 330, 520, 620, 200, {size: 150, color: RED, radius: 30}), 0.2)], d, 1, 1.07)]);
// 15 · Magazine star, then on tour.
shot(34.92, 36.12, d => [cam([fill('#2b2f3a'), ...[0, 1, 2, 3].map(i => E(160 + i * 320, 1500, 40, 40, {fill: '#ffe08a', stroke: 'none', alpha: 0, keys: [{t: 0.2 + i * 0.15, alpha: 0}, {t: 0.3 + i * 0.15, alpha: 1}, {t: 0.5 + i * 0.15, alpha: 0}]})),
  G([R(0, 0, 700, 980, {radius: 6, fill: PAPER}), R(0, 0, 700, 170, {radius: 6, fill: RED}), ctext('REVISTA', 350, 30, 100, {color: PAPER, maxW: 620}), ctext('Nº 1 · 1945', 350, 190, 40, {maxW: 600}), mike({x: 350, y: 780, scale: 1.2}), ctext('¡SIN CABEZA!', 350, 840, 80, {maxW: 620, color: RED})],
    {x: 290, y: 420, pivotX: 350, pivotY: 490, keys: [{t: 0, angle: deg(-8), scaleX: 0.8, scaleY: 0.8}, {t: 0.35, angle: deg(-3), scaleX: 1, scaleY: 1}, {t: d, angle: deg(-1), scaleX: 1.02, scaleY: 1.02}]})], d), flash(0.25, 0.1, PAPER, 0.7), flash(0.55, 0.1, PAPER, 0.6), flash(0.85, 0.1, PAPER, 0.5)]);
shot(36.12, 38.15, d => [cam([fill('#bfe3f7'), cloud(300, 640, 0.7, d, -120), cloud(950, 780, 0.5, d, -160),
  S([['M', -60, 1200], ['L', 200, 1000], ['L', 420, 1160], ['L', 700, 960], ['L', 1000, 1150], ['L', 1340, 1010], ['L', 1340, 1300], ['L', -60, 1300], ['Z']], '#c99a6a', {lineWidth: 8}),
  band(1290, 1000, '#d8c08e'), band(1380, 120, '#4a4a52'), ...[0, 1, 2, 3, 4, 5].map(i => R(i * 260 - 40, 1432, 120, 14, {radius: 4, fill: '#f2d36b', stroke: 'none', keys: lin(d, i * 260 - 40, i * 260 - 300)})),
  ...[0, 1, 2].map(i => G([R(-8, -300, 16, 300, {radius: 4, fill: '#8a5a33', lineWidth: 6}), P([['M', -40, -270], ['L', 40, -270]], {lineWidth: 8, stroke: '#8a5a33'})], {x: 200 + i * 520, y: 1300, keys: lin(d, 200 + i * 520, -140 + i * 520)})),
  G([R(-330, -330, 660, 300, {radius: 34, fill: '#ffd34d'}), R(-290, -300, 180, 110, {radius: 12, fill: '#d9f1ff'}), R(-90, -312, 400, 136, {radius: 12, fill: PAPER}), ctext('POLLO', 110, -304, 54, {maxW: 340, color: RED}), ctext('SIN CABEZA', 110, -248, 54, {maxW: 340, color: RED}),
     E(-200, -20, 120, 120, {fill: INK}), E(-200, -20, 50, 50, {fill: '#9aa3ab', lineWidth: 6}), E(200, -20, 120, 120, {fill: INK}), E(200, -20, 50, 50, {fill: '#9aa3ab', lineWidth: 6})],
    {x: 600, y: 1400, keys: osc(d, 0.35, 5, {prop: 'y', radians: false, base: 1400})}),
], d), T('GIRA POR', 80, 300, 100), T('EE. UU.', 80, 420, 110, {color: RED})]);
// 16 · People paid to see him: fair tent, ferris wheel, queue.
shot(38.15, 40.96, d => [cam([fill('#ffe2b8'), band(GROUND - 20, 900, '#e2c79b'),
  G([E(0, 0, 520, 520, {fill: 'none', lineWidth: 10}), ...[0, 45, 90, 135].map(a => P([['M', -Math.cos(deg(a)) * 260, -Math.sin(deg(a)) * 260], ['L', Math.cos(deg(a)) * 260, Math.sin(deg(a)) * 260]], {lineWidth: 6})),
     ...[0, 60, 120, 180, 240, 300].map(a => R(Math.cos(deg(a)) * 260 - 30, Math.sin(deg(a)) * 260 - 24, 60, 48, {radius: 8, fill: ['#d8352a', '#4f78b8', '#ffd34d'][a / 60 % 3], lineWidth: 6}))],
    {x: 1030, y: 700, alpha: 0.9, keys: lin(d, 0, deg(25), 'angle')}),
  ...[0, 1, 2, 3, 4, 5].map(i => R(260 + i * 130, 620, 130, 520, {radius: 0, fill: i % 2 ? PAPER : RED, lineWidth: 8})),
  S([['M', 230, 620], ['L', 640, 430], ['L', 1050, 620], ['Z']], RED, {lineWidth: 12}),
  R(330, 690, 620, 170, {radius: 14, fill: PAPER}), ctext('VEA AL POLLO', 640, 705, 64, {maxW: 560}), ctext('SIN CABEZA', 640, 780, 64, {maxW: 560, color: RED}),
  mike({x: 640, y: 1130, scale: 0.6, idle: {dur: d}}),
  person({who: 'civil', x: 130, y: GROUND, scale: 0.62, expr: 'sorpresa', idle: {dur: d}}), person({who: 'civil2', x: 290, y: GROUND, scale: 0.62, expr: 'contento', idle: {dur: d}, gestures: [{t0: 0.6, t1: 1.6, arm: 'R', shoulder: 100, elbow: 10}]}),
  person({who: 'civil2', x: 990, y: GROUND, scale: 0.62, expr: 'sorpresa', idle: {dur: d}}), person({who: 'civil', x: 1150, y: GROUND, scale: 0.62, expr: 'contento', idle: {dur: d}, gestures: [{t0: 1.3, t1: 2.4, arm: 'L', shoulder: 100, elbow: 10}]}),
  ...[[240, 980, 0.6], [1040, 960, 1.2], [160, 860, 1.8], [1120, 840, 2.3]].map(([x, y, t]) => pop(E(x, y, 70, 70, {fill: '#ffd34d', lineWidth: 8}), t)),
], d)]);
// 17 · Eighteen months.
shot(40.96, 43.42, d => [cam([fill('#eaf4fb'), R(240, 520, 800, 760, {radius: 20, fill: PAPER}), R(240, 520, 800, 180, {radius: 20, fill: RED}), ...[340, 500, 660, 820, 940].map(x => E(x, 520, 30, 50, {fill: '#9aa3ab', lineWidth: 6})),
  ...[['1', 0, 0.5], ['6', 0.5, 1.0], ['12', 1.0, 1.5], ['18', 1.5, 0]].map(([n, a, b]) => ctext(n, 640, 760, 300, {from: a, ...(b ? {to: b} : {}), color: n === '18' ? RED : INK})),
  ctext('MESES', 640, 1110, 110), mike({x: 1000, y: GROUND, scale: 0.65, walk: {dur: d}, move: lin(d, 930, 1080)})], d)]);
// 18 · The motel in Arizona (serious beat: no gore, no jokes).
shot(43.42, 46.0, d => [cam([...desertNight(d),
  G([R(0, -420, 720, 420, {radius: 6, fill: '#b5694d'}), S([['M', -30, -420], ['L', 750, -420], ['L', 720, -470], ['L', 0, -470], ['Z']], '#7a3f30'),
     ...[0, 1, 2, 3].map(i => G([R(40 + i * 170, -300, 110, 190, {radius: 4, fill: '#ffe08a', lineWidth: 8}), R(40 + i * 170, -300, 110, 190, {radius: 4, fill: '#3a2a20', stroke: 'none', alpha: i === 2 ? 0 : 0.0, keys: i === 1 ? [{t: 1.5, alpha: 0}, {t: 1.7, alpha: 0.7}] : undefined})]))],
    {x: 420, y: GROUND - 60}),
  R(230, 520, 30, 840, {radius: 6, fill: '#6b6f78', lineWidth: 7}),
  R(120, 560, 400, 170, {radius: 18, fill: '#22263a', stroke: '#ff5fa2', lineWidth: 12}), ctext('MOTEL', 320, 584, 100, {maxW: 340, color: '#ff5fa2', keys: [{t: 0, alpha: 1}, {t: 0.9, alpha: 1}, {t: 1.0, alpha: 0.3}, {t: 1.1, alpha: 1}, {t: 1.9, alpha: 1}, {t: 2.0, alpha: 0.3}, {t: 2.1, alpha: 1}]}),
  sign('VACANTE', 170, 760, 300, 84, {size: 50, fill: '#22263a', stroke: '#7ef0c9', color: '#7ef0c9', lineWidth: 8, radius: 12, pad: 24}),
], d, 1.06, 1.0, 640, 900), T('ARIZONA', 470, 300, 100, {color: PAPER})]);
shot(46.0, 48.86, d => [cam([fill('#4a3f63'), ...[0, 1, 2, 3, 4, 5, 6].map(i => R(i * 200 - 40, -60, 90, 2400, {radius: 0, fill: '#544870', stroke: 'none'})),
  R(820, 520, 300, 360, {radius: 6, fill: '#1c2140', lineWidth: 10}), {type: 'rect', x: 830, y: 530, w: 280, h: 340, radius: 0, fill: '#ff5fa2', stroke: 'none', alpha: 0.25, keys: osc(d, 1.1, 0.12, {prop: 'alpha', radians: false, base: 0.22})},
  band(GROUND - 20, 900, '#6b4f3a'),
  R(60, 1000, 460, 420, {radius: 10, fill: '#8a6a4a'}), ...[1080, 1240].map(y => G([R(90, 0, 400, 130, {radius: 6, fill: '#a7825c', lineWidth: 8}), E(290, 65, 30, 20, {fill: INK, stroke: 'none'})], {y, keys: y === 1080 ? [{t: 0.6, x: 0}, {t: 0.9, x: -80}] : [{t: 1.6, x: 0}, {t: 1.9, x: -80}]})),
  G([R(-20, -200, 40, 200, {radius: 6, fill: '#c9a24a', lineWidth: 7}), S([['M', -90, -200], ['L', 90, -200], ['L', 60, -300], ['L', -60, -300], ['Z']], '#f5d27a', {lineWidth: 8}), E(0, -230, 260, 220, {fill: '#fff3b0', stroke: 'none', alpha: 0.25})], {x: 290, y: 1000}),
  granjero({x: 760, y: GROUND, scale: 1.1, expr: 'agobiado', walk: {dur: d, period: 0.5, stride: 18}, move: [{t: 0, x: 900}, {t: d / 2, x: 650}, {t: d, x: 820}], headKeys: osc(d, 0.7, 8)}),
], d), T('¿Y EL GOTERO?', 80, 300, 104, {color: PAPER})]);
// 19 · "...had more fame than me."
shot(48.86, 51.56, d => [cam([...office(d), G([R(0, 0, 440, 580, {radius: 10, fill: PAPER}), R(0, 0, 440, 110, {radius: 10, fill: RED}), ctext('FAMOSO', 220, 16, 80, {color: PAPER, maxW: 380}), mike({x: 220, y: 500, scale: 0.75})], {x: 680, y: 500, keys: [{t: 0, y: 470}, {t: 0.4, y: 500}]}),
  becario({x: 320, y: GROUND, scale: 1.1, expr: 'agobiado', idle: {dur: d}, talk: say(48.86, 51.56), headKeys: [{t: 0.8, angle: 0}, {t: 1.3, angle: deg(-10)}, {t: d, angle: deg(-10)}], gestures: [{t0: 1.6, t1: 2.5, arm: 'R', shoulder: 70, elbow: 20}]}),
  pop(sign('SEGUIDORES: 3', 470, 1170, 480, 110, {size: 60}), 1.5)], d), T('MÁS FAMA', 80, 300, 110), T('QUE YO', 80, 420, 110, {color: RED})]);
// 20 · His town still throws him a festival.
shot(51.56, 54.46, d => [cam([fill('#bfe3f7'), cloud(250, 640, 0.6, d, 60),
  ...[[-40, 260, '#e6b34a'], [220, 300, '#8fbf6a'], [520, 240, '#d98a6a'], [760, 300, '#9fb6c9'], [1020, 280, '#e6b34a']].map(([x, w, c]) => G([R(0, -w * 2.2, w, w * 2.2, {radius: 4, fill: c}), R(w * 0.2, -w * 1.8, w * 0.25, w * 0.35, {radius: 4, fill: '#d9f1ff', lineWidth: 6}), R(w * 0.55, -w * 1.8, w * 0.25, w * 0.35, {radius: 4, fill: '#d9f1ff', lineWidth: 6})], {x, y: GROUND - 40})),
  band(GROUND - 40, 900, '#c9c3b6'),
  P([['M', -40, 560], ['Q', 640, 720, 1320, 560]], {lineWidth: 6}), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => G([S([['M', -30, 0], ['L', 30, 0], ['L', 0, 90], ['Z']], ['#d8352a', '#ffd34d', '#4f78b8', '#9ccc65'][i % 4], {lineWidth: 6})], {x: 90 + i * 150, y: 600 + Math.sin(i / 7 * Math.PI) * 70, pivotX: 0, pivotY: 0, keys: osc(d, 1.2 + i * 0.1, 6)})),
  sign('FESTIVAL DE MIKE', 300, 780, 680, 130, {size: 64, color: RED, radius: 14}),
  mike({x: 640, y: GROUND, scale: 1.2, walk: {dur: d, period: 0.5}, move: lin(d, 560, 720)}),
  person({who: 'civil', x: 190, y: GROUND, scale: 0.75, expr: 'contento', idle: {dur: d}, armL: {shoulder: 150}, armR: {shoulder: 150}, headKeys: osc(d, 0.5, 6)}),
  person({who: 'civil2', x: 1090, y: GROUND, scale: 0.75, expr: 'contento', idle: {dur: d}, gestures: [{t0: 0.4, t1: 2.4, arm: 'L', shoulder: 150, elbow: 10}]}),
], d), T('FESTIVAL', 80, 300, 110), T('CADA AÑO', 80, 420, 110, {color: RED})]);
// 21 · Open loop: the next case.
shot(54.46, 56.62, d => [cam([fill('#2b2f3a'), band(GROUND - 20, 900, '#3a3550'), R(840, 560, 300, 260, {radius: 8, fill: '#1c2140', lineWidth: 10}),
  archiveBox({x: 820, y: GROUND, scale: 1.15, label: 'EXP. 015', lidOpenAt: 0.8}),
  becario({x: 330, y: GROUND, scale: 1.12, expr: 'sarcastico', idle: {dur: d}, look: 1, talk: say(54.46, 56.62), gestures: [{t0: 0.6, t1: 2.0, arm: 'R', shoulder: 60, elbow: 40}]}),
  ...[0, 1, 2].map(i => mike({x: 690 + i * 150, y: 1180, scale: 0.42, head: false, alpha: 0, from: 1.0 + i * 0.3, move: [{t: 1.0 + i * 0.3, alpha: 0}, {t: 1.3 + i * 0.3, alpha: 0.55}]})),
], d), T('¿OTRO POLLO?', 80, 300, 110, {color: PAPER})]);

// 22 · Seamless loop: lights out, a headless rooster struts into the spotlight — the exact first frame of the video.
shot(56.62, 57.2425, d => [camF([fill('#1d2033'), S([['M', 520, -60], ['L', 760, -60], ['L', 1180, 1560], ['L', 100, 1560], ['Z']], '#2c3150', {stroke: 'none'}), E(640, 1560, 1100, 200, {fill: '#3a4068', stroke: 'none'}),
  mike({x: 380, y: 1620, scale: 2.3, walk: {dur: d, period: 0.36}, move: lin(d, -120, 380)})], d,
  t => ({s: mix(1.0, 1.55, eInOut(t / d)), a: mix(0, -9, eInOut(t / d))}), 640, 1100), flash(0, 0.12, '#000000', 1)]);

const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const F = (time, name, gain, max) => ({time, kind: 'file', path: `sfx/${name}.wav`, gain, ...(max ? {max} : {})});
const sfx = [
  // hook
  F(0.0, 'whoosh', 0.35), F(0.25, 'flap', 0.35, 0.6), F(0.88, 'whoosh', 0.3), F(1.04, 'stamp', 0.6), F(1.6, 'stamp', 0.9),
  F(2.72, 'whoosh', 0.35), {time: 3.76, kind: 'pop', gain: 0.14}, F(5.08, 'whoosh', 0.4), F(5.12, 'chop', 0.55), F(5.17, 'flap', 0.4, 0.7),
  F(6.28, 'whoosh', 0.35), F(6.9, 'stamp', 0.5), F(7.2, 'stamp', 0.6), F(7.38, 'flap', 0.3, 0.5), F(8.1, 'projector', 0.22), F(8.96, 'stamp', 0.7),
  // farm
  F(14.18, 'chop', 0.85), F(14.25, 'flap', 0.4, 0.8), F(15.8, 'flap', 0.35, 0.6), F(17.0, 'boing', 0.45),
  F(18.58, 'whoosh', 0.3), F(21.78, 'whoosh', 0.35), F(21.8, 'stamp', 0.6), F(21.85, 'flap', 0.35, 0.6), F(22.45, 'scratch', 0.55),
  // explainer
  {time: 23.3, kind: 'chime', gain: 0.08}, {time: 25.3, kind: 'pop', gain: 0.14}, F(26.14, 'whoosh', 0.3),
  {time: 27.11, kind: 'tap', gain: 0.3}, {time: 27.23, kind: 'tap', gain: 0.22}, F(27.7, 'whoosh', 0.3),
  // dropper, name, fame
  F(30.4, 'drop', 0.6), F(31.2, 'drop', 0.6), F(31.9, 'drop', 0.6), F(33.0, 'drop', 0.7), {time: 34.0, kind: 'chime', gain: 0.12},
  F(35.17, 'flash', 0.45), F(35.47, 'flash', 0.4), F(35.77, 'flash', 0.35), F(36.1, 'whoosh', 0.3), F(38.3, 'crowd', 0.35),
  {time: 41.5, kind: 'paper', gain: 0.12}, {time: 42.0, kind: 'paper', gain: 0.12}, {time: 42.5, kind: 'paper', gain: 0.12},
  {time: 46.7, kind: 'tap', gain: 0.1}, {time: 47.7, kind: 'tap', gain: 0.1},
  F(51.05, 'boing', 0.35), F(51.6, 'crowd', 0.4), {time: 51.7, kind: 'chime', gain: 0.1},
  // open loop
  F(54.44, 'whoosh', 0.3), {time: 55.3, kind: 'paper', gain: 0.15}, F(56.6, 'whoosh', 0.35), F(56.95, 'flap', 0.3, 0.3),
];
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: 0.4}, television: {enabled: false}, music: {path: 'music.mp3', gain: 0.1}, captions, shots, sfx}, null, 1));
console.log('shots', shots.length);
