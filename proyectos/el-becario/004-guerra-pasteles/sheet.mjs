// Hoja de personajes EXP 004: node sheet.mjs -> hoja-personajes-exp004.png
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/scripts/', import.meta.url).pathname);
const {painter} = await import(R0 + 'autopilot-render.mjs');
const {becario, santaAnna, remontel, oficialMx, soldadoUS, turba, orador, ctext} = await import('../kit.mjs');
const Pr = await import('./props.mjs');
const H = 1280 * 1920 / 1080;
const bg = {type: 'rect', x: -20, y: -20, w: 1320, h: H + 40, radius: 0, fill: '#f4efe4', stroke: 'none'};
const lab = (t, x, y) => ctext(t, x, y, 30, {maxW: 300});
const layers = [bg,
  santaAnna({x: 170, y: 700, scale: 0.6, expr: 'serio', look: 1}), lab('SANTA ANNA', 170, 720),
  santaAnna({x: 420, y: 700, scale: 0.6, expr: 'agobiado', peg: 'R'}), Pr.muleta({x: 530, y: 500, scaleX: 0.6, scaleY: 0.6}), lab('CON PATA', 420, 720),
  remontel({x: 700, y: 700, scale: 0.6, expr: 'sorpresa'}), lab('REMONTEL', 700, 720),
  oficialMx(1, {x: 920, y: 700, scale: 0.55, expr: 'picaro'}), oficialMx(2, {x: 1120, y: 700, scale: 0.55, expr: 'contento'}), lab('OFICIALES', 1020, 720),
  soldadoUS(1, {x: 150, y: 1300, scale: 0.55, expr: 'serio'}), soldadoUS(2, {x: 330, y: 1300, scale: 0.55, expr: 'contento'}), lab('ILLINOIS', 240, 1320),
  turba(1, {x: 530, y: 1300, scale: 0.5, expr: 'serio'}), turba(2, {x: 680, y: 1300, scale: 0.5, expr: 'serio'}), turba(3, {x: 830, y: 1300, scale: 0.5, expr: 'serio'}), Pr.antorcha({x: 900, y: 950, scaleX: 0.6, scaleY: 0.6}), lab('TURBA', 680, 1320),
  orador({x: 1060, y: 1300, scale: 0.5, expr: 'nervioso'}), Pr.atril({x: 1160, y: 1300, scaleX: 0.5, scaleY: 0.5}), lab('ORADOR', 1080, 1320),
  Pr.pierna({x: 130, y: 1660, scaleX: 0.7, scaleY: 0.7}, {bow: true}), Pr.piernaCorcho({x: 280, y: 1660, scaleX: 0.7, scaleY: 0.7}),
  Pr.pastel({x: 500, y: 1800, scaleX: 0.6, scaleY: 0.6}), Pr.ataud({x: 850, y: 1800, scaleX: 0.6, scaleY: 0.6}), Pr.cojin({x: 1120, y: 1800, scaleX: 0.4, scaleY: 0.4}),
  Pr.barco({x: 260, y: 2230, scaleX: 0.3, scaleY: 0.3}), Pr.canon({x: 560, y: 2180, scaleX: 0.6, scaleY: 0.6}),
  Pr.caballo({x: 760, y: 2230, scaleX: 0.5, scaleY: 0.5}), Pr.carroza({x: 1040, y: 2230, scaleX: 0.4, scaleY: 0.4}),
  Pr.polloAsado({x: 130, y: 1960, scaleX: 0.5, scaleY: 0.5}), Pr.corona({x: 300, y: 1940, scaleX: 0.35, scaleY: 0.35}),
  Pr.pasteleria({x: 1000, y: 380, scaleX: 0.28, scaleY: 0.28}), Pr.vitrina({x: 640, y: 380, scaleX: 0.3, scaleY: 0.3}), Pr.sacoDinero({x: 400, y: 330, scaleX: 0.5, scaleY: 0.5}), Pr.cartel('¡FUERA!', {x: 160, y: 200, scaleX: 0.5, scaleY: 0.5}),
];
const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
fs.writeFileSync('hoja-personajes-exp004.png', draw(0.02).toBuffer('image/png'));
console.log('ok');
