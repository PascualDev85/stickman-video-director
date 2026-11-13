// Kit de personajes de LayBo (canal de perros): Layla y Dobby, articulados como El Becario.
// v2 «cartoon realista»: siluetas calcadas de las fotos (pecho profundo, cintura recogida, muslos fuertes,
// hocico largo con belfos, orejas en rosa con el interior rosa, ojos almendrados de color), sombra en dos tonos.
// Funciones puras que devuelven capas B3 declarativas. Reutiliza primitivas y humano de El Becario (sin duplicar).
// Unidades: plano de diseño (ancho 1280). Origen del perro = suelo, centro del cuerpo. Mira a la derecha (`flip` lo gira).
import {INK, PAPER, LW, deg, P, E, R, G, S, osc, blinks, person} from '../el-becario/kit.mjs';
export {INK, PAPER, LW, deg, P, E, R, G, S, osc, blinks, person};

const r3 = n => Math.round(n * 1000) / 1000;
const NONE = {stroke: 'none'};
const OL = 8; // contorno de los perros (algo más fino que el de El Becario: más realista)
const TONGUE = '#ec7d93', TONGUE_D = '#c4516b', MOUTH = '#4a1c1c', EAR_IN = '#d99a8f';
const tubeL = (pts, w, o = {}) => P([['M', ...pts[0]], ...pts.slice(1).map(p => ['L', ...p])], {lineWidth: w, ...o});

// ---------- fichas ----------
export const DOGS = {
  layla: { // pitbull × amstaff: leonado oscuro, máscara oscura, raya blanca, pecho y patas blancas, trufa negra
    coat: '#c98a4e', shade: '#a86d38', dark: '#7a4a26', light: '#ddA466', white: '#fbf3e6', muzzle: '#fbf3e6', jaw: '#fbf3e6', nose: '#1d1a19', iris: '#a8701f',
    lips: '#1d1a19', mask: '#6a4326', ear: '#8a5530', blaze: 12, chest: true, paws: true, collar: '#2c3a4d', tag: '#e2b53e',
    size: 0.94, len: 1.0, legH: 0.82, bulk: 1.18, headW: 1.08, muzzleL: 128, tail: {w: 24, l: 118}, ears: 'rose', tongue: 'tri',
  },
  dobby: { // pitbull × labrador: beige claro, alto, patas largas, cola larga y fina, hocico blanco, trufa marrón rosada
    coat: '#e2bd8b', shade: '#c79f6b', dark: '#a9824f', light: '#efd3aa', white: '#fbf6ee', muzzle: '#e9c899', jaw: '#f4e7d6', nose: '#3a2e2b', noseSpot: '#e3a0a0', iris: '#5e3518',
    lips: '#c98282', mask: null, ear: '#d2a56f', blaze: 7, blazeToNose: true, chest: true, paws: false, collar: '#8d939c', tag: null,
    size: 1.0, len: 1.1, legH: 1.16, bulk: 0.96, headW: 0.92, muzzleL: 150, tail: {w: 15, l: 178}, ears: 'back', tongue: 'long',
  },
};

// ---------- poses (grados; patas: delantera [hombro, muñeca], trasera [cadera, rodilla, corvejón]) ----------
export const POSES = {
  pie:      {body: 0,   fN: [4, -6],    fF: [-6, 4],    bN: [-22, 52, -30], bF: [-12, 46, -34], head: 0,   tail: 0,   ground: true},
  sentado:  {body: -34, fN: [36, -4],   fF: [30, 0],    bN: [-88, 150, -62], bF: [-82, 150, -66], head: 22, tail: 70, ground: true, sit: true},
  tumbado:  {body: 0,   fN: [-84, -6],  fF: [-78, -10], bN: [-84, 160, -76], bF: [-80, 158, -78], head: 18,  tail: 80, ground: true, lie: true},
  carrera:  {body: -6,  fN: [-62, 30],  fF: [-48, 50],  bN: [38, 30, -20],   bF: [52, 20, -10],   head: 4,   tail: -18},
  salto:    {body: -22, fN: [-118, 120], fF: [-104, 112], bN: [40, 40, -14], bF: [54, 30, -6],    head: -6,  tail: -26},
  agachado: {body: 9,   fN: [-14, 24],  fF: [-20, 28],  bN: [-58, 104, -52], bF: [-52, 100, -54], head: 22,  tail: 150, ground: true},
  pata:     {body: -54, fN: [-30, 50],  fF: [44, 20],   bN: [-26, 132, -150], bF: [-22, 130, -152], head: 24, tail: 110, ground: true, sit: true, butt: true},
  panza:    {body: 0,   fN: [-14, 100], fF: [4, 92],    bN: [-34, 84, -46],  bF: [-10, 74, -56], head: 118, tail: -40, belly: true},
};

// ---------- geometría ----------
function geo(d) {
  const bk = d.bulk, Lh = 200 * d.legH, D = 124 * bk, B = 132 * d.len, ycb = -Lh, yb = ycb - D;
  const fP = [B - 30, yb + D * 0.45], bP = [-B + 36, yb + D * 0.35];
  const Lf = -fP[1], Lb = -bP[1];
  const thin = d.legH > 1 ? 0.92 : 1;
  return {Lh, D, B, ycb, yb, fP, bP, fL: [Lf * 0.52, Lf * 0.48], bL: [Lb * 0.42, Lb * 0.34, Lb * 0.27],
    fW: [[58 * bk, 36 * bk * thin], [32 * bk * thin, 27 * bk * thin]], bW: [[108 * bk, 48 * bk * thin], [40 * bk * thin, 27 * bk * thin], [27 * bk * thin, 26 * bk * thin]],
    neck: [B - 4, yb + 16]};
}
function tip(start, lens, angs) { let x = start[0], y = start[1], a = 0; lens.forEach((l, i) => { a += deg(angs[i]); x += -Math.sin(a) * l; y += Math.cos(a) * l; }); return [x, y]; }
const rot = ([x, y], a, [px, py]) => [px + (x - px) * Math.cos(a) - (y - py) * Math.sin(a), py + (x - px) * Math.sin(a) + (y - py) * Math.cos(a)];

// Segmento ahusado (ancho w0 arriba, w1 abajo), con remates redondos.
const segPath = (l, w0, w1) => [['M', -w0 / 2, 0], ['Q', 0, -w0 * 0.62, w0 / 2, 0], ['Q', w0 * 0.42 + w1 * 0.08, l * 0.5, w1 / 2, l], ['Q', 0, l + w1 * 0.62, -w1 / 2, l], ['Q', -w0 * 0.42 - w1 * 0.08, l * 0.5, -w0 / 2, 0], ['Z']];
// Pata: el color del segmento superior se pinta después del inferior (sin costura). `openTop`: el muslo no tiene
// contorno arriba (se funde con el cuerpo).
function legChain(lens, widths, angs, color, pawFill, {keys = [], openTop = false, shadeLine} = {}) {
  let inner = null;
  for (let i = lens.length - 1; i >= 0; i--) {
    const l = lens[i], [w0, w1] = widths[i], path = segPath(l, w0, w1);
    const kids = [];
    if (openTop && i === 0) kids.push(P([['M', -w0 * 0.36, l * 0.66], ['Q', -w1 * 0.6, l * 0.86, -w1 / 2, l], ['Q', 0, l + w1 * 0.62, w1 / 2, l], ['Q', w0 * 0.3, l * 0.7, w0 * 0.38, l * 0.42]], {lineWidth: OL}));
    else kids.push(S(path, color, {lineWidth: OL}));
    if (i === lens.length - 1) { // pata con dedos
      const pw = w1 * 1.7, ph = w1 * 0.78;
      kids.push(S([['M', -w1 * 0.55, l - ph * 0.2], ['Q', -w1 * 0.6, l + ph * 0.75, w1 * 0.1, l + ph * 0.72], ['L', pw * 0.62, l + ph * 0.72], ['Q', pw * 0.82, l + ph * 0.3, pw * 0.5, l - ph * 0.1], ['Q', w1 * 0.2, l - ph * 0.5, -w1 * 0.55, l - ph * 0.2], ['Z']], pawFill, {lineWidth: OL - 1}),
        P([['M', pw * 0.22, l + ph * 0.18], ['L', pw * 0.26, l + ph * 0.7]], {lineWidth: 4}), P([['M', pw * 0.44, l + ph * 0.12], ['L', pw * 0.48, l + ph * 0.66]], {lineWidth: 4}));
    }
    if (inner) kids.push(inner);
    kids.push(S(path, color, NONE));
    if (i === lens.length - 1 && pawFill !== color) kids.push(G([S(segPath(l * 0.45, w1 * 0.96, w1 * 0.96), pawFill, NONE)], {y: l * 0.55}));
    if (shadeLine && i === 0) kids.push(P([['M', w0 * 0.22, l * 0.2], ['Q', w0 * 0.3, l * 0.6, w1 * 0.1, l * 0.95]], {stroke: shadeLine, lineWidth: 7}));
    inner = G(kids, {...(i ? {y: lens[i - 1]} : {}), angle: deg(angs[i]), pivotX: 0, pivotY: 0, ...(keys[i] ? {keys: keys[i]} : {})});
  }
  return inner;
}

// ---------- cara ----------
// expr: reposo | contenta | seria | habla | reojo | boba | dormido | miedo | caza | carinosa
const EXPR = {
  reposo:   {eyes: 'happy', brows: 'soft', open: 0.5, tongue: true, smile: true, grin: true},
  contenta: {eyes: 'dot',   brows: 'up',   open: 0.42, tongue: true, smile: true},
  seria:    {eyes: 'dot',   lids: [0.42, 0.42], brows: 'low', open: 0, tongue: false},
  habla:    {eyes: 'dot',   lids: [0.22, 0.22], brows: 'flat', open: 0.38, tongue: false},
  reojo:    {eyes: 'side',  lids: [0.5, 0.5], brows: 'raise', open: 0, tongue: false},
  boba:     {eyes: 'derp',  brows: 'up',   open: 0.45, tongue: true},
  dormido:  {eyes: 'sleep', brows: 'soft', open: 0.12, tongue: true},
  miedo:    {eyes: 'wide',  brows: 'worry', open: 0.18, tongue: false, ears: 'back'},
  caza:     {eyes: 'focus', brows: 'low',  open: 0.85, tongue: false},
  carinosa: {eyes: 'happy', brows: 'soft', open: 0.1, tongue: false, smile: true},
};
// Ojo almendrado (iris de color + pupila + brillo), con párpado del color del pelo.
function almond(cx, cy, w, h, d, {kind = 'dot', lid = 0, look = 0, far = false} = {}) {
  const shape = [['M', cx - w / 2, cy + h * 0.08], ['Q', cx - w * 0.1, cy - h * 0.95, cx + w / 2, cy - h * 0.1], ['Q', cx + w * 0.1, cy + h * 0.85, cx - w / 2, cy + h * 0.08], ['Z']];
  if (kind === 'happy') return [P([['M', cx - w / 2, cy + 2], ['Q', cx, cy - h * 0.8, cx + w / 2, cy]], {lineWidth: far ? 6 : 7})];
  if (kind === 'sleep') return [P([['M', cx - w / 2, cy - 2], ['Q', cx, cy + h * 0.55, cx + w / 2, cy - 4]], {lineWidth: far ? 6 : 7})];
  const out = [];
  const sclera = ['wide', 'derp', 'side'].includes(kind);
  const k = kind === 'wide' ? 1.25 : 1;
  const sh = k === 1 ? shape : [['M', cx - w * 0.6, cy], ['Q', cx, cy - h * 1.25, cx + w * 0.6, cy - 2], ['Q', cx, cy + h * 1.1, cx - w * 0.6, cy], ['Z']];
  out.push(S(sh, sclera ? '#fbf7f0' : d.iris, {lineWidth: far ? 4 : 5}));
  let ix = cx + look * w * 0.18, iy = cy - h * 0.05;
  if (kind === 'derp') { ix = far ? cx + w * 0.2 : cx - w * 0.22; iy = far ? cy + h * 0.12 : cy - h * 0.18; }
  if (kind === 'side') ix = cx - w * 0.24;
  if (kind === 'focus') ix = cx + w * 0.16;
  const ir = sclera ? (kind === 'wide' ? 0.42 : 0.55) : 0.62;
  if (sclera) out.push(E(ix, iy, w * ir, h * ir * 1.25, {fill: d.iris, stroke: 'none'}));
  out.push(E(ix, iy, w * ir * 0.5, h * ir * 0.62, {fill: '#120c0a', stroke: 'none'}), E(ix + w * 0.1, iy - h * 0.2, w * 0.16, w * 0.16, {fill: PAPER, stroke: 'none'}));
  if (lid > 0) { const ly = cy - h * 0.72 + h * 1.3 * lid;
    out.push(S([['M', cx - w * 0.62, cy - h], ['L', cx + w * 0.62, cy - h], ['L', cx + w * 0.62, ly - 2], ['Q', cx, ly - h * 0.12, cx - w * 0.62, ly + 2], ['Z']], d.coat, NONE),
      P([['M', cx - w * 0.52, ly + 1], ['Q', cx, ly - h * 0.14, cx + w * 0.52, ly - 2]], {lineWidth: 5})); }
  return out;
}
const BROWS = {soft: [-6, -6], up: [-14, -10], flat: [0, 0], low: [10, 8], raise: [8, -20], worry: [-18, -18]};

function jawKeys(talk, dur, base) {
  if (!talk) return null;
  const ks = [];
  if (talk.env) { const fps = talk.fps || 30; for (let i = 0; i < talk.env.length && i / fps <= dur + 1e-6; i++) ks.push([r3(i / fps), Math.max(base, talk.env[i])]); }
  else { const on = t => talk.some(([a, b]) => t >= a && t <= b); for (let t = 0; t < dur - 1e-6; t = r3(t + 1 / 15)) ks.push([t, on(t) ? Math.max(base, 0.25 + 0.75 * Math.abs(Math.sin(t * Math.PI * 4.6 + Math.sin(t * 7) * 0.8))) : base]); }
  if (ks.length && ks.at(-1)[0] < dur) ks.push([r3(dur), ks.at(-1)[1]]);
  return ks;
}

/** Oreja en rosa (doblada hacia atrás) con el interior rosa. */
function roseEar(d, back = false) {
  return back
    ? [S([['M', 0, 0], ['Q', -30, -30, -78, -18], ['Q', -96, 4, -70, 22], ['Q', -36, 26, 0, 0], ['Z']], d.ear, {lineWidth: OL}),
      S([['M', -10, 2], ['Q', -36, -16, -66, -10], ['Q', -44, 4, -10, 2], ['Z']], EAR_IN, NONE)]
    : [S([['M', 4, 4], ['Q', -8, -44, -54, -46], ['Q', -82, -30, -70, 2], ['Q', -40, 16, 4, 4], ['Z']], d.ear, {lineWidth: OL}),
      S([['M', -4, 0], ['Q', -16, -30, -48, -34], ['Q', -36, -10, -4, 0], ['Z']], EAR_IN, NONE),
      P([['M', -4, 0], ['Q', -16, -30, -48, -34]], {stroke: d.dark, lineWidth: 5})];
}

/** Cabeza 3/4 mirando a la derecha. Origen = centro del cráneo. */
function head3q(d, {expr = 'reposo', look, tongue, ears, prop, talk, dur = 0, blink = true, earKeys} = {}) {
  const X = EXPR[expr] || EXPR.reposo, ML = d.muzzleL, open = X.open, tng = tongue ?? X.tongue;
  const lids = X.lids || [0, 0], lk = look ?? 0, hw = d.headW;
  const earBack = (ears || X.ears || d.ears) === 'back';
  const farEar = G(roseEar(d, earBack), {x: 46, y: -72, scaleX: 0.62, scaleY: 0.62, angle: deg(earBack ? -10 : 6)});
  const nearEar = G(roseEar(d, earBack), {x: -22, y: -60, pivotX: 0, pivotY: 0, angle: deg(X.ears === 'back' ? -40 : -24), ...(earKeys ? {keys: earKeys} : {})});
  // contorno de la cabeza: cráneo, stop, caña nasal, trufa, belfos que cuelgan, mejilla
  const W = x => x < 0 ? x * hw : x;
  const outline = [['M', W(-74), 26], ['Q', W(-92), -44, W(-34), -74], ['Q', 18, -94, 62, -64], ['Q', 74, -54, 86, -44], ['L', ML - 8, -38],
    ['Q', ML + 16, -36, ML + 18, -14], ['Q', ML + 18, 8, ML - 2, 16], ['Q', ML - 30, 22, ML - 50, 30], ['Q', ML - 70, 50, 64, 46], ['Q', 20, 66, W(-30), 58], ['Q', W(-72), 50, W(-74), 26], ['Z']];
  const muzzleFill = [['M', 82, -40], ['L', ML - 8, -34], ['Q', ML + 12, -32, ML + 13, -14], ['Q', ML + 13, 4, ML - 4, 11], ['Q', ML - 30, 18, ML - 50, 25], ['Q', ML - 70, 44, 66, 40], ['Q', 50, 2, 82, -40], ['Z']];
  const bw = d.blaze;
  const blaze = S([['M', 6 - bw * 0.6, -84], ['Q', 14, -90, 20 + bw * 0.6, -84], ['Q', 50, -62, 94, -40], ['Q', 84, -18, 66, -10], ['Q', 40, -50, 6 - bw * 0.6, -84], ['Z']], d.white, NONE);
  const stripe = d.blazeToNose ? [S([['M', 80, -44], ['Q', 110, -46, ML - 4, -40], ['L', ML - 6, -32], ['Q', 110, -34, 74, -32], ['Z']], d.white, NONE)] : [];
  const mask = d.mask ? [E(14, -34, 54, 36, {fill: d.mask, stroke: 'none', alpha: 0.45}), E(64, -40, 32, 26, {fill: d.mask, stroke: 'none', alpha: 0.45})] : [];
  const lip = P([['M', ML - 2, 16], ['Q', ML - 30, 22, ML - 50, 30], ['Q', ML - 70, 50, 64, 46], ...(X.grin ? [['Q', 44, 44, 30, 26]] : [])], {stroke: d.lips, lineWidth: X.grin ? 12 : 10});
  const nose = [S([['M', ML - 6, -42], ['Q', ML + 16, -48, ML + 24, -32], ['Q', ML + 26, -16, ML + 10, -12], ['Q', ML - 6, -12, ML - 10, -26], ['Q', ML - 12, -38, ML - 6, -42], ['Z']], d.nose, {lineWidth: 6}),
    P([['M', ML + 8, -24], ['Q', ML + 16, -20, ML + 20, -26]], {stroke: '#000', lineWidth: 4}), E(ML + 4, -38, 14, 7, {fill: 'rgba(255,255,255,0.4)', stroke: 'none'}), ...(d.noseSpot ? [E(ML + 2, -16, 18, 8, {fill: d.noseSpot, stroke: 'none'})] : [])];
  // boca
  const k = jawKeys(talk, dur, open), jawAng = o => deg(2 + o * 24);
  const jx = ML - 24;
  const tongueShape = d.tongue === 'tri'
    ? [S([['M', jx - 56, 30], ['L', jx - 8, 26], ['Q', jx - 12, 74, jx - 30, 88], ['Q', jx - 48, 76, jx - 56, 30], ['Z']], TONGUE, {lineWidth: 6}), P([['M', jx - 30, 36], ['L', jx - 30, 74]], {stroke: TONGUE_D, lineWidth: 5})]
    : [S([['M', jx - 66, 30], ['L', jx - 14, 26], ['Q', jx - 8, 84, jx - 26, 118], ['Q', jx - 50, 132, jx - 58, 100], ['Q', jx - 64, 66, jx - 66, 30], ['Z']], TONGUE, {lineWidth: 6}), P([['M', jx - 40, 36], ['Q', jx - 38, 80, jx - 42, 112]], {stroke: TONGUE_D, lineWidth: 5})];
  const jaw = G([S([['M', 56, 36], ['Q', jx - 26, 34, jx, 24], ['Q', jx + 6, 40, jx - 14, 50], ['Q', jx - 60, 64, 56, 52], ['Z']], d.jaw, {lineWidth: OL}), ...(tng ? tongueShape : [])],
    {pivotX: 60, pivotY: 40, angle: jawAng(open), ...(k ? {keys: k.map(([t, o]) => ({t, angle: r3(jawAng(o))}))} : {})});
  const inside = G([E((60 + jx) / 2 - (X.grin ? 10 : 0), 40, jx - 50 + (X.grin ? 30 : 0), 44, {fill: MOUTH, stroke: 'none'})], {pivotX: 60, pivotY: 24, scaleY: 0.2 + open, ...(k ? {keys: k.map(([t, o]) => ({t, scaleY: r3(0.2 + o)}))} : {})});
  // sombras y detalles
  const cheekShade = P([['M', W(-50), 34], ['Q', -10, 50, 40, 42]], {stroke: d.shade, lineWidth: 9});
  const browSh = BROWS[X.brows] || BROWS.soft;
  const brows = [P([['M', -6, -60 + browSh[0] * 0.3], ['L', 30, -60 + browSh[0]]], {stroke: d.dark, lineWidth: 10}), P([['M', 52, -60 + browSh[1]], ['L', 72, -56 + browSh[1] * 0.3]], {stroke: d.dark, lineWidth: 8})];
  const eyesL = [...almond(14, -34, 36, 26, d, {kind: X.eyes, lid: lids[0], look: lk}), ...almond(64, -40, 22, 20, d, {kind: X.eyes, lid: lids[1], look: lk, far: true})];
  const eyes = G(eyesL, {pivotX: 40, pivotY: -38, ...(blink && dur && ['dot', 'side', 'focus', 'wide'].includes(X.eyes) ? {keys: blinks(dur, 3.1, 0.9)} : {})});
  const smile = X.smile && !X.grin ? [P([['M', 62, 44], ['Q', 50, 40, 46, 28]], {stroke: d.lips, lineWidth: 7})] : [];
  const whisk = [0, 1, 2].map(i => E(ML - 46 + i * 14, -4 + i * 4, 5, 5, {fill: d.dark, stroke: 'none'}));
  return G([farEar, inside, jaw, S(outline, d.coat, NONE), S(muzzleFill, d.muzzle, NONE), blaze, ...stripe, ...mask, cheekShade, S(outline, 'none', {lineWidth: OL}), lip,
    ...nose, ...whisk, ...smile, eyes, ...brows, nearEar, ...(prop ? [prop] : [])]);
}

// ---------- perro de lado ----------
/**
 * dog({who:'layla'|'dobby', x, y, scale, flip, pose, expr, look, tongue, ears, headAngle, tailAngle, legs:{fN..},
 *      prop (en la boca), talk (spans o {env,fps}), idle:{dur}, wag:{dur,period,amp}, walk:{dur,period}, zzz, move, alpha, from, to})
 */
export function dog({who = 'layla', x = 0, y = 0, scale = 1, flip = false, pose = 'pie', expr, look, tongue, ears, headAngle, tailAngle, prop,
  talk, idle, wag, walk, move, alpha, from, to, zzz = false, extra = [], legs: legOv = {}} = {}) {
  const d = DOGS[who], g = geo(d), p = {...(POSES[pose] || POSES.pie), ...legOv};
  const dur = idle?.dur ?? walk?.dur ?? wag?.dur ?? 0;
  expr ??= who === 'dobby' ? 'boba' : 'reposo';
  const wk = (ph, amp) => walk ? osc(walk.dur, walk.period || 0.5, amp, {phase: ph}) : undefined;
  const shiftK = (keys, base) => keys?.map(k => ({t: k.t, angle: r3(k.angle + deg(base))}));
  const pawN = d.paws ? d.white : d.coat, pawF = d.paws ? '#e2d6c4' : d.shade;
  const legs = {
    fF: legChain(g.fL, g.fW, p.fF, d.shade, pawF, {keys: [shiftK(wk(Math.PI, 20), p.fF[0])]}),
    bF: legChain(g.bL, g.bW, p.bF, d.shade, pawF, {keys: [shiftK(wk(0, 18), p.bF[0])], openTop: true}),
    fN: legChain(g.fL, g.fW, p.fN, d.coat, pawN, {keys: [shiftK(wk(0, 20), p.fN[0])], shadeLine: d.shade}),
    bN: legChain(g.bL, g.bW, p.bN, d.coat, pawN, {keys: [shiftK(wk(Math.PI, 18), p.bN[0])], openTop: true, shadeLine: d.shade}),
  };
  const place = (l, [px, py], dx = 0) => G([l], {x: px + dx, y: py});
  const {B, D, yb, ycb} = g;
  // tronco: cruz, lomo, pecho profundo, cintura recogida, nalga
  const torsoP = [['M', -B + 24, yb + 8], ['Q', -B * 0.1, yb + 2, B * 0.4, yb - 6], ['Q', B * 0.75, yb - 8, B + 10, yb + D * 0.12], ['Q', B + 40, yb + D * 0.35, B + 34, yb + D * 0.62],
    ['Q', B + 22, ycb + 8, B - 34, ycb + 6], ['Q', B * 0.15, ycb + 6, -B * 0.2, ycb - D * 0.2], ['Q', -B * 0.5, ycb - D * 0.46, -B * 0.72, ycb - D * 0.42],
    ['Q', -B - 6, ycb - D * 0.36, -B - 24, yb + D * 0.5], ['Q', -B - 30, yb + 6, -B + 24, yb + 8], ['Z']];
  const torso = S(torsoP, d.coat, {lineWidth: OL});
  const belly = S([['M', B - 30, ycb - 4], ['Q', B * 0.15, ycb - 2, -B * 0.2, ycb - D * 0.24], ['Q', -B * 0.35, ycb - D * 0.36, -B * 0.5, ycb - D * 0.44], ['Q', -B * 0.2, ycb - D * 0.36, B * 0.1, ycb - D * 0.2], ['Q', B * 0.5, ycb - D * 0.14, B - 30, ycb - 4], ['Z']], d.shade, NONE);
  const ribs = P([['M', B * 0.05, ycb - D * 0.55], ['Q', B * 0.18, ycb - D * 0.3, B * 0.1, ycb - D * 0.1]], {stroke: d.shade, lineWidth: 7});
  const backHi = P([['M', -B * 0.6, yb + 16], ['Q', 0, yb + 8, B * 0.4, yb + 6]], {stroke: d.light, lineWidth: 10});
  const shoulder = P([['M', B * 0.42, yb + 14], ['Q', B * 0.62, yb + D * 0.4, B * 0.56, yb + D * 0.7]], {stroke: d.shade, lineWidth: 8});
  const chest = d.chest ? [S([['M', B + 10, yb + D * 0.2], ['Q', B + 36, yb + D * 0.32, B + 30, yb + D * 0.62], ['Q', B + 18, ycb + 2, B - 36, ycb + 1], ['Q', B - 30, yb + D * 0.6, B - 20, yb + D * 0.4], ['Q', B - 10, yb + D * 0.26, B + 10, yb + D * 0.2], ['Z']], d.white, NONE)] : [];
  // cola (ahusada, con meneo)
  const tl = d.tail.l, tw = d.tail.w;
  const tailK = wag ? osc(wag.dur, wag.period || 0.32, wag.amp ?? 16, {base: tailAngle ?? p.tail}) : idle ? osc(idle.dur, 1.4, 6, {base: tailAngle ?? p.tail}) : undefined;
  const tail = G([S([['M', 8, -tw / 2], ['Q', -tl * 0.45, -tw * 0.5 - tl * 0.2, -tl, -tl * 0.6], ['Q', -tl * 0.5, tw * 0.3 - tl * 0.1, 8, tw / 2], ['Z']], d.coat, {lineWidth: OL})],
    {x: -B + 6, y: yb + 22, pivotX: 0, pivotY: 0, angle: deg(tailAngle ?? p.tail), ...(tailK ? {keys: tailK} : {})});
  // cuello musculoso + cabeza (pivote en la base). Collar tapando la unión.
  const [nx, ny] = g.neck;
  const cx = -0.6 * B + 4, thY = D * 0.5 - 16; // cruz y pecho en coordenadas del cuello
  const neckFill = S([['M', cx, -18], ['Q', -60, -80, 0, -104], ['L', 100, -70], ['Q', 80, 0, 44, thY], ['Q', 0, thY + 30, cx + 20, 20], ['Z']], d.coat, NONE);
  const neckLines = [P([['M', cx, -20], ['Q', -60, -66, 0, -102]], {lineWidth: OL}), P([['M', 44, thY], ['Q', 74, 4, 98, -64]], {lineWidth: OL}),
    P([['M', 20, 24], ['Q', 40, -24, 66, -60]], {stroke: d.shade, lineWidth: 8})];
  const throat = d.chest ? [S([['M', 38, thY + 6], ['Q', 66, 4, 92, -64], ['L', 66, -54], ['Q', 40, 0, 0, thY + 14], ['Z']], d.white, NONE)] : [];
  const collar = [S([['M', -40, -66], ['Q', 26, -36, 92, -58], ['L', 96, -80], ['Q', 28, -58, -36, -90], ['Z']], d.collar, {lineWidth: 6}),
    ...(d.tag ? [P([['M', 40, -48], ['L', 40, -40]], {lineWidth: 5}), E(40, -28, 26, 26, {fill: d.tag, lineWidth: 5})] : [E(36, -46, 14, 14, {fill: '#c9ced3', lineWidth: 4})])];
  const hAng = headAngle ?? p.head;
  const headK = idle && !talk ? osc(idle.dur, 2.8, 2, {base: hAng}) : undefined;
  const headG = G([head3q(d, {expr, look, tongue, ears, prop, talk, dur})], {x: 64, y: -132});
  const neck = G([neckFill, ...throat, ...neckLines, headG, ...collar], {x: nx, y: ny, pivotX: 0, pivotY: 0, angle: deg(hAng), ...(headK ? {keys: headK} : {})});
  // apoyo en el suelo
  const bodyA = deg(p.body), piv = p.sit ? g.bP : [0, (yb + ycb) / 2];
  let dy = 0;
  if (p.ground) {
    const feet = [tip(g.fP, g.fL, p.fN), tip(g.fP, g.fL, p.fF), tip(g.bP, g.bL, p.bN), tip(g.bP, g.bL, p.bF)].map(t => rot(t, bodyA, piv)[1] + g.fW[1][1] * 0.75);
    const torsoLow = p.lie ? rot([0, ycb], bodyA, piv)[1] + 6 : p.butt ? rot([-B - 14, ycb - D * 0.3], bodyA, piv)[1] + 4 : -Infinity;
    dy = p.butt ? -torsoLow : -Math.max(...feet, torsoLow);
  } else if (pose === 'salto') dy = -120;
  else if (pose === 'carrera') dy = -40;
  const snore = zzz ? [zzzLayer(dur || 3, who)] : [];
  const bobK = walk ? osc(walk.dur, (walk.period || 0.5) / 2, 6, {prop: 'y', radians: false, base: dy}) : undefined;
  const breathK = !walk && dur ? osc(dur, zzz ? 2.6 : 3.2, zzz ? 0.03 : 0.012, {prop: 'scaleY', radians: false, base: 1}) : undefined;
  const body = G([
    place(legs.bF, g.bP, 16), place(legs.fF, g.fP, -16), tail, place(legs.fN, g.fP),
    G([torso, belly, ribs, backHi, shoulder, ...chest], breathK ? {keys: breathK, pivotX: 0, pivotY: ycb} : {}),
    place(legs.bN, g.bP), neck, ...extra,
  ], {y: dy, angle: bodyA, pivotX: piv[0], pivotY: piv[1], ...(bobK ? {keys: bobK.map(k => ({t: k.t, y: k.y}))} : {})});
  const s = scale * d.size;
  const flipped = p.belly ? G([body], {y: -yb - 8, scaleY: -1, pivotX: 0, pivotY: yb}) : body;
  return G([flipped, ...snore], {x, y, scaleX: flip ? -s : s, scaleY: s, ...(move ? {keys: move} : {}), ...(alpha !== undefined ? {alpha} : {}), ...(from !== undefined ? {from} : {}), ...(to !== undefined ? {to} : {})});
}

// ---------- perro de frente (sentado) ----------
export function dogFront({who = 'layla', x = 0, y = 0, scale = 1, expr, tongue, talk, idle, wag, headTilt = 0, alpha, from, to, move} = {}) {
  const d = DOGS[who], g = geo(d), X = EXPR[expr ??= who === 'dobby' ? 'boba' : 'reposo'] || EXPR.reposo;
  const dur = idle?.dur ?? wag?.dur ?? 0, tng = tongue ?? X.tongue, bk = d.bulk, lh = g.Lh, hw = d.headW, ML = d.muzzleL;
  const pawC = d.paws ? d.white : d.coat;
  const tailK = wag ? osc(wag.dur, wag.period || 0.32, wag.amp ?? 10, {base: 0}) : undefined;
  const tail = G([S([['M', 0, 0], ['Q', 80, 10, d.tail.l, -16], ['Q', 90, 20, 0, 22], ['Z']], d.coat, {lineWidth: OL})], {x: 70 * bk, y: -18, pivotX: 0, pivotY: 10, ...(tailK ? {keys: tailK} : {})});
  const chestH = 150 + lh * 0.55;
  // ancas (muslos doblados a los lados) + patas traseras asomando
  const haunch = s => [S([['M', s * 30 * bk, -chestH * 0.55], ['Q', s * 140 * bk, -chestH * 0.5, s * 136 * bk, -40], ['Q', s * 120 * bk, -4, s * 40 * bk, -6], ['Z']], d.coat, {lineWidth: OL}),
    P([['M', s * 110 * bk, -chestH * 0.38], ['Q', s * 124 * bk, -70, s * 100 * bk, -30]], {stroke: d.shade, lineWidth: 8}),
    S([['M', s * 92 * bk, -2], ['Q', s * 100 * bk, -36, s * 140 * bk, -30], ['Q', s * 162 * bk, -14, s * 150 * bk, 0], ['Z']], pawC, {lineWidth: OL - 1})];
  const torsoS = S([['M', -70 * bk, -chestH * 1.08], ['Q', 0, -chestH * 1.2, 70 * bk, -chestH * 1.08], ['Q', 100 * bk, -chestH * 0.6, 70 * bk, -10], ['Q', 0, 6, -70 * bk, -10], ['Q', -100 * bk, -chestH * 0.6, -70 * bk, -chestH * 1.08], ['Z']], d.coat, {lineWidth: OL});
  const chest = d.chest ? [S([['M', -36 * bk, -chestH * 1.0], ['Q', 0, -chestH * 1.1, 36 * bk, -chestH * 1.0], ['Q', 54 * bk, -chestH * 0.45, 0, -chestH * 0.12], ['Q', -54 * bk, -chestH * 0.45, -36 * bk, -chestH * 1.0], ['Z']], d.white, NONE)]
    : [P([['M', -30 * bk, -chestH * 0.8], ['Q', 0, -chestH * 0.6, 30 * bk, -chestH * 0.8]], {stroke: d.shade, lineWidth: 8})];
  const fleg = s => { const w0 = g.fW[0][1] + 6, w1 = g.fW[1][1] + 2, top = -chestH * 0.62, l = -top - 22;
    return [G([S(segPath(l, w0, w1), d.coat, {lineWidth: OL}), ...(d.paws ? [G([S(segPath(l * 0.35, w1, w1), pawC, NONE)], {y: l * 0.62})] : [])], {x: s * 36 * bk, y: top}),
      S([['M', s * 36 * bk - w1 * 0.8, -4], ['Q', s * 36 * bk - w1 * 0.9, -34, s * 36 * bk, -36], ['Q', s * 36 * bk + w1 * 0.9, -34, s * 36 * bk + w1 * 0.8, -4], ['Z']], pawC, {lineWidth: OL - 1}),
      P([['M', s * 36 * bk - 7, -24], ['L', s * 36 * bk - 7, -4]], {lineWidth: 4}), P([['M', s * 36 * bk + 7, -24], ['L', s * 36 * bk + 7, -4]], {lineWidth: 4})]; };
  // cabeza de frente: cráneo ancho, hocico que baja, belfos, orejas en rosa
  const hy = -chestH * 1.08 - 92, k = jawKeys(talk, dur, X.open), mY = 30 + (ML - 128) * 1.0;
  const earB = (X.ears || d.ears) === 'back';
  const earF = s => G(roseEar(d, earB), {x: s * 74 * hw, y: -70, scaleX: -s * 0.78, scaleY: 0.66, angle: deg(s * (earB ? 40 : 58))});
  const headO = [['M', -96 * hw, -10], ['Q', -100 * hw, -96, 0, -100], ['Q', 100 * hw, -96, 96 * hw, -10], ['Q', 94 * hw, 40, 60, 54 + mY], ['Q', 0, 86 + mY, -60, 54 + mY], ['Q', -94 * hw, 40, -96 * hw, -10], ['Z']];
  const muz = [['M', -34, -14], ['Q', 0, -22, 34, -14], ['Q', 70, 16, 64, 48 + mY], ['Q', 0, 76 + mY, -64, 48 + mY], ['Q', -70, 16, -34, -14], ['Z']];
  const gy = mY - 18, grin = X.grin ? [S([['M', -78, 26 + gy], ['Q', 0, 54 + gy, 78, 26 + gy], ['Q', 60, 96 + gy, 0, 100 + gy], ['Q', -60, 96 + gy, -78, 26 + gy], ['Z']], MOUTH, {stroke: d.lips, lineWidth: 11}),
    S([['M', -42, 60 + gy], ['Q', 0, 50 + gy, 42, 60 + gy], ['Q', 38, 94 + gy, 0, 98 + gy], ['Q', -38, 94 + gy, -42, 60 + gy], ['Z']], TONGUE, NONE), P([['M', 0, 62 + gy], ['L', 0, 88 + gy]], {stroke: TONGUE_D, lineWidth: 5})] : [];
  const muzSides = [-1, 1].map(s => P([['M', s * 34, -12], ['Q', s * 66, 18, s * 60, 44 + mY]], {stroke: d.shade, lineWidth: 7}));
  const lipsF = !X.grin ? [P([['M', -60, 50 + mY], ['Q', 0, 70 + mY, 60, 50 + mY]], {stroke: d.lips, lineWidth: 9})] : [];
  const bw = d.blaze, blaze = S([['M', -bw * 0.6, -98], ['Q', 0, -104, bw * 0.6, -98], ['Q', bw * 0.8, -40, d.blazeToNose ? 14 : 30, -8], ['L', d.blazeToNose ? -14 : -30, -8], ['Q', -bw * 0.8, -40, -bw * 0.6, -98], ['Z']], d.white, NONE);
  const chinF = d.blazeToNose ? [S([['M', -40, 40 + mY], ['Q', 0, 30 + mY, 40, 40 + mY], ['Q', 40, 66 + mY, 0, 72 + mY], ['Q', -40, 66 + mY, -40, 40 + mY], ['Z']], d.jaw, NONE)] : [];
  const maskF = d.mask ? [-1, 1].map(s => E(s * 48, -36, 60, 40, {fill: d.mask, stroke: 'none', alpha: 0.45})) : [];
  const jaw = G([S([['M', -34, 50 + mY], ['Q', 0, 58 + mY, 34, 50 + mY], ['Q', 30, 80 + mY, 0, 84 + mY], ['Q', -30, 80 + mY, -34, 50 + mY], ['Z']], d.jaw, {lineWidth: OL}),
    ...(tng ? [S([['M', -22, 52 + mY], ['L', 22, 52 + mY], ['Q', 18, 104 + mY, 0, 116 + mY], ['Q', -18, 104 + mY, -22, 52 + mY], ['Z']], TONGUE, {lineWidth: 6}), P([['M', 0, 58 + mY], ['L', 0, 98 + mY]], {stroke: TONGUE_D, lineWidth: 5})] : [])],
  {pivotX: 0, pivotY: 50 + mY, scaleY: 0.6 + X.open, ...(k ? {keys: k.map(([t, o]) => ({t, scaleY: r3(0.6 + o)}))} : {})});
  const inside = G([E(0, 52 + mY, 70, 50, {fill: MOUTH, stroke: 'none'})], {pivotX: 0, pivotY: 36 + mY, scaleY: 0.2 + X.open, ...(k ? {keys: k.map(([t, o]) => ({t, scaleY: r3(0.2 + o)}))} : {})});
  const noseK = 1 + (ML - 128) * 0.008, noseY = (ML - 128) * 0.5;
  const nose0 = [S([['M', -28, 6], ['Q', 0, -6, 28, 6], ['Q', 30, 26, 0, 34], ['Q', -30, 26, -28, 6], ['Z']], d.nose, {lineWidth: 6}), ...(d.noseSpot ? [E(-10, 26, 14, 7, {fill: d.noseSpot, stroke: 'none'}), E(12, 24, 10, 6, {fill: d.noseSpot, stroke: 'none'})] : []),
    P([['M', -14, 20], ['Q', -8, 26, -4, 20]], {stroke: '#000', lineWidth: 4}), P([['M', 14, 20], ['Q', 8, 26, 4, 20]], {stroke: '#000', lineWidth: 4}), E(-8, 8, 14, 7, {fill: 'rgba(255,255,255,0.4)', stroke: 'none'}),
    P([['M', 0, 34], ['L', 0, 44 + mY * 0.5], ['Q', -20, 58 + mY * 0.6, -40, 46 + mY * 0.6]], {lineWidth: 6}), P([['M', 0, 44 + mY * 0.5], ['Q', 20, 58 + mY * 0.6, 40, 46 + mY * 0.6]], {lineWidth: 6})];
  const nose = [G(nose0.slice(0, -2), {y: noseY, scaleX: noseK, scaleY: noseK, pivotX: 0, pivotY: 14}), ...nose0.slice(-2).map(l => G([l], {y: noseY * 0.6}))];
  // ojo derecho en espejo (para que los dos almendrados miren hacia fuera)
  const eyeR = G(almond(-46, -40, 38, 26, d, {kind: X.eyes === 'derp' ? 'derp' : X.eyes, lid: X.lids?.[1] || 0, far: true}), {scaleX: -1});
  const eyeL = G(almond(-46, -40, 38, 26, d, {kind: X.eyes, lid: X.lids?.[0] || 0}));
  const bs = BROWS[X.brows] || BROWS.soft;
  const brows = [-1, 1].map(s => P([['M', s * 66, -66 + bs[0] * 0.3], ['L', s * 30, -68 + bs[0]]], {stroke: d.dark, lineWidth: 10}));
  const eyesG = G([eyeL, eyeR], {pivotX: 0, pivotY: -40, ...(dur && X.eyes === 'dot' ? {keys: blinks(dur, 3.1, 0.9)} : {})});
  const headG = G([earF(-1), earF(1), S(headO, d.coat, {lineWidth: OL}), P([['M', -80 * hw, 30], ['Q', -60, 50, -50, 60]], {stroke: d.shade, lineWidth: 8}), P([['M', 80 * hw, 30], ['Q', 60, 50, 50, 60]], {stroke: d.shade, lineWidth: 8}),
    ...(X.grin ? [] : [inside, jaw]), ...maskF, S(muz, d.muzzle, NONE), ...muzSides, blaze, ...chinF, ...lipsF, G(grin, {scaleX: hw * 0.95}), ...nose, eyesG, ...brows], {x: 0, y: hy, angle: deg(headTilt), pivotX: 0, pivotY: 60});
  const neck = [S([['M', -76 * bk, hy + 140], ['Q', -80 * bk, hy + 40, 0, hy + 40], ['Q', 80 * bk, hy + 40, 76 * bk, hy + 140], ['Z']], d.coat, NONE),
    S([['M', -74 * bk, hy + 96], ['Q', 0, hy + 130, 74 * bk, hy + 96], ['L', 74 * bk, hy + 120], ['Q', 0, hy + 156, -74 * bk, hy + 120], ['Z']], d.collar, {lineWidth: 6}),
    ...(d.tag ? [E(0, hy + 154, 28, 28, {fill: d.tag, lineWidth: 5})] : [E(0, hy + 146, 16, 16, {fill: '#c9ced3', lineWidth: 4})])];
  const breathK = dur ? osc(dur, 3.2, 0.012, {prop: 'scaleY', radians: false, base: 1}) : undefined;
  const s = scale * d.size;
  return G([tail, ...haunch(-1), ...haunch(1), G([torsoS, ...chest], breathK ? {keys: breathK, pivotX: 0, pivotY: 0} : {}), ...fleg(-1), ...fleg(1), ...neck, headG],
    {x, y, scaleX: s, scaleY: s, ...(move ? {keys: move} : {}), ...(alpha !== undefined ? {alpha} : {}), ...(from !== undefined ? {from} : {}), ...(to !== undefined ? {to} : {})});
}

// ---------- extras ----------
/** «Zzz» que sube y se desvanece (ronquido). */
function zzzLayer(dur, who) {
  const z = (x, y, s) => P([['M', x, y], ['L', x + 30 * s, y], ['L', x, y + 30 * s], ['L', x + 30 * s, y + 30 * s]], {lineWidth: 9 * s, stroke: INK});
  const base = who === 'dobby' ? [250, -300] : [220, -260];
  return G([0, 1, 2].map(i => G([z(0, 0, 0.7 + i * 0.25)], {x: base[0] + i * 34, y: base[1] - i * 50,
    keys: [{t: 0, alpha: 0}, {t: r3(0.3 + i * 0.35), alpha: 1}, {t: r3(Math.max(0.9 + i * 0.35, dur)), alpha: 1}]})));
}
/** Mosca: cuerpo + alas que vibran. */
export function fly({x = 0, y = 0, scale = 1, dur = 0, keys} = {}) {
  const wings = G([E(-8, -14, 22, 30, {fill: 'rgba(190,225,255,0.85)', lineWidth: 4}), E(10, -14, 22, 30, {fill: 'rgba(190,225,255,0.85)', lineWidth: 4})],
    {pivotX: 0, pivotY: -4, ...(dur ? {keys: osc(dur, 0.08, 0.35, {prop: 'scaleY', radians: false, base: 1})} : {})});
  return G([wings, E(0, 0, 30, 20, {fill: INK, stroke: 'none'}), E(14, -2, 12, 12, {fill: '#9b2d2d', stroke: 'none'})], {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {})});
}
/** Pelota de tenis (en la boca: pásala como `prop` con {x:110,y:58}). */
export function ball({x = 0, y = 0, r = 34} = {}) {
  return G([E(0, 0, r * 2, r * 2, {fill: '#c8e04a', lineWidth: 8}), P([['M', -r * 0.7, -r * 0.7], ['Q', 0, 0, -r * 0.7, r * 0.7]], {stroke: PAPER, lineWidth: 6}), P([['M', r * 0.7, -r * 0.7], ['Q', 0, 0, r * 0.7, r * 0.7]], {stroke: PAPER, lineWidth: 6})], {x, y});
}
/** Palo (en la boca: `prop: stick({x:90, y:56})`). */
export function stick({x = 0, y = 0, l = 240, angle = -6} = {}) {
  return G([R(-l / 2, -11, l, 22, {radius: 10, fill: '#9a6a3c', lineWidth: 8}), P([['M', l * 0.18, -8], ['L', l * 0.28, -30]], {stroke: INK, lineWidth: 12}), P([['M', l * 0.18, -8], ['L', l * 0.28, -30]], {stroke: '#9a6a3c', lineWidth: 6})], {x, y, angle: deg(angle)});
}
/** Líneas de movimiento junto a la cola (meneo). */
export function wagLines(x, y, s = 1) {
  return G([P([['M', -10, -40], ['Q', -30, -10, -14, 18]], {lineWidth: 6}), P([['M', -40, -54], ['Q', -66, -12, -44, 26]], {lineWidth: 6})], {x, y, scaleX: s, scaleY: s});
}
export const layla = a => dog({...a, who: 'layla'});
export const dobby = a => dog({...a, who: 'dobby'});

// ---------- identidad: huella y «ficha del estudio» ----------
/** Huella de perro (almohadilla + 4 dedos). Origen = centro de la almohadilla. */
export function pawPrint({x = 0, y = 0, scale = 1, color = INK, angle = 0, keys, alpha} = {}) {
  const pad = S([['M', -34, 18], ['Q', -40, -14, -14, -22], ['Q', 0, -26, 14, -22], ['Q', 40, -14, 34, 18], ['Q', 26, 36, 0, 30], ['Q', -26, 36, -34, 18], ['Z']], color, NONE);
  const toes = [[-38, -44, -18], [-14, -64, -6], [14, -64, 6], [38, -44, 18]].map(([tx, ty, a]) => E(tx, ty, 24, 32, {fill: color, stroke: 'none'}));
  return G([pad, ...toes], {x, y, scaleX: scale, scaleY: scale, angle: deg(angle), ...(keys ? {keys} : {}), ...(alpha !== undefined ? {alpha} : {})});
}
export const PALETAS = {
  canela: {name: 'Canela y verde azulado', paper: '#f6f0e4', ink: '#1d1d1d', main: '#e8a33d', second: '#1f8a8a', accent: '#ec7d93', ground: '#e6dccb'},
  parque: {name: 'Parque (hierba y cielo)', paper: '#f3f7ee', ink: '#1d1d1d', main: '#5aa469', second: '#8fd3f4', accent: '#c8e04a', ground: '#b9d99a'},
  noche:  {name: 'Collar azul noche', paper: '#fbf3e6', ink: '#1d1d1d', main: '#2c3a4d', second: '#f08a24', accent: '#7fd1b9', ground: '#e8dccb'},
  // v2 (13-nov-2026, David pidió lila claro): onMain = color del texto sobre `main` cuando main es claro.
  lilaCielo:  {name: 'Lila y azul cielo (+ mantequilla)', paper: '#f8f5fc', ink: '#1d1d1d', main: '#b9a3e3', second: '#7fb8e6', accent: '#ffd166', ground: '#e6def3', onMain: '#1d1d1d'},
  lilaMenta:  {name: 'Lila y menta (+ rosa)', paper: '#faf7fc', ink: '#1d1d1d', main: '#c3b1e1', second: '#6cc9ad', accent: '#ff9fb2', ground: '#dff0e7', onMain: '#1d1d1d'},
  lavanda:    {name: 'Lavanda, azul y melocotón', paper: '#fbf6f1', ink: '#1d1d1d', main: '#a48ad6', second: '#5c9ded', accent: '#ffb38a', ground: '#ebe3f5', onMain: '#ffffff'},
};
/**
 * Ficha del estudio: tarjeta con universidad + revista + año que entra desde abajo y recibe un sello de huella.
 * studyCard({x, y (centro), scale, uni, journal, year, pal: PALETAS.x, variant: 'ficha'|'carpeta'|'oscura', at (s, entrada), stampAt})
 * Las fuentes del texto son las del motor (B3). Ancho 600 × alto 330 a escala 1.
 */
export function studyCard({x = 640, y = 400, scale = 1, uni = 'Universidad de Kioto', journal = 'Animal Cognition', year = '2015', pal = PALETAS.canela, variant = 'ficha', at = 0, stampAt, label = 'ESTUDIO'} = {}) {
  const W = 600, H = 330, dark = variant === 'oscura';
  const bg = dark ? pal.ink : PAPER, fg = dark ? pal.paper : pal.ink;
  const kids = [];
  if (variant === 'carpeta') kids.push(R(-W / 2 + 20, -H / 2 - 44, 200, 70, {radius: 14, fill: pal.second, lineWidth: 8}), {type: 'text', text: label, x: -W / 2 + 46, y: -H / 2 - 38, size: 28, bold: true, color: PAPER, w: 200});
  kids.push(R(-W / 2, -H / 2, W, H, {radius: 22, fill: bg, lineWidth: 9}));
  if (variant !== 'carpeta') kids.push(R(-W / 2, -H / 2, W, 74, {radius: 22, fill: pal.main, lineWidth: 9}), R(-W / 2 + 5, -H / 2 + 40, W - 10, 30, {radius: 0, fill: pal.main, stroke: 'none'}),
    {type: 'text', text: label, x: -W / 2 + 30, y: -H / 2 + 14, size: 40, bold: true, color: pal.onMain || PAPER, w: 400});
  else kids.push(...[0, 1, 2].map(i => P([['M', -W / 2 + 30, -H / 2 + 80 + i * 70], ['L', W / 2 - 30, -H / 2 + 80 + i * 70]], {stroke: pal.second, lineWidth: 3, alpha: 0.5})));
  const ty = variant === 'carpeta' ? -H / 2 + 30 : -H / 2 + 100;
  kids.push({type: 'text', text: uni, x: -W / 2 + 30, y: ty, size: 44, bold: true, color: fg, w: W - 60},
    {type: 'text', text: journal, x: -W / 2 + 30, y: ty + 70, size: 36, bold: false, color: fg, w: W - 200},
    {type: 'text', text: String(year), x: -W / 2 + 30, y: ty + 124, size: 64, bold: true, color: pal.second, w: 260});
  const sa = stampAt ?? at + 0.35;
  const stamp = G([E(0, 0, 150, 150, {fill: 'none', stroke: pal.accent, lineWidth: 10}), pawPrint({y: 14, scale: 0.85, color: pal.accent})],
    {x: W / 2 - 100, y: H / 2 - 92, angle: deg(-14), keys: [{t: 0, scaleX: 2.6, scaleY: 2.6, alpha: 0}, {t: r3(Math.max(0, sa - 0.01)), scaleX: 2.6, scaleY: 2.6, alpha: 0}, {t: r3(sa + 0.16), scaleX: 0.9, scaleY: 0.9, alpha: 1}, {t: r3(sa + 0.26), scaleX: 1, scaleY: 1, alpha: 1}]});
  return G([...kids, stamp], {x, y, scaleX: scale, scaleY: scale, angle: deg(variant === 'carpeta' ? -3 : 0),
    keys: [{t: 0, y: y + 140, alpha: 0}, {t: r3(at), y: y + 140, alpha: 0}, {t: r3(at + 0.22), y: y - 10, alpha: 1}, {t: r3(at + 0.32), y, alpha: 1}]});
}
