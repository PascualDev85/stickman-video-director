// EXPEDIENTE 001 — «El hombre que vendió la Torre Eiffel» (Historias Sin Cabeza). Short 9:16.
// Cuts follow the real word timings of narration take A (pauses tightened). Times in comments = narration seconds.
import fs from 'node:fs';
import {becario, lustig, poisson, gendarme, chatarrero, caneProp, eiffel, caseFolder, P, E, R, G, S, deg, INK, PAPER, ctext, osc} from '../kit.mjs';
import {H, GROUND, RED, YEL, fill, band, lin, mix, r3, eOut, eInOut, eBack, shake, jit, sample, camF, cam, slam, popIn, flash, rays, cloud, vignette, office, desk, emptyWallet, makeEpisode, F} from '../lib.mjs';

const {shots, say, shot, mouth} = makeEpisode('words.json');
const VOICE = 57.155918, END = r3(VOICE + 0.4);
const BRONZE = '#a8743f', SKY = '#9fd3f2';

// ---------- props ----------
const sellSign = () => G([R(-270, -80, 540, 160, {radius: 14, fill: YEL, lineWidth: 10}), ctext('SE VENDE', 0, -62, 116, {maxW: 490, color: RED}),
  P([['M', -240, -84], ['L', -150, -170]], {lineWidth: 7}), P([['M', 240, -84], ['L', 150, -170]], {lineWidth: 7})], {y: -560, angle: deg(-6)});
const coin = (x, y, s = 1) => G([E(0, 0, 60, 60, {fill: '#f2c230', lineWidth: 6}), E(0, 0, 38, 38, {fill: 'none', stroke: '#c8941a', lineWidth: 5}), R(-4, -12, 8, 24, {radius: 3, fill: '#c8941a', stroke: 'none'})], {x, y, scaleX: s, scaleY: s});
const coinBurst = (x, y, t0, d, n = 9, spread = 340) => Array.from({length: n}, (_, i) => { const a = -150 + i * 120 / (n - 1), sp = spread * (0.7 + (i % 3) * 0.2);
  return G([coin(0, 0, 0.9 + (i % 2) * 0.3)], {from: t0, keys: sample(t => { const u = t - t0; return {x: x + Math.cos(deg(a)) * sp * eOut(u / 0.6), y: y + Math.sin(deg(a)) * sp * eOut(u / 0.6) + 300 * u * u, a: u * 400 * (i % 2 ? 1 : -1)}; }, t0, d)}); });
const bulb = () => G([...Array.from({length: 8}, (_, i) => P([['M', Math.cos(deg(i * 45)) * 90, Math.sin(deg(i * 45)) * 90 - 20], ['L', Math.cos(deg(i * 45)) * 130, Math.sin(deg(i * 45)) * 130 - 20]], {stroke: '#f2b81a', lineWidth: 10})),
  E(0, -20, 120, 130, {fill: '#fff07a', lineWidth: 8}), R(-30, 40, 60, 44, {radius: 6, fill: '#b8bcc4', lineWidth: 7}), P([['M', -14, 0], ['L', 0, -26], ['L', 14, 0]], {stroke: '#d8a21a', lineWidth: 6})]);
const briefcase = () => G([R(-90, -60, 180, 120, {radius: 12, fill: '#6b3e22', lineWidth: 8}), R(-30, -84, 60, 30, {radius: 10, fill: 'none', lineWidth: 8}), R(-14, -12, 28, 22, {radius: 4, fill: '#e9b93a', lineWidth: 5})]);
const envelope = () => G([R(-80, -50, 160, 100, {radius: 6, fill: PAPER, lineWidth: 7}), P([['M', -80, -50], ['L', 0, 10], ['L', 80, -50]], {lineWidth: 6}), coin(52, 32, 0.45)]);
const topHat = () => G([R(-84, -190, 168, 196, {radius: 10, fill: '#15171f', lineWidth: 8}), R(-84, -42, 168, 30, {fill: '#7a1f2b', lineWidth: 6}), E(0, 0, 300, 46, {fill: '#15171f', lineWidth: 8})]);
const sparkle = (x, y, s, t0, d) => G([S([['M', 0, -60], ['L', 14, -14], ['L', 60, 0], ['L', 14, 14], ['L', 0, 60], ['L', -14, 14], ['L', -60, 0], ['L', -14, -14], ['Z']], '#fffbe0', {lineWidth: 5})],
  {x, y, from: t0, keys: sample(t => ({s: s * Math.max(0.05, Math.sin(Math.min(Math.PI, (t - t0) / 0.5 * Math.PI))), a: (t - t0) * 120}), t0, d)});
/** Dashed thought bubble (what someone says that is not true). */
function lieBubble(cx, cy, rx, ry) {
  const dash = []; for (let i = 0; i < 28; i++) { const a0 = i / 28 * Math.PI * 2, a1 = a0 + Math.PI / 40;
    dash.push(P([['M', cx + Math.cos(a0) * rx, cy + Math.sin(a0) * ry], ['L', cx + Math.cos(a1) * rx, cy + Math.sin(a1) * ry]], {lineWidth: 10})); }
  return [E(cx, cy, rx * 2, ry * 2, {fill: PAPER, stroke: 'none'}), ...dash, E(cx - rx * 0.75, cy + ry * 1.1, 70, 50, {fill: PAPER, lineWidth: 8}), E(cx - rx * 0.95, cy + ry * 1.45, 40, 30, {fill: PAPER, lineWidth: 7})];
}
const scrapPile = () => G([...[[-150, 0, 20], [-60, -40, -30], [40, -20, 60], [120, 0, -10], [-20, -90, 10], [70, -110, -50]].map(([x, y, a]) => G([R(-90, -16, 180, 32, {radius: 4, fill: BRONZE, lineWidth: 6}), P([['M', -80, 0], ['L', 80, 0]], {stroke: '#6e4524', lineWidth: 4})], {x, y, angle: deg(a)})),
  ...[[-110, -30], [90, -60], [10, -140]].map(([x, y]) => E(x, y, 26, 26, {fill: '#8a8f96', lineWidth: 5}))]);
const newspaper = () => G([R(-220, -280, 440, 300, {radius: 4, fill: '#f6efdc', lineWidth: 8}), ctext('LE PETIT JOURNAL', 0, -264, 34, {maxW: 400}), P([['M', -200, -216], ['L', 200, -216]], {lineWidth: 5}),
  ctext('¡LA TORRE CUESTA', 0, -196, 40, {maxW: 400, color: RED}), ctext('UNA FORTUNA!', 0, -148, 40, {maxW: 400, color: RED}),
  ...[0, 1, 2, 3].map(i => P([['M', -200, -84 + i * 26], ['L', 200, -84 + i * 26]], {stroke: '#a59a80', lineWidth: 5})), eiffel({x: 150, y: -10, scale: 0.08})]);
const bills = (t0, d) => Array.from({length: 7}, (_, i) => G([R(-60, -30, 120, 60, {radius: 4, fill: '#9fd49a', lineWidth: 5}), E(0, 0, 30, 30, {fill: 'none', stroke: '#4a8a46', lineWidth: 4})],
  {from: t0 + i * 0.05, keys: sample(t => { const u = t - t0 - i * 0.05; return {x: 640 + (i - 3) * 150 + Math.sin(u * 4 + i) * 40, y: 300 + u * 520 + i * 40, a: Math.sin(u * 5 + i) * 40}; }, t0 + i * 0.05, d)}));

// ---------- sets ----------
function parisSky(dur, {sky = SKY, warm = false} = {}) {
  return [fill(sky), band(0, 500, warm ? '#ffcf9a' : '#b9e0f5'), cloud(220, 340, 0.8, dur, 50), cloud(1080, 520, 0.6, dur, -40)];
}
function roofs(y, color, seed = 1, h = 260) {
  const parts = []; let x = -60, i = 0;
  while (x < 1340) { const w = 150 + ((i * 37 + seed * 53) % 90), hh = h * (0.7 + ((i * 29 + seed * 17) % 40) / 100);
    parts.push(S([['M', x, y], ['L', x, y - hh], ['L', x + 24, y - hh - 60], ['L', x + w - 24, y - hh - 60], ['L', x + w, y - hh], ['L', x + w, y], ['Z']], color, {lineWidth: 6}),
      R(x + w * 0.6, y - hh - 110, 28, 60, {radius: 2, fill: color, lineWidth: 5}));
    for (let k = 0; k < 2; k++) parts.push(R(x + 26 + k * (w / 2 - 10), y - hh + 50, 34, 48, {radius: 3, fill: '#ffe6a0', lineWidth: 4}));
    x += w; i++; }
  return parts;
}
function hotel(dur) {
  return [fill('#7a2433'), ...Array.from({length: 12}, (_, i) => R(-40 + i * 120, -60, 40, H + 120, {radius: 0, fill: '#6c1f2d', stroke: 'none'})),
    band(1100, 400, '#4a1820'), ...[0, 1, 2, 3, 4].map(i => R(40 + i * 250, 1140, 200, 220, {radius: 8, fill: 'none', stroke: '#c9a24a', lineWidth: 5})),
    band(GROUND, 900, '#5a3a28'), band(GROUND + 30, 900, '#8a2a2a'),
    // window (left) with curtains
    R(70, 560, 250, 560, {radius: 6, fill: '#bfe3f7', lineWidth: 10}), P([['M', 195, 560], ['L', 195, 1120]], {lineWidth: 8}), P([['M', 70, 840], ['L', 320, 840]], {lineWidth: 8}),
    eiffel({x: 260, y: 1110, scale: 0.28}),
    S([['M', 40, 520], ['Q', 110, 800, 60, 1150], ['L', 20, 1150], ['L', 20, 520], ['Z']], '#c9a24a', {lineWidth: 6}), S([['M', 350, 520], ['Q', 280, 800, 330, 1150], ['L', 370, 1150], ['L', 370, 520], ['Z']], '#c9a24a', {lineWidth: 6}),
    R(20, 500, 350, 40, {radius: 8, fill: '#a07a2a', lineWidth: 7}),
    // painting + door
    R(520, 640, 300, 230, {radius: 4, fill: '#3a5a7a', stroke: '#c9a24a', lineWidth: 14}), S([['M', 540, 850], ['L', 620, 740], ['L', 680, 800], ['L', 740, 700], ['L', 800, 850], ['Z']], '#6a8a5a', {stroke: 'none'}),
    R(1060, 640, 210, 780, {radius: 8, fill: '#6b3e22', lineWidth: 9}), R(1090, 680, 150, 300, {radius: 6, fill: 'none', stroke: '#4a2a14', lineWidth: 6}), R(1090, 1020, 150, 300, {radius: 6, fill: 'none', stroke: '#4a2a14', lineWidth: 6}), E(1100, 1040, 26, 26, {fill: '#e9b93a', lineWidth: 5}),
    // chandelier (right)
    P([['M', 900, -60], ['L', 900, 330]], {lineWidth: 6}), G([E(0, 0, 150, 60, {fill: '#e9b93a', lineWidth: 7}), ...[-90, -45, 0, 45, 90].map(x => G([R(-8, -60, 16, 50, {radius: 3, fill: PAPER, lineWidth: 4}), S([['M', 0, -84], ['Q', 12, -66, 0, -58], ['Q', -12, -66, 0, -84], ['Z']], '#ffcf4a', {lineWidth: 3})], {x})), ...[-60, -20, 20, 60].map(x => E(x, 48, 18, 30, {fill: '#d8f1ff', lineWidth: 4}))], {x: 900, y: 380, keys: osc(dur, 2.4, 1.5)})];
}
const table = () => G([R(330, 1176, 800, 46, {radius: 6, fill: '#3b6b4a', lineWidth: 8}), R(345, 1222, 770, 210, {radius: 4, fill: '#2f5a3e', lineWidth: 8}), P([['M', 345, 1418], ['L', 1115, 1418]], {stroke: '#e9b93a', lineWidth: 8})]);
const dealers = (dur, set = 0) => {
  const looks = set ? [[3, 'serio'], [1, 'sorpresa'], [2, 'contento']] : [[1, 'contento'], [2, 'sorpresa'], [3, 'serio']];
  return looks.map(([n, e], i) => chatarrero(n, {x: 480 + i * 190, y: GROUND, scale: 0.8, expr: e, look: -1, idle: {dur}}));
};
function alcatraz(dur) {
  return [fill('#ffb36b'), band(-60, 420, '#ff8a5c'), band(-60, 200, '#a05a8a'), E(860, 1080, 300, 300, {fill: '#ffe08a', stroke: 'none'}), band(1150, 1200, '#3b5f8a'),
    ...[0, 1, 2, 3].map(i => P([['M', 100 + i * 280, 1250 + i * 60], ['L', 240 + i * 280, 1250 + i * 60]], {stroke: '#7fa3c8', lineWidth: 6})),
    S([['M', 120, 1160], ['L', 220, 1040], ['L', 420, 1010], ['L', 520, 960], ['L', 820, 960], ['L', 980, 1020], ['L', 1160, 1160], ['Z']], '#3a2f3f', {lineWidth: 8}),
    R(470, 840, 360, 130, {radius: 4, fill: '#4a3f52', lineWidth: 7}), ...[0, 1, 2, 3, 4, 5].map(i => R(490 + i * 55, 870, 26, 36, {radius: 2, fill: '#ffcf6a', stroke: 'none'})),
    R(320, 760, 50, 260, {radius: 4, fill: '#4a3f52', lineWidth: 7}), E(345, 750, 80, 44, {fill: '#ffe08a', lineWidth: 6}),
    G([P([['M', -30, 0], ['Q', -15, -16, 0, 0], ['Q', 15, -16, 30, 0]], {lineWidth: 6})], {x: 900, y: 600, keys: lin(dur, 900, 760)})];
}
const jail = () => [fill('#8d929a'), ...Array.from({length: 18}, (_, i) => R((i % 2) * 90 - 60 + (i % 6) * 0, 0, 0, 0, {})).slice(0, 0),
  ...Array.from({length: 22}, (_, r) => Array.from({length: 8}, (_, c) => R(-60 + c * 180 + (r % 2) * 90, 40 + r * 100, 170, 90, {radius: 4, fill: '#9aa0a8', stroke: '#7a7f86', lineWidth: 4}))).flat()];
const bars = () => [R(-60, 380, 1400, 40, {radius: 6, fill: '#3a3f47', lineWidth: 7}), ...Array.from({length: 8}, (_, i) => R(40 + i * 170, 380, 40, 1600, {radius: 8, fill: '#4a505a', lineWidth: 7}))];

// ---------- hook composition (also the loop target) ----------
const HOOK_S = 1.3, HOOK_A = -5, HPX = 640, HPY = 900;
const hookLayers = d => [...parisSky(d), ...roofs(GROUND - 120, '#c7b2a3', 2, 200), band(GROUND - 140, 1000, '#d9c9a8'), band(GROUND - 140, 18, '#b8a888'),
  eiffel({x: 690, y: GROUND - 60, scale: 0.86, extra: [sellSign()]}),
  lustig({x: 300, y: GROUND + 140, scale: 1.25, expr: 'picaro', look: 1, idle: {dur: d}, armR: {shoulder: 112, elbow: 6}, armL: {shoulder: 12, elbow: 8, hold: [caneProp()]}})];

// 1 · 0.00–4.00 · "Dicen que este hombre vendió la Torre Eiffel. Y no era suya."
shot(0, 3.95, d => [camF(hookLayers(d), d, t => ({s: mix(HOOK_S, 1.0, eOut(t / 0.55)), a: mix(HOOK_A, 0, eOut(t / 0.55)), ...shake(t, 0, 0.3, 10), ...(t > 2.97 ? shake(t, 2.97, 0.25, 14) : {})}), HPX, HPY),
  slam('Y NO ERA SUYA', 590, 430, 118, 2.97, d, {color: RED, stamp: true, tilt: -5, from: 1.6})]);
// 2 · 4.00–9.32 · "Expediente 001. Yo llevo meses sin cobrar… así que quiero saber cómo."
shot(3.95, 9.25, d => [camF([...office(d), desk(),
  becario({x: 290, y: GROUND - 20, scale: 1.0, expr: 'sarcastico', look: 1, idle: {dur: d}, talk: mouth(3.95, 9.25), gestures: [{t0: 2.95, t1: 3.95, arm: 'R', shoulder: 60, elbow: 70}]}),
  caseFolder({x: 760, y: 1040, scale: 0.62, keys: [{t: 0, y: 700}, {t: 0.16, y: 1040}, {t: 0.24, y: 1010}, {t: 0.32, y: 1040}]}),
  emptyWallet(540, 1010, 3.0, d, 0.9)], d,
  t => ({s: mix(1.08, 1.2, eInOut(t / d)), ...shake(t, 0.16, 0.2, 10), ...(t > 1.53 ? shake(t, 1.53, 0.25, 14) : {})}), 640, 1050),
  slam('EXP. 001', 590, 430, 140, 1.53, d, {color: RED, stamp: true, tilt: -7, from: 1.6})]);
// 3 · 9.32–11.55 · "París, 1925."
shot(9.25, 11.42, d => [camF([...parisSky(d, {warm: true}), eiffel({x: 640, y: GROUND - 40, scale: 0.8}), ...roofs(GROUND + 60, '#b98a72', 3, 300), ...roofs(GROUND + 260, '#8a5a4a', 4, 330), band(GROUND + 250, 1000, '#6e4436'),
  {...fill('#b8894a'), alpha: 0.18}], d, t => ({s: mix(1.35, 1.0, eInOut(t / 1.6)), y: mix(-220, 0, eInOut(t / 1.6))}), 640, 400),
  slam('PARÍS, 1925', 590, 430, 130, 0.13, d, {color: PAPER, stamp: true, tilt: -4})]);
// 4 · 11.55–16.55 · "Victor Lustig lee que mantener la torre cuesta una fortuna… y se le ocurre una idea."
const NP_X = 560, NP_Y = 1010;
shot(11.42, 16.76, d => [camF([...parisSky(d), ...roofs(GROUND - 80, '#c7b2a3', 5, 240), band(GROUND - 100, 1000, '#d9c9a8'),
  eiffel({x: 1060, y: GROUND - 100, scale: 0.5}),
  R(-60, 560, 1400, 30, {radius: 0, fill: '#7a1f2b', stroke: 'none'}), ...Array.from({length: 8}, (_, i) => S([['M', -60 + i * 180, 590], ['L', 30 + i * 180, 590], ['Q', -15 + i * 180, 680, -60 + i * 180, 590], ['Z']], i % 2 ? PAPER : '#c8202a', {lineWidth: 6})),
  E(900, GROUND - 160, 260, 40, {fill: '#8a5a33', lineWidth: 7}), R(888, GROUND - 160, 24, 160, {radius: 4, fill: '#6b4423', lineWidth: 6}),
  lustig({x: NP_X, y: GROUND + 40, scale: 1.1, expr: 'serio', idle: {dur: d}, armL: {shoulder: 60, elbow: 70}, armR: {shoulder: 60, elbow: 70}, to: 3.67}),
  lustig({x: NP_X, y: GROUND + 40, scale: 1.1, expr: 'picaro', look: 1, idle: {dur: d}, armL: {shoulder: 60, elbow: 70}, armR: {shoulder: 60, elbow: 70}, from: 3.67}),
  G([newspaper()], {x: NP_X, y: NP_Y + 120}),
  ...coinBurst(NP_X, NP_Y - 80, 2.88, d),
  G([popIn(bulb(), 5.09, d)], {x: NP_X + 10, y: 300}), flash(5.09, 0.12, '#fff7c0', 0.6)], d,
  t => ({s: t < 1.4 ? mix(1.05, 1.0, t / 1.4) : t < 3.4 ? mix(1.0, 1.75, eInOut((t - 1.4) / 0.6)) : mix(1.75, 1.0, eInOut((t - 3.4) / 0.45)), ...(t > 2.88 ? shake(t, 2.88, 0.3, 10) : {}), ...(t > 5.09 ? shake(t, 5.09, 0.2, 8) : {})}), NP_X, NP_Y - 40)]);
// 5a · 16.55–18.50 · "Imprime papeles falsos del Gobierno,"
const stampTool = (x, y, t0, d) => G([R(-70, -10, 140, 40, {radius: 6, fill: '#3a3f47', lineWidth: 7}), R(-16, -140, 32, 130, {radius: 8, fill: '#8a5a33', lineWidth: 7}), E(0, -150, 70, 50, {fill: '#a0703c', lineWidth: 7})],
  {x, keys: sample(t => ({y: t < t0 ? y - 500 : t < t0 + 0.12 ? mix(y - 500, y, (t - t0) / 0.12) : t < t0 + 0.3 ? y : mix(y, y - 500, eOut((t - t0 - 0.3) / 0.25))}), 0, d)});
const stampMark = (text, x, y, t0, d, a = -8) => G([popIn(G([R(-150, -46, 300, 92, {radius: 8, fill: 'none', stroke: RED, lineWidth: 10}), ctext(text, 0, -34, 60, {color: RED, maxW: 270})]), t0, d, 0.1)], {x, y, angle: deg(a)});
shot(16.76, 18.38, d => [camF([fill('#b98a5a'), ...Array.from({length: 9}, (_, i) => P([['M', -60, 300 + i * 220], ['Q', 640, 330 + i * 220, 1340, 290 + i * 220]], {stroke: '#a77a4c', lineWidth: 6})),
  G([R(-330, -430, 660, 860, {radius: 6, fill: PAPER, lineWidth: 9}), ctext('RÉPUBLIQUE FRANÇAISE', 0, -390, 42, {maxW: 560}), ctext('Ministère des Postes', 0, -330, 34, {maxW: 560}),
    ...[0, 1, 2, 3, 4, 5].map(i => P([['M', -260, -230 + i * 60], ['L', 260, -230 + i * 60]], {stroke: '#b9b0a0', lineWidth: 6}))], {x: 640, y: 1030, angle: deg(-3)}),
  stampMark('OFICIAL', 470, 1230, 0.24, d), stampMark('OFICIAL', 800, 1300, 0.74, d, 6), stampMark('APROBADO', 640, 1420, 1.24, d, -4),
  stampTool(470, 1230, 0.12, d), stampTool(800, 1300, 0.62, d), stampTool(640, 1420, 1.12, d)], d,
  t => ({s: mix(1.0, 1.08, t / d), a: mix(-2, 2, t / d), ...shake(t, 0.24, 0.15, 10), ...shake(t, 0.74, 0.15, 10), ...shake(t, 1.24, 0.15, 10)}), 640, 1100),
  slam('FALSOS', 590, 430, 140, 0.77, d, {color: RED, stamp: true, tilt: 6})]);
// 5b · 18.50–22.02 · "se presenta como alto cargo del Ministerio de Correos y Telégrafos…"
shot(18.38, 21.9, d => [camF([...rays(d, '#2a2e4a', '#353a5c', 640, 1000, 10), band(GROUND, 900, '#1d2033'),
  lustig({x: 420, y: GROUND + 60, scale: 1.25, expr: 'picaro', look: 1, idle: {dur: d}, armR: {shoulder: 95, elbow: 30}, armL: {shoulder: 12, hold: [caneProp()]}}),
  G([popIn(G([R(-250, -150, 500, 300, {radius: 14, fill: PAPER, lineWidth: 10}), R(-250, -150, 500, 60, {radius: 14, fill: '#1f3c7a', lineWidth: 10}), ctext('MINISTÈRE', 0, -140, 40, {maxW: 460, color: PAPER}),
    ctext('V. LUSTIG', 0, -60, 64, {maxW: 460}), ctext('Subdirector general', 0, 20, 40, {maxW: 460, color: '#3a3f47'}), ctext('Correos y Telégrafos', 0, 70, 40, {maxW: 460, color: '#3a3f47'})]), 0.2, d)], {x: 860, y: 920, keys: sample(t => ({a: 5 + Math.sin(t * 3) * 4, y: 920 + Math.sin(t * 2.2) * 14}), 0, d)}),
  sparkle(1040, 760, 0.8, 1.0, d), sparkle(720, 1080, 0.6, 1.7, d), sparkle(1080, 1120, 0.7, 2.4, d)], d,
  t => ({s: mix(1.0, 1.15, eInOut(t / d)), a: mix(-2, 1, eInOut(t / d))}), 640, 1000),
  slam('ALTO CARGO', 590, 430, 130, 0.95, d, {color: YEL, tilt: -4})]);
// 6 · 22.02–25.42 · "y reúne a los mayores chatarreros de París en un hotel de lujo."
shot(21.9, 25.33, d => [camF([...hotel(d), ...dealers(d), poisson({x: 1050, y: GROUND, scale: 0.72, expr: 'contento', look: -1, idle: {dur: d}}), table(),
  lustig({x: 230, y: GROUND + 40, scale: 0.95, expr: 'picaro', look: 1, idle: {dur: d}, gestures: [{t0: 0.3, t1: 2.8, arm: 'R', shoulder: 80, elbow: 20}], armL: {shoulder: 10, hold: [caneProp()]}})], d,
  t => ({s: 1.08, x: mix(70, -70, eInOut(t / d))}), 640, 1000),
  slam('HOTEL DE LUJO', 590, 450, 108, 2.6, d, {color: YEL, tilt: -3, from: 1.3})]);
// 7 · 25.42–28.95 · "Su secreto: el Gobierno va a vender la torre como chatarra."
shot(25.33, 28.87, d => [camF([...hotel(d), poisson({x: 1050, y: GROUND, scale: 0.8, expr: 'contento', look: -1, idle: {dur: d}}), chatarrero(2, {x: 840, y: GROUND, scale: 0.8, expr: 'sorpresa', look: -1, idle: {dur: d}}), table(),
  lustig({x: 330, y: GROUND + 60, scale: 1.12, expr: 'picaro', look: 1, idle: {dur: d}, armR: {shoulder: 40, elbow: 90}, armL: {shoulder: 10, hold: [caneProp()]}}),
  G([...lieBubble(780, 640, 300, 230)], {from: 1.11, keys: sample(t => ({alpha: (t - 1.11) / 0.15, s: mix(0.6, 1, eBack((t - 1.11) / 0.25))}), 1.11, d), pivotX: 780, pivotY: 640}),
  G([eiffel({x: 780, y: 820, scale: 0.24})], {from: 1.2, to: 2.97, keys: sample(t => ({alpha: (t - 1.2) / 0.15}), 1.2, 2.97)}),
  G([popIn(scrapPile(), 2.97, d, 0.18)], {x: 780, y: 760}),
  ...coinBurst(840, 900, 3.05, d, 6, 220), ...coinBurst(1050, 920, 3.15, d, 6, 220)], d,
  t => ({s: mix(1.0, 1.1, t / d), x: mix(30, -30, eInOut(t / d)), ...(t > 2.97 ? shake(t, 2.97, 0.25, 12) : {})}), 640, 900),
  slam('CHATARRA', 780, 1010, 90, 2.97, d, {color: RED, tilt: -6})]);
// 8 · 28.95–30.42 · "Pero… discreción."
shot(28.87, 30.32, d => [camF([fill('#1e0e12'), E(620, 1150, 1100, 1300, {fill: '#4a2228', stroke: 'none'}), E(620, 1150, 760, 900, {fill: '#6a3238', stroke: 'none'}), lustig({x: 640, y: GROUND + 1000, scale: 2.2, expr: 'picaro', look: 1, idle: {dur: d}, poses: {R: [{t: 0, shoulder: 8, elbow: 0}, {t: 0.3, shoulder: -78.8, elbow: 114.1}, {t: d, shoulder: -78.8, elbow: 114.1}]},
    armR: {hold: [R(-10, 96, 20, 66, {radius: 9, fill: PAPER, lineWidth: 6})]}}),
  {...fill('#000000'), keys: sample(t => ({alpha: 0.08 + 0.06 * Math.abs(jit(t * 2, 3))}), 0, d, 1 / 15)}], d,
  t => ({s: mix(1.0, 1.14, eInOut(t / d)), a: mix(0, -3, eInOut(t / d))}), 640, 1050),
  G([ctext('shhh…', 0, 0, 90, {color: '#c9c3b8', maxW: 400})], {x: 930, y: 560, from: 0.69, keys: sample(t => ({alpha: (t - 0.69) / 0.3, y: 560 - (t - 0.69) * 60}), 0.69, d)})]);
// 9 · 30.42–34.74 · "André Poisson quiere el trato tanto… que encima le paga un soborno."
shot(30.32, 34.58, d => [camF([...hotel(d),
  lustig({x: 320, y: GROUND + 60, scale: 1.12, expr: 'picaro', look: 1, idle: {dur: d}, armL: {shoulder: 10, hold: [caneProp()]}, gestures: [{t0: 2.0, t1: 3.9, arm: 'R', shoulder: 70, elbow: 10}]}),
  poisson({x: 900, y: GROUND + 60, scale: 1.1, expr: 'nervioso', look: -1, idle: {dur: d}, headKeys: osc(d, 0.5, 4), gestures: [{t0: 1.5, t1: 3.9, arm: 'L', shoulder: 75, elbow: 10}]}),
  G([briefcase()], {from: 1.45, keys: sample(t => ({x: mix(760, 560, eInOut((t - 1.69) / 0.5)), y: 1090 - Math.sin(clamp((t - 1.69) / 0.5) * Math.PI) * 60, alpha: (t - 1.45) / 0.15}), 1.45, d)}),
  G([envelope()], {from: 3.2, keys: sample(t => ({x: mix(780, 520, eInOut((t - 3.25) / 0.4)), y: 1300 + Math.sin(t * 20) * 4, alpha: (t - 3.2) / 0.1}), 3.2, d)}),
  popIn(G([R(-210, -46, 420, 92, {radius: 10, fill: PAPER, lineWidth: 8}), ctext('ANDRÉ POISSON', 0, -32, 54, {maxW: 380})]), 0.05, d, 0.22, 3.3)].map((l, i, a) => i === a.length - 1 ? G([l], {x: 640, y: 560}) : l), d,
  t => ({s: t < 3.6 ? mix(1.0, 1.06, t / 3.6) : mix(1.06, 1.22, eOut((t - 3.6) / 0.3)), x: t < 3.6 ? mix(20, -20, t / 3.6) : -20, ...(t > 3.66 ? shake(t, 3.66, 0.25, 12) : {})}), 640, 1250),
  slam('+ SOBORNO', 590, 560, 120, 3.66, d, {color: RED, stamp: true, tilt: -6})]);
// 10 · 34.74–38.24 · "Lustig cobra y, en menos de una hora, va camino de Austria."
const train = () => G([R(0, -220, 380, 200, {radius: 18, fill: '#2f3a4a', lineWidth: 9}), R(250, -330, 110, 120, {radius: 10, fill: '#3a4a5a', lineWidth: 8}), R(40, -300, 60, 80, {radius: 6, fill: '#2f3a4a', lineWidth: 7}),
  S([['M', 380, -20], ['L', 440, -20], ['L', 380, -100], ['Z']], '#c8202a', {lineWidth: 7}), ...[70, 190, 310].map(x => E(x, -10, 90, 90, {fill: '#c8202a', lineWidth: 8})),
  R(-560, -260, 520, 240, {radius: 14, fill: '#7a1f2b', lineWidth: 9}), ...[-500, -340, -180].map(x => R(x, -230, 110, 90, {radius: 8, fill: '#ffe6a0', lineWidth: 6})),
  ...[-480, -120].map(x => E(x, -10, 80, 80, {fill: '#3a3f47', lineWidth: 7})), R(-330, -110, 120, 26, {fill: '#c8202a', lineWidth: 4}), R(-330, -84, 120, 26, {fill: PAPER, lineWidth: 4}), R(-330, -58, 120, 26, {fill: '#c8202a', lineWidth: 4}),
  G([E(0, 0, 50, 50, {fill: PAPER, lineWidth: 5}), R(-24, -64, 48, 50, {radius: 4, fill: '#15171f', lineWidth: 4}), R(-34, -20, 68, 10, {fill: '#15171f', stroke: 'none'})], {x: -445, y: -180})]);
shot(34.58, 38.1, d => [camF([fill('#cfe6f2'), ...roofs(1100, '#c7b2a3', 6, 220), band(1100, 1200, '#b9b0a0'), band(1330, 26, '#5a5f6a'), band(1390, 26, '#5a5f6a'), ...Array.from({length: 16}, (_, i) => R(-60 + i * 90, 1316, 30, 120, {radius: 2, fill: '#6b4423', stroke: 'none'})),
  R(-60, GROUND + 40, 1400, 300, {radius: 0, fill: '#d9c9a8', lineWidth: 7}),
  lustig({x: 300, y: GROUND + 260, scale: 1.0, expr: 'picaro', look: 1, walk: {dur: d, period: 0.36, stride: 30}, move: lin(1.7, 260, 1500), armR: {hold: [G([briefcase()], {y: 160, scaleX: 0.7, scaleY: 0.7})]}}),
  G([train()], {x: -800, y: 1330, scaleX: 1.5, scaleY: 1.5, from: 1.5, keys: sample(t => ({x: mix(-500, 1900, (t - 1.5) / 1.7)}), 1.5, d)})], d,
  t => ({s: 1.05, ...(t > 1.6 ? shake(t, 1.6, 1.2, 6) : {})}), 640, 1200),
  slam('< 1 HORA', 590, 430, 110, 2.1, d, {color: INK, tilt: 4}), slam('¡A AUSTRIA!', 590, 580, 120, 3.06, d, {color: RED, stamp: true, tilt: -5})]);
// 11 · 38.10–41.53 · "¿Poisson? Le da tanta vergüenza que ni lo denuncia."
const blushCheek = (x, y, t0, d) => G([E(0, 0, 150, 84, {fill: '#ff6b7a', stroke: 'none'}), ...[-36, 0, 36].map(dx => P([['M', dx - 14, 16], ['L', dx + 14, -16]], {stroke: '#e0263a', lineWidth: 7}))],
  {x, y, from: t0, keys: sample(t => ({alpha: mix(0, 0.85, eInOut((t - t0) / 0.6)), s: mix(0.6, 1.1, eOut((t - t0) / 0.6))}), t0, d)});
const steam = (x, t0, d) => Array.from({length: 3}, (_, i) => G([E(0, 0, 70, 60, {fill: PAPER, lineWidth: 6}), E(30, -20, 50, 44, {fill: PAPER, lineWidth: 5})],
  {from: t0 + i * 0.35, keys: sample(t => { const u = t - t0 - i * 0.35; return {x: x + Math.sin(u * 6) * 18, y: 840 - u * 380, alpha: 1 - u / 1.1, s: 0.6 + u * 0.6}; }, t0 + i * 0.35, d)}));
shot(38.1, 41.53, d => [camF([fill('#f0d9b5'), ...rays(d, '#f0d9b5', '#f5e4c6', 640, 1100, 8).slice(1),
  G([E(640, 1196, 540, 500, {fill: '#ff4a4a', stroke: 'none'})], {from: 1.6, keys: sample(t => ({alpha: mix(0, 0.22, eInOut((t - 1.6) / 0.8))}), 1.6, d)}),
  poisson({x: 640, y: GROUND + 960, scale: 2.0, expr: 'nervioso', look: 0, idle: {dur: d}, headKeys: sample(t => ({a: t > 1.6 ? Math.sin(t * 40) * 1.6 : 0}), 0, d)}),
  blushCheek(484, 1262, 1.6, d), blushCheek(796, 1262, 1.6, d), ...steam(470, 2.1, d), ...steam(810, 2.3, d),
  G([popIn(G([R(-170, -110, 340, 220, {radius: 8, fill: PAPER, lineWidth: 8}), ctext('DENUNCIA', 0, -90, 58, {maxW: 300}), ...[0, 1, 2].map(i => P([['M', -130, -10 + i * 36], ['L', 130, -10 + i * 36]], {stroke: '#b9b0a0', lineWidth: 5}))]), 2.7, d)], {x: 890, y: 980, angle: deg(8), scaleX: 0.8, scaleY: 0.8}),
  G([P([['M', -170, -110], ['L', 170, 110]], {stroke: RED, lineWidth: 26}), P([['M', 170, -110], ['L', -170, 110]], {stroke: RED, lineWidth: 26})], {x: 890, y: 980, from: 2.95, keys: sample(t => ({s: mix(1.3, 0.8, eOut((t - 2.95) / 0.12))}), 2.95, d)})], d,
  t => ({s: t < 1.6 ? mix(1.0, 1.04, t / 1.6) : mix(1.04, 1.16, eInOut((t - 1.6) / 1.2)), ...(t > 2.95 ? shake(t, 2.95, 0.2, 10) : {})}), 640, 1150),
  slam('¿POISSON?', 590, 430, 120, 0.19, d, {color: INK, tilt: -4})]);
// 12 · 41.66–44.16 · "Así que Lustig vuelve y lo intenta otra vez."
shot(41.53, 44.15, d => [camF([...hotel(d), ...dealers(d, 1), chatarrero(1, {x: 1050, y: GROUND, scale: 0.72, expr: 'contento', look: -1, idle: {dur: d}}), table(),
  lustig({x: 230, y: GROUND + 40, scale: 0.95, expr: 'picaro', look: 1, idle: {dur: d}, gestures: [{t0: 0.2, t1: 2.3, arm: 'R', shoulder: 80, elbow: 20}], armL: {shoulder: 10, hold: [caneProp()]}})], d,
  t => ({s: mix(1.12, 1.04, eOut(t / 0.4)), x: mix(-60, 60, eInOut(t / d))}), 640, 1000),
  slam('¡OTRA VEZ!', 590, 480, 128, 2.04, d, {color: RED, stamp: true, tilt: 5})]);
// 13 · 44.16–48.10 · "Pero esta vez alguien avisa a la policía… y él escapa por poco."
shot(44.15, 48.0, d => [camF([...hotel(d), ...dealers(d, 1), table(),
  gendarme({x: 1150, y: GROUND + 40, scale: 1.0, expr: 'serio', look: -1, walk: {dur: 2.2, period: 0.4}, from: 1.5, move: [{t: 1.5, x: 1450}, {t: 2.2, x: 1080}], armL: {shoulder: 95, elbow: 0}}),
  lustig({x: 640, y: GROUND + 40, scale: 1.0, expr: 'sorpresa', look: 1, idle: {dur: d}, to: 2.6}),
  lustig({x: 640, y: GROUND + 40, scale: 1.0, expr: 'picaro', look: -1, walk: {dur: d, period: 0.3, stride: 34}, from: 2.6, to: 3.16, move: sample(t => ({x: mix(640, 200, eInOut((t - 2.6) / 0.5)), y: GROUND + 40 - Math.sin(clamp((t - 2.6) / 0.56) * Math.PI) * 220}), 2.6, 3.16)}),
  G([topHat()], {from: 3.16, keys: sample(t => ({x: 210, y: t < 3.4 ? 780 : mix(780, 1300, eInOut((t - 3.4) / 0.4)), a: Math.sin((t - 3.16) * 10) * 12}), 3.16, d)})], d,
  t => ({s: t < 2.6 ? 1.04 : mix(1.04, 1.12, eOut((t - 2.6) / 0.4)), x: t < 2.6 ? 0 : mix(0, 120, eOut((t - 2.6) / 0.5)), ...(t > 1.76 ? shake(t, 1.76, 0.25, 10) : {}), ...(t > 2.6 ? shake(t, 2.6, 0.3, 8) : {})}), 640, 1000),
  slam('¡POLICÍA!', 590, 430, 120, 1.76, d, {color: PAPER, stamp: true, tilt: -4, until: 3.35}), slam('¡POR POCO!', 590, 600, 120, 3.4, d, {color: RED, stamp: true, tilt: 5})]);
// 14a · 48.10–50.22 · "Años después acabó en Alcatraz…"
shot(48.0, 50.05, d => [cam([...alcatraz(d), G([S([['M', 0, 0], ['L', 900, -90], ['L', 900, 90], ['Z']], '#fff4b0', {stroke: 'none'})], {x: 345, y: 750, alpha: 0.35, keys: [{t: 0, angle: deg(-40)}, {t: d, angle: deg(60)}]})], d, 1.0, 1.15, 640, 1000), slam('ALCATRAZ', 590, 430, 130, 1.38, d, {color: PAPER, stamp: true, tilt: -4})]);
// 14b · 50.22–51.64 · "por falsificar billetes."
shot(50.05, 51.5, d => [camF([...jail(), lustig({x: 640, y: GROUND + 380, scale: 1.4, expr: 'agobiado', look: 0, idle: {dur: d}}), ...bars(), ...bills(0.1, d)], d, t => ({s: mix(1.1, 1.0, eOut(t / 0.3))}), 640, 1000),
  slam('BILLETES FALSOS', 590, 560, 100, 0.88, d, {color: RED, stamp: true, tilt: -5})]);
// 15 · 51.64–54.14 · "La torre, por cierto, sigue en su sitio."
shot(51.5, 53.95, d => [camF([...rays(d, '#9fd3f2', '#b9e0f5', 640, 700, 12), band(GROUND - 60, 1000, '#d9c9a8'), eiffel({x: 640, y: GROUND - 40, scale: 0.9}),
  sparkle(420, 520, 0.9, 0.3, d), sparkle(900, 760, 0.7, 0.8, d), sparkle(560, 1100, 0.8, 1.4, d), sparkle(820, 380, 0.6, 1.9, d)], d,
  t => ({s: mix(1.18, 1.0, eInOut(t / 1.2)), y: mix(120, 0, eInOut(t / 1.2))}), 640, 700),
  slam('EN SU SITIO', 590, 430, 110, 2.06, d, {color: INK, tilt: -3})]);
// 16 · 53.95–57.00 · "Expediente cerrado. ¿Y yo? Sigo sin cobrar."
shot(53.95, 57.0, d => [camF([...office(d), desk(),
  becario({x: 290, y: GROUND - 20, scale: 1.0, expr: 'sarcastico', look: 1, idle: {dur: d}, talk: mouth(53.95, 57.0), to: 1.61}),
  becario({x: 290, y: GROUND - 20, scale: 1.0, expr: 'cansado', look: 0, idle: {dur: d}, talk: mouth(53.95, 57.0), talkDur: d, from: 1.61}),
  caseFolder({x: 760, y: 1040, scale: 0.62}), G([popIn(G([R(-190, -60, 380, 120, {radius: 10, fill: 'none', stroke: RED, lineWidth: 14}), ctext('CERRADO', 0, -40, 84, {color: RED, maxW: 340})]), 0.73, d, 0.12)], {x: 760, y: 1070, angle: deg(-12)}),
  emptyWallet(540, 1010, 2.32, d, 0.9)], d,
  t => ({s: t < 1.61 ? mix(1.08, 1.12, t / 1.61) : mix(1.12, 1.32, eInOut((t - 1.61) / 0.6)), ...(t > 0.73 ? shake(t, 0.73, 0.25, 14) : {})}), 520, 1000)]);
// 17 · 57.16–END · loop: whip back to the hook's first frame.
shot(57.0, END, d => [camF(hookLayers(d), d, t => ({s: mix(1.0, HOOK_S, eOut(t / d)), a: mix(4, HOOK_A, eOut(t / d))}), HPX, HPY), flash(0, 0.1, PAPER, 0.7)]);

function clamp(v) { return Math.max(0, Math.min(1, v)); }
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const sfx = [
  F(0.0, 'whoosh', 0.35), F(2.97, 'stamp', 0.7),
  F(3.95, 'whoosh', 0.3), F(4.11, 'stamp', 0.55), F(5.48, 'stamp', 0.9), F(6.98, 'boing', 0.3),
  F(9.25, 'whoosh', 0.3), F(9.38, 'stamp', 0.6),
  F(11.42, 'whoosh', 0.25), F(14.3, 'kaching', 0.4), F(16.51, 'boing', 0.25),
  F(16.76, 'whoosh', 0.25), F(17.0, 'stamp', 0.7), F(17.5, 'stamp', 0.7), F(18.0, 'stamp', 0.7),
  F(18.38, 'whoosh', 0.25), {time: 18.6, kind: 'chime', gain: 0.1},
  F(21.9, 'whoosh', 0.3), F(24.5, 'stamp', 0.5),
  F(25.33, 'whoosh', 0.25), F(28.3, 'chop', 0.45), F(28.4, 'kaching', 0.35),
  F(28.87, 'whoosh', 0.2),
  F(30.32, 'whoosh', 0.25), F(32.01, 'whoosh', 0.2), F(33.98, 'kaching', 0.7),
  F(34.58, 'whoosh', 0.3), F(36.1, 'train', 0.6), F(37.64, 'stamp', 0.5),
  F(38.1, 'whoosh', 0.25), F(41.05, 'scratch', 0.45),
  F(41.53, 'whoosh', 0.3), F(43.57, 'stamp', 0.7),
  F(45.85, 'whistle', 0.6), F(46.75, 'whoosh', 0.4), F(47.55, 'boing', 0.35),
  F(48.0, 'whoosh', 0.3), F(49.38, 'stamp', 0.6), F(50.05, 'whoosh', 0.3), F(50.93, 'stamp', 0.6),
  F(51.5, 'whoosh', 0.3), {time: 51.9, kind: 'chime', gain: 0.12},
  F(53.95, 'whoosh', 0.25), F(54.68, 'stamp', 0.9), F(56.3, 'boing', 0.3), F(57.0, 'whoosh', 0.4),
];
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: 0.4}, television: {enabled: false}, music: {path: 'music.mp3', gain: 0.1}, captions, shots, sfx}, null, 1));
console.log('shots', shots.length, 'end', END);
