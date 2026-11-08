import fs from 'node:fs';
const R0 = '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/scripts/';
const {painter} = await import(R0 + 'autopilot-render.mjs');
const {becario, mike, ctext, sign, G, R, S, E, P, deg, PAPER, INK} = await import('../kit.mjs');
const H = 1280 * 1920 / 1080, RED = '#d8352a';
const rays = (c1, c2, cx, cy) => [{type: 'rect', x: -60, y: -60, w: 1400, h: H + 120, radius: 0, fill: c1, stroke: 'none'},
  G(Array.from({length: 14}, (_, i) => S([['M', 0, 0], ['L', Math.cos(deg(i * 360 / 14 - 6)) * 2600, Math.sin(deg(i * 360 / 14 - 6)) * 2600], ['L', Math.cos(deg(i * 360 / 14 + 6)) * 2600, Math.sin(deg(i * 360 / 14 + 6)) * 2600], ['Z']], c2, {stroke: 'none'})), {x: cx, y: cy})];
const label = (text, cx, y, size, color, bg, tilt = 0) => { const t = ctext(text, 0, 0, size, {maxW: 1060, color}); const w = t.w - 40 + 70, h = size * 1.45;
  return G([R(-w / 2, -14, w, h, {radius: 22, fill: bg, lineWidth: 12}), {...t, x: t.x, y: 0}], {x: cx, y, angle: deg(tilt)}); };
const layers = [
  ...rays('#ffd34d', '#ffe7a0', 700, 1250),
  E(640, 1760, 1300, 230, {fill: '#f2b93a', stroke: 'none'}),
  mike({x: 720, y: 1760, scale: 2.25}),
  // motion puffs around the stump: "where did it go?"
  ...[[-150, -40], [0, -95], [150, -40]].map(([dx, dy]) => P([['M', 720 + 124 * 2.25 + dx, 1760 - 380 * 2.25 + dy], ['L', 720 + 124 * 2.25 + dx * 1.35, 1760 - 380 * 2.25 + dy * 1.6]], {lineWidth: 14})),
  becario({x: 175, y: 2330, scale: 1.35, expr: 'sarcastico', look: 1, armR: {shoulder: 60, elbow: 70}}),
  label('18 MESES', 640, 300, 190, INK, PAPER, -3),
  label('SIN CABEZA', 640, 560, 170, PAPER, RED, 2),
  label('HISTORIA REAL', 380, 800, 62, RED, PAPER, -5),
];
const p = {style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]};
const draw = await painter(p);
fs.writeFileSync('miniatura-1080x1920.png', draw(0.1).toBuffer('image/png'));
console.log('ok');
