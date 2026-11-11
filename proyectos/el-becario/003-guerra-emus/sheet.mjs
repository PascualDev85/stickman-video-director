// Hoja de personajes EXP 003: node sheet.mjs -> hoja-personajes-exp003.png (QA barato de kit.mjs)
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/scripts/', import.meta.url).pathname);
const {painter} = await import(R0 + 'autopilot-render.mjs');
const K = await import('../kit.mjs');
const {becario, mayor, soldado, emu, lewisGun, truck, caseFolder, ctext} = K;
const H = 1280 * 1920 / 1080;
const bg = {type: 'rect', x: -20, y: -20, w: 1320, h: H + 40, radius: 0, fill: '#f4efe4', stroke: 'none'};
const lab = (t, x, y) => ctext(t, x, y, 34, {maxW: 300});
const layers = [bg,
  emu({x: 230, y: 760, scale: 0.8}), lab('EMÚ', 230, 790),
  emu({x: 560, y: 760, scale: 0.8, eye: 'grande', lookout: true}), lab('VIGÍA', 560, 790),
  emu({x: 950, y: 760, scale: 0.8, flip: true, run: {dur: 1}}), lab('CORRIENDO', 950, 790),
  mayor({x: 200, y: 1500, scale: 0.7, expr: 'contento', look: 1}), lab('MAYOR', 200, 1530),
  soldado(1, {x: 450, y: 1500, scale: 0.7, expr: 'serio'}), soldado(2, {x: 660, y: 1500, scale: 0.7, expr: 'nervioso'}), lab('SOLDADOS', 555, 1530),
  lewisGun({x: 900, y: 1480, scale: 0.8, firing: [0, 1]}), lab('LEWIS', 960, 1530),
  truck({x: 640, y: 2120, scale: 0.75}), lab('CAMIÓN', 640, 2150),
  becario({x: 1120, y: 2120, scale: 0.55, expr: 'sorpresa', look: -1}),
  caseFolder({x: 1000, y: 200, scale: 0.45, label: 'EXPEDIENTE 003'}),
];
const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
fs.writeFileSync('hoja-personajes-exp003.png', draw(0.02).toBuffer('image/png'));
console.log('ok');
