// Hoja de personajes y objetos EXP 007: node sheet.mjs -> hoja-personajes-exp007.png
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../../skills/directing-stickman-videos/scripts/', import.meta.url).pathname);
const {painter} = await import(R0 + 'autopilot-render.mjs');
const {gwonYul, soldadoKr, monje, ashigaru, samurai, coreana, becario, ctext} = await import('../kit.mjs');
const {hwacha, volley, empalizada, nobori, barca, caja, piedra, libro, trapo, haz} = await import('./props.mjs');
const H = 1280 * 1920 / 1080;
const lab = (t, x, y) => ctext(t, x, y, 30, {maxW: 260});
const layers = [{type: 'rect', x: -20, y: -20, w: 1320, h: H + 40, radius: 0, fill: '#f4efe4', stroke: 'none'},
  gwonYul({x: 150, y: 700, scale: 0.6, expr: 'serio'}), lab('GWON YUL', 150, 720),
  soldadoKr(1, {x: 360, y: 700, scale: 0.6, expr: 'nervioso'}), soldadoKr(2, {x: 520, y: 700, scale: 0.6, expr: 'sorpresa'}), lab('SOLDADOS', 440, 720),
  monje(1, {x: 720, y: 700, scale: 0.6, expr: 'contento'}), monje(2, {x: 880, y: 700, scale: 0.6, expr: 'picaro'}), lab('MONJES', 800, 720),
  ashigaru(1, {x: 1080, y: 700, scale: 0.6, expr: 'serio', look: -1}), lab('ASHIGARU', 1080, 720),
  samurai({x: 150, y: 1400, scale: 0.6, expr: 'miedo'}), lab('SAMURÁI', 150, 1420),
  coreana(1, {x: 360, y: 1400, scale: 0.6, expr: 'contento'}), coreana(2, {x: 540, y: 1400, scale: 0.6, expr: 'serio'}), lab('MUJERES', 450, 1420),
  hwacha({x: 900, y: 1400, scale: 0.75, fuse: 0, dur: 1}), lab('HWACHA', 900, 1420),
  empalizada(40, 600, 1700), nobori({x: 700, y: 1750, h: 300}), barca({x: 980, y: 1720, scale: 0.5}),
  caja(true, {x: 200, y: 2100}), caja(false, {x: 560, y: 2100}), piedra({x: 760, y: 2080}), libro(1517, {x: 900, y: 2040, scaleX: 0.5, scaleY: 0.5}), trapo({x: 1150, y: 2040, scaleX: 0.5, scaleY: 0.5}),
  ...volley(700, 300, 0, 1, {n: 10}),
];
const draw = await painter({style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
fs.writeFileSync('hoja-personajes-exp007.png', draw(0.25).toBuffer('image/png'));
console.log('ok');
