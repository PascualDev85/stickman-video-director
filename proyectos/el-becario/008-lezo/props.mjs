// EXP 008 — objetos de «Lezo en Cartagena» (1741). Coordenadas locales: (0,0) = base/centro del objeto.
import {P, E, R, G, S, INK, PAPER, ctext, lezo, vernon} from '../kit.mjs';
import {sample, mix, eInOut, eOut, r3, fill, band, cloud, GROUND} from '../lib.mjs';
import {ukFlag} from '../006-guerra-cerdo/props.mjs';

const GOLD = '#e9c46a', WOOD2 = '#7d5229', SEA = '#5fa3cf';

/** Bandera de España (rojigualda) para el siglo XVIII, simplificada. */
export const esFlag = (o = {}, w = 100) => { const h = w * 0.66;
  return G([R(0, 0, w, h, {radius: 2, fill: '#f2c230', lineWidth: 6}), R(0, 0, w, h * 0.25, {radius: 0, fill: '#c8202a', stroke: 'none'}), R(0, h * 0.75, w, h * 0.25, {radius: 0, fill: '#c8202a', stroke: 'none'}), R(0, 0, w, h, {radius: 2, fill: 'none', lineWidth: 6})], o); };

/** Mar con cielo y olas suaves (se pinta detrás). */
export const mar = (d, {sky = '#cfe9f7', sea = SEA} = {}) => [fill(sky), cloud(300, 280, 0.8, d, 50), cloud(950, 380, 0.6, d, 60), band(980, 1400, sea), band(980, 14, '#3a7aa8'),
  ...[0, 1, 2, 3].map(i => P([['M', 80 + i * 300, 1070 + (i % 2) * 70], ['Q', 120 + i * 300, 1048 + (i % 2) * 70, 160 + i * 300, 1070 + (i % 2) * 70]], {stroke: '#9fd0ea', lineWidth: 8, keys: sample(t => ({x: Math.sin(t * 1.5 + i) * 20}), 0, d)}))];
/** Agua de primer plano: tapa el casco de los barcos que se hunden. */
export const agua = (y = 1060) => [band(y, 1400, SEA), band(y, 12, '#3a7aa8')];

/** Llamas que parpadean. */
export const llamas = (x, y, d, k = 1) => G([0, 1, 2, 3].map(i => G([S([['M', -34, 0], ['Q', -22, -80 - i * 12, 0, -128 - i * 16], ['Q', 24, -66, 34, 0], ['Z']], i % 2 ? '#ffb02e' : '#e8451f', {lineWidth: 6})],
  {x: -120 + i * 80, keys: sample(t => ({s: 1 + 0.28 * Math.sin(t * 14 + i * 2)}), 0, d)})), {x, y, scaleX: k, scaleY: k});

/** Barco de guerra con bandera 'es' o 'uk'. sink: {t0, len, depth, tilt} lo hunde; fire: true lo incendia. */
export const barcoX = ({x = 0, y = 0, scale = 1, flag = 'uk', dur = 3, flip = false, sink, fire, ...o} = {}) => {
  const fl = flag === 'es' ? esFlag({}, 100) : ukFlag({}, 100);
  const keys = sample(t => { const u = sink ? eInOut((t - sink.t0) / sink.len) : 0;
    return {y: Math.sin(t * 2.4) * 8 + u * (sink?.depth ?? 0), angle: Math.sin(t * 1.9) * 0.025 + u * (sink?.tilt ?? 0)}; }, 0, dur);
  return G([G([S([['M', -270, -70], ['L', 270, -70], ['L', 210, 40], ['L', -210, 40], ['Z']], '#3a2a1e', {lineWidth: 9}), R(-250, -48, 500, 16, {radius: 0, fill: GOLD, stroke: 'none'}),
    ...[-170, -80, 10, 100, 190].map(cx => E(cx, -10, 26, 26, {fill: INK, stroke: 'none'})),
    R(-8, -420, 16, 350, {radius: 4, fill: WOOD2, lineWidth: 7}), R(-168, -330, 14, 260, {radius: 4, fill: WOOD2, lineWidth: 7}), R(148, -330, 14, 260, {radius: 4, fill: WOOD2, lineWidth: 7}),
    S([['M', 8, -400], ['Q', 90, -300, 8, -110], ['Z']], PAPER, {lineWidth: 7}), S([['M', -160, -320], ['Q', -90, -250, -160, -120], ['Z']], PAPER, {lineWidth: 7}), S([['M', 156, -320], ['Q', 224, -250, 156, -120], ['Z']], PAPER, {lineWidth: 7}),
    G([fl], {x: 8, y: -450}), ...(fire ? [llamas(0, -60, dur, 1.3)] : [])], {keys})],
  {x, y, scaleX: flip ? -scale : scale, scaleY: scale, ...o});
};

/** Fuerte de piedra con almenas y bandera española. */
export const fuerte = (o = {}) => G([R(-260, -300, 520, 300, {radius: 4, fill: '#b8a98a', lineWidth: 9}),
  ...[-250, -165, -80, 5, 90, 175].map(px => R(px, -352, 66, 56, {radius: 2, fill: '#b8a98a', lineWidth: 8})),
  ...[-200, -40, 130].map(px => P([['M', px, -240], ['L', px + 60, -240]], {stroke: '#8c7d60', lineWidth: 6})), ...[-120, 60, 200].map(px => P([['M', px, -160], ['L', px + 50, -160]], {stroke: '#8c7d60', lineWidth: 6})),
  R(-70, -170, 140, 170, {radius: 70, fill: '#3a2a1e', lineWidth: 8}), R(-5, -560, 10, 210, {radius: 3, fill: WOOD2, lineWidth: 6}), G([esFlag({}, 110)], {x: 5, y: -556})], o);

/** Lápida con cruz. */
export const tumba = (o = {}) => G([S([['M', -50, 0], ['L', -50, -110], ['Q', 0, -170, 50, -110], ['L', 50, 0], ['Z']], '#b9bdc4', {lineWidth: 8}), P([['M', 0, -125], ['L', 0, -55]], {lineWidth: 8}), P([['M', -22, -102], ['L', 22, -102]], {lineWidth: 8})], o);

/** Medalla de Vernon (1741): Vernon de pie, Lezo de rodillas entregando la espada. Dibujada por nosotros. */
export const medalla = (o = {}) => G([E(0, 0, 560, 560, {fill: '#e0b84a', lineWidth: 12}), E(0, 0, 470, 470, {fill: '#f2cf6a', lineWidth: 6}),
  E(0, 150, 400, 40, {fill: '#d9a93a', stroke: 'none'}),
  E(-90, 160, 150, 26, {fill: '#c9962c', stroke: 'none'}), vernon({x: -90, y: 150, scale: 0.26, expr: 'contento'}), lezo({x: 120, y: 205, scale: 0.18, expr: 'miedo'}), E(120, 212, 150, 70, {fill: '#f2cf6a', stroke: 'none'}), E(120, 184, 100, 22, {fill: '#d9a93a', stroke: 'none'}),
  P([['M', 60, 70], ['L', -40, 40]], {stroke: '#8a8f98', lineWidth: 9}), E(70, 72, 20, 20, {fill: GOLD, lineWidth: 5})], o);

/** Hoja del plan de defensa con letra pequeña. */
export const plan = (o = {}) => G([R(-250, -330, 500, 660, {radius: 8, fill: '#fff6d6', lineWidth: 9}), ctext('PLAN DE DEFENSA', 0, -300, 46, {maxW: 440}),
  ...[-200, -150, -100, -50, 0].map(py => P([['M', -200, py], ['L', 200, py]], {stroke: '#9aa3ab', lineWidth: 6})),
  ctext('*Los ingleses pueden pasar', 0, 120, 24, {maxW: 440, color: '#5a5a5a'})], o);

/** Gotas de sudor/fiebre. */
export const sudor = (x, y, t0) => ({...E(x, y, 26, 40, {fill: '#9fd7ff', lineWidth: 5}), from: t0, keys: [{t: t0, alpha: 0, y}, {t: r3(t0 + 0.1), alpha: 1}, {t: r3(t0 + 0.8), alpha: 0, y: y + 80}]});

/** Camarote del barco: paredes de madera, ventana al mar y mesa con mapa. */
export const cabina = d => [fill('#7a5634'), ...[0, 1, 2, 3, 4, 5].map(i => P([['M', 40 + i * 240, -40], ['L', 40 + i * 240, 1500]], {stroke: '#5e4026', lineWidth: 6})),
  E(1000, 760, 300, 300, {fill: '#bfe3f7', lineWidth: 12}), P([['M', 1000, 610], ['L', 1000, 910]], {lineWidth: 8}), P([['M', 850, 760], ['L', 1150, 760]], {lineWidth: 8}),
  G([P([['M', 0, 0], ['L', 0, 90]], {lineWidth: 6}), R(-26, 90, 52, 70, {radius: 10, fill: '#ffd34d', lineWidth: 7})], {x: 340, y: 380, keys: sample(t => ({angle: Math.sin(t * 2) * 0.06}), 0, d), pivotX: 0, pivotY: 0}),
  band(GROUND + 80, 900, '#4a3220'), band(GROUND + 80, 10, '#2a1d14'),
  R(260, GROUND - 10, 760, 60, {radius: 6, fill: '#a8743f', lineWidth: 9}), R(330, GROUND - 38, 620, 34, {radius: 4, fill: '#f2e3bf', lineWidth: 6}), P([['M', 560, GROUND - 28], ['L', 640, GROUND - 12]], {stroke: '#c8202a', lineWidth: 8}), P([['M', 640, GROUND - 28], ['L', 560, GROUND - 12]], {stroke: '#c8202a', lineWidth: 8})];

/** Cartagena desde el mar: cielo, murallas, casas de colores y un fuerte. */
export const ciudad = (d, {sky = '#cfe9f7'} = {}) => [fill(sky), cloud(250, 300, 0.8, d, 50), cloud(980, 420, 0.6, d, 60), band(1010, 1400, SEA), band(1010, 14, '#3a7aa8'),
  ...[[60, 150, 230, '#e8b86a'], [220, 130, 300, '#d97b5a'], [360, 160, 250, '#8fc2a8'], [530, 140, 330, '#e8c9a0'], [680, 170, 240, '#d97b5a'], [860, 140, 300, '#e8b86a'], [1010, 160, 260, '#8fc2a8']].flatMap(([x, w, h, c]) =>
    [R(x, 1010 - h, w, h, {radius: 3, fill: c, lineWidth: 8}), S([['M', x - 10, 1010 - h], ['L', x + w / 2, 1010 - h - 70], ['L', x + w + 10, 1010 - h], ['Z']], '#9a3b2a', {lineWidth: 8}), R(x + w / 2 - 16, 1010 - h + 50, 32, 50, {radius: 4, fill: '#5a4a6a', lineWidth: 6})]),
  band(1010, 24, '#b8a98a'), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => R(i * 170 - 20, 990, 70, 36, {radius: 2, fill: '#b8a98a', lineWidth: 7}))];

/** Big Ben (Londres) para el plano de Inglaterra. */
export const bigBen = (o = {}) => G([R(-60, -420, 120, 420, {radius: 4, fill: '#d9b36a', lineWidth: 9}), E(0, -330, 90, 90, {fill: PAPER, lineWidth: 8}), P([['M', 0, -330], ['L', 0, -366]], {lineWidth: 7}), P([['M', 0, -330], ['L', 24, -320]], {lineWidth: 7}),
  S([['M', -74, -420], ['L', 0, -560], ['L', 74, -420], ['Z']], '#6b7a8a', {lineWidth: 9})], o);

/** Escalera de asalto (corta) apoyada. */
export const escalera = (o = {}, h = 250) => G([R(-34, -h, 12, h, {radius: 3, fill: WOOD2, lineWidth: 6}), R(22, -h, 12, h, {radius: 3, fill: WOOD2, lineWidth: 6}),
  ...Array.from({length: Math.floor(h / 50)}, (_, i) => P([['M', -28, -30 - i * 50], ['L', 28, -30 - i * 50]], {stroke: WOOD2, lineWidth: 8}))], o);

/** Grietas sobre la medalla. */
export const grietas = (o = {}) => G([P([['M', -20, -280], ['L', 10, -150], ['L', -40, -70], ['L', 20, 20], ['L', -10, 140], ['L', 40, 270]], {stroke: INK, lineWidth: 10}), P([['M', 10, -150], ['L', 120, -110]], {stroke: INK, lineWidth: 8}), P([['M', -40, -70], ['L', -150, -30]], {stroke: INK, lineWidth: 8})], o);

/** Trofeo fantasma (victoria imaginaria): translúcido y a trazos. */
export const trofeo = (o = {}) => G([S([['M', -70, -150], ['L', 70, -150], ['L', 60, -40], ['Q', 0, 10, -60, -40], ['Z']], GOLD, {lineWidth: 8}), R(-14, -30, 28, 70, {radius: 4, fill: GOLD, lineWidth: 7}), R(-60, 38, 120, 30, {radius: 6, fill: GOLD, lineWidth: 8}),
  P([['M', -70, -130], ['Q', -120, -110, -66, -60]], {lineWidth: 8}), P([['M', 70, -130], ['Q', 120, -110, 66, -60]], {lineWidth: 8})], {alpha: 0.55, ...o});

/** Lupa sobre la letra pequeña. */
export const lupa = (o = {}) => G([E(0, 0, 190, 190, {fill: 'rgba(200,230,255,0.45)', stroke: '#8a6a3a', lineWidth: 14}), P([['M', 66, 66], ['L', 150, 150]], {stroke: '#8a6a3a', lineWidth: 18})], o);


const clamp01 = v => Math.max(0, Math.min(1, v));

/** Mar con horizonte ajustable (hy): horizonte bajo = cielo grande para humo y cañonazos. */
export const mar2 = (d, {sky = '#cfe9f7', sea = SEA, hy = 1180} = {}) => [fill(sky), cloud(300, 280, 0.8, d, 50), cloud(950, 460, 0.6, d, 60), band(hy, 1400, sea), band(hy, 14, '#3a7aa8'),
  ...[0, 1, 2, 3].map(i => P([['M', 80 + i * 300, hy + 90 + (i % 2) * 70], ['Q', 120 + i * 300, hy + 68 + (i % 2) * 70, 160 + i * 300, hy + 90 + (i % 2) * 70]], {stroke: '#9fd0ea', lineWidth: 8, keys: sample(t => ({x: Math.sin(t * 1.5 + i) * 20}), 0, d)}))];

/** Bala de cañón en parábola de (x0,y0) a (x1,y1). */
export const bala = (x0, y0, x1, y1, t0, dur, d, alt = 320) => { const t1 = r3(Math.min(d, t0 + dur));
  return G([E(0, 0, 28, 28, {fill: INK, lineWidth: 5})], {x: x0, y: y0, from: r3(t0), to: t1, keys: sample(t => { const u = (t - t0) / dur; return {x: mix(x0, x1, u), y: mix(y0, y1, u) - alt * Math.sin(Math.PI * u)}; }, r3(t0), t1)}); };
/** Columna de agua al caer la bala. */
export const columna = (x, y, t0, d) => { const t1 = r3(Math.min(d, t0 + 0.7));
  return G([E(0, -60, 70, 150, {fill: PAPER, lineWidth: 6}), E(0, -150, 100, 70, {fill: PAPER, lineWidth: 6})], {x, y, from: r3(t0), to: t1, keys: sample(t => ({s: mix(0.2, 1.1, eOut((t - t0) / 0.3)), alpha: 1 - clamp01((t - t0 - 0.3) / 0.4)}), r3(t0), t1)}); };

/** Telón de teatro: dos hojas que se abren entre t0 y t0+len. */
export const cortina = (d, t0, len = 0.5) => { const folds = (x0) => [0, 1, 2, 3].map(i => P([['M', x0 + 80 + i * 150, -100], ['L', x0 + 80 + i * 150, 2300]], {stroke: '#6a1020', lineWidth: 10}));
  const k = sg => sample(t => ({x: sg * 700 * eInOut(clamp01((t - t0) / len))}), 0, d);
  return [G([R(-20, -100, 660, 2400, {radius: 0, fill: '#9e1b2d', lineWidth: 10}), ...folds(-20)], {keys: k(-1)}), G([R(640, -100, 660, 2400, {radius: 0, fill: '#9e1b2d', lineWidth: 10}), ...folds(640)], {keys: k(1)}),
    R(-40, 150, 1360, 110, {radius: 0, fill: '#d9a93a', lineWidth: 10})]; };
/** Foco de escenario (cono de luz). */
export const foco = () => S([['M', 520, -100], ['L', 760, -100], ['L', 1180, 1750], ['L', 100, 1750], ['Z']], 'rgba(255,240,170,0.20)', {stroke: 'none'});

/** Caja de medallas: la tapa sale volando en t0. */
export const caja = ({x = 0, y = 0, s = 1, t0 = 1, d = 2} = {}) => G([R(-170, -190, 340, 190, {radius: 6, fill: '#a8743f', lineWidth: 10}), ...[-90, 0, 90].map(px => P([['M', px, -188], ['L', px, -4]], {stroke: '#7d5229', lineWidth: 6})),
  R(-70, -140, 140, 70, {radius: 6, fill: '#f2e3bf', lineWidth: 6}), ctext('MEDALLAS', 0, -134, 26, {maxW: 124}),
  G([R(-182, -236, 364, 48, {radius: 6, fill: '#c18a4f', lineWidth: 10})], {keys: sample(t => { const u = clamp01((t - t0) / 0.55); return {y: -1000 * u * u, a: 70 * u}; }, 0, d)})], {x, y, scaleX: s, scaleY: s});

/** Chorro de medallas que salen disparadas desde (x, y) en t0. */
export const chorro = (x, y, t0, d, n = 14) => Array.from({length: n}, (_, i) => G([E(0, 0, 66, 66, {fill: '#f2cf6a', lineWidth: 7}), E(0, 0, 38, 38, {fill: '#d9a93a', stroke: 'none'})],
  {x, y, from: r3(t0), keys: sample(t => { const u = t - t0, vx = (i - (n - 1) / 2) * 90; return {x: x + vx * u, y: y - 900 * u + 900 * u * u, a: u * 360 * (i % 2 ? 1 : -1), alpha: 1 - clamp01((u - 0.8) / 0.5)}; }, r3(t0), d)}));

/** Confeti que cae. colors: paleta. */
export const confeti = (d, {n = 70, t0 = 0, colors = ['#e0261b', '#2f7fb5', '#f2c230', '#2e8b4a', '#ffffff'], speed = 1} = {}) => Array.from({length: n}, (_, i) => { const x0 = (i * 97) % 1280, sp = (420 + ((i * 53) % 260)) * speed, ph = i * 1.7, w = 16 + (i % 3) * 6;
  return G([R(-w / 2, -w / 4, w, w / 2, {radius: 2, fill: colors[i % colors.length], stroke: 'none'})], {from: r3(t0), keys: sample(t => { const u = t - t0; return {x: x0 + Math.sin(u * 3 + ph) * 60, y: -80 + u * sp, a: u * 240 + i * 20}; }, r3(t0), d)}); });

/** Destellos de brillo en las posiciones dadas [[x, y, t0], ...]. */
export const destellos = (pts, d) => pts.map(([x, y, t0, sc = 1]) => G([S([['M', 0, -46], ['L', 11, -11], ['L', 46, 0], ['L', 11, 11], ['L', 0, 46], ['L', -11, 11], ['L', -46, 0], ['L', -11, -11], ['Z']], '#fff6c8', {lineWidth: 4})],
  {x, y, from: r3(t0), to: r3(Math.min(d, t0 + 0.5)), keys: sample(t => ({s: sc * Math.sin(Math.PI * clamp01((t - t0) / 0.5)) * 1.1 + 0.02, a: (t - t0) * 120}), r3(t0), r3(Math.min(d, t0 + 0.5)))}));

/** Medalla que gira sobre sí misma (efecto moneda). */
export const medallaGira = (o = {}, d = 3, speed = 4) => G([medalla({})], {...o, keys: sample(t => ({sx: 0.12 + 0.88 * Math.abs(Math.cos(t * speed)), sy: 1}), 0, d)});

/** Montaña de medallas (acuñadas de antemano). */
export const pila = (o = {}) => G(Array.from({length: 7}, (_, r) => Array.from({length: 10 - r}, (_, c) => { const n = 10 - r, x = (c - (n - 1) / 2) * 112, y = -r * 72;
  return G([E(0, 0, 124, 124, {fill: (r + c) % 2 ? '#e0b84a' : '#f2cf6a', lineWidth: 7}), E(0, 0, 80, 80, {fill: 'none', stroke: '#c9962c', lineWidth: 5})], {x, y}); })).flat(), o);

/** Prensa que acuña medallas (pistón que golpea). */
export const prensa = (d, o = {}) => G([R(-120, -560, 240, 130, {radius: 8, fill: '#6b7a8a', lineWidth: 9}),
  G([R(-30, 0, 60, 300, {radius: 4, fill: '#8a8f98', lineWidth: 8}), R(-90, 270, 180, 44, {radius: 6, fill: '#5a6270', lineWidth: 8})], {keys: sample(t => ({y: -430 + 330 * Math.abs(Math.sin(t * 5.2))}), 0, d)}),
  R(-210, -20, 420, 56, {radius: 6, fill: '#3a3f4a', lineWidth: 8}), E(0, -40, 120, 120, {fill: '#f2cf6a', lineWidth: 7})], o);

export {mix};
