// EXPEDIENTE 003 — «La guerra de los emús» (Historias Sin Cabeza). Short 9:16, ~51 s.
// Guion v3 (aprobado). Cortes sobre los tiempos reales (Scribe) y los silencios medidos (voz.py silences).
// Mapa de planos: montaje.md. Estructura copiada de 002-pollo-sin-cabeza/scenes.mjs.
import fs from 'node:fs';
import {becario, mayor, soldado, hatProp, emu, lewisGun, truck, caseFolder, archiveBox, osc, P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';
import {H, GROUND, RED, YEL, tag, captionTrack, fill, band, lin, mix, r3, eOut, eInOut, eBack, shake, sample, camF, cam, slam, popIn, flash, rays, speedLines, cloud, office, desk, emptyWallet, makeEpisode, F, bubble} from '../lib.mjs';

const {WORDS, shots, shot, mouth} = makeEpisode('words.json');
const VOICE = 51.25, END = 51.75; // VOICE = duración real de narration.mp3

// ---------- sets ----------
const SKY = '#9fd3f0', WHEAT = '#e8c25a', WHEAT2 = '#d4a93e', STALK = '#c99a2e';
const stalk = (x, y, h, d, i) => G([P([['M', 0, 0], ['Q', 6, -h / 2, 0, -h]], {stroke: STALK, lineWidth: 6}), E(0, -h - 16, 20, 40, {fill: '#f0c75a', lineWidth: 5})],
  {x, y, pivotX: 0, pivotY: 0, keys: osc(d, 1.5 + (i % 5) * 0.2, 4, {phase: i})});
/** Trigal australiano: cielo, sol, colinas y filas de espigas que se mecen. */
function field(d, {horizon = 1150, sky = SKY, sun = true, stalks = true} = {}) {
  const out = [fill(sky),
    sun ? G([E(0, 0, 170, 170, {fill: '#ffd34d'}), ...[0, 45, 90, 135, 180, 225, 270, 315].map(a => P([['M', Math.cos(deg(a)) * 110, Math.sin(deg(a)) * 110], ['L', Math.cos(deg(a)) * 150, Math.sin(deg(a)) * 150]], {lineWidth: 10, stroke: '#e0a800'}))], {x: 1040, y: 360, keys: osc(d, 6, 6)}) : null,
    cloud(260, 560, 0.8, d, 50), cloud(880, 700, 0.55, d, 70),
    E(250, horizon + 30, 1000, 220, {fill: '#c9b06a', stroke: 'none'}), E(1050, horizon + 40, 900, 200, {fill: '#bda35c', stroke: 'none'}),
    band(horizon, 1400, WHEAT), band(horizon, 14, WHEAT2)];
  if (stalks) {
    let i = 0;
    for (let x = -20; x < 1320; x += 75) out.push(stalk(x + (i % 2) * 30, horizon + 60, 60, d, i++));
    for (let x = 10; x < 1320; x += 120) out.push(stalk(x, horizon + 260, 100, d, i++));
    for (let x = 60; x < 1320; x += 170) out.push(stalk(x, horizon + 640, 150, d, i++));
  }
  return out.filter(Boolean);
}
/** Fila de espigas delante (para tapar patas: «sentado», escondidos). */
const frontStalks = (y, d, x0 = -40, x1 = 1320, step = 46, h = 130) => { const o = []; let i = 0; for (let x = x0; x < x1; x += step) o.push(stalk(x, y, h + (i % 3) * 18, d, 40 + i++)); return o; };
/** Rebaño de emús pequeños en el horizonte (comiendo). */
const herd = (d, y, n = 16, s = 0.16, x0 = 40, x1 = 1240) => Array.from({length: n}, (_, i) => emu({x: x0 + (x1 - x0) * (i + 0.5) / n + ((i * 37) % 23) - 11, y: y + (i % 3) * 22, scale: s * (1 + (i % 3) * 0.12), flip: i % 2 === 0, peck: [0.2 + (i % 4) * 0.35, 1.3 + (i % 5) * 0.3].filter(t => t + 0.45 < d)}));
const pond = (x, y, w = 760, h = 150) => [E(x, y, w + 40, h + 30, {fill: '#a88a4a', stroke: 'none'}), E(x, y, w, h, {fill: '#6fb7e0', lineWidth: 9}), P([['M', x - w * 0.25, y - 10], ['L', x - w * 0.1, y - 10]], {stroke: '#d9f1ff', lineWidth: 7}), P([['M', x + w * 0.1, y + 20], ['L', x + w * 0.28, y + 20]], {stroke: '#d9f1ff', lineWidth: 7})];
const bush = (x, y, s = 1) => G([E(-120, -90, 240, 200, {fill: '#5f8f3e'}), E(110, -100, 260, 220, {fill: '#6a9c44'}), E(0, -170, 260, 230, {fill: '#75a84b'}), E(-10, -40, 380, 120, {fill: '#5f8f3e', stroke: 'none'})], {x, y, scaleX: s, scaleY: s});
const tent = (x, y, s = 1) => G([S([['M', -220, 0], ['L', 0, -300], ['L', 220, 0], ['Z']], '#9a8a5c', {lineWidth: 10}), S([['M', -50, 0], ['L', 0, -120], ['L', 50, 0], ['Z']], '#5e5232', {lineWidth: 8}), P([['M', 0, -300], ['L', 0, -380]], {lineWidth: 8})], {x, y, scaleX: s, scaleY: s});

// ---------- props ----------
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** Contador que sube de 0 a n entre t0 y t1 (cifras con punto de miles). */
function countUp(n, label, x, y, t0, t1, d, {size = 64, color = RED, steps = 16} = {}) {
  if (t1 <= 0) steps = 0; // ya contado (plano siguiente): estático
  const final = `${fmt(n)} ${label}`, probe = ctext(final, 0, 0, size, {maxW: 820}), sz = probe.size, w = probe.w + 20, h = Math.round(sz * 1.5);
  const texts = [];
  for (let i = 0; i <= steps; i++) {
    const a = t0 + (t1 - t0) * i / steps, b = i === steps ? undefined : t0 + (t1 - t0) * (i + 1) / steps;
    const v = i === steps || !steps ? n : Math.round(n * eOut(i / steps) / (n >= 1000 ? 10 : 1)) * (n >= 1000 ? 10 : 1);
    texts.push({...ctext(`${fmt(v)} ${label}`, 0, -sz * 0.68, sz, {maxW: 820, color}), ...(i ? {from: r3(a)} : {}), ...(b !== undefined ? {to: r3(b)} : {})});
  }
  const box = G([R(-w / 2 + 10, -h / 2 + 12, w, h, {radius: 12, fill: 'rgba(0,0,0,0.28)', stroke: 'none'}), R(-w / 2, -h / 2, w, h, {radius: 12, fill: '#fff6d6', stroke: color, lineWidth: 8}), ...texts]);
  return G([steps ? popIn(box, Math.max(0, t0 - 0.12), d) : box], {x, y});
}
const paperSheet = (o = {}) => G([R(-120, -160, 240, 320, {radius: 6, fill: PAPER, lineWidth: 8}), ...[0, 1, 2, 3, 4, 5].map(i => P([['M', -84, -100 + i * 40], ['L', i === 5 ? 20 : 84, -100 + i * 40]], {stroke: '#9aa3ab', lineWidth: 6})), E(70, 110, 60, 60, {fill: 'none', stroke: RED, lineWidth: 6})], o);
const ammoBox = (x, y, s = 1, label = '.303') => G([R(-180, -140, 360, 140, {radius: 8, fill: '#5d6b3f'}), R(-190, -170, 380, 40, {radius: 8, fill: '#4c5833'}), R(-30, -160, 60, 20, {radius: 4, fill: '#c9c3a0', lineWidth: 5}), ctext(label, 0, -110, 64, {maxW: 300, color: '#e9e2b8'})], {x, y, scaleX: s, scaleY: s});
const medal = (x, y, t0, d, s = 1) => (g => t0 < 0 ? g : popIn(g, t0, d))(G([S([['M', -26, -70], ['L', 26, -70], ['L', 14, 0], ['L', -14, 0], ['Z']], '#2b4a7a', {lineWidth: 6}), E(0, 22, 64, 64, {fill: '#e9c46a', lineWidth: 7}), ctext('★', 0, 2, 34, {maxW: 40, color: '#a8743f'})], {x, y, scaleX: s, scaleY: s}));
const bullet = (x, y, t0, d) => popIn(G([R(-16, -30, 32, 70, {radius: 6, fill: '#c9a24a', lineWidth: 6}), S([['M', -16, -30], ['Q', 0, -80, 16, -30], ['Z']], '#b07a3a', {lineWidth: 6})], {x, y}), t0, d, 0.15);
const smokePuffs = (x, y, t0, d, n = 4) => Array.from({length: n}, (_, i) => ({...E(0, 0, 70 + i * 16, 60 + i * 12, {fill: '#d8d8d8', lineWidth: 6}), from: r3(t0 + i * 0.25),
  keys: sample(t => { const u = t - t0 - i * 0.25; return {x: x + Math.sin(u * 5 + i) * 26, y: y - u * 260, alpha: Math.max(0, 1 - u / 1.1)}; }, r3(t0 + i * 0.25), d)}));
const printer = (x, y, s = 1) => G([R(-170, -150, 340, 150, {radius: 14, fill: '#c9ced3'}), R(-120, -190, 240, 50, {radius: 8, fill: '#9aa3ab'}), R(-110, -60, 220, 18, {radius: 4, fill: '#2b2b2b', stroke: 'none'}),
  S([['M', -90, -46], ['L', 90, -46], ['L', 70, 40], ['L', -70, 40], ['Z']], PAPER, {lineWidth: 6}), E(120, -110, 24, 24, {fill: RED, lineWidth: 4})], {x, y, scaleX: s, scaleY: s});
const helmet = () => [S([['M', -56, -48], ['Q', -50, -118, 6, -120], ['Q', 62, -118, 64, -48], ['Z']], '#5b6b3a', {lineWidth: 7}), P([['M', -74, -46], ['L', 82, -46]], {stroke: '#3f4a27', lineWidth: 12})];
const spark = (x, y, t0, d) => G([S([['M', 0, -40], ['L', 10, -10], ['L', 40, 0], ['L', 10, 10], ['L', 0, 40], ['L', -10, 10], ['L', -40, 0], ['L', -10, -10], ['Z']], YEL, {lineWidth: 5})], {x, y, from: t0, to: Math.min(d, t0 + 0.25), keys: sample(t => ({s: t - t0 < 0.12 ? mix(0.4, 1.2, (t - t0) / 0.12) : mix(1.2, 0.6, (t - t0 - 0.12) / 0.13)}), t0, Math.min(d, t0 + 0.25))});
const dust = (x, y, t0, d) => [0, 1, 2].map(i => ({...E(0, 0, 90, 60, {fill: '#d9c79a', lineWidth: 6}), from: t0, keys: sample(t => { const u = t - t0; return {x: x + (i - 1) * (40 + u * 260), y: y - u * 60, alpha: Math.max(0, 1 - u / 0.6)}; }, t0, d)}));
/** Alas ridículas del emú (en coordenadas del emú): aletean rápido. */
const wingStub = (dur, t0 = 0) => G([E(30, 0, 110, 46, {fill: '#7a5a40', lineWidth: 7})], {x: 20, y: -380, pivotX: -20, pivotY: 0, keys: osc(dur, 0.09, 30, {t0})});

// ---------- primer fotograma (= miniatura) y bucle ----------
// Emú enorme a la derecha mirando al soldado (mirada de funcionario); soldado pequeño con la Lewis a la izquierda.
const HX = 860, HY = 1600, HS = 1.5, HEAD = [HX - 130 * HS, HY - 666 * HS];
const hookSet = (d, {eye = 'normal', crowd = false, peck = []} = {}) => [...field(d),
  ...(crowd ? herd(d, 1175, 22, 0.13) : []),
  soldado(1, {x: 220, y: HY, scale: 0.62, expr: 'serio', look: 1, idle: {dur: d}, armL: {shoulder: 70, elbow: 40}, armR: {shoulder: 80, elbow: 20}}),
  lewisGun({x: 330, y: HY, scale: 0.7}),
  emu({x: HX, y: HY, scale: HS, flip: true, eye, peck, idle: {dur: d}}),
];

// ================= SHOTS =================
// 0–1.70 · «En 1932,» — miniatura. Etiqueta pequeña arriba a la izquierda (entera desde el fotograma 1).
shot(0, 1.70, d => [cam(hookSet(d), d, 1.0, 1.04, 640, 1300), G([tag('AUSTRALIA · 1932', 360, 56, {pop: false})], {x: -250})]);
// 1.70–3.14 · «Australia le declaró la guerra» — ¡GUERRA! + sacudida.
shot(1.70, 3.14, d => [camF(hookSet(d), d, t => ({s: mix(1.12, 1.18, t / d), ...shake(t, 0.25, 0.35, 18)}), 640, 1300), flash(0.25, 0.1, PAPER, 0.7),
  slam('¡GUERRA!', 640, 520, 150, 0.25, d, {outline: true, color: RED, from: 1.2, tilt: -5, maxW: 800})]);
// 3.14–4.02 · «a los emús.» — zoom rápido a la cara del emú, que mira a cámara con ojo grande.
shot(3.14, 4.02, d => [camF(hookSet(d, {eye: 'grande'}), d, t => ({s: mix(1.0, 2.3, eOut(t / 0.25)), y: mix(0, 380, eOut(t / 0.25))}), HEAD[0], HEAD[1])]);
// 4.02–5.10 · «Y no la ganó.» — el emú picotea el sombrero del soldado, que sale volando (boing en 4.78).
const SX = 470, SS = 0.65, EXP = SX + 373, PK = 0.45;
shot(4.02, 5.10, d => [cam([...field(d),
  soldado(1, {x: SX, y: GROUND + 180, scale: SS, expr: 'serio', look: 1, idle: {dur: d}, to: PK + 0.15}),
  soldado(1, {x: SX, y: GROUND + 180, scale: SS, expr: 'sorpresa', look: 1, noHat: true, idle: {dur: d}, from: PK + 0.15, armL: {shoulder: 150, elbow: 20}, armR: {shoulder: 150, elbow: 20}}),
  hatProp('soldado1', {x: SX, y: GROUND + 180 - 462 * SS, scaleX: SS, scaleY: SS, from: PK + 0.15, keys: sample(t => { const u = t - PK - 0.15; return {x: SX + u * 520, y: GROUND + 180 - 462 * SS - u * 900 + u * u * 1500, a: u * 720}; }, PK + 0.15, d)}),
  emu({x: EXP, y: GROUND + 180, scale: 1.0, flip: true, peck: [PK]}),
], d, 1.0, 1.06, 640, 1300)]);
// 5.10–7.06 · «Expediente 003.» — carpeta cae; sello 003 en el silencio (6.75).
shot(5.10, 7.06, d => [camF([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'sarcastico', idle: {dur: d}, talk: mouth(5.10, 7.06)}),
  G([caseFolder({x: 0, y: 0, scale: 1, label: 'EXPEDIENTE 003'})], {x: 800, y: 1010, scaleX: 0.74, scaleY: 0.74, keys: [{t: 0, y: 700, angle: deg(-14)}, {t: 0.18, y: 1010, angle: deg(-3)}, {t: 0.26, y: 980, angle: deg(-3)}, {t: 0.34, y: 1010, angle: deg(-3)}]}),
], d, t => ({s: mix(1.12, 1.2, t / d), ...shake(t, 0.18, 0.2, 12), ...shake(t, 1.65, 0.2, 14)}), 800, 1055),
  slam('003', 640, 520, 200, 1.65, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.15})]);
// 7.06–8.70 · «20.000 emús se comen el trigo,» — oleada de emús picoteando + contador.
shot(7.06, 8.70, d => [cam([...field(d, {horizon: 1050}), ...herd(d, 1080, 14, 0.2),
  ...Array.from({length: 6}, (_, i) => emu({x: 90 + i * 210, y: 1360 + (i % 2) * 40, scale: 0.42, flip: i % 2 === 1, peck: [0.1 + i * 0.13, 0.9 + (i % 3) * 0.12]})),
  ...Array.from({length: 4}, (_, i) => emu({x: 170 + i * 320, y: 1660, scale: 0.62, flip: i % 2 === 0, peck: [0.25 + i * 0.1, 1.05]})),
], d, 1.08, 1.0), countUp(20000, 'EMÚS', 640, 560, 0.05, 0.75, d, {size: 76})]);
// 8.70–11.78 · «y el gobierno manda… espera, que lo leo bien…» — el Becario lee un papel; en «espera» se lo acerca.
const ESP = 10.44 - 8.70;
shot(8.70, 11.78, d => [camF([...office(d),
  becario({x: 560, y: 1680, scale: 1.3, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(8.70, 11.78), armL: {shoulder: 40, elbow: 100}, armR: {shoulder: 40, elbow: 100}, to: ESP}),
  becario({x: 560, y: 1680, scale: 1.3, expr: 'nervioso', look: 1, idle: {dur: d}, talk: mouth(8.70, 11.78), armL: {shoulder: 50, elbow: 110}, armR: {shoulder: 50, elbow: 110}, from: ESP, headKeys: [{t: ESP, angle: 0}, {t: ESP + 0.3, angle: deg(8)}, {t: d, angle: deg(8)}]}),
  paperSheet({x: 760, y: 1200, keys: sample(t => ({s: t < ESP ? 0.8 : mix(0.8, 1.05, eInOut((t - ESP) / 0.4)), x: t < ESP ? 760 : mix(760, 730, eInOut((t - ESP) / 0.4)), y: t < ESP ? 1200 : mix(1200, 1060, eInOut((t - ESP) / 0.4)), a: -6}), 0, d)}),
], d, t => ({s: t < ESP ? mix(1.0, 1.06, t / ESP) : mix(1.06, 1.3, eInOut((t - ESP) / (d - ESP)))}), 680, 1050)]);
// 11.78–13.30 · «¿¡Al ejército!?» — primer plano, zoom brusco + sacudida + flash + slam.
shot(11.78, 13.30, d => [camF([...office(d), becario({x: 640, y: 2080, scale: 1.75, expr: 'sorpresa', idle: {dur: d}, talk: mouth(11.78, 13.30), armL: {shoulder: 40, elbow: 120}, armR: {shoulder: 40, elbow: 120}})], d,
  t => ({s: mix(1.0, 1.25, eOut((t - 0.1) / 0.18)), a: mix(0, -6, eOut((t - 0.1) / 0.18)), ...shake(t, 0.12, 0.35, 16)}), 640, 1000),
  flash(0.12, 0.12, PAPER, 0.85), speedLines(0.12, 0.45, PAPER, 640, 900),
  slam('¿AL EJÉRCITO?', 620, 470, 120, 0.14, d, {outline: true, color: RED, from: 1.15, tilt: -4, maxW: 880})]);
// 13.30–14.03 · «Un mayor,» — el mayor entra marchando y saluda.
const camp = d => [...field(d, {horizon: 1100, stalks: false}), tent(260, 1180, 0.8), tent(980, 1150, 0.6)];
shot(13.30, 14.03, d => [cam([...camp(d),
  mayor({x: 560, y: 1640, scale: 1.05, expr: 'serio', look: 1, walk: {dur: 0.45, period: 0.3, stride: 26}, move: [{t: 0, x: -160}, {t: 0.42, x: 560}], poses: {R: [{t: 0, shoulder: 8, elbow: 0}, {t: 0.48, shoulder: 8, elbow: 0}, {t: 0.6, shoulder: 150, elbow: 120}]}}),
], d, 1.0, 1.04)]);
// 14.03–14.97 · «dos ametralladoras» — dos Lewis caen con golpe.
const MAJ = d => mayor({x: 330, y: 1640, scale: 1.0, expr: 'contento', look: 1, idle: {dur: d}});
const dropKeys = (y, t0) => [{t: 0, y: -400}, {t: t0, y: -400}, {t: r3(t0 + 0.16), y}, {t: r3(t0 + 0.22), y: y - 30}, {t: r3(t0 + 0.28), y}];
shot(14.03, 14.97, d => [camF([...camp(d), MAJ(d),
  lewisGun({x: 760, y: 1600, scale: 0.85, keys: dropKeys(1600, 0.05)}), lewisGun({x: 1000, y: 1660, scale: 0.85, keys: dropKeys(1660, 0.35)}),
], d, t => ({s: 1.05, ...shake(t, 0.21, 0.15, 14), ...shake(t, 0.51, 0.15, 14)}), 640, 1300)]);
// 14.97–16.27 · «y 10.000 balas.» — caja de munición + contador; bocadillo del mayor.
shot(14.97, 16.27, d => [cam([...camp(d), MAJ(d), ammoBox(860, 1640, 1.1),
], d, 1.04, 1.08, 640, 1300), countUp(10000, 'BALAS', 820, 800, 0.15, 0.6, d, {size: 64}), bubble('Pan comido.', 400, 620, 360, 850, 0.7, d, {size: 56})]);
// 16.27–18.83 · «Contra un pájaro… que no sabe volar.» — el emú aletea, salta y cae sentado (16.95); grillos en el silencio.
const FLY = 0.25, SIT = 16.93 - 16.27;
shot(16.27, 18.83, d => [camF([...field(d),
  G([wingStub(d), emu({x: 0, y: 0, scale: 1, idle: {dur: d}, eye: 'normal'})], {x: 640, y: 1560, scaleX: 1.05, scaleY: 1.05,
    keys: [{t: 0, y: 1560, angle: 0}, {t: FLY, y: 1560}, {t: r3(FLY + 0.18), y: 1430}, {t: r3(SIT - 0.06), y: 1470}, {t: r3(SIT), y: 1700, angle: deg(-6)}, {t: d, y: 1700, angle: deg(-6)}]}),
  ...frontStalks(1600, d), ...dust(640, 1600, SIT, d),
  ...[0, 1].map(i => G([P([['M', 0, 0], ['L', 40, 0]], {stroke: INK, lineWidth: 7})], {x: 820 + i * 10, y: 1150 + i * 40, from: FLY, to: SIT, keys: osc(d, 0.12, 20, {t0: FLY})})),
], d, t => ({s: t < SIT ? mix(1.0, 1.05, t / SIT) : mix(1.12, 1.18, (t - SIT) / (d - SIT)), ...shake(t, SIT, 0.2, 14)}), 640, 1300)]);
// 18.83–20.42 · «Primera emboscada. Disparan…» — estanque; soldados tras un arbusto; asoma la Lewis.
const DRINK = d => Array.from({length: Math.floor(d / 0.8)}, (_, i) => r3(0.1 + i * 0.8)).filter(t => t + 0.45 < d);
const ambush = (d, {firing, jamAt, alert = false} = {}) => [...field(d, {horizon: 1000, stalks: false}), ...pond(820, 1330, 680, 160),
  ...[[640, 1300, 0.55, false], [830, 1270, 0.5, true], [1010, 1310, 0.55, false]].map(([x, y, s, f], i) => alert
    ? emu({x, y, scale: s, flip: f, lookout: true, eye: 'grande', idle: {dur: d}})
    : emu({x, y, scale: s, flip: f, peck: DRINK(d).map(t => r3(t + i * 0.2)).filter(t => t + 0.45 < d)})),
  soldado(1, {x: 150, y: 1660, scale: 0.6, expr: 'serio', look: 1, idle: {dur: d}}), soldado(2, {x: 300, y: 1680, scale: 0.6, expr: 'serio', look: 1, idle: {dur: d}}),
  lewisGun({x: 330, y: 1560, scale: 0.75, firing, jamAt}),
  bush(210, 1700, 1.05)];
shot(18.83, 20.42, d => [cam(ambush(d), d, 1.0, 1.06, 500, 1400)]);
// 20.42–21.40 · (silencio) RÁFAGA. Los emús siguen bebiendo como si nada.
shot(20.42, 21.40, d => [camF(ambush(d, {firing: [0, r3(d - 0.06)]}), d, t => ({s: 1.1, ...shake(t, 0, d, 10)}), 500, 1400)]);
// 21.40–23.17 · «y la ametralladora se atasca.» — humo + ¡CLIC!; los emús levantan la cabeza; bocadillo «¿Ya?».
shot(21.40, 23.17, d => [cam(ambush(d, {jamAt: 0.02, alert: true}), d, 1.12, 1.18, 500, 1400),
  slam('¡CLIC!', 400, 560, 150, 0.02, d, {outline: true, color: YEL, from: 1.25, tilt: 6}), bubble('¿Ya?', 860, 820, 830, 980, 0.9, d, {size: 60})]);
// 23.17–24.75 · «Como la impresora del Archivo.» — la impresora echa humo; el Becario la aporrea.
const BANG = [0.15, 0.45, 0.75, 1.05, 1.35].filter(t => t < 1.55);
shot(23.17, 24.75, d => [camF([...office(d), desk(), printer(860, 1150, 1.0), ...smokePuffs(900, 960, 0.1, d, 5),
  becario({x: 470, y: GROUND - 20, scale: 1.0, expr: 'agobiado', look: 1, idle: {dur: d}, talk: mouth(23.17, 24.75),
    poses: {R: BANG.flatMap(t => [{t: r3(t), shoulder: 150, elbow: 30}, {t: r3(t + 0.15), shoulder: 75, elbow: 10}])}}),
], d, t => ({s: 1.12, ...shake(t, 0.3, 0.12, 6), ...shake(t, 0.9, 0.12, 6), ...shake(t, 1.2, 0.3, 8)}), 700, 1100)]);
// 24.75–27.15 · «Se reparten en grupitos, con vigía y todo.» — grupos que se separan; vigía en un hormiguero con ojo grande.
const group = (cx, y, dx, d, s = 0.3) => [-1, 0, 1].map(i => emu({x: cx + i * 90, y: y + (i === 0 ? 20 : 0), scale: s, flip: dx < 0, run: {dur: 1.0, period: 0.3}, idle: {dur: d}, move: [{t: 0, x: cx + i * 90}, {t: 1.0, x: cx + i * 90 + dx}]}));
shot(24.75, 27.15, d => [cam([...field(d, {horizon: 1050}),
  ...group(640, 1200, -380, d), ...group(640, 1250, 380, d), ...group(640, 1330, 0, d, 0.34),
  S([['M', 380, 1640], ['Q', 470, 1380, 640, 1360], ['Q', 810, 1380, 900, 1640], ['Z']], '#c2763a', {lineWidth: 9}),
  emu({x: 640, y: 1368, scale: 0.75, lookout: true, eye: 'grande', idle: {dur: d}, from: 1.1}),
], d, 1.0, 1.08, 640, 1250)]);
// 27.15–29.20 · «Más organizados que mi departamento.» — el Becario entre montañas de papeles; caen cajas (en 28.8).
const stack = (x, y, n, w = 200) => G(Array.from({length: n}, (_, i) => R(-w / 2 + ((i * 13) % 17) - 8, -(i + 1) * 34, w, 34, {radius: 3, fill: i % 2 ? '#f4f1e8' : PAPER, lineWidth: 6})), {x, y});
shot(27.15, 29.20, d => [camF([...office(d), desk(), stack(560, 1150, 9), stack(1050, 1150, 12, 180),
  becario({x: 800, y: GROUND - 20, scale: 0.95, expr: 'agobiado', look: -1, idle: {dur: d}, talk: mouth(27.15, 29.20), headKeys: osc(d, 0.7, 6)}),
  stack(780, 1150, 5, 220),
  G([archiveBox({x: 560, y: 840, scale: 0.6, label: 'EXP. 001', keys: [{t: 0, y: 470}, {t: 1.45, y: 470}, {t: 1.62, y: 840}]})], {from: 1.45}),
  G([archiveBox({x: 1050, y: 740, scale: 0.6, label: 'EXP. 002', keys: [{t: 0, y: 450}, {t: 1.55, y: 450}, {t: 1.72, y: 740}]})], {from: 1.55}),
], d, t => ({s: mix(1.05, 1.12, t / d), ...shake(t, 1.62, 0.2, 12)}), 760, 1100)]);
// 29.20–31.25 · «Montan la ametralladora en un camión.» — camión dando botes; soldado y Lewis dentro de la caja.
const road = (d, speed) => [fill(SKY), cloud(300, 560, 0.7, d, 80), E(640, 1180, 1800, 260, {fill: '#c9b06a', stroke: 'none'}), band(1150, 1400, WHEAT), band(1480, 200, '#b89a62'),
  G(Array.from({length: 24}, (_, i) => stalk(i * 110, 1250, 90, d, i)), {keys: lin(d, 0, -speed * d)}),
  G(Array.from({length: 22}, (_, i) => R(i * 160, 1520, 70, 14, {radius: 4, fill: '#e8dcb8', stroke: 'none'})), {keys: lin(d, 0, -speed * 1.6 * d)})];
const truckCargo = () => [soldado(2, {x: -170, y: -190, scale: 0.55, expr: 'serio', look: 1}), lewisGun({x: -40, y: -265, scale: 0.6}),
  R(-338, -280, 430, 100, {radius: 6, fill: '#8a5a32'}), ...[-300, -200, -100, 0].map(xx => P([['M', xx, -274], ['L', xx, -186]], {stroke: '#6b4423', lineWidth: 5}))];
shot(29.20, 31.25, d => [cam([...road(d, 700), ...dust(150, 1560, 0, d), truck({x: 640, y: 1620, scale: 1.15, bump: d, cargo: truckCargo()})], d, 1.0, 1.06, 640, 1300), speedLines(0, d, PAPER, 640, 1300)]);
// 31.25–32.83 · «Spoiler: los emús corren más.» — los emús adelantan al camión tranquilamente.
shot(31.25, 32.83, d => [cam([...road(d, 450), truck({x: 520, y: 1600, scale: 0.95, bump: d, cargo: truckCargo(), keys: lin(d, 420, 560)}),
  ...[0, 1, 2].map(i => emu({x: -200, y: 1700 + (i % 2) * 20, scale: 0.6, run: {dur: d, period: 0.28}, eye: i === 2 ? 'grande' : 'normal', move: [{t: 0, x: -250 - i * 220}, {t: d, x: 1250 - i * 260}]})),
], d, 1.0, 1.04, 640, 1300)]);
// 32.83–35.17 · «El mayor presume: 986 emús,» — mayor orgulloso, medalla; contador de emús.
const proud = (d, a) => mayor({x: 520, y: 1690, scale: 1.25, expr: 'contento', look: 1, idle: {dur: d}, talk: undefined, armL: {shoulder: 20, elbow: 120}, ...a});
shot(32.83, 35.17, d => [cam([...camp(d), proud(d, {poses: {R: [{t: 0, shoulder: 8, elbow: 0}, {t: 0.5, shoulder: 8, elbow: 0}, {t: 0.75, shoulder: 140, elbow: 40}]}}), medal(560, 1160, 0.4, d, 1.2)], d, 1.0, 1.06, 560, 1200),
  countUp(986, 'EMÚS', 640, 520, 34.01 - 32.83, 35.13 - 32.83, d, {size: 72})]);
// 35.17–37.83 · «con 9.860 balas.» — el segundo contador sube debajo.
shot(35.17, 37.83, d => [cam([...camp(d), proud(d, {armR: {shoulder: 140, elbow: 40}}), medal(560, 1160, -1, d, 1.2)], d, 1.08, 1.14, 560, 1200),
  countUp(986, 'EMÚS', 640, 520, -1, -0.5, d, {size: 72}), countUp(9860, 'BALAS', 640, 680, 35.77 - 35.17, 37.13 - 35.17, d, {size: 72})]);
// 37.83–39.40 · «Diez balas por emú.» — 10 balas en fila + rótulo con sello (38.8, en el silencio).
shot(37.83, 39.40, d => [...rays(d, '#ffd21f', '#ffe36b', 640, 1150, 14, 14),
  ...Array.from({length: 10}, (_, i) => bullet(190 + i * 100, 1120, r3(0.06 + i * 0.07), d)),
  emu({x: 640, y: 1650, scale: 0.6, idle: {dur: d}}),
  slam('10 BALAS POR EMÚ', 600, 560, 120, 0.06, d, {outline: true, color: RED, from: 1.12, tilt: -4, maxW: 860}),
  {...slam('10', 1000, 820, 110, 0.97, d, {outline: true, color: RED, stamp: true, tilt: 10, from: 1.3})}]);
// 39.40–40.35 · «Diez.» — zoom lento a la cara del Becario, silencio.
shot(39.40, 40.35, d => [camF([...office(d), becario({x: 640, y: 2420, scale: 2.4, expr: 'serio', idle: {dur: d}, talk: mouth(39.40, 40.35)})], d, t => ({s: mix(1.0, 1.12, t / d)}), 640, 950)]);
// 40.35–43.74 · «Y encima dice que aguantan balas… como tanques.» — emús con casco en formación; las balas rebotan.
const SQUAD = [[300, 1500, 0.55], [640, 1500, 0.55], [980, 1500, 0.55], [470, 1700, 0.62], [810, 1700, 0.62]];
shot(40.35, 43.74, d => [camF([...field(d, {horizon: 1100, stalks: false}),
  ...SQUAD.map(([x, y, s], i) => emu({x, y, scale: s, run: {dur: d, period: 0.5}, move: lin(d, x - 60, x + 60), headExtra: helmet(), angle: 0})),
  ...SQUAD.slice(0, 3).flatMap(([x, y, s], i) => [spark(x + 60 + 120 * s, y - 640 * s, r3(1.25 + i * 0.12), d), spark(x + 60 - 40 * s, y - 380 * s, r3(1.6 + i * 0.1), d)]),
], d, t => ({s: t < 2.28 ? mix(1.0, 1.05, t / 2.28) : mix(1.2, 1.26, eOut((t - 2.28) / 0.5)), ...shake(t, 2.28, 0.25, 14)}), 640, 1400),
  flash(2.28, 0.1, PAPER, 0.6), G([tag('RECREACIÓN LIBRE', 365, 48, {t0: 0.1, tilt: 2})], {x: 250})]);
// 43.74–45.45 · «¿Y el resto? Siguen ahí.» — zoom out hasta el MISMO encuadre del fotograma 1, con el horizonte lleno de emús.
shot(43.74, 45.45, d => [camF(hookSet(d, {crowd: true, peck: [0.9]}), d, t => ({s: mix(2.0, 1.0, eInOut(t / 1.2)), y: mix(300, 0, eInOut(t / 1.2))}), HEAD[0], HEAD[1])]);
// 45.45–46.89 · «Expediente cerrado.» — sello CERRADO en el silencio (46.6).
const CL = 46.6 - 45.45;
shot(45.45, 46.89, d => [cam([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(45.45, 46.89)}),
  G([caseFolder({x: 0, y: 0, scale: 1, label: 'EXPEDIENTE 003'})], {x: 800, y: 1010, scaleX: 0.74, scaleY: 0.74, angle: deg(-3)}),
], d, 1.1, 1.18, 800, 1000), slam('CERRADO', 700, 1050, 110, CL, d, {outline: true, color: RED, tilt: -10, stamp: true, from: 1.25})]);
// 46.89–49.47 · «A ellos les mandaron 10.000 balas.» — cajas de munición apiladas junto al Becario.
shot(46.89, 49.47, d => [cam([...office(d), ammoBox(900, 1400, 0.9), ammoBox(900, 1250, 0.9), ammoBox(900, 1100, 0.9),
  becario({x: 420, y: GROUND - 20, scale: 1.05, expr: 'sarcastico', look: 1, idle: {dur: d}, talk: mouth(46.89, 49.47), gestures: [{t0: 0.4, t1: 2.2, arm: 'R', shoulder: 75, elbow: 10}]}),
], d, 1.0, 1.08, 640, 1150)]);
// 49.47–END · «A mí, ni un sueldo.» — cartera vacía (polilla); por la ventana asoma un emú mirándole (enlaza con el inicio).
const WIN = {x: 740, y: 770};
shot(49.47, END, d => [camF([...office(d),
  emu({x: WIN.x + 117, y: 1370, scale: 0.9, flip: true, eye: 'grande', idle: {dur: d}, move: [{t: 0, y: 1700}, {t: 0.6, y: 1700}, {t: 0.9, y: 1370}]}),
  R(552, 906, 424, 480, {radius: 0, fill: '#efe6d4', stroke: 'none'}),
  R(980, 900, 200, 520, {radius: 6, fill: '#9c7a52'}), ...[950, 1110, 1260].map(y => R(998, y, 164, 130, {radius: 4, fill: '#c8955a', lineWidth: 7})), // archivador del set, encima de la cola
  band(GROUND - 30, 1000, '#cbb995'), band(GROUND - 30, 16, '#a8956e'),
  desk(),
  becario({x: 330, y: GROUND + 40, scale: 1.15, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(49.47, END), armR: {shoulder: 60, elbow: 70}}),
  emptyWallet(560, 1100, 0.05, d, 1.0),
], d, t => ({s: mix(1.08, 1.16, t / d)}), 560, 1050)]);

// Subtítulos: captions.json = voz.py caps words.json --skip 0 --max 20. Karaoke propio; el motor exporta el .srt.
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const cap = captionTrack(WORDS, captions);
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos: solo en silencios medidos (voz.py silences) o muy bajos. Ganancia máx. 1; ambientes ≤ 0,2; whoosh ≤ 0,25.
// rafaga, clic, motor, bum, impresora: ElevenLabs (flow «EXP 003 guerra emus - audio»).
const sfx = [
  F(1.62, 'whoosh', 0.2),
  F(3.72, 'whoosh', 0.2), F(4.78, 'boing', 0.4),
  F(4.85, 'whoosh', 0.2), F(5.12, 'drop', 0.25), F(6.73, 'stamp', 0.5),
  {time: 7.1, kind: 'pop', gain: 0.1},
  F(11.5, 'scratch', 0.45), F(13.02, 'whoosh', 0.2), {time: 13.85, kind: 'tap', gain: 0.12},
  {time: 14.24, kind: 'tap', gain: 0.14}, {time: 14.54, kind: 'tap', gain: 0.14}, {time: 15.7, kind: 'pop', gain: 0.1},
  F(16.95, 'drop', 0.4), F(17.05, 'crickets', 0.6, 0.45), F(18.4, 'bum', 0.5, 0.4),
  F(20.42, 'rafaga', 0.9, 0.98), F(21.37, 'clic', 0.8, 0.2),
  F(22.84, 'bum', 0.45, 0.3), F(23.1, 'whoosh', 0.2), F(24.42, 'impresora', 0.6, 0.33),
  F(24.75, 'whoosh', 0.15), F(26.88, 'bum', 0.4, 0.25),
  F(28.8, 'drop', 0.5), F(28.9, 'drop', 0.35),
  F(29.16, 'motor', 0.2, 2.05), F(31.0, 'whoosh', 0.25),
  F(32.55, 'flap', 0.3, 0.3),
  F(38.79, 'stamp', 0.5),
  F(43.14, 'bum', 0.5, 0.45),
  F(43.74, 'whoosh', 0.2), F(46.58, 'stamp', 0.55),
  F(48.88, 'whoosh', 0.15), F(49.23, 'flap', 0.25, 0.4),
];
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: r3(END - VOICE)}, television: {enabled: false},
  ...(fs.existsSync('music-duck.wav') ? {music: {path: 'music-duck.wav', gain: 0.17}} : {}), burnCaptions: false, captions, shots, sfx}, null, 1));
console.log('shots', shots.length, 'end', END);
