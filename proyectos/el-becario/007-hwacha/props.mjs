// EXP 007 — objetos de «El hwacha de Haengju». Coordenadas locales: (0,0) = base/centro del objeto.
import {P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';
import {sample, mix, eOut, r3} from '../lib.mjs';

const WOOD = '#a8743f', WOOD2 = '#7d5229', WOOD3 = '#c99a5e', RED = '#e0261b', TUBE = '#d9c08a', STEEL = '#6b6b72';

/** Flecha-cohete (singijeon): varilla larga, tubo de pólvora de papel cerca de la punta y plumas. Apunta a la derecha; largo ≈ 260. */
export const singijeon = (o = {}, {flame = false} = {}) => G([
  ...(flame ? [S([['M', -150, 0], ['L', -230, -16], ['L', -200, 0], ['L', -240, 16], ['Z']], '#ffb21f', {lineWidth: 4}), S([['M', -150, 0], ['L', -190, -8], ['L', -180, 0], ['L', -196, 8], ['Z']], '#fff2b0', {stroke: 'none'})] : []),
  P([['M', -140, 0], ['L', 120, 0]], {stroke: WOOD2, lineWidth: 6}),
  S([['M', 120, -9], ['L', 146, 0], ['L', 120, 9], ['Z']], STEEL, {lineWidth: 4}),
  R(40, -12, 70, 24, {radius: 6, fill: TUBE, lineWidth: 4}), P([['M', 52, -12], ['L', 52, 12]], {stroke: RED, lineWidth: 4}),
  S([['M', -140, 0], ['L', -112, -16], ['L', -100, 0], ['Z']], PAPER, {lineWidth: 3}), S([['M', -140, 0], ['L', -112, 16], ['L', -100, 0], ['Z']], PAPER, {lineWidth: 3}),
], o);

/** Hwacha: carro de dos ruedas con el bastidor de 100 agujeros (10 × 10, se dibujan 5 filas visibles × 10).
 *  tilt: inclinación del bastidor en grados (positivo = apunta arriba). loaded: 0..1 flechas puestas, o {t0, dt} para cargarlas una a una.
 *  fuse: t en que se enciende la mecha (chispa que recorre la cuerda). dur: duración del plano. */
export const hwacha = ({x = 0, y = 0, scale = 1, flip = false, tilt = 18, loaded = 1, load, fuse, dur = 3, empty = false, ...o} = {}) => {
  const wheel = wx => G([E(0, 0, 210, 210, {fill: WOOD3, lineWidth: 9}), E(0, 0, 150, 150, {fill: 'none', stroke: WOOD2, lineWidth: 6}),
    ...[0, 45, 90, 135].map(a => P([['M', -Math.cos(deg(a)) * 74, -Math.sin(deg(a)) * 74], ['L', Math.cos(deg(a)) * 74, Math.sin(deg(a)) * 74]], {stroke: WOOD2, lineWidth: 8})), E(0, 0, 40, 40, {fill: WOOD2, lineWidth: 6})], {x: wx, y: -105});
  const rows = 5, cols = 10, holes = [], arrows = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const hx = -130 + c * 29 + 14, hy = -150 + r * 30 + 15, i = r * cols + c;
    holes.push(E(hx, hy, 18, 18, {fill: '#3a2a1e', stroke: 'none'}));
    if (empty) continue;
    const ar = G([singijeon({}, {})], {x: hx + 140, y: hy, scaleX: 0.55, scaleY: 0.55});
    if (load) arrows.push(G([ar], {from: r3(load.t0 + i * load.dt)}));
    else if (i < Math.round(loaded * rows * cols)) arrows.push(ar);
  }
  const fuseG = fuse !== undefined ? [P([['M', -150, -20], ['Q', -230, 40, -200, 120]], {stroke: '#5a4632', lineWidth: 5}),
    G([E(0, 0, 30, 30, {fill: '#ffd21f', lineWidth: 4}), E(0, 0, 14, 14, {fill: PAPER, stroke: 'none'})], {from: r3(fuse), keys: sample(t => { const u = Math.min(1, (t - fuse) / 0.9); return {x: mix(-200, -150, u), y: mix(120, -20, u), s: 0.8 + Math.abs(Math.sin(t * 30)) * 0.5}; }, r3(fuse), dur)})] : [];
  const rack = G([R(-150, -165, 300, 180, {radius: 6, fill: WOOD, lineWidth: 9}), R(-136, -152, 272, 154, {radius: 4, fill: WOOD2, lineWidth: 5}), ...holes, ...arrows, ...fuseG],
    {y: -250, angle: deg(-tilt), pivotX: 0, pivotY: 0});
  const cart = [S([['M', -260, -200], ['L', 220, -200], ['L', 200, -170], ['L', -280, -170], ['Z']], WOOD, {lineWidth: 8}), // plataforma
    P([['M', -260, -186], ['L', -420, -60]], {stroke: WOOD2, lineWidth: 18}), P([['M', -230, -186], ['L', -400, -40]], {stroke: WOOD2, lineWidth: 12}), // varas
    R(-30, -250, 60, 70, {radius: 6, fill: WOOD2, lineWidth: 7})];
  return G([...cart, rack, wheel(-150), wheel(130)], {x, y, scaleX: flip ? -scale : scale, scaleY: scale, ...o});
};

/** Andanada de cohetes desde (x0, y0) hacia la derecha-abajo/arriba. n cohetes; salen en t0 con un poco de dispersión. */
export const volley = (x0, y0, t0, d, {n = 24, angle = -14, spread = 18, speed = 1500, drop = 420, s = 0.8} = {}) => Array.from({length: n}, (_, i) => {
  const a = deg(angle + ((i * 37) % 100) / 100 * spread - spread / 2), dl = ((i * 53) % 100) / 100 * 0.18, dy = ((i * 29) % 100) / 100 * 140 - 70;
  return G([singijeon({}, {flame: true})], {from: r3(t0 + dl), keys: sample(t => { const u = Math.max(0, t - t0 - dl);
    return {x: x0 + Math.cos(a) * speed * u, y: y0 + dy + Math.sin(a) * speed * u + drop * u * u, a: (angle + ((i * 37) % 100) / 100 * spread - spread / 2) + drop * u * 0.05, s}; }, r3(t0 + dl), d)});
});

/** Humo blanco que sale del carro al disparar. */
export const humo = (x, y, t0, d, n = 6) => Array.from({length: n}, (_, i) => ({...E(0, 0, 120 + i * 20, 90 + i * 16, {fill: '#ececf0', lineWidth: 6}), from: r3(t0 + i * 0.05),
  keys: sample(t => { const u = t - t0 - i * 0.05; return {x: x - u * (120 + i * 40), y: y - u * (60 + i * 30) + Math.sin(i) * 40, alpha: Math.max(0, 1 - u / 1.6)}; }, r3(t0 + i * 0.05), d)}));

/** Empalizada (doble cerca de madera de Haengju) a lo largo de una línea [x0..x1] en y, con estacas puntiagudas. */
export const empalizada = (x0, x1, y, {h = 190, step = 46} = {}) => G([R(x0, y - h * 0.62, x1 - x0, 20, {radius: 4, fill: WOOD2, lineWidth: 6}),
  ...Array.from({length: Math.ceil((x1 - x0) / step) + 1}, (_, i) => { const sx = x0 + i * step; return S([['M', sx - 18, y], ['L', sx - 18, y - h], ['L', sx, y - h - 34], ['L', sx + 18, y - h], ['L', sx + 18, y], ['Z']], i % 2 ? WOOD : WOOD3, {lineWidth: 7}); })]);

/** Estandarte japonés (nobori): asta y tela vertical blanca con mon negro. */
export const nobori = ({x = 0, y = 0, h = 420, dur = 3, ...o} = {}) => G([R(-6, -h, 12, h, {radius: 4, fill: '#3a2a1e', lineWidth: 5}),
  G([R(0, 0, 90, 230, {radius: 2, fill: PAPER, lineWidth: 6}), E(45, 70, 54, 54, {fill: 'none', stroke: INK, lineWidth: 8}), P([['M', 45, 50], ['L', 45, 90]], {lineWidth: 7})],
    {x: 6, y: -h + 20, keys: sample(t => ({angle: Math.sin(t * 5) * 0.04}), 0, dur)})], {x, y, ...o});

/** Haz de flechas (para los barcos y la caja). */
export const haz = (o = {}) => G([...[-24, -12, 0, 12, 24].map(dy => P([['M', -110, dy], ['L', 110, dy * 0.6]], {stroke: WOOD2, lineWidth: 6})),
  ...[-24, -12, 0, 12, 24].map(dy => S([['M', 110, dy * 0.6 - 7], ['L', 130, dy * 0.6], ['L', 110, dy * 0.6 + 7], ['Z']], STEEL, {lineWidth: 3})), R(-14, -32, 28, 64, {radius: 4, fill: RED, lineWidth: 5})], o);

/** Caja de flechas: llena (haces) o vacía (con telaraña). */
export const caja = (full = true, o = {}) => G([R(-150, -120, 300, 120, {radius: 6, fill: WOOD, lineWidth: 8}), R(-150, -120, 300, 26, {radius: 4, fill: WOOD2, lineWidth: 6}),
  ...(full ? [-60, 0, 60].map(dx => haz({x: dx, y: -130, angle: deg(-80), scaleX: 0.6, scaleY: 0.6})) : [P([['M', -140, -110], ['Q', -100, -80, -60, -110]], {stroke: '#bfbfbf', lineWidth: 3}), P([['M', -140, -110], ['L', -96, -70]], {stroke: '#bfbfbf', lineWidth: 3})])], o);

/** Barco coreano de transporte (pequeño, vela de esteras) cargado de haces de flechas. */
export const barca = ({x = 0, y = 0, scale = 1, dur = 3, flip = false, ...o} = {}) => G([G([
  S([['M', -260, -60], ['L', 260, -60], ['Q', 230, 40, 0, 46], ['Q', -230, 40, -260, -60], ['Z']], '#6b4a30', {lineWidth: 9}), R(-250, -76, 500, 20, {radius: 4, fill: WOOD, lineWidth: 6}),
  R(-8, -430, 16, 370, {radius: 4, fill: WOOD2, lineWidth: 7}),
  S([['M', -150, -400], ['L', 150, -400], ['L', 130, -110], ['L', -130, -110], ['Z']], '#e8d6aa', {lineWidth: 7}), ...[-340, -280, -220, -160].map(yy => P([['M', -140, yy], ['L', 140, yy]], {stroke: '#b89a62', lineWidth: 5})),
  ...[-170, -60, 60, 170].map(hx => haz({x: hx, y: -100, scaleX: 0.7, scaleY: 0.7, angle: deg(-8)})),
], {keys: sample(t => ({y: Math.sin(t * 2.4) * 8, angle: Math.sin(t * 1.9) * 0.02}), 0, dur)})], {x, y, scaleX: flip ? -scale : scale, scaleY: scale, ...o});

/** Piedra (gris). */
export const piedra = (o = {}) => G([S([['M', -40, 0], ['Q', -50, -40, -10, -50], ['Q', 40, -56, 46, -14], ['Q', 40, 10, 0, 10], ['Z']], '#9a9a94', {lineWidth: 6}), P([['M', -14, -30], ['L', 6, -20]], {stroke: '#7a7a74', lineWidth: 4})], o);

/** Libro coreano antiguo cosido (encuadernación de 5 puntadas) con año. */
export const libro = (year, o = {}) => G([R(-170, -230, 340, 460, {radius: 6, fill: '#c9a46a', lineWidth: 9}), R(-170, -230, 46, 460, {radius: 4, fill: '#a8834a', lineWidth: 6}),
  ...[-180, -90, 0, 90, 180].map(yy => P([['M', -170, yy], ['L', -124, yy]], {stroke: '#5a3a22', lineWidth: 6})),
  R(-90, -190, 190, 260, {radius: 4, fill: '#f2e3bf', lineWidth: 6}), ...[-140, -95, -50, -5].map(yy => P([['M', -60, yy], ['L', 70, yy]], {stroke: '#7d6a4a', lineWidth: 5})),
  ctext(String(year), 5, 110, 76, {maxW: 280, color: RED})], o);

/** Trapo de cocina con cuadros y gotas. */
export const trapo = (o = {}) => G([S([['M', -150, -110], ['L', 150, -120], ['Q', 160, 40, 140, 120], ['L', -140, 130], ['Q', -160, 10, -150, -110], ['Z']], '#f4f1ea', {lineWidth: 8}),
  ...[-90, -30, 30, 90].map(xx => P([['M', xx, -116], ['L', xx + 4, 126]], {stroke: '#d9534f', lineWidth: 7})), ...[-60, 0, 60].map(yy => P([['M', -150, yy], ['L', 150, yy - 4]], {stroke: '#d9534f', lineWidth: 7}))], o);

/** Impresora del Archivo (de EXP 003). */
export const printer = (x, y, s = 1) => G([R(-170, -150, 340, 150, {radius: 14, fill: '#c9ced3'}), R(-120, -190, 240, 50, {radius: 8, fill: '#9aa3ab'}), R(-110, -60, 220, 18, {radius: 4, fill: '#2b2b2b', stroke: 'none'}),
  S([['M', -90, -46], ['L', 90, -46], ['L', 70, 40], ['L', -70, 40], ['Z']], PAPER, {lineWidth: 6}), E(120, -110, 24, 24, {fill: RED, lineWidth: 4})], {x, y, scaleX: s, scaleY: s});

/** Yari (lanza de ashigaru), en la mano: apunta hacia arriba. */
export const yari = (o = {}) => G([R(-5, -330, 10, 420, {radius: 4, fill: '#5a3a22', lineWidth: 4}), S([['M', -12, -330], ['L', 0, -400], ['L', 12, -330], ['Z']], '#9aa3ab', {lineWidth: 4})], o);
/** Escalera de asalto (apoyada, inclinada). h: largo. */
export const escalera = (h = 700, o = {}) => G([R(-60, -h, 16, h, {radius: 4, fill: WOOD2, lineWidth: 5}), R(44, -h, 16, h, {radius: 4, fill: WOOD2, lineWidth: 5}),
  ...Array.from({length: Math.floor(h / 90)}, (_, i) => R(-50, -h + 40 + i * 90, 100, 12, {radius: 3, fill: WOOD, lineWidth: 4}))], o);
/** Araña que baja de su hilo (gag de la caja vacía). */
export const arana = (x, y0, y1, t0, d) => G([P([['M', 0, -2000], ['L', 0, 0]], {stroke: '#9a9a9a', lineWidth: 3}), E(0, 0, 34, 28, {fill: INK, stroke: 'none'}),
  ...[-1, 1].flatMap(sd => [0, 1, 2].map(k => P([['M', 0, 0], ['L', sd * 26, -10 + k * 10], ['L', sd * 34, 4 + k * 10]], {lineWidth: 3}))), E(-7, -4, 8, 8, {fill: PAPER, stroke: 'none'}), E(7, -4, 8, 8, {fill: PAPER, stroke: 'none'})],
  {x, from: r3(t0), keys: sample(t => ({y: mix(y0, y1, eOut((t - t0) / 0.6)) + Math.sin(t * 4) * 6}), r3(t0), d)});
