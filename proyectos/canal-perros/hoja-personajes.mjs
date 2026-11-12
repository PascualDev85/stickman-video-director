// Hoja de personajes de LayBo: todas las poses base de Layla y Dobby en una sola imagen (para aprobar el kit).
// Uso (desde proyectos/canal-perros/): node hoja-personajes.mjs [salida.png]
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../skills/directing-stickman-videos/', import.meta.url).pathname);
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {createCanvas, GlobalFonts} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath(R0 + 'assets/fonts/NotoSans.ttf', 'Hoja');
const {dog, dogFront, person, fly, ball, stick, wagLines, E, R, P, G} = await import('./kit.mjs');

const PAPEL = '#f6f0e4', SUELO = '#e6dccb', T = 0.5;
const out = process.argv[2] || 'hoja-personajes.png';
const PX = 520; // tamaño de cada viñeta (plano 1280×1280)
async function panel(layers) {
  const draw = await painter({style: 'B3', width: PX, height: PX, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]});
  return draw(T);
}
const bg = (g = 1010) => [R(-40, -40, 1360, 1360, {radius: 0, fill: PAPEL, stroke: 'none'}), R(-40, g, 1360, 400, {radius: 0, fill: SUELO, stroke: 'none'}), P([['M', -40, g], ['L', 1320, g]], {lineWidth: 6, stroke: '#cbbda5'})];
const G0 = 1010;

const panels = [
  ['Tamaños (con humano)', [...bg(), person({who: 'civil', x: 190, y: G0, scale: 1.0, expr: 'contento'}), dog({who: 'layla', x: 520, y: G0, scale: 1.0}), dog({who: 'dobby', x: 930, y: G0, scale: 1.0})]],
  ['LAYLA · reposo (lengua = sonrisa)', [...bg(), dog({who: 'layla', x: 620, y: G0, scale: 1.75, expr: 'reposo'})]],
  ['LAYLA · seria (explica)', [...bg(), dog({who: 'layla', x: 620, y: G0, scale: 1.75, expr: 'seria'})]],
  ['LAYLA · hablando', [...bg(), dog({who: 'layla', x: 620, y: G0, scale: 1.75, expr: 'habla'})]],
  ['LAYLA · sentada de frente', [...bg(), dogFront({who: 'layla', x: 640, y: G0, scale: 1.65, expr: 'reposo'})]],
  ['LAYLA · de reojo a Dobby', [...bg(), dog({who: 'dobby', x: 270, y: G0, scale: 0.95, expr: 'boba'}), dog({who: 'layla', x: 960, y: G0, scale: 1.15, flip: true, expr: 'reojo', look: 1})]],
  ['LAYLA · jugando (pelota)', [...bg(), dog({who: 'layla', x: 600, y: G0, scale: 1.6, pose: 'carrera', expr: 'contenta', tongue: false, prop: ball({x: 108, y: 66, r: 36})})]],
  ['LAYLA · jugando (palo)', [...bg(), dog({who: 'layla', x: 600, y: G0, scale: 1.6, expr: 'contenta', tongue: false, prop: stick({x: 80, y: 66})})]],
  ['LAYLA · cariñosa con su humano', [...bg(), person({who: 'civil', x: 900, y: G0, scale: 1.15, expr: 'contento', armL: {shoulder: 34, elbow: 30}}), dog({who: 'layla', x: 520, y: G0, scale: 1.45, expr: 'carinosa', headAngle: -16}), wagLines(210, G0 - 470, 1.4)]],
  ['DOBBY · lengua fuera (por defecto)', [...bg(), dog({who: 'dobby', x: 600, y: G0, scale: 1.45, expr: 'boba'})]],
  ['DOBBY · sentado, cara de bobo', [...bg(), dogFront({who: 'dobby', x: 640, y: G0, scale: 1.45, expr: 'boba'})]],
  ['DOBBY · sonriendo (de frente)', [...bg(), dogFront({who: 'dobby', x: 640, y: G0, scale: 1.45, expr: 'reposo'})]],
  ['DOBBY · dormido (ronca)', [...bg(), dog({who: 'dobby', x: 620, y: G0, scale: 1.5, pose: 'tumbado', expr: 'dormido', zzz: true, idle: {dur: 3}})]],
  ['DOBBY · panza arriba', [...bg(), dog({who: 'dobby', x: 620, y: G0, scale: 1.4, pose: 'panza', expr: 'boba'})]],
  ['DOBBY · cazando una mosca', [...bg(), dog({who: 'dobby', x: 560, y: G0, scale: 1.3, pose: 'salto', expr: 'caza'}), fly({x: 1010, y: 300, scale: 1.6})]],
  ['DOBBY · besito a Layla (pesado)', [...bg(), dog({who: 'layla', x: 860, y: G0, scale: 1.15, flip: true, expr: 'seria', headAngle: 10}), dog({who: 'dobby', x: 400, y: G0, scale: 1.1, expr: 'carinosa', tongue: true, headAngle: -4})]],
  ['DOBBY · dando la pata (caricias ya)', [...bg(), person({who: 'civil', x: 1000, y: G0, scale: 1.1, expr: 'sorpresa'}), dog({who: 'dobby', x: 480, y: G0, scale: 1.2, pose: 'sentado', expr: 'boba', legs: {fN: [-70, 30]}})]],
  ['DOBBY · asustado (detrás de Layla)', [...bg(), dog({who: 'dobby', x: 420, y: G0, scale: 1.25, pose: 'agachado', expr: 'miedo'}), dog({who: 'layla', x: 800, y: G0, scale: 1.3, expr: 'seria'}), fly({x: 1120, y: 520, scale: 1.3})]],
];

const cols = 6, lab = 46, pad = 8, rows = Math.ceil(panels.length / cols), head = 80;
const sheet = createCanvas(cols * (PX + pad) + pad, head + rows * (PX + lab + pad) + pad), ctx = sheet.getContext('2d');
ctx.fillStyle = '#1d1d1d'; ctx.fillRect(0, 0, sheet.width, sheet.height);
ctx.fillStyle = '#fff'; ctx.font = '700 40px Hoja'; ctx.fillText('LayBo — hoja de personajes v4 (cartoon realista) (Layla y Dobby) · para aprobar', pad + 10, 54);
for (let i = 0; i < panels.length; i++) {
  const [label, layers] = panels[i], x = pad + (i % cols) * (PX + pad), y = head + Math.floor(i / cols) * (PX + lab + pad);
  ctx.drawImage(await panel(layers), x, y, PX, PX);
  ctx.fillStyle = '#fff'; ctx.font = '700 25px Hoja'; ctx.fillText(`${i + 1}. ${label}`, x + 6, y + PX + 33);
}
fs.writeFileSync(out, sheet.toBuffer('image/png'));
console.log(out, sheet.width + 'x' + sheet.height);
