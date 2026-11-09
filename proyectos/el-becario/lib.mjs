// Shared episode helpers for "Historias Sin Cabeza" (camera, punches, text slams, transitions, sets).
// Extracted from EXP 002 (Mike) so every new episode starts from the same toolbox.
import fs from 'node:fs';
import {becario, person, osc, P, E, R, G, S, deg, INK, PAPER, ctext} from './kit.mjs';

export const H = 1280 * 1920 / 1080, GROUND = 1420, RED = '#e0261b', YEL = '#ffd21f';
export const T = (text, x, y, size = 96, o = {}) => ({type: 'text', text, x, y, size, bold: true, color: INK, w: 1120 - x, ...o});
export const fill = c => ({type: 'rect', x: -60, y: -60, w: 1400, h: H + 120, radius: 0, fill: c, stroke: 'none'});
export const band = (y, h, c) => ({type: 'rect', x: -60, y, w: 1400, h, radius: 0, fill: c, stroke: 'none'});
export const lin = (dur, a, b, prop = 'x', t0 = 0) => [{t: t0, [prop]: a}, {t: dur, [prop]: b}];
export const clamp01 = v => Math.max(0, Math.min(1, v));
export const eOut = v => 1 - Math.pow(1 - clamp01(v), 3);
export const eInOut = v => { v = clamp01(v); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
export const eBack = v => { v = clamp01(v); const c = 1.9; return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2); };
export const mix = (a, b, v) => a + (b - a) * v;
export const r3 = v => Math.round(v * 1000) / 1000;
export const jit = (t, seed) => Math.sin(t * 91.7 + seed * 12.9) * 0.6 + Math.sin(t * 47.3 + seed * 3.1) * 0.4;
export const shake = (t, t0, len, amp) => { const k = t < t0 || t > t0 + len ? 0 : amp * (1 - (t - t0) / len); return {x: jit(t, 1) * k, y: jit(t, 2) * k}; };
/** Sample f(t) -> {x,y,s,sx,sy,a(deg),alpha} every frame from t0 to t1 into keys. */
export function sample(f, t0, t1, step = 1 / 30) {
  const keys = []; let t = t0;
  while (t < t1 - 1e-6) { keys.push(t); t = r3(t + step); }
  keys.push(t1);
  return keys.map(t => { const v = f(t), k = {t: r3(t)};
    if (v.x !== undefined) k.x = r3(v.x); if (v.y !== undefined) k.y = r3(v.y);
    if (v.s !== undefined) { k.scaleX = r3(v.s); k.scaleY = r3(v.s); }
    if (v.sx !== undefined) k.scaleX = r3(Math.max(0.001, v.sx)); if (v.sy !== undefined) k.scaleY = r3(Math.max(0.001, v.sy));
    if (v.a !== undefined) k.angle = r3(deg(v.a)); if (v.alpha !== undefined) k.alpha = r3(clamp01(v.alpha)); return k; });
}
/** Camera: f(t) -> {s, a, x, y}; zoom/rotation happen around (px, py). */
export const camF = (layers, d, f, px = 640, py = 1000) => G(layers, {pivotX: px, pivotY: py, keys: sample(t => { const v = f(t); return {s: v.s ?? 1, a: v.a ?? 0, x: v.x ?? 0, y: v.y ?? 0}; }, 0, d)});
/** Default camera for a cut: 5% punch settling in 0.18 s, then a slow push. */
export const cam = (layers, d, from = 1, to = 1.05, px = 640, py = 1000) => camF(layers, d, t => ({s: (t < 0.18 && d > 0.5 ? mix(from * 1.05, from, eOut(t / 0.18)) : mix(from, to, t / d))}), px, py);
/** Text centred at (cx, cy) that slams in (scale `from` -> 1, ease back) at t0. */
export function slam(text, cx, cy, size, t0, d, {color = INK, from = 1.6, tilt = 0, maxW = 900, stamp = false, until} = {}) {
  const t = ctext(text, 0, -size * 0.68, size, {maxW, color});
  const parts = stamp ? [R(-t.w / 2 - 10, -size * 0.85, t.w + 20, size * 1.5, {radius: 14, fill: 'none', stroke: color, lineWidth: 12}), t] : [t];
  const end = until ? Math.min(until, d) : d;
  return G(parts, {x: cx, y: cy, from: t0, ...(until ? {to: end} : {}), keys: sample(tt => ({s: mix(from, 1, eBack((tt - t0) / 0.16)), a: tilt, alpha: (tt - t0) / 0.05}), t0, end)});
}
/** Pop a layer in at t0 (scale 0 -> 1 with overshoot) around its own origin. */
export const popIn = (layer, t0, d, len = 0.22, until) => G([layer], {from: t0, ...(until ? {to: until} : {}), keys: sample(t => ({s: mix(0.05, 1, eBack((t - t0) / len))}), t0, until || d)});
export const flash = (t0, len = 0.14, color = PAPER, peak = 0.85) => ({...fill(color), from: t0, keys: [{t: t0, alpha: peak}, {t: r3(t0 + len), alpha: 0}]});
export const rays = (d, c1, c2, cx = 640, cy = 1000, speed = 20, n = 12) => [fill(c1), G(Array.from({length: n}, (_, i) => { const a = i * 360 / n, w = 180 / n * 0.45;
  return S([['M', 0, 0], ['L', Math.cos(deg(a - w)) * 2600, Math.sin(deg(a - w)) * 2600], ['L', Math.cos(deg(a + w)) * 2600, Math.sin(deg(a + w)) * 2600], ['Z']], c2, {stroke: 'none'}); }),
  {x: cx, y: cy, keys: [{t: 0, angle: 0}, {t: d, angle: deg(speed * d)}]})];
export const speedLines = (t0, t1, color = PAPER, cx = 640, cy = 1000) => G(Array.from({length: 14}, (_, i) => { const a = i / 14 * Math.PI * 2; return P([['M', cx + Math.cos(a) * 520, cy + Math.sin(a) * 880], ['L', cx + Math.cos(a) * 1500, cy + Math.sin(a) * 2000]], {stroke: color, lineWidth: 18}); }), {from: t0, to: t1, alpha: 0.6});
export const cloud = (x, y, s, dur, dx = 60) => G([E(0, 0, 220, 90, {stroke: 'none'}), E(-70, 10, 140, 70, {stroke: 'none'}), E(70, 14, 150, 70, {stroke: 'none'}), E(10, -30, 130, 80, {stroke: 'none'})], {x, y, scaleX: s, scaleY: s, alpha: 0.95, keys: lin(dur, x, x + dx)});
/** Darkened edges to focus the centre. */
export const vignette = (alpha = 0.35) => G([S([['M', -60, -60], ['L', 1340, -60], ['L', 1340, H + 60], ['L', -60, H + 60], ['Z'], ['M', 640, 220], ['Q', 1320, 220, 1320, 1100], ['Q', 1320, 2050, 640, 2050], ['Q', -40, 2050, -40, 1100], ['Q', -40, 220, 640, 220], ['Z']], '#000000', {stroke: 'none'})], {alpha});

// ---------- the Archive office (recurring set) ----------
export function office(dur) {
  return [
    fill('#efe6d4'), band(GROUND - 30, 1000, '#cbb995'), band(GROUND - 30, 16, '#a8956e'),
    R(560, 640, 360, 260, {radius: 6, fill: '#bfe3f7'}), ...[[595, 720, 60, 170], [675, 760, 55, 130], [750, 700, 70, 190], [840, 780, 45, 110]].map(([x, y, w, h]) => R(x, y, w, h, {radius: 2, fill: '#9fb6c9', lineWidth: 6})), P([['M', 740, 640], ['L', 740, 900]], {lineWidth: 8}),
    G([E(0, 0, 110, 110, {fill: PAPER}), G([P([['M', 0, 0], ['L', 0, -36]], {lineWidth: 7})], {keys: lin(dur, 0, deg(40), 'angle')}), P([['M', 0, 0], ['L', 24, 8]], {lineWidth: 7})], {x: 1040, y: 700}),
    R(980, 900, 200, 520, {radius: 6, fill: '#9c7a52'}), ...[950, 1110, 1260].map(y => R(998, y, 164, 130, {radius: 4, fill: '#c8955a', lineWidth: 7})),
    R(1000, 840, 70, 62, {radius: 6, fill: '#c8955a', lineWidth: 7}), R(1080, 820, 84, 82, {radius: 6, fill: '#d9a86c', lineWidth: 7}),
    G([R(-55, -100, 110, 100, {radius: 10, fill: '#a4693e', lineWidth: 8}), E(0, -140, 110, 80, {fill: '#5f9e48', lineWidth: 8}), E(-36, -176, 64, 72, {fill: '#6fb354', lineWidth: 8}), E(36, -180, 64, 72, {fill: '#6fb354', lineWidth: 8})], {x: 90, y: GROUND - 30, keys: osc(dur, 3, 1.5)}),
  ];
}
export const desk = () => G([R(470, 1150, 720, 44, {radius: 8, fill: '#a9784b'}), R(500, 1194, 34, 230, {radius: 4, fill: '#8a5a33'}), R(1126, 1194, 34, 230, {radius: 4, fill: '#8a5a33'}), R(560, 1194, 520, 120, {radius: 6, fill: '#8a5a33'})]);
/** Empty wallet with a moth flying out (the "sin cobrar" gag). */
export function emptyWallet(x, y, t0, d, s = 1) {
  return G([R(-110, -60, 220, 120, {radius: 14, fill: '#7a4a2a', lineWidth: 8}), R(-96, -50, 192, 50, {radius: 8, fill: '#5c3820', lineWidth: 6}),
    G([S([['M', 0, 0], ['L', -34, -22], ['L', -26, 10], ['Z']], '#b8b0a0', {lineWidth: 4}), S([['M', 0, 0], ['L', 34, -22], ['L', 26, 10], ['Z']], '#b8b0a0', {lineWidth: 4}), E(0, 2, 10, 24, {fill: '#6a645a', stroke: 'none'})],
      {from: t0 + 0.15, keys: sample(t => ({x: Math.sin((t - t0) * 9) * 40, y: -40 - (t - t0) * 260, a: Math.sin((t - t0) * 14) * 25}), t0 + 0.15, d)})],
    {x, y, scaleX: s, scaleY: s, from: t0, keys: sample(t => ({s: s * mix(0.2, 1, eBack((t - t0) / 0.2))}), t0, d)});
}

// ---------- shots, words, sfx ----------
export function makeEpisode(wordsPath = 'words.json') {
  const WORDS = (w => w.words || w)(JSON.parse(fs.readFileSync(wordsPath, 'utf8'))).map(w => ({...w, text: w.word ?? w.text}));
  const shots = [];
  /** Mouth spans (shot-local) for the narration words inside [a, b]. */
  const say = (a, b) => { const spans = [];
    for (const w of WORDS) { if (w.end <= a || w.start >= b) continue; const s = Math.max(0, w.start - a), e = Math.min(b - a - 0.01, w.end - a);
      const last = spans.at(-1); if (last && s - last[1] < 0.22) last[1] = e; else spans.push([s, e]); }
    return spans; };
  const shot = (start, end, build) => shots.push({start, end, layers: build(Math.floor((end - start) * 1000 - 1) / 1000)});
  const at = word => { const w = WORDS.find(x => x.text.replace(/[^\p{L}\d]/gu, '').toLowerCase() === word.toLowerCase()); if (!w) throw new Error('word not found: ' + word); return w.start; };
  /** Audio-driven mouth for [a, b]: pass as `talk` to a character. Needs mouth-env.json (30 fps, 0..1). */
  const ENV = fs.existsSync('mouth-env.json') ? JSON.parse(fs.readFileSync('mouth-env.json', 'utf8')) : null;
  const mouth = (a, b) => ({fps: 30, env: ENV.slice(Math.round(a * 30), Math.round(b * 30) + 1)});
  return {WORDS, shots, say, shot, at, mouth};
}
export const F = (time, name, gain, max) => ({time, kind: 'file', path: `sfx/${name}.wav`, gain, ...(max ? {max} : {})});
/** Comic speech bubble with tail pointing to (tx, ty), centred at (x, y). */
export function bubble(text, x, y, tx, ty, t0, d, {size = 56, maxW = 420, until} = {}) {
  const t = ctext(text, 0, -size * 0.62, size, {maxW}), w = Math.max(t.w + 60, 200), h = size * 1.6;
  const body = G([S([['M', -24, h / 2 - 6], ['L', tx - x, ty - y], ['L', 30, h / 2 - 6], ['Z']], PAPER, {lineWidth: 7}), R(-w / 2, -h / 2, w, h, {radius: h / 2, fill: PAPER, lineWidth: 8}), t]);
  return G([popIn(body, t0, until || d, 0.2)], {x, y, ...(until ? {from: t0, to: until} : {})});
}
