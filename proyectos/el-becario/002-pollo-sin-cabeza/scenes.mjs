// EXPEDIENTE 002 — «Mike, el pollo sin cabeza» (Historias Sin Cabeza). Short 9:16, ~48 s.
// Guion v3 (aprobado 10-nov-2026). Cortes sobre los tiempos reales de la toma A (ElevenLabs Scribe).
// Reaprovecha sets y planos del piloto 01-pollo-sin-cabeza; sin sangre ni corte visible.
import fs from 'node:fs';
import {becario, granjero, person, mike, axeProp, caseFolder, osc, P, E, R, G, S, deg, INK, PAPER, TIE, ctext, sign, choppingBlock, featherBurst, dropperProp} from '../kit.mjs';
import {H, GROUND, RED, YEL, T, tag, captionTrack, layout, fill, band, lin, mix, r3, eOut, eInOut, eBack, shake, jit, sample, camF, cam, slam, popIn, flash, rays, speedLines, cloud, office, desk, makeEpisode, F} from '../lib.mjs';

const {WORDS, shots, shot, mouth} = makeEpisode('words.json');
// Subtítulos abajo (por defecto) o arriba (CAPS=arriba): arriba, los títulos bajan 230 para no chocar.
const CAPS_TOP = process.env.CAPS === 'arriba';
layout.titleDY = CAPS_TOP ? 230 : 0;
const VOICE = 48.901, END = 49.32; // VOICE = duración real de narration.mp3
const DAYS = 214; // contador «DÍAS SIN COBRAR» (sube con los días reales entre episodios)
const FOLLOWERS = 6; // seguidores reales del canal al renderizar

// ---------- sets (del piloto) ----------
const tree = (x, y, s = 1) => G([R(-18, -200, 36, 200, {radius: 6, fill: '#8a5a33', lineWidth: 8}), E(0, -260, 220, 180, {fill: '#5f9e48', lineWidth: 9}), E(-60, -220, 140, 120, {fill: '#6fb354', lineWidth: 9}), E(60, -230, 150, 130, {fill: '#6fb354', lineWidth: 9})], {x, y, scaleX: s, scaleY: s});
const tuft = (x, y) => P([['M', x - 16, y], ['L', x - 8, y - 22], ['L', x, y], ['L', x + 8, y - 26], ['L', x + 16, y]], {stroke: '#4f8a38', lineWidth: 6});
const barn = (x, y, s = 1) => G([R(0, -330, 340, 330, {radius: 4, fill: '#b83a2b'}), ...[60, 120, 180, 240, 300].map(px => P([['M', px, -320], ['L', px, -4]], {stroke: '#8e2b22', lineWidth: 5})),
  S([['M', -40, -330], ['L', 60, -450], ['L', 280, -450], ['L', 380, -330], ['Z']], '#5a2a24'), R(130, -420, 80, 70, {radius: 4, fill: '#f5d27a', lineWidth: 8}),
  R(110, -190, 120, 190, {radius: 2, fill: PAPER}), P([['M', 110, -190], ['L', 230, 0]], {lineWidth: 8}), P([['M', 230, -190], ['L', 110, 0]], {lineWidth: 8})], {x, y, scaleX: s, scaleY: s});
const silo = (x, y) => G([R(0, -420, 120, 420, {radius: 6, fill: '#c9ced3'}), S([['M', 0, -420], ['Q', 60, -500, 120, -420], ['Z']], '#9aa3ab'), ...[-340, -260, -180, -100].map(py => P([['M', 4, py], ['L', 116, py]], {stroke: '#9aa3ab', lineWidth: 5}))], {x, y});
const hay = (x, y) => G([S([['M', -90, 0], ['Q', -100, -130, 0, -140], ['Q', 100, -130, 90, 0], ['Z']], '#e9c46a'), ...[-40, 0, 40].map(px => P([['M', px, -110], ['L', px + 10, -20]], {stroke: '#c9a24a', lineWidth: 5}))], {x, y});
function fenceRow(x0, x1, y) {
  const out = [P([['M', x0, y - 95], ['L', x1, y - 95]], {stroke: '#8a5a33', lineWidth: 12}), P([['M', x0, y - 45], ['L', x1, y - 45]], {stroke: '#8a5a33', lineWidth: 12})];
  for (let px = x0; px <= x1; px += 130) out.push(R(px - 12, y - 135, 26, 135, {radius: 4, fill: '#c89a63', lineWidth: 7}));
  return out;
}
function farm(dur, {sky = '#bfe3f7', sun = true, sunY = 330, sunTo} = {}) {
  const g = GROUND - 90;
  return [fill(sky),
    sun ? G([E(0, 0, 170, 170, {fill: '#ffd34d'}), ...[0, 45, 90, 135, 180, 225, 270, 315].map(a => P([['M', Math.cos(deg(a)) * 110, Math.sin(deg(a)) * 110], ['L', Math.cos(deg(a)) * 150, Math.sin(deg(a)) * 150]], {lineWidth: 10, stroke: '#e0a800'}))], {x: 1060, y: sunY, keys: sunTo !== undefined ? lin(dur, sunY, sunTo, 'y') : osc(dur, 6, 6)}) : null,
    cloud(260, 620, 0.8, dur, 50), cloud(900, 760, 0.6, dur, 70),
    E(200, g + 40, 900, 300, {fill: '#86b85a', stroke: 'none'}), E(1000, g + 60, 1000, 280, {fill: '#7aad50', stroke: 'none'}), band(g, 1200, '#9ccc65'),
    silo(40, g - 10), barn(170, g - 10, 0.85), tree(1110, g - 20, 0.9), hay(620, g - 10), ...fenceRow(480, 1240, g + 30),
    ...[[120, g + 140], [380, g + 200], [700, g + 160], [980, g + 230], [1150, g + 150], [520, g + 330], [860, g + 380]].map(([a, b]) => tuft(a, b)),
  ].filter(Boolean);
}
function desertNight(dur) {
  const g = GROUND - 60;
  const stars = [[120, 520], [300, 620], [520, 480], [760, 600], [880, 470], [1180, 560], [420, 760], [1000, 720], [200, 820]].map(([x, y], i) => E(x, y, 10, 10, {fill: '#fff6c8', stroke: 'none', keys: osc(dur, 1.4 + i * 0.2, 0.35, {prop: 'alpha', radians: false, base: 0.65})}));
  return [fill('#141a36'), band(820, 400, '#1f2650'), band(1060, 300, '#2c2f5e'), ...stars, E(1030, 420, 150, 150, {fill: '#f4f1d0', lineWidth: 8}),
    S([['M', -60, g], ['L', -60, 1040], ['L', 120, 1040], ['L', 180, 980], ['L', 380, 980], ['L', 440, g]], '#43304f', {lineWidth: 8}),
    S([['M', 760, g], ['L', 820, 1030], ['L', 1080, 1030], ['L', 1120, 990], ['L', 1340, 990], ['L', 1340, g]], '#3b2a4a', {lineWidth: 8}),
    band(g, 1000, '#5a4560'), band(g + 120, 140, '#2e2a35'), ...[0, 1, 2, 3, 4].map(i => R(40 + i * 270, g + 182, 140, 16, {radius: 4, fill: '#f2d36b', stroke: 'none'}))];
}
const sighPuff = (x, y, t0) => G([0, 1, 2].map(i => P([['M', i * 34, -i * 10], ['Q', i * 34 + 20, -i * 10 - 22, i * 34 + 40, -i * 10]], {stroke: '#8fa3b8', lineWidth: 8})),
  {x, y, from: t0, to: t0 + 0.9, keys: [{t: t0, alpha: 0, x, y}, {t: r3(t0 + 0.2), alpha: 1}, {t: r3(t0 + 0.9), alpha: 0, x: x + 90, y: y - 70}]});

// ---------- props nuevos ----------
/** Cartel «18 MESES» colgado del cuello de Mike (en coordenadas de mike, escala 1). */
const neckSign = () => G([P([['M', 70, -262], ['L', 70, -150]], {lineWidth: 5}), P([['M', 140, -270], ['L', 190, -150]], {lineWidth: 5}),
  R(40, -160, 170, 80, {radius: 10, fill: PAPER, lineWidth: 7}), ctext('18 MESES', 125, -150, 44, {maxW: 150, color: RED})], {angle: deg(4)});
/** Foto de Mike (polaroid) para la carpeta y el cierre. */
const photo = (d, extra = {}) => G([R(-300, -360, 600, 700, {radius: 8, fill: PAPER, lineWidth: 10}), R(-260, -320, 520, 520, {radius: 2, fill: '#ffe08a', lineWidth: 6}),
  E(0, 150, 420, 70, {fill: '#f2c85f', stroke: 'none'}), mike({x: -20, y: 160, scale: 1.0, idle: {dur: d}}), ctext('MIKE · 1945', 0, 230, 54, {maxW: 500})], extra);
/** Contador del Becario: «DÍAS SIN COBRAR: N». */
const counter = (n, o = {}) => G([R(-210, -46, 420, 92, {radius: 10, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`DÍAS SIN COBRAR: ${n}`, 0, -30, 40, {maxW: 380, color: RED})], o);
const clockIcon = () => G([E(0, 0, 150, 150, {fill: PAPER, lineWidth: 9}), P([['M', 0, 0], ['L', 0, -48]], {lineWidth: 9}), P([['M', 0, 0], ['L', 36, 14]], {lineWidth: 9}), E(0, 0, 16, 16, {fill: INK, stroke: 'none'})]);
const sweat = (x, y, t0) => ({...E(x, y, 26, 40, {fill: '#9fd7ff', lineWidth: 5}), from: t0, keys: [{t: t0, alpha: 0, y}, {t: r3(t0 + 0.1), alpha: 1}, {t: r3(t0 + 0.8), alpha: 0, y: y + 80}]});
/** Jeringa de pera (la que usaban para limpiarle la garganta). */
const bulbSyringe = () => G([R(-22, -10, 44, 230, {radius: 14, fill: '#d9f1ff', lineWidth: 8}), P([['M', -8, 220], ['L', 0, 262], ['L', 8, 220]], {lineWidth: 7}), E(0, -70, 130, 150, {fill: '#c0392b', lineWidth: 9}), P([['M', -30, -110], ['Q', -44, -70, -26, -30]], {stroke: '#e88070', lineWidth: 8})]);
/** Notas musicales «atascadas»: onduladas, que salen del cuello y se deforman. */
const brokenNotes = (x, y, t0, d) => [0, 1, 2, 3].map(i => G([E(0, 0, 44, 34, {fill: INK, stroke: 'none'}), P([['M', 20, 0], ['Q', 34, -50, 20, -90], ['Q', 40, -110, 30, -130]], {lineWidth: 8})],
  {from: t0 + i * 0.22, keys: sample(t => { const u = t - t0 - i * 0.22; return {x: x + u * 260 + Math.sin(u * 12) * 30, y: y - u * 300, a: Math.sin(u * 9) * 35, s: 1 + Math.sin(u * 15) * 0.25, alpha: 1 - u / 1.3}; }, t0 + i * 0.22, d)}));
const bubbles = (x, y, t0, d) => [0, 1, 2, 3, 4].map(i => ({...E(x + (i % 3) * 40 - 40, y, 34 + i * 6, 34 + i * 6, {fill: '#d9f1ff', lineWidth: 5}), from: t0 + i * 0.15, keys: sample(t => { const u = t - t0 - i * 0.15; return {y: y - u * 340, x: x + (i % 3) * 40 - 40 + Math.sin(u * 8 + i) * 18, alpha: 1 - u / 1.0}; }, t0 + i * 0.15, d)}));
const phone = n => G([R(-170, -300, 340, 600, {radius: 40, fill: '#1d1f27', lineWidth: 10}), R(-140, -250, 280, 480, {radius: 16, fill: PAPER, stroke: 'none'}),
  ctext('@HistoriasSinCabeza', 0, -230, 26, {maxW: 250}), ctext('SEGUIDORES', 0, -120, 42, {maxW: 250}), ctext(String(n), 0, -60, 220, {maxW: 240, color: RED}), E(0, 270, 50, 16, {fill: '#444', stroke: 'none'})]);
const cricket = (x, y, t0, d) => G([E(0, 0, 80, 40, {fill: '#5d8a3a', lineWidth: 6}), E(46, -6, 30, 30, {fill: '#5d8a3a', lineWidth: 6}), P([['M', 56, -16], ['Q', 90, -70, 120, -60]], {lineWidth: 4}), P([['M', -20, 10], ['L', -50, 40]], {lineWidth: 5}), P([['M', 10, 14], ['L', -10, 44]], {lineWidth: 5})],
  {x, y, from: t0, keys: sample(t => ({y: y - Math.abs(Math.sin((t - t0) * 10)) * 22}), t0, d)});
const calendar = (t0, d) => G([R(-120, -150, 240, 300, {radius: 10, fill: PAPER, lineWidth: 8}), R(-120, -150, 240, 70, {radius: 10, fill: RED, lineWidth: 8}), ctext('NOV', 0, -140, 44, {color: PAPER, maxW: 200}),
  {...ctext('LUNES', 0, -40, 66, {maxW: 210, color: RED}), from: t0, keys: sample(t => ({s: mix(1.8, 1, eBack((t - t0) / 0.18))}), t0, d)}], {});
const confetti = (t0, d, n = 40) => Array.from({length: n}, (_, i) => ({...R(0, 0, 26, 14, {radius: 3, fill: ['#e0261b', '#ffd21f', '#4f78b8', '#8fbf6a', '#ff8fb1'][i % 5], lineWidth: 3}), from: t0,
  keys: sample(t => { const u = t - t0; return {x: (i * 97) % 1280 + Math.sin(u * 3 + i) * 50, y: ((i * 173) % 2100 - 200 + u * (420 + (i % 5) * 60)) % 2200 - 100, a: u * 360 * (i % 2 ? 1 : -1)}; }, t0, d)}));
/** Primer fotograma (y último, para el bucle): Mike sin cabeza sacando pecho con su cartel, sobre rayos amarillos. */
const HOOK_X = 650, HOOK_Y = 1640, HOOK_S = 2.0;
const hookSet = (d, flapAt = []) => [...rays(d, '#ffd21f', '#ffe36b', 640, 1150, 14, 14), E(640, HOOK_Y + 10, 1200, 210, {fill: '#f2b93a', stroke: 'none'}),
  G([mike({x: 0, y: 0, scale: 1, idle: {dur: d}, flapAt}), neckSign()], {x: HOOK_X, y: HOOK_Y, scaleX: HOOK_S, scaleY: HOOK_S})];
const STUMP = [HOOK_X + 124 * HOOK_S, HOOK_Y - 329 * HOOK_S];

// ================= SHOTS =================
// 0–4.45 · Gancho: «Este pollo vivió dieciocho meses… sin cabeza.» (primer fotograma = miniatura)
shot(0, 4.119, d => [camF(hookSet(d, [0.25, 1.9]), d,
  t => ({s: (t < 2.97 ? mix(1.0, 1.06, t / 2.97) : mix(1.32, 1.12, eOut((t - 2.97) / 0.2)) + mix(0, 0.06, (t - 3.17) / 1.2)), a: t < 2.97 ? 0 : mix(-4, 2, eOut((t - 2.97) / 0.3)), ...shake(t, 2.97, 0.3, 20)}), STUMP[0], STUMP[1] + 200),
  tag('ESTE POLLO VIVIÓ', 357, 75, {pop: false}), flash(2.97, 0.12, PAPER, 1), speedLines(2.97, 3.23, PAPER, STUMP[0], STUMP[1]),
  slam('SIN CABEZA', 640, 520, 128, 2.99, d, {outline: true, color: RED, from: 1.22, tilt: -4})]);
// 4.45–6.9 · «Expediente 002.» La carpeta cae, sello 002, contador; zoom a la foto.
shot(4.119, 6.09, d => [camF([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'sarcastico', look: 0, idle: {dur: d}, talk: mouth(4.119, 6.09), headKeys: [{t: 0, angle: 0}, {t: 0.4, angle: deg(-5)}, {t: d, angle: deg(-3)}]}),
  G([caseFolder({x: 0, y: 0, scale: 1, label: 'EXPEDIENTE 002'}), photo(d, {x: 120, y: 120, scaleX: 0.36, scaleY: 0.36, angle: deg(6)})],
    {x: 800, y: 1010, scaleX: 0.74, scaleY: 0.74, keys: [{t: 0, y: 700, angle: deg(-14)}, {t: 0.18, y: 1010, angle: deg(-3)}, {t: 0.26, y: 980, angle: deg(-3)}, {t: 0.34, y: 1010, angle: deg(-3)}]}),
  popIn(counter(DAYS, {x: 800, y: 660}), 0.75, d),
], d, t => ({s: (t < 1.9 ? mix(1.12, 1.18, t / 1.9) : mix(1.18, 3.2, eInOut((t - 1.9) / 0.16))) + (t > 0.18 && t < 0.4 ? 0.04 : 0), ...shake(t, 0.18, 0.2, 12), ...shake(t, 1.39, 0.2, 14)}), 835, 1055),
  slam('002', 600, 470, 200, 1.39, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.15}), flash(1.85, 0.1, '#c9a46a', 0.75)]);
// 6.9–8.95 · «Colorado, 1945.» Flashback en sepia, grúa desde el cielo.
shot(6.09, 8.49, d => [camF([...farm(d, {sunTo: 300, sunY: 420}), mike({x: 1010, y: GROUND + 40, scale: 0.8, head: true, idle: {dur: d}}),
  {...fill('#b8894a'), keys: [{t: 0, alpha: 0.55}, {t: 1.4, alpha: 0.3}, {t: d, alpha: 0.18}]},
  {...fill('#000000'), keys: sample(t => ({alpha: 0.05 + 0.04 * Math.abs(jit(t * 3, 5))}), 0, d, 1 / 15)},
], d, t => ({s: mix(1.45, 1.0, eInOut(t / 1.6)), y: mix(-260, 0, eInOut(t / 1.6))}), 640, 300),
  slam('COLORADO', 640, 380, 120, 0.1, d, {outline: true, color: PAPER, from: 1.3}), slam('1945', 640, 540, 130, 0.72, d, {outline: true, color: RED, stamp: true, tilt: -6})]);
// 8.95–10.35 · «Viene a cenar la suegra…» La suegra, de brazos cruzados, mira el reloj.
shot(8.49, 9.778, d => [cam([...farm(d, {sunY: 300}), {...fill('#b8894a'), alpha: 0.15},
  person({who: 'suegra', x: 640, y: GROUND + 330, scale: 1.55, expr: 'serio', look: 1, idle: {dur: d}, armL: {shoulder: 30, elbow: 120}, gestures: [{t0: 0.25, t1: 1.25, arm: 'R', shoulder: 60, elbow: 110}], headKeys: osc(d, 0.5, 3)}),
  popIn(G([clockIcon()], {x: 1000, y: 760}), 0.3, d),
], d, 1.0, 1.08), slam('LA SUEGRA', 620, 480, 130, 0.68, d, {outline: true, color: RED, tilt: -5, from: 1.3})]);
// 10.35–12.4 · «…y el granjero va a por un pollo.» Traga saliva, sale con el hacha.
shot(9.778, 11.918, d => [cam([...farm(d), choppingBlock(800, GROUND + 20, 1.2), mike({x: 1010, y: GROUND + 40, scale: 0.85, head: true, idle: {dur: d}}),
  granjero({x: 430, y: GROUND, scale: 1.05, expr: 'nervioso', axe: true, walk: {dur: 1.6}, idle: {dur: d}, move: lin(1.6, -120, 430)}),
  sweat(520, 820, 0.2), sweat(540, 840, 1.2)], d),]);
// 12.4–13.2 · «Hachazo…» El hacha sube y… corte a negro con ¡ZAS! y plumas (nada visible).
const BX = 771, BY = GROUND, BS = 1.31, MS = 0.92, MY = GROUND - 150 * BS;
shot(11.918, 13.0, d => [cam([...farm(d), choppingBlock(BX, BY, BS), mike({x: BX, y: MY, scale: MS, head: true, idle: {dur: d}}),
  granjero({x: 430, y: GROUND, scale: 1.05, expr: 'serio', axe: true, idle: {dur: d}, poses: {R: [{t: 0, shoulder: 60, elbow: 0}, {t: 0.6, shoulder: 172, elbow: -45}, {t: d, shoulder: 172, elbow: -45}]}}),
], d, 1.0, 1.12), {...fill('#000000'), from: 0.66}, ...featherBurst(640, 1000, 0.66, 9, 420, d), slam('¡ZAS!', 640, 900, 220, 0.66, d, {outline: true, color: YEL, from: 1.5, tilt: -6})]);
// 13.2–14.5 · «…y el pollo se levanta.»
shot(13.0, 13.994, d => [cam([...farm(d), choppingBlock(BX, BY, BS),
  granjero({x: 330, y: GROUND, scale: 1.0, expr: 'sorpresa', idle: {dur: d}, axe: true, armR: {shoulder: 5}, armL: {shoulder: 40, elbow: 30}}),
  ...featherBurst(BX, MY - 200, 0.0, 4, 120, d - 0.01),
  mike({x: BX + 40, y: MY, scale: 1.0, idle: {dur: d}, flapAt: [0.4], move: [{t: 0, angle: deg(-82), y: MY + 60}, {t: 0.22, angle: deg(-82), y: MY + 60}, {t: 0.6, angle: 0, y: MY}]})], d)]);
// 14.5–15.6 · «Y se va andando.» Al granjero se le cae el hacha (boing); la cámara sigue a Mike.
shot(13.994, 15.113, d => [camF([...farm(d), granjero({outline: true, x: 240, y: GROUND, scale: 1.0, expr: 'sorpresa', idle: {dur: d}, armL: {shoulder: 150, elbow: 15}, armR: {shoulder: 150, elbow: 15}, headKeys: osc(d, 0.6, 4)}),
  G([axeProp()], {x: 380, y: 920, keys: [{t: 0, y: 920, angle: deg(-30)}, {t: 0.15, y: 920, angle: deg(-30)}, {t: 0.4, y: 1330, angle: deg(-110)}, {t: 0.5, y: 1300, angle: deg(-100)}, {t: 0.6, y: 1330, angle: deg(-110)}]}),
  mike({x: 640, y: GROUND, scale: 1.15, walk: {dur: d}, move: lin(d, 560, 900)})], d,
  t => ({s: 1.12, x: mix(60, -140, eInOut(t / d)), ...shake(t, 0.4, 0.15, 8)}), 640, 1000)]);
// 15.6–17.7 · «Al día siguiente… sigue vivo.» Amanecer acelerado y zoom de golpe en «vivo».
shot(15.113, 17.049, d => [camF([...farm(d, {sky: '#ffd9a8', sunY: 900, sunTo: 520}), mike({x: 820, y: GROUND, scale: 1.15, idle: {dur: d}, flapAt: [1.4]}),
  granjero({x: 330, y: GROUND, scale: 1.0, expr: 'sorpresa', walk: {dur: 1.1}, idle: {dur: d}, move: lin(1.1, 120, 330)}), flash(1.6, 0.1, PAPER, 0.6)], d,
  t => ({s: t < 1.6 ? mix(1.0, 1.05, t / 1.6) : mix(1.05, 1.5, eOut((t - 1.6) / 0.18)), ...shake(t, 1.6, 0.3, 14)}), 940, 1150),
  slam('¡VIVO!', 640, 520, 150, 1.6, d, {outline: true, color: RED, tilt: 6})]);
// 17.7–18.5 · «¿Cómo?» Disco rayado, zoom inclinado al Becario.
shot(17.049, 17.775, d => [camF([...office(d), becario({x: 640, y: 2080, scale: 1.75, expr: 'sorpresa', idle: {dur: d}, talk: mouth(17.049, 17.775), armL: {shoulder: 40, elbow: 120}, armR: {shoulder: 40, elbow: 120}})], d,
  t => ({s: mix(1.0, 1.22, eOut(t / 0.2)), a: mix(0, -7, eOut(t / 0.2)), ...shake(t, 0, 0.25, 12)}), 640, 1000), slam('¿CÓMO?', 640, 420, 140, 0.34, d, {outline: true, color: RED, from: 1.5})]);
// 18.5–21.1 · Rayos X: el tronco del cerebro se ilumina en «tronco».
const XR = '#0f2a45', XL = '#6fd3ff';
const xrayBg = () => [fill(XR), ...Array.from({length: 9}, (_, i) => P([['M', 0, 300 + i * 220], ['L', 1280, 300 + i * 220]], {stroke: '#17395c', lineWidth: 4})), ...Array.from({length: 7}, (_, i) => P([['M', 40 + i * 200, 0], ['L', 40 + i * 200, 2300]], {stroke: '#17395c', lineWidth: 4}))];
shot(17.775, 20.46, d => [camF([...xrayBg(), mike({x: 520, y: 1700, scale: 2.1, idle: {dur: d}, alpha: 0.9}),
  G([E(0, 0, 70, 120, {fill: '#ff8fb1', stroke: '#ffffff', lineWidth: 8}), E(0, 0, 150, 220, {fill: 'none', stroke: XL, lineWidth: 6})], {x: 520 + 124 * 2.1, y: 1700 - 300 * 2.1, from: 1.5, keys: sample(t => ({s: mix(0.2, 1, eBack((t - 1.5) / 0.25)) * (1 + 0.06 * Math.sin(t * 9)), alpha: (t - 1.5) / 0.1}), 1.5, d)}),
  {...band(0, 26, XL), alpha: 0.75, keys: sample(t => ({y: mix(260, 1900, (t % 1.2) / 1.2)}), 0, d)},
], d, t => ({s: mix(1.0, 1.35, eInOut((t - 1.3) / 0.6))}), 520 + 124 * 2.1, 1700 - 300 * 2.1),
  tag('RAYOS X', 343, 57, {color: XL, bg: '#0b1f33'}), slam('TRONCO DEL CEREBRO', 640, 470, 76, 1.62, d, {outline: true, color: PAPER, from: 1.12})]);
// 21.1–22.55 · «…lo justo para respirar…» Pulmones que se hinchan.
shot(20.46, 21.851, d => [camF([...rays(d, '#e3f1ff', '#d2e7fb', 640, 1080, -12),
  G([E(-130, 0, 220, 360, {fill: '#f6a6b2', lineWidth: 10}), E(130, 0, 220, 360, {fill: '#f6a6b2', lineWidth: 10}), P([['M', 0, -320], ['L', 0, -150], ['M', 0, -150], ['L', -70, -90], ['M', 0, -150], ['L', 70, -90]], {lineWidth: 12})],
    {x: 640, y: 1150, keys: sample(t => ({s: 1.35 * (t < 0.2 ? mix(0.3, 1, eBack(t / 0.2)) : 1 + 0.12 * Math.sin((t - 0.2) * Math.PI * 1.8))}), 0, d)}),
], d, t => ({s: 1.03}), 640, 1080)]);
// 22.55–23.33 · «…y andar.» Mike cruza la radiografía andando.
shot(21.851, 22.657, d => [cam([...xrayBg(), mike({x: 640, y: 1700, scale: 1.7, walk: {dur: d, period: 0.36}, move: lin(d, 380, 800), alpha: 0.9})], d, 1.0, 1.06)]);
// 23.33–24.69 · «Lo alimentan con un gotero…» Primer plano del gotero por el cuello.
shot(22.657, 24.05, d => [cam([fill('#eaf4fb'), mike({x: 330, y: 1900, scale: 2.6, idle: {dur: d}}),
  G([P([['M', 1400, 560], ['L', 700, 700]], {lineWidth: 96}), P([['M', 1400, 560], ['L', 700, 700]], {stroke: '#c2412f', lineWidth: 78}), ...[0, 1, 2, 3].map(i => P([['M', 1300 - i * 150, 580 + i * 30], ['L', 1320 - i * 150, 660 + i * 30]], {stroke: '#8f2a1e', lineWidth: 6})),
    G([R(-26, 120, 52, 220, {radius: 16, fill: '#d9f1ff', lineWidth: 9}), P([['M', -10, 340], ['L', 0, 372], ['L', 10, 340]], {lineWidth: 8}),
      E(0, 70, 100, 120, {fill: TIE, lineWidth: 9, keys: [{t: 0.35, scaleX: 1, scaleY: 1}, {t: 0.5, scaleX: 0.8, scaleY: 0.8}, {t: 0.7, scaleX: 1, scaleY: 1}]}),
      E(30, 80, 110, 90, {lineWidth: 9}), ...[0, 1, 2].map(i => E(-30, 46 + i * 34, 46, 34, {lineWidth: 8})),
      {...E(0, 380, 30, 40, {fill: '#5fb7ef', lineWidth: 6}), from: 0.5, keys: [{t: 0.5, scaleX: 0.3, scaleY: 0.3, y: 360}, {t: 0.6, scaleX: 1, scaleY: 1, y: 370}, {t: 0.95, y: 560}]}], {x: 650, y: 560})],
    {keys: [{t: 0, x: 120, y: -60}, {t: 0.3, x: 0, y: 0}]}),
], d, 1, 1.08)]);
// 24.69–26.7 · «…y le limpian la garganta con una jeringa.» La jeringa queda en la mesa (se usará después).
shot(24.05, 26.002, d => [cam([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'agobiado', look: 1, idle: {dur: d}, headKeys: [{t: 0, angle: 0}, {t: 0.5, angle: deg(-8)}, {t: d, angle: deg(-8)}]}),
  G([bulbSyringe()], {x: 820, y: 1110, angle: deg(-84), keys: sample(t => ({s: mix(0.1, 1.0, eBack(t / 0.3)), a: -84}), 0, d)}),
  {...E(830, 1100, 480, 220, {fill: 'none', stroke: RED, lineWidth: 12}), from: 1.3, keys: sample(t => ({s: mix(1.4, 1, eOut((t - 1.3) / 0.2)), alpha: (t - 1.3) / 0.08}), 1.3, d)},
], d, 1.02, 1.12, 830, 1100), slam('¡OJO A ESTO!', 640, 480, 90, 1.35, d, {outline: true, color: RED, tilt: -4})]);
// 26.7–28.2 · «Hasta intenta cantar.» Mike en la valla al amanecer: hincha el pecho y salen notas deformes.
shot(26.002, 28.518, d => [cam([...farm(d, {sky: '#ffcf9a', sunY: 700}), mike({x: 640, y: GROUND - 60, scale: 1.7, idle: {dur: d}, flapAt: [0.5, 1.5],
  move: sample(t => ({s: 1.7 * (1 + (t > 1.1 && t < 2.45 ? 0.1 * Math.sin((t - 1.1) / 1.35 * Math.PI) : 0)), a: t > 1.12 && t < 2.45 ? Math.sin((t - 1.12) * 40) * 2 : 0}), 0, d)}),
  ...brokenNotes(640 + 124 * 1.7 + 150, GROUND - 60 - 329 * 1.7 + 40, 1.15, d)], d, 1.0, 1.14, 640, 1100), slam('¡CANTA!', 640, 540, 150, 0.74, d, {outline: true, color: RED, tilt: 5})]);
// 28.2–29.95 · «Suena a tubería atascada.» El Becario, a cámara, impasible; burbujas.
shot(28.518, 30.326, d => [camF([fill('#d9e8f5'), band(1700, 600, '#c0d3e6'), ...bubbles(980, 1300, 0.3, d),
  becario({x: 640, y: 2420, scale: 2.25, expr: 'serio', look: 0, idle: {dur: d}, talk: mouth(28.518, 30.326)})], d,
  t => ({x: mix(-520, 0, eOut(t / 0.12)), s: mix(1.0, 1.05, t / d)}), 640, 1050)]);
// 29.95–30.85 · «Lo llaman Mike…»
shot(30.326, 31.31, d => [cam([fill('#ffe9a8'), E(640, 1380, 800, 140, {fill: '#f2d68a', stroke: 'none'}), mike({x: 640, y: 1400, scale: 1.5, idle: {dur: d}, flapAt: [0.3]}), G([popIn(sign('MIKE', -310, -100, 620, 200, {size: 150, color: RED, radius: 30}), 0.05, d)], {x: 640, y: 620})], d, 1, 1.07)]);
// 30.85–31.6 · Portadas que caen con flashes.
const cover = (title, c) => G([R(0, 0, 640, 880, {radius: 6, fill: PAPER}), R(0, 0, 640, 160, {radius: 6, fill: c}), ctext(title, 320, 28, 92, {color: PAPER, maxW: 580}), mike({x: 320, y: 700, scale: 1.1}), ctext('¡SIN CABEZA!', 320, 750, 74, {maxW: 580, color: RED})]);
shot(31.31, 32.06, d => [cam([fill('#2b2f3a'),
  G([cover('REVISTA', RED)], {x: 120, y: 430, pivotX: 320, pivotY: 440, keys: [{t: 0, angle: deg(-14), scaleX: 1.3, scaleY: 1.3, alpha: 0}, {t: 0.12, angle: deg(-6), scaleX: 1, scaleY: 1, alpha: 1}]}),
  G([cover('NOTICIAS', '#2f6fb0')], {x: 420, y: 540, pivotX: 320, pivotY: 440, from: 0.32, keys: [{t: 0.32, angle: deg(12), scaleX: 1.3, scaleY: 1.3, alpha: 0}, {t: 0.44, angle: deg(5), scaleX: 1, scaleY: 1, alpha: 1}]}),
], d), flash(0.1, 0.08, PAPER, 0.8), flash(0.42, 0.08, PAPER, 0.7)]);
// 31.6–32.69 · «…y se va de gira por todo el país.»
shot(32.06, 33.15, d => [cam([fill('#bfe3f7'), cloud(300, 640, 0.7, d, -120), cloud(950, 780, 0.5, d, -160),
  S([['M', -60, 1200], ['L', 200, 1000], ['L', 420, 1160], ['L', 700, 960], ['L', 1000, 1150], ['L', 1340, 1010], ['L', 1340, 1300], ['L', -60, 1300], ['Z']], '#c99a6a', {lineWidth: 8}),
  band(1290, 1000, '#d8c08e'), band(1380, 120, '#4a4a52'), ...[0, 1, 2, 3, 4, 5].map(i => R(i * 260 - 40, 1432, 120, 14, {radius: 4, fill: '#f2d36b', stroke: 'none', keys: lin(d, i * 260 - 40, i * 260 - 300)})),
  G([R(-330, -330, 660, 300, {radius: 34, fill: '#ffd34d'}), R(-300, -312, 200, 160, {radius: 14, fill: '#d9f1ff'}), R(-90, -312, 400, 136, {radius: 12, fill: PAPER}), ctext('POLLO', 110, -304, 54, {maxW: 340, color: RED}), ctext('SIN CABEZA', 110, -248, 54, {maxW: 340, color: RED}),
    E(-200, -20, 120, 120, {fill: INK}), E(-200, -20, 50, 50, {fill: '#9aa3ab', lineWidth: 6}), E(200, -20, 120, 120, {fill: INK}), E(200, -20, 50, 50, {fill: '#9aa3ab', lineWidth: 6}),
    // Mike asomado a la ventana (dentro del autobús, no encima)
    mike({x: -225, y: -150, scale: 0.36, idle: {dur: d}, flapAt: [0.3]}), R(-300, -312, 200, 160, {radius: 14, fill: 'none', lineWidth: 10}), R(-330, -168, 260, 30, {radius: 6, fill: '#ffd34d', stroke: 'none'})],
    {x: 600, y: 1400, keys: osc(d, 0.35, 5, {prop: 'y', radians: false, base: 1400})}),
], d)]);
// 32.69–34.25 · «La gente paga por verlo.» Feria, cola, monedas.
shot(33.15, 34.605, d => [cam([fill('#ffe2b8'), band(GROUND - 20, 900, '#e2c79b'),
  ...[0, 1, 2, 3, 4, 5].map(i => R(260 + i * 130, 620, 130, 520, {radius: 0, fill: i % 2 ? PAPER : RED, lineWidth: 8})), S([['M', 230, 620], ['L', 640, 430], ['L', 1050, 620], ['Z']], RED, {lineWidth: 12}),
  R(330, 690, 620, 170, {radius: 14, fill: PAPER}), ctext('VEA AL POLLO', 640, 705, 64, {maxW: 560}), ctext('SIN CABEZA', 640, 780, 64, {maxW: 560, color: RED}),
  mike({x: 640, y: 1160, scale: 0.78, idle: {dur: d}}),
  person({who: 'civil', x: 130, y: GROUND, scale: 0.62, expr: 'sorpresa', idle: {dur: d}}), person({who: 'civil2', x: 290, y: GROUND, scale: 0.62, expr: 'contento', idle: {dur: d}, gestures: [{t0: 0.3, t1: 1.2, arm: 'R', shoulder: 100, elbow: 10}]}),
  person({who: 'civil2', x: 990, y: GROUND, scale: 0.62, expr: 'sorpresa', idle: {dur: d}}), person({who: 'civil', x: 1150, y: GROUND, scale: 0.62, expr: 'contento', idle: {dur: d}, gestures: [{t0: 0.6, t1: 1.4, arm: 'L', shoulder: 100, elbow: 10}]}),
  ...[[240, 980, 0.3], [1040, 960, 0.6], [160, 860, 0.9], [1120, 840, 1.15]].map(([x, y, t]) => popIn(E(x, y, 70, 70, {fill: '#ffd34d', lineWidth: 8}), t, d)),
], d)]);
// 34.25–35.9 · «A mí, ni gratis.» Corte seco: el Becario y su móvil con 2 seguidores. Grillos.
shot(34.605, 36.706, d => [cam([...office(d), desk(),
  becario({x: 330, y: GROUND - 20, scale: 1.05, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(34.605, 36.706), headKeys: [{t: 0, angle: deg(6)}, {t: d, angle: deg(10)}]}),
  G([phone(FOLLOWERS)], {x: 860, y: 860, angle: deg(4), keys: sample(t => ({s: mix(0.2, 1, eBack(t / 0.22))}), 0, d)}),
  cricket(700, 1180, 1.3, d), cricket(1080, 1220, 1.45, d),
], d, 1.0, 1.05, 760, 1000)]);
// 35.9–38.85 · «Pero una noche, en un motel, se atraganta…» Motel de noche, tono serio.
// Silueta de Mike tras la cortina de la ventana iluminada: tranquilo y, en «se atraganta», se agita (sin nada explícito).
const CHOKE = 2.07, WX = 420 + 210 + 55, WY = GROUND - 60 - 110;
const silhouette = d => G([E(0, -60, 150, 105, {fill: '#5a3b22', stroke: 'none'}), S([['M', 30, -90], ['Q', 40, -150, 62, -168], ['L', 84, -160], ['Q', 72, -120, 70, -70], ['Z']], '#5a3b22', {stroke: 'none'}),
  E(-60, -80, 70, 40, {fill: '#5a3b22', stroke: 'none'}), P([['M', -14, -10], ['L', -18, 20]], {stroke: '#5a3b22', lineWidth: 10}), P([['M', 18, -10], ['L', 22, 20]], {stroke: '#5a3b22', lineWidth: 10})],
  {x: WX, y: WY, scaleX: 0.55, scaleY: 0.55, keys: sample(t => t < CHOKE ? {x: WX + Math.sin(t * 2) * 6, a: 0} : {x: WX + jit(t * 1.6, 3) * 12, y: WY - Math.abs(Math.sin((t - CHOKE) * 22)) * 10, a: Math.sin((t - CHOKE) * 26) * 12}, 0, d)});
shot(36.706, 39.68, d => [camF([...desertNight(d),
  G([R(0, -420, 720, 420, {radius: 6, fill: '#b5694d'}), S([['M', -30, -420], ['L', 750, -420], ['L', 720, -470], ['L', 0, -470], ['Z']], '#7a3f30'),
    ...[0, 1, 2, 3].map(i => R(40 + i * 170, -300, 110, 190, {radius: 4, fill: i === 1 ? '#ffe08a' : '#3a2a20', lineWidth: 8}))], {x: 420, y: GROUND - 60}),
  R(230, 520, 30, 840, {radius: 6, fill: '#6b6f78', lineWidth: 7}),
  R(120, 560, 400, 170, {radius: 18, fill: '#22263a', stroke: '#ff5fa2', lineWidth: 12}), ctext('MOTEL', 320, 584, 100, {maxW: 340, color: '#ff5fa2', to: 2.12, keys: [{t: 0, alpha: 1}, {t: 0.9, alpha: 1}, {t: 1.0, alpha: 0.3}, {t: 1.1, alpha: 1}, {t: 2.0, alpha: 1}, {t: 2.1, alpha: 0.25}, {t: 2.2, alpha: 1}]}),
  silhouette(d), R(420 + 210, GROUND - 360, 110, 190, {radius: 4, fill: 'none', lineWidth: 8}),
  G([popIn(ctext('¡!', 0, -60, 90, {color: RED, maxW: 120}), CHOKE + 0.05, d)], {x: WX + 80, y: WY - 200}),
], d, t => ({s: t < CHOKE - 0.2 ? mix(1.08, 1.0, t / (CHOKE - 0.2)) : mix(1.0, 2.1, eInOut((t - CHOKE + 0.2) / 0.45)), ...shake(t, CHOKE + 0.25, 0.4, 8)}), WX, WY - 60)]);
// 38.85–40.55 · «…y no encuentran la jeringa.» El granjero busca en los cajones, agobiado.
shot(39.68, 41.282, d => [cam([fill('#4a3f63'), ...[0, 1, 2, 3, 4, 5, 6].map(i => R(i * 200 - 40, -60, 90, 2400, {radius: 0, fill: '#544870', stroke: 'none'})),
  R(820, 520, 300, 360, {radius: 6, fill: '#1c2140', lineWidth: 10}), band(GROUND - 20, 900, '#6b4f3a'),
  R(60, 1000, 460, 420, {radius: 10, fill: '#8a6a4a'}), ...[1080, 1240].map(y => G([R(90, 0, 400, 130, {radius: 6, fill: '#a7825c', lineWidth: 8}), E(290, 65, 30, 20, {fill: INK, stroke: 'none'})], {y, keys: y === 1080 ? [{t: 0.3, x: 0}, {t: 0.55, x: -80}] : [{t: 0.9, x: 0}, {t: 1.15, x: -80}]})),
  G([R(-20, -200, 40, 200, {radius: 6, fill: '#c9a24a', lineWidth: 7}), S([['M', -90, -200], ['L', 90, -200], ['L', 60, -300], ['L', -60, -300], ['Z']], '#f5d27a', {lineWidth: 8})], {x: 290, y: 1000}),
  granjero({x: 760, y: GROUND, scale: 1.1, expr: 'agobiado', walk: {dur: d, period: 0.5, stride: 18}, move: [{t: 0, x: 900}, {t: d / 2, x: 650}, {t: d, x: 820}], headKeys: osc(d, 0.7, 8)}),
], d)]);
// 40.55–42.85 · «Hoy su pueblo le hace un festival cada año.» Explosión de color y confeti.
shot(41.282, 43.642, d => [cam([fill('#bfe3f7'), cloud(250, 640, 0.6, d, 60),
  ...[[-40, 260, '#e6b34a'], [220, 300, '#8fbf6a'], [520, 240, '#d98a6a'], [760, 300, '#9fb6c9'], [1020, 280, '#e6b34a']].map(([x, w, c]) => G([R(0, -w * 2.2, w, w * 2.2, {radius: 4, fill: c}), R(w * 0.2, -w * 1.8, w * 0.25, w * 0.35, {radius: 4, fill: '#d9f1ff', lineWidth: 6}), R(w * 0.55, -w * 1.8, w * 0.25, w * 0.35, {radius: 4, fill: '#d9f1ff', lineWidth: 6})], {x, y: GROUND - 40})),
  band(GROUND - 40, 900, '#c9c3b6'),
  P([['M', -40, 560], ['Q', 640, 720, 1320, 560]], {lineWidth: 6}), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => G([S([['M', -30, 0], ['L', 30, 0], ['L', 0, 90], ['Z']], ['#d8352a', '#ffd34d', '#4f78b8', '#9ccc65'][i % 4], {lineWidth: 6})], {x: 90 + i * 150, y: 600 + Math.sin(i / 7 * Math.PI) * 70, pivotX: 0, pivotY: 0, keys: osc(d, 1.2 + i * 0.1, 6)})),
  sign('FESTIVAL DE MIKE', 300, 780, 680, 130, {size: 64, color: RED, radius: 14}),
  mike({x: 640, y: GROUND, scale: 1.2, walk: {dur: d, period: 0.5}, move: lin(d, 560, 720)}),
  person({who: 'civil', x: 190, y: GROUND, scale: 0.75, expr: 'contento', idle: {dur: d}, armL: {shoulder: 150}, armR: {shoulder: 150}, headKeys: osc(d, 0.5, 6)}),
  person({who: 'civil2', x: 1090, y: GROUND, scale: 0.75, expr: 'contento', idle: {dur: d}, gestures: [{t0: 0.2, t1: 2.0, arm: 'L', shoulder: 150, elbow: 10}]}),
  ...confetti(0, d),
], d), flash(0, 0.1, PAPER, 0.7)]);
// 42.85–44.2 · «Expediente cerrado.» Sello CERRADO y el contador sube a 215.
shot(43.642, 45.002, d => [cam([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(43.642, 45.002)}),
  G([caseFolder({x: 0, y: 0, scale: 1, label: 'EXPEDIENTE 002'})], {x: 800, y: 1010, scaleX: 0.74, scaleY: 0.74, angle: deg(-3)}),
  counter(DAYS, {x: 800, y: 660, to: 0.95}), {...counter(DAYS + 1, {x: 800, y: 660}), from: 0.95, keys: sample(t => ({s: mix(1.35, 1, eBack((t - 0.95) / 0.2))}), 0.95, d)},
], d, 1.1, 1.18, 800, 1000), slam('CERRADO', 700, 1050, 110, 0.64, d, {outline: true, color: RED, tilt: -10, stamp: true, from: 1.25})]);
// 44.2–48.1 · «Dieciocho meses sin cabeza… y yo no aguanto ni un lunes.» Mira la foto; luego a cámara. Calendario: LUNES.
shot(45.002, 48.96, d => [camF([...office(d),
  G([calendar(3.3, d)], {x: 300, y: 720}),
  becario({x: 560, y: GROUND + 120, scale: 1.25, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(45.002, 48.96),
    headKeys: [{t: 0, angle: deg(8)}, {t: 2.0, angle: deg(10)}, {t: 2.3, angle: 0}, {t: d, angle: deg(-4)}]}),
  photo(d, {x: 890, y: 1150, scaleX: 0.55, scaleY: 0.55, angle: deg(-6)}),
  sighPuff(640, 860, 2.13),
], d, t => ({s: t < 2.1 ? mix(1.05, 1.12, t / 2.1) : mix(1.12, 1.2, eInOut((t - 2.1) / 1.5)), x: t < 2.1 ? -80 : mix(-80, 0, eInOut((t - 2.1) / 0.5))}), 640, 1000)]);
// 48.1–48.5 · Bucle: zoom a la foto y se funde con el primer fotograma.
shot(48.96, END, d => [camF(hookSet(d), d, t => ({s: mix(1.25, 1.0, eOut(t / 0.3))}), STUMP[0], STUMP[1] + 200), flash(0, 0.12, PAPER, 0.9), tag('ESTE POLLO VIVIÓ', 357, 75)]);

// Subtítulos (motor): captions.json = voz.py caps words.json --skip 3 --max 20 («Este pollo vivió» ya lo dice la etiqueta del gancho).
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
// Karaoke propio (palabra en amarillo); el motor no los pinta (burnCaptions: false) pero exporta el .srt.
const cap = captionTrack(WORDS, captions, CAPS_TOP ? {y: 330} : {});
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos: nunca tapan una palabra. Los golpes van en los huecos de la voz o muy bajos; ambientes ≤ 0,2.
const sfx = [
  F(2.9, 'whoosh', 0.25), F(2.93, 'stamp', 0.4), F(2.97, 'flap', 0.3, 0.6),
  F(4.119, 'whoosh', 0.2), F(4.3, 'drop', 0.3), F(4.33, 'stamp', 0.3), {time: 4.89, kind: 'pop', gain: 0.12}, F(5.52, 'stamp', 0.45), F(6.03, 'whoosh', 0.2),
  F(6.09, 'projector', 0.2), F(6.81, 'stamp', 0.35),
  F(8.49, 'whoosh', 0.2), {time: 8.79, kind: 'tap', gain: 0.12}, {time: 9.04, kind: 'tap', gain: 0.12}, {time: 9.27, kind: 'tap', gain: 0.12}, F(9.17, 'stamp', 0.3),
  F(9.778, 'whoosh', 0.2), {time: 10.08, kind: 'pop', gain: 0.1},
  F(11.918, 'whoosh', 0.3), F(12.58, 'chop', 0.85), F(12.62, 'flap', 0.4, 0.8),
  F(13.0, 'whoosh', 0.2), F(13.6, 'flap', 0.3, 0.6), F(13.994, 'whoosh', 0.2), F(14.4, 'boing', 0.35),
  F(15.113, 'whoosh', 0.2), F(16.71, 'stamp', 0.35), F(16.74, 'flap', 0.3, 0.6), F(17.0, 'scratch', 0.45),
  {time: 17.9, kind: 'chime', gain: 0.08}, {time: 19.4, kind: 'pop', gain: 0.12}, F(20.46, 'whoosh', 0.2), F(21.851, 'whoosh', 0.2),
  F(22.657, 'whoosh', 0.2), F(23.16, 'drop', 0.4), F(24.05, 'whoosh', 0.2), {time: 24.11, kind: 'pop', gain: 0.12}, F(25.35, 'stamp', 0.3),
  F(26.002, 'whoosh', 0.2), F(27.15, 'pipe', 1.0, 1.0), F(28.518, 'whoosh', 0.2),
  F(30.326, 'whoosh', 0.2), {time: 30.4, kind: 'chime', gain: 0.1}, F(31.36, 'flash', 0.4), F(31.68, 'flash', 0.35), F(32.06, 'whoosh', 0.2),
  F(33.15, 'crowd', 0.2), F(34.36, 'register', 0.4, 0.5),
  F(34.605, 'whoosh', 0.15), F(35.93, 'crickets', 0.6, 0.8),
  F(36.706, 'neon', 0.18, 2.0), F(39.68, 'whoosh', 0.15), {time: 39.98, kind: 'tap', gain: 0.12}, {time: 40.58, kind: 'tap', gain: 0.12},
  F(41.282, 'crowd', 0.2), {time: 41.33, kind: 'chime', gain: 0.1}, F(41.33, 'flash', 0.25),
  F(43.642, 'whoosh', 0.2), F(44.28, 'stamp', 0.55), {time: 44.6, kind: 'pop', gain: 0.14},
  F(45.002, 'whoosh', 0.2), {time: 48.3, kind: 'tap', gain: 0.2},
  F(48.96, 'whoosh', 0.3), F(49.01, 'gurgle', 0.35, 0.35),
];
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: r3(END - VOICE)}, television: {enabled: false}, music: {path: 'music.mp3', gain: 0.1}, burnCaptions: false, captions, shots, sfx}, null, 1));
console.log('shots', shots.length, 'end', END);
