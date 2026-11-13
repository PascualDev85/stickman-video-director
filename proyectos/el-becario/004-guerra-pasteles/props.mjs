// EXP 004 — objetos y decorados de «La Guerra de los Pasteles». Coordenadas: (0,0) = base del objeto salvo que se diga.
import {P, E, R, G, S, deg, INK, PAPER, ctext} from '../kit.mjs';
import {RED, YEL, sample, mix, eOut, r3} from '../lib.mjs';

const WOOD = '#a8743f', WOOD2 = '#7d5229', GOLD = '#e9c46a', BOOT = '#2a1d14', PANTS = '#f1ece0';
export const MXG = '#2e8b4a', FRB = '#2350a0';

/** La pierna de Santa Anna (protagonista): pantalón blanco + bota alta. Sin cara. (0,0) = centro; mide ~420 de alto. */
export const pierna = (o = {}, {bow = false} = {}) => G([
  S([['M', -44, -210], ['Q', -50, -40, -36, 60], ['L', 34, 60], ['Q', 50, -40, 46, -210], ['Q', 0, -228, -44, -210], ['Z']], PANTS, {lineWidth: 9}),
  S([['M', -40, 40], ['L', 38, 40], ['L', 40, 160], ['Q', 110, 168, 118, 200], ['L', -44, 206], ['Z']], BOOT, {lineWidth: 9}),
  P([['M', -38, 56], ['L', 38, 56]], {stroke: '#4a3424', lineWidth: 10}), E(-10, 196, 30, 12, {fill: '#4a3424', stroke: 'none'}),
  ...(bow ? [S([['M', 0, -150], ['L', -48, -180], ['L', -48, -120], ['Z']], RED, {lineWidth: 6}), S([['M', 0, -150], ['L', 48, -180], ['L', 48, -120], ['Z']], RED, {lineWidth: 6}), E(0, -150, 22, 22, {fill: RED, lineWidth: 5})] : []),
], o);
/** Pierna de corcho/madera con bota negra (la de Illinois). */
export const piernaCorcho = (o = {}) => G([
  S([['M', -40, -200], ['Q', -46, -40, -32, 50], ['L', 30, 50], ['Q', 46, -40, 42, -200], ['Z']], '#c99a62', {lineWidth: 9}),
  ...[-150, -90, -30].map(y => P([['M', -34, y], ['Q', 0, y + 14, 36, y]], {stroke: WOOD2, lineWidth: 5})),
  R(-48, -214, 96, 30, {radius: 6, fill: '#6b4423', lineWidth: 6}),
  S([['M', -36, 40], ['L', 34, 40], ['L', 36, 150], ['Q', 104, 158, 110, 188], ['L', -40, 194], ['Z']], INK, {lineWidth: 9}),
], o);
/** Pastel de varios pisos con vela. (0,0) = base. */
export const pastel = (o = {}, {candle = true, flame = 0} = {}) => G([
  E(0, 6, 380, 46, {fill: '#d6d6d6', lineWidth: 8}),
  R(-160, -120, 320, 120, {radius: 20, fill: '#f6c6d4', lineWidth: 9}), P([['M', -160, -96], ['Q', -120, -66, -80, -96], ['Q', -40, -66, 0, -96], ['Q', 40, -66, 80, -96], ['Q', 120, -66, 160, -96]], {stroke: PAPER, lineWidth: 12}),
  R(-110, -220, 220, 104, {radius: 18, fill: '#f6e7c8', lineWidth: 9}), P([['M', -110, -198], ['Q', -73, -170, -36, -198], ['Q', 0, -170, 36, -198], ['Q', 73, -170, 110, -198]], {stroke: '#f6c6d4', lineWidth: 12}),
  E(-70, -232, 34, 34, {fill: RED, lineWidth: 6}), E(0, -236, 34, 34, {fill: RED, lineWidth: 6}), E(70, -232, 34, 34, {fill: RED, lineWidth: 6}),
  ...(candle ? [R(-10, -320, 20, 86, {radius: 4, fill: PAPER, lineWidth: 6}), G([S([['M', 0, -372], ['Q', 22, -340, 0, -322], ['Q', -22, -340, 0, -372], ['Z']], '#ffb020', {lineWidth: 5})], {pivotX: 0, pivotY: -322, ...(flame ? {keys: sample(t => ({a: Math.sin(t * 13) * 10, sx: 1 + Math.sin(t * 17) * 0.1}), 0, flame)} : {})})] : []),
], o);
/** Pastelito pequeño (para la mano del Becario / escaparate). */
export const pastelito = (o = {}) => G([S([['M', -50, 0], ['L', -40, -50], ['L', 40, -50], ['L', 50, 0], ['Z']], '#e8b04a', {lineWidth: 7}), E(0, -64, 104, 50, {fill: '#f6c6d4', lineWidth: 7}), E(0, -92, 26, 26, {fill: RED, lineWidth: 5})], o);
/** Fachada de pastelería (Tacubaya). (0,0) = suelo en el centro; ancho ~980. */
export const pasteleria = (o = {}, {broken = false} = {}) => G([
  R(-490, -980, 980, 980, {radius: 0, fill: '#f0d9b5', lineWidth: 10}),
  R(-520, -1010, 1040, 70, {radius: 6, fill: '#c8955a', lineWidth: 9}),
  ...[0, 1, 2, 3, 4, 5, 6].map(i => S([['M', -490 + i * 140, -900], ['L', -490 + (i + 1) * 140, -900], ['L', -490 + (i + 1) * 140 - 10, -800], ['L', -490 + i * 140 + 10, -800], ['Z']], i % 2 ? PAPER : RED, {lineWidth: 7})),
  R(-380, -880, 760, 110, {radius: 10, fill: PAPER, lineWidth: 8}), ctext('PÂTISSERIE', 0, -862, 74, {maxW: 700, color: FRB}),
  R(-420, -720, 480, 420, {radius: 6, fill: broken ? '#8fb3c9' : '#cfe8f5', lineWidth: 10}),
  ...(broken ? [P([['M', -300, -720], ['L', -240, -560], ['L', -330, -470], ['L', -260, -300]], {lineWidth: 7}), P([['M', -240, -560], ['L', -60, -600]], {lineWidth: 7}), P([['M', -330, -470], ['L', -420, -440]], {lineWidth: 7})]
    : [R(-400, -420, 440, 20, {radius: 4, fill: WOOD, lineWidth: 6}), pastelito({x: -300, y: -420, scaleX: 0.9, scaleY: 0.9}), pastelito({x: -180, y: -420, scaleX: 0.9, scaleY: 0.9}), pastelito({x: -60, y: -420, scaleX: 0.9, scaleY: 0.9})]),
  R(140, -700, 260, 700, {radius: 6, fill: WOOD, lineWidth: 10}), E(360, -340, 30, 30, {fill: GOLD, lineWidth: 5}), R(170, -660, 200, 260, {radius: 6, fill: '#cfe8f5', lineWidth: 8}),
], o);
/** Barco de guerra francés de vela, visto de lado. (0,0) = línea de flotación en el centro; ~1100 de largo. */
export const barco = (o = {}, {sway = 0, cannonsAt = []} = {}) => G([
  ...[[-260, -1180, 380], [120, -1300, 420]].map(([x, y, w]) => G([R(x - 12, y - 40, 24, -y - 220, {radius: 4, fill: WOOD2, lineWidth: 7}),
    ...[[y + 90, y + 470, 1], [y + 520, y + 860, 0.86]].flatMap(([a, b, k]) => [R(x - w * k / 2 - 30, a - 14, w * k + 60, 22, {radius: 8, fill: WOOD2, lineWidth: 6}),
      S([['M', x - w * k / 2, a], ['L', x + w * k / 2, a], ['Q', x + w * k / 2 + 50, (a + b) / 2, x + w * k / 2 - 10, b], ['Q', x, b + 40, x - w * k / 2 + 10, b], ['Q', x - w * k / 2 - 50, (a + b) / 2, x - w * k / 2, a], ['Z']], '#f4ecd8', {lineWidth: 8}),
      P([['M', x - w * k / 2 + 20, (a + b) / 2], ['Q', x, (a + b) / 2 + 40, x + w * k / 2 - 20, (a + b) / 2]], {stroke: '#d6c9a8', lineWidth: 6})])])),
  P([['M', -260, -1220], ['L', -600, -280]], {stroke: '#3a2414', lineWidth: 5}), P([['M', 120, -1340], ['L', 600, -340]], {stroke: '#3a2414', lineWidth: 5}), P([['M', -260, -1220], ['L', 120, -1340]], {stroke: '#3a2414', lineWidth: 4}),
  G([R(0, 0, 60, 40, {radius: 0, fill: FRB, lineWidth: 5}), R(60, 0, 60, 40, {radius: 0, fill: PAPER, lineWidth: 5}), R(120, 0, 60, 40, {radius: 0, fill: RED, lineWidth: 5})], {x: 130, y: -1340, scaleX: 1.3, scaleY: 1.3, pivotX: 0, pivotY: 20, keys: sample(t => ({a: Math.sin(t * 5) * 6}), 0, 30)}),
  S([['M', -600, -260], ['L', 560, -260], ['L', 620, -360], ['L', 520, -260], ['L', 440, 0], ['L', -480, 0], ['Z']], '#5a3a22', {lineWidth: 10}),
  R(-560, -290, 1120, 50, {radius: 6, fill: '#3a2414', lineWidth: 8}),
  R(-500, -200, 920, 36, {radius: 4, fill: '#e9c46a', lineWidth: 6}),
  ...[-400, -240, -80, 80, 240].map(x => G([R(x - 30, -150, 60, 60, {radius: 6, fill: '#1b1d26', lineWidth: 6}), R(x - 10, -130, 50, 20, {radius: 4, fill: '#444', lineWidth: 4})])),
  ...cannonsAt.flatMap((t, i) => smoke(-400 + (i % 5) * 160 + 60, -120, t, 1.2)),
], {...o, ...(sway ? {keys: sample(t => ({a: Math.sin(t * 2.2) * 1.5, y: (o.y ?? 0) + Math.sin(t * 2.2 + 1) * 8}), 0, sway)} : {})});
/** Nube de humo que se infla y se va (t0 local). */
export const smoke = (x, y, t0, life = 1.2, s = 1) => [0, 1, 2].map(i => ({...E(0, 0, (90 + i * 30) * s, (70 + i * 24) * s, {fill: '#e6e6e6', lineWidth: 7}), from: r3(t0 + i * 0.05),
  keys: sample(t => { const u = t - t0 - i * 0.05; return {x: x + (i - 1) * 50 * s + u * 60, y: y - u * 120 * s - i * 20, s: mix(0.4, 1.4, eOut(u / 0.4)), alpha: Math.max(0, 1 - u / life)}; }, r3(t0 + i * 0.05), r3(t0 + life + 0.1))}));
/** Cañón sobre ruedas (francés), apuntando a la izquierda. */
export const canon = (o = {}, {fireAt} = {}) => G([
  G([R(-260, -60, 300, 76, {radius: 30, fill: '#2b2b2b', lineWidth: 8}), E(-262, -22, 40, 76, {fill: '#1b1b1b', lineWidth: 7})], {pivotX: 40, pivotY: -22, angle: deg(8),
    ...(fireAt !== undefined ? {keys: [{t: 0, x: 0}, {t: fireAt, x: 0}, {t: r3(fireAt + 0.06), x: 40}, {t: r3(fireAt + 0.4), x: 0}]} : {})}),
  E(20, 30, 130, 130, {fill: WOOD, lineWidth: 8}), E(20, 30, 30, 30, {fill: WOOD2, lineWidth: 5}),
  ...(fireAt !== undefined ? [G([S([['M', -280, -20], ['L', -400, -90], ['L', -360, -20], ['L', -420, 40], ['Z']], '#ffb020', {lineWidth: 6})], {from: fireAt, to: r3(fireAt + 0.12)}), ...smoke(-380, -30, fireAt, 1.3, 1.4)] : []),
], o);
/** Ataúd pequeño (para una pierna), abierto o cerrado; la bota asoma si `peek`. (0,0) = base centro. */
export const ataud = (o = {}, {peek = true, flag = true} = {}) => G([
  ...(peek ? [G([pierna({x: 0, y: 0})], {x: 250, y: -230, angle: deg(-80), scaleX: 0.75, scaleY: 0.75})] : []),
  S([['M', -280, 0], ['L', -330, -110], ['L', -230, -200], ['L', 250, -200], ['L', 320, -110], ['L', 260, 0], ['Z']], '#5a3a22', {lineWidth: 10}),
  P([['M', -300, -100], ['L', 290, -100]], {stroke: '#3a2414', lineWidth: 8}),
  ...(flag ? [S([['M', -230, -200], ['L', 40, -200], ['L', 40, 0], ['L', -270, 0], ['L', -320, -110], ['Z']], MXG, {stroke: 'none'}), R(-110, -200, 90, 200, {radius: 0, fill: PAPER, stroke: 'none'}), R(-20, -200, 60, 200, {radius: 0, fill: RED, stroke: 'none'}),
    S([['M', -280, 0], ['L', -330, -110], ['L', -230, -200], ['L', 250, -200], ['L', 320, -110], ['L', 260, 0], ['Z']], 'none', {lineWidth: 10})] : []),
  ...[-200, 180].map(x => R(x, -60, 40, 20, {radius: 6, fill: GOLD, lineWidth: 5})),
], o);
/** Cojín de terciopelo con la pierna encima, borlas doradas. */
export const cojin = (o = {}) => G([S([['M', -330, 0], ['Q', -350, -90, -300, -110], ['L', 300, -110], ['Q', 350, -90, 330, 0], ['Q', 0, 30, -330, 0], ['Z']], '#8f1f2b', {lineWidth: 10}),
  ...[-330, 330].map(x => G([P([['M', x, -50], ['L', x + Math.sign(x) * 20, 30]], {stroke: GOLD, lineWidth: 8}), E(x + Math.sign(x) * 22, 46, 34, 40, {fill: GOLD, lineWidth: 5})])),
  G([pierna()], {x: 0, y: -150, angle: deg(-90), scaleX: 0.95, scaleY: 0.95})], o);
/** Corona de flores. */
export const corona = (o = {}) => G([...Array.from({length: 12}, (_, i) => { const a = deg(i * 30); return E(Math.cos(a) * 110, Math.sin(a) * 110, 80, 80, {fill: i % 3 === 0 ? RED : i % 3 === 1 ? '#f2a0c0' : PAPER, lineWidth: 6}); }),
  ...Array.from({length: 12}, (_, i) => { const a = deg(i * 30 + 15); return E(Math.cos(a) * 140, Math.sin(a) * 140, 50, 30, {fill: '#4f8a3a', lineWidth: 5}); }),
  S([['M', -40, 100], ['L', -90, 260], ['L', -40, 230], ['L', 0, 120], ['Z']], '#2b2b2b', {lineWidth: 5}), S([['M', 40, 100], ['L', 90, 260], ['L', 40, 230], ['L', 0, 120], ['Z']], '#2b2b2b', {lineWidth: 5})], o);
/** Caballo negro de funeral, de lado mirando a la derecha, con penacho. `trot` = segundos de trote. (0,0) = cascos. */
export function caballo(o = {}, {trot = 0, plume = true} = {}) {
  const C = '#2b2b2b';
  const legK = ph => trot ? sample(t => ({a: Math.sin(t * 12 + ph) * 16}), 0, trot) : undefined;
  const legG = (x, ph, back = false) => G([R(-16, 0, 32, 120, {radius: 14, fill: back ? '#1f1f1f' : C, lineWidth: 7}), R(-11, 110, 22, 90, {radius: 8, fill: back ? '#1f1f1f' : C, lineWidth: 6}), R(-17, 192, 34, 22, {radius: 5, fill: '#6b6f78', lineWidth: 5})],
    {x, y: -230, pivotX: 0, pivotY: 0, ...(legK(ph) ? {keys: legK(ph)} : {})});
  return G([legG(-120, Math.PI, true), legG(140, 0, true),
    S([['M', -210, -250], ['Q', -300, -200, -280, -90], ['Q', -250, -170, -200, -200], ['Z']], INK, {lineWidth: 6}),
    S([['M', -210, -300], ['Q', -220, -390, -100, -385], ['L', 130, -390], ['Q', 230, -380, 220, -280], ['Q', 210, -200, 120, -195], ['L', -130, -195], ['Q', -210, -200, -210, -300], ['Z']], C, {lineWidth: 9}),
    S([['M', 120, -370], ['L', 220, -540], ['L', 300, -510], ['L', 230, -330], ['Z']], C, {lineWidth: 9}),
    S([['M', 215, -560], ['Q', 260, -590, 300, -570], ['L', 380, -470], ['Q', 395, -440, 365, -428], ['L', 300, -440], ['Q', 250, -470, 215, -530], ['Z']], C, {lineWidth: 9}),
    S([['M', 230, -585], ['L', 240, -640], ['L', 262, -582], ['Z']], C, {lineWidth: 6}),
    S([['M', 205, -560], ['Q', 150, -480, 120, -380], ['L', 150, -380], ['Q', 175, -470, 225, -540], ['Z']], INK, {lineWidth: 5}),
    E(285, -535, 20, 20, {fill: PAPER, lineWidth: 4}), E(290, -533, 9, 9, {fill: INK, stroke: 'none'}), E(372, -452, 10, 8, {fill: INK, stroke: 'none'}),
    P([['M', 300, -500], ['L', 160, -330]], {stroke: GOLD, lineWidth: 6}),
    legG(-90, 0), legG(170, Math.PI),
    ...(plume ? [S([['M', 245, -590], ['Q', 225, -690, 275, -730], ['Q', 285, -670, 262, -590], ['Z']], INK, {lineWidth: 5})] : []),
  ], o);
}
/** Carroza fúnebre negra con la caja dentro (cristales). (0,0) = suelo centro; ~700 ancho. */
export const carroza = (o = {}, {roll = 0} = {}) => {
  const wheel = x => G([E(0, 0, 200, 200, {fill: 'none', lineWidth: 12}), ...[0, 45, 90, 135].map(a => P([['M', Math.cos(deg(a)) * -92, Math.sin(deg(a)) * -92], ['L', Math.cos(deg(a)) * 92, Math.sin(deg(a)) * 92]], {lineWidth: 6})), E(0, 0, 40, 40, {fill: GOLD, lineWidth: 5})],
    {x, y: -100, ...(roll ? {keys: sample(t => ({a: t * 360}), 0, roll)} : {})});
  return G([R(-340, -620, 680, 440, {radius: 10, fill: '#1b1d26', lineWidth: 10}), R(-300, -580, 600, 300, {radius: 6, fill: '#cfe8f5', lineWidth: 8}),
    ataud({x: 0, y: -300, scaleX: 0.75, scaleY: 0.75}, {peek: false}),
    ...[-150, 0, 150].map(x => P([['M', x, -580], ['L', x, -280]], {lineWidth: 6})),
    S([['M', -360, -620], ['L', 0, -720], ['L', 360, -620], ['Z']], '#1b1d26', {lineWidth: 9}),
    ...[-340, 0, 340].map(x => S([['M', x, -680], ['Q', x - 30, -790, x, -830], ['Q', x + 30, -790, x, -680], ['Z']], INK, {lineWidth: 5})),
    R(-360, -200, 720, 40, {radius: 6, fill: GOLD, lineWidth: 7}), wheel(-220), wheel(220)], o);
};
/** Antorcha (para la turba): palo + llama que tiembla. */
export const antorcha = (o = {}, dur = 0) => G([R(-10, 0, 20, 200, {radius: 6, fill: WOOD, lineWidth: 6}), G([S([['M', 0, -110], ['Q', 46, -40, 20, 10], ['Q', 0, -20, -20, 10], ['Q', -46, -40, 0, -110], ['Z']], '#ffb020', {lineWidth: 6}), S([['M', 0, -60], ['Q', 18, -20, 8, 4], ['Q', 0, -10, -8, 4], ['Q', -18, -20, 0, -60], ['Z']], YEL, {stroke: 'none'})],
  {pivotX: 0, pivotY: 10, ...(dur ? {keys: sample(t => ({sx: 1 + Math.sin(t * 19) * 0.1, a: Math.sin(t * 11) * 8}), 0, dur)} : {})})], o);
/** Cartel de protesta. */
export const cartel = (text, o = {}) => G([R(-10, 0, 20, 220, {radius: 6, fill: WOOD, lineWidth: 6}), R(-170, -150, 340, 160, {radius: 8, fill: PAPER, lineWidth: 8}), ctext(text, 0, -136, 54, {maxW: 300, color: RED})], o);
/** Plato con pollo asado (con cabeza: guiño al EXP 002) y patas. */
export const polloAsado = (o = {}) => G([E(0, 0, 360, 70, {fill: PAPER, lineWidth: 8}), E(-10, -60, 230, 130, {fill: '#c97a2e', lineWidth: 9}), E(-40, -86, 70, 30, {fill: '#e0a050', stroke: 'none'}),
  ...[[60, -40, 130], [70, -20, 150]].map(([x, y, l], i) => G([R(0, -12, l, 24, {radius: 12, fill: '#c97a2e', lineWidth: 6}), E(l, 0, 40, 40, {fill: PAPER, lineWidth: 5})], {x, y, angle: deg(-20 + i * 14)})),
  E(-130, -110, 70, 70, {fill: '#c97a2e', lineWidth: 7}), E(-140, -120, 14, 14, {fill: INK, stroke: 'none'}), S([['M', -164, -110], ['L', -196, -100], ['L', -164, -92], ['Z']], '#ffb020', {lineWidth: 4}), S([['M', -140, -144], ['Q', -150, -172, -126, -170], ['Q', -110, -176, -116, -146], ['Z']], RED, {lineWidth: 4})], o);
/** Mesa sencilla (centro, altura de tablero `top`). */
export const mesa = (o = {}, w = 640) => G([R(-w / 2, -300, w, 40, {radius: 6, fill: WOOD, lineWidth: 8}), R(-w / 2 + 30, -260, 28, 260, {radius: 4, fill: WOOD2, lineWidth: 6}), R(w / 2 - 58, -260, 28, 260, {radius: 4, fill: WOOD2, lineWidth: 6})], o);
/** Vitrina de museo con candado. (0,0) = suelo centro. */
export const vitrina = (o = {}, inner = []) => G([R(-260, -260, 520, 260, {radius: 6, fill: '#6b4423', lineWidth: 9}), R(-240, -880, 480, 620, {radius: 6, fill: 'rgba(207,232,245,0.55)', lineWidth: 9}), ...inner,
  P([['M', -180, -820], ['L', -100, -720]], {stroke: PAPER, lineWidth: 10}), P([['M', -190, -720], ['L', -150, -670]], {stroke: PAPER, lineWidth: 8}),
  R(-250, -900, 500, 40, {radius: 6, fill: '#6b4423', lineWidth: 8}),
  G([E(0, -40, 70, 70, {fill: 'none', stroke: '#9aa3ab', lineWidth: 14}), R(-50, -20, 100, 90, {radius: 12, fill: GOLD, lineWidth: 7}), E(0, 18, 18, 18, {fill: INK, stroke: 'none'})], {x: 0, y: -160})], o);
/** Factura / pergamino que se desenrolla hacia abajo hasta `len` entre t0 y t1. */
export function factura(x, y, t0, t1, len, d, lines = []) {
  const k = t => mix(0.18, 1, eOut((t - t0) / Math.max(0.01, t1 - t0)));
  return G([G([R(-170, 0, 340, len, {radius: 4, fill: PAPER, lineWidth: 8}), ...Array.from({length: Math.floor(len / 60)}, (_, i) => P([['M', -120, 50 + i * 60], ['L', i % 3 ? 120 : 40, 50 + i * 60]], {stroke: '#9aa3ab', lineWidth: 6})), ...lines],
    {pivotX: 0, pivotY: 0, keys: sample(t => ({sy: k(t)}), 0, d)}), R(-190, -26, 380, 52, {radius: 26, fill: '#e8dcb8', lineWidth: 8})], {x, y});
}
/** Saco de dinero. */
export const sacoDinero = (o = {}) => G([S([['M', -110, 0], ['Q', -150, -150, -50, -200], ['L', -70, -250], ['L', 70, -250], ['L', 50, -200], ['Q', 150, -150, 110, 0], ['Z']], '#c9a24a', {lineWidth: 9}), P([['M', -60, -205], ['L', 60, -205]], {stroke: '#7d5229', lineWidth: 10}), ctext('$', 0, -150, 110, {maxW: 120, color: '#5a3a22'})], o);
/** Pala. */
export const pala = (o = {}) => G([R(-8, -300, 16, 300, {radius: 6, fill: WOOD, lineWidth: 6}), S([['M', -50, 0], ['L', 50, 0], ['L', 40, 100], ['Q', 0, 130, -40, 100], ['Z']], '#9aa3ab', {lineWidth: 7})], o);
/** Atril de discursos. */
export const atril = (o = {}) => G([S([['M', -130, -300], ['L', 130, -300], ['L', 90, 0], ['L', -90, 0], ['Z']], WOOD, {lineWidth: 9}), R(-150, -340, 300, 50, {radius: 6, fill: WOOD2, lineWidth: 8}), E(0, -170, 90, 90, {fill: GOLD, lineWidth: 6})], o);
/** Banderita (mano): mx = México, fr = Francia. */
export const banderita = (kind = 'fr', o = {}) => G([R(-6, -260, 12, 260, {radius: 4, fill: WOOD2, lineWidth: 5}),
  ...(kind === 'fr' ? [R(6, -260, 50, 100, {radius: 0, fill: FRB, lineWidth: 5}), R(56, -260, 50, 100, {radius: 0, fill: PAPER, lineWidth: 5}), R(106, -260, 50, 100, {radius: 0, fill: RED, lineWidth: 5})]
    : [R(6, -260, 50, 100, {radius: 0, fill: MXG, lineWidth: 5}), R(56, -260, 50, 100, {radius: 0, fill: PAPER, lineWidth: 5}), R(106, -260, 50, 100, {radius: 0, fill: RED, lineWidth: 5}), E(81, -210, 22, 22, {fill: '#8a5a33', stroke: 'none'})])], o);
/** Rodillo de amasar. */
export const rodillo = (o = {}) => G([R(-30, -40, 60, 80, {radius: 12, fill: WOOD2, lineWidth: 6}), R(-50, 40, 100, 220, {radius: 40, fill: '#e0b070', lineWidth: 8}), R(-30, 260, 60, 80, {radius: 12, fill: WOOD2, lineWidth: 6})], o);
/** Muleta. */
export const muleta = (o = {}) => G([R(-8, -60, 16, 380, {radius: 6, fill: WOOD, lineWidth: 6}), R(-50, -76, 100, 26, {radius: 12, fill: WOOD2, lineWidth: 6}), R(-24, 120, 48, 14, {radius: 4, fill: WOOD2, lineWidth: 4})], o);
/** Mar con olas (de y hacia abajo). */
export const mar = (y, d) => [{type: 'rect', x: -60, y, w: 1400, h: 1400, radius: 0, fill: '#3d7fb8', stroke: 'none'},
  ...Array.from({length: 4}, (_, r) => G(Array.from({length: 9}, (_, i) => P([['M', i * 180 - 40, 0], ['Q', i * 180 + 20, -26, i * 180 + 80, 0]], {stroke: '#bfe3f7', lineWidth: 8})), {y: y + 60 + r * 120, keys: sample(t => ({x: Math.sin(t * 1.6 + r) * 40 - r * 40}), 0, d)}))];
/** Muelle de Veracruz: tablones. */
export const muelle = (y) => [{type: 'rect', x: -60, y, w: 1400, h: 900, radius: 0, fill: '#b08452', stroke: 'none'}, ...Array.from({length: 10}, (_, i) => P([['M', -60, y + 40 + i * 70], ['L', 1340, y + 40 + i * 70]], {stroke: '#8a6236', lineWidth: 6}))];
