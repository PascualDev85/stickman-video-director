// EXPEDIENTE 005 — «Garbo, el espía que inventó 27 espías» (Historias Sin Cabeza). Short 9:16, ~53,7 s.
// Guion FINAL (guion.md). Voz: toma A ×1,06 + 10 pausas recortadas (cuts.txt) = 53,11 s. Estructura copiada de 004.
import fs from 'node:fs';
import {becario, pujol, oficialDe, ingles, viuda, soldadoDe, escoces, caseFolder, P, E, R, G, S, deg, INK, PAPER, ctext, sign} from '../kit.mjs';
import {H, GROUND, RED, YEL, tag, captionTrack, fill, band, mix, r3, eOut, eInOut, eBack, shake, sample, camF, cam, slam, flash, rays, cloud, vignette, office, desk, makeEpisode, F, bubble} from '../lib.mjs';
import {mapCam, cabeza, ficha, saco, embajada, cvPila, mapa, PT, ruta, tranvia, mesaCafe, maquina, guia, botella, pinta, periodico, sobre, radio, cruzHierro, medallaMBE, manual, paso, calais, calendario} from './props.mjs';

const {WORDS, shots, shot: shot0, mouth: mouth0} = makeEpisode('words.json');
// v2: se quitó «Expediente cero cero cinco» de la voz (4,72–6,40 s de la v1 = 1,68 s; lección 001). v3: +0,25 s de pausa tras el gancho (en 4,70).
// Los tiempos de abajo son los de la v1 (salvo 4,95, ya nuevo) y T() los desplaza: lo posterior a 6,0 adelanta 1,68 − 0,25 = 1,43 s.
const CUT = 6.0, CUTX = 1.43, T = t => (t > CUT + 1e-6 ? r3(t - CUTX) : t);
const shot = (a, b, f) => shot0(T(a), T(b), f), mouth = (a, b) => mouth0(T(a), T(b)), FX = (t, ...r) => F(T(t), ...r);
const VOICE = 51.684, END = 52.27; // VOICE = duración real de narration.mp3

// ---------- sets ----------
const NIGHT = '#1f2a44', CORK = '#c79a5a';
/** Tablón de corcho con las 27 fichas (9 × 3). bags: t de aparición del saco de cada ficha; stamps: t del sello FALSO. */
const CARD = i => ({x: 220 + (i % 9) * 105, y: 580 + Math.floor(i / 9) * 140});
const tablon = (d, {bags, stamps, extra = []} = {}) => [
  R(160, 410, 960, 470, {radius: 12, fill: CORK, lineWidth: 10}),
  ...Array.from({length: 27}, (_, i) => { const c = CARD(i);
    const card = ficha(i, {x: c.x, y: c.y, scaleX: 0.55, scaleY: 0.55, angle: deg(((i * 7) % 5 - 2) * 2)});
    const st = stamps ? G([P([['M', -34, -34], ['L', 34, 34]], {stroke: RED, lineWidth: 14}), P([['M', 34, -34], ['L', -34, 34]], {stroke: RED, lineWidth: 14})], {x: c.x, y: c.y - 55, angle: deg(-14), from: r3(stamps(i)), keys: sample(t => ({s: mix(1.8, 1, eOut((t - stamps(i)) / 0.12))}), r3(stamps(i)), d)}) : null;
    const bg = bags ? G([saco({scaleX: 0.38, scaleY: 0.38})], {x: c.x + 34, y: c.y + 12, from: r3(bags(i)), keys: sample(t => ({s: mix(0.2, 1, eBack((t - bags(i)) / 0.18))}), r3(bags(i)), d)}) : null;
    return G([card, ...(bg && bags(i) < d ? [bg] : []), ...(st && stamps(i) < d ? [st] : [])]); }),
  ...extra];
const spyRoom = d => [fill(NIGHT), E(640, 1000, 1500, 1300, {fill: '#2e3d5e', stroke: 'none'}), band(1600, 900, '#3a3040'), band(1600, 14, '#2a2030')];
const madrid = d => [fill('#9fd3f0'), cloud(250, 300, 0.7, d, 40), cloud(1000, 380, 0.5, d, 60), band(1560, 900, '#d9c9a3'), band(1560, 14, '#b89a62')];
const lisboa = d => [fill('#a8dcf5'), cloud(900, 300, 0.6, d, 50), ...[['#f2a65a', -60, 420], ['#7fc4a8', 360, 460], ['#f4efe3', 820, 520]].map(([c, x, w]) => R(x, 560, w, 1000, {radius: 0, fill: c, lineWidth: 10})),
  ...[80, 260, 480, 700, 940, 1120].map(x => R(x, 760, 110, 150, {radius: 6, fill: '#3d6e9e', lineWidth: 7})), band(1560, 900, '#c9b48a'), band(1560, 14, '#a8946a')];
const glasgow = d => [fill('#8e9aa6'), ...[['#7a6a62', -60, 480], ['#6b5f5a', 420, 420], ['#857a70', 840, 500]].map(([c, x, w]) => R(x, 420, w, 1140, {radius: 0, fill: c, lineWidth: 10})),
  R(470, 640, 320, 120, {radius: 8, fill: '#2b4a3a', lineWidth: 8}), ctext('PUB', 630, 652, 70, {maxW: 280, color: YEL}), band(1560, 900, '#5a5f66'), band(1560, 14, '#44484e'),
  ...Array.from({length: 26}, (_, i) => P([['M', (i * 97) % 1300, 0], ['L', (i * 97) % 1300 - 40, 120]], {stroke: 'rgba(255,255,255,0.45)', lineWidth: 5, keys: sample(t => ({y: ((t * 2600 + i * 331) % 2300) - 200}), 0, d)}))];
const DE = '#8a4a40', UK = '#6f8f72'; // pared de la oficina alemana / británica (variar fondos)
// Alemana: archivador gris y lámpara de techo. Británica: mapa del Canal en la pared y estantería con carpetas.
const decoDE = [R(1010, 820, 220, 690, {radius: 6, fill: '#7d8288', lineWidth: 9}), ...[0, 1, 2].map(k => R(1035, 860 + k * 215, 170, 170, {radius: 6, fill: '#9aa0a6', lineWidth: 7})), ...[0, 1, 2].map(k => R(1090, 930 + k * 215, 60, 20, {radius: 6, fill: INK, stroke: 'none'})),
  P([['M', 640, -60], ['L', 640, 230]], {lineWidth: 7}), S([['M', 560, 300], ['L', 720, 300], ['L', 680, 230], ['L', 600, 230], ['Z']], '#2b4a3a', {lineWidth: 7}), E(640, 318, 60, 30, {fill: '#ffe36b', lineWidth: 5})];
const decoUK = [R(780, 470, 360, 290, {radius: 6, fill: '#9fd3f0', lineWidth: 9}), S([['M', 880, 500], ['L', 930, 510], ['L', 910, 600], ['L', 950, 680], ['L', 870, 700], ['L', 890, 600], ['Z']], '#e9c9a6', {lineWidth: 5}),
  S([['M', 960, 740], ['L', 1000, 680], ['L', 1120, 650], ['L', 1120, 760], ['Z']], '#cfe0a6', {lineWidth: 5}), E(1010, 700, 18, 18, {fill: RED, stroke: 'none'}),
  R(1010, 900, 230, 600, {radius: 6, fill: '#7d5229', lineWidth: 9}), ...[0, 1, 2].map(k => R(1010, 1000 + k * 170, 230, 16, {radius: 0, fill: '#5a3a22', stroke: 'none'})),
  ...[0, 1, 2].flatMap(k => [0, 1, 2, 3].map(j => R(1030 + j * 50, 900 + k * 170, 36, 96, {radius: 4, fill: ['#e0261b', '#1f3a6e', '#e9c46a', '#2e8b4a'][(j + k) % 4], lineWidth: 5})))];
const despacho = (d, {color = '#d9d0bd'} = {}) => [fill(color), ...(color === DE ? decoDE : color === UK ? decoUK : []), R(150, 380, 300, 380, {radius: 4, fill: '#c9d6e3', lineWidth: 10}), P([['M', 300, 380], ['L', 300, 760]], {lineWidth: 8}), band(1500, 900, '#6b5a44'), band(1500, 14, '#4a3e30'),
  R(520, 1180, 760, 44, {radius: 8, fill: '#7d5229'}), R(560, 1224, 34, 290, {radius: 4, fill: '#5a3a22'}), R(1180, 1224, 34, 290, {radius: 4, fill: '#5a3a22'})];
const londres = d => [fill('#b8c4cc'), cloud(300, 300, 0.8, d, 30), R(880, 300, 200, 1260, {radius: 0, fill: '#c9b48a', lineWidth: 10}), S([['M', 860, 300], ['L', 980, 140], ['L', 1100, 300], ['Z']], '#7d6a48', {lineWidth: 9}),
  E(980, 470, 150, 150, {fill: PAPER, lineWidth: 8}), P([['M', 980, 470], ['L', 980, 415]], {lineWidth: 7}), P([['M', 980, 470], ['L', 1020, 490]], {lineWidth: 7}),
  ...[-60, 300].map(x => R(x, 760, 340, 800, {radius: 0, fill: '#8a6a5a', lineWidth: 10})), band(1560, 900, '#7a7f86'), band(1560, 14, '#5a5f66')];

// ---------- movimiento (v4): cabezazos, risa, saltos ----------
const keysIn = (d, ks) => ks.filter(k => k.t >= 0 && k.t <= d).sort((a, b) => a.t - b.t).filter((k, i, a) => !i || k.t > a[i - 1].t);
/** Asentir/estremecerse: inclinación de cabeza en cada t. */
const nod = (d, ts, a = 7, w = 0.12) => keysIn(d, [{t: 0, angle: 0}, ...ts.flatMap(t => [{t: r3(t - w), angle: 0}, {t: r3(t), angle: deg(a)}, {t: r3(t + w), angle: 0}]), {t: d, angle: 0}]);
/** Risa / sollozo: cabeza que oscila entre t0 y t1. */
const laugh = (d, t0, t1, a = 5, per = 0.16) => keysIn(d, [{t: 0, angle: 0}, {t: r3(t0), angle: 0}, ...Array.from({length: Math.floor((t1 - t0) / per)}, (_, k) => ({t: r3(t0 + (k + 1) * per), angle: deg(k % 2 ? -a : a)})), {t: r3(Math.min(d, t1 + per)), angle: 0}, {t: d, angle: 0}]);
/** Saltito en cada t (x fijo). */
const hop = (d, x, y, ts, h = 45) => keysIn(d, [{t: 0, x, y}, ...ts.flatMap(t => [{t: r3(t - 0.01), x, y}, {t: r3(t + 0.1), x, y: y - h}, {t: r3(t + 0.24), x, y}]), {t: d, x, y}]);
/** Retroceso en cada t (golpe de puerta). */
const flinch = (d, x, y, ts, dx = 40) => keysIn(d, [{t: 0, x, y}, ...ts.flatMap(t => [{t: r3(t - 0.02), x, y}, {t: r3(t + 0.06), x: x + dx, y}, {t: r3(t + 0.3), x, y}]), {t: d, x, y}]);

// ---------- miniatura (= fotograma 1 y último) ----------
// Tablón con 27 fichas arriba; Garbo grande a la derecha (gabardina + fedora) guiñando; título a la izquierda.
const GB = {x: 900, y: 1720, s: 1.55};
const hookSet = (d, {bags, stamps, wink = false, officer = false, gestures, headKeys} = {}) => [...spyRoom(d), ...tablon(d, {bags, stamps}),
  pujol({x: GB.x, y: GB.y, scale: GB.s, expr: wink ? 'picaro' : 'sarcastico', look: -1, idle: {dur: d}, armL: {shoulder: 30, elbow: 60}, armR: {shoulder: 20, elbow: 30}, gestures, headKeys: headKeys || (officer ? nod(d, [0.9], -6, 0.2) : undefined)}),
  ...(officer ? [oficialDe({x: 260, y: 1760, scale: 1.0, expr: 'contento', look: 1, walk: {dur: 0.6, period: 0.4, stride: 20}, move: [{t: 0, x: -200}, {t: 0.6, x: 260}],
    armR: {shoulder: 110, elbow: 30, hold: [G([saco({scaleX: 0.6, scaleY: 0.6})], {y: 150})]}})] : []),
];
const thumb = (d, fade = 0, t0 = 0) => {
  const line = (text, y, size, color) => ({...ctext(text, 360, y, size, {maxW: 520, color}), outline: INK, outlineWidth: 16});
  const body = G([G([tag('HISTORIA REAL · 1944', 990, 44, {pop: false, color: RED, tilt: -2})], {x: -280}),
    G([line('27 ESPÍAS', 1050, 128, YEL), line('NINGUNO', 1200, 104, PAPER), line('EXISTÍA', 1310, 104, PAPER)], {angle: deg(-4)})]);
  return fade ? G([body], {from: t0, keys: sample(t => ({alpha: (t - t0) / fade}), t0, Math.min(d, t0 + fade))}) : body;
};
/** Ventanita con el Becario reaccionando (de t0 al final del plano): primer plano de busto, para que se le lea la cara en el móvil. */
const becCam = (t0, d, expr, {x = 200, y = 700, look = 1, s: sc = 1} = {}) => G([R(-170, -235, 340, 470, {radius: 24, fill: '#e8e2d0', lineWidth: 10}), R(-120, -200, 110, 150, {radius: 4, fill: '#c9d6e3', lineWidth: 6}),
  becario({x: 0, y: 440, scale: 0.85, expr, look, bust: true, idle: {dur: d}, headKeys: [{t: 0, angle: 0}, {t: t0 + 0.25, angle: 0}, {t: t0 + 0.4, angle: deg(-6 * look)}, {t: d, angle: deg(-6 * look)}]}),
  R(-170, 150, 340, 85, {radius: 0, fill: '#8a6a4a', lineWidth: 8}), R(-170, -235, 340, 470, {radius: 24, fill: 'none', lineWidth: 12})],
  {x, y, from: r3(t0), keys: sample(t => ({s: sc * mix(0.3, 1, eBack((t - t0) / 0.2)), a: -3}), r3(t0), d)});
/** Mini tablón de agentes inventados: hasta 12 fichas; las de n0 a n entran desde t0 (en 0,5 s) y el número cuenta de n0 a n. Entra de golpe en t0 − 0,25. */
const plantilla = (n, t0, d, {x = 870, y = 620, n0 = n - 1, s: sc = 1} = {}) => { const cnt = Math.min(n, 12), k0 = Math.min(n0, 12), ti = r3(Math.max(0, t0 - 0.25));
  const tt = i => (i < k0 ? null : r3(t0 + (cnt - k0 > 1 ? ((i - k0) / (cnt - k0)) * 0.5 : 0)));
  const steps = Array.from({length: n - n0 + 1}, (_, k) => n0 + k), dt = steps.length > 1 ? 0.5 / (steps.length - 1) : 0;
  const label = v => [R(-130, -36, 260, 72, {radius: 8, fill: '#fff6d6', stroke: RED, lineWidth: 7}), ctext(`AGENTES: ${v}`, 0, -28, 42, {maxW: 240, color: RED})];
  return G([R(-170, -120, 340, 250, {radius: 10, fill: CORK, lineWidth: 8}),
    ...Array.from({length: cnt}, (_, i) => { const t = tt(i); const pos = {x: -135 + (i % 6) * 54, y: -10 + Math.floor(i / 6) * 100};
      return t === null ? G([ficha(i, {scaleX: 0.3, scaleY: 0.3})], pos) : G([ficha(i, {scaleX: 0.3, scaleY: 0.3})], {...pos, from: t, keys: sample(u => ({s: mix(2, 1, eOut((u - t) / 0.15))}), t, d)}); }),
    ...steps.map((v, k) => { const a = k ? r3(t0 + (k - 1) * dt + dt) : 0, b = k < steps.length - 1 ? r3(t0 + k * dt + dt) : undefined;
      return G(label(v), {y: 175, ...(k ? {from: a} : {}), ...(b !== undefined ? {to: b} : {}), ...(k === steps.length - 1 ? {keys: sample(u => ({s: mix(1.5, 1, eOut((u - a) / 0.18))}), a, d)} : {})}); })],
    {x, y, from: ti, keys: sample(t => ({s: sc * mix(0.2, 1, eBack((t - ti) / 0.22))}), ti, d)}); };
const BAG = i => 0.55 + ((i * 11) % 27) * 0.045; // sacos que caen en orden salteado

// ================= SHOTS =================
// 0–1.10 · «Los nazis pagaban» — miniatura; empiezan a caer sacos de dinero en las fichas.
shot(0, 1.10, d => [camF(hookSet(d, {bags: BAG}), d, t => ({s: mix(1.0, 1.04, t / d)}), 640, 1100), G([thumb(d)], {to: 1.0})]);
// 1.10–3.05 · «a veintisiete espías. [beat]» — el oficial de la Abwehr entra con más sacos; la cámara se acerca al tablón.
shot(1.10, 3.05, d => [camF(hookSet(d, {bags: i => Math.max(0, BAG(i) - 1.1), officer: true}), d, t => ({s: mix(1.0, 1.08, eInOut(t / d))}), 640, 700),
  tag('ESPIONAJE NAZI · 1941', 420, 54, {t0: 0.15, tilt: 2})]);
// 3.05–4.75 · «Todos inventados por un español.» — ola de sellos FALSO y la cámara cae sobre Garbo, que guiña.
shot(3.05, 4.95, d => [camF(hookSet(d, {bags: () => 0, stamps: i => 0.05 + (i % 9) * 0.05 + Math.floor(i / 9) * 0.06, wink: true, gestures: [{t0: 0.75, t1: 1.6, arm: 'R', shoulder: 130, elbow: 110}]}), d,
  t => (t < 0.85 ? {s: 1.0} : {s: mix(1.0, 1.3, eInOut((t - 0.85) / 0.35)), y: mix(0, -200, eInOut((t - 0.85) / 0.35)), x: mix(0, -200, eInOut((t - 0.85) / 0.35))}), 640, 700)]);
// 4.75–6.55(v1) · «Cómo fabricar un espía.» — seguimos con Garbo (sin oficina): el manual entra de golpe a su lado.
shot(4.95, 8.00, d => [camF(hookSet(d, {bags: () => 0, stamps: () => 0, wink: true, gestures: [{t0: 0.3, t1: 1.3, arm: 'L', shoulder: 60, elbow: -40}], headKeys: nod(d, [0.35], -6, 0.2)}), d, t => ({s: mix(1.3, 1.36, t / d), y: -200, x: -200}), 640, 700),
  G([manual()], {x: 330, y: 1080, keys: sample(t => ({s: mix(0.4, 1.3, eBack(t / 0.22)), a: -6}), 0, d)})]);
// 8.00–9.50 · «Paso uno: que te rechacen.» — PASO 1 + la puerta de la embajada se cierra en las narices de Garbo.
const DOOR = [{t: 0, scaleX: 0.25}, {t: 0.85, scaleX: 0.25}, {t: 1.0, scaleX: 1}];
shot(8.00, 9.50, d => [camF([...madrid(d), embajada({x: 640, y: 1560, scaleX: 0.95, scaleY: 0.95}, DOOR),
  pujol({x: 520, y: 1700, scale: 0.95, expr: 'contento', look: 1, idle: {dur: d}, walk: {dur: 0.8, period: 0.4, stride: 18}, move: [{t: 0, x: 380}, {t: 0.8, x: 520}], headKeys: [{t: 0, angle: 0}, {t: 1.0, angle: 0}, {t: 1.1, angle: deg(-8)}]}),
], d, t => ({s: mix(1.05, 1.12, t / d), ...shake(t, 1.0, 0.2, 14)}), 640, 1200), G([paso(1)], {x: 640, y: 440, keys: sample(t => ({s: mix(1.6, 1, eOut(t / 0.15))}), 0, d)})]);
// 9.50–12.98 · «Joan Pujol, antinazi, se ofreció tres veces a los ingleses.» — llama tres veces; el inglés asoma y dice NO; contador ×3.
const NO = [1.75, 2.35, 2.95];
shot(9.50, 12.98, d => [camF([...madrid(d), embajada({x: 640, y: 1560, scaleX: 0.95, scaleY: 0.95}, sample(t => ({sx: NO.some(n => t > n - 0.3 && t < n + 0.25) ? 0.5 : 1}), 0, d)),
  ...NO.map((n, k) => ingles({x: 600, y: 1560, scale: 0.75, expr: 'serio', look: 1, idle: {dur: d}, from: r3(n - 0.28), to: r3(n + 0.25)})),
  pujol({x: 900, y: 1740, scale: 1.25, expr: 'nervioso', look: -1, idle: {dur: d}, armL: {shoulder: 80, elbow: 60}, move: flinch(d, 900, 1740, NO.map(n => n - 0.2), 45), headKeys: nod(d, NO.map(n => n - 0.15), 9)}),
  ...NO.map((n, k) => bubble('NO', 470, 760, 600, 980, n - 0.2, d, {size: 70, until: n + 0.3})),
], d, t => ({s: mix(1.1, 1.18, t / d)}), 640, 1200),
  tag('JOAN PUJOL · MADRID, 1941', 420, 52, {t0: 0.05, tilt: -2}), ...NO.map((n, k) => slam(`×${k + 1}`, 250, 1060, 190, n, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.4, until: k < 2 ? NO[k + 1] : undefined}))]);
// 12.98–15.20 · «[suspiro] Como mis currículums.» — el Becario con su montón de currículums: tres sellos NO.
shot(12.98, 15.20, d => [camF([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(12.98, 15.20), headKeys: [{t: 0, angle: 0}, {t: 0.4, angle: deg(8)}, {t: d, angle: deg(8)}]}),
  cvPila({x: 820, y: 940, scaleX: 0.85, scaleY: 0.85}),
  ...[0.12, 0.5, 1.1].map((t0, k) => G([R(-110, -40, 220, 80, {radius: 8, fill: 'none', stroke: RED, lineWidth: 10}), ctext('NO', 0, -32, 64, {maxW: 200, color: RED})], {x: 800 + (k - 1) * 40, y: 860 + k * 60, angle: deg(-12 + k * 8), from: t0, keys: sample(t => ({s: mix(1.8, 1, eOut((t - t0) / 0.1))}), t0, d)})),
], d, t => ({s: mix(1.1, 1.2, t / d), ...shake(t, 0.12, 0.12, 10), ...shake(t, 0.5, 0.12, 10), ...shake(t, 1.1, 0.12, 10)}), 700, 1000)]);
// 15.20–17.30 · «Paso dos: ofrécete al enemigo.» — PASO 2 + apretón de manos con el oficial; Garbo guiña a cámara.
shot(15.20, 17.30, d => [camF([...despacho(d, {color: DE}),
  oficialDe({x: 380, y: 1720, scale: 1.05, expr: 'contento', look: 1, idle: {dur: d}, armR: {shoulder: 60, elbow: 10}, headKeys: nod(d, [0.45, 0.8, 1.15], 6)}),
  pujol({x: 880, y: 1720, scale: 1.05, expr: 'picaro', look: 0, idle: {dur: d}, armL: {shoulder: 60, elbow: 10}, headKeys: keysIn(d, [{t: 0, angle: 0}, {t: 1.2, angle: 0}, {t: 1.4, angle: deg(10)}, {t: d, angle: deg(10)}])}),
], d, t => ({s: mix(1.0, 1.08, t / d)}), 640, 1200), G([paso(2)], {x: 640, y: 440, keys: sample(t => ({s: mix(1.6, 1, eOut(t / 0.15))}), 0, d)}), tag('LOS NAZIS LE FICHAN', 580, 50, {t0: 0.6, tilt: 2})]);
// 17.30–18.62 · «Lo mandan a Inglaterra…» — mapa: flecha Madrid → Londres.
const RUTA = [PT.madrid, [526, 1219], PT.londres];
const CA = [640, 1220, 1.0], CB = [430, 1700, 1.45]; // encuadres: Madrid–Londres / península
const anim = (d, f) => Array.from({length: Math.ceil(d * 15)}, (_, k) => G([f(k / 15)], {from: r3(k / 15), to: r3(Math.min(d, (k + 1) / 15))})).filter(g => g.from < d);
shot(17.30, 18.62, d => [camF([...mapa(), ...anim(d, t => ruta(RUTA, Math.min(0.92, t / 1.0), {head: true}))], d, t => mapCam(CA[0], CA[1], mix(CA[2], 1.06, t / d)))]);
// 18.62–19.75 · «y se queda en Lisboa.» — la flecha se para, una X roja, y otra flecha corta a Lisboa.
shot(18.62, 19.75, d => [camF([...mapa({labels: ['ESPAÑA', 'PORTUGAL'], cities: ['madrid', 'lisboa']}), ruta(RUTA, 0.92, {color: '#9aa3ab'}),
  G([P([['M', -40, -40], ['L', 40, 40]], {stroke: RED, lineWidth: 18}), P([['M', 40, -40], ['L', -40, 40]], {stroke: RED, lineWidth: 18})], {x: PT.londres[0], y: PT.londres[1] + 80, from: 0.05}),
  ...anim(d, t => ruta([PT.madrid, PT.lisboa], Math.min(1, t / 0.5), {head: true})),
], d, t => { const k = eInOut(Math.min(1, t / 0.7)); return mapCam(mix(CA[0], CB[0], k), mix(CA[1], CB[1], k), mix(1.06, CB[2], k)); }),
  tag('LISBOA', 420, 64, {t0: 0.35, tilt: 3, color: RED})]);
// 19.75–22.50 · «Paso tres: espía con una guía turística.» — café de Lisboa; tranvía al fondo; Garbo lee la guía y teclea «INFORME DESDE LONDRES».
shot(19.75, 22.50, d => [camF([...lisboa(d), G([tranvia()], {y: 1540, keys: sample(t => ({x: mix(1500, -300, t / d)}), 0, d)}),
  mesaCafe({x: 400, y: 1700}), G([maquina({}, 'INFORME DESDE LONDRES')], {x: 420, y: 1370, scaleX: 0.75, scaleY: 0.75}),
  pujol({x: 900, y: 1740, scale: 1.0, expr: 'contento', look: -1, idle: {dur: d}, armL: {shoulder: 60, elbow: 70, hold: [guia({y: 140, scaleX: 0.55, scaleY: 0.55})]}, gestures: [{t0: 0.4, t1: 1.3, arm: 'R', shoulder: 120, elbow: 110}], headKeys: nod(d, [0.5, 1.6], -8, 0.25)}),
], d, t => (t < 1.2 ? {s: 1.0} : {s: mix(1.0, 1.5, eInOut((t - 1.2) / 0.4)), x: mix(0, 120, eInOut((t - 1.2) / 0.4)), y: mix(0, -300, eInOut((t - 1.2) / 0.4))}), 760, 1150),
  G([paso(3)], {x: 640, y: 440, keys: sample(t => ({s: mix(1.6, 1, eOut(t / 0.15))}), 0, d)})]);
// 22.50–24.60 · «Según él, en Glasgow harían lo que fuera por» — Glasgow bajo la lluvia: un escocés con su pinta mira una botella de «1 L».
shot(22.50, 24.60, d => [camF([...glasgow(d),
  escoces({x: 520, y: 1720, scale: 1.1, expr: 'sorpresa', look: 1, idle: {dur: d}, move: hop(d, 520, 1720, [0.55]), gestures: [{t0: 0.6, t1: 1.8, arm: 'L', shoulder: 50, elbow: 40}], armL: {shoulder: 60, elbow: 70, hold: [G([pinta()], {y: 160, scaleX: 0.7, scaleY: 0.7})]}}),
  G([botella()], {x: 960, y: 1640, keys: sample(t => ({s: mix(0.6, 1.1, eBack(t / 0.3))}), 0, d)}),
], d, t => ({s: mix(1.0, 1.08, t / d)}), 640, 1200), bubble('¿UN LITRO?', 380, 640, 520, 980, 0.6, d, {size: 54}), plantilla(3, 1.0, d, {n0: 2, x: 830, y: 1000, s: 1.45}), tag('GLASGOW (SEGÚN GARBO)', 420, 50, {t0: 0.05, tilt: -2})]);
// 24.60–26.00 · «un litro de vino. [beat]» — en Berlín, el oficial lee el informe, asiente y lo apunta: «¡GUT!».
shot(24.60, 26.00, d => [camF([...despacho(d, {color: DE}),
  oficialDe({x: 600, y: 1720, scale: 1.15, expr: 'contento', look: -1, idle: {dur: d}, gestures: [{t0: 0.95, t1: 1.6, arm: 'L', shoulder: 110, elbow: 80}], armR: {shoulder: 60, elbow: 80, hold: [G([R(-90, -120, 180, 240, {radius: 4, fill: PAPER, lineWidth: 7}), ctext('1 L = TODO', 0, -100, 30, {maxW: 160, color: RED})], {y: 160})]},
    headKeys: [{t: 0, angle: 0}, {t: 0.7, angle: 0}, {t: 0.85, angle: deg(8)}, {t: 1.0, angle: 0}, {t: 1.15, angle: deg(8)}, {t: d, angle: 0}]}),
], d, t => ({s: mix(1.35, 1.45, t / d)}), 560, 1150), becCam(0.75, d, 'sorpresa', {x: 190, y: 900}), bubble('¡GUT!', 560, 600, 700, 860, 0.9, d, {size: 72}), tag('BERLÍN SE LO CREE', 420, 50, {t0: 0.1, tilt: 2})]);
// 26.00–28.85 · «Paso cuatro: que los ingleses por fin te fichen.» — Londres: el inglés del MI5 le da a Garbo una carpeta.
shot(26.00, 28.85, d => [camF([...londres(d),
  ingles({x: 380, y: 1720, scale: 1.05, expr: 'contento', look: 1, idle: {dur: d}, walk: {dur: 0.6, period: 0.4, stride: 18}, move: [{t: 0, x: 120}, {t: 0.6, x: 380}], armR: {shoulder: 70, elbow: 20, hold: [G([caseFolder({label: 'MI5'})], {y: 160, scaleX: 0.3, scaleY: 0.3})], }, from: 0}),
  pujol({x: 860, y: 1720, scale: 1.05, expr: 'contento', look: -1, idle: {dur: d}, armL: {shoulder: 40, elbow: 30}, gestures: [{t0: 0.8, t1: 2.6, arm: 'L', shoulder: 25, elbow: -20}], headKeys: nod(d, [1.4, 1.8], 7)}),
], d, t => ({s: mix(1.0, 1.08, t / d)}), 640, 1200), G([paso(4)], {x: 640, y: 440, keys: sample(t => ({s: mix(1.6, 1, eOut(t / 0.15))}), 0, d)}), tag('LONDRES, 1942', 580, 54, {t0: 0.4, tilt: -2})]);
// 28.85–30.45 · «Nombre en clave: Garbo.» — foco de cine negro; ficha con el sello GARBO.
shot(28.85, 30.45, d => [camF([fill(NIGHT), S([['M', 640, -60], ['L', 300, 1800], ['L', 980, 1800], ['Z']], 'rgba(255,240,180,0.25)', {stroke: 'none'}),
  pujol({x: 640, y: 1740, scale: 1.2, expr: 'picaro', look: 0, idle: {dur: d}, armL: {shoulder: 20, elbow: 120}, armR: {shoulder: 20, elbow: 120}, gestures: [{t0: 0.35, t1: 1.1, arm: 'R', shoulder: 110, elbow: 0}], headKeys: nod(d, [0.4], -6, 0.25)}),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1200), slam('GARBO', 640, 520, 170, 0.95, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.3})]);
// 30.45–32.05 · «Mata a un espía inventado…» — la ficha de un agente se tacha y sale la necrológica.
shot(30.45, 32.05, d => [camF([...despacho(d, {color: '#e9dcb0'}),
  ficha(4, {x: 470, y: 1180, scaleX: 2.1, scaleY: 2.1, angle: deg(-4)}),
  G([P([['M', -150, -150], ['L', 150, 150]], {stroke: RED, lineWidth: 26}), P([['M', 150, -150], ['L', -150, 150]], {stroke: RED, lineWidth: 26})], {x: 470, y: 980, from: 0.35, keys: sample(t => ({s: mix(1.8, 1, eOut((t - 0.35) / 0.12))}), 0.35, d)}),
  pujol({x: 960, y: 1760, scale: 1.15, expr: 'picaro', look: -1, idle: {dur: d}, armL: {shoulder: 120, elbow: 40}, headKeys: laugh(d, 0.45, 1.4)}),
  G([periodico()], {x: 760, y: 1000, from: 0.9, keys: sample(t => ({s: mix(0.3, 0.6, eBack((t - 0.9) / 0.25)), a: mix(-30, 6, eOut((t - 0.9) / 0.25))}), 0.9, d)}),
], d, t => ({s: mix(1.0, 1.05, t / d), ...shake(t, 0.35, 0.15, 12)}), 640, 1150), tag('AGENTE DE LIVERPOOL', 420, 52, {t0: 0.05, tilt: 2}),
  slam('MUERTO', 470, 1420, 110, 0.4, d, {outline: true, color: RED, tilt: -10, stamp: true, from: 1.3})]);
// 32.05–34.21 · «y Alemania paga la pensión a la viuda.» — el oficial le da el sobre a la viuda, muy solemne.
const VI = {x: 860, y: 1720};
const viudaSet = (d, {gone} = {}) => [...despacho(d, {color: DE}),
  oficialDe({x: 380, y: 1720, scale: 1.05, expr: gone ? 'sorpresa' : 'serio', look: 1, idle: {dur: d}, headKeys: gone ? nod(d, [0.35], -10, 0.15) : nod(d, [0.9], 8, 0.3), armR: gone ? {shoulder: 30, elbow: 20} : {shoulder: 75, elbow: 10, hold: [G([sobre()], {y: 140, scaleX: 0.7, scaleY: 0.7})]}}),
  ...(gone ? [] : [viuda({x: VI.x, y: VI.y, scale: 1.0, expr: 'agobiado', look: -1, idle: {dur: d}, headKeys: laugh(d, 0.4, 1.9, 4, 0.2)})])];
shot(32.05, 34.21, d => [camF(viudaSet(d), d, t => ({s: mix(1.0, 1.08, t / d)}), 640, 1200), tag('PENSIÓN DE VIUDEDAD', 420, 52, {t0: 0.6, tilt: -2})]);
// 34.21–35.45 · «Que tampoco existía.» — la viuda se esfuma (puf) y el sobre cae; el oficial se queda mirando.
shot(34.21, 35.45, d => [camF([...viudaSet(d, {gone: true}),
  viuda({x: VI.x, y: VI.y, scale: 1.0, expr: 'agobiado', look: -1, idle: {dur: d}, to: 0.3, alpha: 1}),
  G([...Array.from({length: 8}, (_, i) => { const a = i / 8 * Math.PI * 2; return P([['M', Math.cos(a) * 120, Math.sin(a) * 160], ['L', Math.cos(a) * 260, Math.sin(a) * 340]], {stroke: PAPER, lineWidth: 12}); })], {x: VI.x, y: VI.y - 500, from: 0.3, to: 0.6}),
  G([sobre()], {x: 520, y: 1300, keys: sample(t => ({y: t < 0.3 ? 1300 : mix(1300, 1640, eInOut((t - 0.3) / 0.4)), a: t < 0.3 ? 0 : mix(0, 30, (t - 0.3) / 0.4)}), 0, d)}),
], d, t => ({s: mix(1.1, 1.16, t / d)}), 640, 1200), flash(0.28, 0.12, PAPER, 0.7), becCam(0.6, d, 'agobiado', {x: 700, y: 820, look: -1})]);
// 35.45–37.50 · «Paso cinco: convence a los nazis de que» — Garbo en la radio, de madrugada.
shot(35.45, 37.50, d => [camF([...despacho(d, {color: '#3a4560'}),
  G([radio()], {x: 560, y: 1175, scaleX: 0.7, scaleY: 0.7}),
  pujol({x: 330, y: 1740, scale: 1.0, expr: 'picaro', look: 1, idle: {dur: d}, armR: {shoulder: 70, elbow: 30}, headKeys: laugh(d, 0.55, 1.8, 4, 0.3)}),
  ...[0.6, 0.9, 1.2, 1.5].map(t0 => G([P([['M', 0, 0], ['Q', 40, -40, 80, 0]], {stroke: YEL, lineWidth: 8})], {x: 640, y: 850, from: t0, keys: sample(t => ({s: mix(0.5, 2, (t - t0) / 0.4), alpha: 1 - (t - t0) / 0.4}), t0, Math.min(d, t0 + 0.4))})),
], d, t => ({s: mix(1.0, 1.08, t / d)}), 640, 1200), G([paso(5)], {x: 640, y: 440, keys: sample(t => ({s: mix(1.6, 1, eOut(t / 0.15))}), 0, d)}), tag('JUNIO DE 1944', 580, 52, {t0: 0.3, tilt: 2}), plantilla(27, 0.75, d, {n0: 3, x: 880, y: 790, s: 1.35})]);
// 37.50–39.10 · «Normandía es un señuelo.» — mapa del Canal: «SEÑUELO» en Normandía y una flecha gorda a Calais.
shot(37.50, 39.10, d => [camF([...mapa({labels: ['INGLATERRA'], cities: ['londres', 'calais']}), ctext('FRANCIA', 830, 1110, 50, {maxW: 300, color: '#5a4632'}),
  E(PT.normandia[0], PT.normandia[1], 30, 30, {fill: RED, stroke: PAPER, lineWidth: 5}),
  G([sign('SEÑUELO', 0, 0, 280, 90, {size: 46, fill: PAPER, color: RED})], {x: 600, y: 1000, angle: deg(-6), from: 0.1}),
  G([sign('¡AQUÍ!', 0, 0, 180, 80, {size: 44, fill: YEL})], {x: 845, y: 870, angle: deg(6), from: 0.8, keys: sample(t => ({s: mix(1.6, 1, eOut((t - 0.8) / 0.15))}), 0.8, d)}),
  ...anim(d, t => ruta([[PT.normandia[0] + 20, PT.normandia[1] - 10], [PT.calais[0] - 15, PT.calais[1] + 12]], Math.min(1, Math.max(0.01, (t - 0.8) / 0.3)), {w: 16})).filter(g => g.from >= 0.8),
], d, t => mapCam(790, 880, mix(1.5, 1.6, t / d)))]);
// 39.10–41.65 · «Veintiuna divisiones, esperando en Calais.» — soldados sentados en la playa; el calendario pasa de junio a agosto; 21.
const MES = ['JUNIO', 'JULIO', 'AGOSTO'];
shot(39.10, 41.65, d => [camF([...calais(d),
  ...[[180, 1700, 1], [420, 1760, 2], [660, 1700, 1], [900, 1770, 2], [300, 1500, 2], [560, 1480, 1], [800, 1500, 2]].map(([x, y, n], i) =>
    soldadoDe(n, {x, y, scale: i < 4 ? 0.8 : 0.6, expr: i % 3 ? 'cansado' : 'agobiado', look: i % 2 ? 1 : -1, idle: {dur: d}, headKeys: keysIn(d, [{t: 0, angle: 0}, {t: r3(0.3 + i * 0.13), angle: deg(i % 2 ? 9 : -9)}, {t: r3(1.2 + i * 0.1), angle: deg(i % 2 ? -5 : 5)}, {t: d, angle: deg(i % 2 ? -5 : 5)}])})),
  ...MES.map((m, k) => G([calendario(m)], {x: 960, y: 640, from: r3(k * 0.75), ...(k < 2 ? {to: r3((k + 1) * 0.75)} : {}), keys: sample(t => ({s: mix(1.3, 0.8, eOut((t - k * 0.75) / 0.15))}), r3(k * 0.75), k < 2 ? r3((k + 1) * 0.75) : d)})),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1200), slam('21', 300, 560, 220, 0.15, d, {outline: true, color: RED, tilt: -8, stamp: true, from: 1.3}), becCam(1.4, d, 'cansado', {x: 930, y: 960, look: -1, s: 0.8}), tag('CALAIS, 1944', 420, 54, {t0: 0.05, tilt: 2})]);
// 41.65–44.30 · «Premio: Cruz de Hierro nazi y medalla inglesa.» — Garbo con las dos medallas que aparecen en el pecho.
const HOPS = [0.6, 1.65], hopY = t => HOPS.reduce((y, h) => y + (t < h || t > h + 0.24 ? 0 : t < h + 0.1 ? 55 * (t - h) / 0.1 : 55 * (1 - (t - h - 0.1) / 0.14)), 0) * 1.0;
const MED = (prop, x, t0) => G([prop()], {x, y: 1290, from: t0, keys: sample(t => ({s: mix(2.4, 0.95, eOut((t - t0) / 0.15)), y: 1290 - hopY(t)}), t0, 2.6)});
shot(41.65, 44.30, d => [camF([...rays(d, '#ffd21f', '#ffe36b', 640, 1000, 14, 14),
  pujol({x: 640, y: 1760, scale: 1.3, expr: 'contento', look: 0, idle: {dur: d}, armL: {shoulder: 150, elbow: 20}, armR: {shoulder: 150, elbow: 20}, move: hop(d, 640, 1760, HOPS, 55)}),

  MED(cruzHierro, 545, 0.65), MED(medallaMBE, 735, 1.7),
], d, t => ({s: mix(1.0, 1.06, t / d), ...shake(t, 0.65, 0.15, 10), ...shake(t, 1.7, 0.15, 10)}), 640, 1150),
  G([tag('ALEMANIA', 420, 50, {t0: 0.65, tilt: -3})], {x: -180}), G([tag('REINO UNIDO', 420, 50, {t0: 1.7, tilt: 3})], {x: 180})]);
// 44.30–45.85 · «Unos, por creérsela.» — el oficial abraza el informe de Garbo, feliz.
shot(44.30, 45.85, d => [camF([...despacho(d, {color: DE}),
  oficialDe({x: 640, y: 1740, scale: 1.3, expr: 'contento', look: 0, idle: {dur: d}, armL: {shoulder: 50, elbow: 110}, armR: {shoulder: 50, elbow: 110}, headKeys: laugh(d, 0.1, 1.4, 6, 0.35)}),
  G([R(-110, -140, 220, 280, {radius: 6, fill: PAPER, lineWidth: 8}), ctext('INFORME', 0, -124, 34, {maxW: 200}), ctext('GARBO', 0, -70, 44, {maxW: 200, color: RED})], {x: 640, y: 1220, angle: deg(-6)}),
  ...[0.2, 0.5, 0.8].map(t0 => G([S([['M', 0, 0], ['Q', -30, -30, 0, -50], ['Q', 30, -30, 0, 0], ['Z']], '#e0263a', {lineWidth: 5})], {x: 640 + (t0 * 600 - 300), y: 760, from: t0, keys: sample(t => ({y: mix(760, 600, (t - t0) / 0.6), alpha: 1 - (t - t0) / 0.6}), t0, Math.min(d, t0 + 0.6))})),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1100)]);
// 45.85–47.33 · «Otros, por inventarla.» — el inglés y Garbo, a la máquina de escribir, se ríen.
shot(45.85, 47.33, d => [camF([...despacho(d, {color: UK}),
  ingles({x: 340, y: 1740, scale: 1.05, expr: 'picaro', look: 1, idle: {dur: d}, headKeys: laugh(d, 0.3, 1.4, 6, 0.14)}),
  pujol({x: 940, y: 1740, scale: 1.05, expr: 'picaro', look: -1, idle: {dur: d}, headKeys: laugh(d, 0.35, 1.4, 6, 0.15), gestures: [{t0: 0.4, t1: 1.3, arm: 'R', shoulder: 60, elbow: 60}]}),
  G([maquina({}, 'INFORME DE GARBO')], {x: 640, y: 1170, scaleX: 0.75, scaleY: 0.75}),
], d, t => ({s: mix(1.0, 1.06, t / d), ...shake(t, 0.4, 0.5, 6)}), 640, 1100)]);
// 47.33–48.60 · «Expediente cerrado.» — sello CERRADO.
shot(47.33, 48.60, d => [cam([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(47.33, 48.60), headKeys: nod(d, [1.0], 8)}),
  G([caseFolder({x: 0, y: 0, scale: 1, label: 'EXPEDIENTE 005'})], {x: 800, y: 1010, scaleX: 0.74, scaleY: 0.74, angle: deg(-3)}),
], d, 1.1, 1.18, 800, 1000), slam('CERRADO', 700, 1050, 110, 1.0, d, {outline: true, color: RED, tilt: -10, stamp: true, from: 1.25})]);
// 48.60–50.84 · «Pagaban a espías que no existían.» — el Becario ante el tablón: todas las fichas FALSO con su saco.
shot(48.60, 50.84, d => [camF([...spyRoom(d), ...tablon(d, {bags: () => 0, stamps: () => 0}),
  becario({x: 640, y: 1760, scale: 1.2, expr: 'sarcastico', look: 0, idle: {dur: d}, talk: mouth(48.60, 50.84), armR: {shoulder: 120, elbow: 20}}),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1000)]);
// 50.84–LOOP · «Yo existo. [beat] Y nada.» — su ficha «BECARIO · EXISTE» sin saco; contador DÍAS SIN COBRAR; la cámara vuelve al tablón (bucle).
const LOOP = VOICE;
// Contador fijo (BIBLIA): N = 215 + días desde el 11-nov-2026 hasta la PUBLICACIÓN. Recalcular el día del render.
const PUB = '2026-11-18', DAYS = 215 + Math.round((Date.parse(PUB) - Date.parse('2026-11-11')) / 864e5);
const counter = (n, o = {}) => G([R(-210, -46, 420, 92, {radius: 10, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`DÍAS SIN COBRAR: ${n}`, 0, -30, 40, {maxW: 380, color: RED})], o);
const fichaBecario = o => G([R(-150, -380, 300, 400, {radius: 10, fill: '#fff6d6', lineWidth: 8}), R(-110, -340, 220, 220, {radius: 8, fill: '#c9d6e3', lineWidth: 6}),
  E(0, -230, 120, 110, {lineWidth: 6}), S([['M', -40, -282], ['L', -26, -312], ['L', -10, -286], ['L', 6, -318], ['L', 22, -286], ['L', 40, -300], ['L', 42, -276], ['Z']], INK, {lineWidth: 4}),
  E(-20, -236, 12, 16, {fill: INK, stroke: 'none'}), E(20, -236, 12, 16, {fill: INK, stroke: 'none'}),
  ctext('BECARIO', 0, -100, 44, {maxW: 260}), G([R(-110, -30, 220, 60, {radius: 8, fill: 'none', stroke: '#2e8b4a', lineWidth: 8}), ctext('EXISTE', 0, -22, 44, {maxW: 200, color: '#2e8b4a'})], {y: -10, angle: deg(-8)})], o);
shot0(T(50.84), LOOP, d => [camF([...office(d), desk(),
  becario({x: 330, y: GROUND + 40, scale: 1.15, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth0(T(50.84), LOOP), armR: {shoulder: 70, elbow: 120}, headKeys: [{t: 0, angle: 0}, {t: 0.3, angle: deg(-4)}, {t: 1.4, angle: deg(-4)}, {t: 1.7, angle: deg(10)}, {t: d, angle: deg(10)}]}),
  fichaBecario({x: 880, y: 1130, scaleX: 0.8, scaleY: 0.8}),
  counter(DAYS, {x: 640, y: 560, scaleX: 1.4, scaleY: 1.4, to: 1.25}), {...counter(DAYS + 1, {x: 640, y: 560}), from: 1.25, keys: sample(t => ({s: 1.4 * mix(1.35, 1, eBack((t - 1.25) / 0.2))}), 1.25, d)},
], d, t => ({s: mix(1.06, 1.14, t / d)}), 760, 1000)]);
// LOOP–END · Bucle: del despacho al tablón de la miniatura; termina EXACTAMENTE en el fotograma 1.
shot0(LOOP, END, d => [camF(hookSet(d, {bags: () => 0}), d, t => ({s: mix(1.6, 1.0, eOut(t / (d - 0.04)))}), 640, 1100), flash(0, 0.1, PAPER, 0.8), thumb(d, 0.12, r3(d - 0.16))]);

// Transiciones: barrido rápido en los cortes que cambian de escenario.
const SAME = new Set([1.10, 3.05, 4.95, 9.50, 18.62, 34.21, 37.50, 45.85, 50.84].map(T));
const whip = (dir, d) => G(Array.from({length: 9}, (_, i) => R(0, 120 + i * 230 + (i % 3) * 40, 900 + (i % 4) * 200, 34 + (i % 3) * 14, {radius: 17, fill: PAPER, stroke: 'none'})),
  {to: Math.min(d, 0.18), keys: sample(t => ({x: dir * mix(1400, -2400, t / 0.18), alpha: 0.75 * (1 - t / 0.18)}), 0, Math.min(d, 0.18))});
shots.forEach((sh, i) => { if (i && !SAME.has(sh.start)) sh.layers.push(whip(i % 2 ? 1 : -1, sh.end - sh.start)); });
// Subtítulos karaoke (captions.json = voz.py caps … --skip 0 --max 20; «005:» arreglado).
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const cap = captionTrack(WORDS, captions, {num: RED});
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos: solo en silencios medidos o muy bajos. Ganancia máx. 1; ambientes ≤ 0,2; whoosh ≤ 0,25.
const has = n => fs.existsSync(`sfx/${n}.wav`);
const sfx = [
  F(0.6, 'monedas', 0.15, 1.0),
  F(4.90, 'whoosh', 0.2),
  FX(8.98, 'portazo', 0.2, 0.4),
  FX(13.02, 'stamp', 0.35), FX(13.42, 'stamp', 0.3),
  FX(18.4, 'scratch', 0.3, 0.25),
  FX(25.55, 'stamp', 0.25),
  FX(29.75, 'stamp', 0.35),
  FX(33.9, 'puf', 0.35, 0.35),
  FX(36.15, 'morse', 0.06, 1.3),
  FX(41.35, 'crickets', 0.25, 0.3),
  FX(42.0, 'medalla', 0.3, 0.3),
  FX(48.3, 'stamp', 0.3),
  FX(50.62, 'crickets', 0.35, 0.45),
  FX(53.08, 'whoosh', 0.2),
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
console.log('shots', shots.length, 'end', END);
