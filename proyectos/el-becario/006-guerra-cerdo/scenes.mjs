// EXPEDIENTE 006 — «La Guerra del Cerdo» (San Juan, 1859-72) (Historias Sin Cabeza). Short 9:16, ~47 s.
// Guion v2 (guion.md). Voz: toma A ×1,06 + 7 pausas recortadas + 0,35 s de pausa tras «tiro.» (10,42) = 46,71 s.
// v2 (autocrítica 16-nov): pies por encima de los subtítulos (y ≤ 1690), planos ≤ ~3 s, miniatura con menos cielo,
// mapa con las DOS fronteras reclamadas (Haro / Rosario), gruñido en la pausa del gancho, carteles de «VALOR» en el remate.
import fs from 'node:fs';
import {becario, granjero, soldadoUS, ingles, almirante, kaiser, casaca, P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';
import {RED, YEL, tag, captionTrack, fill, band, mix, r3, eOut, eInOut, eBack, shake, sample, camF as camF0, slam, rays, flash, cloud, office, desk, makeEpisode, F, bubble, move} from '../lib.mjs';
import {cerdo, huerto, patata, billete, usFlag, ukFlag, asta, rifle, esposas, tienda, barco, lapida, laudo, mapaNO, mapCam, pin, SJ, reclamo, oveja, catalejo, cartel} from './props.mjs';
// Acercar todos los planos un 10 % (18-nov, autocrítica: sobraba cielo y hierba; personajes más grandes en el móvil).
const ZOOM = 1.1;
const camF = (layers, d, f, px, py) => camF0(layers, d, t => { const v = f(t); return {...v, s: (v.s ?? 1) * ZOOM}; }, px, py);

const {WORDS, shots, shot, mouth} = makeEpisode('words.json');
const VOICE = 46.71, END = 47.2; // VOICE = duración real de narration.mp3
// Contador fijo (BIBLIA): N = 215 + días desde el 11-nov-2026 hasta la PUBLICACIÓN. Recalcular si cambia la fecha.
const PUB = '2026-11-21', DAYS = 215 + Math.round((Date.parse(PUB) - Date.parse('2026-11-11')) / 864e5);
const FT = 1680; // pies de los personajes principales: por encima de los subtítulos (y≈1765)

// ---------- movimiento de personajes ----------
const keysIn = (d, ks) => ks.filter(k => k.t >= 0 && k.t <= d).sort((a, b) => a.t - b.t).filter((k, i, a) => !i || k.t > a[i - 1].t);
const nod = (d, ts, a = 7, w = 0.12) => keysIn(d, [{t: 0, angle: 0}, ...ts.flatMap(t => [{t: r3(t - w), angle: 0}, {t: r3(t), angle: deg(a)}, {t: r3(t + w), angle: 0}]), {t: d, angle: 0}]);
const laugh = (d, t0, t1, a = 5, per = 0.16) => keysIn(d, [{t: 0, angle: 0}, {t: r3(t0), angle: 0}, ...Array.from({length: Math.floor((t1 - t0) / per)}, (_, k) => ({t: r3(t0 + (k + 1) * per), angle: deg(k % 2 ? -a : a)})), {t: r3(Math.min(d, t1 + per)), angle: 0}, {t: d, angle: 0}]);
const hop = (d, x, y, ts, h = 45) => keysIn(d, [{t: 0, x, y}, ...ts.flatMap(t => [{t: r3(t - 0.01), x, y}, {t: r3(t + 0.1), x, y: y - h}, {t: r3(t + 0.24), x, y}]), {t: d, x, y}]);
const flinch = (d, x, y, ts, dx = 40) => keysIn(d, [{t: 0, x, y}, ...ts.flatMap(t => [{t: r3(t - 0.02), x, y}, {t: r3(t + 0.06), x: x + dx, y}, {t: r3(t + 0.3), x, y}]), {t: d, x, y}]);
const pop = (layer, t0, d, len = 0.2, from = 1.8) => G([layer], {from: r3(t0), keys: sample(t => ({s: mix(from, 1, eBack((t - t0) / len))}), r3(t0), d)});

// ---------- decorados ----------
const SKY = '#9fd3f0';
/** Isla: hz = altura del horizonte (más alto = menos cielo). */
const isla = (d, {hz = 1020, grass = '#86c26e'} = {}) => [fill(SKY), cloud(250, hz - 720, 0.7, d, 40), cloud(980, hz - 600, 0.5, d, 60), band(hz, 440, '#6fb0d6'),
  S([['M', -60, hz + 70], ['Q', 300, hz - 120, 640, hz - 60], ['Q', 1000, hz - 120, 1340, hz + 70], ['L', 1340, hz + 480], ['L', -60, hz + 480], ['Z']], '#6fa85a', {lineWidth: 9}), band(hz + 460, 1200, grass), band(hz + 460, 14, '#4f8a40')];
const mar = d => [fill(SKY), cloud(300, 280, 0.8, d, 50), cloud(950, 380, 0.6, d, 60), band(980, 1400, '#5fa3cf'), band(980, 14, '#3a7aa8'),
  ...Array.from({length: 14}, (_, i) => { const x = (i * 211) % 1300, y = 1100 + (i * 97) % 900; return P([['M', x, y], ['Q', x + 30, y - 16, x + 60, y], ['Q', x + 90, y + 16, x + 120, y]], {stroke: 'rgba(255,255,255,0.6)', lineWidth: 6}); })];
const US = (i, o) => soldadoUS(1 + (i % 2), o), UK = (i, o) => casaca(1 + (i % 2), o);
/** Rifle al hombro (vertical) para soldados «armados». */
const alHombro = {shoulder: 20, elbow: 150, hold: [rifle({angle: deg(-80), x: -10, y: 40, scaleX: 0.9, scaleY: 0.9})]};
/** Fila de soldados (fn(i, opts)). hopAt: t locales donde saltan. */
const fila = (fn, n, x0, dx, y, sc, d, {look = 1, hopAt = [], walk = 0, expr = 'serio', armed = false, salute = 0} = {}) => Array.from({length: n}, (_, i) => fn(i, {x: x0 + i * dx, y, scale: sc, expr, look, idle: {dur: d},
  ...(armed ? {armR: alHombro} : {}), ...(salute ? {gestures: [{t0: r3(salute + i * 0.05), t1: r3(Math.min(d - 0.01, salute + 1.2)), arm: 'L', shoulder: 160, elbow: 95}]} : {}),
  ...(walk ? {walk: {dur: d, period: 0.4, stride: 16}, move: [{t: 0, x: x0 + i * dx - walk}, {t: d, x: x0 + i * dx}]} : hopAt.length ? {move: hop(d, x0 + i * dx, y, hopAt.map(t => t + i * 0.05), 30)} : {})}));

// ---------- miniatura (= fotograma 1 y último) ----------
// Menos cielo (horizonte en 700), dos ejércitos grandes que miran al cerdo, cerdo grande en el centro; título arriba a la izquierda.
const hookSet = (d, {hops = []} = {}) => [...isla(d, {hz: 700}),
  barco({x: 1090, y: 900, scale: 0.32, dur: d, flip: true}), barco({x: 190, y: 920, scale: 0.28, dur: d, flag: 'us'}),
  asta(usFlag({}, 170), {x: 70, y: 1560, h: 470, dur: d}), asta(ukFlag({}, 170), {x: 1210, y: 1560, h: 470, dur: d}),
  ...fila(US, 3, 150, 115, 1450, 0.62, d, {look: 1, hopAt: hops, armed: true}), ...fila(UK, 3, 900, 115, 1450, 0.62, d, {look: -1, hopAt: hops, armed: true}),
  ...fila(US, 2, 210, 150, 1640, 0.72, d, {look: 1, hopAt: hops.map(t => t + 0.08), expr: 'nervioso'}), ...fila(UK, 2, 920, 150, 1640, 0.72, d, {look: -1, hopAt: hops.map(t => t + 0.08), expr: 'nervioso'}),
  cerdo({x: 640, y: 1690, scale: 1.45, eat: true, dur: d})];
const thumb = (d, fade = 0, t0 = 0) => {
  const line = (text, y, size, color) => ({...ctext(text, 400, y, size, {maxW: 620, color}), outline: INK, outlineWidth: 18});
  const body = G([G([tag('HISTORIA REAL · 1859', 330, 46, {pop: false, color: RED, tilt: -2})], {x: -230}), G([line('LA GUERRA', 400, 140, YEL), line('DEL CERDO', 560, 140, PAPER)], {angle: deg(-4)})]);
  return fade ? G([body], {from: t0, keys: sample(t => ({alpha: (t - t0) / fade}), t0, Math.min(d, t0 + fade))}) : body;
};
/** Portada (fotograma 0, 18-nov): rayos azules, cerdo enorme en el centro y un soldado de cada bando, nerviosos, mirándolo. */
const thumbCard = d => [...rays(d, '#2a6fb0', '#4593d6', 640, 1300, 10, 14),
  US(0, {x: 250, y: 1990, scale: 1.5, bust: true, expr: 'nervioso', look: 1, idle: {dur: d}}),
  UK(0, {x: 1010, y: 1990, scale: 1.5, bust: true, expr: 'nervioso', look: -1, idle: {dur: d}}),
  cerdo({x: 610, y: 1720, scale: 2.0, eat: true, dur: d})];
const thumbTitle = () => { const line = (text, y, size, color) => ({...ctext(text, 600, y, size, {maxW: 880, color}), outline: INK, outlineWidth: 22});
  return G([G([tag('HISTORIA REAL · 1859', 330, 46, {pop: false, color: RED, tilt: -2})], {x: -40}), G([line('LA GUERRA', 420, 170, YEL), line('DEL CERDO', 600, 170, PAPER)], {angle: deg(-3)})]); };
/** Ventanita con el Becario reaccionando (de t0 al final del plano). */
const becCam = (t0, d, expr, {x = 200, y = 700, look = 1, s: sc = 1} = {}) => G([R(-170, -235, 340, 470, {radius: 24, fill: '#e8e2d0', lineWidth: 10}), R(-120, -200, 110, 150, {radius: 4, fill: '#c9d6e3', lineWidth: 6}),
  becario({x: 0, y: 440, scale: 0.85, expr, look, bust: true, idle: {dur: d}, headKeys: [{t: 0, angle: 0}, {t: t0 + 0.25, angle: 0}, {t: t0 + 0.4, angle: deg(-6 * look)}, {t: d, angle: deg(-6 * look)}]}),
  R(-170, 150, 340, 85, {radius: 0, fill: '#8a6a4a', lineWidth: 8}), R(-170, -235, 340, 470, {radius: 24, fill: 'none', lineWidth: 12})],
  {x, y, from: r3(t0), keys: sample(t => ({s: sc * mix(0.3, 1, eBack((t - t0) / 0.2)), a: -3}), r3(t0), d)});
const granja = () => [R(780, 1060, 330, 260, {radius: 6, fill: '#d9b98a', lineWidth: 9}), S([['M', 750, 1070], ['L', 945, 910], ['L', 1140, 1070], ['Z']], '#a8432f', {lineWidth: 9}), R(910, 1200, 76, 120, {radius: 4, fill: '#5a3a22', lineWidth: 7}), R(810, 1130, 64, 64, {radius: 4, fill: '#9fd3f0', lineWidth: 7})];

// ================= SHOTS =================
// 0–1.45 · «Dos imperios.» — miniatura; los soldados dan un respingo y el cerdo mordisquea antes de 0,5 s.
shot(0, 1.45, d => [camF(thumbCard(d), d, move.dolly(d, 1.0, 1.05), 640, 1300), thumbTitle()]);
// 1.45–3.1 · «Más de dos mil hombres. [gruñido]» — grúa que abre: filas y barcos; en la pausa, el cerdo levanta la cabeza (gruñido).
shot(1.45, 3.1, d => [camF([...isla(d, {hz: 820}),
  barco({x: 1020, y: 1000, scale: 0.4, dur: d, flip: true}), barco({x: 820, y: 1060, scale: 0.3, dur: d, flip: true}), barco({x: 260, y: 1030, scale: 0.35, dur: d, flag: 'us'}),
  ...fila(US, 7, 50, 85, 1420, 0.42, d, {look: 1, armed: true}), ...fila(UK, 7, 720, 85, 1420, 0.42, d, {look: -1, armed: true}),
  ...fila(US, 6, 80, 90, 1560, 0.5, d, {look: 1, hopAt: [1.32]}), ...fila(UK, 6, 760, 90, 1560, 0.5, d, {look: -1, hopAt: [1.32]}),
  cerdo({x: 640, y: 1660, scale: 0.75, eat: true, dur: 1.25, to: 1.28}), cerdo({x: 640, y: 1660, scale: 0.75, from: 1.28})], d, move.crane(d, 200, 1.3, 1.0), 640, 1300)]);
// 3.1–4.23 · «Por un cerdo.» — primer plano del cerdo con una patata al lado; zoom de lente.
shot(3.1, 4.23, d => [camF([...isla(d), cerdo({x: 600, y: 1690, scale: 1.9, dur: d}), patata({x: 970, y: 1520, scaleX: 1.2, scaleY: 1.2, angle: deg(20)})], d, move.zoom(d, 1.0, 1.12, 0.25), 640, 1400),
  tag('EL CAUSANTE', 420, 70, {t0: 0.15, tilt: -3})]);
// 4.23–5.93 · «1859.» — San Juan: el cerdo se cuela en el huerto de la granja (travelling que lo sigue).
shot(4.23, 5.93, d => [camF([...isla(d), ...granja(), huerto({x: 640, y: 1560}, 4),
  cerdo({x: 300, y: FT, scale: 0.8, dur: d, move: [{t: 0, x: 120}, {t: d, x: 470}]})], d, move.travelling(d, -120, 1.08), 640, 1300),
  tag('ISLA DE SAN JUAN · 15 DE JUNIO', 420, 52, {t0: 0.1, tilt: -2})]);
// 5.93–7.28 · «Un granjero americano pilla…» — Cutlar sale y lo ve: «¡MIS PATATAS!» (la frase de la leyenda).
shot(5.93, 7.28, d => [camF([...isla(d), ...granja(), huerto({x: 820, y: 1560}, 4),
  granjero({x: 300, y: FT, scale: 1.1, expr: 'sorpresa', look: 1, idle: {dur: d}, armL: {shoulder: 150, elbow: 30}, armR: {shoulder: 150, elbow: 30}, move: flinch(d, 300, FT, [0.25], -40), headKeys: nod(d, [0.3], -8, 0.15)}),
  cerdo({x: 820, y: FT, scale: 0.85, flip: true, eat: true, dur: d})], d, move.dolly(d, 1.0, 1.08), 640, 1300),
  tag('LYMAN CUTLAR', 420, 70, {t0: 0.1, tilt: -2}), bubble('¡MIS PATATAS!', 420, 760, 330, 1050, 0.5, d, {size: 58})]);
// 7.28–9.28 · «…a un cerdo comiéndose sus patatas.» — primer plano: el cerdo engulle; las patatas desaparecen una a una.
shot(7.28, 9.28, d => [camF([...isla(d, {hz: 900}), R(-60, 1500, 1400, 120, {radius: 0, fill: '#7a5a3a', lineWidth: 8}),
  ...[0, 1, 2, 3, 4].map(k => G([patata({scaleX: 1.2, scaleY: 1.2})], {x: 220 + k * 170, y: 1500, to: r3(0.35 + k * 0.32)})),
  cerdo({x: 640, y: FT, scale: 1.6, flip: true, eat: true, dur: d, move: [{t: 0, x: 1000}, {t: d, x: 380}]})], d, move.handheld(d, 5, 1.05), 640, 1300)]);
// 9.28–10.78 · «Y le pega un tiro.» — apunta, PAM (en la pausa insertada), el cerdo cae patas arriba con estrellitas. Sin sangre.
const BANG = 1.0;
shot(9.28, 10.78, d => [camF([...isla(d), huerto({x: 880, y: 1560}, 4),
  granjero({x: 330, y: FT, scale: 1.15, expr: 'serio', look: 1, idle: {dur: d}, armR: {shoulder: 85, elbow: 5, hold: [rifle({angle: deg(90), x: 0, y: 40})]}, armL: {shoulder: 80, elbow: 40}, headKeys: nod(d, [BANG], -6, 0.08), move: flinch(d, 330, FT, [BANG], -30)}),
  cerdo({x: 900, y: FT, scale: 0.95, flip: true, eat: true, dur: d, to: BANG}), cerdo({x: 900, y: FT, scale: 0.95, flip: true, dead: true, from: BANG}),
  ...[0, 1, 2, 3].map(k => G([E(0, 0, 26, 26, {fill: YEL, lineWidth: 5})], {from: BANG, keys: sample(t => ({x: 900 + Math.cos(k * 1.6 + (t - BANG) * 6) * 120, y: 1450 + Math.sin(k * 1.6 + (t - BANG) * 6) * 30}), BANG, d)}))],
  d, t => ({s: 1.1, ...shake(t, BANG, 0.4, 22)}), 640, 1300), flash(BANG, 0.1, '#fff2b0', 0.7), slam('¡PAM!', 640, 800, 160, BANG, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.3})]);
// 10.78–12.15 · «Era de una empresa británica.» — el capataz de la Compañía de la Bahía de Hudson (granja de ovejas) se lleva las manos a la cabeza.
shot(10.78, 12.15, d => [camF([...isla(d), asta(ukFlag({}, 170), {x: 1150, y: 1500, h: 470, dur: d}), oveja({x: 1010, y: 1500, scaleX: -0.8, scaleY: 0.8}), oveja({x: 160, y: 1480, scaleX: 0.7, scaleY: 0.7}),
  cerdo({x: 330, y: FT, scale: 0.95, dead: true}),
  ingles({x: 780, y: FT, scale: 1.2, expr: 'sorpresa', look: -1, idle: {dur: d}, armL: {shoulder: 165, elbow: 120}, armR: {shoulder: 165, elbow: 120}, headKeys: laugh(d, 0.2, 1.2, 6, 0.2)})],
  d, move.handheld(d, 6, 1.06), 640, 1300), tag('COMPAÑÍA DE LA BAHÍA DE HUDSON', 420, 46, {t0: 0.1, tilt: 2})]);
// 12.15–13.64 · «Ofrece diez dólares.» — el granjero tiende 10 $; el otro niega.
shot(12.15, 13.64, d => [camF([...isla(d), cerdo({x: 640, y: FT, scale: 0.6, dead: true}),
  granjero({x: 280, y: FT, scale: 1.15, expr: 'contento', look: 1, idle: {dur: d}, armR: {shoulder: 80, elbow: 20, hold: [billete(10, {x: 30, y: 10, scaleX: 0.55, scaleY: 0.55})]}, headKeys: nod(d, [0.3], 6)}),
  ingles({x: 960, y: FT, scale: 1.15, expr: 'serio', look: -1, idle: {dur: d}, armL: {shoulder: 40, elbow: 100}, armR: {shoulder: 40, elbow: 100}, headKeys: laugh(d, 0.5, 1.3, 9, 0.2)})], d, move.dolly(d, 1.0, 1.08), 640, 1300)]);
// 13.64–14.71 · «Le exigen cien.» — billete gigante de 100 que entra de golpe; el granjero se echa atrás; el Becario.
shot(13.64, 14.71, d => [camF([...isla(d), cerdo({x: 640, y: FT, scale: 0.6, dead: true}),
  granjero({x: 280, y: FT, scale: 1.1, expr: 'miedo', look: 1, idle: {dur: d}, move: flinch(d, 280, FT, [0.2], -50), armL: {shoulder: 110, elbow: 40}}),
  ingles({x: 960, y: FT, scale: 1.15, expr: 'contento', look: -1, idle: {dur: d}, gestures: [{t0: 0.1, t1: 1.0, arm: 'L', shoulder: 150, elbow: 20}]}),
], d, move.dolly(d, 1.0, 1.1), 640, 1300), G([pop(billete(100, {scaleX: 1.6, scaleY: 1.6, angle: deg(-6)}), 0.15, d, 0.22, 2.4)], {x: 700, y: 1000}), becCam(0.45, d, 'sorpresa', {x: 210, y: 470, s: 0.75})]);
// 14.71–17.66 · «El problema: los dos países reclamaban aquella isla.» — mapa real: frontera en el paralelo 49 y, al acercarnos, las DOS líneas reclamadas.
const FL = (flag, from, to, t0, t1, d) => G([flag], {from: r3(t0), keys: sample(t => ({x: mix(from[0], to[0], eInOut((t - t0) / (t1 - t0))), y: mix(from[1], to[1], eInOut((t - t0) / (t1 - t0)))}), r3(t0), d)});
const drawLine = (cual, t0, t1) => Array.from({length: 8}, (_, k) => { const a = r3(t0 + (k * (t1 - t0)) / 8); return G([reclamo(cual, (k + 1) / 8)], {from: a, ...(k < 7 ? {to: r3(t0 + ((k + 1) * (t1 - t0)) / 8)} : {})}); });
shot(14.71, 17.66, d => [camF([...mapaNO({labels: false}),
  G([ctext('CANADÁ', 640, 700, 60, {maxW: 340, color: '#5a4632'}), ctext('EE. UU.', 790, 1260, 60, {maxW: 300, color: '#5a4632'}), ctext('PARALELO 49', 800, 940, 36, {maxW: 300, color: INK})], {to: 0.9}),
  ...drawLine('us', 1.1, 1.7), ...drawLine('uk', 1.3, 1.9), pin(d),
  FL(usFlag({scaleX: 0.5, scaleY: 0.5}, 120), [SJ[0] - 40, SJ[1] + 260], [SJ[0] - 85, SJ[1] - 40], 1.6, 2.4, d),
  FL(ukFlag({scaleX: 0.5, scaleY: 0.5}, 120), [SJ[0] + 140, SJ[1] + 260], [SJ[0] + 40, SJ[1] - 40], 1.7, 2.5, d),
  ctext('SAN JUAN', SJ[0], SJ[1] + 40, 30, {maxW: 200, color: RED})],
  d, t => mapCam(SJ[0], SJ[1] - 20, mix(1.0, 2.6, eInOut(Math.min(1, t / 1.6)))), 640, 1000), tag('UN TRATADO CON DOS LECTURAS', 420, 50, {t0: 0.1, tilt: -2})]);
// 17.66–19.66 · «Los británicos amenazan con detenerlo.» — el inglés llega con las esposas; el granjero tiembla.
shot(17.66, 19.66, d => [camF([...isla(d), cerdo({x: 560, y: FT, scale: 0.6, dead: true}),
  granjero({x: 270, y: FT, scale: 1.1, expr: 'miedo', look: 1, idle: {dur: d}, armL: {shoulder: 150, elbow: 20}, armR: {shoulder: 150, elbow: 20}, headKeys: laugh(d, 0.2, 1.8, 5, 0.12)}),
  ingles({x: 1000, y: FT, scale: 1.2, expr: 'serio', look: -1, idle: {dur: d}, walk: {dur: 0.9, period: 0.4, stride: 18}, move: [{t: 0, x: 1200}, {t: 0.9, x: 860}, {t: d, x: 860}], armL: {shoulder: 80, elbow: 30, hold: [esposas({x: -10, y: 60, scaleX: 0.7, scaleY: 0.7})]}})],
  d, move.handheld(d, 8, 1.06), 640, 1300)]);
// 19.66–21.45 · «Los americanos mandan soldados.» — columna con bandera; el granjero salta de alegría.
shot(19.66, 21.45, d => [camF([...isla(d), asta(usFlag({}, 200), {x: 230, y: 1600, h: 560, dur: d}),
  ...fila(US, 4, 320, 180, FT, 0.85, d, {look: 1, walk: 380, expr: 'contento', armed: true}),
  granjero({x: 1040, y: FT, scale: 0.95, expr: 'contento', look: -1, idle: {dur: d}, move: hop(d, 1040, FT, [0.8, 1.25], 50), headKeys: nod(d, [0.9], 7)})], d, move.travelling(d, 140, 1.08), 640, 1300),
  tag('9.º DE INFANTERÍA', 420, 60, {t0: 0.2, tilt: 2})]);
// 21.45–23.06 · «Los británicos, barcos.» — tres buques de guerra entran en la bahía (sin disparar: nunca hubo tiros).
shot(21.45, 23.06, d => [camF([...mar(d),
  barco({x: 900, y: 1300, scale: 0.55, dur: d, flip: true, move: [{t: 0, x: 1500}, {t: 0.9, x: 900}, {t: d, x: 900}]}),
  barco({x: 420, y: 1500, scale: 0.8, dur: d, move: [{t: 0, x: -400}, {t: 0.8, x: 420}, {t: d, x: 420}]}),
  barco({x: 1000, y: 1700, scale: 1.0, dur: d, flip: true, move: [{t: 0, x: 1800}, {t: 0.7, x: 1000}, {t: d, x: 1000}]})], d, move.handheld(d, 9, 1.08), 640, 1300),
  tag('ROYAL NAVY', 420, 66, {t0: 0.2, tilt: 2})]);
// 23.06–24.95 · «Al mando, George Pickett.» — Pickett saluda orgulloso.
shot(23.06, 24.95, d => [camF([...isla(d), asta(usFlag({}, 200), {x: 1010, y: 1600, h: 560, dur: d}),
  soldadoUS(2, {x: 600, y: FT, scale: 1.35, expr: 'contento', look: 0, idle: {dur: d}, gestures: [{t0: 0.4, t1: 1.7, arm: 'R', shoulder: 160, elbow: 95}], headKeys: nod(d, [0.5], 6, 0.15)})],
  d, move.dolly(d, 1.0, 1.12), 640, 1300), tag('CAPITÁN GEORGE PICKETT', 420, 56, {t0: 0.05, tilt: -2})]);
// 24.95–26.34 · «Sí, el de Gettysburg.» — foto antigua en sepia de su famosa carga (1863); el Becario arquea la ceja.
shot(24.95, 26.34, d => [camF([fill('#d9c3a0'), band(1350, 900, '#b89a62'), band(1350, 12, '#8a7048'),
  ...[0, 1, 2].map(k => soldadoUS(1 + (k % 2), {x: 380 + k * 230, y: 1600 - k * 40, scale: 0.9 - k * 0.12, expr: 'serio', look: 1, idle: {dur: d}, walk: {dur: d, period: 0.32, stride: 22}, move: [{t: 0, x: 300 + k * 230}, {t: d, x: 470 + k * 230}]})),
  fill('rgba(140,100,50,0.38)'), R(40, 300, 1200, 1500, {radius: 0, fill: 'none', stroke: '#5a4632', lineWidth: 30})], d, move.dolly(d, 1.05, 1.12), 640, 1200),
  tag('GETTYSBURG, 1863: LA CARGA DE PICKETT', 420, 46, {t0: 0.05, tilt: 2}), becCam(0.35, d, 'sarcastico', {x: 220, y: 760, s: 0.8})]);
// 26.34–28.91 · «Llega un almirante británico, mira aquello…» — entra con su catalejo y mira a un lado y a otro (órbita).
shot(26.34, 28.91, d => [camF([...isla(d), ...fila(US, 2, 70, 80, 1520, 0.45, d, {look: 1, armed: true}), tienda('#e8dcc8', {x: 230, y: 1500, scaleX: 0.9, scaleY: 0.9}),
  barco({x: 1020, y: 1250, scale: 0.4, dur: d, flip: true}), cerdo({x: 420, y: FT, scale: 0.55, dead: true}),
  almirante({x: 720, y: FT, scale: 1.3, expr: 'serio', look: -1, idle: {dur: d}, walk: {dur: 0.8, period: 0.45, stride: 18}, move: [{t: 0, x: 1100}, {t: 0.8, x: 720}, {t: d, x: 720}],
    armL: {shoulder: 95, elbow: 60, hold: [catalejo({angle: deg(-95), x: -10, y: 20, scaleX: 0.9, scaleY: 0.9})]}, headKeys: [{t: 0, angle: 0}, {t: 1.0, angle: 0}, {t: 1.3, angle: deg(-8)}, {t: 1.9, angle: deg(8)}, {t: d, angle: deg(8)}]})],
  d, move.orbit(d, 60, 2, 1.1), 640, 1300), tag('ALMIRANTE BAYNES', 420, 66, {t0: 0.3, tilt: -2})]);
// 28.91–31.44 · «y se niega a una guerra por un cerdo.» — brazos cruzados, niega con la cabeza; sello NO.
shot(28.91, 31.44, d => [camF([...isla(d), cerdo({x: 260, y: FT, scale: 0.85, dead: true}),
  almirante({x: 780, y: FT, scale: 1.4, expr: 'serio', look: -1, idle: {dur: d}, armL: {shoulder: 95, elbow: 120}, armR: {shoulder: 95, elbow: 120}, headKeys: laugh(d, 0.4, 2.0, 9, 0.3)})],
  d, move.dolly(d, 1.0, 1.1), 640, 1300), slam('NO', 300, 880, 200, 0.6, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.2})]);
// 31.44–33.75 · «Acaban compartiendo la isla doce años,» — dos campamentos en los extremos, los días y las noches pasan, AÑO 1 → 9.
const YR = n => G([R(-190, -52, 380, 104, {radius: 12, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`AÑO ${n}`, 0, -34, 60, {maxW: 320, color: RED})], {x: 640, y: 640});
const camps = (d, {armed = false, n = 2, sc = 0.75} = {}) => [...isla(d), tienda('#e8dcc8', {x: 120, y: 1520, scaleX: 1.1, scaleY: 1.1}), tienda('#e8dcc8', {x: 1160, y: 1520, scaleX: 1.1, scaleY: 1.1}),
  asta(usFlag({}, 180), {x: 290, y: 1540, h: 420, dur: d}), asta(ukFlag({}, 180), {x: 990, y: 1540, h: 420, dur: d}),
  ...fila(US, n, 200, 130, FT, sc, d, {look: 1, armed}), ...fila(UK, n, 950, 130, FT, sc, d, {look: -1, armed}),
  P([['M', 640, 1450], ['L', 640, FT + 10]], {stroke: '#7d5229', lineWidth: 10}), P([['M', 560, 1520], ['L', 720, 1520]], {stroke: '#7d5229', lineWidth: 8})];
const nightCycle = (d, per = 0.5) => ({...fill('#0e1a3a'), keys: sample(t => ({alpha: 0.42 * Math.max(0, Math.sin((t / per) * Math.PI))}), 0, d)});
shot(31.44, 33.75, d => [camF([...camps(d)], d, move.pan(d, 100, 1.06), 640, 1300), nightCycle(d, 0.26),
  ...Array.from({length: 9}, (_, k) => { const a = r3(0.05 + k * 0.25); return G([YR(k + 1)], {from: a, ...(k < 8 ? {to: r3(a + 0.25)} : {})}); })]);
// 33.75–35.01 · «armados y sin un tiro.» — primer plano: dos centinelas frente a frente, fusil al hombro, aburridos; AÑO 10 → 12.
shot(33.75, 35.01, d => [camF([...isla(d), P([['M', 640, 1300], ['L', 640, FT + 10]], {stroke: '#7d5229', lineWidth: 12}),
  soldadoUS(1, {x: 400, y: FT, scale: 1.25, expr: 'cansado', look: 1, idle: {dur: d}, armR: alHombro, headKeys: laugh(d, 0.3, 1.1, 4, 0.35)}),
  casaca(2, {x: 880, y: FT, scale: 1.25, expr: 'cansado', look: -1, idle: {dur: d}, armR: alHombro, headKeys: laugh(d, 0.4, 1.1, 4, 0.35)})], d, move.dolly(d, 1.0, 1.06), 640, 1300),
  ...[10, 11, 12].map((n, k) => { const a = r3(0.05 + k * 0.3); return G([YR(n)], {from: a, ...(k < 2 ? {to: r3(a + 0.3)} : {})}); })]);
// 35.01–38.08 · «Hasta que el káiser decide: para Estados Unidos.» — el káiser sella el laudo; sello en la pausa.
shot(35.01, 38.08, d => [camF([...office(d), desk(),
  kaiser({x: 360, y: 1460, scale: 1.15, expr: 'serio', look: 1, idle: {dur: d}, armR: {shoulder: 60, elbow: 70}, gestures: [{t0: 1.55, t1: 2.1, arm: 'R', shoulder: 140, elbow: 20}], headKeys: nod(d, [1.75], 8)}),
  G([laudo()], {x: 880, y: 1020, scaleX: 0.85, scaleY: 0.85, angle: deg(-3)})], d, move.dolly(d, 1.0, 1.1), 760, 1000), tag('1872 · EL ÁRBITRO: EL KÁISER', 420, 50, {t0: 0.1, tilt: -2}), flash(1.75, 0.1, PAPER, 0.5)]);
// 38.08–40.26 · «Bajas militares: cero.» — los dos ejércitos, enteros, pasan lista y saludan.
shot(38.08, 40.26, d => [camF([...isla(d), asta(usFlag({}, 170), {x: 80, y: 1520, h: 420, dur: d}), asta(ukFlag({}, 170), {x: 1200, y: 1520, h: 420, dur: d}),
  ...fila(US, 3, 160, 130, FT, 0.72, d, {look: 1, hopAt: [0.4], salute: 1.0}), ...fila(UK, 3, 860, 130, FT, 0.72, d, {look: -1, hopAt: [0.4], salute: 1.0})],
  d, move.dolly(d, 1.0, 1.08), 640, 1300), tag('PARTE DE GUERRA', 420, 64, {t0: 0.1, tilt: -2})]);
// 40.26–41.4 · «El cerdo, una.» — la lápida del cerdo entra de golpe, con flores; los dos bandos la miran.
shot(40.26, 41.4, d => [camF([...isla(d), ...fila(US, 2, 150, 140, FT, 0.7, d, {look: 1, expr: 'cansado'}), ...fila(UK, 2, 990, 140, FT, 0.7, d, {look: -1, expr: 'cansado'}),
  pop(lapida({x: 640, y: FT, scaleX: 1.5, scaleY: 1.5}), 0.25, d, 0.22)], d, move.zoom(d, 1.0, 1.1, 0.3), 640, 1400)]);
// 41.4–43.2 · «Por él pedían cien dólares;» — en el Archivo: cartel VALOR con el cerdo, 100 $.
shot(41.4, 43.2, d => [camF([...office(d), desk(),
  becario({x: 300, y: 1460, scale: 1.1, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(41.4, 43.2), gestures: [{t0: 0.3, t1: 1.6, arm: 'R', shoulder: 100, elbow: 10}]}),
  pop(cartel('cerdo', '100 $', {x: 770, y: 880, scaleX: 1.1, scaleY: 1.1, angle: deg(3)}), 0.2, d, 0.2, 1.4)], d, move.dolly(d, 1.04, 1.12), 760, 1000)]);
// 43.2–VOICE · «por mí, ni diez: doscientos veinticinco días sin cobrar.» — su propio cartel: 0 $; contador.
const counter = (n, o = {}) => G([R(-210, -46, 420, 92, {radius: 10, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`DÍAS SIN COBRAR: ${n}`, 0, -30, 40, {maxW: 380, color: RED})], o);
shot(43.2, VOICE, d => [camF([...office(d), desk(),
  becario({x: 300, y: 1460, scale: 1.1, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(43.2, VOICE), armL: {shoulder: 40, elbow: 60},
    headKeys: [{t: 0, angle: 0}, {t: 0.9, angle: 0}, {t: 1.2, angle: deg(-4)}, {t: 2.5, angle: deg(-4)}, {t: 2.8, angle: deg(10)}, {t: d, angle: deg(10)}]}),
  cartel('cerdo', '100 $', {x: 770, y: 880, scaleX: 1.1, scaleY: 1.1, angle: deg(3)}),
  pop(cartel('becario', '0 $', {x: 770, y: 880, scaleX: 1.1, scaleY: 1.1, angle: deg(-4)}), 0.15, d, 0.2, 1.35),
  counter(DAYS, {x: 640, y: 560, scaleX: 1.4, scaleY: 1.4, from: 1.3, keys: sample(t => ({s: 1.4 * mix(1.3, 1, eBack((t - 1.3) / 0.2))}), 1.3, d)}),
], d, move.dolly(d, 1.06, 1.16), 760, 1000)]);
// VOICE–END · Bucle: de la oficina a la miniatura; termina EXACTAMENTE en el fotograma 1.
shot(VOICE, END, d => [camF(hookSet(d, {hops: []}), d, t => ({s: mix(1.6, 1.0, eOut(t / (d - 0.04)))}), 640, 1300), flash(0, 0.1, PAPER, 0.8), thumb(d, 0.12, r3(d - 0.16))]);

// Transiciones: barrido rápido en los cortes que cambian de escenario.
const SAME = new Set([1.45, 3.1, 7.28, 9.28, 10.78, 12.15, 13.64, 17.66, 19.66, 23.06, 28.91, 33.75, 38.08, 40.26, 43.2]);
const whip = (dir, d) => G(Array.from({length: 9}, (_, i) => R(0, 120 + i * 230 + (i % 3) * 40, 900 + (i % 4) * 200, 34 + (i % 3) * 14, {radius: 17, fill: PAPER, stroke: 'none'})),
  {to: Math.min(d, 0.18), keys: sample(t => ({x: dir * mix(1400, -2400, t / 0.18), alpha: 0.75 * (1 - t / 0.18)}), 0, Math.min(d, 0.18))});
shots.forEach((sh, i) => { if (i && !SAME.has(sh.start)) sh.layers.push(whip(i % 2 ? 1 : -1, sh.end - sh.start)); });
// Subtítulos karaoke (captions.json = voz.py caps … --skip 0 --max 17).
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const cap = captionTrack(WORDS, captions, {num: RED, size: 76});
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos: solo en silencios medidos o muy bajos. Ganancia máx. 1; ambientes ≤ 0,2; whoosh ≤ 0,25.
const has = n => fs.existsSync(`sfx/${n}.wav`);
const sfx = [
  F(0.12, 'cascos', 0.12, 0.4),
  F(2.76, 'oink', 0.45, 0.39),
  F(4.18, 'whoosh', 0.2),
  F(10.3, 'canon', 0.3, 0.4),
  F(14.66, 'whoosh', 0.2),
  F(21.56, 'whoosh', 0.2, 0.25),
  F(21.8, 'cascos', 0.1, 0.4),
  F(24.9, 'scratch', 0.2, 0.25),
  F(36.72, 'stamp', 0.3, 0.3),
  F(39.92, 'oink', 0.25, 0.3),
  F(41.33, 'crickets', 0.6, 0.35),
  F(46.75, 'whoosh', 0.2),
].filter(s => has(s.path.slice(4, -4)));
// Saneado: keys/from/to fuera del plano se recortan al plano.
const clip = (n, sp) => { if (!n || typeof n !== 'object') return n;
  if (n.keys) { const k = n.keys.filter(x => x.t >= 0 && x.t <= sp + 1e-9); n.keys = k.length ? k : [{...n.keys[0], t: 0}]; }
  if (n.to !== undefined && n.to > sp) n.to = r3(sp);
  if (n.children) n.children = n.children.filter(c => !(c && c.from !== undefined && c.from >= sp)).map(c => clip(c, sp));
  return n; };
for (const s of shots) { const sp = r3(s.end - s.start); s.layers = s.layers.filter(l => l && !(l.from !== undefined && l.from >= sp)).map(l => clip(l, sp)); }
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: r3(END - VOICE)}, television: {enabled: false},
  ...(fs.existsSync('music-duck.wav') ? {music: {path: 'music-duck.wav', gain: 0.2}} : {}), burnCaptions: false, captions, shots, sfx}, null, 1));
console.log('shots', shots.length, 'end', END, 'DAYS', DAYS);
