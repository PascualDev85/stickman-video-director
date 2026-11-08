// Builds project.json for "Mike, el pollo sin cabeza" (El Becario, Short 9:16).
// Shot boundaries follow the real word timings of the approved narration (take A).
import fs from 'node:fs';
import {becario, granjero, mike, archiveBox, P, E, R, G, deg, INK, PAPER, TIE} from '../kit.mjs';

const H = 1280 * 1920 / 1080, GROUND = 1420;
const RED = '#d8352a', NIGHT = '#1d2440';
const T = (text, x, y, size = 96, o = {}) => ({type: 'text', text, x, y, size, bold: true, color: INK, w: 1120 - x, ...o});
const fill = (color) => ({type: 'rect', x: -40, y: -40, w: 1360, h: H + 80, radius: 0, fill: color, stroke: 'none'});
const band = (y, h, color) => ({type: 'rect', x: -40, y, w: 1360, h, radius: 0, fill: color, stroke: 'none'});
// Gentle camera push on every shot so the picture never sits still.
const cam = (layers, dur, from = 1, to = 1.06) => G(layers, {pivotX: 640, pivotY: 900, keys: [{t: 0, scaleX: from, scaleY: from}, {t: dur, scaleX: to, scaleY: to}]});
// Bobbing walk: x moves linearly, y bounces every 0.22 s.
function walk(x0, x1, y, dur, t0 = 0, amp = 14) {
  const keys = [];
  const at = t => +(x0 + (x1 - x0) * (t - t0) / Math.max(0.01, dur - t0)).toFixed(1);
  let i = 0;
  for (let t = t0; t < dur - 0.05; t += 0.22, i++) keys.push({t: +t.toFixed(3), x: at(t), y: y - (i % 2 ? amp : 0)});
  keys.push({t: +dur.toFixed(3), x: x1, y});
  return keys;
}
const office = () => [fill('#f2ecdf'), band(GROUND, 900, '#d6cbb5'), R(820, 520, 300, 220, {radius: 8, fill: '#bfe3f7'}), P([['M', 970, 520], ['L', 970, 740]], {lineWidth: 8}), R(90, 560, 260, 320, {radius: 6, fill: '#e0d4bc'})];
const farm = (sky = '#bfe3f7') => [fill(sky), band(GROUND - 80, 1000, '#9ccc65'), ...barn(150, GROUND - 80), ...fence(560, GROUND - 80)];
function barn(x, y) {
  return [R(x, y - 300, 330, 300, {radius: 4, fill: '#c0392b'}), {type: 'path', commands: [['M', x - 30, y - 300], ['L', x + 165, y - 430], ['L', x + 360, y - 300], ['Z']], fill: '#8e2b22', stroke: INK, lineWidth: 12},
    R(x + 115, y - 170, 100, 170, {radius: 2, fill: PAPER}), P([['M', x + 115, y - 170], ['L', x + 215, y]], {lineWidth: 8}), P([['M', x + 215, y - 170], ['L', x + 115, y]], {lineWidth: 8})];
}
function fence(x, y) {
  const out = [P([['M', x, y - 90], ['L', 1300, y - 90]], {lineWidth: 10}), P([['M', x, y - 40], ['L', 1300, y - 40]], {lineWidth: 10})];
  for (let px = x; px < 1300; px += 120) out.push(R(px, y - 130, 26, 130, {radius: 4, fill: '#e8d5b0', lineWidth: 8}));
  return out;
}
const sun = (x, y, keys) => G([E(0, 0, 170, 170, {fill: '#ffd34d'}), ...[0, 45, 90, 135, 180, 225, 270, 315].map(a => P([['M', Math.cos(deg(a)) * 110, Math.sin(deg(a)) * 110], ['L', Math.cos(deg(a)) * 150, Math.sin(deg(a)) * 150]], {lineWidth: 10, stroke: '#e0a800'}))], {x, y, ...(keys ? {keys} : {})});
const dropper = (x, y, keys) => G([R(-16, -170, 32, 170, {radius: 10, fill: '#d9f1ff', lineWidth: 8}), E(0, -195, 60, 60, {fill: RED, lineWidth: 8}), R(-6, 0, 12, 30, {radius: 4, fill: '#d9f1ff', lineWidth: 6})], {x, y, ...(keys ? {keys} : {})});
const drop = (x, y, from, fallTo) => ({...E(x, y, 22, 30, {fill: '#5fb7ef', lineWidth: 5}), from, keys: [{t: from, y: y - 15}, {t: from + 0.35, y: fallTo}]});
const heart = (x, y, o = {}) => ({type: 'path', commands: [['M', x, y + 60], ['C', x - 110, y - 10, x - 60, y - 90, x, y - 30], ['C', x + 60, y - 90, x + 110, y - 10, x, y + 60], ['Z']], fill: RED, stroke: INK, lineWidth: 9, ...o});
const coin = (x, y, from) => ({...E(x, y, 70, 70, {fill: '#ffd34d', lineWidth: 8}), from, keys: [{t: from, y: y + 40, alpha: 0}, {t: from + 0.25, y, alpha: 1}]});
const pop = (layer, at, dur = 0.3) => ({...layer, from: at, keys: [...(layer.keys || []), {t: at, alpha: 0}, {t: at + dur, alpha: 1}]});
const person = (x, expr, s = 0.45) => becario({x, y: GROUND + 40, scale: s, expr, armL: {shoulder: 10}, armR: {shoulder: 10}});

const shots = [];
function shot(start, end, build) { shots.push({start, end, layers: build(Math.floor((end - start) * 1000 - 1) / 1000)}); }

// 1 · Hook (frame 0 = cover): big headless Mike walks in; El Becario holds case 014.
shot(0, 5.12, d => [cam([
  ...office(),
  archiveBox({x: 395, y: GROUND + 40, scale: 0.6, keys: [{t: 0, y: GROUND + 40}, {t: 0.9, y: GROUND + 40}, {t: 1.1, y: GROUND + 25}, {t: 1.3, y: GROUND + 40}]}),
  becario({x: 175, y: GROUND + 40, scale: 0.75, expr: 'cansado', armL: {shoulder: 10}, armR: {shoulder: 70, elbow: 40}, headKeys: [{t: 0, angle: 0}, {t: 4, angle: deg(8)}]}),
  mike({x: 800, y: GROUND + 20, scale: 1.55, keys: walk(1000, 780, GROUND + 20, 3.0, 0, 16)}),
], d), T('18 MESES', 70, 290, 130), T('SIN CABEZA', 70, 430, 130, {color: RED})]);
// 2 · "Sí. Sin cabeza." Close-up reaction, then the evidence.
shot(5.12, 6.84, d => [cam([fill('#f2ecdf'), becario({x: 640, y: 2050, scale: 1.7, expr: 'sorpresa', armL: {shoulder: 150, elbow: 10}, armR: {shoulder: 150, elbow: 10}})], d, 1, 1.08), T('¿SIN CABEZA?', 120, 300, 110)]);
shot(6.84, 8.1, d => [cam([fill('#ffe9a8'), mike({x: 640, y: 1350, scale: 2, keys: walk(560, 720, 1350, d, 0, 18)})], d), T('SIN CABEZA.', 150, 300, 120, {color: RED})]);
// 3 · Colorado, 1945.
shot(8.1, 10.8, d => [cam([...farm(), sun(1050, 420, [{t: 0, y: 520}, {t: d, y: 420}])], d), T('COLORADO', 70, 300, 110), T('1945', 70, 430, 110, {color: RED, from: 0.8})]);
// 4 · The farmer goes to get dinner.
shot(10.8, 12.8, d => [cam([...farm(), mike({x: 930, y: GROUND, scale: 1.15, head: true}), granjero({x: 420, y: GROUND, scale: 1.15, keys: walk(-150, 420, GROUND, 1.6)})], d)]);
// 5 · Grabs a chicken, the axe comes down.
shot(12.8, 14.9, d => [cam([...farm(), mike({x: 880, y: GROUND, scale: 1.15, head: true}),
  granjero({x: 430, y: GROUND, scale: 1.15, expr: 'serio', axe: true, armR: {shoulder: 160, elbow: 10}, armRKeys: [{t: 0, angle: deg(-150)}, {t: 1.2, angle: deg(-165)}, {t: 1.45, angle: deg(-40)}]}),
  {type: 'rect', x: -40, y: -40, w: 1360, h: H + 80, radius: 0, fill: PAPER, stroke: 'none', from: 1.45, to: 1.6},
], d), T('¡ZAS!', 760, 420, 130, {color: RED, from: 1.45})]);
// 6 · ...and the chicken gets up.
shot(14.9, 16.45, d => [cam([...farm(), granjero({x: 300, y: GROUND, scale: 1.1, expr: 'sorpresa', armL: {shoulder: 40}, armR: {shoulder: 40}}),
  mike({x: 830, y: GROUND, scale: 1.3, keys: [{t: 0, angle: deg(-80), y: GROUND + 60}, {t: 0.8, angle: deg(-80), y: GROUND + 60}, {t: 1.3, angle: 0, y: GROUND}]})], d), T('SE LEVANTA', 100, 300, 110)]);
// 7 · ...and keeps walking.
shot(16.45, 18.6, d => [cam([...farm(), granjero({x: 250, y: GROUND, scale: 1.05, expr: 'sorpresa', armL: {shoulder: 150, elbow: 10}, armR: {shoulder: 150, elbow: 10}}), mike({x: 650, y: GROUND, scale: 1.25, keys: walk(560, 900, GROUND, d)})], d), T('COMO SI NADA', 80, 300, 104)]);
// 8 · "Como yo los lunes."
shot(18.6, 20.1, d => [cam([...office(), becario({x: 400, y: GROUND, scale: 1.2, expr: 'cansado', armL: {shoulder: 5}, armR: {shoulder: 5}, keys: walk(330, 470, GROUND, d, 0, 12)}), mike({x: 880, y: GROUND, scale: 1.0, keys: walk(820, 940, GROUND, d, 0, 12)})], d), T('LUNES.', 380, 300, 140, {color: RED})]);
// 9 · Next morning: still alive.
shot(20.1, 22.45, d => [cam([...farm('#ffd9a8'), sun(1050, 700, [{t: 0, y: 900}, {t: d, y: 560}]), mike({x: 820, y: GROUND, scale: 1.25}), granjero({x: 330, y: GROUND, scale: 1.05, expr: 'sorpresa', keys: [{t: 0, x: 150}, {t: 1.2, x: 330}]})], d), T('AL DÍA SIGUIENTE…', 70, 300, 84), T('¡VIVO!', 70, 410, 120, {color: RED, from: 1.3})]);
// 10 · "¿Cómo?"
shot(22.45, 23.2, d => [cam([fill('#f2ecdf'), becario({x: 640, y: 2050, scale: 1.7, expr: 'sorpresa', armL: {shoulder: 40, elbow: 120}, armR: {shoulder: 40, elbow: 120}})], d, 1.05, 1.12), T('¿CÓMO?', 380, 300, 140, {color: RED})]);
// 11 · Explainer: the brain stem survived (heart + breathing).
shot(23.2, 28.85, d => [cam([fill('#eaf4fb'),
  mike({x: 400, y: 1380, scale: 1.6}),
  E(552, 1000, 60, 100, {fill: '#f6a6b2', lineWidth: 8, from: 0.9, keys: [{t: 0.9, alpha: 0}, {t: 1.3, alpha: 1}]}),
  {type: 'arrow', x: 300, y: 760, w: 240, lineWidth: 8, color: INK, from: 1.2, keys: [{t: 1.2, progress: 0}, {t: 1.9, progress: 1}]},
  pop(T('TRONCO DEL CEREBRO', 130, 640, 60), 1.9),
  pop(heart(930, 860), 3.5), pop(T('CORAZÓN', 800, 960, 60), 3.6),
  pop(E(880, 1170, 80, 120, {fill: '#f6a6b2', lineWidth: 8}), 4.6), pop(E(975, 1170, 80, 120, {fill: '#f6a6b2', lineWidth: 8}), 4.6), pop(T('RESPIRACIÓN', 720, 1260, 60), 4.7),
], d, 1, 1.04), T('SE SALVÓ ESTO', 80, 300, 100)]);
// 12 · "Lo lógico": feed him with a dropper. El Becario raises an eyebrow.
shot(28.85, 32.5, d => [cam([...farm(), mike({x: 760, y: GROUND, scale: 1.2}),
  granjero({x: 330, y: GROUND, scale: 1.05, expr: 'serio', armR: {shoulder: 110, elbow: -30}}),
  dropper(860, 1000, [{t: 0, y: 900}, {t: 1.5, y: 1000}]), drop(860, 1050, 2.0, 1130), drop(860, 1050, 2.8, 1130),
  becario({x: 1120, y: GROUND + 300, scale: 0.75, expr: 'sarcastico', armL: {shoulder: 20, elbow: 100}, armR: {shoulder: 0}}),
], d), T('"LO LÓGICO"', 80, 300, 110)]);
// 13 · Straight down the neck.
shot(32.5, 33.8, d => [cam([fill('#eaf4fb'), mike({x: 450, y: 1700, scale: 2.6}), dropper(700, 760, [{t: 0, y: 700}, {t: 0.5, y: 760}]), drop(700, 820, 0.6, 980)], d, 1, 1.1), T('POR EL CUELLO', 80, 300, 100, {color: RED})]);
// 14 · They named him Mike.
shot(33.8, 34.92, d => [cam([fill('#ffe9a8'), mike({x: 640, y: 1400, scale: 1.6}), pop(R(330, 520, 620, 200, {radius: 30, fill: PAPER}), 0.2), pop(T('MIKE', 450, 545, 150, {color: RED}), 0.3)], d, 1, 1.08)]);
// 15 · Magazine star, then on tour.
shot(34.92, 36.12, d => [cam([fill('#2b2f3a'), R(290, 420, 700, 980, {radius: 6, fill: PAPER, keys: [{t: 0, angle: deg(-6)}, {t: d, angle: deg(-2)}]}),
  R(290, 420, 700, 170, {radius: 6, fill: RED}), T('REVISTA', 360, 450, 100, {color: PAPER}), mike({x: 640, y: 1200, scale: 1.3}), T('¡SIN CABEZA!', 340, 1260, 80)], d, 1, 1.06)]);
shot(36.12, 38.15, d => [cam([fill('#bfe3f7'), band(GROUND - 60, 1000, '#c9b38a'), band(GROUND - 20, 30, '#8a7a5c'),
  G([R(-330, -330, 660, 300, {radius: 30, fill: '#ffd34d'}), R(-280, -300, 180, 110, {radius: 12, fill: '#d9f1ff'}), R(-60, -300, 380, 110, {radius: 12, fill: PAPER}), {type: 'text', text: 'POLLO SIN CABEZA', x: -50, y: -280, size: 40, bold: true, color: RED}, E(-200, -20, 120, 120, {fill: INK}), E(200, -20, 120, 120, {fill: INK})],
    {x: 640, y: GROUND, keys: walk(420, 760, GROUND, d, 0, 6)}),
], d), T('GIRA POR', 80, 300, 100), T('EE. UU.', 80, 420, 110, {color: RED})]);
// 16 · People paid to see him.
shot(38.15, 40.96, d => [cam([fill('#ffeccc'), band(GROUND, 900, '#e2c79b'),
  ...[0, 1, 2, 3, 4, 5].map(i => R(260 + i * 130, 560, 130, 520, {radius: 0, fill: i % 2 ? PAPER : RED, lineWidth: 8})),
  {type: 'path', commands: [['M', 230, 560], ['L', 640, 380], ['L', 1050, 560], ['Z']], fill: RED, stroke: INK, lineWidth: 12},
  R(330, 640, 620, 160, {radius: 14, fill: PAPER}), T('VEA AL POLLO', 380, 660, 64), T('SIN CABEZA', 400, 730, 64, {color: RED}),
  mike({x: 640, y: 1080, scale: 0.7}),
  person(170, 'sorpresa', 0.6), person(330, 'contento', 0.6), person(950, 'sorpresa', 0.6), person(1110, 'contento', 0.6),
  coin(240, 900, 0.6), coin(1040, 880, 1.2), coin(160, 760, 1.8), coin(1120, 740, 2.3),
], d)]);
// 17 · Eighteen months.
shot(40.96, 43.42, d => [cam([fill('#eaf4fb'), R(240, 520, 800, 760, {radius: 20, fill: PAPER}), R(240, 520, 800, 180, {radius: 20, fill: RED}),
  ...[['1', 0, 0.5], ['6', 0.5, 1.0], ['12', 1.0, 1.5], ['18', 1.5, 0]].map(([n, a, b]) => T(n, n.length > 1 ? 470 : 560, 760, 300, {from: a, ...(b ? {to: b} : {}), color: n === '18' ? RED : INK})),
  T('MESES', 460, 1110, 110), mike({x: 1050, y: GROUND, scale: 0.6, keys: walk(980, 1120, GROUND, d, 0, 8)})], d)]);
// 18 · The motel in Arizona (serious beat: no gore, no jokes).
shot(43.42, 46.0, d => [cam([fill(NIGHT), E(1020, 420, 160, 160, {fill: '#f4f1d0', lineWidth: 8}), band(GROUND - 40, 900, '#3a3550'),
  R(160, 760, 900, 620, {radius: 6, fill: '#c97b5a'}), ...[0, 1, 2].map(i => R(230 + i * 280, 900, 180, 200, {radius: 6, fill: '#ffe08a'})),
  R(380, 560, 520, 150, {radius: 18, fill: '#2b2f3a', stroke: '#ff5fa2', lineWidth: 10}), T('MOTEL', 470, 585, 100, {color: '#ff5fa2', keys: [{t: 0, alpha: 1}, {t: 0.9, alpha: 0.4}, {t: 1.0, alpha: 1}]}),
], d), T('ARIZONA', 80, 300, 100, {color: PAPER})]);
shot(46.0, 48.86, d => [cam([fill('#3a3550'), R(100, 1000, 1080, 420, {radius: 10, fill: '#8a6a4a'}), R(160, 1060, 300, 140, {radius: 6, fill: '#a7825c', keys: [{t: 0.4, x: 160}, {t: 0.8, x: 120}]}),
  granjero({x: 760, y: GROUND, scale: 1.15, expr: 'agobiado', armL: {shoulder: 60, elbow: 60}, armR: {shoulder: 60, elbow: 60}, keys: [{t: 0, x: 760}, {t: 1, x: 700}, {t: 2, x: 820}]}),
], d), T('¿Y EL GOTERO?', 80, 300, 104, {color: PAPER})]);
// 19 · "...had more fame than me."
shot(48.86, 51.56, d => [cam([...office(), R(640, 520, 460, 600, {radius: 10, fill: PAPER}), T('FAMOSO', 700, 560, 80, {color: RED}), mike({x: 880, y: 1020, scale: 0.8}),
  becario({x: 320, y: GROUND, scale: 1.1, expr: 'agobiado', armL: {shoulder: 10}, armR: {shoulder: 10}, headKeys: [{t: 0.8, angle: 0}, {t: 1.4, angle: deg(-10)}]}),
  pop(R(560, 1150, 560, 110, {radius: 16, fill: PAPER}), 1.5), pop(T('SEGUIDORES: 3', 590, 1172, 60), 1.5)], d), T('MÁS FAMA', 80, 300, 110), T('QUE YO', 80, 420, 110, {color: RED})]);
// 20 · His town still throws him a festival.
shot(51.56, 54.46, d => [cam([fill('#bfe3f7'), band(GROUND - 60, 1000, '#9ccc65'),
  P([['M', -20, 560], ['Q', 640, 720, 1300, 560]], {lineWidth: 6}), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => ({type: 'path', commands: [['M', 60 + i * 150, 600 + Math.sin(i / 7 * Math.PI) * 70], ['L', 120 + i * 150, 600 + Math.sin(i / 7 * Math.PI) * 70], ['L', 90 + i * 150, 690 + Math.sin(i / 7 * Math.PI) * 70], ['Z']], fill: ['#d8352a', '#ffd34d', '#4f78b8', '#9ccc65'][i % 4], stroke: INK, lineWidth: 6})),
  mike({x: 640, y: GROUND, scale: 1.4, keys: [{t: 0, y: GROUND}, {t: 0.4, y: GROUND - 60}, {t: 0.8, y: GROUND}, {t: 1.2, y: GROUND - 60}, {t: 1.6, y: GROUND}]}),
  person(200, 'contento', 0.7), person(1080, 'contento', 0.7),
], d), T('FESTIVAL', 80, 300, 110), T('CADA AÑO', 80, 420, 110, {color: RED})]);
// 21 · Open loop: next case.
shot(54.46, 57.2425, d => [cam([fill('#2b2f3a'), band(GROUND, 900, '#3a3550'),
  archiveBox({x: 820, y: GROUND + 20, scale: 1.2, label: 'EXP. 015'}),
  becario({x: 330, y: GROUND, scale: 1.15, expr: 'sarcastico', armL: {shoulder: 10}, armR: {shoulder: 60, elbow: 40}}),
  ...[0, 1, 2].map(i => ({...mike({x: 700 + i * 170, y: 1180, scale: 0.55}), alpha: 0, from: 0.5 + i * 0.5, keys: [{t: 0.5 + i * 0.5, alpha: 0}, {t: 0.9 + i * 0.5, alpha: 0.45}]})),
], d), T('¿OTRO POLLO?', 80, 300, 110, {color: PAPER})]);

const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const sfx = [
  {time: 0.9, kind: 'paper', gain: 0.18}, {time: 5.2, kind: 'pop', gain: 0.12}, {time: 6.9, kind: 'pop', gain: 0.12},
  {time: 14.25, kind: 'tap', gain: 0.25}, {time: 15.9, kind: 'pop', gain: 0.14}, {time: 21.5, kind: 'chime', gain: 0.1},
  {time: 25.1, kind: 'pop', gain: 0.1}, {time: 26.7, kind: 'pop', gain: 0.1}, {time: 27.8, kind: 'pop', gain: 0.1},
  {time: 30.9, kind: 'tap', gain: 0.1}, {time: 31.7, kind: 'tap', gain: 0.1}, {time: 33.1, kind: 'tap', gain: 0.12},
  {time: 34.1, kind: 'chime', gain: 0.12}, {time: 35.0, kind: 'paper', gain: 0.15},
  {time: 38.8, kind: 'jingle', gain: 0.12}, {time: 39.4, kind: 'jingle', gain: 0.1}, {time: 40.0, kind: 'jingle', gain: 0.1},
  {time: 41.5, kind: 'paper', gain: 0.12}, {time: 42.0, kind: 'paper', gain: 0.12}, {time: 42.5, kind: 'paper', gain: 0.12},
  {time: 50.4, kind: 'pop', gain: 0.1}, {time: 51.7, kind: 'chime', gain: 0.12}, {time: 54.6, kind: 'paper', gain: 0.15},
];
const project = {version: 1, style: 'B3', width: 1080, height: 1920, fps: 30,
  voice: {path: 'narration.mp3', lead: 0, tail: 0.4}, television: {enabled: false},
  captions, shots, sfx};
fs.writeFileSync('project.json', JSON.stringify(project, null, 1));
console.log('shots', shots.length);
