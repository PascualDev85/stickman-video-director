// EXP 006 — objetos de «La Guerra del Cerdo». Coordenadas locales: (0,0) = base/centro del objeto.
import {P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';
import {sample, mix, eOut, r3} from '../lib.mjs';

const PINK = '#f4a6b8', PINK2 = '#e58aa0', RED = '#e0261b', NAVY = '#1f3a6e', GOLD = '#e9c46a', WOOD = '#a8743f', WOOD2 = '#7d5229';

/** Cerdo. Base en los pies. `dead`: patas arriba y ojos en X. `eat`: la cabeza cabecea comiendo. dur: duración del plano (para las keys). */
export const cerdo = ({x = 0, y = 0, scale = 1, flip = false, dead = false, eat = false, dur = 3, blink = true, ...o} = {}) => {
  const head = G([
    E(0, 0, 130, 118, {fill: PINK}),
    S([['M', -20, -52], ['L', -46, -104], ['L', 6, -66], ['Z']], PINK2, {lineWidth: 7}),
    E(62, 12, 56, 46, {fill: PINK2}), E(52, 12, 8, 14, {fill: INK, stroke: 'none'}), E(72, 12, 8, 14, {fill: INK, stroke: 'none'}),
    ...(dead ? [P([['M', 14, -22], ['L', 36, -2]], {lineWidth: 7}), P([['M', 36, -22], ['L', 14, -2]], {lineWidth: 7})]
      : [E(26, -14, 16, blink ? 22 : 22, {fill: INK, stroke: 'none'})]),
  ], eat ? {x: 150, y: -118, keys: sample(t => ({y: -118 + Math.abs(Math.sin(t * 9)) * 18, angle: Math.sin(t * 9) * 0.12}), 0, dur)} : {x: 150, y: -118});
  const legs = [-90, -40, 60, 110].map(lx => dead ? R(lx - 14, -110, 28, 112, {radius: 8, fill: PINK2, lineWidth: 8}) : R(lx - 14, -60, 28, 62, {radius: 8, fill: PINK2, lineWidth: 8})); // muerto: patas largas hacia arriba
  const body = [P([['M', -130, -128], ['Q', -176, -150, -160, -184], ['Q', -138, -190, -146, -160]], {stroke: PINK2, lineWidth: 9}), ...legs, E(0, -118, 290, 190, {fill: PINK}), head];
  const g = G(dead ? [G(body, {y: 0, angle: Math.PI, pivotX: 0, pivotY: -100})] : body, {x, y, scaleX: flip ? -scale : scale, scaleY: scale, ...o});
  return g;
};

/** Patata (marrón con ojos). */
export const patata = (o = {}) => G([E(0, 0, 70, 52, {fill: '#c79a5a', lineWidth: 6}), E(-12, -6, 8, 8, {fill: '#8a6a3a', stroke: 'none'}), E(14, 6, 8, 8, {fill: '#8a6a3a', stroke: 'none'})], o);
/** Huerto: surcos con matas de patata (n). */
export const huerto = (o = {}, n = 4) => G([R(-330, -40, 660, 90, {radius: 10, fill: '#7a5a3a', lineWidth: 8}),
  ...Array.from({length: n}, (_, i) => G([S([['M', -22, 0], ['Q', -34, -50, -8, -66], ['Q', 4, -34, 0, 0], ['Z']], '#4f9a4f', {lineWidth: 5}), S([['M', 6, 0], ['Q', 34, -44, 22, -64], ['Q', 0, -34, 6, 0], ['Z']], '#6fb86f', {lineWidth: 5}), patata({x: 0, y: 18, scaleX: 0.7, scaleY: 0.7})], {x: -230 + i * 150, y: -20}))], o);

/** Billete (valor visible): 10 $ o 100 $. */
export const billete = (v, o = {}) => G([R(-110, -60, 220, 120, {radius: 8, fill: '#bfe3b4', lineWidth: 8}), R(-92, -44, 184, 88, {radius: 6, fill: 'none', stroke: '#4f8a4f', lineWidth: 4}),
  E(0, 0, 70, 70, {fill: '#d6f0cc', stroke: '#4f8a4f', lineWidth: 4}), ctext(`${v} $`, 0, -26, 46, {maxW: 70, color: '#2b5a2b'}), ctext('$', -70, -20, 28, {maxW: 30, color: '#2b5a2b'}), ctext('$', 70, -20, 28, {maxW: 30, color: '#2b5a2b'})], o);

/** Bandera de EE. UU. (rayas + cantón) y británica (cruces). */
export const usFlag = (o = {}, w = 240) => { const h = w * 0.55;
  return G([R(0, 0, w, h, {radius: 2, fill: PAPER, lineWidth: 6}), ...[0, 2, 4, 6].map(i => R(0, i * h / 7, w, h / 7, {radius: 0, fill: RED, stroke: 'none'})), R(0, 0, w * 0.45, h * 4 / 7, {radius: 0, fill: NAVY, stroke: 'none'}),
    ...[0, 1, 2, 3].flatMap(r => [0, 1, 2].map(c => E(w * (0.07 + c * 0.15), h * (0.08 + r * 0.13), 8, 8, {fill: PAPER, stroke: 'none'}))), R(0, 0, w, h, {radius: 2, fill: 'none', lineWidth: 6})], o); };
export const ukFlag = (o = {}, w = 240) => { const h = w / 2;
  return G([R(0, 0, w, h, {radius: 2, fill: NAVY, lineWidth: 6}), P([['M', 0, 0], ['L', w, h]], {stroke: PAPER, lineWidth: 18}), P([['M', w, 0], ['L', 0, h]], {stroke: PAPER, lineWidth: 18}),
    P([['M', 0, 0], ['L', w, h]], {stroke: RED, lineWidth: 6}), P([['M', w, 0], ['L', 0, h]], {stroke: RED, lineWidth: 6}),
    R(w / 2 - 22, 0, 44, h, {radius: 0, fill: PAPER, stroke: 'none'}), R(0, h / 2 - 22, w, 44, {radius: 0, fill: PAPER, stroke: 'none'}),
    R(w / 2 - 12, 0, 24, h, {radius: 0, fill: RED, stroke: 'none'}), R(0, h / 2 - 12, w, 24, {radius: 0, fill: RED, stroke: 'none'}), R(0, 0, w, h, {radius: 2, fill: 'none', lineWidth: 6})], o); };
/** Asta con bandera ondeando (la bandera oscila). */
export const asta = (flag, {x = 0, y = 0, h = 520, dur = 3, o = {}} = {}) => G([R(-7, -h, 14, h, {radius: 6, fill: '#c9b48a', lineWidth: 6}),
  G([flag], {x: 7, y: -h + 8, keys: sample(t => ({angle: Math.sin(t * 6) * 0.05}), 0, dur)})], {x, y, ...o});

/** Rifle sencillo apuntando a la derecha (para ir en la mano). */
export const rifle = (o = {}) => G([R(-30, -10, 210, 22, {radius: 6, fill: '#6b6b72', lineWidth: 6}), S([['M', -90, 30], ['L', -30, -12], ['L', -10, 14], ['L', -60, 50], ['Z']], WOOD2, {lineWidth: 6})], o);
/** Bocanada de humo del disparo (crece y se desvanece en t0..t0+0.5). */
export const humo = (x, y, t0, d) => G([E(0, 0, 120, 90, {fill: '#e9e9ee'}), E(-50, -20, 80, 64, {fill: '#f4f4f8', stroke: 'none'}), E(46, -26, 90, 70, {fill: '#f4f4f8', stroke: 'none'})],
  {x, y, from: r3(t0), to: r3(Math.min(d, t0 + 0.7)), keys: sample(t => ({s: mix(0.3, 1.4, eOut((t - t0) / 0.5)), alpha: 1 - Math.max(0, (t - t0 - 0.25) / 0.45), y: y - (t - t0) * 60}), r3(t0), r3(Math.min(d, t0 + 0.7)))});

/** Esposas (dos aros unidos). */
export const esposas = (o = {}) => G([E(-40, 0, 64, 64, {fill: 'none', stroke: '#8a8f98', lineWidth: 12}), E(40, 0, 64, 64, {fill: 'none', stroke: '#8a8f98', lineWidth: 12}), P([['M', -10, 0], ['L', 10, 0]], {stroke: '#8a8f98', lineWidth: 10})], o);

/** Tienda de campaña con bandera. */
export const tienda = (c = '#e8dcc8', o = {}) => G([S([['M', -120, 0], ['L', 0, -170], ['L', 120, 0], ['Z']], c, {lineWidth: 8}), S([['M', -34, 0], ['L', 0, -76], ['L', 34, 0], ['Z']], '#3a2a1e', {lineWidth: 6})], o);

/** Cañón (apunta a la derecha; flip con scaleX negativo). */
export const canon = (o = {}) => G([R(-20, -66, 190, 46, {radius: 14, fill: '#4a4f58', lineWidth: 8}), E(0, -20, 100, 100, {fill: WOOD, lineWidth: 8}), E(0, -20, 26, 26, {fill: WOOD2, stroke: 'none'})], o);

/** Barco de guerra (casco, 2 palos con velas, bandera arriba; cañones en la borda). dur: para el balanceo. */
export const barco = ({x = 0, y = 0, scale = 1, flag = 'uk', dur = 3, flip = false, ...o} = {}) => G([
  G([S([['M', -270, -70], ['L', 270, -70], ['L', 210, 40], ['L', -210, 40], ['Z']], '#3a2a1e', {lineWidth: 9}), R(-250, -48, 500, 16, {radius: 0, fill: GOLD, stroke: 'none'}),
    ...[-170, -80, 10, 100, 190].map(cx => E(cx, -10, 26, 26, {fill: INK, stroke: 'none'})),
    R(-8, -420, 16, 350, {radius: 4, fill: WOOD2, lineWidth: 7}), R(-168, -330, 14, 260, {radius: 4, fill: WOOD2, lineWidth: 7}), R(148, -330, 14, 260, {radius: 4, fill: WOOD2, lineWidth: 7}),
    S([['M', 8, -400], ['Q', 90, -300, 8, -110], ['Z']], PAPER, {lineWidth: 7}), S([['M', -160, -320], ['Q', -90, -250, -160, -120], ['Z']], PAPER, {lineWidth: 7}), S([['M', 156, -320], ['Q', 224, -250, 156, -120], ['Z']], PAPER, {lineWidth: 7}),
    G([flag === 'uk' ? ukFlag({}, 100) : usFlag({}, 100)], {x: 8, y: -450})],
    {keys: sample(t => ({y: Math.sin(t * 2.4) * 8, angle: Math.sin(t * 1.9) * 0.025}), 0, dur)})], {x, y, scaleX: flip ? -scale : scale, scaleY: scale, ...o});

/** Lápida con el cerdo dibujado (sin texto) y flores. */
export const lapida = (o = {}) => G([S([['M', -110, 0], ['L', -110, -230], ['Q', 0, -330, 110, -230], ['L', 110, 0], ['Z']], '#b9bdc4', {lineWidth: 9}),
  E(0, -170, 100, 84, {fill: PINK, lineWidth: 6}), E(36, -164, 40, 32, {fill: PINK2, lineWidth: 5}), E(-20, -182, 10, 14, {fill: INK, stroke: 'none'}), S([['M', -30, -208], ['L', -44, -244], ['L', -8, -216], ['Z']], PINK2, {lineWidth: 5}),
  P([['M', -70, -80], ['L', 70, -80]], {stroke: '#7d818a', lineWidth: 7}), P([['M', -50, -56], ['L', 50, -56]], {stroke: '#7d818a', lineWidth: 7}),
  ...[-96, -70, 74, 100].map((fx, i) => G([E(0, -12, 26, 26, {fill: ['#e0261b', '#ffd21f', '#ffffff', '#e86aa0'][i], lineWidth: 5}), P([['M', 0, 0], ['L', 0, 30]], {stroke: '#4f9a4f', lineWidth: 6})], {x: fx, y: 4}))], o);

/** Documento con sello (el laudo del káiser). */
export const laudo = (o = {}) => G([R(-150, -190, 300, 380, {radius: 8, fill: '#fff6d6', lineWidth: 8}), ...[-110, -70, -30, 10].map(y => P([['M', -110, y], ['L', 110, y]], {stroke: '#9aa3ab', lineWidth: 6})),
  G([E(0, 0, 150, 150, {fill: 'none', stroke: NAVY, lineWidth: 10}), usFlag({x: -50, y: -28}, 100)], {x: 30, y: 110, angle: deg(-12)})], o);

/** Mapa de la zona (geografía real, simplificada): costa del Pacífico noroeste. Proyección propia: 250 px/° de latitud, cos 48,5° en longitud;
 *  centro (lon −123,6; lat 49,0) en (640, 1000). Contornos en (lon, lat). La isla de San Juan va exagerada (marcador). */
const K = 250, KX = K * Math.cos(48.5 * Math.PI / 180);
export const gx = (lon, lat) => [Math.round(640 + (lon + 123.6) * KX), Math.round(1000 + (49.0 - lat) * K)];
const poly = pts => pts.map(([lo, la], i) => [i ? 'L' : 'M', ...gx(lo, la)]).concat([['Z']]);
const VANC = [[-128.4, 50.8], [-127.4, 50.85], [-126.0, 50.4], [-125.2, 50.05], [-124.5, 49.6], [-123.95, 49.17], [-123.5, 48.65], [-123.4, 48.4], [-124.0, 48.35], [-124.6, 48.5], [-125.4, 48.9], [-126.1, 49.4], [-127.0, 49.85], [-127.9, 50.2]];
const MAIN = [[-126.2, 51.2], [-124.7, 50.8], [-124.0, 50.0], [-123.3, 49.5], [-123.1, 49.27], [-122.8, 49.0], [-122.5, 48.75], [-122.6, 48.4], [-122.35, 47.6], [-122.5, 47.3], [-122.85, 47.1], [-123.1, 47.3], [-122.95, 47.6], [-122.75, 48.1], [-123.45, 48.13], [-124.7, 48.38], [-124.65, 47.9], [-124.2, 47.0], [-124.1, 46.5], [-121.0, 46.5], [-121.0, 51.2]];
const ISL = [[-123.18, 48.58], [-123.05, 48.62], [-122.95, 48.5], [-123.0, 48.42], [-123.15, 48.45]];
export const SJ = gx(-123.07, 48.52);
export const PTM = {victoria: gx(-123.37, 48.43), vancouver: gx(-123.12, 49.28), seattle: gx(-122.33, 47.6)};
export const mapaNO = ({sea = '#a9d6ea', labels = true, flagUS = false} = {}) => [
  {type: 'rect', x: -60, y: -60, w: 1400, h: 2400, radius: 0, fill: sea, stroke: 'none'},
  S(poly(VANC), '#9ccf8a', {lineWidth: 8}), S(poly(MAIN), '#b6d99a', {lineWidth: 8}),
  P([[ 'M', ...gx(-123.1, 49.0)], ['L', ...gx(-122.75, 49.0)], ['L', ...gx(-121.0, 49.0)]], {stroke: INK, lineWidth: 12}),
  P([['M', ...gx(-123.1, 49.0)], ['L', ...gx(-126.0, 49.0)]], {stroke: 'rgba(21,21,21,0.45)', lineWidth: 9}),
  S(poly(ISL), '#7ab86a', {lineWidth: 7}),
  ...(labels ? [ctext('CANADÁ', 940, 700, 54, {maxW: 340, color: '#5a4632'}), ctext('EE. UU.', 880, 1260, 54, {maxW: 300, color: '#5a4632'}), ctext('ISLA DE VANCOUVER', 330, 1000, 38, {maxW: 360, color: '#5a4632'})] : []),
];
/** Encuadre del mapa: centra el punto (cx, cy) del mapa con escala s. */
export const mapCam = (cx, cy, s, Y = 1050) => ({s, x: -(cx - 640) * s, y: Y - 1000 - (cy - 1000) * s});
/** Pin de la isla con aro que late. */
export const pin = (dur, o = {}) => G([E(0, 0, 70, 70, {fill: 'none', stroke: RED, lineWidth: 9, keys: sample(t => ({s: 1 + 0.35 * Math.abs(Math.sin(t * 5))}), 0, dur)}), E(0, 0, 26, 26, {fill: RED, stroke: 'none'})], {x: SJ[0], y: SJ[1], ...o});

/** Las dos fronteras reclamadas (1846, tratado ambiguo): EE. UU. pedía el canal de Haro (al oeste de San Juan); R. U., el de Rosario (al este).
 *  upto 0..1: cuánto se ha dibujado cada línea (para animarla con keys a mano no vale: se muestrea con from/to por tramos). */
const HARO = [[-123.2, 48.98], [-123.25, 48.8], [-123.27, 48.62], [-123.25, 48.42], [-123.35, 48.28]];
const ROSARIO = [[-122.92, 48.98], [-122.82, 48.78], [-122.76, 48.6], [-122.78, 48.42], [-122.85, 48.27]];
const part = (pts, u) => { const n = pts.length - 1, k = Math.min(n, u * n), i = Math.floor(k), f = k - i; const out = pts.slice(0, i + 1);
  if (i < n) out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]); return out.map(([lo, la], j) => [j ? 'L' : 'M', ...gx(lo, la)]); };
export const reclamo = (cual, u = 1, o = {}) => P(part(cual === 'us' ? HARO : ROSARIO, u), {stroke: cual === 'us' ? NAVY : RED, lineWidth: 12, ...o});
export const PT49 = gx(-122.2, 49.0);

/** Oveja (Griffin llevaba la granja de ovejas de la Compañía). */
export const oveja = (o = {}) => G([...[-50, -10, 30, 60].map(lx => R(lx - 8, -50, 16, 52, {radius: 6, fill: INK, stroke: 'none'})),
  E(0, -90, 190, 110, {fill: PAPER}), E(-60, -120, 70, 60, {fill: PAPER}), E(40, -125, 80, 60, {fill: PAPER}), E(105, -105, 60, 70, {fill: '#3a3a44', lineWidth: 6}), E(115, -112, 10, 12, {fill: PAPER, stroke: 'none'})], o);

/** Catalejo (en la mano, apunta a la derecha). */
export const catalejo = (o = {}) => G([R(0, -16, 120, 32, {radius: 6, fill: '#c9a24a', lineWidth: 6}), R(110, -20, 70, 40, {radius: 6, fill: '#a8743f', lineWidth: 6}), R(170, -24, 30, 48, {radius: 6, fill: '#c9a24a', lineWidth: 6})], o);

/** Cartel de «SE BUSCA» con precio. who: 'cerdo' | 'becario'. price: texto («100 $») o '' (vacío). */
export const cartel = (who, price, o = {}) => G([R(-170, -260, 340, 470, {radius: 6, fill: '#f2e3bf', lineWidth: 9}), ctext('VALOR', 0, -240, 52, {maxW: 300, color: '#5a3a22'}),
  R(-130, -170, 260, 220, {radius: 6, fill: '#e8d6aa', lineWidth: 6}),
  ...(who === 'cerdo' ? [E(-10, -60, 190, 150, {fill: PINK, lineWidth: 6}), E(60, -54, 60, 48, {fill: PINK2, lineWidth: 5}), E(52, -54, 7, 12, {fill: INK, stroke: 'none'}), E(70, -54, 7, 12, {fill: INK, stroke: 'none'}), E(10, -90, 12, 16, {fill: INK, stroke: 'none'}), S([['M', -40, -122], ['L', -60, -168], ['L', -10, -132], ['Z']], PINK2, {lineWidth: 5})]
    : [E(0, -70, 130, 140, {fill: PAPER, lineWidth: 6}), S([['M', -46, -126], ['L', -30, -158], ['L', -12, -128], ['L', 6, -162], ['L', 24, -128], ['L', 44, -146], ['L', 46, -118], ['Z']], INK, {lineWidth: 4}), E(-22, -72, 10, 14, {fill: INK, stroke: 'none'}), E(22, -72, 10, 14, {fill: INK, stroke: 'none'}), P([['M', -22, -30], ['L', 22, -30]], {lineWidth: 6})]),
  ctext(price, 0, 80, 84, {maxW: 300, color: RED})], o);
