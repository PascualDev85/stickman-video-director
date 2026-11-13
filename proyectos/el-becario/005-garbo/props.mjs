// EXP 005 — objetos de «Garbo». Coordenadas locales: (0,0) = base/centro del objeto.
import {P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';

const KH = '#c9b48a', GOLD = '#e9c46a', RED = '#e0261b', NAVY = '#1f3a6e', WOOD = '#a8743f', WOOD2 = '#7d5229';

/** Ficha de agente: tarjeta con silueta (sombrero distinto según n) y nombre en clave. */
const HATS = [
  c => [E(0, -112, 120, 18, {fill: c, lineWidth: 5}), R(-34, -150, 68, 40, {radius: 6, fill: c, lineWidth: 5})], // fedora
  c => [S([['M', -40, -112], ['Q', -40, -160, 0, -160], ['Q', 40, -160, 40, -112], ['Z']], c, {lineWidth: 5}), E(0, -112, 110, 16, {fill: c, lineWidth: 5})], // bombín
  c => [R(-46, -128, 92, 22, {radius: 8, fill: c, lineWidth: 5}), E(20, -132, 30, 14, {fill: c, lineWidth: 4})], // gorra
  () => [], // sin sombrero
];
const HC = ['#5a4632', '#1b1b1f', '#6b6f78', '#2b4a7a', '#7a1f2b'];
export const ficha = (n, o = {}, {stamp, ghost = false, stampS = 1} = {}) => G([
  R(-75, -190, 150, 200, {radius: 8, fill: ghost ? 'rgba(255,255,255,0.35)' : '#fff6d6', lineWidth: 6, ...(ghost ? {stroke: '#9aa3ab'} : {})}),
  R(-55, -170, 110, 110, {radius: 6, fill: '#c9d6e3', lineWidth: 4}),
  S([['M', -36, -60], ['Q', -36, -96, 0, -96], ['Q', 36, -96, 36, -60], ['Z']], '#3a3a44', {lineWidth: 3}), E(0, -118, 46, 46, {fill: '#3a3a44', stroke: 'none'}),
  ...HATS[n % 4](HC[n % 5]),
  P([['M', -50, -40], ['L', 50, -40]], {stroke: '#9aa3ab', lineWidth: 5}), P([['M', -50, -14], ['L', 30, -14]], {stroke: '#9aa3ab', lineWidth: 5}),
  ...(stamp ? [G([R(-66, -24, 132, 48, {radius: 6, fill: 'none', stroke: RED, lineWidth: 6}), ctext(stamp, 0, -16, 30, {maxW: 120, color: RED})], {y: -100, angle: deg(-14), scaleX: stampS, scaleY: stampS})] : []),
], o);

/** Saco de dinero pequeño. */
export const saco = (o = {}) => G([S([['M', -55, 0], ['Q', -75, -75, -25, -100], ['L', -35, -125], ['L', 35, -125], ['L', 25, -100], ['Q', 75, -75, 55, 0], ['Z']], GOLD, {lineWidth: 7}),
  P([['M', -30, -102], ['L', 30, -102]], {stroke: WOOD2, lineWidth: 7}), P([['M', 16, -78], ['Q', -20, -86, -16, -62], ['Q', 18, -52, 14, -34], ['Q', -2, -24, -20, -34]], {stroke: '#5a3a22', lineWidth: 7}), P([['M', 0, -90], ['L', 0, -20]], {stroke: '#5a3a22', lineWidth: 5})], o);

/** Bandera británica sencilla. */
export const ukFlag = (o = {}, w = 240) => { const h = w / 2;
  return G([R(0, 0, w, h, {radius: 2, fill: NAVY, lineWidth: 6}), P([['M', 0, 0], ['L', w, h]], {stroke: PAPER, lineWidth: 18}), P([['M', w, 0], ['L', 0, h]], {stroke: PAPER, lineWidth: 18}),
    P([['M', 0, 0], ['L', w, h]], {stroke: RED, lineWidth: 6}), P([['M', w, 0], ['L', 0, h]], {stroke: RED, lineWidth: 6}),
    R(w / 2 - 22, 0, 44, h, {radius: 0, fill: PAPER, stroke: 'none'}), R(0, h / 2 - 22, w, 44, {radius: 0, fill: PAPER, stroke: 'none'}),
    R(w / 2 - 12, 0, 24, h, {radius: 0, fill: RED, stroke: 'none'}), R(0, h / 2 - 12, w, 24, {radius: 0, fill: RED, stroke: 'none'}), R(0, 0, w, h, {radius: 2, fill: 'none', lineWidth: 6})], o); };

/** Fachada de la embajada británica en Madrid con puerta (doorOpen: keys de scaleX de la hoja). */
export const embajada = (o = {}, doorKeys) => G([
  R(-460, -900, 920, 900, {radius: 0, fill: '#e8dcc8', lineWidth: 10}), R(-500, -960, 1000, 70, {radius: 4, fill: '#c9b48a', lineWidth: 9}),
  ...[-380, 300].map(x => R(x, -760, 90, 160, {radius: 4, fill: '#9fd3f0', lineWidth: 8})),
  R(-150, -560, 300, 560, {radius: 6, fill: '#5a3a22', lineWidth: 9}),
  G([R(0, 0, 300, 560, {radius: 6, fill: '#7a4a2a', lineWidth: 9}), E(250, 290, 26, 26, {fill: GOLD, lineWidth: 5})], {x: -150, y: -560, pivotX: 0, pivotY: 0, ...(doorKeys ? {keys: doorKeys} : {})}),
  P([['M', 0, -960], ['L', 0, -1120]], {lineWidth: 9}), ukFlag({x: 0, y: -1120}, 200),
  R(-260, -700, 520, 90, {radius: 8, fill: PAPER, lineWidth: 7}), ctext('EMBAJADA BRITÁNICA', 0, -690, 40, {maxW: 490}),
], o);

/** Montón de currículums con sellos. */
export const cvPila = (o = {}, n = 3) => G(Array.from({length: n}, (_, i) => G([R(-150, -200, 300, 400, {radius: 6, fill: PAPER, lineWidth: 7}), ctext('CURRÍCULUM', 0, -180, 34, {maxW: 260}),
  ...[0, 1, 2, 3].map(j => P([['M', -110, -110 + j * 50], ['L', j === 3 ? 20 : 110, -110 + j * 50]], {stroke: '#9aa3ab', lineWidth: 6}))], {x: (i - 1) * 24, y: -i * 16, angle: deg((i - 1) * 6)})), o);

/** Mapa esquemático: Península, Francia, Gran Bretaña. route: 0..1 = progreso de la flecha Madrid→Londres; toLisbon: la flecha gira a Lisboa. */
/** Mapa con la geografía real: contornos simplificados en (longitud, latitud), proyección equirectangular (cos 47°). */
const geo = (lon, lat) => [Math.round(130 + (lon + 11) * 56.6), Math.round(140 + (59 - lat) * 83)];
const poly = pts => pts.map(([lo, la], i) => [i ? 'L' : 'M', ...geo(lo, la)]).concat([['Z']]);
const line = pts => pts.map(([lo, la], i) => [i ? 'L' : 'M', ...geo(lo, la)]);
export const PT = {madrid: geo(-3.7, 40.4), lisboa: geo(-9.14, 38.72), londres: geo(-0.13, 51.5), glasgow: geo(-4.25, 55.86), calais: geo(1.86, 50.95), normandia: geo(-0.6, 49.35), liverpool: geo(-2.98, 53.4)};
const IBERIA = [[-9.3, 43.2], [-8, 43.7], [-5.8, 43.6], [-3.8, 43.45], [-1.8, 43.4], [-0.5, 42.8], [1.5, 42.5], [3.2, 42.4], [3.2, 41.9], [2.0, 41.2], [0.8, 40.7], [-0.3, 39.5], [0.2, 38.8], [-0.5, 38.3], [-1.0, 37.6], [-2.1, 36.7], [-4.4, 36.7], [-5.6, 36.0], [-6.3, 36.5], [-7.4, 37.2], [-8.9, 37.0], [-8.8, 38.5], [-9.5, 38.8], [-9.0, 39.6], [-8.8, 40.6], [-8.7, 41.9]];
const PORTUGAL = [[-7.4, 37.2], [-8.9, 37.0], [-8.8, 38.5], [-9.5, 38.8], [-9.0, 39.6], [-8.8, 40.6], [-8.7, 41.9], [-8.2, 42.1], [-6.2, 41.9], [-6.2, 41.6], [-6.9, 41.0], [-7.0, 39.6], [-7.5, 39.6], [-7.0, 38.2], [-7.5, 37.5]];
const FRANCIA = [[-1.8, 43.4], [-1.3, 44.5], [-1.2, 46.0], [-2.2, 47.1], [-4.4, 47.8], [-4.8, 48.4], [-3.0, 48.8], [-1.6, 48.6], [-1.9, 49.7], [-1.2, 49.4], [0.1, 49.5], [1.4, 50.1], [1.6, 50.9], [2.5, 51.1], [3.5, 51.4], [8, 51.6], [8, 43.6], [4.8, 43.4], [3.2, 42.4], [1.5, 42.5], [-0.5, 42.8]];
const GB = [[-5.7, 50.05], [-4.2, 50.4], [-1.3, 50.8], [1.4, 51.1], [1.4, 51.4], [0.8, 51.6], [1.7, 52.6], [0.3, 53.1], [-0.1, 53.6], [-1.2, 54.6], [-1.6, 55.6], [-2.6, 56.1], [-2.0, 57.6], [-3.0, 58.6], [-5.0, 58.6], [-5.7, 57.0], [-5.6, 56.0], [-4.9, 55.7], [-5.0, 54.8], [-3.4, 54.9], [-3.4, 54.4], [-3.0, 53.4], [-4.6, 53.3], [-4.2, 52.8], [-4.2, 52.2], [-5.2, 51.8], [-3.2, 51.4], [-3.0, 51.2], [-4.2, 51.2]];
const IRLANDA = [[-6.0, 52.2], [-6.2, 53.3], [-5.6, 54.5], [-6.0, 55.2], [-7.3, 55.4], [-8.5, 54.9], [-10.0, 54.2], [-9.8, 53.4], [-10.3, 52.1], [-9.6, 51.5], [-8.2, 51.8]];
const AFRICA = [[-12, 34.6], [-6.3, 35.0], [-5.9, 35.8], [-5.3, 35.9], [-2.0, 35.1], [1.0, 36.4], [8, 37.0], [8, 30], [-12, 30]];
const RAYA = [[-8.9, 41.9], [-8.2, 42.1], [-6.2, 41.9], [-6.2, 41.6], [-6.9, 41.0], [-7.0, 39.6], [-7.5, 39.6], [-7.0, 38.2], [-7.5, 37.5], [-7.4, 37.2]];
const LABELS = {ESPAÑA: [-3.6, 39.4, 54], PORTUGAL: [-8.0, 40.0, 34], FRANCIA: [0.4, 46.6, 54], INGLATERRA: [-1.6, 52.7, 36], IRLANDA: [-8.0, 53.1, 32]};
const CITIES = {madrid: ['Madrid', 0], lisboa: ['Lisboa', 0], londres: ['Londres', -90], calais: ['Calais', 0]};
export const mapa = ({sea = '#a9d6ea', labels = ['ESPAÑA', 'PORTUGAL', 'FRANCIA', 'INGLATERRA', 'IRLANDA'], cities = ['madrid', 'lisboa', 'londres']} = {}) => [
  {type: 'rect', x: -400, y: -400, w: 2400, h: 3200, radius: 0, fill: sea, stroke: 'none'},
  ...Array.from({length: 18}, (_, i) => G([P([['M', 0, 0], ['Q', 18, -14, 36, 0], ['Q', 54, 14, 72, 0]], {stroke: 'rgba(255,255,255,0.55)', lineWidth: 5})], {x: 60 + ((i * 263) % 1100), y: 300 + ((i * 431) % 1700)})),
  S(poly(AFRICA), '#e6d6b0', {lineWidth: 8}),
  S(poly(FRANCIA), '#cfe0a6', {lineWidth: 8}),
  S(poly(IBERIA), '#f0d9a0', {lineWidth: 8}), S(poly(PORTUGAL), '#e8c27e', {stroke: 'none'}), P(line(RAYA), {stroke: '#8a6a3a', lineWidth: 5}), S(poly(IBERIA), 'none', {lineWidth: 8}),
  S(poly(IRLANDA), '#bfdca0', {lineWidth: 8}), S(poly(GB), '#e9c9a6', {lineWidth: 8}),
  ...Object.entries(LABELS).filter(([t]) => labels.includes(t)).map(([t, [lo, la, z]]) => { const [x, y] = geo(lo, la); return ctext(t, x, y, z, {maxW: 400, color: '#5a4632'}); }),
  ...cities.map(k => { const [x, y] = PT[k]; return G([E(x, y, 26, 26, {fill: INK, stroke: PAPER, lineWidth: 5}), ctext(CITIES[k][0], x + CITIES[k][1], y + 18, 30, {maxW: 220, color: INK})]); }),
];
/** Cámara de mapa: deja el punto (cx, cy) del mapa en (640, Y) de la pantalla con escala s (camF con pivote 640, 1000). */
export const mapCam = (cx, cy, s, Y = 1050) => ({s, x: -(cx - 640) * s, y: Y - 1000 - (cy - 1000) * s});
/** Cabecita de Garbo (fedora + bigote) para marcar la ruta. */
export const cabeza = (o = {}) => G([E(0, 0, 110, 110, {fill: PAPER, lineWidth: 7}), E(0, -40, 150, 26, {fill: '#5a4632', lineWidth: 6}), R(-38, -92, 76, 54, {radius: 10, fill: '#5a4632', lineWidth: 6}),
  E(-18, 2, 12, 16, {fill: INK, stroke: 'none'}), E(18, 2, 12, 16, {fill: INK, stroke: 'none'}), P([['M', -22, 26], ['Q', 0, 18, 22, 26]], {lineWidth: 6})], o);

/** Flecha de ruta animable: pts = [[x,y]...]; prog = keys {t, sx} no; se dibuja hasta `upto` (0..1) muestreando. */
export const ruta = (pts, upto, {color = RED, w = 14, head = false} = {}) => {
  const segs = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  let rem = tot * upto; const cmds = [['M', ...pts[0]]]; let end = pts[0];
  for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / segs[i - 1]); end = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; cmds.push(['L', ...end]); rem -= segs[i - 1]; }
  return G([P(cmds, {stroke: color, lineWidth: w}), head ? cabeza({x: end[0], y: end[1] - 95, scaleX: 1.25, scaleY: 1.25}) : E(end[0], end[1], w * 2.4, w * 2.4, {fill: color, lineWidth: 5})]);
};

/** Tranvía amarillo de Lisboa. */
export const tranvia = (o = {}) => G([R(-300, -330, 600, 280, {radius: 30, fill: '#f2c230', lineWidth: 10}), R(-300, -120, 600, 70, {radius: 0, fill: PAPER, lineWidth: 8}),
  ...[-230, -90, 50, 190].map(x => R(x, -290, 100, 120, {radius: 10, fill: '#9fd3f0', lineWidth: 7})), E(-180, -40, 80, 80, {fill: INK}), E(180, -40, 80, 80, {fill: INK}),
  P([['M', 0, -330], ['L', -60, -470]], {lineWidth: 7})], o);

/** Mesa de café con taza. */
export const mesaCafe = (o = {}) => G([R(-160, -300, 320, 26, {radius: 10, fill: PAPER, lineWidth: 8}), R(-10, -274, 20, 274, {radius: 4, fill: INK, stroke: 'none'}), R(-80, -14, 160, 18, {radius: 6, fill: INK, stroke: 'none'}),
  R(40, -360, 60, 56, {radius: 10, fill: PAPER, lineWidth: 6}), P([['M', 100, -344], ['Q', 128, -332, 100, -316]], {lineWidth: 6}), E(70, -300, 110, 16, {fill: PAPER, lineWidth: 5})], o);

/** Máquina de escribir. */
export const maquina = (o = {}, paper = 'INFORME SECRETO') => G([R(-150, -250, 300, 230, {radius: 6, fill: PAPER, lineWidth: 7}), ctext(paper, 0, -220, 24, {maxW: 260, color: RED}),
  ...[0, 1, 2].map(j => P([['M', -110, -170 + j * 34], ['L', 110 - j * 40, -170 + j * 34]], {stroke: '#9aa3ab', lineWidth: 5})),
  R(-220, -60, 440, 60, {radius: 14, fill: '#3a3a44', lineWidth: 8}), S([['M', -240, 80], ['L', -200, -40], ['L', 200, -40], ['L', 240, 80], ['Z']], '#2b2b33', {lineWidth: 8}),
  ...Array.from({length: 8}, (_, i) => E(-175 + i * 50, 30, 30, 30, {fill: PAPER, lineWidth: 4}))], o);

/** Guía turística de Gran Bretaña (libro). */
export const guia = (o = {}) => G([R(-170, -230, 340, 460, {radius: 10, fill: '#2e6b4a', lineWidth: 9}), R(-150, -210, 300, 140, {radius: 6, fill: PAPER, lineWidth: 6}),
  ctext('GUÍA', 0, -205, 56, {maxW: 280}), ctext('DE GRAN BRETAÑA', 0, -140, 30, {maxW: 280}), ukFlag({x: -90, y: -20}, 180), ctext('PARA TURISTAS', 0, 140, 28, {maxW: 280, color: PAPER})], o);

/** Botella de vino con etiqueta «1 L». */
export const botella = (o = {}) => G([R(-20, -330, 40, 90, {radius: 6, fill: '#3a5a2a', lineWidth: 6}), S([['M', -20, -240], ['Q', -60, -220, -60, -170], ['L', -60, 0], ['L', 60, 0], ['L', 60, -170], ['Q', 60, -220, 20, -240], ['Z']], '#3a5a2a', {lineWidth: 8}),
  R(-50, -140, 100, 80, {radius: 4, fill: PAPER, lineWidth: 5}), ctext('1 L', 0, -132, 44, {maxW: 90, color: '#7a1f2b'})], o);
/** Pinta de cerveza. */
export const pinta = (o = {}) => G([S([['M', -60, -220], ['L', 60, -220], ['L', 48, 0], ['L', -48, 0], ['Z']], '#e9a83a', {lineWidth: 8}), S([['M', -66, -220], ['Q', -70, -270, -20, -260], ['Q', 0, -290, 30, -262], ['Q', 72, -268, 66, -220], ['Z']], PAPER, {lineWidth: 7})], o);

/** Periódico con necrológica. */
export const periodico = (o = {}) => G([R(-230, -300, 460, 600, {radius: 4, fill: '#f4efe3', lineWidth: 8}), ctext('LIVERPOOL POST', 0, -285, 44, {maxW: 420}), P([['M', -200, -220], ['L', 200, -220]], {lineWidth: 6}),
  R(-200, -190, 400, 250, {radius: 4, fill: PAPER, lineWidth: 6}), ctext('NECROLÓGICA', 0, -180, 40, {maxW: 380}), ctext('†', 0, -120, 90, {maxW: 80}),
  ...[0, 1, 2, 3].map(j => P([['M', -200, 110 + j * 44], ['L', 200 - (j % 2) * 80, 110 + j * 44]], {stroke: '#9aa3ab', lineWidth: 6}))], o);

/** Sobre de la pensión. */
export const sobre = (o = {}) => G([R(-130, -80, 260, 160, {radius: 6, fill: '#fff6d6', lineWidth: 7}), P([['M', -130, -80], ['L', 0, 10], ['L', 130, -80]], {lineWidth: 6}), ctext('PENSIÓN', 0, 26, 34, {maxW: 220, color: RED})], o);

/** Radio transmisora con antena. */
export const radio = (o = {}) => G([R(-200, -220, 400, 220, {radius: 14, fill: '#6b5a44', lineWidth: 9}), R(-170, -190, 200, 110, {radius: 8, fill: '#e9d8a6', lineWidth: 6}),
  ...[0, 1].map(i => E(90 + i * 60, -150, 44, 44, {fill: '#3a3a44', lineWidth: 5})), R(-180, -60, 140, 40, {radius: 6, fill: '#3a3a44', lineWidth: 5}), P([['M', 150, -220], ['L', 220, -460]], {lineWidth: 8}), E(220, -460, 24, 24, {fill: RED, lineWidth: 4})], o);

/** Medallas: Cruz de Hierro (cruz negra con borde blanco, sin símbolos) y la MBE (cruz plateada con cinta rosa y gris). */
export const cruzHierro = (o = {}) => G([P([['M', 0, -150], ['L', 0, -90]], {stroke: '#c8202a', lineWidth: 26}),
  S([['M', -24, -90], ['L', 24, -90], ['L', 40, -40], ['L', 90, -24], ['L', 90, 24], ['L', 40, 40], ['L', 24, 90], ['L', -24, 90], ['L', -40, 40], ['L', -90, 24], ['L', -90, -24], ['L', -40, -40], ['Z']], INK, {stroke: '#d9d9d9', lineWidth: 10}),
  ctext('1944', 0, -12, 26, {maxW: 70, color: PAPER})], o);
export const medallaMBE = (o = {}) => G([R(-26, -170, 52, 80, {radius: 0, fill: '#e8a0b0', lineWidth: 5}), R(-6, -170, 12, 80, {radius: 0, fill: '#9aa3ab', stroke: 'none'}),
  S([['M', 0, -90], ['L', 30, -20], ['L', 90, 0], ['L', 30, 20], ['L', 0, 90], ['L', -30, 20], ['L', -90, 0], ['L', -30, -20], ['Z']], '#d9dde3', {lineWidth: 8}), E(0, 0, 60, 60, {fill: GOLD, lineWidth: 6}), ctext('MBE', 0, -14, 22, {maxW: 54})], o);

/** Manual «Cómo fabricar un espía». */
export const manual = (o = {}) => G([R(-190, -260, 380, 520, {radius: 10, fill: RED, lineWidth: 9}), R(-160, -230, 320, 170, {radius: 6, fill: PAPER, lineWidth: 6}),
  ctext('CÓMO FABRICAR', 0, -222, 40, {maxW: 300}), ctext('UN ESPÍA', 0, -160, 58, {maxW: 300, color: RED}),
  E(0, 30, 120, 120, {fill: PAPER, lineWidth: 7}), E(0, -36, 190, 30, {fill: '#5a4632', lineWidth: 6}), R(-60, -96, 120, 64, {radius: 10, fill: '#5a4632', lineWidth: 6}),
  R(-34, 20, 26, 12, {radius: 4, fill: INK, stroke: 'none'}), R(8, 20, 26, 12, {radius: 4, fill: INK, stroke: 'none'}), ctext('EN 5 PASOS', 0, 140, 40, {maxW: 300, color: PAPER})], o);

/** Cartel de paso: «PASO n». */
export const paso = (n, o = {}) => G([R(-170, -70, 340, 140, {radius: 14, fill: '#fff6d6', stroke: RED, lineWidth: 10}), ctext(`PASO ${n}`, 0, -52, 92, {maxW: 300, color: RED})], o);

/** Costa de Calais: cielo gris, mar, playa, acantilado blanco. */
export const calais = (d) => [{type: 'rect', x: -60, y: -60, w: 1400, h: 2400, radius: 0, fill: '#c9d6e3', stroke: 'none'},
  S([['M', -60, 1000], ['Q', 640, 960, 1340, 1000], ['L', 1340, 1300], ['L', -60, 1300], ['Z']], '#6fa8c9', {stroke: 'none'}),
  S([['M', -60, 1250], ['Q', 640, 1200, 1340, 1260], ['L', 1340, 2400], ['L', -60, 2400], ['Z']], '#e6d3a3', {lineWidth: 9}),
  S([['M', 860, 1260], ['L', 900, 880], ['L', 1040, 840], ['L', 1340, 860], ['L', 1340, 1280], ['Z']], '#f4efe3', {lineWidth: 9})];

/** Hoja de calendario. */
export const calendario = (mes, o = {}) => G([R(-120, -150, 240, 300, {radius: 8, fill: PAPER, lineWidth: 8}), R(-120, -150, 240, 80, {radius: 8, fill: RED, lineWidth: 8}), ctext(mes, 0, -138, 48, {maxW: 220, color: PAPER}), ctext('?', 0, -40, 110, {maxW: 120})], o);
