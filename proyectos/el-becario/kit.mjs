// Character kit v2 for "El Becario" Shorts. Pure functions returning declarative
// B3 layers. Characters are rigged (hips, knees, shoulders, elbows, neck) and can
// walk, blink, breathe and gesture through generated keyframes.
// Units: design plane (width 1280). Character origin = between the feet.
export const INK = '#151515', PAPER = '#ffffff', TIE = '#d8352a';
export const LW = 11;
export const deg = d => d * Math.PI / 180;
export const P = (commands, o = {}) => ({type: 'path', commands, fill: 'none', stroke: INK, lineWidth: LW, ...o});
export const E = (cx, cy, w, h, o = {}) => ({type: 'ellipse', x: cx - w / 2, y: cy - h / 2, w, h, fill: PAPER, stroke: INK, lineWidth: LW, ...o});
export const R = (x, y, w, h, o = {}) => ({type: 'rect', x, y, w, h, radius: 18, fill: PAPER, stroke: INK, lineWidth: LW, ...o});
export const G = (children, o = {}) => ({type: 'group', children, ...o});
export const S = (commands, fill, o = {}) => ({type: 'path', commands, fill, stroke: INK, lineWidth: LW, ...o}); // filled shape
// Outlined tube (sleeve, trouser leg, chicken shin): ink underlay + colour on top.
const tube = (pts, color, w) => [P([['M', ...pts[0]], ...pts.slice(1).map(p => ['L', ...p])], {lineWidth: w + LW * 1.6}), P([['M', ...pts[0]], ...pts.slice(1).map(p => ['L', ...p])], {stroke: color, lineWidth: w})];
const r3 = n => Math.round(n * 1000) / 1000;

// ---------- keyframe generators ----------
/** Sinusoid-like keys for one property: value(t) = base + amp*sin(2π t/period + phase). */
export function osc(dur, period, amp, {phase = 0, base = 0, prop = 'angle', t0 = 0, t1 = dur, radians = true} = {}) {
  const keys = [], step = period / 4;
  for (let t = t0; t < t1 - 1e-3; t += step) keys.push({t: r3(t), [prop]: r3((radians ? deg(base) : base) + (radians ? deg(amp) : amp) * Math.sin(2 * Math.PI * (t - t0) / period + phase))});
  keys.push({t: r3(t1), [prop]: r3(radians ? deg(base) : base)});
  return keys;
}
/** Blinks: scaleY keys on an eye group. */
export function blinks(dur, every = 2.6, offset = 0.7) {
  const keys = [{t: 0, scaleY: 1}];
  for (let t = offset; t < dur - 0.25; t += every) keys.push({t: r3(t), scaleY: 1}, {t: r3(t + 0.07), scaleY: 0.1}, {t: r3(t + 0.15), scaleY: 1});
  if (keys.at(-1).t < dur) keys.push({t: r3(dur), scaleY: 1});
  return keys;
}
const mergeT = (a, b) => [...(a || []), ...(b || [])].sort((x, y) => x.t - y.t).filter((k, i, arr) => !i || k.t > arr[i - 1].t);

/**
 * Motion description shared by human characters.
 * walk: {dur, period?, stride?}  -> legs/arms swing, body bob
 * idle: {dur}                    -> breathing + blinking
 * gestures: [{t0, t1, arm: 'L'|'R', shoulder, elbow}] -> raise an arm for a while
 */
function humanMotion({walk, idle, gestures = [], poses = {}, dur}) {
  const m = {};
  for (const side of ['L', 'R']) if (poses[side]) m['p' + side] = poses[side];
  if (walk) {
    const p = walk.period || 0.62, a = walk.stride || 22, d = walk.dur;
    m.legL = osc(d, p, a); m.legR = osc(d, p, a, {phase: Math.PI});
    m.kneeL = osc(d, p, 14, {phase: -Math.PI / 2, base: 14}); m.kneeR = osc(d, p, 14, {phase: Math.PI / 2, base: 14});
    m.armL = osc(d, p, 16, {phase: Math.PI}); m.armR = osc(d, p, 16);
    m.bob = osc(d, p / 2, 9, {prop: 'y', radians: false, base: -4});
  }
  const total = dur ?? walk?.dur ?? idle?.dur;
  if (total) { m.blink = blinks(total); if (!walk) m.breath = osc(total, 3.2, 0.012, {prop: 'scaleY', radians: false, base: 1}); }
  for (const g of gestures) {
    const k = [{t: r3(Math.max(0, g.t0 - 0.25)), angle: 0}, {t: r3(g.t0), angle: g.shoulder}, {t: r3(g.t1), angle: g.shoulder}, {t: r3(Math.min(total ?? g.t1 + 0.3, g.t1 + 0.3)), angle: 0}];
    m['g' + g.arm] = k; m['ge' + g.arm] = [{t: k[0].t, angle: 0}, {t: k[1].t, angle: g.elbow ?? 0}, {t: k[2].t, angle: g.elbow ?? 0}, {t: k[3].t, angle: 0}];
  }
  return m;
}

// ---------- faces ----------
function face(expr, look = 0, mustache = false) {
  const lx = look * 10;
  const eyes = [], lids = [], rest = [];
  if (expr === 'sorpresa' || expr === 'miedo') {
    eyes.push(E(-50 + lx, -138, 46, 54, {lineWidth: 7}), E(50 + lx, -138, 46, 54, {lineWidth: 7}), E(-50 + lx * 1.5, -134, 16, 18, {fill: INK, stroke: 'none'}), E(50 + lx * 1.5, -134, 16, 18, {fill: INK, stroke: 'none'}));
    rest.push(P([['M', -80, -190], ['Q', -50, -208, -22, -194]], {lineWidth: 8}), P([['M', 22, -194], ['Q', 50, -208, 80, -190]], {lineWidth: 8}));
    rest.push(expr === 'miedo' ? P([['M', -34, -60], ['Q', -17, -76, 0, -60], ['Q', 17, -44, 34, -60]], {lineWidth: 8}) : E(0, -62, 44, 52, {fill: INK, stroke: 'none'}));
  } else {
    eyes.push(E(-50 + lx, -135, 24, 32, {fill: INK, stroke: 'none'}), E(50 + lx, -135, 24, 32, {fill: INK, stroke: 'none'}));
    const lid = {sarcastico: [26, 14], agobiado: [10, 10], contento: [12, 12], serio: [16, 16], picaro: [30, 6], nervioso: [6, 6]}[expr] || [20, 20];
    lids.push(R(-68, -158, 38, lid[0], {radius: 4, stroke: 'none'}), R(30, -158, 38, lid[1], {radius: 4, stroke: 'none'}),
      P([['M', -68, -158 + lid[0]], ['L', -30, -158 + lid[0]]], {lineWidth: 6}), P([['M', 30, -158 + lid[1]], ['L', 70, -158 + lid[1]]], {lineWidth: 6}));
    rest.push(P([['M', -72, -106], ['Q', -50, -95, -28, -106]], {stroke: '#a3a3a3', lineWidth: 5}), P([['M', 28, -106], ['Q', 50, -95, 72, -106]], {stroke: '#a3a3a3', lineWidth: 5}));
    if (expr === 'sarcastico') rest.push(P([['M', -78, -176], ['L', -26, -172]], {lineWidth: 8}), P([['M', 26, -188], ['Q', 52, -206, 80, -194]], {lineWidth: 8}), P([['M', -34, -64], ['Q', 4, -60, 40, -80]], {lineWidth: 8}));
    else if (expr === 'agobiado') rest.push(P([['M', -78, -170], ['L', -28, -182]], {lineWidth: 8}), P([['M', 28, -182], ['L', 78, -170]], {lineWidth: 8}),
      P([['M', -38, -64], ['Q', -26, -76, -12, -64], ['Q', 2, -52, 14, -64], ['Q', 26, -76, 38, -64]], {lineWidth: 7}),
      S([['M', 116, -194], ['Q', 132, -162, 116, -152], ['Q', 100, -162, 116, -194], ['Z']], '#7fc4f0', {lineWidth: 5}));
    else if (expr === 'picaro') rest.push(P([['M', -80, -170], ['L', -26, -166]], {lineWidth: 9}), P([['M', 24, -186], ['Q', 52, -222, 84, -196]], {lineWidth: 9}),
      S([['M', -30, -78], ['Q', 10, -46, 52, -88], ['Q', 14, -62, -30, -78], ['Z']], INK, {lineWidth: 6}), P([['M', 40, -94], ['L', 56, -84]], {lineWidth: 6}));
    else if (expr === 'nervioso') rest.push(P([['M', -80, -168], ['L', -28, -186]], {lineWidth: 8}), P([['M', 28, -186], ['L', 80, -168]], {lineWidth: 8}),
      R(-28, -76, 56, 22, {radius: 8, fill: PAPER, lineWidth: 6}), P([['M', -10, -76], ['L', -10, -54]], {lineWidth: 3}), P([['M', 10, -76], ['L', 10, -54]], {lineWidth: 3}),
      S([['M', 118, -200], ['Q', 136, -164, 118, -152], ['Q', 100, -164, 118, -200], ['Z']], '#7fc4f0', {lineWidth: 5}), S([['M', -122, -170], ['Q', -108, -142, -122, -132], ['Q', -136, -142, -122, -170], ['Z']], '#7fc4f0', {lineWidth: 5}));
    else if (expr === 'contento') rest.push(P([['M', -78, -176], ['Q', -52, -190, -26, -176]], {lineWidth: 8}), P([['M', 26, -176], ['Q', 52, -190, 78, -176]], {lineWidth: 8}), S([['M', -40, -78], ['Q', 0, -30, 40, -78], ['Z']], INK, {lineWidth: 6}));
    else if (expr === 'serio') rest.push(P([['M', -78, -168], ['L', -26, -160]], {lineWidth: 9}), P([['M', 26, -160], ['L', 78, -168]], {lineWidth: 9}), P([['M', -28, -66], ['L', 28, -66]], {lineWidth: 8}));
    else rest.push(P([['M', -78, -174], ['L', -26, -174]], {lineWidth: 8}), P([['M', 26, -174], ['L', 78, -174]], {lineWidth: 8}), P([['M', -30, -66], ['L', 30, -70]], {lineWidth: 8}));
  }
  if (mustache) rest.push(S([['M', -6, -92], ['Q', -40, -104, -64, -80], ['Q', -36, -82, -6, -78], ['Z']], '#4a3424', {lineWidth: 6}), S([['M', 6, -92], ['Q', 40, -104, 64, -80], ['Q', 36, -82, 6, -78], ['Z']], '#4a3424', {lineWidth: 6}));
  return {eyes: [...eyes, ...lids], rest};
}

// ---------- human rig ----------
const OUTFITS = {
  becario: {shirt: PAPER, sleeve: PAPER, pants: '#4b4f58', shoe: INK, skin: PAPER},
  granjero: {shirt: '#c2412f', sleeve: '#c2412f', pants: '#3f6aa8', shoe: '#6b4423', skin: PAPER},
  civil: {shirt: '#8fbf6a', sleeve: '#8fbf6a', pants: '#5a5f6a', shoe: INK, skin: PAPER},
  civil2: {shirt: '#e6b34a', sleeve: '#e6b34a', pants: '#3f6aa8', shoe: INK, skin: PAPER},
  // EXP 002: the mother-in-law (grey bun, glasses, purple dress)
  suegra: {shirt: '#8a4f9e', sleeve: '#8a4f9e', pants: '#6b3d7a', shoe: INK, skin: PAPER, glasses: true, cheeks: true, bun: '#a4a9b2', torsoW: 184},
  // 1920s Paris cast (EXP 001)
  lustig: {shirt: '#23273a', sleeve: '#23273a', pants: '#23273a', shoe: INK, skin: PAPER, jacket: true, vest: '#7a1f2b', bow: '#c8202a', hat: 'top', hatColor: '#15171f', band: '#7a1f2b', stache: 'pencil', torsoW: 146, tails: true, carnation: true, monocle: true, chain: true, slick: true, pocket: true, shoeShine: true},
  poisson: {shirt: '#9a7448', sleeve: '#9a7448', pants: '#7a5a38', shoe: '#3a2a1e', skin: PAPER, jacket: true, vest: '#c9a24a', tie: '#3f6aa8', tiePin: true, hat: 'bowler', hatColor: '#4a3626', hatScale: 0.82, stache: 'walrus', torsoW: 224, cheeks: true, chain: true, glasses: true, belly: true},
  chatarrero1: {shirt: '#5c7a5a', sleeve: '#5c7a5a', pants: '#3e4a3c', shoe: INK, skin: PAPER, jacket: true, tie: '#7a3b2a', hat: 'cap', hatColor: '#6b6f78', torsoW: 180},
  chatarrero2: {shirt: '#7a5c8a', sleeve: '#7a5c8a', pants: '#4a3a56', shoe: INK, skin: PAPER, jacket: true, tie: '#e0b040', hat: 'bowler', hatColor: '#2a2a2a', stache: 'brush', torsoW: 170},
  chatarrero3: {shirt: '#a85a3a', sleeve: '#a85a3a', pants: '#5a3a2a', shoe: INK, skin: PAPER, jacket: true, tie: '#2b4a7a', hat: 'cap', hatColor: '#8a7a5a', stache: 'brush', torsoW: 190},
  gendarme: {shirt: '#1f3c7a', sleeve: '#1f3c7a', pants: '#1f3c7a', shoe: INK, skin: PAPER, jacket: true, buttons: '#e9c46a', hat: 'kepi', hatColor: '#1f3c7a', band: '#c8202a', stache: 'brush', torsoW: 170},
};
const STACHE = {
  pencil: () => [S([['M', -2, -90], ['Q', -30, -98, -52, -86], ['Q', -68, -80, -70, -96], ['Q', -60, -74, -40, -80], ['Q', -20, -84, -2, -82], ['Z']], INK, {lineWidth: 4}),
    S([['M', 2, -90], ['Q', 30, -98, 52, -86], ['Q', 68, -80, 70, -96], ['Q', 60, -74, 40, -80], ['Q', 20, -84, 2, -82], ['Z']], INK, {lineWidth: 4})],
  curl: () => [S([['M', -4, -94], ['Q', -34, -104, -56, -88], ['Q', -74, -78, -66, -96], ['Q', -70, -70, -48, -80], ['Q', -26, -84, -4, -80], ['Z']], INK, {lineWidth: 5}),
    S([['M', 4, -94], ['Q', 34, -104, 56, -88], ['Q', 74, -78, 66, -96], ['Q', 70, -70, 48, -80], ['Q', 26, -84, 4, -80], ['Z']], INK, {lineWidth: 5})],
  walrus: () => [S([['M', -70, -70], ['Q', -60, -110, 0, -104], ['Q', 60, -110, 70, -70], ['Q', 40, -86, 0, -84], ['Q', -40, -86, -70, -70], ['Z']], '#6b4a30', {lineWidth: 6})],
  brush: () => [R(-40, -100, 80, 22, {radius: 10, fill: '#4a3424', lineWidth: 5})],
};
function hatOf(o) {
  const c = o.hatColor || INK;
  if (o.hat === 'top') return [R(-84, -430, 168, 196, {radius: 10, fill: c}), R(-84, -282, 168, 30, {fill: o.band || '#c8202a', lineWidth: 6}), E(0, -240, 300, 46, {fill: c})];
  if (o.hat === 'bowler') return [G([S([['M', -104, -244], ['Q', -108, -378, 0, -380], ['Q', 108, -378, 104, -244], ['Z']], c, {lineWidth: 7}), E(0, -242, 290, 44, {fill: c}), P([['M', -100, -262], ['L', 100, -262]], {stroke: '#1a1a1a', lineWidth: 10})], {pivotX: 0, pivotY: -240, scaleX: o.hatScale || 1, scaleY: o.hatScale || 1, y: (1 - (o.hatScale || 1)) * -10})];
  if (o.hat === 'cap') return [ // newsboy cap that wraps the skull: sides come down over the temples, band follows the forehead
    S([['M', -136, -168], ['Q', -172, -300, -36, -338], ['Q', 112, -360, 150, -236], ['Q', 198, -230, 214, -202], ['Q', 172, -184, 128, -188], ['Q', 0, -236, -136, -168], ['Z']], c, {lineWidth: 7}),
    P([['M', -130, -184], ['Q', 0, -250, 132, -204]], {stroke: 'rgba(0,0,0,0.30)', lineWidth: 6}),
    P([['M', -36, -336], ['Q', -10, -290, 20, -236]], {stroke: 'rgba(0,0,0,0.30)', lineWidth: 5}), P([['M', -36, -336], ['Q', -96, -290, -110, -214]], {stroke: 'rgba(0,0,0,0.30)', lineWidth: 5}),
    P([['M', 140, -224], ['Q', 176, -214, 206, -204]], {stroke: 'rgba(0,0,0,0.30)', lineWidth: 4}), E(-36, -338, 26, 16, {fill: c, lineWidth: 5})];
  if (o.hat === 'kepi') return [S([['M', -50, -242], ['Q', 60, -250, 132, -236], ['Q', 104, -214, 20, -220], ['Z']], INK, {lineWidth: 5}), S([['M', -88, -244], ['L', -78, -362], ['L', 78, -362], ['L', 88, -244], ['Z']], c, {lineWidth: 7}), R(-85, -284, 170, 30, {fill: o.band || '#c8202a', lineWidth: 6}), E(0, -362, 156, 20, {fill: c, lineWidth: 6}), E(0, -300, 20, 20, {fill: '#e9c46a', lineWidth: 4})];
  return [];
}
function jacketParts(o, torsoW) {
  const h = torsoW / 2, parts = [];
  parts.push(S([['M', -40, -470], ['L', 40, -470], ['L', 0, -380], ['Z']], PAPER, {lineWidth: 6})); // shirt front
  parts.push(P([['M', -40, -470], ['L', -14, -360], ['L', -h + 10, -300]], {lineWidth: 6}), P([['M', 40, -470], ['L', 14, -360], ['L', h - 10, -300]], {lineWidth: 6})); // lapels
  if (o.bow) parts.push(S([['M', 0, -458], ['L', -34, -476], ['L', -34, -440], ['Z']], o.bow, {lineWidth: 5}), S([['M', 0, -458], ['L', 34, -476], ['L', 34, -440], ['Z']], o.bow, {lineWidth: 5}), E(0, -458, 16, 16, {fill: o.bow, lineWidth: 5}));
  if (o.tie) parts.push(S([['M', -10, -466], ['L', 10, -466], ['L', 14, -392], ['L', 0, -376], ['L', -14, -392], ['Z']], o.tie, {lineWidth: 5}));
  if (o.vest) parts.splice(0, 0, S([['M', -38, -470], ['L', 38, -470], ['L', 30, -300], ['L', -30, -300], ['Z']], o.vest, {lineWidth: 6}));
  if (o.vest) parts.splice(1, 1, S([['M', -30, -470], ['L', 30, -470], ['L', 0, -410], ['Z']], PAPER, {lineWidth: 5}));
  for (const yy of [-340, -290]) parts.push(E(0, yy, 16, 16, {fill: o.buttons || INK, stroke: 'none'}));
  if (o.chain) parts.push(P([['M', -4, -330], ['Q', -40, -300, -66, -334]], {stroke: '#e9b93a', lineWidth: 6}), E(-68, -334, 18, 18, {fill: '#e9b93a', lineWidth: 4}));
  if (o.carnation) parts.push(...[0, 72, 144, 216, 288].map(a => E(-52 + Math.cos(deg(a)) * 12, -410 + Math.sin(deg(a)) * 12, 20, 20, {fill: '#e0263a', lineWidth: 4})), E(-52, -410, 12, 12, {fill: '#ffd21f', stroke: 'none'}));
  if (o.pocket) parts.push(S([['M', 36, -398], ['L', 66, -398], ['L', 58, -418], ['L', 50, -404], ['L', 44, -418], ['Z']], PAPER, {lineWidth: 4}), P([['M', 32, -398], ['L', 70, -398]], {lineWidth: 5}));
  if (o.tiePin) parts.push(E(0, -420, 12, 12, {fill: '#e9b93a', lineWidth: 3}));
  if (o.belly) parts.push(S([['M', -h + 6, -330], ['Q', 0, -210, h - 6, -330]], 'none', {lineWidth: 6}));
  return parts;
}

function arm(side, o, motion, swingKeys, gKeys, geKeys, poseKeys) {
  const shoulderAngle = deg(-(o.shoulder || 0) * side), elbowAngle = deg((o.elbow || 0) * side);
  if (poseKeys) {
    const hand = E(0, 104, 40, 40, {lineWidth: 8});
    const fore = G([...tube([[0, 0], [0, 92]], o.forearm || PAPER, 16), hand, ...(o.hold || [])], {y: 100, angle: elbowAngle, pivotX: 0, pivotY: 0, keys: poseKeys.map(k => ({t: k.t, angle: deg((k.elbow ?? 0) * side)}))});
    return G([...tube([[0, 0], [0, 100]], o.sleeve, 30), fore], {angle: shoulderAngle, pivotX: 0, pivotY: 0, keys: poseKeys.map(k => ({t: k.t, angle: deg(-(k.shoulder ?? 0) * side)}))});
  }
  const hand = E(0, 104, 40, 40, {lineWidth: 8});
  const fore = G([...tube([[0, 0], [0, 92]], o.forearm || PAPER, 16), hand, ...(o.hold || [])], {y: 100, angle: elbowAngle, pivotX: 0, pivotY: 0, ...(geKeys ? {keys: geKeys.map(k => ({t: k.t, angle: elbowAngle + deg(k.angle) * side}))} : {})});
  const keys = gKeys ? gKeys.map(k => ({t: k.t, angle: shoulderAngle - deg(k.angle) * side})) : swingKeys ? swingKeys.map(k => ({t: k.t, angle: shoulderAngle + k.angle})) : null;
  return G([...tube([[0, 0], [0, 100]], o.sleeve, 30), fore], {angle: shoulderAngle, pivotX: 0, pivotY: 0, ...(keys ? {keys} : {})});
}
function leg(side, outfit, swing, knee, stance = 0) {
  const shin = G([...tube([[0, 0], [0, 106]], outfit.pants, 29), E(14, 118, 70, 28, {fill: outfit.shoe, stroke: INK, lineWidth: 6})],
    {y: 118, pivotX: 0, pivotY: 0, ...(knee ? {keys: knee} : {})});
  return G([...tube([[0, 0], [0, 118]], outfit.pants, 32), shin], {x: side * 40, y: -248, angle: deg(stance * side), pivotX: 0, pivotY: 0, ...(swing ? {keys: swing} : {})});
}

/**
 * person({who: 'becario'|'granjero'|'civil'|'civil2', x, y, scale, expr, look, armL, armR,
 *         walk:{dur,period,stride}, idle:{dur}, gestures:[...], move: keys for x/y, headTilt, alpha})
 */
/** Talking mouth: an open-mouth shape that flaps while any [t0, t1] span in `talk` is active (shot-local seconds). */
function talkingMouth(talk, dur) {
  // Audio-driven: `talk` = {env: [open 0..1 per frame], fps} → the mouth follows the real voice energy.
  if (talk && talk.env) {
    const fps = talk.fps || 30, keys = [];
    for (let i = 0; i < talk.env.length && i / fps <= dur + 1e-6; i++) { const o = talk.env[i]; keys.push({t: r3(i / fps), alpha: o > 0.06 ? 1 : 0, scaleX: 1, scaleY: r3(0.25 + 0.75 * o)}); }
    if (keys.at(-1).t < dur) keys.push({...keys.at(-1), t: r3(dur)});
    return G([E(0, 0, 54, 40, {fill: '#5a2020', lineWidth: 6}), E(0, 10, 28, 12, {fill: '#e46a6a', stroke: 'none'})], {x: 4, y: -64, pivotX: 0, pivotY: -14, keys});
  }
  const on = t => talk.some(([a, b]) => t >= a && t <= b);
  const keys = []; for (let t = 0; t < dur - 1e-6; t = r3(t + 1 / 15)) keys.push(t); keys.push(r3(dur));
  return G([E(0, 0, 54, 40, {fill: '#5a2020', lineWidth: 6}), E(0, 10, 28, 12, {fill: '#e46a6a', stroke: 'none'})],
    {x: 4, y: -64, pivotX: 0, pivotY: -14, keys: keys.map(t => ({t, alpha: on(t) ? 1 : 0, scaleX: 1, scaleY: on(t) ? r3(0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI * 4.6 + Math.sin(t * 7) * 0.8))) : 0.3}))});
}
export function person({who = 'becario', x = 0, y = 0, scale = 1, expr = 'cansado', look = 0, armL = {}, armR = {}, walk, idle, gestures, poses, move, headTilt = 0, headKeys, alpha, from, to, talk, talkDur} = {}) {
  const o = OUTFITS[who], m = humanMotion({walk, idle, gestures, poses});
  const isFarmer = who === 'granjero';
  const torsoW = o.torsoW ?? (isFarmer ? 190 : 160);
  const torso = [R(-torsoW / 2, -470, torsoW, 236, {radius: isFarmer ? 60 : 46, fill: o.shirt})];
  if (who === 'becario') torso.push(
    P([['M', -42, -470], ['L', 0, -436], ['L', 42, -470]], {lineWidth: 7}),
    G([S([['M', -14, 0], ['L', 14, 0], ['L', 9, 20], ['L', -9, 20], ['Z']], TIE, {lineWidth: 6}), S([['M', -9, 20], ['L', 9, 20], ['L', 20, 118], ['L', 0, 142], ['L', -14, 116], ['Z']], TIE, {lineWidth: 6})],
      {y: -462, angle: deg(14), pivotX: 0, pivotY: 0, keys: walk ? osc(walk.dur, (walk.period || 0.62) / 2, 5, {base: 14}) : undefined}),
    R(28, -404, 40, 50, {radius: 6, lineWidth: 5, fill: '#e8f1ff'}), P([['M', 36, -390], ['L', 60, -390]], {lineWidth: 4, stroke: '#4a78c2'}),
    R(-74, -262, 148, 24, {radius: 6, fill: '#2b2b2b', lineWidth: 6}));
  if (isFarmer) torso.push(
    ...[-50, -10, 30, 70].map(xx => P([['M', xx - 30, -466], ['L', xx - 30, -240]], {stroke: '#8f2a1e', lineWidth: 5})), // plaid
    ...[-430, -380, -330].map(yy => P([['M', -92, yy], ['L', 92, yy]], {stroke: '#8f2a1e', lineWidth: 5})),
    R(-62, -420, 124, 186, {radius: 14, fill: o.pants}), R(-34, -404, 68, 44, {radius: 8, fill: '#5d88cc', lineWidth: 6}), // overall bib + pocket
    P([['M', -52, -420], ['L', -70, -468]], {stroke: o.pants, lineWidth: 18}), P([['M', 52, -420], ['L', 70, -468]], {stroke: o.pants, lineWidth: 18}),
    E(-52, -416, 16, 16, {fill: '#e9c46a', lineWidth: 4}), E(52, -416, 16, 16, {fill: '#e9c46a', lineWidth: 4}));
  if (o.jacket) torso.push(...jacketParts(o, torsoW));
  const f = face(expr, look, isFarmer);
  if (o.cheeks) f.rest.unshift(E(-78, -96, 46, 26, {fill: '#f2a0a0', stroke: 'none'}), E(78, -96, 46, 26, {fill: '#f2a0a0', stroke: 'none'}));
  if (o.stache) f.rest.push(...STACHE[o.stache]());
  if (o.glasses) f.rest.push(E(-50, -135, 62, 58, {fill: 'none', lineWidth: 5}), E(50, -135, 62, 58, {fill: 'none', lineWidth: 5}), P([['M', -19, -138], ['L', 19, -138]], {lineWidth: 5}));
  if (o.monocle) f.rest.push(E(50, -136, 70, 70, {fill: 'rgba(200,230,255,0.25)', stroke: '#e9b93a', lineWidth: 6}), P([['M', 84, -124], ['Q', 108, -40, 80, 10]], {stroke: '#e9b93a', lineWidth: 4}));
  if (o.slick) f.rest.unshift(S([['M', -136, -150], ['Q', -132, -230, -60, -246], ['L', -120, -200], ['Z']], INK, {lineWidth: 4}), S([['M', 136, -150], ['Q', 132, -230, 60, -246], ['L', 120, -200], ['Z']], INK, {lineWidth: 4}));
  const eyesG = G(f.eyes, {pivotX: 0, pivotY: -138, ...(m.blink ? {keys: m.blink} : {})});
  const hair = (isFarmer || o.hat) ? [] : o.bun ? [E(0, -246, 252, 92, {fill: o.bun, lineWidth: 7}), E(0, -306, 104, 92, {fill: o.bun, lineWidth: 7}), P([['M', -30, -300], ['Q', 0, -322, 30, -300]], {stroke: '#7d828b', lineWidth: 5})] : [S([['M', -64, -232], ['L', -44, -284], ['L', -22, -240], ['L', 0, -296], ['L', 20, -242], ['L', 48, -280], ['L', 56, -230], ['Z']], INK, {lineWidth: 6})];
  const hat = isFarmer ? [E(0, -232, 380, 66, {fill: '#e9c46a'}), R(-98, -318, 196, 98, {radius: 34, fill: '#e9c46a'}), P([['M', -96, -248], ['L', 96, -248]], {stroke: '#9c4a1a', lineWidth: 14}),
    ...[-60, -20, 20, 60].map(xx => P([['M', xx, -312], ['L', xx + 8, -256]], {stroke: '#c9a24a', lineWidth: 4}))] : hatOf(o);
  const head = G([...hair, E(0, -130, 272, 250), eyesG, ...f.rest, ...(talk && (talk.length || talk.env) ? [talkingMouth(talk, talkDur ?? idle?.dur ?? walk?.dur)] : []), ...hat],
    {y: -462, angle: deg(headTilt), pivotX: 0, pivotY: 0, ...(headKeys ? {keys: headKeys} : {})});
  const L = G([arm(-1, {shoulder: 8, ...armL, sleeve: o.sleeve}, m, m.armL, m.gL, m.geL, m.pL)], {x: -(torsoW / 2) - 6, y: -446});
  const Rr = G([arm(1, {shoulder: 8, ...armR, sleeve: o.sleeve}, m, m.armR, m.gR, m.geR, m.pR)], {x: torsoW / 2 + 6, y: -446});
  const body = G([L, ...torso, head, Rr], {...(m.bob ? {keys: m.bob} : m.breath ? {keys: m.breath, pivotX: 0, pivotY: -240} : {})});
  const legs = [leg(-1, o, m.legL, m.kneeL, 3), leg(1, o, m.legR, m.kneeR, 3)];
  if (o.tails) legs.unshift(S([['M', -torsoW / 2 + 4, -250], ['Q', -torsoW / 2 - 20, -150, -torsoW / 2 - 6, -96], ['L', -20, -150], ['L', -10, -250], ['Z']], o.shirt, {lineWidth: 7}),
    S([['M', torsoW / 2 - 4, -250], ['Q', torsoW / 2 + 20, -150, torsoW / 2 + 6, -96], ['L', 20, -150], ['L', 10, -250], ['Z']], o.shirt, {lineWidth: 7}));
  return G([...legs, body], {x, y, scaleX: scale, scaleY: scale, ...(move ? {keys: move} : {}), ...(alpha !== undefined ? {alpha} : {}), ...(from !== undefined ? {from} : {}), ...(to !== undefined ? {to} : {})});
}
export const becario = a => person({...a, who: 'becario'});
export const granjero = ({axe, ...a} = {}) => person({...a, who: 'granjero', armR: {...(a.armR || {}), hold: axe ? [axeProp()] : a.armR?.hold}});
export function axeProp() {
  // Handle runs away from the shoulder, so a raised arm lifts the blade overhead.
  return G([R(-9, -30, 18, 270, {radius: 6, fill: '#a0703c', lineWidth: 6}), S([['M', 6, 160], ['L', 92, 140], ['Q', 112, 196, 90, 248], ['L', 6, 228], ['Z']], '#c9ced3', {lineWidth: 7}), P([['M', 78, 150], ['Q', 96, 196, 80, 238]], {stroke: '#ffffff', lineWidth: 4})], {y: 104});
}

// ---------- Mike (Wyandotte rooster) ----------
/**
 * mike({head, walk:{dur,period}, peck, flapAt:[t], move, scale})
 * Origin between the feet. Facing right.
 */
export function mike({x = 0, y = 0, scale = 1, head = false, walk, idle, flapAt = [], move, angle, alpha, from, to} = {}) {
  const CREAM = '#fbf7ec', LACE = '#d9cfbb', GOLD = '#e7a33e', TAILK = '#253226', YEL = '#f0b429';
  const d = walk?.dur ?? idle?.dur ?? 0, p = walk?.period || 0.42;
  const legKeys = s => walk ? osc(d, p, 24, {phase: s > 0 ? 0 : Math.PI}) : undefined;
  const footKeys = s => walk ? osc(d, p, 18, {phase: (s > 0 ? 0 : Math.PI) - Math.PI / 2, base: 6}) : undefined;
  const legG = s => G([
    ...tube([[0, 0], [8, 62]], YEL, 18),
    ...[1, 2, 3].map(i => P([['M', 2 + i * 1.5, 12 + i * 14], ['L', 14 + i * 1.5, 12 + i * 14]], {stroke: '#b9800e', lineWidth: 4})),
    G([P([['M', 0, 0], ['L', 40, 6]], {stroke: YEL, lineWidth: 12}), P([['M', 0, 0], ['L', 30, 20]], {stroke: YEL, lineWidth: 12}), P([['M', 0, 0], ['L', -26, 6]], {stroke: YEL, lineWidth: 12}), P([['M', 0, 0], ['L', 40, 6]], {lineWidth: 3, stroke: '#b9800e'})],
      {x: 8, y: 64, pivotX: 0, pivotY: 0, ...(footKeys(s) ? {keys: footKeys(s)} : {})}),
  ], {x: s * 34, y: -84, pivotX: 0, pivotY: 0, ...(legKeys(s) ? {keys: legKeys(s)} : {})});
  const tail = G([
    S([['M', 0, 0], ['Q', -70, -150, -150, -170], ['Q', -110, -120, -40, 20], ['Z']], TAILK, {lineWidth: 8}),
    S([['M', 0, 10], ['Q', -110, -90, -190, -70], ['Q', -120, -40, -20, 40], ['Z']], '#33503a', {lineWidth: 8}),
    S([['M', 0, 20], ['Q', -100, -20, -170, 20], ['Q', -100, 40, -10, 50], ['Z']], TAILK, {lineWidth: 8}),
    S([['M', 0, 0], ['Q', -50, -90, -100, -100], ['Q', -70, -60, -20, 30], ['Z']], GOLD, {lineWidth: 7}),
  ], {x: -120, y: -200, scaleX: 0.78, scaleY: 0.78, pivotX: 0, pivotY: 30, keys: (walk || idle) ? osc(d, walk ? p : 1.6, walk ? 6 : 3) : undefined});
  const scallops = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 4 - row; i++) {
    const cx = 10 + i * 34 + row * 16, cy = -230 + row * 30 + i * 6;
    scallops.push(P([['M', cx - 14, cy], ['Q', cx, cy + 16, cx + 14, cy]], {stroke: LACE, lineWidth: 5}));
  }
  const wing = G([
    S([['M', -60, -10], ['Q', 10, -60, 90, -20], ['Q', 60, 30, -40, 40], ['Q', -80, 20, -60, -10], ['Z']], '#f1ece0', {lineWidth: 8}),
    P([['M', -30, 34], ['Q', -20, 10, -6, 34], ['Q', 6, 8, 20, 30], ['Q', 34, 6, 46, 24], ['Q', 62, 2, 72, 12]], {lineWidth: 6}),
    P([['M', -40, 0], ['Q', 10, -24, 70, -10]], {stroke: LACE, lineWidth: 5}),
  ], {x: -10, y: -170, pivotX: -40, pivotY: -10, keys: flapAt.length ? flapAt.flatMap(t => [{t: r3(t), angle: 0}, {t: r3(t + 0.12), angle: deg(-35)}, {t: r3(t + 0.24), angle: deg(5)}, {t: r3(t + 0.36), angle: deg(-30)}, {t: r3(t + 0.5), angle: 0}]) : undefined});
  const hackles = S([['M', -48, 40], ['Q', -60, -20, -30, -96], ['Q', 0, -112, 30, -100], ['Q', 62, -30, 56, 42], ['Q', 36, 18, 24, 46], ['Q', 6, 18, -6, 48], ['Q', -26, 18, -48, 40], ['Z']], GOLD, {lineWidth: 8});
  const hackleLines = [-26, -4, 18, 38].map(xx => P([['M', xx, 26], ['Q', xx - 4, -30, xx + 2, -86]], {stroke: '#c07f1e', lineWidth: 4}));
  const top = head ? [
    E(10, -138, 120, 108, {fill: CREAM}),
    S([['M', -34, -184], ['Q', -32, -226, -12, -194], ['Q', -2, -240, 16, -196], ['Q', 30, -238, 40, -192], ['Q', 58, -220, 54, -178], ['Z']], TIE, {lineWidth: 7}),
    S([['M', 62, -144], ['L', 110, -130], ['L', 62, -116], ['Z']], YEL, {lineWidth: 7}),
    S([['M', 52, -108], ['Q', 66, -68, 42, -70], ['Q', 32, -90, 52, -108], ['Z']], TIE, {lineWidth: 6}),
    E(34, -150, 18, 22, {fill: INK, stroke: 'none'}), E(37, -155, 6, 6, {fill: PAPER, stroke: 'none'}),
  ] : [
    E(0, -100, 64, 22, {fill: '#f0d9d2', lineWidth: 7}), // neatly feathered stump, no gore
    P([['M', -24, -108], ['Q', 0, -126, 24, -108]], {stroke: GOLD, lineWidth: 6}),
  ];
  const neck = G([hackles, ...hackleLines, ...top], {x: 100, y: -232, angle: deg(14), pivotX: 0, pivotY: 40,
    keys: walk ? osc(d, p, 9, {phase: Math.PI / 2, base: 14}) : idle ? osc(d, head ? 1.8 : 1.2, head ? 4 : 7, {base: 14}) : undefined});
  const body = G([
    tail,
    E(0, -180, 300, 230, {fill: CREAM}),
    S([['M', 60, -260], ['Q', 150, -230, 140, -150], ['Q', 110, -90, 40, -84], ['Z']], CREAM, {stroke: 'none'}),
    ...scallops,
    wing,
    neck,
  ], {keys: walk ? osc(d, p / 2, 7, {prop: 'y', radians: false, base: -3}) : undefined});
  return G([legG(-1), legG(1), body], {x, y, scaleX: scale, scaleY: scale, ...(angle !== undefined ? {angle, pivotX: 0, pivotY: -100} : {}), ...(move ? {keys: move} : {}), ...(alpha !== undefined ? {alpha} : {}), ...(from !== undefined ? {from} : {}), ...(to !== undefined ? {to} : {})});
}

/** Cardboard archive box with a case label. */
export function archiveBox({x = 0, y = 0, scale = 1, label = 'EXP. 014', keys, lidOpenAt} = {}) {
  return G([
    R(-150, -170, 300, 170, {radius: 8, fill: '#c8955a'}),
    P([['M', -150, -120], ['L', 150, -120]], {stroke: '#a7783f', lineWidth: 5}),
    G([R(-162, -26, 324, 44, {radius: 8, fill: '#d9a86c'})], {y: -170, pivotX: -162, pivotY: 0, ...(lidOpenAt !== undefined ? {keys: [{t: lidOpenAt, angle: 0}, {t: lidOpenAt + 0.35, angle: deg(-70)}]} : {})}),
    R(-70, -110, 140, 56, {radius: 6, lineWidth: 6}),
    ctext(label, 0, -100, 30),
  ], {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {})});
}

// ---------- measured text ----------
import {createCanvas, GlobalFonts} from '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/node_modules/@napi-rs/canvas/index.js';
GlobalFonts.registerFromPath('/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/assets/fonts/NotoSans.ttf', 'KitSans');
const mctx = createCanvas(10, 10).getContext('2d');
export function textWidth(text, size, bold = true) { mctx.font = `${bold ? 700 : 400} ${size}px KitSans`; return mctx.measureText(text).width; }
/** Text centred on cx. With maxW, the size shrinks until the text fits (throws if it cannot). */
export function ctext(text, cx, y, size, o = {}) {
  let s = size;
  if (o.maxW) { while (textWidth(text, s) > o.maxW && s > 14) s -= 2; if (textWidth(text, s) > o.maxW) throw new Error(`Text does not fit: ${text}`); }
  const w = textWidth(text, s), {maxW, ...rest} = o;
  return {type: 'text', text, x: Math.round(cx - w / 2), y, size: s, bold: true, color: INK, w: Math.ceil(w) + 40, ...rest};
}
/** A sign: rounded box with text centred inside, padded; text auto-shrinks to fit. */
export function sign(text, x, y, w, h, {size = 60, fill = PAPER, color = INK, stroke = INK, lineWidth = LW, radius = 16, pad = 28, keys} = {}) {
  const t = ctext(text, x + w / 2, 0, size, {maxW: w - pad * 2, color});
  t.y = Math.round(y + (h - t.size * 1.36) / 2);
  return G([R(x, y, w, h, {radius, fill, stroke, lineWidth}), t], keys ? {keys} : {});
}

// ---------- props for the chop / feeding scenes ----------
export function choppingBlock(x, y, s = 1) {
  return G([R(-110, -150, 220, 150, {radius: 10, fill: '#9a6a3c'}), E(0, -150, 220, 60, {fill: '#d9b07a'}), E(0, -150, 120, 30, {fill: 'none', stroke: '#a7783f', lineWidth: 5}), E(0, -150, 50, 12, {fill: 'none', stroke: '#a7783f', lineWidth: 4}), P([['M', -60, -120], ['L', -50, -20]], {stroke: '#7a5230', lineWidth: 5}), P([['M', 40, -110], ['L', 50, -30]], {stroke: '#7a5230', lineWidth: 5})], {x, y, scaleX: s, scaleY: s});
}
/** Rooster head (cartoon) that can fly off — no gore. */
export function roosterHead(o = {}) {
  return G([E(0, 0, 110, 100, {fill: '#fbf7ec'}), S([['M', -40, -40], ['Q', -38, -80, -18, -50], ['Q', -8, -94, 10, -52], ['Q', 24, -92, 34, -48], ['Q', 52, -76, 48, -34], ['Z']], TIE, {lineWidth: 7}),
    S([['M', 52, -6], ['L', 98, 8], ['L', 52, 22], ['Z']], '#f0b429', {lineWidth: 7}), E(26, -10, 30, 30, {fill: PAPER, lineWidth: 5}), P([['M', 16, -18], ['L', 36, -2]], {lineWidth: 5}), P([['M', 36, -18], ['L', 16, -2]], {lineWidth: 5})], o);
}
/** Feather burst: small feathers fly out from (x,y) at time t and fall. */
export function featherBurst(x, y, t, n = 7, spread = 260, end = Infinity) {
  const tEnd = r3(Math.min(t + 1.3, end));
  return Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.4, dx = Math.cos(a) * spread * (0.6 + (i % 3) * 0.2), dy = -Math.abs(Math.sin(a)) * spread * 0.7;
    return G([S([['M', 0, -24], ['Q', 16, 0, 0, 24], ['Q', -16, 0, 0, -24], ['Z']], '#fbf7ec', {lineWidth: 5}), P([['M', 0, -20], ['L', 0, 22]], {stroke: '#d9cfbb', lineWidth: 3})],
      {x, y, from: t, alpha: 0, keys: [{t, x, y, alpha: 1, angle: 0}, {t: r3(t + 0.35), x: x + dx, y: y + dy, angle: deg(90 + i * 40)}, {t: tEnd, x: x + dx * 1.3, y: y + dy + 260, alpha: 0, angle: deg(200 + i * 30)}]});
  });
}
/** Glass dropper drawn in world-vertical orientation inside a hand-held group; drops fall from its tip. */
export function dropperProp({dropsAt = [], fall = 70, compensate = 0} = {}) {
  return G([
    R(-15, 6, 30, 70, {radius: 10, fill: '#d9f1ff', lineWidth: 7}), P([['M', -6, 76], ['L', 0, 92], ['L', 6, 76]], {lineWidth: 6}),
    E(0, -26, 56, 64, {fill: TIE, lineWidth: 7, keys: dropsAt.flatMap(t => [{t: r3(t - 0.2), scaleX: 1, scaleY: 1}, {t: r3(t - 0.08), scaleX: 0.82, scaleY: 0.82}, {t: r3(t + 0.1), scaleX: 1, scaleY: 1}])}),
    ...dropsAt.map(t => ({...E(0, 100, 20, 28, {fill: '#5fb7ef', lineWidth: 5}), from: r3(t - 0.08), to: r3(t + 0.42), keys: [{t: r3(t - 0.08), scaleX: 0.3, scaleY: 0.3, y: 92}, {t: r3(t), scaleX: 1, scaleY: 1, y: 96}, {t: r3(t + 0.4), y: 96 + fall}]})),
  ], {y: 104, angle: compensate, pivotX: 0, pivotY: 0});
}

export const lustig = a => person({...a, who: 'lustig'});
export const poisson = a => person({...a, who: 'poisson'});
export const gendarme = a => person({...a, who: 'gendarme'});
export const chatarrero = (n, a) => person({...a, who: 'chatarrero' + n});
export function caneProp() { return G([R(-7, -20, 14, 300, {radius: 6, fill: '#1b1d26', lineWidth: 5}), E(0, -24, 34, 34, {fill: '#e9c46a', lineWidth: 5})], {y: 104}); }

// ---------- Eiffel Tower (vector, bronze, two-tone) ----------
const qb = (p0, p1, p2, t) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
/** Base centred at (x, y); ~1540 units tall before scale. */
export function eiffel({x = 0, y = 0, scale = 1, color = '#a8743f', shade = '#7d5229', light = '#d9a364', keys, extra = []} = {}) {
  const parts = [], LAT = {stroke: '#5e3b1c', lineWidth: 4};
  const poly = (pts, fill, lw = 8) => S(pts.map((p, i) => [i ? 'L' : 'M', p[0], p[1]]).concat([['Z']]), fill, {lineWidth: lw});
  const curve = (p0, p1, p2, n = 12) => Array.from({length: n + 1}, (_, i) => qb(p0, p1, p2, i / n));
  // --- legs (base to 1st floor at y -420) ---
  for (const s of [-1, 1]) {
    const outer = curve([s * 400, 0], [s * 280, -180], [s * 228, -420]), inner = curve([s * 262, 0], [s * 190, -200], [s * 118, -420]);
    parts.push(poly([...outer, ...inner.slice().reverse()], s < 0 ? shade : color));
    for (let i = 0; i < 12; i += 2) { const o0 = outer[i], o1 = outer[i + 2], i0 = inner[i], i1 = inner[i + 2];
      parts.push(P([['M', o0[0], o0[1]], ['L', i1[0], i1[1]]], LAT), P([['M', i0[0], i0[1]], ['L', o1[0], o1[1]]], LAT), P([['M', o1[0], o1[1]], ['L', i1[0], i1[1]]], LAT)); }
    parts.push(R(s * 331 - 52, -18, 104, 22, {radius: 4, fill: shade, lineWidth: 7})); // feet
  }
  // decorative arch between the legs
  parts.push(P([['M', -236, -40], ['Q', 0, -470, 236, -40]], {stroke: '#3a2412', lineWidth: 34}), P([['M', -236, -40], ['Q', 0, -470, 236, -40]], {stroke: light, lineWidth: 20}));
  // 1st floor with gallery arches
  parts.push(R(-262, -470, 524, 56, {radius: 6, fill: color, lineWidth: 8}), R(-262, -470, 262, 56, {radius: 6, fill: shade, lineWidth: 8}));
  for (let i = 0; i < 9; i++) parts.push(P([['M', -230 + i * 57, -418], ['Q', -202 + i * 57, -450, -174 + i * 57, -418]], {stroke: light, lineWidth: 5}));
  // --- 2nd section (y -470 to -800) ---
  const l2 = curve([-210, -470], [-150, -640], [-132, -800], 8);
  parts.push(poly([...l2, [0, -800], [0, -470]], shade), poly([...l2.map(p => [-p[0], p[1]]), [0, -800], [0, -470]], color));
  parts.push(S([['M', -122, -470], ['Q', 0, -640, 122, -470], ['Z']], '#bfe3f7', {lineWidth: 6}));
  for (let i = 0; i < 8; i += 2) { const a0 = l2[i], a1 = l2[i + 2];
    parts.push(P([['M', a0[0], a0[1]], ['L', -a1[0], a1[1]]], LAT), P([['M', -a0[0], a0[1]], ['L', a1[0], a1[1]]], LAT), P([['M', a1[0], a1[1]], ['L', -a1[0], a1[1]]], LAT)); }
  parts.push(R(-160, -836, 320, 40, {radius: 6, fill: color, lineWidth: 8}), R(-160, -836, 160, 40, {radius: 6, fill: shade, lineWidth: 8}));
  for (let i = 0; i < 6; i++) parts.push(P([['M', -140 + i * 48, -800], ['Q', -116 + i * 48, -826, -92 + i * 48, -800]], {stroke: light, lineWidth: 4}));
  // --- top section (y -836 to -1370), concave ---
  const l3 = curve([-128, -836], [-58, -1080], [-30, -1370], 10);
  parts.push(poly([...l3, [0, -1370], [0, -836]], shade), poly([...l3.map(p => [-p[0], p[1]]), [0, -1370], [0, -836]], color));
  for (let i = 0; i < 10; i++) { const a0 = l3[i], a1 = l3[i + 1];
    parts.push(P([['M', a0[0], a0[1]], ['L', -a1[0], a1[1]]], LAT), P([['M', -a0[0], a0[1]], ['L', a1[0], a1[1]]], LAT)); }
  // top platform, campanile, antenna, flag
  parts.push(R(-58, -1396, 116, 30, {radius: 4, fill: color, lineWidth: 7}), R(-30, -1470, 60, 76, {radius: 8, fill: color, lineWidth: 7}), R(-30, -1470, 30, 76, {radius: 8, fill: shade, lineWidth: 7}),
    E(0, -1478, 64, 24, {fill: light, lineWidth: 6}), P([['M', 0, -1488], ['L', 0, -1560]], {lineWidth: 8}),
    S([['M', 4, -1556], ['L', 70, -1544], ['L', 4, -1530], ['Z']], '#e0261b', {lineWidth: 5}));
  // highlights on the lit side
  parts.push(P([['M', 300, -40], ['Q', 230, -200, 200, -400]], {stroke: light, lineWidth: 6}), P([['M', 170, -500], ['Q', 130, -650, 118, -790]], {stroke: light, lineWidth: 5}), P([['M', 100, -860], ['Q', 50, -1100, 24, -1350]], {stroke: light, lineWidth: 4}));
  return G([...parts, ...extra], {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {})});
}
/** Case folder "EXPEDIENTE 00X" (manila), centred at (x, y). */
export function caseFolder({x = 0, y = 0, scale = 1, label = 'EXPEDIENTE 001', keys, stamp} = {}) {
  return G([R(-300, -200, 600, 400, {radius: 18, fill: '#e7c27a', lineWidth: 10}), R(-300, -240, 220, 60, {radius: 14, fill: '#e7c27a', lineWidth: 10}),
    R(-220, -150, 440, 80, {radius: 8, fill: PAPER, lineWidth: 6}), ctext(label, 0, -136, 52, {maxW: 400}),
    ...[0, 1, 2].map(i => P([['M', -220, -20 + i * 50], ['L', 220, -20 + i * 50]], {stroke: '#c79a4a', lineWidth: 6})),
    ...(stamp ? [G([R(-190, -60, 380, 120, {radius: 10, fill: 'none', stroke: '#e0261b', lineWidth: 14}), ctext(stamp, 0, -40, 84, {color: '#e0261b', maxW: 340})], {y: 60, angle: deg(-12)})] : [])],
    {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {})});
}
