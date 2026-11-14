// EXPEDIENTE 004 — «La Guerra de los Pasteles» (Historias Sin Cabeza). Short 9:16, ~51 s.
// Guion v2 (protagonista: la pierna de Santa Anna). Voz: toma B ×1,04 con pausas recortadas (montaje.md).
// Cortes sobre los tiempos reales (Scribe) y los silencios medidos (voz.py silences). Estructura copiada de 003.
import fs from 'node:fs';
import {becario, santaAnna, remontel, oficialMx, soldadoUS, turba, orador, caseFolder, archiveBox, osc, P, E, R, G, S, deg, INK, PAPER, ctext, sign} from '../kit.mjs';
import {H, GROUND, RED, YEL, tag, clamp01, captionTrack, fill, band, lin, mix, r3, eOut, eInOut, eBack, shake, sample, camF, cam, slam, popIn, flash, rays, speedLines, cloud, vignette, office, desk, emptyWallet, makeEpisode, F, bubble} from '../lib.mjs';
import {pierna, piernaCorcho, pastel, pastelito, pasteleria, barco, smoke, canon, ataud, cojin, corona, caballo, carroza, antorcha, cartel, polloAsado, mesa, vitrina, rodillo, factura, sacoDinero, pala, atril, banderita, muleta, mar, muelle, MXG, FRB} from './props.mjs';

const {WORDS, shots, shot: shot0, mouth: mouth0} = makeEpisode('words.json');
// 14-nov: fuera «Expediente cero cero cuatro» (voz 3,12–4,92 s = 1,80 s; datos 001/002: −30 pts ahí). Los tiempos de abajo son los de antes
// y T() los desplaza: lo posterior a 4,0 adelanta 1,80 s.
const CUT = 4.0, CUTX = 1.80, T = t => (t > CUT + 1e-6 ? r3(t - CUTX) : t);
const shot = (a, b, f) => shot0(T(a), T(b), f), mouth = (a, b) => mouth0(T(a), T(b)), FX = (t, ...r) => F(T(t), ...r);
const VOICE = 50.827, END = 51.45; // VOICE = duración real de narration.mp3

// ---------- sets ----------
const SKY = '#9fd3f0', DUSK = '#f3b27a';
/** Calle de Tacubaya: fachadas de colores + suelo de tierra. */
const calle = (d, {horizon = 1500} = {}) => [fill(SKY), cloud(250, 300, 0.7, d, 40), cloud(1000, 420, 0.5, d, 60),
  ...[['#e6b34a', -60, 500], ['#d9776a', 420, 380], ['#8fbfa0', 780, 560]].map(([c, x, w]) => R(x, 520, w, horizon - 520, {radius: 0, fill: c, lineWidth: 10})),
  ...[[60, 700], [250, 700], [520, 760], [880, 700], [1080, 700]].map(([x, y]) => R(x, y, 120, 180, {radius: 6, fill: '#5a3a22', lineWidth: 8})),
  band(horizon, 900, '#c9a26a'), band(horizon, 16, '#a8824a')];
/** Puerto de Veracruz: cielo, mar, muelle. */
const puerto = (d, {sea = 1150, dock = 1560, fort = true} = {}) => [fill(SKY), cloud(300, 380, 0.8, d, 60), cloud(950, 520, 0.6, d, 40),
  ...(fort ? [G([R(-260, -220, 520, 220, {radius: 0, fill: '#c9b48a', lineWidth: 9}), ...[-220, -120, -20, 80, 180].map(x => R(x, -270, 60, 50, {radius: 0, fill: '#c9b48a', lineWidth: 8})), R(-60, -120, 120, 120, {radius: 50, fill: '#5a3a22', lineWidth: 8})], {x: 1060, y: sea, scaleX: 0.55, scaleY: 0.55})] : []),
  ...mar(sea, d), ...muelle(dock)];
/** Cementerio: hierba, cruces, montón de tierra. */
const cementerio = (d, {sky = '#c9d6e3'} = {}) => [fill(sky), cloud(300, 400, 0.8, d, 30), band(1350, 1000, '#7fae5a'), band(1350, 14, '#5f8f3e'),
  ...[[160, 1360, 0.8], [1120, 1380, 0.9], [980, 1300, 0.6]].map(([x, y, s]) => G([R(-16, -200, 32, 200, {radius: 4, fill: '#9aa3ab', lineWidth: 7}), R(-70, -160, 140, 32, {radius: 4, fill: '#9aa3ab', lineWidth: 7})], {x, y, scaleX: s, scaleY: s}))];
/** Sala de museo. */
const museo = () => [fill('#e8dcc8'), band(1500, 900, '#8a6a4a'), band(1500, 16, '#6b4a30'), R(200, 400, 260, 340, {radius: 4, fill: '#c8955a', lineWidth: 10}), R(230, 430, 200, 280, {radius: 2, fill: '#9fd3f0', lineWidth: 6}), R(820, 420, 280, 220, {radius: 4, fill: '#c8955a', lineWidth: 10}), R(850, 450, 220, 160, {radius: 2, fill: '#e9c46a', lineWidth: 6})];
/** Comedor de campaña (1847): lona + mantel que tapa las piernas. */
const campana = () => [fill('#d9c9a3'), S([['M', -60, 300], ['L', 640, 120], ['L', 1340, 300], ['L', 1340, 1500], ['L', -60, 1500], ['Z']], '#e8dcb8', {lineWidth: 10}), P([['M', 640, 120], ['L', 640, 1500]], {stroke: '#c9b48a', lineWidth: 8}), band(1500, 900, '#b89a62')];
const mantel = (x, y, w = 760) => [R(x - w / 2, y, w, 330, {radius: 6, fill: PAPER, lineWidth: 9}), ...Array.from({length: Math.floor(w / 80)}, (_, i) => R(x - w / 2 + 10 + i * 80, y + 10, 40, 310, {radius: 0, fill: 'rgba(224,38,27,0.18)', stroke: 'none'}))];

// ---------- miniatura (= fotograma 1 y último) ----------
// Santa Anna grande a la izquierda (pata de palo + muleta) mirando con rabia un pastel con vela a la derecha.
const SA = {x: 880, y: 1730, s: 1.62}, CK = {x: 300, y: 1500};
const hookSet = (d, {angry = false, point = false} = {}) => [fill('#f6d27a'), ...rays(d, '#f6d27a', '#fbe3a0', 400, 1100, 6, 14).slice(1),
  band(1700, 700, '#c9a26a'), band(1700, 14, '#a8824a'),
  mesa({x: CK.x, y: 1810}, 460), ...mantel(CK.x, 1510, 480),
  pastel({x: CK.x, y: CK.y, scaleX: 1.0, scaleY: 1.0}, {flame: d}),
  muleta({x: SA.x + 215, y: SA.y - 690, scaleX: SA.s, scaleY: SA.s, angle: deg(-4)}),
  santaAnna({x: SA.x, y: SA.y, scale: SA.s, expr: 'serio', look: -1, peg: 'R', idle: {dur: d}, armL: point ? {shoulder: 95, elbow: 0} : {shoulder: 20, elbow: 40}, armR: {shoulder: 20, elbow: 40},
    headKeys: angry ? osc(d, 0.16, 3) : undefined}),
];
const thumb = (d, fade = 0, t0 = 0) => {
  const line = (text, y, size, color) => ({...ctext(text, 640, y, size, {maxW: 560, color}), outline: INK, outlineWidth: 16});
  const body = G([G([tag('HISTORIA REAL · 1838', 560, 42, {pop: false, color: RED, tilt: -2})], {x: -300}),
    G([line('LA GUERRA', 680, 96, PAPER), line('DE LOS', 790, 96, PAPER), line('PASTELES', 910, 112, YEL)], {x: -320, angle: deg(-4)})]);
  return fade ? G([body], {from: t0, keys: sample(t => ({alpha: (t - t0) / fade}), t0, Math.min(d, t0 + fade))}) : body;
};

// ================= SHOTS =================
// 0–1.15 · «Santa Anna perdió una» — miniatura; la llama tiembla y la cabeza tiembla de rabia desde el fotograma 1.
shot(0, 1.15, d => [camF(hookSet(d, {angry: true}), d, t => ({s: mix(1.0, 1.04, t / d)}), 640, 1300), G([thumb(d)], {to: 1.05})]);
// 1.15–2.31 · «pierna por culpa de unos» — la cámara baja a la pata de palo; etiqueta.
shot(1.15, 2.31, d => [camF(hookSet(d, {angry: true}), d, t => ({s: mix(1.0, 1.8, eInOut(t / 0.45)), y: mix(0, -620, eInOut(t / 0.45)), x: mix(0, -280, eInOut(t / 0.45))}), SA.x + 40, SA.y - 130),
  G([tag('LA PIERNA DERECHA', 380, 58, {t0: 0.35, tilt: 3})], {x: 0})]);
// 2.31–5.08(→3.28) · «pasteles.» — zoom al pastel; Santa Anna lo señala con la muleta: bocadillo «¡Tú!».
shot(2.31, 5.08, d => [camF(hookSet(d, {point: true}), d, t => ({s: mix(1.5, 1.6, t / d), ...shake(t, 0.05, 0.2, 10)}), CK.x + 120, CK.y - 200), bubble('¡TÚ!', 760, 560, 900, 760, 0.08, d, {size: 90})]);
// 5.08–7.95 · «Unos oficiales arrasan la pastelería de un francés.» — dos oficiales salen cargados de tartas; Remontel asoma con las manos en la cabeza.
const cakeHold = s => [G([pastel({scaleX: s, scaleY: s}, {candle: false})], {y: 210})];
shot(5.08, 7.95, d => [camF([...calle(d), pasteleria({x: 640, y: 1500, scaleX: 0.92, scaleY: 0.92}, {broken: true}),
  remontel({x: 890, y: 1500, scale: 0.75, expr: 'sorpresa', look: -1, idle: {dur: d}, from: 1.3, armL: {shoulder: 160, elbow: 150}, armR: {shoulder: 160, elbow: 150}, move: [{t: 1.3, y: 1850}, {t: 1.5, y: 1500}]}),
  oficialMx(1, {x: 300, y: 1640, scale: 0.9, expr: 'picaro', look: -1, walk: {dur: d, period: 0.4, stride: 22}, move: lin(d, 520, 120), armL: {shoulder: 70, elbow: 80, hold: cakeHold(0.62)}, armR: {shoulder: 70, elbow: 80}}),
  oficialMx(2, {x: 600, y: 1700, scale: 0.95, expr: 'contento', look: -1, walk: {dur: d, period: 0.42, stride: 22}, move: [{t: 0, x: 900}, {t: d, x: 440}], armR: {shoulder: 70, elbow: 80, hold: cakeHold(0.66)}, armL: {shoulder: 70, elbow: 80}}),
], d, t => ({s: mix(1.28, 1.36, t / d)}), 640, 1420), tag('TACUBAYA (MÉXICO)', 380, 58, {t0: 0.2, tilt: -2})]);
// 7.95–9.80 · «La tienda no valía ni mil pesos.» — Remontel junto a su tienda: etiqueta de precio colgando.
shot(7.95, 9.80, d => [camF([...calle(d), pasteleria({x: 560, y: 1500, scaleX: 0.92, scaleY: 0.92}),
  G([sign('< 1.000 $', 0, 0, 330, 120, {size: 64, fill: YEL})], {x: 340, y: 760, pivotX: 0, pivotY: -120, keys: osc(d, 1.1, 7)}), P([['M', 340, 640], ['L', 340, 700]], {lineWidth: 7}),
  remontel({x: 980, y: 1660, scale: 1.0, expr: 'contento', look: -1, idle: {dur: d}, armL: {shoulder: 60, elbow: 30}}),
], d, t => ({s: mix(1.06, 1.0, eOut(t / d))}), 640, 1300)]);
// 9.80–12.46 · «Pide… espera, que lo leo bien…» — el Becario con la reclamación; en «espera» se la acerca a la cara.
const ESP = 10.85 - 9.80;
const reclamacion = o => G([R(-130, -170, 260, 340, {radius: 6, fill: PAPER, lineWidth: 8}), ctext('RECLAMACIÓN', 0, -160, 30, {maxW: 230, color: RED}), ...[1, 2, 3, 4].map(i => P([['M', -90, -110 + i * 46], ['L', i === 4 ? 10 : 90, -110 + i * 46]], {stroke: '#9aa3ab', lineWidth: 6})), ctext('$ ? ? ?', 0, 90, 44, {maxW: 220})], o);
shot(9.80, 12.46, d => [camF([...office(d),
  becario({x: 560, y: 1680, scale: 1.3, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(9.80, 12.46), armL: {shoulder: 40, elbow: 100}, armR: {shoulder: 40, elbow: 100}, to: ESP}),
  becario({x: 560, y: 1680, scale: 1.3, expr: 'nervioso', look: 1, idle: {dur: d}, talk: mouth(9.80, 12.46), armL: {shoulder: 50, elbow: 110}, armR: {shoulder: 50, elbow: 110}, from: ESP, headKeys: [{t: ESP, angle: 0}, {t: ESP + 0.3, angle: deg(8)}, {t: d, angle: deg(8)}]}),
  reclamacion({x: 760, y: 1200, keys: sample(t => ({s: t < ESP ? 0.8 : mix(0.8, 1.05, eInOut((t - ESP) / 0.4)), x: t < ESP ? 760 : mix(760, 730, eInOut((t - ESP) / 0.4)), y: t < ESP ? 1200 : mix(1200, 1060, eInOut((t - ESP) / 0.4)), a: -6}), 0, d)}),
], d, t => ({s: t < ESP ? mix(1.0, 1.06, t / ESP) : mix(1.06, 1.3, eInOut((t - ESP) / (d - ESP)))}), 680, 1050)]);
// 12.46–13.49 · «sesenta mil.» — primer plano del Becario con los ojos fuera + slam 60.000 $.
shot(12.46, 13.49, d => [camF([...rays(d, '#ffd21f', '#ffe36b', 640, 1150, 14, 14), becario({x: 640, y: 2080, scale: 1.75, expr: 'sorpresa', idle: {dur: d}, talk: mouth(12.46, 13.49), armL: {shoulder: 165, elbow: 145}, armR: {shoulder: 165, elbow: 145}})], d,
  t => ({s: mix(1.0, 1.2, eOut(t / 0.18)), ...shake(t, 0.05, 0.4, 16)}), 640, 1000), flash(0.02, 0.12, PAPER, 0.8), slam('60.000 $', 640, 560, 170, 0.1, d, {outline: true, color: RED, tilt: -6, stamp: true, from: 1.2})]);
// 13.49–14.30 · «Francia le apoya.» — Remontel ondea una banderita francesa, encantado.
shot(13.49, 14.30, d => [camF([...calle(d), remontel({x: 640, y: 1690, scale: 1.25, expr: 'contento', look: 0, idle: {dur: d},
  poses: {R: [{t: 0, shoulder: 150, elbow: 20}, ...[0.2, 0.5, 0.8, 1.1].flatMap(t => [{t, shoulder: 165, elbow: 30}, {t: r3(t + 0.15), shoulder: 140, elbow: 10}])]}, armR: {hold: [banderita('fr', {y: 140, angle: deg(180)})]}})], d, t => ({s: mix(1.0, 1.05, t / d)}), 640, 1250)]);
// 14.30–15.71 · (silencio) + «Con barcos.» — en el silencio un buque de guerra francés entra en cuadro: ¡BUM! de presencia.
shot(14.30, 15.71, d => [camF([...puerto(d, {sea: 1050, dock: 2100, fort: false}),
  G([barco({}, {}), remontel({x: 330, y: -290, scale: 1.0, expr: 'serio', look: 1, idle: {dur: d}, armR: {shoulder: 150, elbow: 20, hold: [rodillo({y: 110, scaleX: 1.5, scaleY: 1.5, angle: deg(70)})]}, armL: {shoulder: 20, elbow: 40}})],
    {x: 640, y: 1500, scaleX: -0.95, scaleY: 0.95, keys: [{t: 0, x: 1900}, {t: 0.3, x: 700}, {t: d, x: 640}]}),
], d, t => ({s: mix(1.0, 1.05, t / d), ...shake(t, 0.3, 0.3, 18)}), 640, 1200)]);
// 15.71–17.88 · «Y ya puestos, pide seiscientos mil.» — la factura se desenrolla hasta el suelo; slam 600.000 $.
shot(15.71, 17.88, d => [camF([...calle(d), remontel({x: 330, y: 1620, scale: 0.95, expr: 'picaro', look: 1, idle: {dur: d}, armR: {shoulder: 110, elbow: 30}}),
  factura(720, 500, 0.1, 1.0, 1250, d, [ctext('PASTELES ........', 0, 80, 40, {maxW: 280}), ctext('DEUDAS ........', 0, 200, 40, {maxW: 280}), ctext('Y YA PUESTOS ...', 0, 320, 40, {maxW: 300, color: RED})]),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1100), slam('600.000 $', 680, 1450, 150, 1.1, d, {outline: true, color: RED, tilt: -6, stamp: true, from: 1.2})]);
// 17.88–19.61 · «Santa Anna defiende Veracruz…» — Santa Anna en el muelle, sable en alto; el barco al fondo.
const sable = [G([R(-6, 0, 12, 260, {radius: 4, fill: '#d6dde3', lineWidth: 5}), R(-34, -10, 68, 18, {radius: 6, fill: '#e9c46a', lineWidth: 5})], {y: 120})];
shot(17.88, 19.61, d => [camF([...puerto(d), barco({x: 300, y: 1170, scaleX: -0.35, scaleY: 0.35}, {sway: d}),
  santaAnna({x: 760, y: 1700, scale: 1.2, expr: 'serio', look: -1, idle: {dur: d}, armR: {shoulder: 165, elbow: 10, hold: sable}, armL: {shoulder: 30, elbow: 60}}),
], d, t => ({s: mix(1.08, 1.0, eOut(t / 0.6))}), 760, 1300), tag('VERACRUZ, 1838', 380, 62, {t0: 0.1, tilt: -2})]);
// 19.61–21.04 · «y un cañonazo le alcanza» — cañón del barco: fogonazo + humo + sacudida.
shot(19.61, 21.04, d => [camF([...puerto(d, {sea: 1300, dock: 2200, fort: false}), barco({x: 900, y: 1650, scaleX: 0.9, scaleY: 0.9}, {cannonsAt: [0.8, 0.88, 0.96]}),
  canon({x: 520, y: 1470, scaleX: 1.2, scaleY: 1.2}, {fireAt: 0.74}),
], d, t => ({s: mix(1.0, 1.06, t / d), ...shake(t, 0.74, 0.45, 22)}), 640, 1300), flash(0.74, 0.12, '#ffd9a0', 0.8)]);
// 21.04–21.60 · «la pierna.» — nube de humo en el muelle; el bicornio sale volando.
shot(21.04, 21.60, d => [camF([...puerto(d),
  santaAnna({x: 640, y: 1900, scale: 1.25, expr: 'sorpresa', look: 0, idle: {dur: d}, armL: {shoulder: 150, elbow: 30}, armR: {shoulder: 150, elbow: 30}, headKeys: osc(d, 0.08, 4)}),
  ...[0, 1, 2, 3, 4].map(i => ({...E(0, 0, 420 - i * 30, 300 - i * 20, {fill: i % 2 ? '#e6e6e6' : '#d0d0d0', lineWidth: 9}), keys: sample(t => ({x: 380 + i * 130 + Math.sin(t * 6 + i) * 20, y: 1560 - (i % 2) * 90 - t * 60, s: 1 + t * 0.4}), 0, d)})),
  ...[0, 1].map(i => E(560 + i * 160, 960 - i * 10, 40, 28, {fill: '#5a5a5a', stroke: 'none'})),
], d, t => ({s: mix(1.1, 1.18, t / d), ...shake(t, 0, 0.3, 14)}), 640, 1250)]);
// 21.60–22.45 · «Se la amputan.» — el Becario se tapa los ojos (no se ve nada).
shot(21.60, 22.45, d => [camF([...office(d), becario({x: 640, y: 1760, scale: 1.45, expr: 'miedo', idle: {dur: d}, talk: mouth(21.60, 22.45), armL: {shoulder: 150, elbow: -150}, armR: {shoulder: 150, elbow: -150}}),
  ...[-1, 1].map(k => G([R(-75, -70, 150, 140, {radius: 46, lineWidth: 9}), ...[-36, 0, 36].map(x => P([['M', x, -66], ['L', x, 10]], {stroke: '#9a9a9a', lineWidth: 6})), E(k * 82, 30, 60, 40, {lineWidth: 8})], {x: 640 + k * 78, y: 900, angle: deg(k * 12)}))],
  d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1100)]);
// 22.45–24.34 · «México acaba aceptando pagar.» — un saco de dinero cruza la mesa hasta Remontel.
shot(22.45, 24.34, d => [camF([fill('#e8dcc8'), band(1500, 900, '#8a6a4a'), mesa({x: 640, y: 1760}, 1000),
  G([banderita('mx', {x: 0, y: 0, scaleX: 1.2, scaleY: 1.2})], {x: 130, y: 1000}), G([banderita('fr', {x: 0, y: 0, scaleX: 1.2, scaleY: 1.2})], {x: 1010, y: 1000}),
  remontel({x: 980, y: 1700, scale: 0.9, expr: 'contento', look: -1, idle: {dur: d}, armL: {shoulder: 50, elbow: 60}, armR: {shoulder: 50, elbow: 60}}),
  sacoDinero({keys: sample(t => ({x: mix(260, 760, eInOut((t - 0.4) / 0.8)), y: 1460 - Math.sin(clamp01((t - 0.4) / 0.8) * Math.PI) * 160}), 0, d)}),
], d, t => ({s: mix(1.0, 1.05, t / d)}), 640, 1300), tag('PAZ: MARZO DE 1839', 380, 60, {t0: 0.15, tilt: 2})]);
// 24.34–25.93 · «Pero lo raro empieza ahora.» — re-gancho: el Becario se acerca a cámara y baja la voz (viñeta).
shot(24.34, 25.93, d => [camF([...office(d), becario({x: 640, y: 2150, scale: 1.9, expr: 'picaro', look: 0, idle: {dur: d}, talk: mouth(24.34, 25.93)})], d, t => ({s: mix(1.0, 1.25, eInOut(t / d))}), 640, 1000), vignette(0.5)]);
// 25.93–28.07 · «La entierra con honores militares.» — funeral: ataúd con bandera, dos oficiales saludan, Santa Anna llora con muleta.
const salute = {R: [{t: 0, shoulder: 8, elbow: 0}, {t: 0.3, shoulder: 8, elbow: 0}, {t: 0.5, shoulder: 150, elbow: 125}]};
const funeral = (d, {cry = true, sa = true} = {}) => [...cementerio(d), E(640, 1560, 760, 120, {fill: '#6b4a30', stroke: 'none'}),
  ...(sa ? [oficialMx(1, {x: 130, y: 1560, scale: 0.8, expr: 'serio', look: 1, idle: {dur: d}, poses: salute}), oficialMx(2, {x: 390, y: 1540, scale: 0.78, expr: 'serio', look: 1, idle: {dur: d}, poses: salute})] : []),
  ataud({x: 560, y: 1600, scaleX: 1.15, scaleY: 1.15}),
  ...(sa ? [santaAnna({x: 1040, y: 1740, scale: 0.85, expr: cry ? 'agobiado' : 'contento', look: -1, peg: 'R', idle: {dur: d}, armL: {shoulder: 20, elbow: 30}}), muleta({x: 1135, y: 1335, scaleX: 0.85, scaleY: 0.85}),
    ...(cry ? [0, 1, 2, 3].map(i => ({...S([['M', 0, -26], ['Q', 18, 0, 0, 12], ['Q', -18, 0, 0, -26], ['Z']], '#7fc4f0', {lineWidth: 5}), keys: sample(t => { const u = ((t + i * 0.35) % 1.4); return {x: 1040 + (i % 2 ? 48 : -48) * 0.85, y: 1740 - 600 * 0.85 + u * 260, alpha: u < 1.1 ? 1 : 0}; }, 0, d)})) : [])] : [])];
shot(25.93, 28.07, d => [camF(funeral(d), d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1400), tag('CON HONORES MILITARES', 380, 58, {t0: 0.9, tilt: -2})]);
// 28.07–28.90 · «A la pierna.» — primer plano seco de la bota que asoma del ataúd.
shot(28.07, 28.90, d => [camF(funeral(d, {sa: false}), d, t => ({s: mix(2.3, 2.5, t / d), x: -280, y: -250}), 850, 1330), flash(0, 0.1, PAPER, 0.5)]);
// 28.90–31.69 · «Años después, la desentierra para un segundo funeral:» — tierra que vuela, el ataúd sube; Santa Anna feliz.
const DIG = [0.15, 0.55, 0.95, 1.35];
shot(28.90, 31.69, d => [camF([...cementerio(d, {sky: '#bfe0f5'}), S([['M', 380, 1560], ['Q', 640, 1300, 900, 1560], ['Z']], '#6b4a30', {lineWidth: 9}),
  ataud({x: 640, keys: [{t: 0, y: 1900}, {t: 1.5, y: 1900}, {t: 1.9, y: 1560}]}, {peek: true}),
  ...DIG.flatMap(t => [0, 1, 2].map(i => ({...E(0, 0, 50, 40, {fill: '#6b4a30', lineWidth: 5}), from: r3(t), keys: sample(u => ({x: 520 - (u - t) * (300 + i * 150), y: 1450 - (u - t) * 900 + (u - t) ** 2 * 2200, alpha: u - t < 0.6 ? 1 : 0}), r3(t), Math.min(d, r3(t + 0.62)))}))),
  G([pala()], {x: 560, y: 1400, pivotX: 0, pivotY: -300, keys: DIG.flatMap(t => [{t: r3(t - 0.1), angle: deg(20)}, {t: r3(t + 0.1), angle: deg(-35)}]).filter(k => k.t >= 0)}),
  santaAnna({x: 980, y: 1720, scale: 0.95, expr: 'contento', look: -1, peg: 'R', idle: {dur: d}, armL: {shoulder: 30, elbow: 40}}), muleta({x: 1080, y: 1270, scaleX: 0.95, scaleY: 0.95}),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1350), tag('1842: SEGUNDO FUNERAL', 380, 58, {t0: 0.2, tilt: 2})]);
// 31.69–32.42 · «carroza,» — carroza fúnebre con caballo cruzando la calle.
shot(31.69, 32.42, d => [camF([...calle(d, {horizon: 1520}), G([caballo({x: 520, y: 0}, {trot: d}), carroza({x: 0, y: 0}, {roll: d})], {y: 1680, scaleX: 0.95, scaleY: 0.95, keys: lin(d, -150, 420)})], d, t => ({s: 1.0}), 640, 1300), speedLines(0, d, PAPER, 640, 1300)]);
// 32.42–33.12 · «desfile,» — soldados desfilando con banderas mexicanas.
shot(32.42, 33.12, d => [camF([...calle(d, {horizon: 1520}), ...[0, 1, 2].map(i => oficialMx(1 + (i % 2), {x: 0, y: 1690 - (i % 2) * 40, scale: 0.85, expr: 'serio', look: 1, walk: {dur: d, period: 0.35, stride: 28}, move: lin(d, 120 + i * 380, 260 + i * 380), armR: {shoulder: 150, elbow: 10, hold: [banderita('mx', {y: 120, angle: deg(180)})]}}))],
  d, t => ({s: mix(1.32, 1.38, t / d)}), 640, 1380), ...[0, 1, 2, 3].map(i => ({...E(200 + i * 300, 260 + (i % 2) * 120, 26, 26, {fill: [RED, YEL, MXG, PAPER][i], lineWidth: 4}), keys: sample(t => ({y: 260 + (i % 2) * 120 + t * 600, a: t * 400}), 0, d)}))]);
// 33.12–34.13 · «discursos.» — un orador en el atril; la gente se seca las lágrimas.
shot(33.12, 34.13, d => [camF([...cementerio(d), orador({x: 520, y: 1680, scale: 1.05, expr: 'agobiado', look: 1, idle: {dur: d}, poses: {R: [{t: 0, shoulder: 60, elbow: 30}, {t: 0.3, shoulder: 140, elbow: 20}, {t: 0.6, shoulder: 100, elbow: 30}]}}), atril({x: 760, y: 1700, scaleX: 1.1, scaleY: 1.1})],
  d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1300), bubble('Querida pierna…', 390, 600, 520, 800, 0.08, d, {size: 64, maxW: 520})]);
// 34.13–35.02 · «Para una pierna.» — la pierna sobre un cojín de terciopelo, con foco.
shot(34.13, 35.02, d => [...rays(d, '#6b4f8a', '#8a6fb0', 640, 1200, 8, 12), E(640, 1250, 1000, 1000, {fill: 'rgba(255,240,200,0.35)', stroke: 'none'}), G([cojin()], {x: 640, y: 1500, scaleX: 1.6, scaleY: 1.6, keys: sample(t => ({s: mix(1.5, 1.65, t / d)}), 0, d)}), corona({x: 640, y: 720, scaleX: 0.75, scaleY: 0.75})]);
// 35.02–37.10 · «Hasta que una turba enfadada con él…» — multitud con antorchas y carteles.
const crowd = (d, {carry = false, dx = 0} = {}) => [0, 1, 2, 3, 4].map(i => turba(1 + (i % 3), {x: 0, y: 1700 + (i % 2) * 40, scale: 0.85, expr: 'serio', look: 1,
  ...(carry ? {walk: {dur: d, period: 0.4, stride: 20}, move: lin(d, -100 + i * 260, -100 + i * 260 + dx)} : {idle: {dur: d}, move: [{t: 0, x: 50 + i * 215}]}),
  poses: {R: (carry ? [{t: 0, shoulder: 165, elbow: 0}] : [0, 0.4, 0.8, 1.2, 1.6].map((t, j) => ({t: r3(t + i * 0.07), shoulder: j % 2 ? 150 : 170, elbow: j % 2 ? 30 : 0})))},
  armR: {hold: carry ? [] : [(i !== 1 && i !== 2) ? antorcha({y: 120, angle: deg(180)}, d) : cartel(i === 1 ? '¡FUERA!' : '¡ABAJO!', {y: 140, angle: deg(180)})]}}));
shot(35.02, 37.10, d => [camF([...calle(d, {horizon: 1520}), ...crowd(d)], d, t => ({s: mix(1.3, 1.38, t / d), ...shake(t, 0.9, 0.3, 6)}), 640, 1350)]);
// 37.10–39.62 · «la desentierra otra vez y la pasea por la calle.» — la pierna cruza en volandas sobre la turba.
shot(37.10, 39.62, d => [camF([...calle(d, {horizon: 1520}), ...crowd(d, {carry: true, dx: 380}),
  G([pierna()], {keys: sample(t => ({x: mix(200, 900, t / d), y: 900 + Math.sin(t * 9) * 30, a: -90 + Math.sin(t * 7) * 10}), 0, d), scaleX: 1.1, scaleY: 1.1}),
], d, t => ({s: 1.28, x: mix(0, -120, t / d)}), 640, 1300)]);
// 39.62–40.53 · «¿Y la de corcho?» — el Becario saca de la caja del Archivo una foto de la pierna de corcho.
const foto = o => G([R(-200, -260, 400, 520, {radius: 6, fill: PAPER, lineWidth: 9}), R(-170, -230, 340, 400, {radius: 2, fill: '#e8dcc8', lineWidth: 6}), G([piernaCorcho()], {y: -30, scaleX: 0.8, scaleY: 0.8})], o);
shot(39.62, 40.53, d => [camF([...office(d), desk(), archiveBox({x: 900, y: 1150, scale: 0.8, label: 'EXP. 004'}),
  becario({x: 420, y: GROUND - 20, scale: 1.05, expr: 'sarcastico', look: 1, idle: {dur: d}, talk: mouth(39.62, 40.53), armR: {shoulder: 70, elbow: 40}}),
  foto({keys: sample(t => ({x: mix(900, 700, eOut(t / 0.35)), y: mix(1150, 820, eOut(t / 0.35)), s: mix(0.3, 0.9, eOut(t / 0.35)), a: -4}), 0, d)}),
], d, t => ({s: mix(1.05, 1.12, t / d)}), 700, 1000)]);
// 40.53–42.30 · «Se la quitaron los estadounidenses,» — 1847: Santa Anna come; entran soldados de Illinois.
const CG = 1.2;
const comedor = (d, {flee = -1} = {}) => [...campana(),
  ...(flee < 0 ? [santaAnna({x: 660, y: 1600, scale: 0.95, expr: 'contento', look: -1, idle: {dur: d}, armR: {shoulder: 50, elbow: 90}})]
    : [santaAnna({x: 660, y: 1600, scale: 0.95, expr: 'sorpresa', look: -1, peg: 'R', idle: {dur: d}, armL: {shoulder: 150, elbow: 20}, armR: {shoulder: 150, elbow: 20}, move: sample(t => ({x: t < flee ? 660 : 660 + (t - flee) * 1500, y: 1600 - Math.abs(Math.sin((t - Math.max(flee, 0)) * 14)) * (t < flee ? 0 : 90)}), 0, d)})]),
  ...mantel(640, 1270, 820), mesa({x: 640, y: 1600}, 820), polloAsado({x: 700, y: 1260, scaleX: 0.9, scaleY: 0.9}),
  G([piernaCorcho()], {x: 960, y: 1450, angle: deg(14), scaleX: 0.8, scaleY: 0.8, ...(flee >= 0 ? {to: r3(flee + 0.3)} : {})})];
shot(40.53, 42.30, d => [camF([...comedor(d),
  soldadoUS(1, {x: 0, y: 1720, scale: 0.95, expr: 'serio', look: 1, walk: {dur: d, period: 0.4, stride: 24}, move: [{t: 0, x: -250}, {t: 0.5, x: 60}], from: 0}),
  soldadoUS(2, {x: 0, y: 1760, scale: 1.0, expr: 'contento', look: 1, walk: {dur: d, period: 0.4, stride: 24}, move: [{t: 0, x: -400}, {t: 0.65, x: 300}]}),
], d, t => ({s: mix(1.0, 1.05, t / d)}), 640, 1300), tag('CERRO GORDO, 1847', 380, 60, {t0: 0.1, tilt: -2})]);
// 42.30–43.90 · «dicen que mientras comía pollo.» — Santa Anna huye a saltitos; un soldado levanta la pierna de corcho; el pollo (con cabeza) mira.
shot(42.30, 43.90, d => [camF([...comedor(d, {flee: 0.15}),
  soldadoUS(2, {x: 300, y: 1760, scale: 1.0, expr: 'contento', look: 1, idle: {dur: d}, from: 0.4, armR: {shoulder: 165, elbow: 10, hold: [G([piernaCorcho()], {y: 300, angle: deg(180), scaleX: 0.7, scaleY: 0.7})]}}),
], d, t => ({s: t < 0.9 ? 1.0 : mix(1.0, 1.8, eInOut((t - 0.9) / 0.4))}), 620, 1200)]);
// 43.90–45.18 · «Y no la devuelven.» — vitrina de museo con candado (clic en el silencio previo).
shot(43.90, 45.18, d => [camF([...museo(), vitrina({x: 640, y: 1700, scaleX: 1.05, scaleY: 1.05}, [G([piernaCorcho()], {y: -560, scaleX: 0.9, scaleY: 0.9})]),
  G([sign('NO SE DEVUELVE', 0, 0, 440, 100, {size: 48, fill: PAPER, color: RED})], {x: 560, y: 1240, angle: deg(-4)})], d, t => ({s: mix(1.08, 1.0, eOut(t / 0.5))}), 640, 1300),
  tag('ILLINOIS (EE. UU.)', 380, 62, {t0: 0.05, tilt: 2})]);
// 45.18–46.33 · «Expediente cerrado.» — sello CERRADO.
const CL = 46.27 - 45.18;
shot(45.18, 46.33, d => [cam([...office(d), desk(),
  becario({x: 300, y: GROUND - 20, scale: 1.0, expr: 'serio', look: 1, idle: {dur: d}, talk: mouth(45.18, 46.33)}),
  G([caseFolder({x: 0, y: 0, scale: 1, label: 'EXPEDIENTE 004'})], {x: 800, y: 1010, scaleX: 0.74, scaleY: 0.74, angle: deg(-3)}),
], d, 1.1, 1.18, 800, 1000), slam('CERRADO', 700, 1050, 110, CL - 0.25, d, {outline: true, color: RED, tilt: -10, stamp: true, from: 1.25})]);
// 46.33–48.10 · «Esa pierna tuvo dos funerales.» — el Becario sostiene la foto de la pierna entre dos coronas; ×2.
const fotoPierna = o => G([R(-200, -260, 400, 520, {radius: 6, fill: PAPER, lineWidth: 9}), R(-170, -230, 340, 400, {radius: 2, fill: '#2b2440', lineWidth: 6}), G([pierna({}, {bow: true})], {y: -40, scaleX: 0.75, scaleY: 0.75})], o);
shot(46.33, 48.10, d => [camF([...office(d), corona({x: 250, y: 900, scaleX: 0.75, scaleY: 0.75}), corona({x: 1030, y: 900, scaleX: 0.75, scaleY: 0.75}),
  becario({x: 640, y: 1760, scale: 1.2, expr: 'sarcastico', look: 0, idle: {dur: d}, talk: mouth(46.33, 48.10), armL: {shoulder: 60, elbow: 90}, armR: {shoulder: 60, elbow: 90}}),
  fotoPierna({x: 640, y: 1230, scaleX: 0.8, scaleY: 0.8}),
], d, t => ({s: mix(1.0, 1.06, t / d)}), 640, 1100), slam('×2', 640, 520, 180, 1.18, d, {outline: true, color: RED, tilt: 8, stamp: true, from: 1.25})]);
// 48.10–LOOP · «[suspiro] Yo no he tenido ni una nómina.» — contador 221→222 + «NÓMINA DE NOVIEMBRE» → el pastel; al final la cámara entra en el pastelito de la mesa (enlaza con el inicio).
const LOOP = 50.95;
// Contador fijo (BIBLIA): N = 215 + días desde el 11-nov-2026 hasta la PUBLICACIÓN. Recalcular el día del render.
const PUB = '2026-11-16', DAYS = 215 + Math.round((Date.parse(PUB) - Date.parse('2026-11-11')) / 864e5);
const counter = (n, o = {}) => G([R(-210, -46, 420, 92, {radius: 10, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`DÍAS SIN COBRAR: ${n}`, 0, -30, 40, {maxW: 380, color: RED})], o);
shot(48.10, LOOP, d => [camF([...office(d), desk(),
  becario({x: 330, y: GROUND + 40, scale: 1.15, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(48.10, LOOP), armR: {shoulder: 60, elbow: 70}, headKeys: [{t: 0, angle: 0}, {t: 0.3, angle: deg(10)}, {t: 1.2, angle: deg(10)}, {t: 1.5, angle: deg(-3)}]}),
  counter(DAYS, {x: 560, y: 560, scaleX: 1.4, scaleY: 1.4, to: 0.95}), {...counter(DAYS + 1, {x: 560, y: 560}), from: 0.95, to: r3(d - 0.3), keys: sample(t => ({s: 1.4 * mix(1.35, 1, eBack((t - 0.95) / 0.2))}), 0.95, d)},
  G([tag('NÓMINA DE NOVIEMBRE', 0, 44, {t0: 1.62, tilt: -4, color: RED})], {x: 120, y: 860, to: r3(d - 0.3)}), G([P([['M', 840, 900], ['Q', 960, 920, 990, 1010]], {stroke: RED, lineWidth: 12}), S([['M', 1000, 1040], ['L', 960, 990], ['L', 1020, 990], ['Z']], RED, {lineWidth: 5})], {from: 1.75}),
  pastel({x: 1000, y: 1150, scaleX: 0.42, scaleY: 0.42}, {flame: d}),
], d, t => ({s: t < d - 0.3 ? mix(1.08, 1.16, t / d) : mix(1.16, 3.4, eInOut((t - d + 0.3) / 0.3))}), 1000, 1060)]);
// LOOP–END · Bucle: del pastelito al pastel grande del fotograma 1; termina EXACTAMENTE en la miniatura.
shot(LOOP, END, d => [camF(hookSet(d, {angry: true}), d, t => ({s: mix(2.4, 1.0, eOut(t / (d - 0.04))), y: mix(260, 0, eOut(t / (d - 0.04)))}), CK.x, CK.y - 200), flash(0, 0.1, PAPER, 0.8), thumb(d, 0.12, r3(d - 0.16))]);

// Transiciones: barrido rápido en los cortes que cambian de escenario.
const SAME = new Set([1.15, 2.31, 12.46, 21.04, 28.07, 32.42, 37.10, 42.30, 50.95].map(T));
const whip = (dir, d) => G(Array.from({length: 9}, (_, i) => R(0, 120 + i * 230 + (i % 3) * 40, 900 + (i % 4) * 200, 34 + (i % 3) * 14, {radius: 17, fill: PAPER, stroke: 'none'})),
  {to: Math.min(d, 0.18), keys: sample(t => ({x: dir * mix(1400, -2400, t / 0.18), alpha: 0.75 * (1 - t / 0.18)}), 0, Math.min(d, 0.18))});
shots.forEach((sh, i) => { if (i && !SAME.has(sh.start)) sh.layers.push(whip(i % 2 ? 1 : -1, sh.end - sh.start)); });
// Subtítulos karaoke (captions.json = voz.py caps … --skip 0 --max 20 + 2 arreglos a mano).
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const cap = captionTrack(WORDS, captions, {num: RED});
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos: solo en silencios medidos o muy bajos. Ganancia máx. 1; ambientes ≤ 0,2; whoosh ≤ 0,25. (sfx/ pendiente)
const has = n => fs.existsSync(`sfx/${n}.wav`);
const sfx = [
  FX(5.0, 'whoosh', 0.2), FX(7.9, 'whoosh', 0.15),
  FX(10.3, 'scratch', 0.4), FX(11.95, 'bum', 0.3, 0.25),
  FX(14.31, 'whoosh', 0.2), FX(14.56, 'bum', 0.5, 0.45),
  FX(20.35, 'canon', 0.22, 0.6),
  FX(22.3, 'whoosh', 0.15), FX(23.66, 'monedas', 0.35, 0.5),
  FX(27.72, 'corneta', 0.4, 0.36),
  FX(31.65, 'cascos', 0.45, 0.75),
    FX(35.0, 'crowd', 0.07, 2.0),
  FX(43.55, 'candado', 0.5, 0.3),
  FX(46.27, 'stamp', 0.3),
  FX(48.15, 'crickets', 0.7, 0.4),
  FX(50.92, 'whoosh', 0.2),
].filter(s => has(s.path.slice(4, -4)));
// Saneado: keys/from/to fuera del plano (humo, bandera, olas usan muestreos largos) se recortan al plano.
const clip = (n, sp) => { if (!n || typeof n !== 'object') return n;
  if (n.keys) { const k = n.keys.filter(x => x.t >= 0 && x.t <= sp + 1e-9); n.keys = k.length ? k : [{...n.keys[0], t: 0}]; }
  if (n.to !== undefined && n.to > sp) n.to = r3(sp);
  if (n.children) n.children = n.children.filter(c => !(c && c.from !== undefined && c.from >= sp)).map(c => clip(c, sp));
  return n; };
for (const s of shots) { const sp = r3(s.end - s.start); s.layers = s.layers.filter(l => !(l && l.from !== undefined && l.from >= sp)).map(l => clip(l, sp)); }
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: r3(END - VOICE)}, television: {enabled: false},
  ...(fs.existsSync('music-duck.wav') ? {music: {path: 'music-duck.wav', gain: 0.2}} : {}), burnCaptions: false, captions, shots, sfx}, null, 1));
console.log('shots', shots.length, 'end', END);
