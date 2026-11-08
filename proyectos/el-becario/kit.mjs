// Character kit for "El Becario" Shorts: pure functions that return declarative
// B3 layer groups (paths, rects, ellipses, groups). Coordinates are design-plane
// units (plane width 1280). Each character's origin is between its feet.
export const INK = '#151515', PAPER = '#ffffff', TIE = '#d8352a', SKIN_SHADOW = '#cfcfcf';
export const LW = 12; // outline weight: thick, hand-drawn look

export const P = (commands, o = {}) => ({type: 'path', commands, fill: 'none', stroke: INK, lineWidth: LW, ...o});
export const E = (cx, cy, w, h, o = {}) => ({type: 'ellipse', x: cx - w / 2, y: cy - h / 2, w, h, fill: PAPER, stroke: INK, lineWidth: LW, ...o});
export const R = (x, y, w, h, o = {}) => ({type: 'rect', x, y, w, h, radius: 18, fill: PAPER, stroke: INK, lineWidth: LW, ...o});
export const G = (children, o = {}) => ({type: 'group', children, ...o});
export const deg = d => d * Math.PI / 180;

/** Arm: shoulder at group origin, hanging down at angle 0; positive angle swings forward/outward. */
function arm({shoulder = 0, elbow = 0, side = 1, hand = 'open', keys} = {}) {
  const fore = G([
    P([['M', 0, 0], ['L', 0, 100]], {lineWidth: 16}),
    E(0, 112, 38, 38, {lineWidth: 9}),
    ...(hand === 'point' ? [P([['M', 0, 125], ['L', side * 6, 160]], {lineWidth: 9})] : []),
  ], {y: 105, angle: deg(elbow * side), pivotX: 0, pivotY: 0});
  return G([P([['M', 0, 0], ['L', 0, 105]], {lineWidth: 16}), fore], {angle: deg(-shoulder * side), pivotX: 0, pivotY: 0, ...(keys ? {keys} : {})});
}

/** Face parts by expression. Head center is (0, -130) inside the head group. */
function face(expr) {
  const eyes = [], extra = [];
  const eye = (x, w = 24, h = 32) => E(x, -135, w, h, {fill: INK, stroke: 'none'});
  const bags = [P([['M', -72, -108], ['Q', -50, -96, -28, -108]], {stroke: '#9a9a9a', lineWidth: 5}), P([['M', 28, -108], ['Q', 50, -96, 72, -108]], {stroke: '#9a9a9a', lineWidth: 5})];
  if (expr === 'sorpresa') {
    eyes.push(E(-50, -138, 44, 50, {lineWidth: 7}), E(50, -138, 44, 50, {lineWidth: 7}), E(-50, -136, 16, 18, {fill: INK, stroke: 'none'}), E(50, -136, 16, 18, {fill: INK, stroke: 'none'}));
    extra.push(P([['M', -78, -186], ['Q', -50, -204, -22, -190]], {lineWidth: 8}), P([['M', 22, -190], ['Q', 50, -204, 78, -186]], {lineWidth: 8}));
    extra.push(E(0, -62, 46, 54, {fill: INK, stroke: 'none'}));
  } else {
    eyes.push(eye(-50), eye(50));
    // Heavy upper lids: the "overworked intern" signature.
    const lid = expr === 'sarcastico' ? [26, 14] : expr === 'agobiado' ? [10, 10] : [20, 20];
    extra.push(R(-66, -158, 34, lid[0], {radius: 4, stroke: 'none'}), R(32, -158, 34, lid[1], {radius: 4, stroke: 'none'}));
    extra.push(P([['M', -68, -158 + lid[0]], ['L', -30, -158 + lid[0]]], {lineWidth: 6}), P([['M', 32, -158 + lid[1]], ['L', 70, -158 + lid[1]]], {lineWidth: 6}));
    extra.push(...bags);
    if (expr === 'sarcastico') {
      extra.push(P([['M', -76, -176], ['L', -26, -172]], {lineWidth: 8}), P([['M', 26, -186], ['Q', 52, -204, 78, -192]], {lineWidth: 8}));
      extra.push(P([['M', -34, -66], ['Q', 4, -62, 40, -80]], {lineWidth: 8}));
    } else if (expr === 'agobiado') {
      extra.push(P([['M', -76, -170], ['L', -28, -180]], {lineWidth: 8}), P([['M', 28, -180], ['L', 76, -170]], {lineWidth: 8}));
      extra.push(P([['M', -38, -66], ['Q', -26, -78, -12, -66], ['Q', 2, -54, 14, -66], ['Q', 26, -78, 38, -66]], {lineWidth: 7}));
      extra.push({type: 'path', commands: [['M', 112, -190], ['Q', 128, -160, 112, -150], ['Q', 96, -160, 112, -190], ['Z']], fill: '#7fc4f0', stroke: INK, lineWidth: 5});
    } else if (expr === 'contento') {
      extra.push(P([['M', -76, -174], ['L', -26, -176]], {lineWidth: 8}), P([['M', 26, -176], ['L', 76, -174]], {lineWidth: 8}));
      extra.push(P([['M', -36, -76], ['Q', 0, -44, 36, -76]], {lineWidth: 8}));
    } else { // cansado / serio
      extra.push(P([['M', -76, -174], ['L', -26, -174]], {lineWidth: 8}), P([['M', 26, -174], ['L', 76, -174]], {lineWidth: 8}));
      extra.push(P([['M', -30, -68], ['L', 30, -72]], {lineWidth: 8}));
    }
  }
  return [...eyes, ...extra];
}

/**
 * El Becario. pose: { armL, armR } with {shoulder, elbow, hand}; expr: cansado | sarcastico |
 * sorpresa | agobiado | contento | serio. headTilt in degrees. scale 1 = ~720 units tall.
 */
export function becario({x = 0, y = 0, scale = 1, expr = 'cansado', armL = {}, armR = {}, headTilt = 0, keys, headKeys, armLKeys, armRKeys, alpha} = {}) {
  const legs = [
    P([['M', -30, -250], ['L', -48, -16]], {lineWidth: 18}), P([['M', 30, -250], ['L', 48, -16]], {lineWidth: 18}),
    E(-58, -8, 64, 26, {fill: INK, stroke: 'none'}), E(58, -8, 64, 26, {fill: INK, stroke: 'none'}),
  ];
  const torso = [
    R(-80, -470, 160, 230, {radius: 46}),
    // crooked red tie: knot + blade, tilted like he dressed in the dark
    G([{type: 'path', commands: [['M', -14, 0], ['L', 14, 0], ['L', 9, 20], ['L', -9, 20], ['Z']], fill: TIE, stroke: INK, lineWidth: 6},
       {type: 'path', commands: [['M', -9, 20], ['L', 9, 20], ['L', 20, 118], ['L', 0, 142], ['L', -14, 116], ['Z']], fill: TIE, stroke: INK, lineWidth: 6}],
      {y: -466, angle: deg(14), pivotX: 0, pivotY: 0}),
    // ID badge
    R(26, -400, 40, 50, {radius: 6, lineWidth: 5, fill: '#e8f1ff'}), P([['M', 34, -386], ['L', 58, -386]], {lineWidth: 4, stroke: '#4a78c2'}),
    P([['M', -40, -470], ['L', 0, -440], ['L', 40, -470]], {lineWidth: 7}), // collar
  ];
  const head = G([
    // messy hair tufts behind the outline
    P([['M', -60, -236], ['L', -40, -280], ['L', -20, -240], ['L', 0, -292], ['L', 18, -242], ['L', 46, -276], ['L', 52, -232]], {lineWidth: 10}),
    E(0, -130, 270, 250),
    ...face(expr),
  ], {y: -458, angle: deg(headTilt), pivotX: 0, pivotY: 0, ...(headKeys ? {keys: headKeys} : {})});
  const left = G([arm({...armL, side: -1, keys: armLKeys})], {x: -74, y: -440});
  const right = G([arm({...armR, side: 1, keys: armRKeys})], {x: 74, y: -440});
  return G([...legs, left, ...torso, head, right], {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {}), ...(alpha !== undefined ? {alpha} : {})});
}

/** Cardboard archive box with a case label. */
export function archiveBox({x = 0, y = 0, scale = 1, label = 'EXP. 014', keys} = {}) {
  return G([
    R(-150, -170, 300, 170, {radius: 8, fill: '#c8955a'}),
    R(-162, -196, 324, 44, {radius: 8, fill: '#d9a86c'}),
    R(-70, -120, 140, 56, {radius: 6, lineWidth: 6}),
    {type: 'text', text: label, x: -58, y: -110, size: 30, bold: true, color: INK},
  ], {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {})});
}

/** Farmer: same drawing grammar, straw hat and overalls. Optional axe in right hand. */
export function granjero({x = 0, y = 0, scale = 1, expr = 'serio', axe = false, armR = {}, armL = {}, armRKeys, keys} = {}) {
  const b = becario({x: 0, y: 0, expr, armL, armR, armRKeys});
  const [l1, l2, s1, s2, left, , tie, badge, badgeLine, collar, head, right] = b.children;
  const overalls = [R(-80, -470, 160, 230, {radius: 46, fill: '#4f78b8'}), R(-50, -440, 100, 80, {radius: 10, fill: '#5d88cc', lineWidth: 7})];
  const hat = G([E(0, -235, 360, 60, {fill: '#e9c46a'}), R(-95, -320, 190, 100, {radius: 30, fill: '#e9c46a'}), P([['M', -92, -250], ['L', 92, -250]], {stroke: '#b5651d', lineWidth: 12})], {});
  head.children.push(hat);
  if (axe) right.children[0].children[1].children.push(G([R(-8, -120, 16, 230, {radius: 6, fill: '#a0703c', lineWidth: 7}), {type: 'path', commands: [['M', 6, -120], ['L', 80, -140], ['L', 70, -60], ['L', 6, -80], ['Z']], fill: '#c9ced3', stroke: INK, lineWidth: 7}], {y: 112}));
  return G([l1, l2, s1, s2, left, ...overalls, head, right], {x, y, scaleX: scale, scaleY: scale, ...(keys ? {keys} : {})});
}

/** Mike: a plump white rooster with no head (a tidy neck stump, no gore). */
export function mike({x = 0, y = 0, scale = 1, keys, head = false, angle} = {}) {
  const top = head ? [
    R(60, -270, 70, 90, {radius: 22}),
    E(110, -300, 110, 100),
    {type: 'path', commands: [['M', 85, -352], ['Q', 95, -390, 110, -350], ['Q', 122, -392, 135, -348], ['Z']], fill: TIE, stroke: INK, lineWidth: 7},
    {type: 'path', commands: [['M', 160, -305], ['L', 200, -292], ['L', 160, -280], ['Z']], fill: '#f2b33d', stroke: INK, lineWidth: 7},
    E(128, -310, 16, 20, {fill: INK, stroke: 'none'}),
  ] : [R(60, -270, 70, 90, {radius: 22}), E(95, -268, 70, 22, {fill: '#f3b9b0', lineWidth: 7})];
  return G([
    P([['M', -30, -60], ['L', -40, 0]], {stroke: '#e0a020', lineWidth: 12}), P([['M', 30, -60], ['L', 40, 0]], {stroke: '#e0a020', lineWidth: 12}),
    P([['M', -40, 0], ['L', -64, 6]], {stroke: '#e0a020', lineWidth: 10}), P([['M', 40, 0], ['L', 64, 6]], {stroke: '#e0a020', lineWidth: 10}),
    // short fan of tail feathers (low, so it never reads as a neck)
    {type: 'path', commands: [['M', -110, -170], ['Q', -190, -230, -200, -170], ['Q', -160, -165, -120, -140], ['Z']], fill: PAPER, stroke: INK, lineWidth: 9},
    {type: 'path', commands: [['M', -115, -150], ['Q', -200, -160, -190, -100], ['Q', -150, -115, -115, -120], ['Z']], fill: '#f1f1f1', stroke: INK, lineWidth: 9},
    E(0, -140, 260, 190),
    // wing
    {type: 'path', commands: [['M', -40, -150], ['Q', 20, -190, 70, -140], ['Q', 20, -110, -40, -150], ['Z']], fill: '#f1f1f1', stroke: INK, lineWidth: 8},
    ...top,
  ], {x, y, scaleX: scale, scaleY: scale, ...(angle !== undefined ? {angle, pivotX: 0, pivotY: -100} : {}), ...(keys ? {keys} : {})});
}

/** Simple flat background helpers. */
export const bg = {
  sky: (h, top = '#bfe3f7') => ({type: 'rect', x: -20, y: -20, w: 1320, h: h + 40, radius: 0, fill: top, stroke: 'none'}),
  ground: (y, color = '#9ccc65') => ({type: 'rect', x: -20, y, w: 1320, h: 2400, radius: 0, fill: color, stroke: 'none'}),
  office: h => G([{type: 'rect', x: -20, y: -20, w: 1320, h: h + 40, radius: 0, fill: '#f2ecdf', stroke: 'none'}, {type: 'rect', x: -20, y: 1500, w: 1320, h: 900, radius: 0, fill: '#d6cbb5', stroke: 'none'}]),
};
