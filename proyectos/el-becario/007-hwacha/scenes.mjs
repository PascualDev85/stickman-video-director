// EXPEDIENTE 007 — «El hwacha de Haengju» (Corea, 1593) (Historias Sin Cabeza). Short 9:16, ~71 s a 1x (≈63 s con voz.py ritmo 1.12).
// Guion v2 (guion.md). Voz: toma B sin recortes (71,36 s). Prueba del formato de @historiaslocasok: cuento con diálogos, giro final.
import fs from 'node:fs';
import {becario, gwonYul, soldadoKr, monje, ashigaru, samurai, coreana, P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';
import {RED, YEL, tag, captionTrack, fill, band, mix, r3, eOut, eInOut, eBack, shake, sample, camF as camF0, slam, rays, flash, cloud, office, desk, makeEpisode, F, bubble, move} from '../lib.mjs';
import {hwacha, singijeon, volley, humo, empalizada, nobori, haz, caja, barca, piedra, libro, trapo, printer} from './props.mjs';
const ZOOM = 1.1; // como el 006: personajes más grandes en el móvil
const camF = (layers, d, f, px, py) => camF0(layers, d, t => { const v = f(t); return {...v, s: (v.s ?? 1) * ZOOM}; }, px, py);

const {WORDS, shots, shot, mouth} = makeEpisode('words.json');
const VOICE = 71.36, END = 71.86; // VOICE = duración real de narration.mp3
// Contador fijo (BIBLIA): N = 215 + días desde el 11-nov-2026 hasta la PUBLICACIÓN.
const PUB = '2026-11-23', DAYS = 215 + Math.round((Date.parse(PUB) - Date.parse('2026-11-11')) / 864e5);
const FT = 1680; // pies por encima de los subtítulos

// ---------- movimiento ----------
const keysIn = (d, ks) => ks.filter(k => k.t >= 0 && k.t <= d).sort((a, b) => a.t - b.t).filter((k, i, a) => !i || k.t > a[i - 1].t);
const nod = (d, ts, a = 7, w = 0.12) => keysIn(d, [{t: 0, angle: 0}, ...ts.flatMap(t => [{t: r3(t - w), angle: 0}, {t: r3(t), angle: deg(a)}, {t: r3(t + w), angle: 0}]), {t: d, angle: 0}]);
const laugh = (d, t0, t1, a = 5, per = 0.16) => keysIn(d, [{t: 0, angle: 0}, {t: r3(t0), angle: 0}, ...Array.from({length: Math.floor((t1 - t0) / per)}, (_, k) => ({t: r3(t0 + (k + 1) * per), angle: deg(k % 2 ? -a : a)})), {t: r3(Math.min(d, t1 + per)), angle: 0}, {t: d, angle: 0}]);
const hop = (d, x, y, ts, h = 45) => keysIn(d, [{t: 0, x, y}, ...ts.flatMap(t => [{t: r3(t - 0.01), x, y}, {t: r3(t + 0.1), x, y: y - h}, {t: r3(t + 0.24), x, y}]), {t: d, x, y}]);
const flinch = (d, x, y, ts, dx = 40) => keysIn(d, [{t: 0, x, y}, ...ts.flatMap(t => [{t: r3(t - 0.02), x, y}, {t: r3(t + 0.06), x: x + dx, y}, {t: r3(t + 0.3), x, y}]), {t: d, x, y}]);
const pop = (layer, t0, d, len = 0.2, from = 1.8) => G([layer], {from: r3(t0), keys: sample(t => ({s: mix(from, 1, eBack((t - t0) / len))}), r3(t0), d)});

// ---------- decorados ----------
const SKY = '#9fd3f0', GRASS = '#a7c47a', GRASS2 = '#7f9c58';
const montes = (hz, c = '#8fb3a0') => S([['M', -60, hz], ['L', 120, hz - 260], ['L', 330, hz - 120], ['L', 560, hz - 330], ['L', 800, hz - 140], ['L', 1010, hz - 300], ['L', 1340, hz - 90], ['L', 1340, hz + 40], ['L', -60, hz + 40], ['Z']], c, {lineWidth: 8});
/** Dentro de la fortaleza: montes, el río Han al fondo y la empalizada detrás de los personajes. */
const cima = (d, {hz = 980, sky = SKY, fence = true} = {}) => [fill(sky), cloud(260, hz - 640, 0.7, d, 40), cloud(1000, hz - 520, 0.5, d, 60), montes(hz), band(hz + 20, 110, '#5fa3cf'),
  band(hz + 130, 1600, GRASS), band(hz + 130, 14, GRASS2), ...(fence ? [empalizada(-60, 1340, hz + 380, {h: 180})] : [])];
/** La ladera vista desde arriba: la fortaleza arriba a la izquierda, los japoneses suben desde abajo a la derecha. */
const slopeY = x => 600 + (x + 60) * 620 / 1400;
const ladera = (d, {sky = SKY, fort = true} = {}) => [fill(sky), cloud(900, 260, 0.6, d, 50), montes(760), band(780, 80, '#5fa3cf'),
  S([['M', -60, 600], ['L', 1340, 1220], ['L', 1340, 2400], ['L', -60, 2400], ['Z']], GRASS, {lineWidth: 9}),
  ...Array.from({length: 10}, (_, i) => { const x = (i * 173) % 1300, y = slopeY(x) + 160 + (i * 211) % 900; return P([['M', x, y], ['L', x + 20, y - 26], ['L', x + 34, y]], {stroke: GRASS2, lineWidth: 6}); }),
  ...(fort ? [G([empalizada(-80, 340, 0, {h: 150})], {y: 690, angle: deg(24), pivotX: 130, pivotY: 0})] : [])];
/** Ejército japonés en la ladera: filas de ashigaru que suben a la izquierda. rows: [[x0, n, dy, scale]]. climb: px que suben en el plano. */
const ejercito = (d, rows, {climb = 0, look = -1, expr = 'serio', walk = true, banners = true} = {}) => rows.flatMap(([x0, n, dy, sc], r) => Array.from({length: n}, (_, i) => {
  const x = x0 + i * 120 * sc / 0.45, y = slopeY(x) + dy, dx = climb, dyc = climb * 620 / 1400;
  const who = i % 3 === 2 && banners ? null : ashigaru(1 + ((i + r) % 2), {x, y, scale: sc, expr, look, idle: {dur: d}, ...(walk ? {walk: {dur: d, period: 0.42, stride: 14}, move: [{t: 0, x: x + dx, y: y + dyc}, {t: d, x, y}]} : {})});
  return who || nobori({x, y, h: 420 * sc / 0.45, dur: d, keys: [{t: 0, x: x + dx, y: y + dyc}, {t: d, x, y}]});
}));
const antorcha = (o = {}) => G([R(-8, -10, 16, 150, {radius: 5, fill: '#7d5229', lineWidth: 5}), S([['M', -26, -10], ['Q', -30, -70, 0, -110], ['Q', 30, -70, 26, -10], ['Z']], '#ffb21f', {lineWidth: 5}), S([['M', -10, -14], ['Q', -10, -50, 0, -70], ['Q', 10, -50, 10, -14], ['Z']], '#fff2b0', {stroke: 'none'})], o);
const atardecer = d => [fill('#f29a5a'), band(0, 500, '#e8744a'), E(900, 760, 260, 260, {fill: '#ffd36b', stroke: 'none'}), montes(780, '#9a6a6a'), band(800, 80, '#c98a6a'),
  S([['M', -60, 600], ['L', 1340, 1220], ['L', 1340, 2400], ['L', -60, 2400], ['Z']], '#9a9a5a', {lineWidth: 9})];

// ---------- portada (fotograma 0) y bucle ----------
/** Portada v2 (autocrítica 18-nov): acción en el fotograma 0. El hwacha DISPARA: abanico de cohetes con estela, fogonazo y humo;
 *  abajo a la derecha, japoneses aterrados; Gwon Yul enorme y pícaro a la izquierda. */
const burst = (x, y, r, c = '#ffd21f') => S(Array.from({length: 16}, (_, k) => { const a = k * Math.PI / 8, rr = k % 2 ? r * 0.45 : r; return [k ? 'L' : 'M', r3(x + Math.cos(a) * rr), r3(y + Math.sin(a) * rr)]; }).concat([['Z']]), c, {lineWidth: 8});
const thumbCard = d => [...rays(d, '#9e1f17', '#d4473a', 760, 1250, 10, 16),
  burst(700, 1230, 330, '#ffb21f'), burst(700, 1230, 200, '#fff2b0'),
  ...[0, 1, 2, 3, 4].map(k => E(360 - k * 70, 1150 - k * 50, 200 + k * 40, 150 + k * 30, {fill: '#ececf0', lineWidth: 7})),
  ...Array.from({length: 16}, (_, k) => { const a = -24 + k * 2.8, r = 300 + (k * 137) % 300;
    return G([singijeon({}, {flame: true})], {x: r3(700 + Math.cos(deg(a)) * r), y: r3(1230 + Math.sin(deg(a)) * r), angle: deg(a), scaleX: 1.15, scaleY: 1.15}); }),
  ...[[880, 1720, 0.62], [1060, 1690, 0.58], [1200, 1740, 0.6], [990, 1860, 0.7], [1170, 1900, 0.66]].map(([x, y, sc], k) => ashigaru(1 + (k % 2), {x, y, scale: sc, bust: true, expr: 'miedo', look: -1, idle: {dur: d}})),
  burst(930, 1290, 70), burst(1180, 1230, 60),
  hwacha({x: 560, y: 1820, scale: 1.25, tilt: 14, empty: true, dur: d}),
  gwonYul({x: 250, y: 2080, scale: 1.55, bust: true, expr: 'picaro', look: 1, idle: {dur: d}})];
const thumbTitle = () => { const line = (text, y, size, color) => ({...ctext(text, 600, y, size, {maxW: 880, color}), outline: INK, outlineWidth: 22});
  return G([G([tag('HISTORIA REAL · 1593', 330, 46, {pop: false, color: RED, tilt: -2})], {x: -40}), G([line('100 COHETES', 420, 170, YEL), line('CONTRA 30.000', 600, 140, PAPER)], {angle: deg(-3)})]); };
/** Ventanita con el Becario reaccionando (de t0 al final del plano). */
const becCam = (t0, d, expr, {x = 200, y = 700, look = 1, s: sc = 1} = {}) => G([R(-170, -235, 340, 470, {radius: 24, fill: '#e8e2d0', lineWidth: 10}), R(-120, -200, 110, 150, {radius: 4, fill: '#c9d6e3', lineWidth: 6}),
  becario({x: 0, y: 440, scale: 0.85, expr, look, bust: true, idle: {dur: d}, headKeys: [{t: 0, angle: 0}, {t: t0 + 0.25, angle: 0}, {t: t0 + 0.4, angle: deg(-6 * look)}, {t: d, angle: deg(-6 * look)}]}),
  R(-170, 150, 340, 85, {radius: 0, fill: '#8a6a4a', lineWidth: 8}), R(-170, -235, 340, 470, {radius: 24, fill: 'none', lineWidth: 12})],
  {x, y, from: r3(t0), keys: sample(t => ({s: sc * mix(0.3, 1, eBack((t - t0) / 0.2)), a: -3}), r3(t0), d)});
const counter = (n, o = {}) => G([R(-210, -46, 420, 92, {radius: 10, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`DÍAS SIN COBRAR: ${n}`, 0, -30, 40, {maxW: 380, color: RED})], o);

// ================= SHOTS =================
// 0–1.39 · «Metió cien flechas» — portada: rayos rojos, Gwon Yul pícaro y el hwacha cargado; los cohetes ya asoman.
shot(0, 1.39, d => [camF(thumbCard(d), d, move.dolly(d, 1.0, 1.05), 640, 1300), thumbTitle()]);
// 1.39–2.89 · «en un carro de madera.» — primer plano del bastidor: las flechas entran una a una.
shot(1.39, 2.89, d => [camF([...cima(d, {fence: false}), hwacha({x: 700, y: FT, scale: 1.6, tilt: 10, load: {t0: 0, dt: 0.022}, dur: d}),
  soldadoKr(1, {x: 180, y: FT, scale: 1.1, expr: 'serio', look: 1, idle: {dur: d}, armR: {shoulder: 70, elbow: 30, hold: [haz({x: 30, y: 30, scaleX: 0.5, scaleY: 0.5, angle: deg(-30)})]}})],
  d, move.dolly(d, 1.0, 1.12), 700, 1300)]);
// 2.89–4.5 · «Y lo apuntó a» — Gwon Yul empuja el carro y señala abajo; el carro gira hacia la ladera.
shot(2.89, 4.5, d => [camF([...cima(d), hwacha({x: 760, y: FT, scale: 1.2, tilt: 14, dur: d, keys: sample(t => ({angle: mix(deg(-6), 0, eOut(t / 0.6))}), 0, d)}),
  gwonYul({x: 260, y: FT, scale: 1.15, expr: 'serio', look: 1, idle: {dur: d}, gestures: [{t0: 0.5, t1: d - 0.05, arm: 'R', shoulder: 95, elbow: 5}], headKeys: nod(d, [0.6], 6)})],
  d, move.orbit(d, 50, 2, 1.05), 640, 1300)]);
// 4.5–5.7 · «treinta mil soldados.» — contraplano: la ladera llena de japoneses y estandartes; 30.000.
shot(4.5, 5.7, d => [camF([...ladera(d), ...ejercito(d, [[380, 8, 60, 0.32], [260, 9, 230, 0.4], [120, 9, 440, 0.5], [40, 8, 700, 0.6]], {climb: 40})], d, move.zoom(d, 1.0, 1.08, 0.3), 640, 1300),
  slam('30.000', 640, 760, 190, 0.1, d, {outline: true, color: RED, tilt: -6, from: 1.25})]);
// 5.7–7.75 · «Corea. Arriba de la colina,» — grúa: la colina con la empalizada, el río Han abajo.
shot(5.7, 7.75, d => [camF([fill(SKY), cloud(250, 300, 0.8, d, 50), cloud(980, 420, 0.6, d, 60), montes(900), band(1500, 1000, '#5fa3cf'), band(1500, 12, '#3a7aa8'),
  S([['M', -60, 1560], ['Q', 200, 1100, 640, 980], ['Q', 1080, 1100, 1340, 1560], ['Z']], GRASS, {lineWidth: 9}), G([empalizada(380, 900, 0, {h: 110})], {y: 1010}),
  barca({x: 1050, y: 1640, scale: 0.35, dur: d, flip: true})], d, move.crane(d, 220, 1.0, 1.15), 640, 1100),
  tag('COREA, 1593 · FORTALEZA DE HAENGJU', 420, 48, {t0: 0.1, tilt: -2})]);
// 7.75–9.63 · «el general Gwon Yul» — el general en la empalizada; el viento le mueve la borla.
shot(7.75, 9.63, d => [camF([...cima(d), gwonYul({x: 640, y: FT, scale: 1.45, expr: 'serio', look: 1, idle: {dur: d}, armL: {shoulder: 30, elbow: 90}, armR: {shoulder: 30, elbow: 90}, headKeys: nod(d, [0.9], 5, 0.2)})],
  d, move.dolly(d, 1.0, 1.12), 640, 1250), tag('GENERAL GWON YUL', 420, 66, {t0: 0.05, tilt: -2})]);
// 9.63–11.12 · «con dos mil trescientos hombres.» — fila de soldados tras la empalizada; 2.300.
shot(9.63, 11.12, d => [camF([...cima(d), ...Array.from({length: 7}, (_, i) => soldadoKr(1 + (i % 2), {x: 90 + i * 185, y: FT - (i % 2) * 40, scale: 0.78, expr: i % 3 ? 'serio' : 'nervioso', look: i < 4 ? 1 : -1, idle: {dur: d}, move: hop(d, 90 + i * 185, FT - (i % 2) * 40, [0.25 + i * 0.04], 26)}))],
  d, move.pan(d, 80, 1.04), 640, 1300), slam('2.300', 640, 760, 190, 0.25, d, {outline: true, color: PAPER, tilt: -4, from: 1.25})]);
// 11.12–12.83 · «Algunos, monjes.» — dos monjes calvos saludan muy contentos; el Becario levanta una ceja.
shot(11.12, 12.83, d => [camF([...cima(d), monje(1, {x: 450, y: FT, scale: 1.2, expr: 'contento', look: 1, idle: {dur: d}, gestures: [{t0: 0.4, t1: 1.4, arm: 'R', shoulder: 160, elbow: 40}], headKeys: laugh(d, 0.4, 1.3, 5, 0.2)}),
  monje(2, {x: 860, y: FT, scale: 1.2, expr: 'picaro', look: -1, idle: {dur: d}, move: hop(d, 860, FT, [0.7], 40)})], d, move.dolly(d, 1.0, 1.08), 640, 1300),
  tag('MONJES GUERREROS', 420, 62, {t0: 0.1, tilt: 2}), becCam(0.9, d, 'sarcastico', {x: 1010, y: 640, s: 0.6, look: -1})]);
// 12.83–14.62 · «Abajo, los japoneses:» — el jefe samurái señala la colina; detrás, filas y estandartes.
shot(12.83, 14.62, d => [camF([...ladera(d, {fort: true}), ...ejercito(d, [[520, 6, 120, 0.36], [380, 7, 330, 0.44]], {climb: 30}),
  samurai({x: 820, y: FT, scale: 1.1, expr: 'serio', look: -1, idle: {dur: d}, gestures: [{t0: 0.3, t1: d - 0.05, arm: 'L', shoulder: 120, elbow: 10}]})], d, move.dolly(d, 1.0, 1.08), 640, 1300)]);
// 14.62–16.15 · «más de diez a uno.» — en papel: 1 coreano frente a 10 japoneses que aparecen uno a uno.
shot(14.62, 16.15, d => [camF([fill('#f2e3bf'), soldadoKr(1, {x: 220, y: 1500, scale: 0.85, expr: 'nervioso', look: 1, idle: {dur: d}}), ctext('1', 220, 560, 140, {maxW: 200, color: RED}),
  ...Array.from({length: 10}, (_, i) => G([ashigaru(1 + (i % 2), {x: 0, y: 0, scale: 0.42, expr: 'serio', look: -1, idle: {dur: d}})], {x: 560 + (i % 5) * 140, y: 1150 + Math.floor(i / 5) * 360, from: r3(0.05 + i * 0.08)})),
  G([ctext('10', 840, 560, 140, {maxW: 300, color: RED})], {from: 0.85})], d, move.dolly(d, 1.0, 1.06), 640, 1100)]);
// 16.15–18.43 · «Un soldado mira el carro: "General,» — el soldado se rasca la cabeza delante del hwacha.
shot(16.15, 18.43, d => [camF([...cima(d), hwacha({x: 820, y: FT, scale: 1.15, tilt: 16, dur: d}),
  soldadoKr(1, {x: 330, y: FT, scale: 1.25, expr: 'sorpresa', look: 1, idle: {dur: d}, gestures: [{t0: 0.3, t1: 1.8, arm: 'L', shoulder: 165, elbow: 130}], headKeys: [{t: 0, angle: 0}, {t: 0.5, angle: deg(8)}, {t: d, angle: deg(8)}]})],
  d, move.dolly(d, 1.0, 1.1), 640, 1300)]);
// 18.43–21.2 · «¿eso es un arma... o un carro de la compra?» — primer plano del soldado; bocadillo.
shot(18.43, 21.2, d => [camF([...cima(d), hwacha({x: 1060, y: FT + 80, scale: 1.0, tilt: 16, dur: d}),
  soldadoKr(1, {x: 470, y: FT + 300, scale: 2.0, expr: 'nervioso', look: 1, idle: {dur: d}, headKeys: laugh(d, 1.3, 2.3, 4, 0.2)})], d, move.dolly(d, 1.0, 1.06), 640, 1300),
  bubble('¿UN ARMA…', 560, 560, 480, 820, 0.15, d, {size: 72, maxW: 800, until: 1.2}), bubble('¿…O UN CARRO', 600, 470, 520, 820, 1.2, d, {size: 72, maxW: 800}), G([tag('DE LA COMPRA?', 620, 72, {t0: 1.5, tilt: 2})], {})]);
// 21.2–22.36 · «"Que se acerquen."» — Gwon Yul, primer plano, levanta la mano: quietos.
shot(21.2, 22.36, d => [camF([...cima(d), gwonYul({x: 640, y: 2050, scale: 1.9, bust: true, expr: 'serio', look: 1, idle: {dur: d}})], d, move.zoom(d, 1.0, 1.1, 0.4), 640, 1300),
  bubble('QUE SE ACERQUEN.', 600, 560, 640, 760, 0.05, d, {size: 72, maxW: 820})]);
// 22.36–24.89 · «Y suben. Oleada tras oleada.» — la ladera: oleadas que suben (cámara en mano).
shot(22.36, 24.89, d => [camF([...ladera(d), ...ejercito(d, [[420, 7, 80, 0.34], [300, 8, 260, 0.42], [140, 8, 480, 0.52], [60, 7, 760, 0.62]], {climb: 160})],
  d, move.handheld(d, 9, 1.06), 640, 1300)]);
// 24.89–26.26 · «"¿Ahora, general?"» — el soldado de la antorcha, sudando.
shot(24.89, 26.26, d => [camF([...cima(d), soldadoKr(2, {x: 560, y: FT + 120, scale: 1.6, expr: 'nervioso', look: 1, idle: {dur: d}, armR: {shoulder: 120, elbow: 40, hold: [antorcha({x: 0, y: 40})]}, headKeys: laugh(d, 0.1, 1.2, 3, 0.12)})],
  d, move.handheld(d, 5, 1.08), 640, 1300), bubble('¿AHORA, GENERAL?', 600, 560, 600, 780, 0.05, d, {size: 72, maxW: 820})]);
// 26.26–26.99 · «"Ahora."» — Gwon Yul baja la mano de golpe; zoom rápido.
shot(26.26, 26.99, d => [camF([...cima(d), gwonYul({x: 640, y: 2050, scale: 1.9, bust: true, expr: 'serio', look: 1, idle: {dur: d}})], d, move.zoom(d, 1.0, 1.25, 0.2), 640, 1100), slam('¡AHORA!', 640, 560, 150, 0.08, d, {outline: true, color: YEL, tilt: -6, from: 1.2})]);
// 26.99–28.43 · «Encienden la mecha.» — la antorcha toca la mecha; la chispa corre hacia el bastidor.
shot(26.99, 28.43, d => [camF([...cima(d, {fence: false}), hwacha({x: 760, y: FT, scale: 1.6, tilt: 14, fuse: 0.35, dur: d}),
  G([antorcha({angle: deg(30)})], {x: 300, y: 1450, keys: sample(t => ({x: mix(150, 330, eOut(t / 0.35)), y: 1450}), 0, d)})], d, move.dolly(d, 1.05, 1.2), 520, 1400)]);
// 28.43–29.47 · «Son cohetes.» — ¡FUUUM! fogonazo, humo y la andanada sale del carro.
const BOOM = 0.03;
shot(28.43, 29.47, d => [camF([...cima(d), burst(800, 1150, 260, '#ffb21f'), hwacha({x: 520, y: FT, scale: 1.55, tilt: 16, empty: true, dur: d}), ...humo(300, 1250, BOOM, d, 7),
  ...volley(800, 1150, BOOM, d, {n: 34, angle: -18, spread: 26, speed: 800, drop: 160, s: 0.95})], d, t => ({s: 1.05, ...shake(t, BOOM, 0.5, 26)}), 640, 1300),
  flash(BOOM, 0.12, '#fff2b0', 0.85), slam('¡COHETES!', 600, 600, 150, 0.15, d, {outline: true, color: RED, tilt: -6, from: 1.2})]);
// 29.47–31.39 · «Y salen las cien a la vez.» — el cielo lleno de cohetes cae sobre las filas, que se tiran al suelo.
shot(29.47, 31.39, d => [camF([...ladera(d, {fort: false}), ...ejercito(d, [[420, 7, 80, 0.36], [280, 8, 280, 0.46], [120, 8, 520, 0.56]], {walk: false, expr: 'miedo', look: -1}),
  ...volley(-200, 300, 0, d, {n: 40, angle: 22, spread: 18, speed: 1100, drop: 120, s: 0.75})], d, t => ({s: 1.05, ...shake(t, 0.9, 0.5, 14)}), 640, 1300)]);
// 31.39–32.91 · «Cien. A la vez.» — cien cohetes congelados en el cielo; 100.
shot(31.39, 32.91, d => [camF([fill('#2a4a78'), ...Array.from({length: 60}, (_, i) => G([singijeon({}, {flame: true})], {x: 80 + (i * 97) % 1120, y: 300 + ((i * 151) % 1300), angle: deg(18 + (i % 5) * 3), scaleX: 0.6, scaleY: 0.6}))],
  d, move.dolly(d, 1.0, 1.1), 640, 1000), slam('100', 640, 760, 260, 0.05, d, {outline: true, color: YEL, tilt: -6, from: 1.2}), slam('A LA VEZ', 640, 1080, 120, 0.75, d, {outline: true, color: PAPER, tilt: 4, from: 1.2})]);
// 32.91–35.71 · «La impresora del Archivo no saca ni dos hojas.» — sale una hoja… y humo; el Becario la aporrea.
const BANG = [1.3, 1.6, 1.9, 2.2].filter(t => t < 2.7);
const smokePuffs = (x, y, t0, d, n = 4) => Array.from({length: n}, (_, i) => ({...E(0, 0, 70 + i * 16, 60 + i * 12, {fill: '#d8d8d8', lineWidth: 6}), from: r3(t0 + i * 0.25),
  keys: sample(t => { const u = t - t0 - i * 0.25; return {x: x + Math.sin(u * 5 + i) * 26, y: y - u * 260, alpha: Math.max(0, 1 - u / 1.1)}; }, r3(t0 + i * 0.25), d)}));
shot(32.91, 35.71, d => [camF([...office(d), desk(), printer(860, 1150, 1.0), G([R(-80, 0, 160, 110, {radius: 2, fill: PAPER, lineWidth: 5})], {x: 860, y: 1100, from: 0.5, keys: sample(t => ({y: mix(1100, 1180, eOut((t - 0.5) / 0.4))}), 0.5, d)}),
  ...smokePuffs(900, 960, 1.1, d, 5),
  becario({x: 470, y: 1440, scale: 1.0, expr: 'agobiado', look: 1, idle: {dur: d}, talk: mouth(32.91, 35.71), poses: {R: [{t: 0, shoulder: 75, elbow: 10}, ...BANG.flatMap(t => [{t: r3(t), shoulder: 150, elbow: 30}, {t: r3(t + 0.15), shoulder: 75, elbow: 10}])]}})],
  d, t => ({s: mix(1.3, 1.4, t / d), ...shake(t, 1.3, 0.12, 8), ...shake(t, 1.9, 0.3, 10)}), 720, 1050), tag('EL ARCHIVO', 420, 60, {t0: 0.05, tilt: -2})]);
// 35.71–38.27 · «Vuelven a atacar. Una y otra vez.» — nuevas oleadas suben; desde arriba caen flechas.
shot(35.71, 38.27, d => [camF([...ladera(d), ...ejercito(d, [[460, 7, 60, 0.34], [320, 8, 250, 0.44], [160, 8, 480, 0.54], [60, 7, 760, 0.64]], {climb: 200}),
  ...volley(-100, 500, 0.4, d, {n: 10, angle: 28, spread: 14, speed: 1000, drop: 100, s: 0.6}), ...volley(-100, 500, 1.6, d, {n: 10, angle: 28, spread: 14, speed: 1000, drop: 100, s: 0.6})],
  d, move.handheld(d, 9, 1.06), 640, 1300)]);
// 38.27–40.75 · «Hasta que a los coreanos se les acaban las flechas.» — el soldado mete la mano en la caja: vacía, con telaraña.
shot(38.27, 40.75, d => [camF([...cima(d), caja(true, {x: 800, y: FT, scaleX: 1.6, scaleY: 1.6, to: 1.1}), caja(false, {x: 800, y: FT, scaleX: 1.6, scaleY: 1.6, from: 1.1}),
  soldadoKr(1, {x: 360, y: FT, scale: 1.25, expr: 'serio', look: 1, idle: {dur: d}, gestures: [{t0: 0.2, t1: 0.9, arm: 'R', shoulder: 70, elbow: 10}, {t0: 1.2, t1: 2.2, arm: 'R', shoulder: 50, elbow: 5}], headKeys: nod(d, [1.3], 10, 0.2)})],
  d, move.dolly(d, 1.0, 1.12), 700, 1400), slam('0', 820, 760, 220, 1.2, d, {outline: true, color: RED, tilt: -6, from: 1.3})]);
// 40.75–42.73 · «"General... se han acabado."» — el soldado le enseña la caja vacía al general, que traga saliva.
shot(40.75, 42.73, d => [camF([...cima(d), caja(false, {x: 470, y: 1500, scaleX: 1.1, scaleY: 1.1}),
  soldadoKr(1, {x: 330, y: FT, scale: 1.15, expr: 'miedo', look: 1, idle: {dur: d}, armL: {shoulder: 60, elbow: 60}, armR: {shoulder: 60, elbow: 60}}),
  gwonYul({x: 930, y: FT, scale: 1.25, expr: 'nervioso', look: -1, idle: {dur: d}, headKeys: nod(d, [1.2], -8, 0.2)})], d, move.dolly(d, 1.0, 1.08), 640, 1300),
  bubble('SE HAN ACABADO…', 560, 560, 380, 860, 0.1, d, {size: 72, maxW: 820})]);
// 42.73–44.9 · «Y por el río aparecen barcos.» — por el río Han llegan dos barcas; en la orilla, los soldados saltan.
shot(42.73, 44.9, d => [camF([fill(SKY), cloud(300, 300, 0.8, d, 50), montes(900), band(940, 900, '#5fa3cf'), band(940, 12, '#3a7aa8'), band(1560, 900, GRASS), band(1560, 14, GRASS2),
  barca({x: 400, y: 1380, scale: 0.75, dur: d, keys: [{t: 0, x: -400}, {t: d, x: 420}]}), barca({x: 900, y: 1200, scale: 0.5, dur: d, keys: [{t: 0, x: -200}, {t: d, x: 980}]}),
  ...[0, 1, 2].map(i => soldadoKr(1 + (i % 2), {x: 300 + i * 320, y: FT, scale: 0.8, expr: 'contento', look: -1, idle: {dur: d}, move: hop(d, 300 + i * 320, FT, [1.0 + i * 0.08, 1.6 + i * 0.08], 50)}))],
  d, move.pan(d, 90, 1.05), 640, 1300)]);
// 44.9–46.51 · «Cargados de flechas.» — primer plano de la barca llena de haces; el general sonríe.
shot(44.9, 46.51, d => [camF([fill(SKY), band(900, 1600, '#5fa3cf'), barca({x: 600, y: 1480, scale: 1.5, dur: d}),
  gwonYul({x: 1030, y: FT + 60, scale: 1.0, expr: 'contento', look: -1, idle: {dur: d}, headKeys: nod(d, [0.6], 7)})], d, move.zoom(d, 1.0, 1.1, 0.3), 640, 1300)]);
// 46.51–48.83 · «Al anochecer, los japoneses se retiran.» — atardecer: bajan la ladera; el samurái, el último.
shot(46.51, 48.83, d => [camF([...atardecer(d), ...ejercito(d, [[360, 7, 120, 0.4], [180, 8, 380, 0.52]], {climb: -220, look: 1, expr: 'cansado'}),
  samurai({x: 520, y: FT, scale: 1.0, expr: 'cansado', look: 1, idle: {dur: d}, walk: {dur: d, period: 0.5, stride: 14}, move: [{t: 0, x: 420}, {t: d, x: 760}]})],
  d, move.travelling(d, 120, 1.06), 640, 1300), tag('AL ANOCHECER', 420, 62, {t0: 0.1, tilt: -2})]);
// 48.83–51.82 · «Y cuentan que las mujeres subían piedras en el delantal...» — dos mujeres suben con piedras en el delantal.
shot(48.83, 51.82, d => [camF([...ladera(d, {fort: true}), ...[0, 1].map(i => G([coreana(1 + i, {x: 0, y: 0, scale: 1.0, expr: 'serio', look: -1, idle: {dur: d}, walk: {dur: d, period: 0.5, stride: 14}, armL: {shoulder: 30, elbow: 100}, armR: {shoulder: 30, elbow: 100}}),
  piedra({x: -30, y: -300}), piedra({x: 24, y: -290, scaleX: 0.8, scaleY: 0.8})], {keys: [{t: 0, x: 760 + i * 300, y: slopeY(760 + i * 300) + 700}, {t: d, x: 560 + i * 300, y: slopeY(560 + i * 300) + 700}]}))],
  d, move.dolly(d, 1.0, 1.06), 640, 1300), tag('SEGÚN LA LEYENDA', 420, 64, {t0: 0.1, tilt: 2, color: RED})]);
// 51.82–53.55 · «y que por eso el delantal» — primer plano: la mujer deja caer otra piedra en el delantal.
shot(51.82, 53.55, d => [camF([...cima(d), coreana(1, {x: 640, y: 2050, scale: 1.7, bust: true, expr: 'contento', look: 1, idle: {dur: d}}),
  G([piedra({scaleX: 1.6, scaleY: 1.6})], {from: 0.2, keys: sample(t => ({x: 640, y: mix(900, 1500, eOut((t - 0.2) / 0.35))}), 0.2, d)})], d, move.dolly(d, 1.0, 1.08), 640, 1400)]);
// 53.55–54.96 · «se llama "haengju chima".» — rótulo: 행주치마 · HAENGJU CHIMA.
shot(53.55, 54.96, d => [camF([...cima(d), coreana(1, {x: 640, y: 2050, scale: 1.7, bust: true, expr: 'contento', look: 1, idle: {dur: d}})], d, move.dolly(d, 1.08, 1.12), 640, 1400),
  slam('HAENGJU CHIMA', 580, 420, 100, 0.05, d, {outline: true, color: YEL, tilt: -4, from: 1.1}), tag('= DELANTAL', 560, 60, {t0: 0.3, tilt: 2})]);
// 54.96–55.63 · «Precioso.» — el Becario, en el Archivo, aplaude despacio, sin ganas.
shot(54.96, 55.63, d => [camF([...office(d), desk(), becario({x: 640, y: 2050, scale: 1.7, bust: true, expr: 'sarcastico', look: 0, idle: {dur: d}, talk: mouth(54.96, 55.63)})], d, move.zoom(d, 1.0, 1.08, 0.3), 640, 1300)]);
// 55.63–57.23 · «Pero esa palabra ya sale en un libro» — el libro de 1517 cae sobre la mesa.
shot(55.63, 57.23, d => [camF([...office(d), desk(), becario({x: 300, y: 1460, scale: 1.1, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(55.63, 57.23), gestures: [{t0: 0.4, t1: 1.5, arm: 'R', shoulder: 100, elbow: 10}]}),
  pop(libro(1517, {x: 820, y: 960, scaleX: 0.95, scaleY: 0.95, angle: deg(4)}), 0.15, d, 0.2, 1.5)], d, move.dolly(d, 1.04, 1.12), 760, 1000)]);
// 57.23–59.27 · «de setenta y seis años antes.» — línea del tiempo: 1517 ··· 76 AÑOS ··· 1593.
shot(57.23, 59.27, d => [camF([fill('#f2e3bf'), P([['M', 260, 1100], ['L', 960, 1100]], {stroke: INK, lineWidth: 12}),
  E(300, 1100, 60, 60, {fill: RED, lineWidth: 8}), E(900, 1100, 60, 60, {fill: '#2f5a8a', lineWidth: 8}), ctext('1517', 300, 1160, 80, {maxW: 300, color: RED}), ctext('1593', 900, 1160, 80, {maxW: 300, color: '#2f5a8a'}),
  G([S([['M', 320, 1020], ['Q', 600, 860, 880, 1020]], 'none', {stroke: RED, lineWidth: 8}), ctext('76 AÑOS ANTES', 600, 780, 90, {maxW: 760, color: RED})], {from: 0.35})], d, move.dolly(d, 1.0, 1.06), 640, 1100)]);
// 59.27–60.98 · «Y "haengju" es...» — el Becario mira el rótulo; zoom lento de suspense.
shot(59.27, 60.98, d => [camF([...office(d), desk(), becario({x: 640, y: 2050, scale: 1.7, bust: true, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(59.27, 60.98)})], d, move.dolly(d, 1.0, 1.2), 640, 1300),
  tag('«HAENGJU» = ?', 420, 72, {t0: 0.05, tilt: -2})]);
// 60.98–62.51 · «el trapo de cocina.» — el trapo de cuadros le cae en la cabeza.
shot(60.98, 62.51, d => [camF([...office(d), desk(), becario({x: 640, y: 2050, scale: 1.7, bust: true, expr: 'cansado', look: 0, idle: {dur: d}, talk: mouth(60.98, 62.51)}),
  G([trapo({scaleX: 1.4, scaleY: 1.4})], {from: 0.1, keys: sample(t => ({x: 640, y: mix(200, 1020, eOut((t - 0.1) / 0.3)), a: mix(-20, 4, eOut((t - 0.1) / 0.3))}), 0.1, d)})], d, move.zoom(d, 1.0, 1.06, 0.3), 640, 1300),
  tag('HAENGJU = TRAPO DE COCINA', 420, 52, {t0: 0.45, tilt: 2, color: RED})]);
// 62.51–65.26 · «Cien cohetes, treinta mil enemigos...» — repaso rápido: la andanada sobre la ladera.
shot(62.51, 65.26, d => [camF([...ladera(d), ...ejercito(d, [[420, 7, 80, 0.36], [280, 8, 280, 0.46]], {walk: false, expr: 'miedo'}), hwacha({x: 200, y: 900, scale: 0.6, tilt: 0, empty: true, dur: d, keys: [{t: 0, angle: deg(24)}, {t: d, angle: deg(24)}]}),
  ...volley(260, 760, 0.1, d, {n: 30, angle: 26, spread: 18, speed: 900, drop: 80, s: 0.6})], d, move.dolly(d, 1.0, 1.1), 640, 1200),
  slam('100', 360, 600, 150, 0.1, d, {outline: true, color: YEL, tilt: -6, from: 1.2}), slam('30.000', 660, 760, 120, 1.0, d, {outline: true, color: RED, tilt: 5, from: 1.2})]);
// 65.26–68.45 · «y el invento que sigue sin funcionar es mi nómina.» — el Becario enciende un mini-hwacha «NÓMINA»: sale un cohete… y cae.
shot(65.26, 68.45, d => [camF([...office(d), desk(), hwacha({x: 860, y: 1150, scale: 0.55, tilt: 14, fuse: 0.6, dur: d}), G([tag('NÓMINA', 0, 64, {pop: false, tilt: -3, color: RED})], {x: 220, y: 760}),
  G([singijeon({}, {flame: true})], {from: 2.0, keys: sample(t => { const u = t - 2.0; return {x: 960 + u * 260, y: 980 + u * u * 1400 - u * 260, a: 10 + u * 160, s: 0.7}; }, 2.0, d)}),
  becario({x: 330, y: 1460, scale: 1.1, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(65.26, 68.45), armR: {shoulder: 70, elbow: 20, hold: [antorcha({x: 0, y: 40, scaleX: 0.6, scaleY: 0.6})]}})],
  d, move.dolly(d, 1.04, 1.14), 760, 1000)]);
// 68.45–VOICE · «Doscientos veintisiete días sin cobrar.» — el contador.
shot(68.45, VOICE, d => [camF([...office(d), desk(), hwacha({x: 860, y: 1150, scale: 0.55, tilt: 14, dur: d}),
  becario({x: 330, y: 1460, scale: 1.1, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(68.45, VOICE), headKeys: [{t: 0, angle: 0}, {t: 0.8, angle: deg(-4)}, {t: d, angle: deg(8)}]}),
  counter(DAYS, {x: 640, y: 560, scaleX: 1.4, scaleY: 1.4, from: 0.3, keys: sample(t => ({s: 1.4 * mix(1.3, 1, eBack((t - 0.3) / 0.2))}), 0.3, d)})], d, move.dolly(d, 1.06, 1.16), 760, 1000)]);
// VOICE–END · Bucle: de la oficina a la portada; termina en el fotograma 1.
shot(VOICE, END, d => [camF(thumbCard(d), d, t => ({s: mix(1.5, 1.0, eOut(t / (d - 0.04)))}), 640, 1300), flash(0, 0.1, PAPER, 0.8), G([thumbTitle()], {from: r3(d - 0.2)})]);

// Transiciones: barrido en los cortes que cambian de escenario.
const SAME = new Set([1.39, 2.89, 9.63, 11.12, 18.43, 21.2, 26.26, 26.99, 28.43, 40.75, 44.9, 51.82, 53.55, 55.63, 59.27, 60.98, 65.26, 68.45]);
const whip = (dir, d) => G(Array.from({length: 9}, (_, i) => R(0, 120 + i * 230 + (i % 3) * 40, 900 + (i % 4) * 200, 34 + (i % 3) * 14, {radius: 17, fill: PAPER, stroke: 'none'})),
  {to: Math.min(d, 0.18), keys: sample(t => ({x: dir * mix(1400, -2400, t / 0.18), alpha: 0.75 * (1 - t / 0.18)}), 0, Math.min(d, 0.18))});
shots.forEach((sh, i) => { if (i && !SAME.has(sh.start)) sh.layers.push(whip(i % 2 ? 1 : -1, sh.end - sh.start)); });
// Subtítulos karaoke.
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const cap = captionTrack(WORDS, captions, {num: RED, size: 76});
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos: solo en silencios medidos (voz.py silences) o muy bajos.
const has = n => fs.existsSync(`sfx/${n}.wav`);
const sfx = [
  F(0.1, 'crowd', 0.08, 1.2),
  F(5.25, 'whoosh', 0.2),
  F(12.55, 'boing', 0.3, 0.35),
  F(23.1, 'crowd', 0.07, 1.6),
  F(28.08, 'canon', 0.45, 0.4),
  F(28.45, 'whoosh', 0.25, 0.6),
  F(35.38, 'impresora', 0.5, 0.3),
  F(40.5, 'drop', 0.3, 0.3),
  F(54.42, 'scratch', 0.25, 0.3),
  F(60.7, 'drop', 0.25, 0.25),
  F(67.68, 'puf', 0.4, 0.33),
  F(VOICE, 'whoosh', 0.2),
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
