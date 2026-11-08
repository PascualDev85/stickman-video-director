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
const cam = (layers, dur, from = 1, to = 1.05, px = 640, py = 1000) => G(layers, {pivotX: px, pivotY: py, keys: [{t: 0, scaleX: from, scaleY: from}, {t: dur, scaleX: to, scaleY: to}]});
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

const shots = [];
function shot(start, end, build) { shots.push({start, end, layers: build(Math.floor((end - start) * 1000 - 1) / 1000)}); }

// 1 · Hook: big headless Mike struts in; El Becario at his desk opens case 014.
shot(0, 5.12, d => [cam([
  ...office(d),
  archiveBox({x: 420, y: GROUND - 20, scale: 0.6, lidOpenAt: 1.0}),
  becario({x: 190, y: GROUND - 20, scale: 0.72, expr: 'cansado', idle: {dur: d}, gestures: [{t0: 0.9, t1: 2.4, arm: 'R', shoulder: 55, elbow: 30}]}),
  mike({x: 840, y: GROUND + 40, scale: 1.35, walk: {dur: 2.6}, idle: {dur: d}, move: lin(2.6, 1080, 800)}),
], d), T('18 MESES', 70, 290, 130), T('SIN CABEZA', 70, 430, 130, {color: RED})]);
// 2 · "Sí. Sin cabeza."
shot(5.12, 6.84, d => [cam([...office(d), becario({x: 640, y: 2080, scale: 1.75, expr: 'sorpresa', idle: {dur: d}, armL: {shoulder: 150, elbow: 15}, armR: {shoulder: 150, elbow: 15}, headKeys: osc(d, 0.5, 3)})], d, 1, 1.08), T('¿SIN CABEZA?', 120, 300, 110)]);
shot(6.84, 8.1, d => [cam([fill('#ffe9a8'), E(640, 1300, 900, 160, {fill: '#f2d68a', stroke: 'none'}), mike({x: 620, y: 1380, scale: 2.1, walk: {dur: d}, move: lin(d, 560, 690)})], d), T('SIN CABEZA.', 150, 300, 120, {color: RED})]);
// 3 · Colorado, 1945: establishing farm shot, slow pan.
shot(8.1, 10.8, d => [cam(farm(d, {sunTo: 300, sunY: 420}), d, 1.08, 1.0, 400, 1000), T('COLORADO', 70, 300, 110), pop(T('1945', 70, 430, 110, {color: RED}), 0.8)]);
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
// 7 · ...and keeps walking, like nothing happened.
shot(16.45, 18.6, d => [cam([...farm(d), granjero({x: 240, y: GROUND, scale: 1.0, expr: 'sorpresa', idle: {dur: d}, armL: {shoulder: 150, elbow: 15}, armR: {shoulder: 150, elbow: 15}, headKeys: osc(d, 0.6, 4)}),
  mike({x: 640, y: GROUND, scale: 1.15, walk: {dur: d}, move: lin(d, 560, 940)})], d), T('COMO SI NADA', 80, 300, 104)]);
// 8 · "Como yo los lunes": both drag themselves across the office.
shot(18.6, 20.1, d => [cam([...office(d),
  becario({x: 380, y: GROUND, scale: 1.1, expr: 'cansado', walk: {dur: d, period: 0.85, stride: 14}, move: lin(d, 300, 470), headTilt: 10}),
  mike({x: 900, y: GROUND + 20, scale: 0.9, walk: {dur: d, period: 0.6}, move: lin(d, 820, 960)})], d), T('LUNES.', 400, 300, 140, {color: RED})]);
// 9 · Next morning: still alive.
shot(20.1, 22.45, d => [cam([...farm(d, {sky: '#ffd9a8', sunY: 900, sunTo: 560}), mike({x: 820, y: GROUND, scale: 1.15, idle: {dur: d}, flapAt: [1.4]}),
  granjero({x: 330, y: GROUND, scale: 1.0, expr: 'sorpresa', walk: {dur: 1.2}, idle: {dur: d}, move: lin(1.2, 120, 330)})], d), T('AL DÍA SIGUIENTE…', 70, 300, 84), pop(T('¡VIVO!', 70, 410, 120, {color: RED}), 1.3)]);
// 10 · "¿Cómo?"
shot(22.45, 23.2, d => [cam([...office(d), becario({x: 640, y: 2080, scale: 1.75, expr: 'sorpresa', idle: {dur: d}, armL: {shoulder: 40, elbow: 120}, armR: {shoulder: 40, elbow: 120}})], d, 1.04, 1.12), T('¿CÓMO?', 380, 300, 140, {color: RED})]);
// 11 · Explainer: the brain stem survived (heart + breathing).
shot(23.2, 28.85, d => [cam([fill('#eaf4fb'), ...[0, 1, 2, 3, 4, 5].map(i => P([['M', 0, 520 + i * 200], ['L', 1280, 520 + i * 200]], {stroke: '#d6e6f2', lineWidth: 4})),
  mike({x: 420, y: 1400, scale: 1.4, idle: {dur: d}}),
  pop(E(580, 1006, 54, 80, {fill: '#f6a6b2', lineWidth: 8}), 0.9, 0.4),
  {type: 'arrow', x: 330, y: 790, w: 210, lineWidth: 8, color: INK, from: 1.2, keys: [{t: 1.2, progress: 0}, {t: 1.9, progress: 1}]},
  pop(T('TRONCO DEL CEREBRO', 130, 660, 60), 1.9),
  pop(G([S([['M', 0, 60], ['C', -110, -10, -60, -90, 0, -30], ['C', 60, -90, 110, -10, 0, 60], ['Z']], RED, {lineWidth: 9})], {x: 930, y: 860, keys: [{t: 3.5, scaleX: 1, scaleY: 1}, ...osc(d, 0.8, 0.08, {prop: 'scaleX', radians: false, base: 1, t0: 3.8}).map(k => ({t: k.t, scaleX: k.scaleX, scaleY: k.scaleX}))]}), 3.5), pop(T('CORAZÓN', 800, 960, 60), 3.6),
  pop(G([E(-48, 0, 80, 120, {fill: '#f6a6b2', lineWidth: 8}), E(48, 0, 80, 120, {fill: '#f6a6b2', lineWidth: 8}), P([['M', 0, -90], ['L', 0, -30]], {lineWidth: 8})], {x: 928, y: 1170, keys: [{t: 4.6, scaleX: 1, scaleY: 1}, {t: 5.0, scaleX: 1.08, scaleY: 1.08}, {t: 5.4, scaleX: 1, scaleY: 1}]}), 4.6), pop(T('RESPIRACIÓN', 720, 1260, 60), 4.7),
], d, 1, 1.03), T('SE SALVÓ ESTO', 80, 300, 100)]);
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
    {x: 290, y: 420, pivotX: 350, pivotY: 490, keys: [{t: 0, angle: deg(-8), scaleX: 0.8, scaleY: 0.8}, {t: 0.35, angle: deg(-3), scaleX: 1, scaleY: 1}, {t: d, angle: deg(-1), scaleX: 1.02, scaleY: 1.02}]})], d)]);
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
  becario({x: 320, y: GROUND, scale: 1.1, expr: 'agobiado', idle: {dur: d}, headKeys: [{t: 0.8, angle: 0}, {t: 1.3, angle: deg(-10)}, {t: d, angle: deg(-10)}], gestures: [{t0: 1.6, t1: 2.5, arm: 'R', shoulder: 70, elbow: 20}]}),
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
shot(54.46, 57.2425, d => [cam([fill('#2b2f3a'), band(GROUND - 20, 900, '#3a3550'), R(840, 560, 300, 260, {radius: 8, fill: '#1c2140', lineWidth: 10}),
  archiveBox({x: 820, y: GROUND, scale: 1.15, label: 'EXP. 015', lidOpenAt: 0.8}),
  becario({x: 330, y: GROUND, scale: 1.12, expr: 'sarcastico', idle: {dur: d}, look: 1, gestures: [{t0: 0.6, t1: 2.6, arm: 'R', shoulder: 60, elbow: 40}]}),
  ...[0, 1, 2].map(i => mike({x: 690 + i * 150, y: 1180, scale: 0.42, head: false, alpha: 0, from: 1.0 + i * 0.4, move: [{t: 1.0 + i * 0.4, alpha: 0}, {t: 1.4 + i * 0.4, alpha: 0.55}]})),
], d), T('¿OTRO POLLO?', 80, 300, 110, {color: PAPER})]);

const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const sfx = [
  {time: 1.0, kind: 'paper', gain: 0.18}, {time: 5.2, kind: 'pop', gain: 0.12}, {time: 6.9, kind: 'pop', gain: 0.12},
  {time: 14.18, kind: 'tap', gain: 0.3}, {time: 15.8, kind: 'paper', gain: 0.14}, {time: 21.5, kind: 'chime', gain: 0.1},
  {time: 25.1, kind: 'pop', gain: 0.1}, {time: 26.7, kind: 'pop', gain: 0.1}, {time: 27.8, kind: 'pop', gain: 0.1},
  {time: 30.45, kind: 'tap', gain: 0.1}, {time: 31.25, kind: 'tap', gain: 0.1}, {time: 31.95, kind: 'tap', gain: 0.1}, {time: 32.95, kind: 'tap', gain: 0.12},
  {time: 34.0, kind: 'chime', gain: 0.12}, {time: 35.0, kind: 'paper', gain: 0.15},
  {time: 38.8, kind: 'jingle', gain: 0.12}, {time: 39.4, kind: 'jingle', gain: 0.1}, {time: 40.0, kind: 'jingle', gain: 0.1},
  {time: 41.5, kind: 'paper', gain: 0.12}, {time: 42.0, kind: 'paper', gain: 0.12}, {time: 42.5, kind: 'paper', gain: 0.12},
  {time: 46.7, kind: 'tap', gain: 0.1}, {time: 47.7, kind: 'tap', gain: 0.1},
  {time: 50.4, kind: 'pop', gain: 0.1}, {time: 51.7, kind: 'chime', gain: 0.12}, {time: 55.3, kind: 'paper', gain: 0.15},
];
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: 0.4}, television: {enabled: false}, music: {path: 'music.mp3', gain: 0.1}, captions, shots, sfx}, null, 1));
console.log('shots', shots.length);
