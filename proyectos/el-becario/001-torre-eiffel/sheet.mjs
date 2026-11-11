import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/scripts/', import.meta.url).pathname);
const {painter} = await import(R0 + 'autopilot-render.mjs');
const K = await import('../kit.mjs');
const {becario, lustig, poisson, gendarme, chatarrero, caneProp, eiffel, caseFolder, sign, ctext, R, E, G, deg} = K;
const H = 1280 * 1920 / 1080;
const bg = {type: 'rect', x: -20, y: -20, w: 1320, h: H + 40, radius: 0, fill: '#f4efe4', stroke: 'none'};
const lab = (t, x, y) => ctext(t, x, y, 34, {maxW: 300});
const layers = [bg,
  eiffel({x: 330, y: 1060, scale: 0.62, extra: [G([R(-210, -60, 420, 120, {radius: 10, fill: '#ffd21f', lineWidth: 9}), ctext('SE VENDE', 0, -44, 78, {maxW: 380, color: '#e0261b'})], {y: -520, angle: deg(-6)})]}),
  lab('TORRE EIFFEL', 330, 1090),
  lustig({x: 760, y: 1060, scale: 0.78, expr: 'picaro', look: -1, armR: {shoulder: 20, elbow: 10, hold: [caneProp()]}}), lab('LUSTIG', 760, 1090),
  poisson({x: 1080, y: 1080, scale: 0.7, expr: 'nervioso', look: -1}), lab('POISSON', 1080, 1090),
  caseFolder({x: 920, y: 330, scale: 0.55}),
  becario({x: 160, y: 1980, scale: 0.7, expr: 'sarcastico', look: 1}), lab('BECARIO', 160, 2010),
  chatarrero(1, {x: 400, y: 1980, scale: 0.7, expr: 'contento'}), chatarrero(2, {x: 620, y: 1980, scale: 0.7, expr: 'sorpresa'}), chatarrero(3, {x: 840, y: 1980, scale: 0.7, expr: 'serio'}), lab('CHATARREROS', 620, 2010),
  gendarme({x: 1100, y: 1980, scale: 0.7, expr: 'serio', look: -1}), lab('GENDARME', 1100, 2010),
];
const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
fs.writeFileSync('hoja-personajes-exp001.png', draw(0.1).toBuffer('image/png'));
console.log('ok');
