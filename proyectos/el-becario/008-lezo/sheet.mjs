// Hoja de personajes EXP 008: node sheet.mjs -> hoja.png
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/scripts/', import.meta.url).pathname);
const {painter} = await import(R0 + 'autopilot-render.mjs');
const {lezo, vernon, almirante, casaca, becario, ctext} = await import('../kit.mjs');
const H = 1280 * 1920 / 1080;
const lab = (t, x, y) => ctext(t, x, y, 30, {maxW: 260});
const layers = [{type: 'rect', x: -20, y: -20, w: 1320, h: H + 40, radius: 0, fill: '#f4efe4', stroke: 'none'},
  lezo({x: 220, y: 640, scale: 0.8, expr: 'serio', bust: true}), lab('LEZO', 220, 700),
  vernon({x: 640, y: 640, scale: 0.8, expr: 'contento', bust: true}), lab('VERNON', 640, 700),
  casaca(1, {x: 1030, y: 640, scale: 0.8, expr: 'nervioso', bust: true}), lab('CASACA', 1030, 700),
  almirante({x: 220, y: 1300, scale: 0.8, expr: 'miedo', bust: true}), lab('ALMIRANTE', 220, 1360),
  becario({x: 640, y: 1300, scale: 0.8, expr: 'cansado', bust: true}), lab('BECARIO', 640, 1360)];
const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
fs.writeFileSync('hoja.png', draw(0.25).toBuffer('image/png'));
console.log('ok');
